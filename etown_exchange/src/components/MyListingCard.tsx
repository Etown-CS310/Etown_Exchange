import { Timestamp } from 'firebase/firestore';
import React from 'react';
import './styles/MyListingCard.css';

type MyListingCardProps = {
    id: string,
    title: string,
    price: string,
    description: string,
    image?: string,
    condition?: string,
    category?: string,
    createdAt: Timestamp,
    onEdit: () => void,
    onDelete: () => void
}

const MyListingCard: React.FC<MyListingCardProps> = ({
    id,
    title,
    price,
    description,
    image,
    condition,
    category,
    createdAt,
    onEdit,
    onDelete
}

) => {
    // calculate days since posted
    const getPostedTime = () => {
        const daysAgo = Math.floor(
            (Date.now() - createdAt.toDate().getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysAgo === 0) return "Posted today";
        if (daysAgo === 1) return "Posted yesterday";
        if (daysAgo < 7) return `Posted ${daysAgo} days ago`;

        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo === 1) return "Posted 1 week ago";
        if (weeksAgo < 4) return `Posted ${weeksAgo} weeks ago`;

        return "Posted over a month ago";
    }

    return (

        <div className="my-listing-card">
            {/* Image section */}
            <div className="my-listing-card-image">
                {image ? (
                    <img src={image} alt={title} />
                ) : (
                    <div className="listing-image-placeholder">
                        <span>📦</span>
                    </div>
                )}
                {category && <span className="my-listing-card-category">{category}</span>}
            </div>

            {/* Content section */}
            <div className="my-listing-card-content">
                <h3 className="my-listing-card-title">{title}</h3>
                <p className="my-listing-card-description">{description}</p>

                <div className="my-listing-card-details">
                    {condition && (
                        <span className="my-listing-card-condition">{condition}</span>
                    )}
                    <span className="posted-time">{getPostedTime()}</span>
                </div>

                <div className="my-listing-card-footer">
                    <span className="my-listing-card-price">{price}</span>
                    <div className="action-buttons">
                        <button onClick={onEdit} className="edit-btn">
                            ✏️ Edit
                        </button>
                        <button onClick={onDelete} className="delete-btn">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MyListingCard;