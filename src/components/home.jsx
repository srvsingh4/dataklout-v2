import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Nav from "../nav";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <Nav />
      <div className=" m-4 flex flex-row pb-2">
        <div className=" h-32 border bg-white w-1/2 mr-2"></div>
        <div className=" h-32 border bg-white w-1/2"></div>
      </div>
    </div>
  );
}

export default Home;
