import { createSlice } from "@reduxjs/toolkit";


const userLogin = createSlice({
            name: "userLogin",
            initialState: {
                        isLogin: false
            },
            reducers: {
                        setIsLogin: (state, action) => {
                                    state.isLogin = action.payload;
                        }
            }
});

export const { setIsLogin } = userLogin.actions;
export default userLogin.reducer;