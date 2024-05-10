import { combineReducers, configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistReducer } from "redux-persist";
import localStorage from 'redux-persist/es/storage';

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
        logoutLikeBook(state) {
            state = [];
            return state;
        },
    }
});

let test = createSlice({
    name : 'test',
    initialState : [],
    reducers : {
        testt(state, action) {
            state = action.payload;
            return state;
        }
    }
});

export let { loginUser,  logoutUser } = user.actions;
export let { addLikeBook, removeLikeBook, logoutLikeBook } = likeBook.actions;
export let { testt } = test.actions;

const reducers = combineReducers({
    user : user.reducer,
    likeBook : likeBook.reducer,
    test : test.reducer
});

const persistConfig = {
    key : 'user',
    storage : localStorage,
    whitelist : ['user', 'likeBook', 'test']
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck : false
    })
});

export default store;