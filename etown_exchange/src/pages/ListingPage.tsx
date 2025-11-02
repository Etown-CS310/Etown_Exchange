import React from 'react';
import ListingCard from '../components/ListingCard';
import '../styles/ListingPage.css';

const ListingPage: React.FC = () => {
     // Placeholder data
    const dummyListings = [
        { id: 1, title: "Used Textbook", price: "$20", desc: "Lightly used Calculus book." },
        { id: 2, title: "Dorm Fridge", price: "$45", desc: "Mini fridge in great condition." },
        { id: 3, title: "Desk Lamp", price: "$10", desc: "LED lamp, barely used." },
    ];

    return(
        <div className="home-container">
            <h1 className="home-title">Welcome to Etown Exchange!</h1>
            <div className="listing-grid">
                {dummyListings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        title={listing.title}
                        price={listing.price}
                        desc={listing.desc}
                    />
                    ))}
                </div>
            </div>
    );
}

export default ListingPage;