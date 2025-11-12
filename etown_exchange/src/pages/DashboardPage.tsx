import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import './styles/DashboardPage.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface Listing {
    id: string;
    title: string;
    price: string;
    description: string;
    image?: string;
    condition?: string;
    category?: string;
    seller?: string;
    userId: string;
    createdAt: any;
}

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // fetch listing from firestore
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, 'listings');
                const q = query(listingsRef, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const fetchedListings: Listing[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedListings.push({
                        id: doc.id,
                        ...doc.data()
                    } as Listing);
                });
                
                setListings(fetchedListings);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);
    

    return (
        <div className="dashboard-page">
            {/* Navbar Component */}
            <Navbar />

            {/* Main Content */}
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Browse Listings</h1>
                    <p>Find great deals from your fellow Blue Jays</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <p>Loading listings...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && listings.length === 0 && (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <h2>No listings yet</h2>
                        <p>Be the first to post an item!</p>
                        <button 
                            onClick={() => navigate('/create-listing')}
                            className="cta-button"
                        >
                            Post Your First Listing
                        </button>
                    </div>
                )}

                {/* Listings Grid */}
                {!loading && listings.length > 0 && (
                    <div className="listings-grid">
                        {listings.map((listing) => (
                        <ItemCard
                            key={listing.id}
                            id={listing.id}
                            title={listing.title}
                            price={listing.price}
                            description={listing.description}
                            image={listing.image}
                            condition={listing.condition}
                            category={listing.category}
                            seller={listing.seller}
                            onClick={() => navigate(`/item/${listing.id}`)}
                        />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;