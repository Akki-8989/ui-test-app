import { useState, useEffect } from 'react'
import './App.css'

// Backend API URL from environment variable (set at build time)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [greeting, setGreeting] = useState(null)
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [name, setName] = useState('')

  // Check backend health on load
  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`)
      const data = await response.json()
      setHealth(data)
      setError(null)
    } catch (err) {
      setHealth(null)
      setError('Backend not reachable: ' + err.message)
    }
  }

  const fetchGreeting = async () => {
    setLoading(true)
    try {
      const url = name
        ? `${API_URL}/api/greeting?name=${encodeURIComponent(name)}`
        : `${API_URL}/api/greeting`
      const response = await fetch(url)
      const data = await response.json()
      setGreeting(data)
      setError(null)
    } catch (err) {
      setGreeting(null)
      setError('Failed to fetch greeting: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <h1>Frontend-Backend Connection Test</h1>

      <div className="config-info">
        <p><strong>Backend API URL:</strong> {API_URL}</p>
      </div>

      <div className="section">
        <h2>Backend Health</h2>
        {health ? (
          <div className="success">
            <p>Status: {health.Status}</p>
            <p>Message: {health.Message}</p>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <p>Checking...</p>
        )}
        <button onClick={checkHealth}>Refresh Health</button>
      </div>

      <div className="section">
        <h2>Greeting API</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={fetchGreeting} disabled={loading}>
          {loading ? 'Loading...' : 'Get Greeting'}
        </button>
        {greeting && (
          <div className="success">
            <p>{greeting.Greeting}</p>
            <p><small>Time: {greeting.Timestamp}</small></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
