import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import kakaoSearch from "../api/axios";
import "../css/bookdetail.css";
import heartFalse from "../imgs/heart-false.png";
import heartTrue from "../imgs/heart-true.png";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { database } from "../firebase";
import { addLikeBook, removeLikeBook } from "../store";
import { likeBookHandler } from "../firebase";

// 페이지가 너무 심심함
// 디자인 UI 좀 보고 따라 만들어보자
// 책 넘어가는 애니메이션도 만들고

const BookDetail = () => {
  const { title } = useParams();
  const [book, setBook] = useState([]);
  const userEmail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const likeBooks = useSelector((state) => state.likeBook);

  useEffect(() => {
    getBooks();
  }, []);

  // 선택한 책 정보 가져오기 (카카오 API)
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
      likeBookRedux();
      setBook(searchData);
    } catch (error) {
      console.log(error);
    }
  };

  // 좋아요한 책 정보 저장
  const likeBookRedux = async () => {
    try {
      const user = await query(
        collection(database, "users"),
        where("email", "==", `${userEmail}`)
      );
      const emailUser = await getDocs(user);
      emailUser.forEach((user) => {
        for (let i = 0; i < user.data().likeBook.length; i++) {
          dispatch(addLikeBook(user.data().likeBook[i].isbn));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="book_detail">
      <div className="book_detail-content">
        {Array.isArray(book) && book.length !== 0 ? (
          <div>
            <h1>{book[0].title}</h1>
            <div className="content_img">
              <img src={book[0].thumbnail} alt="책 이미지" />
            </div>
            <p>{book[0].contents}</p>
            <div className="authors">저자 : {book[0].authors}</div>
            <div className="publisher">링크 : </div>
            <a
              className="book_link"
              href={book[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              다음 페이지로 이동
            </a>
            {likeBooks.includes(book[0].isbn) ? (
              <img
                className="heart_false"
                src={heartTrue}
                alt="좋아요 아이콘"
                onClick={() => {
                  likeBookHandler(false, book[0].isbn, book[0], userEmail);
                  dispatch(removeLikeBook(book[0].isbn));
                }}
              />
            ) : (
              <img
                className="heart_false"
                src={heartFalse}
                alt="좋아요 아이콘"
                onClick={() => {
                  likeBookHandler(true, book[0].isbn, book[0], userEmail);
                  dispatch(addLikeBook(book[0].isbn));
                }}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookDetail;
