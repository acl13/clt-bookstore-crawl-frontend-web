"use client";
import { useState } from "react";

export default function AuthForms({ API_URL, setUserInfo }) {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

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
      } else alert(data.error || "Signup failed");
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
      } else alert(data.message || "Login failed");
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
    <section className="container columns">
      <div className="column">
        <div className="box p-5">
          <h2 className="title is-4 mb-4">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              className="input mb-2"
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <input
              className="input mb-2"
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <button className="button is-primary is-fullwidth">Sign Up</button>
          </form>
        </div>
      </div>

      <div className="column">
        <div className="box p-5">
          <h2 className="title is-4 mb-4">Log In</h2>
          <form onSubmit={handleLogin}>
            <input
              className="input mb-2"
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              className="input mb-2"
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button className="button is-link is-fullwidth">Log In</button>
          </form>
        </div>
      </div>
    </section>
  );
}
