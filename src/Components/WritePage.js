import React, { useEffect, useState } from "react";
import "../css/writePage.css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from "react-redux";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

const WritePage = () => {

  const [test, ttest] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const items = useSelector((state) => state.selectBooks);

  useEffect(() => {
    // (test) 작성된 내용이 있다면 뒤로가기 전에 확인.
    if(test) {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, "", "");
    window.onpopstate = () => {
      alert("작성 내용이 저장되지 않았습니다. 현재 페이지를 나가겠습니까?");
    }
    } else {
      // 뒤로가기 기능 해주는 부분.
      window.onpopstate = () => {};
    }
  }, [test]);

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
            <input type="text" id="title" placeholder=""></input>
            <label className="title_label" htmlFor="title">Title</label>
            </div>
            <div className="content_container">
            <textarea className="content" placeholder="글 작성" spellCheck="false"></textarea>
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
