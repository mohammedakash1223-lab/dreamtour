interface SubDeveloperProps {
  onBack: () => void;
}

export default function SubDeveloper({ onBack }: SubDeveloperProps) {
  return (
    <div id="developer-view" className="app-section active bg-white min-h-screen text-black">
      <div
        className="back-nav"
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          padding: "25px 20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <i className="fas fa-chevron-left" style={{ fontSize: "22px", color: "#000" }}></i>
        <span style={{ fontSize: "20px", fontWeight: 800, color: "#000" }}>Developer Profile</span>
      </div>

      <div className="dev-page" style={{ padding: "0 25px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, color: "#4a4a4a", marginBottom: "20px", textAlign: "left" }}>
          টুর্নামেন্ট অ্যাপ বিক্রি হচ্ছে
        </div>

        <div style={{ fontSize: "15px", fontWeight: 600, color: "#4a4a4a", lineHeight: 1.5, marginBottom: "25px", textAlign: "left" }}>
          আমরা তৈরি করে দিচ্ছি আপনার নিজস্ব Android Tournament App এবং Website Tournament System।
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, color: "#333", fontSize: "15px" }}>
            <i className="fas fa-check" style={{ color: "#333", fontSize: "16px" }}></i> Automatic Payment System
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, color: "#333", fontSize: "15px" }}>
            <i className="fas fa-check" style={{ color: "#333", fontSize: "16px" }}></i> Admin System
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, color: "#333", fontSize: "15px" }}>
            <i className="fas fa-check" style={{ color: "#333", fontSize: "16px" }}></i> Moderator Panel
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, color: "#333", fontSize: "15px" }}>
            <i className="fas fa-check" style={{ color: "#333", fontSize: "16px" }}></i> সম্পূর্ণ কাস্টম ডিজাইন
          </div>
        </div>

        <div style={{ fontSize: "16px", fontWeight: 800, color: "#333", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>💰</span> শুরু মাত্র ২৫,০০০ টাকা থেকে!
        </div>

        <a
          href="https://t.me/DV_IASAN"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "16px", fontWeight: 700, color: "#673AB7", textDecoration: "underline", display: "block", textAlign: "left" }}
        >
          https://t.me/DV_IASAN
        </a>
      </div>
    </div>
  );
}
