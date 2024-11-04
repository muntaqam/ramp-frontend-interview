import { useCallback, useState, useEffect } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [localTransactions, setLocalTransactions] = useState(transactions);

  // Keep local transactions in sync with the prop
  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      try {
        await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
          transactionId,
          value: newValue,
        });

        // Update the local state 
        setLocalTransactions((prevTransactions) => {
          if (!prevTransactions) {
            return [];
          }
          return prevTransactions.map((transaction) =>
            transaction.id === transactionId ? { ...transaction, approved: newValue } : transaction
          );
        });
      } catch (error) {
        console.error("Failed to update transaction approval:", error);

      }
    },
    [fetchWithoutCache]
  );


  if (localTransactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div data-testid="transaction-container">
      {localTransactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  );
};