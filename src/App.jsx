  import { useState } from 'react';
  import './App.css'

  const Spreadsheet = () => {
    const [showForm, setShowForm] = useState(true);
    const [rows, setRows] = useState(5);
    const [columns, setColumns] = useState(5);
    const [data, setData] = useState([]

    )
    const handleCreateSpreadsheet = () => {
      setData(Array(rows).fill().map(() => Array(columns).fill('')));
      setShowForm(false);
    };

    const handleBackToInput = () => {
      setShowForm(true);
    };

    const renderCell = (rowIndex, colIndex) => {
      const cellValue = data[rowIndex][colIndex];
      const displayValue = evaluateFormula(cellValue);
      return (
        <td>
        <input
          type="text"
          value={cellValue}
          onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
          onBlur={() => handleBlur(rowIndex, colIndex)}
          />
          {cellValue.startsWith("=") && <div className='formula-result'>{displayValue}</div>}
          </td>

      );
    };

    const cellToIndex = (cellRef) => {
      const col = cellRef.charCodeAt(0) - 65;
      const row = parseInt(cellRef.slice(1)) - 1;
      return [row, col];
    }

    const handleChange = (row, col, value) => {
      const newData = [...data];
      newData[row][col] = value;
      setData(newData);
    };

    const handleBlur = (row, col) => {
      const cellVal = data[row][col];
      if(cellVal.startsWith('=')){
        setData([...data])
      }
    }


    const evaluateFormula = (formula, visited = new Set()) => {
      if(!formula.startsWith('=')){
        return formula;
      }
      try{
          const expression = formula.slice(1).replace(/[A-E][1-5]/g, (match) => {
            const [row, col] = cellToIndex(match);
            if(visited.has(`${row}.${col}`)){
              throw new Error("Circular reference found");
            }
            visited.add(`${row}.${col}`);
            const cellValue = evaluateFormula(data[row][col], new Set(visited));
            visited.delete(`${row}.${col}`)

            return isNaN(cellValue) ? cellValue : Number(cellValue);
          });
          const result = eval(expression)
          return isNaN(result) ? result : Number(result);
        } 
          catch(error){
          return '#ERROR';
        }
    };

    if(showForm){

      return (
        <div>
          <h1>Welcome to Simple Spreadsheet</h1>
          <div>
            <label htmlFor="rows">Number of Rows: </label>
            <input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 0))}
              min="1"
            />
          </div>
          <div>
            <label htmlFor="columns">Number of Columns</label>
            <input 
              type="number"
              id="rows"
              value={columns}
              onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 0))}
              min="1"
              />
          </div>
          <button onClick={handleCreateSpreadsheet}>Create Speadsheet</button>
        </div>
    );
  }
  if(!showForm){
    return (
      <div>
        <h1>Simple Spreadsheet</h1>
        <table>
            <thead>
              <tr>
                <th></th>
                {data[0].map((_, index) => (
                  <th key={index}>{String.fromCharCode(65 + index)}</th>
                ))}
              </tr>
            </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex + 1}</th>
                {row.map((_, colIndex) => (
                  <td key={colIndex}>{renderCell(rowIndex, colIndex)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className='back-button' onClick={handleBackToInput}>Back to input</button>
    </div>
  )
}
  };

  export default Spreadsheet;