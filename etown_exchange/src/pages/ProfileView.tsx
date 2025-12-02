import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { UserProfile } from '../types/user';
import { Listing } from '../types/listing';
import './styles/ProfileView.css';

const ProfileView: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [favoriteListings, setFavoriteListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [favoritesLoading, setFavoritesLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;

            try {
                const userRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    navigate('/edit-profile');
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!currentUser) return;

            try {
                const favoritesRef = collection(db, 'favorites');
                const q = query(favoritesRef, where('userId', '==', currentUser.uid));
                const favSnapshot = await getDocs(q);
                const favoriteIds = favSnapshot.docs.map(doc => doc.data().listingId);

                if (favoriteIds.length === 0) {
                    setFavoriteListings([]);
                    setFavoritesLoading(false);
                    return;
                }

                // fetch actual listings
                const listingsPromises = favoriteIds.map(async (listingId) => {
                    const listingRef = doc(db, 'listings', listingId);
                    const listingSnap = await getDoc(listingRef);
                    if (listingSnap.exists()) {
                        return { id: listingSnap.id, ...listingSnap.data() } as Listing;
                    }
                    return null;
                });

                const listings = await Promise.all(listingsPromises);
                setFavoriteListings(listings.filter(listing => listing !== null) as Listing[]);
            } catch (error) {
                console.error('Failed to load favorites:', error);
            } finally {
                setFavoritesLoading(false);
            }
        };
        fetchFavorites();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="profile-view-page">
                <Navbar />
                <div className="profile-view-content">
                    <div className="loading-state">
                        <p>Loading profile...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="profile-view-page">
            <Navbar />
            <div className="profile-view-content">
                {/* Profile Header */}
                <div className="profile-header-section">
                    <div className="profile-avatar-large">
                        {profile.profilePicture ? (
                            <img src={profile.profilePicture} alt={profile.firstName} />
                        ) : (
                            <span className="avatar-placeholder">👤</span>
                        )}
                    </div>

                    <div className="profile-header-info">
                        <h1>
                            {profile.firstName} {profile.showLastName ? profile.lastName : ''}
                        </h1>
                        <p className="profile-email">{profile.email}</p>
                        <p className="member-since">
                            Member since {profile.createdAt?.toDate().toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>

                        <Button
                            text="Edit Profile"
                            onClick={() => navigate('/edit-profile')}
                            className="edit-profile-btn"
                        />
                    </div>
                </div>

                {/* Profile Details */}
                <div className="profile-details-grid">
                    {/* Bio Section */}
                    {profile.bio && (
                        <div className="detail-card">
                            <h2>About Me</h2>
                            <p>{profile.bio}</p>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div className="detail-card">
                        <h2>Contact Information</h2>
                        <div className="contact-info-list">
                            <div className="contact-item">
                                <span className="contact-icon">📧</span>
                                <span>{profile.email}</span>
                            </div>

                            {profile.showInstagram && profile.instagramHandle && (
                                <div className="contact-item">
                                    <span className="contact-icon">📱</span>
                                    <span>@{profile.instagramHandle}</span>
                                </div>
                            )}

                            {profile.showSnapchat && profile.snapchatHandle && (
                                <div className="contact-item">
                                    <span className="contact-icon">👻</span>
                                    <span>{profile.snapchatHandle}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Meeting Preferences */}
                    {profile.preferredMeetingLocation && (
                        <div className="detail-card">
                            <h2>Meeting Preferences</h2>
                            <div className="meeting-location">
                                <span className="location-icon">📍</span>
                                <span>{profile.preferredMeetingLocation}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Favorites Section */}
                <div className="favorites-section">
                    <h2>Favorite Listings</h2>

                    {favoritesLoading ? (
                        <div className="loading-favorites">
                            <p>Loading favorites...</p>
                        </div>
                    ) : favoriteListings.length === 0 ? (
                        <div className="empty-favorites">
                            <span className="empty-icon">❤️</span>
                            <p>No favorite listings yet</p>
                            <p className="empty-subtext">Browse listings and bookmark your favorites!</p>
                            <Button
                                text="Browse Listings"
                                onClick={() => navigate('/dashboard')}
                                className="browse-btn"
                            />
                        </div>
                    ) : (
                        <div className="favorites-grid">
                            {favoriteListings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="favorite-card"
                                    onClick={() => navigate(`/item/${listing.id}`)}
                                >
                                    <div className="favorite-image">
                                        {listing.image ? (
                                            <img src={listing.image} alt={listing.title} />
                                        ) : (
                                            <div className="favorite-image-placeholder">
                                                <span>📦</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="favorite-info">
                                        <h3>{listing.title}</h3>
                                        <p className="favorite-price">{listing.price}</p>
                                        {listing.condition && (
                                            <span className="favorite-condition">{listing.condition}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfileView;