import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Nav from "../nav";
import recentCall from "../assets/Icons/recentCall.svg";
import Service from "./webservice/http";
import wifiOff from "../assets/Icons/wifi_off.svg";
import addCall from "../assets/Icons/addcall.svg";
import plusgreen from "../assets/Icons/plusgreen.svg";
import negative from "../assets/Icons/minusred.svg";
import callscriptIcon from "../assets/Icons/callScript.svg";
import Tableskeleton from "./common/tableSkeleton";
import BlockSkeleton from "./common/blockSkeleton";
import pendingIcon from "../assets/Icons/pendingTask.svg";
import faceIcon from "../assets/Icons/faceIcon.svg";
// import calander from "../assets/Icons/calander.svg";
import callBackIcon from "../assets/Icons/callbackIcon.svg";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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

  /**
   * Fetch Call back requests
   */
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

  useEffect(() => {
    fetchRecentCall();
    fetchFullScriptData();
    fetchPendingTask();
    fetchCallBackRequests();
  }, []);

  console.log("pending......", callBack);

  return (
    <div>
      <Header />
      <Nav />
      <div className="m-2"></div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 2 }}
        gutterBreakpoints={{ 350: "12px", 750: "6px", 1200: "24px" }}
        className="mx-2"
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
                      <tr key={i} className="text-nowrap">
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
              className={`h-[317px] mt-4 ${
                fullScript.length === 1 ? "no-scrollbar" : "overflow-y-scroll"
              }`}
            >
              {fullScript.length ? (
                fullScript.map((e, i) => (
                  <div
                    className="mb-4 shadow-md min-h-[315px] rounded-xl"
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
                    <span className="ml-[-108px] flex">
                      <img src={faceIcon} className="mr-2" />
                      {`${e?.created_by__first_name} ${e?.created_by__last_name}`}
                    </span>
                    <span>
                      📅{" "}
                      <span className="ml-2">
                        {e?.creation_date.split("T")[0]}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex">
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
                      <td className="py-4 px-2 border-t w-1/4">
                        {e?.customer__first_name}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        {e?.product__title || "Busy with Office work"}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        📅 {e?.date__date}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        🕒 {e?.date__time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex">
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
                      <td className="py-4 px-2 border-t w-1/4">
                        {e?.customer__first_name}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        {e?.product__title || "Busy with Office work"}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        📅 {e?.date__date}
                      </td>
                      <td className="py-4 border-t w-1/4">
                        🕒 {e?.date__time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="border bg-white w-full rounded-xl p-4 h-auto self-start">
            <div className="flex">
              <img
                src={callBackIcon}
                alt="callback reminders icon"
                className="mr-2 w-[24px] h-[24px]"
              />
              <h1 className="text-[#271078] text-[20px] font-medium leading-[30px]">
                Callback Reminders
              </h1>
            </div>
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
                    <td className="py-4 px-2 border-t w-1/4">
                      {e?.customer__first_name}
                    </td>
                    <td className="py-4 border-t w-1/4">
                      {e?.product__title || "Busy with Office work"}
                    </td>
                    <td className="py-4 border-t w-1/4">📅 {e?.date__date}</td>
                    <td className="py-4 border-t w-1/4">🕒 {e?.date__time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default Home;
