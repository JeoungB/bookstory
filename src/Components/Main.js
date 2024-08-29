import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../css/main.css";
import { getDocs, collection } from "firebase/firestore";
import { database, submitComment } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../store";

const Main = () => {

    // 댓글 달거나 다른거 업뎃할때 전체 로딩 하는거 보다는..
    // 1. 댓글을 단다
    // 2. 댓글이 달리면 리덕스에 먼저 저장된다.
    // 3. 그 뒤에 파이어 베이스에 저장한다.
    // 그러면 리로딩 안하고 바로 업댓 내용 보여주고, 리로딩해도 업뎃이 될듯.

    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const name = useSelector((state) => state.userName);
    const imageUrl = useSelector((state) => state.userProfileImg);
    const [comment, setComment] = useState("");
    const footer = document.querySelector(".post_footer"); // top -num 늘어남
    const textareaRef = useRef([]);
    const submitButton = useRef([]);
    const iconAreaRef = useRef([]);
    const currentDate = new Date();

    //console.log(posts)

    useEffect(() => {
        if(comment.value) {
            textareaRef.current[comment.id].style.height = '20px';
            submitButton.current[comment.id].style.height = '29px';
            textareaRef.current[comment.id].style.height = textareaRef.current[comment.id].scrollHeight + 'px';
            submitButton.current[comment.id].style.height = textareaRef.current[comment.id].scrollHeight + 'px';

            if(textareaRef.current[comment.id].scrollHeight < 54.8) {
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
    const commentData = (index) => {
        let commentDatas = {
            id : uniqId,
            name : name,
            userImg : imageUrl,
            comment : comment.value,
            day : today
        }

        submitComment(commentDatas, index);
    }

    // 댓글 개시하면 파이어 스토어에 저장까진 됨.

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
    }, []);

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
                    posts.map((post, index) => {
                        return(
                            <article className="posts" key={post.id}>
                            <div className="img_content"></div>
        
                            <div className="comments">
                                {/* 게시물 작성자 정보 */}
                                <div className="post_user">
                                    <div className="user_icon"></div>
                                    <p>작성자 이름</p>
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
                                        {
                                            // 여기 포스트가 아니라 댓글을 넣어야 함
                                            // posts.map((post) => {
                                            //     return (
                                            //         <li key={post.id}>
                                            //             <div className="comments_content">
                                            //                 <div className="comment_user-profile"></div>
                                            //                 <div className="user_content comment_user-content"><span className="post_user-name comment_user-name">{post.name}</span>{post.comment}</div>
                                            //                 <p className="comment_date"><div className="date_line"></div>3일전</p>
                                            //                 {
                                            //                     post.comment[0].length <= 82 ? <p className="more_comment" style={{display : "none"}} onClick={(e) => { moreComment(e.target); }}>더보기</p> : (
                                            //                         <p className="more_comment" style={{display : "block"}} onClick={(e) => { moreComment(e.target); }}>더보기</p>
                                            //                     )
                                            //                 }
                                            //             </div>
                                            //         </li>
                                            //     )
                                            // })
                                        }
        
                                    </ul>
                                </div>
        
                                <div className="post_footer">
                                    {/* 게시물 좋아요 */}
                                    <div className="footer_icon" ref={(element) => iconAreaRef.current[index] = element}>
                                        <p>좋아요 30개</p>
                                        <p>헤헤 30개</p>
                                    </div>
                                    <div className="footer_input">
                                        <textarea type="text" className="comment_input" ref={(element) => textareaRef.current[index] = element} rows="1" spellCheck="false" placeholder="댓글 달기..." onChange={(e) => setComment({
                                            value : e.target.value,
                                            id : index
                                        })}></textarea>
                                        {
                                            comment.value && comment.id === index ? (
                                                <div className="comment_button" style={{color : 'rgb(255, 200, 0)'}} onClick={() => {commentData(index)}} ref={(element) => submitButton.current[index] = element}><span>게시</span></div>
                                            ) : (
                                                <div className="comment_button" style={{color : 'rgba(249, 226, 17, 0.658)'}} onClick={() => {commentData(index)}} ref={(element) => submitButton.current[index] = element}><span>게시</span></div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </article>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Main;