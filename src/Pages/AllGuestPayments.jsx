// import React, { useEffect, useState } from "react";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from "../firebase/config";

// const AllGuestPayments = () => {
//   const [uploads, setUploads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIds, setSelectedIds] = useState([]);

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
//             allProofs.push({
//               id: docSnap.id,
//               userId,
//               guestName: data["Full Name"] || "Guest",
//               guestEmail: data["Email Address"] || "N/A",
//               guestPhone: data["Phone Number"] || "N/A",
//               propertyName: data["Property Name"] || "Hotel",
//               propertyAddress: data["Property Address"] || "N/A",
//               checkIn: data["Check-In Date"]
//                 ? new Date(data["Check-In Date"].seconds * 1000).toLocaleDateString("en-IN")
//                 : "N/A",
//               checkOut: data["Check-Out Date"]
//                 ? new Date(data["Check-Out Date"].seconds * 1000).toLocaleDateString("en-IN")
//                 : "N/A",
//               totalPrice: data["Total Price"] || 0,
//               latestProofUrl: data.latestProofUrl || null,
//               paymentStatus: data["Payment Status"] || "Pending",
//               confirmationId: data["confirmationId"] || "N/A",
//               timestamp: data.createdAt?.seconds
//                 ? new Date(data.createdAt.seconds * 1000)
//                 : null,
//               bookingId: data.id || docSnap.id,
//             });
//           });
//         }

//         const sorted = allProofs.sort(
//           (a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
//         );

//         setUploads(sorted);
//       } catch (err) {
//         console.error("❌ Error fetching guest details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllGuestProofs();
//   }, []);

//   const handleDelete = async (userId, guestId) => {
//     const confirm = window.confirm("Are you sure you want to delete this guest?");
//     if (!confirm) return;

//     try {
//       await deleteDoc(doc(db, "Hotels", userId, "Guest Details", guestId));
//       setUploads((prev) => prev.filter((item) => !(item.userId === userId && item.id === guestId)));
//       setSelectedIds((prev) => prev.filter((sid) => sid !== `${userId}_${guestId}`));
//       alert("✅ Guest deleted successfully.");
//     } catch (err) {
//       console.error("❌ Error deleting guest:", err);
//       alert("❌ Failed to delete guest.");
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIds.length === 0) return alert("⚠️ No guests selected.");

//     const confirm = window.confirm(`Delete ${selectedIds.length} selected guests?`);
//     if (!confirm) return;

//     try {
//       for (const combinedId of selectedIds) {
//         const [userId, guestId] = combinedId.split("_");
//         await deleteDoc(doc(db, "Hotels", userId, "Guest Details", guestId));
//       }
//       setUploads((prev) =>
//         prev.filter((item) => !selectedIds.includes(`${item.userId}_${item.id}`))
//       );
//       setSelectedIds([]);
//       alert("✅ Selected guests deleted successfully.");
//     } catch (err) {
//       console.error("❌ Error deleting selected guests:", err);
//       alert("❌ Failed to delete selected guests.");
//     }
//   };

//   const toggleCheckbox = (userId, guestId) => {
//     const key = `${userId}_${guestId}`;
//     setSelectedIds((prev) =>
//       prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
//     );
//   };

//   const toggleSelectAll = () => {
//     const visibleIds = filteredUploads.map((upload) => `${upload.userId}_${upload.id}`);
//     const allSelected = visibleIds.every((id) => selectedIds.includes(id));
//     setSelectedIds(allSelected ? [] : visibleIds);
//   };

//   const filteredUploads = uploads.filter((upload) =>
//     `${upload.guestName} ${upload.guestEmail} ${upload.guestPhone} ${upload.confirmationId}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="text-center py-4">Loading guest payment data...</div>;

//   return (
//     <div className="container my-4 mt-lg-5 ms-mt-5 payment-page-container p-lg-3">
//       <style>{`

// .delete-btn {
//   background-color: #dc3545;
//   color: white;
//   border: none;
//   padding: 8px 16px;
//   border-radius: 5px;
//   cursor: pointer;
//   white-space: nowrap;
// }




//         .payment-page-container {
//           margin-left: 250px;
//           margin-top: 70px;
//           max-width: calc(100% - 250px);
//         }
//         .card {
//           background: white;
//           border-radius: 10px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           margin-bottom: 1rem;
//         }
//         .card-body {
//           padding: 1.5rem;
//         }
//         .proof-image {
//           max-width: 200px;
//           max-height: 200px;
//           margin-top: 10px;
//           border-radius: 8px;
//           border: 1px solid #ccc;
//           cursor: zoom-in;
//         }
//         .search-input {
//           padding: 0.75rem;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           width: 100%;
//           max-width: 400px;
//           margin-bottom: 1.5rem;
//           font-size: 1rem;
//         }
//         .delete-btn, .delete-selected-btn {
//           background-color: #dc3545;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 5px;
//           cursor: pointer;
//           margin-top: 10px;
//         }
//         .form-check {
//           margin-bottom: 10px;
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

//       <h3 className="mb-3">📄 Guest Payment Proofs </h3>

//       <input
//         type="text"
//         placeholder="🔍 Search by name, email, phone or confirmation ID"
//         className="search-input"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="form-check">
//           <input
//             type="checkbox"
//             id="selectAll"
//             className="form-check-input"
//             checked={
//               filteredUploads.length > 0 &&
//               filteredUploads.every((upload) =>
//                 selectedIds.includes(`${upload.userId}_${upload.id}`)
//               )
//             }
//             onChange={toggleSelectAll}
//           />
//           <label className="form-check-label" htmlFor="selectAll">
//             Select All
//           </label>
//         </div>

//         {selectedIds.length > 0 && (
//           <button className="delete-selected-btn" onClick={handleDeleteSelected}>
//             🗑 Delete Selected ({selectedIds.length})
//           </button>
//         )}
//       </div>

//       {filteredUploads.length === 0 ? (
//         <div className="text-center text-muted">No matching guests found.</div>
//       ) : (
//         <div className="row g-4">
//           {filteredUploads.map((upload) => {
//             const uniqueKey = `${upload.userId}_${upload.id}`;
//             return (
//               <div className="col-md-6" key={uniqueKey}>
//                 <div className="card">
//                   <div className="card-body">
//                     <div className="form-check mb-2">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         checked={selectedIds.includes(uniqueKey)}
//                         onChange={() => toggleCheckbox(upload.userId, upload.id)}
//                       />
//                     </div>

//                     <p><strong>Guest Name:</strong> {upload.guestName}</p>
//                     <p><strong>Email:</strong> {upload.guestEmail}</p>
//                     <p><strong>Phone:</strong> +91-{upload.guestPhone}</p>
//                     <p><strong>Hotel:</strong> {upload.propertyName}</p>
//                     <p><strong>Address:</strong> {upload.propertyAddress}</p>
//                     <p><strong>Stay:</strong> 📅 {upload.checkIn} → {upload.checkOut}</p>
//                     <p><strong>Total Price:</strong> ₹{upload.totalPrice.toLocaleString("en-IN")}</p>
//                     <p><strong>Booking ID:</strong> {upload.bookingId}</p>
//                     <p><strong>Confirmation ID:</strong> {upload.confirmationId}</p>
//                     <p><strong>Payment Status:</strong> {upload.paymentStatus}</p>
//                     <p><strong>Uploaded:</strong> {upload.timestamp ? upload.timestamp.toLocaleString() : "N/A"}</p>




// <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mt-3">

    
//   {upload.latestProofUrl ? (
//     <div>
//       <p className="mb-1"><strong>Proof Image:</strong></p>
//       <a href={upload.latestProofUrl} target="_blank" rel="noopener noreferrer">
//         <img
//           src={upload.latestProofUrl}
//           alt="Payment Proof"
//           className="proof-image"
//         />
//       </a>
//     </div>
//   ) : (
//     <p className="text-muted">No image uploaded.</p>
//   )}

//   <div>
//     <button
//       className="delete-btn"
//       onClick={() => handleDelete(upload.userId, upload.id)}
//     >
//       🗑 Delete
//     </button>
//   </div>
// </div>





//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllGuestPayments;













// ... existing imports





import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const AllGuestPayments = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchAllGuestProofs = async () => {
      try {
        const hotelsSnapshot = await getDocs(collection(db, "Hotels"));
        const allProofs = [];

        for (const hotelDoc of hotelsSnapshot.docs) {
          const userId = hotelDoc.id;
          const guestDetailsRef = collection(db, "Hotels", userId, "Guest Details");
          const guestDetailsSnapshot = await getDocs(guestDetailsRef);

          guestDetailsSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            allProofs.push({
              id: docSnap.id,
              userId,
              guestName: data["Full Name"] || "Guest",
              guestEmail: data["Email Address"] || "N/A",
              guestPhone: data["Phone Number"] || "N/A",
              propertyName: data["Property Name"] || "Hotel",
              propertyAddress: data["Property Address"] || "N/A",
              checkIn: data["Check-In Date"]
                ? new Date(data["Check-In Date"].seconds * 1000).toLocaleDateString("en-IN")
                : "N/A",
              checkOut: data["Check-Out Date"]
                ? new Date(data["Check-Out Date"].seconds * 1000).toLocaleDateString("en-IN")
                : "N/A",
              totalPrice: data["Total Price"] || 0,
              latestProofUrl: data.latestProofUrl || null,
              allProofs: data["Payment Proof"] || [], // ⬅️ multiple image array
              paymentStatus: data["Payment Status"] || "Pending",
              confirmationId: data["confirmationId"] || "N/A",
              timestamp: data.createdAt?.seconds
                ? new Date(data.createdAt.seconds * 1000)
                : new Date(0), // fallback if missing
              bookingId: data.id || docSnap.id,
            });
          });
        }

        const sorted = allProofs.sort(
          (a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
        );

        setUploads(sorted);
      } catch (err) {
        console.error("❌ Error fetching guest details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGuestProofs();
  }, []);

  const handleDelete = async (userId, guestId) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;
    try {
      await deleteDoc(doc(db, "Hotels", userId, "Guest Details", guestId));
      setUploads((prev) => prev.filter((item) => !(item.userId === userId && item.id === guestId)));
      setSelectedIds((prev) => prev.filter((sid) => sid !== `${userId}_${guestId}`));
      alert("✅ Guest deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting guest:", err);
      alert("❌ Failed to delete guest.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return alert("⚠️ No guests selected.");
    if (!window.confirm(`Delete ${selectedIds.length} selected guests?`)) return;
    try {
      for (const combinedId of selectedIds) {
        const [userId, guestId] = combinedId.split("_");
        await deleteDoc(doc(db, "Hotels", userId, "Guest Details", guestId));
      }
      setUploads((prev) => prev.filter((item) => !selectedIds.includes(`${item.userId}_${item.id}`)));
      setSelectedIds([]);
      alert("✅ Selected guests deleted successfully.");
    } catch (err) {
      console.error("❌ Error deleting selected guests:", err);
      alert("❌ Failed to delete selected guests.");
    }
  };

  const toggleCheckbox = (userId, guestId) => {
    const key = `${userId}_${guestId}`;
    setSelectedIds((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredUploads.map((upload) => `${upload.userId}_${upload.id}`);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : visibleIds);
  };

  const filteredUploads = uploads.filter((upload) =>
    `${upload.guestName} ${upload.guestEmail} ${upload.guestPhone} ${upload.confirmationId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-4">Loading guest payment data...</div>;

  return (
    <div className="container my-4 mt-lg-5 payment-page-container p-lg-3">
      <style>{`
  .payment-page-container {
    margin-left: 250px;
    margin-top: 60px;
    max-width: calc(100% - 250px);
    padding: 1rem;
  }

  @media (max-width: 768px) {
    .payment-page-container {
      margin-left: 0;
      max-width: 100%;
    }
  }

  .proof-image {
    max-width: 140px;
    max-height: 140px;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin: 5px;
    transition: transform 0.2s ease;
  }

  .proof-image:hover {
    transform: scale(1.05);
  }

  .delete-btn, .delete-selected-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    font-weight: 500;
    transition: background 0.2s ease;
  }

  .delete-btn:hover, .delete-selected-btn:hover {
    background-color: #c82333;
  }

  .form-check-label {
    font-weight: 500;
  }

  .card {
    border: 1px solid #e3e3e3;
    border-radius: 12px;
    transition: box-shadow 0.2s ease;
  }

  .card:hover {
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }

  .card-body p {
    margin-bottom: 6px;
    font-size: 0.95rem;
  }

  .card-body strong {
    font-weight: 600;
  }

  .form-control {
    border-radius: 10px;
  }

  .form-check-input {
    cursor: pointer;
  }

  .delete-selected-btn {
    font-size: 0.95rem;
    padding: 6px 12px;
  }
`}</style>


      <h3 className="mb-3">📄 Guest Payment Proofs</h3>

      <input
        type="text"
        placeholder="🔍 Search by name, email, phone or confirmation ID"
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            id="selectAll"
            className="form-check-input"
            checked={filteredUploads.every((upload) => selectedIds.includes(`${upload.userId}_${upload.id}`))}
            onChange={toggleSelectAll}
          />
          <label className="form-check-label" htmlFor="selectAll">Select All</label>
        </div>
        {selectedIds.length > 0 && (
          <button className="delete-selected-btn" onClick={handleDeleteSelected}>
            🗑 Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="row g-4">
        {filteredUploads.map((upload) => {
          const uniqueKey = `${upload.userId}_${upload.id}`;
          return (
            <div className="col-md-6" key={uniqueKey}>
              <div className="card">
                <div className="card-body">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.includes(uniqueKey)}
                      onChange={() => toggleCheckbox(upload.userId, upload.id)}
                    />
                  </div>

                  <p><strong>Guest Name:</strong> {upload.guestName}</p>
                  <p><strong>Email:</strong> {upload.guestEmail}</p>
                  <p><strong>Phone:</strong> +91-{upload.guestPhone}</p>
                  <p><strong>Hotel:</strong> {upload.propertyName}</p>
                  <p><strong>Address:</strong> {upload.propertyAddress}</p>
                  <p><strong>Stay:</strong> 📅 {upload.checkIn} → {upload.checkOut}</p>
                  <p><strong>Total Price:</strong> ₹{upload.totalPrice.toLocaleString("en-IN")}</p>
                  <p><strong>Booking ID:</strong> {upload.bookingId}</p>
                  <p><strong>Confirmation ID:</strong> {upload.confirmationId}</p>
                  <p><strong>Payment Status:</strong> {upload.paymentStatus}</p>
                  <p><strong>Uploaded:</strong> {upload.timestamp ? upload.timestamp.toLocaleString() : "N/A"}</p>

                  <div className="d-flex flex-wrap mt-3">
                    {upload.allProofs?.length > 0 ? (
                      upload.allProofs
                        .slice()
                        .reverse()
                        .map((proof, index) => (
                          <a
                            key={index}
                            href={proof.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Uploaded: ${new Date(proof.uploadedAt).toLocaleString()}`}
                          >
                            <img
                              src={proof.url}
                              alt={`Proof ${index + 1}`}
                              className="proof-image"
                            />
                          </a>
                        ))
                    ) : (
                      <p className="text-muted">No proof images uploaded.</p>
                    )}
                  </div>

                  <button
                    className="delete-btn mt-2"
                    onClick={() => handleDelete(upload.userId, upload.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllGuestPayments;










// import React, { useEffect, useState } from "react";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from "../firebase/config";
// import jsPDF from "jspdf";
// import "jspdf-autotable";


// const AllGuestPayments = () => {
//   const [uploads, setUploads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIds, setSelectedIds] = useState([]);

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
//             allProofs.push({
//               id: docSnap.id,
//               userId,
//               guestName: data["Full Name"] || "Guest",
//               guestEmail: data["Email Address"] || "N/A",
//               guestPhone: data["Phone Number"] || "N/A",
//               propertyName: data["Property Name"] || "Hotel",
//               propertyAddress: data["Property Address"] || "N/A",
//               checkIn: data["Check-In Date"]
//                 ? new Date(data["Check-In Date"].seconds * 1000).toLocaleDateString("en-IN")
//                 : "N/A",
//               checkOut: data["Check-Out Date"]
//                 ? new Date(data["Check-Out Date"].seconds * 1000).toLocaleDateString("en-IN")
//                 : "N/A",
//               totalPrice: data["Total Price"] || 0,
//               latestProofUrl: data.latestProofUrl || null,
//               allProofs: data["Payment Proof"] || [],
//               paymentStatus: data["Payment Status"] || "Pending",
//               confirmationId: data["confirmationId"] || "N/A",
//               timestamp: data.createdAt?.seconds
//                 ? new Date(data.createdAt.seconds * 1000)
//                 : new Date(0),
//               bookingId: data.id || docSnap.id,
//             });
//           });
//         }

//         const sorted = allProofs.sort(
//           (a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
//         );

//         setUploads(sorted);
//       } catch (err) {
//         console.error("❌ Error fetching guest details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllGuestProofs();
//   }, []);

//   const handleDelete = async (userId, guestId) => {
//     if (!window.confirm("Are you sure you want to delete this guest?")) return;
//     try {
//       await deleteDoc(doc(db, "Hotels", userId, "Guest Details", guestId));
//       setUploads((prev) => prev.filter((item) => !(item.userId === userId && item.id === guestId)));
//       setSelectedIds((prev) => prev.filter((sid) => sid !== `${userId}_${guestId}`));
//       alert("✅ Guest deleted successfully.");
//     } catch (err) {
//       console.error("❌ Error deleting guest:", err);
//       alert("❌ Failed to delete guest.");
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIds.length === 0) return alert("⚠️ No guests selected.");
//     if (!window.confirm(`Delete ${selectedIds.length} selected guests?`)) return;
//     try {
//       for (const combinedId of selectedIds) {
//         const [userId, guestId] = combinedId.split("_");
//         await deleteDoc(doc(db, "Hotels", userId, "Guest Details", guestId));
//       }
//       setUploads((prev) => prev.filter((item) => !selectedIds.includes(`${item.userId}_${item.id}`)));
//       setSelectedIds([]);
//       alert("✅ Selected guests deleted successfully.");
//     } catch (err) {
//       console.error("❌ Error deleting selected guests:", err);
//       alert("❌ Failed to delete selected guests.");
//     }
//   };

//   const toggleCheckbox = (userId, guestId) => {
//     const key = `${userId}_${guestId}`;
//     setSelectedIds((prev) =>
//       prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
//     );
//   };

//   const toggleSelectAll = () => {
//     const visibleIds = filteredUploads.map((upload) => `${upload.userId}_${upload.id}`);
//     const allSelected = visibleIds.every((id) => selectedIds.includes(id));
//     setSelectedIds(allSelected ? [] : visibleIds);
//   };

//   const generatePDF = (guestList, fileName = "GuestDetails.pdf") => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Guest Payment Details", 14, 20);

//     const tableData = guestList.map((guest, index) => [
//       index + 1,
//       guest.guestName,
//       guest.guestEmail,
//       guest.guestPhone,
//       guest.propertyName,
//       guest.propertyAddress,
//       `${guest.checkIn} → ${guest.checkOut}`,
//       `₹${guest.totalPrice}`,
//       guest.bookingId,
//       guest.confirmationId,
//       guest.paymentStatus,
//       guest.timestamp?.toLocaleString() || "N/A",
//     ]);

//     doc.autoTable({
//       startY: 30,
//       head: [[
//         "#",
//         "Name",
//         "Email",
//         "Phone",
//         "Hotel",
//         "Address",
//         "Stay",
//         "Price",
//         "Booking ID",
//         "Confirmation ID",
//         "Payment",
//         "Uploaded",
//       ]],
//       body: tableData,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [52, 152, 219] },
//     });

//     doc.save(fileName);
//   };

//   const filteredUploads = uploads.filter((upload) =>
//     `${upload.guestName} ${upload.guestEmail} ${upload.guestPhone} ${upload.confirmationId}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="text-center py-4">Loading guest payment data...</div>;

//   return (
//     <div className="container my-4 mt-lg-5 payment-page-container p-lg-3">

// <style>{`
//   .payment-page-container {
//     margin-left: 250px;
//     margin-top: 60px;
//     max-width: calc(100% - 250px);
//     padding: 1rem;
//   }

//   @media (max-width: 768px) {
//     .payment-page-container {
//       margin-left: 0;
//       max-width: 100%;
//     }
//   }

//   .proof-image {
//     max-width: 140px;
//     max-height: 140px;
//     border-radius: 8px;
//     border: 1px solid #ccc;
//     margin: 5px;
//     transition: transform 0.2s ease;
//   }

//   .proof-image:hover {
//     transform: scale(1.05);
//   }

//   .delete-btn, .delete-selected-btn {
//     background-color: #dc3545;
//     color: white;
//     border: none;
//     padding: 8px 16px;
//     border-radius: 5px;
//     font-weight: 500;
//     transition: background 0.2s ease;
//   }

//   .delete-btn:hover, .delete-selected-btn:hover {
//     background-color: #c82333;
//   }

//   .form-check-label {
//     font-weight: 500;
//   }

//   .card {
//     border: 1px solid #e3e3e3;
//     border-radius: 12px;
//     transition: box-shadow 0.2s ease;
//   }

//   .card:hover {
//     box-shadow: 0 2px 12px rgba(0,0,0,0.05);
//   }

//   .card-body p {
//     margin-bottom: 6px;
//     font-size: 0.95rem;
//   }

//   .card-body strong {
//     font-weight: 600;
//   }

//   .form-control {
//     border-radius: 10px;
//   }

//   .form-check-input {
//     cursor: pointer;
//   }

//   .delete-selected-btn {
//     font-size: 0.95rem;
//     padding: 6px 12px;
//   }
// `}</style>









//       <h3 className="mb-3">📄 Guest Payment Proofs</h3>

//       <input
//         type="text"
//         placeholder="🔍 Search by name, email, phone or confirmation ID"
//         className="form-control mb-3"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div className="d-flex gap-2 mb-3">
//         <button
//           className="btn btn-primary"
//           onClick={() => generatePDF(filteredUploads, "AllGuestDetails.pdf")}
//         >
//           📥 Download All as PDF
//         </button>

//         {selectedIds.length > 0 && (
//           <button
//             className="btn btn-success"
//             onClick={() =>
//               generatePDF(
//                 uploads.filter((item) =>
//                   selectedIds.includes(`${item.userId}_${item.id}`)
//                 ),
//                 "SelectedGuests.pdf"
//               )
//             }
//           >
//             📄 Download Selected ({selectedIds.length})
//           </button>
//         )}

//         {selectedIds.length > 0 && (
//           <button className="btn btn-danger" onClick={handleDeleteSelected}>
//             🗑 Delete Selected ({selectedIds.length})
//           </button>
//         )}

//         <div className="form-check ms-auto">
//           <input
//             type="checkbox"
//             id="selectAll"
//             className="form-check-input"
//             checked={filteredUploads.every((upload) =>
//               selectedIds.includes(`${upload.userId}_${upload.id}`)
//             )}
//             onChange={toggleSelectAll}
//           />
//           <label className="form-check-label" htmlFor="selectAll">
//             Select All
//           </label>
//         </div>
//       </div>

//       <div className="row g-4">
//         {filteredUploads.map((upload) => {
//           const uniqueKey = `${upload.userId}_${upload.id}`;
//           return (
//             <div className="col-md-6" key={uniqueKey}>
//               <div className="card">
//                 <div className="card-body">
//                   <div className="form-check mb-2">
//                     <input
//                       type="checkbox"
//                       className="form-check-input"
//                       checked={selectedIds.includes(uniqueKey)}
//                       onChange={() => toggleCheckbox(upload.userId, upload.id)}
//                     />
//                   </div>

//                   <p><strong>Guest Name:</strong> {upload.guestName}</p>
//                   <p><strong>Email:</strong> {upload.guestEmail}</p>
//                   <p><strong>Phone:</strong> +91-{upload.guestPhone}</p>
//                   <p><strong>Hotel:</strong> {upload.propertyName}</p>
//                   <p><strong>Address:</strong> {upload.propertyAddress}</p>
//                   <p><strong>Stay:</strong> 📅 {upload.checkIn} → {upload.checkOut}</p>
//                   <p><strong>Total Price:</strong> ₹{upload.totalPrice.toLocaleString("en-IN")}</p>
//                   <p><strong>Booking ID:</strong> {upload.bookingId}</p>
//                   <p><strong>Confirmation ID:</strong> {upload.confirmationId}</p>
//                   <p><strong>Payment Status:</strong> {upload.paymentStatus}</p>
//                   <p><strong>Uploaded:</strong> {upload.timestamp ? upload.timestamp.toLocaleString() : "N/A"}</p>

//                   <div className="d-flex flex-wrap mt-3">
//                     {upload.allProofs?.length > 0 ? (
//                       upload.allProofs.slice().reverse().map((proof, index) => (
//                         <a
//                           key={index}
//                           href={proof.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           title={`Uploaded: ${new Date(proof.uploadedAt).toLocaleString()}`}
//                         >
//                           <img
//                             src={proof.url}
//                             alt={`Proof ${index + 1}`}
//                             className="proof-image"
//                             style={{
//                               maxWidth: "150px",
//                               maxHeight: "150px",
//                               borderRadius: "6px",
//                               border: "1px solid #ccc",
//                               marginRight: "10px",
//                               marginBottom: "10px",
//                             }}
//                           />
//                         </a>
//                       ))
//                     ) : (
//                       <p className="text-muted">No proof images uploaded.</p>
//                     )}
//                   </div>

//                   <button
//                     className="btn btn-danger mt-2"
//                     onClick={() => handleDelete(upload.userId, upload.id)}
//                   >
//                     🗑 Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default AllGuestPayments;
