import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/logo-icon-1.png";
import dIcon from "../assets/Icons/question-circle.svg";
import messageIcon from "../assets/Icons/chat-left-text.svg";
import Service from "./webservice/http";
import logoutIcon from "../assets/Icons/logout.svg";
import profile from "../assets/Icons/profile.svg";
import personIcon from "../assets/Icons/person-circle.svg";
import closeIcon from "../assets/Icons/close.svg";
import dataklout from "../assets/Icons/dataklout-logo.svg";
import mailIcon from "../assets/Icons/mailIcon.svg";
import addressIcon from "../assets/Icons/address.svg";
import phoneIcon from "../assets/Icons/phoneIcon.svg";
import serchIcon from "../assets/Icons/search.svg";

function Header() {
  const services = new Service();
  const navigate = useNavigate();
  const [profiledrop, setProfiledrop] = useState(false);
  const [support, setSupport] = useState(false);
  const profileRef = useRef(null);
  let url = window.location.href;
  url = url.replace(/^.*\/\/[^\/]+/, "");

  useEffect(() => {
    if (support) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [support]);

  const logout = () => {
    services
      .post("api/access_control/logout/", {
        refresh_token: localStorage.getItem("refresh_token"),
      })
      .then((res) => {
        // console.log(res);
        localStorage.clear();
        navigate("/login");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfiledrop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <>
      <div
        className=" flex justify-between p-4 border-b-2 border-gray-200 items-center"
        style={{ backgroundColor: "white" }}
      >
        {/* <Link to={"/"}> */}

        <img
          src={logo}
          alt="logo"
          className=" cursor-pointer"
          onClick={() => navigate("/")}
        />
        {/* </Link> */}
        <div className=" w-[640px] relative">
          <input
            type="text"
            placeholder="Search"
            className=" rounded-lg h-[50px] px-[55px] bg-[#EEEEEE] w-full  placeholder:text-[#8B8B8B]"
          />
          <img src={serchIcon} className=" absolute top-3 left-4" />
        </div>
        <div className="flex justify-center  items-center mr-6 border-l-2 border-gray-200">
          <span
            className="mr-7 ml-10 cursor-pointer"
            onClick={() => setSupport(true)}
          >
            <img
              src={dIcon}
              alt="disclamir-icon"
              className={`${support ? "fill-red" : ""} h-10 w-10`}
            />
          </span>
          <span className=" mr-7 cursor-pointer">
            <img src={messageIcon} alt="Message icon" className=" h-10 w-10" />
          </span>
          {localStorage.getItem("client_logo") != "/media/" && (
            <img
              src={services.domain + localStorage.getItem("client_logo")}
              style={{
                width: "60px",
                height: "40px",
                // borderRadius: "50%",
                // marginBottom: "10px",
              }}
              alt="profile pic"
              className=" mr-7"
            />
          )}
          <span
            className=" relative cursor-pointer"
            onClick={() => setProfiledrop(!profiledrop)}
          >
            <img
              src={`${
                localStorage.getItem("image") != "/media/"
                  ? services.domain + localStorage.getItem("image")
                  : personIcon
              } `}
              style={{
                width: "40px",
                height: "40px",
                // borderRadius: "50%",
                // marginBottom: "10px",
              }}
              alt="profile pic"
              className={`rounded-full ${
                profiledrop || url === "/account" ? "border border-red-800" : ""
              }`}
            />
            {profiledrop && (
              <div
                ref={profileRef}
                className=" border h-[100px] w-[140px] z-10 absolute top-14 right-2  bg-white shadow-lg p-4 rounded-md"
              >
                <ul className="">
                  <li>
                    {/* <Link to="/account"> */}
                    <span
                      className=" flex items-center mb-2 hover:bg-gray-200 px-4 rounded-md py-1"
                      onClick={() => navigate("/account")}
                    >
                      <img src={profile} alt="profile-icon" />
                      <a className="ml-2" style={{ fontSize: "16px" }}>
                        {localStorage.getItem("first_name")}&nbsp;
                        {localStorage.getItem("last_name")}
                      </a>
                    </span>
                    {/* </Link> */}
                  </li>
                  <li className=" ">
                    <span
                      className=" flex flex-row items-center cursor-pointer hover:bg-gray-200 px-4 rounded-md py-1"
                      onClick={logout}
                    >
                      <img src={logoutIcon} alt="logout-icon" />
                      <a className="ml-2" style={{ fontSize: "16px" }}>
                        Logout
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </span>
        </div>
      </div>
      {support && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="bg-white p-6 shadow-lg h-[250px] w-[445px] relative rounded-xl">
            <div className=" flex justify-between mb-2 items-center">
              <span className="flex">
                <img
                  src={dataklout}
                  alt="dataklout logo"
                  className=" w-[23px] h-[30px] mr-2"
                />

                <span className=" text-[22px] font-medium text-[#838383]">
                  Dataklout
                </span>
              </span>
              <span
                className="cursor-pointer "
                onClick={() => setSupport(false)}
              >
                <img
                  src={closeIcon}
                  alt="close-icon"
                  className="hover-fill-red transition-colors duration-200"
                />
              </span>
            </div>
            <hr className=" text-[#D7D7D7] border-t-2" />
            <div className=" flex flex-col mt-4">
              <span className="mb-4 text-[16px] flex flex-row items-center">
                <img src={mailIcon} alt="mail-icon" className=" mr-4" />
                <a className=" block " href="mailto:contact@test.com">
                  support@dataklout.com
                </a>{" "}
              </span>
              <span className="mb-4 text-[16px] flex flex-row">
                <img src={phoneIcon} alt="phone-icon" className=" mr-4" />{" "}
                <a href="tel:+91804524700">+91804524700</a>
              </span>
              <span className="mb-4 text-[16px] flex flex-row  ">
                <img
                  src={addressIcon}
                  alt="address-icon"
                  className=" mr-4 mt-[-42px]"
                />
                <span className=" w-[80%]">
                  306 B, Level 3, Brigade IRV Center Nallurhalli Main Road,
                  Whitefield, Karnataka, India, 560066.
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
