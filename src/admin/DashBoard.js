import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './Navigation';  // Navigation 컴포넌트 임포트
import './DashBoard.css';

function Dashboard() {
    const [visitorCount, setVisitorCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [hotelCount, setHotelCount] = useState(0);

    const links = [
        { path: '/admin/', label: '대시보드' },
        { path: '/admin/userList', label: '사용자 목록' },
        { path: '/admin/hotelList', label: '호텔 목록' }
    ];

    useEffect(() => {
        const incrementVisitorCount = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/incrementVisitor', {
                    params: { user_id: 1 }
                });
                setVisitorCount(response.data.visitorCount);
            } catch (error) {
                console.error('Failed to increment visit count', error);
            }
        };
        incrementVisitorCount();
    }, []);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user/userCount', {
                    params: { roles: 'ROLE_USER,USER' }
                });
                setUserCount(response.data.userCount);
            } catch (error) {
                console.error('Failed to fetch user count', error);
            }
        };
        fetchUserCount();

        const fetchHotelCount = async () => {
            try {
                const response = await axios.get('http://localhost:8080/hotel/count', { params: { unique: true } });
                setHotelCount(response.data.hotelCount);
            } catch (error) {
                console.error('Failed to fetch hotel count', error);
            }
        };
        fetchHotelCount();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <Navigation links={links}/> {/* Navigation 컴포넌트 */}
            </header>

            <h1 className="dashboard-title">관리자 페이지</h1>
            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="card-title">방문 횟수</div>
                    <div className="card-value">{visitorCount}</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">회원 수</div>
                    <div className="card-value">{userCount}</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">호텔 수</div>
                    <div className="card-value">{hotelCount}</div>
                </div>
            </div>


        </div>
    );
}

export default Dashboard;
