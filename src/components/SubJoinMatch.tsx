import { useState, useEffect } from "react";
import { Match } from "../types";
import Swal from "sweetalert2";

interface SubJoinMatchProps {
  match: Match | null;
  onBack: () => void;
  onConfirm: (players: string[]) => void;
}

export default function SubJoinMatch({ match, onBack, onConfirm }: SubJoinMatchProps) {
  const [players, setPlayers] = useState<string[]>([""]);

  useEffect(() => {
    if (!match) return;
    const type = match.type.toLowerCase();
    let slots = 1;
    if (type.includes("duo")) slots = 2;
    if (type.includes("squad")) slots = 4;

    setPlayers(Array(slots).fill(""));
  }, [match]);

  const handleInputChange = (idx: number, val: string) => {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleConfirm = () => {
    const emptyCount = players.filter((p) => !p.trim()).length;
    if (emptyCount > 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill all player names!",
      });
      return;
    }
    onConfirm(players);
  };

  if (!match) return null;

  return (
    <div id="join-match-view" className="app-section active pb-[120px] text-black">
      <div className="back-nav" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Match Joining
      </div>

      <div className="join-card text-left text-black">
        <div className="join-match-title" id="join-page-title">
          {match.title}
        </div>
        <div className="join-meta" id="join-page-meta">
          {match.time}
        </div>

        <div className="join-info-row">
          <span>Win Prize: {match.total_prize} TK</span>
          <span>Entry Fee: {match.entry} TK</span>
        </div>

        <div className="join-warning">
          *অবশ্যই এখানে আপনার গেমের এর নামটি দিয়ে জয়েন করবেন।
        </div>

        <div className="join-badge-container">
          <div className="join-badge" id="join-page-type">
            {match.type}
          </div>
        </div>

        <div className="join-inputs" id="join-inputs-container">
          {players.map((p, idx) => (
            <input
              key={idx}
              type="text"
              className="join-input p-name"
              placeholder={`Player ${idx + 1} Name (Game ID)`}
              value={p}
              onChange={(e) => handleInputChange(idx, e.target.value)}
            />
          ))}
        </div>
      </div>

      <button className="join-btn-full" onClick={handleConfirm}>
        Join Now!
      </button>
    </div>
  );
}
