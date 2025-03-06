import Nav from "../nav";
import Header from "./header";
import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Service from "./webservice/http";
import axios from "axios";
import logoutIcon from "../assets/Icons/logout2.svg";
import message from "../assets/Icons/mail-icon.svg";
import profile from "../assets/Icons/profile_icon.svg";
import key from "../assets/Icons/key.svg";
import self from "../assets/Icons/self.svg";
import name from "../assets/Icons/account/name.svg";
import role from "../assets/Icons/account/role.svg";
import userid from "../assets/Icons/account/userid.svg";
import workspace from "../assets/Icons/account/workspace.svg";
import person from "../assets/Icons/account/person.svg";
import lock from "../assets/Icons/account/lock.svg";
import star from "../assets/Icons/account/stars.svg";
import upload from "../assets/Icons/account/upload.svg";
import BlockSkeleton from "./common/blockSkeleton";
import Progressbar from "./common/progressbar";
import close from "../assets/Icons/account/close.svg";
import eyesOn from "../assets/Icons/account/visibility_on.svg";
import eyesOff from "../assets/Icons/account/visibility_off.svg";
import emailplus from "../assets/Icons/account/add_circle.svg";
import edit from "../assets/Icons/account/edit_square.svg";

function Account({ loginStatus }) {
  Account.propTypes = {
    loginStatus: PropTypes.bool.isRequired,
  };
  const services = new Service();
  const navigate = useNavigate();
  const url = window.location.href;
  // const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [selfDetails, setSelfDetail] = useState(null);
  const [tab, setTab] = useState("Home");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [passwordChnageError, setPasswordChangeError] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPending, setUploadPending] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [email, setemail] = useState("");
  const [otpBox, setOtpBox] = useState(false);
  const [otpText, setotpText] = useState("Verify Email");
  const [resendotp, setResendotp] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [logoutconfirm, setLogoutconfirm] = useState(false);
  const [newpasseye, setNewpasseye] = useState(false);
  const [conpasseye, setConpasseye] = useState(false);
  const [editemail, setEditemail] = useState(false);
  const [addemail, setaddemail] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  function fetchUserData() {
    services.get("api/access_control/self_details/").then((res) => {
      setIsPending(true);

      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            history.push("/login");
          }
          setSelfDetail(res);
          localStorage.setItem("image", res["image"]);
          setError(null);
          setIsPending(false);
        } catch (e) {
          setError(e);
        }
      }
    });
  }

  const logout = () => {
    services.get("api/access_control/logout/").then((res) => {
      // console.log(res);
    });
    localStorage.clear();
    navigate("/login");
    // window.location.reload();
    //browser.tabs.reload();
  };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  const changePassword = () => {
    if (oldPassword === "") {
      toast.error("Please Enter your old password");
      return;
    }

    if (newPassword === "") {
      toast.error("Please Enter your new password");
      return;
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/gm;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Your Password must be of atleast 8 character and contain atleast one uppercase letter, one lowercase letter, one digit and one special character"
      );
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Your Password must be of atleast 8 character");
      return;
    }

    if (confirmPassword === "") {
      toast.error("Please confirm your new password");
      return;
    }

    if (newPassword != confirmPassword) {
      toast.error("Password and Confirmpassword should be same");
      return;
    }

    var data = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    services.post("api/access_control/change_password/", data).then((res) => {
      // console.log(res);
      setIsPending(false);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            history.push("/login");
          }

          if (res.message !== "success") {
            toast.error(res.message);
          } else {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTab("Home");
            toast.success("Success", "Password Changed Successfully");
          }
        } catch (e) {
          toast.error(e);
        }
      }
    });
  };

  const uploadPhoto = () => {
    if (uploadFile === null) {
      toast.error("Please select a photo to upload");
      return;
    }
    setUploadPending(true);
    setUploadError("");
    setUploadProgress(0);
    var url = services.domain + "/api/access_control/change_profile_photo/";
    let formData = new FormData();
    formData.append("file", uploadFile);

    axios
      .request({
        method: "post",
        url: url,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        data: formData,
        onUploadProgress: (p) => {
          // console.log(p.loaded);

          setUploadProgress(Math.round((p.loaded * 100) / uploadFile.size));
        },
      })
      .then((data) => {
        setUploadPending(false);
        setUploadError(null);

        if (data.data.message === "success") {
          // console.log(data);
          fetchUserData();
          setTab("Home");
          setUploadFile(null);
          toast.success("Success", "Profile Photo Updated");
        } else {
          setUploadPending(false);
          setUploadError(data.message);
          toast.error("Error", "Please select a photo to upload");
        }
      })
      .catch((error) => {
        // Handle the error here
        // console.error(error);
        setUploadPending(false);
        setUploadError(error?.response?.data?.error);
        toast.error("Error", error.response.data.error);
        // console.log(error?.response?.data?.error);
      });
  };

  const fileInputRef = useRef(null);

  const clearUploadFile = () => {
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const verifyOtp = function () {
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //   if (!email) {
  //     toast.error("Please Enter Email Address");
  //   } else if (!emailRegex.test(email)) {
  //     toast.error("Please Enter a Valid Email Address");
  //   } else {
  //     toast.success("Otp sent to Email Address");
  //     setOtpBox(true);
  //     setTimeout(() => {
  //       setResendotp(true);
  //     }, 100);
  //   }
  // };

  // const sendOtpAgain = function () {
  //   setResendotp(false);
  //   setTimeout(() => {
  //     setResendotp(true);
  //   }, 2000);
  // };

  return (
    <div>
      <Header />
      <Nav />
      <ToastContainer
        position="top-right"
        theme="colored"
        hideProgressBar={false}
      />
      <div className="p-4 flex ">
        <div className="w-[40%] mr-2  bg-white rounded-xl p-4">
          {isPending ? (
            <div className=" flex justify-center items-center flex-col">
              <div className="rounded-full bg-gray-300 h-[200px] w-[200px] mt-4 animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-300 mt-2 rounded animate-pulse"></div>
              <div className="h-5 w-40 bg-gray-300 mt-2 rounded animate-pulse"></div>
              <div className="h-5 w-28 bg-gray-300 mt-2 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[420px] border border-gray-300 rounded-lg flex-col">
              <img
                src={services?.domain + selfDetails?.image}
                alt=""
                className=" rounded-full h-[200px] w-[200px] mt-4"
              />

              <span className=" text-[24px]">{selfDetails?.first_name}</span>
              <span className=" text-[18px]">
                {`${selfDetails?.role} ${localStorage.getItem("usecase")}`}
              </span>
              <span className=" text-[18px]">{selfDetails?.client}</span>
            </div>
          )}

          <div className=" mt-6">
            <div
              className={`mb-4  p-3 rounded-xl flex font-medium text-[18px] cursor-pointer ${
                tab === "Home"
                  ? "bg-[#271078] text-white   hover:border-none"
                  : "text-[#5F6368] hover:bg-gray-200"
              }`}
              onClick={() => setTab("Home")}
            >
              <img
                src={self}
                alt=""
                className={`mr-2 ${
                  tab === "Home" ? "invert brightness-0" : ""
                }`}
              />{" "}
              Self Details
            </div>
            <div
              className={`mb-4 p-3  rounded-xl flex  font-medium text-[18px] cursor-pointer ${
                tab === "password"
                  ? "bg-[#271078] text-white "
                  : "text-[#5F6368] hover:bg-gray-200"
              } `}
              onClick={() => setTab("password")}
            >
              <img
                src={key}
                alt=""
                className={`mr-2 ${
                  tab === "password" ? "invert brightness-0" : ""
                }`}
              />{" "}
              Change Password
            </div>
            <div
              className={`mb-4   p-3  rounded-xl flex text-[#5F6368] font-medium text-[18px] cursor-pointer ${
                tab === "picture"
                  ? "bg-[#271078] text-white"
                  : "text-[#5F6368] hover:bg-gray-200"
              } `}
              onClick={() => setTab("picture")}
            >
              <img
                src={profile}
                alt=""
                className={`mr-2 ${
                  tab === "picture" ? "invert brightness-0" : ""
                }`}
              />{" "}
              Change Profile Photo
            </div>
            {/* <div
              className={`mb-4   p-3  rounded-xl flex text-[#5F6368] font-medium text-[18px] cursor-pointer ${
                tab === "email"
                  ? "bg-[#271078] text-white  hover:border-none"
                  : "text-[#5F6368] hover:bg-gray-200"
              }`}
              onClick={() => setTab("email")}
            >
              <img
                src={message}
                alt=""
                className={`mr-2 ${
                  tab === "email" ? "invert brightness-0" : ""
                }`}
              />{" "}
              Add Email Address
            </div> */}
            <div
              className="mb-4   p-3  rounded-xl flex text-[#5F6368] font-medium text-[18px] cursor-pointer hover:bg-gray-200"
              onClick={() => setLogoutconfirm(true)}
            >
              <img src={logoutIcon} alt="" className={`mr-2`} />
              Logout
            </div>
          </div>
        </div>
        <div className="w-[60%]  bg-white rounded-xl">
          {tab === "Home" &&
            (isPending ? (
              <BlockSkeleton blockNo={1} />
            ) : (
              <div className="px-6 py-4">
                <div className=" mx-auto rounded-lg border border-[#D2D2D2] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-4 border-b border-[#D2D2D2]">
                    <img src={name} alt="" className=" mr-2" />
                    <span className="flex font-bold w-[30%] text-[18px]">
                      Full Name
                    </span>
                    <span className="text-[#171717]">
                      {selfDetails?.first_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-4 border-b border-[#D2D2D2]">
                    <img src={userid} alt="" className=" mr-2" />
                    <span className="flex font-bold w-[30%] text-[18px]">
                      User ID
                    </span>
                    <span className="text-[#171717]">
                      {localStorage.getItem("username")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-4 border-b border-[#D2D2D2]">
                    <img src={message} alt="" className=" mr-2" />
                    <span className="flex font-bold w-[30%] text-[18px]">
                      Email Address
                    </span>
                    <span className="text-[#171717] flex w-[60%] items-center">
                      {selfDetails?.first_name ? (
                        !editemail ? (
                          <>
                            selfDetailsemail@gmail.com
                            <div
                              className="relative group"
                              onClick={() => setEditemail(true)}
                            >
                              <img
                                src={edit}
                                alt=""
                                className="ml-4 cursor-pointer"
                              />
                              <span className="absolute left-0 top-7 px-3 z-4 bg-[#D2D2D2] rounded-lg text-[#171717] border shadow-lg hidden group-hover:block transition-opacity duration-300">
                                Edit
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <input
                              type="email"
                              id="picture"
                              className="w-full border border-[#D2D2D2] p-2 rounded-lg"
                              accept="image/*"
                              onChange={(e) => setemail(e.target.value)}
                            />
                            <button
                              className=" ml-4 border border-[#D2D2D2] px-4 rounded-md h-[30px] hover:bg-[#271078] hover:text-white hover:border-none"
                              onClick={() => setEditemail(false)}
                            >
                              Save
                            </button>
                            <button
                              className=" ml-4 border border-[#D2D2D2] px-4 rounded-md h-[30px] hover:bg-red-600 hover:text-white hover:border-none"
                              onClick={() => setEditemail(false)}
                            >
                              Cancel
                            </button>
                          </>
                        )
                      ) : addemail ? (
                        <>
                          <input
                            type="email"
                            id="picture"
                            className="w-full border border-[#D2D2D2] p-2 rounded-lg"
                            accept="image/*"
                            // onChange={(e) => setemail(e.target.value)}
                          />
                          <button
                            className=" ml-4 border border-[#D2D2D2] px-4 rounded-md h-[30px] hover:bg-[#271078] hover:text-white hover:border-none"
                            onClick={() => setaddemail(false)}
                          >
                            Save
                          </button>
                          <button
                            className=" ml-4 border border-[#D2D2D2] px-4 rounded-md h-[30px]  hover:bg-red-600 hover:text-white hover:border-none"
                            onClick={() => setaddemail(false)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <div
                          className=" flex cursor-pointer"
                          onClick={() => setaddemail(true)}
                        >
                          <img
                            src={emailplus}
                            alt=""
                            className={`mr-2 group-hover:invert group-hover:brightness-0 ${
                              uploadFile ? "invert" : ""
                            }`}
                          />{" "}
                          <span className=" font-medium text-[#2854C5]">
                            Add Email
                          </span>
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-4 py-4 border-b border-[#D2D2D2]">
                    <img src={role} alt="" className="mr-2" />
                    <span className="flex font-bold w-[30%] text-[18px]">
                      Role
                    </span>
                    <span className="text-[#171717]">{selfDetails?.role}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-4 border-b border-[#D2D2D2]">
                    <img src={person} alt="" className=" mr-2" />
                    <span className="flex font-bold w-[30%] text-[18px]">
                      Reporting To
                    </span>
                    <span className="text-[#171717]">
                      {selfDetails?.reporting_to}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-4 py-4">
                    <img src={workspace} alt="" className=" mr-2" />
                    <span className="flex font-bold w-[30%] text-[18px]">
                      Workspace
                    </span>
                    <span className="text-[#171717]">
                      {selfDetails?.client}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          {tab === "password" && (
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <div className="px-6 py-4">
                <div className="flex items-center gap-[20px] flex-col">
                  <div className="w-full flex items-center gap-2">
                    <img src={star} alt="" className="mr-2" />
                    <label
                      htmlFor="oldpassword"
                      className="text-[18px] whitespace-nowrap w-[30%]"
                    >
                      Current Password
                    </label>

                    <input
                      type="password"
                      id="oldpassword"
                      name="old-password"
                      className="w-full border border-[#D2D2D2] p-2 rounded-lg"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <img src={star} alt="" className="mr-2" />
                    <label
                      htmlFor="newpassword"
                      className="text-[18px] whitespace-nowrap w-[30%]"
                    >
                      New Password
                    </label>
                    <input
                      type={newpasseye ? "text" : "password"}
                      id="newpassword"
                      className="w-full border border-[#D2D2D2] p-2 rounded-lg relative"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      name="new-password"
                      autoComplete="new-password"
                    />
                    {newPassword && (
                      <img
                        src={newpasseye ? eyesOn : eyesOff}
                        alt=""
                        className=" absolute right-14 cursor-pointer"
                        onClick={() => setNewpasseye(!newpasseye)}
                      />
                    )}
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <img src={lock} alt="" className="mr-2" />
                    <label
                      htmlFor="confirmpassword"
                      className="text-[18px] whitespace-nowrap w-[30%]"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type={conpasseye ? "text" : "password"}
                      id="confirmpassword"
                      className="w-full border border-[#D2D2D2] p-2 rounded-lg ml-[6px] relative"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      name="confirm-password"
                      autoComplete="new-password"
                    />
                    {confirmPassword && (
                      <img
                        src={conpasseye ? eyesOn : eyesOff}
                        alt=""
                        className=" absolute right-14 cursor-pointer"
                        onClick={() => setConpasseye(!conpasseye)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 justify-end group ml-10">
                  <button
                    className=" border border-gray-300 rounded-lg p-2 w-[130px] h-[48px] flex items-center justify-center text-[#A3A3A3] 
                  hover:bg-[#271078] hover:text-white"
                    onClick={changePassword}
                  >
                    <img
                      src={upload}
                      alt=""
                      className="mr-2 group-hover:invert group-hover:brightness-0"
                    />{" "}
                    Update
                  </button>
                </div>
              </div>
            </form>
          )}
          {tab === "picture" && (
            <div>
              <div className="px-6 py-4">
                <div className="flex items-center gap-[20px] flex-col">
                  <div className="w-full flex items-center gap-2">
                    <img src={profile} alt="" className="" />
                    <label
                      htmlFor="picture"
                      className="text-[20px] whitespace-nowrap w-[30%] font-semibold"
                    >
                      Select Profile Pic
                    </label>
                    <div className=" w-full">
                      <input
                        type="file"
                        id="picture"
                        className="w-full border border-[#D2D2D2] p-2 rounded-lg"
                        accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        ref={fileInputRef}
                      />
                      <p> *Please upload a .png, .jpg, or .jpeg file</p>
                    </div>
                  </div>
                  {uploadFile && (
                    <div
                      style={{ textAlign: "center", padding: "15px" }}
                      className="relative"
                    >
                      <img
                        src={URL.createObjectURL(uploadFile)}
                        width="170"
                        height="170"
                      />

                      {uploadPending && (
                        <div>
                          <Progressbar
                            bgcolor="#271078"
                            progress={uploadProgress}
                            height={20}
                          />
                        </div>
                      )}
                      <img
                        className="absolute top-0 right-0 cursor-pointer"
                        src={close}
                        onClick={clearUploadFile}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 justify-end group ml-10">
                  <button
                    className={`border border-gray-300 rounded-lg p-2 w-[130px] h-[48px] flex items-center justify-center 
                  hover:bg-[#271078] hover:text-white ${
                    uploadFile ? "text-black" : "text-[#A3A3A3] "
                  }`}
                    onClick={uploadPhoto}
                  >
                    <img
                      src={upload}
                      alt=""
                      className={`mr-2 group-hover:invert group-hover:brightness-0 ${
                        uploadFile ? "invert" : ""
                      }`}
                    />{" "}
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* {tab === "email" && (
            <div>
              <div className="px-6 py-4 mt-4">
                <div className="flex items-center gap-[20px] flex-col">
                  <div className="w-full flex items-center gap-2">
                    <img src={message} alt="" className="mr-1" />
                    <label
                      htmlFor="picture"
                      className="text-[20px] whitespace-nowrap w-[30%] font-semibold"
                    >
                      Email Address
                    </label>
                    <div className=" w-full">
                      <input
                        type="email"
                        id="picture"
                        className="w-full border border-[#D2D2D2] p-2 rounded-lg"
                        accept="image/*"
                        onChange={(e) => setemail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <p
                  className=" flex justify-end text-[#3E1ABC] mt-2 text-[14px] cursor-pointer"
                  onClick={verifyOtp}
                >
                  {otpText}
                </p>

                <div className="flex gap-2 mt-4 justify-end group ml-10">
                  <button
                    className={`border border-gray-300 rounded-lg p-2 w-[130px] h-[48px] flex items-center justify-center 
                 hover:bg-[#271078] hover:text-white ${
                   uploadFile ? "text-black" : "text-[#A3A3A3] "
                 }`}
                    onClick={uploadPhoto}
                  >
                    <img
                      src={emailplus}
                      alt=""
                      className={`mr-2 group-hover:invert group-hover:brightness-0 ${
                        uploadFile ? "invert" : ""
                      }`}
                    />{" "}
                    Add Email
                  </button>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {logoutconfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="bg-white p-6 shadow-lg h-[180px] w-[425px] rounded-xl flex justify-center flex-col items-center">
            <div className="mb-6 text-[22px] leading-5 font-medium tracking-wide">
              Do you want to Logout?
            </div>
            <div className="">
              <button
                className=" h-[44px] w-[150px] border border-[#171717] rounded-lg mr-2 hover:bg-red-600 hover:text-white transition duration-300 ease-out hover:ease-in-out hover:border-none"
                onClick={() => setLogoutconfirm(false)}
              >
                Cancel
              </button>
              <button
                className=" h-[44px] w-[150px] border border-[#171717] rounded-lg hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out  hover:border-none"
                onClick={logout}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
