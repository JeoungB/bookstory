import React, { useEffect, useState, useLayoutEffect } from "react";
import "../css/home.css";
import userIcon from "../imgs/user-icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database, logout } from "../firebase";
import { clearProfileImg, logoutLikeBook, logoutUser, setProfileImg } from "../store";
import likeBookImg from "../imgs/like-book-menu.jpg";
import heartImg from "../imgs/heart-true.png";
import { Navigation, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";


const Home = () => {
  // 유저 홈에서 로그아웃 시 로그인 페이지로 이동

  let { name } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const email = useSelector((state) => state.user);
  const storage = getStorage();
  const imageUrl = useSelector((state) => state.userProfileImg);
  const [likeBooks, setLikeBooks] = useState([]);
  const [menuState, setMenuState] = useState(1);
  let underline = document.getElementById("underline");
  let menus = document.querySelectorAll("div:first-child a");

  useEffect(() => {
    getUserProfileImg();
  }, []);

  // 스토어에 이미지 업로드 및 데이터 베이스에 이미지 URL 저장
  // 코드 리팩토링 필요.
  const upload = async (file) => {
    const imgRef = ref(storage, `images/${file.name}`);
    const user = await query(
      collection(database, "users"),
      where("email", "==", `${email}`)
    );
    const emailUser = await getDocs(user);

    uploadBytes(imgRef, file).then((img) => {
      getDownloadURL(img.ref).then((url) => {
        dispatch(setProfileImg(url));

        emailUser.forEach((user) => {
          const data = doc(database, "users", user.id);

          updateDoc(data, {
            profileImg: url,
          });
        });
      });
    });
  };

  // 유저의 데이터 가져오기 (프로필 사진, 구독한 유저)
  const getUserProfileImg = async () => {
    try {
      const user = await query(
        collection(database, "users"),
        where("email", "==", `${email}`)
      );
      const emailUser = await getDocs(user);

      emailUser.forEach((user) => {
        console.log("저장된 이미지 주소", user.data().profileImg);

        // 데이터 베이스에서 프로필 사진 가져오기.
        if (user.data().profileImg) {
          dispatch(setProfileImg(user.data().profileImg));
        }

        // 좋아요 한 책
        setLikeBooks(() => {
          let newData = [...likeBooks];
          newData = user.data().likeBook;
          return newData;
        });
      });
    } catch (error) {
      console.log("프로필 이미지 불러오기 실패", error);
    }
  };

  // 프로필 이미지 삭제
  const deleteImg = async () => {
    try {
      if (imageUrl) {
        const user = await query(collection(database, "users"), where("email", "==", `${email}`));
        const emailUser = await getDocs(user);
        emailUser.forEach((user) => {
          const data = doc(database, "users", user.id);

          updateDoc(data, {
            profileImg: "",
          });
        });
        dispatch(setProfileImg(""));
      }
    } catch (error) {
      console.log(error);
    }
  };

  menus.forEach(menu => menu.addEventListener("click", (e) =>moveLine(e)));

  const moveLine = (e) => {
    menus[0 + menuState].style.color = 'red'
    for(let i = 0 ; i < menus.length ; i++) {
      menus[i].style.color = 'gray';
    }
    underline.style.left = e.currentTarget.offsetLeft + "px";
    underline.style.width = e.currentTarget.offsetWidth + "px";
    underline.style.top = e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
    e.target.style.color = 'rgb(255, 174, 25)';
  };

  return (
    <div className="home">
      <div className="home_container">
        <div className="back_container one"></div>
        <div className="back_container two"></div>
        <div className="back_container three"></div>
        <div className="back_container for"></div>
        <div className="back_container five"></div>
        <div className="home_user-profile">
          <input
            type="file"
            id="upload"
            accept="image/gif, image/png, image/jpeg"
            onChange={(e) => {
              upload(e.target.files[0]);
            }}
          ></input>
          <label htmlFor="upload">
            <div id="user_img">
              {
                imageUrl ? (
                  <img id="user_img-profile" src={imageUrl} alt="프로필 이미지" />
                ) : (
                  <img id="user_img-profile" src={userIcon} alt="프로필 이미지" />
                )
              }
            </div>
          </label>

          <div className="delete_img" onClick={() => {
            deleteImg();
          }}>X</div>

          <ul className="user_data">
            <li id="user_following">팔로잉 0</li>
            <li id="user_follower">팔로워 0</li>
            <li id="user_post">게시글 0</li>
            <li id="user_name">{name}</li>
            <li id="user_email">{email}</li>
          </ul>

          <p className="logout" onClick={() => {
            if (window.confirm("로그아웃 하시겠습니까?")) {
              logout();
              dispatch(logoutUser());
              dispatch(logoutLikeBook());
              dispatch(clearProfileImg());
              navigate('/login');
            }
          }}>로그아웃</p>
        </div>

        <div className="user_menu">
          <div id="underline"></div>
          <a className="first" onClick={(e) => {
            e.preventDefault();
            setMenuState(1)
          }}>좋아요</a>

          <a onClick={(e) => {
            e.preventDefault();
            setMenuState(2)
          }}>게시글</a>
          <a>팔로워</a>

          <div className="contant">
            {
              menuState === 1 ? (
                likeBooks.length !== 0 ? (
                  likeBooks.map((likeBook) => {
                    return (
                      <div className="items" key={likeBook.isbn}>
                        <img id="book" src={likeBook.thumbnail} alt="책 이미지" onClick={() => {
                          navigate(`/bookdetail/${likeBook.title}`);
                        }} />
                      </div>
                    )
                  })
                ) : <p>저장한 책이 없습니다.</p>
              ) : menuState === 2 ? (
                <p>게시글이 없습니다.</p>
              ) : null
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
