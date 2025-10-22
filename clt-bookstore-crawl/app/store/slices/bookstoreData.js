import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBookstores = createAsyncThunk("fetchBookstores", async () => {
  const response = await axios.get(
    `https://clt-bookstore-crawl-backend.onrender.com/bookstores`
  );
  return response.data;
});

export const bookstoreSlice = createSlice({
  name: "bookstores",
  initialState: {
    isLoading: false,
    data: null,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookstores.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBookstores.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchBookstores.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export default bookstoreSlice.reducer;
