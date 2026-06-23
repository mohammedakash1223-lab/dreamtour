import { UserProfile } from "../types";

interface SubWalletProps {
  profileData: UserProfile;
  onNavigate: (page: string) => void;
  onOpenVideo: (type: string) => void;
}

export default function SubWallet({ profileData, onNavigate, onOpenVideo }: SubWalletProps) {
  const deposit = profileData.deposit ?? 0;
  const winning = profileData.winning ?? 0;
  const total = deposit + winning;

  return (
    <div id="wallet-view" className="app-section active pb-[40px]">
      <div className="wallet-redesign-container">
        <div className="back-nav dark-mode" onClick={() => onNavigate("profile")}>
          <i className="fas fa-arrow-left"></i> My Wallet
        </div>

        <div className="wallet-gradient-card">
          <div className="wg-header">
            <i className="fas fa-credit-card"></i>
            KheloBangladesh <span className="wg-wallet-text">WALLET</span>
          </div>

          <div className="wg-label text-left">Available Balance</div>
          <div className="wg-balance">৳ {total}</div>

          <div className="wg-footer">GAMING</div>
        </div>

        <div className="wallet-stats-white-card">
          <div className="ws-item">
            <div className="ws-icon">
              <i className="fas fa-wallet" style={{ color: "#2196f3" }}></i>
            </div>
            <div className="ws-label">DEPOSITED</div>
            <div className="ws-amount">৳ {deposit}</div>
          </div>
          <div className="ws-item">
            <div className="ws-icon">
              <i className="fas fa-trophy" style={{ color: "#000" }}></i>
            </div>
            <div className="ws-label">WINNING</div>
            <div className="ws-amount">৳ {winning}</div>
          </div>
        </div>

        <div className="wallet-action-row">
          <button className="wa-btn add" onClick={() => onNavigate("add-money")}>
            <i className="fas fa-plus-circle"></i> Add Money
          </button>
          <button className="wa-btn withdraw" onClick={() => onNavigate("withdraw")}>
            <i className="fas fa-money-bill-wave"></i> Withdraw
          </button>
        </div>

        <div className="wallet-section-title">Quick Actions</div>
        <div className="quick-action-card" onClick={() => onNavigate("history")}>
          <div className="qa-info">
            <div className="qa-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="qa-text">
              <div>Transaction History</div>
              <div>View all your transactions</div>
            </div>
          </div>
          <i className="fas fa-chevron-right" style={{ color: "#ccc" }}></i>
        </div>

        <div className="wallet-section-title">
          <i className="fas fa-info-circle"></i> Learn and Support
        </div>
        <div className="learn-list">
          <div className="learn-item" onClick={() => onOpenVideo("addMoney")}>
            <div className="qa-info">
              <div className="li-icon">
                <i className="fas fa-gamepad text-[24px]"></i>
              </div>
              <div className="qa-text">
                <div>How to add money?</div>
                <div>কিভাবে টাকা অ্যাড করবেন</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: "#ccc" }}></i>
          </div>
          <div className="learn-item" onClick={() => onOpenVideo("howPlay")}>
            <div className="qa-info">
              <div className="li-icon">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3063/3063205.png"
                  width="40"
                  alt="Play Icon"
                />
              </div>
              <div className="qa-text">
                <div>How to join a match?</div>
                <div>কিভাবে ম্যাচে জয়েন করবেন</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: "#ccc" }}></i>
          </div>
          <div className="learn-item" onClick={() => onOpenVideo("getRoom")}>
            <div className="qa-info">
              <div className="li-icon">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1256/1256650.png"
                  width="40"
                  alt="Room Icon"
                />
              </div>
              <div className="qa-text">
                <div>How to get Room ID?</div>
                <div>কিভাবে রুম আইডি পাবেন</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: "#ccc" }}></i>
          </div>
        </div>
      </div>
    </div>
  );
}
