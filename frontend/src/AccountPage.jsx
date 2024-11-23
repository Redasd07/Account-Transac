import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ACCOUNT_BY_ID,
  ADD_TRANSACTION,
  GET_TRANSACTIONS_BY_ACCOUNT,
} from "./queries";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";


const AccountPage = () => {
  const { accountId } = useParams();
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("DEPOT");

  const { data: accountData, loading: accountLoading, error: accountError } = useQuery(GET_ACCOUNT_BY_ID, {
    variables: { id: accountId },
  });

  const { data: transactionsData, loading: transactionsLoading, error: transactionsError } = useQuery(
    GET_TRANSACTIONS_BY_ACCOUNT,
    { variables: { accountId } }
  );

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_TRANSACTIONS_BY_ACCOUNT, variables: { accountId } },
      { query: GET_ACCOUNT_BY_ID, variables: { id: accountId } },
    ],
  });

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");
      await addTransaction({
        variables: {
          compteId: parseInt(accountId),
          montant: parseFloat(amount),
          dateTransaction: formattedDate,
          typeTransaction: transactionType,
        },
      });
      setAmount("");
      Swal.fire("Success!", "Transaction has been added successfully.", "success");
    } catch (err) {
      Swal.fire("Error!", "Failed to add the transaction.", "error");
      console.error("Error adding transaction:", err.message);
    }
  };
  
  

  if (accountLoading || transactionsLoading) return <p>Loading...</p>;
  if (accountError || transactionsError) return <p>Error: {accountError?.message || transactionsError?.message}</p>;

  const account = accountData?.compteById;
  const transactions = transactionsData?.compteTransaction || [];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center" >7di Raz9ak</h1>
      </header>

      {/* Account Details */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Account Details</h2>
        <p className="text-gray-700 mb-2">
          <strong>Type:</strong> {account.type}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Balance:</strong> {account.solde.toFixed(3)}
        </p>
        <p className="text-gray-700">
          <strong>Creation Date:</strong> {account.dateCreation}
        </p>
      </div>

      {/* Add Transaction */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Add Transaction</h2>
        <form onSubmit={handleAddTransaction} className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-gray-600 font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
            >
              <option value="DEPOT">Depot</option>
              <option value="RETRAIT">Retrait</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Transaction History</h2>
        <table className="w-full border-collapse bg-gray-50 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="p-4">Type de transaction</th>
              <th className="p-4">Montant</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-200 transition duration-200">
                <td className="p-4">{transaction.typeTransaction}</td>
                <td className="p-4">{transaction.montant.toFixed(3)}</td>
                <td className="p-4">{transaction.dateTransaction}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No transactions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountPage;
