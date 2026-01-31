import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function App() {
  return (
    <div className="container py-5">
      <h1 className="text-primary">JobTrackr</h1>
      <p className="lead">Track your applications and schedule follow-ups.</p>
    </div>
  )
}

const root = createRoot(document.getElementById('app'))
root.render(<App />)
