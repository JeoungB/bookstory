import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Main from "./Components/Main";
import Home from "./Components/Home";
import LikeBook from "./Components/LikeBook";
import BookSearch from "./Components/BookSearch";
import BookDetail from "./Components/BookDetail";
import WritePage from "./Components/WritePage";
import Login from "./Components/Login";
import Singup from "./Components/Signup";

const roter  = createBrowserRouter([
    {
        path: '/',
        element : <Layout />,
        children : [
            {
                path : '/',
                element : <Main />
            },
            {
                path : '/home/:name',
                element : <Home />
            },
            {
                path : '/home/:name/likebook',
                element : <LikeBook />
            },
            {
                path : '/booksearch',
                element : <BookSearch />
            },
            {
                path : '/bookdetail/:title',
                element : <BookDetail />
            },
            {
                path : '/writePage/:name',
                element : <WritePage />
            }
        ],
    },
    {
        path : '/login',
        element : <Login />
    },
    {
        path : '/signup',
        element : <Singup />
    }
]);

export default roter;