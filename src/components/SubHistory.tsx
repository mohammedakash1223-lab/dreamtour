import { Transaction } from "../types";

interface SubHistoryProps {
  transactions: Transaction[];
  onBack: () => void;
}

export default function SubHistory({ transactions, onBack }: SubHistoryProps) {
  return (
    <div id="history-view" className="app-section active text-black min-h-screen">
      <div className="back-nav" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Transactions
      </div>
      <div id="history-list" className="bg-[#f9f9f9] min-h-screen pb-[60px]">
        {transactions.length === 0 ? (
          <div className="empty-msg text-center p-[30px] text-gray-400 font-semibold">
            No Transactions
          </div>
        ) : (
          transactions.map((t, idx) => {
            const isDeposit =
              t.type?.toLowerCase().includes("deposit") ||
              t.type?.toLowerCase().includes("win");

            return (
              <div
                key={idx}
                className="history-card"
                style={{
                  borderLeft: `5px solid ${isDeposit ? "green" : "red"}`,
                }}
              >
                <div className="hc-left">
                  <div className="hc-title">{t.type || "Transaction"}</div>
                  <div className="hc-date">{t.date}</div>
                  <div className="hc-amount">
                    Won Amount : {t.type?.toLowerCase().includes("win") ? t.amount : 0}
                  </div>
                </div>
                <div className="hc-right">
                  <div className="hc-tag">
                    {t.txID ? `#${t.txID.substring(0, 4)}` : "#TRX"}
                  </div>
                  <div className="text-[10px] text-[#888]">{t.status || "Success"}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
