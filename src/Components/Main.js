import React, { useEffect, useRef, useState } from "react";
import "../css/main.css";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../store";

const Main = () => {
    // 댓글창 세로로 커지면 게시 버튼도 올라감.
    // 댓글창 세로로 커지면 일정 수준까지는 푸터도 같이 높이가 늘어나다가 멈추는 걸로
    // ex ) 인스타그램.
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const [comment, setComment] = useState("");
    const footer = document.querySelector(".post_footer"); // top -num 늘어남
    const textarea = useRef();
    const submitButton = useRef();
    const iconArea = useRef();

    // 입력 값만큼 textarea, button 높이 조절.
    const handleResizeHeight = () => {
        textarea.current.style.height = '20px';
        submitButton.current.style.height = '29px';
        textarea.current.style.height = textarea.current.scrollHeight + 'px';
        submitButton.current.style.height = textarea.current.scrollHeight + 'px';

        if(textarea.current.scrollHeight <= 50) {
            iconArea.current.style.top = "25px";
            iconArea.current.style.top = -(textarea.current.scrollHeight - 25) + 'px';
        }

        if(textarea.current.scrollHeight === 67) {
            iconArea.current.style.top = "25px";
            iconArea.current.style.top = -(textarea.current.scrollHeight - 38) + 'px';
        }
    }

    // 댓글 작성 시 게시 버튼 색상 활성화.
    const buttonActivate = () => {
        if(comment) {
            submitButton.current.style.color = 'rgb(255, 200, 0)'
        }

        if(!comment) {
            submitButton.current.style.color = 'rgba(249, 226, 17, 0.658)'
        }
    }

    console.log(posts)

    // 게시물 정보 가져오기.
    useEffect(() => {
        //getContents();
    }, []);

    // textarea 존재 시 게시 버튼 활성화.
    useEffect(() => {
        buttonActivate();
    }, [comment]);

    // textarea 글자수에 따른 높이 조절.
    useEffect(() => {
        handleResizeHeight();
    }, [comment]);

    // 파이어 베이스에서 게시글 정보 가져오기.
    const getContents = async () => {
        try{
            const contents = await getDocs(collection(database, "contents"));
            contents.forEach((post) => {
                dispatch(getPosts(post.data().posts));
            })
        } catch (error) {
            console.log("게시글 가져오기 실패", error);
        }
    }

    return(
        <div className="main">
            <div className="main_contents">
                <article className="posts">
                    <div className="img_content"></div>

                    <div className="comments">
                        {/* 게시물 작성자 정보 */}
                        <div className="post_user">
                            <div className="user_icon"></div>
                            <p>유저 이름</p>
                        </div>

                        <div className="post_content">

                        {/* 게시물 작성자 내용 */}
                        <div className="user_comment">
                            <div className="icon_comment"></div>
                            <div className="user_content"><span className="post_user-name">유저 이름</span> 작성 내용작성 내용작성 내용작성 내용작성 내용</div>
                            <div className="under">. . .</div>
                            <p>12일전</p>
                        </div>

                        {/* 댓글 */}
                        <ul className="comment_users">

                            <li>
                                <div className="comments_content">
                                <div className="comment_user-profile"></div>
                                <div className="user_content comment_user-content"><span className="post_user-name comment_user-name">유저 이름</span>댓댓글댓댓글댓댓글댓 </div>
                                <p className="comment_date"><div className="date_line"></div>3일전</p>
                                </div>

                                {/* <div className="comment_good">추천</div> */}
                            </li>
                            
                        </ul>
                        </div>

                        <div className="post_footer">
                            {/* 게시물 좋아요 */}
                            <div className="footer_icon" ref={iconArea}>
                                <p>좋아요 30개</p>
                                <p>헤헤 30개</p>
                            </div>
                            <div className="footer_input">
                                <textarea type="text" maxLength={26}  ref={textarea} rows="1" spellCheck="false" placeholder="댓글 달기..." onChange={(e) => setComment(e.target.value)}></textarea>
                                <div className="comment_button" ref={submitButton}><span>게시</span></div>
                            </div>
                        </div>
                    </div>
                </article>

                <article>
                    <div className="img_content"></div>
                    <div className="comments"></div>
                </article>
            </div>
        </div>
    )
};

export default Main;