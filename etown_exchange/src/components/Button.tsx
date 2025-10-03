import React from 'react';

type props ={
    text: string
    onClick: () => void
    disabled?: boolean
    className?: string
}

const Button: React.FC<props> = ({text, onClick, disabled, className}) => {
    return(
        <button 
        onClick={onClick}
        disabled={disabled}
        className={className}>
        {text}
        </button>
    );
};

export default Button;