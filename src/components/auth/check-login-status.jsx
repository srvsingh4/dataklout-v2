import { useState, useEffect } from "react";

function CheckLoginStatus() {
  const [loginStatus, setLoginStatus] = useState(
    !!localStorage.getItem("access_token")
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, []);

  return { loginStatus };
}

export default CheckLoginStatus;
