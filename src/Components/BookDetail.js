import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import kakaoSearch from "../api/axios";
import "../css/bookdetail.css";
import heartFalse from "../imgs/heart-false.png";
import heartTrue from "../imgs/heart-true.png";
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../firebase";
import { addLikeBook, removeLikeBook } from "../store";
import { likebook } from "../firebase";

const BookDetail = () => {

    const { title } = useParams();
    const [book, setBook] = useState([]);
    const userEmail = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const likeBooks = useSelector((state) => state.likeBook);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = async () => {
        try {
            const params = {
                query: title,
                size: 1,
                target: "title",
            };
            const result = await kakaoSearch(params);
            const searchDatas = result.data.documents;
            const searchData = searchDatas.filter((searchDatas) => {
                return searchDatas.thumbnail !== "";
            });
            getKeyUser();
            setBook(searchData);
        } catch (error) {
            console.log(error);
        }
    };

    const getKeyUser = async () => {
        try {
            const user = await query(collection(database, "users"), where("email", "==", `${userEmail}`));
            const emailUser = await getDocs(user);
            emailUser.forEach((user) => {
                for (let i = 0; i < user.data().likeBook.length; i++) {
                    dispatch(addLikeBook(user.data().likeBook[i].isbn));
                }

            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="book_detail">
            <div className="book_detail-content">
                {
                    Array.isArray(book) && book.length !== 0 ? (
                        <div>
                            <h1>{book[0].title}</h1>
                            <div className="content_img">
                                <img src={book[0].thumbnail} />
                            </div>
                            <p>{book[0].contents}</p>
                            <div className="authors">저자 : {book[0].authors}</div>
                            <div className="publisher">출판사 : {book[0].publisher}</div>
                            {
                                likeBooks.includes(book[0].isbn) ? (
                                    <img className="heart_false" src={heartTrue} alt="좋아요 아이콘" onClick={() => {
                                        likebook(true, userEmail, book);
                                        dispatch(removeLikeBook(book[0].isbn))
                                    }} />
                                ) : (
                                    <img className="heart_false" src={heartFalse} alt="좋아요 아이콘" onClick={() => {
                                        likebook(false, userEmail, book);
                                        dispatch(addLikeBook(book[0].isbn))
                                    }} />
                                )
                            }
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
};

export default BookDetail;