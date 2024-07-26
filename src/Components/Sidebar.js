import React, { useEffect, useRef } from "react";
import "../css/sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();
    const homeRef = useRef();
    const searchRef = useRef();

    useEffect(() => {
        if(window.location.pathname === "/booksearch") {
            searchRef.current.style.color = 'rgba(255, 193, 105, 0.719)';
            searchRef.current.style.transform = 'scale(1.2)';
            homeRef.current.style.color = 'black';
            homeRef.current.style.transform = 'scale(1)';
        }

        if(window.location.pathname === "/") {
            homeRef.current.style.color = 'rgba(255, 193, 105, 0.719)';
            homeRef.current.style.transform = 'scale(1.2)';
            searchRef.current.style.color = 'black';
            searchRef.current.style.transform = 'scale(1)';
        }
    }, [window.location.pathname]);

    return(
        <div className="sidebar">
            <div className="pointer">
                <div className="line"></div>
            </div>
            <h1>𝑩𝒐𝒐𝒌 𝑺𝒕𝒐𝒓𝒚</h1>
            <h2 ref={homeRef} onClick={() => navigate('/')}>𝐇𝐨𝐦𝐞</h2>
            <h2 ref={searchRef} onClick={() => navigate('/booksearch')}>𝑩𝒐𝒐𝒌 𝐒𝐞𝐚𝐫𝐜𝐡</h2>
            <h2>𝐒𝐮𝐛𝐬𝐜𝐫𝐢𝐛𝐞</h2>
        </div>
    )
};

export default Sidebar;