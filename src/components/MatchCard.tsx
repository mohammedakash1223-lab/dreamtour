import { useEffect, useState } from "react";
import { Match, Category } from "../types";

interface MatchCardProps {
  key?: string | number;
  match: Match;
  categories: Record<string, Category>;
  userJoined: boolean;
  type: "play" | "joined" | "result";
  onJoin: (match: Match) => void;
  onCheckRoom: (match: Match) => void;
  onOpenPrize: (match: Match) => void;
  onOpenDetails: (match: Match) => void;
  onOpenResult: (match: Match) => void;
}

export default function MatchCard({
  match,
  categories,
  userJoined,
  type,
  onJoin,
  onCheckRoom,
  onOpenPrize,
  onOpenDetails,
  onOpenResult,
}: MatchCardProps) {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
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
  }, [match.timestamp]);

  const joinedCount = match.joined || 0;
  const totalCount = match.total || 48;
  const perc = Math.min((joinedCount / totalCount) * 100, 100);
  const catImg = categories[match.categoryId]?.img || "";

  return (
    <div
      className="match-card"
      onClick={() => {
        if (type === "result") {
          onOpenResult(match);
        } else {
          onOpenDetails(match);
        }
      }}
    >
      <div className="mc-header">
        <img src={catImg} className="mc-thumb" alt="Category" />
        <div className="mc-header-info">
          <div className="mc-title-row text-left">{match.title} | Mobile | Regular</div>
          <div className="mc-date-row text-left">{match.time}</div>
        </div>
      </div>

      <div className="mc-stats-grid">
        <div className="mc-stat-box">
          <div className="mc-stat-label">WIN PRIZE</div>
          <div className="mc-stat-value">{match.total_prize} TK</div>
        </div>
        <div className="mc-stat-box">
          <div className="mc-stat-label">ENTRY TYPE</div>
          <div className="mc-stat-value">{match.type}</div>
        </div>
        <div className="mc-stat-box">
          <div className="mc-stat-label">ENTRY FEE</div>
          <div className="mc-stat-value">{match.entry} TK</div>
        </div>
        <div className="mc-stat-box">
          <div className="mc-stat-label">PER KILL</div>
          <div className="mc-stat-value">{match.per_kill} TK</div>
        </div>
        <div className="mc-stat-box">
          <div className="mc-stat-label">MAP</div>
          <div className="mc-stat-value">{match.map}</div>
        </div>
        <div className="mc-stat-box">
          <div className="mc-stat-label">VERSION</div>
          <div className="mc-stat-value">MOBILE</div>
        </div>
      </div>

      {type !== "result" && (
        <div className="mc-join-row" onClick={(e) => e.stopPropagation()}>
          <div className="mc-progress-wrapper">
            <div className="mc-prog-bar">
              <div className="mc-prog-fill" style={{ width: `${perc}%` }}></div>
            </div>
            <div className="mc-spots-info">
              <span>Only {Math.max(0, totalCount - joinedCount)} spots are left</span>
              <span>
                {joinedCount}/{totalCount}
              </span>
            </div>
          </div>
          {userJoined ? (
            <button className="btn-join-main disabled">JOINED</button>
          ) : (
            <button className="btn-join-main" onClick={() => onJoin(match)}>
              Join
            </button>
          )}
        </div>
      )}

      <div className="mc-details-row" onClick={(e) => e.stopPropagation()}>
        <div className="btn-details" onClick={() => onCheckRoom(match)}>
          <i className="fas fa-key"></i> Room Details <i className="fas fa-chevron-down"></i>
        </div>
        {type !== "result" && (
          <div className="btn-details" onClick={() => onOpenPrize(match)}>
            <i className="fas fa-trophy"></i> Prize Details <i className="fas fa-chevron-down"></i>
          </div>
        )}
      </div>

      {type !== "result" && (
        <div className="mc-footer-timer">
          <i className="far fa-clock"></i> {timeLeft}
        </div>
      )}
    </div>
  );
}
