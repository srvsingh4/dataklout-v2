import website from "../assets/icons/website.svg";
import call from "../assets/icons/call_footer.svg";
import notes from "../assets/icons/add_notes.svg";

function Footer() {
  return (
    <footer className=" fixed bottom-0 w-full bg-[#ffffff] p-4 ">
      <div className=" mx-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-[#434343] flex">
            <button className=" text-lg flex">
              <img src={call} alt="call-icon" className=" mr-2 text-black" />{" "}
              Phone
            </button>
            <button className=" text-lg flex ml-2">
              <img src={notes} alt="call-icon" className=" mr-2 text-black" />{" "}
              Notes
            </button>
          </div>
          <div className="flex space-x-4 items-center">
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
  );
}

export default Footer;
