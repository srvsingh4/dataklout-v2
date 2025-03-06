import Header from "./header";
import Nav from "../nav";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import Service from "./webservice/http";
import { useNavigate } from "react-router-dom";
import callInsightIcon from "../assets/icons/call-insight.svg";
import call from "../assets/icons/call-callInsight.svg";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import wave from "../assets/icons/wave.svg";
import cxScore from "../assets/icons/cxScore.svg";
import cIntent from "../assets/icons/cIntent.svg";
import resolutionIcon from "../assets/icons/resolution.svg";
import problrmfound from "../assets/icons/problrmfound.svg";
import agent from "../assets/icons/agent.svg";
import customerI from "../assets/icons/customerI.svg";
import plusgreen from "../assets/icons/plusgreen.svg";
import minusred from "../assets/icons/minusred.svg";
import person from "../assets/icons/person-mag.svg";
import voice from "../assets/icons/voice.svg";
import text from "../assets/icons/text.svg";
import summary from "../assets/icons/call-summary.svg";
import clock from "../assets/icons/clock-black.svg";
import playIcon from "../assets/icons/play.svg";
import loadingImg from "../assets/images/loading.svg";
import topKeyword from "../assets/icons/top-keywords.svg";
import transcription from "../assets/icons/trans.svg";
import money from "../assets/icons/money.svg";
import agentIc from "../assets/icons/agentI.svg";
import personIc from "../assets/icons/person.svg";
import archive from "../assets/icons/archived.svg";
import calldatabase from "../assets/icons/calllines.svg";
import plus from "../assets/icons/plus2.svg";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { useParams } from "react-router-dom";
import Button from "./common/button";
import Tableskeleton from "./common/tableSkeleton";
import BlockSkeleton from "./common/blockSkeleton";
import Loading from "./common/loading";
import Highlighter from "react-highlight-words";
import callIcon from "../assets/icons/addcall.svg";
import product from "../assets/icons/product.svg";
import keyword from "../assets/icons/top-keywords.svg";
import status from "../assets/icons/status.svg";

function Callinsight() {
  const services = new Service();
  const navigate = useNavigate();
  const { callID } = useParams();
  const [callInsight, setCallInsight] = useState(null);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [activeTranscript, setActiveTranscript] = useState(null);
  const [opportunity, setopportunity] = useState(false);

  const [isLanguageEnglish, setIsLanguageEnglish] = useState(true);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  var english = true;
  // var ci = null;
  // const [activeKey, setActiveKey] = useState("Product");
  const [openpara, setOpenpara] = useState(false);
  const [archivecall, setArchivecall] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function fetchData() {
    setError("");
    setIsPending(true);
    setCallInsight(null);
    services.get(`api/call/${callID}/call_insight/`).then((res) => {
      console.log("call Insight Info", res);
      setIsPending(false);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        if (res.code == "token_not_valid") {
          localStorage.clear();
          navigate("/login");
        }
        setCallInsight(res);
        // setupdatedCallInsight({
        //   name: res.name,
        //   request_type: res.request_type,
        //   product: res.product,
        //   buy: res.buy,
        //   sell: res.sell,
        //
        //   amount: res.amount,
        //   company_name: res.company_name,
        //
        //   price: res.price,
        //   shares: res.shares,
        //
        //   final_price: res.final_price,
        //   units: res.units,
        //   date: res.date,
        //   folio_number: res.folio_number,
        //
        //   contract_number: res.contract_number,
        //   quantity: res.quantity,
        // });
        // console.log(res, "checking");
        if (res.language !== "English") {
          setIsLanguageEnglish(false);
          setDisplayEnglish(false);
          english = false;
        }

        // ci = res;
        setError("");

        // wavesurferRef.current.load(res?.audio_file);
      }
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const capitalizeTwoWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    if (archivecall) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [archivecall]);

  // archive call function
  const markArchive = function () {
    var data = {
      archive_status: true,
    };
    services.post(`api/call/${callID}/mark_archive/`, data).then((res) => {
      // console.log(res);
      if (res == "TypeError: Failed to fetch") {
        // console.log("failed to fetch user");
      } else {
        toast.success("Success", "Call Archived");
        setArchivecall(false);
        navigate("/call-list");
      }
    });
  };
  const [transcriptions, setTranscriptions] = useState([]); // Full transcription list
  const transcriptRef = useRef(null); // Reference to the transcription div

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (waveformRef.current && callInsight?.audio_file) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#2196f3",
        url: `${callInsight?.audio_file}`,
        minPxPerSec: 100,
        plugins: [TimelinePlugin.create()],
        height: 200,
      });

      wavesurferRef.current.load(callInsight.audio_file);

      wavesurferRef.current.on("play", () => setIsPlaying(true));
      wavesurferRef.current.on("pause", () => setIsPlaying(false));
      wavesurferRef.current.on("finish", () => setIsPlaying(false));

      // Sync transcription with audio time
      const updateTranscription = () => {
        const currentTime = wavesurferRef.current.getCurrentTime();
        const activeDialogue = callInsight.speech.find(
          (entry) =>
            currentTime >= entry.startTime && currentTime <= entry.endTime
        );
        if (activeDialogue) {
          setActiveTranscript(activeDialogue.dialogue);
          // Optionally scroll to the active dialogue (see below)
        } else {
          setActiveTranscript(null); // Clear if no active dialogue
        }
      };

      wavesurferRef.current.on("audioprocess", updateTranscription);
      wavesurferRef.current.on("seek", updateTranscription); // Update on manual seek

      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [callInsight?.audio_file]);

  useEffect(() => {
    if (callInsight?.speech) {
      setTranscriptions(callInsight.speech);
    }
  }, [callInsight]);

  // Auto-scroll to active transcript
  useEffect(() => {
    if (transcriptRef.current && activeTranscript) {
      const activeElement =
        transcriptRef.current.querySelector(`[data-active="true"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [activeTranscript]);

  const handlePlayPause = () => {
    console.log("getting here");
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };
  useEffect(() => {
    if (archivecall || opportunity) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [archivecall, opportunity]);
  return (
    <div>
      <Header />
      <Nav />
      <ToastContainer
        position="top-right"
        theme="colored"
        hideProgressBar={false}
      />
      <div className="m-2 flex flex-col pb-2">
        <div className="border bg-white mr-2 h-full w-full px-4 py-3 rounded-[12px]">
          <div className="flex justify-between items-center border border-[#D0D0D0] px-4 py-2 rounded-[12px]">
            <span className="flex flex-col">
              <span className="flex items-center">
                <img src={callInsightIcon} alt="call-icon" className="mr-2" />
                <span className="flex flex-col">
                  <span className="font-normal text-[18px] text-[#575757]">
                    Call Insight
                  </span>
                  <span className="font-medium  text-[18px] text-[#171717] mt-[-4px]">
                    Customer: ( Ref# :OP86025 )
                  </span>
                </span>
              </span>
            </span>
            <div className=" flex">
              <Button
                classname={
                  "border border-[#C3C3C3] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out w-auto h-[44px] rounded-lg mr-4 "
                }
                name={"Archive call"}
                onclick={() => setArchivecall(true)}
                imgSrc={archive}
                isPending={""}
              />
              <Button
                classname={
                  "border border-[#C3C3C3] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out w-auto h-[44px] rounded-lg mr-4 "
                }
                name={"New Opportunity"}
                onclick={() => setopportunity(true)}
                imgSrc={plus}
                isPending={""}
              />
            </div>
          </div>
        </div>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 2 }}
          gutterBreakpoints={{ 350: "12px", 750: "6px", 1200: "24px" }}
          className="mb-4 mt-2"
        >
          <Masonry>
            <div className=" bg-white w-full rounded-[12px] px-4 py-5">
              <div className=" flex justify-between">
                <span className=" flex items-center">
                  <img src={call} alt="call-icon" className=" mr-2 h-5 w-5" />
                  <span className="text-[18px] leading-7">Call Insight</span>
                </span>

                <Button
                  name={" Deep Analysis"}
                  classname={
                    "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out w-auto h-[44px] rounded-lg mr-4"
                  }
                  // onclick={() => setAddcall(true)}
                  imgSrc={wave}
                />
              </div>
              <div className="flex mt-4 justify-around">
                <span
                  className="border border-gray-400 h-[160px] w-[170px] rounded-xl bg-white mr-2 p-4"
                  style={{ display: "block" }}
                >
                  <div className="flex items-center">
                    <img
                      src={cxScore}
                      alt=""
                      className="mr-2 h-[50px] w-[50px]"
                    />
                    <span className=" text-[18px] font-medium leading-7">
                      Cx <br /> Score
                    </span>
                  </div>
                  {isPending ? (
                    <Loading blockNo={1} />
                  ) : (
                    <div className=" text-2xl font-semibold leading-9 mt-6 ml-2 text-[#3B3B3B] flex items-center">
                      {/* <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div> */}
                      {callInsight?.cx_score}%
                    </div>
                  )}
                </span>
                <span
                  className="border border-gray-400 h-[160px] w-[170px] rounded-xl bg-white mr-2 p-4"
                  style={{ display: "block" }}
                >
                  <div className="flex items-center">
                    <img
                      src={problrmfound}
                      alt=""
                      className="mr-2 h-[50px] w-[50px]"
                    />
                    <span className=" text-[18px] font-medium leading-7">
                      Problem
                      <br />
                      Found
                    </span>
                  </div>
                  {isPending ? (
                    <Loading blockNo={1} />
                  ) : (
                    <div className=" text-2xl font-semibold leading-9 mt-6 ml-2 text-[#3B3B3B] flex items-center">
                      {/* <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div> */}
                      {callInsight?.problen === "true" ? "Yes" : "No"}
                    </div>
                  )}
                </span>
                <span
                  className="border border-gray-400 h-[160px] w-[170px] rounded-xl bg-white mr-2 p-4"
                  style={{ display: "block" }}
                >
                  <div className="flex items-center">
                    <img
                      src={cIntent}
                      alt=""
                      className="mr-2 h-[50px] w-[50px]"
                    />
                    <span className=" text-[18px] font-medium leading-7">
                      Customer <br /> Intent
                    </span>
                  </div>
                  {isPending ? (
                    <Loading blockNo={1} />
                  ) : (
                    <div className=" text-2xl font-semibold leading-9 mt-6 ml-2 text-[#3B3B3B] flex items-center">
                      {/* <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div> */}
                      {callInsight?.intent > 0 ? "Positive" : "Negative"}
                    </div>
                  )}
                </span>
                <span
                  className="border border-gray-400 h-[160px] w-[170px] rounded-xl bg-white mr-2 p-4"
                  style={{ display: "block" }}
                >
                  <div className="flex items-center">
                    <img
                      src={resolutionIcon}
                      alt=""
                      className="mr-2 h-[50px] w-[50px]"
                    />
                    <span className=" text-[18px] font-medium leading-7">
                      Resolution
                    </span>
                  </div>

                  {isPending ? (
                    <Loading blockNo={1} />
                  ) : (
                    <div className=" text-2xl font-semibold leading-9 mt-8 ml-2 text-[#3B3B3B] flex items-center  px-4">
                      {/* <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div> */}
                      {callInsight?.resolution ? "Yes" : "No"}
                    </div>
                  )}
                </span>
              </div>
            </div>
            <div className=" bg-white w-full rounded-[12px] px-4 py-2 flex justify-between text-[18px] leading-7">
              <div className=" flex justify-center">
                Agent Sentiment :{" "}
                {callInsight?.agent_sentiment > 0 ? (
                  <img src={plusgreen} alt="plus-icon" className="ml-1 mr-1" />
                ) : (
                  <img src={minusred} alt="minus-icon" className="ml-1 mr-1" />
                )}
                {Math.abs((callInsight?.agent_sentiment * 100).toFixed(2))} %
              </div>
              <div className=" flex justify-center">
                Customer Sentiment :
                {callInsight?.customer_sentiment > 0 ? (
                  <img src={plusgreen} alt="plus-icon" className="ml-1 mr-1" />
                ) : (
                  <img src={minusred} alt="minus-icon" className="ml-1 mr-1" />
                )}
                {Math.abs((callInsight?.customer_sentiment * 100).toFixed(2))} %
              </div>
            </div>
            <div className=" bg-white w-full rounded-[12px] px-4 py-2">
              <div className=" flex items-center justify-between">
                <span className="flex items-center">
                  <img src={clock} alt="agent" className=" mr-2 w-6 h-6" />
                  <span className="text-[18px] leading-7">
                    Call Duration : {callInsight?.duration}
                  </span>
                </span>
                <button
                  className={`p-[10px] border rounded-lg flex items-center border-[#C3C3C3] cursor-pointer group ${
                    isPlaying
                      ? "bg-[#271078] hover:bg-none text-white"
                      : "bg-white hover:bg-gray-400 hover:text[#271078]"
                  }`}
                  onClick={handlePlayPause}
                >
                  <img
                    src={playIcon}
                    alt="play-icon"
                    className={`mr-2 ${
                      isPlaying ? " invert brightness-0" : ""
                    }`}
                  />
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>
              <div
                style={{
                  height: "250px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                }}
              >
                {!isPending && (
                  <div id="waveform" ref={waveformRef} className="mt-4"></div>
                )}
              </div>
            </div>

            <div className=" bg-white w-full rounded-[12px] p-4">
              <span className=" flex items-center">
                <img src={person} alt="" className=" mr-2" />{" "}
                <div className="text-[18px]">Intent Analysis</div>
              </span>
              {isPending ? (
                <div className=" mt-10">
                  <Tableskeleton thead={3} trow={8} tcol={3} clr={"#E0E0E0"} />
                </div>
              ) : (
                <>
                  <div className=" p-4 border border-[#E7E7E7] mt-6 rounded-xl bg-[#F9FCFF]">
                    <div className="leading-7 mx-2  flex items-center text-[18px]">
                      <img src={voice} alt="" className=" mr-2 h-5 w-6" /> Voice
                    </div>
                    <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] text-nowrap table-with-bg border border-red-500 shadow-md">
                      <thead className="bg-[#717171] ">
                        <tr className="text-[#252525]">
                          <th className="px-4 py-2 text-left text-[18px] font-medium leading-[27px] w-1/3 text-white">
                            Parameters
                          </th>
                          <th className="py-2 text-left text-[18px] font-medium leading-[27px] w-1/3 text-white">
                            Agent
                          </th>
                          <th className="py-2 text-left text-[18px] font-medium leading-[27px] w-1/3 text-white">
                            Customer
                          </th>
                        </tr>
                      </thead>
                      <tbody className=" text-[18px]">
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Pitch Variance
                          </td>

                          <td className="py-3 border-t">
                            {callInsight?.pitch_variance[0].pitchvar}
                          </td>
                          <td className="py-3 border-t">
                            {callInsight?.pitch_variance[1].pitchvar}
                          </td>
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Loudness
                          </td>

                          <td className="py-3 border-t">
                            {callInsight?.loudness[0].loudness}
                          </td>
                          <td className="py-3 border-t">
                            {callInsight?.loudness[1].loudness}
                          </td>
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Entropy
                          </td>

                          <td className="py-3 border-t">
                            {callInsight?.entropy[0].entropy}
                          </td>
                          <td className="py-3 border-t">
                            {callInsight?.entropy[1].entropy}
                          </td>
                        </tr>

                        {openpara && (
                          <tr className="text-nowrap">
                            <td className="py-3 px-4 border-t text-[18px]">
                              Entropy
                            </td>

                            <td className="py-3 border-t">111111</td>
                            <td className="py-3 border-t">222222222</td>
                          </tr>
                        )}
                        {openpara && (
                          <tr className="text-nowrap">
                            <td className="py-3 px-4 border-t text-[18px]">
                              jjajsjj
                            </td>

                            <td className="py-3 border-t">111111</td>
                            <td className="py-3 border-t">222222222</td>
                          </tr>
                        )}

                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Zero Cross Rate
                          </td>

                          <td
                            className="py-3 border-t text-[16px]"
                            colSpan={2}
                            style={{}}
                          >
                            <span className="flex items-center justify-center w-[54%] mb-1">
                              InProgress
                            </span>
                            <img src={loadingImg} alt="loading-image" />
                          </td>
                          {/* <td className="py-3 border-t">333333</td> */}
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Tonal Agreeability
                          </td>

                          <td className="py-3 border-t text-end">
                            {callInsight?.tone_result.agreeableness}%
                          </td>
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Tonal Disagreeability
                          </td>

                          <td className="py-3 border-t text-end">
                            {callInsight?.tone_result.disagreeableness}%
                          </td>
                          <td className="py-3 border-t"></td>
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t text-[18px]">
                            Energy
                          </td>

                          <td className="py-3 border-t">
                            {callInsight?.energy[0].energy}
                          </td>
                          <td className="py-3 border-t">
                            {callInsight?.energy[1].energy}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className=" p-4 border border-[#E7E7E7] mt-4 rounded-xl bg-[#F9FCFF]">
                    <div className="leading-7 mx-2  flex items-center text-[18px]">
                      <img src={text} alt="" className=" mr-2 h-5 w-6" /> Text
                    </div>
                    <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] text-nowrap table-with-bg shadow-md">
                      <tbody className=" text-[18px]">
                        <thead></thead>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t">Sentiment</td>

                          <td className="py-3 border-t">
                            {(callInsight?.agent_sentiment * 100).toFixed(2)}%
                          </td>
                          <td className="py-3 border-t">
                            {(callInsight?.customer_sentiment * 100).toFixed(2)}
                            %
                          </td>
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t">
                            Sentiment Keyword
                          </td>
                          <td
                            className="py-3 border-t flex justify-center"
                            colSpan={2}
                          >
                            {callInsight?.sentiment_keywords.length > 0
                              ? callInsight.sentiment_keywords.map((e) => e)
                              : "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      onClick={() => setOpenpara(!openpara)}
                      className="cursor-pointer flex justify-center mt-2 relative"
                    >
                      <div className="relative group">
                        {openpara ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            fill="gray"
                            className="bi bi-caret-up-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            fill="gray"
                            className="bi bi-caret-down-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                          </svg>
                        )}
                        <div className="px-4 rounded-md border shadow-lg absolute mt-1 opacity-0 group-hover:opacity-100 text-nowrap transition-opacity left-4 top-[-27px] bg-gray-100">
                          {openpara ? "View Less" : " View More"}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="bg-white w-full rounded-[12px] px-4 py-2 text-[18px] leading-7">
              <span className="flex justify-between items-center mb-4 mt-4">
                <div className="flex items-center ">
                  <img
                    src={transcription}
                    alt="agent"
                    className="mr-2 w-6 h-6"
                  />
                  <span className="text-[18px] leading-7">Transcription</span>
                </div>

                <div className="toggle-switch">
                  <label>
                    {isLanguageEnglish && "English"}
                    {!isLanguageEnglish && displayEnglish && "English"}
                    {!isLanguageEnglish &&
                      !displayEnglish &&
                      callInsight?.language}
                  </label>
                  {callInsight?.language !== "English" && (
                    <div className="toggle-switch-intregrate">
                      <input
                        type="checkbox"
                        id="switch"
                        onChange={() => {
                          setDisplayEnglish(!displayEnglish);
                          english = !english;
                        }}
                      />{" "}
                      <label htmlFor="switch"></label>
                    </div>
                  )}
                </div>
              </span>

              <div
                ref={transcriptRef}
                className="border border-[#E6E6E6] h-[250px] overflow-y-auto mt-4 rounded-lg p-3 text-[#171717] text-[17px] mb-3"
              >
                {isPending
                  ? "Fetching transcription..."
                  : transcriptions.length > 0 && !isPlaying
                  ? transcriptions.map((entry, index) => (
                      <div
                        key={index}
                        data-active={
                          activeTranscript === entry.dialogue ? "true" : "false"
                        } // Kept for scroll functionality
                        className="mb-2 p-2 rounded-lg bg-[#F9FCFF] text-[#171717] flex flex-row text-[20px]"
                      >
                        <div>
                          <span className="text-sm opacity-75">
                            ({entry.startTime}s - {entry.endTime}s{/* ,{" "} */}
                            {/* {entry.emotion} */})
                          </span>
                          <span className="font-semibold mr-2 flex items-center">
                            {entry.speaker === "agent" ? (
                              <>
                                <img src={agentIc} className="mr-2" />{" "}
                                <span> Agent : </span>
                              </>
                            ) : (
                              <>
                                <img src={personIc} className="mr-2" />{" "}
                                <span> Customer : </span>
                              </>
                            )}
                          </span>
                        </div>
                        {!displayEnglish ? (
                          <p className="w-[80%] mt-7">{entry.early_dialogue}</p>
                        ) : (
                          <p className="w-[80%] mt-7">{entry?.dialogue}</p>
                        )}

                        {/* <span className="text-sm opacity-75">
                          ({entry.startTime}s - {entry.endTime}s,{" "}
                          {entry.emotion})
                        </span> */}
                      </div>
                    ))
                  : transcriptions
                      .filter((entry) => entry.dialogue === activeTranscript)
                      .map((entry, index) => (
                        <div
                          key={index}
                          className="mb-2 p-2 rounded-lg bg-[#F9FCFF] text-[#171717] flex flex-row items-start"
                        >
                          <div>
                            <span className="text-sm opacity-75">
                              ({entry.startTime}s - {entry.endTime}s
                              {/* ,{" "} */}
                              {/* {entry.emotion} */})
                            </span>
                            <span className="font-semibold flex items-center mr-4">
                              {entry.speaker === "agent" ? (
                                <>
                                  <img src={agentIc} className="mr-2" />{" "}
                                  <span>Agent :</span>
                                </>
                              ) : (
                                <>
                                  <img src={personIc} className="mr-2" />{" "}
                                  <span>Customer :</span>
                                </>
                              )}
                            </span>
                          </div>
                          <div className="flex-1 mt-7">
                            {displayEnglish ? (
                              <Highlighter
                                highlightClassName="text-black bg-white"
                                searchWords={[activeTranscript || ""]}
                                autoEscape={true}
                                textToHighlight={entry.dialogue}
                                // className="ml-4"
                                className=" text-[20px]"
                              />
                            ) : (
                              <Highlighter
                                highlightClassName="text-black bg-white"
                                searchWords={[activeTranscript || ""]}
                                autoEscape={true}
                                textToHighlight={entry.early_dialogue}
                                // className="ml-4"
                                className=" text-[20px]"
                              />
                            )}
                          </div>
                        </div>
                      ))}
              </div>
            </div>

            <div className=" bg-white w-full rounded-[12px] px-4 py-2 text-[18px] leading-7">
              <div className=" flex items-center mb-4">
                <img src={topKeyword} alt="agent" className=" mr-2 w-6 h-6" />
                <span className=" text-[18px] leading-7">Top Keyword</span>
              </div>
              {callInsight?.keywords.map((e, i) => (
                <div
                  key={i}
                  className="bg-[#EBEBEB] px-5 py-2 rounded-xl inline-block mb-2 ml-2"
                >
                  {capitalizeTwoWords(e)}
                </div>
              ))}
            </div>

            <div className="bg-white w-full rounded-[12px] px-4 py-2 text-[18px] leading-7">
              <div className="flex items-center">
                <img src={money} alt="agent" className="mr-2 w-6 h-6" />
                <span className="text-[18px] leading-7">Collection Status</span>
              </div>
              <div className="border border-[#E6E6E6] h-auto overflow-y-auto mt-4 rounded-lg p-3 text-[#171717] text-[17px] mb-3">
                Featching Collection Status
              </div>
            </div>
            <div className=" bg-white w-full rounded-[12px] px-4 py-2 text-[18px] leading-7">
              <div className=" flex items-center">
                <img src={summary} alt="agent" className=" mr-2 w-6 h-6" />
                <span className=" text-[18px] leading-7">Call Summary</span>
              </div>
              <div className=" border border-[#E6E6E6] h-[258px] overflow-y-auto mt-4 rounded-lg p-3 text-[#171717] text-[17px] mb-3">
                {callInsight?.ai_summary.summary}
              </div>
            </div>
            <div className="bg-white w-full rounded-[12px] px-4 py-2 text-[18px] leading-7">
              <div className="flex items-center">
                <img src={calldatabase} alt="agent" className="mr-2 w-5 h-5" />
                <span className="text-[18px] leading-7">Call category</span>
              </div>
              <div className="border border-[#E6E6E6] h-auto overflow-y-auto mt-4 rounded-lg p-3 text-[#171717] text-[17px] mb-3">
                Featching Collection Status
              </div>
            </div>
          </Masonry>
        </ResponsiveMasonry>
      </div>
      {archivecall && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="bg-white p-6 shadow-lg h-[180px] w-[425px] rounded-xl flex justify-center flex-col items-center">
            <div className="mb-6 text-[22px] leading-5 font-medium tracking-wide">
              Do you want to Archive this call ?
            </div>
            <div>
              <button
                className=" h-[44px] w-[150px] border border-[#171717] rounded-lg mr-2 hover:bg-red-600 hover:text-white transition duration-300 ease-out hover:ease-in-out hover:border-none"
                onClick={() => setArchivecall(false)}
              >
                Cancel
              </button>
              <button
                className=" h-[44px] w-[150px] border border-[#171717] rounded-lg hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out  hover:border-none"
                onClick={markArchive}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {opportunity && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-10">
          <div className="bg-white p-6 shadow-lg h-[425px] w-[1170px] rounded-xl flex flex-col">
            <div className=" flex justify-center mb-2 items-center text-[28px] font-medium text-[#838383]">
              <img src={callIcon} alt="call-icon" className=" mr-3" />
              Create New Opportunity
            </div>
            <hr className="my-4" />
            <div className=" flex flex-wrap mt-5 px-12">
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
                  className={`mt-2 w-[492px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4  focus:text-black cursor-pointer
                              
                               `}
                  // onChange={(e) =>
                  //   handelBulkcall("call_type", e.target.value)
                  // }
                  // onFocus={() => clearError("call_type")}
                  name="call_type"
                  id="call_type"
                  // value={bulkcalldata.call_type}
                >
                  <option
                    value=""
                    // selected
                    disabled
                    className="text-gray-400"
                  >
                    Select Call Type
                  </option>
                  {/* {supportingInfo?.call_type.map((callType, i) => (
                                  <option
                                    key={i}
                                    value={callType.title}
                                    className="text-black"
                                  >
                                    {callType.title}
                                  </option>
                                ))} */}
                </select>
                {/* {bulkerror.call_type && (
                                <div className="flex items-center mt-1">
                                  <img
                                    src={errorIcon}
                                    alt="error-icon"
                                    className="h-4 w-4 mr-1"
                                  />
                                  <span className=" text-[#f50a0a] text-[14px]">
                                    {bulkerror.call_type}{" "}
                                  </span>
                                </div>
                              )} */}
              </span>
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={keyword}
                    alt="call-icon"
                    className="h-4 w-4 mr-2"
                  ></img>
                  <label className="text-[16px]">Key Word</label>
                </span>

                <select
                  className={`mt-2 w-[492px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4  focus:text-black cursor-pointer
                              
                               `}
                  // onChange={(e) =>
                  //   handelBulkcall("call_type", e.target.value)
                  // }
                  // onFocus={() => clearError("call_type")}
                  name="call_type"
                  id="call_type"
                  // value={bulkcalldata.call_type}
                >
                  <option
                    value=""
                    // selected
                    disabled
                    className="text-gray-400"
                  >
                    Select Call Type
                  </option>
                  {/* {supportingInfo?.call_type.map((callType, i) => (
                                  <option
                                    key={i}
                                    value={callType.title}
                                    className="text-black"
                                  >
                                    {callType.title}
                                  </option>
                                ))} */}
                </select>
                {/* {bulkerror.call_type && (
                                <div className="flex items-center mt-1">
                                  <img
                                    src={errorIcon}
                                    alt="error-icon"
                                    className="h-4 w-4 mr-1"
                                  />
                                  <span className=" text-[#f50a0a] text-[14px]">
                                    {bulkerror.call_type}{" "}
                                  </span>
                                </div>
                              )} */}
              </span>
              <span className="flex flex-col mb-4 mr-5">
                <span className=" flex items-center ">
                  <img
                    src={status}
                    alt="call-icon"
                    className="h-4 w-4 mr-2"
                  ></img>
                  <label className="text-[16px]">Status</label>
                </span>

                <select
                  className={`mt-2 w-[492px] h-[44px] border  rounded-lg focus:outline-none custom-select px-4  focus:text-black cursor-pointer
                              
                               `}
                  // onChange={(e) =>
                  //   handelBulkcall("call_type", e.target.value)
                  // }
                  // onFocus={() => clearError("call_type")}
                  name="call_type"
                  id="call_type"
                  // value={bulkcalldata.call_type}
                >
                  <option
                    value=""
                    // selected
                    disabled
                    className="text-gray-400"
                  >
                    Select Call Type
                  </option>
                  {/* {supportingInfo?.call_type.map((callType, i) => (
                                  <option
                                    key={i}
                                    value={callType.title}
                                    className="text-black"
                                  >
                                    {callType.title}
                                  </option>
                                ))} */}
                </select>
                {/* {bulkerror.call_type && (
                                <div className="flex items-center mt-1">
                                  <img
                                    src={errorIcon}
                                    alt="error-icon"
                                    className="h-4 w-4 mr-1"
                                  />
                                  <span className=" text-[#f50a0a] text-[14px]">
                                    {bulkerror.call_type}{" "}
                                  </span>
                                </div>
                              )} */}
              </span>
            </div>
            <hr className=" my-4" />
            <div className="flex justify-end mt-2">
              <button
                className="h-[44px] w-[150px] border border-[#171717] rounded-lg mr-2 hover:bg-red-600 hover:text-white transition duration-300 ease-out hover:ease-in-out hover:border-none"
                onClick={() => setopportunity(false)}
              >
                Cancel
              </button>
              <button
                className="h-[44px] w-[150px] border border-[#171717] rounded-lg hover:bg-[#271078] hover:text-white transition duration-300 ease-out hover:ease-in-out hover:border-none"
                // onClick={markArchive}
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

export default Callinsight;
