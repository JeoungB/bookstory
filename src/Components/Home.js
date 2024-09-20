import React, { useEffect, useState } from "react";
import "../css/home.css";
import userIcon from "../imgs/user-icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database, logout, updateUserProfileImg } from "../firebase";
import {
  addLikeBooks,
  clearProfileImg,
  logoutLikeBook,
  logoutLikeBooks,
  logoutSearchData,
  logoutUser,
  logoutUserName,
  selectBook,
  setProfileImg,
} from "../store";

const Home = () => {
  // 유저 홈에서 로그아웃 시 로그인 페이지로 이동

  let { name } = useParams();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const email = useSelector((state) => state.user);
  const storage = getStorage();
  const imageUrl = useSelector((state) => state.userProfileImg);
  const likeBooks = useSelector((state) => state.likeBooks);
  const [menuState, setMenuState] = useState(1);
  const [iconState, setIconState] = useState(false);
  const [selectItem, SetselectItem] = useState([]);
  let underline = document.getElementById("underline");
  let menus = document.querySelectorAll("div:first-child a");

  useEffect(() => {
    getUserProfileImg();
  }, []);

  // 스토어에 이미지 업로드 및 데이터 베이스에 이미지 URL 저장
  const upload = async (file) => {
    try {
      const imgRef = ref(storage, `images/${file.name}`);
    const user = await query(
      collection(database, "users"),
      where("email", "==", `${email}`)
    );
    const emailUser = await getDocs(user);

    const post = await query(collection(database, 'contents'), where('name', '==', 'post'));
    const getPost = await getDocs(post);

    // 본인 데이터베이스에 이미지 업로드
    uploadBytes(imgRef, file).then((img) => {
      getDownloadURL(img.ref).then((url) => {
        dispatch(setProfileImg(url));

        // 본인 게시글 및 댓글에 이미지 업데이트
        getPost.forEach((getPost) => {
          const postData = getPost.data().posts;
          const data = doc(database, "contents", getPost.id);
          // 게시글에 업데이트
          if(postData) {
            postData.find((postData) => {
              if(postData.userEmail === email) {
                postData.userImg = url
              }
  
              // 댓글에 업데이트
              if(postData.comment.length !== 0) {
                postData.comment.find((comment) => {
                  if(comment.email === email) {
                    comment.userImg = url
                  }
                })
              }
            });
          }

          updateDoc(data, {
            posts : postData
          })
        })

        // 본인 프로필에 업로드
        emailUser.forEach((user) => {
          const data = doc(database, "users", user.id);
          updateDoc(data, {
            profileImg: url,
          });
        });
      });
    });
    } catch(error) {
      console.log('이미지 업로드 실패', error);
    }
  };

    // 프로필 이미지 삭제
    const deleteImg = async () => {
      try {
        if (imageUrl) {
          // 데이터 베이스에서 삭제
          const user = await query(
            collection(database, "users"),
            where("email", "==", `${email}`)
          );
          const emailUser = await getDocs(user);
          emailUser.forEach((user) => {
            const data = doc(database, "users", user.id);
  
            updateDoc(data, {
              profileImg: "",
            });
          });
  
          // 리덕스에서 삭제
          dispatch(setProfileImg(""));
  
          // 본인 게시글 및 댓글 프로필 이미지 삭제
          const post = await query(collection(database, 'contents'), where('name', '==', 'post'));
          const getPost = await getDocs(post);
  
          getPost.forEach((getPost) => {
            const postData = getPost.data().posts;
            const data = doc(database, "contents", getPost.id);
            if(postData) {
              postData.find((postData) => {
                if(postData.userEmail === email) {
                  postData.userImg = "";
                }
  
                if(postData.comment.length !== 0) {
                  postData.comment.find((comment) => {
                    if(comment.email === email) {
                      comment.userImg = "";
                    }
                  })
                }
              });
            }
            updateDoc(data, {
              posts : postData
            })
          })
        }
      } catch (error) {
        console.log(error);
      }
    };

  // 유저의 데이터 가져오기 (프로필 사진, 좋아요 한 책, 구독한 유저)
  const getUserProfileImg = async () => {
    try {
      const user = await query(
        collection(database, "users"),
        where("email", "==", `${email}`)
      );
      const emailUser = await getDocs(user);
      emailUser.forEach((user) => {
        //console.log("저장된 이미지 주소", user.data().profileImg);

        // 좋아요 한 책 목록 가져오기.
        if (user.data().likeBook) {
          dispatch(addLikeBooks(user.data().likeBook));
        }

        // 데이터 베이스에서 프로필 사진 가져오기.
        if (user.data().profileImg) {
          dispatch(setProfileImg(user.data().profileImg));
        }

        getUserPosts();
      });
    } catch (error) {
      console.log("프로필 이미지 불러오기 실패", error);
    }
  };

  // 유저의 게시글 가져오기
  // 1. 해당 유저의 게시글을 추출해서 리덕스나 State에 뿌려 페이지에 보이게한다.
  // 2. 제목과 함께 보이게 한다.
  // 3. 클릭하면 새로운 페이지로 이동하며 클릭한 게시물을 볼 수 있게 한다.
  // 4. 게시물 수정 및 삭제 가능하게 한다.
  const getUserPosts = async () => {
    try{
      const posts = await getDocs(collection(database, 'contents'));
      posts.forEach((posts) => {
        console.log('가져온 posts', posts.data().posts);
      })
    } catch (error) {
      console.log("유저 게시글 가져오기 실패", error);
    }
  }

  menus.forEach((menu) => menu.addEventListener("click", (e) => moveLine(e)));

  const moveLine = (e) => {
    menus[0 + menuState].style.color = "red";
    for (let i = 0; i < menus.length; i++) {
      menus[i].style.color = "gray";
    }
    underline.style.left = e.currentTarget.offsetLeft + "px";
    underline.style.width = e.currentTarget.offsetWidth + "px";
    underline.style.top =
      e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
    e.target.style.color = "rgb(255, 174, 25)";
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
              {imageUrl ? (
                <img id="user_img-profile" src={imageUrl} alt="프로필 이미지" />
              ) : (
                <img id="user_img-profile" src={userIcon} alt="프로필 이미지" />
              )}
            </div>
          </label>

          <div
            className="delete_img"
            onClick={() => {
              if(imageUrl) {
                // eslint-disable-next-line no-restricted-globals
                if(confirm('프로필 이미지를 삭제하시겠습니까?')) {
                  deleteImg();
                }
              }
            }}
          >
            X
          </div>

          <ul className="user_data">
            <li id="user_following">팔로잉 0</li>
            <li id="user_follower">팔로워 0</li>
            <li id="user_post">게시글 0</li>
            <li id="user_name">{name}</li>
            <li id="user_email">{email}</li>
          </ul>

          <p
            className="logout"
            onClick={() => {
              if (window.confirm("로그아웃 하시겠습니까?")) {
                logout();
                dispatch(logoutUser());
                dispatch(logoutUserName());
                dispatch(logoutLikeBook());
                dispatch(logoutLikeBooks());
                dispatch(clearProfileImg());
                dispatch(logoutSearchData());
                navigate("/login");
              }
            }}
          >
            로그아웃
          </p>
        </div>

        <div className="user_menu">
          <div id="underline"></div>
          <a
            className="first"
            onClick={(e) => {
              e.preventDefault();
              setMenuState(1);
            }}
          >
            좋아요
          </a>

          <a
            onClick={(e) => {
              e.preventDefault();
              setMenuState(2);
            }}
          >
            게시글
          </a>
          <a>팔로워</a>
          <p onClick={() => {
            if(!iconState) {
              alert("공유할 책을 선택해 주세요")
            }

            if(iconState && selectItem.length === 0) {
              alert("공유할 책을 선택해 주세요")
            }

            if(iconState && selectItem.length !== 0) {
              dispatch(selectBook(selectItem));
              navigate(`/writepage/${name}`);
            }
          }}>공유하기</p>
            {
              iconState ? (
                <p
                  onClick={() => {
                    setIconState(!iconState); 
                    SetselectItem([]);}}
                >취소</p>
              ) : (
                <p
                onClick={() => setIconState(!iconState)}
                >선택</p>
              )
            }

          <div className="contant">
            {menuState === 1 ? (
              likeBooks.length !== 0 ? (
                likeBooks.map((likeBook) => {
                  return (
                    <div className="items" key={likeBook.isbn}>
                      <div className="item">
                      <img
                        id="book"
                        src={likeBook.thumbnail}
                        alt="책 이미지"
                        onClick={() => {
                          if(!iconState) {
                            navigate(`/bookdetail/${likeBook.title}`);
                          }
                          // 이미지 클릭 시 체크박스 활성화.
                          if(iconState) {
                            let box = document.getElementsByClassName('checkbox');
                            let itemIndex = likeBooks.indexOf(likeBook);

                            if(box[itemIndex].checked === false) {
                              // 책 선택한 경우
                              box[itemIndex].checked = true;
                              SetselectItem((selectItem) => [...selectItem, likeBook]);
                            } else {
                              // 선택을 취소한 경우
                              box[itemIndex].checked = false;
                              let cancelItem = selectItem.filter((item) => item !== likeBook);
                              SetselectItem(() => {
                                let newItem = [...selectItem];
                                newItem = [...cancelItem];
                                return newItem;
                              })
                            }
                          }
                        }}
                      />
                      {iconState ? (
                        <label className="choice_book">
                          <input id="checkbox" className="checkbox" type="checkbox"></input>
                          <span className="icon"></span>
                        </label>
                      ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>저장한 책이 없습니다.</p>
              )
            ) : menuState === 2 ? (
              <p>게시글이 없습니다.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
