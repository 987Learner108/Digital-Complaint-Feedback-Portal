

import React, { useState } from "react";
import API from "../../services/api";
import "./Feedback.css";

function Feedback() {
  const [formData, setFormData] = useState({
    category: "",
    rating: "",
    comment: "",
    isAnonymous: false, // ✅ Added
  });

  const categories = ["Lab", "Faculty", "Transport", "Hostel", "Food"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, rating, comment } = formData;

    if (!category || !rating || !comment.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/feedback",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Feedback submitted successfully!");
      setFormData({ category: "", rating: "", comment: "", isAnonymous: false });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Try again later.");
    }
  };

  return (
    <div className="feedback-container">
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Rating (1-5):</label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="1"
          max="5"
        />

        <label>Comment:</label>
        <textarea
          name="comment"
          rows="4"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Write your feedback..."
        ></textarea>

        <label>
          <input
            type="checkbox"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
          />
          Submit as Anonymous
        </label>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default Feedback;
