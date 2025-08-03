import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Filter, ChevronLeft, ChevronRight, Users, Bed, Calendar, Clock } from 'lucide-react';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const RoomStatus = () => {
  const [rooms, setRooms] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState({});

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No user logged in');
        setLoading(false);
        return;
      }

      const roomsSnapshot = await getDocs(collection(db, 'Hotels', user.uid, 'Rooms'));
      const guestsSnapshot = await getDocs(collection(db, 'Hotels', user.uid, 'Guest Details'));

      const roomsData = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        occupiedRooms: 0,
        upcomingRooms: 0,
        availableRooms: 0,
        bookedDates: []
      }));

      const eventsData = {};

      guestsSnapshot.docs.forEach(guestDoc => {
        const guestData = guestDoc.data();
        if (guestData.Rooms && Array.isArray(guestData.Rooms)) {
          guestData.Rooms.forEach(roomData => {
            const room = roomsData.find(r => r.roomType === roomData.roomType);
            if (room) {
              const checkInDate = guestData['Check-In Date'].toDate();
              const checkOutDate = guestData['Check-Out Date'].toDate();
              const roomCount = roomData.roomsCount;

              if (checkInDate <= new Date() && checkOutDate > new Date()) {
                room.occupiedRooms += roomCount;
              } else if (checkInDate > new Date()) {
                room.upcomingRooms += roomCount;
              }

              for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
                const dateString = date.toISOString().split('T')[0];
                if (!eventsData[dateString]) {
                  eventsData[dateString] = [];
                }
                eventsData[dateString].push({
                  roomType: roomData.roomType,
                  count: roomCount
                });
                room.bookedDates.push(new Date(date));
              }
            }
          });
        }
      });

      roomsData.forEach(room => {
        room.availableRooms = room.totalRooms - room.occupiedRooms - room.upcomingRooms;
      });

      setRooms(roomsData);
      setEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room data:', error);
      setLoading(false);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  const getDateStatus = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (events[dateString]) {
      const totalRooms = rooms.reduce((sum, room) => sum + parseInt(room.totalRooms), 0);
      const bookedRooms = events[dateString].reduce((sum, event) => sum + event.count, 0);
      if (bookedRooms >= totalRooms) {
        return 'fully-booked';
      } else {
        return 'partially-booked';
      }
    }
    return '';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="room-status-container p-lg-3">
      <style jsx>{`
        .room-status-container {
          margin-left: 250px;
          margin-top: 60px;
          max-width: calc(100% - 250px);
          padding: 1rem;
        }
        
        .payment-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .payment-header {
          background: #003B94;
          color: white;
          padding: 1rem;
          position: relative;
          margin-bottom: 1rem;
        }
        
        .payment-content {
          padding: 1.5rem;
        }
        
        .filter-container {
          position: relative;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }

        .filter-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #003B94;
          font-weight: bold;
        }

        .filter-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 0.5rem 0;
          min-width: 150px;
          z-index: 1001;
        }

        .filter-option {
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: #333;
        }

        .filter-option:hover {
          background-color: #f5f5f5;
        }

        .calendar-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 350px;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .calendar-title {
          font-size: 1.25rem;
          font-weight: 500;
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .calendar-day:hover {
          background-color: #f0f0f0;
        }

        .calendar-day.selected {
          background-color: #038A5E;
          color: white;
        }

        .calendar-day.today {
          border: 2px solid #038A5E;
        }

        .calendar-day.fully-booked {
          background-color: #f44336;
          color: white;
        }

        .calendar-day.partially-booked {
          background-color: #FFA000;
          color: white;
        }

        .room-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .room-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .room-type {
          color: #666;
          margin-bottom: 1rem;
        }

        .room-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .stat {
          text-align: center;
        }

        .stat-occupied {
          color: #f44336;
        }

        .stat-available {
          color: #4CAF50;
        }

        .stat-upcoming {
          color: #FFA000;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          background: #f0f0f0;
          border-radius: 50%;
          padding: 0.5rem;
        }

        .stat-info h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          color: #666;
          margin: 0;
        }

        .upcoming-events {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .upcoming-events h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .event-list {
          display: grid;
          gap: 1rem;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
          border-radius: 5px;
          background: #f9f9f9;
        }

        .event-icon {
          background: #038A5E;
          color: white;
          border-radius: 50%;
          padding: 0.5rem;
        }

        .event-info h4 {
          margin: 0;
          font-size: 1rem;
        }

        .event-info p {
          margin: 0;
          color: #666;
          font-size: 0.875rem;
        }
        
        @media (max-width: 1024px) {
          .room-status-container {
            margin-left: 0;
            max-width: 100%;
            padding: 60px 1rem 1rem;
          }
          
          .filter-container {
            position: fixed;
            top: 60px;
            right: 1rem;
            z-index: 1000;
            margin-bottom: 0;
          }

          .filter-button {
            background-color: white;
            padding: 0.5rem 1rem;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .filter-dropdown {
            top: calc(100% - 8px);
            right: 0;
            width: auto;
            min-width: 150px;
          }

          .room-status-grid {
            display: flex;
            flex-direction: column;
          }

          .calendar-container {
            margin-left: auto;
            margin-right: auto;
          }
        }
        
        @media (max-width: 768px) {
          .room-status-container {
            padding: 60px 0.5rem 0.5rem;
          }

          .payment-card, .room-card, .calendar-container, .upcoming-events, .stat-card {
            border-radius: 0;
            margin-left: -0.5rem;
            margin-right: -0.5rem;
            width: calc(100% + 1rem);
          }
          
          .payment-content {
            padding: 1rem;
          }

          .quick-stats {
            grid-template-columns: 1fr;
          }

          .calendar-container {
            max-width: 100%;
          }

          .calendar-day {
            font-size: 0.7rem;
          }

          .room-title {
            font-size: 1.25rem;
          }

          .room-type {
            font-size: 0.875rem;
          }

          .stat-info h3 {
            font-size: 1rem;
          }

          .stat-info p {
            font-size: 0.875rem;
          }

          .upcoming-events h3 {
            font-size: 1.25rem;
          }

          .event-info h4 {
            font-size: 0.875rem;
          }

          .event-info p {
            font-size: 0.75rem;
          }
        }

        @media (min-width: 1025px) {
          .room-status-grid {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 1.5rem;
            align-items: start;
          }

          .calendar-container {
            margin-bottom: 0;
            position: sticky;
            top: 80px;
          }

          .room-cards-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
      
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Guests</h3>
                  <p>{rooms.reduce((sum, room) => sum + room.occupiedRooms, 0)}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Bed size={24} />
                </div>
                <div className="stat-info">
                  <h3>Rooms Occupied</h3>
                  <p>{rooms.reduce((sum, room) => sum + room.occupiedRooms, 0)} / {rooms.reduce((sum, room) => sum + parseInt(room.totalRooms), 0)}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Reservations Today</h3>
                  <p>{events[new Date().toISOString().split('T')[0]]?.length || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <h3>Upcoming Bookings</h3>
                  <p>{rooms.reduce((sum, room) => sum + room.upcomingRooms, 0)}</p>
                </div>
              </div>
            </div>

            <div className="room-status-grid">
              <div className="calendar-container">
                <div className="calendar-header">
                  <button onClick={prevMonth} className="btn btn-link text-decoration-none p-0">
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="calendar-title">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
                  <button onClick={nextMonth} className="btn btn-link text-decoration-none p-0">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="calendar-grid">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="calendar-day font-weight-bold">{day}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="calendar-day"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index + 1);
                    return (
                      <div
                        key={index}
                        className={`calendar-day ${isSelected(date) ? 'selected' : ''} ${isToday(date) ? 'today' : ''} ${getDateStatus(date)}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="room-cards-container">
                {rooms.map(room => (
                  <div key={room.id} className="card h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">{room.roomType}</h5>
                      <small className="text-muted">Bed Type: {room.bedType}</small>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Occupied:</span>
                            <span className="badge bg-danger">{room.occupiedRooms}</span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Available:</span>
                            <span className="badge bg-secondary">{room.availableRooms}</span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>Upcoming:</span>
                            <span className="badge bg-dark">{room.upcomingRooms}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Total:</strong>
                        <span>{room.totalRooms}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="upcoming-events">
                  <h3>Upcoming Events</h3>
                  <div className="event-list">
                    {Object.entries(events).slice(0, 3).map(([date, bookings]) => (
                      <div key={date} className="event-item">
                        <div className="event-icon">
                          <Users size={20} />
                        </div>
                        <div className="event-info">
                          <h4>New Guest Check-in</h4>
                          <p>{new Date(date).toLocaleDateString()} - {bookings.map(b => `${b.roomType} (${b.count})`).join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatus;

