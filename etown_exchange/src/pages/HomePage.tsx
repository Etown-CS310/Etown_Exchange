import React from 'react';
import ListingCard from '../components/ListingCard';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
     // Placeholder data
    const dummyListings = [
        { id: 1, title: 'Textbook - Calculus', price: '$50' },
        { id: 2, title: 'Bike', price: '$100' },
        { id: 3, title: 'Laptop Stand', price: '$25' },
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
                    />
                    ))}
                </div>
            </div>
    );
}

export default HomePage;