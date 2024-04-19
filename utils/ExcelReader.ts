import { Reader } from "./Reader";
import * as XLSX from 'xlsx'

export class ExcelReader implements Reader{
    constructor(){}

    async read(source: Buffer){
        const data: any = {};
        try {
            const workbook = XLSX.read(source, { type: 'buffer' });
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
                const header = rows[0]
                data[sheetName] = rows.slice(1).map((row: any[]) => {
                    const rowData: { [key: string]: any } = {};
                    row.forEach((cellValue, columnIndex) => {
                       const value =  isNaN(cellValue) ? cellValue : parseFloat(cellValue)
                       rowData[header[columnIndex]] = value;

                    });
                    return rowData;
                });
            });
        } catch (error) {
            console.error('Error reading Excel file from buffer:', error);
        }
        return data;
        }
}