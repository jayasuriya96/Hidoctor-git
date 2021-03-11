using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace HiDoctor.Controllers
{
    public class ChemistCallAverage
    {
        const string REGION_NAME = "Region_Name";
        const string UNIQUE_CHEMIST_VISITED_COUNT = "Unique_Chemist_Visited_Count";
        const string TOTAL_FIELD_COUNT = "Total_Field_Count";
        const string REGION_CODE = "Region_Code";
        const string VALUE = "Value";
        const string WORK_MONTH = "Month";
        const string WORK_YEAR = "Year";
        const string AND = "AND";


        public DataSet CalculateChemistCallAverage(DataSet dsChemistCal, string months, int year, string leafRegions)
        {
            DataSet dsCall = new DataSet();
            DataTable dt = new DataTable();

            dt.Columns.Add(WORK_MONTH, typeof(string));
            dt.Columns.Add(WORK_YEAR, typeof(string));
            dt.Columns.Add(VALUE, typeof(string));

            dsCall.Tables.Add(dt);
            dsCall.AcceptChanges();

            // string regionName = string.Empty;
            string regionCode = string.Empty;
            string monthName = string.Empty;
            string categoryCode = string.Empty;

            int regionCount = 0;
            int month = 0;
            float chemistAverage = 0;

            DataRow[] drChemist;

            leafRegions = leafRegions.Replace("'", "");
            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;

            DataTable dtt = dsChemistCal.Tables[0].DefaultView.ToTable(true, REGION_CODE);

            foreach (string mnth in monthArry)
            {
                month = int.Parse(mnth);
                chemistAverage = 0;

                foreach (DataRow dtRow in dtt.Rows)
                {
                    regionCode = dtRow[REGION_CODE].ToString();
                    drChemist = dsChemistCal.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "'");

                    if (drChemist.Length > 0)
                    {
                        if (float.Parse(drChemist[0][TOTAL_FIELD_COUNT].ToString()) > 0)
                        {
                            chemistAverage += (float.Parse(drChemist[0][UNIQUE_CHEMIST_VISITED_COUNT].ToString()) / float.Parse(drChemist[0][TOTAL_FIELD_COUNT].ToString()));
                        }
                    }
                }

                DataRow drChemistAve = dt.NewRow();
                drChemistAve[WORK_MONTH] = month;
                drChemistAve[WORK_YEAR] = year;
                drChemistAve[VALUE] = Math.Round(chemistAverage / regionCount, 2);

                dt.Rows.Add(drChemistAve);
                dsCall.AcceptChanges();

            }
            return dsCall;
        }
    }
}
