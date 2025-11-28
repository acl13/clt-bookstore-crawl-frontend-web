"use client";
import "bulma/css/bulma.css";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookstores } from "./store/slices/bookstoreData";

import MapSection from "./components/MapSection";
import BookstoreList from "./components/BookstoreList";
import AuthForms from "./components/AuthForms";
import UserInfo from "./components/UserInfo";

export default function Home() {
  const dispatch = useDispatch();
  const bookstores = useSelector((state) => state.bookstores.data);
  const isLoading = useSelector((state) => state.bookstores.isLoading);
  const [selectedBookstores, setSelectedBookstores] = useState([]);
  const [routeData, setRouteData] = useState({});
  const [userInfo, setUserInfo] = useState(null);

  const API_URL = "https://clt-bookstore-crawl-backend.onrender.com";

  useEffect(() => {
    dispatch(fetchBookstores());
  }, [dispatch]);

  const selectBookstore = (bookstore) => {
    if (!selectedBookstores.includes(bookstore)) {
      setSelectedBookstores((prev) => [...prev, bookstore]);
    }
  };

  const getOptimizedRoute = async () => {
    if (selectedBookstores.length < 2) {
      alert("Please select at least two bookstores.");
      return;
    }
    const initialLocation = selectedBookstores[0];
    const waypoints = selectedBookstores.slice(1);

    try {
      const res = await fetch(`${API_URL}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialLocation, waypoints }),
      });
      if (!res.ok) throw new Error("Failed to fetch route");
      const data = await res.json();
      setRouteData(data);
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  const saveOptimizedRoute = async () => {
    const selectedBookstoreIds = selectedBookstores.map((b) => b._id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedBookstoreIds }),
      });
      if (!res.ok) throw new Error("Failed to save route");
      const data = await res.json();
      console.log("User routes:", data);
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  return (
    <main className="py-5">
      <MapSection bookstores={bookstores} isLoading={isLoading} />
      <BookstoreList
        bookstores={bookstores}
        selectedBookstores={selectedBookstores}
        selectBookstore={selectBookstore}
        getOptimizedRoute={getOptimizedRoute}
        saveOptimizedRoute={saveOptimizedRoute}
        routeData={routeData}
      />
      <AuthForms API_URL={API_URL} setUserInfo={setUserInfo} />
      <UserInfo userInfo={userInfo} />
    </main>
  );
}
