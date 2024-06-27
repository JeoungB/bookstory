import React from "react";
import "../css/writePage.css";

const WritePage = () => {
  return (
    <div className="writePage">
      <div className="back_container one"></div>
      <div className="back_container two"></div>
      <div className="back_container three"></div>
      <div className="back_container for"></div>
      <div className="back_container five"></div>

      <div className="write_container">
        <div className="write_pointer"></div>

        <div className="write_img">
            <div className="img_box"></div>
        </div>

        <div className="inputs">
            <div className="input_title">
            <input type="text" id="title" placeholder=""></input>
            <label className="title_label" htmlFor="title">Title</label>
            </div>
            <textarea className="content" placeholder="내용"></textarea>
            <button className="write_button">공유하기</button>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
