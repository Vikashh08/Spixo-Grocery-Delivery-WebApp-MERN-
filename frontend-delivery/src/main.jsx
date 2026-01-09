// src/main.jsx (in the frontend-delivery folder)
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' 
import { BrowserRouter } from 'react-router-dom' // 1. Import this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Wrap your App here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
)