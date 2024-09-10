import React, { useEffect, useRef, useState } from "react";
import "../css/writePage.css";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from "react-redux";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate, useParams } from "react-router-dom";
import { submitPost } from "../firebase";
// import 'swiper/css/scrollbar';

const WritePage = () => {

  const titleRef = useRef("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const items = useSelector((state) => state.selectBooks);
  const userEmail = useSelector((state) => state.user);
  const imageUrl = useSelector((state) => state.userProfileImg);
  const {name} = useParams();
  const currentDate = new Date();
  let navigate = useNavigate();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // 게시글 고유 아이디
  let uniqId = 
  JSON.stringify(year) + 
  JSON.stringify(month) + 
  JSON.stringify(day) +  
  JSON.stringify(hours) +
  JSON.stringify(minutes) +
  JSON.stringify(seconds);

  useEffect(() => {
    // 새로고침 시 저장 여부 확인
    // 다시 테스트 공유 후 화면 끄려고 하면 팝업창 띄워짐 이슈
    if(tag || content) {
      // history state는 현재 이동해온 페이지 정보가 stack으로 저장됨.
      // 뒤로가기 발생 시 stack의 가장 위에 있는 페이지로 이동하게됨.
      // window.history.pushState 를 사용해 최상위에 현재 페이지를 저장함.
      window.onbeforeunload = () => {
        return '';
      }
    }

    return () => {
      window.onbeforeunload = null;
    }
  }, [tag, content]);

  const cancelPage = () => {
    if(window.confirm("작성을 취소 하시겠습니까?")) {
       navigate(-1);
    } else {
      // 머무르기
    }
  }

  const submitContent = () => {
    let data = {
      id : uniqId,
      tag : '#' + tag,
      content : content,
      books : [...items],
      userEmail : userEmail,
      userImg : imageUrl,
      name : name,
      comment : []
    }

    submitPost(data);

    setTimeout(() => {
      alert('공유되었습니다.');
      navigate('/');
    }, 2000);
  }

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
            <input type="text" id="title" placeholder="" ref={titleRef} onChange={(e) => setTag(e.target.value)}></input>
            <label className="title_label" htmlFor="title">Tag</label>
            </div>
            <div className="content_container">
            <textarea className="content" placeholder="글 작성" spellCheck="false" onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <div className="buttons">
            <button className="write_button" onClick={() => {submitContent()}}><span>공유</span></button>
            <button className="cancel_button" onClick={() => {cancelPage()}}><span>취소</span></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
