import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LearnersPage from './components/Leraners/LearnersPage'
import TeachersPage from './components/TeachersPage'
import ParentsPage from './components/ParentsPage'

function App() {
  

  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/learners" element={<LearnersPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/parents" element={<ParentsPage />} />
      </Routes>
    </Router>
  )
}
 
export default App
