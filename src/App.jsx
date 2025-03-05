import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CheckLoginStatus from "./components/auth/check-login-status";
import Login from "./components/auth/login";
import Home from "./components/home";
import Account from "./components/account";
import CallList from "./components/call-list";
import Callinsight from "./components/call-insight";
import Footer from "./components/footer";
import { useState, useEffect } from "react";

function App() {
  const { loginStatus } = CheckLoginStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (!loginStatus && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [loginStatus, location.pathname, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App bg-[#eef2f5]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/account"
          element={loginStatus ? <Account loginStatus={loginStatus} /> : null}
        />
        <Route
          path="/call-list"
          element={loginStatus ? <CallList loginStatus={loginStatus} /> : null}
        />
        <Route
          path="/call/:callID/call-insight"
          element={
            loginStatus ? <Callinsight loginStatus={loginStatus} /> : null
          }
        />
      </Routes>
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
