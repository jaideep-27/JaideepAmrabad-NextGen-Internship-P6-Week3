import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Form, Card, Dropdown } from 'reactstrap';
import { useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import './reviews.css';

const Reviews = () => {
    const { id: tourId } = useParams();
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showReplyForm, setShowReplyForm] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [newReview, setNewReview] = useState({
        rating: 0,
        reviewText: '',
        photos: []
    });
    const [sortBy, setSortBy] = useState('-createdAt');
    const [filterRating, setFilterRating] = useState('all');
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
    });

    // Fetch reviews
    const fetchReviews = async (page = 1) => {
        try {
            const ratingFilter = filterRating !== 'all' ? `&rating=${filterRating}` : '';
            const res = await fetch(
                `${BASE_URL}/reviews/tour/${tourId}?page=${page}&limit=5&sort=${sortBy}${ratingFilter}`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setReviews(result.data);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch review statistics
    const fetchReviewStats = async () => {
        try {
            const res = await fetch(`${BASE_URL}/reviews/stats/${tourId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setStats(result.data);
        } catch (err) {
            console.error('Failed to fetch review stats:', err);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchReviewStats();
    }, [tourId, sortBy, filterRating]);

    // Submit new review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/reviews/${tourId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newReview)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setNewReview({ rating: 0, reviewText: '', photos: [] });
            fetchReviews();
        } catch (err) {
            setError(err.message);
        }
    };

    // Toggle like
    const handleLike = async (reviewId) => {
        try {
            const res = await fetch(`${BASE_URL}/reviews/${reviewId}/like`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setReviews(reviews.map(review => 
                review._id === reviewId ? result.data : review
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    // Submit reply
    const handleSubmitReply = async (reviewId) => {
        try {
            const res = await fetch(`${BASE_URL}/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text: replyText })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setReviews(reviews.map(review => 
                review._id === reviewId ? result.data : review
            ));
            setShowReplyForm(null);
            setReplyText('');
        } catch (err) {
            setError(err.message);
        }
    };

    // Report review
    const handleReport = async (reviewId) => {
        try {
            const res = await fetch(`${BASE_URL}/reviews/${reviewId}/report`, {
                method: 'POST',
                credentials: 'include'
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message);
            }

            setReviews(reviews.filter(review => review._id !== reviewId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <section className="reviews__section">
            <Container>
                {/* Review Statistics */}
                <Row className="mb-4">
                    <Col>
                        <Card className="stats-card">
                            <div className="rating-overview">
                                <div className="average-rating">
                                    <h2>{stats.averageRating.toFixed(1)}</h2>
                                    <StarRatings
                                        rating={stats.averageRating}
                                        starRatedColor="#faa935"
                                        numberOfStars={5}
                                        starDimension="20px"
                                        starSpacing="2px"
                                    />
                                    <p>{stats.totalReviews} reviews</p>
                                </div>
                                <div className="rating-bars">
                                    {Object.entries(stats.ratingDistribution)
                                        .reverse()
                                        .map(([rating, count]) => (
                                            <div key={rating} className="rating-bar">
                                                <span>{rating} star</span>
                                                <div className="progress">
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${(count / stats.totalReviews) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span>{count}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Sort and Filter Controls */}
                <Row className="mb-4">
                    <Col xs="12" md="6" className="mb-2">
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-primary">
                                Sort by: {sortBy === '-createdAt' ? 'Newest' : 
                                         sortBy === 'createdAt' ? 'Oldest' :
                                         sortBy === '-rating' ? 'Highest Rating' :
                                         'Lowest Rating'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSortBy('-createdAt')}>
                                    Newest First
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSortBy('createdAt')}>
                                    Oldest First
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSortBy('-rating')}>
                                    Highest Rating
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSortBy('rating')}>
                                    Lowest Rating
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs="12" md="6">
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-primary">
                                Filter by: {filterRating === 'all' ? 'All Ratings' : `${filterRating} Stars`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setFilterRating('all')}>
                                    All Ratings
                                </Dropdown.Item>
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <Dropdown.Item 
                                        key={rating}
                                        onClick={() => setFilterRating(rating)}
                                    >
                                        {rating} Stars
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                {user && (
                    <Row className="mb-4">
                        <Col>
                            <Card className="review-form-card">
                                <h4>Write a Review</h4>
                                <Form onSubmit={handleSubmitReview}>
                                    <div className="mb-3">
                                        <StarRatings
                                            rating={newReview.rating}
                                            starRatedColor="#faa935"
                                            starHoverColor="#faa935"
                                            changeRating={(rating) => 
                                                setNewReview(prev => ({ ...prev, rating }))
                                            }
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="25px"
                                            starSpacing="2px"
                                        />
                                    </div>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Share your experience..."
                                            value={newReview.reviewText}
                                            onChange={(e) => 
                                                setNewReview(prev => ({
                                                    ...prev,
                                                    reviewText: e.target.value
                                                }))
                                            }
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                Promise.all(
                                                    files.map(file => {
                                                        return new Promise((resolve) => {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => resolve(reader.result);
                                                            reader.readAsDataURL(file);
                                                        });
                                                    })
                                                ).then(photos => {
                                                    setNewReview(prev => ({
                                                        ...prev,
                                                        photos
                                                    }));
                                                });
                                            }}
                                        />
                                    </Form.Group>
                                    <Button type="submit" color="primary">
                                        Submit Review
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col>
                        {reviews.map(review => (
                            <Card key={review._id} className="review-card mb-3">
                                <div className="review-header">
                                    <div className="user-info">
                                        <img 
                                            src={review.user.photo || '/avatar.jpg'} 
                                            alt={review.user.username}
                                            className="user-avatar"
                                        />
                                        <div>
                                            <h5>{review.user.username}</h5>
                                            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                    <StarRatings
                                        rating={review.rating}
                                        starRatedColor="#faa935"
                                        numberOfStars={5}
                                        starDimension="20px"
                                        starSpacing="2px"
                                    />
                                </div>

                                <div className="review-content">
                                    <p>{review.reviewText}</p>
                                    {review.photos?.length > 0 && (
                                        <div className="review-photos">
                                            {review.photos.map((photo, index) => (
                                                <img 
                                                    key={index}
                                                    src={photo}
                                                    alt={`Review photo ${index + 1}`}
                                                    className="review-photo"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="review-actions">
                                    {user && (
                                        <>
                                            <Button
                                                color="link"
                                                onClick={() => handleLike(review._id)}
                                            >
                                                <i className={`ri-thumb-up-${
                                                    review.likes.includes(user._id) ? 'fill' : 'line'
                                                }`}></i>
                                                {review.likes.length}
                                            </Button>
                                            <Button
                                                color="link"
                                                onClick={() => setShowReplyForm(review._id)}
                                            >
                                                <i className="ri-reply-line"></i> Reply
                                            </Button>
                                            <Button
                                                color="link"
                                                onClick={() => handleReport(review._id)}
                                            >
                                                <i className="ri-flag-line"></i> Report
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {review.replies?.length > 0 && (
                                    <div className="review-replies">
                                        {review.replies.map((reply, index) => (
                                            <div key={index} className="reply">
                                                <div className="user-info">
                                                    <img 
                                                        src={reply.user.photo || '/avatar.jpg'} 
                                                        alt={reply.user.username}
                                                        className="user-avatar-small"
                                                    />
                                                    <div>
                                                        <h6>{reply.user.username}</h6>
                                                        <small>{new Date(reply.createdAt).toLocaleDateString()}</small>
                                                    </div>
                                                </div>
                                                <p>{reply.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showReplyForm === review._id && (
                                    <Form className="reply-form">
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="Write a reply..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                        </Form.Group>
                                        <Button
                                            color="primary"
                                            size="sm"
                                            onClick={() => handleSubmitReply(review._id)}
                                            disabled={!replyText.trim()}
                                        >
                                            Send
                                        </Button>
                                        <Button
                                            color="secondary"
                                            size="sm"
                                            onClick={() => {
                                                setShowReplyForm(null);
                                                setReplyText('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Form>
                                )}
                            </Card>
                        ))}

                        {totalPages > 1 && (
                            <div className="pagination">
                                <Button
                                    color="primary"
                                    outline
                                    disabled={currentPage === 1}
                                    onClick={() => fetchReviews(currentPage - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="mx-3">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    color="primary"
                                    outline
                                    disabled={currentPage === totalPages}
                                    onClick={() => fetchReviews(currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Reviews;
