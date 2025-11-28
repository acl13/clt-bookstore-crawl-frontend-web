"use client";
import { Map } from "@vis.gl/react-google-maps";
import CustomMarker from "./CustomMarker";

export default function MapSection({ bookstores, isLoading }) {
  return isLoading ? (
    <>
      <h1 className="title is-3 has-text-centered mb-4">Loading...</h1>
    </>
  ) : (
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
          {bookstores?.map((b) => (
            <CustomMarker key={b._id} bookstore={b} />
          ))}
        </Map>
      </div>
    </section>
  );
}
