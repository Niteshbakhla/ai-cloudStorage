import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API_ENDPOINTS from "../../axios/ApiConfig";
import axiosInstance from "../../axios/axios";


export const fetchFiles = createAsyncThunk('files/fetchFiles', async (_, { rejectWithValue }) => {
            try {
                        const { data } = await axiosInstance.get(API_ENDPOINTS.files)
                        return data.files;
            } catch (error) {
                        const errorMsg = error?.response?.data?.message || error.message;
                        return rejectWithValue(errorMsg);
            }
});


const fetchSlice = createSlice({
            name: "fetch",
            initialState: {
                        searchTerm: "",
                        files: [],
                        isLoading: false,
                        error: null
            },
            reducers: {
                        setSearchTerm: (state, action) => {
                                    state.searchTerm = action.payload;
                        },
                        setError: (state, action) => {
                                    state.error = action.payload;
                        },
                        setFiles: (state, action) => {

                                    state.files.push(...action.payload)
                        }
            },

            extraReducers: (builder) => {
                        builder.addCase(fetchFiles.pending, (state) => {
                                    state.isLoading = true;
                                    state.error = null;
                        })
                                    .addCase(fetchFiles.fulfilled, (state, action) => {
                                                state.isLoading = false;
                                                state.files = action.payload;
                                    })
                                    .addCase(fetchFiles.rejected, (state, action) => {
                                                state.isLoading = false,
                                                            state.error = action.payload;
                                    })
            }
});

export const { setSearchTerm, setError, setFiles } = fetchSlice.actions;
export default fetchSlice.reducer;