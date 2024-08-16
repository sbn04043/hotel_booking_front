import './App.css';
import {Route, Routes} from "react-router-dom";
// import HotelOne from "./board/HotelOne";
// import Write from "./board/Write";
// import Update from "./board/Update";
import Auth from "./user/Auth";
import ShowList from "./hotel/ShowList";
import ForgotEmail from "./user/ForgotEmail";
import ForgotPassword from "./user/ForgotPassword";
import Register from "./user/Register";
import SearchHotel from "./search/hotel";
import HotelOne from "./hotel/hotelOne";
import RoomRegister from "./room/RoomRegister";
import HotelList from "./hotel/HotelList";
import RoomOne from "./room/RoomOne";
import RoomUpdate from "./room/RoomUpdate";
import RoomImgInsert from "./room/RoomImgInsert";
import RoomReservation from "./reservation/RoomReservation";
import ReservationOne from "./reservation/ReservationOne";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Auth/>}/>
                <Route path="/hotel/showList" element={<ShowList/>}/>
                <Route path="/user/forgotEmail" element={<ForgotEmail/>}/>
                <Route path="/user/forgotPassword" element={<ForgotPassword/>}/>
                <Route path="/search/hotel" element={<SearchHotel/>}/>
                <Route path="/hotel/hotelAll" element={<HotelList/>}/>
                <Route path="/hotel/hotelOne/:id" element={<HotelOne/>}/>
                <Route path="/user/register" element={<Register/>}/>
                <Route path="/room/register/:hotelId" element={<RoomRegister/>}/>
                <Route path="/room/roomImgInsert/:id" element={<RoomImgInsert/>}/>
                <Route path="/room/roomOne/:roomId" element={<RoomOne/>}/>
                <Route path="/room/roomUpdate/:roomId" element={<RoomUpdate/>}/>
                <Route path="/reservation/roomReservation/:roomId" element={<RoomReservation/>}/>
                <Route path="/reservation/roomReservationOne/:reservationId" element={<ReservationOne/>}/>
            </Routes>
        </div>
    );
}

export default App;
