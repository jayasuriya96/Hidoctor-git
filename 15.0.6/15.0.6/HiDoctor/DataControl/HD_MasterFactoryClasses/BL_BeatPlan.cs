using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_BeatPlan
    {

        DAL_BeatPlan _objBeat = new DAL_BeatPlan();

        #region MyRegion
        public List<WorkCategoryModel> GetAllWorkCategories(string companyCode)
        {
            List<WorkCategoryModel> lstWorkCategories = null;
            try
            {
                lstWorkCategories = _objBeat.GetAllWorkCategories(companyCode);

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstWorkCategories;
        }

        public List<WorkAreaModel> GetAllWorkAreas(string companyCode, string regionCode,string workCategoryCode,int sfcValidation)
        {
            List<WorkAreaModel> lstWorkAreas = null;
            try
            {
                lstWorkAreas = _objBeat.GetAllWorkAreas(companyCode, regionCode, workCategoryCode,sfcValidation);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            return lstWorkAreas;
        }
        public List<UserDetailsModel> GetUserDetails(string companyCode, string regionCode)
        {
            List<UserDetailsModel> lstUserDetails = null;
            try
            {
                lstUserDetails = _objBeat.GetUserDetails(companyCode, regionCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstUserDetails;
        }
        public List<PrivilegeDetailsModel> GetUserTypePrivileges(string companyCode, string regionCode, string userCode, string userTypeCode)
        {
            List<PrivilegeDetailsModel> lstPrivileges = null;
            try
            {
                lstPrivileges = _objBeat.GetUserTypePrivileges(companyCode, regionCode, userCode, userTypeCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return lstPrivileges;
        }
        public List<SFCDetailsModel> GetSFCDetails(string companyCode, string regionCode)
        {
            List<SFCDetailsModel> lstSFCs = null;
            try
            {
                lstSFCs = _objBeat.GetSFCDetails(companyCode, regionCode);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstSFCs;
        }
        public OutPutJsonBeatModel InsertBeatPlanDetails(string companyCode, string regionCode, int CompanyId, BeatPlanModel _ObjBeatData,int Weeknumber,string Weekday)
        {
            OutPutJsonBeatModel result = new OutPutJsonBeatModel();
            try
            {
                DataTable dtSFC = new DataTable();
                dtSFC.Columns.Add("Company_Code", typeof(string));
                dtSFC.Columns.Add("Company_Id", typeof(int));
                dtSFC.Columns.Add("Region_Code", typeof(string));
                dtSFC.Columns.Add("From_Region_Name", typeof(string));
                dtSFC.Columns.Add("To_Region_Name", typeof(string));
                dtSFC.Columns.Add("Distance_Fare_Code", typeof(string));
                dtSFC.Columns.Add("Route_Way", typeof(string));
                dtSFC.Columns.Add("Travel_Mode", typeof(string));
                dtSFC.Columns.Add("Created_By", typeof(string));
                if (_ObjBeatData.lst_SFCDetails != null && _ObjBeatData.lst_SFCDetails.Count > 0)
                {
                    for (int i = 0; i < _ObjBeatData.lst_SFCDetails.Count; i++)
                    {
                        dtSFC.Rows.Add(companyCode, CompanyId, _ObjBeatData.lst_SFCDetails[i].Region_Code, _ObjBeatData.lst_SFCDetails[i].From_Region_Name,
                            _ObjBeatData.lst_SFCDetails[i].To_Region_Name, _ObjBeatData.lst_SFCDetails[i].Distance_Fare_Code,
                           _ObjBeatData.lst_SFCDetails[i].Route_Way, _ObjBeatData.lst_SFCDetails[i].Travel_Mode, _ObjBeatData.lst_SFCDetails[i].Created_By);
                    }
                }

                DataTable dtWorkArea = new DataTable();
                dtWorkArea.Columns.Add("Company_Code", typeof(string));
                dtWorkArea.Columns.Add("Company_Id", typeof(string));
                dtWorkArea.Columns.Add("Work_Area_Name", typeof(string));
                dtWorkArea.Columns.Add("Region_Code", typeof(string));
                dtWorkArea.Columns.Add("Created_By", typeof(string));
                if (_ObjBeatData.lst_WorkArea != null && _ObjBeatData.lst_WorkArea.Count > 0)
                {
                    for (int i = 0; i < _ObjBeatData.lst_WorkArea.Count; i++)
                    {
                        dtWorkArea.Rows.Add(companyCode, CompanyId, _ObjBeatData.lst_WorkArea[i].Work_Area, _ObjBeatData.lst_WorkArea[i].Region_Code,
                            _ObjBeatData.lst_WorkArea[i].Created_By);
                    }
                }
                if (_ObjBeatData.Mode.ToUpper() == "INSERT")
                {
                    result = _objBeat.InsertBeatPlanDetails(companyCode, regionCode, _ObjBeatData, dtSFC, dtWorkArea, Weeknumber, Weekday);

                }
                else
                {
                    result = _objBeat.UpdateBeatPlanDetails(companyCode, regionCode, _ObjBeatData, dtSFC, dtWorkArea, Weeknumber, Weekday);

                }


            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }
        public List<BeatPlanModel> GetBeatPlanDetails(string companyCode, string regionCode, string beatStatus)
        {
            List<BeatPlanModel> lstBeatHeaderDetails = null;
            try
            {
                lstBeatHeaderDetails = _objBeat.GetBeatPlanDetails(companyCode, regionCode, beatStatus);

            }
            catch (Exception ex)
            {

                throw;
            }
            return lstBeatHeaderDetails;
        }
        public OutPutJsonBeatModel UpdateApproveorUnApproveBeat(string companyCode, int companyId, string regionCode, List<BeatPlanModel> lstBeatApprorUnAppr)
        {
            OutPutJsonBeatModel result = new OutPutJsonBeatModel();
            try
            {
                DataTable dtApprorUnAppr = new DataTable();
                dtApprorUnAppr.Columns.Add("Company_Code", typeof(string));
                dtApprorUnAppr.Columns.Add("Company_Id", typeof(int));
                dtApprorUnAppr.Columns.Add("Region_Code", typeof(string));
                dtApprorUnAppr.Columns.Add("Beat_Code", typeof(string));
                dtApprorUnAppr.Columns.Add("Beat_Status", typeof(int));
                dtApprorUnAppr.Columns.Add("Remarks", typeof(string));
                dtApprorUnAppr.Columns.Add("Created_By", typeof(string));
                if (lstBeatApprorUnAppr != null && lstBeatApprorUnAppr.Count > 0)
                {
                    for (int i = 0; i < lstBeatApprorUnAppr.Count; i++)
                    {
                        dtApprorUnAppr.Rows.Add(companyCode, companyId, lstBeatApprorUnAppr[i].Region_Code, lstBeatApprorUnAppr[i].Beat_Code,
                            lstBeatApprorUnAppr[i].Beat_Status, lstBeatApprorUnAppr[i].Remarks, lstBeatApprorUnAppr[i].Created_By);
                    }
                }
                result = _objBeat.UpdateApproveorUnApproveBeat(companyCode, companyId, regionCode, lstBeatApprorUnAppr, dtApprorUnAppr);
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;

        }
        public List<UserDetailsModel> GetRegionDetails(string companyCode, string regionCode)
        {
            List<UserDetailsModel> lstRegionDetails = null;
            try
            {
                lstRegionDetails = _objBeat.GetRegionDetails(companyCode, regionCode);

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstRegionDetails;

        }
        public List<BeatPlanModel> GetApprovedBeatsByRegion(string companyCode, string regionCode)
        {
            List<BeatPlanModel> lstBeatDetails = null;
            try
            {
                lstBeatDetails = _objBeat.GetApprovedBeatsByRegion(companyCode, regionCode);

            }
            catch (Exception ex)
            {
                throw;
            }
            return lstBeatDetails;

        }

        public List<dynamic> GetAllMasterandMappedDataByRegion(string companyCode, MasterDataParamModel _objParamData)
        {
            List<dynamic> lstMasterData = new List<dynamic>();
            try
            {
                lstMasterData = _objBeat.GetAllMasterandMappedDataByRegion(companyCode, _objParamData);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstMasterData;
        }

        public OutPutJsonBeatModel InsertBeatToMasterDataTagging(string companyCode, List<MasterDataTaggedModel> lstTaggedData)
        {
            OutPutJsonBeatModel result = new OutPutJsonBeatModel();
            try
            {
                DataTable dtTaggedData = new DataTable();
                dtTaggedData.Columns.Add("Company_Code", typeof(string));
                dtTaggedData.Columns.Add("Company_Id", typeof(int));
                dtTaggedData.Columns.Add("Region_Code", typeof(string));
                dtTaggedData.Columns.Add("Beat_Code", typeof(string));
                dtTaggedData.Columns.Add("Customer_Code", typeof(string));
                dtTaggedData.Columns.Add("Customer_Entity_Type", typeof(string));
                dtTaggedData.Columns.Add("Created_By", typeof(string));
                dtTaggedData.Columns.Add("Doctor_Name", typeof(string));
                dtTaggedData.Columns.Add("MappedStatus", typeof(int));
                dtTaggedData.Columns.Add("Mapping_Status", typeof(string));

                if (lstTaggedData != null && lstTaggedData.Count > 0)
                {
                    for (int i = 0; i < lstTaggedData.Count; i++)
                    {
                        dtTaggedData.Rows.Add(lstTaggedData[i].Company_Code, lstTaggedData[i].Company_Id, lstTaggedData[i].Region_Code, lstTaggedData[i].Beat_Code,
                            lstTaggedData[i].Customer_Code, lstTaggedData[i].Customer_Entity_Type, lstTaggedData[i].Created_By, lstTaggedData[i].Doctor_Name, lstTaggedData[i].MappedStatus,
                            lstTaggedData[i].Mapping_Status);

                    }
                }
                result = _objBeat.InsertBeatToMasterDataTagging(companyCode, dtTaggedData, lstTaggedData);
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }

        public PieChartWrapperModel GetAllPieChartDetails(string companyCode, string regionCode,string onceormultiplePriv)
        {
            PieChartWrapperModel _objPieChartDetails = new PieChartWrapperModel();
            try
            {
                _objPieChartDetails = _objBeat.GetAllPieChartDetails(companyCode, regionCode, onceormultiplePriv);
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objPieChartDetails;
        }

        public BeatWrapperModel GetBeatWiseDetails(string companyCode, string regionCode, string beatCode, string beatType)
        {
            BeatWrapperModel _objBeatDetails = new BeatWrapperModel();
            try
            {
                _objBeatDetails = _objBeat.GetBeatWiseDetails(companyCode, regionCode, beatCode, beatType);
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objBeatDetails;
        }

        public CustomerEntityModel GetDoctorWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            CustomerEntityModel _objDoctor = new CustomerEntityModel();
            try
            {
                _objDoctor = _objBeat.GetDoctorWiseDetails(companyCode, regionCode, customerCode, customerEntityType, gridId);
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objDoctor;
        }


        public ChemistEntityModel GetChemistWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            ChemistEntityModel _objChemist = new ChemistEntityModel();
            try
            {
                _objChemist = _objBeat.GetChemistWiseDetails(companyCode, regionCode, customerCode, customerEntityType, gridId);
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objChemist;
        }


        public StockistEntityModel GetStockistWiseDetails(string companyCode, string regionCode, string customerCode, string customerEntityType, string gridId)
        {
            StockistEntityModel _objStockist = new StockistEntityModel();
            try
            {
                _objStockist = _objBeat.GetStockistWiseDetails(companyCode, regionCode, customerCode, customerEntityType, gridId);
            }
            catch (Exception ex)
            {

                throw;
            }
            return _objStockist;
        }

        public List<BeatHistoryModel> GetBeatHistoryDetails(string companyCode, string beatCode, string regionCode)
        {
            List<BeatHistoryModel> lstBeatHistory = new List<BeatHistoryModel>();
            try
            {
                lstBeatHistory = _objBeat.GetBeatHistoryDetails(companyCode, beatCode, regionCode);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstBeatHistory;
        }
        public List<DoctordetailModel> GetDoctordetails(string companyCode, string regionCode, string type)
        {
            List<DoctordetailModel> lstdetails = new List<DoctordetailModel>();
            try
            {
                lstdetails = _objBeat.GetDoctordetails(companyCode, regionCode, type);
            }
            catch (Exception ex)
            {

                throw;
            }
            return lstdetails;
        }
        #endregion

    }
}
