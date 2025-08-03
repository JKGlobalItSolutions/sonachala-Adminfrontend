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












import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'Hotels', user.uid, 'Guest Details'));
      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const paymentList = querySnapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;

            if (data.Status === 'Cancelled' || data['Payment Status'] !== 'Pending') return null;

            const proofImage = data.latestProofUrl ? [data.latestProofUrl] : [];

            return {
              id,
              ...data,
              paymentProofImages: proofImage,
            };
          });

          const filtered = paymentList.filter(Boolean);
          filtered.sort(
            (a, b) => b['Check-In Date']?.toDate() - a['Check-In Date']?.toDate()
          );

          setPayments(filtered);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching payments:', error);
          toast.error('Failed to fetch payment details');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = async (paymentId, newStatus) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('You must be logged in to update payment status');
      return;
    }

    try {
      const paymentDocRef = doc(db, 'Hotels', user.uid, 'Guest Details', paymentId);
      await updateDoc(paymentDocRef, {
        'Payment Status': newStatus,
      });
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !(timestamp instanceof Timestamp)) {
      return 'No Date';
    }
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-');
  };

  const showConfirmationDialog = (paymentId, newStatus) => {
    if (window.confirm(`Are you sure you want to update the payment status to ${newStatus}?`)) {
      handleStatusChange(paymentId, newStatus);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const name = payment['Full Name']?.toLowerCase() || '';
    const phone = payment['Phone Number']?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm.toLowerCase());
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="payment-page-container p-lg-3">
      <style>
        {`
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
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }

          .payment-content {
            padding: 1.5rem;
          }

          .payment-field {
            margin-bottom: 1rem;
          }

          .payment-label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            display: block;
          }

          .payment-value {
            font-size: 1.1rem;
          }

          .save-button {
            background: #038A5E;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }

          .save-button:hover {
            background: #e60000;
          }

          .status-select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
          }

          .proof-image {
            max-width: 200px;
            max-height: 200px;
            margin-right: 10px;
            margin-top: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
          }

          .card-divider {
            border: 0;
            border-top: 1px solid #ccc;
            margin: 0;
          }

          .search-input {
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            width: 100%;
            max-width: 400px;
            margin-bottom: 1rem;
            font-size: 1rem;
          }

          @media (max-width: 768px) {
            .payment-page-container {
              margin-left: 0;
              margin-top: 0;
              max-width: 100%;
              padding: 1rem;
            }

            .payment-card {
              border-radius: 0;
            }
          }
        `}
      </style>

      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">

        <div className="d-flex justify-content-between align-items-center mb-4">
  <h2 className="mb-0">Payment Details</h2>
  <Link to="/AllGuestPayments" title="All Guest Payments">
    <i className="bi bi-people-fill fs-2 text-primary"></i>
  </Link>
</div>
           

            {/* Search bar */}
            <input
              type="text"
              placeholder="🔍 Search by guest name or phone number..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredPayments.length === 0 ? (
              <p>No matching guests found.</p>
            ) : (
              filteredPayments.map((payment) => (
                <div key={payment.id} className="payment-card card">
                  <div className="payment-header card-body">
                    <h3 className="mb-0">Guest Name: {payment['Full Name']}</h3>
                  </div>
                  <hr className="card-divider" />
                  <div className="payment-content">
                    <div className="payment-field">
                      <span className="payment-label">Reservation Date:</span>
                      <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
                    </div>
                    <div className="payment-field">
                      <span className="payment-label">Contact Details:</span>
                      <span className="payment-value">{payment['Phone Number']}</span>
                    </div>
                    <div className="payment-field">
                      <span className="payment-label">Total Price:</span>
                      <span className="payment-value">₹{payment['Total Price']}</span>
                    </div>
                    <div className="payment-field">
                      <span className="payment-label">Payment Method:</span>
                      <span className="payment-value">{payment['Payment Method']}</span>
                    </div>
                    <div className="payment-field">
                      <span className="payment-label">Payment Status:</span>
                      <select
                        className="status-select"
                        value={payment['Payment Status']}
                        onChange={(e) =>
                          showConfirmationDialog(payment.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>

                    <div className="payment-field">
                      <span className="payment-label">Uploaded Proof:</span>
                      {payment.paymentProofImages && payment.paymentProofImages.length > 0 ? (
                        <div className="d-flex flex-wrap">
                          {payment.paymentProofImages.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`Proof ${idx + 1}`}
                              className="proof-image"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">📂 No proof uploaded.</p>
                      )}
                    </div>

                    <button
                      className="save-button mt-3"
                      onClick={() => showConfirmationDialog(payment.id, payment['Payment Status'])}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
