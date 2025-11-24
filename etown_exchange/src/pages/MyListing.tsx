import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import MyListingCard from '../components/MyListingCard';
import ConfirmationModal from '../components/ConfirmationModal';

import './styles/MyListing.css';

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

const MyListing: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // calculate total price
    const totalPrice = useMemo(() => {
        return listings.reduce((total, listing) => {
            const priceWithoutDollar = listing.price.replace("$", "");
            const priceAsNumber = Number(priceWithoutDollar);
            return total + priceAsNumber;
        }, 0);
    }, [listings]);

    // fetch individual listings
    useEffect(() => {
        const fetchMyListings = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                const collectionRef = collection(db, 'listings');
                const q = query(collectionRef,
                    where('userId', '==', currentUser?.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                await new Promise(resolve => setTimeout(resolve, 2000));

                const fetchedListings: Listing[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedListings.push({
                        id: doc.id,
                        ...doc.data()
                    } as Listing);
                });
                setListings(fetchedListings);
            } catch (error) {
                console.log('Error fetching listings:', error);
                setError('Failed to load your listings');
            } finally {
                setLoading(false);
            }
        };
        fetchMyListings();
    }, [currentUser]);

    // delete button click
    const handleDeleteClick = (listing: Listing) => {
        setListingToDelete(listing);
        setDeleteModalOpen(true);
    }

    // handle deletion
    const handleConfirmDelete = async () => {
        if (!listingToDelete) return;
        setIsDeleting(true);
        try {
            const listingDocRef = doc(db, 'listings', listingToDelete.id);
            await deleteDoc(listingDocRef);
            if (listingToDelete.image) {
                try {
                    const imageRef = ref(storage, listingToDelete.image);
                    await deleteObject(imageRef);
                } catch (error) {
                    console.log('Image deletion failed:', error);
                }
            }
            setListings(currentListings =>
                currentListings.filter(listing => listing.id !== listingToDelete.id)
            );

            setDeleteModalOpen(false);
            setListingToDelete(null);
        } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing. Please try again");
        } finally {
            setIsDeleting(false);
        }
    };

    // handle cancel
    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setListingToDelete(null);
    };

    return (
        <div className="my-listings-page">
            <Navbar />
            <div className="my-listings-content">
                <div className="user-stats-banner">
                    <div className="user-info">
                        <p>{currentUser?.email}</p>
                        <p>
                            Member Since: {" "}
                            {currentUser?.metadata.creationTime &&
                                new Date(currentUser.metadata.creationTime).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                        </p>
                    </div>
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-number">{listings.length}</span>
                            <span className="stat-label">Active Listings</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">${totalPrice}</span>
                            <span className="stat-label">Total Value</span>
                        </div>
                    </div>
                </div>
                <h1>My Listings</h1>
                {/* loading state */}
                {loading && (
                    <div className="loading-state">
                        <p>Loading your listings...</p>
                    </div>
                )}

                {/* empty - no listings */}
                {!loading && listings.length === 0 && (
                    <div className="empty-state">
                        <span className="empty-icon">📦</span>
                        <h2>You haven't posted any listings yet</h2>
                        <p>Start selling items to your community</p>
                        <button onClick={() => navigate('/create-listing')} className="cta-button">
                            Post your first Listing
                        </button>
                    </div>
                )}

                {/* has listings */}
                {!loading && listings.length > 0 && (
                    <div className="listings-grid">
                        {listings.map((listing) => (
                            <MyListingCard
                                key={listing.id}
                                id={listing.id}
                                title={listing.title}
                                price={listing.price}
                                description={listing.description}
                                image={listing.image}
                                condition={listing.condition}
                                category={listing.category}
                                createdAt={listing.createdAt}
                                onEdit={() => {
                                    // implement this next
                                    console.log('Edit clicked for:', listing.id);
                                }}
                                onDelete={() => handleDeleteClick(listing)}
                            />
                        ))}
                    </div>
                )}
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    title="Delete Listing"
                    message="Are you sure you want to delete this listing?"
                    itemName={listingToDelete?.title}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    confirmButtonText="Delete"
                    cancelButtonText='Cancel'
                />

            </div>
            <Footer />
        </div>
    );
};

export default MyListing;