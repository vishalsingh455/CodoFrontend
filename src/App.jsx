import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import CodeEditor from './components/CodeEditor'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import SolveProblem from "./pages/SolveProblem";
import JoinCompetition from './pages/JoinCompetition'
import OrganizerDashboard from './pages/OrganizerDashboard'
import CreateCompetition from './pages/CreateCompetition'
import AddProblem from './pages/AddProblem'
import CompetitionDetails from './pages/CompetitionDetails'
import Leaderboard from './pages/Leaderboard'
import UserDashboard from './pages/UserDashboard'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './context/AuthContext'
import AddTestCase from './pages/AddTestCase'
import Analytics from './pages/Analytics'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}
          />
          <Route
            path="/join"
            element={<ProtectedRoute><JoinCompetition /></ProtectedRoute>}
          />
          <Route
            path="/competitions/:competitionId"
            element={<ProtectedRoute><CompetitionDetails /></ProtectedRoute>}
          />
          <Route
            path="/competitions/:competitionId/leaderboard"
            element={<ProtectedRoute><Leaderboard /></ProtectedRoute>}
          />
          <Route
            path="/problems/:problemId"
            element={<ProtectedRoute><SolveProblem /></ProtectedRoute>}
          />
          <Route
            path="/organizer"
            element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/organizer/create"
            element={<ProtectedRoute><CreateCompetition /></ProtectedRoute>}
          />
          <Route
            path="/organizer/competitions/:competitionId/add-problem"
            element={<ProtectedRoute><AddProblem /></ProtectedRoute>}
          />
          <Route
            path="/organizer/competitions/:competitionId/add-testcase"
            element={<ProtectedRoute><AddTestCase /></ProtectedRoute>}
          />
          <Route
            path="/organizer/competitions/:competitionId/analytics"
            element={<ProtectedRoute><Analytics /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

