import type { JSX } from "react"
import type { Entry } from "../interfaces/Entry"
import "../css/Table.css"

interface props {
  titles: string[]
  entries: Entry[]
  onEditClick: () => void
  getFormDataEntry?: (entry: Entry) => void
  onDeleteClick?: (entryDate: string) => void
  isLoading?: boolean
}

function Table({ titles, entries, onEditClick, onDeleteClick, getFormDataEntry, isLoading }: props) {
  const RenderPlaceHolder: () => JSX.Element = () => {
    return <div className="table-loading">
      <div className="table-spinner" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  }
  return isLoading ? RenderPlaceHolder() : <>
    <div className="table-card">
      <table className="app-table">
        <thead>
          <tr>
            {titles.map((title, index) => {
              return <th key={index}>{title}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            return <tr key={index}>
              {Object.values(entry).map((value, i, arr) => {
                if (i === 0) {
                  // first column: date, shown as-is
                  return <td key={i}>{value}</td>
                }
                if (i === arr.length - 1) {
                  // last column: percent change
                  return <td key={i}>{`${value}%`}</td>
                }
                return <td key={i}>{`$${value}`}</td>
              })}
              <td className="app-table__actions">
                <button className="app-table__btn app-table__btn--edit" onClick={() => {
                  onEditClick();
                  if (getFormDataEntry) {
                    getFormDataEntry(entry);
                  }
                }}>Edit</button>
                <button className="app-table__btn app-table__btn--delete" onClick={() => onDeleteClick?.(entry.date)}>Delete</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </>
}

export default Table;