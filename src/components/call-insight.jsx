import Header from "./header";
import Nav from "../nav";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import Service from "./webservice/http";
import callInsightIcon from "../assets/Icons/call-insight.svg";
import call from "../assets/Icons/call-callInsight.svg";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import wave from "../assets/Icons/wave.svg";
import cxScore from "../assets/Icons/cxScore.svg";
import cIntent from "../assets/Icons/cIntent.svg";
import resolutionIcon from "../assets/Icons/resolution.svg";
import problrmFound from "../assets/Icons/problrmFound.svg";
import agent from "../assets/Icons/agent.svg";
import customerI from "../assets/Icons/customerI.svg";
import plusgreen from "../assets/Icons/plusgreen.svg";
import minusred from "../assets/Icons/minusred.svg";
import person from "../assets/Icons/person-mag.svg";
import voice from "../assets/Icons/voice.svg";
import text from "../assets/Icons/text.svg";
import summary from "../assets/Icons/call-summary.svg";
import clock from "../assets/Icons/clock-black.svg";
import playIcon from "../assets/Icons/play.svg";
import loadingImg from "../assets/images/loading.png";
import { WaveSurfer, WaveForm, Region } from "wavesurfer-react";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import { useParams } from "react-router-dom";
import Button from "./common/button";
import Tableskeleton from "./common/tableSkeleton";
import BlockSkeleton from "./common/blockSkeleton";
import Loading from "./common/loading";

function Callinsight() {
  const wavesurferRef = useRef();
  const services = new Service();
  const { callID } = useParams();
  const [callInsight, setCallInsight] = useState(null);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [isLanguageEnglish, setIsLanguageEnglish] = useState(true);
  const [displayEnglish, setDisplayEnglish] = useState(true);
  var english = true;
  var ci = null;
  const [activeKey, setActiveKey] = useState("Product");
  /**
   * Fetch Call Insight data
   */
  // console.log(callInsight);
  // yet to complete
  const [showedit, setshowedit] = useState(true);

  const usecase = localStorage.getItem("usecase");
  // console.log(usecase);

  const handleSubmit = (e) => {
    e.preventDefault();
    services
      .patch(`api/call/${callID}/call_insight/`, updatedCallInsight)
      .then((res) => {
        // console.log("checkkkkkkk", res);
        // window.location.reload();
      });
    // console.log("HFDYTJHFYJHF", updatedCallInsight);
    setshowedit(true);
  };

  const handleInputChange = (event) => {
    // console.log("handleInputChange called");
    const { name, value } = event.target;
    // console.log("name:", name);
    // console.log("value:", value);

    setupdatedCallInsight((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const [updatedCallInsight, setupdatedCallInsight] = useState({});

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
          history.push("/login");
        }
        setCallInsight(res);
        setupdatedCallInsight({
          name: res.name,
          request_type: res.request_type,
          product: res.product,
          buy: res.buy,
          sell: res.sell,

          amount: res.amount,
          company_name: res.company_name,

          price: res.price,
          shares: res.shares,

          final_price: res.final_price,
          units: res.units,
          date: res.date,
          folio_number: res.folio_number,

          contract_number: res.contract_number,
          quantity: res.quantity,
        });
        // console.log(res, "checking");
        if (res.language !== "English") {
          setIsLanguageEnglish(false);
          setDisplayEnglish(false);
          english = false;
        }

        ci = res;
        setError("");
        try {
          wavesurferRef.current.load(res.audio_file);
        } catch {}
      }
    });
  }

  useEffect(() => {
    fetchData();
  }, [showedit]);
  /**
   * Fetch Call Insight data
   */

  // console.log(updatedCallInsight);

  const [agentVariance, setAgentVariance] = useState(null);
  const [customerVariance, setCustomerVariance] = useState(null);
  const [agentLoudness, setAgentLoudness] = useState(null);
  const [customerLoudness, setCustomerLoudness] = useState(null);
  const [agentEntropy, setAgentEntropy] = useState(null);
  const [customerEntropy, setCustomerEntropy] = useState(null);
  const [agentEnergy, setAgentEnergy] = useState(null);
  const [customerEnergy, setCustomerEnergy] = useState(null);

  const [criticalFactor, setCriticalFactor] = useState(null);

  function fetchCriticalFactorData() {
    services.get(`api/call/${callID}/critical_factor/`).then((res) => {
      // console.log(res);
      setIsPending(false);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        if (res.code == "token_not_valid") {
          localStorage.clear();
          history.push("/login");
        }
        setCriticalFactor(res);
        setProblem(res.problem);
        setResolution(res.resolution);
      }
    });
  }

  const [problem, setProblem] = useState("");
  const [resolution, setResolution] = useState("");
  function criticalValueSelectionChnage(type, id) {
    var tempCriticalFactor = criticalFactor;
    if (type === "product") {
      var products = tempCriticalFactor.product;
      for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
          products[i].status = true;
        } else {
          products[i].status = false;
        }
      }
      tempCriticalFactor.product = products;
    }

    if (type === "manufacturer") {
      var manufacturer = tempCriticalFactor.manufacturer;
      for (let i = 0; i < manufacturer.length; i++) {
        if (manufacturer[i].id === id) {
          manufacturer[i].status = true;
        } else {
          manufacturer[i].status = false;
        }
      }
      tempCriticalFactor.manufacturer = manufacturer;
    }

    if (type === "part_no") {
      var part_no = tempCriticalFactor.part_no;
      for (let i = 0; i < part_no.length; i++) {
        if (part_no[i].id === id) {
          part_no[i].status = true;
        } else {
          part_no[i].status = false;
        }
      }
      tempCriticalFactor.part_no = part_no;
    }

    if (type === "model_no_list") {
      var model_no_list = tempCriticalFactor.model_no_list;
      for (let i = 0; i < model_no_list.length; i++) {
        if (model_no_list[i].id === id) {
          model_no_list[i].status = true;
        } else {
          model_no_list[i].status = false;
        }
      }
      tempCriticalFactor.model_no_list = model_no_list;
    }

    setCriticalFactor(tempCriticalFactor);
    // console.log(criticalFactor);
  }

  const updateCriticalFactor = () => {
    var selected_product = "";
    var selected_manufacturer = "";
    var selected_part_no = "";
    var selected_model = "";

    for (let i = 0; i < criticalFactor.product.length; i++) {
      if (criticalFactor.product[i].status === true) {
        selected_product = criticalFactor.product[i].id;
      }
    }
    for (let i = 0; i < criticalFactor.manufacturer.length; i++) {
      if (criticalFactor.manufacturer[i].status === true) {
        selected_manufacturer = criticalFactor.manufacturer[i].id;
      }
    }
    for (let i = 0; i < criticalFactor.part_no.length; i++) {
      if (criticalFactor.part_no[i].status === true) {
        selected_part_no = criticalFactor.part_no[i].id;
      }
    }
    for (let i = 0; i < criticalFactor.model_no_list.length; i++) {
      if (criticalFactor.model_no_list[i].status === true) {
        selected_model = criticalFactor.model_no_list[i].id;
      }
    }
    var data = {
      problem: problem,
      resolution: resolution,
      product: selected_product,
      manufacturer: selected_manufacturer,
      partNo: selected_part_no,
      modelNo: selected_model,
    };

    services.post(`api/call/${callID}/critical_factor/`, data).then((res) => {
      // console.log(res);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        if (res.code == "token_not_valid") {
          localStorage.clear();
          history.push("/login");
        }
        NotificationManager.success("Success", "Critical Factor updated");
      }
    });
  };

  // useEffect(() => {
  //     console.log(criticalFactor);
  // }, [criticalFactor]);

  useEffect(() => {
    fetchData();
    //buildFilter();
    if (localStorage.getItem("critical_factor_module") === "true") {
      fetchCriticalFactorData();
    }

    // console.log(callInsight);
    fetchSupportingInfo();
  }, [history]);

  /**
   * After fetching call insight data, process that data to display in required format
   */

  useEffect(() => {
    var i = 0;
    for (i = 0; i < 2; i++) {
      try {
        if (callInsight.pitch_variance[i].Speaker === "agent") {
          setAgentVariance(callInsight.pitch_variance[i].pitchvar);
        }
        if (callInsight.pitch_variance[i].Speaker === "customer") {
          setCustomerVariance(callInsight.pitch_variance[i].pitchvar);
        }
        if (callInsight.loudness[i].speaker === "agent") {
          setAgentLoudness(callInsight.loudness[i].loudness);
        }
        if (callInsight.loudness[i].speaker === "customer") {
          setCustomerLoudness(callInsight.loudness[i].loudness);
        }
        if (callInsight.entropy[i].speaker === "agent") {
          setAgentEntropy(callInsight.entropy[i].entropy);
        }
        if (callInsight.entropy[i].speaker === "customer") {
          setCustomerEntropy(callInsight.entropy[i].entropy);
        }
        if (callInsight.energy[i].speaker === "agent") {
          setAgentEnergy(callInsight.energy[i].energy);
        }
        if (callInsight.energy[i].speaker === "customer") {
          setCustomerEnergy(callInsight.energy[i].energy);
        }
        if (callInsight.call_type === "Collection") {
          fetchCollectionStatusData();
        }
      } catch {}
    }
  }, [callInsight]);

  const [collectionStatusData, setCollectionStatusData] = useState(null);

  /**
   * Fetch current status of collection if it is a collection call
   */
  function fetchCollectionStatusData() {
    services.get(`api/call/${callID}/collection_status/`).then((res) => {
      // console.log(res);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        setCollectionStatusData(res);
        setCollectionStatus(res.updated_status);
      }
    });
  }

  const [showCollectionReviewDetails, setShowCollectionReviewDetails] =
    useState(false);
  useEffect(() => {
    fetchCollectionStatusData();
  }, [showCollectionReviewDetails]);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [collectionStatus, setCollectionStatus] = useState("");
  const [comment, setComment] = useState("");
  const [accepted, setAccepted] = useState(false);

  /**
   * Update current status of collection
   */
  function updateCollectionStatusData() {
    if (callInsight.agent_id === localStorage.getItem("username")) {
      var data = {
        type: "agent",
        updated_status: collectionStatus,
      };
    }
    if (callInsight.agent_id !== localStorage.getItem("username")) {
      var data = {
        type: "manager",
        status_id: collectionStatusData.id,
        accepted: accepted,
        comment: comment,
      };
    }
    services.post(`api/call/${callID}/collection_status/`, data).then((res) => {
      // console.log(res);
      if (res == "TypeError: Failed to fetch") {
        setError("Connection Error");
      } else {
        if (res.code == "token_not_valid") {
          localStorage.clear();
          history.push("/login");
        }
        setShowCollectionReviewDetails(false);
      }
    });
  }

  // console.log(updatedCallInsight);
  useEffect(() => {
    buildFilter();
  }, [callInsight]);

  const [match, setMatch] = useState("");

  async function callInsightMatch() {
    let url = `/api/call/${callID}/pcvc_insight/`;
    const res = await services.get(url).then((res) => {
      setMatch(res);
      // console.log(res,"ffff")
    });
  }
  useEffect(() => {
    callInsightMatch();
  }, []);

  const [emotions, setEmotions] = useState(null);
  const [speakers, setSpeakers] = useState(null);

  /**
   * filter speech region based on selected speaker and selected emotiom
   * It is required to display filter range
   * @param {*} filter_type Filter Type
   * @param {*} filter Filter
   */
  function regionFilterFun(filter_type, filter) {
    var regionData = [];
    if (callInsight != null) {
      var i = 1;
      callInsight.speech.map((speechItem) => {
        if (filter_type == "speaker") {
          if (filter == "agent") {
            if (speechItem.speaker == "agent") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(255, 196, 226, 0.4)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          } else {
            if (speechItem.speaker == "customer") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(255, 255, 0, 0.4)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          }
        } else {
          if (filter == "Happy") {
            if (speechItem.emotion == "Happy") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(0,228,255,0.2)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          } else if (filter == "Fearful") {
            if (speechItem.emotion == "Fearful") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(0,64,255,0.2)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          } else if (filter == "Angry") {
            if (speechItem.emotion == "Angry") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(58,255,0,0.2)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          } else if (filter == "Sad") {
            if (speechItem.emotion == "Sad") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(255,0,255,0.2)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          } else {
            if (speechItem.emotion == "Calm") {
              regionData.push({
                id: "region-" + i.toString(),
                start: speechItem.startTime,
                end: speechItem.endTime,
                color: "rgba(255,0,0,0.2)",
                data: {
                  systemRegionId: i,
                },
              });
            }
          }
        }
        i++;
      });

      setRegions(regionData);
    }
  }

  /**
   * Build filter options
   */
  function buildFilter() {
    var emotions = [];
    var speakers = [];
    if (callInsight != null) {
      callInsight.speech.map((speechItem) => {
        if (emotions.indexOf(speechItem.emotion) === -1) {
          emotions.push(speechItem.emotion);
        }
        if (speakers.indexOf(speechItem.speaker) === -1) {
          speakers.push(speechItem.speaker);
        }
      });
    }
    setEmotions(emotions);
    setSpeakers(speakers);
  }

  /**
   * Control audio play and pause status
   */

  const [regions, setRegions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [timelineVis, setTimelineVis] = useState(true);
  const regionsRef = useRef(regions);

  const play = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    } else {
      console.error("WaveSurfer instance is not initialized.");
    }
  }, []);

  const plugins = useMemo(() => {
    return [
      {
        plugin: RegionsPlugin,
        options: { dragSelection: true },
      },
      timelineVis && {
        plugin: TimelinePlugin,
        options: {
          container: "#timeline",
          color: "#000000",
          fontSize: "25px",
        },
      },
    ].filter(Boolean);
  }, [timelineVis]);

  /**
   * Create region on audio web graph
   */
  const regionCreatedHandler = useCallback(
    (region) => {
      // console.log("region-created --> region:", region);

      if (region.data.systemRegionId) return;

      setRegions([
        ...regionsRef.current,
        { ...region, data: { ...region.data, systemRegionId: -1 } },
      ]);
    },
    [regionsRef]
  );

  /**
   * Load audio packets and create webgraph
   */

  const handleWSMount = useCallback(
    (waveSurfer) => {
      wavesurferRef.current = waveSurfer;
      if (wavesurferRef.current) {
        console.log("WaveSurfer instance mounted.");
        wavesurferRef.current.params.waveColor = "#2196f3";
        wavesurferRef.current.params.progressColor = "#000000";
        wavesurferRef.current.params.backgroundColor = "#0000";
        wavesurferRef.current.params.responsive = true;
        wavesurferRef.current.params.fillParent = true;
        wavesurferRef.current.params.scrollParent = true;
        wavesurferRef.current.setHeight(210);

        wavesurferRef.current.on("region-created", regionCreatedHandler);

        wavesurferRef.current.on("ready", () => {
          console.log("WaveSurfer is ready");
        });

        wavesurferRef.current.on("region-removed", (region) => {
          console.log("region-removed --> ", region);
        });

        wavesurferRef.current.on("loading", (data) => {
          console.log("loading --> ", data);
        });

        wavesurferRef.current.on("play", () => {
          setIsPlaying(true);
        });

        wavesurferRef.current.on("pause", () => {
          try {
            ReactDOM.render("", document.getElementById("transcriptionDiv"));
            setIsPlaying(false);
          } catch {}
        });

        wavesurferRef.current.on("audioprocess", () => {
          var t = wavesurferRef.current.getCurrentTime();
          setPlayTime(t);
        });

        wavesurferRef.current.on("finish", () => {
          ReactDOM.render("", document.getElementById("transcriptionDiv"));
          setIsPlaying(false);
        });

        if (window) {
          window.surferidze = wavesurferRef.current;
        }
      } else {
        console.error("WaveSurfer instance is not mounted.");
      }
    },
    [regionCreatedHandler]
  );

  /**
   * Manage region update in webgraph
   */
  const handleRegionUpdate = useCallback((region, smth) => {
    // console.log("region-update-end --> region:", region);
    // console.log(smth);
  }, []);

  const [playTime, setPlayTime] = useState(null);

  /**
   * Handle transcription display while playing the audio and on change of language togglge
   */
  useEffect(() => {
    // console.log(playTime);
    try {
      // console.log(displayEnglish);
      var speech = callInsight.speech;
      for (let i = 0; i < speech.length; i++) {
        if (playTime >= speech[i].startTime && playTime <= speech[i].endTime) {
          var dialogue = "";
          if (displayEnglish) dialogue = speech[i].dialogue;
          else dialogue = speech[i].early_dialogue;
          if (speech[i].speaker === "agent") {
            ReactDOM.render(
              <div className="transcription-customer-section clearfix">
                <h4>Agent</h4>
                <div className="customer-info-right">
                  <span>{speech[i].startTime}</span>
                  <p>
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[callInsight.product]}
                      autoEscape={true}
                      textToHighlight={dialogue}
                    />
                  </p>
                  <span>{speech[i].endTime}</span>
                </div>
              </div>,
              document.getElementById("transcriptionDiv")
            );
          } else {
            ReactDOM.render(
              <div className="transcription-customer-section clearfix">
                <h4>Customer</h4>
                <div className="customer-info-right">
                  <span>{speech[i].startTime}</span>
                  <p>
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={[callInsight.product]}
                      autoEscape={true}
                      textToHighlight={dialogue}
                    />
                  </p>
                  <span>{speech[i].endTime}</span>
                </div>
              </div>,
              document.getElementById("transcriptionDiv")
            );
          }
          break;
        }
      }
    } catch (e) {
      // console.log(e);
    }
  }, [playTime, displayEnglish]);

  useEffect(() => {
    return () => {
      try {
        wavesurferRef.current.pause();
      } catch {}
    };
  }, []);

  const [dbsCategory, setDbsCategory] = useState("");

  const fetchDbsCategory = async () => {
    try {
      const res = await services.get("api/product/trade_info/");

      // console.log(res, "dbs category");
      setDbsCategory(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDbsCategory();
  }, []);

  const [showArchiveModel, setShowArchiveModel] = useState(false);
  function markArchive() {
    var data = {
      archive_status: true,
    };
    services.post(`api/call/${callID}/mark_archive/`, data).then((res) => {
      // console.log(res);
      if (res == "TypeError: Failed to fetch") {
        // console.log("failed to fetch user");
      } else {
        NotificationManager.success("Success", "Task Closed");
        setShowArchiveModel(false);
      }
    });
  }

  const [showOpportunitySRModel, setShowOpportunitySRModel] = useState(false);
  const [clickType, setClickType] = useState(null);

  function clickOpportunitySRModel(type) {
    setClickType(type);
    setShowOpportunitySRModel(true);
  }

  /**
   * Fetch product list from new call supporting info API
   */
  const [supportingInfo, setSupportingInfo] = useState();
  function fetchSupportingInfo() {
    services.get("api/call/new_call/").then((res) => {
      // console.log(res);
      if (res == "TypeError: Failed to fetch") {
      } else {
        if (res.code == "token_not_valid") {
          localStorage.clear();
          history.push("/login");
        }
        setSupportingInfo(res);
      }
    });
  }

  const [productID, setProductID] = useState(null);
  const [keyword, setkeyword] = useState(null);
  const [status, setStatus] = useState(null);

  function CreateOpportunitySR() {
    if (productID === null || keyword === null || status === "") {
      NotificationManager.error("Error", "All the fields are mandatory");
    } else {
      var data = {
        product_id: productID,
        keyword: keyword,
        review_status: status,
      };
      if (clickType === "Opportunity") {
        services
          .post(`api/call/${callID}/create_opportunity/`, data)
          .then((res) => {
            // console.log(res);
            if (res == "TypeError: Failed to fetch") {
              // console.log("failed to fetch user");
            } else {
              NotificationManager.success("Success", "Opportunity Creatred");
              setShowOpportunitySRModel(false);
              setProductID(null);
              setkeyword(null);
              setStatus(null);
            }
          });
      } else {
        services
          .post(`api/call/${callID}/create_service_request/`, data)
          .then((res) => {
            // console.log(res);
            if (res == "TypeError: Failed to fetch") {
              // console.log("failed to fetch user");
            } else {
              NotificationManager.success(
                "Success",
                "Service Requested Creatred"
              );
              setShowOpportunitySRModel(false);
              setProductID(null);
              setkeyword(null);
              setStatus(null);
            }
          });
      }
    }
  }

  const [category, setCategory] = useState("");

  async function callCategory() {
    let url = `/api/call/${callID}/pcvc_insight/`;

    const res = await services
      .get(url)

      .then((res) => {
        setCategory(res);
      });
  }

  useEffect(() => {
    callCategory();
  }, []);

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
                    "border border-[#171717] hover:border-none text-[16px] flex justify-center items-center p-[10px] hover:bg-[#aaa9a8] hover:text-black transition duration-300 ease-out hover:ease-in-out w-auto h-[44px] rounded-lg mr-4 "
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
                      <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div>
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
                      src={problrmFound}
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
                      <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div>
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
                      <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div>
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
                    <div className=" text-2xl font-semibold leading-9 mt-8 ml-2 text-[#3B3B3B] flex items-center border-l-4 border border-red-300 rounded-lg px-4">
                      {/* <div className="h-[30px] w-[4px] bg-red-900 mr-1"></div> */}
                      {callInsight?.resolution ? "Yes" : "No"}
                    </div>
                  )}
                </span>
              </div>
            </div>
            <div className=" bg-white w-full rounded-[12px] px-4 py-2 flex justify-between text-[18px] leading-7">
              <div className=" flex justify-center">
                <img src={agent} alt="agent" className=" mr-2" /> Agent
                Sentiment :{" "}
                <img src={plusgreen} alt="plus green" className="mx-2" />
                89%
              </div>
              <div className=" flex justify-center">
                <img src={customerI} alt="cientent" className=" mr-2" />{" "}
                Customer Sentiment :
                <img src={plusgreen} alt="plus green" className="mx-2" />
                89%
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
                  className="p-[10px] border rounded-lg flex items-center border-[#C3C3C3]"
                  onClick={play}
                >
                  <img src={playIcon} alt="play-icon" className=" mr-2" />
                  Play
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
                  <WaveSurfer
                    plugins={plugins}
                    onMount={handleWSMount}
                    scrollParent="true"
                  >
                    <div id="timeline" />
                    <WaveForm id="waveform">
                      {regions.map((regionProps) => (
                        <Region
                          onUpdateEnd={handleRegionUpdate}
                          key={regionProps.id}
                          {...regionProps}
                        />
                      ))}
                    </WaveForm>
                  </WaveSurfer>
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
                    <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] text-nowrap table-with-bg border border-red-500">
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
                    <table className="w-full mt-4 overflow-hidden border-collapse rounded-[12px] text-nowrap table-with-bg">
                      <tbody className=" text-[18px]">
                        <thead></thead>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t">Pitch Variance</td>

                          <td className="py-3 border-t">222222</td>
                          <td className="py-3 border-t">333333</td>
                        </tr>
                        <tr className="text-nowrap">
                          <td className="py-3 px-4 border-t">Loudness</td>

                          <td className="py-3 border-t">222222</td>
                          <td className="py-3 border-t">333333</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className=" bg-white w-full rounded-[12px] px-4 py-2">
              hyhy
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
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}

export default Callinsight;
