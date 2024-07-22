import React, { useEffect } from "react";
import "../css/main.css";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../store";

const Main = () => {

    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);

    console.log(posts)

    useEffect(() => {
        getContents();
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
                            <p>유저 이름</p>
                        </div>
                        <h2>게시글 제목</h2>
                        <p>책 정보 입니다.</p>

                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
                        <p>댓글</p>
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