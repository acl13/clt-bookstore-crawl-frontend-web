import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import React from "react";
import { useState, useCallback } from "react";

export default function CustomMarker({ bookstore }) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);
  return (
    <>
      <AdvancedMarker
        key={bookstore._id}
        position={{ lat: bookstore.lat, lng: bookstore.long }}
        ref={markerRef}
        onClick={handleMarkerClick}
      />
      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>{bookstore.name}</h2>
          <p>{bookstore.address}</p>
        </InfoWindow>
      )}
    </>
  );
}
