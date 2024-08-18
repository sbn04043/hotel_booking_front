import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from "./user/Auth";
import RoomOne from "./room/RoomOne";
import Register from "./user/Register";
import Map from "./hotel/Map";
import ForgotEmail from "./user/ForgotEmail";
import ForgotPassword from "./user/ForgotPassword";
import SearchHotel from "./search/hotel";
import HotelOne from "./hotel/hotelOne";
import RoomRegister from "./room/RoomRegister";
import HotelList from "./hotel/HotelList";
import RoomUpdate from "./room/RoomUpdate";
import RoomImgInsert from "./room/RoomImgInsert";
import RoomReservation from "./reservation/RoomReservation";
import ReservationOne from "./reservation/ReservationOne";
import NotFound from "./NotFound";
import Mypage from "./user/Mypage";
import MypageEdit from "./user/MypageEdit";
import MyReservations from "./user/MyReservations";
import Wishlist from "./user/Wishlist";
import Auth1 from "./user/Auth1";
import HotelImgInsert from "./hotel/HotelImgInsert";
import HotelInsert from "./hotel/HotelInsert";
import HotelUpdate from "./hotel/HotelUpdate";
import UserList from "./admin/UserList";
import DashBoard from "./admin/DashBoard";
import UserDetails from "./admin/UserDetails";
import HotelDetails from "./admin/HotelDetails";
import GuestRegister from "./user/GuestRegister";
import PrivateRoute from './PrivateRoute';

const App = ({ setUserInfo, isAuthenticated, userRole }) => {

    return (
        <div style={{ marginTop: '100px', marginBottom: '60px' }}>
            <Routes>
                <Route path="/" element={<SearchHotel />} />
                <Route path="/business/auth" element={<Auth setUser={setUserInfo} />} />
                <Route path="/user/register" element={<Register />} />

                <Route path="/guest/auth" element={<Auth1 setUser={setUserInfo} />} />
                <Route path="/guest/forgotEmail" element={<ForgotEmail />} />
                <Route path="/guest/forgotPassword" element={<ForgotPassword />} />

                {/* Protected routes for GUEST */}
                <Route
                    path="/guest/mypage/:id"
                    element={
                        <PrivateRoute
                            element={<Mypage />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="GUEST"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/guest/mypage/edit"
                    element={
                        <PrivateRoute
                            element={<MypageEdit />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="GUEST"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/guest/myReservations/:id"
                    element={
                        <PrivateRoute
                            element={<MyReservations />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="GUEST"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/guest/wishlist/:id"
                    element={
                        <PrivateRoute
                            element={<Wishlist />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="GUEST"
                            userRole={userRole}
                        />
                    }
                />

                {/* Admin routes */}
                <Route
                    path="/admin/userList"
                    element={
                        <PrivateRoute
                            element={<UserList />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="ADMIN"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/admin/hotelList"
                    element={
                        <PrivateRoute
                            element={<HotelList />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="ADMIN"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/admin/"
                    element={
                        <PrivateRoute
                            element={<DashBoard />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="ADMIN"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/admin/userdetails/:id"
                    element={
                        <PrivateRoute
                            element={<UserDetails />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="ADMIN"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/admin/hoteDetails/:id"
                    element={
                        <PrivateRoute
                            element={<HotelDetails />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="ADMIN"
                            userRole={userRole}
                        />
                    }
                />

                {/* Business routes */}
                <Route
                    path="/hotelInsert"
                    element={
                        <PrivateRoute
                            element={<HotelInsert />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="BUSINESS"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/imgInsert/:id"
                    element={
                        <PrivateRoute
                            element={<HotelImgInsert />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="BUSINESS"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/hotelUpdate/:id"
                    element={
                        <PrivateRoute
                            element={<HotelUpdate />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="BUSINESS"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/room/register/:hotelId"
                    element={
                        <PrivateRoute
                            element={<RoomRegister />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="BUSINESS"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/room/roomImgInsert/:id"
                    element={
                        <PrivateRoute
                            element={<RoomImgInsert />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="BUSINESS"
                            userRole={userRole}
                        />
                    }
                />
                <Route
                    path="/room/roomUpdate/:roomId"
                    element={
                        <PrivateRoute
                            element={<RoomUpdate />}
                            isAuthenticated={isAuthenticated}
                            requiredRole="BUSINESS"
                            userRole={userRole}
                        />
                    }
                />

                {/* Common routes */}
                <Route path="/Map" element={<Map />} />
                <Route path="/hotelOne/:id" element={<HotelOne />} />
                <Route path="/room/roomOne/:roomId" element={<RoomOne />} />
                <Route path="/reservation/roomReservation/:roomId" element={<RoomReservation />} />
                <Route path="/reservation/roomReservationOne/:reservationId" element={<ReservationOne />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
