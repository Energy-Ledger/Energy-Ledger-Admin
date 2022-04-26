import React, { useMemo } from 'react'

export const DOTS = '...';

const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const CustomPagination = ({ totalCount,dataCount, pageSize, siblingCount = 1, currentPage,canPreviousPage,canNextPage, paginationData, setPage, pageData }) => {

    ++currentPage;

    // console.log('GlobalPagination: ', totalCount, pageSize, pageData, currentPage);

    const paginationRange = useMemo(() => {
        const totalPageCount = paginationData.totalPages || 0;
        const totalPageNumbers = siblingCount + 5;
        // console.log('paginationData', paginationData)
        if (totalPageNumbers >= totalPageCount)
        {
            return range(1, totalPageCount);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if (!shouldShowLeftDots && shouldShowRightDots)
        {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS, totalPageCount];
        }

        if (shouldShowLeftDots && !shouldShowRightDots)
        {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots)
        {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [totalCount, pageSize, siblingCount, currentPage]);

    //   return paginationRange;
    let myPagination =  ''
    if(totalCount!==0)
    {
    myPagination =  
    <nav aria-label="Page navigation" className="inline-flex justify-end px-3 ">
            <ul className="inline-flex space-x-2 items-center">
                <li><button onClick={() => setPage(1)} disabled={!canPreviousPage} className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg></button>
                </li>
                        {
                            paginationRange.map((pageNumber, index) => {
                                if (pageNumber === DOTS) {
                                    return <li key={index} className="page-item">&#8230;</li>;
                                }

                                return (
                                    <li key={index}>
                                    <button key={index} className={(Number(pageNumber)===Number(pageData))?"w-10 h-10 text-white transition-colors duration-150 bg-indigo-600 border border-r-0 border-indigo-600 rounded-full focus:shadow-outline":"w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"} key={pageNumber} value={pageNumber} onClick={e=>{setPage(e.target.value)}}>
                                        {pageNumber}
                                    </button>
                                    </li>
                                );
                            })
                        }
                        <li><button  onClick={() => setPage(paginationRange.length - 1)} disabled={!canNextPage} className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg></button>
                </li>
            </ul>
        </nav>
    }
    return (myPagination)
};