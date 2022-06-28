import './App.css';
import NavBar from './components/NavBar';

import React, { Suspense, lazy } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Spinner from './components/UI/Spinner';

// const Main = lazy(() => import('./routes/Main'));
// const Videos = lazy(() => import('./routes/Videos'));
const Audios = lazy(() => import('./routes/Audios'));
const AudioPage = lazy(() => import('./components/audioPage/AudioPage'));

const App = () => (
  <div className="App">
    <BrowserRouter>
      <NavBar authenticated={false}/>
        <Suspense fallback={Spinner}>
          <Switch>
            {/* <Route path="/" element={<Main/>} />
            <Route path="/videos" element={<Videos/>} /> */}
            <Route path="/audios" component={Audios} exact/>
            <Route path="/audios/:id" component={AudioPage} />
          </Switch>
        </Suspense>
  </BrowserRouter>
  </div>
)

export default App;
