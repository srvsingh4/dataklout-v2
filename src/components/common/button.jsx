import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";

const Button = ({ classname, name, onclick, imgSrc, isPending }) => {
  return (
    <button
      className={`${classname} button-with-icon ${
        isPending ? " cursor-none opacity-25 hover:bg-none" : ""
      } hover:fill-whitee `}
      onClick={onclick}
    >
      {isPending ? (
        <ClipLoader color="" size="30px" />
      ) : (
        imgSrc && (
          <img
            src={imgSrc}
            alt={`${name} icon`}
            className="inline-block mr-2 w-4 h-6 "
          />
        )
      )}
      {name}
    </button>
  );
};

Button.propTypes = {
  classname: PropTypes.string,
  name: PropTypes.string,
  onclick: PropTypes.func,
  imgSrc: PropTypes.string,
  isPending: PropTypes.bool,
};

export default Button;
