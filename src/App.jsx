import './App.css';
import logo from './logo.svg'
import Overview from './pages/overview/Overview';
import { Route, Routes, NavLink } from "react-router-dom";
import Transfer from './pages/transfer/Transfer';
import TransactionOverview from './pages/transactions-overview/Transaction-Overview';
import Protected from './components/protected/Protected';
import Settings from './pages/settings/Settings';
import Login from './pages/login/Login';
import { useNavigate } from "react-router-dom";
import {isLoggedIn, logout} from './authentication';


function App() {
  const navigate = useNavigate();

  const logoutClicked = () => {
    logout();
    navigate(`/login`);
  }
  return (
    <div className="app">
      <div className="sidenav">
        <header>
          <div className="logo-container">
            <img className="logo" alt="PiggyBank logo" src={logo} />
            <span>PiggyBank</span>
          </div>
        </header>
        <nav>
          <ul>
            <li><NavLink to="/">Overzicht</NavLink></li>
            <li><NavLink to="/transactions">Transacties</NavLink></li>
            <li><NavLink to="/transfer">Overboeken</NavLink></li>
            <li><NavLink to="/settings">Instellingen</NavLink></li>
          </ul>
        </nav>
        <div className="app__logout">
          {isLoggedIn()?<button onClick={logoutClicked}>Uitloggen</button>:<></>}
        </div>
      </div>
      <main>
        <Routes>
          <Route path="/transactions" element={<Protected><TransactionOverview /></Protected>} />
          <Route path="/" element={<Protected><Overview /></Protected>}></Route>
          <Route path="/transfer" element={<Protected><Transfer /></Protected>}></Route>
          <Route path="/settings" element={<Protected><Settings /></Protected>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<div className=""><h1>Pagina niet gevonden.</h1><img src="/images/not-found.gif" alt="not-found" /></div>}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
