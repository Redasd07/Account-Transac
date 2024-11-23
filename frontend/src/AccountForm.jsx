import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_ACCOUNT, GET_ACCOUNTS } from "./queries";

const AccountForm = () => {
  const [form, setForm] = useState({ solde: "", dateCreation: "", type: "" });
  const [addAccount, { error }] = useMutation(ADD_ACCOUNT, {
    refetchQueries: [{ query: GET_ACCOUNTS }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAccount({
        variables: {
          solde: parseFloat(form.solde),
          dateCreation: form.dateCreation,
          type: form.type,
        },
      });
      setForm({ solde: "", dateCreation: "", type: "" });
    } catch (err) {
      console.error("Error adding account:", err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-primary">Add Account</h2>
      <div>
        <label className="block text-gray-600 font-medium">Solde</label>
        <input
          type="number"
          placeholder="Solde"
          value={form.solde}
          onChange={(e) => setForm({ ...form, solde: e.target.value })}
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-primary focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium">Date de création</label>
        <input
          type="date"
          value={form.dateCreation}
          onChange={(e) => setForm({ ...form, dateCreation: e.target.value })}
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-primary focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium">Type de compte</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-primary focus:ring-2"
        >
          <option value="">Select Type</option>
          <option value="COURANT">Courant</option>
          <option value="EPARGNE">Epargne</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Account
      </button>
      {error && (
        <p className="text-red-500 mt-2">Error: {error.message}</p>
      )}
    </form>
  );
};

export default AccountForm;
