// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./auth/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "./styles/global.css";
// import Login from "./Pages/Login";
// import Register from "./Pages/Register";


// import AllGuestPayments from "./Pages/AllGuestPayments";

// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";

// import HotelUserProfile from "./Hotel_Admin_panel/UserProfile";
// import HotelPage from "./Hotel_Admin_panel/Hotels";
// import HotelRooms from "./Hotel_Admin_panel/Rooms";
// import HotelGuestDetails from "./Hotel_Admin_panel/GuestDetails";
// import HotelPayments from "./Hotel_Admin_panel/PaymentaPage";
// import HotelReviews from "./Hotel_Admin_panel/Reviews";
// import HotelRoomStatus from "./Hotel_Admin_panel/RoomStatus";

// import HomestayUserProfile from "./Homestay_Admin_panel/UserProfile";
// import HomestaysPage from "./Homestay_Admin_panel/Homestay";
// import HomestaysRooms from "./Homestay_Admin_panel/Rooms";
// import HomestaysHomestays from "./Homestay_Admin_panel/GuestDetails";
// import HomestaysPayment from "./Homestay_Admin_panel/PaymentaPage";
// import HomestaysReviews from "./Homestay_Admin_panel/Reviews";
// import HomestaysRoomStatus from "./Homestay_Admin_panel/RoomStatus";

// function Layout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = React.useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="App">
//       <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
//       <div className="main-content">
//         <Navbar toggleSidebar={toggleSidebar} />
//         {children}
//       </div>
//     </div>
//   );
// }

// function PrivateRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
// }

// function PublicRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return user ? <Navigate to="/" replace /> : children;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/*"
//             element={
//               <PrivateRoute>
//                 <Routes>
//                   {/* Hotel routes */}
//                   <Route path="/hotel" element={<HotelUserProfile />} />
//                   <Route path="/hotel-Page" element={<HotelPage />} />

                 

//                   <Route path="/hotel-Rooms" element={<HotelRooms />} />
//                   <Route
//                     path="/hotel-GuestDetails"
//                     element={<HotelGuestDetails />}
//                   />
//                   <Route path="/hotel-Payments" element={<HotelPayments />} />
//                   <Route path="/hotel-Reviews" element={<HotelReviews />} />
//                   <Route
//                     path="/hotel-RoomStatus"
//                     element={<HotelRoomStatus />}
//                   />
//                   {/* Homestays routes */}
//                   <Route path="/homestay" element={<HomestayUserProfile />} />
//                   <Route path="/homestay-Page" element={<HomestaysPage />} />
//                   <Route path="/homestay-Rooms" element={<HomestaysRooms />} />
//                   <Route
//                     path="/homestay-GuestDetails"
//                     element={<HomestaysHomestays />}
//                   />
//                   <Route
//                     path="/homestay-Payment"
//                     element={<HomestaysPayment />}
//                   />
//                   <Route
//                     path="/homestay-Reviews"
//                     element={<HomestaysReviews />}
//                   />
//                   <Route
//                     path="/homestay-RoomStatus"
//                     element={<HomestaysRoomStatus />}
//                   />




//  {/* ----------- */}

//               <Route
//                 path="/AllGuestPayments"
//                 element={<AllGuestPayments />}
//               />

//               {/* ----------- */}



//                 </Routes>
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;




















// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./auth/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "./styles/global.css";
// import Login from "./Pages/Login";
// import Register from "./Pages/Register";

// import AllGuestPayments from "./Pages/AllGuestPayments";

// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";

// import HotelUserProfile from "./Hotel_Admin_panel/UserProfile";
// import HotelPage from "./Hotel_Admin_panel/Hotels";
// import HotelRooms from "./Hotel_Admin_panel/Rooms";
// import HotelGuestDetails from "./Hotel_Admin_panel/GuestDetails";
// import HotelPayments from "./Hotel_Admin_panel/PaymentaPage";
// import HotelReviews from "./Hotel_Admin_panel/Reviews";
// import HotelRoomStatus from "./Hotel_Admin_panel/RoomStatus";

// import HomestayUserProfile from "./Homestay_Admin_panel/UserProfile";
// import HomestaysPage from "./Homestay_Admin_panel/Homestay";
// import HomestaysRooms from "./Homestay_Admin_panel/Rooms";
// import HomestaysHomestays from "./Homestay_Admin_panel/GuestDetails";
// import HomestaysPayment from "./Homestay_Admin_panel/PaymentaPage";
// import HomestaysReviews from "./Homestay_Admin_panel/Reviews";
// import HomestaysRoomStatus from "./Homestay_Admin_panel/RoomStatus";

// function Layout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = React.useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="App">
//       <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
//       <div className="main-content">
//         <Navbar toggleSidebar={toggleSidebar} />
//         {children}
//       </div>
//     </div>
//   );
// }

// function PrivateRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
// }

// function PublicRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return user ? <Navigate to="/" replace /> : children;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             }
//           />

//           {/* Private routes */}
//           <Route
//             path="/*"
//             element={
//               <PrivateRoute>
//                 <Routes>
//                   {/* Default redirect */}
//                   <Route path="/" element={<Navigate to="/hotel-RoomStatus" replace />} />

//                   {/* Hotel routes */}
//                   <Route path="/hotel" element={<HotelUserProfile />} />
//                   <Route path="/hotel-Page" element={<HotelPage />} />
//                   <Route path="/hotel-Rooms" element={<HotelRooms />} />
//                   <Route
//                     path="/hotel-GuestDetails"
//                     element={<HotelGuestDetails />}
//                   />
//                   <Route path="/hotel-Payments" element={<HotelPayments />} />
//                   <Route path="/hotel-Reviews" element={<HotelReviews />} />
//                   <Route
//                     path="/hotel-RoomStatus"
//                     element={<HotelRoomStatus />}
//                   />

//                   {/* Homestay routes */}
//                   <Route path="/homestay" element={<HomestayUserProfile />} />
//                   <Route path="/homestay-Page" element={<HomestaysPage />} />
//                   <Route path="/homestay-Rooms" element={<HomestaysRooms />} />
//                   <Route
//                     path="/homestay-GuestDetails"
//                     element={<HomestaysHomestays />}
//                   />
//                   <Route
//                     path="/homestay-Payment"
//                     element={<HomestaysPayment />}
//                   />
//                   <Route
//                     path="/homestay-Reviews"
//                     element={<HomestaysReviews />}
//                   />
//                   <Route
//                     path="/homestay-RoomStatus"
//                     element={<HomestaysRoomStatus />}
//                   />

//                   {/* Other routes */}
//                   <Route
//                     path="/AllGuestPayments"
//                     element={<AllGuestPayments />}
//                   />
//                 </Routes>
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;




import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AllGuestPayments from "./Pages/AllGuestPayments";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import HotelUserProfile from "./Hotel_Admin_panel/UserProfile";
import HotelPage from "./Hotel_Admin_panel/Hotels";
import HotelRooms from "./Hotel_Admin_panel/Rooms";
import HotelGuestDetails from "./Hotel_Admin_panel/GuestDetails";
import HotelPayments from "./Hotel_Admin_panel/PaymentaPage";
import HotelReviews from "./Hotel_Admin_panel/Reviews";
import HotelRoomStatus from "./Hotel_Admin_panel/RoomStatus";

import HomestayUserProfile from "./Homestay_Admin_panel/UserProfile";
import HomestaysPage from "./Homestay_Admin_panel/Homestay";
import HomestaysRooms from "./Homestay_Admin_panel/Rooms";
import HomestaysHomestays from "./Homestay_Admin_panel/GuestDetails";
import HomestaysPayment from "./Homestay_Admin_panel/PaymentaPage";
import HomestaysReviews from "./Homestay_Admin_panel/Reviews";
import HomestaysRoomStatus from "./Homestay_Admin_panel/RoomStatus";

// Layout wrapper with sidebar & navbar
function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="App">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        {children}
      </div>
    </div>
  );
}

// Route protection
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Private routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/hotel-RoomStatus" replace />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel"
            element={
              <PrivateRoute>
                <HotelUserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel-Page"
            element={
              <PrivateRoute>
                <HotelPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel-Rooms"
            element={
              <PrivateRoute>
                <HotelRooms />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel-GuestDetails"
            element={
              <PrivateRoute>
                <HotelGuestDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel-Payments"
            element={
              <PrivateRoute>
                <HotelPayments />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel-Reviews"
            element={
              <PrivateRoute>
                <HotelReviews />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotel-RoomStatus"
            element={
              <PrivateRoute>
                <HotelRoomStatus />
              </PrivateRoute>
            }
          />

          {/* Homestay routes */}
          <Route
            path="/homestay"
            element={
              <PrivateRoute>
                <HomestayUserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/homestay-Page"
            element={
              <PrivateRoute>
                <HomestaysPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/homestay-Rooms"
            element={
              <PrivateRoute>
                <HomestaysRooms />
              </PrivateRoute>
            }
          />
          <Route
            path="/homestay-GuestDetails"
            element={
              <PrivateRoute>
                <HomestaysHomestays />
              </PrivateRoute>
            }
          />
          <Route
            path="/homestay-Payment"
            element={
              <PrivateRoute>
                <HomestaysPayment />
              </PrivateRoute>
            }
          />
          <Route
            path="/homestay-Reviews"
            element={
              <PrivateRoute>
                <HomestaysReviews />
              </PrivateRoute>
            }
          />
          <Route
            path="/homestay-RoomStatus"
            element={
              <PrivateRoute>
                <HomestaysRoomStatus />
              </PrivateRoute>
            }
          />

          {/* Other routes */}
          <Route
            path="/AllGuestPayments"
            element={
              <PrivateRoute>
                <AllGuestPayments />
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
