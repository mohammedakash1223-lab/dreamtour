import { UserProfile } from "../types";

interface TabProfileProps {
  user: any;
  profileData: UserProfile;
  unreadNotifications: number;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function TabProfile({
  user,
  profileData,
  unreadNotifications,
  onNavigate,
  onLogout,
}: TabProfileProps) {
  const deposit = profileData.deposit ?? 0;
  const winning = profileData.winning ?? 0;

  return (
    <div id="tab-profile-view" className="app-section active pb-[90px] text-black">
      <div className="profile-header-bg">
        <div className="profile-avatar-box">
          <img
            id="profile-avatar"
            src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Profile"
          />
        </div>
        <h3 id="profile-name" className="mt-[5px] font-[800]">
          {user?.displayName || "Guest User"}
        </h3>
        <p id="profile-email" className="opacity-90 text-[13px] mb-[15px]">
          {user?.email || "Please login to continue"}
        </p>

        <div className="flex justify-center gap-[30px]">
          <div>
            <div className="text-[12px] opacity-80">Deposit</div>
            <div className="font-bold text-[18px]">
              ৳ <span id="profile-bal-dep">{deposit}</span>
            </div>
          </div>
          <div>
            <div className="text-[12px] opacity-80">Winnings</div>
            <div className="font-bold text-[18px]">
              ৳ <span id="profile-bal-win">{winning}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-[20px]">
        <div className="menu-list">
          <div className="menu-item" onClick={() => onNavigate("wallet")}>
            <img
              src="https://img.icons8.com/?size=100&id=JeOIikeRv8rJ&format=png&color=000000"
              alt="Wallet"
            />
            <span>My Wallet</span>
            <i className="fas fa-chevron-right ml-auto text-[#ccc]"></i>
          </div>
          <div className="menu-item" onClick={() => onNavigate("edit-profile")}>
            <img
              src="https://img.icons8.com/?size=100&id=O6yJLWcR6TNz&format=png&color=000000"
              alt="Edit Profile"
            />
            <span>Edit Profile</span>
            <i className="fas fa-chevron-right ml-auto text-[#ccc]"></i>
          </div>
          <div className="menu-item" onClick={() => onNavigate("refer")}>
            <img
              src="https://img.icons8.com/?size=100&id=mvX5rQmbiHy1&format=png&color=000000"
              alt="Refer"
            />
            <span>Refer & Earn</span>
            <i className="fas fa-chevron-right ml-auto text-[#ccc]"></i>
          </div>
          <div className="menu-item" onClick={() => onNavigate("history")}>
            <img
              src="https://img.icons8.com/?size=100&id=TF9VCgblG6vy&format=png&color=000000"
              alt="Transactions"
            />
            <span>All Transactions</span>
            <i className="fas fa-chevron-right ml-auto text-[#ccc]"></i>
          </div>
          <div className="menu-item" onClick={() => onNavigate("notifications")}>
            <img
              src="https://img.icons8.com/?size=100&id=ds3fC4MMLVI6&format=png&color=000000"
              alt="Notifications"
            />
            <span>Notification</span>
            {unreadNotifications > 0 && (
              <span
                id="menu-notif-badge"
                className="bg-red-600 text-white text-[10px] px-[6px] py-[2px] rounded-[10px] ml-auto font-[600]"
              >
                {unreadNotifications}
              </span>
            )}
          </div>

          <div className="menu-item" onClick={() => onNavigate("developer")}>
            <img
              src="https://img.icons8.com/?size=100&id=Aiy01hWHN0hk&format=png&color=000000"
              alt="Developer"
            />
            <span>Developer</span>
            <i className="fas fa-chevron-right ml-auto text-[#ccc]"></i>
          </div>

          <div className="menu-item" onClick={onLogout} id="profile-logout-btn">
            <i className="fas fa-sign-out-alt text-red-600 w-[20px]"></i>
            <span className="text-red-600">Logout</span>
          </div>
        </div>
        <div className="text-center mt-[20px] text-[#ccc] text-[12px]">App Version 1.0.0</div>
      </div>
    </div>
  );
}
