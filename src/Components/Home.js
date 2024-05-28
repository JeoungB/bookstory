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

const Home = () => {
  // 유저 홈 입장 시 유저 아이콘 위치 옮기기
  // 유저 홈에서 로그아웃 시 로그인 페이지로 이동

  let { name } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const email = useSelector((state) => state.user);
  const storage = getStorage();
  const imageUrl = useSelector((state) => state.userProfileImg);

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
      });
    } catch (error) {
      console.log("프로필 이미지 불러오기 실패", error);
    }
  };

  // 프로필 이미지 삭제
  const deleteImg = async () => {
    try{
        if(imageUrl) {
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
      }catch(error) {
        console.log(error);
      }
  }

  return (
    <div className="home">
      <div className="home_container">
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

          <div className="user_data">
            <div id="user_name">{name}</div>
            <div id="user_email">{email}</div>
          </div>

          <p className="logout" onClick={() => {
            logout();
            dispatch(logoutUser());
            dispatch(logoutLikeBook());
            dispatch(clearProfileImg());
            navigate('/login');
          }}>로그아웃</p>
        </div>

        <div className="user_subscribe">
            <ul className="subscribe">
              <p className="not_subscribe">구독중인 유저가 없습니다</p>
            </ul>
        </div>

        <div className="user_menu">
        <div className="user_likeBooks" onClick={() => {
          navigate(`/home/:${name}/likebook`);
        }}>
          <p>좋아요</p>
          <img className="heart_img" src={heartImg} alt="하트 이미지" />
          <img className="back_img" src={likeBookImg} alt="책 이미지" />
        </div>

        <div className="user_post">
          <p>나의 글</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
