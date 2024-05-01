import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, count: action.count }; // Update count
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }; // Increment count
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }; // Decrement count
    case 'SET_MYCOUNT':
      return { ...state, mycount: action.mycount }; // Update count
    case 'MYINCREMENT':
      return { ...state, mycount: state.mycount + 1 }; // Increment count
    case 'MYDECREMENT':
      return { ...state, mycount: state.mycount - 1 }; // Decrement count
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      {/* <Link to="/counter">Counter</Link> */}
      <h1>My Counter Value: {state.mycount}</h1>
      {/* <Link to="/mycounter">My Counter</Link> */}
    </div>
  );
};

const Mycounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchMyCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mycounter');
      dispatch({ type: 'SET_MYCOUNT', mycount: response.data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMyCounter();
  }, [fetchMyCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/increment');
      dispatch({ type: 'MYINCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/mycounter/decrement');
      dispatch({ type: 'MYDECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>My Counter</h2>
      <p>My Count: {state.mycount}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
      {/* <Link to="/">Go to Home</Link> */}
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
      {/* <Link to="/">Go to Home</Link> */}
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, mycount: 0 });

  // Function to fetch counter and my counter values from the server
  const fetchCounters = useCallback(async () => {
    try {
      // Fetch counter value
      const counterResponse = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: counterResponse.data.count });

      // Fetch my counter value
      const myCounterResponse = await axios.get('http://localhost:5000/api/mycounter');
      dispatch({ type: 'SET_MYCOUNT', mycount: myCounterResponse.data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Load counter and my counter values when the application loads
  useEffect(() => {
    fetchCounters();
  }, [fetchCounters]);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">My Counter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<Mycounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;