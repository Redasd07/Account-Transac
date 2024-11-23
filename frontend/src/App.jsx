import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountList from "./AccountList";
import AccountPage from "./AccountPage";
import TransactionManager from "./TransactionManager";

const App = () => {
  return (
    <div className="App bg-background min-h-screen">

      <main className="p-6">
        <Router>
          <Routes>
            <Route path="/" element={<AccountList />} />
            <Route path="/account/:accountId" element={<AccountPage />} />
            <Route path="/transactions/:accountId" element={<TransactionManager />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;
