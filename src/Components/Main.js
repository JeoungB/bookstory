import React, { useEffect } from "react";
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
    const footer = document.querySelector(".post_footer"); // top -num 늘어남
    const iconArea = document.querySelector(".footer_icon"); // 높이 늘어남 20씩
    const textarea = document.querySelector(".footer_input > textarea"); // 높이 늘어남
    const submitButton = document.querySelector(".comment_button"); // 높이 늘어남

    console.log(posts)

    useEffect(() => {
        //getContents();
    }, []);

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
                        <div className="post_user">
                            <div className="user_icon"></div>
                            <p>유저 이름</p>
                        </div>

                        <div className="post_content">
                        <h2>게시글 제목</h2>
                        <p>책 정보 입니다.</p>

                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        </div>

                        <div className="post_footer">
                            <div className="footer_icon"></div>
                            <div className="footer_input">
                                <textarea type="text" rows={1} spellCheck="false" placeholder="댓글 달기"></textarea>
                                <div className="comment_button"><span>게시</span></div>
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