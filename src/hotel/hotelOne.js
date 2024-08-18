import React, {useRef, useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Carousel, Container, Form, Row, Table} from "react-bootstrap";
import axios from "axios";
import Map from './Map';
import travelingImage from './traveling.png';
import style from './Hotel.module.css'
import { AiFillHeart } from "react-icons/ai";
import DatePicker from "react-datepicker";

const HotelOne = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = parseInt(params.id);
    const location = useLocation();
    const [startDate, setStartDate] = useState();

    const [endDate, setEndDate] = useState("");
    const [peopleCount, setPeopleCount] = useState("");

    const facility = [
        {id: 1, label: '️🏊‍♀️야외수영장'},
        {id: 2, label: '🤿실내수영장'},
        {id: 3, label: '♨️사우나'},
        {id: 4, label: '👨‍👩‍👧‍👦키즈룸'},
        {id: 5, label: '🎰카지노'},
        {id: 6, label: '🏋️피트니스센터'},
        {id: 7, label: '🛜무료와이파이'},
        {id: 8, label: '🫧️세탁시설'},
        {id: 9, label: '🛁스파'},
        {id: 10, label: '🛎️24시간 프론트 데스크'},
        {id: 11, label: '🥗레스토랑'},
        {id: 12, label: '🚗무료주차'},
        {id: 13, label: '🍸바'},
        {id: 14, label: '🏧ATM'},
        {id: 15, label: '🌴야외정원'}
    ];

    const [roomIndex, setRoomIndex] = useState(0);
    const [index, setIndex] = useState(0);
    const [hotelData, setHotelData] = useState({});


    const [facilities, setFacilities] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [roomdata, setRoomdata] = useState({roomList: []});
    const [roomType, setRoomType] = useState([]);


    const handleSelect = (selectedIndex) => setRoomIndex(selectedIndex);
    const handleHotelSelect = (selectedIndex) => setIndex(selectedIndex);

    const roomInsert = (hotelId) => navigate(`/room/register/${hotelId}`);
    const moveToSingle = (roomId) => navigate(`/room/roomOne/${roomId}`, {
        state: {
            startDate: startDate,
            endDate: endDate,
            peopleCount: peopleCount
        }
    });
    const onDelete = async () => {
        const resp = await axios.get(`http://localhost:8080/hotel/delete/${id}`);
        if (resp.status === 200) {
            navigate('/hotelAll');
        }
    };

    const onUpdate = () => {
        navigate('/hotelUpdate/' + id)
    }

    let [wish, setWish] = useState( {
        hotelId: id ,
        guestId: 1
    })

    const [isWished, setIsWished] = useState(false);



    const wishList = async () => {
        try {
            const resp = await axios.post('http://localhost:8080/guest/wishlist', wish);

            console.log(resp.data);
            console.log(wish)
            setIsWished(!isWished);
        } catch (error) {
            console.error('Error adding/removing from wishlist:', error);
        }
    }

    useEffect(() => {
        const fetchHotelData = async () => {
            const resp = await axios.get(`http://localhost:8080/hotel/hotelOne/${id}`);
            setHotelData(resp.data.hotelDto);
            setFileData(resp.data.hotelFileDtoList);
            setFacilities(resp.data.facilities);
            if (location.state.startDate !== null) {
                setStartDate(location.state.startDate);
            }
            if (location.state.endDate !== null) {
                setEndDate(location.state.endDate);
            }

        };
        fetchHotelData();
    }, [id]);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const resp = await axios.get(`http://localhost:8080/room/showList/${id}`);
                if (resp.status === 200) {
                    setRoomdata(resp.data);
                    setRoomType(resp.data.roomTypeList);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchRoomData();
    }, [id]);

    const addPeople = () => {
        if (peopleCount < 9) {
            setPeopleCount(peopleCount + 1);
        }
    }

    const minusPeople = () => {
        if (peopleCount > 1) {
            setPeopleCount(peopleCount - 1);
        }
    }

    let searchByCondition = async (e) => {
        e.preventDefault();
        const params = {
            hotelId: id,
            startDate: startDate,
            endDate: endDate,
            peopleCount: peopleCount
        }
        try {
            const response = await axios.post('http://localhost:8080/room/showListByCondition', params)
            console.log(response);
            setRoomdata(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container className={"mt-3"}>
            <Form onSubmit={searchByCondition}>
                <Table>
                    <thead>
                    <tr>
                        <td valign='middle' align='center'>
                            <DatePicker
                                dateFormat='yyyy-MM-dd'
                                shouldCloseOnSelect
                                minDate={new Date()}
                                selected={startDate}
                                placeholderText='시작 날짜'
                                onChange={(date) => {
                                    setStartDate(date);
                                }}
                            />
                        </td>
                        <td valign='middle' align='center'>
                            <DatePicker
                                dateFormat='yyyy-MM-dd'
                                shouldCloseOnSelect
                                minDate={Math.max(startDate, new Date())}
                                selected={endDate}
                                placeholderText='마지막 날짜'
                                onChange={(date) => {
                                    setEndDate(date);
                                }}
                            />
                        </td>
                        <td valign='middle' align='center'>
                            <Table>
                                <tbody>
                                <tr>
                                    <th>
                                        <Button onClick={minusPeople}>-</Button>
                                    </th>
                                    <th>
                                        <input type='text' className='form-control' disabled='true'
                                               value={'인원수: ' + peopleCount}/>
                                    </th>
                                    <th>
                                        <Button onClick={addPeople}>+</Button>
                                    </th>
                                </tr>
                                </tbody>
                            </Table>
                        </td>
                        <td valign='middle' align='center'>
                            <Button type="submit">검색</Button>
                        </td>
                    </tr>
                    </thead>
                </Table>
            </Form>

            <Carousel activeIndex={index} onSelect={handleHotelSelect} className="carousel-container">
                {fileData.length > 0 ? (
                    fileData.map((file) => (
                        <Carousel.Item key={file.storedFileName}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                marginBottom: "50px"
                            }}>
                                <img
                                    src={`http://localhost:8080/hotel/${file.storedFileName}`}
                                    alt={`http://localhost:8080/hotel/${file.storedFileName}`}
                                    style={{
                                        width: '600px',
                                        height: 'auto',
                                        border: '1px solid #9ec2fc',
                                        borderRadius: '8px',
                                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                                    }}
                                />
                            </div>
                        </Carousel.Item>
                    ))
                ) : (
                    <Carousel.Item>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            marginBottom: "50px"
                        }}>
                            <img
                                src={travelingImage}
                                alt="기본 이미지"
                                style={{
                                    width: '600px',
                                    height: 'auto',
                                    border: '1px solid #9ec2fc',
                                    borderRadius: '8px',
                                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
                                }}
                            />
                        </div>
                    </Carousel.Item>
                )}
            </Carousel>
            <h1 className="mb-5">{hotelData.hotelName}
                <AiFillHeart onClick={wishList}  style={{ cursor: 'pointer', fontSize: '45px', color: isWished ? 'red' : 'lightgray' }}/>

            </h1>
            <div className={style.hotelContainer}>
                <div className={style.hotelInfo}>
                    {facilities.map(f => (
                        <div key={f}>{facility[f - 1].label}</div>
                    ))}
                </div>

                <div className={style.hotelMap}><Map address={hotelData.address}/></div>
            </div>


            <div style={styles.cardContainer}>
                {roomdata.roomList.length > 0 ? (
                    roomdata.roomList.map(r => (
                        <Card key={r.id} style={{width: '18rem', marginTop: "50px"}}>
                            <Carousel activeIndex={roomIndex} onSelect={handleSelect}
                                      className="carousel-container">
                                {r.imageList.length > 0 ? (
                                    r.imageList.map((roomImages) => (
                                        <Carousel.Item key={roomImages}>
                                            <div style={styles.imageContainer}>
                                                <Card.Img
                                                    src={`http://localhost:8080/room/${roomImages}`}
                                                    alt={roomImages}
                                                    style={styles.image}
                                                />
                                            </div>
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <div style={styles.imageContainer}>
                                        <Card.Img
                                            src={travelingImage}
                                            alt="기본 이미지"
                                            style={styles.image}
                                        />
                                    </div>
                                )}
                            </Carousel>

                            <Card.Body onClick={() => moveToSingle(r.id)}>
                                <Card.Title>

                                </Card.Title>
                                <Card.Text>
                                    {roomType.map(rt => (
                                        r.roomTypeId === rt.id ? <td key={rt.id}> {rt.typeName}</td> : null
                                    ))}
                                    {r.roomPrice}
                                </Card.Text>
                                <Button style={button}>예약하러 가기</Button>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div className={style.room}>
                        <h2>No rooms are registered</h2>
                    </div>
                )}
            </div>

            <Button onClick={roomInsert} style={button}>방 등록하기</Button>
            <Button onClick={onDelete} style={button}>호텔 삭제</Button>
            <Button onClick={onUpdate} style={button}>호텔 수정</Button>

        </Container>
    );
};

const styles = {
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    card: {
        width: '15rem',
        boxSizing: 'border-box',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px', // 적절한 높이 설정
    },
    image: {
        width: '100%',
        height: '200px',
    }

};

const button = {
    backgroundColor: '#9ec2fc',
    borderColor: '#9ec2fc',
};


export default HotelOne;