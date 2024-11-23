import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ACCOUNT_BY_ID,
  ADD_TRANSACTION,
  GET_TRANSACTIONS_BY_ACCOUNT,
} from "./queries";
import { useParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/solid";

const AccountPage = () => {
  const { accountId } = useParams();
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("DEPOT");

  const { data, loading, error } = useQuery(GET_ACCOUNT_BY_ID, {
    variables: { id: accountId },
  });

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_TRANSACTIONS_BY_ACCOUNT, variables: { accountId } },
      { query: GET_ACCOUNT_BY_ID, variables: { id: accountId } },
    ],
  });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    addTransaction({
      variables: {
        compteId: parseInt(accountId),
        montant: parseFloat(amount),
        dateTransaction: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        typeTransaction: transactionType,
      },
    }).then(() => {
      setAmount("");
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const account = data?.compteById;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-primary mb-4">Account Details</h2>

      {/* Account Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Account Information
        </h3>
        <p className="text-gray-600">
          <strong className="text-gray-800">Type:</strong> {account.type}
        </p>
        <p className="text-gray-600">
          <strong className="text-gray-800">Balance:</strong>{" "}
          {account.solde.toFixed(2)} €
        </p>
        <p className="text-gray-600">
          <strong className="text-gray-800">Creation Date:</strong>{" "}
          {account.dateCreation}
        </p>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-primary mb-4">
          Add Transaction
        </h3>
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium">Amount (€)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-primary focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-primary focus:ring-2"
            >
              <option value="DEPOT">Deposit</option>
              <option value="RETRAIT">Withdrawal</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <TransactionTable accountId={accountId} />
    </div>
  );
};

const TransactionTable = ({ accountId }) => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS_BY_ACCOUNT, {
    variables: { accountId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold text-primary mb-4">
        Transaction History
      </h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4 text-gray-600">Type</th>
            <th className="border-b p-4 text-gray-600">Amount (€)</th>
            <th className="border-b p-4 text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.compteTransaction.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-100">
              <td className="p-4 text-gray-800">{transaction.typeTransaction}</td>
              <td className="p-4 text-gray-800">{transaction.montant.toFixed(2)}</td>
              <td className="p-4 text-gray-800">{transaction.dateTransaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountPage;
