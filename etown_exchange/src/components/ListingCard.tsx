import React from 'react';

type props = {
    title: string;
    price: string;
};

const ListingCard: React.FC<props> = ({title, price}) => {
    return(
        <div style={{ // will eventually create a css file for this 
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            width: '200px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
        }}>
            <h3>{title}</h3>
            <p>{price}</p>
        </div>
    )
}
export default ListingCard;