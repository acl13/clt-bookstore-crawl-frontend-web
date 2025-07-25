import { combineReducers } from "@reduxjs/toolkit";
import bookstoreReducer from "./slices/bookstoreData";

const rootReducer = combineReducers({
  bookstores: bookstoreReducer,
});

export default rootReducer;
