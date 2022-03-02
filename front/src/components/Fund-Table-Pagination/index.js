const FundTablePagination = ({ pages, page, setPage }) => {
  return (
    <div className="fund__table-wrapper__table__bottom-info__pages">
      <button
        className="fund__table-wrapper__table__bottom-info__page-btns"
        onClick={(e) => {
          if (page > 1) {
            let domObjectLast = document.getElementById(
              `table-pagination-${page}`
            )
            let domObjectNew = document.getElementById(
              `table-pagination-${page - 1}`
            )
            domObjectLast.classList.remove('pagination-active')
            domObjectNew.classList.add('pagination-active')

            setPage(page - 1)
          }
        }}
      >
        &laquo;
      </button>
      {pages.map((item) => {
        return (
          <button
            className={
              item === 1
                ? 'fund__table-wrapper__table__bottom-info__page-btns pagination-active'
                : 'fund__table-wrapper__table__bottom-info__page-btns'
            }
            key={item}
            id={`table-pagination-${item}`}
            onClick={(e) => {
              let domObjectLast = document.getElementById(
                `table-pagination-${page}`
              )
              let domObjectNew = document.getElementById(
                `table-pagination-${item}`
              )

              domObjectLast.classList.remove('pagination-active')
              domObjectNew.classList.add('pagination-active')

              setPage(item)
            }}
          >
            {item}
          </button>
        )
      })}
      <button
        className="fund__table-wrapper__table__bottom-info__page-btns"
        onClick={(e) => {
          if (page < pages.length) {
            let domObjectLast = document.getElementById(
              `table-pagination-${page}`
            )
            let domObjectNew = document.getElementById(
              `table-pagination-${page + 1}`
            )
            domObjectLast.classList.remove('pagination-active')
            domObjectNew.classList.add('pagination-active')
            setPage(page + 1)
          }
        }}
      >
        &raquo;
      </button>
    </div>
  )
}

export default FundTablePagination
