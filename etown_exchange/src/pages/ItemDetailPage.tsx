import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../auth/authContext';
import { Listing } from '../types/listing';
import { UserProfile } from '../types/user';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ReportModal from '../components/ReportModal';
import './styles/ItemDetailPage.css';

const ItemDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [listing, setListing] = useState<Listing | null>(null);
    const [seller, setSeller] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);

    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteId, setFavoriteId] = useState<string | null>(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const fetchListingAndSeller = async () => {
            if (!id) {
                setError('No listing Id provided');
                setLoading(false);
                return;
            }

            try {
                // fetch listing
                const listingRef = doc(db, 'listings', id);
                const listingSnap = await getDoc(listingRef);

                if (!listingSnap.exists()) {
                    setError('Listing not found');
                    setLoading(false);
                    return;
                }

                const listingData = {
                    id: listingSnap.id,
                    ...listingSnap.data()
                } as Listing;

                setListing(listingData);

                // fetch seller profile
                const sellerRef = doc(db, 'users', listingData.userId);
                const sellerSnap = await getDoc(sellerRef);

                if (sellerSnap.exists()) {
                    setSeller(sellerSnap.data() as UserProfile);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load listing');
            } finally {
                setLoading(false);
            }
        };
        fetchListingAndSeller();
    }, [id])

    // check if listing is favorited
    useEffect(() => {
        const checkIfFavorited = async () => {
            if (!currentUser || !id) return;

            try {
                const favoritesRef = collection(db, 'favorites');
                const q = query(
                    favoritesRef,
                    where('userId', '==', currentUser.uid),
                    where('listingId', '==', id)
                );
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    setIsFavorited(true);
                    setFavoriteId(snapshot.docs[0].id);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };
        checkIfFavorited();
    }, [currentUser, id]);

    // toggle favorite
    const handleToggleFavorite = async () => {
        if (!currentUser || !id) {
            alert('Please sign in to save favorites');
            return;
        }

        setFavoriteLoading(true);

        try {
            if (isFavorited && favoriteId) {
                // Remove from favorites
                await deleteDoc(doc(db, 'favorites', favoriteId));
                setIsFavorited(false);
                setFavoriteId(null);
            } else {
                // Add to favorites
                const favoritesRef = collection(db, 'favorites');
                const newFavorite = await addDoc(favoritesRef, {
                    userId: currentUser.uid,
                    listingId: id,
                    createdAt: new Date()
                });
                setIsFavorited(true);
                setFavoriteId(newFavorite.id);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to update favorite. Please try again.');
        } finally {
            setFavoriteLoading(false);
        }
    };

    // format posted time
    const getPostedTime = () => {
        if (!listing?.createdAt) return '';

        const daysAgo = Math.floor(
            (Date.now() - listing.createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysAgo === 0) return 'Posted today';
        if (daysAgo === 1) return 'Posted yesterday';
        if (daysAgo < 7) return `Posted ${daysAgo} days ago`;

        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo === 1) return 'Posted 1 week ago';
        if (weeksAgo < 4) return `Posted ${weeksAgo} weeks ago`;

        return 'Posted over a month ago';
    }

    // check if current user is the seller
    const isOwner = currentUser?.uid === listing?.userId;

    if (loading) {
        return (
            <div className="item-detail-page">
                <Navbar />
                <div className="item-detail-content">
                    <div className="loading-state">
                        <p>Loading listing...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="item-detail-page">
                <Navbar />
                <div className="item-detail-content">
                    <div className="error-state">
                        <h2>{error || 'Listing not found'}</h2>
                        <Button
                            text="Back to Browse"
                            onClick={() => navigate('/dashboard')}
                            className="back-btn"
                        />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="item-detail-page">
            <Navbar />
            <div className="item-detail-content">
                {/* header with navigation */}
                <div className="detail-header">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="back-button"
                    >
                        🔙 Back to Browse
                    </button>
                    <div className="header-actions">
                        {!isOwner && (
                            <button
                                onClick={handleToggleFavorite}
                                disabled={favoriteLoading}
                                className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                {isFavorited ? '❤️' : '🤍'} {isFavorited ? 'Saved' : 'Save'}
                            </button>
                        )}

                        {isOwner && (
                            <Button
                                text="Edit Listing"
                                onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                className="edit-button"
                            />
                        )}
                    </div>
                </div>

                {/* main content */}
                <div className="detail-main">
                    {/* left side image */}
                    <div className="detail-image-section">
                        {listing.image ? (
                            <img src={listing.image} alt={listing.title} />
                        ) : (
                            <div className="detail-image-placeholder">
                                <span>📦</span>
                                <p>No image available</p>
                            </div>
                        )}
                    </div>

                    {/* right side - details */}
                    <div className="detail-info-section">
                        <div className="detail-badges">
                            {listing.category && (
                                <span className="badge category-badge">{listing.category}</span>
                            )}
                            {listing.condition && (
                                <span className="badge condition-badge">{listing.condition}</span>
                            )}
                        </div>

                        <h1 className="detail-title">{listing.title}</h1>
                        <p className="detail-price">{listing.price}</p>
                        <p className="detail-posted-time">{getPostedTime()}</p>

                        <div className="detail-description-section">
                            <h2>Description</h2>
                            <p className="detail-description">{listing.description}</p>
                        </div>
                    </div>
                </div>

                {/* seller information card */}
                {!isOwner && seller && (
                    <div className="seller-card">
                        <h2>Seller Information</h2>

                        <div className="seller-profile">
                            <div className="seller-avatar">
                                {seller.profilePicture ? (
                                    <img src={seller.profilePicture} alt={seller.firstName} />
                                ) : (
                                    <span>👤</span>
                                )}
                            </div>

                            <div className="seller-info">
                                <h3>
                                    {seller.firstName} {seller.showLastName ? seller.lastName : ''}
                                </h3>
                                <p className="seller-member-since">
                                    Member since {seller.createdAt?.toDate().toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                                {seller.preferredMeetingLocation && (
                                    <p className="seller-location">
                                        📍Preferred meeting: {seller.preferredMeetingLocation}
                                    </p>
                                )}
                                {seller.bio && (
                                    <p className="seller-bio">{seller.bio}</p>
                                )}
                            </div>
                        </div>

                        {/* contact options */}
                        <div className="contact-options">
                            <h3>Contact Seller</h3>
                            <div className="contact-buttons">
                                <a
                                    href={`mailto:${seller.email}`}
                                    className="contact-btn email-btn"
                                >
                                    📧 Email
                                </a>

                                {seller.showInstagram && seller.instagramHandle && (
                                    <a
                                        href={`https://instagram.com/${seller.instagramHandle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-btn instagram-btn"
                                    >
                                        📱@{seller.instagramHandle}
                                    </a>
                                )}

                                {seller.showSnapchat && seller.snapchatHandle && (
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(seller.snapchatHandle || '');
                                            alert(`Snapchat username copied: ${seller.snapchatHandle}`);
                                        }}
                                        className='contact-btn snapchat-btn'
                                    >
                                        👻{seller.snapchatHandle}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* button for report modal */}
                {!isOwner && (
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="report-listing-btn"
                    >
                        🚩 Report Listing
                    </button>
                )}
                {/* report modal */}
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    listingId={listing.id}
                    listingTitle={listing.title}
                />

                {/* if owner, show message */}
                {isOwner && (
                    <div className="owner-message">
                        <p>This is your listing, buyers will see your contact info here.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ItemDetailPage;