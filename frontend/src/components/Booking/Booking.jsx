import React, { useState, useContext } from 'react'
import './booking.css'
import { Button, Form, FormGroup, ListGroup, ListGroupItem } from 'reactstrap'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const Booking = ({ tour, avgRating }) => {
    const { price, reviews, title, maxGroupSize } = tour;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [booking, setBooking] = useState({
        userId: user?._id,
        userEmail: user?.email,
        tourName: title,
        fullName: '',
        phone: '',
        guestSize: 1,
        bookAt: ''
    });

    const handleChange = e => {
        const value = e.target.value;
        if (e.target.id === 'guestSize') {
            // Ensure guest size doesn't exceed maxGroupSize
            if (value > maxGroupSize) {
                setError(`Maximum group size is ${maxGroupSize}`);
                return;
            }
            if (value < 1) {
                setError('Minimum group size is 1');
                return;
            }
        }
        setError('');
        setBooking(prev => ({ ...prev, [e.target.id]: value }));
    };

    const serviceFee = 10;
    const totalCost = Number(price) * Number(booking.guestSize) + Number(serviceFee);

    const validateForm = () => {
        if (!booking.fullName.trim()) return 'Please enter your full name';
        if (!booking.phone.trim()) return 'Please enter your phone number';
        if (!booking.bookAt) return 'Please select a booking date';
        if (booking.phone.length < 10) return 'Please enter a valid phone number';
        if (new Date(booking.bookAt) < new Date()) return 'Please select a future date';
        return null;
    };

    const handleClick = async e => {
        e.preventDefault();

        if (!user) {
            alert('Please sign in to book a tour');
            navigate('/login');
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(booking)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            navigate('/thank-you');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='booking'>
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>${price} <span>/per person</span></h3>
                <span className="tour__rating d-flex align-items-center">
                    <i className="ri-star-fill"></i>
                    {avgRating === 0 ? null : avgRating} ({reviews?.length})
                </span>
            </div>

            <div className="booking__form">
                <h5>Information</h5>
                <Form className='booking__info-form' onSubmit={handleClick}>
                    <FormGroup>
                        <input
                            type="text"
                            placeholder='Full Name'
                            id="fullName"
                            required
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <input
                            type="tel"
                            placeholder='Phone'
                            id="phone"
                            required
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup className='d-flex align-items-center gap-3'>
                        <input
                            type="date"
                            placeholder=''
                            id="bookAt"
                            required
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <input
                            type="number"
                            placeholder='Guest'
                            id="guestSize"
                            required
                            onChange={handleChange}
                            min={1}
                            max={maxGroupSize}
                        />
                    </FormGroup>
                </Form>
            </div>

            <div className="booking__bottom">
                <ListGroup>
                    <ListGroupItem className='border-0 px-0'>
                        <h5 className='d-flex align-items-center gap-1'>
                            ${price} x {booking.guestSize} person
                        </h5>
                        <span>${price * booking.guestSize}</span>
                    </ListGroupItem>
                    <ListGroupItem className='border-0 px-0'>
                        <h5>Service charge</h5>
                        <span>${serviceFee}</span>
                    </ListGroupItem>
                    <ListGroupItem className='border-0 px-0 total'>
                        <h5>Total</h5>
                        <span>${totalCost}</span>
                    </ListGroupItem>
                </ListGroup>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

                <Button
                    className='btn primary__btn w-100 mt-4'
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? 'Booking...' : 'Book Now'}
                </Button>
            </div>
        </div>
    );
};

export default Booking
