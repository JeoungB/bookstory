import React, { useEffect, useRef, useState } from "react";
import "../css/writePage.css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from "react-redux";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";
// import 'swiper/css/scrollbar';

const WritePage = () => {

  const titleRef = useRef("");
  const [test, ttest] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const items = useSelector((state) => state.selectBooks);
  let navigate = useNavigate();

  useEffect(() => {
    // 우선 타이틀만 적용 테스트.
    if(titleRef.current.value) {
      // onopopstate : 앞, 뒤로가기 이벤트를 감지하는 이벤트.
      window.onpopstate = () => {
        if(window.confirm("go?")) {
          // 뒤로가기 적용.
        } else {
          // 뒤로가기 취소시 작성중 내용 없어짐 이슈.
          // 1. 취소시 리로드 없이 유지 되는 방법.
          // 2. 인풋값을 바로 스토리지에 저장하는 방법.
          window.history.go(1);
          window.onbeforeunload = null;
        }
      }
      } else {
        window.onpopstate = () => {};
      }
  }, [title, content]);

  return (
    <div className="writePage">
      <div className="back_container one"></div>
      <div className="back_container two"></div>
      <div className="back_container three"></div>
      <div className="back_container for"></div>
      <div className="back_container five"></div>

      <div className="write_container">
        <div className="write_pointer"></div>
        {/* 이미지 영역 */}
        <article className="write_img">
          <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
          >
            {
              items.map((item) => {
                return(
                  <div key={item.isbn}>
                  <SwiperSlide key={item.isbn}>
                    <article className="item">
                      <img src={item.thumbnail} alt="책 이미지" />
                    </article>
                  </SwiperSlide>
                  </div>
                )
              })
            }
            </Swiper>
        </article>

        {/* 내용 작성 영역 */}
        <div className="inputs">
            <div className="input_title">
            <input type="text" id="title" placeholder="" ref={titleRef} onChange={(e) => setTitle(e.target.value)}></input>
            <label className="title_label" htmlFor="title">Title</label>
            </div>
            <div className="content_container">
            <textarea className="content" placeholder="글 작성" spellCheck="false" onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <div className="buttons">
            <button className="write_button" onClick={() => ttest(!test)}><span>공유</span></button>
            <button className="cancel_button" onClick={() => ttest(!test)}><span>취소</span></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
