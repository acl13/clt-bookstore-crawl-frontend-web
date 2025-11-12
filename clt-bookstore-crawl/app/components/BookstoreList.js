"use client";

import SelectedBookstores from "./SelectedBookstores";

export default function BookstoreList({
  bookstores,
  selectedBookstores,
  selectBookstore,
  getOptimizedRoute,
  saveOptimizedRoute,
  routeData,
}) {
  return (
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

      <SelectedBookstores
        selectedBookstores={selectedBookstores}
        getOptimizedRoute={getOptimizedRoute}
        saveOptimizedRoute={saveOptimizedRoute}
        routeData={routeData}
      />
    </section>
  );
}
