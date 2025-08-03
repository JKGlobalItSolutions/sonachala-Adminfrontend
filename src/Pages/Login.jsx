import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useAuth } from "../auth/AuthContext";

import logo from "../Images/Logo/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await navigateToAdminPanel(user.uid);
    } catch (error) {
      console.error("Failed to sign in with email and password:", error);
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToAdminPanel = async (userId) => {
    try {
      const homestayDocRef = doc(db, "Homestays", userId);
      const hotelDocRef = doc(db, "Hotels", userId);

      const [homestayDocSnap, hotelDocSnap] = await Promise.all([
        getDoc(homestayDocRef),
        getDoc(hotelDocRef),
      ]);

      if (homestayDocSnap.exists()) {
        await login(userId, "homestay");
        navigate("/homestay-RoomStatus");
      } else if (hotelDocSnap.exists()) {
        await login(userId, "hotel");
        navigate("/hotel-RoomStatus");
      } else {
        toast.error("Property type not found. Please contact support.");
      }
    } catch (error) {
      console.error("Error retrieving property type from Firestore:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section className="containerr forms">

      <div className="position-absolute top-0 start-0 m-3">
        <Link to="https://sonachala-user.netlify.app/" className="btn bg-white text-dark">
          <i className="fas fa-arrow-left me-2"></i> Back to Home
        </Link>
      </div>

      <div className="logo-container">
        <img src={logo} alt="sonachla Logo" className="logo" />
      </div>
      <div className="form login">
        <div className="form-content">
          <header>Login</header>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="field input-field">
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field input-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className="bx bx-hide eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </i>
            </div>

            <div className="form-link">
              <a href="#" className="forgot-pass">
                Forgot password?
              </a>
            </div>

            <div className="field button-field  bg-success">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="form-link">
            <span>
              List Your Property <Link to="/register">Register Now</Link>
            </span>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="top-center" />
    </section>
  );
}

export default Login;
