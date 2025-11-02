import React from 'react';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';
import '../styles/Homepage.css';

const HomePage: React.FC = () => {

    const listings = [
        { id: 1, title: "Used Textbook", price: "$20", desc: "Lightly used Calculus book." },
        { id: 2, title: "Dorm Fridge", price: "$45", desc: "Mini fridge in great condition." },
        { id: 3, title: "Desk Lamp", price: "$10", desc: "LED lamp, barely used." },
    ];

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to Etown Exchange</h1>
                <p>
                    Buy, sell, and trade items within the Elizabethtown College community.
                </p>
            </section>

            {/* Listings Section */}
            <section className="listings">
                {listings.map((item) => (
                    <ListingCard
                        key={item.id}
                        title={item.title}
                        price={item.price}
                        desc={item.desc}
                    />
                ))}
            </section>
        </div>
    );
};

export default HomePage;
