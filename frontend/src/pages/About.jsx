import React from 'react';
import { Container, Row, Col, Card } from 'reactstrap';
import '../styles/about.css';
import aboutImg from '../assets/images/about.png';

const About = () => {
    return (
        <main>
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
                                    <h3>Secure Booking</h3>
                                    <p>
                                        Book with confidence knowing that your personal information 
                                        and transactions are protected.
                                    </p>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-5">
                        <Col lg="6">
                            <div className="about__experience">
                                <h3>Our Experience</h3>
                                <p>
                                    With over 10 years of experience in the travel industry, we have helped 
                                    thousands of travelers create lasting memories. Our team of expert travel 
                                    consultants is dedicated to providing personalized service and creating 
                                    tailored itineraries that match your preferences and budget.
                                </p>
                                <div className="counter__wrapper d-flex align-items-center gap-5">
                                    <div className="counter__box">
                                        <span>12k+</span>
                                        <h6>Successful Trips</h6>
                                    </div>
                                    <div className="counter__box">
                                        <span>2k+</span>
                                        <h6>Regular Clients</h6>
                                    </div>
                                    <div className="counter__box">
                                        <span>10</span>
                                        <h6>Years Experience</h6>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="about__img">
                                <img src={aboutImg} alt="About Us" className="w-100 rounded shadow" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
};

export default About;
