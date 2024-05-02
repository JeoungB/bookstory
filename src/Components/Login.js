import React, { useState } from "react";
import { login } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store";
import "../css/login.css";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    console.log(user)

    const handleLogin = () => {

        if (!email || !password) {
            alert("빈칸을 모두 입력해 주세요");
            return 0;
        }

        if(email === user) {
            alert("이미 로그인되어있는 계정입니다");
            return 0;
        }

        if (email && password) {
            login(email, password).then((result) => {
                console.log("로그인", result._tokenResponse.refreshToken);
                dispatch(loginUser(result.user.email));
            }).catch((error) => alert("이메일 및 패스워드가 틀림니다"));
        }
    };

    return (
        <div className="login">

            <div className="prev">&lt; Back</div>

            <div className="box_point">
                <div className="line"></div>
            </div>
            <h1>𝑩𝒐𝒐𝒌 𝑺𝒕𝒐𝒓𝒚</h1>
            <div className="input_box email">
                <input type="text" id="email" required onChange={(e) => setEmail(e.target.value)}></input>
                <label className="label_email" htmlFor="email">이메일</label>
            </div>

            <div className="input_box password">
                <input type="password" id="password" required onChange={(e) => setPassword(e.target.value)}></input>
                <label className="label_password" htmlFor="password">비밀번호</label>
            </div>
            <button className="submit" onClick={() => { handleLogin() }}>로그인</button>
        </div>
    )
}

export default Login;