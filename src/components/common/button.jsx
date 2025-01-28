import PropTypes from "prop-types";

const Button = ({ classname, name, onclick, imgSrc }) => {
  return (
    <button className={`${classname} button-with-icon`} onClick={onclick}>
      {imgSrc && (
        <img
          src={imgSrc}
          alt={`${name} icon`}
          className="inline-block mr-2 w-4 h-6"
        />
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
};

export default Button;
