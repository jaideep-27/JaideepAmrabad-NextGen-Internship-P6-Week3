import React, { useState, useContext } from 'react';
import '../styles/user-profile.css';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [selectedTab, setSelectedTab] = useState('bookings');
    
    const { data: bookings } = useFetch(`${BASE_URL}/booking/user/${user?._id}`);

    return (
        <div className="profile__container">
            <div className="profile__header">
                <h2>User Profile</h2>
            </div>
            <div className="profile__content">
                <div className="profile__sidebar">
                    <div className="profile__info">
                        <h3>{user?.username}</h3>
                        <p>{user?.email}</p>
                    </div>
                    <div className="profile__tabs">
                        <button 
                            className={`tab__btn ${selectedTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('bookings')}
                        >
                            My Bookings
                        </button>
                        <button 
                            className={`tab__btn ${selectedTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('settings')}
                        >
                            Settings
                        </button>
                    </div>
                </div>
                <div className="profile__main">
                    {selectedTab === 'bookings' && (
                        <div className="bookings__list">
                            <h3>My Bookings</h3>
                            {bookings?.length > 0 ? (
                                bookings.map((booking) => (
                                    <div key={booking._id} className="booking__card">
                                        <h4>{booking.tourName}</h4>
                                        <p>Date: {new Date(booking.bookAt).toLocaleDateString()}</p>
                                        <p>Guest Size: {booking.guestSize}</p>
                                        <p>Status: {booking.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No bookings found.</p>
                            )}
                        </div>
                    )}
                    {selectedTab === 'settings' && (
                        <div className="settings__content">
                            <h3>Account Settings</h3>
                            <div className="settings__form">
                                <p>Profile settings coming soon...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
