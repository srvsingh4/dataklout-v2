import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Nav from "../nav";
import recentCall from "../assets/Icons/recentCall.svg";
import Service from "./webservice/http";
import { BiError, BiCommentAdd, BiTaskX } from "react-icons/bi";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { MdAddIcCall } from "react-icons/md";
import { VscGitPullRequestCreate } from "react-icons/vsc";
// import wifiOff from "../assets/Icons/wifi_off.svg";
// import addCall from "../assets/Icons/addcall.svg";
import plusgreen from "../assets/Icons/plusgreen.svg";
import negative from "../assets/Icons/minusred.svg";
import callscriptIcon from "../assets/Icons/callScript.svg";
import Tableskeleton from "./common/tableSkeleton";
import BlockSkeleton from "./common/blockSkeleton";
import pendingIcon from "../assets/Icons/pendingTask.svg";
import faceIcon from "../assets/Icons/faceIcon.svg";
// import calander from "../assets/Icons/calander.svg";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import callBackIcon from "../assets/Icons/callbackIcon.svg";
import opportunity2 from "../assets/Icons/opportunity2.svg";
import manager from "../assets/Icons/manger.svg";
import callblue from "../assets/Icons/callblue.svg";
import clock from "../assets/Icons/clock.svg";
import servicereq from "../assets/Icons/servicereq.svg";
import cxtrend from "../assets/Icons/cxtrend.svg";
import intent from "../assets/Icons/intent.svg";
import comment from "../assets/Icons/comment.svg";

function Home() {
  const services = new Service();
  const navigate = useNavigate();
  const [recentcalldata, setRecentcalldata] = useState(null);
  const [recentCallPending, setRecentCallPending] = useState(true);
  const [recentCallError, setRecentCallError] = useState(null);
  const [fullScript, setFullScript] = useState([]);
  const [fullScriptPending, setFullScriptPending] = useState(true);
  const [fullScriptError, setFullScriptError] = useState(null);
  const [pendingTask, setPendingTask] = useState(null);
  const [pendingTaskPending, setPendingTaskPending] = useState(true);
  const [pendingTaskError, setPendingTaskError] = useState(null);
  const [callBack, setCallBack] = useState([]);
  const [callBackPending, setCallBackPending] = useState(true);
  const [callBackError, setCallBackError] = useState(null);
  const [managerComment, setManagerComment] = useState([]);
  const [managerCommentPending, setManagerCommentPending] = useState(true);
  const [managerCommentError, setManagerCommentError] = useState(null);
  const [leadStatus, setLeadStatus] = useState([]);
  const [opportunityPending, setOpportunityPending] = useState(true);
  const [opportunityError, setOpportunityError] = useState(null);
  const [serviceRequestStatus, setServiceRequestStatus] = useState([]);
  const [serviceRequestPending, setServiceRequestPending] = useState(true);
  const [serviceRequestError, setServiceRequestError] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  }, [navigate]);

  function fetchRecentCall() {
    setRecentCallPending(true);
    setRecentCallError(null);

    services.get("api/call/home_page/recent_calls/").then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setRecentCallPending(false);
        setRecentCallError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            navigate("/login");
          }
          setRecentCallPending(false);
          setRecentcalldata(res);
        } catch (e) {
          setRecentCallError(e);
        }
      }
    });
  }

  function fetchFullScriptData() {
    setFullScriptError("");
    setFullScript("");
    setFullScriptPending(true);
    services.get(`api/call_quality/manage_full_script/`).then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setFullScriptPending(false);
        setFullScriptError("Connection Error");
      } else {
        try {
          setFullScript(res);
          setFullScriptPending(false);
          setFullScriptError("");
        } catch {
          console.log(Error);
        }
      }
    });
  }

  function fetchPendingTask() {
    setPendingTaskPending(true);
    setPendingTaskError("");
    services.get("api/task/recent_tasks/").then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setPendingTaskPending(false);
        setPendingTaskError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            navigate("/login");
          }
          setPendingTaskPending(false);
          setPendingTask(res);
        } catch (e) {
          setPendingTaskError(e);
        }
      }
    });
  }

  function fetchCallBackRequests() {
    setCallBackPending(true);
    setRecentCallError("");
    setCallBack(null);
    services.get("api/call/home_page/call_back_remainders/").then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setCallBackPending(false);
        setCallBackError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            navigate("/login");
          }
          setCallBackPending(false);
          setCallBack(res);
        } catch (e) {
          setCallBackError(e);
        }
      }
    });
  }

  function fetchManagerComment() {
    setManagerCommentPending(true);
    setManagerCommentError("");
    services.get("api/call/home_page/managers_comments/").then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setManagerCommentPending(false);
        setManagerCommentError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            history.push("/login");
          }
          setManagerCommentPending(false);
          setManagerComment(res);
        } catch (e) {
          setManagerCommentError(e);
        }
      }
    });
  }

  function fetchOpportunities() {
    setOpportunityPending(true);
    setOpportunityError("");
    setLeadStatus(null);
    services.get("api/call/home_page/lead_status/").then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setOpportunityPending(false);
        setOpportunityError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            history.push("/login");
          }
          setOpportunityPending(false);
          setLeadStatus(res);
        } catch (e) {
          setOpportunityError(e);
        }
      }
    });
  }

  function fetchServiceRequest() {
    setServiceRequestPending(true);
    setServiceRequestStatus(null);
    services.get("api/call/home_page/service_request_status/").then((res) => {
      if (res == "TypeError: Failed to fetch") {
        setServiceRequestPending(false);
        setServiceRequestError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            history.push("/login");
          }
          setServiceRequestPending(false);
          setServiceRequestStatus(res);
        } catch (e) {
          setServiceRequestError(e);
        }
      }
    });
  }

  useEffect(() => {
    fetchRecentCall();
    fetchFullScriptData();
    fetchPendingTask();
    fetchCallBackRequests();
    fetchManagerComment();
    fetchOpportunities();
    fetchServiceRequest();
  }, []);

  console.log("lead.....", serviceRequestStatus);

  return (
    <div>
      <Header />
      <Nav />
      <div className="m-2"></div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 2 }}
        gutterBreakpoints={{ 350: "12px", 750: "6px", 1200: "24px" }}
        className="mx-2 mb-4"
      >
        <Masonry>
          <div className="h-auto border bg-white w-full rounded-xl p-4 self-start">
            <div className="flex items-center">
              <img
                src={recentCall}
                alt="recent call icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Recent Calls
              </h1>
            </div>
            <div>
              {recentCallPending ? (
                <Tableskeleton thead={5} trow={5} tcol={5} />
              ) : (
                <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] shadow-md text-nowrap table-with-bg">
                  <thead className="bg-[#E0DCED]">
                    <tr className="text-[#252525]">
                      <th className="px-2 py-2 text-left text-[18px] font-medium leading-[27px]">
                        Date
                      </th>
                      <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                        Customer
                      </th>
                      <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                        Product
                      </th>
                      <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                        Call Type
                      </th>
                      <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                        Sentiments
                      </th>
                      <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                        Intent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentcalldata?.map((e, i) => (
                      <tr
                        key={i}
                        className="text-nowrap cursor-pointer"
                        onClick={() => navigate(`/call/${e?._id}/call-insight`)}
                      >
                        <td className="py-3 px-2 border-t">{e._date}</td>
                        <td className="py-3 border-t">
                          {e._customer_first_name}
                        </td>
                        <td className="py-3 border-t">{e._product_name}</td>
                        <td className="py-3 border-t">{e._call_type}</td>
                        <td className="py-3 border-t flex justify-center">
                          {e._sentiment > 0 ? (
                            <img src={plusgreen} />
                          ) : (
                            <img src={negative} />
                          )}
                        </td>
                        <td className="py-3 border-t">
                          {e._intent > 0 ? (
                            <img src={plusgreen} />
                          ) : (
                            <img src={negative} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {recentCallError && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {recentCallError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {recentCallError !== "Connection Error" && <BiError />}
                  {recentCallError}
                </p>
              </div>
            )}
            {recentcalldata && recentcalldata.length === 0 && (
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                <MdAddIcCall />
                <p>No Records Found</p>
              </div>
            )}
          </div>

          <div className="h-auto border bg-white w-full rounded-xl p-4 self-start">
            <div className="flex items-center">
              <img
                src={callscriptIcon}
                alt="call script icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Call Script
              </h1>
            </div>
            <div
              className={`h-[288px] mt-4 ${
                fullScript.length === 1 ? "no-scrollbar" : "overflow-y-scroll"
              }`}
            >
              {fullScript.length && !fullScriptPending ? (
                fullScript.map((e, i) => (
                  <div
                    className="mb-4 shadow-md min-h-[289px] rounded-xl"
                    key={i}
                  >
                    <div className="bg-[#E0DCED] h-[47px] rounded-t-lg flex items-center">
                      <div className="mx-3 text-[#252525] text-[18px] leading-7 font-medium">
                        Title : <span className="ml-2">{e?._title}</span>
                      </div>
                    </div>
                    <p
                      className="p-2 text-[16px]"
                      dangerouslySetInnerHTML={{
                        __html: e?._script.replace(/\n/g, "<br />"),
                      }}
                    />
                  </div>
                ))
              ) : (
                <BlockSkeleton blockNo={1} />
              )}
            </div>
            {setFullScriptError === "" && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {fullScriptError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {fullScriptError !== "Connection Error" && <BiError />}
                  {fullScriptError}
                </p>
              </div>
            )}
          </div>

          <div className="h-auto border bg-white w-full rounded-xl p-4 self-start">
            <div className="flex items-center">
              <img
                src={pendingIcon}
                alt="pending tasks icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Pending Tasks
              </h1>
            </div>
            {pendingTaskPending ? (
              <Tableskeleton thead={3} trow={3} tcol={3} />
            ) : (
              <div className="mb-4 shadow-md h-[369px] rounded-xl mt-4">
                <div className="bg-[#E0DCED] h-[47px] rounded-t-lg flex items-center justify-between px-6 text-[#252525] text-[18px] leading-7 font-medium">
                  <span>Details</span>
                  <span>Name</span>
                  <span className="mr-[66px]">Date</span>
                </div>
                <div className="h-[320px] overflow-y-scroll task">
                  {pendingTask?.map((e, i) => (
                    <div
                      className="flex items-center justify-between px-6 text-[#171717] text-[16px] leading-7 font-normal mt-2 border-b pb-1"
                      key={i}
                    >
                      <span className="w-1/4 flex flex-col">
                        {e?.title}
                        <span
                          className={`text-[16px] font-medium ${
                            e?.priority === "High"
                              ? "text-[#FF2424]"
                              : e?.priority === "Normal"
                              ? "text-[#ffa500]"
                              : "text-green-700"
                          }`}
                        >
                          {e?.priority} Priority
                        </span>
                      </span>
                      <span className="ml-[-108px] flex items-center">
                        <img src={faceIcon} className="mr-2" />
                        {`${e?.created_by__first_name} ${e?.created_by__last_name}`}
                      </span>
                      <span className=" flex items-center">
                        {/* <img src={calander} alt="calander" /> */}
                        📅
                        <span className="ml-2">
                          {e?.creation_date.split("T")[0]}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingTaskError && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {pendingTaskError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {pendingTaskError !== "Connection Error" && <BiError />}
                  {pendingTaskError}
                </p>
              </div>
            )}
            {pendingTask && pendingTask.length === 0 && (
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                <BiTaskX />
                <p>No Pending Task </p>
              </div>
            )}
          </div>

          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex items-center">
              <img
                src={callBackIcon}
                alt="callback reminders icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Callback Reminders
              </h1>
            </div>
            {callBackPending ? (
              <Tableskeleton thead={4} trow={3} tcol={3} />
            ) : (
              <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] shadow-md table-with-bg">
                <thead className="bg-[#E0DCED] mx-8 h-[47px]">
                  <tr className="text-[#252525]">
                    <th className="px-4 py-2 text-left text-[18px] font-medium leading-[27px]">
                      Name
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Description
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Date
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {callBack?.map((e, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 border-t w-1/4">
                        <span className=" flex">
                          <img src={faceIcon} className="mr-2" />
                          {e?.customer__first_name}
                        </span>
                        <span className=" flex items-center mt-2">
                          <img
                            src={callblue}
                            alt="callIcon"
                            className=" mr-2 w-4 h-4"
                          />
                          {e?.customer__contact_number}
                        </span>
                      </td>
                      <td className="py-4 border-t w-1/4">
                        {e?.product__title || "Busy with Office work"}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        {/* <img src={calander} alt="calander" className="mr-2" /> */}
                        📅
                        <span className=" ml-2">{e?.date__date}</span>
                      </td>
                      <td className="py-4 border-t w-1/4">
                        <span className=" flex items-center">
                          <img src={clock} alt="clock" className=" mr-2" />
                          {e?.date__time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {callBackError && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {callBackError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {callBackError !== "Connection Error" && <BiError />}
                  {callBackError}
                </p>
              </div>
            )}
            {callBack && callBack.length === 0 && (
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                <BiCommentAdd />
                <p>No Records Found</p>
              </div>
            )}
          </div>
          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex items-center">
              <img
                src={manager}
                alt="callback reminders icon"
                className="mr-2 w-[24px] h-[24px] fill-blue-400"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Manager Comment
              </h1>
            </div>
            {managerCommentPending ? (
              <Tableskeleton thead={2} trow={2} tcol={2} />
            ) : (
              <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] shadow-md table-with-bg">
                <thead className="bg-[#E0DCED] mx-8 h-[47px]">
                  <tr className="text-[#252525] flex">
                    <th className="px-4 py-2 text-left text-[18px] font-medium leading-[27px] w-[60%]">
                      Comment
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {managerComment?.map((e, i) => (
                    <tr key={i} className=" flex">
                      <td className="py-2 px-4 border-t w-[60%] flex flex-col">
                        <span className=" flex items-center">
                          <img src={comment} alt="comment" className=" mr-2" />{" "}
                          {e?.comment}
                        </span>
                        <span className=" flex">
                          <img
                            src={faceIcon}
                            alt="face-icon"
                            className=" mr-2"
                          />{" "}
                          {`${e?.commented_by__first_name} ${e?.commented_by__last_name}`}
                        </span>
                      </td>

                      <td className="py-2 border-t w-1/3 flex flex-col">
                        {/* <img src={calander} className=" mr-2" /> */}
                        <span>
                          📅<span className="ml-2">{e?.date__date}</span>
                        </span>
                        <span className=" flex mt-2 items-center">
                          <img
                            src={callblue}
                            alt=""
                            className=" mr-[11px] w-4 h-4 ml-[3px]"
                          />{" "}
                          {e?.call__call_reference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {managerCommentError && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {managerCommentError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {managerCommentError !== "Connection Error" && <BiError />}
                  {managerCommentError}
                </p>
              </div>
            )}
            {managerComment && managerComment.length === 0 && (
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                <BiCommentAdd />
                <p>No Records Found</p>
              </div>
            )}
          </div>
          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex items-center">
              <img
                src={opportunity2}
                alt="callback reminders icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Opportunity Status
              </h1>
            </div>
            {opportunityPending ? (
              <Tableskeleton thead={5} trow={3} tcol={5} />
            ) : (
              <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] shadow-md table-with-bg">
                <thead className="bg-[#E0DCED] mx-4 h-[47px]">
                  <tr className="text-[#252525]">
                    <th className="px-4 py-2 text-left text-[18px] font-medium leading-[27px]">
                      Reference
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Customer
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Product
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Status
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Sentiments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leadStatus?.map((e, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 border-t ">
                        {e?.call__call_reference}
                      </td>
                      <td className="py-4 border-t ">
                        {`${e?.call__customer__first_name} ${
                          e?.call__customer__last_name
                            ? e?.call__customer__last_name
                            : ""
                        }`}
                      </td>
                      <td className="py-4 border-t ">{e?.product__title}</td>
                      <td className="py-4 border-t ">{e?.review_status}</td>
                      <td className="py-4 border-t flex justify-center mr-[57px]">
                        {e?.call__customer_sentiment > 0 ? (
                          <img src={plusgreen} />
                        ) : (
                          <img src={negative} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {opportunityError && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {opportunityError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {opportunityError !== "Connection Error" && <BiError />}
                  {opportunityError}
                </p>
              </div>
            )}
            {leadStatus && leadStatus.length === 0 && (
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                <VscGitPullRequestCreate />
                <p>No Records Found</p>
              </div>
            )}
          </div>
          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex items-center">
              <img
                src={servicereq}
                alt="callback reminders icon"
                className="mr-2 w-[30px] h-[30px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Service Request Status
              </h1>
            </div>
            {serviceRequestPending ? (
              <Tableskeleton thead={5} trow={3} tcol={5} />
            ) : (
              <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] shadow-md table-with-bg">
                <thead className="bg-[#E0DCED] mx-4 h-[47px]">
                  <tr className="text-[#252525]">
                    <th className="px-4 py-2 text-left text-[18px] font-medium leading-[27px]">
                      Reference
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Customer
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Product
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Status
                    </th>
                    <th className="py-2 text-left text-[18px] font-medium leading-[27px]">
                      Sentiments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequestStatus?.map((e, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4 border-t ">
                        {e?.call__call_reference}
                      </td>
                      <td className="py-4 border-t ">
                        {`${e?.call__customer__first_name} ${
                          e?.call__customer__last_name
                            ? e?.call__customer__last_name
                            : ""
                        }`}
                      </td>
                      <td className="py-4 border-t ">{e?.product__title}</td>
                      <td className="py-4 border-t ">{e?.review_status}</td>
                      <td className="py-4 border-t flex justify-center mr-[57px]">
                        {e?.call__customer_sentiment > 0 ? (
                          <img src={plusgreen} />
                        ) : (
                          <img src={negative} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {serviceRequestError && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "25px", color: "#FF8520" }}>
                  {serviceRequestError === "Connection Error" && (
                    <RiSignalWifiErrorFill />
                  )}
                  {serviceRequestError !== "Connection Error" && <BiError />}
                  {serviceRequestError}
                </p>
              </div>
            )}
            {serviceRequestStatus && serviceRequestStatus.length === 0 && (
              <div style={{ fontSize: "20px", textAlign: "center" }}>
                <VscGitPullRequestCreate />
                <p>No Records Found</p>
              </div>
            )}
          </div>
          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex items-center">
              <img
                src={cxtrend}
                alt="callback reminders icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                CX Score Trend
              </h1>
            </div>
            {serviceRequestPending ? (
              <Tableskeleton thead={5} trow={3} tcol={5} />
            ) : (
              <div>cx score </div>
            )}
          </div>

          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex items-center">
              <img
                src={intent}
                alt="callback reminders icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Intent Analysis
              </h1>
            </div>
            {serviceRequestPending ? (
              <Tableskeleton thead={5} trow={3} tcol={5} />
            ) : (
              <div>Intent</div>
            )}
          </div>
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default Home;
