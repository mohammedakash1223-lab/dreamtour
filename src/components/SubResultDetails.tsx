import { Match, MatchParticipant } from "../types";

interface SubResultDetailsProps {
  match: Match | null;
  participants: MatchParticipant[];
  onBack: () => void;
}

export default function SubResultDetails({ match, participants, onBack }: SubResultDetailsProps) {
  if (!match) return null;

  // Clone and sort participants by win descending
  const sortedParticipants = [...participants].sort((a, b) => (b.win ?? 0) - (a.win ?? 0));
  const winners = sortedParticipants.filter((p) => (p.win ?? 0) > 0);

  return (
    <div id="result-details-view" className="app-section active pb-[40px] text-black">
      <div className="back-nav dark-mode" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Results
      </div>

      <div id="rd-container">
        <div className="rd-card">
          <div className="rd-title-box">
            <div className="rd-main-title">{match.title} | Mobile |</div>
            <div className="rd-sub-title">Organized On {match.time}</div>
          </div>
          <div className="rd-stats-row">
            <div className="rd-stat-item">
              <div>WIN PRIZE</div>
              <div>৳ {match.total_prize}</div>
            </div>
            <div className="rd-stat-item">
              <div>PER KILL</div>
              <div>৳ {match.per_kill}</div>
            </div>
            <div className="rd-stat-item">
              <div>ENTRY FEE</div>
              <div>৳ {match.entry}</div>
            </div>
          </div>

          <div className="rd-header-blue">WINNER WINNER CHICKEN DINNER</div>
          <div className="rd-table-head">
            <div className="col-hash">#</div>
            <div className="col-name text-left pl-[10px]">Player Name</div>
            <div className="col-kill">Kills</div>
            <div className="col-win">Winning</div>
          </div>
          {winners.length === 0 ? (
            <div style={{ padding: "10px", textAlign: "center", color: "#777" }}>
              No winners declared yet
            </div>
          ) : (
            winners.map((p, idx) => (
              <div key={idx} className="rd-row">
                <div className="col-hash">{idx + 1}</div>
                <div className="col-name text-left pl-[10px]">{p.ign || "Unknown"}</div>
                <div className="col-kill">{p.kills || 0}</div>
                <div className="col-win">৳ {p.win || 0}</div>
              </div>
            ))
          )}

          <div className="rd-header-blue" style={{ marginTop: "10px" }}>
            FULL RESULT
          </div>
          <div className="rd-table-head">
            <div className="col-hash">#</div>
            <div className="col-name text-left pl-[10px]">Player Name</div>
            <div className="col-kill">Kills</div>
            <div className="col-win">Winning</div>
          </div>
          {sortedParticipants.length === 0 ? (
            <div style={{ padding: "10px", textAlign: "center", color: "#777" }}>
              No participants
            </div>
          ) : (
            sortedParticipants.map((p, idx) => (
              <div key={idx} className="rd-row">
                <div className="col-hash">{idx + 1}</div>
                <div className="col-name text-left pl-[10px]">{p.ign || "Unknown"}</div>
                <div className="col-kill">{p.kills || 0}</div>
                <div className="col-win">৳ {p.win || 0}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
