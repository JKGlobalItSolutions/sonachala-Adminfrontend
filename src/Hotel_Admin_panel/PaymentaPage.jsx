import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusChanges, setStatusChanges] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filteredPayments = payments
    .filter((p) =>
      `${p.guestName} ${p.guestEmail} ${p.guestPhone} ${p.confirmationId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      statusFilter === "All" ? true : p.paymentStatus === statusFilter
    );

  if (loading)
    return <div className="text-center py-4">Loading guest payment data...</div>;

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
        .filter-section {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 1rem;
        }
        .filter-select {
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #ccc;
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Payment Details</h2>
          <Link to="/AllGuestPayments" title="All Guest Payments">
            <i className="bi bi-people-fill fs-2 text-primary"></i>
          </Link>
        </div>

        <div className="filter-section">
          <input
            type="text"
            placeholder="🔍 Search by name, email, phone or confirmation ID"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

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
