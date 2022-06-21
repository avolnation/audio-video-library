import './App.css';
import NavBar from './components/NavBar';

import React, { Suspense, lazy } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

// const Main = lazy(() => import('./routes/Main'));
// const Videos = lazy(() => import('./routes/Videos'));
const Audios = lazy(() => import('./routes/Audios'));

const App = () => (
  <div className="App">
  <NavBar authenticated={false}/>
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* <Route path="/" element={<Main/>} />
        <Route path="/videos" element={<Videos/>} /> */}
        <Route path="/audios" element={<Audios/>} />
      </Routes>
    </Suspense>
  </Router>
  </div>
)

export default App;
