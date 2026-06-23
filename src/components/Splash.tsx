import { useEffect, useState } from "react";

interface SplashProps {
  appName: string;
  appLogo: string;
  onFinish: () => void;
}

export default function Splash({ appName, appLogo, onFinish }: SplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let innerTimer: any = null;
    const timer = setTimeout(() => {
      setVisible(false);
      innerTimer = setTimeout(onFinish, 500); // Wait for fade transition
    }, 1800);
    return () => {
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      id="app-splash"
      className="fixed inset-0 bg-gradient-to-b from-[#101018] to-black z-[10000] flex flex-col justify-center items-center text-white transition-opacity duration-500 ease-out overflow-hidden"
    >
      <div className="splash-logo-box">
        <img
          id="splash-logo"
          src={appLogo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="Logo"
        />
      </div>
      <div className="splash-app-name" id="splash-app-name">
        {appName || "Dream Tour"}
      </div>
      <div className="splash-version">2.0</div>

      <div className="splash-bottom-area">
        <div className="splash-welcome">Welcome back!</div>
        <div className="splash-line"></div>
        <div className="splash-dots-container">
          <div className="splash-dot"></div>
          <div className="splash-dot"></div>
          <div className="splash-dot"></div>
        </div>
      </div>

      {/* Floating Particles */}
      <span className="particle" style={{ left: "10%", animationDuration: "5s" }}></span>
      <span
        className="particle"
        style={{ left: "20%", animationDuration: "7s", animationDelay: "1s" }}
      ></span>
      <span
        className="particle"
        style={{ left: "35%", animationDuration: "6s", animationDelay: "2s" }}
      ></span>
      <span className="particle" style={{ left: "50%", animationDuration: "8s" }}></span>
      <span
        className="particle"
        style={{ left: "65%", animationDuration: "5s", animationDelay: "1.5s" }}
      ></span>
      <span
        className="particle"
        style={{ left: "80%", animationDuration: "9s", animationDelay: "0.5s" }}
      ></span>
      <span className="particle" style={{ left: "90%", animationDuration: "6s" }}></span>
    </div>
  );
}
