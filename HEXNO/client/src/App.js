import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import CrowdFunding from './components/pages/CrowdFunding';
import {
  Routes,
  Route,
} from "react-router-dom";
import SharedLayout from './components/pages/SharedLayout';
import Create from './components/pages/create';

import UserDetails from './components/pages/test';

function App() {
  return (
    <div className="container">
        <Routes>
          {/* <Route path="/" element={<UserDetails/>}></Route> */}
          <Route path="/" element={<Home />}/>
          <Route element={<SharedLayout/>}>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/crowdfunding" element={<CrowdFunding/>}/>
            <Route path="/create" element={<Create/>}/>
          </Route>
        </Routes>
    </div>
  );
}

export default App;