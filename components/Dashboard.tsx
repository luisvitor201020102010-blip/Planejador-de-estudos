import React, { useState, useEffect } from 'react';
import { PlannerOutput } from '../types';
import { Download, FileSpreadsheet, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DashboardProps {
  data: PlannerOutput;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [localData, setLocalData] = useState<PlannerOutput>(data);

  // Sync props to local state if data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    localData.sheets.forEach(sheet => {
      // Clean data for export: ensure formulas are strings and checkboxes are boolean/string
      const exportRows = sheet.rows.map((row, rIndex) => {
        if (rIndex === 0) return row; // Header
        
        return row.map(cell => {
          // If it's the "Realizada" column (assuming typical structure, or check boolean)
          if (cell === true || cell === "TRUE") return true;
          if (cell === false || cell === "FALSE") return false;
          return cell;
        });
      });

      const ws = XLSX.utils.aoa_to_sheet(exportRows);

      // Post-process to convert strings starting with '=' into actual Excel formulas
      // This fixes the issue where formulas appear as text in Google Sheets
      const range = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");
      
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cell_address];
          
          if (cell && cell.t === 's' && typeof cell.v === 'string' && cell.v.startsWith('=')) {
            // It's a formula string (e.g., "=IF(A1,1,0)")
            // SheetJS expects the formula in the 'f' property WITHOUT the '=' prefix
            cell.f = cell.v.substring(1);
            
            // Remove the 'v' (value) property so Excel calculates it on load
            // Set type to 'n' (number) as these are usually calculations returning numbers
            delete cell.v;
            cell.t = 'n'; 
          }
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, sheet.name);
    });

    XLSX.writeFile(wb, `${localData.file_name.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleCheckboxChange = (sheetIndex: number, rowIndex: number, colIndex: number) => {
    const newSheets = [...localData.sheets];
    const currentRow = [...newSheets[sheetIndex].rows[rowIndex]];
    
    // Toggle logic
    const currentValue = currentRow[colIndex];
    // Check if currently considered "checked" (true, "TRUE", "☑")
    const isChecked = currentValue === true || currentValue === "TRUE" || currentValue === "☑";
    
    // Set to boolean for state
    currentRow[colIndex] = !isChecked;
    newSheets[sheetIndex].rows[rowIndex] = currentRow;

    setLocalData({
      ...localData,
      sheets: newSheets
    });
  };

  const renderCell = (cell: any, rowIndex: number, cellIndex: number, headers: any[]) => {
    const header = String(headers[cellIndex] || "").toLowerCase();
    
    // Interactive Checkbox for "Realizada"
    if (activeTab === 0 && header.includes("realizada") && !header.includes("tempo")) {
        // Determine checked state
        const isChecked = cell === true || cell === "TRUE" || cell === "☑";
        
        return (
            <div className="flex justify-center">
                <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(activeTab, rowIndex, cellIndex)}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
            </div>
        );
    }

    // Interactive Display for "Tempo Realizado" (Calculated for Web View)
    if (activeTab === 0 && header.includes("tempo realizado")) {
        // Try to find the "Tempo (min)" column
        const plannedTimeIndex = headers.findIndex((h: any) => String(h).toLowerCase() === "tempo (min)");
        const doneIndex = headers.findIndex((h: any) => String(h).toLowerCase() === "realizada");
        
        if (plannedTimeIndex !== -1 && doneIndex !== -1) {
            // Get raw values from the row data
            const rowData = localData.sheets[activeTab].rows[rowIndex];
            const isDone = rowData[doneIndex] === true || rowData[doneIndex] === "TRUE" || rowData[doneIndex] === "☑";
            const plannedTime = rowData[plannedTimeIndex];
            
            // Display: If done, show time. If not, show 0.
            // Note: We leave the underlying cell data as the formula string for Excel export
            return (
                <span className={`font-mono font-medium ${isDone ? 'text-teal-600' : 'text-slate-400'}`}>
                   {isDone ? plannedTime : 0}
                </span>
            );
        }
    }

    // Default rendering
    return cell === null ? '' : String(cell);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{localData.file_name}</h1>
              <div className="text-sm text-slate-500">
                <p>Criado por: Luís Vitor Maciel Amorim</p>
                <p className="text-teal-600 font-medium">Siga no Instagram @luis_vitor_med</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onReset}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Novo
              </button>
              <button
                onClick={handleDownloadExcel}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Baixar Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 overflow-x-auto">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {localData.sheets.map((sheet, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === index
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
              >
                {sheet.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-slate-200">
              <tbody className="bg-white divide-y divide-slate-200">
                {localData.sheets[activeTab].rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? "bg-slate-50" : "hover:bg-slate-50"}>
                    {row.map((cell, cellIndex) => {
                        const isHeader = rowIndex === 0;
                        const headers = localData.sheets[activeTab].rows[0];
                        
                        return (
                            <td 
                                key={cellIndex} 
                                className={`
                                    px-6 py-4 whitespace-nowrap text-sm 
                                    ${isHeader ? 'font-bold text-slate-900' : 'text-slate-600'}
                                    border-r border-slate-100 last:border-r-0
                                `}
                            >
                                {isHeader 
                                  ? String(cell) 
                                  : renderCell(cell, rowIndex, cellIndex, headers)
                                }
                            </td>
                        );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-slate-500 max-w-2xl mx-auto">
          <p>
            Dica: O download gera um arquivo <strong>.xlsx</strong>. 
            As fórmulas são configuradas automaticamente. Ao abrir no Google Sheets/Excel, aguarde o recálculo.
          </p>
        </div>
      </main>
    </div>
  );
};