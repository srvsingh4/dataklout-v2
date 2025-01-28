import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../nav";
import Header from "./header";
import plus from "../assets/Icons/plus.svg";
// import closeIcon from "../assets/Icons/close.svg";
import call from "../assets/Icons/call.svg";
import callIcon from "../assets/Icons/addcall.svg";
import call2 from "../assets/Icons/call2.svg";
import Pagination from "./utils/pagination";
import Service from "./webservice/http";
import plusgreen from "../assets/Icons/plusgreen.svg";
import negative from "../assets/Icons/minusred.svg";
import { ClipLoader } from "react-spinners";
import Button from "./common/button";
import uploadIcon from "../assets/Icons/upload.svg";
import product from "../assets/Icons/product.svg";
import callRecording from "../assets/Icons/callrecording.svg";
import customer from "../assets/Icons/customer.svg";
import language from "../assets/Icons/language.svg";
import uploadgray from "../assets/Icons/uploadgray.svg";
function CallList() {
  const services = new Service();
  const navigate = useNavigate();
  const location = useLocation();

  const [callData, setCallData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [addcall, setAddcall] = useState(false);
  const [isPending, setisPending] = useState(true);
  const [audiotype, setAudiotype] = useState("");
  const [pageno, setpageno] = useState("");
  const [totalpage, setTotalpage] = useState([]);
  const [totalresult, setTotalresult] = useState("");
  const [data, setdata] = useState("");
  // const [hasnext, setHasnext] = useState("")
  const [maxpage, settMaxpage] = useState("");
  const [bulkupload, setBulkupload] = useState(false);

  const [refreshTime, setRefreshTime] = useState(10000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [supportingInfo, setSupportingInfo] = useState();
  const [supportingInfoPending, setSupportingInfoPending] = useState();
  const [supportingInfoError, setSupportingInfoError] = useState();

  let url = window.location.href;
  url = url.replace(/^.*\/\/[^\/]+/, "");

  useEffect(() => {
    // Reset currentPage to 1 when the component mounts or URL changes
    if (url == "/call-list") {
      setCurrentPage(1);
    }
  }, [location]);
  /**
   * Fetch Call List data
   */
  async function fetchCallList() {
    let url = "api/call/call_list/";
    // console.log("inside", currentPage);
    setError(null);
    const queryParams = new URLSearchParams(window.location.search);

    const page = queryParams.get("page");

    // console.log(page); //
    if (page == null) {
      url = url + `?page=${1}`;
    } else {
      url = url + `?page=${page}`;
    }
    services.get(url).then((res) => {
      // console.log("newwww", res);
      setisPending(false);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        try {
          if (res.code == "token_not_valid") {
            localStorage.clear();
            navigate("/login");
            window.location.reload();
          }
          setCallData(res?.data);
          setTotalpage(res?.pagination?.page_numbers);
          setTotalresult(res?.pagination?.total_results);
          settMaxpage(res?.pagination?.total_pages);
          setdata(res);
          setError(null);
        } catch (e) {
          setError(e);
        }
      }
    });
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/call-list?page=${pageNumber}`);
  };

  function fetchSupportingInfo() {
    services.get("api/call/new_call/").then((res) => {
      // console.log(res);
      setSupportingInfoPending(false);
      if (res == "TypeError: Failed to fetch") {
        setSupportingInfoError("Failed to Fetch");
      } else {
        if (res.code == "token_not_valid") {
          localStorage.clear();
          history.push("/login");
        }

        setSupportingInfo(res);
        setSupportingInfoError(null);
      }
    });
  }

  useEffect(() => {
    fetchCallList();
    fetchSupportingInfo();
  }, [currentPage, url]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCallList();
    }, refreshTime);

    return () => clearInterval(interval);
  }, []);

  console.log(callData);

  useEffect(() => {
    fetchCallList();
  }, []);

  useEffect(() => {
    if (addcall) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addcall]);

  return (
    <div>
      <Header />
      <Nav />
      <div className=" m-4 flex flex-col pb-2">
        <div className="border bg-white mr-2 h-full w-full p-6 rounded-[12px]">
          <div className="flex justify-between items-center border border-[#D0D0D0] px-4 py-2 rounded-[12px]">
            <span className="flex flex-col">
              <span className="flex items-center">
                <img src={call2} alt="call-icon" className="mr-2" />
                <span className="flex flex-col">
                  <span className=" font-medium  text-[18px] text-[#575757]">
                    Calls
                  </span>
                  <span className=" font-medium  text-[18px] text-[#575757] mt-[-4px]">
                    My Calls
                  </span>
                </span>
              </span>
              <ul className=" list-disc ml-4">
                <li> {callData && callData?.length} Items</li>
              </ul>
            </span>

            <span className="flex">
              {/* <button
                className=" px-4  border border-[#171717] py-[6px]  rounded-lg mr-2 flex items-center justify-center"
                onClick={() => setAddcall(true)}
              >
                <img src={plus} alt="plus-icon" className=" mr-2" /> New
              </button> */}
              <Button
                name={"Upload Call"}
                classname={
                  "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#aaa9a8] hover:text-black transition duration-300 ease-out hover:ease-in-out w-auto h-[44px] rounded-lg mr-4 "
                }
                onclick={() => setAddcall(true)}
                imgSrc={plus}
              />
              <button className=" px-4  border border-[#171717] py-[6px]  rounded-lg mr-2 flex items-center justify-center">
                <img src={call} alt="call-icon" className=" mr-2" />
                Live Call
              </button>
            </span>
          </div>
          <table className="w-full mt-4 rounded-[12px] overflow-hidden border-collapse">
            <thead className="bg-[#717171]">
              <tr className="text-[#fff]">
                <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Call Date
                </th>
                <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Agent
                </th>
                <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Call ID
                </th>
                <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Age
                </th>
                <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Product
                </th>
                <th className="text-left py-2 font-medium text-sm border-b border-[#D0D0D0]">
                  Call Type
                </th>
                <th className="text-center p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Sentiments
                </th>
                <th className="text-center p-4 font-medium text-sm border-b border-[#D0D0D0]">
                  Intent
                </th>
              </tr>
            </thead>
            {isPending && (
              <tr
                style={{
                  height: "400px",
                  textAlignVertical: "center",
                  textAlign: "center",
                }}
              >
                <td colSpan="8">
                  <ClipLoader color="#2056FF" size="50px" />
                </td>
              </tr>
            )}
            <tbody>
              {callData?.map((call, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 border-b border-[#D0D0D0]"
                >
                  <td className="p-4 text-sm">{call?._date}</td>
                  <td className="p-4 text-sm">{call?._customer}</td>
                  <td className="p-4 text-sm">{call?._agent}</td>
                  <td className="p-4 text-sm">
                    {call._id.slice(0, 5).toUpperCase()}
                  </td>
                  <td className="p-4 text-sm">
                    {call._language.includes("English")
                      ? "English"
                      : call._language}
                  </td>
                  <td className="p-4 text-sm">
                    {call?._product_name
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </td>
                  <td className="py-2 text-sm">{call?._call_type}</td>
                  {/* {call._intent !== 0 && (
                    <>
                      <td className="p-4 text-sm text-center flex items-center justify-center">
                        {call._sentiment > 0 ? (
                          <p className="red" style={{ color: "green" }}>
                            <i
                              className="fa fa-plus-circle"
                              aria-hidden="true"
                            />
                          </p>
                        ) : (
                          <p className="red" style={{ color: "red" }}>
                            <i
                              className="fa fa-minus-circle"
                              aria-hidden="true"
                            />
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-sm text-center flex items-center justify-center">
                        {call._intent > 0 ? (
                          <p className="red" style={{ color: "green" }}>
                            <i
                              className="fa fa-plus-circle"
                              aria-hidden="true"
                            />
                          </p>
                        ) : (
                          <p className="red" style={{ color: "red" }}>
                            <i
                              className="fa fa-minus-circle"
                              aria-hidden="true"
                            />
                          </p>
                        )}
                      </td>
                    </>
                  )} */}

                  <td className="p-4 text-sm text-center flex items-center justify-center">
                    {call._sentiment > 0 ? (
                      <img src={plusgreen} alt="plus icon" />
                    ) : (
                      <img src={negative} alt="minus icon" />
                    )}
                  </td>
                  <td className="p-4 text-sm text-center">
                    {call._intent > 0 ? (
                      <img src={plusgreen} alt="plus icon" />
                    ) : (
                      <img src={negative} alt="minus icon" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalpage.length}
            onPageChange={handlePageClick}
            totalresult={totalresult}
          />
        </div>
      </div>
      {addcall && (
        <div className="fixed inset-0 flex justify-center bg-gray-500  bg-opacity-90 transition-opacity">
          <div className="bg-white px-12 shadow-lg h-[550px] w-[1000px] relative rounded-xl m-20 py-6 ">
            <div className=" flex justify-center mb-2 items-center text-[28px] font-medium text-[#838383]">
              <img src={callIcon} alt="call-icon" className=" mr-3" />
              Add New Call
            </div>
            <hr className=" border-t-2 mt-2" />
            <div className=" flex flex-wrap mt-8">
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={call}
                    alt="call-icon"
                    className="h-4 w-4 mr-2"
                  ></img>
                  <label className="text-[16px]">Call Type</label>
                </span>
                <select className="mt-2 w-[430px] h-[44px] border border-gray-500 rounded-lg focus:outline-none custom-select px-4 text-gray-400 focus:text-black cursor-pointer">
                  <option
                    value="Select call type"
                    selected
                    disabled
                    className="text-gray-400"
                  >
                    Select Call Type
                  </option>
                  {supportingInfo?.call_type.map((callType, i) => (
                    <option
                      key={i}
                      value={callType.title}
                      className="text-black"
                    >
                      {callType.title}
                    </option>
                  ))}
                </select>
              </span>
              {console.log(supportingInfo)}
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={customer}
                    alt="call-icon"
                    className="h-4 w-4 mr-2"
                  ></img>
                  <label className="text-[16px]">Customer</label>
                </span>
                <select className="mt-2 w-[430px] h-[44px] border border-gray-500 rounded-lg focus:outline-none custom-select px-4 text-gray-400 focus:text-black cursor-pointer">
                  <option
                    value="Select customer"
                    selected
                    disabled
                    className="text-gray-400"
                  >
                    Select Customer
                  </option>

                  {supportingInfo?.customer.map((customer, i) => (
                    <option key={i} value={customer?.first_name}>
                      {customer?.first_name}
                    </option>
                  ))}
                </select>
              </span>
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={product}
                    alt="call-icon"
                    className="h-4 w-4 mr-2"
                  ></img>
                  <label className="text-[16px]">Product</label>
                </span>
                <select className="mt-2 w-[430px] h-[44px] border border-gray-500 rounded-lg focus:outline-none custom-select text-gray-400 focus:text-black px-4 cursor-pointer">
                  <option
                    value="Select customer"
                    selected
                    disabled
                    className="text-gray-400"
                  >
                    Select Product
                  </option>

                  {supportingInfo?.product.map((product, i) => (
                    <option key={i} value={product.title} className="">
                      {product.title}
                    </option>
                  ))}
                </select>
              </span>
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={callRecording}
                    alt="call-icon"
                    className="h-4 w-4 mr-2 "
                  ></img>
                  <label className="text-[16px]">Call Recording</label>
                </span>
                <input
                  type="file"
                  placeholder="Select call recording"
                  className="mt-2 w-[430px] h-[44px] border border-gray-500 rounded-lg focus:outline-none custom-select 
                 text-gray-400 focus:text-black px-4 py-2 cursor-pointer"
                />
              </span>
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={language}
                    alt="call-icon"
                    className="h-4 w-4 mr-2"
                  ></img>
                  <label className="text-[16px]">Language</label>
                </span>
                <select
                  className="mt-2 w-[430px] h-[44px] border border-gray-500 rounded-lg focus:outline-none custom-select 
                 text-gray-400 focus:text-black px-4 cursor-pointer"
                >
                  <option value="Select Language" className="text-gray-400">
                    Select Language
                  </option>
                  {supportingInfo.language.map((languageItem, i) => (
                    <option value={languageItem.code} key={i}>
                      {languageItem.title}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            <div className="group border border-[#171717] border-dashed custom-dotted-hr text-center flex items-center justify-center mt-2 p-2 rounded-lg hover:bg-[#9C94B8]  text-[#696969] transition-colors duration-200 hover:text-black cursor-pointer">
              <img
                src={uploadgray}
                alt="upload-icon"
                className="mr-2 transition-all duration-200 group-hover:filter group-hover:brightness-0 h-4 w-4"
              />
              Bulk Upload
            </div>
            <hr className=" mt-6 border-t-2" />
            <hr className=" bottom-8 absolute" />
            <div className="flex justify-end">
              <div className="flex bottom-6 justify-end absolute">
                <Button
                  name={"Cancel"}
                  classname={
                    "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center mr-6 p-[10px] hover:bg-[#FF0000] hover:text-white transition duration-300 ease-out hover:ease-in-out w-[150px] h-[44px] rounded-lg"
                  }
                  onclick={() => setAddcall(false)}
                />
                <Button
                  name={"Upload"}
                  classname={
                    "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#11AE00] hover:text-white transition duration-300 ease-out hover:ease-in-out w-[150px] h-[44px] rounded-lg bg-[#271078] text-white"
                  }
                  onclick={() => {}}
                  imgSrc={uploadIcon}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CallList;
