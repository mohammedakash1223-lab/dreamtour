import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { ref, onValue, set, update, get, push, serverTimestamp } from "firebase/database";
import { auth, db } from "./firebase";
import {
  AppSettings,
  UserProfile,
  Category,
  Match,
  Transaction,
  Notification,
  TabName,
  SubPageName,
  MatchParticipant,
} from "./types";

import Splash from "./components/Splash";
import AuthView from "./components/AuthView";
import MatchCard from "./components/MatchCard";
import TabHome from "./components/TabHome";
import TabProfile from "./components/TabProfile";

// Subpages
import SubWallet from "./components/SubWallet";
import SubAddMoney from "./components/SubAddMoney";
import SubWithdraw from "./components/SubWithdraw";
import SubHistory from "./components/SubHistory";
import SubNotifications from "./components/SubNotifications";
import SubRefer from "./components/SubRefer";
import SubEditProfile from "./components/SubEditProfile";
import SubDeveloper from "./components/SubDeveloper";
import SubMatchDetails from "./components/SubMatchDetails";
import SubResultDetails from "./components/SubResultDetails";
import SubJoinMatch from "./components/SubJoinMatch";

import Swal from "sweetalert2";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // States for dynamic DB collections
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [matches, setMatches] = useState<Match[]>([]);
  const [allParticipants, setAllParticipants] = useState<Record<string, Record<string, MatchParticipant>>>({});
  const [appSettings, setAppSettings] = useState<AppSettings>({});
  const [profileData, setProfileData] = useState<UserProfile>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Navigation Logic
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [activeSubPage, setActiveSubPage] = useState<SubPageName | null>(null);

  // Selection states for dynamic views
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchTabFilter, setMatchTabFilter] = useState<"Upcoming" | "Ongoing" | "Finished">("Upcoming");

  // Local helper joined list
  const [userJoinedMatches, setUserJoinedMatches] = useState<string[]>([]);

  // Modal overlayers states
  const [startupModalOpen, setStartupModalOpen] = useState(false);
  const [prizeModalOpen, setPrizeModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [joinWarningModalOpen, setJoinWarningModalOpen] = useState(false);
  const [focusedMatch, setFocusedMatch] = useState<Match | null>(null);

  // --- Realtime DB listeners initialization ---
  useEffect(() => {
    // Top-level listener cleanup trackers
    const unsubscribes: (() => void)[] = [];

    // 1. Categories
    const unsubCategories = onValue(ref(db, "categories"), (snapshot) => {
      const data = snapshot.val();
      if (data) setCategories(data);
    }, (err) => {
      console.warn("Firebase categories read warning:", err);
    });
    unsubscribes.push(unsubCategories);

    // 2. Matches
    const unsubMatches = onValue(ref(db, "matches"), (snapshot) => {
      const data = snapshot.val();
      const loadedMatches: Match[] = [];
      if (data) {
        Object.entries(data).forEach(([key, val]: [string, any]) => {
          loadedMatches.push({ dbKey: key, ...val });
        });
      }
      setMatches(loadedMatches);
    }, (err) => {
      console.warn("Firebase matches read warning:", err);
    });
    unsubscribes.push(unsubMatches);

    // 3. Match participants
    const unsubParticipants = onValue(ref(db, "match_participants"), (snapshot) => {
      const data = snapshot.val();
      if (data) setAllParticipants(data);
      else setAllParticipants({});
    }, (err) => {
      console.warn("Firebase match_participants read warning:", err);
    });
    unsubscribes.push(unsubParticipants);

    // 4. Notifications
    const unsubNotifications = onValue(ref(db, "notifications"), (snapshot) => {
      const data = snapshot.val();
      const loaded: Notification[] = [];
      if (data) {
        Object.values(data).forEach((n: any) => {
          loaded.push(n);
        });
      }
      setNotifications(loaded);
    }, (err) => {
      console.warn("Firebase notifications read warning:", err);
    });
    unsubscribes.push(unsubNotifications);

    // 5. App configurations and settings
    const unsubAppSettings = onValue(ref(db, "app_settings"), (snapshot) => {
      const d = snapshot.val();
      if (d) {
        setAppSettings(d);
        if (d.show_popup && d.popup_text) {
          // Open startup modal shortly after startup
          setTimeout(() => setStartupModalOpen(true), 1500);
        }
      }
    }, (err) => {
      console.warn("Firebase app_settings read warning:", err);
    });
    unsubscribes.push(unsubAppSettings);

    // Track user-specific unsubscribes
    let unsubUser: (() => void) | null = null;
    let unsubUserTransactions: (() => void) | null = null;

    // 6. Hook user auth session updates
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      // Clean up previous user listeners if any
      if (unsubUser) {
        unsubUser();
        unsubUser = null;
      }
      if (unsubUserTransactions) {
        unsubUserTransactions();
        unsubUserTransactions = null;
      }

      if (user) {
        // Fetch user profile node
        unsubUser = onValue(ref(db, `users/${user.uid}`), (snapshot) => {
          const val = snapshot.val();
          if (val) setProfileData(val);
        }, (err) => {
          console.warn("Firebase user profile read warning:", err);
        });

        // Fetch User transactions
        unsubUserTransactions = onValue(ref(db, `transactions/${user.uid}`), (snapshot) => {
          const val = snapshot.val();
          const list: Transaction[] = [];
          if (val) {
            Object.values(val).forEach((t: any) => {
              list.push(t);
            });
          }
          setTransactions(list);
        }, (err) => {
          console.warn("Firebase transactions read warning:", err);
        });
      } else {
        setProfileData({});
        setTransactions([]);
      }
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
      if (unsubUser) unsubUser();
      if (unsubUserTransactions) unsubUserTransactions();
      unsubscribeAuth();
    };
  }, []);

  // Recalculate joined status matches based on UID
  useEffect(() => {
    if (!currentUser || !allParticipants) {
      setUserJoinedMatches([]);
      return;
    }
    const joinedList: string[] = [];
    Object.keys(allParticipants).forEach((matchKey) => {
      const partsObj = allParticipants[matchKey];
      if (partsObj) {
        const list = Object.values(partsObj) as MatchParticipant[];
        if (list.some((p) => p.joinedBy === currentUser.uid)) {
          joinedList.push(matchKey);
        }
      }
    });
    setUserJoinedMatches(joinedList);
  }, [currentUser, allParticipants]);

  // Handle auto payment trigger
  const handleVerifyTrx = async (method: string, trxId: string) => {
    if (!currentUser) return;
    const cleanTrx = trxId.trim();
    if (!cleanTrx) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter Transaction ID",
      });
      return;
    }

    setLoading(true);

    try {
      const usedSnap = await get(ref(db, `Auto Pay/${cleanTrx}`));
      if (usedSnap.exists()) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "This TrxID has already been used!",
        });
        return;
      }

      const apiSnap = await get(ref(db, "XNXANIKPAY"));
      let found: any = null;
      if (apiSnap.exists()) {
        Object.values(apiSnap.val()).forEach((p: any) => {
          if (p.txid && p.txid.toLowerCase() === cleanTrx.toLowerCase()) {
            found = p;
          }
        });
      }

      if (found) {
        const amount = parseFloat(found.amount);
        const depBal = profileData.deposit ?? 0;
        await update(ref(db, `users/${currentUser.uid}`), {
          deposit: depBal + amount,
        });
        await set(ref(db, `Auto Pay/${cleanTrx}`), {
          amount: amount,
          usedBy: currentUser.uid,
          time: serverTimestamp(),
        });
        const txKey = push(ref(db, `transactions/${currentUser.uid}`)).key;
        await set(ref(db, `transactions/${currentUser.uid}/${txKey}`), {
          type: "Deposit (Auto)",
          amount: amount,
          method: method.toUpperCase(),
          status: "Success",
          txID: txKey,
          date: new Date().toLocaleString(),
        });

        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: `Successfully added ${amount} TK!`,
        });
        setActiveSubPage("wallet");
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Invalid",
          text: "Invalid TrxID.",
        });
      }
    } catch (e: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message,
      });
    }
  };

  // Withdraw Money submission
  const handleWithdrawSubmit = async (method: string, number: string, amount: number) => {
    if (!currentUser) return;
    if (!number || isNaN(amount)) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }
    if (amount < 100) {
      Swal.fire("Error", "Minimum withdraw amount is 100 TK", "error");
      return;
    }
    const winningBal = profileData.winning ?? 0;
    if (amount > winningBal) {
      Swal.fire("Error", "Insufficient winning balance", "error");
      return;
    }

    Swal.fire({
      title: "Confirm Withdraw?",
      text: `Are you sure you want to withdraw ${amount} TK to ${method} (${number})?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00c853",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Withdraw",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const requestId = push(ref(db, "withdraw_requests")).key;
          const transactionId = push(ref(db, `transactions/${currentUser.uid}`)).key;
          const timestamp = new Date().toLocaleString();

          // 1. Deduct from winning balance
          const newWinning = winningBal - amount;
          await update(ref(db, `users/${currentUser.uid}`), { winning: newWinning });

          // 2. Write admin withdraw requests node
          await set(ref(db, `withdraw_requests/${requestId}`), {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Unknown",
            userEmail: currentUser.email,
            amount: amount,
            method: method,
            mobileNumber: number,
            status: "pending",
            timestamp: timestamp,
            requestedAt: serverTimestamp(),
          });

          // 3. Write user transaction log
          await set(ref(db, `transactions/${currentUser.uid}/${transactionId}`), {
            type: "Withdraw Request",
            amount: amount,
            method: method,
            number: number,
            status: "Pending",
            date: timestamp,
            requestId: requestId,
          });

          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Withdraw Request Sent!",
            text: `Your request of ${amount} TK has been logged. Admin will process it shortly.`,
          });
          setActiveSubPage("wallet");
        } catch (e: any) {
          setLoading(false);
          Swal.fire("Error", e.message, "error");
        }
      }
    });
  };

  // Profile Save adjustments
  const handleProfileSave = async (
    newName: string | null,
    curP: string | null,
    newP: string | null,
    phoneNum: string | null
  ) => {
    if (!currentUser) return;
    setLoading(true);

    const promises = [];

    if (newName && newName !== currentUser.displayName) {
      promises.push(
        updateProfile(currentUser, { displayName: newName }).then(() => {
          update(ref(db, "users/" + currentUser.uid), { username: newName });
        })
      );
    }

    if (phoneNum) {
      promises.push(update(ref(db, "users/" + currentUser.uid), { phone: phoneNum }));
    }

    if (newP) {
      if (!curP) {
        setLoading(false);
        Swal.fire("Error", "Current password required to change password", "error");
        return;
      }
      const cred = EmailAuthProvider.credential(currentUser.email, curP);
      promises.push(
        reauthenticateWithCredential(currentUser, cred).then(() =>
          updatePassword(currentUser, newP)
        )
      );
    }

    Promise.all(promises)
      .then(() => {
        setLoading(false);
        Swal.fire("Success", "Profile details adjusted", "success");
        setActiveSubPage(null);
        setActiveTab("profile");
      })
      .catch((e: any) => {
        setLoading(false);
        Swal.fire("Error", e.message, "error");
      });
  };

  // Join Match confirmation write
  const handleConfirmJoin = async (playerNames: string[]) => {
    if (!selectedMatch || !currentUser) return;

    if (userJoinedMatches.includes(selectedMatch.dbKey)) {
      Swal.fire({
        icon: "warning",
        title: "Already Joined",
        text: "You have already joined this match!",
      });
      return;
    }

    const dep = profileData.deposit ?? 0;
    const win = profileData.winning ?? 0;
    const entryFee = selectedMatch.entry * playerNames.length;

    if (dep + win < entryFee) {
      Swal.fire("Error", "Insufficient Balance", "error");
      return;
    }

    setLoading(true);

    try {
      let remFee = entryFee;
      let d = dep;
      let w = win;

      if (d >= remFee) {
        d -= remFee;
        remFee = 0;
      } else {
        remFee -= d;
        d = 0;
        w -= remFee;
      }

      // Update user balances
      await update(ref(db, `users/${currentUser.uid}`), { deposit: d, winning: w });

      // Add player names logs to participants database
      for (const name of playerNames) {
        await push(ref(db, `match_participants/${selectedMatch.dbKey}`), {
          ign: name,
          joinedBy: currentUser.uid,
          kills: 0,
          win: 0,
        });
      }

      // Increment match counts
      const mRef = ref(db, `matches/${selectedMatch.dbKey}`);
      const mValSnap = await get(mRef);
      const currentCount = mValSnap.val()?.joined ?? 0;
      await update(mRef, { joined: currentCount + playerNames.length });

      // Log transaction record
      const tid = push(ref(db, `transactions/${currentUser.uid}`)).key;
      await set(ref(db, `transactions/${currentUser.uid}/${tid}`), {
        type: "Match Join",
        amount: entryFee,
        method: "Wallet",
        status: "Success",
        date: new Date().toLocaleString(),
      });

      // Update local array for instantaneous feel
      setUserJoinedMatches((prev) => [...prev, selectedMatch.dbKey]);

      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Joined Completed!",
        text: "You are registered in the match.",
      });

      // Redirect back to matches catalogue list
      setActiveSubPage(null);
      if (selectedCategoryId) {
        setActiveTab("matches");
      } else {
        setActiveTab("home");
      }
    } catch (e: any) {
      setLoading(false);
      Swal.fire("Error", e.message, "error");
    }
  };

  // Standard modal functions
  const handleOpenPrizeDetails = (m: Match) => {
    setFocusedMatch(m);
    setPrizeModalOpen(true);
  };

  const handleCheckRoomDetails = (m: Match) => {
    if (!currentUser) return;
    const isJoined = userJoinedMatches.includes(m.dbKey);

    if (isJoined) {
      const rId = m.room_id || "";
      const rPass = m.room_pass || "";

      if (!rId || rId.toLowerCase() === "undefined" || rId.length < 2) {
        Swal.fire({
          icon: "info",
          title: "অপেক্ষা করুন",
          text: "ম্যাচ শুরু হওয়ার ১০ মিনিট আগে কোড দেওয়া হবে",
        });
      } else {
        setFocusedMatch(m);
        setRoomModalOpen(true);
      }
    } else {
      setJoinWarningModalOpen(true);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth);
      }
    });
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        Swal.fire({
          icon: "success",
          title: "Copied!",
          text: "Copied to clipboard",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        console.warn("Fallback copy was unsuccessful");
      }
    } catch (err) {
      console.warn("Fallback copy failed:", err);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Copied!",
              text: "Copied to clipboard",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            fallbackCopyToClipboard(text);
          });
      } else {
        fallbackCopyToClipboard(text);
      }
    } catch (e) {
      fallbackCopyToClipboard(text);
    }
  };

  const handleOpenVideo = (type: string) => {
    try {
      let url = "";
      if (type === "addMoney") url = appSettings.how_to_add_money_link || "";
      if (type === "getRoom") url = appSettings.how_to_get_room_id_link || "";
      if (type === "howPlay") url = appSettings.how_to_play_link || "";
      if (url) window.open(url, "_blank");
    } catch (err) {
      console.warn("Failed to open video link:", err);
    }
  };

  const handleOpenSupport = () => {
    try {
      if (appSettings.support_link) {
        window.open(appSettings.support_link, "_blank");
      }
    } catch (err) {
      console.warn("Failed to open support link:", err);
    }
  };

  const handleOpenShopLink = () => {
    try {
      if (appSettings.shop_link) {
        window.open(appSettings.shop_link, "_blank");
      }
    } catch (err) {
      console.warn("Failed to open shop link:", err);
    }
  };

  // --- RENDERING VIEWS MECHANISMS ---

  // Handle splash loading
  if (showSplash) {
    return (
      <Splash
        appName={appSettings?.app_name || ""}
        appLogo={appSettings?.app_logo || ""}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  // Handle anonymous or unauthorized visitors
  if (!currentUser) {
    return (
      <>
        {loading && (
          <div id="global-loader" className="active">
            <div className="spinner"></div>
          </div>
        )}
        <AuthView onSuccess={() => {}} setLoading={setLoading} />
      </>
    );
  }

  // Categories counts matches
  const filteredMatchesBySelectedCategory = matches.filter(
    (m) => m.categoryId === selectedCategoryId
  );

  const getParticipantsListForSelectedMatch = (): MatchParticipant[] => {
    if (!selectedMatch || !allParticipants) return [];
    const partsForMatch = allParticipants[selectedMatch.dbKey];
    return partsForMatch ? (Object.values(partsForMatch) as MatchParticipant[]) : [];
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-black">
      {/* GLOBAL LOADING OVERLAY */}
      {loading && (
        <div id="global-loader" className="active">
          <div className="spinner"></div>
        </div>
      )}

      {/* FLOATING SUPPORT ACTION LINK */}
      <div className="fab-telegram" onClick={handleOpenSupport}>
        <img
          src="https://img.icons8.com/?size=100&id=yjJvTQzQoKEy&format=png&color=000000"
          alt="Support"
        />
      </div>

      {/* INNER VIEWPORTS ROUTING */}
      {activeSubPage ? (
        // --- SUB PAGES GRAPHICS viewport ---
        <div className="sub-viewport pt-0">
          {activeSubPage === "wallet" && (
            <SubWallet
              profileData={profileData}
              onNavigate={(p) => {
                if (p === "profile") {
                  setActiveSubPage(null);
                  setActiveTab("profile");
                } else setActiveSubPage(p as SubPageName);
              }}
              onOpenVideo={handleOpenVideo}
            />
          )}

          {activeSubPage === "add-money" && (
            <SubAddMoney
              appSettings={appSettings}
              onBack={() => setActiveSubPage("wallet")}
              onVerify={handleVerifyTrx}
              onCopyToClipboard={handleCopyToClipboard}
            />
          )}

          {activeSubPage === "withdraw" && (
            <SubWithdraw
              profileData={profileData}
              onBack={() => setActiveSubPage("wallet")}
              onSubmit={handleWithdrawSubmit}
            />
          )}

          {activeSubPage === "history" && (
            <SubHistory
              transactions={transactions}
              onBack={() => setActiveSubPage("wallet")}
            />
          )}

          {activeSubPage === "notifications" && (
            <SubNotifications
              notifications={notifications}
              onBack={() => {
                setActiveSubPage(null);
                setActiveTab("profile");
              }}
            />
          )}

          {activeSubPage === "refer" && (
            <SubRefer
              onBack={() => {
                setActiveSubPage(null);
                setActiveTab("profile");
              }}
              onCopyToClipboard={handleCopyToClipboard}
            />
          )}

          {activeSubPage === "edit-profile" && (
            <SubEditProfile
              user={currentUser}
              profileData={profileData}
              onBack={() => {
                setActiveSubPage(null);
                setActiveTab("profile");
              }}
              onSave={handleProfileSave}
            />
          )}

          {activeSubPage === "developer" && (
            <SubDeveloper
              onBack={() => {
                setActiveSubPage(null);
                setActiveTab("profile");
              }}
            />
          )}

          {activeSubPage === "match-details" && (
            <SubMatchDetails
              match={selectedMatch}
              participants={getParticipantsListForSelectedMatch()}
              onBack={() => {
                setActiveSubPage(null);
                if (selectedCategoryId) {
                  setActiveTab("matches");
                } else {
                  setActiveTab("home");
                }
              }}
            />
          )}

          {activeSubPage === "result-details" && (
            <SubResultDetails
              match={selectedMatch}
              participants={getParticipantsListForSelectedMatch()}
              onBack={() => {
                setActiveSubPage(null);
                setActiveTab("result");
              }}
            />
          )}

          {activeSubPage === "join-match" && (
            <SubJoinMatch
              match={selectedMatch}
              onBack={() => {
                setActiveSubPage(null);
                if (selectedCategoryId) {
                  setActiveTab("matches");
                } else {
                  setActiveTab("home");
                }
              }}
              onConfirm={handleConfirmJoin}
            />
          )}
        </div>
      ) : (
        // --- PRIMARY NAVIGATION TABS viewports ---
        <div className="tab-viewport pb-[75px]">
          {activeTab === "shop" && (
            <section id="tab-shop-view" className="app-section active flex-col items-center">
              <div className="shop-image-container" onClick={handleOpenShopLink}>
                <img
                  src="https://i.supaimg.com/2fd5424a-9f20-4ccb-ac8d-d5e07a42aafa.png"
                  alt="Diamond Topup"
                  className="w-full object-contain"
                />
              </div>
              <div className="shop-text">
                ১০০% বিশ্বাসের সাথে ডায়মন্ড টপআপ করতে উপরের ছবিতে ক্লিক করুন ☝️☝️☝️
              </div>
            </section>
          )}

          {activeTab === "home" && (
            <TabHome
              banners={appSettings?.banners || {}}
              noticeText={appSettings?.notice || ""}
              categories={categories}
              matches={matches}
              onSelectCategory={(categoryId) => {
                setSelectedCategoryId(categoryId);
                setMatchTabFilter("Upcoming");
                setActiveTab("matches");
              }}
            />
          )}

          {activeTab === "mymatches" && (
            <section id="tab-mymatches-view" className="app-section active p-[15px]">
              <h2 className="text-xl font-[900] text-gray-800 text-left mb-[15px]">My Matches</h2>
              <div id="mymatches-container">
                {matches.filter((m) => userJoinedMatches.includes(m.dbKey)).length === 0 ? (
                  <div className="empty-msg text-center p-[30px] text-gray-400 font-semibold">No joined matches</div>
                ) : (
                  matches
                    .filter((m) => userJoinedMatches.includes(m.dbKey))
                    .map((m) => (
                      <MatchCard
                        key={m.dbKey}
                        match={m}
                        categories={categories}
                        userJoined={true}
                        type="joined"
                        onJoin={() => {}}
                        onCheckRoom={handleCheckRoomDetails}
                        onOpenPrize={handleOpenPrizeDetails}
                        onOpenDetails={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("match-details");
                        }}
                        onOpenResult={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("result-details");
                        }}
                      />
                    ))
                )}
              </div>
            </section>
          )}

          {activeTab === "result" && (
            <section id="tab-result-view" className="app-section active p-[15px]">
              <h2 className="text-xl font-[900] text-gray-800 text-left mb-[15px]">Match Results</h2>
              <div id="result-container">
                {matches.filter((m) => m.status === "Finished").length === 0 ? (
                  <div className="empty-msg text-center p-[30px] text-gray-400 font-semibold">No results yet</div>
                ) : (
                  matches
                    .filter((m) => m.status === "Finished")
                    .map((m) => (
                      <MatchCard
                        key={m.dbKey}
                        match={m}
                        categories={categories}
                        userJoined={userJoinedMatches.includes(m.dbKey)}
                        type="result"
                        onJoin={() => {}}
                        onCheckRoom={handleCheckRoomDetails}
                        onOpenPrize={handleOpenPrizeDetails}
                        onOpenDetails={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("match-details");
                        }}
                        onOpenResult={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("result-details");
                        }}
                      />
                    ))
                )}
              </div>
            </section>
          )}

          {activeTab === "profile" && (
            <TabProfile
              user={currentUser}
              profileData={profileData}
              unreadNotifications={notifications.length}
              onNavigate={(page) => {
                setActiveSubPage(page as SubPageName);
              }}
              onLogout={handleLogout}
            />
          )}

          {activeTab === "matches" && (
            <section id="matches-view" className="app-section active text-black">
              <div className="back-nav" onClick={() => setActiveTab("home")}>
                <i className="fas fa-arrow-left"></i> Back to Home
              </div>

              <div className="match-tabs-container">
                <div
                  className={`m-tab ${matchTabFilter === "Upcoming" ? "active" : ""}`}
                  onClick={() => setMatchTabFilter("Upcoming")}
                >
                  Upcoming
                </div>
                <div
                  className={`m-tab ${matchTabFilter === "Ongoing" ? "active" : ""}`}
                  onClick={() => setMatchTabFilter("Ongoing")}
                >
                  On-Going
                </div>
                <div
                  className={`m-tab ${matchTabFilter === "Finished" ? "active" : ""}`}
                  onClick={() => setMatchTabFilter("Finished")}
                >
                  Result
                </div>
              </div>

              <div id="matches-container" className="p-[15px]">
                {filteredMatchesBySelectedCategory.filter((m) => m.status === matchTabFilter).length === 0 ? (
                  <div className="empty-msg text-center p-[30px] text-gray-400 font-semibold">
                    No {matchTabFilter} Matches Found
                  </div>
                ) : (
                  filteredMatchesBySelectedCategory
                    .filter((m) => m.status === matchTabFilter)
                    .map((m) => (
                      <MatchCard
                        key={m.dbKey}
                        match={m}
                        categories={categories}
                        userJoined={userJoinedMatches.includes(m.dbKey)}
                        type={matchTabFilter === "Finished" ? "result" : "play"}
                        onJoin={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("join-match");
                        }}
                        onCheckRoom={handleCheckRoomDetails}
                        onOpenPrize={handleOpenPrizeDetails}
                        onOpenDetails={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("match-details");
                        }}
                        onOpenResult={(item) => {
                          setSelectedMatch(item);
                          setActiveSubPage("result-details");
                        }}
                      />
                    ))
                )}
              </div>
            </section>
          )}
        </div>
      )}

      {/* --- BOTTOM TAB BAR NAVIGATION --- */}
      {!activeSubPage && (
        <div className="tab-bar">
          <div
            className={`tab-item ${activeTab === "shop" ? "active" : ""}`}
            onClick={() => setActiveTab("shop")}
          >
            <div className="tab-icon-box">
              <img
                src="https://img.icons8.com/?size=100&id=x5pyLTwajYMT&format=png&color=000000"
                alt="Shop"
              />
            </div>
            <span>Shop</span>
          </div>
          <div
            className={`tab-item ${activeTab === "home" ? "active" : ""}`}
            onClick={() => {
              setSelectedCategoryId(null);
              setActiveTab("home");
            }}
          >
            <div className="tab-icon-box">
              <img
                src="https://img.icons8.com/?size=100&id=cdTzm4ndoVu4&format=png&color=000000"
                alt="Play"
              />
            </div>
            <span>Play</span>
          </div>
          <div
            className={`tab-item ${activeTab === "mymatches" ? "active" : ""}`}
            onClick={() => setActiveTab("mymatches")}
          >
            <div className="tab-icon-box">
              <img
                src="https://img.icons8.com/?size=100&id=qbPAZjbNRPIS&format=png&color=000000"
                alt="Matches"
              />
            </div>
            <span>Matches</span>
          </div>
          <div
            className={`tab-item ${activeTab === "result" ? "active" : ""}`}
            onClick={() => setActiveTab("result")}
          >
            <div className="tab-icon-box">
              <img
                src="https://img.icons8.com/?size=100&id=MyHVj8kpSfdv&format=png&color=000000"
                alt="Result"
              />
            </div>
            <span>Result</span>
          </div>
          <div
            className={`tab-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <div className="tab-icon-box">
              <img
                src="https://img.icons8.com/?size=100&id=xyyjPRvu3CUP&format=png&color=000000"
                alt="Profile"
              />
            </div>
            <span>Profile</span>
          </div>
        </div>
      )}

      {/* --- DIALOG MODALS SECTION --- */}

      {/* STARTUP WELCOME POPUP */}
      <div className={`modal ${startupModalOpen ? "active" : ""}`}>
        <div className="startup-modal-box">
          <div className="sm-header font-[900] text-[18px] mb-[10px] text-gray-900 text-left">
            আসসালামু আলাইকুম 😍
          </div>
          <div
            id="startup-popup-content"
            className="startup-content text-left text-gray-800"
            dangerouslySetInnerHTML={{
              __html: (appSettings?.popup_text || "Loading...").replace(/\n/g, "<br>"),
            }}
          ></div>
          <button className="startup-btn" onClick={() => setStartupModalOpen(false)}>
            Okay
          </button>
        </div>
      </div>

      {/* MATCH PRIZE DETAILS MODAL */}
      <div className={`modal ${prizeModalOpen ? "active" : ""}`}>
        <div className="modal-box relative overflow-visible">
          <div>
            <div className="popup-close-btn" onClick={() => setPrizeModalOpen(false)}>
              X
            </div>
          </div>
          <div className="popup-header-yellow">
            <div className="popup-title">TOTAL WINPRIZE</div>
            <div className="popup-subtitle" id="prize-modal-subtitle">
              {focusedMatch?.title || "Match Name"}
            </div>
          </div>
          <div className="popup-content text-left" id="prize-list-content">
            {focusedMatch?.prize_desc ? (
              <div
                className="text-left text-[14px] leading-[1.6]"
                dangerouslySetInnerHTML={{
                  __html: focusedMatch.prize_desc.replace(/\n/g, "<br>"),
                }}
              ></div>
            ) : (
              (() => {
                const total = parseInt(String(focusedMatch?.total_prize || 0), 10);
                const w = Math.floor(total * 0.4);
                const s = Math.floor(total * 0.2);
                const t = Math.floor(total * 0.1);
                return (
                  <>
                    <div className="prize-row">
                      <span className="prize-icon">👑</span> Winner - {w} Taka
                    </div>
                    <div className="prize-row">
                      <span className="prize-icon">🥈</span> 2nd Position - {s} Taka
                    </div>
                    <div className="prize-row">
                      <span className="prize-icon">🥉</span> 3rd Position - {t} Taka
                    </div>
                    <div className="prize-row">
                      <span className="prize-icon">🏅</span> 4th Position - 20 Taka
                    </div>
                    <div className="prize-row">
                      <span className="prize-icon">🏅</span> 5th Position - 10 Taka
                    </div>
                    <div className="prize-row">
                      <span className="prize-icon">🔥</span> Per Kill : Based on Match
                    </div>
                    <div className="prize-row font-bold mt-2 pt-2 border-t border-gray-200">
                      <span className="prize-icon">🏆</span> Total Prize Pool: {total} Taka
                    </div>
                  </>
                );
              })()
            )}
          </div>
        </div>
      </div>

      {/* ROOM ACCESS CODE MODAL */}
      <div className={`modal ${roomModalOpen ? "active" : ""}`}>
        <div className="modal-box relative overflow-visible text-black">
          <div>
            <div className="popup-close-btn" onClick={() => setRoomModalOpen(false)}>
              X
            </div>
          </div>
          <div className="popup-header-yellow">
            <div className="popup-title">ROOM DETAILS</div>
            <div className="popup-subtitle">Match Room Information</div>
          </div>
          <div className="popup-content text-center">
            <div className="mb-[15px]">
              <span className="text-[12px] text-[#888]">Room ID</span>
              <br />
              <span className="text-[24px] font-[900] text-[#333]" id="popup-room-id">
                {focusedMatch?.room_id || "--"}
              </span>
              <button
                className="btn-copy block mx-auto mt-[5px]"
                onClick={() => handleCopyToClipboard(focusedMatch?.room_id || "")}
              >
                COPY
              </button>
            </div>
            <div>
              <span className="text-[12px] text-[#888]">Password</span>
              <br />
              <span className="text-[24px] font-[900] text-[#333]" id="popup-room-pass">
                {focusedMatch?.room_pass || "--"}
              </span>
              <button
                className="btn-copy block mx-auto mt-[5px]"
                onClick={() => handleCopyToClipboard(focusedMatch?.room_pass || "")}
              >
                COPY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JOIN WARNING SCREEN */}
      <div className={`modal ${joinWarningModalOpen ? "active" : ""}`}>
        <div className="modal-box text-center p-[30px] rounded-lg bg-white">
          <i className="fas fa-info-circle warning-popup-icon"></i>
          <h3 className="mb-[10px] text-lg font-bold">ম্যাচে জয়েন করুন</h3>
          <p className="text-[#666] text-[14px] mb-[20px]">আপনি এই ম্যাচে জয়েন করেননি</p>
          <button
            className="warning-popup-btn"
            onClick={() => setJoinWarningModalOpen(false)}
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
}
