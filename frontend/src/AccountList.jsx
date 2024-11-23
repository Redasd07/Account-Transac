import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ACCOUNTS, DELETE_ACCOUNT, ADD_ACCOUNT } from "./queries";
import { TrashIcon, PencilAltIcon, PlusIcon } from "@heroicons/react/outline";
import Swal from "sweetalert2";

const AccountList = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [newAccount, setNewAccount] = useState({
    solde: "",
    dateCreation: "",
    type: "",
  });
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ACCOUNTS);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT, {
    refetchQueries: [{ query: GET_ACCOUNTS }],
  });
  const [addAccount] = useMutation(ADD_ACCOUNT, {
    refetchQueries: [{ query: GET_ACCOUNTS }],
  });

  // Handle Delete Account
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the account and all its associated data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAccount({ variables: { id } });
        Swal.fire("Deleted!", "The account has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete the account.", "error");
        console.error("Error deleting account:", err.message);
      }
    }
  };

  // Handle Add Account
  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = newAccount.dateCreation.replace(/-/g, "/");

      await addAccount({
        variables: {
          solde: parseFloat(newAccount.solde),
          dateCreation: formattedDate,
          type: newAccount.type,
        },
      });
      setNewAccount({ solde: "", dateCreation: "", type: "" });
      Swal.fire("Success!", "Account has been added successfully.", "success");
    } catch (err) {
      Swal.fire("Error!", "Failed to add the account.", "error");
      console.error("Error adding account:", err.message);
    }
  };

  // Navigate to Account Page
  const handleSelectAccount = (account) => {
    navigate(`/account/${account.id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold text-center">7di Raz9ak</h1>
      </header>

      {/* Add Account Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 mx-auto w-3/4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Add Account
        </h2>
        <form
          onSubmit={handleAddAccount}
          className="grid grid-cols-3 gap-4 items-end justify-items-center"
        >
          <div className="w-full">
            <label className="block text-gray-600 font-medium">Account Type</label>
            <select
              value={newAccount.type}
              onChange={(e) =>
                setNewAccount({ ...newAccount, type: e.target.value })
              }
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
            >
              <option value="">Select Type</option>
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Epargne</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-gray-600 font-medium">Balance</label>
            <input
              type="number"
              placeholder="Enter balance"
              value={newAccount.solde}
              onChange={(e) =>
                setNewAccount({ ...newAccount, solde: e.target.value })
              }
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div className="w-full">
            <label className="block text-gray-600 font-medium">Creation Date</label>
            <input
              type="date"
              value={newAccount.dateCreation}
              onChange={(e) =>
                setNewAccount({ ...newAccount, dateCreation: e.target.value })
              }
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md flex items-center justify-center hover:bg-blue-700 transition duration-300"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Account
          </button>
        </form>
      </div>

      {/* Filter and Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Accounts</h2>
          <div>
            <label className="text-gray-600 font-medium mr-2">Filter by Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Epargne</option>
            </select>
          </div>
        </div>

        <table className="w-full border-collapse bg-gray-50 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-4">ID</th>
              <th className="p-4">Type</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Creation Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.allComptes
              ?.filter((account) => (typeFilter ? account.type === typeFilter : true))
              .map((account) => (
                <tr
                  key={account.id}
                  className="hover:bg-gray-200 transition duration-200"
                >
                  <td className="p-4">{account.id}</td>
                  <td className="p-4">{account.type}</td>
                  <td className="p-4">{account.solde.toFixed(2)}</td>
                  <td className="p-4">{account.dateCreation}</td>
                  <td className="p-4 flex items-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-2 rounded-md flex items-center hover:bg-yellow-600 transition duration-300"
                      onClick={() => handleSelectAccount(account)}
                    >
                      <PencilAltIcon className="h-5 w-5 mr-2" />
                      Transactions
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-2 rounded-md flex items-center hover:bg-red-600 transition duration-300"
                      onClick={() => handleDelete(account.id)}
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountList;
