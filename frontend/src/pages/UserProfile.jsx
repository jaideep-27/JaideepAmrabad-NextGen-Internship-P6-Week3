import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'reactstrap';
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
    const { data: userBookings, loading: bookingsLoading } = useFetch(`${BASE_URL}/booking/user/${user?._id}`);

    const handleChange = e => {
        setProfileData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handlePhotoChange = e => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
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
        <section className='profile__section'>
            <Container>
                <Row>
                    <Col lg='8' className='m-auto'>
                        <Card className='profile__card'>
                            <div className='profile__header'>
                                <h2>Profile Settings</h2>
                            </div>
                            {error && <Alert color='danger'>{error}</Alert>}
                            {success && <Alert color='success'>{success}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <div className='profile__photo'>
                                    <img 
                                        src={profileData.photo || 'https://via.placeholder.com/150'} 
                                        alt='Profile' 
                                        className='profile__image'
                                    />
                                    <div className='photo__upload'>
                                        <input
                                            type='file'
                                            id='photo'
                                            accept='image/*'
                                            onChange={handlePhotoChange}
                                            className='photo__input'
                                        />
                                        <label htmlFor='photo' className='photo__label'>
                                            <i className='ri-camera-line'></i>
                                        </label>
                                    </div>
                                </div>

                                <div className='form__group'>
                                    <label>Username</label>
                                    <input
                                        type='text'
                                        id='username'
                                        value={profileData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='form__group'>
                                    <label>Email</label>
                                    <input
                                        type='email'
                                        id='email'
                                        value={profileData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='form__group'>
                                    <label>Phone</label>
                                    <input
                                        type='tel'
                                        id='phone'
                                        value={profileData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='password__section'>
                                    <h3>Change Password</h3>
                                    <div className='form__group'>
                                        <label>Current Password</label>
                                        <input
                                            type='password'
                                            id='currentPassword'
                                            value={profileData.currentPassword}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className='form__group'>
                                        <label>New Password</label>
                                        <input
                                            type='password'
                                            id='newPassword'
                                            value={profileData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className='form__group'>
                                        <label>Confirm New Password</label>
                                        <input
                                            type='password'
                                            id='confirmPassword'
                                            value={profileData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type='submit' 
                                    className='update__btn'
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </Form>
                        </Card>

                        {userBookings && userBookings.length > 0 && (
                            <Card className='bookings__card mt-4'>
                                <div className='bookings__header'>
                                    <h3>My Bookings</h3>
                                </div>
                                <div className='bookings__list'>
                                    {userBookings.map((booking, index) => (
                                        <div key={index} className='booking__item'>
                                            <div className='booking__info'>
                                                <h4>{booking.tourName}</h4>
                                                <p>Date: {new Date(booking.bookAt).toLocaleDateString()}</p>
                                                <p>Guests: {booking.guestSize}</p>
                                                <p>Status: <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
                                            </div>
                                            <div className='booking__price'>
                                                <h4>${booking.totalAmount}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default UserProfile;
