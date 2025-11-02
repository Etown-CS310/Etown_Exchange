import React from 'react';
import Navbar from '../components/Navbar';
import ListingCard from '../components/ListingCard';

const HomePage: React.FC = () => {

    // Temporary sample listings
    const listings = [
    { id: 1, title: "Used Textbook", price: "$20", desc: "Lightly used Calculus book." },
    { id: 2, title: "Dorm Fridge", price: "$45", desc: "Mini fridge in great condition." },
    { id: 3, title: "Desk Lamp", price: "$10", desc: "LED lamp, barely used." },
    ];

    return(
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar/>

            <section className="text-center py-20 bg-schoolBlue text-white">
                <h1 className="text-4xl font-bold mb-3"> Welcome to Etown Exchange</h1>
                <p className="text-lg text-gray-200 max-w-xl mx-auto">
                    Buy, sell, and trade items within the Elizabethtown College community.
                </p>
            </section>

            {/* Listings Section */}
            <section className="p-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {listings.map((item) => (
                    <ListingCard key={item.id} title={item.title} price={item.price} desc={item.desc} />
                ))}
            </section>
        </div>
    )

}

export default HomePage;