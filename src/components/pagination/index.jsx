import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Add previous button
    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Prev
        </button>
      );
    }

    // Determine the range of pages to display
    const startPage = Math.max(totalPages - 4, 1);
    const endPage = totalPages;

    // Add pages (last 5)
    for (let i = startPage; i <= endPage; i++) {
      if (i === currentPage) {
        pageNumbers.push(
          <button
            key={i}
            className="px-4 py-2 mx-1 text-white bg-blue-600 rounded"
          >
            {i}
          </button>
        );
      } else {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className="px-4 py-2 mx-1 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            {i}
          </button>
        );
      }
    }

    // Add ellipsis if there are more than 5 pages
    if (totalPages > 5) {
      if (currentPage < totalPages - 4) {
        pageNumbers.unshift(
          <span key="ellipsis" className="px-4 py-2 mx-1 text-white">...</span>
        );
      }
    }

    // Add last page button
    if (totalPages > 1 && currentPage < totalPages) {
        if(!pageNumbers.includes(totalPages)){
            pageNumbers.push(
                <button
                key={totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 mx-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                {totalPages}
                </button>
            );
        }
    }

    // Add next button
    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Next
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <nav className="flex justify-center mt-4">
      {renderPageNumbers()}
    </nav>
  );
};

export default Pagination;
