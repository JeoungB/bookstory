import React, { useEffect, useState, useLayoutEffect } from "react";
import "../css/home.css";
import userIcon from "../imgs/user-icon.png";
import { useParams } from "react-router-dom";
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
import { database } from "../firebase";
import { setProfileImg } from "../store";

const Home = () => {
  // 유저 홈 입장 시 유저 아이콘 위치 옮기기
  // 유저 홈에서 로그아웃 시 로그인 페이지로 이동

  let { name } = useParams();
  let dispatch = useDispatch();
  const email = useSelector((state) => state.user);
  const storage = getStorage();
  const imageUrl = useSelector((state) => state.userProfileImg);
  const [likeBooks, setLikeBooks] = useState([]);

  console.log("좋아요 한 책", likeBooks);

  useEffect(() => {
    getUserProfileImg();
  }, [email]);

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

  // 유저의 데이터 가져오기 (프로필 사진, 좋아요한 책, 구독한 유저)
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

        // 데이터 베이스에서 좋아요한 책 목록 가져오기.
        setLikeBooks(user.data().likeBook);
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
        </div>

        <div className="user_subscribe">
            <p>구독중인 유저</p>
        </div>

        <div className="user_likeBooks">
          <p>좋아요한 책</p>
          <ul className="bookList">
            {Array.isArray(likeBooks) && likeBooks.length !== 0
              ? likeBooks.map((likeBooks) => {
                  return (
                    <li className="book_item" key={likeBooks.isbn}>
                      <h2>{likeBooks.title}</h2>
                    </li>
                  );
                })
              : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
