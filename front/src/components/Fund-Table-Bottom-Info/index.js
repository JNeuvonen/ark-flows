import FundTablePagination from '../Fund-Table-Pagination'

const FundTableBottomInfo = ({ latestDate, pages, page, setPage }) => {
  return (
    <div className="fund__table-wrapper__table__bottom-info">
      <div className="fund__table-wrapper__table__bottom-info__last-update">
        Last update on {latestDate}
      </div>
      <FundTablePagination pages={pages} page={page} setPage={setPage} />
    </div>
  )
}

export default FundTableBottomInfo
