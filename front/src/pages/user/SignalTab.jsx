import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SignalTab = () => {
  const [inviteLink, setInviteLink] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the invite link when the component loads
  useEffect(() => {
    let isMounted = true;
  
    const fetchInviteLink = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated.");
        }
  
        const decoded = jwtDecode(token); // Decode the token to get the user ID
        const userId = decoded.id;
  
        if (!userId) {
          throw new Error("User ID not found in token.");
        }
  
        const response = await apiService.get(`/signals/invite/${userId}`);
        if (isMounted) {
          setInviteLink(response.inviteLink);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching invite link:", error);
          toast.error(error.message || "Failed to fetch invite link.");
        }
      }
    };
  
    fetchInviteLink();
  
    return () => {
      isMounted = false;
    };
  }, []);
  

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id; // Extract userId from the token

      const response = await apiService.post("/signals/add", { userId });
      setInviteLink(response.inviteLink); // Set the generated link
      toast.success("Invite link generated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to generate invite link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signal-tab p-4 text-center">
      <h3>Signals</h3>
      {inviteLink ? (
        <div>
          <p>Click the link below to join the Telegram channel:</p>
          <a href={inviteLink} target="_blank" rel="noopener noreferrer">
            {inviteLink}
          </a>
        </div>
      ) : (
        <div>
          <p>No invite link generated yet.</p>
          <button
            className="btn btn-primary"
            onClick={handleGenerateLink}
            disabled={loading}
          >
            {loading ? "Generating Link..." : "Generate Invite Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SignalTab;
