import React from 'react'
import ReactDOM from 'react-dom/client'
import AppMain from './bridge/AppMain'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppMain />
  </React.StrictMode>,
)
