import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';  // Navigation 컴포넌트 스타일 임포트

const Navigation = ({ links }) => {
    return (
        <nav className="dashboard-nav">
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <Link to={link.path}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
