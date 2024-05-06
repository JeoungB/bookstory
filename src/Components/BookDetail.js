import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import kakaoSearch from "../api/axios";
import "../css/bookdetail.css";
import heartFalse from "../imgs/heart-false.png";

const BookDetail = () => {

    const { title } = useParams();
    const [book, setBook] = useState([]);

    console.log("title", title);
    console.log("book", book)

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
            console.log("re", result)
            const searchDatas = result.data.documents;
            const searchData = searchDatas.filter((searchDatas) => {
                return searchDatas.thumbnail !== "";
            });
            setBook(searchData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="book_detail">
            <div className="book_detail-content">
                {
                    Array.isArray(book) && book.length !== 0 ? (
                        <div>
                            <h1>{book[0].title}</h1>
                            <div className="content-img">
                                <img src={book[0].thumbnail} />
                            </div>
                            <p>{book[0].contents}</p>
                            <img className="heart-false" src={heartFalse} alt="좋아요 아이콘" />
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
};

export default BookDetail;