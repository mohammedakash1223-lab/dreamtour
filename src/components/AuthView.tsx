import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import Swal from "sweetalert2";

interface AuthViewProps {
  onSuccess: () => void;
  setLoading: (loading: boolean) => void;
}

export default function AuthView({ onSuccess, setLoading }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register Form States
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPromo, setRegPromo] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPass) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill all fields",
      });
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      setLoading(false);
      onSuccess();
    } catch (e: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message,
      });
    }
  };

  const handleRegister = async () => {
    if (!regUsername || !regEmail || !regPhone || !regPass) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill all fields",
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail, regPass);
      const user = userCredential.user;

      await updateProfile(user, { displayName: regUsername });
      await set(ref(db, "users/" + user.uid), {
        username: regUsername,
        email: regEmail,
        phone: regPhone,
        deposit: 0,
        winning: 0,
        promoCodeUsed: regPromo || null,
      });

      setLoading(false);
      onSuccess();
    } catch (e: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message,
      });
    }
  };

  return (
    <div id="auth-view" className="active flex flex-col min-h-screen">
      {mode === "login" ? (
        <div id="login-container" className="w-full flex-1 flex flex-col">
          <div className="auth-top-section">
            <div className="auth-title-large">Welcome Back</div>
            <div className="auth-subtitle">Sign in to your account</div>
          </div>

          <div className="auth-bottom-card flex-1 flex flex-col">
            <div className="auth-card-title">Sign In</div>

            <div className="auth-input-group">
              <input
                type="email"
                className="auth-input-field"
                placeholder="Email Address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input-field"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} auth-password-eye`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="auth-checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>I agree to the Terms and Conditions and Privacy Policy</span>
            </div>

            <button className="auth-black-btn" onClick={handleLogin}>
              Sign Up
            </button>

            <div
              className="auth-forget-link"
              onClick={() =>
                Swal.fire({
                  title: "Forget Password?",
                  text: "Please contact support on Telegram to reset your password.",
                  icon: "info",
                })
              }
            >
              Forget Password ?
            </div>

            <div className="auth-footer-link mt-auto">
              Im a new user{" "}
              <span onClick={() => setMode("register")}>Register Now</span>
            </div>
          </div>
        </div>
      ) : (
        <div id="register-container" className="w-full flex-1 flex flex-col">
          <div className="auth-top-section">
            <div className="auth-title-large">Let's Start</div>
            <div className="auth-subtitle">Create an account</div>
          </div>

          <div className="auth-bottom-card flex-1 flex flex-col">
            <div className="auth-card-title">Sign Up</div>

            <div className="auth-input-group">
              <input
                type="text"
                className="auth-input-field"
                placeholder="UserName"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <input
                type="email"
                className="auth-input-field"
                placeholder="Email Address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <input
                type="number"
                className="auth-input-field"
                placeholder="Mobile Number"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input-field"
                placeholder="Password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} auth-password-eye`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <div className="auth-input-group">
              <input
                type="text"
                className="auth-input-field"
                placeholder="Promo Code (Optional)"
                value={regPromo}
                onChange={(e) => setRegPromo(e.target.value)}
              />
            </div>

            <div className="auth-checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>I agree to the Terms and Conditions and Privacy Policy</span>
            </div>

            {/* Note: 'SING UP' typo is kept exactly as the original spec images / html code */}
            <button className="auth-black-btn" onClick={handleRegister}>
              SING UP
            </button>

            <div className="auth-footer-link mt-auto">
              Already have an account{" "}
              <span onClick={() => setMode("login")}>Sign in here</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
