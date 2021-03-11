#region Usings
using DataControl.Abstraction;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Text;
#endregion Usings
namespace DataControl.Impl
{
    public class ExcelFactory : IExcelFactory
    {
        #region Constant Strings
        const string SECRET_VALUES_CELL_REFERENCE = "CV";
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        #endregion Constant Strings

        #region Private Members
        private bool _replaceCarriageReturnsAndLineFeedsFromFieldValues = true;
        private string _carriageReturnAndLineFeedReplacement = ",";
        private uint SECRET_VALUES_START_ROW_INDEX = 12000;
        #endregion Private Members

        #region Properties

        /// <summary>
        /// Gets or sets whether carriage returns and line feeds should be removed from 
        /// field values, the default is true 
        /// </summary>
        public bool ReplaceCarriageReturnsAndLineFeedsFromFieldValues
        {
            get
            {
                return _replaceCarriageReturnsAndLineFeedsFromFieldValues;
            }
            set
            {
                _replaceCarriageReturnsAndLineFeedsFromFieldValues = value;
            }
        }

        #region Public Methods
        /// <summary>
        /// Gets or sets what the carriage return and line feed replacement characters should be
        /// </summary>
        public string CarriageReturnAndLineFeedReplacement
        {
            get
            {
                return _carriageReturnAndLineFeedReplacement;
            }
            set
            {
                _carriageReturnAndLineFeedReplacement = value;
            }
        }

        #endregion Properties



        /// <summary>
        /// 
        /// </summary>
        /// <param name="retrieveColumnNames"></param>
        /// <param name="sheetName"></param>
        /// <param name="whereQuery"></param>
        /// <param name="filenamewithpath"></param>
        /// <returns></returns>
        public DataTable ExcelToDataSet(string[] retrieveColumnNames, string sheetName, string whereQuery, string filenamewithpath, string keyColumnName)
        {
            System.Data.DataTable table = new System.Data.DataTable();
            string columns = string.Empty;

            // Set Column Names.
            foreach (string columName in retrieveColumnNames)
            {
                columns = columns + columName + ",";
            }

            // Remove the last index comma,
            columns = columns.Remove(columns.LastIndexOf(','));

            // Set the Query.
            string query = "SELECT " + columns + " FROM [" + sheetName + "] ";
            query += whereQuery.Trim().Length > 0 ? " WHERE " + whereQuery : "";

            // Specify the connection string and convert the Excel to DataTable.
            string strConn = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0;HDR=YES;IMEX=1;\"", filenamewithpath);

            using (OleDbConnection dbConnection = new OleDbConnection(strConn))
            {
                dbConnection.Open();
                DataTable dtWorksheetTables = dbConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (dtWorksheetTables == null || dtWorksheetTables.Rows.Count == 0)
                {
                    return null;
                }

                using (OleDbDataAdapter dbAdapter = new OleDbDataAdapter(query, dbConnection))
                {
                    DataTable tbl = dbAdapter.FillSchema(table, SchemaType.Mapped);
                    foreach (DataColumn col in tbl.Columns)
                    {
                        tbl.Columns[col.ColumnName].DataType = typeof(string);
                    }

                    dbAdapter.Fill(tbl);
                }
            }


            // Returns the table.
            return table;
        }

        /// <summary>
        /// Represent the method used to check column headers are correct or not.
        /// </summary>
        /// <param name="columnHeaderNames">Specify the column header names in hashTable</param>
        /// <param name="sheetName">Specify excel sheet name</param>
        /// <param name="fileNameFullPath">Specify excel file path.</param>
        /// <returns></returns>
        public bool IsExcelColumnHeadrsAreCorrect(Hashtable columnHeaderNames, string sheetName, string fileNameFullPath)
        {
            System.Data.DataTable tableColumns = new System.Data.DataTable();
            Hashtable h = new Hashtable();
            foreach (object key in columnHeaderNames.Keys)
            {
                h.Add(key.ToString().ToUpper(),"");
            }
            // Specify the connection string.
            string strConn = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0;HDR=YES;\"", fileNameFullPath);
            //string strConn = "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + fileNameFullPath + ";Extended Properties=\"Excel 8.0;HDR=YES;\"";
            // Writes the Query only for retreving header names.
            string query = "SELECT * FROM [" + sheetName + "] WHERE 1=0 ";

            // Set the connection and retrieve the excel schema.
            using (OleDbConnection dbConnection = new OleDbConnection(strConn))
            {
                dbConnection.Open();
                DataTable dtWorksheetTables = dbConnection.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (dtWorksheetTables == null || dtWorksheetTables.Rows.Count == 0)
                {
                    return false;
                }
                using (OleDbDataAdapter dbAdapter = new OleDbDataAdapter(query, dbConnection))
                    dbAdapter.Fill(tableColumns);
                dbConnection.Close();
            }


            // Check the table column names are exists in hashtable.
            // if any one column is not in datatbale, System retruns false.
            // Other wise true.
            Hashtable htExcelColumns = new Hashtable();
            foreach (DataColumn columnName in tableColumns.Columns)
            {
                htExcelColumns.Add(columnName.ColumnName.ToString().ToUpper(), "");
                if (!h.Contains(columnName.ColumnName.ToString().ToUpper()))
                {
                    return false;
                }
            }
            foreach (var column in columnHeaderNames.Keys)
            {
                if (!htExcelColumns.Contains(column.ToString().ToUpper()))
                {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Excel Row No column validation.
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public bool IsRowNumbersAreValid(DataTable dt)
        {
            try
            {
                for (int index = 0; index < dt.Rows.Count; index++)
                {
                    Convert.ToInt32(dt.Rows[index]["Row_No"]);
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileStorageKeyName"></param>
        /// <param name="fileName"></param>
        /// <param name="ds"></param>
        /// <param name="hiddenColumnNames"></param>
        /// <param name="secretValues"></param>
        /// <param name="lockedColumns"></param>
        public void DataSetToExcel(string fileStorageKeyName, string fileName, DataSet ds, string[] hiddenColumnNames,
            string[] secretValues, bool isSheetProtect, string[] editableColumns)
        {
            IFileProvider fileProvider = new FileSystemProvider();
            DataTable dt = ds.Tables[0];

            // Generate filepath with file name
            // TODO: Change the blog path.
            string outputFile = fileProvider.GetFilePathToSave(fileStorageKeyName, fileName);
            // Create SpreadSheet document.
            SpreadsheetDocument spreadSheetDocument = SpreadsheetDocument.Create(outputFile, SpreadsheetDocumentType.Workbook);
            try
            {
                // Add workbook part.
                WorkbookPart workbookPart = spreadSheetDocument.AddWorkbookPart();

                // Adding sheet part...
                WorksheetPart sheetPart = workbookPart.AddNewPart<WorksheetPart>();
                string relId = workbookPart.GetIdOfPart(sheetPart);

                Workbook workbook = new Workbook();
                SheetData sheetData = CreateSheetData(dt, secretValues);
                Worksheet Worksheet = new Worksheet();

                // Creates Columns object.
                Columns columns = CreateColumns(dt, hiddenColumnNames);
                Worksheet.Append(columns);

                // New Sheet create.
                Sheets sheets = new Sheets();
                Sheet sheet = new Sheet { Name = dt.TableName, SheetId = 1, Id = relId };
                sheets.Append(sheet);

                workbook.Append(sheets);
                Worksheet.Append(sheetData);
                sheetPart.Worksheet = Worksheet;

                // Sheet Protect with password.
                if (isSheetProtect)
                {
                    PageMargins pageM;
                    SheetProtection sheetProtection;
                    ProtectedRanges pRanges;

                    ProtectSheet(Worksheet, out pageM, out sheetProtection, out pRanges, editableColumns, dt);
                    Worksheet.InsertBefore(sheetProtection, pageM);
                    Worksheet.InsertBefore(pRanges, pageM);
                }

                // Save the worksheet.
                sheetPart.Worksheet.Save();

                // Assign the workbook and save then close.
                spreadSheetDocument.WorkbookPart.Workbook = workbook;
                spreadSheetDocument.WorkbookPart.Workbook.Save();
            }
            finally
            {
                spreadSheetDocument.Close();
                spreadSheetDocument.Dispose();
                GC.Collect();

                GC.Collect();
            }
        }
        #endregion Public Methods

        #region Excel Helper Methods

        /// <summary>
        /// Protect the sheet.
        /// </summary>
        /// <param name="Worksheet"></param>
        /// <param name="pageM"></param>
        /// <param name="sheetProtection"></param>
        /// <param name="pRanges"></param>
        /// <param name="lockedColumns"></param>
        private void ProtectSheet(Worksheet Worksheet, out PageMargins pageM, out SheetProtection sheetProtection,
            out ProtectedRanges pRanges, string[] editableColumns, DataTable dt)
        {
            pageM = Worksheet.GetFirstChild<PageMargins>();
            sheetProtection = new SheetProtection();
            sheetProtection.Sheet = true;
            sheetProtection.Objects = true;
            sheetProtection.Scenarios = true;

            // Set the password.
            sheetProtection.Password = new HexBinaryValue() { Value = "CC1A" };

            pRanges = new ProtectedRanges();

            if (editableColumns.Length > 0)
            {
                int i = 0;
                foreach (string columnName in editableColumns)
                {
                    i++;
                    ProtectedRange pRange = new ProtectedRange();
                    ListValue<StringValue> lValue = new ListValue<StringValue>();

                    // Get Excel Column Number.
                    string columnindex = GetExcelColumnNumber(columnName, dt);
                    lValue.InnerText = columnindex + "1:" + columnindex + (dt.Rows.Count + 1).ToString();

                    // Assign the editable columns.
                    pRange.SequenceOfReferences = lValue;
                    pRange.Name = "Editable_" + i.ToString();
                    pRanges.Append(pRange);
                }
            }
        }


        /// <summary>
        /// Retrieve the excel column number.
        /// </summary>
        /// <param name="colName"></param>
        /// <param name="dt"></param>
        /// <returns></returns>
        private string GetExcelColumnNumber(string colName, DataTable dt)
        {
            int number = dt.Columns.IndexOf(colName);
            string result;
            int rest = number % 26;
            int q = number / 26;
            if (q == 0)
            {
                result = chars[rest].ToString();
            }
            else
            {
                result = GetExcelColumnNumber(q.ToString(), dt) + chars[rest];
            }
            return result;
        }

        /// <summary>
        /// Creates Columns Data.
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="hiddenColumns"></param>
        /// <returns></returns>
        private Columns CreateColumns(DataTable dt, string[] hiddenColumns)
        {

            Columns columns = new Columns();

            for (int iCol = 0; iCol < dt.Columns.Count; iCol++)
            {
                Column c;
                string columnName = dt.Columns[iCol].ColumnName;
                if (isExistinArray(hiddenColumns, columnName))
                {
                    c = CreateColumnData((UInt32)iCol + 1, (UInt32)dt.Columns.Count + 1, columnName.Length + 5, true);
                }
                else
                {
                    c = CreateColumnData((UInt32)iCol + 1, (UInt32)dt.Columns.Count + 1, columnName.Length + 5, false);
                }
                columns.Append(c);
            }
            return columns;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private SheetData CreateSheetData(DataTable dt, string[] secretValues)
        {
            SheetData sheetData = new SheetData();
            int index = 1;

            if (dt.Rows.Count > 0)
            {
                DataColumnCollection columns = dt.Columns;

                Row headerRow = new Row();
                headerRow.RowIndex = (uint)index;
                foreach (DataColumn column in columns)
                {
                    Cell headercell = CreateHeaderCell(column);
                    headerRow.Append(headercell);
                }
                sheetData.Append(headerRow);

                foreach (DataRow dr in dt.Rows)
                {
                    Row excelRow = new Row();
                    index++;
                    excelRow.RowIndex = (uint)index;
                    foreach (DataColumn col in columns)
                    {
                        if (col.DataType == typeof(System.Int32))
                        {
                            NumberCell c = new NumberCell(dr[col].ToString());
                            excelRow.Append(c);
                        }
                        else if (col.DataType == typeof(System.Int64))
                        {
                            NumberCell c = new NumberCell(dr[col].ToString());
                            excelRow.Append(c);
                        }
                        else if (col.DataType == typeof(string))
                        {
                            TextCell c = new TextCell(dr[col].ToString());
                            excelRow.Append(c);
                        }
                        else if (col.DataType == typeof(DateTime))
                        {
                            DateCell c = new DateCell(dr[col].ToString());
                            excelRow.Append(c);
                        }
                    }
                    sheetData.Append(excelRow);
                }
            }

            if (secretValues.Length > 0)
            {
                foreach (string value in secretValues)
                {
                    Row secretRows = new Row();
                    secretRows.RowIndex = (uint)SECRET_VALUES_START_ROW_INDEX;
                    string secretCellRefer = SECRET_VALUES_CELL_REFERENCE + SECRET_VALUES_START_ROW_INDEX.ToString();
                    SecretValues c = new SecretValues(value, secretCellRefer);

                    secretRows.Append(c);
                    sheetData.Append(secretRows);
                    SECRET_VALUES_START_ROW_INDEX++;

                }
            }
            return sheetData;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="startColumnIndex"></param>
        /// <param name="endColumnIndex"></param>
        /// <param name="columnWidth"></param>
        /// <param name="isHidden"></param>
        /// <returns></returns>
        private Column CreateColumnData(UInt32 startColumnIndex, UInt32 endColumnIndex, double columnWidth, bool isHidden)
        {
            Column column;
            column = new Column();
            column.Min = startColumnIndex;
            column.Max = endColumnIndex;
            column.Width = columnWidth;
            column.BestFit = true;
            column.CustomWidth = true;
            column.Hidden = isHidden;
            return column;
        }

        private Cell CreateHeaderCell(DataColumn column)
        {
            Cell cell = new Cell();
            cell.CellValue = new CellValue(column.ColumnName);
            return cell;
        }

        private bool isExistinArray(string[] array, string value)
        {
            foreach (string str in array)
            {
                if (value == str)
                {
                    return true;
                }
            }
            return false;
        }

        #region DataTable to csv write methods

        /// <summary>
        /// Writes a DataTable to a file
        /// </summary>
        /// <param name="dataTable">DataTable</param>
        /// <param name="filePath">File path</param>
        public void WriteCsv(DataTable dataTable, string filePath)
        {
            WriteCsv(dataTable, filePath, null);
        }

        public string WriteCsvIntoBlob(DataTable dataTable, string accKey, string fileName)
        {
            MemoryStream stream = new MemoryStream();
            CurrentInfo objCur = new CurrentInfo();
            string containerName = objCur.GetCompanyCode().ToLower();
            using (StreamWriter writer = new StreamWriter(stream, System.Text.Encoding.Default))
            {
                Repository.AzureBlobUpload objAzureBlob = new Repository.AzureBlobUpload();
                objAzureBlob.PutAzureBlobStorage(stream, fileName, accKey, containerName);
                writer.Flush();
                writer.Close();
            }

            return string.Empty;
        }

        /// <summary>
        /// Writes a DataTable to a file
        /// </summary>
        /// <param name="dataTable">DataTable</param>
        /// <param name="filePath">File path</param>
        /// <param name="encoding">Encoding</param>
        public void WriteCsv(DataTable dataTable, string filePath, Encoding encoding)
        {
            if (File.Exists(filePath))
                File.Delete(filePath);

            using (StreamWriter writer = new StreamWriter(filePath, false, encoding ?? Encoding.Default))
            {

                WriteToStream(dataTable, writer);
                writer.Flush();
                writer.Close();
            }
        }

        /// <summary>
        /// Writes the Csv File
        /// </summary>
        /// <param name="dataTable">DataTable</param>
        /// <param name="writer">TextWriter</param>
        private void WriteToStream(DataTable dataTable, TextWriter writer)
        {
            List<string> fields = (from DataColumn column in dataTable.Columns select column.ColumnName).ToList();
            WriteRecord(fields, writer);

            foreach (DataRow row in dataTable.Rows)
            {
                fields.Clear();
                fields.AddRange(row.ItemArray.Select(o => o.ToString()));
                WriteRecord(fields, writer);
            }
        }
        /// <summary>
        /// Writes the record to the underlying stream
        /// </summary>
        /// <param name="fields">Fields</param>
        /// <param name="writer">TextWriter</param>
        private void WriteRecord(IList<string> fields, TextWriter writer)
        {
            for (int i = 0; i < fields.Count; i++)
            {
                bool quotesRequired = fields[i].Contains(",");
                bool escapeQuotes = fields[i].Contains("\"");
                string fieldValue = (escapeQuotes ? fields[i].Replace("\"", "\"\"") : fields[i]);

                if (ReplaceCarriageReturnsAndLineFeedsFromFieldValues && (fieldValue.Contains("\r") || fieldValue.Contains("\n")))
                {
                    quotesRequired = true;
                    fieldValue = fieldValue.Replace("\r\n", CarriageReturnAndLineFeedReplacement);
                    fieldValue = fieldValue.Replace("\r", CarriageReturnAndLineFeedReplacement);
                    fieldValue = fieldValue.Replace("\n", CarriageReturnAndLineFeedReplacement);
                }

                writer.Write(string.Format("{0}{1}{0}{2}",
                    (quotesRequired || escapeQuotes ? "\"" : string.Empty),
                    fieldValue,
                    (i < (fields.Count - 1) ? "," : string.Empty)));
            }

            writer.WriteLine();
        }
    }
        #endregion DataTable write methods

        #endregion Excel Helper Methods

    #region Excel Helper Classes
    /****STRAT: CELL CREATING CLASSES*****/
    public class NumberCell : Cell
    {
        public NumberCell(string text)
        {
            this.DataType = CellValues.Number;
            this.CellValue = new CellValue(text);
        }
    }

    class DateCell : Cell
    {
        public DateCell(string text)
        {
            this.DataType = CellValues.Date;
            this.CellValue = new CellValue(text);
        }
    }



    class TextCell : Cell
    {
        public TextCell(string text)
        {
            this.DataType = CellValues.InlineString;
            this.InlineString = new InlineString { Text = new Text(text) };
        }
    }

    class SecretValues : Cell
    {
        public SecretValues(string text, string cellReferenceValue)
        {
            this.DataType = CellValues.InlineString;
            this.CellReference = cellReferenceValue;
            this.InlineString = new InlineString { Text = new Text(text) };

        }
    }

    /****END: CELL CREATING CLASSES*****/
    #endregion Excel Helper Classes
}
