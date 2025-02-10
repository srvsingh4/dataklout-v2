import Header from "./header";
import Nav from "../nav";
import { ToastContainer } from "react-toastify";

function Callinsight() {
  return (
    <div>
      <Header />
      <Nav />
      <ToastContainer
        position="top-right"
        theme="colored"
        hideProgressBar={false}
      />
      <div className="m-4">
        <div className="border bg-white mr-2 h-full w-full p-6 rounded-[12px]">
          hyhy
        </div>
      </div>
    </div>
  );
}

export default Callinsight;
