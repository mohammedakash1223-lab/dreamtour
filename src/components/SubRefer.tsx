interface SubReferProps {
  onBack: () => void;
  onCopyToClipboard: (text: string) => void;
}

export default function SubRefer({ onBack, onCopyToClipboard }: SubReferProps) {
  const promoCode = "62578"; // Kept exactly as original user profile refer code static assignment

  return (
    <div id="refer-view" className="app-section active text-black min-h-screen">
      <div className="refer-page-container">
        <div className="refer-header">
          <div className="back-nav dark-mode" style={{ borderBottom: "none" }} onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Refer & Earn
          </div>
          <div className="refer-avatar-circle">
            <img src="https://cdn-icons-png.flaticon.com/512/3233/3233483.png" alt="Team" />
          </div>
          <div className="refer-title">REFER MORE TO EARN MORE!</div>
          <div className="refer-desc">
            আপনি যখন কাউকে আপনার রেফার কোড দিয়ে রেফার করবেন তখন উক্ত ইউজার যদি প্রথমবার ১০০ টাকা বা তার বেশি ডিপোজিট করে তাহলে আপনি ১০ টাকা পাবেন
          </div>
        </div>

        <div className="refer-body">
          <div className="refer-label">YOUR PROMO CODE</div>
          <div
            className="refer-code-box"
            id="refer-code-display"
            onClick={() => onCopyToClipboard(promoCode)}
          >
            {promoCode}
          </div>

          <img
            src="https://cdn.dribbble.com/users/3835731/screenshots/17804471/media/e898952467d013233777592cf1cc4da1.jpg?resize=400x300&vertical=center"
            alt="Steps"
            className="refer-illustration"
          />

          <button className="refer-btn-fixed" onClick={() => onCopyToClipboard(promoCode)}>
            REFER NOW
          </button>
        </div>
      </div>
    </div>
  );
}
