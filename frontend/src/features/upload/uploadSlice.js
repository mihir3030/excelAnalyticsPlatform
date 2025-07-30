import { createSlice } from "@reduxjs/toolkit";

// for Upload state management
const initialState = {
    uploading: false,
    uploadData: null,
    error: null
}

const uploadSlice = createSlice({
    name:'upload',
    initialState,
    reducers: {
        uploadStart: (state) => {
            state.uploading = true;
            state.error = null;
        },

        uploadSuccess: (state, action) => {
            state.uploading = false
            state.uploadData = action.payload
        },
        uploadFailure: (state, action) => {
            state.uploading = false,
            state.error = action.payload
        }
    }
})


export const { uploadStart, uploadSuccess, uploadFailure } = uploadSlice.actions;
export default uploadSlice.reducer