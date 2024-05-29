import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { database, likeBookHandler } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import openBook from "../imgs/open-book.png";
import heartTrue from "../imgs/heart-true.png";
import "../css/likebook.css";
import { useNavigate, useParams } from "react-router-dom";
import { removeLikeBook } from "../store";

const LikeBook = () => {

    const email = useSelector((state) => state.user);
    const [likeBooks, setLikeBooks] = useState([]);
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let { name } = useParams();

    useEffect(() => {
        getUserLikeBooks();
    }, []);

    const getUserLikeBooks = async () => {
        try {
            const user = await query(
                collection(database, "users"),
                where("email", "==", `${email}`)
            );
            const emailUser = await getDocs(user);

            emailUser.forEach((user) => {
                // 헌재 유저의 좋아요 한 책 목록 가져오기
                setLikeBooks(() => {
                    let newData = [...likeBooks];
                    newData = user.data().likeBook;
                    return newData;
                })
            });
        } catch (error) {
            console.log("좋아요 책 정보 가져오기 실패", error);
        }
    };

    return (
        <div className="likebook">
            {
                likeBooks.length !== 0 ? (
                    <div className="likebook_container">
                                    <h2>{name}의 책 목록</h2>
                        {likeBooks.map((likeBook) => {
                            return (
                                    <div className="likebook" key={likeBook.isbn}>
                                        <div className="pointer">
                                            <div className="line"></div>
                                        </div>
                                        <img id="book" src={likeBook.thumbnail} alt="책 이미지" onClick={() => {
                                             navigate(`/bookdetail/${likeBook.title}`);
                                        }} />
                                        <img id="open-book" src={openBook} alt="책 자세히 보기 아이콘" onClick={() => {
                                            navigate(`/bookdetail/${likeBook.title}`);
                                        }} />
                                        <img className="heart false" id="heart" src={heartTrue} alt="좋아요 아이콘" onClick={() => {
                                            likeBookHandler(false, likeBook.isbn, likeBook, email);
                                            dispatch(removeLikeBook(likeBook.isbn));
                                            setTimeout(() => {
                                                getUserLikeBooks();
                                            }, 100);
                                        }} />
                                    </div>
                            )
                        })}
                    </div>
                ) : null
            }
        </div>
    );
};

export default LikeBook;