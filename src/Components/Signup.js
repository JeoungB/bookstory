import React, { useState } from "react";
import "../css/signup.css";
import { database, singup } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { SHA256 } from "crypto-js";

const Singup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPaswordCheck] = useState(false);
    const PASSWORD_SHA256 = SHA256(password.trim()).toString();
    const SPACE_PATTERN = /\s/g;
    const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,15}$/;

    const handleSubmit = async () => {

        if (!name || !email || !password) {
            alert("빈칸을 모두 입력해 주세요");
            return 0;
        }

        if (name.length >= 7) {
            alert("이름은 6자리 이하로 입력해 주세요");
            return 0;
        }

        if (!email.match(EMAIL_PATTERN)) {
            alert("이메일 형식이 맞지 않습니다");
            return 0;
        }

        if (!password.match(PASSWORD_PATTERN)) {
            alert("비밀번호는 영문 숫자 포함 6~15자리 이어야 합니다");
            return 0;
        }

        if (name.match(SPACE_PATTERN) || email.match(SPACE_PATTERN) || password.match(SPACE_PATTERN)) {
            alert("공백이 존재합니다.");
            return 0;
        }

        await singup(email, password).then((user) => {
            console.log(user);
            addDoc(collection(database, "users"), {
                id: Date.now(),
                name: name.trim(),
                email: email.trim(),
                password: PASSWORD_SHA256
            });
        }).catch((error) => alert("중복된 이메일 입니다."))
    };


    return (
        <div className="singup">
            <div className="box_point">
                <div className="line"></div>
            </div>
            <h1>𝑩𝒐𝒐𝒌 𝑺𝒕𝒐𝒓𝒚</h1>
            <div className="input_box name">
            <input type="text" id="name" required onChange={(e) => setName(e.target.value)} />
            <label className="label_name" for="name">이름</label>
            </div>

            <div className="input_box email">
            <input type="text" id="email" required  onChange={(e) => setEmail(e.target.value)} />
            <label className="label_email" for="email">이메일</label>
            </div>

            <div className="input_box password">
            <input type="password" id="password" required  onChange={(e) => setPassword(e.target.value)} />
            <label className="label_password" for="password">비밀번호</label>
            </div>

            <div className="input_box password_check">
            <input type="password" id="password_check" required  onChange={(e) => setPassword(e.target.value)} />
            <label className="label_password-check" for="password">비밀번호 확인</label>
            <div className="password_button-check">V</div>
            </div>
            <button type="submit" onClick={() => { handleSubmit() }}>회원가입</button>
        </div>
    )
};

export default Singup;