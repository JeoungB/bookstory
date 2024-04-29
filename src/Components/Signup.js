import React, { useEffect, useState } from "react";
import "../css/signup.css";
import { database, singup } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { SHA256 } from "crypto-js";

const Singup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState(false);
    const PASSWORD_SHA256 = SHA256(password.trim()).toString();
    const SPACE_PATTERN = /\s/g;
    const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,15}$/;

    const handleSubmit = async () => {

        // input null check
        if (!name || !email || !password) {
            alert("빈칸을 모두 입력해 주세요");
            if (!name) {
                document.getElementById('name').classList.add('input_check');
            }

            if (!email) {
                document.getElementById('email').classList.add('input_check');
            }

            if (!password) {
                document.getElementById('password').classList.add('input_check');
            }
            return 0;
        }

        // name check
        if (name.length >= 7) {
            alert("이름은 6자리 이하로 입력해 주세요");
            document.getElementById('name').classList.add('input_check');
            return 0;
        }

        // email check
        if (!email.match(EMAIL_PATTERN)) {
            alert("이메일 형식이 맞지 않습니다");
            document.getElementById('email').classList.add('input_check');
            return 0;
        }

        // password check
        if (!password.match(PASSWORD_PATTERN)) {
            alert("비밀번호는 영문 숫자 포함 6~15자리 이어야 합니다");
            document.getElementById('password').classList.add('input_check');
            return 0;
        }

        // space check
        if (name.match(SPACE_PATTERN) || email.match(SPACE_PATTERN) || password.match(SPACE_PATTERN)) {
            alert("공백이 존재합니다.");

            if (name.match(SPACE_PATTERN)) {
                document.getElementById('name').classList.add('input_check');
            }

            if (email.match(SPACE_PATTERN)) {
                document.getElementById('email').classList.add('input_check');
            }

            if (password.match(SPACE_PATTERN)) {
                document.getElementById('email').classList.add('input_check');
            }

            return 0;
        }

        if (passwordCheck === false) {
            alert("비밀번호 체크를 해주세요");
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
        }).catch((error) => {
            alert("중복된 이메일 입니다.");
            document.getElementById('email').classList.add('input_check');
        })
    };

    const passwordCheckHandler = () => {

        // password_check clear
        if (!checkPassword) {
            alert("빈칸을 입력해 주세요");
            document.getElementById('password_check').classList.add('input_check');
            return 0;
        }

        if (!password.match(PASSWORD_PATTERN)) {
            alert("비밀번호는 영문 숫자 포함 6~15자리 이어야 합니다");
            document.getElementById('password').classList.add('input_check');
            return 0;
        }

        if (password !== checkPassword) {
            alert("비밀번호가 다릅니다");
            document.querySelector(".password_button-check").classList.remove('password_check-true');
            return 0;
        }

        if (password === checkPassword) {
            setPasswordCheck(true);
            document.querySelector(".password_button-check").classList.add('password_check-true');
            document.getElementById('password').setAttribute('disabled', true);
            document.getElementById('password_check').setAttribute('disabled', true);
        };
    };

    const validation = () => {

        if (checkPassword) {
            document.getElementById('password_check').classList.remove('input_check');
        }

        if (name || email || password) {
            if (name) {
                document.getElementById('name').classList.remove('input_check');
            }

            if (email) {
                document.getElementById('email').classList.remove('input_check');
            }

            if (password) {
                document.getElementById('password').classList.remove('input_check');
            }
            return 0;
        }

        if (name.length <= 6) {
            document.getElementById('name').classList.remove('input_check');
            return 0;
        }

        if (email.match(EMAIL_PATTERN)) {
            document.getElementById('email').classList.remove('input_check');
            return 0;
        }

        if (password.match(PASSWORD_PATTERN)) {
            document.getElementById('password').classList.remove('input_check');
            return 0;
        }

        if (!name.match(SPACE_PATTERN) || !email.match(SPACE_PATTERN) || !password.match(SPACE_PATTERN)) {

            if (!name.match(SPACE_PATTERN)) {
                document.getElementById('name').classList.remove('input_check');
            }

            if (!email.match(SPACE_PATTERN)) {
                document.getElementById('email').classList.remove('input_check');
            }

            if (!password.match(SPACE_PATTERN)) {
                document.getElementById('email').classList.remove('input_check');
            }
            return 0;
        }
    }

    useEffect(() => {
        validation();
    })


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
                <input type="text" id="email" required onChange={(e) => setEmail(e.target.value)} />
                <label className="label_email" for="email">이메일</label>
            </div>

            <div className="input_box password">
                <input type="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
                <label className="label_password" for="password">비밀번호</label>
            </div>

            <div className="input_box password_check">
                <input type="password" id="password_check" required onChange={(e) => setCheckPassword(e.target.value)} />
                <label className="label_password-check" for="password">비밀번호 확인</label>
                <div className="password_button-check" onClick={() => { passwordCheckHandler() }}>V</div>
            </div>
            <button type="submit" onClick={() => { handleSubmit() }}>회원가입</button>
        </div>
    )
};

export default Singup;