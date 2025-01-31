import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/new-logo.png";
import passwordIcon from "../../assets/icons/password-icon.svg";
import userIcon from "../../assets/icons/user-icon.svg";
import rightArrow from "../../assets/icons/vector.svg";
import formImg from "../../assets/images/Login-form-image.png";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/");
    }
  }, [navigate]);
  console.log(error);
  const handleSubmit = (e) => {
    e.preventDefault();
    var login_info = { username, password };
    setIsPending(true);
    fetch("https://fb.dataklout.com/api/access_control/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login_info),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error("Authentication Fail");
        }
      })
      .then((data) => {
        setIsPending(false);
        localStorage.setItem("access_token", data["access_token"]);
        // localStorage.setItem("access_token", data["access_token"]);
        localStorage.setItem("refresh_token", data["refresh_token"]);
        localStorage.setItem("client", data["client"]);
        localStorage.setItem("client_id", data["client_id"]);
        localStorage.setItem("client_logo", data["client_logo"]);
        localStorage.setItem("client_name", data["client_name"]);
        localStorage.setItem("first_name", data["first_name"]);
        localStorage.setItem("image", data["image"]);
        localStorage.setItem("last_name", data["last_name"]);
        localStorage.setItem("permission", data["permission"]);
        localStorage.setItem("role", data["role"]);
        localStorage.setItem("usecase", data["usecase"]);
        localStorage.setItem("username", data["username"]);
        localStorage.setItem("collection_module", data["collection_module"]);
        localStorage.setItem(
          "stock_broking_module",
          data["stock_broking_module"]
        );
        localStorage.setItem(
          "critical_factor_module",
          data["critical_factor_module"]
        );
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          // console.log("Aborted Fetch");
        } else {
          setIsPending(false);
          setError(err.message);
          toast.error(
            <div>
              <p>{err.message}</p>
              <p>Invalid Username or Password</p>
            </div>
          );
          // console.log(err.message);
        }
      });
  };

  return (
    <div className="image min-h-[100vh]">
      <div className=" min-h-[100vh] px-20 py-8 ">
        <div className="flex border border-white  rounded-[20px] flex-row ">
          <div
            className=" w-[634px] border-r border-r-white bg-[#16004B] h-full"
            style={{ borderRadius: "20px 0px 0px 20px" }}
          >
            <div className=" px-16 pt-10 pb-6">
              <img src={logo} alt="logo" className="h-20 w-2/5" />
              <div className=" mt-4 flex flex-col">
                <span>
                  <span className=" flex flex-row items-center">
                    <img src={userIcon} alt="icon" className="w-4 h-4" />
                    <label className="text-white text-sm ml-2  font-normal">
                      User ID
                    </label>
                  </span>

                  <input
                    placeholder="Enter Your User ID"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUserID(e.target.value);
                    }}
                    className="w-[430px] bg-white text-black rounded-lg px-3 py-1 focus:outline-none mt-2  border border-[#616161] placeholder:text-[12px] hover:placeholder:text-gray-900"
                  />
                </span>
                <span className="mt-4">
                  <span className=" flex flex-row items-center">
                    <img src={passwordIcon} alt="icon" width={15} height={20} />
                    <label className="text-white text-sm ml-2  font-normal">
                      Password
                    </label>
                  </span>

                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="w-full bg-white text-black rounded-lg px-3 py-1 focus:outline-none mt-2  border border-[#616161] placeholder:text-[12px] hover:placeholder:text-gray-900"
                  />
                </span>
              </div>

              <button
                className={`px-8 mt-6 bg-[#df643a] text-white py-[6px] rounded-lg hover:bg-[#a94625] w-full`}
                onClick={handleSubmit}
              >
                {!isPending ? "Login" : "Checking..."}
              </button>
              <ToastContainer
                position="top-center"
                theme="colored"
                hideProgressBar={true}
              />
              <div className=" flex justify-between text-white mt-3">
                <span className="font-medium text-[13px] hover:text-[#df643a]  cursor-pointer">
                  Use Custom Domain
                </span>
                <span className="font-medium text-[13px]  hover:text-[#df643a]  cursor-pointer">
                  Forgot password?
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between m-[-8px]">
              <div className="w-7 h-3.5 bg-white rounded-t-full transform rotate-90"></div>
              <hr className="flex-grow mx-2 border-t border-dashed border-white custom-dotted-hr" />
              <div className="w-7 h-3.5 bg-white rounded-t-full rotate-[270deg]"></div>
            </div>
            <div className=" my-4">
              <div className=" flex flex-col ml-[17px]">
                <h2 className=" text-[18px] font-semibold tracking-wider text-white">
                  Enter Details to Start{" "}
                  <span className=" text-[#e9be73]">Trial</span> Now!
                </h2>
                <p className=" text-white text-[16px] mt-2">
                  No Hidden Charges, No Credit Card.
                </p>
              </div>
              <ul className=" text-white flex flex-col ">
                <span className=" flex flex-row mx-4 my-2">
                  <img
                    src={rightArrow}
                    alt="icon"
                    // width={20}
                    // height={20}
                    className="w-4 h-4"
                  />{" "}
                  <li className=" ml-4 text-[14px]">
                    {" "}
                    Upload Your Own Data or use the pre-loaded
                  </li>
                </span>
                <span className=" flex flex-row mx-4 my-2">
                  <img
                    src={rightArrow}
                    alt="icon"
                    className="w-4 h-4"
                    // width={20}
                    // height={20}
                  />{" "}
                  <li className=" ml-4 text-[14px]">
                    Cloud Based SAAS, Preconfigured Workflow, Reports &
                    Dashboards
                  </li>
                </span>

                <span className=" flex flex-row mx-4 my-2">
                  <img
                    src={rightArrow}
                    alt="icon"
                    // width={20}
                    // height={20}
                    className="w-4 h-4"
                  />{" "}
                  <li className=" ml-4 text-[14px]">
                    Preconfigured Based On User Profile
                  </li>
                </span>
              </ul>
              <span className="mx-[62px] flex">
                <button className=" mb-4 hover:bg-[#a94625] hover:border-none text-white px-8 border border-white py-[6px] text-center w-full mt-4 rounded-md text-[18px]">
                  START MY TRIAL
                </button>
              </span>
            </div>
          </div>
          <div className="w-full">
            <img
              src={formImg}
              alt="image"
              // layout="responsive"
              // width={500}
              // height={550}
              className="w-auto h-[664px]"
              style={{ borderRadius: "0px 20px 20px 0px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
