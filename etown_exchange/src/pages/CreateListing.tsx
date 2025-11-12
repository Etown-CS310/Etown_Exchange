import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import './styles/CreateListing.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';
import { useAuth } from '../auth/authContext';


const CreateListing: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();
    
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

    // Handle form submission 
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        let imageUrl = '';

        // Upload image if exists
        if (image) {
            const imageRef = ref(storage, `listings/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            imageUrl = await getDownloadURL(imageRef);
        }

        // Save listing to Firestore
        await addDoc(collection(db, 'listings'), {
            title,
            description,
            price,
            category,
            condition,
            image: imageUrl,
            seller: currentUser?.email,
            userId: currentUser?.uid,
            createdAt: serverTimestamp()
        });

        alert('Listing posted successfully!');
        navigate('/dashboard');
    } catch (error) {
        console.error('Error creating listing:', error);
        alert('Failed to post listing. Please try again.');
    } finally {
        setLoading(false);
    }
};

    return(
        <div className="create-listing-page">
            <Navbar />
            <div className="create-listing-content">
                <div className="form-header">
                    <h1>Post a New Listing</h1>
                    <p>Share items with your Etown community</p>
                </div>

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
                                <option value="Sports">Sports & Recreation</option>
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
                            text={loading ? 'Posting...' : 'Post Listing'}
                            onClick={() => {}}
                            disabled={loading}
                            className="submit-btn"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreateListing;