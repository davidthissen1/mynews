import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectInterests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const savePreferences = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
        alert("You must be logged in to save preferences.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5501/api/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Use the token here
            },
            body: JSON.stringify({ interests: selectedInterests }),
        });

        if (response.ok) {
            alert("Preferences saved successfully!");
            navigate("/news"); // Redirect to the news feed
        } else {
            const errorData = await response.json();
            console.error("Error:", errorData.error);
            alert("Failed to save preferences. Please try again.");
        }
    } catch (error) {
        console.error("Error saving preferences:", error);
        alert("An error occurred while saving preferences.");
    }
};

  const interests = ["Technology", "Sports", "Health", "Travel", "Business"];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Your Interests</h2>
      <div>
        {interests.map((interest) => (
          <button
            key={interest}
            onClick={() => toggleInterest(interest.toLowerCase())}
            style={{
              margin: "5px",
              padding: "10px",
              border:
                selectedInterests.includes(interest.toLowerCase())
                  ? "2px solid blue"
                  : "1px solid gray",
            }}
          >
            {interest}
          </button>
        ))}
      </div>
      <button onClick={savePreferences} style={{ marginTop: "20px" }}>
        Save Preferences
      </button>
    </div>
  );
};

export default SelectInterests;
