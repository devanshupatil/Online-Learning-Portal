import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LearnersPage from './components/Leraners/LearnersPage'
import TeachersPage from './components/Teacher/TeachersPage'
import ParentsPage from './components/Parents/ParentsPage'
import AuthPage from './components/Auth/AuthPage'
import TestTaking from './components/Leraners/TestTaking'
import { Toaster } from 'sonner';
import { SidebarProvider } from './components/SidebarProvider';

function App() {


  return (
    <>
    <Toaster position="top-right" richColors/>
      <SidebarProvider>
        <Router>
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/learners" element={<LearnersPage />} />
            <Route path="/test-taking" element={<TestTaking />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/parents" element={<ParentsPage />} />

          </Routes>
        </Router>
      </SidebarProvider>
    </>
  )
}
 
export default App
