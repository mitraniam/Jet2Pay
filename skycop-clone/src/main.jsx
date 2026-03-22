import React from 'react'
import ReactDOM from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import App from './App.jsx'
import './styles/global.css'
import './i18n/index.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>,
)
