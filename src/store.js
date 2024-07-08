import { combineReducers, configureStore, createReducer, createSlice } from '@reduxjs/toolkit'
import { persistReducer } from "redux-persist";
import localStorage from 'redux-persist/es/storage';

// 로그인 유저 이메일 상태
let user = createSlice({
    name : 'user',
    initialState : "",
    reducers : {
        loginUser(state, action) {
            state = action.payload;
            return state;
        },
        logoutUser(state) {
            state = "";
            return state;
        }
    }
});

// 좋아요한 책 정보 상태 FireBase에서 가져옴
let likeBook = createSlice({
    name : 'likeBook',
    initialState : [],
    reducers : {
        addLikeBook(state, action) {
            state = state.concat(action.payload);
            const set = new Set(state);
            state = [...set];
            return state;
        },
        removeLikeBook(state, action) {
            const newState = state.filter((state) => {
                return state !== action.payload;
            })
            state = [...newState];
            return state;
        },
        // 로그아웃 시 상태 초기화
        logoutLikeBook(state) {
            state = [];
            return state;
        },
    }
});

let likeBooks = createSlice({
    name : "likeBooks",
    initialState : [],
    reducers : {
        // 좋아요한 책 목록 저장
        addLikeBooks(state, action) {
            state = action.payload;
            return state;
        },
        removeLikeBooks(state, action) {
            const newState = state.filter((state) => {
                return state === action.payload;
            })
            state = [...newState];
            return state;
        },
        logoutLikeBooks(state) {
            state = [];
            return state;
        },
    }
})

// 검색한 책 정보 유지
let searchBook = createSlice({
    name : 'searchBook',
    initialState : [],
    reducers : {
        searchBookData(state, action) {
            state = action.payload;
            return state;
        },
        logoutSearchData(state) {
            state = [];
            return state;
        }
    }
});

// 업로드한 이미지 URL
let userProfileImg = createSlice({
    name : 'userProfileImg',
    initialState : "",
    reducers : {
        setProfileImg(state, action) {
            state = action.payload;
            return state;
        },
        clearProfileImg(state) {
            state = "";
            return state;
        }
    }
});

// 공유할 책 선택
// 선택한 경우 useState에 저장된 후 공유하기 누르면 이곳에 저장.
// 작성 페이지 나가거나 공유를 취소할 경우 빈 배열로 초기화해야함.
let selectBooks = createSlice({
    name : 'selectBooks',
    initialState : [],
    reducers : {
        selectBook(state, action) {
            let newState = [...state];
            newState = [...action.payload];
            return newState;
        },
        deleteSelectBooks(state, action) {
            state = action.payload;
        }
    }
});

export let { loginUser,  logoutUser } = user.actions;
export let { addLikeBook, removeLikeBook, logoutLikeBook } = likeBook.actions;
export let { addLikeBooks, removeLikeBooks, logoutLikeBooks } = likeBooks.actions;
export let { searchBookData, logoutSearchData } = searchBook.actions;
export let { setProfileImg, clearProfileImg } = userProfileImg.actions;
export let { selectBook, deleteSelectBooks } = selectBooks.actions;

const reducers = combineReducers({
    user : user.reducer,
    likeBook : likeBook.reducer,
    likeBooks : likeBooks.reducer,
    searchBook : searchBook.reducer,
    userProfileImg : userProfileImg.reducer,
    selectBooks : selectBooks.reducer,
});

const persistConfig = {
    key : 'user',
    storage : localStorage,
    whitelist : ['user', 'userProfileImg', 'likeBooks', 'selectBooks']
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck : false
    })
});

export default store;