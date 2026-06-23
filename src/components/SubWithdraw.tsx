import { useState } from "react";
import { UserProfile } from "../types";

interface SubWithdrawProps {
  profileData: UserProfile;
  onBack: () => void;
  onSubmit: (method: string, number: string, amount: number) => void;
}

export default function SubWithdraw({ profileData, onBack, onSubmit }: SubWithdrawProps) {
  const [method, setMethod] = useState("bKash");
  const [number, setNumber] = useState("");
  const [amountStr, setAmountStr] = useState("");

  const winning = profileData.winning ?? 0;

  const handleSubmit = () => {
    const amount = parseFloat(amountStr);
    onSubmit(method, number, amount);
  };

  return (
    <div id="withdraw-view" className="app-section active text-black pb-[40px]">
      <div className="back-nav dark-mode" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Withdraw Money
      </div>

      <div className="withdraw-new-container text-black">
        <div className="withdraw-balance-card">
          <div className="wb-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/855/855279.png"
              alt="Coins"
              className="mx-auto"
            />
          </div>
          <div className="wb-label">Available Balance</div>
          <div className="wb-amount">BDT {winning}</div>
        </div>

        <div className="withdraw-section-box">
          <div className="wsb-title">
            <i className="fas fa-wallet"></i> Select Payment Method
          </div>
          <div className="method-grid">
            <div
              className={`method-card ${method === "bKash" ? "active" : ""}`}
              onClick={() => setMethod("bKash")}
            >
              <img src="https://i.ibb.co.com/qF1xD5xj/image-search-1769091253468.png" alt="bKash" />
              <span>bKash</span>
            </div>
            <div
              className={`method-card ${method === "Nagad" ? "active" : ""}`}
              onClick={() => setMethod("Nagad")}
            >
              <img src="https://i.ibb.co.com/4gmdTj1f/image-search-1769091285966.png" alt="Nagad" />
              <span>Nagad</span>
            </div>
            <div
              className={`method-card ${method === "Rocket" ? "active" : ""}`}
              onClick={() => setMethod("Rocket")}
            >
              <img src="https://i.ibb.co.com/MDt4TzDf/image-search-1769091463880.png" alt="Rocket" />
              <span>Rocket</span>
            </div>
          </div>
        </div>

        <div className="withdraw-section-box">
          <div className="wsb-title">
            <i className="fas fa-file-invoice"></i> Withdrawal Details
          </div>
          <div className="wd-input-group">
            <i className="fas fa-phone-alt wd-icon"></i>
            <input
              type="number"
              className="wd-input text-gray-800 font-sans"
              placeholder="Mobile Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="wd-input-group">
            <i className="fas fa-coins wd-icon"></i>
            <input
              type="number"
              className="wd-input text-gray-800 font-sans"
              placeholder="Amount to Withdraw"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
            />
          </div>
          <div className="min-notice">
            <i className="fas fa-info-circle"></i> MINIMUM WITHDRAW 100 TK
          </div>
          <button className="wd-submit-btn" onClick={handleSubmit}>
            Withdraw Money
          </button>
        </div>
      </div>
    </div>
  );
}
