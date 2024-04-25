import React, { useState } from "react";
import { singup } from "../firebase";
import Login from "./Login";

const Singup = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = () => {
        if(email && password) {
                singup(email, password).then((user) => {
                    console.log(user);
                }).catch((error) => alert("중복된 이메일 입니다."))

        }
    }


    return (
        <div className="singup">
            회원 가입 페이지
            <input type="email" placeholder="이메일" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="비밀번호" onChange={(e) => setPassword(e.target.value)}/>
            <input type="submit" placeholder="회원가입" onClick={() => {handleSubmit()}}/>

            <Login />
        </div>
    )
};

export default Singup;