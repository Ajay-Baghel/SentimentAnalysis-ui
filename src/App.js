import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Home />
      <Routes>
        <Route path='/' exact />
      </Routes>
    </Router>
  );
}

export default App;
