import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'; 


import { HelmetProvider } from 'react-helmet-async';
import MetaData from './Components/MetaData';
import Login from './Components/login/LogIn';
import Home from './Components/Home/Home';
import Detailed from './Components/Detailed/Detailed';
import Summary from './Components/Home/Summary';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <HelmetProvider>
      <MetaData title={"Sang Solutions"} />
       <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/Master" element={<Summary/>} />
          <Route path="/MasterDetailed" element={<Detailed/>} />
       </Routes>
       </HelmetProvider>
    </Router>
  )
}

export default App
