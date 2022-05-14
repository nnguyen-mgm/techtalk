import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Event from './pages/Event';
import CreatedEvents from './pages/CreatedEvents';
import { TechTalkServiceProvider } from './hooks/useTechTalkService';

ReactDOM.render(
  <React.StrictMode>
    <TechTalkServiceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/event/:eventId" element={<Event />} />
            <Route path="/created-events" element={<CreatedEvents />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </TechTalkServiceProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
