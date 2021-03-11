using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;

namespace HiDoctor.Controllers
{
    public class WorkCalculation
    {
        const string TOTAL_HOLIDAY_COUNT = "Total_Holidays_Count";
        const string TOTAL_LEAVE_COUNT = "Total_Leave_Count";
        const string TOTAL_FIELD_COUNT = "Total_Field_Count";
        const string TOTAL_ATTENDANCE_COUNT = "Total_Attendance_Count";
        const string TOTAL_HOLIDAYS = "Total_Holidays";
        const string TOTAL_DAYS_WORKED_ON_HOLIDAYS = "Total_Days_Worked_On_Holidays";
        const string TOTAL_WEEKENDOFF_WORKED_DAYS_COUNT = "Total_WeekendOff_Worked_Days_Count";
        const string TOTAL_WEEKENDOFF_COUNT = "Total_WeekendOff_Count";


        const string WORK_MONTH = "Month";
        const string WORK_YEAR = "Year";
        const string REGION_NAME = "Region_Name";
        const string REGION_CODE = "Region_Code";
        const string AND = "AND";

        const string WORK_NO_OF_DAYS = "No_Of_Days";
        const string WORK_NO_REPORTIN = "No_Reporting";
        const string WORK_NA = "NA";
        const string WORK_FIELD_WORK = "Field_Work";
        const string WORK_OFF_FIELD_WORK = "Off_Field_Work";
        const string WORK_WORKED = "Worked";
        const string WORK_MONTH_NAME = "Month_Name";


        public DataSet CalculateWork(DataSet dsWorkCal, string months, int year, string regionNames, string leafRegions)
        {
            DataSet dsWork = new DataSet();
            DataTable dt = new DataTable();

            dt.Columns.Add(WORK_NO_OF_DAYS, typeof(string));
            dt.Columns.Add(WORK_YEAR, typeof(string));
            dt.Columns.Add(WORK_MONTH, typeof(string));
            dt.Columns.Add(WORK_MONTH_NAME, typeof(string));
            dt.Columns.Add(WORK_NO_REPORTIN, typeof(string));
            dt.Columns.Add(WORK_NA, typeof(string));
            dt.Columns.Add(WORK_FIELD_WORK, typeof(string));
            dt.Columns.Add(WORK_OFF_FIELD_WORK, typeof(string));
            dt.Columns.Add(WORK_WORKED, typeof(string));

            dsWork.Tables.Add(dt);
            dsWork.AcceptChanges();

            //string regionName = string.Empty;
            string regionCode = string.Empty;
            string monthName = string.Empty;
            int regionCount = 0;

            int month = 0;
            int totalNumberOfDays = 0;
            int numberOfSundays = 0;
            double holiday = 0;
            double totalLeaveCount = 0;
            double totalFieldCount = 0;
            double totalAttendanceCount = 0;
            double noAvailDays = 0;
            double noReportingDays = 0;
            double availableFieldDays = 0;
            double worked = 0;

            int stotalNumberOfDays = 0;
            int snumberOfSundays = 0;
            double sholiday = 0;
            double stotalLeaveCount = 0;
            double stotalFieldCount = 0;
            double stotalAttendanceCount = 0;
            double snoAvailDays = 0;
            double snoReportingDays = 0;
            double savailableFieldDays = 0;
            double sworked = 0;

            double atotalNumberOfDays = 0;
            double anumberOfSundays = 0;
            double aholiday = 0;
            double atotalLeaveCount = 0;
            double atotalFieldCount = 0;
            double atotalAttendanceCount = 0;
            double anoAvailDays = 0;
            double anoReportingDays = 0;
            double aworked = 0;

            DataRow[] dr;
            leafRegions = leafRegions.Replace("'", "");
            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;


            foreach (string mnth in monthArry)
            {
                monthName = string.Empty;

                month = 0;
                totalNumberOfDays = 0;
                numberOfSundays = 0;
                holiday = 0;
                totalLeaveCount = 0;
                totalFieldCount = 0;
                totalAttendanceCount = 0;
                noAvailDays = 0;
                noReportingDays = 0;
                availableFieldDays = 0;
                worked = 0;

                stotalNumberOfDays = 0;
                snumberOfSundays = 0;
                sholiday = 0;
                stotalLeaveCount = 0;
                stotalFieldCount = 0;
                stotalAttendanceCount = 0;
                snoAvailDays = 0;
                snoReportingDays = 0;
                savailableFieldDays = 0;
                sworked = 0;

                atotalNumberOfDays = 0;
                anumberOfSundays = 0;
                aholiday = 0;
                atotalLeaveCount = 0;
                atotalFieldCount = 0;
                atotalAttendanceCount = 0;
                anoAvailDays = 0;
                anoReportingDays = 0;
                aworked = 0;

                foreach (string region in regionArry)
                {
                    month = int.Parse(mnth);
                    // regionName = region;
                    regionCode = region;
                    dr = dsWorkCal.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "'");

                    totalNumberOfDays = DateTime.DaysInMonth(year, month);
                    stotalNumberOfDays += totalNumberOfDays;

                    numberOfSundays = GetNumberOfSundays(month, year);
                    snumberOfSundays += numberOfSundays;
                    monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month);

                    if (dr.Length > 0)
                    {
                        holiday = double.Parse(dr[0][TOTAL_HOLIDAY_COUNT].ToString());
                        sholiday += holiday;

                        totalLeaveCount = double.Parse(dr[0][TOTAL_LEAVE_COUNT].ToString());
                        stotalLeaveCount += totalLeaveCount;

                        totalFieldCount = double.Parse(dr[0][TOTAL_FIELD_COUNT].ToString());
                        stotalFieldCount += totalFieldCount;

                        totalAttendanceCount = double.Parse(dr[0][TOTAL_ATTENDANCE_COUNT].ToString());
                        stotalAttendanceCount += totalAttendanceCount;

                        ////Number of No Available Days
                        //noAvailDays = totalLeaveCount + holiday + numberOfSundays;
                        //snoAvailDays += noAvailDays;

                        noAvailDays = double.Parse(dr[0][TOTAL_LEAVE_COUNT].ToString()) +
                                        (double.Parse(dr[0][TOTAL_HOLIDAYS].ToString())
                                        - double.Parse(dr[0][TOTAL_DAYS_WORKED_ON_HOLIDAYS].ToString())) +
                                        (double.Parse(dr[0][TOTAL_WEEKENDOFF_COUNT].ToString()) -
                                        double.Parse(dr[0][TOTAL_WEEKENDOFF_WORKED_DAYS_COUNT].ToString()));
                        snoAvailDays += noAvailDays;


                        //No Reporting Days
                        noReportingDays = totalNumberOfDays - totalFieldCount - totalAttendanceCount - noAvailDays;
                        snoReportingDays += noReportingDays;

                        //Available Field Days
                        availableFieldDays = totalNumberOfDays - noAvailDays - totalAttendanceCount;
                        savailableFieldDays += availableFieldDays;

                        //% Worked
                        if (double.Parse(availableFieldDays.ToString()) > 0)
                        {
                            worked = Math.Round(double.Parse(totalFieldCount.ToString()) / double.Parse(availableFieldDays.ToString()), 2);
                            sworked += worked;
                        }
                    }
                }

                atotalNumberOfDays = stotalNumberOfDays / regionCount;
                anumberOfSundays = snumberOfSundays / regionCount;
                aholiday = sholiday / regionCount;
                atotalLeaveCount = stotalLeaveCount / regionCount;
                anoAvailDays = snoAvailDays / regionCount;
                anoReportingDays = snoReportingDays / regionCount;
                atotalFieldCount = stotalFieldCount / regionCount;
                atotalAttendanceCount = stotalAttendanceCount / regionCount;
                aworked = sworked / regionCount;

                DataRow drWork = dt.NewRow();

                drWork[WORK_NO_OF_DAYS] = totalNumberOfDays;
                drWork[WORK_YEAR] = year;
                drWork[WORK_MONTH] = month;
                drWork[WORK_MONTH_NAME] = monthName;
                drWork[WORK_NO_REPORTIN] = Math.Round(anoReportingDays, 2);
                drWork[WORK_NA] = Math.Round(anoAvailDays, 2);
                drWork[WORK_FIELD_WORK] = Math.Round(atotalFieldCount, 2);
                drWork[WORK_OFF_FIELD_WORK] = Math.Round(atotalAttendanceCount, 2);
                drWork[WORK_WORKED] = Math.Round(aworked * 100, 2);


                dt.Rows.Add(drWork);
                dsWork.AcceptChanges();
            }

            return dsWork;
        }

        private int GetNumberOfSundays(int Month, int Year)
        {

            DateTime StartDate = Convert.ToDateTime(Month.ToString() + "/01/" + Year.ToString());
            int iDays = DateTime.DaysInMonth(Year, Month);
            DateTime EndDate = StartDate.AddDays(iDays - 1);
            int SundayCount = 0;
            while (StartDate.DayOfWeek != DayOfWeek.Sunday)
            {
                StartDate = StartDate.AddDays(1);
            }
            SundayCount = 1;
            StartDate = StartDate.AddDays(7);
            while (StartDate <= EndDate)
            {
                SundayCount += 1; StartDate = StartDate.AddDays(7);
            }
            return SundayCount;
        }
    }
}
