"use client";
import Link from "next/link";

export default function UserInfo({ userInfo }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.href = "/";
  };

  return (
    <>
      {userInfo && (
        <section className="container has-text-centered mt-5">
          <Link href={`/users/${userInfo.id}`}>
            <button className="button is-info is-light mx-2">
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
    </>
  );
}
