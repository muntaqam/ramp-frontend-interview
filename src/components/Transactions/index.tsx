import { useState, useEffect, useCallback } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalParams } from "src/utils/types";
import { TransactionsComponent, SetTransactionApprovalFunction } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [approvedStatusMap, setApprovedStatusMap] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      console.log(`setTransactionApproval called with transactionId=${transactionId}, newValue=${newValue}`);


      setApprovedStatusMap((prevStatusMap) => ({
        ...prevStatusMap,
        [transactionId]: newValue,
      }));

      try {
        // Send update to the backend
        console.log("Sending backend update request...");
        await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
          transactionId,
          value: newValue,
        });
        console.log("Backend update succeeded for transactionId:", transactionId);
      } catch (error) {
        console.error("Failed to update transaction approval:", error);
        // Rollback 
        setApprovedStatusMap((prevStatusMap) => ({
          ...prevStatusMap,
          [transactionId]: !newValue,
        }));
      }
    },
    [fetchWithoutCache]
  );

  return (
    <div data-testid="transaction-container">
      {(localTransactions ?? []).map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={{
            ...transaction,
            approved: approvedStatusMap[transaction.id] ?? transaction.approved,
          }}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  );
};
