using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLCampaignPlanner : ICampaignPlanner
    {
        DALCampaignPlanner _dalCP = new DALCampaignPlanner();
        public List<MVCModels.ExpenseEntity> GetExpenseEntity(string companyCode)
        {
            return _dalCP.GetExpenseEntity(companyCode);
        }
        public List<MVCModels.SFC> GetSFC(string companyCode, string regionCode)
        {
            return _dalCP.GetSFC(companyCode, regionCode);
        }
        public List<MVCModels.HiDoctor_Master.DoctorModel> GetApprovedDoctorsByRegion(string companyCode, string regionCode)
        {
            return _dalCP.GetApprovedDoctorsByRegion(companyCode, regionCode);
        }
        public DataSet GetCPDetails(string companyCode, string regionCode)
        {
            return _dalCP.GetCPDetails(companyCode, regionCode);
        }
        public long GetSeqNumber(string objName)
        {
            return _dalCP.GetSeqNumber(objName);
        }
        public int InsertCampaignPlanner(string companyCode, string regionCode, string regionName, string cpName, string categoryCode, string categoryName,
                     string sfcDetails, string doctorDetails, string mode, string campaignPlannerCode, string userName, string workArea,
                string status, string EditPrivilege)
        {
            int rowsAffected = 0;
            CurrentInfo objCurInfo = new CurrentInfo();
            try
            {
                string[] arSFC = sfcDetails.Split('$');
                string[] arDoctor = doctorDetails.Split('$');
                long cpCode = 0, HOPCode = 0;
                string strMsg = string.Empty;
                string editedCPName = string.Empty;
                cpCode = GetSeqNumber("SEQ_tbl_SFA_Camp_Planner_Header");
                HOPCode = GetSeqNumber("SEQ_tbl_SFA_Camp_Planner_SFC");
                List<MVCModels.CampaignPlannerHeader> lstHeader = new List<MVCModels.CampaignPlannerHeader>();
                List<MVCModels.CampaignPlannerSFC> lstSFC = new List<MVCModels.CampaignPlannerSFC>();
                List<MVCModels.CampaignPlannerDetails> lstDoctors = new List<MVCModels.CampaignPlannerDetails>();
                List<MVCModels.SFC> lstRegionDistance = new List<MVCModels.SFC>();
                string[] ar;
                #region CP Header
                if ("HQ" == categoryName)
                {
                    ar = arSFC[0].Split('^');
                    string distanceFareCode = Convert.ToString(ar[5]);
                    string SFCCategoryName = Convert.ToString(ar[7]);
                    MVCModels.CampaignPlannerHeader objHeader = new MVCModels.CampaignPlannerHeader();
                    objHeader.Work_Area = workArea; //Convert.ToString(ar[0]);
                    if (!string.IsNullOrEmpty(distanceFareCode) && distanceFareCode != "null" && distanceFareCode != "NULL")
                    {
                        objHeader.Distance_Fare_Code = distanceFareCode;
                        lstRegionDistance = (List<MVCModels.SFC>)_dalCP.GetActiveSFCBySFCCode(companyCode, distanceFareCode, regionCode);
                        if (lstRegionDistance.Count > 0)
                        {
                            objHeader.Distance = lstRegionDistance[0].Distance;
                            objHeader.Fare_Amount = lstRegionDistance[0].Fare_Amount;
                            objHeader.Travel_Mode = lstRegionDistance[0].Travel_Mode;
                            objHeader.Category_Name = lstRegionDistance[0].Category_Name;
                            objHeader.SFC_Version_No = lstRegionDistance[0].SFC_Version_No;
                            objHeader.SFC_Visit_Count = lstRegionDistance[0].SFC_Visit_Count;
                            //if (Convert.ToString(ar[6]) == "R")
                            //{
                            //    objHeader.Place_To = lstRegionDistance[0].From_Region_Name;
                            //    objHeader.Place_From = lstRegionDistance[0].To_Region_Name;
                            //}
                            //else
                            //{
                            objHeader.Place_From = lstRegionDistance[0].From_Region_Name;
                            objHeader.Place_To = lstRegionDistance[0].To_Region_Name;
                            //}
                        }
                    }
                    else
                    {
                        objHeader.Work_Area = workArea;
                        objHeader.Place_From = Convert.ToString(ar[0]);
                        objHeader.Place_To = Convert.ToString(ar[1]);
                        objHeader.Distance = Convert.ToDouble(ar[2]);
                        objHeader.Fare_Amount = Convert.ToDouble(ar[3]);
                        objHeader.Travel_Mode = Convert.ToString(ar[4]);
                        objHeader.Route_Way = ar[6] == "" ? "D" : ar[6];
                    }
                    objHeader.CP_Code = ((mode == "EDIT") ? campaignPlannerCode : cpCode.ToString());
                    objHeader.Company_Code = companyCode;
                    objHeader.CP_Name = "CP" + cpName;
                    objHeader.Category_Code = categoryCode;

                    if ("EDIT" == mode.ToUpper())
                    {
                        objHeader.Updated_By = userName;
                        objHeader.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    }
                    else
                    {
                        objHeader.Created_By = userName;
                        objHeader.Created_Date = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    }
                    objHeader.Region_Code = regionCode;
                    objHeader.Status = status;
                    lstHeader.Add(objHeader);
                }
                else
                {
                    ar = arSFC[0].Split('^');
                    string distanceFareCode = Convert.ToString(ar[5]);
                    MVCModels.CampaignPlannerHeader objHeader = new MVCModels.CampaignPlannerHeader();
                    objHeader.Work_Area = workArea; //Convert.ToString(ar[0]);
                    // objHeader.Route_Way = ar[7] == "" ? "D" : ar[7];
                    objHeader.CP_Code = ((mode == "EDIT") ? campaignPlannerCode : cpCode.ToString());
                    objHeader.Company_Code = companyCode;
                    objHeader.CP_Name = "CP" + cpName;
                    objHeader.Category_Code = categoryCode;

                    if ("EDIT" == mode.ToUpper())
                    {
                        objHeader.Updated_By = userName;
                        objHeader.Updated_Date = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    }
                    else
                    {
                        objHeader.Created_By = userName;
                        objHeader.Created_Date = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    }
                    objHeader.Region_Code = regionCode;
                    objHeader.Status = status;
                    lstHeader.Add(objHeader);
                }
                #endregion CP Header


                if (arSFC.Length > 1 && "HQ" != categoryName.ToUpper())
                {
                    for (int i = 0; i < arSFC.Length - 1; i++)
                    {
                        ar = arSFC[i].Split('^');
                        string distanceFareCode = Convert.ToString(ar[5]);
                        string SFCCategoryName = Convert.ToString(ar[7]);
                        MVCModels.CampaignPlannerSFC objSFC = new MVCModels.CampaignPlannerSFC();
                        // objSFC.Work_Place = //Convert.ToString(ar[0]);
                        if (!string.IsNullOrEmpty(distanceFareCode) && distanceFareCode != "null" && distanceFareCode != "NULL")
                        {
                            objSFC.Distance_Fare_Code = distanceFareCode;
                            lstRegionDistance = (List<MVCModels.SFC>)_dalCP.GetActiveSFCBySFCCode(companyCode, distanceFareCode, regionCode);
                            if (lstRegionDistance.Count > 0)
                            {
                                objSFC.Route_Way = (ar[6] == "") ? "D" : ar[6];
                                objSFC.Distance = lstRegionDistance[0].Distance;
                                objSFC.Amount = lstRegionDistance[0].Fare_Amount;
                                objSFC.Travel_Mode = lstRegionDistance[0].Travel_Mode;
                                objSFC.SFC_Category_Name = lstRegionDistance[0].Category_Name;
                                objSFC.SFC_Version_No = lstRegionDistance[0].SFC_Version_No;
                                objSFC.SFC_Visit_Count = lstRegionDistance[0].SFC_Visit_Count;
                                //if (Convert.ToString(ar[6]) == "R")
                                //{
                                //    objSFC.To_Place = lstRegionDistance[0].From_Region_Name;
                                //    objSFC.From_Place = lstRegionDistance[0].To_Region_Name;
                                //}
                                //else
                                //{
                                objSFC.From_Place = lstRegionDistance[0].From_Region_Name;
                                objSFC.To_Place = lstRegionDistance[0].To_Region_Name;
                                //    }

                            }
                        }
                        else
                        {
                            objSFC.Route_Way = (ar[6] == "") ? "D" : ar[6];
                            objSFC.From_Place = Convert.ToString(ar[0]);
                            objSFC.To_Place = Convert.ToString(ar[1]);
                            objSFC.Distance = Convert.ToDouble(ar[2]);
                            objSFC.Amount = Convert.ToDouble(ar[3]);
                            objSFC.Travel_Mode = Convert.ToString(ar[4]);
                        }
                        objSFC.CP_Code = ((mode == "EDIT") ? campaignPlannerCode : cpCode.ToString());
                        objSFC.CP_HOP_Code = Convert.ToString(HOPCode);
                        objSFC.Company_Code = companyCode;
                        lstSFC.Add(objSFC);
                    }
                }
                #region insert campaign planner doctor details
                for (int j = 0; j < arDoctor.Length - 1; j++)
                {
                    string[] arDoc;
                    arDoc = arDoctor[j].Split('^');
                    MVCModels.CampaignPlannerDetails objDetails = new MVCModels.CampaignPlannerDetails();
                    objDetails.Doctor_Code = Convert.ToString(arDoc[0]);
                    objDetails.Doctor_Name = Convert.ToString(arDoc[1]);
                    objDetails.Estimated_Time = Convert.ToString(arDoc[2]);
                    objDetails.CP_Code = ((mode == "EDIT") ? campaignPlannerCode : cpCode.ToString());
                    objDetails.Company_Code = companyCode;
                    lstDoctors.Add(objDetails);
                }
                #endregion insert campaign planner doctor details
                rowsAffected = _dalCP.InsertCampaignPlanner(companyCode, campaignPlannerCode, lstHeader, lstDoctors, lstSFC, mode, regionCode, categoryName);
                // rowsAffected = _dalCP.InsertCampaignPlanner(companyCode,campaignPlannerCode,lstHeader,lstDoctors,lstSFC,dis
                return rowsAffected;
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("sfcDetails", sfcDetails);
                dicObj.Add("doctorDetails", doctorDetails);
                dicObj.Add("campaignPlannerCode", campaignPlannerCode);
                dicObj.Add("regionCode", regionCode);
                dicObj.Add("cpName", cpName);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return 0;
            }
        }
        public IEnumerable<MVCModels.SFC> GetSelectedSFC(string companyCode, string distanceFareCode, string regionCode)
        {
            return _dalCP.GetSelectedSFC(companyCode, distanceFareCode, regionCode);
        }
        //public IEnumerable<MVCModels.SFC> GetActiveSFCBySFCCode(string companyCode, string distanceFareCode, string regionCode)
        //{
        //    return _dalCP.GetActiveSFCBySFCCode(companyCode, distanceFareCode, regionCode);
        //}

        public DataSet GetModifiedCPSFCDetails(string companyCode, string regionCode, string cpCode)
        {
            return _dalCP.GetModifiedCPSFCDetails(companyCode, regionCode, cpCode);
        }
    }
}
