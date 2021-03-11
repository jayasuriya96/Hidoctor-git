using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace HiDoctor.Controllers
{
    public class DoctorCallAverage
    {
        const string TOTAL_VISITED_DOCTORS = "Total_Visited_Doctors";
        const string TOTAL_FIELD_COUNT = "Total_Field_Days";
        const string DOCTOR_CATEGORY_CODE = "Doctor_Category_Code";
        const string REGION_NAME = "Region_Name";
        const string REGION_CODE = "Region_Code";

        const string VALUE = "Value";
        const string WORK_MONTH = "Month";
        const string WORK_YEAR = "Year";
        const string AND = "AND";


        public DataSet CalculateDoctorCallAverage(DataSet dsDocCal, string months, int year, string leafRegions)
        {
            DataSet dsCall = new DataSet();
            DataTable dt = new DataTable();

            dt.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
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
            float callAverage = 0;

            DataRow[] drCategory;
            DataRow[] drField;
            leafRegions = leafRegions.Replace("'", "");
            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;

            DataTable dtt = dsDocCal.Tables[0].DefaultView.ToTable(true, DOCTOR_CATEGORY_CODE);

            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();

                foreach (string mnth in monthArry)
                {
                    callAverage = 0;

                    foreach (string region in regionArry)
                    {
                        month = int.Parse(mnth);
                        regionCode = region;
                        drCategory = dsDocCal.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "' " + AND + " " + REGION_CODE + "='" + regionCode + "'");
                        drField = dsDocCal.Tables[1].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "'");

                        if (drCategory.Length > 0 && drField.Length > 0)
                        {
                            if (float.Parse(drField[0][TOTAL_FIELD_COUNT].ToString()) > 0)
                            {
                                callAverage += float.Parse(drCategory[0][TOTAL_VISITED_DOCTORS].ToString()) / float.Parse(drField[0][TOTAL_FIELD_COUNT].ToString());
                            }
                        }
                    }

                    DataRow drCallAve = dt.NewRow();

                    drCallAve[DOCTOR_CATEGORY_CODE] = categoryCode;
                    drCallAve[WORK_MONTH] = month;
                    drCallAve[WORK_YEAR] = year;
                    drCallAve[VALUE] = Math.Round(callAverage / regionCount, 2);

                    dt.Rows.Add(drCallAve);
                    dsCall.AcceptChanges();
                }

            }
            return dsCall;
        }
    }
}
