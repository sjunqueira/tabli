import { TableData } from "../lib/types";

export function TableSnippet({ table }: { table: TableData }) {
  return (
    <div className="snippet-card min-w-[420px] w-fit">
      <table className="snippet-table">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}