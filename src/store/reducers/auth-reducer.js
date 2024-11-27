import { createSlice } from "@reduxjs/toolkit";

const authSlise = createSlice({
    name: 'authSlice',
    initialState: {
        user: null
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        }
    }
})

export default authSlise.reducer
export const { setUser } = authSlise.actions