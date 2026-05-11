import type { Entry } from "../interfaces/Entry"

interface props {
  titles: string[]
  entries: Entry[]
  onEditClick: () => void
  getFormDataEntry?: (entry: Entry) => void
  onDeleteClick?: (entry: Entry) => void
}

function Table({ titles, entries, onEditClick, onDeleteClick, getFormDataEntry }: props) {
  return <>
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
                <button onClick={() => onDeleteClick?.(entry)}>delete</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </>

}

export default Table;
