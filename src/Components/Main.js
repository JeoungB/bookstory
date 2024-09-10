import React, { useEffect, useRef, useState } from "react";
import "../css/main.css";
import { getDocs, collection } from "firebase/firestore";
import { database, submitComment } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../store";
import userIcon from "../imgs/user-icon.png";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";

const Main = () => {

    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const name = useSelector((state) => state.userName);
    const imageUrl = useSelector((state) => state.userProfileImg);
    const email = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [re, setRe] = useState(1);
    const footer = document.querySelector(".post_footer"); // top -num 늘어남
    const textareaRef = useRef([]);
    const submitButton = useRef([]);
    const iconAreaRef = useRef([]);
    const currentDate = new Date();

    useEffect(() => {
        if (comment.value) {
            textareaRef.current[comment.id].style.height = '20px';
            submitButton.current[comment.id].style.height = '29px';
            textareaRef.current[comment.id].style.height = textareaRef.current[comment.id].scrollHeight + 'px';
            submitButton.current[comment.id].style.height = textareaRef.current[comment.id].scrollHeight + 'px';

            if (textareaRef.current[comment.id].scrollHeight < 54.8) {
                iconAreaRef.current[comment.id].style.top = '25px';
                iconAreaRef.current[comment.id].style.top = -(textareaRef.current[comment.id].scrollHeight - 25) + 'px';
            }
        }
    }, [comment.value])

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // 댓글 고유 아이디
    let uniqId =
        JSON.stringify(year) +
        JSON.stringify(month) +
        JSON.stringify(day) +
        JSON.stringify(hours) +
        JSON.stringify(minutes) +
        JSON.stringify(seconds);

    // 오늘 날짜
    let today = year + '.' + month + '.' + day;

    // 댓글 상태 관리
    const commentData = (index, id) => {
        let commentDatas = {
            id: uniqId,
            name: name,
            email: email,
            userImg: imageUrl,
            comment: comment.value,
            day: today
        }
        submitComment(commentDatas, index);
        // 새로운 댓글 활성화 되는 시간동안 로딩 아이콘 보이게하기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        setTimeout(() => {
            setRe(re => re * -1);
        }, 2000);
    }

    const moreComment = (target) => {
        let userComment = document.querySelectorAll('.comment_users > li .comment_user-content');
        let moreButton = document.querySelectorAll('.more_comment');

        // testButton = Prototype : NodeList 이기 떄문에
        // array에 사용 가능한 filter 사용을 위해 배열로 변환 : Array.from().
        let moreButtons = Array.from(moreButton).filter((el) => {
            return Array.from(el);
        })


        if (target.innerText == '더보기') {
            // 댓글 높이만큼 박스 높이 조절.
            userComment[moreButtons.indexOf(target)].style.height = userComment[moreButtons.indexOf(target)].scrollHeight + 'px';
            userComment[moreButtons.indexOf(target)].style.WebkitLineClamp = '100';
            target.textContent = '접기'
        } else if (target.innerText == '접기') {
            userComment[moreButtons.indexOf(target)].style.height = '115px';
            userComment[moreButtons.indexOf(target)].style.WebkitLineClamp = '5';
            target.textContent = '더보기'
        }
    }


    // 게시물 정보 가져오기.
    useEffect(() => {
        getContents();
    }, [re]);

    // 파이어 베이스에서 게시글 정보 가져오기.
    const getContents = async () => {
        try {
            const contents = await getDocs(collection(database, "contents"));
            contents.forEach((post) => {
                dispatch(getPosts(post.data().posts));
            })
        } catch (error) {
            console.log("게시글 가져오기 실패", error);
        }
    }

    return (
        <div className="main">
            <div className="main_contents">
                {
                    posts ? (
                        posts.map((post, index) => {
                            return (
                                <article className="posts" key={post.id}>
                                    {/* 게시물 이미지 영역 */}
                                    <div className="img_content">
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            scrollbar={{ draggable: true }}
                                        >
                                            {
                                                post.books.map((book) => {
                                                    return (
                                                        <div key={book.isbn}>
                                                            <SwiperSlide key={book.isbn}>
                                                            <article className="books">
                                                                <img src={book.thumbnail} alt="책 이미지" />
                                                            </article>
                                                            </SwiperSlide>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                    </div>

                                    <div className="comments">
                                        {/* 게시물 작성자 정보 */}
                                        <div className="post_user">
                                            <div className="user_icon">
                                                {
                                                    post.userImg ? (
                                                        <img src={post.userImg} alt="사용자 프로필 이미지 입니다." />
                                                    ) : (
                                                        <img src={userIcon} alt="사용자 프로필 이미지 입니다." />
                                                    )
                                                }
                                            </div>
                                            <p>{post.name}</p>
                                        </div>

                                        <div className="post_content">

                                            {/* 게시물 작성자 내용 */}
                                            <div className="user_comment">
                                                <div className="icon_comment">
                                                    {
                                                        post.userImg ? (
                                                            <img src={post.userImg} alt="사용자 프로필 이미지 입니다." />
                                                        ) : (
                                                            <img src={userIcon} alt="사용자 프로필 이미지 입니다." />
                                                        )
                                                    }
                                                </div>
                                                <div className="user_content"><span className="post_user-name">{post.name}</span> 작성 내용작성 내용작성 내용작성 내용작성 내용</div>
                                                <div className="under">. . .</div>
                                                <p>12일전</p>
                                            </div>

                                            {/* 댓글 */}
                                            <ul className="comment_users">
                                                {
                                                    post.comment ? (
                                                        post.comment.map((comment, index) => {
                                                            return (
                                                                <li key={index}>
                                                                    <div className="comments_content">
                                                                        <div className="comment_user-profile">
                                                                            {
                                                                                comment.userImg ? (
                                                                                    <img src={comment.userImg} alt="사용자 프로필 이미지 입니다." />
                                                                                ) : <img src={userIcon} alt="사용자 프로필 이미지 입니다." />
                                                                            }
                                                                        </div>
                                                                        <div className="user_content comment_user-content"><span className="post_user-name comment_user-name">{comment.name}</span>{comment.comment}</div>
                                                                        <div className="comment_date"><div className="date_line"></div>3일전</div>
                                                                        {
                                                                            comment.comment.length <= 82 ? <p className="more_comment" style={{ display: "none" }} onClick={(e) => { moreComment(e.target); }}>더보기</p> : (
                                                                                <p className="more_comment" style={{ display: "block" }} onClick={(e) => { moreComment(e.target); }}>더보기</p>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                    ) : null

                                                }

                                            </ul>
                                        </div>

                                        <div className="post_footer">
                                            {/* 게시물 좋아요 */}
                                            <div className="footer_icon" ref={(element) => iconAreaRef.current[index] = element}>
                                                <p>좋아요 30개</p>
                                            </div>
                                            <div className="footer_input">
                                                <textarea type="text" className="comment_input" ref={(element) => textareaRef.current[index] = element} rows="1" spellCheck="false" placeholder="댓글 달기..." onChange={(e) => setComment({
                                                    value: e.target.value,
                                                    id: index
                                                })}></textarea>
                                                {
                                                    comment.value && comment.id === index ? (
                                                        <div className="comment_button" style={{ color: 'rgb(255, 200, 0)' }} onClick={() => { commentData(index, post.id) }} ref={(element) => submitButton.current[index] = element}><span>게시</span></div>
                                                    ) : (
                                                        <div className="comment_button" style={{ color: 'rgba(249, 226, 17, 0.658)' }} onClick={() => { commentData(index, post.id) }} ref={(element) => submitButton.current[index] = element}><span>게시</span></div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })
                    ) : null
                }
            </div>
        </div>
    )
};

export default Main;