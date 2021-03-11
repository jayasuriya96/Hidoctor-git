using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;


namespace DataControl
{
    public static class AsynTableConvert
    {
        public static string ConvertDataTabletoHtmlString(DataTable dt)
        {
            string result = "";

            if (dt != null && dt.Rows.Count > 0)
            {
                List<string> columnNames = new List<string>();

                //To build columns as <th>{0}</th>
                int columnsCount = dt.Columns.Count;

                for (int i = 0; i < columnsCount; i++)
                    columnNames.Add(string.Format("<th class='active'>{0}</th>", dt.Columns[i].Caption));

                //To build rows as <td>{0}</td>
                string row = "";
                List<string> rows = new List<string>();

                for (int rowIndex = 0; rowIndex < dt.Rows.Count; rowIndex++)
                {
                    row = "";

                    for (int columnIndex = 0; columnIndex < columnsCount; columnIndex++)
                        row += string.Format("<td>{0}</td>", dt.Rows[rowIndex][columnIndex].ToString());

                    rows.Add(string.Format("<tr>{0}</tr>", row));
                }

                result = string.Format("<table class='table table-striped'><tr>{0}</tr>{1}</table>", string.Join("", columnNames.ToArray()), string.Join("", rows.ToArray()));
            }
            else
            {
                result = "No details found.";
            }
            return result;
        }

        public static string ConvertDatasettoHtml(DataTable dt,string startDate,string endDate)
        {
            StringBuilder strTbl = new StringBuilder();
            StringBuilder strLegends = new StringBuilder();
            if (dt != null && dt.Rows.Count > 0)
            {
                strTbl.Append("<div id='dvLegends'><b> Asynchronous Last Submitted Report for the period of " + startDate.Split('-')[2] + "-" + startDate.Split('-')[1] + "-" + startDate.Split('-')[0] + " to " + endDate.Split('-')[2] + "-" + endDate.Split('-')[1] + "-" + endDate.Split('-')[0] + "</b></div>");
                strTbl.Append("<div>* 1. Drafted & Unapproved DCRs are not considered in this report </div>");
                strTbl.Append("<div style='margin-left: 7px;'>2.Only approved DCRs are considered for POB amount computation. </div>");
                strTbl.Append("<div style='margin-left: 7px;'>3.<b>Count of Missed Doctors</b> is the Number of Doctors never visited even once in the selected date period.</div>");
                strTbl.Append("<div style='margin-left: 7px;'>4.<b>Listed Doctors Visited Once</b> is the Number of Doctors visited only once in the selected date period. REPEAT for twice and thrice and more than thrice.</div>");
                strTbl.Append("<div style='margin-left: 7px;'>5.<b>Count of Listed Doctors Met</b> is the Number of Doctors Met in the selected date period.</div>");
                strTbl.Append("<div style='margin-left: 7px;'>6.<b>Average Number of Listed Doctors</b> Met is Listed Doctors Met / Num. of Field Days.</div>");


                strTbl.Append("<table class='data display datatable' id='tblAsynLastsubrept'>");
                //strTbl.Append("<table class='table table-striped'>" class='active');
                strTbl.Append("<thead>");
                //add header row
                strTbl.Append("<tr>");
                for (int i = 0; i < dt.Columns.Count; i++)
                    strTbl.Append("<th>" + dt.Columns[i].ColumnName + "</th>");
                strTbl.Append("</tr>");
                strTbl.Append("</thead>");
                strTbl.Append("<tbody>");
                //add rows
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    strTbl.Append("<tr>");
                    for (int j = 0; j < dt.Columns.Count; j++)
                        strTbl.Append("<td>" + dt.Rows[i][j].ToString() + "</td>");
                    strTbl.Append("</tr>");
                }
                strTbl.Append("</tbody>");
                strTbl.Append("</table>");
            }
            else
            {
               strTbl.Append("No details found.");
            }
            return strTbl.ToString();
        }
    }
}
