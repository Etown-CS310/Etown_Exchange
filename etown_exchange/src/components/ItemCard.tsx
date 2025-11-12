import React from 'react';
import './styles/ItemCard.css';

type ItemCardProps = {
    id: string;
    title: string;
    price: string;
    description: string;
    image?: string;
    condition?: string;
    seller?: string;
    category?: string;
    onClick?: () => void;
};

const ItemCard: React.FC<ItemCardProps> = ({ 
    id,
    title, 
    price, 
    description, 
    image,
    condition,
    seller,
    category,
    onClick 
}) => {
    return (
        <div className="item-card">
            {/* Image Section */}
            <div className="item-card-image">
                {image ? (
                    <img src={image} alt={title} />
                ) : (
                    <div className="item-card-placeholder">
                        <span>📦</span>
                    </div>
                )}
                {category && <span className="item-card-category">{category}</span>}
            </div>

            {/* Content Section */}
            <div className="item-card-content">
                <h3 className="item-card-title">{title}</h3>
                <p className="item-card-description">{description}</p>
                
                <div className="item-card-details">
                    {condition && (
                        <span className="item-card-condition">{condition}</span>
                    )}
                    {seller && (
                        <span className="item-card-seller">by {seller}</span>
                    )}
                </div>
                
                <div className="item-card-footer">
                    <span className="item-card-price">{price}</span>
                    <button className="item-card-btn" onClick={onClick}>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;