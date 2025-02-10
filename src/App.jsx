import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckLoginStatus from "./components/auth/check-login-status";
import Login from "./components/auth/login";
import Home from "./components/home";
import Account from "./components/account";
import CallList from "./components/call-list";
import Callinsight from "./components/call-insight";

function App() {
  const { loginStatus } = CheckLoginStatus();

  // console.log("forma pp.jsx", loginStatus);
  return (
    <Router>
      <div className="App bg-[#eef2f5]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/account"
            element={<Account loginStatus={loginStatus} />}
          />
          <Route
            path="/call-list"
            element={<CallList loginStatus={loginStatus} />}
          />
          <Route
            path="/call/:callID/call-insight"
            element={<Callinsight loginStatus={loginStatus} />}
          />

          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
