import Nav from "../nav";
import Header from "./header";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Account({ loginStatus }) {
  const navigate = useNavigate();
  Account.propTypes = {
    loginStatus: PropTypes.bool.isRequired,
  };
  console.log("account", loginStatus);

  useEffect(() => {
    if (!loginStatus) {
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <Header />
      <Nav />
      <h1>Account</h1>
    </div>
  );
}

export default Account;
