import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useAuth } from '../auth/authContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './styles/CreateListing.css';

const EditListing: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingListing, setFetchingListing] = useState(true);

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            setFetchingListing(true);
            try {
                const listingRef = doc(db, 'listings', id);
                const docSnap = await getDoc(listingRef);
                if (!docSnap.exists()) {
                    alert('Listing not found');
                    navigate('/my-listings');
                    return;
                }
                const data = docSnap.data();
                setTitle(data.title);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category || '');
                setCondition(data.condition || '');
                if (data.image) {
                    setExistingImageUrl(data.image);
                    setImagePreview(data.image);
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
                alert('Failed to load listing');
                navigate('/my-listings');
            } finally {
                setFetchingListing(false);
            }
        };
        fetchListing();
    }, [id])

    // form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!id){
            alert('Error: Listing ID is missing. Cannot proceed with update.');
            setLoading(false);
            return;
        }

        // update image if changed
        try {
            let imageUrl = existingImageUrl;

            if (image) {
                if (existingImageUrl) {
                    try {
                        const imageRef = ref(storage,);
                        await deleteObject(imageRef);
                    } catch (error) {
                        console.log('Old image deletion failed:', error);
                    }
                }
                const imageRef = ref(storage, `listings/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            // update listing
            await updateDoc(doc(db, 'listings', id), {
                title,
                description,
                price,
                category,
                condition,
                image: imageUrl
            });
            navigate('/my-listings');
        } catch (error) {
            console.error('Error updating listing:', error);
            alert('Failed to update listing. Please try again');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="create-listing-page">
            <Navbar />
            <div className="create-listing-content">
                <div className="form-header">
                    <h1>Edit Listing</h1>
                    <p>Update your listing details</p>
                </div>
                {fetchingListing && (
                    <div className="loading-state">
                        <p>Loading listing...</p>
                    </div>
                )}

                {!fetchingListing && (
                    <form onSubmit={handleSubmit} className="listing-form">
                        {/* Image Upload Section */}
                        <div className="form-section">
                            <h2>Item Photo</h2>
                            <div className="image-upload-container">
                                {imagePreview ? (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="remove-image-btn"
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label className="image-upload-label">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="image-input"
                                        />
                                        <div className="upload-placeholder">
                                            <span className="upload-icon">📷</span>
                                            <p>Click to upload photo</p>
                                            <p className="upload-hint">PNG, JPG up to 5MB</p>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Item Details Section */}
                        <div className="form-section">
                            <h2>Item Details</h2>

                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Used Calculus Textbook"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your item, its condition, any defects, etc."
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price">Price *</label>
                                    <input
                                        type="text"
                                        id="price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="$0.00"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="condition">Condition *</label>
                                    <select
                                        id="condition"
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        required
                                    >
                                        <option value="">Select condition</option>
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category *</label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Textbooks">Textbooks</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Stationaries">Stationaries</option>
                                    <option value="Dorm Essentials">Dorm Essentials</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <Button
                                text={loading ? 'Updating...' : 'Update Listing'}
                                onClick={() => { }}
                                disabled={loading || fetchingListing}
                                className="submit-btn"
                            />
                        </div>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default EditListing;