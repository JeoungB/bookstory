import React from "react";
import "../css/layout.css";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {

    const navigate = useNavigate();

    return(
        <div className="layout">
            <div className="user_state">
                <ul className="user_state-login">
                    <li onClick={() => navigate('/login')}>로그인</li>
                    <li onClick={() => navigate('/signup')}><span>회원가입</span></li>
                </ul>
            </div>
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default Layout;