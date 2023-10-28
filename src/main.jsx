import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Dashboard from './components.jsx';
import Individual_data from './individual_characters.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
        <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/comics/:id" element={<Individual_data/>} />
        </Routes>
    </Router>
)
