import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Table, InputGroup, FormControl } from "react-bootstrap";
import './HotelList.css';

const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const hotelsPerPage = 20;

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get("http://localhost:8080/hotel/hotelAll");
                if (response.status === 200) {
                    setHotels(response.data.hotelList);
                    setFilteredHotels(response.data.hotelList); // 초기 필터된 호텔 리스트 설정
                } else {
                    throw new Error('Failed to fetch hotels');
                }
            } catch (error) {
                console.error('Failed to fetch hotels:', error);
                setError('Failed to fetch hotels');
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    // 검색어가 변경될 때마다 필터링된 호텔 리스트 업데이트
    useEffect(() => {
        const filtered = hotels.filter(hotel =>
            hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredHotels(filtered);
        setCurrentPage(1); // 검색할 때 페이지를 첫 페이지로 리셋
    }, [searchTerm, hotels]);

    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
    const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

    const moveToPage = (pageNo) => {
        if (pageNo > 0 && pageNo <= totalPages) {
            setCurrentPage(pageNo);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="hotel-list-container">
            <h1>Hotel List</h1>

            <div className="search-container">
                <InputGroup className="search-group">
                    <FormControl
                        placeholder="Search by hotel name"
                        aria-label="Search by hotel name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // 검색어 입력 핸들러
                    />
                </InputGroup>
            </div>

            <Table hover striped bordered className="hotel-list-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {currentHotels.length > 0 ? (
                    currentHotels.map((hotel) => (
                        <tr key={hotel.id}>
                            <td>{hotel.hotelName}</td>
                            <td>{hotel.hotelAddress}</td>
                            <td>{hotel.hotelPhone}</td>
                            <td>{hotel.hotelEmail}</td>
                            <td>{hotel.hotelGrade}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">No hotels available.</td>
                    </tr>
                )}
                </tbody>
            </Table>

            <Pagination className="justify-content-center">
                <Pagination.First onClick={() => moveToPage(1)} />
                <Pagination.Prev onClick={() => moveToPage(currentPage - 1)} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => moveToPage(page)}
                    >
                        {page}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => moveToPage(currentPage + 1)} />
                <Pagination.Last onClick={() => moveToPage(totalPages)} />
            </Pagination>
        </div>
    );
};

export default HotelList;
