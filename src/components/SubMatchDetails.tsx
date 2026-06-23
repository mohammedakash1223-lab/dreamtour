import { useState, useEffect } from "react";
import { Match, MatchParticipant } from "../types";

interface SubMatchDetailsProps {
  match: Match | null;
  participants: MatchParticipant[];
  onBack: () => void;
}

export default function SubMatchDetails({ match, participants, onBack }: SubMatchDetailsProps) {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
    if (!match) return;
    const updateTimer = () => {
      const matchTime = parseInt(String(match.timestamp), 10);
      if (isNaN(matchTime)) {
        setTimeLeft("Starts In: --");
        return;
      }
      const now = new Date().getTime();
      const diff = matchTime - now;

      if (diff < 0) {
        setTimeLeft("Match Started");
      } else {
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`Starts In: ${h}h:${m}m:${s}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [match]);

  if (!match) return null;

  return (
    <div id="match-details-view" className="app-section active pb-[40px] text-black">
      <div className="back-nav" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Match Details
      </div>

      <div className="md-info-card text-black">
        <div className="md-title" id="md-title">
          {match.title}
        </div>
        <div className="md-time" id="md-time">
          Starts In: {match.time}
        </div>
        <div
          id="md-timer"
          className="mc-footer-timer match-countdown mt-[10px] rounded-[5px]"
        >
          <i className="far fa-clock"></i> {timeLeft}
        </div>
      </div>

      <div className="md-table-container text-black">
        <div className="md-table-header">
          <span>Participants</span>
          <span id="md-count">
            {participants.length}/{match.total || 48}
          </span>
        </div>
        <div id="md-p-list">
          {participants.length === 0 ? (
            <div className="text-center p-[20px] text-gray-500">
              No participants joined yet.
            </div>
          ) : (
            participants.map((p, idx) => (
              <div key={idx} className="md-p-row">
                <div style={{ width: "10%" }}>{idx + 1}</div>
                <div style={{ width: "50%", textAlign: "left" }}>{p.ign || "Unknown"}</div>
                <div style={{ width: "20%", textAlign: "center" }}>{p.kills || 0}</div>
                <div style={{ width: "20%", textAlign: "right" }}>{p.win || 0}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
