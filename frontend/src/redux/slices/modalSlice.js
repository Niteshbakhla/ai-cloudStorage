import { createSlice } from "@reduxjs/toolkit";


const modalSlice = createSlice({
            name: "modal",
            initialState: {
                        showUploadModal: false,
                        isDragging: false,
                        isUploading: false,
                        uploadProgress: [],
                        isLoading: false,
                        viewMode: "grid"
            },
            reducers: {
                        setIsDragging: (state, action) => {
                                    state.isDragging = action.payload;
                        },
                        setShowUploadModal: (state, action) => {
                                    state.showUploadModal = action.payload
                        },
                        setIsUploading: (state, action) => {
                                    state.isUploading = action.payload;
                        },
                        setUploadProgress: (state, action) => {
                                    state.uploadProgress = {
                                                ...state.uploadProgress,
                                                ...action.payload,
                                    };
                        },
                        setIsLoading: (state, action) => {
                                    state.isLoading = action.payload
                        },
                        setViewMode: (state, action) => {
                                    state.viewMode = action.payload
                        }
            }
});


export const {
            setIsDragging,
            setShowUploadModal,
            setIsUploading,
            setUploadProgress,
            setIsLoading, setViewMode } = modalSlice.actions;
export default modalSlice.reducer;