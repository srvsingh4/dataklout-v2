import Service from "./components/webservice/http";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import grid from "./assets/images/grid.svg";
import homeIcon from "./assets/icons/home.svg";
import archiveIcon from "./assets/icons/archive.svg";
import call from "./assets/icons/call.svg";
import opportunity from "./assets/icons/opportunity.svg";
import serviceIcon from "./assets/icons/serviceIcon.svg";
import dashboard from "./assets/icons/dashboard.svg";
import qualityAudit from "./assets/icons/quality-audit.svg";
import contact from "./assets/icons/contact.svg";
import task from "./assets/icons/task.svg";
import usermanage from "./assets/icons/usermanage.svg";
import promise from "./assets/icons/payments.svg";

function Nav() {
  const services = new Service();
  const navigate = useNavigate();
  let url = window.location.href;
  url = url.replace(/^.*\/\/[^\/]+/, "");
  const [permission, setPermission] = useState();
  const [loading, setLoading] = useState(true); // Add loading state
  // console.log(url);

  function fetch_permissionDetails() {
    services
      .get("api/access_control/permission_details/")
      .then((res) => {
        setPermission(res);
        setLoading(false);
      })
      .then((res) => {
        if (res?.code === "token not valid") {
          localStorage.clear();
          window.location.href = "/login";
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Permission fetch failed:", err);
      });
  }

  useEffect(() => {
    fetch_permissionDetails();
  }, []);

  return (
    <nav
      className="h-[55px] px-4 bg-white mt-2 flex items-center justify-between"
      //   role="navigation"
    >
      <div
        className=" bg-[#271078] px-5  flex items-center text-white py-2"
        style={{ borderRadius: "10px" }}
      >
        <img src={grid} alt="grid" className=" mr-2" />
        {localStorage.getItem("usecase")}
      </div>
      <ul className="flex flex-row  items-center">
        <li
          className={`${
            url === "/"
              ? "bg-[#271078] text-white"
              : "text-[#171717] hover:bg-[#B0A9C8] transition duration-300 ease-out hover:ease-in-out"
          } px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center  `}
          onClick={() => navigate("/")}
        >
          <img
            src={homeIcon}
            alt="home-icon"
            className={`
                      ${url === "/" ? "fill-whitee" : ""}  h-[18px] mr-1
                    `}
          />
          Home
        </li>
        {loading ? (
          [...Array(9)].map((_, i) => (
            <li
              key={i}
              className="px-3 py-2 rounded-lg mr-1 text-[14px] flex items-center animate-pulse"
            >
              <div className="h-6 w-20 bg-gray-300 rounded shimmer"></div>
            </li>
          ))
        ) : (
          <>
            {permission &&
              permission?.map((p, i) => (
                <>
                  {p.feature == "Call List" && (
                    <li
                      key={p.feature}
                      className={`${
                        url.includes("/call-list") ||
                        url.includes("/call-insight")
                          ? "bg-[#271078] text-white"
                          : "text-[#171717] hover:bg-[#B0A9C8] transition duration-300 ease-out hover:ease-in-out "
                      } px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex 
                  
                  items-center `}
                      onClick={() => navigate("/call-list")}
                    >
                      {" "}
                      <img
                        src={call}
                        alt="call-icon"
                        className={`
                      ${
                        url.includes("/call-list") ||
                        url.includes("/call-insight")
                          ? "fill-whitee"
                          : ""
                      }  h-[16px] mr-1
                    `}
                      />
                      Calls
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Dashboard" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text-[#271078]${
                        url === "/dashboard" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out`}
                    >
                      <img
                        src={dashboard}
                        alt="home-icon"
                        className="h-[12px] mr-1"
                      />
                      Dashboard
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Opportunity" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/call/opportunities" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={opportunity}
                        alt="home-icon"
                        className="h-[16px] mr-1"
                      />
                      Opportunities
                    </li>
                  )}
                </>
              ))}
            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Promise to Pay" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/call/promise-to-pay" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={promise}
                        alt="promise-icon"
                        className="h-[19px] mr-1"
                      />
                      Promise to Pay
                    </li>
                  )}
                </>
              ))}

            {permission &&
              localStorage.getItem("usecase") !== "Complaints Management" &&
              permission.map((p) => (
                <>
                  {p.feature == "Service Request" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/call/service-requests" ? "active" : ""
                      }  transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={serviceIcon}
                        alt="service-icon"
                        className="h-[14px] mr-1"
                      />
                      Service Requests
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Archrive Call" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/call/archive-calls" ? "active" : ""
                      }transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={archiveIcon}
                        alt="archive-icon"
                        className="h-[16px] mr-1"
                      />
                      Archived Calls
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map(
                (p) =>
                  p.feature == "Contact" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/contact" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={contact}
                        alt="home-icon"
                        className="h-[16px] mr-1"
                      />
                      Contact
                    </li>
                  )
              )}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Task" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/task" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={task}
                        alt="home-icon"
                        className="h-[16px] mr-1"
                      />
                      Task
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "User Management" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/user-management/manage-user" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={usermanage}
                        alt="home-icon"
                        className="h-[14px] mr-1"
                      />
                      User Management
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Quality Audit" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex items-center hover:bg-[#B0A9C8] hover:text[#271078]${
                        url === "/quality-audit" ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={qualityAudit}
                        alt="home-icon"
                        className="h-[14px] mr-1"
                      />{" "}
                      Quality Audit
                    </li>
                  )}
                </>
              ))}

            {permission &&
              permission.map((p) => (
                <>
                  {p.feature == "Reports" && (
                    <li
                      key={p.feature}
                      className={`px-3 py-2 cursor-pointer rounded-lg mr-1 text-[14px] flex hover:bg-[#B0A9C8] hover:text[#271078]${
                        url.includes("reports") ? "active" : ""
                      } transition duration-300 ease-out hover:ease-in-out `}
                    >
                      <img
                        src={qualityAudit}
                        alt="home-icon"
                        className="h-[18px]"
                      />{" "}
                      Reports
                    </li>
                  )}
                </>
              ))}
          </>
        )}
      </ul>
    </nav>
  );
}
export default Nav;
