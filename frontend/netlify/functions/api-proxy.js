import fetch from 'node-fetch';

export const handler = async (event, context) => {
  const { path, httpMethod, body, headers } = event;
  const apiUrl = process.env.BACKEND_URL || process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? body : null,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
