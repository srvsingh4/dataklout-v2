import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./components/header";
function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className=" text-blue-600 text-2xl font-extrabold">
      <Header />
      Home
    </div>
  );
}

export default Home;
