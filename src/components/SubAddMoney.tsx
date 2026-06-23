import { useState } from "react";
import { AppSettings } from "../types";

interface SubAddMoneyProps {
  appSettings: AppSettings;
  onBack: () => void;
  onVerify: (method: string, trxId: string) => void;
  onCopyToClipboard: (text: string) => void;
}

type MethodType = "bkash" | "rocket" | "nagad";

export default function SubAddMoney({
  appSettings,
  onBack,
  onVerify,
  onCopyToClipboard,
}: SubAddMoneyProps) {
  const [method, setMethod] = useState<MethodType>("bkash");
  const [trxId, setTrxId] = useState("");

  const bkashNum = appSettings?.bkash_number || "Loading...";
  const nagadNum = appSettings?.nagad_number || "Loading...";
  const rocketNum = appSettings?.rocket_number || "Loading...";

  return (
    <div id="add-money-view" className="app-section active pb-[40px] text-black">
      <div className="back-nav" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Add Money
      </div>

      <div className="am-method-grid">
        <div
          className={`am-card ${method === "bkash" ? "active" : ""}`}
          onClick={() => {
            setMethod("bkash");
            setTrxId("");
          }}
        >
          <i className="fas fa-check-circle am-check"></i>
          <img
            src="https://i.ibb.co.com/qF1xD5xj/image-search-1769091253468.png"
            alt="bKash"
          />
          <span>bKash</span>
        </div>
        <div
          className={`am-card ${method === "rocket" ? "active" : ""}`}
          onClick={() => {
            setMethod("rocket");
            setTrxId("");
          }}
        >
          <i className="fas fa-check-circle am-check"></i>
          <img
            src="https://i.ibb.co.com/MDt4TzDf/image-search-1769091463880.png"
            alt="Rocket"
          />
          <span>Rocket</span>
        </div>
        <div
          className={`am-card ${method === "nagad" ? "active" : ""}`}
          onClick={() => {
            setMethod("nagad");
            setTrxId("");
          }}
        >
          <i className="fas fa-check-circle am-check"></i>
          <img
            src="https://i.ibb.co.com/4gmdTj1f/image-search-1769091285966.png"
            alt="Nagad"
          />
          <span>Nagad</span>
        </div>
      </div>

      <div className="am-content-container">
        {method === "bkash" && (
          <div id="content-bkash" className="am-box bkash text-white">
            <div className="am-title">ট্রানজেকশন আইডি দিন</div>
            <input
              type="text"
              className="am-input text-white"
              placeholder="ট্রানজেকশন আইডি দিন"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
            />
            <ul className="am-list text-white">
              <li>*247# ডায়াল করে আপনার BKASH মোবাইল মেনুতে যান অথবা BKASH অ্যাপে যান ।</li>
              <li style={{ color: "#FFEB3B", fontWeight: "bold" }}>
                Send Money/Make Payment - এ ক্লিক করুন ।
              </li>
              <li>প্রাপক নম্বর হিসেবে নিচের এই নম্বরটি লিখুন</li>
            </ul>
            <div className="am-num-row">
              <span id="bkash-num-display">{bkashNum}</span>
              <span style={{ fontWeight: 400, color: "white", fontSize: "12px" }}>
                (Send Money)
              </span>
              <button
                className="am-copy-btn"
                onClick={() => onCopyToClipboard(bkashNum)}
              >
                <i className="far fa-copy"></i> Copy
              </button>
            </div>
            <ul className="am-list mt-[10px] text-white">
              <li>নিশ্চিত করতে এখন আপনার BKASH মোবাইল মেনু পিন লিখুন।</li>
              <li>
                এখন উপরের বক্সে আপনার Transaction ID এবং Amount দিন আর নিচের VERIFY বাটনে
                ক্লিক করুন।
              </li>
            </ul>
          </div>
        )}

        {method === "rocket" && (
          <div id="content-rocket" className="am-box rocket text-white">
            <div className="am-title">ট্রানজেকশন আইডি দিন</div>
            <input
              type="text"
              className="am-input"
              placeholder="ট্রানজেকশন আইডি দিন"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
            />
            <ul className="am-list text-white">
              <li>*322# ডায়াল করে আপনার Rocket মোবাইল মেনুতে যান অথবা Rocket অ্যাপে যান ।</li>
              <li style={{ color: "#FFEB3B", fontWeight: "bold" }}>Send Money - এ ক্লিক করুন ।</li>
              <li>প্রাপক নম্বর হিসেবে নিচের এই নম্বরটি লিখুন</li>
            </ul>
            <div className="am-num-row">
              <span id="rocket-num-display">{rocketNum}</span>
              <span style={{ fontWeight: 400, color: "white", fontSize: "12px" }}>
                (Send Money)
              </span>
              <button
                className="am-copy-btn"
                onClick={() => onCopyToClipboard(rocketNum)}
              >
                <i className="far fa-copy"></i> Copy
              </button>
            </div>
            <ul className="am-list mt-[10px] text-white">
              <li>নিশ্চিত করতে এখন আপনার Rocket মোবাইল মেনু পিন লিখুন।</li>
              <li>
                এখন উপরের বক্সে আপনার Transaction ID এবং Amount দিন আর নিচের VERIFY বাটনে
                ক্লিক করুন।
              </li>
            </ul>
          </div>
        )}

        {method === "nagad" && (
          <div id="content-nagad" className="am-box nagad text-white">
            <div className="am-title">ট্রানজেকশন আইডি দিন</div>
            <input
              type="text"
              className="am-input"
              placeholder="ট্রানজেকশন আইডি দিন"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
            />
            <ul className="am-list text-white">
              <li>*167# ডায়াল করে আপনার NAGAD মোবাইল মেনুতে যান অথবা NAGAD অ্যাপে যান ।</li>
              <li style={{ color: "#FFEB3B", fontWeight: "bold" }}>Send Money - এ ক্লিক করুন ।</li>
              <li>প্রাপক নম্বর হিসেবে নিচের এই নম্বরটি লিখুন</li>
            </ul>
            <div className="am-num-row">
              <span id="nagad-num-display">{nagadNum}</span>
              <span style={{ fontWeight: 400, color: "white", fontSize: "12px" }}>
                (Send Money)
              </span>
              <button
                className="am-copy-btn"
                onClick={() => onCopyToClipboard(nagadNum)}
              >
                <i className="far fa-copy"></i> Copy
              </button>
            </div>
            <ul className="am-list mt-[10px] text-white">
              <li>নিশ্চিত করতে এখন আপনার NAGAD মোবাইল মেনু পিন লিখুন।</li>
              <li>
                এখন উপরের বক্সে আপনার Transaction ID এবং Amount দিন আর নিচের VERIFY বাটনে
                ক্লিক করুন।
              </li>
            </ul>
          </div>
        )}

        <button
          className="am-verify-btn"
          style={{
            backgroundColor:
              method === "bkash" ? "#E2136E" : method === "rocket" ? "#8C3494" : "#F7941D",
          }}
          onClick={() => onVerify(method, trxId)}
        >
          VERIFY
        </button>
      </div>
    </div>
  );
}
