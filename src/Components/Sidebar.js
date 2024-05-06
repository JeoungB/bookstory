import React from "react";
import "../css/sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    return(
        <div className="sidebar">
            <div className="pointer">
                <div className="line"></div>
            </div>
            <h1>𝑩𝒐𝒐𝒌 𝑺𝒕𝒐𝒓𝒚</h1>
            <h2 onClick={() => navigate('/')}>𝐇𝐨𝐦𝐞</h2>
            <h2 onClick={() => navigate('/booksearch')}>𝑩𝒐𝒐𝒌 𝐒𝐞𝐚𝐫𝐜𝐡</h2>
            <h2>𝐒𝐮𝐛𝐬𝐜𝐫𝐢𝐛𝐞</h2>
        </div>
    )
};

export default Sidebar;