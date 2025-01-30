import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.get("/events/get");
        setEvents(response);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch events. Please try again.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Manage Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr key={event.id}>
                  <td>{index + 1}</td>
                  <td>{event.first_name}</td>
                  <td>{event.last_name}</td>
                  <td>{event.email}</td>
                  <td>{event.phone}</td>
                  <td>{event.country_of_residence}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageEvents;
