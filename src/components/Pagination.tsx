import React from 'react';
import { styled } from '@stitches/react';

interface PaginationProps {
    rowsPerPage: number;
    totalRows: number;
    paginate: (pageNumber: number) => void;
    currentPage: number;
}

const PaginationContainer = styled('nav', {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 0',
});

const PageButton = styled('button', {
    padding: '5px 10px',
    margin: '0 5px',
    cursor: 'pointer',
    '&:disabled': {
        color: 'gray',
        cursor: 'not-allowed',
    },
});

const Pagination: React.FC<PaginationProps> = ({
                                                   rowsPerPage,
                                                   totalRows,
                                                   paginate,
                                                   currentPage
                                               }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pageLimit = 5; // number of pages to display in the navigation

    let maxPageNumberLimit = currentPage + 2;
    let minPageNumberLimit = currentPage - 2;

    if (maxPageNumberLimit > totalPages) {
        maxPageNumberLimit = totalPages;
        minPageNumberLimit = totalPages - pageLimit + 1 < 1 ? 1 : totalPages - pageLimit + 1;
    } else if (minPageNumberLimit < 1) {
        minPageNumberLimit = 1;
        maxPageNumberLimit = Math.min(pageLimit, totalPages);
    }

    for (let i = minPageNumberLimit; i <= maxPageNumberLimit; i++) {
        pageNumbers.push(i);
    }

    const handleFirstPage = () => {
        paginate(1);
    };

    const handleLastPage = () => {
        paginate(totalPages);
    };

    const handlePrevBtn = () => {
        paginate(currentPage - 1);
    };

    const handleNextBtn = () => {
        paginate(currentPage + 1);
    };

    return (
        <PaginationContainer>
            <PageButton onClick={handleFirstPage} disabled={currentPage === 1}>
                First
            </PageButton>
            <PageButton onClick={handlePrevBtn} disabled={currentPage === 1}>
                Prev
            </PageButton>
            {pageNumbers.map(number => (
                <PageButton key={number} onClick={() => paginate(number)} disabled={number === currentPage}>
                    {number}
                </PageButton>
            ))}
            <PageButton onClick={handleNextBtn} disabled={currentPage === totalPages}>
                Next
            </PageButton>
            <PageButton onClick={handleLastPage} disabled={currentPage === totalPages}>
                Last
            </PageButton>
        </PaginationContainer>
    );
};

export default Pagination;
