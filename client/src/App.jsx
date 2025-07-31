import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Signup1 from './pages/signup1.jsx'
import Signup2 from './pages/signup2.jsx'
import Signin from './pages/signin.jsx'
import Dashboard from './pages/dashboard.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
function App() {
  return (
   <Routes>
      <Route path="/" element={<Signup1 />} />
      <Route path="/signup1" element={<Signup1 />} />
      <Route path="/signup2" element={<Signup2 />} />
      <Route path="/signin" element={<Signin />} />

      {/* Private route for dashboard */}
      <Route>
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      </Route>
    </Routes>
  )
}

export default App
