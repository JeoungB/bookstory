import React, { useEffect, useState } from "react";
import { login, logout, currentUser } from "../firebase";
import { useDispatch } from "react-redux";
import { loginUser } from "../store";


const Login = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const dispatch = useDispatch();

    const handleLogin = () => {
        if(email && password) {
            login(email, password).then((result) => {
                console.log("로그인", result._tokenResponse.refreshToken);
                dispatch(loginUser(result._tokenResponse.refreshToken));
            });
        }
    };

    return(
        <div className="login">
            로그인 하기
            <input type="email" placeholder="이메일" onChange={(e) => setEmail(e.target.value)}></input>
            <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}></input>
            <button className="submit" onClick={() => {handleLogin()}}>로그인</button>

            <button onClick={() => {currentUser()}}>test</button>

            <button onClick={() => {logout()}}>로그아웃</button>
        </div>
    )
}

export default Login;