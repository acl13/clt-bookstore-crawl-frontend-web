"use client";

export default function SelectedBookstores({
  selectedBookstores,
  getOptimizedRoute,
  saveOptimizedRoute,
  routeData,
}) {
  return (
    <div className="mt-5">
      <h3 className="subtitle is-5 has-text-weight-bold mb-2">
        Selected Bookstores:
      </h3>
      <div className="content">
        {selectedBookstores.map((b) => (
          <span key={b._id} className="tag is-link is-light is-medium m-1">
            {b.name}
          </span>
        ))}
      </div>

      <div className="buttons mt-4">
        <button className="button is-warning" onClick={getOptimizedRoute}>
          Get Optimized Route
        </button>
        <button className="button is-success" onClick={saveOptimizedRoute}>
          Save to Account
        </button>
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
    </div>
  );
}
