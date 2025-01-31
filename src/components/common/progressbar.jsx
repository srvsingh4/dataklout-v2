import PropTypes from "prop-types";

const Progressbar = ({ bgcolor, progress, height }) => {
  Progressbar.propTypes = {
    bgcolor: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  const Parentdiv = {
    height: height,
    width: "100%",
    backgroundColor: "#8D8DEF",
    borderRadius: 10,
    margin: 1,
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 10,
    textAlign: "right",
  };

  //   const progresstext = {
  //     padding: 10,
  //     color: "white",
  //     fontWeight: 700,
  //   };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span className=" text-white px-5  font-semibold ">{`${progress}%`}</span>
      </div>
    </div>
  );
};

export default Progressbar;
