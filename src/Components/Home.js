import React, { useState } from "react";
import "../css/home.css";
import userIcon from "../imgs/user-icon.png";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../firebase";

const Home = () => {
  // 유저 홈 입장 시 유저 아이콘 위치 옮기기
  // 유저 홈에서 로그아웃 시 로그인 페이지로 이동

  let { name } = useParams();
  const email = useSelector((state) => state.user);
  const storage = getStorage();
  const [imageUrl, setImageUrl] = useState("");

  // 스토어에 이미지 업로드 및 데이터 베이스에 이미지 URL 저장
  // 코드 리팩토링 필요.
  const upload = async (file) => {
    const imgRef = ref(storage, `images/${file.name}`);
    const user = await query(
      collection(database, "users"),
      where("email", "==", `${email}`)
    );
    const emailUser = await getDocs(user);

    uploadBytes(imgRef, file).then((s) => {
      getDownloadURL(s.ref).then((url) => {
        setImageUrl(url);

        emailUser.forEach((user) => {
          const data = doc(database, "users", user.id);

          updateDoc(data, {
            profileImg: url,
          });
        });
      });
    });
  };

  // 이제 파이어베이스에서 저장한 프사 가져오기만 하면됨

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
              <img id="user_img-profile" src={imageUrl} alt="프로필 이미지" />
            </div>
          </label>
          <div className="user_data">
            <div id="user_name">{name}</div>
            <div id="user_email">{email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
