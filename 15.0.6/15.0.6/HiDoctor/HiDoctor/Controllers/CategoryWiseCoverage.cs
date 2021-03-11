using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace HiDoctor.Controllers
{
    public class CategoryWiseCoverage
    {
        const string REGION_NAME = "Region_Name";
        const string REGION_CODE = "Region_Code";
        const string TOTAL_VISITED_DOCTORS = "Total_Visited_Doctors";
        const string TOTAL_APPROVED_DOCTORS = "Total_Approved_Doctors";
        const string TOTAL_DETAILING_DOCTORS = "Total_Detailing_Doctors";
        const string TOTAL_NON_SAMPLE_GIVEN_DOCTORS = "Total_Non_Sample_Given_Doctors";
        const string TOTAL_SAMPLING_DOCTORS = "Total_Sampling_Doctors";
        const string DOCTOR_CATEGORY_CODE = "Doctor_Category_Code";
        const string COUNT = "COUNT";
        const string DOCTOR_CALLS_MADE = "Doctor_Calls_Made";
        const string VALUE = "Value";
        const string CATEGORY_VALUE = "CategoryValue";
        const string WORK_MONTH = "Month";
        const string WORK_YEAR = "Year";
        const string AND = "AND";
        const string CATEGORY_NAME = "Category_Name";
        const string VISIT_COUNT = "Visit_Count";

        const string CATEGORY_MISSED_DOCTORS = "Category_Missed_Doctors";

        public DataSet CalculateCategoryCoverage(DataSet dsCateCove, string months, int year, string regionCodes, string leafRegions)
        {
            DataSet dsCoverage = new DataSet();
            DataTable dt = new DataTable();

            dt.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dt.Columns.Add(CATEGORY_NAME, typeof(string));
            dt.Columns.Add(VALUE, typeof(string));
            dt.Columns.Add(CATEGORY_VALUE, typeof(string));
            dt.Columns.Add(TOTAL_APPROVED_DOCTORS, typeof(string));

            DataTable dtCallObj = new DataTable();
            dtCallObj.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dtCallObj.Columns.Add(CATEGORY_NAME, typeof(string));
            dtCallObj.Columns.Add(VALUE, typeof(string));
            dtCallObj.Columns.Add(CATEGORY_VALUE, typeof(string));
            dtCallObj.Columns.Add(TOTAL_APPROVED_DOCTORS, typeof(string));

            dsCoverage.Tables.Add(dt);
            dsCoverage.Tables.Add(dtCallObj);

            dsCoverage.AcceptChanges();

            // string regionName = string.Empty;
            string regionCode = string.Empty;
            string monthName = string.Empty;
            string categoryCode = string.Empty;
            string categoryName = string.Empty;

            int regionCount = 0;
            int monthCount = 0;
            int month = 0;
            float categoryWiseCoverage = 0;
            double regionCoverage = 0;
            double categoryValue = 0;
            double totalApprovedDoctors = 0;

            DataRow[] drCategory;

            leafRegions = leafRegions.Replace("'", "");

            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;
            monthCount = monthArry.Length;

            DataTable dtt = dsCateCove.Tables[0].DefaultView.ToTable(true, DOCTOR_CATEGORY_CODE);

            //Category Wise Coverage

            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                categoryValue = 0;
                totalApprovedDoctors = 0;
                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;

                    foreach (string mnth in monthArry)
                    {
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_APPROVED_DOCTORS].ToString() != "0")
                            {
                                categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_VISITED_DOCTORS].ToString()) / float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString());
                                categoryValue += float.Parse(drCategory[0][TOTAL_VISITED_DOCTORS].ToString());
                                totalApprovedDoctors += float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString());
                            }
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drCategoryCoverage = dt.NewRow();
                drCategoryCoverage[DOCTOR_CATEGORY_CODE] = categoryCode;
                drCategoryCoverage[CATEGORY_NAME] = categoryName;
                drCategoryCoverage[VALUE] = Math.Round(regionCoverage / regionCount, 2) * 100;
                drCategoryCoverage[CATEGORY_VALUE] = categoryValue;
                drCategoryCoverage[TOTAL_APPROVED_DOCTORS] = totalApprovedDoctors;
                dt.Rows.Add(drCategoryCoverage);
                dsCoverage.AcceptChanges();
            }

            //Category Wise Visit Objective Achieved
            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                categoryValue = 0;
                totalApprovedDoctors = 0;
                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;

                    foreach (string mnth in monthArry)
                    {
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[1].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_APPROVED_DOCTORS].ToString() != "0")
                            {
                                categoryWiseCoverage += float.Parse(drCategory[0][COUNT].ToString()) / float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString());
                                categoryValue += float.Parse(drCategory[0][COUNT].ToString());
                                totalApprovedDoctors += float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString());
                            }
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drVisitObj = dtCallObj.NewRow();
                drVisitObj[DOCTOR_CATEGORY_CODE] = categoryCode;
                drVisitObj[CATEGORY_NAME] = categoryName;
                drVisitObj[VALUE] = Math.Round(regionCoverage / regionCount, 2) * 100;
                drVisitObj[CATEGORY_VALUE] = categoryValue;
                drVisitObj[TOTAL_APPROVED_DOCTORS] = totalApprovedDoctors;
                dtCallObj.Rows.Add(drVisitObj);
                dsCoverage.AcceptChanges();
            }

            return dsCoverage;
        }


        ///<Remarks>
        ///Categorywise Doctor Coverage - By Raji
        ///</Remarks>

        public DataSet CalculateCategorywiseDoctorCoverage(DataSet dsCateCove, string months, int year, string leafRegions)
        {
            DataSet dsCoverage = new DataSet();
            DataTable dt = new DataTable();

            dt.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dt.Columns.Add(CATEGORY_NAME, typeof(string));
            dt.Columns.Add(VALUE, typeof(string));

            DataTable dtCallObj = new DataTable();
            dtCallObj.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dtCallObj.Columns.Add(CATEGORY_NAME, typeof(string));
            dtCallObj.Columns.Add(VALUE, typeof(string));

            dsCoverage.Tables.Add(dt);
            dsCoverage.Tables.Add(dtCallObj);

            dsCoverage.AcceptChanges();

            // string regionName = string.Empty;
            string regionCode = string.Empty;
            string monthName = string.Empty;
            string categoryCode = string.Empty;
            string categoryName = string.Empty;

            int regionCount = 0;
            int monthCount = 0;
            int month = 0;
            float categoryWiseCoverage = 0;
            double regionCoverage = 0;

            DataRow[] drCategory;
            leafRegions = leafRegions.Replace("'", "");

            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;
            monthCount = monthArry.Length;

            DataTable dtt = dsCateCove.Tables[0].DefaultView.ToTable(true, DOCTOR_CATEGORY_CODE);

            //Category Wise Coverage

            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;
                    foreach (string mnth in monthArry)
                    {
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_APPROVED_DOCTORS].ToString() != "0")
                            {
                                // categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_VISITED_DOCTORS].ToString()) / (float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString()));
                                categoryWiseCoverage += float.Parse(drCategory[0][DOCTOR_CALLS_MADE].ToString()) / (float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString()));
                            }
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drCategoryCoverage = dt.NewRow();
                drCategoryCoverage[DOCTOR_CATEGORY_CODE] = categoryCode;
                drCategoryCoverage[CATEGORY_NAME] = categoryName;
                drCategoryCoverage[VALUE] = Math.Round(regionCoverage / regionCount, 2) * 100;
                dt.Rows.Add(drCategoryCoverage);
                dsCoverage.AcceptChanges();
            }

            return dsCoverage;
        }

        public DataSet CalculateNoOfDoctors(DataSet dsCateCove, string months, int year, string leafRegions)
        {
            DataSet dsCoverage = new DataSet();
            DataTable dt = new DataTable();

            dt.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dt.Columns.Add(CATEGORY_NAME, typeof(string));
            dt.Columns.Add(VALUE, typeof(string));

            DataTable dtCallObj = new DataTable();
            dtCallObj.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dtCallObj.Columns.Add(CATEGORY_NAME, typeof(string));
            dtCallObj.Columns.Add(VALUE, typeof(string));

            dsCoverage.Tables.Add(dt);
            dsCoverage.Tables.Add(dtCallObj);

            dsCoverage.AcceptChanges();

            // string regionName = string.Empty;
            string regionCode = string.Empty;
            string monthName = string.Empty;
            string categoryCode = string.Empty;
            string categoryName = string.Empty;

            int regionCount = 0;
            int monthCount = 0;
            int month = 0;
            float categoryWiseCoverage = 0;
            double regionCoverage = 0;

            DataRow[] drCategory;
            leafRegions = leafRegions.Replace("'", "");
            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;
            monthCount = monthArry.Length;

            DataTable dtt = dsCateCove.Tables[0].DefaultView.ToTable(true, DOCTOR_CATEGORY_CODE);

            //Category Wise Coverage

            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;
                    foreach (string mnth in monthArry)
                    {
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_APPROVED_DOCTORS].ToString() != "0")
                            {
                                categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString());
                            }
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drCategoryCoverage = dt.NewRow();
                drCategoryCoverage[DOCTOR_CATEGORY_CODE] = categoryCode;
                drCategoryCoverage[CATEGORY_NAME] = categoryName;
                drCategoryCoverage[VALUE] = Math.Round(regionCoverage / regionCount, 2);
                dt.Rows.Add(drCategoryCoverage);
                dsCoverage.AcceptChanges();
            }

            return dsCoverage;
        }
        public DataSet CalculateCategoryAndDoctorCoverage(DataSet dsCateCove, string months, int year, string leafRegions)
        {
            DataSet dsCoverage = new DataSet();
            DataTable dt = new DataTable();
            DataTable dtVisit = new DataTable();
            DataTable dtDetailed = new DataTable();
            DataTable dtNonSample = new DataTable();

            dt.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dt.Columns.Add(CATEGORY_NAME, typeof(string));
            dt.Columns.Add(VALUE, typeof(string));
            dt.Columns.Add(TOTAL_APPROVED_DOCTORS, typeof(string));

            dtVisit.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dtVisit.Columns.Add(CATEGORY_NAME, typeof(string));
            dtVisit.Columns.Add(VALUE, typeof(string));
            dtVisit.Columns.Add(TOTAL_APPROVED_DOCTORS, typeof(string));
            dtVisit.Columns.Add(DOCTOR_CALLS_MADE, typeof(string));

            dtDetailed.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dtDetailed.Columns.Add(CATEGORY_NAME, typeof(string));
            dtDetailed.Columns.Add(VALUE, typeof(string));

            dtNonSample.Columns.Add(DOCTOR_CATEGORY_CODE, typeof(string));
            dtNonSample.Columns.Add(CATEGORY_NAME, typeof(string));
            dtNonSample.Columns.Add(VALUE, typeof(string));
            dtNonSample.Columns.Add(TOTAL_SAMPLING_DOCTORS, typeof(string));

            dsCoverage.Tables.Add(dt);
            dsCoverage.Tables.Add(dtVisit);
            dsCoverage.Tables.Add(dtDetailed);
            dsCoverage.Tables.Add(dtNonSample);

            dsCoverage.AcceptChanges();

            // string regionName = string.Empty;
            string regionCode = string.Empty;
            string monthName = string.Empty;
            string categoryCode = string.Empty;
            string categoryName = string.Empty;

            int regionCount = 0;
            int monthCount = 0;
            int month = 0;
            float categoryWiseCoverage = 0;


            double monthWiseCoverage = 0;
            double regionCoverage = 0;
            double regionwiseApprovedDoctors = 0;
            double doctorCallsMade = 0;
            float coverage = 0;

            DataRow[] drCategory;
            DataRow[] drAllCategory;
            leafRegions = leafRegions.Replace("'", "");
            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            regionCount = regionArry.Length;
            monthCount = monthArry.Length;

            DataTable dtt = dsCateCove.Tables[0].DefaultView.ToTable(true, DOCTOR_CATEGORY_CODE);


            //Category Wise Coverage

            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                float totalApprovedDoctors = 0;

                foreach (string region in regionArry)
                {
                    regionCode = region;
                    monthWiseCoverage = 0;
                    foreach (string mnth in monthArry)
                    {
                        categoryWiseCoverage = 0;
                        coverage = 0;
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_APPROVED_DOCTORS].ToString() != "0")
                            {
                                categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString());
                                //totalApprovedDoctors += float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString());
                            }
                        }

                        drAllCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "'");
                        foreach (DataRow dr in drAllCategory)
                        {
                            coverage += float.Parse(dr[TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(dr[VISIT_COUNT].ToString());
                        }

                        if (coverage > 0)
                        {
                            monthWiseCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / coverage, 2);
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(monthWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drCategoryCoverage = dt.NewRow();
                drCategoryCoverage[DOCTOR_CATEGORY_CODE] = categoryCode;
                drCategoryCoverage[CATEGORY_NAME] = categoryName;
                drCategoryCoverage[VALUE] = Math.Round(regionCoverage / regionCount, 2) * 100;
                // drCategoryCoverage[TOTAL_APPROVED_DOCTORS] = totalApprovedDoctors;
                dt.Rows.Add(drCategoryCoverage);
                dsCoverage.AcceptChanges();
            }

            //Category Wise visit Achieved
            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                regionwiseApprovedDoctors = 0;
                double totalApprovedDoctors = 0;
                doctorCallsMade = 0;

                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;
                    foreach (string mnth in monthArry)
                    {
                        coverage = 0;
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_VISITED_DOCTORS].ToString() != "0")
                            {
                                // categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_VISITED_DOCTORS].ToString()) / (float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString()));
                                categoryWiseCoverage += float.Parse(drCategory[0][DOCTOR_CALLS_MADE].ToString()) / (float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString()));
                                totalApprovedDoctors += (float.Parse(drCategory[0][TOTAL_APPROVED_DOCTORS].ToString()) * float.Parse(drCategory[0][VISIT_COUNT].ToString()));
                                doctorCallsMade += float.Parse(drCategory[0][DOCTOR_CALLS_MADE].ToString());
                            }
                        }
                    }
                    doctorCallsMade = Math.Round(Math.Round(doctorCallsMade, 2) / monthArry.Length, 2);
                    totalApprovedDoctors = Math.Round(Math.Round(totalApprovedDoctors, 2) / monthArry.Length, 2);
                    //regionwiseApprovedDoctors += Math.Round(Math.Round(totalApprovedDoctors, 2) / monthArry.Length, 2);
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drCategoryCoverage = dtVisit.NewRow();
                drCategoryCoverage[DOCTOR_CATEGORY_CODE] = categoryCode;
                drCategoryCoverage[CATEGORY_NAME] = categoryName;
                drCategoryCoverage[VALUE] = Math.Round(regionCoverage / regionCount, 2) * 100;
                drCategoryCoverage[TOTAL_APPROVED_DOCTORS] = Math.Round((totalApprovedDoctors / regionCount), 2);
                drCategoryCoverage[DOCTOR_CALLS_MADE] = Math.Round((doctorCallsMade / regionCount), 2);
                dtVisit.Rows.Add(drCategoryCoverage);
                dsCoverage.AcceptChanges();
            }

            //Category Wise total detailing doctors
            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;

                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;
                    foreach (string mnth in monthArry)
                    {
                        coverage = 0;
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_VISITED_DOCTORS].ToString() != "0")
                            {
                                categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_DETAILING_DOCTORS].ToString());
                            }
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                }
                DataRow drDetailed = dtDetailed.NewRow();
                drDetailed[DOCTOR_CATEGORY_CODE] = categoryCode;
                drDetailed[CATEGORY_NAME] = categoryName;
                // drDetailed[VALUE] = Math.Round(regionCoverage / regionCount, 2);
                drDetailed[VALUE] = Math.Round(regionCoverage, 2);
                dtDetailed.Rows.Add(drDetailed);
                dsCoverage.AcceptChanges();
            }
            //Category Wise total SAMPLING AND NON-SAMPLING doctors
            float categorywisesampling = 0;
            foreach (DataRow dtRow in dtt.Rows)
            {
                categoryName = string.Empty;
                categoryCode = dtRow[DOCTOR_CATEGORY_CODE].ToString();
                regionCoverage = 0;
                double regionwiseSampleCoverage = 0;

                foreach (string region in regionArry)
                {
                    regionCode = region;
                    categoryWiseCoverage = 0;
                    categorywisesampling = 0;

                    foreach (string mnth in monthArry)
                    {
                        coverage = 0;
                        month = int.Parse(mnth);
                        drCategory = dsCateCove.Tables[0].Select("" + WORK_MONTH + "='" + month + "' " + AND + " " + WORK_YEAR + "='" + year + "' " + AND + " " + REGION_CODE + "='" + regionCode + "' " + AND + " " + DOCTOR_CATEGORY_CODE + "='" + categoryCode + "'");
                        if (drCategory.Length > 0)
                        {
                            categoryName = drCategory[0][CATEGORY_NAME].ToString();
                            if (drCategory[0][TOTAL_VISITED_DOCTORS].ToString() != "0")
                            {
                                categoryWiseCoverage += float.Parse(drCategory[0][TOTAL_NON_SAMPLE_GIVEN_DOCTORS].ToString());
                                categorywisesampling += float.Parse(drCategory[0][TOTAL_SAMPLING_DOCTORS].ToString());
                            }
                        }
                    }
                    regionCoverage += Math.Round(Math.Round(categoryWiseCoverage, 2) / monthArry.Length, 2);
                    regionwiseSampleCoverage += Math.Round(Math.Round(categorywisesampling, 2) / monthArry.Length, 2);
                }
                DataRow drNonSample = dtNonSample.NewRow();
                drNonSample[DOCTOR_CATEGORY_CODE] = categoryCode;
                drNonSample[CATEGORY_NAME] = categoryName;
                // drNonSample[VALUE] = Math.Round(regionCoverage / regionCount, 0);
                drNonSample[VALUE] = Math.Round(regionCoverage, 0);
                // drNonSample[TOTAL_SAMPLING_DOCTORS] = Math.Round(regionwiseSampleCoverage / regionCount, 0);
                drNonSample[TOTAL_SAMPLING_DOCTORS] = Math.Round(regionwiseSampleCoverage, 0);
                dtNonSample.Rows.Add(drNonSample);
                dsCoverage.AcceptChanges();
            }

            return dsCoverage;
        }
    }
}
