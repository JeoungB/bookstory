import React, { useState } from "react";
import { login } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, where } from "firebase/firestore";
import { database } from "../firebase";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleLogin = () => {

        if (!email || !password) {
            alert("빈칸을 모두 입력해 주세요");
            return 0;
        }

        if(email === userEmail) {
            alert("이미 로그인되어있는 계정입니다");
            return 0;
        }

        if (email && password) {
            login(email, password).then((result) => {
                dispatch(loginUser(result.user.email));
                getUser();
            }).catch((error) => alert("이메일 및 패스워드가 틀림니다"));
        }
    };

    const getUser = async () => {
        try{
          const user = await query(collection(database, "users"), where("email", "==", `${email}`));
          const emailUser = await getDocs(user);
          emailUser.forEach((user) => {
            alert(`환영합니다 ${user.data().name}님`);
          });
          navigate('/');
        } catch(error) {
          console.log(error);
        }
      }

    return (
        <div className="login">
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
            <button className="submit" onClick={() => { handleLogin() }}><span>로그인</span></button>
        </div>
    )
}

export default Login;