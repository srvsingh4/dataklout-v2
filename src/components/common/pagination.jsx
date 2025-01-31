import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange, totalresult }) => {
  Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    totalresult: PropTypes.number.isRequired,
  };

  // console.log("current page", currentPage);
  let startPage, endPage;

  if (totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= 3) {
    startPage = 1;
    endPage = 5;
  } else if (currentPage + 2 >= totalPages) {
    startPage = totalPages - 4;
    endPage = totalPages;
  } else {
    startPage = currentPage - 2;
    endPage = currentPage + 2;
  }

  const pages = Array.from(Array(endPage - startPage + 1).keys()).map(
    (i) => startPage + i
  );

  const handlePageClick = (page) => {
    // console.log("function ", page);
    onPageChange(page);
  };

  // console.log("llllll", pages);

  return (
    <>
      <div className="mt-4">
        {totalresult && (
          <span>
            {currentPage > 0 && (
              <>
                Showing {(currentPage - 1) * 25 + 1}-
                {Math.min(currentPage * 25, totalresult)} of {totalresult}{" "}
                results
              </>
            )}
          </span>
        )}
      </div>
      <nav
        aria-label="Page navigation example"
        className="flex justify-center items-center mt-2"
      >
        <ul className="inline-flex -space-x-px">
          <li>
            <a
              className={`flex items-center justify-center px-4 h-8 ms-0 leading-tight text-gray-900 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700   ${
                currentPage === 1
                  ? " opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              Previous
            </a>
          </li>
          {startPage > 1 && (
            <>
              <li>
                <a
                  className={`flex items-center justify-center px-4 h-8 leading-tight border border-gray-300 cursor-pointer 
                   ${
                     currentPage === 1
                       ? " bg-blue-800 text-white"
                       : "text-gray-900"
                   }`}
                  onClick={() => handlePageClick(1)}
                >
                  1
                </a>
              </li>
              {startPage > 2 && <li className="px-4 py-2 ">...</li>}
            </>
          )}
          {pages.map((page, index) => (
            <li key={index}>
              {/* {console.log("inside map ", page)} */}
              <a
                className={`flex items-center justify-center px-4 h-8 leading-tight cursor-pointer   border border-gray-300 ${
                  currentPage === page
                    ? " bg-blue-800 text-white"
                    : "text-gray-900"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </a>
            </li>
          ))}
          {endPage < totalPages && (
            <>
              <li className="px-4 py-2 leading-tight ">...</li>
              <li>
                <a
                  className={`flex items-center justify-center px-4 h-8 leading-tight cursor-pointer text-gray-900 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 `}
                  onClick={() => handlePageClick(totalPages)}
                >
                  {totalPages}
                </a>
              </li>
            </>
          )}
          <li>
            <a
              className={`flex items-center justify-center px-4 h-8 leading-tight  text-gray-900 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                currentPage === totalPages
                  ? " opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              } `}
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Pagination;
