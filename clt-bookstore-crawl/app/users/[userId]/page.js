"use client";
import { useEffect, useState } from "react";

export default function UserInfoPage() {
  const [userInfo, setUserInfo] = useState(null);
  const API_URL = "https://clt-bookstore-crawl-backend.onrender.com";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <main className="container m-4">
      <h1 className="is-size-3 has-text-weight-bold">My Account</h1>
      {userInfo ? (
        <div className="box">
          <p>
            <strong>ID:</strong> {userInfo.id}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>

          {userInfo.routes && userInfo.routes.length > 0 && (
            <>
              <h2 className="is-size-4">Saved Routes:</h2>
              <ul>
                {userInfo.routes.map((route, routeIndex) => (
                  <li key={route._id || routeIndex} className="mb-3">
                    <strong>Route {routeIndex + 1}:</strong>
                    <ul>
                      {route.bookstores.map((store) => (
                        <li key={store._id}>{store.name}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </main>
  );
}
