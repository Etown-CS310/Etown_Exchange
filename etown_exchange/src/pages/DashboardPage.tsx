import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';
import './styles/DashboardPage.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Listing } from '../types/listing';


const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // fetch listing from firestore
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const collectionRef = collection(db, 'listings');
                const q = query(collectionRef, orderBy('createdAt', 'desc'));

                const querySnapshot = await getDocs(q);

                const fetchedListings: Listing[] = [];
                querySnapshot.forEach((doc) => {
                    const listingData = { id: doc.id, ...doc.data() } as Listing;
                    // Filter out sold items
                    if (!listingData.sold) {
                        fetchedListings.push(listingData);
                    }
                });

                setListings(fetchedListings);
            } catch (error) {
                console.log('Error fetching listings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const filteredListings = listings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Calculate current page listings
    const currentListings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredListings.slice(startIndex, endIndex);
    }, [filteredListings, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, itemsPerPage]);

    return (
        <div className="dashboard-page">
            <Navbar />

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

                {/* search bar */}
                <div className="search-section">
                    <div className="search-bar">
                        <span className="search-icon">🔎</span>
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="clear-search"
                            >
                                X
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="search-results-count">
                            Found {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Category Filter */}
                <div className="filter-section">
                    <div className="filter-buttons">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Textbooks')}
                            className={`filter-btn ${selectedCategory === 'Textbooks' ? 'active' : ''}`}
                        >
                            Textbooks
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Furniture')}
                            className={`filter-btn ${selectedCategory === 'Furniture' ? 'active' : ''}`}
                        >
                            Furniture
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Electronics')}
                            className={`filter-btn ${selectedCategory === 'Electronics' ? 'active' : ''}`}
                        >
                            Electronics
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Stationaries')}
                            className={`filter-btn ${selectedCategory === 'Stationaries' ? 'active' : ''}`}
                        >
                            Stationaries
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Dorm Essentials')}
                            className={`filter-btn ${selectedCategory === 'Dorm Essentials' ? 'active' : ''}`}
                        >
                            Dorm Essentials
                        </button>
                        <button
                            onClick={() => setSelectedCategory('Clothing')}
                            className={`filter-btn ${selectedCategory === 'Clothing' ? 'active' : ''}`}
                        >
                            Clothing
                        </button>
                    </div>
                </div>
                
                {/* Pagination Controls - top*/}
                {!loading && filteredListings.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredListings.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}

                 

                {/* Listings Grid */}
                {!loading && currentListings.length > 0 && (
                    <div className="listings-grid">
                        {currentListings.map((listing) => (
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

                {/* Pagination Controls - Bottom */}
                {!loading && filteredListings.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredListings.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                )}

                {/* no results state */}
                {!loading && listings.length > 0 && filteredListings.length === 0 && (
                    <div className="no-results-state">
                        <span className="no-results-icon">🔍</span>
                        <h2>No results found</h2>
                        <p>Try adjusting your search terms</p>
                        <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                            Clear Search
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;