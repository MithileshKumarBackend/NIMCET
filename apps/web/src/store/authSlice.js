import { createSlice } from '@reduxjs/toolkit';

const storedAccessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

const initialState = {
    user: null,
    accessToken: storedAccessToken,
    status: 'bootstrapping',
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.status = 'authenticated';
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        clearSession(state) {
            state.user = null;
            state.accessToken = null;
            state.status = 'anonymous';
            localStorage.removeItem('accessToken');
        },
        setAuthStatus(state, action) {
            state.status = action.payload;
        },
    },
});

export const { setSession, clearSession, setAuthStatus } = slice.actions;
export default slice.reducer;
