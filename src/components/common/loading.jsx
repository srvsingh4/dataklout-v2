import PropTypes from "prop-types";

function Loading({ blockNo }) {
  Loading.propTypes = {
    blockNo: PropTypes.number.isRequired,
  };

  return (
    <div>
      {Array.from({ length: blockNo }).map((_, i) => (
        <div className="mb-4 shadow-md min-h-[30px] rounded-xl mt-5" key={i}>
          <div className="p-2">
            <div className="w-full h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loading;
