// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const paymentsData = querySnapshot.docs
//           .map(doc => ({
//             id: doc.id,
//             ...doc.data()
//           }))
//           .filter(payment =>
//             payment.Status !== 'Cancelled' &&
//             payment['Payment Status'] === 'Pending'
//           )
//           .sort((a, b) => b['Check-In Date'].toDate() - a['Check-In Date'].toDate());

//         setPayments(paymentsData);
//         setLoading(false);
//       }, (error) => {
//         console.error('Error fetching payments:', error);
//         toast.error('Failed to fetch payment details');
//         setLoading(false);
//       });

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) {
//       return 'No Date';
//     }
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     }).replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>
//         {`
//           .payment-page-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }

//           .payment-card {
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             margin-bottom: 1rem;
//           }

//           .payment-header {
//             padding: 1rem;
//             border-top-left-radius: 10px;
//             border-top-right-radius: 10px;
//           }

//           .payment-content {
//             padding: 1.5rem;
//           }

//           .payment-field {
//             margin-bottom: 1rem;
//           }

//           .payment-label {
//             font-weight: 500;
//             margin-bottom: 0.5rem;
//             display: block;
//           }

//           .payment-value {
//             font-size: 1.1rem;
//           }

//           .save-button {
//             background: #038A5E;
//             color: white;
//             border: none;
//             padding: 0.75rem 2rem;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 1rem;
//             transition: background-color 0.2s;
//           }

//           .save-button:hover {
//             background: #e60000;
//           }

//           .status-select {
//             width: 100%;
//             padding: 0.5rem;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//             font-size: 1rem;
//           }

//           @media (max-width: 768px) {
//             .payment-page-container {
//               margin-left: 0;
//               margin-top: 0;
//               max-width: 100%;
//               padding: 1rem;
//             }

//             .payment-card {
//               border-radius: 0;
//             }
//           }
//             .card-divider {
//             border: 0;
//             border-top: 1px solid #ccc;
//             margin: 0;
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <h2 className="mb-4">Payment Details</h2>
//             {payments.length === 0 ? (
//               <p>No Pending Payments</p>
//             ) : (
//               payments.map((payment) => (
//               <div key={payment.id} className="payment-card card">
//                 <div className="payment-header card-body">
//                   <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                 </div>
//                 {/* Horizontal line between header and body */}
//                 <hr className="card-divider" />
//                 <div className="payment-content">
//                   <div className="payment-field">
//                     <span className="payment-label">Reservation Date:</span>
//                     <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                   </div>
//                   <div className="payment-field">
//                     <span className="payment-label">Contact Details:</span>
//                     <span className="payment-value">{payment['Phone Number']}</span>
//                   </div>
//                   <div className="payment-field">
//                     <span className="payment-label">Total Price:</span>
//                     <span className="payment-value">{payment['Total Price']}</span>
//                   </div>
//                   <div className="payment-field">
//                     <span className="payment-label">Payment Method:</span>
//                     <span className="payment-value">{payment['Payment Method']}</span>
//                   </div>
//                   <div className="payment-field">
//                     <span className="payment-label">Payment Status:</span>
//                     <select
//                       className="status-select"
//                       value={payment['Payment Status']}
//                       onChange={(e) => showConfirmationDialog(payment.id, e.target.value)}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Paid">Paid</option>
//                     </select>
//                   </div>
//                   <button
//                     className="save-button mt-3"
//                     onClick={() => showConfirmationDialog(payment.id, payment['Payment Status'])}
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import { collection, query, onSnapshot, doc, updateDoc, getDocs, Timestamp } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(
//         q,
//         async (querySnapshot) => {
//           const paymentPromises = querySnapshot.docs.map(async (docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             // Filter only pending and not cancelled
//             if (data.Status === 'Cancelled' || data['Payment Status'] !== 'Pending') return null;

//             // Fetch paymentProof subcollection
//             const proofRef = collection(db, 'Hotels', user.uid, 'Guest Details', id, 'paymentProof');
//             const proofSnap = await getDocs(proofRef);
//             const proofs = proofSnap.docs.map(p => p.data().url);

//             return {
//               id,
//               ...data,
//               paymentProofImages: proofs,
//             };
//           });

//           const resolvedPayments = await Promise.all(paymentPromises);
//           const validPayments = resolvedPayments.filter(p => p !== null);

//           // Sort by check-in date descending
//           validPayments.sort(
//             (a, b) => b['Check-In Date']?.toDate() - a['Check-In Date']?.toDate()
//           );

//           setPayments(validPayments);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) {
//       return 'No Date';
//     }
//     const date = timestamp.toDate();
//     return date
//       .toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       })
//       .replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (
//       window.confirm(
//         `Are you sure you want to update the payment status to ${newStatus}?`
//       )
//     ) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>
//         {`
//           .payment-page-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }

//           .payment-card {
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             margin-bottom: 1rem;
//           }

//           .payment-header {
//             padding: 1rem;
//             border-top-left-radius: 10px;
//             border-top-right-radius: 10px;
//           }

//           .payment-content {
//             padding: 1.5rem;
//           }

//           .payment-field {
//             margin-bottom: 1rem;
//           }

//           .payment-label {
//             font-weight: 500;
//             margin-bottom: 0.5rem;
//             display: block;
//           }

//           .payment-value {
//             font-size: 1.1rem;
//           }

//           .save-button {
//             background: #038A5E;
//             color: white;
//             border: none;
//             padding: 0.75rem 2rem;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 1rem;
//             transition: background-color 0.2s;
//           }

//           .save-button:hover {
//             background: #e60000;
//           }

//           .status-select {
//             width: 100%;
//             padding: 0.5rem;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//             font-size: 1rem;
//           }

//           .proof-image {
//             max-width: 200px;
//             max-height: 200px;
//             margin-right: 10px;
//             margin-top: 10px;
//             border-radius: 8px;
//             border: 1px solid #ccc;
//           }

//           @media (max-width: 768px) {
//             .payment-page-container {
//               margin-left: 0;
//               margin-top: 0;
//               max-width: 100%;
//               padding: 1rem;
//             }

//             .payment-card {
//               border-radius: 0;
//             }
//           }

//           .card-divider {
//             border: 0;
//             border-top: 1px solid #ccc;
//             margin: 0;
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <h2 className="mb-4">Payment Details</h2>
//             {payments.length === 0 ? (
//               <p>No Pending Payments</p>
//             ) : (
//               payments.map((payment) => (
//                 <div key={payment.id} className="payment-card card">
//                   <div className="payment-header card-body">
//                     <h3 className="mb-0">
//                       Guest Name: {payment['Full Name']}
//                     </h3>
//                   </div>
//                   <hr className="card-divider" />
//                   <div className="payment-content">
//                     <div className="payment-field">
//                       <span className="payment-label">Reservation Date:</span>
//                       <span className="payment-value">
//                         {formatDate(payment['Check-In Date'])}
//                       </span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Contact Details:</span>
//                       <span className="payment-value">
//                         {payment['Phone Number']}
//                       </span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Total Price:</span>
//                       <span className="payment-value">
//                         ₹{payment['Total Price']}
//                       </span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Method:</span>
//                       <span className="payment-value">
//                         {payment['Payment Method']}
//                       </span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Status:</span>
//                       <select
//                         className="status-select"
//                         value={payment['Payment Status']}
//                         onChange={(e) =>
//                           showConfirmationDialog(payment.id, e.target.value)
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Paid">Paid</option>
//                       </select>
//                     </div>

//                     {/* Uploaded Images Section */}
//                     <div className="payment-field">
//                       <span className="payment-label">Uploaded Proof:</span>
//                       {payment.paymentProofImages &&
//                       payment.paymentProofImages.length > 0 ? (
//                         <div className="d-flex flex-wrap">
//                           {payment.paymentProofImages.map((url, idx) => (
//                             <img
//                               key={idx}
//                               src={url}
//                               alt={`Proof ${idx + 1}`}
//                               className="proof-image"
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-muted">📂 No proof uploaded.</p>
//                       )}
//                     </div>

//                     <button
//                       className="save-button mt-3"
//                       onClick={() =>
//                         showConfirmationDialog(
//                           payment.id,
//                           payment['Payment Status']
//                         )
//                       }
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDocs,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(
//         q,
//         async (querySnapshot) => {
//           const paymentPromises = querySnapshot.docs.map(async (docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             if (data.Status === 'Cancelled' || data['Payment Status'] !== 'Pending') return null;

//             const proofRef = collection(db, 'Hotels', user.uid, 'Guest Details', id, 'paymentProof');
//             const proofSnap = await getDocs(proofRef);
//             const proofs = proofSnap.docs.map(p => p.data().url);

//             return {
//               id,
//               ...data,
//               paymentProofImages: proofs,
//             };
//           });

//           const resolvedPayments = await Promise.all(paymentPromises);
//           const validPayments = resolvedPayments.filter(p => p !== null);

//           validPayments.sort(
//             (a, b) => b['Check-In Date']?.toDate() - a['Check-In Date']?.toDate()
//           );

//           setPayments(validPayments);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) {
//       return 'No Date';
//     }
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter(payment => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) {
//     return <div>Loading...</div>;
//   }

// console.log(payments);

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>
//         {`
//           .payment-page-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }

//           .payment-card {
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             margin-bottom: 1rem;
//           }

//           .payment-header {
//             padding: 1rem;
//             border-top-left-radius: 10px;
//             border-top-right-radius: 10px;
//           }

//           .payment-content {
//             padding: 1.5rem;
//           }

//           .payment-field {
//             margin-bottom: 1rem;
//           }

//           .payment-label {
//             font-weight: 500;
//             margin-bottom: 0.5rem;
//             display: block;
//           }

//           .payment-value {
//             font-size: 1.1rem;
//           }

//           .save-button {
//             background: #038A5E;
//             color: white;
//             border: none;
//             padding: 0.75rem 2rem;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 1rem;
//             transition: background-color 0.2s;
//           }

//           .save-button:hover {
//             background: #e60000;
//           }

//           .status-select {
//             width: 100%;
//             padding: 0.5rem;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//             font-size: 1rem;
//           }

//           .proof-image {
//             max-width: 200px;
//             max-height: 200px;
//             margin-right: 10px;
//             margin-top: 10px;
//             border-radius: 8px;
//             border: 1px solid #ccc;
//           }

//           .card-divider {
//             border: 0;
//             border-top: 1px solid #ccc;
//             margin: 0;
//           }

//           .search-input {
//             padding: 0.75rem;
//             border: 1px solid #ccc;
//             border-radius: 8px;
//             width: 100%;
//             max-width: 400px;
//             margin-bottom: 1rem;
//             font-size: 1rem;
//           }

//           @media (max-width: 768px) {
//             .payment-page-container {
//               margin-left: 0;
//               margin-top: 0;
//               max-width: 100%;
//               padding: 1rem;
//             }

//             .payment-card {
//               border-radius: 0;
//             }
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <h2 className="mb-4">Payment Details</h2>

//             {/* Search bar */}
//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => (

//                 <div key={payment.id} className="payment-card card">
//                   <div className="payment-header card-body">
//                     <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>

//                   </div>
//                   <hr className="card-divider" />
//                   <div className="payment-content">
//                     <div className="payment-field">
//                       <span className="payment-label">Reservation Date:</span>
//                       <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Contact Details:</span>
//                       <span className="payment-value">{payment['Phone Number']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Total Price:</span>
//                       <span className="payment-value">₹{payment['Total Price']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Method:</span>
//                       <span className="payment-value">{payment['Payment Method']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Status:</span>
//                       <select
//                         className="status-select"
//                         value={payment['Payment Status']}
//                         onChange={(e) =>
//                           showConfirmationDialog(payment.id, e.target.value)
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Paid">Paid</option>
//                       </select>
//                     </div>

//                     <div className="payment-field">
//                       <span className="payment-label">Uploaded Proof:</span>
//                       {payment.paymentProofImages && payment.paymentProofImages.length > 0 ? (
//                         <div className="d-flex flex-wrap">
//                           {payment.paymentProofImages.map((url, idx) => (
//                             <img
//                               key={idx}
//                               src={url}
//                               alt={`Proof ${idx + 1}`}
//                               className="proof-image"
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-muted">📂 No proof uploaded.</p>
//                       )}
//                     </div>

//                     <button
//                       className="save-button mt-3"
//                       onClick={() => showConfirmationDialog(payment.id, payment['Payment Status'])}
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   getDocs,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(
//         q,
//         async (querySnapshot) => {
//           const paymentPromises = querySnapshot.docs.map(async (docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             if (data.Status === 'Cancelled') return null;

//             const proofRef = collection(db, 'Hotels', user.uid, 'Guest Details', id, 'paymentProof');
//             const proofSnap = await getDocs(proofRef);
//             let proofs = proofSnap.docs.map(p => p.data().url);

//             // ✅ fallback if subcollection is empty
//             if (proofs.length === 0 && data.latestProofUrl) {
//               proofs = [data.latestProofUrl];
//             }

//             return {
//               id,
//               ...data,
//               paymentProofImages: proofs,
//             };
//           });

//           const resolvedPayments = await Promise.all(paymentPromises);
//           const validPayments = resolvedPayments.filter(p => p !== null);

//           // Sort by status: Pending → Proof Submitted → Paid
//           validPayments.sort((a, b) => {
//             const statusOrder = { 'Pending': 0, 'Proof Submitted': 1, 'Paid': 2 };
//             const statusA = statusOrder[a['Payment Status']] ?? 99;
//             const statusB = statusOrder[b['Payment Status']] ?? 99;
//             return statusA - statusB;
//           });

//           setPayments(validPayments);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) return 'No Date';
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter(payment => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>
//         {`
//           .payment-page-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }

//           .payment-card {
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             margin-bottom: 1rem;
//           }

//           .payment-header {
//             padding: 1rem;
//             border-top-left-radius: 10px;
//             border-top-right-radius: 10px;
//           }

//           .payment-content {
//             padding: 1.5rem;
//           }

//           .payment-field {
//             margin-bottom: 1rem;
//           }

//           .payment-label {
//             font-weight: 500;
//             margin-bottom: 0.5rem;
//             display: block;
//           }

//           .payment-value {
//             font-size: 1.1rem;
//           }

//           .save-button {
//             background: #038A5E;
//             color: white;
//             border: none;
//             padding: 0.75rem 2rem;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 1rem;
//             transition: background-color 0.2s;
//           }

//           .save-button:hover {
//             background: #e60000;
//           }

//           .status-select {
//             width: 100%;
//             padding: 0.5rem;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//             font-size: 1rem;
//           }

//           .proof-image {
//             max-width: 200px;
//             max-height: 200px;
//             margin-right: 10px;
//             margin-top: 10px;
//             border-radius: 8px;
//             border: 1px solid #ccc;
//           }

//           .card-divider {
//             border: 0;
//             border-top: 1px solid #ccc;
//             margin: 0;
//           }

//           .search-input {
//             padding: 0.75rem;
//             border: 1px solid #ccc;
//             border-radius: 8px;
//             width: 100%;
//             max-width: 400px;
//             margin-bottom: 1rem;
//             font-size: 1rem;
//           }

//           @media (max-width: 768px) {
//             .payment-page-container {
//               margin-left: 0;
//               margin-top: 0;
//               max-width: 100%;
//               padding: 1rem;
//             }

//             .payment-card {
//               border-radius: 0;
//             }
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <h2 className="mb-4">Payment Details</h2>

//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => (
//                 <div key={payment.id} className="payment-card card">
//                   <div className="payment-header card-body">
//                     <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                   </div>
//                   <hr className="card-divider" />
//                   <div className="payment-content">
//                     <div className="payment-field">
//                       <span className="payment-label">Reservation Date:</span>
//                       <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Contact Details:</span>
//                       <span className="payment-value">{payment['Phone Number']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Total Price:</span>
//                       <span className="payment-value">₹{payment['Total Price']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Method:</span>
//                       <span className="payment-value">{payment['Payment Method']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Status:</span>
//                       <select
//                         className="status-select"
//                         value={payment['Payment Status']}
//                         onChange={(e) =>
//                           showConfirmationDialog(payment.id, e.target.value)
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Proof Submitted">Proof Submitted</option>
//                         <option value="Paid">Paid</option>
//                       </select>
//                     </div>

//                     <div className="payment-field">
//                       <span className="payment-label">Uploaded Proof:</span>
//                       {payment.paymentProofImages && payment.paymentProofImages.length > 0 ? (
//                         <div className="d-flex flex-wrap">
//                           {payment.paymentProofImages.map((url, idx) => (
//                             <img
//                               key={idx}
//                               src={url}
//                               alt={`Proof ${idx + 1}`}
//                               className="proof-image"
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-muted">📂 No proof uploaded.</p>
//                       )}
//                     </div>

//                     <button
//                       className="save-button mt-3"
//                       onClick={() => showConfirmationDialog(payment.id, payment['Payment Status'])}
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(
//         q,
//         async (querySnapshot) => {
//           const paymentList = querySnapshot.docs.map((docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             if (data.Status === 'Cancelled' || data['Payment Status'] !== 'Pending') return null;

//             const proofImage = data.latestProofUrl ? [data.latestProofUrl] : [];

//             return {
//               id,
//               ...data,
//               paymentProofImages: proofImage,
//             };
//           });

//           const filtered = paymentList.filter(Boolean);
//           filtered.sort(
//             (a, b) => b['Check-In Date']?.toDate() - a['Check-In Date']?.toDate()
//           );

//           setPayments(filtered);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) {
//       return 'No Date';
//     }
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter(payment => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>
//         {`
//           .payment-page-container {
//             margin-left: 250px;
//             margin-top: 60px;
//             max-width: calc(100% - 250px);
//           }

//           .payment-card {
//             background: white;
//             border-radius: 10px;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             margin-bottom: 1rem;
//           }

//           .payment-header {
//             padding: 1rem;
//             border-top-left-radius: 10px;
//             border-top-right-radius: 10px;
//           }

//           .payment-content {
//             padding: 1.5rem;
//           }

//           .payment-field {
//             margin-bottom: 1rem;
//           }

//           .payment-label {
//             font-weight: 500;
//             margin-bottom: 0.5rem;
//             display: block;
//           }

//           .payment-value {
//             font-size: 1.1rem;
//           }

//           .save-button {
//             background: #038A5E;
//             color: white;
//             border: none;
//             padding: 0.75rem 2rem;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 1rem;
//             transition: background-color 0.2s;
//           }

//           .save-button:hover {
//             background: #e60000;
//           }

//           .status-select {
//             width: 100%;
//             padding: 0.5rem;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//             font-size: 1rem;
//           }

//           .proof-image {
//             max-width: 200px;
//             max-height: 200px;
//             margin-right: 10px;
//             margin-top: 10px;
//             border-radius: 8px;
//             border: 1px solid #ccc;
//           }

//           .card-divider {
//             border: 0;
//             border-top: 1px solid #ccc;
//             margin: 0;
//           }

//           .search-input {
//             padding: 0.75rem;
//             border: 1px solid #ccc;
//             border-radius: 8px;
//             width: 100%;
//             max-width: 400px;
//             margin-bottom: 1rem;
//             font-size: 1rem;
//           }

//           @media (max-width: 768px) {
//             .payment-page-container {
//               margin-left: 0;
//               margin-top: 0;
//               max-width: 100%;
//               padding: 1rem;
//             }

//             .payment-card {
//               border-radius: 0;
//             }
//           }
//         `}
//       </style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">

//         <div className="d-flex justify-content-between align-items-center mb-4">
//   <h2 className="mb-0">Payment Details</h2>
//   <Link to="/AllGuestPayments" title="All Guest Payments">
//     <i className="bi bi-people-fill fs-2 text-primary"></i>
//   </Link>
// </div>

//             {/* Search bar */}
//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => (
//                 <div key={payment.id} className="payment-card card">
//                   <div className="payment-header card-body">
//                     <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                   </div>
//                   <hr className="card-divider" />
//                   <div className="payment-content">
//                     <div className="payment-field">
//                       <span className="payment-label">Reservation Date:</span>
//                       <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Contact Details:</span>
//                       <span className="payment-value">{payment['Phone Number']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Total Price:</span>
//                       <span className="payment-value">₹{payment['Total Price']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Method:</span>
//                       <span className="payment-value">{payment['Payment Method']}</span>
//                     </div>
//                     <div className="payment-field">
//                       <span className="payment-label">Payment Status:</span>
//                       <select
//                         className="status-select"
//                         value={payment['Payment Status']}
//                         onChange={(e) =>
//                           showConfirmationDialog(payment.id, e.target.value)
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Paid">Paid</option>
//                       </select>
//                     </div>

//                     <div className="payment-field">
//                       <span className="payment-label">Uploaded Proof:</span>
//                       {payment.paymentProofImages && payment.paymentProofImages.length > 0 ? (
//                         <div className="d-flex flex-wrap">
//                           {payment.paymentProofImages.map((url, idx) => (
//                             <img
//                               key={idx}
//                               src={url}
//                               alt={`Proof ${idx + 1}`}
//                               className="proof-image"
//                             />
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-muted">📂 No proof uploaded.</p>
//                       )}
//                     </div>

//                     <button
//                       className="save-button mt-3"
//                       onClick={() => showConfirmationDialog(payment.id, payment['Payment Status'])}
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusChanges, setStatusChanges] = useState({}); // Track status updates

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
//       const unsubscribe = onSnapshot(
//         q,
//         async (querySnapshot) => {
//           const paymentList = querySnapshot.docs.map((docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             if (data.Status === 'Cancelled' || data['Payment Status'] !== 'Pending') return null;

//             const paymentProofImages = Array.isArray(data['Payment Proof'])
//               ? data['Payment Proof'].map((item) => item.url)
//               : data.latestProofUrl
//               ? [data.latestProofUrl]
//               : [];

//             return {
//               id,
//               ...data,
//               paymentProofImages,
//             };
//           });

//           const filtered = paymentList.filter(Boolean);
//           filtered.sort(
//             (a, b) => {
//               const aDate = a['Check-In Date']?.toDate?.() || new Date(0);
//               const bDate = b['Check-In Date']?.toDate?.() || new Date(0);
//               return bDate - aDate;
//             }
//           );

//           setPayments(filtered);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//       setStatusChanges((prev) => {
//         const updated = { ...prev };
//         delete updated[paymentId];
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) return 'No Date';
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB').replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (
//       window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)
//     ) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter((payment) => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>{`
//         .payment-page-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         .payment-card {
//           background: white;
//           border-radius: 10px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-bottom: 1rem;
//         }
//         .payment-header {
//           padding: 1rem;
//           border-top-left-radius: 10px;
//           border-top-right-radius: 10px;
//         }
//         .payment-content {
//           padding: 1.5rem;
//         }
//         .payment-field {
//           margin-bottom: 1rem;
//         }
//         .payment-label {
//           font-weight: 500;
//           margin-bottom: 0.5rem;
//           display: block;
//         }
//         .payment-value {
//           font-size: 1.1rem;
//         }
//         .save-button {
//           background: #038A5E;
//           color: white;
//           border: none;
//           padding: 0.75rem 2rem;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 1rem;
//         }
//         .save-button:hover {
//           background: #02664A;
//         }
//         .status-select {
//           width: 100%;
//           padding: 0.5rem;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           font-size: 1rem;
//         }
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin-right: 10px;
//           margin-top: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           cursor: pointer;
//         }
//         .card-divider {
//           border: 0;
//           border-top: 1px solid #ccc;
//           margin: 0;
//         }
//         .search-input {
//           padding: 0.75rem;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 400px;
//           margin-bottom: 1rem;
//           font-size: 1rem;
//         }
//         @media (max-width: 768px) {
//           .payment-page-container {
//             margin-left: 0;
//             margin-top: 0;
//             max-width: 100%;
//             padding: 1rem;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="mb-0">Payment Details</h2>
//               <Link to="/AllGuestPayments" title="All Guest Payments">
//                 <i className="bi bi-people-fill fs-2 text-primary"></i>
//               </Link>
//             </div>

//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => {
//                 const currentStatus = payment['Payment Status'];
//                 const newStatus = statusChanges[payment.id] ?? currentStatus;
//                 return (
//                   <div key={payment.id} className="payment-card card">
//                     <div className="payment-header card-body">
//                       <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                     </div>
//                     <hr className="card-divider" />
//                     <div className="payment-content">
//                       <div className="payment-field">
//                         <span className="payment-label">Reservation Date:</span>
//                         <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Contact:</span>
//                         <span className="payment-value">{payment['Phone Number']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Total Price:</span>
//                         <span className="payment-value">₹{payment['Total Price']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Method:</span>
//                         <span className="payment-value">{payment['Payment Method']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Status:</span>
//                         <select
//                           className="status-select"
//                           value={newStatus}
//                           onChange={(e) =>
//                             setStatusChanges((prev) => ({
//                               ...prev,
//                               [payment.id]: e.target.value,
//                             }))
//                           }
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </div>

//                       <div className="payment-field">
//                         <span className="payment-label">Uploaded Proof:</span>
//                         {payment.paymentProofImages.length > 0 ? (
//                           <div className="d-flex flex-wrap">
//                             {payment.paymentProofImages.map((url, idx) => (
//                               <a
//                                 key={idx}
//                                 href={url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 <img
//                                   src={url}
//                                   alt={`Proof ${idx + 1}`}
//                                   className="proof-image"
//                                 />
//                               </a>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-muted">📂 No proof uploaded.</p>
//                         )}
//                       </div>

//                       <button
//                         className="save-button mt-3"
//                         disabled={newStatus === currentStatus}
//                         onClick={() => showConfirmationDialog(payment.id, newStatus)}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusChanges, setStatusChanges] = useState({});

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       // const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));

//       const q = query(collection(db, 'Hotels', userId, 'Guest Details'));

//       const unsubscribe = onSnapshot(
//         q,
//         async (querySnapshot) => {
//           const paymentList = querySnapshot.docs.map((docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             console.log('Fetched doc:', { id, ...data }); // Debugging

//             const paymentProofImages = Array.isArray(data['Payment Proof'])
//               ? data['Payment Proof'].map((item) => item.url)
//               : data.latestProofUrl
//               ? [data.latestProofUrl]
//               : [];

//             return {
//               id,
//               ...data,
//               paymentProofImages,
//             };
//           });

//           const filtered = paymentList.filter(Boolean);
//           filtered.sort(
//             (a, b) => {
//               const aDate = a['Check-In Date']?.toDate?.() || new Date(0);
//               const bDate = b['Check-In Date']?.toDate?.() || new Date(0);
//               return bDate - aDate;
//             }
//           );

//           setPayments(filtered);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//       setStatusChanges((prev) => {
//         const updated = { ...prev };
//         delete updated[paymentId];
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) return 'No Date';
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB').replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (
//       window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)
//     ) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter((payment) => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>{`
//         .payment-page-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         .payment-card {
//           background: white;
//           border-radius: 10px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-bottom: 1rem;
//         }
//         .payment-header {
//           padding: 1rem;
//           border-top-left-radius: 10px;
//           border-top-right-radius: 10px;
//         }
//         .payment-content {
//           padding: 1.5rem;
//         }
//         .payment-field {
//           margin-bottom: 1rem;
//         }
//         .payment-label {
//           font-weight: 500;
//           margin-bottom: 0.5rem;
//           display: block;
//         }
//         .payment-value {
//           font-size: 1.1rem;
//         }
//         .save-button {
//           background: #038A5E;
//           color: white;
//           border: none;
//           padding: 0.75rem 2rem;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 1rem;
//         }
//         .save-button:hover {
//           background: #02664A;
//         }
//         .status-select {
//           width: 100%;
//           padding: 0.5rem;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           font-size: 1rem;
//         }
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin-right: 10px;
//           margin-top: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           cursor: pointer;
//         }
//         .card-divider {
//           border: 0;
//           border-top: 1px solid #ccc;
//           margin: 0;
//         }
//         .search-input {
//           padding: 0.75rem;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 400px;
//           margin-bottom: 1rem;
//           font-size: 1rem;
//         }
//         @media (max-width: 768px) {
//           .payment-page-container {
//             margin-left: 0;
//             margin-top: 0;
//             max-width: 100%;
//             padding: 1rem;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="mb-0">Payment Details</h2>
//               <Link to="/AllGuestPayments" title="All Guest Payments">
//                 <i className="bi bi-people-fill fs-2 text-primary"></i>
//               </Link>
//             </div>

//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => {
//                 const currentStatus = payment['Payment Status'];
//                 const newStatus = statusChanges[payment.id] ?? currentStatus;
//                 return (
//                   <div key={payment.id} className="payment-card card">
//                     <div className="payment-header card-body">
//                       <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                     </div>
//                     <hr className="card-divider" />
//                     <div className="payment-content">
//                       <div className="payment-field">
//                         <span className="payment-label">Reservation Date:</span>
//                         <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Contact:</span>
//                         <span className="payment-value">{payment['Phone Number']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Total Price:</span>
//                         <span className="payment-value">₹{payment['Total Price']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Method:</span>
//                         <span className="payment-value">{payment['Payment Method']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Status:</span>
//                         <select
//                           className="status-select"
//                           value={newStatus}
//                           onChange={(e) =>
//                             setStatusChanges((prev) => ({
//                               ...prev,
//                               [payment.id]: e.target.value,
//                             }))
//                           }
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </div>

//                       <div className="payment-field">
//                         <span className="payment-label">Uploaded Proof:</span>
//                         {payment.paymentProofImages.length > 0 ? (
//                           <div className="d-flex flex-wrap">
//                             {payment.paymentProofImages.map((url, idx) => (
//                               <a
//                                 key={idx}
//                                 href={url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 <img
//                                   src={url}
//                                   alt={`Proof ${idx + 1}`}
//                                   className="proof-image"
//                                 />
//                               </a>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-muted">📂 No proof uploaded.</p>
//                         )}
//                       </div>

//                       <button
//                         className="save-button mt-3"
//                         disabled={newStatus === currentStatus}
//                         onClick={() => showConfirmationDialog(payment.id, newStatus)}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusChanges, setStatusChanges] = useState({});

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));

//     const unsubscribe = onSnapshot(
//       q,
//       (querySnapshot) => {
//         const paymentList = querySnapshot.docs.map((docSnap) => {
//           const data = docSnap.data();
//           const id = docSnap.id;

//           const proofArray = Array.isArray(data['Payment Proof']) ? data['Payment Proof'] : [];
//           const urls = proofArray.map((item) => item.url).filter(Boolean);
//           if (data.latestProofUrl && !urls.includes(data.latestProofUrl)) {
//             urls.push(data.latestProofUrl);
//           }

//           return {
//             id,
//             ...data,
//             paymentProofImages: urls,
//           };
//         });

//         const filtered = paymentList.filter(Boolean);
//         filtered.sort((a, b) => {
//           const aDate = a['Check-In Date']?.toDate?.() || new Date(0);
//           const bDate = b['Check-In Date']?.toDate?.() || new Date(0);
//           return bDate - aDate;
//         });

//         setPayments(filtered);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching payments:', error);
//         toast.error('Failed to fetch payment details');
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//       setStatusChanges((prev) => {
//         const updated = { ...prev };
//         delete updated[paymentId];
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) return 'No Date';
//     return timestamp.toDate().toLocaleDateString('en-GB').replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter((payment) => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>{`
//         .payment-page-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         .payment-card {
//           background: white;
//           border-radius: 10px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-bottom: 1rem;
//         }
//         .payment-header {
//           padding: 1rem;
//           border-top-left-radius: 10px;
//           border-top-right-radius: 10px;
//         }
//         .payment-content {
//           padding: 1.5rem;
//         }
//         .payment-field {
//           margin-bottom: 1rem;
//         }
//         .payment-label {
//           font-weight: 500;
//           margin-bottom: 0.5rem;
//           display: block;
//         }
//         .payment-value {
//           font-size: 1.1rem;
//         }
//         .save-button {
//           background: #038A5E;
//           color: white;
//           border: none;
//           padding: 0.75rem 2rem;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 1rem;
//         }
//         .save-button:hover {
//           background: #02664A;
//         }
//         .status-select {
//           width: 100%;
//           padding: 0.5rem;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           font-size: 1rem;
//         }
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin-right: 10px;
//           margin-top: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           cursor: pointer;
//         }
//         .card-divider {
//           border: 0;
//           border-top: 1px solid #ccc;
//           margin: 0;
//         }
//         .search-input {
//           padding: 0.75rem;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 400px;
//           margin-bottom: 1rem;
//           font-size: 1rem;
//         }
//         @media (max-width: 768px) {
//           .payment-page-container {
//             margin-left: 0;
//             margin-top: 0;
//             max-width: 100%;
//             padding: 1rem;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="mb-0">Payment Details</h2>
//               <Link to="/AllGuestPayments" title="All Guest Payments">
//                 <i className="bi bi-people-fill fs-2 text-primary"></i>
//               </Link>
//             </div>

//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => {
//                 const currentStatus = payment['Payment Status'];
//                 const newStatus = statusChanges[payment.id] ?? currentStatus;
//                 return (
//                   <div key={payment.id} className="payment-card card">
//                     <div className="payment-header card-body">
//                       <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                     </div>
//                     <hr className="card-divider" />
//                     <div className="payment-content">
//                       <div className="payment-field">
//                         <span className="payment-label">Reservation Date:</span>
//                         <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Contact:</span>
//                         <span className="payment-value">{payment['Phone Number']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Total Price:</span>
//                         <span className="payment-value">₹{payment['Total Price']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Method:</span>
//                         <span className="payment-value">{payment['Payment Method']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Status:</span>
//                         <select
//                           className="status-select"
//                           value={newStatus}
//                           onChange={(e) =>
//                             setStatusChanges((prev) => ({
//                               ...prev,
//                               [payment.id]: e.target.value,
//                             }))
//                           }
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </div>

//                       <div className="payment-field">
//                         <span className="payment-label">Uploaded Proof:</span>
//                         {payment.paymentProofImages.length > 0 ? (
//                           <div className="d-flex flex-wrap">
//                             {payment.paymentProofImages.map((url, idx) => (
//                               <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
//                                 <img src={url} alt={`Proof ${idx + 1}`} className="proof-image" />
//                               </a>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-muted">📂 No proof uploaded.</p>
//                         )}
//                       </div>

//                       <button
//                         className="save-button mt-3"
//                         disabled={newStatus === currentStatus}
//                         onClick={() => showConfirmationDialog(payment.id, newStatus)}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
//   Timestamp,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusChanges, setStatusChanges] = useState({});

//   useEffect(() => {
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       if (!user) {
//         setLoading(false);
//         toast.error('User not logged in');
//         return;
//       }

//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));

//       const unsubscribeSnapshot = onSnapshot(
//         q,
//         (querySnapshot) => {
//           const paymentList = querySnapshot.docs.map((docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             // Collect multiple proof images if available
//             const proofArray = Array.isArray(data['Payment Proof']) ? data['Payment Proof'] : [];
//             const urls = proofArray.map((item) => item.url).filter(Boolean);
//             if (data.latestProofUrl && !urls.includes(data.latestProofUrl)) {
//               urls.push(data.latestProofUrl);
//             }

//             return {
//               id,
//               ...data,
//               paymentProofImages: urls,
//             };
//           });

//           const filtered = paymentList.filter(Boolean);
//           filtered.sort((a, b) => {
//             const aDate = a['Check-In Date']?.toDate?.() || new Date(0);
//             const bDate = b['Check-In Date']?.toDate?.() || new Date(0);
//             return bDate - aDate;
//           });

//           setPayments(filtered);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribeSnapshot();
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//       setStatusChanges((prev) => {
//         const updated = { ...prev };
//         delete updated[paymentId];
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp || !(timestamp instanceof Timestamp)) return 'No Date';
//     const date = timestamp.toDate();
//     return date.toLocaleDateString('en-GB').replace(/\//g, '-');
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (
//       window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)
//     ) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter((payment) => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>{`
//         .payment-page-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         .payment-card {
//           background: white;
//           border-radius: 10px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-bottom: 1rem;
//         }
//         .payment-header {
//           padding: 1rem;
//           border-top-left-radius: 10px;
//           border-top-right-radius: 10px;
//         }
//         .payment-content {
//           padding: 1.5rem;
//         }
//         .payment-field {
//           margin-bottom: 1rem;
//         }
//         .payment-label {
//           font-weight: 500;
//           margin-bottom: 0.5rem;
//           display: block;
//         }
//         .payment-value {
//           font-size: 1.1rem;
//         }
//         .save-button {
//           background: #038A5E;
//           color: white;
//           border: none;
//           padding: 0.75rem 2rem;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 1rem;
//         }
//         .save-button:hover {
//           background: #02664A;
//         }
//         .status-select {
//           width: 100%;
//           padding: 0.5rem;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           font-size: 1rem;
//         }
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin-right: 10px;
//           margin-top: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           cursor: pointer;
//         }
//         .card-divider {
//           border: 0;
//           border-top: 1px solid #ccc;
//           margin: 0;
//         }
//         .search-input {
//           padding: 0.75rem;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 400px;
//           margin-bottom: 1rem;
//           font-size: 1rem;
//         }
//         @media (max-width: 768px) {
//           .payment-page-container {
//             margin-left: 0;
//             margin-top: 0;
//             max-width: 100%;
//             padding: 1rem;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="mb-0">Payment Details</h2>
//               <Link to="/AllGuestPayments" title="All Guest Payments">
//                 <i className="bi bi-people-fill fs-2 text-primary"></i>
//               </Link>
//             </div>

//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => {
//                 const currentStatus = payment['Payment Status'];
//                 const newStatus = statusChanges[payment.id] ?? currentStatus;
//                 return (
//                   <div key={payment.id} className="payment-card card">
//                     <div className="payment-header card-body">
//                       <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
//                     </div>
//                     <hr className="card-divider" />
//                     <div className="payment-content">
//                       <div className="payment-field">
//                         <span className="payment-label">Reservation Date:</span>
//                         <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Contact:</span>
//                         <span className="payment-value">{payment['Phone Number']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Total Price:</span>
//                         <span className="payment-value">₹{payment['Total Price']}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Method:</span>
//                         <span className="payment-value">{payment['Payment Method'] || 'N/A'}</span>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Status:</span>
//                         <select
//                           className="status-select"
//                           value={newStatus}
//                           onChange={(e) =>
//                             setStatusChanges((prev) => ({
//                               ...prev,
//                               [payment.id]: e.target.value,
//                             }))
//                           }
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </div>

//                       <div className="payment-field">
//                         <span className="payment-label">Uploaded Proof:</span>
//                         {payment.paymentProofImages.length > 0 ? (
//                           <div className="d-flex flex-wrap">
//                             {payment.paymentProofImages.map((url, idx) => (
//                               <a
//                                 key={idx}
//                                 href={url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 <img
//                                   src={url}
//                                   alt={`Proof ${idx + 1}`}
//                                   className="proof-image"
//                                 />
//                               </a>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-muted">📂 No proof uploaded.</p>
//                         )}
//                       </div>

//                       <button
//                         className="save-button mt-3"
//                         disabled={newStatus === currentStatus}
//                         onClick={() => showConfirmationDialog(payment.id, newStatus)}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   onSnapshot,
//   doc,
//   updateDoc,
// } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusChanges, setStatusChanges] = useState({});

//   useEffect(() => {
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       if (!user) {
//         setLoading(false);
//         toast.error('User not logged in');
//         return;
//       }

//       const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));

//       const unsubscribeSnapshot = onSnapshot(
//         q,
//         (querySnapshot) => {
//           const paymentList = querySnapshot.docs.map((docSnap) => {
//             const data = docSnap.data();
//             const id = docSnap.id;

//             // Collect all images
//             const allProofs = Array.isArray(data['Payment Proof']) ? data['Payment Proof'] : [];
//             const paymentProofImages = allProofs.map((item) => item.url).filter(Boolean);

//             // If latestProofUrl exists but not in array, push it
//             if (data.latestProofUrl && !paymentProofImages.includes(data.latestProofUrl)) {
//               paymentProofImages.push(data.latestProofUrl);
//             }

//             return {
//               id,
//               ...data,
//               paymentProofImages,
//               timestamp: data.createdAt?.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(0),
//             };
//           });

//           const sorted = paymentList.sort((a, b) => b.timestamp - a.timestamp);
//           setPayments(sorted);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching payments:', error);
//           toast.error('Failed to fetch payment details');
//           setLoading(false);
//         }
//       );

//       return () => unsubscribeSnapshot();
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   const handleStatusChange = async (paymentId, newStatus) => {
//     const user = auth.currentUser;
//     if (!user) {
//       toast.error('You must be logged in to update payment status');
//       return;
//     }

//     try {
//       const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
//       await updateDoc(paymentDocRef, {
//         'Payment Status': newStatus,
//       });
//       toast.success(`Payment status updated to ${newStatus}`);
//       setStatusChanges((prev) => {
//         const updated = { ...prev };
//         delete updated[paymentId];
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error updating payment status:', error);
//       toast.error('Failed to update payment status');
//     }
//   };

//   const formatDate = (timestamp) => {
//     try {
//       return timestamp?.toLocaleDateString('en-GB').replace(/\//g, '-') || 'N/A';
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   const showConfirmationDialog = (paymentId, newStatus) => {
//     if (
//       window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)
//     ) {
//       handleStatusChange(paymentId, newStatus);
//     }
//   };

//   const filteredPayments = payments.filter((payment) => {
//     const name = payment['Full Name']?.toLowerCase() || '';
//     const phone = payment['Phone Number']?.toLowerCase() || '';
//     return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
//   });

//   if (loading) return <div className="text-center py-4">Loading guest payment data...</div>;

//   return (
//     <div className="payment-page-container p-lg-3">
//       <style>{`
//         .payment-page-container {
//           margin-left: 250px;
//           margin-top: 60px;
//           max-width: calc(100% - 250px);
//         }
//         .payment-card {
//           background: white;
//           border-radius: 10px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-bottom: 1rem;
//         }
//         .payment-header {
//           padding: 1rem;
//         }
//         .payment-content {
//           padding: 1.5rem;
//         }
//         .payment-field {
//           margin-bottom: 1rem;
//         }
//         .payment-label {
//           font-weight: 500;
//           margin-bottom: 0.25rem;
//           display: block;
//         }
//         .save-button {
//           background: #038A5E;
//           color: white;
//           border: none;
//           padding: 0.75rem 2rem;
//           border-radius: 5px;
//           cursor: pointer;
//         }
//         .status-select {
//           width: 100%;
//           padding: 0.5rem;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//         }
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin-right: 10px;
//           margin-top: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//         }
//         .search-input {
//           padding: 0.75rem;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 400px;
//           margin-bottom: 1rem;
//         }
//         @media (max-width: 768px) {
//           .payment-page-container {
//             margin-left: 0;
//             margin-top: 0;
//             max-width: 100%;
//             padding: 1rem;
//           }
//         }
//       `}</style>

//       <div className="container-fluid p-0">
//         <div className="row g-0">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h2 className="mb-0">Payment Details</h2>
//               <Link to="/AllGuestPayments" title="All Guest Payments">
//                 <i className="bi bi-people-fill fs-2 text-primary"></i>
//               </Link>
//             </div>

//             <input
//               type="text"
//               placeholder="🔍 Search by guest name or phone number..."
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             {filteredPayments.length === 0 ? (
//               <p>No matching guests found.</p>
//             ) : (
//               filteredPayments.map((payment) => {
//                 const currentStatus = payment['Payment Status'];
//                 const newStatus = statusChanges[payment.id] ?? currentStatus;
//                 return (
//                   <div key={payment.id} className="payment-card card">
//                     <div className="payment-header card-body">
//                       <h4 className="mb-0">{payment['Full Name']}</h4>
//                     </div>
//                     <div className="payment-content">
//                       <div className="payment-field">
//                         <span className="payment-label">Reservation Date:</span>
//                         {formatDate(payment['Check-In Date']?.toDate?.())}
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Phone:</span>
//                         {payment['Phone Number']}
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Email:</span>
//                         {payment['Email Address'] || 'N/A'}
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Total Price:</span>
//                         ₹{payment['Total Price']}
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Confirmation ID:</span>
//                         {payment['confirmationId'] || payment.id}
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Payment Status:</span>
//                         <select
//                           className="status-select"
//                           value={newStatus}
//                           onChange={(e) =>
//                             setStatusChanges((prev) => ({
//                               ...prev,
//                               [payment.id]: e.target.value,
//                             }))
//                           }
//                         >
//                           <option value="Pending">Pending</option>
//                           <option value="Paid">Paid</option>
//                         </select>
//                       </div>
//                       <div className="payment-field">
//                         <span className="payment-label">Uploaded Proof:</span>
//                         {payment.paymentProofImages.length > 0 ? (
//                           <div className="d-flex flex-wrap">
//                             {payment.paymentProofImages.map((url, idx) => (
//                               <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
//                                 <img src={url} alt={`Proof ${idx + 1}`} className="proof-image" />
//                               </a>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-muted">📂 No proof uploaded.</p>
//                         )}
//                       </div>
//                       <button
//                         className="save-button mt-3"
//                         disabled={newStatus === currentStatus}
//                         onClick={() => showConfirmationDialog(payment.id, newStatus)}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../firebase/config";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// const PaymentPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusChanges, setStatusChanges] = useState({});

//   useEffect(() => {
//     const fetchAllGuestProofs = async () => {
//       try {
//         const hotelsSnapshot = await getDocs(collection(db, "Hotels"));
//         const allProofs = [];

//         for (const hotelDoc of hotelsSnapshot.docs) {
//           const userId = hotelDoc.id;
//           const guestDetailsRef = collection(db, "Hotels", userId, "Guest Details");
//           const guestDetailsSnapshot = await getDocs(guestDetailsRef);

//           guestDetailsSnapshot.forEach((docSnap) => {
//             const data = docSnap.data();
//             const paymentProofImages = Array.isArray(data["Payment Proof"])
//               ? data["Payment Proof"].map((proof) => proof.url).filter(Boolean)
//               : [];

//             if (data.latestProofUrl && !paymentProofImages.includes(data.latestProofUrl)) {
//               paymentProofImages.push(data.latestProofUrl);
//             }

//             allProofs.push({
//               id: docSnap.id,
//               userId,
//               guestName: data["Full Name"] || "Guest",
//               guestPhone: data["Phone Number"] || "N/A",
//               guestEmail: data["Email Address"] || "N/A",
//               confirmationId: data["confirmationId"] || "N/A",
//               checkIn: data["Check-In Date"]
//                 ? new Date(data["Check-In Date"].seconds * 1000).toLocaleDateString("en-IN")
//                 : "N/A",
//               totalPrice: data["Total Price"] || 0,
//               paymentStatus: data["Payment Status"] || "Pending",
//               paymentProofImages,
//               timestamp: data.createdAt?.seconds
//                 ? new Date(data.createdAt.seconds * 1000)
//                 : new Date(0),
//             });
//           });
//         }

//         const sorted = allProofs.sort(
//           (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
//         );

//         setPayments(sorted);
//       } catch (error) {
//         console.error("❌ Error fetching payment data:", error);
//         toast.error("Failed to fetch guest payment details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllGuestProofs();
//   }, []);

//   const handleStatusChange = async (userId, guestId, newStatus) => {
//     try {
//       const paymentDocRef = doc(db, "Hotels", userId, "Guest Details", guestId);
//       await updateDoc(paymentDocRef, { "Payment Status": newStatus });

//       setStatusChanges((prev) => {
//         const updated = { ...prev };
//         delete updated[`${userId}_${guestId}`];
//         return updated;
//       });

//       toast.success("✅ Payment status updated");
//     } catch (error) {
//       console.error("❌ Error updating status:", error);
//       toast.error("Failed to update status");
//     }
//   };

//   const filteredPayments = payments.filter((p) =>
//     `${p.guestName} ${p.guestEmail} ${p.guestPhone} ${p.confirmationId}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="text-center py-4">Loading guest payment data...</div>;

//   return (
//     <div className="container py-4">
//       <h3 className="mb-4">🧾 All Guest Payments</h3>

//       <input
//         type="text"
//         placeholder="🔍 Search by name, email, phone or confirmation ID"
//         className="form-control mb-3"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {filteredPayments.length === 0 ? (
//         <p>No matching records found.</p>
//       ) : (
//         filteredPayments.map((p, index) => {
//           const uniqueKey = `${p.userId}_${p.id}`;
//           const currentStatus = p.paymentStatus;
//           const changedStatus = statusChanges[uniqueKey] ?? currentStatus;

//           return (
//             <div key={uniqueKey} className="card mb-4">
//               <div className="card-body">
//                 <h5>👤 {p.guestName}</h5>
//                 <p>📱 +91-{p.guestPhone}</p>
//                 <p>📧 {p.guestEmail}</p>
//                 <p>📅 Check-In: {p.checkIn}</p>
//                 <p>💵 Total: ₹{p.totalPrice}</p>
//                 <p>🆔 Confirmation ID: {p.confirmationId}</p>
//                 <div className="mb-3">
//                   <label><strong>Payment Status:</strong></label>
//                   <select
//                     className="form-select mt-1"
//                     value={changedStatus}
//                     onChange={(e) =>
//                       setStatusChanges((prev) => ({
//                         ...prev,
//                         [uniqueKey]: e.target.value,
//                       }))
//                     }
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Paid">Paid</option>
//                   </select>
//                   {changedStatus !== currentStatus && (
//                     <button
//                       className="btn btn-success btn-sm mt-2"
//                       onClick={() => handleStatusChange(p.userId, p.id, changedStatus)}
//                     >
//                       Save Status
//                     </button>
//                   )}
//                 </div>

//                 <div className="d-flex flex-wrap">
//                   {p.paymentProofImages?.length > 0 ? (
//                     p.paymentProofImages.map((url, i) => (
//                       <a
//                         key={i}
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="me-2 mb-2"
//                       >
//                         <img
//                           src={url}
//                           alt={`Proof ${i + 1}`}
//                           style={{
//                             maxWidth: "150px",
//                             maxHeight: "150px",
//                             borderRadius: "8px",
//                             border: "1px solid #ccc",
//                           }}
//                         />
//                       </a>
//                     ))
//                   ) : (
//                     <p className="text-muted">No payment proof uploaded.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default PaymentPage;





import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import {Link} from "react-router-dom";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusChanges, setStatusChanges] = useState({});

  useEffect(() => {
    const fetchAllGuestProofs = async () => {
      try {
        const hotelsSnapshot = await getDocs(collection(db, "Hotels"));
        const allProofs = [];

        for (const hotelDoc of hotelsSnapshot.docs) {
          const userId = hotelDoc.id;
          const guestDetailsRef = collection(
            db,
            "Hotels",
            userId,
            "Guest Details"
          );
          const guestDetailsSnapshot = await getDocs(guestDetailsRef);

          guestDetailsSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const proofArray = Array.isArray(data["Payment Proof"])
              ? data["Payment Proof"]
              : [];
            const urls = proofArray.map((item) => item.url).filter(Boolean);

            if (data.latestProofUrl && !urls.includes(data.latestProofUrl)) {
              urls.push(data.latestProofUrl);
            }

            allProofs.push({
              id: docSnap.id,
              userId,
              guestName: data["Full Name"] || "Guest",
              guestPhone: data["Phone Number"] || "N/A",
              guestEmail: data["Email Address"] || "N/A",
              confirmationId: data["confirmationId"] || "N/A",
              checkIn: data["Check-In Date"]
                ? new Date(
                    data["Check-In Date"].seconds * 1000
                  ).toLocaleDateString("en-IN")
                : "N/A",
              totalPrice: data["Total Price"] || 0,
              paymentStatus: data["Payment Status"] || "Pending",
              paymentProofImages: urls,
              timestamp: data.createdAt?.seconds
                ? new Date(data.createdAt.seconds * 1000)
                : new Date(0),
            });
          });
        }

        const sorted = allProofs.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        setPayments(sorted);
      } catch (error) {
        console.error("❌ Error fetching payment data:", error);
        toast.error("Failed to fetch guest payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAllGuestProofs();
  }, []);

  const handleStatusChange = async (userId, guestId, newStatus) => {
    try {
      const paymentDocRef = doc(db, "Hotels", userId, "Guest Details", guestId);
      await updateDoc(paymentDocRef, { "Payment Status": newStatus });

      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[`${userId}_${guestId}`];
        return updated;
      });

      toast.success("✅ Payment status updated");
    } catch (error) {
      console.error("❌ Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredPayments = payments.filter((p) =>
    `${p.guestName} ${p.guestEmail} ${p.guestPhone} ${p.confirmationId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center py-4">Loading guest payment data...</div>
    );

  return (
    <div className="payment-page-container">
      <style>{`
        .payment-page-container {
          margin-left: 250px;
          margin-top: 60px;
          max-width: calc(100% - 250px);
        }
        .payment-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
        }
        .payment-header {
          padding: 1rem;
        }
        .payment-content {
          padding: 1.5rem;
        }
        .payment-field {
          margin-bottom: 1rem;
        }
        .payment-label {
          font-weight: 500;
          margin-bottom: 0.25rem;
          display: block;
        }
        .save-button {
          background: #038A5E;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 5px;
          cursor: pointer;
        }
        .status-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .proof-image {
          max-width: 200px;
          max-height: 200px;
          margin-right: 10px;
          margin-top: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        .search-input {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .payment-page-container {
            margin-left: 0;
            margin-top: 0;
            max-width: 100%;
            padding: 1rem;
          }
        }
      `}</style>

      <div className="container py-4">
        {/* <h3 className="mb-4">🧾 All Guest Payments</h3> */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Payment Details</h2>
          <Link to="/AllGuestPayments" title="All Guest Payments">
            <i className="bi bi-people-fill fs-2 text-primary"></i>
          </Link>
        </div>

        <input
          type="text"
          placeholder="🔍 Search by name, email, phone or confirmation ID"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPayments.length === 0 ? (
          <p>No matching records found.</p>
        ) : (
          filteredPayments.map((p) => {
            const uniqueKey = `${p.userId}_${p.id}`;
            const currentStatus = p.paymentStatus;
            const changedStatus = statusChanges[uniqueKey] ?? currentStatus;

            return (
              <div key={uniqueKey} className="payment-card card">
                <div className="payment-header card-body">
                  <h5>👤 {p.guestName}</h5>
                  <p>📱 +91-{p.guestPhone}</p>
                  <p>📧 {p.guestEmail}</p>
                  <p>🆔 Confirmation ID: {p.confirmationId}</p>
                  <p>📅 Check-In: {p.checkIn}</p>
                  <p>💰 Total: ₹{p.totalPrice}</p>
                </div>

                <div className="payment-content">
                  <div className="payment-field">
                    <label className="payment-label">Payment Status:</label>
                    <select
                      className="status-select"
                      value={changedStatus}
                      onChange={(e) =>
                        setStatusChanges((prev) => ({
                          ...prev,
                          [uniqueKey]: e.target.value,
                        }))
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {changedStatus !== currentStatus && (
                    <button
                      className="save-button"
                      onClick={() =>
                        handleStatusChange(p.userId, p.id, changedStatus)
                      }
                    >
                      Save Status
                    </button>
                  )}

                  <div className="d-flex flex-wrap mt-3">
                    {p.paymentProofImages?.length > 0 ? (
                      p.paymentProofImages.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={url}
                            alt={`Proof ${i + 1}`}
                            className="proof-image"
                          />
                        </a>
                      ))
                    ) : (
                      <p className="text-muted">No proof images uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
