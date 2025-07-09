import { configureStore } from "@reduxjs/toolkit";
import modalReducer from './slices/modalSlice.js'
import fetchReducer from "./slices/fetchSlice.js"
import loginReducer from "./slices/userLogin.js"

const store = configureStore({
            reducer: {
                        modal: modalReducer,
                        fetch: fetchReducer,
                        isLogin: loginReducer
            }
});

export default store;
