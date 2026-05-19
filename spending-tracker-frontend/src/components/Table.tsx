import type { JSX } from "react"
import type { Entry } from "../interfaces/Entry"

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
    return <div className="text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }

  return isLoading ? RenderPlaceHolder() : <>
    <div className="table-responsive m-3 rounded">
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            {titles.map((title, index) => {
              return <th className="text-nowrap" key={index}>{title}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            return <tr key={index}>
              {Object.values(entry).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
              <td className="d-flex gap-1">
                <button onClick={() => {
                  onEditClick();
                  if (getFormDataEntry) {
                    getFormDataEntry(entry);
                  }
                }}>edit</button>
                <button onClick={() => onDeleteClick?.(entry.date)}>delete</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </>
}

export default Table;
