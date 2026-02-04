import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [health, setHealth] = useState(null)
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [calcA, setCalcA] = useState(10)
  const [calcB, setCalcB] = useState(5)
  const [calcResult, setCalcResult] = useState(null)
  const [randomResult, setRandomResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState('')

  useEffect(() => {
    checkHealth()
    fetchTodos()
  }, [])

  // Health Check
  const checkHealth = async () => {
    setLoading('health')
    try {
      const res = await fetch(`${API_URL}/api/health`)
      const data = await res.json()
      setHealth(data)
      setError(null)
    } catch (err) {
      setHealth(null)
      setError('Backend not reachable')
    }
    setLoading('')
  }

  // Todo Operations
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`)
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error('Failed to fetch todos')
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    setLoading('addTodo')
    try {
      await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      })
      setNewTodo('')
      fetchTodos()
    } catch (err) {
      setError('Failed to add todo')
    }
    setLoading('')
  }

  const toggleTodo = async (id) => {
    setLoading(`toggle-${id}`)
    try {
      await fetch(`${API_URL}/api/todos/${id}/toggle`, { method: 'PUT' })
      fetchTodos()
    } catch (err) {
      setError('Failed to toggle todo')
    }
    setLoading('')
  }

  const deleteTodo = async (id) => {
    setLoading(`delete-${id}`)
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' })
      fetchTodos()
    } catch (err) {
      setError('Failed to delete todo')
    }
    setLoading('')
  }

  // Calculator
  const calculate = async (operation) => {
    setLoading(`calc-${operation}`)
    try {
      const res = await fetch(`${API_URL}/api/calculate?a=${calcA}&b=${calcB}&operation=${operation}`)
      const data = await res.json()
      setCalcResult(data)
      setError(null)
    } catch (err) {
      setError('Calculation failed')
    }
    setLoading('')
  }

  // Random Number
  const getRandomNumber = async () => {
    setLoading('random')
    try {
      const res = await fetch(`${API_URL}/api/random?min=1&max=100`)
      const data = await res.json()
      setRandomResult(data)
    } catch (err) {
      setError('Failed to get random number')
    }
    setLoading('')
  }

  return (
    <div className="app">
      <h1>Frontend-Backend Test App</h1>
      <p className="api-url">API: <code>{API_URL}</code></p>

      {error && <div className="error">{error}</div>}

      {/* Health Check */}
      <div className="section">
        <h2>1. Health Check</h2>
        <button onClick={checkHealth} disabled={loading === 'health'}>
          {loading === 'health' ? 'Checking...' : 'Check Health'}
        </button>
        {health && (
          <div className="result success">
            Status: {health.Status} | {health.Message}
          </div>
        )}
      </div>

      {/* Calculator */}
      <div className="section">
        <h2>2. Calculator</h2>
        <div className="calc-inputs">
          <input type="number" value={calcA} onChange={(e) => setCalcA(Number(e.target.value))} />
          <span>and</span>
          <input type="number" value={calcB} onChange={(e) => setCalcB(Number(e.target.value))} />
        </div>
        <div className="calc-buttons">
          <button onClick={() => calculate('add')} disabled={loading.startsWith('calc')}>+ Add</button>
          <button onClick={() => calculate('subtract')} disabled={loading.startsWith('calc')}>- Subtract</button>
          <button onClick={() => calculate('multiply')} disabled={loading.startsWith('calc')}>× Multiply</button>
          <button onClick={() => calculate('divide')} disabled={loading.startsWith('calc')}>÷ Divide</button>
        </div>
        {calcResult && (
          <div className="result">
            {calcResult.A} {calcResult.Operation} {calcResult.B} = <strong>{calcResult.Result}</strong>
          </div>
        )}
      </div>

      {/* Todo List */}
      <div className="section">
        <h2>3. Todo List</h2>
        <div className="todo-input">
          <input
            type="text"
            placeholder="Enter new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo} disabled={loading === 'addTodo'}>
            {loading === 'addTodo' ? 'Adding...' : 'Add'}
          </button>
        </div>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.isCompleted ? 'completed' : ''}>
              <span onClick={() => toggleTodo(todo.id)} style={{cursor: 'pointer'}}>
                {todo.isCompleted ? '✅' : '⬜'} {todo.title}
              </span>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Random Number */}
      <div className="section">
        <h2>4. Random Number Generator</h2>
        <button onClick={getRandomNumber} disabled={loading === 'random'}>
          {loading === 'random' ? 'Generating...' : 'Get Random Number (1-100)'}
        </button>
        {randomResult && (
          <div className="result">
            Random Number: <strong>{randomResult.RandomNumber}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
