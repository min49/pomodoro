import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';

function Login({isAuthenticated, authenticate}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (e) => {
    authenticate(username, password);
    e.preventDefault();
  };

  return (
    <div>
      {
        isAuthenticated
          ? <Redirect to='/'/>
          : (<form>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={e => setUsername(e.target.value)} value={username}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password}/>
            <button onClick={login}>Log in</button>
          </form>)
      }
    </div>
  )
}

export default Login;