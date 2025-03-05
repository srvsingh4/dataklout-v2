import website from "../assets/Icons/website.svg";
import call from "../assets/Icons/call_footer.svg";
import notes from "../assets/Icons/add_notes.svg";
import linkedin from "../assets/Icons/linkedin.svg";
import Service from "./webservice/http";
import Masonry from "react-responsive-masonry";
import { useState } from "react";

function Footer() {
  const services = new Service();
  const [showNotesModel, setShowNotesModel] = useState(false);
  const [notesData, setNotesData] = useState();
  const [note, setNote] = useState("");
  const [subject, setSubject] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [error, setError] = useState(null);
  const [isPending, setisPending] = useState(false);

  const toggleNotesModel = () => {
    setShowNotesModel(!showNotesModel);
  };

  return (
    <>
      <footer className=" fixed bottom-0 w-full bg-[#f1f0f0] p-4 ">
        <div className=" mx-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[#434343] flex">
              <a className=" text-lg flex" href="tel:+91804524700">
                <img src={call} alt="call-icon" className=" mr-2 text-black" />{" "}
                Phone
              </a>
              <button className=" text-lg flex ml-2" onClick={toggleNotesModel}>
                <img src={notes} alt="call-icon" className=" mr-2 text-black" />{" "}
                Notes
              </button>
            </div>
            <div className="flex space-x-2 items-center">
              {/* <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl hover:text-blue-600"
              >
                <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
              </a> */}
              <a
                href="https://www.dataklout.com"
                target="_blank"
                rel="noreferrer"
                className=" mr-2 flex items-center"
              >
                <img className="h-5 mr-2" src={website} alt="facebook" />
                <span className=" text-[#434343]">dataklout.com</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      {showNotesModel && (
        <div className="fixed inset-0 flex py-[100px] justify-center bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="bg-white p-6 shadow-lg h-[600px] w-[1000px] relative rounded-xl">
            <div className="absolute bottom-4 flex justify-end w-full right-4">
              <button
                className=" border border-gray-300 px-6 py-2 rounded-md"
                onClick={() => setShowNotesModel(!showNotesModel)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
