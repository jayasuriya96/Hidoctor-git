using System;
using System.Collections.Generic;
using System.Data;
using DataControl.Impl;
using DataControl.EnumType;
using MVCModels;

namespace DataControl
{
    public class BL_DCRStockiestExpense
    {
        private DAL_DCRStockiestExpense _objDCRDAL = new DAL_DCRStockiestExpense();
        private Config_Settings _objIconfigsettings = null;
        private const string STOCKIEST_ENTITY = "STOCKIEST";
        #region - Adding Accompanist's Stockiest details
        /// <summary>
        /// Get Accompanist Regions. The privilege "SHOW_ACCOMPANIT_DATA" is mapped to relevant enttity type.
        /// This functions retrurns to the accompanist regions with ^ symbol. 
        /// </summary>
        /// <param name="accRegions"></param>
        /// <param name="showAccData"></param>
        /// <param name="entityType"></param>
        /// <param name="ownRegionCode"></param>
        /// <returns></returns>
        private string GetAccRegions(string accRegions, string showAccData, string entityType, string ownRegionCode)
        {
            string regionCodes = accRegions.Trim().Length > 0 ? accRegions + ownRegionCode + "^" : ownRegionCode + "^";
            string regions = string.Empty;
            if (!showAccData.Trim().ToUpper().Contains(entityType))
            {
                regions = ownRegionCode + "^";
            }
            else
            {
                regions = regionCodes;
            }
            return regions;
        }

        public List<VisitTimePrivValues> checkVisitTimePrivilge(string companyCode, string usertypecode)
        {
            return _objDCRDAL.checkVisitTimePrivilge(companyCode, usertypecode);
        }


        public List<DCRStockiestModel> GetAccompaistStockist(string companyCode, string regionCode, string accompaistRegioncodes, string showAccData)
        {
            List<DCRStockiestModel> objAccompsnist_Stockiestdetails = new List<DCRStockiestModel>();

            // Retrieve the Acc regions.
            string Acc_Regions = "";
            if (showAccData.Trim().ToUpper().Contains(STOCKIEST_ENTITY))
            {
                Acc_Regions = accompaistRegioncodes + "^"; //GetAccRegions(accompaistRegioncodes, showAccData,STOCKIEST_ENTITY, regionCode);
            }
            objAccompsnist_Stockiestdetails = _objDCRDAL.GetAccompaistStockist(companyCode, Acc_Regions, regionCode);

            return objAccompsnist_Stockiestdetails;
        }
        #endregion - Adding Accompanist's Stockiest details

        public List<DCRStockiestModel> GetStockist(string companyCode, string regionCode)
        {
            return _objDCRDAL.GetStockist(companyCode, regionCode);
        }
        public List<DCRStockiestModel> GetDraftedStockist(string companyCode, string userCode, string dcrCode, string dcrDate)
        {
            return _objDCRDAL.GetDraftedStockist(companyCode, userCode, dcrCode, dcrDate);
        }

        public DataSet GetExenseDetails(string companyCode, string userCode, string regionCode, string dcrDate, string expenseEntity,string dcrFlag)
        {
            return _objDCRDAL.GetExenseDetails(companyCode, userCode, regionCode, dcrDate, expenseEntity, dcrFlag);
        }

        public List<DCRExpenseModel> GetDraftedExenseDetails(string companyCode, string userCode, string dcrCode, string dcrDate, string dcrFlag)
        {
            return _objDCRDAL.GetDraftedExenseDetails(companyCode, userCode, dcrCode, dcrDate, dcrFlag);
        }

        public string DailyAllowanceCheck(string companyCode, string dcrCode, string dcrFlag, string expenseTypeCode)
        {
            return _objDCRDAL.DailyAllowanceCheck(companyCode, dcrCode, dcrFlag, expenseTypeCode);
        }

        public double GetExpenseSum(string companyCode, string userCode, string dcrActualDate, string mode, string expenseTypeCode)
        {
            try
            {
                DateTime dcrDate = new DateTime();
                double sum = 0.0;
                string fromDate = string.Empty, toDate = string.Empty;
                int startDay = 0, endDay = 0;

                string expenseMode = mode.ToUpper();
                dcrDate = Convert.ToDateTime(dcrActualDate);

                switch (expenseMode)
                {
                    case "MONTHLY":
                        startDay = 1;
                        endDay = DateTime.DaysInMonth(dcrDate.Year, dcrDate.Month);

                        fromDate = Convert.ToString(dcrDate.Year.ToString() + "-" + dcrDate.Month.ToString() + "-" + startDay.ToString());
                        toDate = Convert.ToString(dcrDate.Year.ToString() + "-" + dcrDate.Month.ToString() + "-" + endDay.ToString());
                        sum = GetSum(companyCode, userCode, fromDate, toDate, expenseTypeCode, dcrDate.ToString("yyyy-MM-dd"));
                        break;

                    case "YEARLY":
                        fromDate = Convert.ToString(dcrDate.Year.ToString() + "-01-01");
                        toDate = Convert.ToString(dcrDate.Year.ToString() + "-12-31");
                        sum = GetSum(companyCode, userCode, fromDate, toDate, expenseTypeCode, dcrDate.ToString("yyyy-MM-dd"));
                        break;

                    case "WEEKLY":
                        sum = _objDCRDAL.GetWeeklyExpenseSum(companyCode, userCode, dcrActualDate, expenseTypeCode);
                        break;
                    default:
                        break;
                }
                return sum;
            }
            catch
            {
                throw;
            }
        }

        private double GetSum(string companyCode, string userCode, string fromDate, string toDate, string expenseTypeCode, string dcrActualDate)
        {
            try
            {
                double sum = 0.0;
                sum = _objDCRDAL.GetExpenseSum(companyCode, userCode, fromDate, toDate, expenseTypeCode, dcrActualDate);
                return sum;
            }
            catch
            {
                throw;
            }

        }



        public bool InsertStockiest(string companyCode, string userCode, string dcrCode, string dcrDate, string dcrStatus, string stockiestData)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                result = _objDCRDAL.InsertStockiest(companyCode, userCode, dcrCode, dcrDate, dcrStatus, stockiestData);
                if (result == "SUCCESS")
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool InsertExpense(string companyCode, string userCode, string dcrCode, string expenseContent,
         string dcrDate, string dcrStatus, string dailyAllowance, string dcrFlag, DateCapturingModel _objDateDetails)
        {
            try
            {
                bool flag = false;
                string result = string.Empty;
                result = _objDCRDAL.InsertExpense(companyCode, userCode, dcrCode, dcrDate, dcrStatus, expenseContent, dailyAllowance, dcrFlag, _objDateDetails);
                if (result == "SUCCESS")
                {
                    flag = true;
                }

                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // if any changes, do it in mobile also.
        public bool UpdateProductAndStatus(string companyCode, string userCode, string userName, string regionCode, string regionName, string dcrCode,
                                                string dcrDate, string autoApproval, string dcrFlag, string lattitude, string longitude, string location)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;

                // This function update product qty and change the status in to the DCR Master.
                // Then update the calc fields and customer master month count based on privilege.
                result = _objDCRDAL.UpdateProductAndStatus(companyCode, userCode, userName, regionCode, regionName, dcrCode, dcrDate, autoApproval, dcrFlag, lattitude, longitude, location);

                if (result == "SUCCESS")
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool UpdateDCRCommonRemarks(string companyCode, string dcrCode, string dcrFlag, string dcrStatus, string commonRemarks, string isSubmit, string commonRemarksStatus)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                result = _objDCRDAL.UpdateDCRCommonRemarks(companyCode, dcrCode, dcrFlag, dcrStatus, commonRemarks, isSubmit, commonRemarksStatus);

                if (result == "SUCCESS")
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool UpdatePOBOrderStatus(string companyCode, string Order_Id, string orderStatus, string orderMode, string createdBy, string dcrActualDate)
        {
            try
            {
                int result = 0;
                bool flag = false;
                result = _objDCRDAL.UpdatePOBOrderStatus(companyCode, Order_Id, orderStatus, orderMode, createdBy, dcrActualDate);

                if (result >= 0)
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string GetCommonRemarks(string companyCode, string dcrCode, string dcrFlag)
        {
            return _objDCRDAL.GetCommonRemarks(companyCode, dcrCode, dcrFlag);
        }
        public string GetCommonRemarksMandatory(string companyCode, DateTime dcrDate, string userCode, string dcrFlag)
        {
            return _objDCRDAL.GetCommonRemarksMandatory(companyCode, dcrDate, userCode, dcrFlag);
        }
        //public string InsertAttendanceDoctor(List<Attendance_Doctor_Details> lsAttendance_Doctor_Details, List<Attendance_Samples_Details> lsAttendance_Samples_Details, List<DCRActivity> lstAttendance_Activity, List<DCRAttendanceBatchdetails> lstAttendance_Batch,string Company_Code, string dcr_code, DateTime dcr_date, string user_Code)
        //{
        //    return _objDCRDAL.InsertAttendanceDoctor(lsAttendance_Doctor_Details, lsAttendance_Samples_Details, lstAttendance_Activity, lstAttendance_Batch,Company_Code, dcr_code, dcr_date, user_Code);
        //}
        public List<Attendance_Doctor_Details> GetDoctorProductDetails(DateTime dcr_date, string dcr_code)
        {
            return _objDCRDAL.GetDoctorProductDetails(dcr_date, dcr_code);
        }
        public bool DeleteDCRTempTableRecords(string companyCode, string dcrCode, string dcrFlag)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                result = _objDCRDAL.DeleteDCRTempTableRecords(companyCode, dcrCode, dcrFlag);

                if (result == "SUCCESS")
                {
                    flag = true;
                }
                return flag;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public DataSet GetDCRTravelledPlacesForFareCalculation(string companyCode, string dcrCode, string dcrFlag, string dcrCategory)
        {
            return _objDCRDAL.GetDCRTravelledPlacesForFareCalculation(companyCode, dcrCode, dcrFlag, dcrCategory);
        }
        public DataSet GetDistanceMatrixForFareCalculation(string companyCode, string userTypeCode, string entity, string travelMode, string dcrDate)
        {
            return _objDCRDAL.GetDistanceMatrixForFareCalculation(companyCode, userTypeCode, entity, travelMode, dcrDate);
        }

        public double GetSFCFare(string companyCode, string fromPlace, string toPlace, string sfcRegionCode, string sfcCategory, string travelMode, string dcrDate)
        {
            return _objDCRDAL.GetSFCFare(companyCode, fromPlace, toPlace, sfcRegionCode, sfcCategory, travelMode, dcrDate);
        }

        #region - Get config values
        public string GetConfigvalues(string companyCode)
        {
            string configValue = string.Empty;
            _objIconfigsettings = new Config_Settings();
            return _objIconfigsettings.GetConfigDefaultValue(companyCode, CONFIG_TYPE.DCR, CONFIG_KEY.DCR_NO_PREFIL_EXPENSE_VALUE);
        }
        #endregion - Get config values
    }
}
