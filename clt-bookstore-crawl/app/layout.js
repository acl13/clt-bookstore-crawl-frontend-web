"use client";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { APIProvider } from "@vis.gl/react-google-maps";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default function RootLayout({ children }) {
  return (
    <APIProvider apiKey={apiKey}>
      <html lang="en">
        <Provider store={store}>
          <body>{children}</body>
        </Provider>
      </html>
    </APIProvider>
  );
}
