import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import NewsFeed from "./components/NewsFeed";
import SelectInterests from "./components/SelectInterests";
import NavBar from "./components/NavBar"; // Import NavBar

const App = () => {
  const isLoggedIn = !!localStorage.getItem("token"); // Check if token exists

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login and Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-interests" element={<SelectInterests />} />
        
        {/* News Feed - Accessible only if logged in */}
        {isLoggedIn ? (
          <>
            {/* NavBar and Protected Route */}
            <Route
              path="/news"
              element={
                <>
                  <NavBar />
                  <NewsFeed />
                </>
              }
            />
          </>
        ) : (
          <Route path="/news" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
