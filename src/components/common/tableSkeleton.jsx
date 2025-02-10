import PropTypes from "prop-types";

function Tableskeleton({ thead, trow, tcol }) {
  Tableskeleton.propTypes = {
    thead: PropTypes.number.isRequired,
    trow: PropTypes.number.isRequired,
    tcol: PropTypes.number.isRequired,
  };

  // keep thead and tcol same number while sening the props
  return (
    <div className="w-full mt-4 overflow-hidden rounded-[12px] shadow animate-pulse">
      <table className="w-full border-collapse">
        <thead className="bg-[#E0DCED]">
          <tr>
            {[...Array(thead)].map((_, i) => (
              <th key={i} className="px-4 py-2 text-left">
                <div className="h-6 bg-gray-300 rounded shimmer"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(trow)].map((_, i) => (
            <tr key={i}>
              {[...Array(tcol)].map((_, j) => (
                <td key={j} className="px-4 py-3 border-t">
                  <div className="h-5 bg-gray-200 rounded shimmer"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Tableskeleton;
