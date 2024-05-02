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
        logoutUser(state, action) {
            state = action.payload;
            return state;
        }
    }
});

export let { loginUser,  logoutUser } = user.actions;

const reducers = combineReducers({
    user : user.reducer,
});

const persistConfig = {
    key : 'user',
    storage : localStorage,
    whitelist : ['user']
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer : persistedReducer,
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck : false
    })
});

export default store;