import { createSlice } from '@reduxjs/toolkit';
const initialState = { user: null, accessToken: localStorage.getItem('accessToken') };
const slice = createSlice({ name: 'auth', initialState, reducers: { setSession(state, action) { state.user = action.payload.user; state.accessToken = action.payload.accessToken; localStorage.setItem('accessToken', action.payload.accessToken); }, clearSession(state) { state.user = null; state.accessToken = null; localStorage.removeItem('accessToken'); } } });
export const { setSession, clearSession } = slice.actions; export default slice.reducer;
