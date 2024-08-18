import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();  // URL에서 사용자 ID를 가져옴

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/${id}`);  // 상대 경로로 API 요청
                setUserInfo(response.data);
            } catch (error) {
                console.error('사용자 정보를 불러오는데 실패했습니다:', error);
                setError('사용자 정보를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    if (!userInfo) {
        return <p>사용자 정보를 불러올 수 없습니다.</p>;
    }

    const handleViewReservations = () => {
        navigate('/guest/myReservations/' + userInfo.id, { state: { userInfo } });
    };

    const handleViewWishlist = () => {
        navigate('/guest/wishlist/' + userInfo.id, { state: { userInfo } });
    };

    const handleEditProfile = () => {
        navigate(`/guest/mypage/edit/${userInfo.id}`, { state: { userInfo } });
    };

    return (
        <Container>
            <h2>마이페이지</h2>
            <Table striped bordered hover>
                <tbody>
                <tr>
                    <th>이메일</th>
                    <td>{userInfo.email}</td>
                </tr>
                <tr>
                    <th>전화번호</th>
                    <td>{userInfo.phone}</td>
                </tr>
                <tr>
                    <th>주소</th>
                    <td>{userInfo.address}</td>
                </tr>
                <tr>
                    <th>닉네임</th>
                    <td>{userInfo.nickname}</td>
                </tr>
                <tr>
                    <th>역할</th>
                    <td>{userInfo.role}</td>
                </tr>
                <tr>
                    <th>총 이용 금액</th>
                    <td>{userInfo.userTotalAmount} 원</td>
                </tr>
                </tbody>
            </Table>
            <Button style={button} onClick={handleEditProfile}>수정하기</Button>{' '}
            <Button style={button} onClick={handleViewWishlist}>찜 목록</Button>{' '}
            <Button style={button} onClick={handleViewReservations}>예약목록</Button>
        </Container>
    );
};

const button = {
    backgroundColor: '#9ec2fc',
    borderColor: '#9ec2fc',
};

export default MyPage;