import PropTypes from "prop-types";

function BlockSkeleton({ blockNo }) {
  BlockSkeleton.propTypes = {
    blockNo: PropTypes.number.isRequired,
  };

  return (
    <div>
      {Array.from({ length: blockNo }).map((_, i) => (
        <div className="mb-4 shadow-md min-h-[315px] rounded-xl" key={i}>
          <div className="bg-[#E0DCED] h-[47px] rounded-t-lg flex items-center">
            <div className="mx-3 w-1/4 h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="p-2">
            <div className="w-full h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="w-full h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="w-full h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlockSkeleton;
