import { combineReducers, configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
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

// 검색한 책 정보 유지
let searchBook = createSlice({
    name : 'searchBook',
    initialState : [],
    reducers : {
        searchBookData(state, action) {
            state = action.payload;
            return state;
        }
    }
})

export let { loginUser,  logoutUser } = user.actions;
export let { addLikeBook, removeLikeBook, logoutLikeBook } = likeBook.actions;
export let { searchBookData } = searchBook.actions;

const reducers = combineReducers({
    user : user.reducer,
    likeBook : likeBook.reducer,
    searchBook : searchBook.reducer
});

const persistConfig = {
    key : 'user',
    storage : localStorage,
    whitelist : ['user', 'likeBook']
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck : false
    })
});

export default store;