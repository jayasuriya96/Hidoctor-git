using System.Collections;
using System.Data;
namespace DataControl.Abstraction
{
    public interface IExcelFactory
    {
        void DataSetToExcel(string fileStorageKeyName, string fileName, DataSet ds, string[] hiddenColumnNames, string[] secretValues, bool isSheetProtect, string[] editableColumns);
        DataTable ExcelToDataSet(string[] retrieveColumnNames, string sheetName, string whereQuery, string filenamewithpath, string keyColumnName);
        bool IsExcelColumnHeadrsAreCorrect(Hashtable columnHeaderNames, string sheetName, string fileNameFullPath);
        bool IsRowNumbersAreValid(DataTable dt);
        void WriteCsv(DataTable dataTable, string filePath);
        string WriteCsvIntoBlob(DataTable dataTable, string accKey, string fileName);
    }
}
