"use client";
import styles from "./page.module.css";
import "bulma/css/bulma.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchBookstores } from "./store/slices/bookstoreData";
import { Map } from "@vis.gl/react-google-maps";
import CustomMarker from "./components/CustomMarker";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch();
  const bookstores = useSelector((state) => state.bookstores.data);
  const [selectedBookstores, setSelectedBookstores] = useState([]);
  const [routeData, setRouteData] = useState({});
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const API_URL = "https://clt-bookstore-crawl-backend.onrender.com/";

  useEffect(() => {
    dispatch(fetchBookstores());
  }, [dispatch]);

  const logBookstores = () => {
    console.log(bookstores);
  };

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
      const response = await fetch(`${API_URL}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialLocation, waypoints }),
      });

      if (!response.ok) throw new Error("Failed to fetch optimized route");

      const data = await response.json();
      console.log("Optimized route:", data);
      setRouteData(data);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Signup successful!");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        fetchUserInfo();
        alert("Login successful!");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear the token
    alert("You have been logged out.");
    window.location.href = "/"; // redirect to home (or "/login")
  };

  const saveOptimizedRoute = async () => {
    // TODO: Correct order of waypoints in array
    const selectedBookstoreIds = selectedBookstores.map(
      (bookstore) => bookstore._id
    );
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedBookstoreIds }),
      });

      if (!response.ok) throw new Error("Failed to save optimized route");

      const data = await response.json();
      console.log("User routes:", data);
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  const logSelectedBookstores = () => {
    console.log(selectedBookstores);
    const selectedBookstoreIds = selectedBookstores.map(
      (bookstore) => bookstore._id
    );
    console.log(selectedBookstoreIds);
  };

  const logUserInfo = () => {
    console.log(userInfo);
  };

  return (
    <main className="py-5">
      {/* Map Section */}
      <section className="container box p-5 mb-5">
        <h1 className="title is-3 has-text-centered mb-4">Bookstore Map</h1>
        <h3 className="has-text-centered is-4 mb-4">
          Click on Red Markers to View Bookstores
        </h3>
        <div className="is-flex is-justify-content-center">
          <Map
            style={{ width: "60vw", height: "60vh", borderRadius: "8px" }}
            defaultCenter={{ lat: 35.2271, lng: -80.8431 }}
            defaultZoom={8}
            gestureHandling="greedy"
            disableDefaultUI={true}
            mapId="94a3f9788eb55066aff42e8e"
          >
            {bookstores?.map((bookstore) => (
              <CustomMarker key={bookstore._id} bookstore={bookstore} />
            ))}
          </Map>
        </div>
      </section>

      {/* Bookstore List Section */}
      <section className="container box p-5 mb-5">
        <h2 className="title is-4 mb-4">
          Choose Which Bookstores You Would Like To Visit:
        </h2>
        <h3 className="is-4 mb-4">
          Note: The First Bookstore You Select Will Be Your Starting Point
        </h3>
        <div className="columns is-multiline">
          {bookstores?.map((bookstore) => (
            <div key={bookstore._id} className="column is-one-quarter">
              <button
                className="button is-fullwidth is-info is-outlined"
                onClick={() => selectBookstore(bookstore)}
              >
                {bookstore.name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="subtitle is-5 has-text-weight-bold mb-2">
            Selected Bookstores:
          </h3>
          <div className="content">
            {selectedBookstores.map((bookstore) => (
              <span
                key={bookstore._id}
                className="tag is-link is-light is-medium m-1"
              >
                {bookstore.name}
              </span>
            ))}
          </div>

          <div className="buttons mt-4">
            <button
              className="button is-primary"
              onClick={logSelectedBookstores}
            >
              Log Selected
            </button>
            <button className="button is-warning" onClick={getOptimizedRoute}>
              Get Optimized Route
            </button>
            <button className="button is-success" onClick={saveOptimizedRoute}>
              Save to Account
              {/* TODO: Add error handling if user is not logged in */}
            </button>
            <button className="button is-light" onClick={logBookstores}>
              Log All Bookstores
            </button>
          </div>
        </div>

        {routeData?.routes?.[0]?.optimizedIntermediateWaypointIndex && (
          <div className="mt-5">
            <h3 className="subtitle is-5 has-text-weight-bold">
              Optimized Route:
            </h3>
            <ol className="ml-5">
              <li>{selectedBookstores[0].name}</li>
              {routeData.routes[0].optimizedIntermediateWaypointIndex.map(
                (index) => (
                  <li key={index}>{selectedBookstores[index + 1].name}</li>
                )
              )}
            </ol>
          </div>
        )}
      </section>

      {/* Auth Forms */}
      <section className="container columns">
        <div className="column">
          <div className="box p-5">
            <h2 className="title is-4 mb-4">Sign Up</h2>
            <form onSubmit={handleSignup}>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="button is-primary is-fullwidth">
                Sign Up
              </button>
            </form>
          </div>
        </div>

        <div className="column">
          <div className="box p-5">
            <h2 className="title is-4 mb-4">Log In</h2>
            <form onSubmit={handleLogin}>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="button is-link is-fullwidth">
                Log In
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* User Info and Logout */}
      {userInfo && (
        <section className="container has-text-centered mt-5">
          <Link href={`/users/${userInfo.id}`}>
            <button
              type="button"
              className="button is-info is-light mx-2"
              onClick={logUserInfo}
            >
              Get My Info
            </button>
          </Link>
        </section>
      )}

      <div className="has-text-centered mt-5">
        <button className="button is-danger" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </main>
  );
}
