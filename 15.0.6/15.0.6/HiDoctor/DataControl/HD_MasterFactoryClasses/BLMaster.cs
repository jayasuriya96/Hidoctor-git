#region Using
using DataControl.Abstraction;
using DataControl.EnumType;
using DataControl;
using System.Data;
using System.Text;
using System;
using DataControl.Impl;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using OfficeOpenXml;
using System.Collections.Generic;
using MVCModels;
using Newtonsoft.Json;
using System.Net.Mail;
using MVCModels.HiDoctor_Master;
using DataControl.HiDoctor_ActivityFactoryClasses;
#endregion Using

namespace DataControl
{
    public class BLMaster
    {
        #region Private Variable
        private CurrentInfo _objCurrentInfo;
        private DALMaster _objDALMaster;
        private SPData _objSPData;
        private string _dfcExcelTemplateFileName = string.Empty;
        private const string DOWNLOAD_PATH_KEY_NAME = "ExcelDownloadPath";
        private const string UPLOAD_PATH_KEY_NAME = "ExcelUploadPath";
        private const string FILE_UPLOAD_PATH = "ExcelUploadPath";
        private const string KEY_COL_NAME = "User_Type";
        const string USER_EXCEL_SHEET_NAME = "Table$";
        #endregion Private Variable

        public DataSet GetLeaveTypeDetails(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetActivityMaster(companyCode);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertActivityMaster(string companyCode, string activityName, string startDate, string endDate, string status, string activityCode, string createdBy, string createdDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int InsertActivityMasterList = _objDALMaster.InsertActivityMaster(companyCode, activityName, startDate, endDate, status, activityCode, createdBy, createdDate);
                return InsertActivityMasterList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateActivityMaster(string companyCode, string activityName, string startDate, string endDate, string activityCode, string updatedBy, string updatedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int UpdateActivity = _objDALMaster.UpdateActivityMaster(companyCode, activityName, startDate, endDate, activityCode, updatedBy, updatedDate);
                return UpdateActivity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangeStatusForActivityMaster(string companyCode, string activityCode, string status)
        {
            try
            {
                _objDALMaster = new DALMaster();
                string ChangeStatus = _objDALMaster.ChangeStatusForActivityMaster(companyCode, activityCode, status);
                return ChangeStatus;
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public DataSet GetExpenseEntityMaster(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetExpenseEntityMaster(companyCode);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertExpenseEntityMaster(string companyCode, string expenseEntityCode, string expenseEntityName, string effectiveFrom, string effectiveTo, string status, string createdBy, string createdDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int InsertExpenseEntityMasterList = _objDALMaster.InsertExpenseEntityMaster(companyCode, expenseEntityCode, expenseEntityName, effectiveFrom, effectiveTo, status, createdBy, createdDate);
                return InsertExpenseEntityMasterList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateExpenseEntityMaster(string companyCode, string expenseEntityCode, string expenseEntityName, string effectiveFrom, string effectiveTo, string updatedBy, string updateDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int UpdateExpenseEntityMasterList = _objDALMaster.UpdateExpenseEntityMaster(companyCode, expenseEntityCode, expenseEntityName, effectiveFrom, effectiveTo, updatedBy, updateDate);
                return UpdateExpenseEntityMasterList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangeStatusforExpenseEntityMaster(string companyCode, string expenseEntityCode, string status)
        {
            try
            {
                _objDALMaster = new DALMaster();
                string changestatus = _objDALMaster.ChangeStatusforExpenseEntityMaster(companyCode, expenseEntityCode, status);
                return changestatus;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSet GetUserTypeMaster(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetUserTypeMaster(companyCode);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataSet Getdivisions(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.Getdivisions(companyCode);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangestatusforUserType(string companyCode, string userTypeCode, string status, string updatedBy, string updatedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforUserType(companyCode, userTypeCode, status, updatedBy, updatedDate);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertUserType(string companyCode, string userTypeCode, string userTypeName, string underUserType, string effectiveFrom, string status, string userTypeCategory, string createdBy, string createdDate, string refkey1, string refkey2)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int InsertUserType = _objDALMaster.InsertUserType(companyCode, userTypeCode, userTypeName, underUserType, effectiveFrom, status, userTypeCategory, createdBy, createdDate, refkey1, refkey2);
                return InsertUserType;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public List<SendSMS> SendSMS(string companyCode, string userCode, string createdDate)
        //{
        //    throw new NotImplementedException();
        //}

        public int UpdateUserType(string companyCode, string userTypeCode, string userTypeName, string underUserType, string effectiveFrom, string userTypeCategory, string updatedBy, string updatedDate, string refkey1, string refkey2)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int UpdateUserType = _objDALMaster.UpdateUserType(companyCode, userTypeCode, userTypeName, underUserType, effectiveFrom, userTypeCategory, updatedBy, updatedDate, refkey1, refkey2);
                return UpdateUserType;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<object> GetUserType(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserType(companyCode);
        }

        public DataSet GetSalesActivity(string companyCode)
        {
            _objDALMaster = new DALMaster();
            DataSet ds = new DataSet();
            ds = _objDALMaster.GetSalesActivity(companyCode);
            return ds;
        }

        public DataSet GetSalesActivityMapping(string companyCode)
        {
            _objDALMaster = new DALMaster();
            DataSet ds = new DataSet();
            ds = _objDALMaster.GetSalesActivityMapping(companyCode);
            return ds;
        }
        public DataSet GetRegionTypeDetails(string companyCode)
        {
            _objDALMaster = new DALMaster();
            DataSet ds = new DataSet();
            ds = _objDALMaster.GetRegionTypeDetails(companyCode);
            return ds;
        }
        public DataSet GetRegiontypeDetailsAll(string companyCode)
        {
            _objDALMaster = new DALMaster();
            DataSet ds = new DataSet();
            ds = _objDALMaster.GetRegiontypeDetailsAll(companyCode);
            return ds;
        }

        public string InsertSalesActivityMapping(string companyCode, string projectCode, string activityCode, string startDate, string endDate, string createdBy, string createdDate)
        {
            _objDALMaster = new DALMaster();
            DataSet ds = new DataSet();
            return _objDALMaster.InsertSalesActivityMapping(companyCode, projectCode, activityCode, startDate, endDate, createdBy, createdDate);
        }


        public string UpdateSalesActivityMapping(string companyCode, string nprojectCode, string nactivityCode, string oprojectCode, string oactivityCode, string mode, string status, string startDate, string endDate, string updatedBy, string updatedDate)
        {
            _objDALMaster = new DALMaster();
            DataSet ds = new DataSet();
            return _objDALMaster.UpdateSalesActivityMapping(companyCode, nprojectCode, nactivityCode, oprojectCode, oactivityCode, mode, status, startDate, endDate, updatedBy, updatedDate);
        }

        public DataSet GetRegionCategory(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetRegionCategory(companyCode);
                return ds;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string InsertRegionCategory(string companyCode, int CompanyId, string regionClassificationCode, string regionCalssificationName,
                                             string status, string Ref_Key1, string Ref_Key2, string rowVersionNo, string createdBy, string createdDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertRegionCategory(companyCode, CompanyId, regionClassificationCode, regionCalssificationName, status, Ref_Key1, Ref_Key2, rowVersionNo, createdBy, createdDate);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string UpdateRegionCategory(string companyCode, int CompanyId, string regionClassificationCode, string regionCalssificationName,
                                             string status, string Ref_key1, string Ref_key2, string rowVersionNo, string updatedBy, string updatedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateRegionCategory(companyCode, CompanyId, regionClassificationCode, regionCalssificationName, status, Ref_key1, Ref_key2, rowVersionNo, updatedBy, updatedDate);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string regionclassificationchangestatus(string companyCode, string regionClassificationCode, string regionClassificationName, string changeStatus, string updatedBy, string updatedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                string regionTypeChange = _objDALMaster.regionclassificationchangestatus(companyCode, regionClassificationCode, regionClassificationName, changeStatus, updatedBy, updatedDate);
                return regionTypeChange;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int GetMaxRowversionNo(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int Maxno = _objDALMaster.GetMaxRowversionNo(companyCode);
                return Maxno;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // ****************** START - DFC ************************
        public List<DistanceFareChartModel> GetDistanceFareChart(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetDistanceFareChart(companyCode);
        }

        public List<DistanceFareChartModel> GetDistanceFareChartALL(string companyCode, string userTypeCode, string travelMode, string category)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetDistanceFareChartNew(companyCode, userTypeCode, travelMode, category);
        }

        public string InsertDistanceFareChart(string companyCode, string DFCJson, string userName)
        {
            _objDALMaster = new DALMaster();
            List<DistanceFareChartModel> lstDistanceFareChart = null;
            if (DFCJson != null && DFCJson.Length > 0)
            {
                lstDistanceFareChart = (List<DistanceFareChartModel>)JsonConvert.DeserializeObject(DFCJson, typeof(List<DistanceFareChartModel>));
            }

            string User_Type_Code = lstDistanceFareChart[0].User_Type_Code;
            string Entity_Code = lstDistanceFareChart[0].Entity_Code;
            string travel_Mode = lstDistanceFareChart[0].Travel_Mode;
            string Date_From = lstDistanceFareChart[0].Date_From;
            string Date_To = lstDistanceFareChart[0].Date_To;
            string DFC_Codes = "";
            string form_mode = "";
            for (int index = 0; index < lstDistanceFareChart.Count; index++)
            {


                if (lstDistanceFareChart[index].Distance_Range_Code == null || lstDistanceFareChart[index].Distance_Range_Code.Trim().Length == 0)
                {
                    lstDistanceFareChart[index].Distance_Range_Code = "-1";
                }
                if (lstDistanceFareChart[index].Created_By == null || lstDistanceFareChart[index].Created_By.Length == 0)
                {
                    lstDistanceFareChart[index].Created_By = userName;
                }
                if (lstDistanceFareChart[index].Update_By == null || lstDistanceFareChart[index].Update_By.Length == 0)
                {
                    lstDistanceFareChart[index].Update_By = userName;
                }
                DFC_Codes += lstDistanceFareChart[index].Distance_Range_Code + "^";
                form_mode = lstDistanceFareChart[index].Distance_Range_Code != "-1" ? "EDIT" : "INSERT";
            }


            string result = _objDALMaster.ValidateDFCDateOverlapping(companyCode, User_Type_Code, Entity_Code, travel_Mode, Date_From, Date_To, DFC_Codes, form_mode);
            if (result == null || result.Length == 0)
            {
                return _objDALMaster.InsertDistanceFareChart(companyCode, lstDistanceFareChart);
            }
            else
            {
                return result;
            }
        }

        public IEnumerable<DistanceFareChartModel> GetDistanceMatrixForSFCCalculation(string companyCode, string userTypeCode, string entity)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetDistanceMatrixForSFCCalculation(companyCode, userTypeCode, entity);
        }

        // ****************** END - DFC ************************
        /******************** START: SFC Master **************************/
        public IEnumerable<SFCRegionModel> GetSFCRegions(SFCRegionModel sfcRegion, int pageNumber,
            int pageSize, bool isAllRowsReq, ref int totalPageNo, string searchregion, string searchFromPlace, string searchToPlace, string SFCStatus, int showArchived)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSFCRegions(sfcRegion, pageNumber, pageSize, isAllRowsReq, ref totalPageNo, searchregion, searchFromPlace, searchToPlace, SFCStatus, showArchived);
        }

        public double SFCFareCalcUsedByDistanceMatrix(string companyCode, string userTypeCode, string entity, int distance)
        {
            //_objDALMaster = new DALMaster();
            //IEnumerable<DistanceFareChartModel> IDistnceFareModel = _objDALMaster.GetDistanceMatrixForSFCCalculation(companyCode, userTypeCode, entity);
            //double fareAmount = 0;
            //int preToKm = 0;

            //if (IDistnceFareModel.Where(d => d.To_Km > distance).ToList().Count > 0)
            //{
            //    int i = 0;
            //    foreach (DistanceFareChartModel distanceFare in IDistnceFareModel)
            //    {
            //        // Is_Amount_Fixed property only checking for first row. This only for TTk and some other clients.
            //        if (i == 0)
            //        {
            //            if (distanceFare.Is_Amount_Fixed == "1")
            //            {
            //                if (distanceFare.To_Km > distance)
            //                {
            //                    fareAmount += distanceFare.To_Km * distanceFare.Fare_Amount;
            //                    return fareAmount;
            //                }
            //                else
            //                {
            //                    // The same codes as follows else part.
            //                    if (distanceFare.To_Km < distance)
            //                    {
            //                        fareAmount += ((distanceFare.To_Km - preToKm) * distanceFare.Fare_Amount);
            //                    }
            //                    else
            //                    {
            //                        fareAmount += ((distance - preToKm) * distanceFare.Fare_Amount);
            //                        break;
            //                    }
            //                }
            //            }
            //            else
            //            {
            //                // not is amount fixed.
            //                // The same codes as follows else part.
            //                if (distanceFare.To_Km < distance)
            //                {
            //                    fareAmount += ((distanceFare.To_Km - preToKm) * distanceFare.Fare_Amount);
            //                }
            //                else
            //                {
            //                    fareAmount += ((distance - preToKm) * distanceFare.Fare_Amount);
            //                    break;
            //                }
            //            }
            //        }
            //        // if i > 0 
            //        else
            //        {
            //            if (distanceFare.To_Km < distance)
            //            {
            //                fareAmount += ((distanceFare.To_Km - preToKm) * distanceFare.Fare_Amount);
            //            }
            //            else
            //            {
            //                fareAmount += ((distance - preToKm) * distanceFare.Fare_Amount);
            //                break;
            //            }
            //        }
            //        preToKm = distanceFare.To_Km;
            //        i++;
            //    }
            //    return fareAmount;
            //}
            //else
            //{
            //    return 0;
            //}
            return 0;
        }

        public Dictionary<string, string> MutlipleSFCCall(string company_Code, string user_Code, string SFCJson, string ipAddress, string hostName, string SaveType)
        {
            List<SFCRegionModel> lstSFCRegionEntity = (List<SFCRegionModel>)JsonConvert.DeserializeObject(SFCJson, typeof(List<SFCRegionModel>));
            SFCRegionModel _objSFC = new SFCRegionModel();
            Dictionary<string, string> dicSFCSaveTravelModeWise = new Dictionary<string, string>();

            lstSFCRegionEntity.ForEach(SF => SF.Company_Code = company_Code);

            if (lstSFCRegionEntity != null && lstSFCRegionEntity.Count > 0)
            {
                if (SaveType == "Save")
                {
                    string[] travelModeArray = lstSFCRegionEntity[0].Travel_Mode.Split(',');
                    foreach (string singelTravleMode in travelModeArray)
                    {
                        List<SFCRegionModel> lstSFCRegions = new List<SFCRegionModel>();
                        _objSFC.Company_Code = lstSFCRegionEntity[0].Company_Code;
                        _objSFC.Distance_Fare_Code = lstSFCRegionEntity[0].Distance_Fare_Code;
                        _objSFC.Region_Code = lstSFCRegionEntity[0].Region_Code;
                        _objSFC.From_Region_Name = lstSFCRegionEntity[0].From_Region_Name;
                        _objSFC.To_Region_Name = lstSFCRegionEntity[0].To_Region_Name;
                        _objSFC.Distance = lstSFCRegionEntity[0].Distance;
                        _objSFC.Fare_Amount = lstSFCRegionEntity[0].Fare_Amount;
                        _objSFC.Date_From = lstSFCRegionEntity[0].Date_From;
                        _objSFC.Date_To = lstSFCRegionEntity[0].Date_To;
                        _objSFC.Status = lstSFCRegionEntity[0].Status;
                        _objSFC.Travel_Mode = singelTravleMode;
                        _objSFC.Category_Name = lstSFCRegionEntity[0].Category_Name;
                        _objSFC.SFC_Visit_Count = lstSFCRegionEntity[0].SFC_Visit_Count;
                        _objSFC.Created_By = lstSFCRegionEntity[0].Created_By;
                        _objSFC.Created_DateTime = lstSFCRegionEntity[0].Created_DateTime;
                        _objSFC.Updated_By = lstSFCRegionEntity[0].Updated_By;
                        _objSFC.Updated_DateTime = lstSFCRegionEntity[0].Updated_DateTime;
                        _objSFC.SFCValidation = lstSFCRegionEntity[0].SFCValidation;
                        _objSFC.Show_Version_Flag = lstSFCRegionEntity[0].Show_Version_Flag;
                        _objSFC.Action = lstSFCRegionEntity[0].Action;
                        _objSFC.SFC_Version_No = lstSFCRegionEntity[0].SFC_Version_No == "" ? "1" : lstSFCRegionEntity[0].SFC_Version_No;
                        _objSFC.Minimum_Count = lstSFCRegionEntity[0].Minimum_Count;
                        lstSFCRegions.Add(_objSFC);
                        string result = SaveSFC(company_Code, user_Code, lstSFCRegions, ipAddress, hostName);
                        dicSFCSaveTravelModeWise.Add(singelTravleMode, result);
                    }
                }
                else if ((SaveType == "Version") || (SaveType == "Edit"))
                {
                    BLMaster _objDAL = new BLMaster();
                    CurrentInfo _objCurrentInfo = new CurrentInfo();
                    Dictionary<string, int> dicTravleModeCount = new Dictionary<string, int>();
                    dicTravleModeCount = _objDAL.GetExistingSFCCount(_objCurrentInfo.GetCompanyCode(), lstSFCRegionEntity[0].Region_Code, lstSFCRegionEntity[0].From_Region_Name, lstSFCRegionEntity[0].To_Region_Name
                                                                        , lstSFCRegionEntity[0].Category_Name, lstSFCRegionEntity[0].Travel_Mode);
                    if (dicTravleModeCount.Count > 1)
                    {
                        dicSFCSaveTravelModeWise.Add("Travel Mode", "The travel mode " + lstSFCRegionEntity[0].Travel_Mode + " SFC combination already exists.If you wish to add the same SFC combination,please use the Add SFC Version from the list. <br/>");
                        return dicSFCSaveTravelModeWise;
                    }
                    else
                    {
                        string result = SaveSFC(company_Code, user_Code, lstSFCRegionEntity, ipAddress, hostName);
                        dicSFCSaveTravelModeWise.Add("Message", result);
                    }
                }
            }
            return dicSFCSaveTravelModeWise;


        }

        public string SaveSFC(string company_Code, string user_Code, List<SFCRegionModel> lstSFCRegionEntity, string ipAddress, string hostName)
        {
            try
            {
                // single insert
                _objDALMaster = new DALMaster();
                string validationMessage = null;
                //List<SFCRegionModel> lstSFCRegionEntity = (List<SFCRegionModel>)JsonConvert.DeserializeObject(SFCJson, typeof(List<SFCRegionModel>));
                //List<SFCRegionModel> lstSFCRegions = new List<SFCRegionModel>();
                //SFCRegionModel _objSFC = new SFCRegionModel();
                //string arr = lstSFCRegionEntity[i].Travel_Mode;
                //string[] splitarr = arr.Split(',');
                //for (int j = 0; j <= splitarr.Count; j++)
                //{
                //    //string[] splitarr = arr.Split(',');
                //lstSFCRegionEntity[i].Travel_Mode = splitarr[i];



                //int i = 0;
                //string[] array=null;
                //for (i = 0; i < lstSFCRegionEntity.Count; i++)
                //{
                //     array = lstSFCRegionEntity[i].Travel_Mode.Split(',');
                //}
                //    for (int s = 0; s < array.Length; s++)
                //    {

                //        _objSFC.From_Region_Name = lstSFCRegionEntity[0].Company_Code;
                //        _objSFC.To_Region_Name = lstSFCRegionEntity[0].Distance_Fare_Code;
                //        _objSFC.Region_Code = lstSFCRegionEntity[0].Region_Code;
                //        _objSFC.From_Region_Name = lstSFCRegionEntity[0].Distance;
                //        _objSFC.To_Region_Name = lstSFCRegionEntity[0].To_Region_Name;
                //        _objSFC.Distance = lstSFCRegionEntity[0].Distance;
                //        _objSFC.Fare_Amount = lstSFCRegionEntity[0].Fare_Amount;
                //        _objSFC.Date_From = lstSFCRegionEntity[0].Date_From;
                //        _objSFC.Date_To = lstSFCRegionEntity[0].Date_To;
                //        _objSFC.Status = lstSFCRegionEntity[0].Status;
                //        _objSFC.Travel_Mode = array[s];
                //        _objSFC.Category_Name = lstSFCRegionEntity[0].Category_Name;
                //        _objSFC.SFC_Visit_Count = lstSFCRegionEntity[0].SFC_Visit_Count;
                //        _objSFC.Created_By = lstSFCRegionEntity[0].Created_By;
                //        _objSFC.Created_DateTime = lstSFCRegionEntity[0].Created_DateTime;
                //        _objSFC.Updated_By = lstSFCRegionEntity[0].Updated_By;
                //        _objSFC.Updated_DateTime = lstSFCRegionEntity[0].Updated_DateTime;
                //        _objSFC.SFCValidation = lstSFCRegionEntity[0].SFCValidation;
                //        _objSFC.Show_Version_Flag = lstSFCRegionEntity[0].Show_Version_Flag;
                //        lstSFCRegions.Add(_objSFC);
                //    }





                //if (lstSFCRegionEntity[index].Distance_Fare_Code == null || lstSFCRegionEntity[index].Distance_Fare_Code.Trim().Length == 0 || lstSFCRegionEntity[index].Distance_Fare_Code == "-1")
                //{

                //       _objSFC.From_Region_Name = lstSFCRegionEntity[s].Company_Code;
                //    _objSFC.To_Region_Name = lstSFCRegionEntity[s].Distance_Fare_Code;
                //    _objSFC.Region_Code=lstSFCRegionEntity[s].Region_Code;
                //    _objSFC.From_Region_Name=lstSFCRegionEntity[s].Distance;
                //    _objSFC.To_Region_Name=lstSFCRegionEntity[s].To_Region_Name;
                //    _objSFC.Distance=lstSFCRegionEntity[s].Distance;
                //    _objSFC.Fare_Amount=lstSFCRegionEntity[s].Distance_Fare_Code;
                //    _objSFC.Date_From=lstSFCRegionEntity[s].Date_From;
                //    _objSFC.Date_To=lstSFCRegionEntity[s].Date_To;
                //    _objSFC.Status=lstSFCRegionEntity[s].Status;
                //    _objSFC.Travel_Mode = array[s];
                //    _objSFC.Category_Name=lstSFCRegionEntity[0].Category_Name;
                //    _objSFC.SFC_Visit_Count=lstSFCRegionEntity[s].SFC_Visit_Count;
                //    _objSFC.Created_By=lstSFCRegionEntity[s].Created_By;
                //    _objSFC.Created_DateTime=lstSFCRegionEntity[s].Created_DateTime;
                //    _objSFC.Updated_By=lstSFCRegionEntity[s].Updated_By;
                //    _objSFC.Updated_DateTime=lstSFCRegionEntity[s].Updated_DateTime;
                //    _objSFC.SFCValidation=lstSFCRegionEntity[s].SFCValidation;
                //    _objSFC.Show_Version_Flag = lstSFCRegionEntity[s].Show_Version_Flag;

                //}


                //lstSFCRegions.Add(_objSFC);

                // Company Code updation.
                lstSFCRegionEntity.ForEach(SF => SF.Company_Code = company_Code);


                for (int index = 0; index < lstSFCRegionEntity.Count; index++)
                {



                    // Update the Created_by and Update_By columns.
                    if (lstSFCRegionEntity[index].Distance_Fare_Code == null || lstSFCRegionEntity[index].Distance_Fare_Code.Trim().Length == 0 || lstSFCRegionEntity[index].Distance_Fare_Code == "-1")
                    {
                        lstSFCRegionEntity[index].Distance_Fare_Code = "-1";
                        lstSFCRegionEntity[index].SFC_Version_No = "-1";
                        lstSFCRegionEntity[index].Created_By = user_Code;
                        lstSFCRegionEntity[index].Updated_By = user_Code;

                    }
                    else
                    {
                        if (lstSFCRegionEntity[index].SFC_Version_No == null || lstSFCRegionEntity[index].SFC_Version_No.Trim().Length == 0 || lstSFCRegionEntity[index].SFC_Version_No == "-1")
                        {
                            lstSFCRegionEntity[index].SFC_Version_No = "-1";
                            lstSFCRegionEntity[index].Created_By = user_Code;


                        }

                    }
                    lstSFCRegionEntity[index].Updated_By = user_Code;


                }


                // check entered the SFC already exist in SFC master table.
                validationMessage = _objDALMaster.CheckSFCExist(company_Code, lstSFCRegionEntity, lstSFCRegionEntity[0].Region_Code);


                //return validationMessage;
                if (validationMessage != null && validationMessage.Length == 0)
                {
                    lstSFCRegionEntity = lstSFCRegionEntity.Where(sfc => sfc.Action != "NO").ToList();
                    return _objDALMaster.SaveSFC(company_Code, lstSFCRegionEntity, lstSFCRegionEntity[0].Region_Code, ipAddress, hostName).ToString();
                }
                else
                {
                    return validationMessage;
                }


                // if eneterd SFC already exist, we return the -1 otherwise insert/update the SFC.
                //return _objDALMaster.SaveSFC(company_Code, lstSFCRegionEntity, lstSFCRegionEntity[0].Region_Code, ipAddress, hostName).ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<SFCRegionModel> GetSelectedSFC(string company_Code, string region_Code, Int64 SFCCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSelectedSFC(company_Code, region_Code, SFCCode).ToList();
        }

        public List<SFCRegionModel> GetSFC(string company_Code, string region_Code)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSFC(company_Code, region_Code).ToList();
        }

        public List<SFCRegionModel> GetSFCTo(string company_Code, string region_Code)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSFCTo(company_Code, region_Code).ToList();
        }
        /// <summary>
        /// Used to check the existing sfc record for same region
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="fromPlace"></param>
        /// <param name="toPlace"></param>
        /// <param name="categoryName"></param>
        /// <param name="travelMode"></param>
        /// <returns></returns>
        public Dictionary<string, int> GetExistingSFCCount(string companyCode, string regionCode, string fromPlace, string toPlace, string categoryName, string travelMode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                Dictionary<string, int> dicTravelModeCount = new Dictionary<string, int>();

                string[] travelModeArr = travelMode.Split(',');
                foreach (string singletravelMode in travelModeArr)
                {
                    int sfcCount = _objDALMaster.GetExistingSFCCount(companyCode, regionCode, fromPlace, toPlace, categoryName, singletravelMode);
                    dicTravelModeCount.Add(singletravelMode, sfcCount);
                }

                return dicTravelModeCount;

            }
            catch
            {
                throw;
            }
        }
        /******************** END: SFC Master ****************************/
        public int InsertRegionType(string companyCode, string regionTypeCode, string regionTypeName, string underRegionCode, string effectiveFrom, string status, string updatedBy, string updatedDate, string RefKey1, string Refkey2, string RegionTypeCat)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int activityInsert = _objDALMaster.InsertRegionType(companyCode, regionTypeCode, regionTypeName, underRegionCode, effectiveFrom, status, updatedBy, updatedDate, RefKey1, Refkey2, RegionTypeCat);
                return activityInsert;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string RegionChangeStatus(string companyCode, string regionTypeCode, string changeStatus, string updatedBy, string updatedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                string regionTypeChange = _objDALMaster.RegionChangeStatus(companyCode, regionTypeCode, changeStatus, updatedBy, updatedDate);
                return regionTypeChange;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int GetRefKey1(string Company_Code, string RefKey1)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int result = _objDALMaster.GetRefKey1(Company_Code, RefKey1);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int GetRefKey2(string Company_Code, string RefKey2)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int result = _objDALMaster.GetRefKey2(Company_Code, RefKey2);
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //UpdateRegionType
        public int UpdateRegionType(string companyCode, string regionTypeCode, string regionTypeName, string underRegionCode, string updatedBy, string updatedDate, string Refkey1, string Refkey2, string RegionTypeCat)
        {
            try
            {
                _objDALMaster = new DALMaster();
                int regionTypeChange = _objDALMaster.UpdateRegionType(companyCode, regionTypeCode, regionTypeName, underRegionCode, updatedBy, updatedDate, Refkey1, Refkey2, RegionTypeCat);
                return regionTypeChange;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public IEnumerable<ProjectMasterModel> GetProjectDetails(ProjectMasterModel projectMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetProjectDetails(projectMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<ProjectLead> GetProjectLead(ProjectLead projectLead)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetProjectLead(projectLead);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<ProjectMasterModel> GetClient(ProjectMasterModel projectMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetClient(projectMaster);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<ProjectMasterModel> GetDomain(ProjectMasterModel projectMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetDomain(projectMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangeStatusforProjectMaster(string status, string projectCode, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangeStatusforProjectMaster(status, projectCode, companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertforProjectMaster(List<ProjectMasterModel> lstprojectmaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforProjectMaster(lstprojectmaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateforProjectMaster(List<ProjectMasterModel> lstprojectMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforProjectMaster(lstprojectMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get DomainMaster Details
        public IEnumerable<DomainMasterModel> GetDomainMasterDetails(DomainMasterModel domainMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetDomainMasterDetails(domainMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangestatusforDomainMaster(string status, string domainCode, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforDomainMaster(status, domainCode, companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertforDomainMaster(List<DomainMasterModel> lstdomainmaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforDomainMaster(lstdomainmaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public int UpdateforDomainMaster(List<DomainMasterModel> lstdomainmaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforDomainMaster(lstdomainmaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get FeatureMaster Details
        public IEnumerable<FeatureMasterModel> GetFeatureMasterDetails(FeatureMasterModel featureMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetFeatureMasterDetails(featureMaster);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ChangestatusforFeatureMaster(string status, string featureCode, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforFeatureMaster(status, featureCode, companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertforFeatureMaster(List<FeatureMasterModel> lstfeatureMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforFeatureMaster(lstfeatureMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateforFeatureMaster(List<FeatureMasterModel> lstfeatureMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforFeatureMaster(lstfeatureMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get CycleMaster Details
        public IEnumerable<CycleMasterModel> GetCycleMasterDetails(CycleMasterModel cycleMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetCycleMasterDetails(cycleMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public int InsertforCycleMaster(List<CycleMasterModel> lstCycleMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforCycleMaster(lstCycleMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateforCycleMaster(List<CycleMasterModel> lstCycleMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforCycleMaster(lstCycleMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //LeaveType Master Details
        public IEnumerable<LeaveTypeMasterModel> GetLeaveTypeMasterDetails(LeaveTypeMasterModel objLeaveType)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetLeaveTypeMasterDetails(objLeaveType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get ProductpriceMaster Details
        public IEnumerable<ProductPriceMasterModel> GetProjectPriceMasterDetails(ProductPriceMasterModel objProductPriceMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetProjectPriceMasterDetails(objProductPriceMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }


        //Get RegionType
        public IEnumerable<ProductPriceMasterModel> GetRegionType(ProductPriceMasterModel ObjdropRegionType)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetRegionType(ObjdropRegionType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get Region
        public IEnumerable<ProductPriceMasterModel> GetRegion(ProductPriceMasterModel objDropRegion)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetRegion(objDropRegion);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //Get ProductNames
        public IEnumerable<ProductPriceMasterModel> GetProduct(ProductPriceMasterModel objdropProduct)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetProduct(objdropProduct);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Changestatus for ProductPrice Master
        public string ChangestatusforProductpriceMaster(string status, string priceCode, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforProductpriceMaster(status, priceCode, companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Insert for ProductPriceMaster
        public int InsertforProductPriceMaster(List<ProductPriceMasterModel> lstproductPriceMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforProductPriceMaster(lstproductPriceMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Update for ProductpriceMaster
        public int UpdateforProductpriceMaster(List<ProductPriceMasterModel> lstProductPriceMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforProductpriceMaster(lstProductPriceMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get StatusMaster
        public IEnumerable<StatusMasterModel> GetStatusmasterDetails(StatusMasterModel statusMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetStatusmasterDetails(statusMaster);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Change Status for StatusMaster
        public string ChangestatusforStatusMaster(string status, string statusCode, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforStatusMaster(status, statusCode, companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Insert for StatusMaster
        public int InsertforStatusMaster(List<StatusMasterModel> lstStatusMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforStatusMaster(lstStatusMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Update for StatusMaster
        public int UpdateforstatusMaster(List<StatusMasterModel> lstStatusMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforstatusMaster(lstStatusMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get RequestMaster Details
        public IEnumerable<RequestMasterModel> GetRequestMasterDetails(RequestMasterModel requestMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetRequestMasterDetails(requestMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get CycleList
        public IEnumerable<RequestMasterModel> GetDropCycle(RequestMasterModel requestMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetDropCycle(requestMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Changestatus for RequestMaster
        public string ChangestatusforRequestMaster(string status, string requestCode, string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.ChangestatusforRequestMaster(status, requestCode, companyCode);
        }

        //Insert for RequestMaster
        public int InsertforRequestMaster(List<RequestMasterModel> lstRequestMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforRequestMaster(lstRequestMaster);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Update for RequestMaster
        public int UpdateforRequestMaster(List<RequestMasterModel> lstRequestMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforRequestMaster(lstRequestMaster);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        //*******************************************************USER PROJECT MAPPING*************************************************//
        public IEnumerable<UserProjectMapping> GetUserProjects(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserProjects(companyCode);
        }

        public IEnumerable<UserProjectMapping> GetUserProjectMapDetails(string companyCode, int pageNumber, int pagesize, ref int totalpageNo)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserProjectMapDetails(companyCode, pageNumber, pagesize, ref totalpageNo);
        }


        public IEnumerable<UserProjectMapping> GetUserProjectMapallDetails(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserProjectMapallDetails(companyCode);
        }

        public int InsertUserProjectMapping(string companyCode, string userCode, string projectCode, string startDate, string endDate)
        {
            _objDALMaster = new DALMaster();
            List<UserProjectMapping> lstPronew = new List<UserProjectMapping>();
            int rowsAffected = 0;
            string[] userCodes = userCode.Split(',');
            string[] projectCodes = projectCode.Split(',');


            if (projectCodes.Length > 0)
            {
                foreach (var item in projectCodes)
                {

                    if (userCodes.Length > 0)
                    {
                        foreach (var user in userCodes)
                        {
                            if (user != "")
                            {
                                MVCModels.UserProjectMapping objUserPro = new MVCModels.UserProjectMapping();
                                objUserPro.Company_Code = companyCode;
                                objUserPro.Project_Code = Convert.ToString(item.Split(',')[0]);
                                objUserPro.User_Code = Convert.ToString(user.Split(',')[0]);
                                objUserPro.StartDate = startDate;
                                objUserPro.EndDate = endDate;
                                objUserPro.Status = "1";
                                lstPronew.Add(objUserPro);
                            }
                        }

                    }
                }
                rowsAffected = _objDALMaster.InsertUserProjectMapping(lstPronew);
            }

            return rowsAffected;
        }

        //UpdateUserProjectMapping
        public int UpdateUserProject(string companyCode, string userCode, string projectCode, string startDate, string endDate, string oldprojectCode)
        {
            _objDALMaster = new DALMaster();
            List<UserProjectMapping> lstPronew = new List<UserProjectMapping>();
            int rowsAffected = 0;
            string[] userCodes = userCode.Split(',');
            string[] projectCodes = projectCode.Split(',');


            if (projectCodes.Length > 0)
            {
                foreach (var item in projectCodes)
                {

                    if (userCodes.Length > 0)
                    {
                        foreach (var user in userCodes)
                        {
                            if (user != "")
                            {
                                MVCModels.UserProjectMapping objUserPro = new MVCModels.UserProjectMapping();
                                objUserPro.Company_Code = companyCode;
                                objUserPro.Project_Code = Convert.ToString(item.Split(',')[0]);
                                objUserPro.User_Code = Convert.ToString(user.Split(',')[0]);
                                objUserPro.StartDate = startDate;
                                objUserPro.EndDate = endDate;
                                objUserPro.Status = "1";
                                objUserPro.OldProjectCode = oldprojectCode;
                                lstPronew.Add(objUserPro);
                            }
                        }

                    }
                }
                rowsAffected = _objDALMaster.UpdateUserProject(lstPronew);
            }

            return rowsAffected;
        }
        public int UpdateUserProjectMapping(string companyCode, string projectCode)
        {
            int rowsAffected = 0;
            _objDALMaster = new DALMaster();
            rowsAffected = _objDALMaster.UpdateUserProjectMapping(companyCode, projectCode);
            return rowsAffected;
        }

        //*********************************************************END USER PROJECT MAPPING*********************************************//

        //********************************************************Start Request MApping*********************************************88888//
        public IEnumerable<RequestModel> GetUnderUserType(RequestModel objDroUserType)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetUnderUserType(objDroUserType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<RequestModel> GetRequest(RequestModel objDroRequest)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetRequest(objDroRequest);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public IEnumerable<RequestModel> GetRequestMapDetails(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetRequestMapDetails(companyCode);
        }

        public int RequestChangeStatus(string companyCode, string mapCode, string recordStatus)
        {
            int rowsAffected = 0;
            string statusChange = "0";
            if (recordStatus == "0")
            {
                statusChange = "1";
            }
            else
            {
                statusChange = "0";
            }
            _objDALMaster = new DALMaster();
            rowsAffected = _objDALMaster.RequestChangeStatus(companyCode, mapCode, statusChange);
            return rowsAffected;
        }

        public int InsertRequestMapping(string companyCode, string requestCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            List<RequestModel> lstRequest = new List<RequestModel>();
            int rowsAffected = 0;
            MVCModels.RequestModel objRequest = new MVCModels.RequestModel();
            objRequest.Company_Code = companyCode;
            objRequest.Request_Code = requestCode;
            objRequest.User_Type_Code = userTypeCode;
            objRequest.Record_Status = "1";
            lstRequest.Add(objRequest);
            rowsAffected = _objDALMaster.InsertRequestMapping(lstRequest);


            return rowsAffected;
        }

        public int UpdateRequestMapping(string companyCode, string requestCode, string userTypeCode, string mapCode)
        {
            _objDALMaster = new DALMaster();
            List<RequestModel> lstRequest = new List<RequestModel>();
            int rowsAffected = 0;
            MVCModels.RequestModel objRequest = new MVCModels.RequestModel();
            objRequest.Company_Code = companyCode;
            objRequest.Request_Code = requestCode;
            objRequest.User_Type_Code = userTypeCode;
            objRequest.Request_Mapping_Code = mapCode;
            lstRequest.Add(objRequest);
            rowsAffected = _objDALMaster.UpdateRequestMapping(lstRequest);


            return rowsAffected;
        }



        //*********************************************************END USER REQUEST MAPPING*********************************************//

        //*********************************************************START DIVSION USER PRODUCTS MAPPING*********************************************//
        public IEnumerable<DivisionUserProducts> GetDivisionNames(DivisionUserProducts objDivUserProduct)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetDivisionNames(objDivUserProduct);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public IEnumerable<DivisionUserProducts> GetUserTypeNames(DivisionUserProducts objDivUserProduct)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetUserTypeNames(objDivUserProduct);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public IEnumerable<DivisionUserProducts> GetUsersByUserTypeAndDivision(string companyCode, string userTypeCode, string divisionCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUsersByUserTypeAndDivision(companyCode, userTypeCode, divisionCode);
        }


        public IEnumerable<DivisionUserProducts> Getprivilagevalues(string companyCode, string userTypeCode, string privilageName)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.Getprivilagevalues(companyCode, userTypeCode, privilageName);
        }


        public IEnumerable<DivisionUserProducts> GetDivUserProductMapDetails(string companyCode, string divisionCode, string proSelectMode, string productType, string actionType, string userCode)
        {
            _objDALMaster = new DALMaster();
            var producttypeApp = productType + ",";
            return _objDALMaster.GetDivUserProductMapDetails(companyCode, divisionCode, proSelectMode, producttypeApp, actionType, userCode);
        }

        public IEnumerable<DivisionUserProducts> GetAssignedProducts(string companyCode, string userCode)
        {
            _objDALMaster = new DALMaster();
            var userCodes = userCode + ",";
            return _objDALMaster.GetAssignedProducts(companyCode, userCodes);
        }



        public int InsertDivUserProducts(string companyCode, string userCode, string productCode, string currentDate)
        {
            _objDALMaster = new DALMaster();
            List<DivisionUserProducts> lstuserPronew = new List<DivisionUserProducts>();
            int rowsAffected = 0;

            var assignedProduct = GetAssignedProducts(companyCode, userCode);
            string[] userCodes = userCode.Split(',');
            string[] productCodes = productCode.Split('^');

            foreach (var user in userCode.Split(','))
            {
                foreach (var prod in productCodes)
                {
                    DivisionUserProducts objUser = new DivisionUserProducts();
                    //objUser.User_Code = user;
                    //objUser.Product_Code = prod;
                    if (!string.IsNullOrEmpty(prod) && !string.IsNullOrEmpty(user))
                    {
                        if (!assignedProduct.Any(a => a.User_Code == user && a.Product_Code == prod))
                        {

                            objUser.Product_Code = prod;
                            objUser.User_Code = user;
                            objUser.Company_Code = companyCode;
                            objUser.Current_Stock = "0";
                            objUser.Effective_From = currentDate;
                            lstuserPronew.Add(objUser);

                        }
                    }

                }
            }

            rowsAffected = _objDALMaster.InsertDivUserProducts(lstuserPronew);

            return rowsAffected;
        }
        /// <summary>
        /// Insert User Product Mapping
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCodes"></param>
        /// <param name="productCodes"></param>
        /// <returns></returns>
        public int InsertDivisionUserProductMapping(string companyCode, string userCodes, string productCodes, string minCounts, string maxCounts)
        {
            _objDALMaster = new DALMaster();
            MVCModels.DivisionUserProducts _objDivUserProdiucts = new MVCModels.DivisionUserProducts();
            List<MVCModels.DivisionUserProducts> lstDivisionUserProducts = new List<DivisionUserProducts>();
            _objDivUserProdiucts.Company_Code = companyCode;
            _objDivUserProdiucts.User_Code = userCodes;
            _objDivUserProdiucts.Product_Code = productCodes;
            _objDivUserProdiucts.Min_Counts = minCounts;
            _objDivUserProdiucts.Max_Counts = maxCounts;
            lstDivisionUserProducts.Add(_objDivUserProdiucts);
            return _objDALMaster.InsertDivisionUserProductMapping(lstDivisionUserProducts);
        }
        //*********************************************************end DIVSION USER PRODUCTS MAPPING*********************************************//
        /// <summary>
        /// To Get the Status Cycle Mapping Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<StatusCycleMapping> GetStatusCycleMappingDetails(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetStatusCylceMappingDetails(companyCode);
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("CompanyCode", companyCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicObj);
                return null;
            }
        }
        public int InsertStatusCycleMapping(string companyCode, string cycleCode, string cycleName, string statusCode, string statusName, string description, string statusOwnerType, int orderNo, string moveOrder, string mode, string oCycleCode, string oStatusCode, int recordStatus, string cretedBy, string createdDate, string updatedBy, string updatedDate)
        {
            DALMaster objDALMaster = new DALMaster();
            return objDALMaster.InsertStatusCycleMapping(companyCode, cycleCode, cycleName, statusCode, statusName, description, statusOwnerType, orderNo, moveOrder, mode, oCycleCode, oStatusCode, recordStatus, cretedBy, createdDate, updatedBy, updatedDate);
        }

        //DoctorCategory Details
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetdoctorCategoryDetails(MVCModels.HiDoctor_Master.DoctorModel doctorCategory)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetdoctorCategoryDetails(doctorCategory);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get Divisions
        public IEnumerable<MVCModels.HiDoctor_Master.DoctorModel> GetDivisionName(MVCModels.HiDoctor_Master.DoctorModel doctorCategory)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetDivisionName(doctorCategory);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //change Status for doctorcategory
        public string ChangestatusforDoctorCategoryMaster(string status, string doctorCategoryCode, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforDoctorCategoryMaster(status, doctorCategoryCode, companyCode);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Insert for Doctorcategory
        public int InsertforDoctorCategoryMaster(List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctorCategory)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforDoctorCategoryMaster(lstDoctorCategory);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Update for DoctorCategory
        public int UpdateforDoctorcategoryMaster(List<MVCModels.HiDoctor_Master.DoctorModel> lstDoctorCategory)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforDoctorcategoryMaster(lstDoctorCategory);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //HiDoctorStartDate
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetHidoctorStartdateDetails(MVCModels.HiDoctor_Master.UserModel userModel)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetHidoctorStartdateDetails(userModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetHidoctorStartdate(MVCModels.HiDoctor_Master.UserModel userModel)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetHidoctorStartdateDetails(userModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //Update for HidoctorstartDate
        public string UpdateforHidoctorStartDate(List<MVCModels.HiDoctor_Master.UserModel> lstUser)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforHidoctorStartDate(lstUser);
                // return _objDALMaster.UpdateforHidoctorStartDate(lstuserModel);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string GetPrivilegeValue(string companyCode, string userCode, string privilegeName)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetPrivilegeValue(companyCode, userCode, privilegeName);
        }
        //************************************************************SendSms**************************************************//
        public IEnumerable<SendSMS> GetUserInfoDetails(string companyCode, string fromDate, string toDate)
        {
            _objDALMaster = new DALMaster();
            var fromDates = fromDate;
            var toDates = toDate;
            return _objDALMaster.GetUserInfoDetails(companyCode, fromDates, toDates);
        }

        public IEnumerable<SendSMS> GetSentSMSDetails(string userCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSentSMSDetails(userCode);
        }
        public IEnumerable<SendSMS> SendSMS(string companyCode, string userCode)
        {
            var userInfo = GetUserDetails(companyCode, userCode);
            List<SendSMS> lstuserDetail = new List<SendSMS>();
            _objDALMaster = new DALMaster();

            foreach (var user in userInfo)
            {
                MVCModels.SendSMS objUser = new MVCModels.SendSMS();
                objUser.User_Name = user.User_Name;
                objUser.User_Pass = user.User_Pass;
                objUser.User_Code = user.User_Code;
                objUser.Mobile_Number = user.Mobile;
                lstuserDetail.Add(objUser);
            }

            return lstuserDetail;
        }

        public IEnumerable<SendSMS> GetUserDetails(string companyCode, string userCode)
        {
            _objDALMaster = new DALMaster();

            return _objDALMaster.GetUserDetails(companyCode, userCode);
        }

        public bool SMSSentLog(string companyCode, string companyId, string userCode, string userName, string senderCode, string senderName, string mobileno, string message)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.SMSSentLog(companyCode, companyId, userCode, userName, senderCode, senderName, mobileno, message);
        }


        public IEnumerable<MVCModels.RegionModel> GetSeletedRegionName(string companyCode, string regionCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSeletedRegionName(companyCode, regionCode);
        }
        //--------------START - SUB REGION MASTER---------------------------//
        /// <summary>
        /// GetSub RegionMaster 
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<SubRegionMasterModel> GetSubRegionMaster(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetSubRegionMaster(companyCode);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Insert for SubRegionMaster
        /// </summary>
        /// <param name="lstSubRegionMaster"></param>
        /// <returns></returns>
        public int InsertforSubRegionMaster(List<SubRegionMasterModel> lstSubRegionMaster)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforSubRegionMaster(lstSubRegionMaster);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Sub Region Master
        /// </summary>
        /// <param name="lstSubregion"></param>
        /// <returns></returns>
        public int UpdateforSubRegionMaster(List<SubRegionMasterModel> lstSubregion)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforSubRegionMaster(lstSubregion);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Change status
        /// </summary>
        /// <param name="status"></param>
        /// <param name="subRegionCodeVal"></param>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public string ChangestatusforSubRegionMaster(string status, string subRegionCodeVal, string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.ChangestatusforSubRegionMaster(status, subRegionCodeVal, companyCode);
            }
            catch
            {
                throw;
            }
        }

        #region LeaveBalanceUpdate
        /// <summary>
        /// Get LeaveType Name
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        /// 
        public DataSet GetLeaveTypeName(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetLeaveTypeName(companyCode);
                return ds;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Employee Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public DataSet GetEmployeeDetails(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetEmployeeDetails(companyCode);
                return ds;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get UserMaster and leaveType Values Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public DataSet GetleaveBalanceUpdate(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                DataSet ds = new DataSet();
                ds = _objDALMaster.GetleaveBalanceUpdate(companyCode);
                return ds;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// CheckLeaveBalance
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="leaveTypecode"></param>
        /// <returns></returns>
        public string CheckLeaveBalance(string companyCode, string userCode, string leaveTypecode, string Effective_From, string Effective_To)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.CheckLeaveBalance(companyCode, userCode, leaveTypecode, Effective_From, Effective_To);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Update leave Type
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="leaveTypeCode"></param>
        /// <param name="updatedBy"></param>
        /// <param name="UpdateDate"></param>
        /// <returns></returns>
        public int UpdateUserLeave(string companyCode, string userCode, string leaveTypeCode, string updatedBy, string UpdateDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateUserLeave(companyCode, userCode, leaveTypeCode, updatedBy, UpdateDate);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Insert UserLeave
        /// </summary>
        /// <param name="lstLeavecurBalance"></param>
        /// <returns></returns>
        public int InsertUserLeave(List<LeaveCurBalance> lstLeavecurBalance)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertUserLeave(lstLeavecurBalance);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Sending Mail
        /// </summary>
        /// <param name="toMailId"></param>
        /// <param name="subject"></param>
        /// <param name="mailBody"></param>
        /// <returns></returns>
        public bool SendMail(string toMailId, string subject, string mailBody)
        {
            string logDetails = "";

            try
            {
                logDetails = toMailId + '-' + subject + '-' + mailBody;
                MailMessage message = new MailMessage();
                SmtpClient smtpClient = new SmtpClient();

                MailAddress fromAddress = new MailAddress("No_Reply@swaas.net");

                message.From = fromAddress;
                message.To.Add(toMailId);
                message.Subject = subject; 
                message.IsBodyHtml = true;
                message.Body = mailBody;
                smtpClient.Host = "smtp.gmail.com";   // We use gmail as our smtp client
                smtpClient.Port = 445;
                smtpClient.EnableSsl = true;
                //smtpClient.UseDefaultCredentials = false;
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.Credentials = new System.Net.NetworkCredential("No_Reply@swaas.net", "swaas123");
                //smtpClient.EnableSsl = true;
              
                smtpClient.Send(message);

                return true;
            }
            catch (Exception ex)
            {
                ErrorHandler.InsertErrorLog(ex, logDetails, "");
                throw ex;
            }
        }
        #endregion LeaveBalanceUpdate

        #region Privilege_New Master
        /// <summary>
        /// ActivePrivilegeValue
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetActivePrivilegeValue(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetActivePrivilegeValue(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get All Privilege Value
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetAllprivilegeValue(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetAllprivilegeValue(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// GetActiveFeatre
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.FeatureModel> GetActiveFeatre(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetActiveFeatre(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// GetAllPrivilegesFromMaster
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetAllPrivilegesFromMaster(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetAllPrivilegesFromMaster(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// GetActivePrivilegeMasterValues
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetActivePrivilegeMasterValues(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetActivePrivilegeMasterValues(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Privilege and Active Master
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.PrivilegeandFeatureMasterModel> GetPrivilegeandActiveMaster(string companyCode, string searchName)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetPrivilegeandActiveMaster(companyCode, searchName);
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get ColumnNames
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="tableName"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeModel> GetColumnNames(string companyCode, string tableName)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetColumnNames(companyCode, tableName);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get PrivilegeCode for Litral Value
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetPrivilegeMasterbyPrivilegeCode(string companyCode, string privilegeCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetPrivilegeMasterbyPrivilegeCode(companyCode, privilegeCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Insert the LitralValues
        /// </summary>
        /// <param name="lstlitralvalues"></param>
        /// <returns></returns>
        public int InsertPrivilegeValue(List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstlitralvalues)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertPrivilegeValue(lstlitralvalues);
            }
            catch
            {
                throw;
            }
        }

        public int checkPrivilegeName(string companyCode, string privilegeName, string privilegeCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.checkPrivilegeName(companyCode, privilegeName, privilegeCode);
            }
            catch
            {
                throw;
            }
        }
        public int InsertforPrivilegeMaster(List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstprivilege, List<MVCModels.HiDoctor_Master.PrivilegeValueMappingModel> lstPrivilegeValueMapping)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforPrivilegeMaster(lstprivilege, lstPrivilegeValueMapping);
            }
            catch
            {
                throw;
            }
        }

        public int UpdateforPrivilegeMaster(List<MVCModels.HiDoctor_Master.PrivilegeMasterModel> lstprivilege, List<MVCModels.HiDoctor_Master.PrivilegeValueMappingModel> lstPrivilegeValueMapping)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforPrivilegeMaster(lstprivilege, lstPrivilegeValueMapping);
            }
            catch
            {
                throw;
            }
        }
        #endregion Privilege_New Master

        #region usertype privilege mapping
        /// <summary>
        /// Get the usertype privilege mapping details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the mapped privileges</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeMappingDetails(string companyCode,
            string privilegeCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetPrivilegeMappingDetails(companyCode, privilegeCode, userTypeCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetSDPrivilegeMappingDetails(string companyCode,
          string privilegeCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSDPrivilegeMappingDetails(companyCode, privilegeCode, userTypeCode);
        }
        /// <summary>
        /// Get the privilege values by privilege code and user type code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns>return the mapped privilege values</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetMappingDetailsByPrivilegeCode(string companyCode,
          string privilegeCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMappingDetailsByPrivilegeCode(companyCode, privilegeCode, userTypeCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetMappingDetailsByPrivilegeCodeSD(string companyCode,
        string privilegeCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMappingDetailsByPrivilegeCodeSD(companyCode, privilegeCode, userTypeCode);
        }
        /// <summary>
        /// Get the privilege values by privilege code
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="privilegeCode"></param>
        /// <returns>returns the privilege values from the privilege value table</returns>
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetPrivilegeValuesByPrivilegeCode(string companyCode,
        string privilegeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetPrivilegeValuesByPrivilegeCode(companyCode, privilegeCode);
        }

        public int InsertUserTypePrivilegeMapping(List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserTypeMapping, string mode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.InsertUserTypePrivilegeMapping(lstUserTypeMapping, mode);
        }
        public int SDInsertUserTypePrivilegeMapping(List<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> lstUserTypeMapping, string mode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.SDInsertUserTypePrivilegeMapping(lstUserTypeMapping, mode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.PrivilegeMasterModel> GetPrivilegeDetails(string companyCode,
              string privilegeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetPrivilegeDetails(companyCode, privilegeCode);
        }
        #endregion usertype privilege mapping

        #region RequestScreen
        /// <summary>
        /// Get Request Screen - DCR Restrict
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<DCRRestrictionModel> GetRequestScreenforDcrRestrict(string companyCode, string userCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetRequestScreenforDcrRestrict(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get RegionCategory Name
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<DCRRestrictionModel> GetRequestCategoryName(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetRequestCategoryName(companyCode);
            }
            catch
            {
                throw;
            }
        }
        public int checkWAUser(string companyCode, string userCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.checkWAUser(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Insert for the DCR Request Screen
        /// </summary>
        /// <param name="lstDCRRequest"></param>
        /// <param name="requestId"></param>
        /// <param name="remarks"></param>
        /// <param name="requestedDate"></param>
        /// <returns></returns>
        public int InsertforDCRRequestScreen(List<DCRRestrictionModel> lstDCRRequest, string requestId, string remarks, string requestedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.InsertforDCRRequestScreen(lstDCRRequest, requestId, remarks, requestedDate);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Update for DCR Request Screen
        /// </summary>
        /// <param name="lstDCRRequest"></param>
        /// <param name="requestId"></param>
        /// <param name="remarks"></param>
        /// <param name="requestedDate"></param>
        /// <returns></returns>
        public int UpdateforDCRRequestScreen(List<DCRRestrictionModel> lstDCRRequest, string requestId, string remarks, string requestedDate)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateforDCRRequestScreen(lstDCRRequest, requestId, remarks, requestedDate);
            }
            catch
            {
                throw;
            }
        }
        #endregion RequestScreen

        public int InsertRequestCategory(string companyCode, string requestCategoryName, string status)
        {
            _objDALMaster = new DALMaster();
            List<RequestCategoryMasterModel> lstRequestCategory = new List<RequestCategoryMasterModel>();
            int rowsAffected = 0;
            MVCModels.RequestCategoryMasterModel objRequest = new MVCModels.RequestCategoryMasterModel();
            objRequest.Company_Code = companyCode;
            objRequest.Request_Category_Name = requestCategoryName;
            objRequest.Request_Category_Status = status;
            lstRequestCategory.Add(objRequest);
            rowsAffected = _objDALMaster.InsertRequestCategory(lstRequestCategory);


            return rowsAffected;
        }


        public IEnumerable<RequestCategoryMasterModel> GetRequestCategoryDetail(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetRequestCategoryDetail(companyCode);
        }



        public int UpdateRequestCategory(string companyCode, string requestID, string requestCategoryName, string status)
        {
            _objDALMaster = new DALMaster();
            List<RequestCategoryMasterModel> lstRequest = new List<RequestCategoryMasterModel>();
            int rowsAffected = 0;
            MVCModels.RequestCategoryMasterModel objRequest = new MVCModels.RequestCategoryMasterModel();
            objRequest.Company_Code = companyCode;
            objRequest.Request_Category_Id = requestID;
            objRequest.Request_Category_Name = requestCategoryName;
            objRequest.Request_Category_Status = status;
            lstRequest.Add(objRequest);
            rowsAffected = _objDALMaster.UpdateRequestCategory(lstRequest);


            return rowsAffected;
        }
        #region Myprofile
        /// <summary>
        /// Get MyProfile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.EmployeeModel> GetMyProfileDetails(string companyCode, string userCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetMyProfileDetails(companyCode, userCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Update Employee Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="employeeCode"></param>
        /// <param name="mailId"></param>
        /// <returns></returns>
        public int UpdateEmployeeDetails(string companyCode, string employeeCode, string mailId)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.UpdateEmployeeDetails(companyCode, employeeCode, mailId);
            }
            catch
            {
                throw;
            }
        }

        #endregion Myprofile




        public int APIInsertCategory(string CategoryName, string status, string createdBy, string createdDate, string Description)
        {
            _objDALMaster = new DALMaster();
            List<APICategoryModel> lstAPICategory = new List<APICategoryModel>();
            int rowsAffected = 0;
            MVCModels.APICategoryModel objAPI = new MVCModels.APICategoryModel();
            objAPI.API_Category_Name = CategoryName;
            objAPI.API_Category_Status = status;
            objAPI.Created_By = createdBy;
            objAPI.Created_Date = createdDate;
            objAPI.API_Category_Description = Description;
            lstAPICategory.Add(objAPI);
            rowsAffected = _objDALMaster.APIInsertCategory(lstAPICategory, CategoryName);


            return rowsAffected;
        }

        public IEnumerable<APICategoryModel> GetAPICategoryDetail()
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAPICategoryDetail();
        }

        public int UpdateAPICategory(string CategoryName, string status, string createdBy, string createdDate, string description, string APIcategoryID)
        {
            _objDALMaster = new DALMaster();
            List<APICategoryModel> lstApiCat = new List<APICategoryModel>();
            int rowsAffected = 0;
            MVCModels.APICategoryModel objAPI = new MVCModels.APICategoryModel();

            objAPI.API_Category_Code = APIcategoryID;
            objAPI.API_Category_Name = CategoryName;
            objAPI.API_Category_Status = status;
            objAPI.API_Category_Description = description;
            objAPI.Created_By = createdBy;
            objAPI.Created_Date = createdDate;
            lstApiCat.Add(objAPI);
            rowsAffected = _objDALMaster.UpdateAPICategory(lstApiCat, CategoryName, APIcategoryID);


            return rowsAffected;
        }

        public IEnumerable<APICategoryModel> GetAPICategory()
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetAPICategory();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #region menu master
        /// <summary>
        /// Get All Menu Items
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>returns the list of menu items</returns>
        public IEnumerable<MVCModels.MenuMasterModel> GetMenuItems(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMenuItems(companyCode);
        }

        public IEnumerable<MVCModels.MenuMasterModel> GetAppMenuItems(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppMenuItems(companyCode);
        }
        /// <summary>
        /// get the menu items to fill the parent menu dropdown
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns>>returns the list of menu items</returns>
        public IEnumerable<MVCModels.MenuMasterModel> GetParentMenuItems(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetParentMenuItems(companyCode);
        }
        public IEnumerable<MVCModels.MenuMasterModel> GetAppParentMenuItems(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppParentMenuItems(companyCode);
        }

        public IEnumerable<MVCModels.MenuMasterModel> GetAppParentMenuItemsNew(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppParentMenuItemsNew(companyCode);
        }

        /// <summary>
        /// Get seleted menu details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="menuId"></param>
        /// <returns>returns the selected menu details</returns>
        public IEnumerable<MVCModels.MenuMasterModel> GetSelectedMenuDetails(string companyCode, string menuId)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSelectedMenuDetails(companyCode, menuId);
        }

        //App Menu Master
        public IEnumerable<MVCModels.MenuMasterModel> GetAppSelectedMenuDetails(string companyCode, string menuId)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppSelectedMenuDetails(companyCode, menuId);
        }

        /// <summary>
        /// Insert or update menu master
        /// </summary>
        /// <param name="lstMenuMaster"></param>
        /// <param name="mode"></param>
        /// <returns>returns the no of rows affected</returns>
        public int InsertMenuMaster(List<MVCModels.MenuMasterModel> lstMenuMaster, string mode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.InsertMenuMaster(lstMenuMaster, mode);
        }

        //App Menu Master Insert
        public int InsertAppMenuMaster(List<MVCModels.MenuMasterModel> lstMenuMaster, string mode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.InsertAppMenuMaster(lstMenuMaster, mode);
        }
        /// <summary>
        /// check menu url is already exist or not
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="menuurl"></param>
        /// <returns></returns>
        public IEnumerable<MenuMasterModel> CheckMenuUrl(string companyCode, string menuurl)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.CheckMenuUrl(companyCode, menuurl);
        }
        #endregion menu master

        public int InsertAPIService(string APICategoryCode, string ServiceId, string ServiceDescription, string ServiceType,
            string ServiceParamNos, string ServiceParams, string ExcelOutPutHeaders, string ServiceInternalSPName, string serviceTypeMappingClassName,
            string serviceName, string IsVisible)
        {
            _objDALMaster = new DALMaster();
            List<APIServiceModel> lstAPIService = new List<APIServiceModel>();
            int rowsAffected = 0;
            MVCModels.APIServiceModel objAPI = new MVCModels.APIServiceModel();
            objAPI.API_Category_Code = APICategoryCode;
            objAPI.ServiceId = ServiceId;
            objAPI.ServiceDescrn = ServiceDescription;
            objAPI.ServiceType = ServiceType;
            objAPI.ServiceParamNos = ServiceParamNos;
            objAPI.ServiceParams = ServiceParams;
            objAPI.ServiceOutputHeaders = ExcelOutPutHeaders;
            objAPI.ServiceInternalName = ServiceInternalSPName;
            objAPI.ServiceTypeMappingClassName = serviceTypeMappingClassName;
            objAPI.ServiceName = serviceName;
            objAPI.Is_Visible = IsVisible;
            lstAPIService.Add(objAPI);
            rowsAffected = _objDALMaster.InsertAPIService(lstAPIService, ServiceId);


            return rowsAffected;
        }


        //GetAPIServiceDetail
        public IEnumerable<APIServiceModel> GetAPIServiceDetail(string APIid)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAPIServiceDetail(APIid);
        }


        public int UpdateAPIService(string APICategoryCode, string ServiceId, string ServiceDescription, string ServiceType,
          string ServiceParamNos, string ServiceParams, string ExcelOutPutHeaders, string ServiceInternalSPName, string serviceTypeMappingClassName,
          string serviceName, string IsVisible, string apiID)
        {
            _objDALMaster = new DALMaster();
            List<APIServiceModel> lstAPIService = new List<APIServiceModel>();
            int rowsAffected = 0;
            MVCModels.APIServiceModel objAPI = new MVCModels.APIServiceModel();
            objAPI.API_Category_Code = APICategoryCode;
            objAPI.ServiceId = ServiceId;
            objAPI.ServiceDescrn = ServiceDescription;
            objAPI.ServiceType = ServiceType;
            objAPI.ServiceParamNos = ServiceParamNos;
            objAPI.ServiceParams = ServiceParams;
            objAPI.ServiceOutputHeaders = ExcelOutPutHeaders;
            objAPI.ServiceInternalName = ServiceInternalSPName;
            objAPI.ServiceTypeMappingClassName = serviceTypeMappingClassName;
            objAPI.ServiceName = serviceName;
            objAPI.Is_Visible = IsVisible;
            objAPI.API_ID = apiID;
            lstAPIService.Add(objAPI);
            rowsAffected = _objDALMaster.UpdateAPIService(lstAPIService, ServiceId, apiID);


            return rowsAffected;
        }

        public IEnumerable<APIServiceModel> GetAPIServiceID()
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetAPIServiceID();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int InsertAPIUIDef(string APIJson)
        {
            _objDALMaster = new DALMaster();
            APIUIModel objAPIUI = new APIUIModel();
            int rowsAffected = 0;
            MVCModels.APIServiceModel objAPI = new MVCModels.APIServiceModel();
            List<APIUIModel> APIUIDefModel = (List<APIUIModel>)JsonConvert.DeserializeObject(APIJson, typeof(List<APIUIModel>));
            rowsAffected = _objDALMaster.InsertAPIUIDef(APIUIDefModel);
            //APIUIDefModel.ForEach(x => x.Session_Key = "ssaas");

            return rowsAffected;
        }

        public IEnumerable<MVCModels.UserTypeModel> GetAPIUserTypeDetail(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAPIUserTypeDetail(companyCode);
        }
        public int InsertAPICompanyAccess(string APICompanyJson, string companyCode)
        {
            _objDALMaster = new DALMaster();
            CompanyAccessModel objAPIcomp = new CompanyAccessModel();
            int rowsAffected = 0;
            MVCModels.CompanyAccessModel objAPI = new MVCModels.CompanyAccessModel();
            List<CompanyAccessModel> lstAPICompanyAcess = (List<CompanyAccessModel>)JsonConvert.DeserializeObject(APICompanyJson, typeof(List<CompanyAccessModel>));
            lstAPICompanyAcess.ForEach(x => x.Company_Code = companyCode);
            rowsAffected = _objDALMaster.InsertAPICompanyAccess(lstAPICompanyAcess);

            //APIUIDefModel.ForEach(x => x.Session_Key = "ssaas");

            return rowsAffected;
        }


        public IEnumerable<CompanyAccessModel> GetAPIComapanyMapDetail(string APIServiceId, string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAPIComapanyMapDetail(APIServiceId, companyCode);
        }



        #region menu access
        /// <summary>
        /// Get menu access for selected user types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.UserTypeMenuAccessModel> GetUserTypeMenuAccess(string companyCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserTypeMenuAccess(companyCode, userTypeCode);
        }

        public IEnumerable<MVCModels.UserTypeAppMenuAccessModel> GetAppUserTypeMenuAccess(string companyCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppUserTypeMenuAccess(companyCode, userTypeCode);
        }
        /// <summary>
        /// Insert/Update user type menu access
        /// </summary>
        /// <param name="lstInsertMenu"></param>
        /// <param name="lstUpdateMenu"></param>
        /// <param name="userTypeCode"></param>
        /// <param name="companyCode"></param>
        /// <returns>returns the no of rows affected</returns>
        public int InsertMenuAccess(List<MVCModels.UserTypeMenuAccessModel> lstInsertMenu, List<MVCModels.UserTypeMenuAccessModel> lstUpdateMenu,
                      string userTypeCode, string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.InsertMenuAccess(lstInsertMenu, lstUpdateMenu, userTypeCode, companyCode);
        }

        public int AppInsertMenuAccess(List<MVCModels.UserTypeAppMenuAccessModel> lstAppInsertMenu,
                      string userTypeCode, string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.AppInsertMenuAccess(lstAppInsertMenu, userTypeCode, companyCode);
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetMenuMappedUserTypes(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMenuMappedUserTypes(companyCode);
        }

        public int CopyMenuAccess(List<MVCModels.HiDoctor_Master.UserTypeModel> lstUserTypes, string sourceUserTypeCode, string companyCode,
            string updatedBy, string updatedDate)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.CopyMenuAccess(lstUserTypes, sourceUserTypeCode, companyCode, updatedBy, updatedDate);
        }
        /// <summary>
        ///  get user type menu access log report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.UserTypeMenuAccessModel> GetUserTypeMenuAccessLog(string companyCode, string fromDate,
                string toDate, string userTypeCodes)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserTypeMenuAccessLog(companyCode, fromDate, toDate, userTypeCodes);
        }
        /// <summary>
        /// Get privilege mapping log report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <param name="userTypeCodes"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserTypePrivilegeMappingModel> GetPrivilegeLogReport(string companyCode,
        string fromDate, string toDate, string userTypeCodes)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetPrivilegeLogReport(companyCode, fromDate, toDate, userTypeCodes);
        }
        #endregion menu access

        #region - Menu access for mobile
        /// <summary>
        /// Get Menu access for mobile
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public List<MenuMasterModel> GetMenuaccessforMobile(string companyCode, string userTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMenuaccessforMobile(companyCode, userTypeCode);
        }
        #endregion - Menu access for mobile


        #region UserProduct Mapping
        /// <summary>
        /// Get User Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<DivisionUserProducts> GetUserTypeNamesforProductMapping(string companyCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetUserTypeNamesforProductMapping(companyCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Sample and Nonsample Products
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userTypeCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Master.ProductandSampleModel> GetProductandSample(string companyCode, string userTypeCode)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetProductandSample(companyCode, userTypeCode);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get User Product Mapping details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="productType"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserProductaMappingModel> GetUserProductMapping(string companyCode, string productType)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetUserProductMapping(companyCode, productType);
            }
            catch
            {
                throw;
            }
        }
        public IEnumerable<MVCModels.HiDoctor_Master.UserProductModel> GetAssignedProductsforUserProdcut(string companyCode, string userCodes)
        {
            try
            {
                _objDALMaster = new DALMaster();
                return _objDALMaster.GetAssignedProductsforUserProdcut(companyCode, userCodes);
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Insert User Product
        /// </summary>
        /// <param name="lstUserProduct"></param>
        /// <returns></returns>
        public int InsertUserProduct(string comapnyCode, string userCodes, string productCodes, string effectiveFrom)
        {
            try
            {
                _objDALMaster = new DALMaster();
                List<MVCModels.HiDoctor_Master.UserProductModel> lstUserProduct = new List<MVCModels.HiDoctor_Master.UserProductModel>();
                int rowsAffected = 0;

                var assignedProduct = GetAssignedProductsforUserProdcut(comapnyCode, userCodes);
                string[] userCode = userCodes.Split('^');
                string[] productCode = productCodes.Split('^');

                foreach (var user in userCode)
                {
                    foreach (var product in productCode)
                    {
                        MVCModels.HiDoctor_Master.UserProductModel _objUserproduct = new MVCModels.HiDoctor_Master.UserProductModel();
                        if (!string.IsNullOrEmpty(product) && !string.IsNullOrEmpty(user))
                        {
                            if (!assignedProduct.Any(a => a.User_Code == user && a.Product_Code == product))
                            {

                                _objUserproduct.Product_Code = product;
                                _objUserproduct.User_Code = user;
                                _objUserproduct.Company_Code = comapnyCode;
                                _objUserproduct.Current_Stock = "0";
                                _objUserproduct.Effective_From = effectiveFrom;
                                lstUserProduct.Add(_objUserproduct);
                            }
                        }
                    }
                }
                rowsAffected = _objDALMaster.InsertUserProduct(lstUserProduct);
                return rowsAffected;
            }
            catch
            {
                throw;
            }
        }
        #endregion UserProduct Mapping

        public DataSet GetInwardExcelDataUserBased(string company_Code, string userJson, string productJson)
        {
            IEnumerable<DivisionUserProducts> IlstUsers = (IEnumerable<DivisionUserProducts>)JsonConvert.DeserializeObject(userJson, typeof(List<DivisionUserProducts>));
            IEnumerable<DivisionUserProducts> IlstProducts = (IEnumerable<DivisionUserProducts>)JsonConvert.DeserializeObject(productJson, typeof(List<DivisionUserProducts>));

            _objDALMaster = new DALMaster();
            return _objDALMaster.GetInwardExcelDataUserBased(company_Code, IlstUsers, IlstProducts);
        }

        public DataSet GetUnmappedDivisionProducts(string company_Code, string division_code, string productTypeCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUnMappedDivisionProducts(company_Code, division_code, productTypeCode);
        }
        #region Config Settings
        public string InsetConfigSetings(string companyCode, string configName, string configValue, string possibleValue, string configType, string mode, string confId)
        {
            string result = string.Empty;
            DALMaster objMaster = new DALMaster();
            bool isTrue = false;
            try
            {

                isTrue = objMaster.CheckConfigSettings(companyCode, configName, mode, configValue);
                if (!isTrue)
                {
                    isTrue = objMaster.InsertConfigSettings(companyCode, configName, configValue, possibleValue, configType, mode, confId);
                    if (isTrue && mode == "INSERT")
                    {
                        result = "SUCCESS:Saved Successful";
                    }
                    if (isTrue && mode == "EDIT")
                    {
                        result = "SUCCESS:Edited Successful";
                    }
                }
                else
                {
                    result = "ERROR:" + configName + " already exists config name ";
                }

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex, dicContext);
            }
            return result;


        }

        public IEnumerable<MVCModels.ConfigSettingsModel> GetConfigDetails(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetConfigDetails(companyCode);
        }

        public IEnumerable<MVCModels.ConfigSettingsModel> GetSelectedConfigDetails(string companyCode, string configId)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSelectedConfigDetails(companyCode, configId);
        }
        #endregion Connfig Settings

        #region App Settings

        public IEnumerable<MVCModels.CompanyAppMappingModel> GetCompanyAppMappedDetail(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetCompanyAppMappedDetail(companyCode);
        }
        public IEnumerable<MVCModels.CompanyAppMappingModel> GetAppDetail()
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppDetail();
        }

        public string UpdateCompanyApp(string companyCode, string companyApp, string updatedby)
        {
            companyApp = companyApp.TrimEnd('$');
            string companyNum = companyCode.Substring(3, 8);
            string[] companyAppDetails = companyApp.Split('$');
            bool isTrue = false;
            string result = string.Empty;
            List<MVCModels.CompanyAppMappingModel> lstCompanyDetail = new List<MVCModels.CompanyAppMappingModel>();
            DALMaster _objMast = new DALMaster();

            isTrue = _objMast.InsertCompanyAppDelete(companyCode);
            if (companyApp != "")
            {
                MVCModels.CompanyAppMappingModel lstDetails;
                foreach (var appid in companyAppDetails)
                {
                    lstDetails = new MVCModels.CompanyAppMappingModel();
                    lstDetails.Company_Code = companyCode;
                    lstDetails.Company_Code_Num = Convert.ToInt32(companyNum).ToString();
                    lstDetails.App_Id = appid.Split('|')[0];
                    lstDetails.App_Suite_Id = appid.Split('|')[1];
                    lstDetails.App_Name = appid.Split('|')[2]; ;
                    lstDetails.Platform = appid.Split('|')[3]; ;
                    lstDetails.Last_Updated_User_Code = updatedby;
                    lstDetails.Last_Updated_DateTime = DateTime.Now.ToString();
                    lstDetails.Company_App_Mapping_Status = "1";
                    lstCompanyDetail.Add(lstDetails);
                }
                isTrue = _objMast.InsertCompanyApp(companyCode, lstCompanyDetail);
            }

            if (isTrue)
            {
                result = "Saved successfully";
            }
            else
            {
                result = "Insertion Failed ";
            }
            return result;
        }

        public string InsertUserAppMapping(string companyCode, string appDetails, string userCode, string ef, string et)
        {
            CurrentInfo _objCurr = new CurrentInfo();
            string companyNum = companyCode.Substring(3, 8);
            string[] userCodes = userCode.Split(',');
            bool isTrue = false;
            string result = string.Empty;
            string appId = string.Empty;
            string appName = string.Empty;
            string AppsuiteId = string.Empty;
            string platform = string.Empty;
            string userId = string.Empty;
            string modifiedby = string.Empty;


            appId = appDetails.Split('|')[0];
            appName = appDetails.Split('|')[1];
            AppsuiteId = appDetails.Split('|')[2];
            platform = appDetails.Split('|')[3];
            DALMaster _objMast = new DALMaster();
            List<MVCModels.UserAppMappingModel> lstmappedApp = new List<MVCModels.UserAppMappingModel>();
            lstmappedApp = (List<MVCModels.UserAppMappingModel>)(_objMast.GetAppMappedUser(_objCurr.GetCompanyCode(), _objCurr.GetUserCode(), appId)).ToList();
            modifiedby = _objCurr.GetUserCode();
            modifiedby = modifiedby.Substring(3, 8);

            List<MVCModels.UserAppMappingModel> lstCompanyDetail = new List<MVCModels.UserAppMappingModel>();

            lstmappedApp.ForEach(c =>
            {
                c.Modified_DateTime = DateTime.Now.ToString();
                c.Modified_By = Convert.ToInt32(modifiedby).ToString();
            });


            if (userCode != "" && appDetails != "")
            {
                MVCModels.UserAppMappingModel lstDetails;
                foreach (var userList in userCodes)
                {
                    userId = userList.Substring(3, 8);
                    lstDetails = new MVCModels.UserAppMappingModel();
                    lstDetails.Company_Code = companyCode;
                    lstDetails.Company_Id = Convert.ToInt32(companyNum).ToString();
                    lstDetails.User_Id = Convert.ToInt32(userId).ToString();

                    lstDetails.App_Suite_Id = AppsuiteId.ToString();
                    lstDetails.App_Id = appId.ToString();
                    lstDetails.Effective_From = ef.ToString();
                    lstDetails.Effective_To = et.ToString();
                    lstDetails.App_User_Mapper_Status = "1";
                    lstDetails.User_Code = userList.ToString();
                    lstDetails.App_Name = appName;
                    lstDetails.Platform = platform.ToString();
                    lstDetails.Modified_DateTime = DateTime.Now.ToString();
                    lstDetails.Modified_By = Convert.ToInt32(modifiedby).ToString();
                    lstCompanyDetail.Add(lstDetails);
                }

            }
            isTrue = _objMast.InsertUserMappingApp(companyCode, lstCompanyDetail, lstmappedApp);
            if (isTrue)
            {
                result = "Saved successfully";
            }
            else
            {
                result = "Insertion Failed ";
            }
            return result;
        }
        public IEnumerable<MVCModels.UserAppMappingModel> GetAppMappedUser(string companyCode, string userCode, string appId)
        {
            DALMaster _objMast = new DALMaster();
            return _objMast.GetAppMappedUser(companyCode, userCode, appId);
        }
        #endregion App settings

        #region - My Documents
        /// <summary>
        /// Get Documents Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.MyDocumentTypeModel> GetMyDocumentstoDownload(string companyCode, string userCode, string regionCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMyDocumentstoDownload(companyCode, userCode, regionCode);
        }
        //// <summary>
        /// Get URl by document ID
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="docTypeid"></param>
        /// <returns></returns>
        public string GetDocumentbyDocId(string companyCode, string userCode, string docId)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetDocumentbyDocId(companyCode, userCode, docId);
        }
        /// <summary>
        /// Downloaded date and name while downloading
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="docTypeId"></param>
        /// <param name="downloadDate"></param>
        /// <param name="downloadBy"></param>
        /// <returns></returns>
        public int UpdateMyDocMentforDownload(String companyCode, string userCode, string docId, string downloadDate, string downloadBy)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.UpdateMyDocMentforDownload(companyCode, userCode, docId, downloadDate, downloadBy);
        }

        #region File Upload
        /// <summary>
        /// Get Document Types
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.MyDocumentsModel> GetMyDocTypes(string companyCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetMyDocTypes(companyCode);
        }
        /// <summary>
        /// insert chunk files
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="documentTypeCode"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="documentName"></param>
        /// <param name="uploadFileURL"></param>
        /// <param name="uploadFileName"></param>
        /// <param name="uploadedDate"></param>
        /// <returns></returns>
        public int InsertChunkFiles(List<MVCModels.MyDocumentFileUploads> lstFiles)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.InsertChunkFiles(lstFiles);
        }
        /// <summary>
        /// Get Uploaded Fiels count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public List<MVCModels.MyDocumentFileUploads> GetUploadedFilesCount(string companyCode, string userCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUploadedFilesCount(companyCode, userCode);
        }
        /// <summary>
        /// Get Invalid Files
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="docUploadId"></param>
        /// <returns></returns>
        public List<MVCModels.InvalidFiles> GetInvalidFiles(string companyCode, string docUploadId)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetInvalidFiles(companyCode, docUploadId);
        }
        #endregion File Upload
        #endregion - My Documents

        public int GetAppliedDCRChildUsersCount(string companyCode, string userCode, string currentDate)
        {
            DALMaster objDALMaster = new DALMaster();
            return objDALMaster.GetAppliedDCRChildUsersCount(companyCode, userCode, currentDate);
        }
        public int GetCurrentMonthAppliedDCRChildUsersCount(string companyCode, string userCode, string month, string year)
        {
            DALMaster objDALMaster = new DALMaster();
            return objDALMaster.GetCurrentMonthAppliedDCRChildUsersCount(companyCode, userCode, month, year);
        }

        public int GetCustomerMasterDupicationvalue(string companyCode, string regionCode, string mobileNo, string regNo, string configValue)
        {
            DALMaster objDALMaster = new DALMaster();
            return objDALMaster.GetCustomerMasterDupicationvalue(companyCode, regionCode, mobileNo, regNo, configValue);
        }

        public IEnumerable<User_Employeedetails> GetaluminiUserDetail(string companyCode, string userCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetaluminiUserDetail(companyCode, userCode);
        }

        public List<MVCModels.HiDoctor_Master.SingleActivityPerDayValue> GetSingleActivityPerDayValue(string Company_Code, string User_Type)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSingleActivityPerDayValue(Company_Code, User_Type);
        }

        public string UpdateProfileDetails(string companyCode, string userCode, string Mail, string Mobile, string phone, string Add1, string Add2, string Add3, int City, int State, int Pincode,string Bloodgroup,string Employeephoto)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.UpdateProfileDetails(companyCode, userCode, Mail, Mobile, phone, Add1, Add2, Add3, City, State, Pincode, Bloodgroup, Employeephoto);
        }

        #region  Inward Acknolodgement

        public IEnumerable<MVCModels.InwardAckModel> GetInwardAck(string companyCode, string userCode)
        {
            _objDALMaster = new DALMaster();
            //List<MVCModels.InwardAck> lstInwardAck = 
            InwardAckWrap wrap = _objDALMaster.GetInwardAck(companyCode, userCode);
            var lstChellanNo = wrap.ProductInfo
                               .GroupBy(p => p.Delivery_Challan_Number)
                               .Select(g => g.First()).ToList();
            List<MVCModels.InwardAckModel> lstInwardAckDetails = new List<MVCModels.InwardAckModel>();

            for (int i = 0; i < lstChellanNo.Count; i++)
            {
                InwardAckModel objInwardAck = new InwardAckModel();
                objInwardAck.Delivery_Challan_Number = lstChellanNo[i].Delivery_Challan_Number;
                objInwardAck.Inward_Upload_Actual_Date = lstChellanNo[i].Inward_Upload_Actual_Date;
                objInwardAck.lstInwardAck = wrap.ProductInfo.Where(x => x.Delivery_Challan_Number == lstChellanNo[i].Delivery_Challan_Number).ToList();
                objInwardAck.lstInwardAckBatch = wrap.BatchInfo.Where(x => x.Delivery_Challan_Number == lstChellanNo[i].Delivery_Challan_Number).ToList();
                lstInwardAckDetails.Add(objInwardAck);
            }

            return lstInwardAckDetails;

        }

        public string SaveInwardAck(string companyCode, string userCode, List<InwardAck> lstInwardAck)
        {
            _objDALMaster = new DALMaster();
            var dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));
            dt.Columns.Add("Header_Id", typeof(int));
            dt.Columns.Add("Details_Id", typeof(int));
            dt.Columns.Add("Quantity_Type", typeof(string));
            dt.Columns.Add("Uploaded_Qty", typeof(int));
            dt.Columns.Add("Total_Acknowledged_Qty", typeof(int));
            dt.Columns.Add("Current_Stock", typeof(int));
            dt.Columns.Add("Inward_Actual_Date ", typeof(DateTime));
            dt.Columns.Add("Inward_Entered_Date", typeof(DateTime));
            dt.Columns.Add("Company_Code", typeof(string));
            dt.Columns.Add("User_Code", typeof(string));
            dt.Columns.Add("Product_Code", typeof(string));
            dt.Columns.Add("Batch_Number", typeof(string));
            dt.Columns.Add("Delivery_Challan_Number", typeof(string));
            dt.Columns.Add("Remarks", typeof(string));

            int i = 1;
            foreach (var lstData in lstInwardAck)
            {
                dt.Rows.Add(i, lstData.Header_Id, lstData.Details_Id, "ACK", lstData.Uploaded_Qty, lstData.Total_Acknowledged_Qty, 0, lstData.Inward_Actual_Date, DateTime.Now.Date, companyCode, userCode, lstData.Product_Code, lstData.Batch_Number, lstData.Delivery_Challan_Number, lstData.Remarks);
                i++;
            }

            return _objDALMaster.SaveInwardAck(companyCode, userCode, dt);
        }

        #endregion
        #region Inward Adjustment
        public MVCModels.CombinedDeliveryChallanInfo GetUserDeliveryChallan(string UserCode, int Page_Number, int Page_Size)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserDeliveryChallan(UserCode, Page_Number, Page_Size);
        }
        public DCInfoWrap GetDeliveryChallanInfo(string DCSelect, string UserCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetDeliveryChallanInfo(DCSelect, UserCode);
        }
        public string InsertAdjustment(List<InwardAdj> AdjLst)
        {
            _objDALMaster = new DALMaster();
            var dt = new DataTable();
            dt.Columns.Add("Details_Id", typeof(int));
            dt.Columns.Add("Delivery_Challan", typeof(string));
            dt.Columns.Add("Product_Code", typeof(string));
            dt.Columns.Add("Batch_Number", typeof(string));
            dt.Columns.Add("AdjustingQty", typeof(int));
            dt.Columns.Add("Quantity_Type", typeof(string));
            dt.Columns.Add("InwardActualDate", typeof(DateTime));
            dt.Columns.Add("Remarks", typeof(string));
            foreach (var lstData in AdjLst)
            {
                dt.Rows.Add(lstData.Details_Id, lstData.Delivery_Challan, lstData.Product_Code, lstData.Batch_Number, lstData.AdjustingQty, lstData.Quantity_Type, DateTime.ParseExact(lstData.InwardActualDate.ToString(), "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture), lstData.Remarks);
            }
            return _objDALMaster.InsertAdjustment(dt);
        }

        public InwardRemarksModel GetRemarksHistory(int Header_Id)
        {
            InwardRemarksModel ObjInward = null;
            try
            {
                DALMaster _ObjDALMaster = new DALMaster();
                ObjInward = _ObjDALMaster.GetRemarksHistory(Header_Id);
            }
            catch (Exception ex)
            {
                throw;
            }
            return ObjInward;
        }
        #endregion
        #region SFCExtendedDetails
        public List<SFCRegionModel> GetSFCExtendedDetails(string region_code, DateTime dcr_Date, int distance_Fare_Code, string company_code)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSFCExtendedDetails(region_code, dcr_Date, distance_Fare_Code, company_code);
        }
        public List<SFCRegionModel> GetRegionSFC(string region_code, DateTime dcr_Date, string company_code)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetRegionSFC(region_code, dcr_Date, company_code);
        }
        public int SaveExtendSFC(int distance_Fare_Code, int sfc_Version_No, DateTime dcr_Date, string company_code, string remark, string userCode, int sfc_Extend_Count)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.SaveExtendSFC(distance_Fare_Code, sfc_Version_No, dcr_Date, company_code, remark, userCode, sfc_Extend_Count);
        }
        public int DisableSFCCount(int sfc_Extend_Id)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.DisableSFCCount(sfc_Extend_Id);
        }
        #endregion

        public List<UserProducts> GetUserProducts(string User_Code)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetUserProducts(User_Code);
        }

        public string SaveUserProduct(string User_Code, string Product_Code, int minCount, int maxCount, string User_Product_Status)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.SaveUserProduct(User_Code, Product_Code, minCount, maxCount, User_Product_Status);
        }

        public bool GetRefKey_1(string companyCode, string refKey, string Regionclassificationname, string mode)
        {
            bool result = false;
            try
            {
                _objDALMaster = new DALMaster();
                result = _objDALMaster.GetRefKey_1(companyCode, refKey, Regionclassificationname, mode);
                return result;
            }
            catch
            {
                throw;
            }
        }


        public bool GetRefKey_2(string companyCode, string refKey, string Regionclassificationname, string mode)
        {
            bool result = false;
            try
            {
                _objDALMaster = new DALMaster();
                result = _objDALMaster.GetRefKey_2(companyCode, refKey, Regionclassificationname, mode);
                return result;
            }
            catch
            {
                throw;
            }
        }

        //To get the first DCR_ActualDate 
        public List<UserModel> GetHiDoctorActualDate(string companyCode, List<MVCModels.HiDoctor_Master.Usercodelst> lstUsers)
        {
            List<UserModel> lstActDate = null;
            try
            {
                DALMaster objlstActDate = new DALMaster();
                lstActDate = objlstActDate.GetHiDoctorActualDate(companyCode, lstUsers);

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstActDate;
        }

        public KI_RegionTypeModel GetKIRegionType(string CompanyCode, string RegionTypeName)
        {
            DALMaster objMast = new DALMaster();
            return objMast.GetKIRegionType(CompanyCode, RegionTypeName);
        }

        public KI_UserTypeModel GetKIUserType(string CompanyCode, string UserTypeName)
        {
            DALMaster objMast = new DALMaster();
            return objMast.GetKIUserType(CompanyCode, UserTypeName);
        }

        public string InsertDFCExcelBulkUpload(string subDomain, string companyCode, string guid, System.Web.HttpPostedFileBase postedFile, string uploadedBy)
        {
            string result = "";
            try
            {
                _objDALMaster = new DALMaster();
                //var package = new ExcelPackage(postedFile.InputStream);
                //DataTable dt = package.ToDataTable();
                DataTable dt = ConvertDFCExcelToDataTable(postedFile);
                if (dt == null)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else if (dt.Rows.Count == 0)
                {
                    result = "ERROR:NO DATA found in the uploaded excel file";
                }
                else
                {
                    dt.Columns.Add("Company_Code", typeof(String));
                    //dt.Columns.Add("Region_Code", typeof(String));
                    dt.Columns.Add("GUID", typeof(String));
                    dt.Columns.Add("Status", typeof(String));
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        dt.Rows[i]["Company_Code"] = companyCode;
                        //dt.Rows[i]["Region_Code"] = Regioncode;
                        dt.Rows[i]["GUID"] = guid.ToString();
                        dt.Rows[i]["Status"] = "PROCESSING";
                    }
                    result = _objDALMaster.ExcelBulkDFCInsert(companyCode, dt, subDomain);
                    if (result == "SUCCESS")
                    {
                        result = _objDALMaster.InsertExcelBulkDFCStagingToMaster(subDomain, companyCode, guid, _dfcExcelTemplateFileName, uploadedBy, "DFC_UPLOAD");
                    }
                    else
                    {
                        result = "ERROR:Instructions are not followed." + result;
                    }
                }
            }
            catch (Exception ex)
            {
                result = "ERROR:Instructions not followed." + ex.Message;
            }
            return result;
        }

        private DataTable ConvertDFCExcelToDataTable(System.Web.HttpPostedFileBase postedFile)
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            IFileProvider fileProvider = new FileSystemProvider();
            IExcelFactory excelFactory = new ExcelFactory();
            CurrentInfo objCurInfo = new CurrentInfo();
            string containerName = objCurInfo.GetCompanyCode().ToLower();
            string fileName = postedFile.FileName;
            string[] excelRetrieveColumns = new string[] { "*" };

            _dfcExcelTemplateFileName = fileProvider.GetFilePathToSave(UPLOAD_PATH_KEY_NAME, fileName);
            string whereQuery = " LEN(User_Type_Name) >0 ";
            DataControl.Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();
            DataControl.Abstraction.IFileProvider objPathProv = new DataControl.Impl.FileSystemProvider();

            string accKey = objPathProv.GetConfigValue("UPLOADEDFILEBLOBACCKEY");

            string blobURL = objAzureUpload.PutAzureBlobStorage(postedFile.InputStream, postedFile.FileName, accKey, containerName);

            System.IO.Stream stream = objAzureUpload.AzureblockDownload(postedFile.FileName, accKey, containerName);
            DataTable dt = new DataTable();
            var package = new ExcelPackage(postedFile.InputStream);
            dt = package.ToDataTable();
            return dt;
        }

        public IEnumerable<MVCModels.Employeedetails> GetSelectedKennect(string companyCode, string userCode)
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetSelectedKennect(companyCode, userCode);
        }

        public string ExcelBulkLeaveInsertIntoStaging(string companyCode, DataTable dt, string subDomain)
        {
            _objDALMaster = new DALMaster();
            try
            {
                return _objDALMaster.ExcelBulkLeaveInsertIntoStaging(companyCode, dt, subDomain);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public string ExcelBulkLeaveInsertFromStagingToMaster(string subDomain, string companyCode, string guid, string fileName, string Login_User_Code, string uploadedBy, string inward_Requestform, string inward_RequestDate, string inward_RequestReason, string bpType)
        {
            _objDALMaster = new DALMaster();
            try
            {
                return _objDALMaster.ExcelBulkLeaveInsertFromStagingToMaster(subDomain, companyCode, guid, fileName, Login_User_Code, uploadedBy, inward_Requestform, inward_RequestDate, inward_RequestReason, bpType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<MVCModels.AppMenuParams> GetAppParams()
        {
            _objDALMaster = new DALMaster();
            return _objDALMaster.GetAppParams();
        }
    }

}
