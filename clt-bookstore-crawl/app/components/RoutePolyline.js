export default function RoutePolyline({ encodedPolyline }) {
  const map = useGoogleMap();
  const routesLib = useMapsLibrary("routes");
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!map || !routesLib || !encodedPolyline) return;

    const decodedPath = polyline
      .decode(encodedPolyline)
      .map(([lat, lng]) => ({ lat, lng }));

    if (polylineRef.current) {
      polylineRef.current.setMap(null); // Remove previous polyline if it exists
    }

    polylineRef.current = new google.maps.Polyline({
      path: decodedPath,
      strokeColor: "#4285F4",
      strokeOpacity: 1.0,
      strokeWeight: 4,
      map,
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, routesLib, encodedPolyline]);

  return null;
}
