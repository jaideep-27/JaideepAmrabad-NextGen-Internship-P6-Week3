export const handler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Hello from Netlify Functions!",
        env: process.env.NODE_ENV
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
