import { useState, useEffect } from "react";
import { UserProfile } from "../types";

interface SubEditProfileProps {
  user: any;
  profileData: UserProfile;
  onBack: () => void;
  onSave: (username: string | null, curPass: string | null, newPass: string | null, phone: string | null) => void;
}

export default function SubEditProfile({ user, profileData, onBack, onSave }: SubEditProfileProps) {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [conPass, setConPass] = useState("");

  useEffect(() => {
    if (user?.displayName) setUsername(user.displayName);
    if (profileData?.phone) setPhone(profileData.phone);
  }, [user, profileData]);

  const handleSave = () => {
    onSave(username, curPass, newPass, phone);
  };

  return (
    <div id="edit-profile-view" className="app-section active text-black pb-[40px]">
      <div className="back-nav dark-mode" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> My Profile
      </div>

      <div className="ep-container">
        <div className="ep-avatar-section">
          <div className="ep-avatar-ring">
            <i className="fas fa-user ep-avatar-icon"></i>
          </div>
          <div className="ep-username" id="ep-name-display">
            {user?.displayName || "User"}
          </div>
          <div className="ep-email" id="ep-email-display">
            {user?.email || "user@mail.com"}
          </div>
        </div>

        <div className="ep-card text-left">
          <div className="ep-card-title text-black">
            <i className="fas fa-user"></i> Basic Details
          </div>
          <div className="ep-input-group">
            <i className="fas fa-user-circle ep-input-icon"></i>
            <input
              type="text"
              className="ep-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="ep-input-group">
            <i className="fas fa-envelope ep-input-icon"></i>
            <input
              type="email"
              className="ep-input bg-gray-100 cursor-not-allowed"
              placeholder="Email"
              disabled
              value={user?.email || ""}
            />
          </div>
          <div className="ep-input-group">
            <i className="fas fa-phone ep-input-icon"></i>
            <input
              type="number"
              className="ep-input"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="ep-card text-left">
          <div className="ep-card-title text-black">
            <i className="fas fa-lock"></i> Password Change
          </div>
          <div className="ep-input-group">
            <i className="fas fa-lock ep-input-icon"></i>
            <input
              type="password"
              className="ep-input"
              placeholder="Current Password"
              value={curPass}
              onChange={(e) => setCurPass(e.target.value)}
            />
          </div>
          <div className="ep-input-group">
            <i className="fas fa-lock ep-input-icon"></i>
            <input
              type="password"
              className="ep-input"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>
          <div className="ep-input-group">
            <i className="fas fa-lock ep-input-icon"></i>
            <input
              type="password"
              className="ep-input"
              placeholder="Confirm Password"
              value={conPass}
              onChange={(e) => setConPass(e.target.value)}
            />
          </div>
        </div>

        <button className="ep-btn" onClick={handleSave}>
          Change Password
        </button>
      </div>
    </div>
  );
}
