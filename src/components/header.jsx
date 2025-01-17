import logo from "../assets/images/logo-icon-1.png";
import dIcon from "../assets/Icons/question-circle.svg";
import messageIcon from "../assets/Icons/chat-left-text.svg";
import Service from "./webservice/http";

function Header() {
  const services = new Service();
  return (
    <div className=" flex justify-between p-4 border-b-2 border-gray-200 items-center">
      <img src={logo} alt="logo" />
      <input
        type="text"
        placeholder="Search"
        className="border-2 border-gray-200 rounded-lg w-1/2 h-[50px] px-4 bg-[#EEEEEE]"
      />
      <div className="  flex justify-center  items-center mr-6 border-l-2 border-gray-200">
        <span className="mr-7 ml-10">
          <img src={dIcon} alt="disclamir-icon" className=" h-10 w-10" />
        </span>
        <span className=" mr-7">
          <img src={messageIcon} alt="Message icon" className=" h-10 w-10" />
        </span>
        <span>
          <img
            src={services.domain + localStorage.getItem("image")}
            style={{
              width: "40px",
              height: "40px",
              // borderRadius: "50%",
              // marginBottom: "10px",
            }}
            alt="profile pic"
            className=" rounded-full"
          />
        </span>
      </div>
    </div>
  );
}

export default Header;
