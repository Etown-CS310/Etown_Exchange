import React from 'react';
// import './styles/ListingCard.css'; // Import the CSS file

type Props = {
    title: string;
    price: string;
    desc: string;
};

const ListingCard: React.FC<Props> = ({ title, price, desc }) => {
    return (
        <div className="listing-card">
            <h3>{title}</h3>
            <p className="price">{price}</p>
            <p>{desc}</p>
        </div>
    );
};

export default ListingCard;
