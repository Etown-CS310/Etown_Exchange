import React from 'react';
import './styles/Logo.css';

type LogoProps = {
    showText?: boolean;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
};

const Logo: React.FC<LogoProps> = ({showText = true, size='medium', onClick}) => {
    const sizeClass = `logo-${size}`;
    return(
        <div
        className={`logo ${sizeClass} ${onClick ? 'logo-clickable' : '' }`}
        onClick={onClick}
        >
            <span className="logo-icon">E</span>
            {showText && <span className="logo-text">Exchange</span>}
        </div>
    );

};

export default Logo;