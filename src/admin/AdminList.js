import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Pagination, Table, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import './AdminList.css';

const AdminList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editedUsers, setEditedUsers] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const usersPerPage = 20;
    const navigate = useNavigate();

    const filterUsersByRole = useCallback(() => {
        const rolesToShow = ['BUSINESS', 'ROLE_BUSINESS', 'ROLE_ADMIN', 'ADMIN'];
        const filtered = users.filter(user => rolesToShow.includes(user.role));
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [users]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/userList", {
                    withCredentials: true
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsersByRole();
    }, [filterUsersByRole]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const filtered = users.filter(user =>
            user.nickname && user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleCheckboxChange = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
            setEditedUsers((prevEditedUsers) => {
                const updated = { ...prevEditedUsers };
                delete updated[userId];
                return updated;
            });
        } else {
            setSelectedUsers([...selectedUsers, userId]);
            const user = users.find(user => user.id === userId);
            setEditedUsers((prevEditedUsers) => ({
                ...prevEditedUsers,
                [userId]: {
                    email: user.email,
                    nickname: user.nickname || '',
                    address: user.address,
                    userGender: user.userGender,
                    phone: user.phone,
                    role: user.role,
                    userTotalAmount: user.userTotalAmount,
                    enabled: user.enabled
                }
            }));
        }
    };

    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedUsers([]);
            setEditedUsers({});
        } else {
            const allUserIds = currentUsers.map(user => user.id);
            setSelectedUsers(allUserIds);
            const allEditedUsers = {};
            currentUsers.forEach(user => {
                allEditedUsers[user.id] = {
                    id: user.id,
                    email: user.email,
                    nickname: user.nickname || '',
                    address: user.address,
                    userGender: user.userGender,
                    phone: user.phone,
                    role: user.role,
                    userTotalAmount: user.userTotalAmount,
                    enabled: user.enabled
                };
            });
            setEditedUsers(allEditedUsers);
        }
        setSelectAll(!selectAll);
    };

    const handleSaveClick = async () => {
        const confirmSave = window.confirm(`총 ${selectedUsers.length}명 수정하시겠습니까?`);
        if (!confirmSave) {
            return;
        }

        try {
            for (const userId of selectedUsers) {
                await axios.post(`http://localhost:8080/admin/update`, {
                    id: userId,
                    ...editedUsers[userId]
                }, { withCredentials: true });
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    selectedUsers.includes(user.id)
                        ? { ...user, ...editedUsers[user.id] }
                        : user
                )
            );

            setSelectedUsers([]);
            setEditedUsers({});
            setSelectAll(false);
        } catch (error) {
            console.error('Failed to update user', error);
        }
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm(`총 ${selectedUsers.length}명 삭제하시겠습니까?`);
        if (!confirmDelete) {
            return;
        }

        try {
            for (const userId of selectedUsers) {
                await axios.delete(`http://localhost:8080/admin/delete/${userId}`, { withCredentials: true });
            }

            setUsers((prevUsers) =>
                prevUsers.filter((user) => !selectedUsers.includes(user.id))
            );

            setSelectedUsers([]);
            setEditedUsers({});
            setSelectAll(false);
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
            navigate('/user/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleMyInfoClick = () => {
        navigate(`/admin/userdetails/${window.user.id}`);
    };

    const handleRoleUpdate = (userId, newRole) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, role: newRole } : user
            )
        );

        // 권한이 변경되었을 때, 해당 유저를 수정된 유저 목록에 추가합니다.
        setEditedUsers((prevEditedUsers) => ({
            ...prevEditedUsers,
            [userId]: {
                ...prevEditedUsers[userId],
                role: newRole,
            },
        }));
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    let totalPages = filteredUsers.length > 0 ? Math.floor(filteredUsers.length / usersPerPage) : 1;
    if (filteredUsers.length % usersPerPage !== 0) {
        totalPages = (filteredUsers.length - (filteredUsers.length % usersPerPage)) / usersPerPage + 1;
    }

    const moveToPage = (pageNo) => {
        if (pageNo > 0 && pageNo <= totalPages) {
            setCurrentPage(pageNo);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="admin-list-container">
            <div className="header">
                <h1>Admin List</h1>
                {window.user && (
                    <div className="current-user-info">
                        <span>관리자 {window.user.nickname || window.user.username}님</span>
                        <br />
                        <Button variant="link" onClick={handleMyInfoClick} className="info-button">내 정보 수정</Button>
                        <Button variant="link" onClick={handleLogout} className="info-button">로그아웃</Button>
                    </div>
                )}
            </div>

            <Button onClick={handleBackClick} variant="secondary" className="back-button">뒤로가기</Button>

            <InputGroup className="search-group">
                <FormControl
                    placeholder="Search by nickname"
                    aria-label="Search by nickname"
                    aria-describedby="basic-addon2"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch} className="search-button">
                    Search
                </Button>
            </InputGroup>

            <Table hover striped bordered className="admin-list-table">
                <thead>
                <tr>
                    <th>
                        <Form.Check
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                        />
                    </th>
                    <th>회원 번호</th>
                    <th>이메일</th>
                    <th>닉네임</th>
                    <th>권한</th>
                    <th>주소</th>
                    <th>성별</th>
                    <th>휴대폰번호</th>

                </tr>
                </thead>
                <tbody>
                {currentUsers.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <Form.Check
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleCheckboxChange(user.id)}
                            />
                        </td>
                        <td>{user.id}</td>
                        <td><Link to={`/admin/userdetails/${user.id}`}>{user.email}</Link></td>
                        <td>{user.nickname || 'N/A'}</td>
                        <td>
                            <Form.Select
                                value={user.role}
                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                            >
                                <option value="ROLE_BUSINESS">비즈니스</option>
                                <option value="ROLE_ADMIN">관리자</option>
                            </Form.Select>
                        </td>
                        <td>{user.address}</td>
                        <td>{user.userGender}</td>
                        <td>{user.phone}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <div className="pagination-buttons">
                <Button onClick={handleSaveClick} disabled={selectedUsers.length === 0} className="save-button">
                    Save Changes
                </Button>
                <Button variant="danger" onClick={handleDeleteClick} disabled={selectedUsers.length === 0}
                        className="delete-button">
                    Delete Selected
                </Button>
            </div>

            <Pagination className="justify-content-center">
                <Pagination.First onClick={() => moveToPage(1)} />
                <Pagination.Prev onClick={() => moveToPage(currentPage - 1)} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => moveToPage(page)}>
                        {page}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => moveToPage(currentPage + 1)} />
                <Pagination.Last onClick={() => moveToPage(totalPages)} />
            </Pagination>
        </div>
    );
}

export default AdminList;
