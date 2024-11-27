import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
    name: 'pageSlice',
    initialState: {
        page: 1,
    },
    reducers: {
        setPage(state, action) {
            if (state.page === action.payload)
                return

            state.page = action.payload
        },
    }
})

export default pageSlice.reducer
export const { setPage } = pageSlice.actions