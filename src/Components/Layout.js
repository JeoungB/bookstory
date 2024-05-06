import React, { useEffect, useState } from "react";
import "../css/layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { database } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import userIcon from "../imgs/user-icon.png";

const Layout = () => {

    const navigate = useNavigate();
    const userEmail = useSelector((state) => state.user);
    const [userName, setUserName] = useState("");

    const getUser = async () => {
        try{
          const user = await query(collection(database, "users"), where("email", "==", `${userEmail}`));
          const emailUser = await getDocs(user);
          emailUser.forEach((user) => {
            console.log(user.data());
            setUserName(user.data().name);
          })
        } catch(error) {
          console.log(error);
        }
      }

      useEffect(() => {
        getUser();
      }, []);

    return(
        <div className="layout">
            <div className="user_state">
            {
                userEmail ? (
                    <div className="user">
                      <img src={userIcon} alt="유저 아이콘" />
                      </div>
                ) : (
                    <ul className="user_state-login">
                    <li onClick={() => navigate('/login')}>로그인</li>
                    <li onClick={() => navigate('/signup')}><span>회원가입</span></li>
                </ul>
                )
            }
            </div>
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default Layout;