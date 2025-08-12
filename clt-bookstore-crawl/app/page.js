"use client";
import styles from "./page.module.css";
import "bulma/css/bulma.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchBookstores } from "./store/slices/bookstoreData";
import { Map, Polyline } from "@vis.gl/react-google-maps";
import CustomMarker from "./components/CustomMarker";
// import RoutePolyline from "./components/RoutePolyline";
// import polyline from "@mapbox/polyline";

export default function Home() {
  const dispatch = useDispatch();
  // const [clicked, setClicked] = useState(false);

  const bookstores = useSelector((state) => state.bookstores.data);
  const [selectedBookstores, setSelectedBookstores] = useState([]);
  const [routeData, setRouteData] = useState({});
  // const [routePolyline, setRoutePolyline] = useState(null);

  useEffect(() => {
    dispatch(fetchBookstores());
  }, [dispatch]);

  const logBookstores = () => {
    console.log(bookstores);
  };

  const selectBookstore = (bookstore) => {
    if (!selectedBookstores.includes(bookstore)) {
      setSelectedBookstores((selectedBookstores) => [
        ...selectedBookstores,
        bookstore,
      ]);
    }
    console.log(bookstore);
    console.log(selectedBookstores);
  };

  const getOptimizedRoute = async () => {
    if (selectedBookstores.length < 2) {
      alert("Please select at least two bookstores.");
      return;
    }

    const initialLocation = selectedBookstores[0];
    const waypoints = selectedBookstores.slice(1);

    const requestBody = {
      initialLocation,
      waypoints,
    };

    try {
      const response = await fetch("http://localhost:8000/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch optimized route");
      }

      const data = await response.json();
      console.log("Optimized route:", data);
      setRouteData(data);
      // Save the encoded polyline to state
      const encodedPolyline = data.routes?.[0]?.polyline?.encodedPolyline;
      // if (encodedPolyline) {
      //   setRoutePolyline(encodedPolyline);
      // }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return (
    <>
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
            {/* {routePolyline && <RoutePolyline encodedPolyline={routePolyline} />} */}
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
              Selected bookstores:{" "}
            </h1>
            {selectedBookstores &&
              selectedBookstores.map((bookstore) => (
                <div key={bookstore._id}>{bookstore.name}</div>
              ))}
          </div>
          <div>
            <h1 className="is-size-3 has-text-weight-bold">
              Optimized Route - does not include initial bookstore:{" "}
            </h1>
            {Array.isArray(
              routeData?.routes?.[0]?.optimizedIntermediateWaypointIndex
            ) &&
              routeData.routes[0].optimizedIntermediateWaypointIndex.map(
                (index) => (
                  <div key={index}>{selectedBookstores[index + 1].name}</div>
                )
              )}
            {/* {routeData &&
              routeData?.routes[0]?.optimizedIntermediateWaypointIndex?.map(
                (index) => <div key={index}>{index}</div>
              )} */}
            {/* <div>{routeData?.routes[0]?.routeToken}</div> */}
            {/* <div>
              {routeData?.routes[0]?.optimizedIntermediateWaypointIndex?.map(
                (index) => (
                  <div key={index}>{index}</div>
                )
              )}
            </div> */}
          </div>
          <button type="button" onClick={logBookstores} className="button">
            Log Bookstores
          </button>
          <button type="button" onClick={getOptimizedRoute} className="button">
            Get Optimized Route
          </button>
        </section>
      </main>
    </>
  );
}
