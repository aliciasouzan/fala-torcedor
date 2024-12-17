import { Link } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div>
    <header>
      <h1>Fala Torcedor</h1>
      </header>

    <button>
      <Link to ="/times">Times</Link>
      </button>
    <button>
    <Link to ="/torcedores">Torcedores</Link>
      </button>
    </div>
  )
}

export default App
