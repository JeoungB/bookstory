import React from "react";
import "../css/writePage.css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

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
            <SwiperSlide><article className="item">1</article></SwiperSlide>
            <SwiperSlide><article className="item">2</article></SwiperSlide>
            <SwiperSlide><article className="item">3</article></SwiperSlide>
            </Swiper>
        </article>

        {/* 내용 작성 영역 */}
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
