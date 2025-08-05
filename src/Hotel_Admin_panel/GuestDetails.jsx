// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, Timestamp } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFilter, setSelectedFilter] = useState('All');

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const guestsData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setGuests(guestsData);
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   const filterGuests = (guests) => {
//     return guests.filter(guest =>
//       guest['Full Name']?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [];
//     const previous = [];
//     const cancelled = [];

//     guests.forEach(guest => {
//       const checkoutDate = guest['Check-Out Date']?.toDate();
//       const status = guest['Status'];

//       if (status === 'Cancelled') {
//         cancelled.push(guest);
//       } else if (checkoutDate > now) {
//         active.push(guest);
//       } else {
//         previous.push(guest);
//       }
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) => {
//     return guests.sort((a, b) => b['Check-In Date'].toDate() - a['Check-In Date'].toDate());
//   };

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderGuestList = () => {
//     let guestList = [];
//     if (selectedFilter === 'All' || selectedFilter === 'Active') {
//       guestList = [...guestList, ...filteredActive.map(guest => renderBookingCard('Active Booking', guest))];
//     }
//     if (selectedFilter === 'All' || selectedFilter === 'Previous') {
//       guestList = [...guestList, ...filteredPrevious.map(guest => renderBookingCard('Previous Booking', guest))];
//     }
//     if (selectedFilter === 'All' || selectedFilter === 'Cancelled') {
//       guestList = [...guestList, ...filteredCancelled.map(guest => renderBookingCard('Cancelled Booking', guest))];
//     }
//     return guestList;
//   };

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest['Check-In Date']?.toDate();
//     const checkOutDate = guest['Check-Out Date']?.toDate();

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div className={`text-${title === 'Active Booking' ? 'success' : title === 'Cancelled Booking' ? 'danger' : 'warning'} mb-2`}>{title}</div>

//           {/* <h3 className="mb-4">{guest['Full Name'] || 'Guest Name Not Available'}</h3> */}
//           <h3 className="mb-4">
//   {guest['Full Name'] || 'Guest Name Not Available'}
//   {guest['Confirmation Number'] && (
//     <span className="text-muted fs-6 ms-2">
//       ({guest['Confirmation Number']})
//     </span>
//   )}
// </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate ? checkInDate.toLocaleDateString() : 'N/A'}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest['Status'] || 'Status Not Available'}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest['Phone Number'] || 'Phone Not Available'}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate ? checkOutDate.toLocaleDateString() : 'N/A'}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest['Payment Status'] || 'Payment Status Not Available'}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest['Email Address'] || 'Email Not Available'}</div>
//               </div>
//             </div>
//           </div>
//           {guest['Rooms'] && guest['Rooms'].map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || 'N/A'}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || 'N/A'}</div>
//                 <div>Rooms Count: {room.roomsCount || 'N/A'}</div>
//                 <div>Guest Count: {room.guestCount || 'N/A'}</div>
//                 <div>Children Count: {room.childrenCount || 'N/A'}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="guest-details-container p-lg-3 ">
//       <style>
//         {`
//           .guest-details-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }
//           @media (max-width: 768px) {
//             .guest-details-container {
//               margin-left: 0;
//               max-width: 100%;
//             }
//           }
//         `}
//       </style>
//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>
//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select "
//                       style={{ maxWidth: '100px' }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;

// import React, { useState, useEffect } from "react";
// import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const guestQuery = query(collection(db, "Hotels", user.uid, "Guest Details"));
//       const proofQuery = query(collection(db, "Hotels", user.uid, "PaymentProofs"));

//       const unsubscribe = onSnapshot(guestQuery, async (guestSnapshot) => {
//         const guestsData = guestSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const proofSnapshot = await getDocs(proofQuery);
//         const proofMap = {};
//         proofSnapshot.docs.forEach((doc) => {
//           proofMap[doc.id] = doc.data().url;
//         });

//         const mergedGuests = guestsData.map((guest) => ({
//           ...guest,
//           paymentProofUrl: proofMap[guest.id] || guest.latestProofUrl || null,
//         }));

//         setGuests(mergedGuests);
//       });

//       return () => unsubscribe();
//     }
//   }, []);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [];
//     const previous = [];
//     const cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate();
//       const status = guest["Status"];

//       if (status === "Cancelled") {
//         cancelled.push(guest);
//       } else if (checkoutDate > now) {
//         active.push(guest);
//       } else {
//         previous.push(guest);
//       }
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) => {
//     return guests.sort(
//       (a, b) => b["Check-In Date"]?.toDate() - a["Check-In Date"]?.toDate()
//     );
//   };

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate();
//     const checkOutDate = guest["Check-Out Date"]?.toDate();

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div
//             className={`text-${
//               title === "Active Booking"
//                 ? "success"
//                 : title === "Cancelled Booking"
//                 ? "danger"
//                 : "warning"
//             } mb-2`}
//           >
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate ? checkInDate.toLocaleDateString() : "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "Status Not Available"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "Phone Not Available"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate ? checkOutDate.toLocaleDateString() : "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "Payment Status Not Available"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "Email Not Available"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"] &&
//             guest["Rooms"].map((room, index) => (
//               <div className="mt-3 p-3 border rounded" key={index}>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <span>Room: {room.roomType || "N/A"}</span>
//                   <i className="fas fa-chevron-down"></i>
//                 </div>
//                 <div className="mt-2">
//                   <div>Price: {room.price || "N/A"}</div>
//                   <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                   <div>Guest Count: {room.guestCount || "N/A"}</div>
//                   <div>Children Count: {room.childrenCount || "N/A"}</div>
//                 </div>
//               </div>
//             ))}

//           {/* {guest.paymentProofUrl && (
//             <div className="mt-3">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshot</p>
//               <img
//                 src={guest.paymentProofUrl}
//                 alt="Payment Screenshot"
//                 className="img-fluid border rounded"
//                 style={{ maxWidth: "400px" }}
//               />
//             </div>
//           )} */}

//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];
//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = [
//         ...guestList,
//         ...filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         ),
//       ];
//     }
//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = [
//         ...guestList,
//         ...filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         ),
//       ];
//     }
//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = [
//         ...guestList,
//         ...filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         ),
//       ];
//     }
//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>
//         {`
//           .guest-details-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }
//           @media (max-width: 768px) {
//             .guest-details-container {
//               margin-left: 0;
//               max-width: 100%;
//             }
//           }
//         `}
//       </style>
//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>
//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "100px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;














// import React, { useState, useEffect } from "react";
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const guestQuery = query(
//       collection(db, "Hotels", user.uid, "Guest Details")
//     );

//     const unsubscribe = onSnapshot(guestQuery, (guestSnapshot) => {
//       const guestsData = guestSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         paymentProofUrl: doc.data().latestProofUrl || null,
//       }));
//       setGuests(guestsData);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (guests.length > 0) {
//       console.log("👥 Logging guest proof URLs:");
//       guests.forEach((guest) => {
//         console.log(`${guest["Full Name"] || guest.id}: ${guest.paymentProofUrl}`);
//       });
//     }
//   }, [guests]);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [], previous = [], cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort(
//       (a, b) =>
//         b["Check-In Date"]?.toDate() - a["Check-In Date"]?.toDate()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate();
//     const checkOutDate = guest["Check-Out Date"]?.toDate();

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div
//             className={`text-${
//               title === "Active Booking"
//                 ? "success"
//                 : title === "Cancelled Booking"
//                 ? "danger"
//                 : "warning"
//             } mb-2`}
//           >
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {guest.paymentProofUrl && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshot</p>
//               <img
//                 src={guest.paymentProofUrl}
//                 alt="Payment Screenshot"
//                 className="img-fluid border rounded"
//                 style={{ maxWidth: "400px" }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>
//         {`
//           .guest-details-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }
//           @media (max-width: 768px) {
//             .guest-details-container {
//               margin-left: 0;
//               max-width: 100%;
//             }
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "100px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;















// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   onSnapshot,
//   getDocs,
// } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const guestQuery = query(
//       collection(db, "Hotels", user.uid, "Guest Details")
//     );

//     const unsubscribe = onSnapshot(guestQuery, async (guestSnapshot) => {
//       const guestsData = await Promise.all(
//         guestSnapshot.docs.map(async (doc) => {
//           const guest = {
//             id: doc.id,
//             ...doc.data(),
//             paymentProofUrl: doc.data().latestProofUrl || null,
//           };

//           try {
//             const proofRef = collection(
//               db,
//               "Hotels",
//               user.uid,
//               "Guest Details",
//               guest.id,
//               "paymentProof"
//             );
//             const proofSnap = await getDocs(proofRef);

//             guest.allProofUrls = proofSnap.docs
//               .map((d) => d.data().url)
//               .filter((url) => url); // ✅ Remove undefined or empty URLs
//           } catch (error) {
//             console.error("Error fetching proof images:", error);
//             guest.allProofUrls = [];
//           }

//           return guest;
//         })
//       );

//       setGuests(guestsData);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (guests.length > 0) {
//       console.log("👥 Logging guest proof URLs:");
//       guests.forEach((guest) => {
//         console.log(`${guest["Full Name"] || guest.id}:`, guest.allProofUrls);
//       });
//     }
//   }, [guests]);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [],
//       previous = [],
//       cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate?.();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort(
//       (a, b) =>
//         b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate?.();
//     const checkOutDate = guest["Check-Out Date"]?.toDate?.();



// console.log(guest.paymentProofUrl, "Payment Proof URL");



//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div
//             className={`text-${
//               title === "Active Booking"
//                 ? "success"
//                 : title === "Cancelled Booking"
//                 ? "danger"
//                 : "warning"
//             } mb-2`}
//           >
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {/* 🔁 Rooms */}
//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {/* 📸 All proof images */}
//           {guest.allProofUrls?.length > 0 && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
//               <div className="d-flex flex-wrap gap-3">
//                 {guest.allProofUrls.map((url, idx) => (
//                   <img
//                     key={idx}
//                     src={url}
//                     alt={`Proof ${idx + 1}`}
//                     className="img-fluid border rounded"
//                     style={{ maxWidth: "200px" }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>
//         {`
//           .guest-details-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }
//           @media (max-width: 768px) {
//             .guest-details-container {
//               margin-left: 0;
//               max-width: 100%;
//             }
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "100px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;













// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   onSnapshot,
//   getDocs,
// } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const guestQuery = query(
//       collection(db, "Hotels", user.uid, "Guest Details")
//     );

//     const unsubscribe = onSnapshot(guestQuery, async (guestSnapshot) => {
//       const guestsData = await Promise.all(
//         guestSnapshot.docs.map(async (doc) => {
//           const guest = {
//             id: doc.id,
//             ...doc.data(),
//             paymentProofUrl: doc.data().latestProofUrl || null,
//           };

//           try {
//             const proofRef = collection(
//               db,
//               "Hotels",
//               user.uid,
//               "Guest Details",
//               guest.id,
//               "paymentProof"
//             );
//             const proofSnap = await getDocs(proofRef);
//             guest.allProofUrls = proofSnap.docs
//               .map((d) => d.data().url)
//               .filter(Boolean);
//           } catch (error) {
//             console.error("Error fetching proof images:", error);
//             guest.allProofUrls = [];
//           }

//           return guest;
//         })
//       );

//       setGuests(guestsData);
//     });

//     return () => unsubscribe();
//   }, []);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [], previous = [], cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate?.();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort(
//       (a, b) =>
//         b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate?.();
//     const checkOutDate = guest["Check-Out Date"]?.toDate?.();

//     const proofImages = guest.allProofUrls?.length
//       ? guest.allProofUrls
//       : guest.paymentProofUrl
//       ? [guest.paymentProofUrl]
//       : [];

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div
//             className={`text-${
//               title === "Active Booking"
//                 ? "success"
//                 : title === "Cancelled Booking"
//                 ? "danger"
//                 : "warning"
//             } mb-2`}
//           >
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {proofImages.length > 0 && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
//               <div className="d-flex flex-wrap gap-3">
//                 {proofImages.map((url, idx) => (
//                   <a
//                     key={idx}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={url}
//                       alt={`Proof ${idx + 1}`}
//                       className="img-fluid border rounded"
//                       style={{ maxWidth: "200px" }}
//                     />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>{`
//         .guest-details-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         @media (max-width: 768px) {
//           .guest-details-container {
//             margin-left: 0;
//             max-width: 100%;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "120px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;












// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   onSnapshot,
//   getDocs,
// } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const guestQuery = query(
//       collection(db, "Hotels", user.uid, "Guest Details")
//     );

//     const unsubscribe = onSnapshot(guestQuery, async (guestSnapshot) => {
//       const guestsData = await Promise.all(
//         guestSnapshot.docs.map(async (doc) => {
//           const data = doc.data();
//           const proofArray = Array.isArray(data["Payment Proof"])
//             ? data["Payment Proof"]
//             : [];
//           const urls = proofArray.map((item) => item.url).filter(Boolean);

//           if (data.latestProofUrl && !urls.includes(data.latestProofUrl)) {
//             urls.push(data.latestProofUrl);
//           }

//           return {
//             id: doc.id,
//             ...data,
//             allProofUrls: urls,
//           };
//         })
//       );

//       setGuests(guestsData);
//     });

//     return () => unsubscribe();
//   }, []);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [], previous = [], cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate?.();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort(
//       (a, b) =>
//         b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate?.();
//     const checkOutDate = guest["Check-Out Date"]?.toDate?.();
//     const proofImages = guest.allProofUrls || [];

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div
//             className={`text-${
//               title === "Active Booking"
//                 ? "success"
//                 : title === "Cancelled Booking"
//                 ? "danger"
//                 : "warning"
//             } mb-2`}
//           >
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {proofImages.length > 0 && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
//               <div className="d-flex flex-wrap gap-3">
//                 {proofImages.map((url, idx) => (
//                   <a
//                     key={idx}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={url}
//                       alt={`Proof ${idx + 1}`}
//                       className="img-fluid border rounded"
//                       style={{ maxWidth: "200px" }}
//                     />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>{`
//         .guest-details-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         @media (max-width: 768px) {
//           .guest-details-container {
//             margin-left: 0;
//             max-width: 100%;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "120px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;















// import React, { useState, useEffect } from "react";
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { auth, db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       if (!user) return;

//       const guestQuery = query(
//         collection(db, "Hotels", user.uid, "Guest Details")
//       );

//       const unsubscribeSnapshot = onSnapshot(guestQuery, (guestSnapshot) => {
//         const guestsData = guestSnapshot.docs.map((docSnap) => {
//           const data = docSnap.data();
//           const proofArray = Array.isArray(data["Payment Proof"]) ? data["Payment Proof"] : [];
//           const urls = proofArray.map((item) => item.url).filter(Boolean);
//           if (data.latestProofUrl && !urls.includes(data.latestProofUrl)) {
//             urls.push(data.latestProofUrl);
//           }

//           return {
//             id: docSnap.id,
//             ...data,
//             allProofUrls: urls,
//           };
//         });

//         setGuests(guestsData);
//       });

//       return () => unsubscribeSnapshot();
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [], previous = [], cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate?.();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort(
//       (a, b) =>
//         b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate?.();
//     const checkOutDate = guest["Check-Out Date"]?.toDate?.();
//     const proofImages = guest.allProofUrls;

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div className={`text-${title === "Active Booking"
//               ? "success"
//               : title === "Cancelled Booking"
//               ? "danger"
//               : "warning"} mb-2`}>
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {proofImages.length > 0 && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
//               <div className="d-flex flex-wrap gap-3">
//                 {proofImages.map((url, idx) => (
//                   <a
//                     key={idx}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={url}
//                       alt={`Proof ${idx + 1}`}
//                       className="img-fluid border rounded"
//                       style={{ maxWidth: "200px" }}
//                     />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>{`
//         .guest-details-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         @media (max-width: 768px) {
//           .guest-details-container {
//             margin-left: 0;
//             max-width: 100%;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "120px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;















// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchAllGuestProofs = async () => {
//       try {
//         const hotelsSnapshot = await getDocs(collection(db, "Hotels"));
//         const allGuests = [];

//         for (const hotelDoc of hotelsSnapshot.docs) {
//           const userId = hotelDoc.id;
//           const guestDetailsRef = collection(db, "Hotels", userId, "Guest Details");
//           const guestDetailsSnapshot = await getDocs(guestDetailsRef);

//           guestDetailsSnapshot.forEach((docSnap) => {
//             const data = docSnap.data();
//             const paymentProof = Array.isArray(data["Payment Proof"]) ? data["Payment Proof"] : [];
//             const proofUrls = paymentProof.map((item) => item.url).filter(Boolean);
//             if (data.latestProofUrl && !proofUrls.includes(data.latestProofUrl)) {
//               proofUrls.push(data.latestProofUrl);
//             }

//             allGuests.push({
//               id: docSnap.id,
//               userId,
//               fullName: data["Full Name"] || "Guest",
//               phone: data["Phone Number"] || "N/A",
//               email: data["Email Address"] || "N/A",
//               status: data["Status"] || "N/A",
//               checkIn: data["Check-In Date"]?.seconds
//                 ? new Date(data["Check-In Date"].seconds * 1000)
//                 : null,
//               checkOut: data["Check-Out Date"]?.seconds
//                 ? new Date(data["Check-Out Date"].seconds * 1000)
//                 : null,
//               paymentStatus: data["Payment Status"] || "Pending",
//               confirmationId: data["confirmationId"] || "N/A",
//               proofImages: proofUrls,
//             });
//           });
//         }

//         setGuests(allGuests);
//       } catch (err) {
//         console.error("Error fetching guest details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllGuestProofs();
//   }, []);

//   const filteredGuests = guests.filter((guest) =>
//     guest.fullName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="container mt-5">
//       <style>{`
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin: 10px;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//         }
//       `}</style>

//       <h2 className="mb-4">Guest Details with Payment Proofs</h2>

//       <input
//         type="text"
//         placeholder="Search by Guest Name"
//         className="form-control mb-4"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />

//       {loading ? (
//         <p>Loading guest data...</p>
//       ) : filteredGuests.length === 0 ? (
//         <p>No matching guests found.</p>
//       ) : (
//         filteredGuests.map((guest) => (
//           <div key={guest.id} className="card mb-4">
//             <div className="card-body">
//               <h5>{guest.fullName}</h5>
//               <p><strong>Phone:</strong> {guest.phone}</p>
//               <p><strong>Email:</strong> {guest.email}</p>
//               <p><strong>Status:</strong> {guest.status}</p>
//               <p><strong>Check-In:</strong> {guest.checkIn?.toLocaleDateString() || "N/A"}</p>
//               <p><strong>Check-Out:</strong> {guest.checkOut?.toLocaleDateString() || "N/A"}</p>
//               <p><strong>Confirmation ID:</strong> {guest.confirmationId}</p>
//               <p><strong>Payment Status:</strong> {guest.paymentStatus}</p>

//               {guest.proofImages?.length > 0 ? (
//                 <div className="d-flex flex-wrap">
//                   {guest.proofImages.map((url, index) => (
//                     <a key={index} href={url} target="_blank" rel="noopener noreferrer">
//                       <img src={url} alt={`Proof ${index + 1}`} className="proof-image" />
//                     </a>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-muted">No proof images uploaded.</p>
//               )}
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default GuestDetails;









// this is right code for guest details page



// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/config";

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const fetchAllGuestsWithProofs = async () => {
//       try {
//         const hotelSnapshot = await getDocs(collection(db, "Hotels"));
//         const allGuests = [];

//         for (const hotelDoc of hotelSnapshot.docs) {
//           const userId = hotelDoc.id;
//           const guestRef = collection(db, "Hotels", userId, "Guest Details");
//           const guestSnap = await getDocs(guestRef);

//           guestSnap.forEach((docSnap) => {
//             const data = docSnap.data();
//             const paymentProof = Array.isArray(data["Payment Proof"]) ? data["Payment Proof"] : [];
//             const proofUrls = paymentProof.map((item) => item.url).filter(Boolean);
//             if (data.latestProofUrl && !proofUrls.includes(data.latestProofUrl)) {
//               proofUrls.push(data.latestProofUrl);
//             }

//             allGuests.push({
//               id: docSnap.id,
//               ...data,
//               allProofUrls: proofUrls,
//               createdAt: data.createdAt?.seconds
//                 ? new Date(data.createdAt.seconds * 1000)
//                 : new Date(0),
//             });
//           });
//         }

//         setGuests(allGuests);
//       } catch (err) {
//         console.error("❌ Error fetching guests:", err);
//       }
//     };

//     fetchAllGuestsWithProofs();
//   }, []);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [], previous = [], cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate?.();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort((a, b) =>
//       b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate?.();
//     const checkOutDate = guest["Check-Out Date"]?.toDate?.();

//     const proofImages = guest.allProofUrls?.length
//       ? guest.allProofUrls
//       : [];

//     return (
//       <div className="card mb-4" key={guest.id}>
//         <div className="card-body">
//           <div
//             className={`text-${
//               title === "Active Booking"
//                 ? "success"
//                 : title === "Cancelled Booking"
//                 ? "danger"
//                 : "warning"
//             } mb-2`}
//           >
//             {title}
//           </div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>


//                 {/* <div>{checkInDate?.toLocaleDateString() || "N/A"}</div> */}


//  <div className="">{checkInDate?.toLocaleDateString() || "N/A"} </div>

//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>


//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>


                
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {/* {proofImages.length > 0 && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
//               <div className="d-flex flex-wrap gap-3">
//                 {proofImages.map((url, idx) => (
//                   <a
//                     key={idx}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={url}
//                       alt={`Proof ${idx + 1}`}
//                       className="img-fluid border rounded"
//                       style={{ maxWidth: "200px" }}
//                     />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )} */}



//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container p-lg-3">
//       <style>{`
//         .guest-details-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         @media (max-width: 768px) {
//           .guest-details-container {
//             margin-left: 0;
//             max-width: 100%;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "120px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;













// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/config";
// import "./"; // Assuming you have a CSS file for styles

// const GuestDetails = () => {
//   const [guests, setGuests] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   useEffect(() => {
//     const fetchAllGuestsWithProofs = async () => {
//       try {
//         const hotelSnapshot = await getDocs(collection(db, "Hotels"));
//         const allGuests = [];

//         for (const hotelDoc of hotelSnapshot.docs) {
//           const userId = hotelDoc.id;
//           const guestRef = collection(db, "Hotels", userId, "Guest Details");
//           const guestSnap = await getDocs(guestRef);

//           guestSnap.forEach((docSnap) => {
//             const data = docSnap.data();
//             const proofArray = Array.isArray(data["Payment Proof"]) ? data["Payment Proof"] : [];
//             const urls = proofArray.map((item) => item.url).filter(Boolean);
//             if (data.latestProofUrl && !urls.includes(data.latestProofUrl)) {
//               urls.push(data.latestProofUrl);
//             }

//             allGuests.push({
//               id: docSnap.id,
//               ...data,
//               allProofUrls: urls,
//               createdAt: data.createdAt?.seconds
//                 ? new Date(data.createdAt.seconds * 1000)
//                 : new Date(0),
//             });
//           });
//         }

//         setGuests(allGuests);
//       } catch (err) {
//         console.error("❌ Error fetching guests:", err);
//       }
//     };

//     fetchAllGuestsWithProofs();
//   }, []);

//   const filterGuests = (guests) =>
//     guests.filter((guest) =>
//       guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const categorizeGuests = (guests) => {
//     const now = new Date();
//     const active = [], previous = [], cancelled = [];

//     guests.forEach((guest) => {
//       const checkoutDate = guest["Check-Out Date"]?.toDate?.();
//       const status = guest["Status"];

//       if (status === "Cancelled") cancelled.push(guest);
//       else if (checkoutDate > now) active.push(guest);
//       else previous.push(guest);
//     });

//     return { active, previous, cancelled };
//   };

//   const sortedGuests = (guests) =>
//     guests.sort((a, b) =>
//       b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
//     );

//   const { active, previous, cancelled } = categorizeGuests(guests);
//   const filteredActive = filterGuests(sortedGuests(active));
//   const filteredPrevious = filterGuests(sortedGuests(previous));
//   const filteredCancelled = filterGuests(sortedGuests(cancelled));

//   const renderBookingCard = (title, guest) => {
//     const checkInDate = guest["Check-In Date"]?.toDate?.();
//     const checkOutDate = guest["Check-Out Date"]?.toDate?.();
//     const proofImages = guest.allProofUrls || [];

//     const statusClass =
//       title === "Active Booking"
//         ? "booking-status-success"
//         : title === "Cancelled Booking"
//         ? "booking-status-danger"
//         : "booking-status-warning";

//     return (
//       <div className="card mb-4" key={guest.id}>










//         <div className="card-body">
//           <div className={`${statusClass} mb-2`}>{title}</div>

//           <h3 className="mb-4">
//             {guest["Full Name"] || "Guest Name Not Available"}
//             {guest.confirmationId && (
//               <span className="text-muted fs-6 ms-2">
//                 Confirmation ID: {guest.confirmationId}
//               </span>
//             )}
//           </h3>

//           <div className="row g-4">
//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-In Date</div>
//                 <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Booking Status</div>
//                 <div>{guest["Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Phone Number</div>
//                 <div>{guest["Phone Number"] || "N/A"}</div>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <div className="mb-3">
//                 <div className="text-muted small">Check-Out Date</div>
//                 <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Payment Status</div>
//                 <div>{guest["Payment Status"] || "N/A"}</div>
//               </div>
//               <div className="mb-3">
//                 <div className="text-muted small">Email</div>
//                 <div>{guest["Email Address"] || "N/A"}</div>
//               </div>
//             </div>
//           </div>

//           {guest["Rooms"]?.map((room, index) => (
//             <div className="mt-3 p-3 border rounded" key={index}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <span>Room: {room.roomType || "N/A"}</span>
//                 <i className="fas fa-chevron-down"></i>
//               </div>
//               <div className="mt-2">
//                 <div>Price: {room.price || "N/A"}</div>
//                 <div>Rooms Count: {room.roomsCount || "N/A"}</div>
//                 <div>Guest Count: {room.guestCount || "N/A"}</div>
//                 <div>Children Count: {room.childrenCount || "N/A"}</div>
//               </div>
//             </div>
//           ))}

//           {proofImages.length > 0 && (
//             <div className="mt-4">
//               <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
//               <div className="d-flex flex-wrap gap-3">
//                 {proofImages.map((url, idx) => (
//                   <a
//                     key={idx}
//                     href={url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={url}
//                       alt={`Proof ${idx + 1}`}
//                       className="payment-proof-img"
//                     />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGuestList = () => {
//     let guestList = [];

//     if (selectedFilter === "All" || selectedFilter === "Active") {
//       guestList = guestList.concat(
//         filteredActive.map((guest) =>
//           renderBookingCard("Active Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Previous") {
//       guestList = guestList.concat(
//         filteredPrevious.map((guest) =>
//           renderBookingCard("Previous Booking", guest)
//         )
//       );
//     }

//     if (selectedFilter === "All" || selectedFilter === "Cancelled") {
//       guestList = guestList.concat(
//         filteredCancelled.map((guest) =>
//           renderBookingCard("Cancelled Booking", guest)
//         )
//       );
//     }

//     return guestList;
//   };

//   return (
//     <div className="guest-details-container">
//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="card-title mb-0">Guest Details</h2>
//             </div>

//             <div className="card">
//               <div className="card-body">
//                 <div className="mb-4">
//                   <div className="input-group">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fas fa-search text-muted"></i>
//                     </span>
//                     <input
//                       type="text"
//                       placeholder="Search by Guest Name"
//                       className="form-control border-start-0"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                     <select
//                       className="form-select"
//                       style={{ maxWidth: "120px" }}
//                       value={selectedFilter}
//                       onChange={(e) => setSelectedFilter(e.target.value)}
//                     >
//                       <option value="All">All</option>
//                       <option value="Active">Active</option>
//                       <option value="Previous">Previous</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {renderGuestList()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDetails;












import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const GuestDetails = () => {
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // ✅ Utility function to safely convert Firestore Timestamp or JS Date
  const convertToDate = (val) => {
    if (!val) return null;
    if (val.toDate) return val.toDate();                     // Firestore Timestamp object
    if (val.seconds) return new Date(val.seconds * 1000);   // Firestore raw object
    if (typeof val === "string" || typeof val === "number")
      return new Date(val);                                 // String or number
    return null;
  };

  useEffect(() => {
    const fetchAllGuestsWithProofs = async () => {
      try {
        const hotelSnapshot = await getDocs(collection(db, "Hotels"));
        const allGuests = [];

        for (const hotelDoc of hotelSnapshot.docs) {
          const userId = hotelDoc.id;
          const guestRef = collection(db, "Hotels", userId, "Guest Details");
          const guestSnap = await getDocs(guestRef);

          guestSnap.forEach((docSnap) => {
            const data = docSnap.data();
            const paymentProof = Array.isArray(data["Payment Proof"]) ? data["Payment Proof"] : [];
            const proofUrls = paymentProof.map((item) => item.url).filter(Boolean);
            if (data.latestProofUrl && !proofUrls.includes(data.latestProofUrl)) {
              proofUrls.push(data.latestProofUrl);
            }

            allGuests.push({
              id: docSnap.id,
              ...data,
              allProofUrls: proofUrls,
              createdAt: data.createdAt?.seconds
                ? new Date(data.createdAt.seconds * 1000)
                : new Date(0),
            });
          });
        }

        setGuests(allGuests);
      } catch (err) {
        console.error("❌ Error fetching guests:", err);
      }
    };

    fetchAllGuestsWithProofs();
  }, []);

  const filterGuests = (guests) =>
    guests.filter((guest) =>
      guest["Full Name"]?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const categorizeGuests = (guests) => {
    const now = new Date();
    const active = [], previous = [], cancelled = [];

    guests.forEach((guest) => {
      const checkoutDate = convertToDate(guest["Check-Out Date"]);
      const status = guest["Status"];

      if (status === "Cancelled") cancelled.push(guest);
      else if (checkoutDate && checkoutDate > now) active.push(guest);
      else previous.push(guest);
    });

    return { active, previous, cancelled };
  };

  const sortedGuests = (guests) =>
    guests.sort((a, b) =>
      convertToDate(b["Check-In Date"]) - convertToDate(a["Check-In Date"])
    );

  const { active, previous, cancelled } = categorizeGuests(guests);
  const filteredActive = filterGuests(sortedGuests(active));
  const filteredPrevious = filterGuests(sortedGuests(previous));
  const filteredCancelled = filterGuests(sortedGuests(cancelled));

  const renderBookingCard = (title, guest) => {
    const checkInDate = convertToDate(guest["Check-In Date"]);
    const checkOutDate = convertToDate(guest["Check-Out Date"]);
    const proofImages = guest.allProofUrls?.length ? guest.allProofUrls : [];

    return (
      <div className="card mb-4" key={guest.id}>
        <div className="card-body">
          <div
            className={`text-${
              title === "Active Booking"
                ? "success"
                : title === "Cancelled Booking"
                ? "danger"
                : "warning"
            } mb-2`}
          >
            {title}
          </div>

          <h3 className="mb-4">
            {guest["Full Name"] || "Guest Name Not Available"}
            {guest.confirmationId && (
              <span className="text-muted fs-6 ms-2">
                Confirmation ID: {guest.confirmationId}
              </span>
            )}
          </h3>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="mb-3">
                <div className="text-muted small">Check-In Date</div>
                <div>{checkInDate ? checkInDate.toLocaleDateString() : "N/A"}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Booking Status</div>
                <div>{guest["Status"] || "N/A"}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Phone Number</div>
                <div>{guest["Phone Number"] || "N/A"}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <div className="text-muted small">Check-Out Date</div>
                <div>{checkOutDate ? checkOutDate.toLocaleDateString() : "N/A"}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Payment Status</div>
                <div>{guest["Payment Status"] || "N/A"}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Email</div>
                <div>{guest["Email Address"] || "N/A"}</div>
              </div>
            </div>
          </div>

          {guest["Rooms"]?.map((room, index) => (
            <div className="mt-3 p-3 border rounded" key={index}>
              <div className="d-flex justify-content-between align-items-center">
                <span>Room: {room.roomType || "N/A"}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
              <div className="mt-2">
                <div>Price: {room.price || "N/A"}</div>
                <div>Rooms Count: {room.roomsCount || "N/A"}</div>
                <div>Guest Count: {room.guestCount || "N/A"}</div>
                <div>Children Count: {room.childrenCount || "N/A"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGuestList = () => {
    let guestList = [];

    if (selectedFilter === "All" || selectedFilter === "Active") {
      guestList = guestList.concat(
        filteredActive.map((guest) => renderBookingCard("Active Booking", guest))
      );
    }

    if (selectedFilter === "All" || selectedFilter === "Previous") {
      guestList = guestList.concat(
        filteredPrevious.map((guest) => renderBookingCard("Previous Booking", guest))
      );
    }

    if (selectedFilter === "All" || selectedFilter === "Cancelled") {
      guestList = guestList.concat(
        filteredCancelled.map((guest) => renderBookingCard("Cancelled Booking", guest))
      );
    }

    return guestList;
  };

  return (
    <div className="guest-details-container p-lg-3">
      <style>{`
        .guest-details-container {
          margin-left: 250px;
          margin-top: 60px;
          max-width: calc(100% - 250px);
        }
        @media (max-width: 768px) {
          .guest-details-container {
            margin-left: 0;
            max-width: 100%;
          }
        }
      `}</style>

      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">Guest Details</h2>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by Guest Name"
                      className="form-control border-start-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                      className="form-select"
                      style={{ maxWidth: "120px" }}
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Previous">Previous</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {renderGuestList()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;







