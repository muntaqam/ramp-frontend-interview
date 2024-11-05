import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval,
}) => {
  console.log("Rendering TransactionPane for transaction:", transaction);

  const handleCheckboxChange = async (newValue: boolean) => {
    console.log(`Checkbox changed for transactionId=${transaction.id}, newValue=${newValue}`);

    await setTransactionApproval({
      transactionId: transaction.id,
      newValue,
    });

    console.log(`Transaction approval updated for transactionId=${transaction.id}`);
  };

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant}</p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={transaction.approved}
        disabled={loading}
        onChange={handleCheckboxChange}
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
