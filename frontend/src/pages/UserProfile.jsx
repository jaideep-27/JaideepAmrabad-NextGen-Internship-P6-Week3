import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'reactstrap';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import '../styles/user-profile.css';
import useFetch from '../hooks/useFetch';

const UserProfile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        photo: user?.photo || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch user's bookings
    const { data: userBookings } = useFetch(`${BASE_URL}/booking/user/${user?._id}`);

    const handleChange = e => {
        setProfileData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handlePhotoChange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    photo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validatePasswordChange = () => {
        if (profileData.newPassword !== profileData.confirmPassword) {
            setError('New passwords do not match');
            return false;
        }
        if (profileData.newPassword && profileData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (profileData.newPassword && !validatePasswordChange()) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            dispatch({ type: 'UPDATE_USER', payload: result.data });
            setSuccess('Profile updated successfully');
            
            // Clear password fields
            setProfileData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='profile-section'>
            <Container>
                <Row>
                    <Col md={4}>
                        <Card className='profile-card'>
                            <div className='profile-photo-container'>
                                <img 
                                    src={profileData.photo || '/avatar.jpg'} 
                                    alt='profile' 
                                    className='profile-photo'
                                />
                                <div className='photo-upload'>
                                    <input 
                                        type='file' 
                                        id='photo' 
                                        accept='image/*'
                                        onChange={handlePhotoChange}
                                        className='photo-input'
                                    />
                                    <label htmlFor='photo'>Change Photo</label>
                                </div>
                            </div>
                            <div className='profile-info'>
                                <h3>{user?.username}</h3>
                                <p>{user?.email}</p>
                            </div>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <Card className='profile-details'>
                            <h4>Profile Settings</h4>
                            {error && <div className='alert alert-danger'>{error}</div>}
                            {success && <div className='alert alert-success'>{success}</div>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type='text'
                                                id='username'
                                                value={profileData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type='email'
                                                id='email'
                                                value={profileData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group>
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type='tel'
                                        id='phone'
                                        value={profileData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <h5 className='mt-4'>Change Password</h5>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Current Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                id='currentPassword'
                                                value={profileData.currentPassword}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                id='newPassword'
                                                value={profileData.newPassword}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Confirm New Password</Form.Label>
                                            <Form.Control
                                                type='password'
                                                id='confirmPassword'
                                                value={profileData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button 
                                    type='submit' 
                                    className='update-btn mt-4'
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </Form>
                        </Card>

                        <Card className='booking-history mt-4'>
                            <h4>Booking History</h4>
                            <ListGroup>
                                {userBookings?.data?.map(booking => (
                                    <ListGroup.Item key={booking._id} className='booking-item'>
                                        <div className='booking-info'>
                                            <h5>{booking.tourName}</h5>
                                            <p>Date: {new Date(booking.bookAt).toLocaleDateString()}</p>
                                            <p>Guests: {booking.guestSize}</p>
                                            <span className={`status status-${booking.status?.toLowerCase()}`}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default UserProfile;
