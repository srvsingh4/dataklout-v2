import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Nav from "../nav";
import Header from "./header";
import Progressbar from "./common/progressbar";
import plus from "../assets/Icons/plus.svg";
// import closeIcon from "../assets/Icons/close.svg";
import call from "../assets/Icons/call.svg";
import callIcon from "../assets/Icons/addcall.svg";
import call2 from "../assets/Icons/call2.svg";
import close from "../assets/Icons/close.svg";
import Pagination from "./common/pagination";
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
import { ToastContainer, toast } from "react-toastify";
import errorIcon from "../assets/Icons/error.svg";
import PulseLoader from "react-spinners/PulseLoader";
import Tableskeleton from "./common/tableSkeleton";

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

  const [totalpage, setTotalpage] = useState([]);
  const [totalresult, setTotalresult] = useState("");
  const [maxpage, settMaxpage] = useState("");
  const [bulkupload, setBulkupload] = useState(false);

  const [refreshTime, setRefreshTime] = useState(10000);

  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [supportingInfo, setSupportingInfo] = useState();
  const [supportingInfoPending, setSupportingInfoPending] = useState();
  const [supportingInfoError, setSupportingInfoError] = useState();
  const [uploadPending, setUploadPending] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [callUploadProgress, setCallUploadProgress] = useState(0);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [bulkerror, setBulkerror] = useState({});
  // const [callUploadSucess, setCallUploadSucess] = useState(false);
  const [addBulkCall, setAddBulkCall] = useState([]);
  const [uploadData, setUploadData] = useState({
    call_type: "",
    product: "",
    language_code: "",
    customer_id: "",
    file: null,
  });

  const [bulkcalldata, setBulkcalldata] = useState({
    call_type: "",
    product: "",
    language_code: "",
    customer_id: "",
    files: null,
  });
  //  const [totalDuration, setTotalDuration] = useState(0);
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
          navigate("/login");
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

  // console.log(callData);

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

  useEffect(() => {
    setSupportingInfoErrors({});
    setBulkerror({});
  }, [bulkupload]);

  const handleUpload = function (key, value) {
    setUploadData({ ...uploadData, [key]: value });
  };
  const clearError = (key) => {
    setSupportingInfoErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key];
      return newErrors;
    });
    setBulkerror((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key];
      return newErrors;
    });
  };
  // console.log(uploadData);

  const [supportingInfoErrors, setSupportingInfoErrors] = useState({});

  const uploadCallRecording = async () => {
    // console.log("inside call recording function ");
    setCallUploadProgress(0);
    setUploadError(null);
    setSupportingInfoErrors({});

    const errors = {};

    if (!uploadData.call_type) {
      errors.call_type = "Please Select Call Type";
    }

    if (!uploadData.product) {
      errors.product = "Please Select one product";
    }

    if (!uploadData.language_code) {
      errors.language = "Please Select one language";
    }

    if (!uploadData.customer_id) {
      errors.customer_id = "Please Select one customer";
    }

    if (!uploadData.file) {
      errors.file = "Please select one audio recording file";
    }
    // if (audiotype !== "wav") {
    //   errors.format = "Please check the call recording format i.e wav";
    // }
    if (Object.keys(errors).length > 0) {
      setSupportingInfoErrors(errors);
      // console.log("hyhy0", errors);
      return;
    }
    setUploadPending(true);
    try {
      const formData = new FormData();
      formData.append("call_type", uploadData.call_type);
      formData.append("product", uploadData.product);
      formData.append("language_code", uploadData.language_code);
      formData.append("customer_id", uploadData.customer_id);
      formData.append("file", uploadData.file);

      // var url = services.domain + "/api/call/new_call/";

      const response = await axios.post(
        "https://fb.dataklout.com/api/call/new_call/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          onUploadProgress: (p) => {
            setCallUploadProgress(
              Math.round((p.loaded * 100) / uploadData?.file.size)
            );
          },
        }
      );

      // console.log("hyhy", "from function");
      setUploadPending(false);
      setUploadError(null);
      // console.log(response.data.message);
      setUploadData({
        call_type: "",
        product: "",
        language_code: "",
        customer_id: "",
        file: null,
      });
      setAddcall(false);
      fetchCallList();
      toast.success(
        <div className="flex flex-col">
          <div>
            <div>
              {response.data.message[0].toUpperCase() +
                response.data.message.slice(1)}
            </div>
          </div>
          <span>Your call uploaded successfully</span>
        </div>
      );
      // setCallUploadSucess(true);
      setCurrentPage(1);
      // console.log("last of the then block");

      // console.log("Responseeeeeeee:", response.data);
    } catch (error) {
      // console.log("coming here");
      toast.error("Upload failed", error);
      setUploadPending(false);
      setUploadError(error.message);
      // toast.error("Error", "Failed to upload call");
    }
  };

  const handelBulkcall = (key, value) => {
    setBulkerror(false);
    setBulkcalldata({ ...bulkcalldata, [key]: value });
  };

  const addBulklist = function (e) {
    e.preventDefault();
    setBulkerror({});

    const error = {};

    if (!bulkcalldata?.call_type) {
      error.call_type = "Please Select Call Type";
      // console.log(error);
    }

    if (!bulkcalldata?.product) {
      error.product = "Please Select one product";
    }

    if (!bulkcalldata?.language_code) {
      error.language_code = "Please Select one language";
    }

    if (!bulkcalldata?.customer_id) {
      error.customer_id = "Please Select one customer";
    }

    if (!bulkcalldata?.files) {
      error.files = "Please select one audio recording file";
    }
    // if (bulkcalldata?.files.name.split(".").pop() !== "wav") {
    //   setSupportingInfoError("Please check the call recording format i.e wav");
    //   return;
    // }

    // console.log(bulkcalldata);
    // if block here can be eliminated but i m just being double sure about the call data by putting a checker again  setting the call error info
    if (Object.keys(error).length > 0) {
      setBulkerror(error);
      // console.log("hyhy0", error);
      return;
    }
    if (
      bulkcalldata.call_type &&
      bulkcalldata.product &&
      bulkcalldata.language_code &&
      bulkcalldata.customer_id &&
      bulkcalldata.files
    ) {
      setAddBulkCall((prev) => [...prev, bulkcalldata]);
      // setCallName((prev) => [...prev, bulkcalldata.files]);
      setBulkcalldata({
        call_type: "",
        product: "",
        language_code: "",
        customer_id: "",
        files: null,
      });

      setFileInputKey((prevKey) => prevKey + 1);
    } else {
      toast.error("Enter Call Details");
    }
  };

  const handleDeleteCall = (index) => {
    setAddBulkCall((prevCalls) => prevCalls.filter((_, i) => i !== index));
  };
  // console.log("bulkkkkkkkkkk", bulkcalldata);

  // console.log("supporting error --------------------", bulkerror);
  // console.log("call dataaaaaaa", addBulkCall);

  const uploadBulkCallRecording = async function () {
    if (addBulkCall.length >= 1) {
      setUploadPending(true);
      setisPending(true);
      var url = "https://fb.dataklout.com/api/call/tbulk_upload/";
      let formData = new FormData();

      addBulkCall.forEach((call, index) => {
        // console.log(call);
        // console.log(Object.keys(call));
        Object.keys(call).forEach((key) => {
          if (key === "files" && call[key] instanceof File) {
            formData.append(`${key}`, call[key]);
          } else {
            formData.append(`${key}`, call[key]);
          }
        });
      });

      await axios
        .request({
          method: "post",
          url: url,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        })
        .then((response) => {
          setUploadPending(false);
          setisPending(false);
          setUploadError(null);
          setAddBulkCall([]);
          setBulkupload(false);

          if (response.data.message === "success") {
            setBulkcalldata({
              call_type: "",
              product: "",
              language_code: "",
              customer_id: "",
              file: null,
            });
            setAddcall(false);
            fetchCallList();
            toast.success(
              <div className="flex flex-col">
                <div>
                  <div>
                    {response.data.message[0].toUpperCase() +
                      response.data.message.slice(1)}
                  </div>
                </div>
                <span>Your call uploaded successfully</span>
              </div>
            );
          } else {
            setUploadPending(false);
            setUploadError(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error uploading call:", error);
          setUploadPending(false);
          setUploadError("An error occurred while uploading the call.");
        });
    } else {
      toast.error(
        <div className="flex flex-col">
          <div>Call upload List is empty</div>

          <span>Enter Call Details</span>
        </div>
      );
    }
  };

  const openCallInsight = function (callId, intent) {
    if (intent !== 0) {
      navigate(`/call/${callId}/call-insight`);
    }
  };

  return (
    <div>
      <Header />
      <Nav />
      <ToastContainer
        position="top-right"
        theme="colored"
        hideProgressBar={false}
      />
      <div className="m-2 flex flex-col mb-2">
        <div className="border bg-white mr-2 h-full w-full p-6 rounded-[12px] mb-[55px]">
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
              <Button
                name={"Upload Call"}
                classname={
                  "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out w-auto h-[44px] rounded-lg mr-4 "
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
          {isPending ? (
            <Tableskeleton thead={9} trow={10} tcol={9} />
          ) : (
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
                  <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                    Sentiments
                  </th>
                  <th className="text-left p-4 font-medium text-sm border-b border-[#D0D0D0]">
                    Intent
                  </th>
                </tr>
              </thead>

              {/* {console.log(callData)} */}
              <tbody>
                {callData?.map((call, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 border-b border-[#D0D0D0] cursor-pointer"
                    onClick={() => openCallInsight(call?._id, call?._intent)}
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
                    <td className="py-4 px-2 text-sm">
                      {call?._product_name
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </td>
                    <td className="py-2 text-sm">{call?._call_type}</td>
                    {call._intent !== 0 ? (
                      <>
                        <td className="p-4 text-sm">
                          {call._sentiment > 0 ? (
                            <img src={plusgreen} alt="plus icon" />
                          ) : (
                            <img src={negative} alt="minus icon" />
                          )}
                        </td>
                        <td className="p-4 text-sm">
                          {call._intent > 0 ? (
                            <img src={plusgreen} alt="plus icon" />
                          ) : (
                            <img src={negative} alt="minus icon" />
                          )}
                        </td>
                      </>
                    ) : (
                      localStorage.getItem("collection_module") === "true" && (
                        <td
                          colSpan="4"
                          data-toggle="tooltip"
                          data-placement="left"
                          title={call._processing_status}
                        >
                          {call._processing_status !== "Failed" ? (
                            <div className="flex items-center">
                              <div className="flex-grow">
                                <Progressbar
                                  bgcolor="#271078"
                                  progress={call._progress}
                                  height={20}
                                />
                              </div>
                              <div className="m-2">
                                <PulseLoader color="#2056FF" size="8px" />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <img src={close} />
                              Call Processing Failed, Need Action
                              <a
                                // onClick={() => removeFailedItem(call._id)}
                                className="pull-right"
                                style={{ color: "red" }}
                              >
                                <img src={close} alt="close" /> Remove
                              </a>
                            </div>
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
          <div
            className={`bg-white p-12 shadow-lg  w-[1000px] relative rounded-xl m-20 py-6 ${
              Object.keys(supportingInfoErrors).length ||
              Object.keys(bulkerror).length
                ? "h-[600px]"
                : "h-[550px]"
            }`}
          >
            <div className=" flex justify-center mb-2 items-center text-[28px] font-medium text-[#838383]">
              <img src={callIcon} alt="call-icon" className=" mr-3" />
              {!bulkupload ? "Add New Call" : "Add Bulk Calls"}
            </div>
            <hr className=" border-t-2 mt-2" />
            {!bulkupload ? (
              <div className=" flex flex-wrap mt-5">
                <span className="flex flex-col mb-4 mr-5">
                  <span className=" flex items-center ">
                    <img
                      src={call}
                      alt="call-icon"
                      className="h-4 w-4 mr-2"
                    ></img>
                    <label className="text-[16px]">Call Type</label>
                  </span>

                  <select
                    className={`mt-2 w-[430px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4 ${
                      uploadData.call_type ? "text-black" : "text-gray-400"
                    } focus:text-black cursor-pointer
                   ${
                     supportingInfoErrors.call_type
                       ? "border border-[#f50a0a]"
                       : "border-gray-500"
                   }`}
                    onChange={(e) => handleUpload("call_type", e.target.value)}
                    onFocus={() => clearError("call_type")}
                    name="call_type"
                    id="call_type"
                    value={uploadData.call_type}
                  >
                    <option
                      value=""
                      // selected
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
                  {supportingInfoErrors.call_type && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {supportingInfoErrors.call_type}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
                </span>

                <span className="flex flex-col mb-4 mr-5">
                  <span className=" flex items-center ">
                    <img
                      src={customer}
                      alt="call-icon"
                      className="h-4 w-4 mr-2"
                    ></img>
                    <label className="text-[16px]">Customer</label>
                  </span>
                  <select
                    className={`mt-2 w-[430px] h-[44px] border rounded-lg focus:outline-none custom-select px-4 ${
                      uploadData.customer_id ? "text-black" : "text-gray-400"
                    } focus:text-black cursor-pointer ${
                      supportingInfoErrors.customer_id
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    onChange={(e) =>
                      handleUpload("customer_id", e.target.value)
                    }
                    onFocus={() => clearError("customer_id")}
                    name="customer_id"
                    id="customer_id"
                    value={uploadData.customer_id}
                  >
                    <option
                      value=""
                      // selected
                      disabled
                      className="text-gray-400"
                    >
                      Select Customer
                    </option>

                    {supportingInfo?.customer.map((customer, i) => (
                      <option key={i} value={customer?.id}>
                        {customer?.first_name}
                      </option>
                    ))}
                  </select>
                  {supportingInfoErrors.customer_id && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {supportingInfoErrors.customer_id}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
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
                  <select
                    className={`mt-2 w-[430px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4 ${
                      uploadData.product ? "text-black" : "text-gray-400"
                    }  focus:text-black cursor-pointer ${
                      supportingInfoErrors.product
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    onChange={(e) => handleUpload("product", e.target.value)}
                    onFocus={() => clearError("product")}
                    name="product"
                    id="product"
                    value={uploadData.product}
                  >
                    <option
                      value=""
                      // selected
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
                  {supportingInfoErrors.product && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {supportingInfoErrors.product}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
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
                    className={`mt-2 w-[430px] h-[44px] border rounded-lg focus:outline-none custom-select px-4 py-2 ${
                      uploadData.file ? "text-black" : "text-gray-400"
                    } focus:text-black cursor-pointer ${
                      supportingInfoErrors.file
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    accept=".wav"
                    onChange={(e) => handleUpload("file", e.target.files[0])}
                    onFocus={() => clearError("file")}
                  />
                  {supportingInfoErrors.file && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {supportingInfoErrors.file}{" "}
                      </span>
                    </div>
                  )}
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
                    className={`mt-2 w-[430px] h-[44px] border rounded-lg focus:outline-none custom-select px-4 ${
                      uploadData.language_code ? "text-black" : "text-gray-400"
                    }  focus:text-black cursor-pointer ${
                      supportingInfoErrors.language
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    onChange={(e) =>
                      handleUpload("language_code", e.target.value)
                    }
                    onFocus={() => clearError("language")}
                    name="language_code"
                    id="language_code"
                    value={uploadData.language_code}
                  >
                    <option value="" className="text-gray-400">
                      Select Language
                    </option>
                    {supportingInfo.language.map((languageItem, i) => (
                      <option value={languageItem.code} key={i}>
                        {languageItem.title}
                      </option>
                    ))}
                  </select>
                  {supportingInfoErrors.language && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {supportingInfoErrors.language}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
                </span>
              </div>
            ) : (
              <div className=" flex flex-wrap mt-5">
                <span className="flex flex-col mb-4 mr-5">
                  <span className=" flex items-center ">
                    <img
                      src={call}
                      alt="call-icon"
                      className="h-4 w-4 mr-2"
                    ></img>
                    <label className="text-[16px]">Call Type</label>
                  </span>

                  <select
                    className={`mt-2 w-[430px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4 ${
                      bulkcalldata.call_type ? "text-black" : "text-gray-400"
                    } focus:text-black cursor-pointer
                   ${
                     bulkerror.call_type
                       ? "border border-[#f50a0a]"
                       : "border-gray-500"
                   }`}
                    onChange={(e) =>
                      handelBulkcall("call_type", e.target.value)
                    }
                    onFocus={() => clearError("call_type")}
                    name="call_type"
                    id="call_type"
                    value={bulkcalldata.call_type}
                  >
                    <option
                      value=""
                      // selected
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
                  {bulkerror.call_type && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {bulkerror.call_type}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
                </span>

                <span className="flex flex-col mb-4 mr-5">
                  <span className=" flex items-center ">
                    <img
                      src={customer}
                      alt="call-icon"
                      className="h-4 w-4 mr-2"
                    ></img>
                    <label className="text-[16px]">Customer</label>
                  </span>
                  <select
                    className={`mt-2 w-[430px] h-[44px] border rounded-lg focus:outline-none custom-select px-4 ${
                      bulkcalldata.customer_id ? "text-black" : "text-gray-400"
                    } focus:text-black cursor-pointer ${
                      bulkerror.customer_id
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    onChange={(e) =>
                      handelBulkcall("customer_id", e.target.value)
                    }
                    onFocus={() => clearError("customer_id")}
                    name="customer_id"
                    id="customer_id"
                    value={bulkcalldata.customer_id}
                  >
                    <option
                      value=""
                      // selected
                      disabled
                      className="text-gray-400"
                    >
                      Select Customer
                    </option>

                    {supportingInfo?.customer.map((customer, i) => (
                      <option
                        key={i}
                        value={customer?.id}
                        // onChange={(e) =>
                        //   handelBulkcall("customer_id", e.target.value)
                        // }
                      >
                        {customer?.first_name}
                      </option>
                    ))}
                  </select>
                  {bulkerror.customer_id && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {bulkerror.customer_id}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
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
                  <select
                    className={`mt-2 w-[430px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4 ${
                      bulkcalldata.product ? "text-black" : "text-gray-400"
                    }  focus:text-black cursor-pointer ${
                      bulkerror.product
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    onChange={(e) => handelBulkcall("product", e.target.value)}
                    onFocus={() => clearError("product")}
                    name="product"
                    id="product"
                    value={bulkcalldata.product}
                  >
                    <option
                      value=""
                      // selected
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
                  {bulkerror.product && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {bulkerror.product}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
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
                    key={fileInputKey}
                    type="file"
                    placeholder="Select call recording"
                    className={`mt-2 w-[430px] h-[44px] border rounded-lg focus:outline-none custom-select px-4 py-2 ${
                      bulkcalldata.file ? "text-black" : "text-gray-400"
                    } focus:text-black cursor-pointer ${
                      bulkerror.file ? "border-[#f50a0a] " : "border-gray-500"
                    }`}
                    accept=".wav"
                    onChange={(e) => handelBulkcall("files", e.target.files[0])}
                    onFocus={() => clearError("files")}
                  />
                  {bulkerror.files && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {bulkerror.files}{" "}
                      </span>
                    </div>
                  )}
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
                    className={`mt-2 w-[430px] h-[44px] border rounded-lg focus:outline-none custom-select px-4 ${
                      bulkcalldata.language_code
                        ? "text-black"
                        : "text-gray-400"
                    }  focus:text-black cursor-pointer ${
                      bulkerror.language
                        ? "border-[#f50a0a] "
                        : "border-gray-500"
                    }`}
                    onChange={(e) =>
                      handelBulkcall("language_code", e.target.value)
                    }
                    onFocus={() => clearError("language")}
                    name="language_code"
                    id="language_code"
                    value={bulkcalldata.language_code}
                  >
                    <option value="" className="text-gray-400">
                      Select Language
                    </option>
                    {supportingInfo.language.map((languageItem, i) => (
                      <option value={languageItem.code} key={i}>
                        {languageItem.title}
                      </option>
                    ))}
                  </select>
                  {bulkerror.language_code && (
                    <div className="flex items-center mt-1">
                      <img
                        src={errorIcon}
                        alt="error-icon"
                        className="h-4 w-4 mr-1"
                      />
                      <span className=" text-[#f50a0a] text-[14px]">
                        {bulkerror.language_code}{" "}
                      </span>
                      {/* {uploadError && <p className="errorColor">{uploadError}</p>} */}
                    </div>
                  )}
                </span>
              </div>
            )}

            <div
              className="group border border-[#171717] border-dashed custom-dotted-hr text-center flex items-center justify-center mt-2 p-2 rounded-lg hover:bg-[#9C94B8]  text-[#696969] transition-colors duration-200 hover:text-black cursor-pointer"
              onClick={() => {
                setBulkupload(!bulkupload);
              }}
            >
              <img
                src={uploadgray}
                alt="upload-icon"
                className="mr-2 transition-all duration-200 group-hover:filter group-hover:brightness-0 h-4 w-4"
              />
              {!bulkupload ? "Bulk Upload" : "Single Upload"}
            </div>

            {/* progress bar */}
            {supportingInfoPending && (
              <div className="empty-call">Loading...</div>
            )}
            {/* 
            {/* <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full text-xs"
                style={{ width: "45%" }}
              >
                45%
              </div>
            </div> */}
            {!supportingInfoErrors && <hr className=" mt-6 border-t-2" />}
            {/* <hr className=" bottom-4 absolute" /> */}
            <div className="flex justify-end">
              <div className="flex bottom-5 justify-end absolute">
                <Button
                  name={"Cancel"}
                  classname={
                    "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center mr-6 p-[10px] hover:bg-[#FF0000] hover:text-white transition duration-300 ease-out hover:ease-in-out w-[150px] h-[44px] rounded-lg"
                  }
                  onclick={() => {
                    setAddcall(false);
                    setBulkcalldata({
                      call_type: "",
                      product: "",
                      language_code: "",
                      customer_id: "",
                      file: null,
                    });
                    setUploadData({
                      call_type: "",
                      product: "",
                      language_code: "",
                      customer_id: "",
                      file: null,
                    });
                    setBulkupload(false);
                    setSupportingInfoErrors({});
                    setBulkerror({});
                  }}
                />
                {bulkupload && (
                  <Button
                    name={"Add Call"}
                    classname={`border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-orange-600 transition duration-300 ease-out hover:ease-in-out w-[150px] h-[44px] rounded-lg mr-6 hover:text-white`}
                    onclick={addBulklist}
                    // imgSrc={uploadIcon}
                  />
                )}

                <Button
                  name={"Upload"}
                  classname={`border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] ${
                    !isPending ? "hover:bg-[#11AE00]" : ""
                  }  hover:text-white transition duration-300 ease-out hover:ease-in-out w-[150px] h-[44px] rounded-lg bg-[#271078] text-white`}
                  onclick={
                    !bulkupload ? uploadCallRecording : uploadBulkCallRecording
                  }
                  imgSrc={uploadIcon}
                  isPending={isPending}
                />
              </div>
            </div>
            {uploadPending && (
              <div className="mt-4">
                <Progressbar
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Tooltip on top"
                  bgcolor="#271078"
                  progress={callUploadProgress}
                  height={20}
                />
              </div>
            )}
            {bulkupload && (
              <div
                className={`absolute right-[75px] ${
                  bulkerror ? "bottom-[175px]" : "bottom-[175px]"
                } ${bulkerror ? "" : ""}`}
              >
                <div className="h-[105px] w-[425px] ">
                  <div className=" flex justify-end">
                    Total calls Added: {addBulkCall.length}
                  </div>
                  <div
                    className="overflow-scroll role"
                    style={{ height: "80px" }}
                  >
                    {addBulkCall.length ? (
                      <div className="flex">
                        <ul className="!list-disc ml-8">
                          {addBulkCall?.map((e, i) => (
                            <li
                              className=" flex justify-between items-center "
                              key={i}
                            >
                              - {e.files.name}
                              <span
                                className="cursor-pointer"
                                style={{
                                  marginTop: "4px",
                                  marginLeft: "20px",
                                }}
                                onClick={() => handleDeleteCall(i)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-x"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <ul className=" list-disc ml-8">
                        <li>No Calls Added to Upload list</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CallList;
