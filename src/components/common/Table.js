import React from "react";
import { useTable, usePagination, useGlobalFilter, useFilters, useSortBy, setHiddenColumns } from 'react-table'
import GlobalFilter from "./GlobalFilter";
import { GlobalPagination } from "./GlobalPagination";

function Table({ columns, data, roles, isRolesEnabled, perPage, tableType, sortField,onPage,isLoader=false }) {

  //console.log("table",data)
  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, 
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    siblingCount,
    nextPage,
    previousPage,
    setPageSize,
    setFilter,
    setGlobalFilter,
    setHiddenColumns,
    state: { pageIndex,
      pageSize
    },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0, pageSize: perPage, sortBy: [{
          id: sortField,
          desc: true

        }],
        hiddenColumns: [sortField]
      },

    },

    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,

  )

  let totalCount = rows.length
  let currentPage = Number(pageIndex);
  let dataCount = data.length;
  let customPagination = <div className="grid md:grid-cols-3 gap-3 pb-3">
    <p className="text-sm font-normal p-4 text-slate-gray">
    {isLoader === true ? "Loading .." : "No records found"}
      </p>
  </div>

  return (
    <>
     {(onPage!='dashboard') ?  
      <GlobalFilter
        preGlobalFilteredRows={data}
        setGlobalFilter={setGlobalFilter}
        setFilter={setFilter}
        roles={roles}
        isRolesEnabled={isRolesEnabled}
        tableType={tableType}
      />
      :''
      }
      <div className="overflow-y-auto">
        <table className="items-center bg-transparent w-full border-collapse"  >
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="px-4 py-2 h-10 bg-gray-50 text-slate-gray align-middle border text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}

          </thead>



          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td key={i} className="border-t-0 px-4 py-2 align-middle border-l-0 border-r-0 text-xs font-normal whitespace-nowrap p-4 truncate max-w-xs trans-code" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/*custom pagination render start*/}
      {/* {customPagination} */}

      {(page.length == 0) ?
        customPagination :

        <div>
           {(onPage!='dashboard') ?    
        
                 
          <GlobalPagination
            totalCount={totalCount}
            dataCount={dataCount}
            pageSize={perPage}
            siblingCount={siblingCount}
            currentPage={currentPage}
            gotoPage={gotoPage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
          />
         
         :''}
        </div>

      }
      {/*custom pagination render end*/}
    </>
  )

}
export default Table;