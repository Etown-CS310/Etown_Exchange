import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { UserProfile } from '../types/user';
import './styles/EditProfile.css';

const EditProfile: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [instagramHandle, setInstagramHandle] = useState('');
    const [snapchatHandle, setSnapchatHandle] = useState('');
    const [preferredLocation, setPreferredLocation] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePictPreview, setProfilePicPreview] = useState<string | null>(null);
    const [showLastName, setShowLastName] = useState(false);
    const [showInstagram, setShowInstagram] = useState(false);
    const [showSnapchat, setShowSnapchat] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileExists, setProfileExists] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                // create ref to user doc
                const userRef = doc(db, 'users', currentUser.uid);
                //fetch docs
                const docSnap = await getDoc(userRef);
                //check if profile exist
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserProfile;

                    //pre-fill form 
                    setFirstName(data.firstName || '');
                    setLastName(data.lastName || '');
                    setInstagramHandle(data.instagramHandle || '');
                    setSnapchatHandle(data.snapchatHandle || '');
                    setPreferredLocation(data.preferredMeetingLocation || '');
                    setBio(data.bio || '');
                    setShowLastName(data.showLastName || false);
                    setShowInstagram(data.showInstagram || false);
                    setShowSnapchat(data.showSnapchat || false);
                    setProfileExists(true);
                } else {
                    setProfileExists(false);
                }
            } catch (error) {
                console.error('Failed to load profile', error);
                alert('Failed to load profile');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [currentUser])

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePicture(file);

            //create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // validation
        if (!firstName) {
            alert('First name is required');
            return;
        }

        // TODO: IMPLEMENT VALIDATION FOR SOCIAL HANDLES
        const cleanSocialHandle = (handle: string) => {
            return handle.trim().replace(/^@/, '');
        };

        setSaving(true);
        try {
            let profilePictureUrl = null;
            if (profilePicture) {
                // upload to firebase storage
                const imageRef = ref(storage, `profilePictures/${currentUser?.uid}_${profilePicture.name}`);
                await uploadBytes(imageRef, profilePicture);
                const profilePictureUrl = await getDownloadURL(imageRef);
            }

            if (!currentUser) {
                setSaving(false);
                return;
            }

            const cleanInstagram = instagramHandle ? cleanSocialHandle(instagramHandle) : '';
            const cleanSnapchat = snapchatHandle ? cleanSocialHandle(snapchatHandle) : '';

            const profileData = {
                userId: currentUser.uid,
                email: currentUser.email || '',
                firstName: firstName,
                lastName: lastName,
                instagramHandle: cleanInstagram,
                snapchatHandle: cleanSnapchat,
                preferredMeetingLocation: preferredLocation,
                bio: bio,
                showLastName: showLastName,
                showInstagram: showInstagram,
                showSnapchat: showSnapchat,
                updatedAt: serverTimestamp()
            } as Partial<UserProfile>;

            if (profilePictureUrl) {
                profileData.profilePicture = profilePictureUrl;
            }

            const userRef = doc(db, 'users', currentUser.uid);

            // save to firestore
            if (profileExists) {
                await updateDoc(userRef, profileData);
            } else {
                const newProfileData = {
                    ...profileData,
                    createdAt: serverTimestamp()
                };
                await setDoc(userRef, newProfileData);
                setProfileExists(true);
            }
            alert('Profile saved successfully!');
            navigate('/profile');
        } catch (error) {
            console.error('Failed to save profile', error);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    }
    return (
        <div className="profile-page">
            <Navbar />
            <div className="profile-content">
                {/* page header */}
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <p>Manage your account information</p>
                </div>

                {/* loading state */}
                {loading && (
                    <div className="loading-state">
                        <p>Loading profile...</p>
                    </div>
                )}

                {/* profile form */}
                {!loading && (
                    <form onSubmit={handleSubmit} className="profile-form">
                        {/* profile picture section */}
                        <div className="form-section">
                            <h2>Profile Picture</h2>
                            <div className="profile-picture-upload">
                                {profilePictPreview ? (
                                    <div className="picture-preview">
                                        <img src={profilePictPreview} alt="Profile preview" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfilePicture(null);
                                                setProfilePicPreview(null);
                                            }}
                                            className="remove-picture-btn"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="picture-placeholder">
                                        <span>👤</span>
                                        <p>No profile picture</p>
                                    </div>
                                )}
                                <label className="upload-picture-label">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="picture-input"
                                    />
                                    <span>Upload Picture</span>
                                </label>
                            </div>
                        </div>

                        {/* basic information section */}
                        <div className="form-section">
                            <h2>Basic Information</h2>
                            <div className="form-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    placeholder="Tell others a bit about yoursel..."
                                />
                            </div>
                        </div>

                        {/* contact info */}
                        <div className="form-section">
                            <h2>Contact Information</h2>

                            {/* email is read only from auth */}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={currentUser?.email || ''}
                                    disabled
                                />
                                <p className="field-hint">Cannot be changed</p>
                            </div>

                            <div className="form-group">
                                <label>Instagram Handle</label>
                                <input
                                    type="text"
                                    value={instagramHandle}
                                    onChange={(e) => setInstagramHandle(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label>Snapchat Handle</label>
                                <input
                                    type="text"
                                    value={snapchatHandle}
                                    onChange={(e) => setSnapchatHandle(e.target.value)} />
                            </div>
                        </div>

                        {/* preferences section */}
                        <div className="form-section">
                            <h2>Meeting Preferences</h2>
                            <div className="form-group">
                                <label>Preferred Meeting Location</label>
                                <select
                                    onChange={(e) => setPreferredLocation(e.target.value)}
                                    value={preferredLocation}
                                >
                                    <option value="">Select location</option>
                                    <option value="BSC">BSC</option>
                                    <option value="Library">Library</option>
                                    <option value="Bowers">Bowers</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* privacy settings */}
                        <div className="form-section">
                            <h2>Privacy Settings</h2>
                            <p className="section-description">
                                Control what information is visible to other users
                            </p>

                            {/* checkbox for each privacy toggle */}
                            <div className="privacy-toggles">
                                <label className="toggle-item">
                                    <input
                                        type="checkbox"
                                        checked={showLastName}
                                        onChange={(e) => setShowLastName(e.target.checked)}
                                    />
                                    <span>Show last name on listings</span>
                                </label>

                                <label className="toggle-item">
                                    <input
                                        type="checkbox"
                                        checked={showInstagram}
                                        onChange={(e) => setShowInstagram(e.target.checked)}
                                    />
                                    <span>Show Instagram handle on profile</span>
                                </label>

                                <label className="toggle-item">
                                    <input
                                        type="checkbox"
                                        checked={showSnapchat}
                                        onChange={(e) => setShowSnapchat(e.target.checked)}
                                    />
                                    <span>Show Snapchat handle on profile</span>
                                </label>
                            </div>
                        </div>

                        {/* submit button */}
                        <div className="form-actions">
                            <Button
                                text={saving ? 'Saving...' : 'Save Profile'}
                                onClick={() => { }}
                                disabled={saving}
                                className="save-profile-btn"
                            />
                        </div>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default EditProfile;