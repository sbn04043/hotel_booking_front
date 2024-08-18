import {Button, Container, FormControl, Table} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

let Auth = () => {
    let [inputs, setInputs] = useState({
        email: '',
        password: ''
    });

    let onChange = (e) => {
        let {name, value} = e.target;
        setInputs({
            ...inputs,
            [name]: value
        })
    };

    let navigate = useNavigate()
    let nevigate1=useNavigate()

    let onRegister = () => {
        navigate('/user/register')
    }

    let onUserRegister = () => {
        nevigate1('/user/guestRegister')
    }

    let onSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', inputs.email);
        formData.append('password', inputs.password);
        console.log(inputs)

        let response = await axios({
            url: 'http://localhost:8081/user/auth',
            method: 'POST',
            data: formData,
            withCredentials: true
        });

        if (response.status === 200 && response.data.result === 'success') {
            let userInfo = {
                id: response.data.id,
                nickname: response.data.nickname,
                role: response.data.role
            }
            navigate('/hotel/hotelAll', {state: {userInfo:userInfo}});
        }
    }

    return (
        <Container>
            <form onSubmit={onSubmit}>
                <Table striped hover bordered>
                    <thead>
                    <tr>
                        <td colSpan={2}>로그인</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>아이디</td>
                        <td><FormControl
                            type={'email'}
                            name={'email'}
                            value={inputs.email}
                            onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>비밀번호</td>
                        <td><FormControl
                            type={'password'}
                            name={'password'}
                            value={inputs.password}
                            onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button type={'submit'}>로그인</Button>
                        </td>
                        <td>
                            <Button onClick={onRegister}>회원가입</Button>
                        </td>
                        <td>
                            <Button onClick={onUserRegister}>회원가입</Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
        </Container>
    )
}

export default Auth;




















