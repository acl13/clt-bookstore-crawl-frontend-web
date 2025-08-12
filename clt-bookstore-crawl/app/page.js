"use client";
import styles from "./page.module.css";
import "bulma/css/bulma.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchBookstores } from "./store/slices/bookstoreData";
import { Map } from "@vis.gl/react-google-maps";
import CustomMarker from "./components/CustomMarker";

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

  const API_URL = "http://localhost:8000";

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

  return (
    <main className="has-background-light has-text-dark">
      <section className="container m-4">
        <Map
          style={{ width: "60vw", height: "60vh" }}
          defaultCenter={{ lat: 35.2271, lng: -80.8431 }}
          defaultZoom={8}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId="94a3f9788eb55066aff42e8e"
        >
          {bookstores &&
            bookstores.map((bookstore) => (
              <CustomMarker key={bookstore._id} bookstore={bookstore} />
            ))}
        </Map>
      </section>

      <section className="container m-4">
        <div className="grid">
          {bookstores &&
            bookstores.map((bookstore) => (
              <button
                className="cell bookstore-card"
                key={bookstore._id}
                onClick={() => selectBookstore(bookstore)}
              >
                {bookstore.name}
              </button>
            ))}
        </div>
        <div>
          <h1 className="is-size-3 has-text-weight-bold">
            Selected bookstores:
          </h1>
          {selectedBookstores.map((bookstore) => (
            <div key={bookstore._id}>{bookstore.name}</div>
          ))}
        </div>
        <div>
          <h1 className="is-size-3 has-text-weight-bold">
            Optimized Route - does not include initial bookstore:
          </h1>
          {Array.isArray(
            routeData?.routes?.[0]?.optimizedIntermediateWaypointIndex
          ) &&
            routeData.routes[0].optimizedIntermediateWaypointIndex.map(
              (index) => (
                <div key={index}>{selectedBookstores[index + 1].name}</div>
              )
            )}
        </div>
        <button type="button" onClick={logBookstores} className="button">
          Log Bookstores
        </button>
        <button type="button" onClick={getOptimizedRoute} className="button">
          Get Optimized Route
        </button>
      </section>

      {/* Signup Form */}
      <section className="container m-4">
        <h2 className="is-size-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
          />
          <button type="submit" className="button is-primary">
            Sign Up
          </button>
        </form>
      </section>

      {/* Login Form */}
      <section className="container m-4">
        <h2 className="is-size-4">Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <button type="submit" className="button is-link">
            Log In
          </button>
        </form>
      </section>

      {/* Fetch user info */}
      <section className="container m-4">
        <button onClick={fetchUserInfo} className="button is-info">
          Get My Info (/me)
        </button>
        {userInfo && (
          <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}

// "use client";
// import styles from "./page.module.css";
// import "bulma/css/bulma.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { fetchBookstores } from "./store/slices/bookstoreData";
// import { Map, Polyline } from "@vis.gl/react-google-maps";
// import CustomMarker from "./components/CustomMarker";
// // import RoutePolyline from "./components/RoutePolyline";
// // import polyline from "@mapbox/polyline";

// export default function Home() {
//   const dispatch = useDispatch();
//   // const [clicked, setClicked] = useState(false);

//   const bookstores = useSelector((state) => state.bookstores.data);
//   const [selectedBookstores, setSelectedBookstores] = useState([]);
//   const [routeData, setRouteData] = useState({});
//   // const [routePolyline, setRoutePolyline] = useState(null);

//   useEffect(() => {
//     dispatch(fetchBookstores());
//   }, [dispatch]);

//   const logBookstores = () => {
//     console.log(bookstores);
//   };

//   const selectBookstore = (bookstore) => {
//     if (!selectedBookstores.includes(bookstore)) {
//       setSelectedBookstores((selectedBookstores) => [
//         ...selectedBookstores,
//         bookstore,
//       ]);
//     }
//     console.log(bookstore);
//     console.log(selectedBookstores);
//   };

//   const getOptimizedRoute = async () => {
//     if (selectedBookstores.length < 2) {
//       alert("Please select at least two bookstores.");
//       return;
//     }

//     const initialLocation = selectedBookstores[0];
//     const waypoints = selectedBookstores.slice(1);

//     const requestBody = {
//       initialLocation,
//       waypoints,
//     };

//     try {
//       const response = await fetch("http://localhost:8000/routes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch optimized route");
//       }

//       const data = await response.json();
//       console.log("Optimized route:", data);
//       setRouteData(data);
//       // Save the encoded polyline to state
//       const encodedPolyline = data.routes?.[0]?.polyline?.encodedPolyline;
//       // if (encodedPolyline) {
//       //   setRoutePolyline(encodedPolyline);
//       // }
//     } catch (error) {
//       console.error("Error fetching route:", error);
//     }
//   };

//   return (
//     <>
//       <main className="has-background-light has-text-dark">
//         <section className="container m-4">
//           <Map
//             style={{ width: "60vw", height: "60vh" }}
//             defaultCenter={{ lat: 35.2271, lng: -80.8431 }}
//             defaultZoom={8}
//             gestureHandling={"greedy"}
//             disableDefaultUI={true}
//             mapId="94a3f9788eb55066aff42e8e"
//           >
//             {bookstores &&
//               bookstores.map((bookstore) => (
//                 <CustomMarker key={bookstore._id} bookstore={bookstore} />
//               ))}
//             {/* {routePolyline && <RoutePolyline encodedPolyline={routePolyline} />} */}
//           </Map>
//         </section>
//         <section className="container m-4">
//           <div className="grid">
//             {bookstores &&
//               bookstores.map((bookstore) => (
//                 <button
//                   className="cell bookstore-card"
//                   key={bookstore._id}
//                   onClick={() => selectBookstore(bookstore)}
//                 >
//                   {bookstore.name}
//                 </button>
//               ))}
//           </div>
//           <div>
//             <h1 className="is-size-3 has-text-weight-bold">
//               Selected bookstores:{" "}
//             </h1>
//             {selectedBookstores &&
//               selectedBookstores.map((bookstore) => (
//                 <div key={bookstore._id}>{bookstore.name}</div>
//               ))}
//           </div>
//           <div>
//             <h1 className="is-size-3 has-text-weight-bold">
//               Optimized Route - does not include initial bookstore:{" "}
//             </h1>
//             {Array.isArray(
//               routeData?.routes?.[0]?.optimizedIntermediateWaypointIndex
//             ) &&
//               routeData.routes[0].optimizedIntermediateWaypointIndex.map(
//                 (index) => (
//                   <div key={index}>{selectedBookstores[index + 1].name}</div>
//                 )
//               )}
//           </div>
//           <button type="button" onClick={logBookstores} className="button">
//             Log Bookstores
//           </button>
//           <button type="button" onClick={getOptimizedRoute} className="button">
//             Get Optimized Route
//           </button>
//         </section>
//         <form action="http://localhost:8000/login" method="post">
//           <div>
//             <label>Username:</label>
//             <input type="text" name="username" />
//           </div>
//           <div>
//             <label>Password:</label>
//             <input type="password" name="password" />
//           </div>
//           <div>
//             <input type="submit" value="Log In" />
//           </div>
//         </form>
//       </main>
//     </>
//   );
// }
