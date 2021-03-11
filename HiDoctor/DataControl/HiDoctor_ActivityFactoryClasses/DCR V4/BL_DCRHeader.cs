using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using MVCModels;
using Newtonsoft.Json;


namespace DataControl
{
    public class BL_DCRHeader
    {
        private DAL_DCRHeader _objDCRDAL = new DAL_DCRHeader();

        //******************************* DCR HEADER - START  *********************************************
        public List<object> GetCategory(string companyCode)
        {
            List<object> ltCat = new List<object>();
            ltCat = _objDCRDAL.GetCategory(companyCode);
            return ltCat;
        }

        public List<SFCStatus> CheckSFCStatus(string companyCode, string IntermediateData, string dcrDate)
        {
            return _objDCRDAL.CheckSFCStatus(companyCode, IntermediateData, dcrDate);
        }

        public DataTable GetAccompanistDetails(string companyCode, string regionCode, string DCR_Code, string user_Code, string tp_Date)
        {
            return _objDCRDAL.GetAccompanistDetails(companyCode, regionCode, DCR_Code, user_Code, tp_Date);
        }

        public DataSet GetHeaderAutofillData(string companyCode, string userCode, string regionCode)
        {
            return _objDCRDAL.GetHeaderAutofillData(companyCode, userCode, regionCode);
        }

        public DataSet GetHeaderPrefillData(string companyCode, string userCode, string dcrStatus, string dcrDate, string dcrCode, string source, string flag)
        {
            return _objDCRDAL.GetHeaderPrefillData(companyCode, userCode, dcrStatus, dcrDate, dcrCode, source, flag);
        }

        public DataTable GetDistanceEditMappingNG(string companyCode, string dcrDate, string userCode, string regionCode)
        {
            return _objDCRDAL.GetDistanceEditMappingNG(companyCode, dcrDate, userCode, regionCode);
        }

        public DataSet GetAccompanistCodeAndSFCData(string companyCode, DataRow drPrefill, string regionCode, string userTypeCode, string dcrDate)
        {
            DataSet dsAccompSfc = new DataSet();
            StringBuilder accName = new StringBuilder();
            StringBuilder accRegion = new StringBuilder();

            if (drPrefill != null)
            {
                // accompanist name
                if (!(string.IsNullOrEmpty(drPrefill["Acc1_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc1_Name"].ToString());
                    accName.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc2_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc2_Name"].ToString());
                    accName.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc3_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc3_Name"].ToString());
                    accName.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc4_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc4_Name"].ToString());
                    accName.Append("^");
                }

                //accompanist region
                if (!(string.IsNullOrEmpty(drPrefill["Acc1_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc1_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc2_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc2_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc3_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc3_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc4_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc4_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
            }
            dsAccompSfc = _objDCRDAL.GetAccompanistCodeAndSFCData(companyCode, accName.ToString(), accRegion.ToString(), regionCode, userTypeCode, dcrDate);

            return dsAccompSfc;
        }

        public List<DCRHeaderModel> GetAllUserRegionData(string companyCode, string regionCode, string matchingString)
        {
            return _objDCRDAL.GetAllUserRegionData(companyCode, regionCode, matchingString);
        }
        public List<DCRHeaderModel> GetSFCData(string companyCode, string regionCode, string dcrDate)
        {
            return _objDCRDAL.GetSFCData(companyCode, regionCode, dcrDate);
        }

        public DataTable GetActivityMaster(string companyCode, string userCode)
        {
            return _objDCRDAL.GetActivityMaster(companyCode, userCode);
        }

        public bool InsertHeaderDetails(string companyCode, string userCode, string regionCode, string dcrCode,
            string dcrDate, string dcrStatus, string distanceFareCode, string category, string categoryCode, string cpCode, string cpName,
            string workPlace, string fromPlace, string toPlace, string travelMode, string distance, string startTime, string endTime,
            string acc1Name, string acc1Type, string acc1StartTime, string acc1EndTime, string acc1OnlyDoctor, string acc1Mode,
            string acc2Name, string acc2Type, string acc2StartTime, string acc2EndTime, string acc2OnlyDoctor, string acc2Mode,
            string acc3Name, string acc3Time, string acc3OnlyDoctor, string acc3Mode,
            string acc4Name, string acc4Time, string acc4OnlyDoctor, string acc4Mode,
            string isrcpa, string routeWay, string activityString, string dcrFlag, string tpDeviation, string cpDeviation, string entryMode, string dataFrom,
            string sfcRegionCode, string sfcVersionNo, string sfcCategoryName,
            string lattitude, string longitude, string location, Boolean dcr_Freeze, string _objDateDetails,int ISchecked)
        {
            try
            {

                DateCapturingModel _obDateDet = JsonConvert.DeserializeObject<DateCapturingModel>(_objDateDetails);
                if (!(_obDateDet.Off_Set.Contains('+') && !(_obDateDet.Off_Set.Contains('-'))))
                {
                    _obDateDet.Off_Set = '+' + _obDateDet.Off_Set.Trim();
                }
                string result = string.Empty;
                bool flag = false;
                int originOfDCR = 0;

                // Define Origin Of DCR. 
                // Its applicable for Fresh entry. For Other status DCR's the first entry of "Origin_Of_DCR" will be maintained.
                // 1 = Web,2 = Mobile,3 = WA

                if (dcrStatus == "1")
                {
                    if (dataFrom == "WA")
                    {
                        originOfDCR = 3;
                    }
                    else if (entryMode == "WEB")
                    {
                        originOfDCR = 1;
                    }
                    else if (entryMode == "MOBILE")
                    {
                        originOfDCR = 2;
                    }
                }

                string loc = "NOT_FOUND";
                if (lattitude == "" || lattitude == "Null" || lattitude == "0")
                {
                    lattitude = loc;
                }
                if (longitude == "" || longitude == "Null" || longitude == "0")
                {
                    longitude = loc;
                }
                if (location == "" || location == "Null" || location == "0")
                {
                    location = loc;
                }

                result = _objDCRDAL.InsertHeaderDetails(companyCode, userCode, regionCode, dcrCode, dcrDate, dcrStatus, distanceFareCode, category, categoryCode, cpCode, cpName, workPlace, fromPlace, toPlace,
                    travelMode, distance, startTime, endTime, acc1Name, acc1Type, acc1StartTime, acc1EndTime, acc1OnlyDoctor, acc1Mode, acc2Name, acc2Type, acc2StartTime,
                    acc2EndTime, acc2OnlyDoctor, acc2Mode, acc3Name, acc3Time, acc3OnlyDoctor, acc3Mode, acc4Name, acc4Time, acc4OnlyDoctor, acc4Mode, isrcpa, routeWay, entryMode, activityString,
                    dcrFlag, tpDeviation, cpDeviation, sfcRegionCode, sfcVersionNo, sfcCategoryName, lattitude, longitude, location, originOfDCR, dcr_Freeze, _obDateDet, ISchecked);

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

        public bool InsertTravelledPlaces(string companyCode, string userCode, string dcrCode, string dcrDate, string intermediateData, string category, string dcrFlag)
        {
            try
            {
                string result = string.Empty;
                bool flag = false;
                result = _objDCRDAL.InsertTravelledPlaces(companyCode, userCode, dcrCode, dcrDate, intermediateData, dcrFlag, category);

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

        public List<DCRDoctorAccompanistModel> GetDoctorAccompanistDetails(string companyCode, string userCode, string dcrDate, string dcrCode, string dataFrom)
        {
            return _objDCRDAL.GetDoctorAccompanistDetails(companyCode, userCode, dcrDate, dcrCode, dataFrom);
        }

        public DataSet GetTPDetailsWhenWAExists(string companyCode, string userCode, string dcrDate, string activityFlag)
        {
            return _objDCRDAL.GetTPDetailsWhenWAExists(companyCode, userCode, dcrDate, activityFlag);
        }

        public List<MVCModels.DCRSFCModel> CheckSFCData(string companyCode, List<MVCModels.DCRSFCModel> lstSFCNew, string dcrDate, out string isChange)
        {
            try
            {
                //List<MVCModels.DCRSFCModel> lstSFC = new List<MVCModels.DCRSFCModel>();
                List<MVCModels.DCRSFCModel> lstCheckSFC = new List<MVCModels.DCRSFCModel>();
                int i = 0;
                isChange = "N";

                foreach (var sfc in lstSFCNew)
                {
                    //// check for combination
                   

                    // check for next version number
                    lstCheckSFC = new List<DCRSFCModel>();
                    lstCheckSFC = (List<MVCModels.DCRSFCModel>)(_objDCRDAL.CheckSFCForNextVersionNumber(companyCode, sfc.Distance_Fare_Code, sfc.SFC_Version_No, dcrDate)).ToList();
                    if (lstCheckSFC != null && lstCheckSFC.Count > 0)
                    {
                        lstSFCNew[i].From_Place = lstCheckSFC[0].From_Place.ToUpper();
                        lstSFCNew[i].To_Place = lstCheckSFC[0].To_Place.ToUpper();
                        lstSFCNew[i].Travel_Mode = lstCheckSFC[0].Travel_Mode.ToUpper();
                        lstSFCNew[i].Distance = lstCheckSFC[0].Distance;
                        lstSFCNew[i].SFC_Category_Name = lstCheckSFC[0].SFC_Category_Name;
                        lstSFCNew[i].SFC_Region_Code = lstCheckSFC[0].SFC_Region_Code;
                        lstSFCNew[i].SFC_Version_No = lstCheckSFC[0].SFC_Version_No;
                        lstSFCNew[i].Fare_Amount = lstCheckSFC[0].Fare_Amount;
                        lstSFCNew[i].SFC_Visit_Count = lstCheckSFC[0].SFC_Visit_Count;
                        lstSFCNew[i].Route_Way = "D";
                        i++;
                        isChange = "Y";
                        continue;
                    }
                    else
                    {
                        //// check for same code
                        lstCheckSFC = new List<DCRSFCModel>();
                        lstCheckSFC = (List<MVCModels.DCRSFCModel>)(_objDCRDAL.CheckSFCForSameSFCCode(companyCode, sfc.Distance_Fare_Code, sfc.SFC_Version_No, dcrDate)).ToList();
                        if (lstCheckSFC != null && lstCheckSFC.Count > 0)
                        {
                            if ((lstSFCNew[i].From_Place.ToUpper() != lstCheckSFC[0].From_Place.ToUpper() && lstSFCNew[i].From_Place.ToUpper() != lstCheckSFC[0].To_Place.ToUpper())
                                || (lstSFCNew[i].To_Place.ToUpper() != lstCheckSFC[0].To_Place.ToUpper() && lstSFCNew[i].To_Place.ToUpper() != lstCheckSFC[0].From_Place.ToUpper()) ||
                                lstSFCNew[i].Travel_Mode.ToUpper() != lstCheckSFC[0].Travel_Mode.ToUpper() || lstSFCNew[i].SFC_Category_Name != lstCheckSFC[0].SFC_Category_Name)
                            {
                                lstSFCNew[i].From_Place = lstCheckSFC[0].From_Place.ToUpper();
                                lstSFCNew[i].To_Place = lstCheckSFC[0].To_Place.ToUpper();
                                lstSFCNew[i].Travel_Mode = lstCheckSFC[0].Travel_Mode.ToUpper();
                                lstSFCNew[i].Distance = lstCheckSFC[0].Distance;
                                lstSFCNew[i].SFC_Category_Name = lstCheckSFC[0].SFC_Category_Name;
                                lstSFCNew[i].SFC_Region_Code = lstCheckSFC[0].SFC_Region_Code;
                                lstSFCNew[i].Fare_Amount = lstCheckSFC[0].Fare_Amount;
                                lstSFCNew[i].SFC_Visit_Count = lstCheckSFC[0].SFC_Visit_Count;
                                lstSFCNew[i].Route_Way = "D";
                                isChange = "Y";
                            }
                        }
                    }
                    i++;
                }
                return lstSFCNew;
            }
            catch
            {
                throw;
            }
        }
        public string RemoveAccompanist(string acc_id, DateTime dcrDate, string usercode, string companycode, string acc_UserName, string acc_Region_Code)
        {
            return _objDCRDAL.RemoveAccompanist(acc_id, dcrDate, usercode, companycode, acc_UserName, acc_Region_Code);
        }
        public string InsertDoctorVisit(string companyCode, string DCRCode, DCRDoctorAccompanistModel DCRDoctorAccompanistModel, string acc_index)
        {
            return _objDCRDAL.InsertDoctorVisit(companyCode, DCRCode, DCRDoctorAccompanistModel, acc_index);
        }
        public int GetDoctorVisitCount(string dcr_code, string companyCode)
        {
            return _objDCRDAL.GetDoctorVisitCount(dcr_code, companyCode);
        }
        public string BindDCRFreezeStatus(DateTime dcr_date, string user_code, string company_code)
        {
            return _objDCRDAL.BindDCRFreezeStatus(dcr_date, user_code, company_code);
        }
        public DataSet CheckSFCCount(int distanceFareCode, DateTime dcr_Date, string user_code, string company_code)
        {
            return _objDCRDAL.CheckSFCCount(distanceFareCode, dcr_Date, user_code, company_code);
        }
        //******************************* DCR HEADER - END  ***********************************************

        #region Added Cp details for Accompanist in DCR and TP
        /// <summary>
        /// Used to Get the Cp for selected accomapnist
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.AccomCPModel> GetCpforAccompanist(string companyCode, string regionCode)
        {
            return _objDCRDAL.GetCpforAccompanist(companyCode, regionCode);
        }
        /// <summary>
        /// Get drafed accompanist data
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="drPrefill"></param>
        /// <param name="regionCode"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="dcrDate"></param>
        /// <returns></returns>
        public DataSet GetAccompanistCodeAndCPData(string companyCode, DataRow drPrefill, string regionCode, string userTypeCode, string dcrDate)
        {
            DataSet dsAccompSfc = new DataSet();
            StringBuilder accName = new StringBuilder();
            StringBuilder accRegion = new StringBuilder();

            if (drPrefill != null)
            {
                // accompanist name
                if (!(string.IsNullOrEmpty(drPrefill["Acc1_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc1_Name"].ToString());
                    accName.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc2_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc2_Name"].ToString());
                    accName.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc3_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc3_Name"].ToString());
                    accName.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc4_Name"].ToString())))
                {
                    accName.Append(drPrefill["Acc4_Name"].ToString());
                    accName.Append("^");
                }

                //accompanist region
                if (!(string.IsNullOrEmpty(drPrefill["Acc1_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc1_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc2_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc2_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc3_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc3_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
                if (!(string.IsNullOrEmpty(drPrefill["Acc4_Only_For_Doctor"].ToString())))
                {
                    accRegion.Append(drPrefill["Acc4_Only_For_Doctor"].ToString());
                    accRegion.Append("^");
                }
            }
            dsAccompSfc = _objDCRDAL.GetAccompanistCodeAndCPData(companyCode, accName.ToString(), accRegion.ToString(), regionCode, userTypeCode, dcrDate);

            return dsAccompSfc;
        }

        public DataSet GetUserInfoByUserName(string companyCode, string userName)
        {
            return _objDCRDAL.GetUserInforByUserName(companyCode, userName);
        }
        #endregion Added Cp details for Accompanist in DCR and TP
        /// <summary>
        /// Get activity lock type for the day in mobile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="dcrDate"></param>
        /// <returns></returns>
        public int GetActivityLockType(string companyCode, string userCode, string dcrDate, string flag)
        {
            return _objDCRDAL.GetActivityLockType(companyCode, userCode, dcrDate, flag);
        }

        public int GetAppliedTPUsersCount(string companyCode, string userCode)
        {
            try
            {
                return _objDCRDAL.GetAppliedTPUsersCount(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }

        public int GetAppliedSSUsersCount(string companyCode, string userCode)
        {
            try
            {
                return _objDCRDAL.GetAppliedSSUsersCount(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }
        public string GetLeaveUnapprovalReason(DateTime dcrDate, string usercode, string companycode)
        {
            return _objDCRDAL.GetLeaveUnapprovalReason(dcrDate, usercode, companycode);
        }

        public int InsertDCRQueueExceptionLogs(string companyCode, string dcrCode, string flag, string userCode,
            string dcrDate, string exceptionMsg, string stackTrace, string eventName)
        {
            return _objDCRDAL.InsertDCRQueueExceptionLog(companyCode, dcrCode, flag, userCode, dcrDate, exceptionMsg, stackTrace, eventName);
        }

        public int InsertDCRQueueTracker(string companyCode, DCRQueueTracker dcrQueueTracker)
        {
            return _objDCRDAL.InsertDCRQueueTracker(companyCode, dcrQueueTracker);
        }

        public int UpdateDCRQueueTracker(string companyCode, DCRQueueTracker dcrQueueTracker)
        {
            return _objDCRDAL.UpdateDCRQueueTracker(companyCode, dcrQueueTracker);
        }
        public int GetErrorDetails(string Message, string StackTrace, string usercode, string dcrDate)
        {
            return _objDCRDAL.GetErrorDetails(Message, StackTrace, usercode, dcrDate);
        }
        public int GetDoctorCount(string companycode, string region_Code)
        {
            return _objDCRDAL.GetDoctorCount(companycode, region_Code);
        }
        public List<Loggedinfullindex> GetFullIndex(string companycode, string region_Code)
        {
            return _objDCRDAL.GetFullIndex(companycode, region_Code);
        }
        public string SingleDaySfcValidation(SfcValidationModel obj)
        {
            try
            {
                return _objDCRDAL.SingleDaySfcValidation(obj);
            }
            catch(Exception ex)
            {
                throw ex;
            }            
        }
        public int GetCategorySetting(string Category_Code, string User_Type_Code,string dcrDate)
        {
            return _objDCRDAL.GetCategorySetting(Category_Code, User_Type_Code, dcrDate);
        }
        public List<StockiestName> Getlockedstockiestname(string RegionCode, int SS_Id)
        {
            return _objDCRDAL.Getlockedstockiestname(RegionCode, SS_Id);
        }
    }
}
