

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const GuestDetails = () => {
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

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
      const checkoutDate = guest["Check-Out Date"]?.toDate?.();
      const status = guest["Status"];

      if (status === "Cancelled") cancelled.push(guest);
      else if (checkoutDate > now) active.push(guest);
      else previous.push(guest);
    });

    return { active, previous, cancelled };
  };

  const sortedGuests = (guests) =>
    guests.sort((a, b) =>
      b["Check-In Date"]?.toDate?.() - a["Check-In Date"]?.toDate?.()
    );

  const { active, previous, cancelled } = categorizeGuests(guests);
  const filteredActive = filterGuests(sortedGuests(active));
  const filteredPrevious = filterGuests(sortedGuests(previous));
  const filteredCancelled = filterGuests(sortedGuests(cancelled));

  const renderBookingCard = (title, guest) => {
    const checkInDate = guest["Check-In Date"]?.toDate?.();
    const checkOutDate = guest["Check-Out Date"]?.toDate?.();

    const proofImages = guest.allProofUrls?.length
      ? guest.allProofUrls
      : [];

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
                <div>{checkInDate?.toLocaleDateString() || "N/A"}</div>
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
                <div>{checkOutDate?.toLocaleDateString() || "N/A"}</div>
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

          {proofImages.length > 0 && (
            <div className="mt-4">
              <p className="mb-1 fw-bold text-muted">Payment Proof Screenshots</p>
              <div className="d-flex flex-wrap gap-3">
                {proofImages.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={url}
                      alt={`Proof ${idx + 1}`}
                      className="img-fluid border rounded"
                      style={{ maxWidth: "200px" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGuestList = () => {
    let guestList = [];

    if (selectedFilter === "All" || selectedFilter === "Active") {
      guestList = guestList.concat(
        filteredActive.map((guest) =>
          renderBookingCard("Active Booking", guest)
        )
      );
    }

    if (selectedFilter === "All" || selectedFilter === "Previous") {
      guestList = guestList.concat(
        filteredPrevious.map((guest) =>
          renderBookingCard("Previous Booking", guest)
        )
      );
    }

    if (selectedFilter === "All" || selectedFilter === "Cancelled") {
      guestList = guestList.concat(
        filteredCancelled.map((guest) =>
          renderBookingCard("Cancelled Booking", guest)
        )
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