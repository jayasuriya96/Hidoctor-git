using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using MVCModels;

namespace DataControl
{
    public class BL_Report
    {
        private DAL_Report _objDALreport = new DAL_Report();

        public DataSet GetDoctorCoverageCount(string companyCode, string userCode, string startDate, string endDate, string mode)
        {
            return _objDALreport.GetDoctorCoverageCount(companyCode, userCode, startDate, endDate, mode);
        }
        public DataSet GetDoctorCallAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {
            return _objDALreport.GetDoctorCallAnalysis(companyCode, regionCode, startDate, endDate);
        }
        public string GetFieldWorkAnalysisReportHTML(DataSet dsFWA, string startDate, string endDate)
        {
            DataRow[] drt;
            StringBuilder tblBuilder = new StringBuilder();
            StringBuilder typeBuilder = new StringBuilder();
            DateTime dt1 = Convert.ToDateTime(startDate);
            DateTime dt2 = Convert.ToDateTime(endDate);
            TimeSpan ts = dt2 - dt1;
            int noOfDays = ts.Days + 1;
            float avg = 0;
            if (dsFWA.Tables[0].Rows.Count > 0)
            {
                tblBuilder.Append("");
                tblBuilder.Append("<table cellspacing='0' cellpadding='0' class='data display datatable' width='100%' id='tblfieldWorkAnalysis' >");
                tblBuilder.Append("<thead>");
                tblBuilder.Append("<tr style='display: none;' id='tblTrfield'>");
                tblBuilder.Append("<th align='left' >User Name</th>");
                tblBuilder.Append("<th align='left' >User Type Name</th>");
                tblBuilder.Append("<th align='left' >Territory Name</th>");
                tblBuilder.Append("<th align='left' >Employee Name</th>");
                tblBuilder.Append("<th align='left' >Division</th>");
                tblBuilder.Append("<th align='left' >Reporting Manager</th>");
                tblBuilder.Append("<th align='left' >Reporting HQ</th>");
                tblBuilder.Append("<th align='left' >% Days worked </th>");
                tblBuilder.Append("<th align='left' >Joint field work % (Manager only)</th>");
                tblBuilder.Append("<th align='left' >Call Avg</th>");
                tblBuilder.Append("<th align='left' >Total Coverage %</th>");
                typeBuilder.Append("[{ type: \"tex\" }, { type: \"tex\" }, { type: \"tex\" },{ type: \"tex\" },{ type: \"tex\" },{ type: \"tex\" },{ type: \"tex\" }, { type: \"number-range\" }, { type: \"number-range\" },{ type: \"number-range\" },{ type: \"number-range\" }");

                if (dsFWA.Tables[0].Rows.Count > 0)
                {
                    for (var i = 0; i < dsFWA.Tables[0].Rows.Count; i++)
                    {
                        typeBuilder.Append(", { type: \"number-range\" }");
                        tblBuilder.Append("<th align='left'>Total " + dsFWA.Tables[0].Rows[i]["Category_Name"].ToString() + " Coverage %</th>");
                    }
                }
                tblBuilder.Append("<th align='left' >Total Visits %</th>");
                typeBuilder.Append(", { type: \"number-range\" }");
                if (dsFWA.Tables[0].Rows.Count > 0)
                {
                    for (var i = 0; i < dsFWA.Tables[0].Rows.Count; i++)
                    {
                        typeBuilder.Append(", { type: \"number-range\" }");
                        tblBuilder.Append("<th align='left'>Total " + dsFWA.Tables[0].Rows[i]["Category_Name"].ToString() + " Visits %</th>");
                    }
                }
                tblBuilder.Append("<th align='left' >Chemist Call Avg</th>");
                tblBuilder.Append("<th align='left' >Stockist Call Avg</th>");
                tblBuilder.Append("<th align='left' >RCPA Coverage %</th>");
                tblBuilder.Append("<th align='left' >Independent Doctor Coverage %</th>");
                typeBuilder.Append(", { type: \"number-range\" },{ type: \"number-range\" },{ type: \"number-range\" },{ type: \"number-range\" }]");
                tblBuilder.Append("</tr>");
                tblBuilder.Append("<tr>");
                tblBuilder.Append("<th align='left' >User Name</th>");
                tblBuilder.Append("<th align='left' >User Type Name</th>");
                tblBuilder.Append("<th align='left' >Territory Name</th>");
                tblBuilder.Append("<th align='left' >Employee Name</th>");
                tblBuilder.Append("<th align='left' >Division</th>");
                tblBuilder.Append("<th align='left' >Reporting Manager</th>");
                tblBuilder.Append("<th align='left' >Reporting HQ</th>");
                tblBuilder.Append("<th align='left' >% Days worked </th>");
                tblBuilder.Append("<th align='left' >Joint field work % (Manager only)</th>");
                tblBuilder.Append("<th align='left' >Call Avg</th>");
                tblBuilder.Append("<th align='left' >Total Coverage %</th>");
                var iRow = 11;
                if (dsFWA.Tables[0].Rows.Count > 0)
                {
                    for (var i = 0; i < dsFWA.Tables[0].Rows.Count; i++)
                    {
                        iRow++;
                        tblBuilder.Append("<th align='left'>Total " + dsFWA.Tables[0].Rows[i]["Category_Name"].ToString() + " Coverage %</th>");
                    }
                }
                iRow = iRow + 1;
                tblBuilder.Append("<th align='left' >Total Visits %</th>");
                if (dsFWA.Tables[0].Rows.Count > 0)
                {
                    for (var i = 0; i < dsFWA.Tables[0].Rows.Count; i++)
                    {
                        iRow++;
                        tblBuilder.Append("<th align='left'>Total " + dsFWA.Tables[0].Rows[i]["Category_Name"].ToString() + "  Visits % </th>");
                    }
                }
                iRow = iRow + 4;
                tblBuilder.Append("<th align='left' >Chemist Call Avg</th>");
                tblBuilder.Append("<th align='left' >Stockist Call Avg</th>");
                tblBuilder.Append("<th align='left' >RCPA Coverage %</th>");
                tblBuilder.Append("<th align='left' >Independent Doctor Coverage %</th>");
                tblBuilder.Append("</tr>");

                tblBuilder.Append("<tr >");
                tblBuilder.Append("<th colspan= '" + iRow + "' align='left'  ><span id='spnDivToggle' style='text-decoration: underline; cursor: pointer; padding: 5px' onclick='fnToggleTreeField()'>Show Filter</span></th>");
                tblBuilder.Append("</tr>");

                tblBuilder.Append("</thead>");
                tblBuilder.Append("<tbody>");

                if (dsFWA.Tables[1].Rows.Count > 0)
                {
                    for (var i = 0; i < dsFWA.Tables[1].Rows.Count; i++)
                    {
                        tblBuilder.Append("<tr>");
                        //User Name
                        tblBuilder.Append("<td align='left'>" + dsFWA.Tables[1].Rows[i]["User_Name"].ToString() + "</td>");
                        // User Type Name
                        tblBuilder.Append("<td align='left'>" + dsFWA.Tables[1].Rows[i]["User_Type_Name"].ToString() + "</td>");
                        //Territory Name
                        tblBuilder.Append("<td align='left'>" + dsFWA.Tables[1].Rows[i]["Region_Name"].ToString() + "</td>");
                        //employee name
                        tblBuilder.Append("<td align='left'>" + dsFWA.Tables[1].Rows[i]["Employee_Name"].ToString() + "</td>");
                        //division
                        if (dsFWA.Tables[2].Rows.Count > 0)
                        {
                            //var dJsonData = jsonPath(jsData, "$.Tables[2].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "')]");

                            drt = dsFWA.Tables[2].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsFWA.Tables[1].Rows[i]["Region_Code"].ToString()).ToArray();

                            string divisionName = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    divisionName += drt[j]["Division_Name"].ToString() + ",";
                                }

                                if (divisionName != "")
                                {
                                    divisionName = divisionName.Substring(0, divisionName.Length - 1);
                                }
                                tblBuilder.Append("<td align='left' >" + divisionName + "</td>");
                            }
                            else
                            {
                                tblBuilder.Append("<td align='left'></td>");
                            }
                        }
                        else
                        {
                            tblBuilder.Append("<td align='left' ></td>");
                        }
                        //manager name
                        tblBuilder.Append("<td align='left'>" + dsFWA.Tables[1].Rows[i]["Manager_Name"].ToString() + "</td>");
                        //manager region name
                        tblBuilder.Append("<td align='left'>" + dsFWA.Tables[1].Rows[i]["Manager_Region_Name"].ToString() + "</td>");
                        //fieldworkdays

                        //field = 0;
                        string fieldworkdayscount = string.Empty;
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            //var dJsonData = jsonPath(jsData, "$.Tables[21].Rows[?(@.Region_Code=='" + dsFWA.Tables[1].Rows[i].Region_Code + "')]");
                            drt = dsFWA.Tables[21].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsFWA.Tables[1].Rows[i]["Region_Code"].ToString()).ToArray();
                            fieldworkdayscount = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var u = 0; u < drt.Length; u++)
                                {
                                    fieldworkdayscount += drt[u]["Field"].ToString() + "";
                                }
                            }
                        }
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            //var dJsonData = jsonPath(jsData, "$.Tables[3].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            drt = dsFWA.Tables[3].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            string fieldworkdays = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    fieldworkdays += drt[j]["Field_Working_Day"].ToString() + "";
                                }
                                avg = (float.Parse(fieldworkdayscount) / noOfDays) * 100;
                                tblBuilder.Append("<td class='td-a' onclick='fnDayanalysis(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>" + Math.Round(avg * 100) / 100 + "</td>");
                            }
                            else
                            {
                                tblBuilder.Append("<td > 0 </td>");
                            }
                        }
                        else
                        {
                            tblBuilder.Append("<td > 0 </td>");
                        }

                        ////joinedworkdays
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            drt = dsFWA.Tables[5].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            DataRow[] drt1 = dsFWA.Tables[5].AsEnumerable().Where(c => c["Under_User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            //var dJsonData = jsonPath(jsData, "$.Tables[5].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            //var dJsonunderUserCode = jsonPath(jsData, "$.Tables[5].Rows[?(@.Under_User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");

                            string joinedworkdays = string.Empty;
                            if (drt1.Length > 0)
                            {
                                if (drt.Length > 0)
                                {
                                    for (var j = 0; j < drt.Length; j++)
                                    {
                                        joinedworkdays += drt[j]["Days_Joined_Worked"].ToString() + "";
                                    }
                                    avg = (float.Parse(joinedworkdays) / float.Parse(fieldworkdayscount)) * 100;
                                    tblBuilder.Append("<td class='td-a' onclick='fnjoinedworksanalysis(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>" + Math.Round(avg * 100) / 100 + "</td>");
                                    //tblBuilder.Append("<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + joinedworkdays + "</td>";
                                }
                                else
                                {
                                    tblBuilder.Append("<td>0 </td>  ");
                                }
                            }
                            else
                            {
                                if (drt.Length > 0)
                                {
                                    for (var j = 0; j < drt.Length; j++)
                                    {
                                        joinedworkdays += drt[j]["Days_Joined_Worked"].ToString() + "";
                                    }
                                    avg = (float.Parse(joinedworkdays) / float.Parse((fieldworkdayscount))) * 100;
                                    // tblBuilder.Append("<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + Math.round(avg * 100) / 100 + "</td>";
                                    //tblBuilder.Append("<td class='td-a' onclick='fnjoinedworksanalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'>" + joinedworkdays + "</td>";
                                    tblBuilder.Append("<td>" + Math.Round(avg * 100) / 100 + "</td>");
                                }
                                else
                                {
                                    tblBuilder.Append("<td>0 </td>  ");
                                }
                            }
                        }
                        else
                        {
                            tblBuilder.Append("<td> 0</td>  ");
                        }

                        //call avg//
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            //var dJsonData = jsonPath(jsData, "$.Tables[6].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            drt = dsFWA.Tables[6].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();

                            string Callavg = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    Callavg += drt[j]["Calls_Made"].ToString() + "";
                                }
                                tblBuilder.Append("<td >" + (float.Parse(Callavg) / float.Parse(fieldworkdayscount)) + "</td>");
                            }
                            else
                            {
                                tblBuilder.Append("<td>0 </td>  ");
                            }
                        }
                        else
                        {
                            tblBuilder.Append("<td> 0</td>  ");
                        }

                        //Total Coverage %
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            //var dJsonData = jsonPath(jsData, "$.Tables[17].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            //var totalJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");

                            drt = dsFWA.Tables[17].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            DataRow[] drt1 = dsFWA.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            string Doctorlist = string.Empty;
                            string Doctorsmet = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    Doctorlist += drt[j]["Doctor_list"].ToString() + "";
                                }
                                if (drt1.Length > 0)
                                {
                                    for (var j = 0; j < drt1.Length; j++)
                                    {
                                        Doctorsmet += drt1[j]["Doctors_Met"].ToString() + "";
                                    }
                                    tblBuilder.Append("<td align='center' class='td-a' onclick='fnDoctorCalAnalysis(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>" + ((float.Parse(Doctorsmet) / float.Parse(Doctorlist)) * 100).ToString("N2") + "</td>");
                                }
                                else
                                {
                                    tblBuilder.Append("<td align='center'> 0</td>  ");
                                }
                            }
                            else
                            {
                                tblBuilder.Append("<td align='center'> 0</td>");
                            }
                        }
                        //  tblBuilder.Append("<td align='left'> 0 </td>";
                        //tblBuilder.Append("<td class='td-a' onclick='fnDoctorCalAnalysis(\"" + jsData.Tables[1].Rows[i].Region_Code + "\")'> 0 </td>";

                        //total nc coverage

                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            for (var k = 0; k < dsFWA.Tables[0].Rows.Count; k++)
                            {

                                //var dJsonData = jsonPath(jsData, "$.Tables[9].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "' & @.Category =='" + jsData.Tables[0].Rows[k].Category_Code + "')]");
                                //var totalJsonData = jsonPath(jsData, "$.Tables[8].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "' & @.Category =='" + jsData.Tables[0].Rows[k].Category_Code + "')]");

                                drt = dsFWA.Tables[9].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString() && c["Category"].ToString() == dsFWA.Tables[0].Rows[k]["Category_Code"].ToString()).ToArray();
                                DataRow[] drt1 = dsFWA.Tables[8].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString() && c["Category"].ToString() == dsFWA.Tables[0].Rows[k]["Category_Code"].ToString()).ToArray();
                                string Categorymet = string.Empty;
                                string CategoryCount = string.Empty;

                                if (drt.Length > 0 && drt1.Length > 0)
                                {
                                    for (var j = 0; j < drt.Length; j++)
                                    {
                                        Categorymet += drt[j]["Category_Met"].ToString();
                                    }

                                    for (var j = 0; j < drt1.Length; j++)
                                    {
                                        CategoryCount += drt1[j]["Category_wise_count"].ToString();
                                    }
                                    tblBuilder.Append("<td align='center' >" + ((float.Parse(Categorymet) / float.Parse(CategoryCount)) * 100).ToString("N2") + "</td>");
                                }
                                else
                                {
                                    tblBuilder.Append("<td align='center'> 0</td>  ");
                                }
                            }
                        }

                        ///////////////////total
                        float actualVisit = 0;
                        float totalActualVisit = 0;
                        float doctorCoverage = 0;
                        float totalDoctor = 0;
                        float visitCount = 0;


                        for (var j = 0; j < dsFWA.Tables[0].Rows.Count; j++)
                        {
                            actualVisit = 0;
                            doctorCoverage = 0;
                            if (dsFWA.Tables[0].Rows[j]["Visit_Count"].ToString() != null && dsFWA.Tables[18].Rows[j]["Visit_Count"].ToString() != "")
                            {
                                visitCount = int.Parse(dsFWA.Tables[0].Rows[j]["Visit_Count"].ToString());
                            }
                            else
                            {
                                visitCount = 0;
                            }

                            //var dJsonData = jsonPath(jsData, "$.Tables[19].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");

                            drt = dsFWA.Tables[19].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() && c["Category"].ToString() == dsFWA.Tables[0].Rows[j]["Category_Code"].ToString()).ToArray();

                            if (drt.Length > 0)
                            {
                                if (drt.Length > 0)
                                {
                                    actualVisit = (int.Parse(drt[0]["Count"].ToString()) * visitCount);
                                    totalActualVisit = totalActualVisit + (int.Parse(drt[0]["Count"].ToString()) * visitCount);
                                }
                            }

                            //var dJsonData = jsonPath(jsData, "$.Tables[20].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");

                            drt = dsFWA.Tables[20].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() && c["Category"].ToString() == dsFWA.Tables[0].Rows[j]["Category_Code"].ToString()).ToArray();

                            if (drt.Length > 0)
                            {
                                for (var k = 0; k < drt.Length; k++)
                                {
                                    doctorCoverage = doctorCoverage + int.Parse(drt[k]["Count"].ToString());
                                }
                                totalDoctor = totalDoctor + doctorCoverage;
                            }


                            if (actualVisit > 0)
                            {
                                avg = (doctorCoverage / actualVisit) * 100;
                                //tblBuilder.Append("<td>" + Math.round(avg * 100) / 100 + "</td>";
                            }
                            else
                            {
                                //tblBuilder.Append("<td align='center' width='15%'>0</td>";
                            }
                        }
                        avg = 0;
                        if (totalActualVisit > 0)
                        {
                            avg = (totalDoctor / totalActualVisit) * 100;
                            tblBuilder.Append("<td class='td-a' onclick='fnDoctorVisitsFrequency(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>" + Math.Round(avg * 100) / 100 + " </td>");
                            //tblBuilder.Append("<td align='center' width='15%'  title='Total No of Drs Visits Met/Total Visits)*100'>" + Math.round(avg * 100) / 100 + "</td>";
                        }
                        else
                        {
                            tblBuilder.Append("<td > 0</td>  ");
                        }


                        //tolal category visit

                        //float actualVisit = 0;
                        //float totalActualVisit = 0;
                        //float doctorCoverage = 0;
                        //float totalDoctor = 0;

                        for (var j = 0; j < dsFWA.Tables[0].Rows.Count; j++)
                        {
                            actualVisit = 0;
                            doctorCoverage = 0;

                            if (dsFWA.Tables[0].Rows[j]["Visit_Count"] != null && dsFWA.Tables[0].Rows[j]["Visit_Count"].ToString() != "")
                            {
                                visitCount = int.Parse(dsFWA.Tables[0].Rows[j]["Visit_Count"].ToString());
                            }
                            else
                            {
                                visitCount = 0;
                            }

                            //var dJsonData = jsonPath(jsData, "$.Tables[19].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");

                            drt = dsFWA.Tables[19].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() && c["Category"].ToString() == dsFWA.Tables[0].Rows[j]["Category_Code"].ToString()).ToArray();

                            if (drt.Length > 0)
                            {
                                if (drt.Length > 0)
                                {
                                    actualVisit = (int.Parse(drt[0]["Count"].ToString()) * visitCount);
                                    totalActualVisit = totalActualVisit + (int.Parse(drt[0]["Count"].ToString()) * visitCount);
                                }
                            }

                            //var dJsonData = jsonPath(jsData, "$.Tables[20].Rows[?(@.Region_Code=='" + jsData.Tables[1].Rows[i].Region_Code + "' & @.Category=='" + jsData.Tables[0].Rows[j].Category_Code + "')]");

                            drt = dsFWA.Tables[20].AsEnumerable().Where(c => c["Region_Code"].ToString() == dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() && c["Category"].ToString() == dsFWA.Tables[0].Rows[j]["Category_Code"].ToString()).ToArray();

                            if (drt.Length > 0)
                            {
                                if (drt.Length > 0)
                                {
                                    for (var k = 0; k < drt.Length; k++)
                                    {
                                        doctorCoverage = doctorCoverage + int.Parse(drt[k]["Count"].ToString());
                                    }
                                    totalDoctor = totalDoctor + doctorCoverage;
                                }
                            }

                            if (actualVisit > 0)
                            {
                                avg = (doctorCoverage / actualVisit) * 100;
                                tblBuilder.Append("<td>" + Math.Round(avg * 100) / 100 + "</td>");
                            }
                            else
                            {
                                tblBuilder.Append("<td> 0</td>");
                            }
                        }

                        //chemist avg
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {

                            //var dJsonData = jsonPath(jsData, "$.Tables[13].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");

                            drt = dsFWA.Tables[13].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();

                            string Chemistavg = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    Chemistavg += drt[j]["Chemist_Met"].ToString() + "";

                                }

                                float chemavg = float.Parse(Chemistavg) / float.Parse(fieldworkdayscount);
                                // tblBuilder.Append("<td >" + parseFloat((parseFloat(Chemistavg) / parseFloat(fieldworkdays)) * 100).toFixed(2) + "</td>";
                                tblBuilder.Append("<td align='center' class='td-a' onclick='FnChemistMetAnalysis(\"" + dsFWA.Tables[1].Rows[i]["User_Code"].ToString() + "\")'>" + ((float.Parse(Chemistavg) / float.Parse(fieldworkdayscount))).ToString("N2") + " </td>");
                            }
                            else
                            {
                                tblBuilder.Append("<td align='center'> 0</td> ");
                            }
                        }
                        else
                        {
                            tblBuilder.Append("<td align='center'> 0</td>  ");
                        }
                        //Stoskiest avg
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {

                            //var dJsonData = jsonPath(jsData, "$.Tables[14].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            drt = dsFWA.Tables[14].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();

                            string stockiestavg = string.Empty;
                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    stockiestavg += drt[j]["Stockiest_Visit"].ToString() + "";
                                }
                                tblBuilder.Append("<td align='center' class='td-a' onclick='fnStockiest(\"" + dsFWA.Tables[1].Rows[i]["User_Code"].ToString() + "_" + dt1.Year.ToString() + "-" + dt1.Month.ToString() + "-" + dt1.Day.ToString() + "_" + dt2.Year.ToString() + "-" + dt2.Month.ToString() + "-" + dt2.Day.ToString() + "\")' >" + ((float.Parse(stockiestavg) / float.Parse(fieldworkdayscount))).ToString("N2") + "</td>");
                                // tblBuilder.Append("<td >" + parseFloat((parseFloat(stockiestavg) / parseFloat(fieldworkdays)) * 100).toFixed(2) + "</td>";

                            }
                            else
                            {
                                tblBuilder.Append("<td align='center'> 0</td>  ");
                            }
                        }
                        else
                        {
                            tblBuilder.Append("<td align='center'> 0</td>");
                        }
                        //rcpa avg


                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {

                            //var dJsonData = jsonPath(jsData, "$.Tables[15].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            //var totalJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");

                            drt = dsFWA.Tables[15].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            DataRow[] drt1 = dsFWA.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();

                            string RcpaDoctor = string.Empty;
                            string Doctorsmet = string.Empty;

                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    RcpaDoctor = drt[j]["Dcr_Rcpa"].ToString();

                                }
                                if (drt1.Length > 0)
                                {
                                    for (var j = 0; j < drt1.Length; j++)
                                    {
                                        Doctorsmet = drt1[j]["Doctors_Met"].ToString();

                                    }
                                    float avgrcpa = 0;
                                    if (float.Parse(RcpaDoctor) > 0)
                                    {
                                        avgrcpa = (float.Parse(RcpaDoctor) / float.Parse(Doctorsmet)) * 100;
                                    }
                                    //tblBuilder.Append("<td >" + Math.round(avgrcpa * 100) / 100 + "</td>";
                                    //tblBuilder.Append("<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + jsData.Tables[1].Rows[i].User_Code + "_" + FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0] + "_" + ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0] + "\")' >" + Math.round(avgrcpa * 100) / 100 + "</td>";
                                    tblBuilder.Append("<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>" + Math.Round(avgrcpa * 100) / 100 + " </td>");
                                }
                                else
                                {
                                    //tblBuilder.Append("<td align='center'> 0</td>  ";
                                    tblBuilder.Append("<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>0</td>");
                                }
                            }
                            else
                            {
                                tblBuilder.Append("<td align='center' class='td-a' onclick='fnRcpaDetails(\"" + dsFWA.Tables[1].Rows[i]["Region_Code"].ToString() + "\")'>0 </td>");
                            }
                        }

                        //independent doctor//
                        if (dsFWA.Tables[1].Rows.Count > 0)
                        {
                            //var dJsonData = jsonPath(jsData, "$.Tables[16].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");
                            //var totalJsonData = jsonPath(jsData, "$.Tables[7].Rows[?(@.User_Code=='" + jsData.Tables[1].Rows[i].User_Code + "')]");

                            drt = dsFWA.Tables[16].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();
                            DataRow[] drt1 = dsFWA.Tables[7].AsEnumerable().Where(c => c["User_Code"].ToString() == dsFWA.Tables[1].Rows[i]["User_Code"].ToString()).ToArray();


                            string IndependentDoctor = string.Empty;
                            string Doctorsmet = string.Empty;

                            if (drt.Length > 0)
                            {
                                for (var j = 0; j < drt.Length; j++)
                                {
                                    IndependentDoctor += drt[j]["Independent_Call"].ToString() + "";

                                }
                                if (drt1.Length > 0)
                                {
                                    for (var j = 0; j < drt1.Length; j++)
                                    {
                                        Doctorsmet += drt1[j]["Doctors_Met"].ToString() + "";
                                    }

                                    float avgIndepentDoctor = 0;
                                    if (float.Parse(IndependentDoctor) > 0)
                                    {
                                        avgIndepentDoctor = (float.Parse(IndependentDoctor) / float.Parse(Doctorsmet)) * 100;
                                    }

                                    //tblBuilder.Append("<td >" + parseFloat((parseFloat(IndependentDoctor) / parseFloat(Doctorsmet)) * 100).toFixed(2) + "</td>";
                                    tblBuilder.Append("<td align='center' class='td-a' onclick='fnIndependentDoctor(\"" + dsFWA.Tables[1].Rows[i]["User_Code"].ToString() + "_" + dt1.Year.ToString() + "-" + dt1.Month.ToString() + "-" + dt1.Day.ToString() + "_" + dt2.Year.ToString() + "-" + dt2.Month.ToString() + "-" + dt2.Day.ToString() + "\")' >" + Math.Round(avgIndepentDoctor * 100) / 100 + "</td>");
                                }
                                else
                                {
                                    tblBuilder.Append("<td align='center'> 0</td>  ");
                                }
                            }
                            else
                            {
                                tblBuilder.Append("<td align='center'> 0</td>  ");
                            }
                        }
                        tblBuilder.Append("</tr>");
                    }
                }
                tblBuilder.Append("</tbody>");
                tblBuilder.Append("</table>");
            }

            return tblBuilder.ToString() + "$" + typeBuilder.ToString();
        }

        public DataSet GetSalesAndActivityPerformance(string companyCode, string regionCode, string startDate, string endDate)
        {
            return _objDALreport.GetSalesAndActivityPerformance(companyCode, regionCode, startDate, endDate);
        }
        public DataSet GetHolidayDetails(string companyCode, string regionCode, string parentRegion, string startDate, string endDate, string dcrStatus)
        {
            return _objDALreport.GetHolidayDetails(companyCode, regionCode, parentRegion, startDate, endDate, dcrStatus);
        }
        public DataSet GetDoctorStatisticsReport(string companyCode, string regionCode, string userCode, string Month, string Year, string dcrStatus)
        {
            return _objDALreport.GetDoctorStatisticsReport(companyCode, regionCode, userCode, Month, Year, dcrStatus);
        }
        public DataSet GetDayWiseFieldReport(string companyCode, string userCode, string regionCodes, string startDate, string endDate,
           string status)
        {
            return _objDALreport.GetDayWiseFieldReport(companyCode, userCode, regionCodes, startDate, endDate, status);
        }
        public DataSet GetDoctorVisitsFrequencyAnalysis(string companyCode, string regionCode, string startDate, string endDate)
        {
            return _objDALreport.GetDoctorVisitsFrequencyAnalysis(companyCode, regionCode, startDate, endDate);
        }
        public DataSet GetLastSubmittedReportSubCalci(string companyCode, string userCodes, string regionCode, string month, string year, string userSelection, string VCount)
        {
            return _objDALreport.GetLastSubmittedReportSubCalci(companyCode, userCodes, regionCode, month, year, userSelection, VCount);
        }

        //------------ START - EXPENSE ANALYSIS GROUP WISE REPORT------------------------
        public DataSet GetExpenseAnalysisGroupWiseReport(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string activityStatus)
        {
            return _objDALreport.GetExpenseAnalysisGroupWiseReport(companyCode, userCode, fromDate, toDate, dcrStatus, activityStatus);
        }
        public DataSet GetExpenseAnalysisGroupWiseReportCustomerCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            return _objDALreport.GetExpenseAnalysisGroupWiseReportCustomerCount(companyCode, userCode, fromDate, toDate, dcrStatus, option);
        }

        //------------ END - EXPENSE ANALYSIS GROUP WISE REPORT------------------------

        //------------ START- EXPENSE CLAIM ALUMNI REPORT -----------------------------
        public DataSet GetExpenseClaimAlumniReport(string companyCode, string userCodes, string fromDate, string toDate, string claimStatus)
        {
            return _objDALreport.GetExpenseClaimAlumniReport(companyCode, userCodes, fromDate, toDate, claimStatus);
        }
        //------------ END- EXPENSE CLAIM ALUMNI REPORT -------------------------------
        #region tp master report for alumini users
        public DataSet GetTPMasterReportForAlumniUsers(string companyCode, string month, string year, string userCode)
        {
            return _objDALreport.GetTPMasterReportForAlumniUsers(companyCode, month, year, userCode);
        }

        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetTPDoctorDetailsForAlumniUsers(string companyCode, string tpDate, string userCode)
        {
            return _objDALreport.GetTPDoctorDetailsForAlumniUsers(companyCode, tpDate, userCode);
        }
        #endregion tp master report for alumini users

        #region Doctor statistics REport
        public DataSet GetDoctorStatisticsReport_WithCalc(string companyCode, string regionCode, string userCode, string Month, string Year, string dcrStatus)
        {
            return _objDALreport.GetDoctorStatisticsReport_WithCalc(companyCode, regionCode, userCode, Month, Year, dcrStatus);
        }
        #endregion  Doctor statistics REport
        public List<DCRApprovalAccModel> GetAccompanistVisitedDetails(string companyCode, string Accompanist, string DcrUserCode)
        {
            return _objDALreport.GetAccompanistVisitedDetails(companyCode, Accompanist, DcrUserCode);
        }
        public List<DoctorACCNameDetails> GetDoctorVisitAccName(string dcr_date, string user_code, string doctor_Visit_Code, string company_Code,string type)
        {
            return _objDALreport.GetDoctorVisitAccName(dcr_date, user_code, doctor_Visit_Code, company_Code,type);
        }
        public List<DCRCMEDetails> GetCMEProductDetails(string DCR_Code, int DCR_Attendance_Doctor_Id,int CME_Id)
        {
            return _objDALreport.GetCMEProductDetails(DCR_Code, DCR_Attendance_Doctor_Id, CME_Id);
        }
    }
}
