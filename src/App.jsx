import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckLoginStatus from "./components/auth/check-login-status";
import Login from "./components/auth/login";
import Home from "./home";

function App() {
  const { loginStatus } = CheckLoginStatus();
  console.log(loginStatus);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
