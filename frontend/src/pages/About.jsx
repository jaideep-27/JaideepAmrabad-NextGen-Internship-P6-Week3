import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import '../styles/about.css';

const About = () => {
    return (
        <section className="about__section">
            <Container>
                <Row>
                    <Col lg="12">
                        <div className="about__content">
                            <h2 className="about__title">About Our Travel Agency</h2>
                            <p className="about__desc">
                                Welcome to our travel agency! We are passionate about creating unforgettable 
                                travel experiences and helping our customers explore the world's most beautiful 
                                destinations.
                            </p>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col lg="4" md="6" className="mb-4">
                        <Card className="about__card">
                            <div className="about__card-content">
                                <i className="ri-map-pin-line"></i>
                                <h3>Curated Destinations</h3>
                                <p>
                                    We carefully select and verify all our destinations to ensure 
                                    the best experience for our travelers.
                                </p>
                            </div>
                        </Card>
                    </Col>
                    <Col lg="4" md="6" className="mb-4">
                        <Card className="about__card">
                            <div className="about__card-content">
                                <i className="ri-customer-service-line"></i>
                                <h3>24/7 Support</h3>
                                <p>
                                    Our dedicated support team is always available to assist you 
                                    before, during, and after your journey.
                                </p>
                            </div>
                        </Card>
                    </Col>
                    <Col lg="4" md="6" className="mb-4">
                        <Card className="about__card">
                            <div className="about__card-content">
                                <i className="ri-shield-check-line"></i>
                                <h3>Safe Travel</h3>
                                <p>
                                    Your safety is our top priority. We follow strict safety guidelines 
                                    and work with trusted partners.
                                </p>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col lg="6">
                        <div className="about__image">
                            <img 
                                src="https://via.placeholder.com/600x400" 
                                alt="About Us" 
                                className="img-fluid rounded shadow"
                            />
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="about__experience">
                            <h3>Our Experience</h3>
                            <p>
                                With over 10 years of experience in the travel industry, we have helped 
                                thousands of travelers create lasting memories. Our team of expert travel 
                                consultants is dedicated to providing personalized service and creating 
                                tailored itineraries that match your preferences and budget.
                            </p>
                            <div className="counter__wrapper">
                                <div className="counter__box">
                                    <span>12k+</span>
                                    <h6>Successful Trips</h6>
                                </div>
                                <div className="counter__box">
                                    <span>2k+</span>
                                    <h6>Regular Clients</h6>
                                </div>
                                <div className="counter__box">
                                    <span>15</span>
                                    <h6>Years Experience</h6>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg="12">
                        <div className="about__mission">
                            <h3>Our Mission</h3>
                            <p>
                                Our mission is to make world travel accessible to everyone by providing 
                                affordable, high-quality travel experiences. We believe that travel 
                                broadens horizons, creates connections, and enriches lives. Through our 
                                services, we aim to inspire people to explore new places, experience 
                                different cultures, and create lasting memories.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default About;
