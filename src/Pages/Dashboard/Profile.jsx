import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import "./DashboardStyles/Profile.css";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  console.log("api response", userData);
  const token = localStorage.getItem("Token");
  const baseURL = import.meta.env.VITE_BASE_URL;

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data.data || response.data;

      setUserData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
      console.log("api response ooo", response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="profile_page">
          <div className="loading_container">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile_page">
        <div className="page_header">
          <h1>Profile</h1>
          <p>View your account information</p>
        </div>

        <div className="profile_container">
          <div className="profile_avatar_section">
            <div className="profile_avatar_large">
              {getInitials(userData.fullName)}
            </div>
            <h2>{capitalizeWords(userData.fullName) || "User Name"}</h2>
            <p>{userData.email || "user@email.com"}</p>
          </div>

          <div className="profile_form">
            <div className="form_section">
              <h3>Personal Information</h3>
              <div className="profile_info">
                <div className="info_row">
                  <div className="info_label">Full Name</div>
                  <div className="info_value">
                    {capitalizeWords(userData.fullName) || "—"}
                  </div>
                </div>
                <div className="info_row">
                  <div className="info_label">Email Address</div>
                  <div className="info_value">{userData.email || "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
