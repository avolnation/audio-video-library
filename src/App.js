import './App.css';
import 'antd/dist/antd.css';
import NavBar from './components/NavBar';

import { notification } from 'antd'
import React, { Suspense, lazy, useEffect, useState } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Spinner from './components/UI/Spinner';


// const Main = lazy(() => import('./routes/Main'));
// const Videos = lazy(() => import('./routes/Videos'));
const Audios = lazy(() => import('./routes/Audios'));
const AudioPage = lazy(() => import('./components/audioPage/AudioPage'));
const NewAudio = lazy(() => import('./routes/New-Audio'));
const Collection = lazy(() => import('./components/Collection/Collection'))

const App = () => {

  const [authenticated, setAuthenticated] = useState(false)

  const [ modal, setModal ] = useState('')

  const notif = (type, title, message) => {
    notification[type](
      {
        message: title,
        description: message,
        placement: 'bottomRight'
      }
    )
  }

  //* Cookies from String to Object as presented --> { name: value }
  const getCookie = (cookieName) => {
    const cookie = {}
    document.cookie.split(';').forEach(el=> {
    let [key, value] = el.split('=')
    cookie[key.trim()] = value;    
    })
    console.log(cookie)
  return cookie[cookieName]
  }

  useEffect(() => {
    if(document.cookie){
      console.log(document.cookie)
      const tokenCookie = getCookie('token')
      const body = JSON.stringify({token: tokenCookie})
      console.log(tokenCookie)
      if(tokenCookie !== undefined){
        fetch('http://localhost:3002/auth/login-by-token', 
        {method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: body
        })
        .then(result => {
          console.log(result)
          if(result.ok){
            setAuthenticated(true)
          } 
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  }, [])

  const logout = () => {
    document.cookie = `token=${getCookie('token')}; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    notif('success', 'Logged out', 'Sucesfully logged out. Page will reload in 2 seconds...')
    setTimeout(() => window.location.reload(), 2000)
  }


  return (
  <div className="App">
  <BrowserRouter>
    <NavBar authenticated={authenticated} notification={notif} logout={logout}/>
      <Suspense fallback={Spinner}>
        <Switch>
          {/* <Route path="/" element={<Main/>} />
          <Route path="/videos" element={<Videos/>} /> */}
          <Route path="/audios" render={(props) => <Audios {...props} setModal={setModal} modal={modal} notification={notif}/>} exact/>
          <Route path="/audios/new-audio" render={(props) => <NewAudio notification={notif}/>} exact/>
          <Route path="/audios/:id" component={AudioPage}/>
          <Route path="/collection" component={(props) => <Collection getCookie={getCookie} setModal={setModal} modal={modal}/>}/>
        </Switch>
      </Suspense>
</BrowserRouter>
</div>)
}

export default App;
