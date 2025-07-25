"use client";
import styles from "./page.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBookstores } from "./store/slices/bookstoreData";
import { Map } from "@vis.gl/react-google-maps";

export default function Home() {
  const dispatch = useDispatch();

  const bookstores = useSelector((state) => state.bookstores.data);

  useEffect(() => {
    dispatch(fetchBookstores());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          defaultZoom={3}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        />

        {bookstores &&
          bookstores.map((bookstore) => (
            <h1 key={bookstore._id}>{bookstore.name}</h1>
          ))}
      </main>
    </div>
  );
}
