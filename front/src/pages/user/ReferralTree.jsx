import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import "./ReferralTree.css";

const ReferralTree = () => {
  const [referralTree, setReferralTree] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReferralTree = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/dashboard/referrals");
        console.log(response);
        setReferralTree(response);
      } catch (error) {
        toast.error("Failed to fetch referral tree");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralTree();
  }, []);

  return (
    <div className="referral-tree">
      <h3>Referral Tree</h3>
      {loading ? (
        <p>Loading referral tree...</p>
      ) : referralTree.length === 0 ? (
        <p>No referrals found.</p>
      ) : (
        referralTree.map((levelData, index) => (
          <div key={index} className="mb-4">
            <h4>Level {levelData.level}</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {levelData.referrals.map((referral) => (
                  <tr key={`${levelData.level}-${referral.username}`}>
                    <td>{levelData.level}</td>
                    <td>{referral.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default ReferralTree;
