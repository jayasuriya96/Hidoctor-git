using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using MVCModels.HiDoctor_Reports;
using Dapper;
using System.Linq;
using System.Text;
using System.Reflection;
using System;



namespace DataControl.HiDoctor_ReportsFactoryClasses
{
    public class DAL_ReportRegion : DapperRepository
    {
        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;

        #region Constant Strings
        const string SPHDGETSFCDETAILSFORSFCRPT = "SP_HdGetSfcDetailsforSFCrpt";
        const string SP_HDGETDIVISIONSBYREGION = "SP_hdGetDivisionsByRegion";
        const string SP_HdGetActivityFrequencySummary = "SP_HdGetActivityFrequencySummary";
        const string SP_HdGetCountDCRActualDate = "SP_HdGetCountDCRActualDate";
        const string SP_HdGetApprovedLeaves = "SP_HdGetApprovedLeaves";
        const string SP_HdGetTpDates = "SP_HdGetTpDates";
        const string SP_HdGetHolidayforActivitysummary = "SP_HdGetHolidayforActivitysummary";
        const string SP_HDGETENTEREDPRODUCT = "SP_HdGetEnteredProduct";
        const string SPHDGETBRANDMASTERPT = "SP_HdGetBrandMasteRpt";
        const string SPHDGETPRODCUTMASTERPT = "SP_HdGetProdcutMasteRpt";
        const string SP_HDGETPRODUCTWISEDOCTORNEW = "SP_hdGetProductwiseDoctornew";
        const string SP_HDGETCHILDUSERS = "SP_hdGetChildUsers";
        const string SP_HDGETTPSTATUSREPORTNEW = "SP_HdGetTpStatusreportNew";
        const string SP_HDGETCPSTATUS = "SP_HDGetCPStatus";
        //const string SP_HdGetLastSubmitQuickRefrept = "SP_HdGetLastSubmitQuickRefrept";
        const string SP_HdGetLastSubmitQuickRefrept_opt = "SP_HdGetLastSubmitQuickRefrept_opt";
        const string SP_HDGETDCRSTATUSFORLASTSUBMITTEDQUICKREF = "SP_hdGetDcrStatusforLastSubmittedQuickRef";

        const string SP_HDGETDEVIATIONCP = "SP_HDGetDeviationCP";
        const string SP_hdGetTpWithCpDoctorMissedReport = "SP_hdGetTpWithCpDoctorMissedReport";
        const string SP_hdGetSpecialityCoverageAnalysis = "SP_hdGetSpecialityCoverageAnalysis";
        const string SP_HDSELFACTIVITYREPORTNEW = "SP_hdSelfActivityReportNew";
        //dcr Quvality//
        const string SP_HDGETCHILDREGIONS = "SP_hdGetChildRegions";
        const string SP_HDGETDCRQUALITYCHEMISTDETAIL = "SP_HDGetDCRQualityChemistDetail";
        const string SP_HDGETDCRQUALITYDCRDETAIL = "SP_HDGetDCRQualityDCRDetail";
        const string SP_HDGETDCRQUALITYDOCTORCOUNT = "SP_HDGetDCRQualityDoctorCount";
        const string SP_HDGETDCRQUALITYPRODUCTDETAIL = "SP_HDGetDCRQualityProductDetail";
        //DCR WEEKLY REPORT??
        const string SP_HDGETDOCTORCATEGORY = "SP_hdGetDoctorCategory";
        const string SP_HDGETDCRWEEKLYREPORT = "SP_HdGetDCRWeeklyReport";
        const string SP_HDGETDCRWEEKLYDOCTORDETAILS = "SP_HdGetDCRWeeklyDoctorDetails";
        const string SP_HDGETDCRWEEKLYCHEMISTDETAILS = "SP_HdGetDCRWeeklyChemistDetails";
        //MC//
        const string SP_HDGETMCNAME = "SP_hdGetMcName";
        const string SP_HDGETSPECIALITY = "SP_hdGetSpeciality";
        const string SP_HDGETMCDETAIL = "Sp_HdGetMCDetail";
        const string SP_HDGETCHILDREGIONSUSERCODE = "SP_hdGetChildRegionsUserCode";
        const string SP_HDGETCAMPAIGNPRODUCTDETAILS = "SP_HdGetCampaignProductDetails";
        const string SP_HDGETMCGETDOCTORSVISITED_OLD = "SP_HdGetMCGetDoctorsVisited_Old";
        const string SP_HDGETMCGETDOCTORSDETAILPOPUP = "SP_HdGetMCGetDoctorsDetailPopup";
        //Emp Leve taken//
        const string SP_HDGETEMPLOYEELEAVETAKEN = "SP_HDGetEmployeeLeavetaken";

        //Daily Callstatus
        const string SP_HdGetDoctorCallCount = "SP_HdGetDoctorCallCount";
        const string SP_HdGetHoliday = "SP_HdGetHoliday";
        const string SP_HdGetChildUserforDailycallstatusReport = "SP_HdGetChildUserforDailycallstatusReport";
        const string SP_HD_GETCHILDUSERDETAILSFORDAILYCALLSTATUSREPT = "Sp_hd_GetchildUserdetailsforDailycallstatusRept";
        //const string SP_hdGetChildRegions = "SP_hdGetChildRegions";
        const string SP_hdGetParentRegions = "SP_hdGetParentRegions";

        //Cp Coverage and Deviation
        const string SP_HDGETCPCOVERAGEANDDEVIATION = "SP_HdGetCpCoverageandDeviation";
        //SpecialityWise Doctor category Count
        const string SP_HDGETSPECIALITYWISEDOCTORCATEGORYCOUNT = "SP_HdGetSpecialitywiseDoctorCategoryCount";
        const string SP_HDGETDOCTORMASTERDETAILSFORREPT = "SP_HdGetDoctorMasterDetailsforRept";
        const string SP_HDGETREGIONTYPEFORCHILDREGION = "SP_HdGetRegionTypeforchildRegion";
        const string SP_HDGETLASTSUBMITTEDREPORTUSINGCALC = "SP_hdGetLastSubmittedReportUsingCalc";
        const string SP_HDGETSPHDGETPAYSLIPREPORT = "SP_hdGetPayslipReport";
        const string SP_HDGETPAYSLIPZONEHEADERS = "SP_hdGetPayslipZoneHeaders";

        //DoctorDeviation Report Details
        const string SP_HDGETDOCTORDEVIATIONREPORT = "SP_HdGetDoctorDeviationReport";
        const string SP_HDGETDOCTORS = "SP_HdGetDoctors";

        //Doctor Master report
        const string SP_HDGETDOCTORMASTERDETAILSREPORT = "SP_HdGetDoctorMasterDetailsReport";
        const string SP_HDGETCATEGORYWISEDOCTORREPORT = "SP_HdGetCategoryWiseDoctorReport";
        const string SP_HDGETDOCTORCOUNT = "SP_HdGetDoctorCount";
        const string SP_HDGETALLDETAILSFORCHILDREGIONS = "SP_HdGetAlldetailsforChildRegions";
        // Day of week report.
        const string SP_HDGETDAYOFWEEKREPORT = "SP_HDGetDayofWeekReport";
        const string SP_HD_GETDAYOFWEEKREPORTCALENDARDATA = "SP_HD_GetDayOfWeekReportCalendarData";

        //Work Analysis report//
        const string SP_HDGETWORKANALYSISNEW = "SP_HdGetWorkAnalysisNew";
        const string SP_HDGETNONFIELDDAYSDETAILSPOPUPNEW = "Sp_HdGetNonFieldDaysDetailsPopupNew";
        const string SP_HDGETCPMISSEDDOCTORSPOPUPNEW = "SP_hdGetCPMissedDoctorspopUpNew";
        const string SP_HDGETMISSEDAGAINSTPLANNEW = "SP_hdGetMissedAgainstPlanNew";
        const string SP_HDGETMISSEDDOCTORCALLCOUNTNEW = "SP_hdGetMissedDoctorCallCountNew";
        const string SP_HDGETTPDEVIATIONNEW = "SP_hdGetTPDeviationNew";
        const string SP_HDGETREPEATDOCTORCALLCOUNTNEW = "SP_hdGetRepeatDoctorCallCountNew";

        //Doctor Product Mapping report
        const string SP_HDGETDOCTORPRODUCTMAPPINGDETAILS = "SP_HdGetDoctorProductMappingDetails";
        const string SP_HDGETCAMPAIGNDETAILSFORDOCTOR = "SP_HdGetCampaignDetailsforDoctor";

        //DoctorMaster TerritoryWise Report
        const string SP_HDGETCUSTOMERDETAILS = "SP_HdGetCustomerDetails";
        const string SP_HDGETUSERDETAILS = "SP_HdGetUserDetails";
        const string SP_HDGETCATEGORYANDSPECIALITY = "SP_HdGetCategoryandSpeciality";
        const string SP_HDGETDOCTORMASTERCOUNT = "SP_HdGetDoctorMasterCount";
        const string SP_HDGETDOCTORVISITCOUNT = "SP_HdGetDoctorVisitCount";
        const string SP_HDGETDOCTORVISITDETAILS = "SP_HdGetDoctorVisitDetails";
        const string SP_HDGETPRODUCTDETAILS = "SP_HdGetProductDetails";
        //DoctorMaster DateWise Report
        const string SP_HDGETALLSTATUSCOUNT = "SP_HdGetAllStatusCount";
        const string SP_HDGETCATEGORYANDSPECIALITYCOUNTFORALLSTATUS = "SP_HdGetCategoryandSpecialitycountforAllstatus";
        const string SP_HDGETDOCTORNAMEFORDATEWISEREPORT = "SP_HdGetDoctorNameforDatewiseReport";
        //Sample stock for Resigned Employee Report
        const string SP_HDGETSAMPLESTOCKFORRESIGNEDEMPLOYEE = "SP_HdGetSamplestockforResignedEmployee";
        //Expense Analysis for Alumni Report
        const string SP_HDGETEXPENSEANALYSISFORALUMNI = "SP_HdGetExpenseAnalysisforAlumni";
        //Audit Trail for Customer Master report
        const string SP_HDGETAUDITTRAILFORNEWCUSTOMER = "SP_HdGetAuditTrailForNewCustomer";
        const string SP_HDGETEXPENSEANALYSISFORALUMNIREPORT_CUSTCOUNT = "SP_hdGetExpenseAnalysisforAlumniReport_CustCount";
        const string SP_HDSHAREALLOCATIONREPORT = "SP_hdShareAllocationReport";

        const string SP_HDGETSFCAUDITREPORT = "SP_hdGetSFCAuditReport";
        const string SP_HDGETCUSTOMERDETAILS_EXP_REPORT = "SP_HdGetCustomerDetails_Exp_Report";
        const string SP_HDGETEXPENSEANALYSISFORALUMNI_MANAGER_COUNT = "SP_hdGetExpenseAnalysisforAlumni_Manager_Count";
        const string SP_HDGETKYDCUSTOMERDETAILS = "SP_hdGetKYDFilledCustomerDetails";
        const string SP_HDGETDOCTORMASTERDIVISION = "SP_hdGetDoctorMasterDivision";
        //RCPA Details Report
        const string SP_HD_GETRCPADETAILEDREPT = "SP_HD_GetRCPADetailedRept";
        const string SP_HD_GETUSERDETAILSFORRCPARPT = "SP_HD_GetUserDetailsforRCPARpt";

        const string SP_HDGETDAYWISEFIELDRCPDETAIL = "Sp_hdGetDaywiseFieldRCPDetail";

        //DRBondDCReport
        const string Sp_USP_DRB_Get_Registered_Doctors_Report = "USP_DRB_Get_Registered_Doctors_Report";

        //Stockiest wise SS Report
        const string SP_HD_GETSTOCKIESTWISESSREPORT = "SP_Hd_GetStockiestwiseSSReport";
        //const string SP_HD_GETSTOCKIESTWISESSREPORT_OLD = "SP_Hd_GetStockiestwiseSSReport_Old";
        const string SP_GET_SS_CONSOLIDATED_REPORT = "SP_Get_SS_Consolidated_Report";

        ////ComprehensiveAnalysisReport
        const string SP_HD_INSERTREPORTQUEUES = "USP_HD_InserReportQueueS";
        const string SP_HD_UPDATEREPORTQUEUES = "USP_HD_UpdateReportQueues";

        const string SP_HD_GETREPORTPROCESSQUEUES = "USP_HD_GetReportProcessQueue";
        const string SP_HD_GETEXCELAPIPROCESSQUEUES = "USP_HD_GetExcelAPIProcessQueue";


        const string SP_HD_GETREPORTQUEUEBYID = "USP_HD_GetReportQueueByID";

        //Reports URL
        const string SP_HDGETLASTSUBMITTEDREPORT_ASYNC_FINAL = "SP_hdGetLastSubmittedReport_Async_Final";
        const string SP_GETREPORTREGENERATEURL = "SP_GetReportRegenerateURL";
        const string SP_GETASYNLASTSUBMITURL = "SP_GetAsynLastsubmitURL";

        #endregion Constant Strings

        #region Public Methods
        //Get SFCReport Details
        public IEnumerable<SFCReport> GetSFCReportDetails(string companyCode, string regionCode, string selectionType, string status, string travelMode, string sfcValidity)
        {
            IEnumerable<SFCReport> lstSfcReport;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@SelectionType", selectionType);
                    parameter.Add("@Status", status);
                    parameter.Add("@TravelMode", travelMode);
                    parameter.Add("@SFCValidity", sfcValidity);
                    lstSfcReport = connection.Query<SFCReport>(SPHDGETSFCDETAILSFORSFCRPT, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstSfcReport;
        }

        /// <summary>
        /// Get ActivityFrequencySummary
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="?"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel> GetActivityFrequencySummary(string companyCode, string userCodes, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel> lstActivitysummaryDetails = new List<MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel>();

            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstEmployee = null;
                List<DCRHeaderReportModel> lstDcrMaxActualdate = null;
                List<DCRHeaderReportModel> lstDcrdetails = null;
                List<TpEnteredDetails> lstTpEntereddetails = null;
                List<AllTpEnteredDetails> lstTpAllEnteredDetails = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCodes", userCodes);
                    parameter.Add("@StartDate", startDate);
                    parameter.Add("@EndDate", endDate);
                    using (var mulitSelect = connection.QueryMultiple(SP_HdGetActivityFrequencySummary, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstEmployee = mulitSelect.Read<MVCModels.HiDoctor_Master.UserModel>().ToList();
                        lstDcrMaxActualdate = mulitSelect.Read<DCRHeaderReportModel>().ToList();
                        lstDcrdetails = mulitSelect.Read<DCRHeaderReportModel>().ToList();
                        lstTpEntereddetails = mulitSelect.Read<TpEnteredDetails>().ToList();
                        lstTpAllEnteredDetails = mulitSelect.Read<AllTpEnteredDetails>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel _objActivitysummary = new MVCModels.HiDoctor_Reports.ActivityFrequenceSummaryModel();
                _objActivitysummary.lstEmployee = lstEmployee;
                _objActivitysummary.lstDcrMaxActualdate = lstDcrMaxActualdate;
                _objActivitysummary.lstDcrdetails = lstDcrdetails;
                _objActivitysummary.lstTpEntereddetails = lstTpEntereddetails;
                _objActivitysummary.lstTpAllEnteredDetails = lstTpAllEnteredDetails;
                lstActivitysummaryDetails.Add(_objActivitysummary);
            }

            catch
            {
                throw;
            }
            return lstActivitysummaryDetails;
        }

        /// <summary>
        /// Get the CountofDCRActualDate
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="Month"></param>
        /// <param name="Year"></param>
        /// <returns></returns>
        public int GetCountDCRActualDateDetails(string companyCode, string userCode, string startDate, string endDate)
        {
            int Totaldocotorcount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parametes = new DynamicParameters();
                    parametes.Add("@CompanyCode", companyCode);
                    parametes.Add("@UserCodes", userCode);
                    parametes.Add("@StartDate", startDate);
                    parametes.Add("@EndDate", endDate);
                    Totaldocotorcount = connection.Query<int>(SP_HdGetCountDCRActualDate, parametes, commandType: CommandType.StoredProcedure).Single();

                }
            }
            catch
            {
                throw;
            }
            return Totaldocotorcount;
        }
        /// <summary>
        /// Get ApprovedLeave Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="Month"></param>
        /// <param name="Year"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.ApprovedLeavesModel> GetApprovedLeavsDetails(string companyCode, string userCode, string Month, string Year)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ApprovedLeavesModel> lstapprovedLeaves;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstapprovedLeaves = connection.Query<MVCModels.HiDoctor_Reports.ApprovedLeavesModel>(SP_HdGetApprovedLeaves,
                                                                                                         new
                                                                                                         {
                                                                                                             @CompanyCode = companyCode,
                                                                                                             @UserCode = userCode,
                                                                                                             @Month = Month,
                                                                                                             @Year = Year
                                                                                                         },
                                                                                                         commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstapprovedLeaves;
        }



        /// <summary>
        /// Get TpDates
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="Month"></param>
        /// <param name="Year"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.TpDatesModel> GetTpDates(string companyCode, string userCode, string Month, string Year)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.TpDatesModel> lstTpDates;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstTpDates = connection.Query<MVCModels.HiDoctor_Reports.TpDatesModel>(SP_HdGetTpDates,
                                                                                                         new
                                                                                                         {
                                                                                                             @CompanyCode = companyCode,
                                                                                                             @UserCode = userCode,
                                                                                                             @Month = Month,
                                                                                                             @Year = Year
                                                                                                         },
                                                                                                         commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstTpDates;
        }
        /// <summary>
        /// Get HolidayDetails
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regioncode"></param>
        /// <param name="parentRegioncodes"></param>
        /// <param name="startdate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsforActivitysummary> GetHolidaydetailsforActivitySummary(string companyCode, string regionCode, string startdate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsforActivitysummary> lstHolidays;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstHolidays = connection.Query<MVCModels.HiDoctor_Reports.HolidayDetailsforActivitysummary>(SP_HdGetHolidayforActivitysummary,
                                                                                                         new
                                                                                                         {
                                                                                                             @CompanyCode = companyCode,
                                                                                                             @RegionCode = regionCode,
                                                                                                             @StartDate = startdate,
                                                                                                             @EndDate = endDate
                                                                                                         },
                                                                                                         commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstHolidays;
        }
        /// <summary>
        /// Get Entered Product
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="FromDate"></param>
        /// <returns></returns>
        public bool GetEnteredProduct(string companyCode, string userCode, string FromDate)
        {
            // bool count = true;
            int countvalue = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    countvalue = connection.Query<int>(SP_HDGETENTEREDPRODUCT, new
                    {
                        @CompanyCode = companyCode,
                        @UserCode = userCode,
                        @FromDate = FromDate
                    },
                                                                           commandType: CommandType.StoredProcedure).Single();
                }
                if (countvalue > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get BrandMasterReport Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MasterReportModel> GetBrandMasterDetails(string companyCode)
        {
            IEnumerable<MasterReportModel> lstBrandMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    lstBrandMaster = connection.Query<MasterReportModel>(SPHDGETBRANDMASTERPT, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstBrandMaster;
        }

        /// <summary>
        /// Get ProductMasterReport Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public IEnumerable<MasterReportModel> GetProdcutMasterDetails(string companyCode)
        {
            IEnumerable<MasterReportModel> lstProductMaster;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    lstProductMaster = connection.Query<MasterReportModel>(SPHDGETPRODCUTMASTERPT, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstProductMaster;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.ProductWiseDoctor> GetProductWiseDoctorDetails(string companyCode, string userCodes, string startDate, string endDate, string productSelection, string dcrStatus, string qunatity)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ProductWiseDoctor> lstProWiseDoc;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCodes);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@productSelection", productSelection);
                p.Add("@DcrStatus", dcrStatus);
                p.Add("@Quantity", qunatity);

                lstProWiseDoc = connection.Query<MVCModels.HiDoctor_Reports.ProductWiseDoctor>(SP_HDGETPRODUCTWISEDOCTORNEW, p, commandType: CommandType.StoredProcedure, commandTimeout: 600);
                connection.Close();
            }
            return lstProWiseDoc;
        }

        //overloaded method for asynchronous reports
        public IEnumerable<MVCModels.HiDoctor_Reports.ProductWiseDoctor> GetProductWiseDoctorDetails(string companyCode, string userCodes, string startDate, string endDate, string productSelection, string dcrStatus, string qunatity, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ProductWiseDoctor> lstProWiseDoc;

            using (IDbConnection connection = IDbOpenConnection(ConnectionString))
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCodes);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@productSelection", productSelection);
                p.Add("@DcrStatus", dcrStatus);
                p.Add("@Quantity", qunatity);

                lstProWiseDoc = connection.Query<MVCModels.HiDoctor_Reports.ProductWiseDoctor>(SP_HDGETPRODUCTWISEDOCTORNEW, p, commandType: CommandType.StoredProcedure, commandTimeout: 600);
                connection.Close();
            }
            return lstProWiseDoc;
        }

        //****************************************************TpstatusReport*****************************************************//
        public IEnumerable<MVCModels.HiDoctor_Reports.TPStatusReport> GetchildUsers(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.TPStatusReport> lstchildUsers;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstchildUsers = connection.Query<MVCModels.HiDoctor_Reports.TPStatusReport>(SP_HDGETCHILDUSERS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @UserCode = userCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstchildUsers;
            }
            catch
            {
                return null;
            }
        }


        public List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel> GetTpDetail(string companyCode, string userCodes, string status, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel> lst = new List<MVCModels.HiDoctor_Reports.Tpstatusreportmodel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstEmployeeDetail = null;
                List<MVCModels.HiDoctor_Reports.TPStatusReport> lstTpstatusDetail = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETTPSTATUSREPORTNEW,
                                  new { CompanyCode = companyCode, UserCode = userCodes, DcrStatus = status, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstEmployeeDetail = multi.Read<MVCModels.HiDoctor_Reports.EmployeeDetail>().ToList();
                        lstTpstatusDetail = multi.Read<MVCModels.HiDoctor_Reports.TPStatusReport>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.Tpstatusreportmodel objExp = new MVCModels.HiDoctor_Reports.Tpstatusreportmodel();
                objExp.lstEmployeeDetail = lstEmployeeDetail;
                objExp.lstTpstatusDetail = lstTpstatusDetail;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public CPStatusReport GetCPStatus(string company_Code, string selected_Region_Code, string level1_Region_Type, string level2_Region_Type, string status)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@Selected_Region_Code", selected_Region_Code);
                    p.Add("@Level1_RegionType_Code", level1_Region_Type);
                    p.Add("@Level2_RegionType_Code", level2_Region_Type);
                    p.Add("@Status", status);
                    var CPStatusTables = connection.QueryMultiple(SP_HDGETCPSTATUS, p, commandType: CommandType.StoredProcedure);

                    CPStatusReport objCPStatusReport = new CPStatusReport();
                    objCPStatusReport.lstUserDetail = CPStatusTables.Read<UserDetailModel>().ToList();
                    objCPStatusReport.lstCPMasterDetail = CPStatusTables.Read<CPMasterReport>().ToList();
                    connection.Close();
                    return objCPStatusReport;
                }
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Last submitted Quick Refernce Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> GetLastSubmittedQuickrefDetails(string companyCode, string userCodes, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> lstLastsubmitted;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCodes", userCodes);
                    p.Add("@StartDate", startDate);
                    p.Add("@EndDate", endDate);
                    lstLastsubmitted = connection.Query<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel>(SP_HdGetLastSubmitQuickRefrept_opt, p, commandType: CommandType.StoredProcedure, commandTimeout: 300);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstLastsubmitted;
        }

        //for async last submitted calci report
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> GetLastSubmittedQuickrefDetails(string companyCode, string userCodes, string startDate, string endDate, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel> lstLastsubmitted;

            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCodes", userCodes);
                    p.Add("@StartDate", startDate);
                    p.Add("@EndDate", endDate);
                    lstLastsubmitted = connection.Query<MVCModels.HiDoctor_Reports.DCRLastSubmittedQuickRefReportModel>(SP_HdGetLastSubmitQuickRefrept_opt, p, commandTimeout: 300, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstLastsubmitted;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DivisionModel> getdivision(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DivisionModel> lstLastsubmitted;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);

                    lstLastsubmitted = connection.Query<MVCModels.HiDoctor_Reports.DivisionModel>(SP_HDGETDIVISIONSBYREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstLastsubmitted;
        }

        //async last submitted report calci
        public IEnumerable<MVCModels.HiDoctor_Reports.DivisionModel> getdivision(string companyCode, string regionCode, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DivisionModel> lstLastsubmitted;

            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", regionCode);

                    lstLastsubmitted = connection.Query<MVCModels.HiDoctor_Reports.DivisionModel>(SP_HDGETDIVISIONSBYREGION, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstLastsubmitted;
        }


        public IEnumerable<MVCModels.HiDoctor_Reports.DcrStatus> GetlastSubmittedDcrStatus(string companyCode, string userCode, string lastDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DcrStatus> lstLastsubmittedDCRstatus;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@DcrActuvalDate", lastDate);
                    lstLastsubmittedDCRstatus = connection.Query<MVCModels.HiDoctor_Reports.DcrStatus>(SP_HDGETDCRSTATUSFORLASTSUBMITTEDQUICKREF, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstLastsubmittedDCRstatus;
        }

        //async last submitted report calci
        public IEnumerable<MVCModels.HiDoctor_Reports.DcrStatus> GetlastSubmittedDcrStatus(string companyCode, string userCode, string lastDate, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DcrStatus> lstLastsubmittedDCRstatus;

            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@DcrActuvalDate", lastDate);
                    lstLastsubmittedDCRstatus = connection.Query<MVCModels.HiDoctor_Reports.DcrStatus>(SP_HDGETDCRSTATUSFORLASTSUBMITTEDQUICKREF, p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstLastsubmittedDCRstatus;
        }

        public IEnumerable<DeviationCPReportModel> GetDeviationCPReport(string company_Code, string user_Code, string start_Date, string end_Date)
        {

            IEnumerable<DeviationCPReportModel> lstDeviationCP;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", company_Code);
                    parameter.Add("@User_Code", user_Code);
                    parameter.Add("@StartDate", start_Date);
                    parameter.Add("@EndDate", end_Date);
                    lstDeviationCP = connection.Query<MVCModels.HiDoctor_Reports.DeviationCPReportModel>(SP_HDGETDEVIATIONCP, parameter, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstDeviationCP;
        }

        public TpWithCpDoctorMissed GetTpWithCpDoctorMissedReport(string company_Code, string regionCode, int month, int year, string tpStatus)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", company_Code);
                    p.Add("@RegionCode", regionCode);
                    p.Add("@Month", month);
                    p.Add("@Year", year);
                    p.Add("@TpStatus", tpStatus);

                    var TpWithCpDoctorMissed = connection.QueryMultiple(SP_hdGetTpWithCpDoctorMissedReport, p, commandType: CommandType.StoredProcedure);

                    TpWithCpDoctorMissed objTpCp = new TpWithCpDoctorMissed();
                    objTpCp.lstUser = TpWithCpDoctorMissed.Read<UserDetailModel>().ToList();
                    objTpCp.lstTpCpCount = TpWithCpDoctorMissed.Read<TpWithCpDoctorMissedCount>().ToList();
                    connection.Close();
                    return objTpCp;
                }
            }
            catch
            {
                throw;
            }
        }



        //selfActivty//
        public List<MVCModels.HiDoctor_Reports.SelfActivityModel> GetSelfActivitDetail(string companyCode, string userCodes, string startDate, string endDate, string status)
        {
            List<MVCModels.HiDoctor_Reports.SelfActivityModel> lst = new List<MVCModels.HiDoctor_Reports.SelfActivityModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstEmployeeDetail = null;
                List<MVCModels.HiDoctor_Reports.Doctordetails> lstDoctorDetail = null;
                List<MVCModels.HiDoctor_Reports.SelfActivityDoctors1vist> lstoneVist = null;
                List<MVCModels.HiDoctor_Reports.SelfActivityDoctors2vist> lsttwoVist = null;
                List<MVCModels.HiDoctor_Reports.SelfActivityDoctors3vist> lstthreeVist = null;
                List<MVCModels.HiDoctor_Reports.SelfDoctorMorevist> lstMoreVist = null;
                List<MVCModels.HiDoctor_Reports.SelfTotalVisitDrs> lsttotalVist = null;
                List<MVCModels.HiDoctor_Reports.SelfCallMade> lstCallmade = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDSELFACTIVITYREPORTNEW,
                                  new { CompanyCode = companyCode, UserCode = userCodes, DcrStatus = status, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstEmployeeDetail = multi.Read<MVCModels.HiDoctor_Reports.EmployeeDetail>().ToList();
                        lstDoctorDetail = multi.Read<MVCModels.HiDoctor_Reports.Doctordetails>().ToList();
                        lstoneVist = multi.Read<MVCModels.HiDoctor_Reports.SelfActivityDoctors1vist>().ToList();
                        lsttwoVist = multi.Read<MVCModels.HiDoctor_Reports.SelfActivityDoctors2vist>().ToList();
                        lstthreeVist = multi.Read<MVCModels.HiDoctor_Reports.SelfActivityDoctors3vist>().ToList();
                        lstMoreVist = multi.Read<MVCModels.HiDoctor_Reports.SelfDoctorMorevist>().ToList();
                        lsttotalVist = multi.Read<MVCModels.HiDoctor_Reports.SelfTotalVisitDrs>().ToList();
                        lstCallmade = multi.Read<MVCModels.HiDoctor_Reports.SelfCallMade>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.SelfActivityModel objExp = new MVCModels.HiDoctor_Reports.SelfActivityModel();
                objExp.lstEmployeeDetail = lstEmployeeDetail;
                objExp.lstDoctorDetail = lstDoctorDetail;
                objExp.lstoneVist = lstoneVist;
                objExp.lsttwoVist = lsttwoVist;
                objExp.lstthreeVist = lstthreeVist;
                objExp.lstmoreVist = lstMoreVist;
                objExp.lstTotalVist = lsttotalVist;
                objExp.lstCallsMade = lstCallmade;

                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        //DCR QUALITY REPORT//
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityModel> GetchildRegions(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityModel> lstchildregions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstchildregions = connection.Query<MVCModels.HiDoctor_Reports.DCRQualityModel>(SP_HDGETCHILDREGIONS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstchildregions;
            }
            catch
            {
                return null;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail> GetDcrQualityDCR(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail> lstDCR;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCodes);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@DcrStatus", dcrStatus);
                lstDCR = connection.Query<MVCModels.HiDoctor_Reports.DCRQualityDCRDetail>(SP_HDGETDCRQUALITYDCRDETAIL, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstDCR;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount> GetDcrQualityDoctorCount(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount> lstDoctorCount;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCodes);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@DcrStatus", dcrStatus);
                lstDoctorCount = connection.Query<MVCModels.HiDoctor_Reports.DCRQualityDoctorCount>(SP_HDGETDCRQUALITYDOCTORCOUNT, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstDoctorCount;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityProductDetail> GetDcrQualityProduct(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityProductDetail> lstProduct;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCodes);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@DcrStatus", dcrStatus);
                lstProduct = connection.Query<MVCModels.HiDoctor_Reports.DCRQualityProductDetail>(SP_HDGETDCRQUALITYPRODUCTDETAIL, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstProduct;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail> GetDcrChemist(string companyCode, string regionCodes, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail> lstChemist;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@RegionCode", regionCodes);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@DcrStatus", dcrStatus);
                lstChemist = connection.Query<MVCModels.HiDoctor_Reports.DCRQualityChemistDetail>(SP_HDGETDCRQUALITYCHEMISTDETAIL, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstChemist;
        }

        //START DCR WEEKLY REPORT//
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCategory> GetDoctorCategory(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorCategory> lstDoctorCategory;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                lstDoctorCategory = connection.Query<MVCModels.HiDoctor_Reports.DoctorCategory>(SP_HDGETDOCTORCATEGORY, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstDoctorCategory;
        }

        public List<MVCModels.HiDoctor_Reports.DCRWeeklyModel> GetDcrWeeklyDetail(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DCRWeeklyModel> lst = new List<MVCModels.HiDoctor_Reports.DCRWeeklyModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DCRDetail> lstDcrDetail = null;
                List<MVCModels.HiDoctor_Reports.RatingParameterModel> lstRatingParameter = null;
                List<MVCModels.HiDoctor_Reports.DCRRating> lstDCRrating = null;
                List<MVCModels.HiDoctor_Reports.UserDetailModel> lstuser = null;
                List<MVCModels.HiDoctor_Reports.DivisionReportModel> lstuserdivision = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETDCRWEEKLYREPORT,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate, DcrStatus = dcrStatus },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstuser = multi.Read<MVCModels.HiDoctor_Reports.UserDetailModel>().ToList();
                        lstuserdivision = multi.Read<MVCModels.HiDoctor_Reports.DivisionReportModel>().ToList();
                        lstDcrDetail = multi.Read<MVCModels.HiDoctor_Reports.DCRDetail>().ToList();
                        lstRatingParameter = multi.Read<MVCModels.HiDoctor_Reports.RatingParameterModel>().ToList();
                        lstDCRrating = multi.Read<MVCModels.HiDoctor_Reports.DCRRating>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.DCRWeeklyModel objExp = new MVCModels.HiDoctor_Reports.DCRWeeklyModel();
                objExp.lstDcrDetail = lstDcrDetail;
                objExp.lstratingParameter = lstRatingParameter;
                objExp.lstDCRating = lstDCRrating;
                objExp.lstUser = lstuser;
                objExp.lstuserdivsion = lstuserdivision;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel> GetDcrWeeklyDoctorDetail(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel> lstDoctor;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@DcrStatus", dcrStatus);
                lstDoctor = connection.Query<MVCModels.HiDoctor_Reports.DCRWeeklyDoctorModel>(SP_HDGETDCRWEEKLYDOCTORDETAILS, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstDoctor;
        }
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel> GetDcrWeeklyChemistDetail(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel> lstchemist;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@DcrStatus", dcrStatus);
                lstchemist = connection.Query<MVCModels.HiDoctor_Reports.DCRWeeeklyChemistModel>(SP_HDGETDCRWEEKLYCHEMISTDETAILS, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstchemist;
        }


        //MCCam Report//
        public IEnumerable<MVCModels.HiDoctor_Reports.CampaignNameModel> GetCampaignName(string companyCode, string userCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.CampaignNameModel> lstcampaginName;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                lstcampaginName = connection.Query<MVCModels.HiDoctor_Reports.CampaignNameModel>(SP_HDGETMCNAME, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstcampaginName;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorSpeciality> GetSpeciality(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorSpeciality> lstDoctorSpeciality;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@Result", "1");
                lstDoctorSpeciality = connection.Query<MVCModels.HiDoctor_Reports.DoctorSpeciality>(SP_HDGETSPECIALITY, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstDoctorSpeciality;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.Campaignheader> Getcampaignheader(string companyCode, string campaignCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.Campaignheader> lstMcheader;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@CampaignCode", campaignCode);
                lstMcheader = connection.Query<MVCModels.HiDoctor_Reports.Campaignheader>(SP_HDGETMCDETAIL, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstMcheader;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityModel> GetchildUsersFromUserCode(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRQualityModel> lstchildregions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstchildregions = connection.Query<MVCModels.HiDoctor_Reports.DCRQualityModel>(SP_HDGETCHILDREGIONSUSERCODE,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @UserCode = userCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstchildregions;
            }
            catch
            {
                return null;
            }
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.CampaignProductModel> GetcampaignProductdetail(string companyCode, string campaignCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.CampaignProductModel> lstMcProduct;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@CampaignCode", campaignCode);
                lstMcProduct = connection.Query<MVCModels.HiDoctor_Reports.CampaignProductModel>(SP_HDGETCAMPAIGNPRODUCTDETAILS, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstMcProduct;
        }

        public List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> GetDoctorDetail(string companyCode, string regionCodes, string campaignCode, string startDate, string endDate, string plannedDates)
        {
            List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> lst = new List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.MCdoctorVisitedModel> lstDrVistedDetail = null;
                List<MVCModels.HiDoctor_Reports.MCPlannedDoctosModel> lstDrplannedDetail = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETMCGETDOCTORSVISITED_OLD,
                                  new { CompanyCode = companyCode, RegionCode = regionCodes, CampaignCode = campaignCode, StartDate = startDate, EndDate = endDate, plannedDate = plannedDates },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstDrVistedDetail = multi.Read<MVCModels.HiDoctor_Reports.MCdoctorVisitedModel>().ToList();
                        lstDrplannedDetail = multi.Read<MVCModels.HiDoctor_Reports.MCPlannedDoctosModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.MCDoctorDetailModel objExp = new MVCModels.HiDoctor_Reports.MCDoctorDetailModel();
                objExp.lstDrVistedDetail = lstDrVistedDetail;
                objExp.lstDrplannedDetail = lstDrplannedDetail;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> GetDoctorDetailPopup(string companyCode, string regionCodes, string campaignCode, string startDate, string endDate, string plannedDates)
        {
            List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel> lst = new List<MVCModels.HiDoctor_Reports.MCDoctorDetailModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.MCdoctorVisitedModel> lstDrVistedDetail = null;
                List<MVCModels.HiDoctor_Reports.MCPlannedDoctosModel> lstDrplannedDetail = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETMCGETDOCTORSDETAILPOPUP,
                                  new { CompanyCode = companyCode, RegionCode = regionCodes, CampaignCode = campaignCode, StartDate = startDate, EndDate = endDate, plannedDate = plannedDates },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstDrVistedDetail = multi.Read<MVCModels.HiDoctor_Reports.MCdoctorVisitedModel>().ToList();
                        lstDrplannedDetail = multi.Read<MVCModels.HiDoctor_Reports.MCPlannedDoctosModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.MCDoctorDetailModel objExp = new MVCModels.HiDoctor_Reports.MCDoctorDetailModel();
                objExp.lstDrVistedDetail = lstDrVistedDetail;
                objExp.lstDrplannedDetail = lstDrplannedDetail;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        //GetEmployeeLeavedetail
        public IEnumerable<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel> GetEmployeeLeavedetail(string companyCode, string userCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel> lstEmpLeaveDetail;

            using (IDbConnection connection = IDbOpenConnection())
            {
                var p = new DynamicParameters();
                p.Add("@CompanyCode", companyCode);
                p.Add("@UserCode", userCode);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                lstEmpLeaveDetail = connection.Query<MVCModels.HiDoctor_Reports.EmployeeLeaveTakenModel>(SP_HDGETEMPLOYEELEAVETAKEN, p, commandType: CommandType.StoredProcedure);
                connection.Close();
            }
            return lstEmpLeaveDetail;
        }



        /// <summary>
        /// Get DoctorCallcount  for Dailycallstatus Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> GetDoctorCallCountDetails(string companyCode, string regionCode, int month, int year, string status)
        {
            List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> lsDoctorCallCountDetails = new List<MVCModels.HiDoctor_Reports.DocotrCallCountModel>();

            try
            {
                List<DocotorCallcountHeaderModel> lstDocotorcountheaderdetails = null;
                List<DoctorVisitDetailsModel> lstDoctorvisitDetails = null;
                List<DCRActiivtyDetailsModel> lstDcractivityDetails = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var mulitSelect = connection.QueryMultiple(SP_HdGetDoctorCallCount,
                                                                       new
                                                                       {
                                                                           @CompanyCode = companyCode,
                                                                           @RegionCode = regionCode,
                                                                           @MonthFor = month,
                                                                           @YearFor = year,
                                                                           @Status = status
                                                                       },
                                                                       commandType: CommandType.StoredProcedure))
                    {
                        lstDocotorcountheaderdetails = mulitSelect.Read<DocotorCallcountHeaderModel>().ToList();
                        lstDoctorvisitDetails = mulitSelect.Read<DoctorVisitDetailsModel>().ToList();
                        lstDcractivityDetails = mulitSelect.Read<DCRActiivtyDetailsModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.DocotrCallCountModel _objDoctorcallcount = new MVCModels.HiDoctor_Reports.DocotrCallCountModel();
                _objDoctorcallcount.lstDocotorcountheaderdetails = lstDocotorcountheaderdetails;
                _objDoctorcallcount.lstDoctorvisitDetails = lstDoctorvisitDetails;
                _objDoctorcallcount.lstDcractivityDetails = lstDcractivityDetails;
                lsDoctorCallCountDetails.Add(_objDoctorcallcount);
            }

            catch
            {
                throw;
            }
            return lsDoctorCallCountDetails;
        }

        //async daily call status report
        public List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> GetDoctorCallCountDetails(string companyCode, string regionCode, int month, int year, string status, string ConnectionString)
        {
            List<MVCModels.HiDoctor_Reports.DocotrCallCountModel> lsDoctorCallCountDetails = new List<MVCModels.HiDoctor_Reports.DocotrCallCountModel>();

            try
            {
                List<DocotorCallcountHeaderModel> lstDocotorcountheaderdetails = null;
                List<DoctorVisitDetailsModel> lstDoctorvisitDetails = null;
                List<DCRActiivtyDetailsModel> lstDcractivityDetails = null;

                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    using (var mulitSelect = connection.QueryMultiple(SP_HdGetDoctorCallCount,
                                                                       new
                                                                       {
                                                                           @CompanyCode = companyCode,
                                                                           @RegionCode = regionCode,
                                                                           @MonthFor = month,
                                                                           @YearFor = year,
                                                                           @Status = status
                                                                       },
                                                                       commandType: CommandType.StoredProcedure))
                    {
                        lstDocotorcountheaderdetails = mulitSelect.Read<DocotorCallcountHeaderModel>().ToList();
                        lstDoctorvisitDetails = mulitSelect.Read<DoctorVisitDetailsModel>().ToList();
                        lstDcractivityDetails = mulitSelect.Read<DCRActiivtyDetailsModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.DocotrCallCountModel _objDoctorcallcount = new MVCModels.HiDoctor_Reports.DocotrCallCountModel();
                _objDoctorcallcount.lstDocotorcountheaderdetails = lstDocotorcountheaderdetails;
                _objDoctorcallcount.lstDoctorvisitDetails = lstDoctorvisitDetails;
                _objDoctorcallcount.lstDcractivityDetails = lstDcractivityDetails;
                lsDoctorCallCountDetails.Add(_objDoctorcallcount);
            }

            catch
            {
                throw;
            }
            return lsDoctorCallCountDetails;
        }


        /// <summary>
        /// Get Holiday Details for Dailycallstatus Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="parentRegion"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsModel> GetHolidayDetails(string companyCode, string regionCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsModel> lstHolidaydetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstHolidaydetails = connection.Query<MVCModels.HiDoctor_Reports.HolidayDetailsModel>(SP_HdGetHoliday,
                                                                                                                 new
                                                                                                                 {
                                                                                                                     @CompanyCode = companyCode,
                                                                                                                     @RegionCode = regionCode,
                                                                                                                     @StartDate = startDate,
                                                                                                                     @EndDate = endDate
                                                                                                                 },
                                                                                                                 commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstHolidaydetails;
        }

        //for async reports
        public IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsModel> GetHolidayDetails(string companyCode, string regionCode, string startDate, string endDate, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.HolidayDetailsModel> lstHolidaydetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    lstHolidaydetails = connection.Query<MVCModels.HiDoctor_Reports.HolidayDetailsModel>(SP_HdGetHoliday,
                                                                                                                 new
                                                                                                                 {
                                                                                                                     @CompanyCode = companyCode,
                                                                                                                     @RegionCode = regionCode,
                                                                                                                     @StartDate = startDate,
                                                                                                                     @EndDate = endDate
                                                                                                                 },
                                                                                                                 commandType: CommandType.StoredProcedure);
                }
            }
            catch
            {
                throw;
            }
            return lstHolidaydetails;
        }

        //Get RegionCode
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetRegionCode(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstRegion;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegion = connection.Query<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel>(SP_HD_GETCHILDUSERDETAILSFORDAILYCALLSTATUSREPT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstRegion;
            }
            catch
            {
                throw;
            }
        }

        //for Async Reports
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetRegionCode(string companyCode, string regionCode, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstRegion;
            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    lstRegion = connection.Query<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel>(SP_HD_GETCHILDUSERDETAILSFORDAILYCALLSTATUSREPT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstRegion;
            }
            catch
            {
                throw;
            }
        }

        //Get ChildUser
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetChildUser(string companyCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstChildUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstChildUser = connection.Query<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel>(SP_HdGetChildUserforDailycallstatusReport,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstChildUser;
            }
            catch
            {
                throw;
            }
        }

        //for async reports
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> GetChildUser(string companyCode, string ConnectionString)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel> lstChildUser;
            try
            {
                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    lstChildUser = connection.Query<MVCModels.HiDoctor_Reports.DoctorCallstatusChildRegionModel>(SP_HdGetChildUserforDailycallstatusReport,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstChildUser;
            }
            catch
            {
                throw;
            }
        }

        //Get Parent Region Code
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> GetParentRegionCode(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> lstPrentRegioncodes;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstPrentRegioncodes = connection.Query<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel>(SP_hdGetParentRegions,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstPrentRegioncodes;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Cp Coverage and Deviation
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel> GetCpCoverageandDeviation(string companyCode, string userCode, string regionCode, string startDate, string previousMonthStart, string endDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel> lstCpcoverageandDeviation = new List<MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel>();

            try
            {
                List<ApprovedCPCountModel> lstApprovedCpCount = null;
                List<DoctorVisitCountModel> lstDoctorvisitcount = null;
                List<DCREnteredCPDetailsModel> lstDCREnteredCpDetails = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETCPCOVERAGEANDDEVIATION,
                                                                       new
                                                                       {
                                                                           @CompanyCode = companyCode,
                                                                           @UserCode = userCode,
                                                                           @RegionCode = regionCode,
                                                                           @StartDate = startDate,
                                                                           @EndDate = endDate,
                                                                           @DcrStatus = dcrStatus,
                                                                           @PreviousMonthStart = previousMonthStart
                                                                       },
                                                                       commandType: CommandType.StoredProcedure))
                    {
                        lstApprovedCpCount = mulitSelect.Read<ApprovedCPCountModel>().ToList();
                        lstDoctorvisitcount = mulitSelect.Read<DoctorVisitCountModel>().ToList();
                        lstDCREnteredCpDetails = mulitSelect.Read<DCREnteredCPDetailsModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel _objCpcoverageandDeviation = new MVCModels.HiDoctor_Reports.CPCoverageandDeviationModel();
                _objCpcoverageandDeviation.lstApprovedCpCount = lstApprovedCpCount;
                _objCpcoverageandDeviation.lstDoctorvisitcount = lstDoctorvisitcount;
                _objCpcoverageandDeviation.lstDCREnteredCpDetails = lstDCREnteredCpDetails;
                lstCpcoverageandDeviation.Add(_objCpcoverageandDeviation);
            }

            catch
            {
                throw;
            }
            return lstCpcoverageandDeviation;
        }
        public SpecialityCoverageAnalysis GetSpecialityCoverageAnalysis(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@UserCode", userCode);
                    p.Add("@FromDate", startDate);
                    p.Add("@ToDate", endDate);
                    p.Add("@DCRStatus", dcrStatus);

                    var SpecialityCoverageAnalysis = connection.QueryMultiple(SP_hdGetSpecialityCoverageAnalysis, p, commandType: CommandType.StoredProcedure);

                    SpecialityCoverageAnalysis objSC = new SpecialityCoverageAnalysis();
                    objSC.lstDocCount = SpecialityCoverageAnalysis.Read<SpecialityWiseDoctorCount>().ToList();
                    objSC.lstDocVisitCount = SpecialityCoverageAnalysis.Read<SpecialityWiseDoctorVisitCount>().ToList();
                    connection.Close();
                    return objSC;
                }
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Specialitywise Doctor category count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <returns></returns>

        public List<MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel> GetSpecialitywiseDoctorCategoryCount(string companyCode)
        {
            List<MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel> lstSpecialitywiseDoctorcategoryCount = new List<MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel>();

            try
            {
                List<DoctorcategoryModel> lstDoctorCateories = null;
                List<SpecialityModel> lstSpecialities = null;
                List<MVCModels.HiDoctor_Master.UserModel> lstEmployess = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETSPECIALITYWISEDOCTORCATEGORYCOUNT,
                                                                       new
                                                                       {
                                                                           @CompanyCode = companyCode
                                                                       },
                                                                       commandType: CommandType.StoredProcedure))
                    {
                        lstDoctorCateories = mulitSelect.Read<DoctorcategoryModel>().ToList();
                        lstSpecialities = mulitSelect.Read<SpecialityModel>().ToList();
                        lstEmployess = mulitSelect.Read<MVCModels.HiDoctor_Master.UserModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel _objspcialitywiseDoctorcategorycount = new MVCModels.HiDoctor_Reports.SpecialityWiseDoctorCategoryCountModel();
                _objspcialitywiseDoctorcategorycount.lstDoctorCateories = lstDoctorCateories;
                _objspcialitywiseDoctorcategorycount.lstSpecialities = lstSpecialities;
                _objspcialitywiseDoctorcategorycount.lstEmployess = lstEmployess;
                lstSpecialitywiseDoctorcategoryCount.Add(_objspcialitywiseDoctorcategorycount);
            }

            catch
            {
                throw;
            }
            return lstSpecialitywiseDoctorcategoryCount;
        }

        /// <summary>
        /// Get DoctorMaster Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterModel> GetDoctormasterdetails(string companyCode, string regionCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterModel> lstDoctormasterdetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctormasterdetails = connection.Query<MVCModels.HiDoctor_Reports.DoctorMasterModel>(SP_HDGETDOCTORMASTERDETAILSFORREPT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCodes = regionCodes
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctormasterdetails;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get Regiontype names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.RegionTypeNamesModel> GetRegionType(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.RegionTypeNamesModel> lstRegionTypes;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstRegionTypes = connection.Query<MVCModels.HiDoctor_Reports.RegionTypeNamesModel>(SP_HDGETREGIONTYPEFORCHILDREGION,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode

                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstRegionTypes;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Doctor Deviation Report Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DocotorCallcountHeaderModel> GetDoctorDeviationDetails(string companyCode, string userCode, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DocotorCallcountHeaderModel> lstDoctorDeviationDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctorDeviationDetails = connection.Query<MVCModels.HiDoctor_Reports.DocotorCallcountHeaderModel>(SP_HDGETDOCTORDEVIATIONREPORT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @UserCode = userCode,
                                                                                        @StartDate = startDate,
                                                                                        @EndDate = endDate,
                                                                                        @DcrStatus = dcrStatus
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorDeviationDetails;
            }
            catch
            {
                throw;
            }
        }

        /// <summary>
        /// Get Doctor Names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userNames"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DCRDoctorVisitReportModel> GetDoctors(string companyCode, string userNames, string startDate, string endDate, string dcrStatus)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DCRDoctorVisitReportModel> lstDoctors;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctors = connection.Query<MVCModels.HiDoctor_Reports.DCRDoctorVisitReportModel>(SP_HDGETDOCTORS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @UserNames = userNames,
                                                                                        @StartDate = startDate,
                                                                                        @EndDate = endDate,
                                                                                        @DcrStatus = dcrStatus
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctors;
            }
            catch
            {
                throw;
            }
        }
        //---------------------START-DOCTOR MASTER REPORT---------------------------------------------------//
        /// <summary>
        /// Doctor Master Report Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel> GetDoctorMasterReportDetails(string companyCode)
        {
            List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel> lstDoctorMaster = new List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel>();

            try
            {
                List<DoctorCategory> lstDoctorCategories = null;
                List<DoctorSpeciality> lstDoctorspecialities = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETDOCTORMASTERDETAILSREPORT, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstDoctorCategories = mulitSelect.Read<DoctorCategory>().ToList();
                        lstDoctorspecialities = mulitSelect.Read<DoctorSpeciality>().ToList();

                    }
                }
                MVCModels.HiDoctor_Reports.DoctorMasterReportModel _objDoctorReport = new MVCModels.HiDoctor_Reports.DoctorMasterReportModel();
                _objDoctorReport.lstDoctorCategories = lstDoctorCategories;
                _objDoctorReport.lstDoctorspecialities = lstDoctorspecialities;
                lstDoctorMaster.Add(_objDoctorReport);
            }

            catch
            {
                throw;
            }
            return lstDoctorMaster;
        }

        //To get the categories with respect to the divisions
        public List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel> GetCategoryWiseDoctorMasterReport(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel> lstDoctorMaster = new List<MVCModels.HiDoctor_Reports.DoctorMasterReportModel>();

            try
            {
                List<DoctorCategory> lstDoctorCategories = null;
                List<DoctorSpeciality> lstDoctorspecialities = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETCATEGORYWISEDOCTORREPORT, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstDoctorCategories = mulitSelect.Read<DoctorCategory>().ToList();
                        lstDoctorspecialities = mulitSelect.Read<DoctorSpeciality>().ToList();

                    }
                }
                MVCModels.HiDoctor_Reports.DoctorMasterReportModel _objDoctorReport = new MVCModels.HiDoctor_Reports.DoctorMasterReportModel();
                _objDoctorReport.lstDoctorCategories = lstDoctorCategories;
                _objDoctorReport.lstDoctorspecialities = lstDoctorspecialities;
                lstDoctorMaster.Add(_objDoctorReport);
            }

            catch
            {
                throw;
            }
            return lstDoctorMaster;
        }

        /// <summary>
        /// Get category count and speciality count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCodes"></param>
        /// <param name="?"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DoctorCountModel> GetcategoryandspecialityCount(string companyCode, string regionCodes)
        {
            List<MVCModels.HiDoctor_Reports.DoctorCountModel> lstdoctorCount = new List<MVCModels.HiDoctor_Reports.DoctorCountModel>();
            try
            {
                List<DoctorIndiviualCount> lstIndividulaCount = null;
                List<DoctorCategoryCountModel> lstDoctorCategorycount = null;
                List<DoctorSpecialityCountModel> lstDoctorspecialitiescount = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETDOCTORCOUNT,
                                  new { @CompanyCode = companyCode, @RegionCode = regionCodes },
                                  commandType: CommandType.StoredProcedure, commandTimeout: 600))
                    {
                        lstIndividulaCount = multi.Read<MVCModels.HiDoctor_Reports.DoctorIndiviualCount>().ToList();
                        lstDoctorCategorycount = multi.Read<MVCModels.HiDoctor_Reports.DoctorCategoryCountModel>().ToList();
                        lstDoctorspecialitiescount = multi.Read<MVCModels.HiDoctor_Reports.DoctorSpecialityCountModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.DoctorCountModel _objDoctorcount = new MVCModels.HiDoctor_Reports.DoctorCountModel();
                _objDoctorcount.lstIndividulaCount = lstIndividulaCount;
                _objDoctorcount.lstDoctorCategorycount = lstDoctorCategorycount;
                _objDoctorcount.lstDoctorspecialitiescount = lstDoctorspecialitiescount;
                lstdoctorCount.Add(_objDoctorcount);

            }
            catch
            {
                throw;
            }
            return lstdoctorCount;
        }
        /// <summary>
        /// Get Full Tree Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails> GetDetailsofChildRegions(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails> lstTreedetails = new List<MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails>();

            try
            {
                List<DoctorMasterFullTreeDetailsModel> lstFullTreeDetails = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETALLDETAILSFORCHILDREGIONS,
                                                                                                    new { @CompanyCode = companyCode, @RegionCode = regionCode },
                                                                                                    commandType: CommandType.StoredProcedure, commandTimeout: 600))
                    {
                        lstFullTreeDetails = multi.Read<MVCModels.HiDoctor_Reports.DoctorMasterFullTreeDetailsModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails _objFullTreeDetails = new MVCModels.HiDoctor_Reports.DoctorMasterTreeDetails();
                _objFullTreeDetails.lstFullTreeModel = lstFullTreeDetails;
                lstTreedetails.Add(_objFullTreeDetails);
            }
            catch
            {
                throw;
            }
            return lstTreedetails;
        }

        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorMasterDivisionModel> GetDoctorMasterDivision(string companyCode, string RegionCode)
        {

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@RegionCode", RegionCode);

                    var DoctorMasterDivision = connection.QueryMultiple(SP_HDGETDOCTORMASTERDIVISION, p, commandType: CommandType.StoredProcedure);
                    List<DoctorMasterDivisionModel> lstDoctorMasterDivision = DoctorMasterDivision.Read<DoctorMasterDivisionModel>().ToList();
                    connection.Close();
                    return lstDoctorMasterDivision;
                }
            }
            catch
            {
                throw;
            }
        }




        //---------------------END-DOCTOR MASTER REPORT---------------------------------------------------//
        //-------------------------START OF DRBONDDC REPORT----------------------------------------------//
        public List<MVCModels.HiDoctor_Reports.DRBondDCDetails> GetDCRDoctBondReport(string companyCode, string userCodes)
        {

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@User_Codes", userCodes);

                    var DayofWeekReportCalendarData = connection.QueryMultiple(Sp_USP_DRB_Get_Registered_Doctors_Report, p, commandType: CommandType.StoredProcedure);
                    List<DRBondDCDetails> lstDrBondDCDetails = DayofWeekReportCalendarData.Read<DRBondDCDetails>().ToList();
                    connection.Close();
                    return lstDrBondDCDetails;
                }
            }
            catch
            {
                throw;
            }
        }
        //-------------------------END OF DRBONDDC REPORT----------------------------------------------//





        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetail(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate)
        {
            List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lst = new List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstLastSubUserDetail = null;
                List<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel> lstLastSubheader = null;
                List<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel> lstLastSubdoctor = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel> lstLastsubleave = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel> lstLastsubleaveCount = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedStatus> lstLastActivities = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETLASTSUBMITTEDREPORTUSINGCALC,
                        new { CompanyCode = companyCode, UserCode = userCode, Month = month, Year = year, UserSelection = userSelection, SelectedDate = selectedDate },
                        commandType: CommandType.StoredProcedure, commandTimeout: 300))
                    {
                        lstLastSubUserDetail = multi.Read<MVCModels.HiDoctor_Reports.EmployeeDetail>().ToList();
                        lstLastSubheader = multi.Read<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel>().ToList();
                        lstLastSubdoctor = multi.Read<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel>().ToList();
                        lstLastsubleave = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel>().ToList();
                        lstLastsubleaveCount = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel>().ToList();
                        lstLastActivities = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedStatus>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.LastSubmittedReportModel objExp = new MVCModels.HiDoctor_Reports.LastSubmittedReportModel();
                objExp.lstLastSubUserDetail = lstLastSubUserDetail;
                objExp.lstLastSubheader = lstLastSubheader;
                objExp.lstLastSubdoctor = lstLastSubdoctor;
                objExp.lstLastsubleave = lstLastsubleave;
                objExp.lstLastsubleaveCount = lstLastsubleaveCount;
                objExp.lstLastActivities = lstLastActivities;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        //async last submitted calci report
        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetail(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate, string ConnectionString)
        {
            List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lst = new List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstLastSubUserDetail = null;
                List<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel> lstLastSubheader = null;
                List<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel> lstLastSubdoctor = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel> lstLastsubleave = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel> lstLastsubleaveCount = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedStatus> lstLastActivities = null;

                using (IDbConnection connection = IDbOpenConnection(ConnectionString))
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETLASTSUBMITTEDREPORTUSINGCALC,
                        new { CompanyCode = companyCode, UserCode = userCode, Month = month, Year = year, UserSelection = userSelection, SelectedDate = selectedDate },
                         commandType: CommandType.StoredProcedure, commandTimeout: 600))
                    {
                        lstLastSubUserDetail = multi.Read<MVCModels.HiDoctor_Reports.EmployeeDetail>().ToList();
                        lstLastSubheader = multi.Read<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel>().ToList();
                        lstLastSubdoctor = multi.Read<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel>().ToList();
                        lstLastsubleave = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel>().ToList();
                        lstLastsubleaveCount = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel>().ToList();
                        lstLastActivities = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedStatus>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.LastSubmittedReportModel objExp = new MVCModels.HiDoctor_Reports.LastSubmittedReportModel();
                objExp.lstLastSubUserDetail = lstLastSubUserDetail;
                objExp.lstLastSubheader = lstLastSubheader;
                objExp.lstLastSubdoctor = lstLastSubdoctor;
                objExp.lstLastsubleave = lstLastsubleave;
                objExp.lstLastsubleaveCount = lstLastsubleaveCount;
                objExp.lstLastActivities = lstLastActivities;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetailArchiveReport(string companyCode, string userCode, string month, string year, string userSelection, string selectedDate, string ArchiveReportConnectionString)
        {
            List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lst = new List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstLastSubUserDetail = null;
                List<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel> lstLastSubheader = null;
                List<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel> lstLastSubdoctor = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel> lstLastsubleave = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel> lstLastsubleaveCount = null;
                List<MVCModels.HiDoctor_Reports.LastsubmittedStatus> lstLastActivities = null;

                using (IDbConnection connection = IDbOpenArchiveConnection(ArchiveReportConnectionString))
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETLASTSUBMITTEDREPORTUSINGCALC,
                        new { CompanyCode = companyCode, UserCode = userCode, Month = month, Year = year, UserSelection = userSelection, SelectedDate = selectedDate },
                        commandType: CommandType.StoredProcedure, commandTimeout: 300))
                    {
                        lstLastSubUserDetail = multi.Read<MVCModels.HiDoctor_Reports.EmployeeDetail>().ToList();
                        lstLastSubheader = multi.Read<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel>().ToList();
                        lstLastSubdoctor = multi.Read<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel>().ToList();
                        lstLastsubleave = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel>().ToList();
                        lstLastsubleaveCount = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel>().ToList();
                        lstLastActivities = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedStatus>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.LastSubmittedReportModel objExp = new MVCModels.HiDoctor_Reports.LastSubmittedReportModel();
                objExp.lstLastSubUserDetail = lstLastSubUserDetail;
                objExp.lstLastSubheader = lstLastSubheader;
                objExp.lstLastSubdoctor = lstLastSubdoctor;
                objExp.lstLastsubleave = lstLastsubleave;
                objExp.lstLastsubleaveCount = lstLastsubleaveCount;
                objExp.lstLastActivities = lstLastActivities;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public DayofWeekReport GetDayofWeekReport(string company_Code, string user_Code, string DCR_Status, int month, int year)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@DCR_Status", DCR_Status);
                    p.Add("@Month", month);
                    p.Add("@Year", year);

                    var DayOfWeekReport = connection.QueryMultiple(SP_HDGETDAYOFWEEKREPORT, p, commandType: CommandType.StoredProcedure);

                    DayofWeekReport objDayOfWeekReport = new DayofWeekReport();
                    objDayOfWeekReport.lstUserDetail = DayOfWeekReport.Read<UserDetailModel>().ToList();
                    objDayOfWeekReport.lstDivisionModel = DayOfWeekReport.Read<DivisionReportModel>().ToList();
                    objDayOfWeekReport.DaywiseReport = DayOfWeekReport.Read<DaywiseReport>().ToList();
                    objDayOfWeekReport.WeeklyReport = DayOfWeekReport.Read<WeeklyReport>().ToList();
                    connection.Close();
                    return objDayOfWeekReport;
                }
            }
            catch
            {
                throw;
            }
        }

        public List<DayofWeekReportCalendarData> GetDayOfWeekReportCalendarData(string company_Code, string user_Code, string DCR_Status, int month, int year)
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", company_Code);
                    p.Add("@User_Code", user_Code);
                    p.Add("@DCR_Status", DCR_Status);
                    p.Add("@Month", month);
                    p.Add("@Year", year);

                    var DayofWeekReportCalendarData = connection.QueryMultiple(SP_HD_GETDAYOFWEEKREPORTCALENDARDATA, p, commandType: CommandType.StoredProcedure);
                    List<DayofWeekReportCalendarData> lstDayofWeekReport = DayofWeekReportCalendarData.Read<DayofWeekReportCalendarData>().ToList();
                    connection.Close();
                    return lstDayofWeekReport;
                }
            }
            catch
            {
                throw;
            }
        }


        //work analysis
        public List<MVCModels.HiDoctor_Reports.WorkAnalyisModel> GetWorkAnalysisDetail(string companyCode, string userCodes, string endMonth, string endYear, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.WorkAnalyisModel> lst = new List<MVCModels.HiDoctor_Reports.WorkAnalyisModel>();
            try
            {


                List<MVCModels.HiDoctor_Reports.WAUserDetailModel> lstWAUserDetail = null;
                List<MVCModels.HiDoctor_Reports.WALastEnteredDateModel> lstWALastEnteredDate = null;
                List<MVCModels.HiDoctor_Reports.WADcrCpModel> lstWADcrCp = null;
                List<MVCModels.HiDoctor_Reports.WADcrLockModel> lstWADcrLock = null;
                List<MVCModels.HiDoctor_Reports.WACustomerModel> lstCustomer = null;
                List<MVCModels.HiDoctor_Reports.WADoctorCategoryModel> lstDrCategoryModel = null;
                List<MVCModels.HiDoctor_Reports.WAActivityModel> lstActivityModel = null;
                List<MVCModels.HiDoctor_Reports.WATpModel> lsttp = null;
                List<MVCModels.HiDoctor_Reports.RatingParameterModel> lstratingParameter = null;
                List<MVCModels.HiDoctor_Reports.WAParameterValue> lsParameterValue = null;
                List<MVCModels.HiDoctor_Reports.WACustomerDetail> lsCustomerdetail = null;
                List<MVCModels.HiDoctor_Reports.WACategoryCountModel> lsCategoryCount = null;
                List<MVCModels.HiDoctor_Reports.WATP> lstTp = null;
                List<MVCModels.HiDoctor_Reports.WAtable13> lstTpdata = null;
                List<MVCModels.HiDoctor_Reports.WADcrplannedDaysModel> lstPlannedDays = null;
                List<MVCModels.HiDoctor_Reports.WADcrVistedDaysModel> lstVisitedDays = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETWORKANALYSISNEW,
                                  new { CompanyCode = companyCode, UserCode = userCodes, Month = endMonth, Year = endYear, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstWAUserDetail = multi.Read<MVCModels.HiDoctor_Reports.WAUserDetailModel>().ToList();
                        lstWALastEnteredDate = multi.Read<MVCModels.HiDoctor_Reports.WALastEnteredDateModel>().ToList();
                        lstWADcrCp = multi.Read<MVCModels.HiDoctor_Reports.WADcrCpModel>().ToList();
                        lstWADcrLock = multi.Read<MVCModels.HiDoctor_Reports.WADcrLockModel>().ToList();
                        lstCustomer = multi.Read<MVCModels.HiDoctor_Reports.WACustomerModel>().ToList();
                        lstDrCategoryModel = multi.Read<MVCModels.HiDoctor_Reports.WADoctorCategoryModel>().ToList();
                        lstActivityModel = multi.Read<MVCModels.HiDoctor_Reports.WAActivityModel>().ToList();
                        lsttp = multi.Read<MVCModels.HiDoctor_Reports.WATpModel>().ToList();
                        lstratingParameter = multi.Read<MVCModels.HiDoctor_Reports.RatingParameterModel>().ToList();
                        lsParameterValue = multi.Read<MVCModels.HiDoctor_Reports.WAParameterValue>().ToList();
                        lsCustomerdetail = multi.Read<MVCModels.HiDoctor_Reports.WACustomerDetail>().ToList();
                        lsCategoryCount = multi.Read<MVCModels.HiDoctor_Reports.WACategoryCountModel>().ToList();
                        lstTp = multi.Read<MVCModels.HiDoctor_Reports.WATP>().ToList();
                        lstTpdata = multi.Read<MVCModels.HiDoctor_Reports.WAtable13>().ToList();
                        lstPlannedDays = multi.Read<MVCModels.HiDoctor_Reports.WADcrplannedDaysModel>().ToList();
                        lstVisitedDays = multi.Read<MVCModels.HiDoctor_Reports.WADcrVistedDaysModel>().ToList();
                    }
                }

                MVCModels.HiDoctor_Reports.WorkAnalyisModel objExp = new MVCModels.HiDoctor_Reports.WorkAnalyisModel();
                objExp.lstWAUserDetail = lstWAUserDetail;
                objExp.lstWALastEnteredDate = lstWALastEnteredDate;
                objExp.lstWADcrCp = lstWADcrCp;
                objExp.lstWADcrLock = lstWADcrLock;
                objExp.lstCustomer = lstCustomer;
                objExp.lstDrCategoryModel = lstDrCategoryModel;
                objExp.lstActivityModel = lstActivityModel;
                objExp.lsttp = lsttp;
                objExp.lstratingParameter = lstratingParameter;
                objExp.lsParameterValue = lsParameterValue;
                objExp.lsCustomerdetail = lsCustomerdetail;
                objExp.lsCategoryCount = lsCategoryCount;
                objExp.lstTp = lstTp;
                objExp.lstTpdata = lstTpdata;
                objExp.lstPlannedDays = lstPlannedDays;
                objExp.lstVisitedDays = lstVisitedDays;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }


        public List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel> GetnonfieldWorkpopup(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel> lst = new List<MVCModels.HiDoctor_Reports.WorkanalysispopupModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.WAPopUpDcrModel> lstWApopupDcr = null;
                List<MVCModels.HiDoctor_Reports.WAPopUpDcrLockModel> lstWApopupLock = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETNONFIELDDAYSDETAILSPOPUPNEW,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstWApopupDcr = multi.Read<MVCModels.HiDoctor_Reports.WAPopUpDcrModel>().ToList();
                        lstWApopupLock = multi.Read<MVCModels.HiDoctor_Reports.WAPopUpDcrLockModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.WorkanalysispopupModel objExp = new MVCModels.HiDoctor_Reports.WorkanalysispopupModel();
                objExp.lstWApopupDcr = lstWApopupDcr;
                objExp.lstWApopupLock = lstWApopupLock;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Reports.CPdeviationModel> GetCpDeviationpopup(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.CPdeviationModel> lst = new List<MVCModels.HiDoctor_Reports.CPdeviationModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.cptable1> lstcptable1 = null;
                List<MVCModels.HiDoctor_Reports.cptable2> lstcptable2 = null;
                List<MVCModels.HiDoctor_Reports.cptable3> lstcptable3 = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETCPMISSEDDOCTORSPOPUPNEW,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstcptable1 = multi.Read<MVCModels.HiDoctor_Reports.cptable1>().ToList();
                        lstcptable2 = multi.Read<MVCModels.HiDoctor_Reports.cptable2>().ToList();
                        lstcptable3 = multi.Read<MVCModels.HiDoctor_Reports.cptable3>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.CPdeviationModel objExp = new MVCModels.HiDoctor_Reports.CPdeviationModel();
                objExp.lstTable1 = lstcptable1;
                objExp.lstTable2 = lstcptable2;
                objExp.lstTable3 = lstcptable3;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel> GetCCallMissedPopup(string companyCode, string userCode, string startDate, string endDate, string category)
        {
            List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel> lst = new List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable0> lsttable0 = null;
                List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable1> lsttable1 = null;
                List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable2> lsttable2 = null;
                List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable3> lsttable3 = null;
                List<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable4> lsttable4 = null;




                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETMISSEDAGAINSTPLANNEW,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate, CategoryCode = category },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lsttable0 = multi.Read<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable0>().ToList();
                        lsttable1 = multi.Read<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable1>().ToList();
                        lsttable2 = multi.Read<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable2>().ToList();
                        lsttable3 = multi.Read<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable3>().ToList();
                        lsttable4 = multi.Read<MVCModels.HiDoctor_Reports.GetMissedAgainstPlanTable4>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel objExp = new MVCModels.HiDoctor_Reports.GetMissedAgainstPlanModel();
                objExp.lsttable0 = lsttable0;
                objExp.lsttable1 = lsttable1;
                objExp.lsttable2 = lsttable2;
                objExp.lsttable3 = lsttable3;
                objExp.lsttable4 = lsttable4;
                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }


        public List<MVCModels.HiDoctor_Reports.GetDoctorCallModel> GetDoctorCallDetail(string companyCode, string userCode, string startDate, string endDate, string category)
        {
            List<MVCModels.HiDoctor_Reports.GetDoctorCallModel> lst = new List<MVCModels.HiDoctor_Reports.GetDoctorCallModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.DoctorCallPopuptable0> lsttable0 = null;
                List<MVCModels.HiDoctor_Reports.DoctorCallPopuptable1> lsttable1 = null;
                List<MVCModels.HiDoctor_Reports.DoctorCallPopuptable2> lsttable2 = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETMISSEDDOCTORCALLCOUNTNEW,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate, CategoryCode = category },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lsttable0 = multi.Read<MVCModels.HiDoctor_Reports.DoctorCallPopuptable0>().ToList();
                        lsttable1 = multi.Read<MVCModels.HiDoctor_Reports.DoctorCallPopuptable1>().ToList();
                        lsttable2 = multi.Read<MVCModels.HiDoctor_Reports.DoctorCallPopuptable2>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.GetDoctorCallModel objExp = new MVCModels.HiDoctor_Reports.GetDoctorCallModel();
                objExp.lsttable0 = lsttable0;
                objExp.lsttable1 = lsttable1;
                objExp.lsttable2 = lsttable2;

                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel> GetTpdivationDetail(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel> lst = new List<MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.TPdivCpmodel> lsttable0 = null;
                List<MVCModels.HiDoctor_Reports.TPdivActivityModel> lsttable1 = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETTPDEVIATIONNEW,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lsttable0 = multi.Read<MVCModels.HiDoctor_Reports.TPdivCpmodel>().ToList();
                        lsttable1 = multi.Read<MVCModels.HiDoctor_Reports.TPdivActivityModel>().ToList();


                    }
                }

                MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel objExp = new MVCModels.HiDoctor_Reports.TPDeviationNewPopUpModel();
                objExp.lsttable0 = lsttable0;
                objExp.lsttable1 = lsttable1;

                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }

        public List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel> GetRepeatsCallPopup(string companyCode, string userCode, string startDate, string endDate, string category)
        {
            List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel> lst = new List<MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel>();
            try
            {
                List<MVCModels.HiDoctor_Reports.table1> lsttable0 = null;
                List<MVCModels.HiDoctor_Reports.table2> lsttable1 = null;
                List<MVCModels.HiDoctor_Reports.table3> lsttable2 = null;


                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETREPEATDOCTORCALLCOUNTNEW,
                                  new { CompanyCode = companyCode, UserCode = userCode, StartDate = startDate, EndDate = endDate, CategoryCode = category },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lsttable0 = multi.Read<MVCModels.HiDoctor_Reports.table1>().ToList();
                        lsttable1 = multi.Read<MVCModels.HiDoctor_Reports.table2>().ToList();
                        lsttable2 = multi.Read<MVCModels.HiDoctor_Reports.table3>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel objExp = new MVCModels.HiDoctor_Reports.RepeatsCallModelPopupModel();
                objExp.lsttable0 = lsttable0;
                objExp.lsttable1 = lsttable1;
                objExp.lsttable2 = lsttable2;

                lst.Add(objExp);

            }
            catch
            {
                throw;
            }
            return lst;
        }


        //public List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> GetlastsubmittedDetail(string companyCode, string userCode, string month, string year, string userSelection)
        //{
        //    List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel> lst = new List<MVCModels.HiDoctor_Reports.LastSubmittedReportModel>();
        //    try
        //    {
        //        List<MVCModels.HiDoctor_Reports.EmployeeDetail> lstLastSubUserDetail = null;
        //        List<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel> lstLastSubheader = null;
        //        List<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel> lstLastSubdoctor = null;
        //        List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel> lstLastsubleave = null;
        //        List<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel> lstLastsubleaveCount = null;

        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            using (var multi = connection.QueryMultiple(SP_HDGETLASTSUBMITTEDREPORTUSINGCALC,
        //                          new { CompanyCode = companyCode, UserCode = userCode, Month = month, Year = year, UserSelection = userSelection },
        //                          commandType: CommandType.StoredProcedure))
        //            {
        //                lstLastSubUserDetail = multi.Read<MVCModels.HiDoctor_Reports.EmployeeDetail>().ToList();
        //                lstLastSubheader = multi.Read<MVCModels.HiDoctor_Reports.LastSubmitedheaderModel>().ToList();
        //                lstLastSubdoctor = multi.Read<MVCModels.HiDoctor_Reports.LastSubmittedDoctorModel>().ToList();
        //                lstLastsubleave = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveModel>().ToList();
        //                lstLastsubleaveCount = multi.Read<MVCModels.HiDoctor_Reports.LastsubmittedLeaveCountModel>().ToList();

        //            }
        //        }

        //        MVCModels.HiDoctor_Reports.LastSubmittedReportModel objExp = new MVCModels.HiDoctor_Reports.LastSubmittedReportModel();
        //        objExp.lstLastSubUserDetail = lstLastSubUserDetail;
        //        objExp.lstLastSubheader = lstLastSubheader;
        //        objExp.lstLastSubdoctor = lstLastSubdoctor;
        //        objExp.lstLastsubleave = lstLastsubleave;
        //        objExp.lstLastsubleaveCount = lstLastsubleaveCount;
        //        lst.Add(objExp);

        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return lst;
        //}
        // PaySlip Report

        public int GetMaxZoneIndex(string companyCode, string userTypeCode)
        {
            int rowCount = 0;
            int totalZones = 0;
            //  string totalZone = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    //IDbTransaction trans = connection.BeginTransaction();

                    string query = "SELECT COUNT(1) FROM tbl_SFA_Payslip_MetaData " +
                        " WHERE Company_Code = '" + companyCode + "' AND User_Type_Code = '" + userTypeCode + "' AND Record_Status = '1'";
                    rowCount = connection.Query<int>(query).Single();
                    if (rowCount > 0)
                    {
                        const string selectQry = "SELECT MAX(Zone_Index) FROM tbl_SFA_Payslip_MetaData " +
                                        " WHERE Company_Code =  @Company_Code AND User_Type_Code=@User_Type_Code " +
                                                "AND Record_Status=@Record_Status";
                        totalZones = connection.Query<Int16>(selectQry, new
                        {
                            Company_Code = companyCode,
                            User_Type_Code = userTypeCode,
                            Record_Status = '1'
                        }).Single();
                    }

                    //if (!string.IsNullOrEmpty(totalZone))
                    //{
                    //    totalZones = Convert.ToInt32(totalZone);
                    //}

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return totalZones;
        }


        public int GetMaxColIndex(string companyCode, string userTypeCode, string ZoneIndex)
        {
            int rowCount = 0;
            int totalCols = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "SELECT COUNT(1) FROM tbl_SFA_Payslip_MetaData " +
                     " WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND Zone_Index = @Zone_Index AND Record_Status = '1'";
                    rowCount = connection.Query<int>(query, new
                    {
                        Company_Code = companyCode,
                        User_Type_Code = userTypeCode,
                        Zone_Index = ZoneIndex,
                    },
                   transaction: trans).Single();
                    if (rowCount > 0)
                    {
                        query = "SELECT MAX(Column_Index) FROM tbl_SFA_Payslip_MetaData " +
                    " WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND Zone_Index = @Zone_Index AND Record_Status = '1'";

                        totalCols = connection.Query<Int16>(query, new
                        {
                            Company_Code = companyCode,
                            User_Type_Code = userTypeCode,
                            Zone_Index = ZoneIndex,
                        },
                        transaction: trans).Single();
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return totalCols;
        }
        public int GetMaxRowIndex(string companyCode, string userTypeCode, string ZoneIndex)
        {
            int rowCount = 0;
            int totalRows = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    IDbTransaction trans = connection.BeginTransaction();

                    string query = "SELECT COUNT(1) FROM tbl_SFA_Payslip_MetaData " +
                     " WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND Zone_Index = @Zone_Index AND Record_Status = '1'";
                    rowCount = connection.Query<int>(query, new
                    {
                        Company_Code = companyCode,
                        User_Type_Code = userTypeCode,
                        Zone_Index = ZoneIndex,
                    },
                   transaction: trans).Single();
                    if (rowCount > 0)
                    {
                        query = "SELECT MAX(Row_Index) FROM tbl_SFA_Payslip_MetaData " +
                    " WHERE Company_Code = @Company_Code AND User_Type_Code = @User_Type_Code AND Zone_Index = @Zone_Index AND Record_Status = '1'";

                        totalRows = connection.Query<Int16>(query, new
                        {
                            Company_Code = companyCode,
                            User_Type_Code = userTypeCode,
                            Zone_Index = ZoneIndex,
                        },
                        transaction: trans).Single();
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return totalRows;
        }
        public DataSet GetPayslipReport(string companyCode, string userCode, string month, string year, string userTypeCode)
        {
            _objSPData = new SPData();
            try
            {


                _objData = new Data();
                SqlCommand command = new SqlCommand(SP_HDGETSPHDGETPAYSLIPREPORT);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userCode);
                _objSPData.AddParamToSqlCommand(command, "@Month", ParameterDirection.Input, SqlDbType.VarChar, 2, month);
                _objSPData.AddParamToSqlCommand(command, "@Year", ParameterDirection.Input, SqlDbType.VarChar, 4, year);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public DataSet GetZoneHeaders(string companyCode, string userTypeCode, string zoneIndex)
        {
            _objData = new Data();
            try
            {
                _objSPData = new SPData();


                SqlCommand command = new SqlCommand(SP_HDGETPAYSLIPZONEHEADERS);
                command.CommandType = CommandType.StoredProcedure;
                command.CommandTimeout = 150;
                _objSPData.AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
                _objSPData.AddParamToSqlCommand(command, "@UserTypeCode", ParameterDirection.Input, SqlDbType.VarChar, 30, userTypeCode);
                _objSPData.AddParamToSqlCommand(command, "@zoneIndex", ParameterDirection.Input, SqlDbType.VarChar, 10, zoneIndex);
                _objData.OpenConnection(companyCode);
                DataSet ds = _objData.ExecuteDataSet(command);
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }
        /// <summary>
        /// Get DoctorProductMappping Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> GetDoctorProductMappingreport(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> lstDoctorDeviationDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctorDeviationDetails = connection.Query<MVCModels.HiDoctor_Reports.DoctorProductMappingModel>(SP_HDGETDOCTORPRODUCTMAPPINGDETAILS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorDeviationDetails;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Campaign Details for Product and Doctor
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="doctorCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CampaignDetailsModel> GetCampaignDetailsforDoctorandProduct(string companyCode, string regionCode, string doctorCode)
        {
            List<MVCModels.HiDoctor_Reports.CampaignDetailsModel> lstcampaigns = new List<MVCModels.HiDoctor_Reports.CampaignDetailsModel>();
            try
            {
                List<CampaignDetailsforDoctorModel> lstCampaignDoctors = null;
                List<CampaignDetailsforProductModel> lstCampaignProducts = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETCAMPAIGNDETAILSFORDOCTOR,
                                  new
                                  {
                                      @CompanyCode = companyCode,
                                      @RegionCode = regionCode,
                                      @DoctorCode = doctorCode
                                  },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstCampaignDoctors = multi.Read<MVCModels.HiDoctor_Reports.CampaignDetailsforDoctorModel>().ToList();
                        lstCampaignProducts = multi.Read<MVCModels.HiDoctor_Reports.CampaignDetailsforProductModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.CampaignDetailsModel _objCampaign = new MVCModels.HiDoctor_Reports.CampaignDetailsModel();
                _objCampaign.lstCampaignDoctors = lstCampaignDoctors;
                _objCampaign.lstCampaignProducts = lstCampaignProducts;
                lstcampaigns.Add(_objCampaign);

            }
            catch
            {
                throw;
            }
            return lstcampaigns;
        }
        //public IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> GetCampaignDetailsforDoctorandProduct(string companyCode, string regionCode,string doctorCode)
        //{
        //    IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> lstCampaignDetails;
        //    try
        //    {
        //        using (IDbConnection connection = IDbOpenConnection())
        //        {
        //            lstCampaignDetails = connection.Query<MVCModels.HiDoctor_Reports.DoctorProductMappingModel>(SP_HDGETCAMPAIGNDETAILSFORDOCTOR,
        //                                                                            new
        //                                                                            {
        //                                                                                @CompanyCode = companyCode,
        //                                                                                @RegionCode = regionCode,
        //                                                                                @DoctorCode = doctorCode
        //                                                                            },
        //                                                                            commandType: CommandType.StoredProcedure);
        //        }
        //        return lstCampaignDetails;
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //}
        public IEnumerable<UserLogReportModel> GetUserLogReport(string companyCode, string userCode, string startDate, string endDate)
        {
            IEnumerable<UserLogReportModel> lstUserLog;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    string query = "SELECT  tbl_SFA_User_Master.User_Name , IP_Address ,FORMAT(Login_Time, 'dd/MM/yyyy h:mm:ss tt') AS 'Login_Time',FORMAT(Logout_Time, 'dd/MM/yyyy h:mm:ss tt') AS 'Logout_Time'  FROM tbl_SFA_Log_Activity WITH(NOLOCK) INNER JOIN tbl_SFA_User_Master WITH(NOLOCK) "
                            + " ON tbl_SFA_Log_Activity.User_Code =tbl_SFA_User_Master.User_Code   WHERE tbl_SFA_Log_Activity.Company_Code=@companyCode AND tbl_SFA_Log_Activity.User_Code =@userCode "
                            + " AND CONVERT(DATE,tbl_SFA_Log_Activity.Login_Time) >=@startDate AND CONVERT(DATE,tbl_SFA_Log_Activity.Login_Time) <=@endDate";
                    lstUserLog = connection.Query<UserLogReportModel>(query, new { companyCode = companyCode, userCode = userCode, startDate = startDate, endDate = endDate });
                    connection.Close();

                }

            }
            catch
            {
                throw;
            }
            return lstUserLog;

        }
        #region DoctorMaster TerritoryWise Report
        /// <summary>
        /// Get Customer Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.CustomerDetailsModel> GetCustomerDetails(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.CustomerDetailsModel> lstCustomerDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCustomerDetails = connection.Query<MVCModels.HiDoctor_Reports.CustomerDetailsModel>(SP_HDGETCUSTOMERDETAILS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstCustomerDetails;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get User Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.UserModel> GetUserDetails(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Master.UserModel> lstCustomerDetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstCustomerDetails = connection.Query<MVCModels.HiDoctor_Master.UserModel>(SP_HDGETUSERDETAILS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstCustomerDetails;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get category and Speciality
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel> GetCategoryandSpecialityMaster(string companyCode)
        {
            List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel> lst = new List<MVCModels.HiDoctor_Reports.CategoryandSpecialityModel>();
            try
            {
                List<DoctorcategoryModel> lstCatory = null;
                List<SpecialityModel> lstSpeciality = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETCATEGORYANDSPECIALITY,
                                  new { @CompanyCode = companyCode },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstCatory = multi.Read<MVCModels.HiDoctor_Reports.DoctorcategoryModel>().ToList();
                        lstSpeciality = multi.Read<MVCModels.HiDoctor_Reports.SpecialityModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.CategoryandSpecialityModel _objDoctorCategoryandSpeciality = new MVCModels.HiDoctor_Reports.CategoryandSpecialityModel();
                _objDoctorCategoryandSpeciality.lstCatory = lstCatory;
                _objDoctorCategoryandSpeciality.lstSpeciality = lstSpeciality;
                lst.Add(_objDoctorCategoryandSpeciality);
            }
            catch
            {
                throw;
            }
            return lst;
        }
        /// <summary>
        /// Get Doctor Master Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> GetDoctorMasterCount(string companyCode, string regionCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> lstDoctorCount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctorCount = connection.Query<MVCModels.HiDoctor_Master.CustomerModel>(SP_HDGETDOCTORMASTERCOUNT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode,
                                                                                        @StartDate = startDate,
                                                                                        @EndDate = endDate
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorCount;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get DoctorVisit Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> GetDoctorVisitCount(string companyCode, string userCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorProductMappingModel> lstDoctorvisitCount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctorvisitCount = connection.Query<MVCModels.HiDoctor_Reports.DoctorProductMappingModel>(SP_HDGETDOCTORVISITCOUNT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @UserCode = userCode,
                                                                                        @StartDate = startDate,
                                                                                        @EndDate = endDate
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorvisitCount;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Doctor Visit Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> GetDoctorVisitDetails(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel> lstDoctorvisitCount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctorvisitCount = connection.Query<MVCModels.HiDoctor_Reports.DoctorVisitDetailsModel>(SP_HDGETDOCTORVISITDETAILS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorvisitCount;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Product Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.ProductDetailModel> GetProductDetails(string companyCode, string userCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ProductDetailModel> lstProductdetails;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstProductdetails = connection.Query<MVCModels.HiDoctor_Reports.ProductDetailModel>(SP_HDGETPRODUCTDETAILS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @UserCode = userCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstProductdetails;
            }
            catch
            {
                throw;
            }
        }
        #endregion DoctorMaster TerritoryWise Report
        #region DoctorMaster Datewise Report
        /// <summary>
        /// Doctor Master Datewise Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel> GetAllStatusCount(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel> lstDoctorMasterDatewise = new List<MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel>();
            try
            {
                List<AppliedCountModel> lstAppliedCount = null;
                List<ApprovedCountModel> lstApprovedCount = null;
                List<UnApproveCountModel> lstUnApprovedCount = null;



                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple(SP_HDGETALLSTATUSCOUNT,
                                  new
                                  {
                                      @CompanyCode = companyCode,
                                      @RegionCode = regionCode
                                  },
                                  commandType: CommandType.StoredProcedure))
                    {
                        lstAppliedCount = multi.Read<MVCModels.HiDoctor_Reports.AppliedCountModel>().ToList();
                        lstApprovedCount = multi.Read<MVCModels.HiDoctor_Reports.ApprovedCountModel>().ToList();
                        lstUnApprovedCount = multi.Read<MVCModels.HiDoctor_Reports.UnApproveCountModel>().ToList();

                    }
                }

                MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel _objDoctorMasterdatewise = new MVCModels.HiDoctor_Reports.DoctorMasterDateWiseReportModel();
                _objDoctorMasterdatewise.lstAppliedCount = lstAppliedCount;
                _objDoctorMasterdatewise.lstApprovedCount = lstApprovedCount;
                _objDoctorMasterdatewise.lstUnApprovedCount = lstUnApprovedCount;
                lstDoctorMasterDatewise.Add(_objDoctorMasterdatewise);
            }
            catch
            {
                throw;
            }
            return lstDoctorMasterDatewise;
        }
        /// <summary>
        /// Get speciality and category count for all status
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.CategoryandSpecialitycountforAllstatusModel> GetCategoryandSpecialitycountforAllstatus(string companyCode, string regionCode)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.CategoryandSpecialitycountforAllstatusModel> lstAllcount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstAllcount = connection.Query<MVCModels.HiDoctor_Reports.CategoryandSpecialitycountforAllstatusModel>(SP_HDGETCATEGORYANDSPECIALITYCOUNTFORALLSTATUS,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstAllcount;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get Doctor Names
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="statusDate"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> GetDoctorNameforDatewiseReport(string companyCode, string regionCode, string statusDate, string status)
        {
            IEnumerable<MVCModels.HiDoctor_Master.CustomerModel> lstDoctorNames;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstDoctorNames = connection.Query<MVCModels.HiDoctor_Master.CustomerModel>(SP_HDGETDOCTORNAMEFORDATEWISEREPORT,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode,
                                                                                        @StatusDate = statusDate,
                                                                                        @Status = status
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorNames;
            }
            catch
            {
                throw;
            }
        }
        #endregion DoctorMaster Datewise Report
        #region sample stock Report for Regsigned Employee
        /// <summary>
        /// Sampel stock for Resigned Employee
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.SamplestockForResignedEmployee> GetSampleStockforResignedEmployee(string companyCode, string userCode, string startDate, string endDate)
        {
            List<MVCModels.HiDoctor_Reports.SamplestockForResignedEmployee> lstRessignedUserDetails = new List<MVCModels.HiDoctor_Reports.SamplestockForResignedEmployee>();

            try
            {
                List<SamplestockReportDateModel> lstSampleReportDate = null;
                List<InwardStockModel> lstInward = null;
                List<UserDetailModel> lsUserDetail = null;
                List<DivisionReportModel> lsDivisionDetails = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@StartDate", startDate);
                    parameter.Add("@EndDate", endDate);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETSAMPLESTOCKFORRESIGNEDEMPLOYEE, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstSampleReportDate = mulitSelect.Read<SamplestockReportDateModel>().ToList();
                        lstInward = mulitSelect.Read<InwardStockModel>().ToList();
                        lsUserDetail = mulitSelect.Read<UserDetailModel>().ToList();
                        lsDivisionDetails = mulitSelect.Read<DivisionReportModel>().ToList();

                    }
                }
                MVCModels.HiDoctor_Reports.SamplestockForResignedEmployee _objSamplestock = new MVCModels.HiDoctor_Reports.SamplestockForResignedEmployee();

                _objSamplestock.lstSampleReportDate = lstSampleReportDate;
                _objSamplestock.lstInward = lstInward;
                _objSamplestock.lsUserDetail = lsUserDetail;
                _objSamplestock.lsDivisionDetails = lsDivisionDetails;
                lstRessignedUserDetails.Add(_objSamplestock);
            }
            catch
            {
                throw;
            }
            return lstRessignedUserDetails;
        }
        #endregion sample stock Report for Regsigned Employee
        #region Expense Analysis for  Alumni
        public List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel> GetExpenseAnalysisforAlumni(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string activityStatus)
        {
            List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel> lstExpenseAnalysisforAlumni = new List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel>();

            try
            {
                List<MVCModels.HiDoctor_Master.UserModel> lstUserDetails = null;
                List<DivisionModel> lstDivisions = null;
                List<ExpenseTypeModel> lstExpenseType = null;
                List<DCRHeaderforAlumniModel> lstDCRHeader = null;
                List<InterMediatePlacesModel> lstPlaces = null;
                List<ActivityModel> lstActivities = null;
                List<LeaveTypeModel> lstLeaveTypeNams = null;
                List<DaywiseExpenseAmountModel> lstDaywiseExpenseAmount = null;
                List<ExpenseandElgibilityAmountModel> lstExpenseandEligibilityAmount = null;
                List<HolidayModel> lstHolidays = null;
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@FromDate", fromDate);
                    parameter.Add("@ToDate", toDate);
                    parameter.Add("@DCRStatus", dcrStatus);
                    parameter.Add("@ActicityStatus", activityStatus);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETEXPENSEANALYSISFORALUMNI, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstUserDetails = mulitSelect.Read<MVCModels.HiDoctor_Master.UserModel>().ToList();
                        lstDivisions = mulitSelect.Read<DivisionModel>().ToList();
                        lstExpenseType = mulitSelect.Read<ExpenseTypeModel>().ToList();
                        lstDCRHeader = mulitSelect.Read<DCRHeaderforAlumniModel>().ToList();
                        lstPlaces = mulitSelect.Read<InterMediatePlacesModel>().ToList();
                        lstActivities = mulitSelect.Read<ActivityModel>().ToList();
                        lstLeaveTypeNams = mulitSelect.Read<LeaveTypeModel>().ToList();
                        lstDaywiseExpenseAmount = mulitSelect.Read<DaywiseExpenseAmountModel>().ToList();
                        lstExpenseandEligibilityAmount = mulitSelect.Read<ExpenseandElgibilityAmountModel>().ToList();
                        lstHolidays = mulitSelect.Read<HolidayModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel _objExpenseAnalysisforAlumni = new MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumniModel();
                _objExpenseAnalysisforAlumni.lstUserDetails = lstUserDetails;
                _objExpenseAnalysisforAlumni.lstDivisions = lstDivisions;
                _objExpenseAnalysisforAlumni.lstExpenseType = lstExpenseType;
                _objExpenseAnalysisforAlumni.lstDCRHeader = lstDCRHeader;
                _objExpenseAnalysisforAlumni.lstPlaces = lstPlaces;
                _objExpenseAnalysisforAlumni.lstActivities = lstActivities;
                _objExpenseAnalysisforAlumni.lstLeaveTypeNams = lstLeaveTypeNams;
                _objExpenseAnalysisforAlumni.lstDaywiseExpenseAmount = lstDaywiseExpenseAmount;
                _objExpenseAnalysisforAlumni.lstExpenseandEligibilityAmount = lstExpenseandEligibilityAmount;
                _objExpenseAnalysisforAlumni.lstHolidays = lstHolidays;
                lstExpenseAnalysisforAlumni.Add(_objExpenseAnalysisforAlumni);
            }
            catch
            {
                throw;
            }
            return lstExpenseAnalysisforAlumni;
        }
        //Doctor Counr
        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_DoctCountModel> GetCustDocCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_DoctCountModel> lstDoctorCount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@StartDate", fromDate);
                    parameter.Add("@EndDate", toDate);
                    parameter.Add("@DcrStatus", dcrStatus);
                    //parameter.Add("@Option", option);

                    lstDoctorCount = connection.Query<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_DoctCountModel>(SP_HDGETCUSTOMERDETAILS_EXP_REPORT, parameter,
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstDoctorCount;
            }
            catch
            {
                throw;
            }
        }
        //Chemist count
        public List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ChemCountModel> GetChemistCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ChemCountModel> lstChemistCount = new List<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ChemCountModel>();

            try
            {
                List<ChemistCountModel> lstCust_ChemistCount = null;
                List<POAmountModel> lstPOAmount = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@StartDate", fromDate);
                    parameter.Add("@EndDate", toDate);
                    parameter.Add("@DcrStatus", dcrStatus);
                    parameter.Add("@Option", option);
                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETEXPENSEANALYSISFORALUMNIREPORT_CUSTCOUNT, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstCust_ChemistCount = mulitSelect.Read<ChemistCountModel>().ToList();
                        lstPOAmount = mulitSelect.Read<POAmountModel>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ChemCountModel _objChemistCount = new MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ChemCountModel();
                _objChemistCount.lstCust_ChemistCount = lstCust_ChemistCount;
                _objChemistCount.lstPOAmount = lstPOAmount;
                lstChemistCount.Add(_objChemistCount);
            }
            catch
            {
                throw;
            }
            return lstChemistCount;
        }
        /// <summary>
        /// Manager Count
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="userCode"></param>
        /// <param name="fromDate"></param>
        /// <param name="toDate"></param>
        /// <param name="dcrStatus"></param>
        /// <param name="option"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ManagerCountModel> GetManagerCount(string companyCode, string userCode, string fromDate, string toDate, string dcrStatus, string option)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ManagerCountModel> lstManagerCount;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@StartDate", fromDate);
                    parameter.Add("@EndDate", toDate);
                    parameter.Add("@DcrStatus", dcrStatus);
                    parameter.Add("@Option", option);

                    lstManagerCount = connection.Query<MVCModels.HiDoctor_Reports.ExpenseAnalysisforAlumni_ManagerCountModel>(SP_HDGETEXPENSEANALYSISFORALUMNI_MANAGER_COUNT, parameter,
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstManagerCount;
            }
            catch
            {
                throw;
            }
        }
        #endregion Expense Analysis for  Alumni
        #region AuditTrail for Customer Master
        /// <summary>
        /// Get Audit Trail Details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="customerEntityType"></param>
        /// <returns></returns>
        public IEnumerable<MVCModels.HiDoctor_Reports.AuditTrailforCustomerModel> GetAuditTrailforCustomer(string companyCode, string regionCode, string customerEntityType, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.AuditTrailforCustomerModel> lstAuditTrail;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstAuditTrail = connection.Query<MVCModels.HiDoctor_Reports.AuditTrailforCustomerModel>(SP_HDGETAUDITTRAILFORNEWCUSTOMER
,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode,
                                                                                        @CustomerEntityType = customerEntityType,
                                                                                        @StartDate = startDate,
                                                                                        @EndDate = endDate
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstAuditTrail;
            }
            catch
            {
                throw;
            }
        }
        #endregion AuditTrail for Customer Master
        #region SFC Audit Report
        public IEnumerable<MVCModels.HiDoctor_Reports.SFCAuditReportModel> GetSFCAuditReport(string companyCode, string regionCode, string startDate, string endDate)
        {
            IEnumerable<MVCModels.HiDoctor_Reports.SFCAuditReportModel> lstAuditReport;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    lstAuditReport = connection.Query<MVCModels.HiDoctor_Reports.SFCAuditReportModel>(SP_HDGETSFCAUDITREPORT
,
                                                                                    new
                                                                                    {
                                                                                        @CompanyCode = companyCode,
                                                                                        @RegionCode = regionCode,
                                                                                        @StartDate = startDate,
                                                                                        @EndDate = endDate
                                                                                    },
                                                                                    commandType: CommandType.StoredProcedure);
                }
                return lstAuditReport;

            }
            catch
            {

                throw;
            }
        }

        #endregion SFC Audit Report

        #region - RCPA Detail Report
        /// <summary>
        /// Get RCPA Details Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <param name="productCodes"></param>
        /// <param name="dcrStatus"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> GetRcpaReptDetails(string companyCode, string regionCode, string startDate, string endDate, string productCodes, string dcrStatus)
        {
            //public List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> GetRcpaReptDetails(string companyCode, string regionCode, string startDate, string endDate, string productCodes, string dcrStatus, int pageNo, int pageSize, ref int totalPageCount, string viewOption)
            //{
            List<MVCModels.HiDoctor_Reports.RCPADetailsReportModel> lstRcpaDetails = new List<RCPADetailsReportModel>();
            List<RCPADoctorProductModel> lstDoctorproducts;
            List<RCPAProductModel> lstRCPAProducts;
            List<RCPAProductPriceModel> lstProductPrices;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@ProductCodes", productCodes);
                    parameter.Add("@DcrStatus", dcrStatus);
                    parameter.Add("@StartDate", startDate);
                    parameter.Add("@EndDate", endDate);
                    //parameter.Add("@PageNumber", pageNo);
                    //parameter.Add("@PageSize", pageSize);
                    //parameter.Add("@viewOption", viewOption);
                    //parameter.Add("@TotalPageNo", totalPageCount, DbType.Int32, ParameterDirection.Output);

                    using (var multiple = connection.QueryMultiple(SP_HD_GETRCPADETAILEDREPT, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstDoctorproducts = multiple.Read<MVCModels.HiDoctor_Reports.RCPADoctorProductModel>().ToList();
                        lstRCPAProducts = multiple.Read<MVCModels.HiDoctor_Reports.RCPAProductModel>().ToList();
                        lstProductPrices = multiple.Read<MVCModels.HiDoctor_Reports.RCPAProductPriceModel>().ToList();
                        // totalPageCount = parameter.Get<int>("@TotalPageNo");
                    }

                    MVCModels.HiDoctor_Reports.RCPADetailsReportModel _objRcpaRept = new MVCModels.HiDoctor_Reports.RCPADetailsReportModel();
                    _objRcpaRept.lstDoctorproducts = lstDoctorproducts;
                    _objRcpaRept.lstRCPAProducts = lstRCPAProducts;
                    _objRcpaRept.lstProductPrices = lstProductPrices;
                    lstRcpaDetails.Add(_objRcpaRept);
                }
                return lstRcpaDetails;
            }
            catch
            {
                throw;
            }
        }
        /// <summary>
        /// Get RCPA User details
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <returns></returns>
        public List<MVCModels.HiDoctor_Reports.RCPAUserdetailsModel> GetUserdetailsforRCPA(string companyCode, string regionCode)
        {
            List<MVCModels.HiDoctor_Reports.RCPAUserdetailsModel> lstRcpaUserDetails = new List<RCPAUserdetailsModel>();
            List<MVCModels.HiDoctor_Reports.RCPAUserModel> lstRcpaUsers;
            List<RCPADivisionModel> lstUserDivisions;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    using (var multiple = connection.QueryMultiple(SP_HD_GETUSERDETAILSFORRCPARPT, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstRcpaUsers = multiple.Read<MVCModels.HiDoctor_Reports.RCPAUserModel>().ToList();
                        lstUserDivisions = multiple.Read<MVCModels.HiDoctor_Reports.RCPADivisionModel>().ToList();
                    }
                    MVCModels.HiDoctor_Reports.RCPAUserdetailsModel _objRCPAUser = new MVCModels.HiDoctor_Reports.RCPAUserdetailsModel();
                    _objRCPAUser.lstRcpaUser = lstRcpaUsers;
                    _objRCPAUser.lstUserDivisions = lstUserDivisions;
                    lstRcpaUserDetails.Add(_objRCPAUser);
                }
                return lstRcpaUserDetails;
            }
            catch
            {
                throw;
            }
        }
        #endregion - RCPA Details Report

        #endregion Public Methods
        #region Stokist Share allocation
        public IEnumerable<MVCModels.HiDoctor_Master.StockistShare> GetStockistShareAllocation(string companyCode, string months, string years, string regionCodes)
        {
            IEnumerable<MVCModels.HiDoctor_Master.StockistShare> lstReport = null;

            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", companyCode);
                    p.Add("@Months", months);
                    p.Add("@Year", years);
                    p.Add("@RegionCodes", regionCodes);
                    lstReport = connection.Query<MVCModels.HiDoctor_Master.StockistShare>(SP_HDSHAREALLOCATIONREPORT, p,
                        commandType: CommandType.StoredProcedure);
                    return lstReport;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicContext = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex, dicContext);
                return null;
            }
        }
        #endregion Stockist Share allocation



        public List<MVCModels.HiDoctor_Reports.RegionKYDDetails> GetKYDDetails(string companyCode, string regionCode, string KeyColunm)
        {
            List<MVCModels.HiDoctor_Reports.RegionKYDDetails> lstKYDDetails = new List<MVCModels.HiDoctor_Reports.RegionKYDDetails>();

            try
            {
                List<KYDCustomertotalCount> lstCustotalCount = null;
                List<KYDCustomerMasterDetails> lstKYDDetail = null;
                List<KYDRegionName> lstKYDRegionName = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@Region_Code", regionCode);
                    parameter.Add("@Key_Column", KeyColunm);

                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETKYDCUSTOMERDETAILS, parameter, commandType: CommandType.StoredProcedure))
                    {

                        lstCustotalCount = mulitSelect.Read<KYDCustomertotalCount>().ToList();
                        lstKYDDetail = mulitSelect.Read<KYDCustomerMasterDetails>().ToList();
                        lstKYDRegionName = mulitSelect.Read<KYDRegionName>().ToList();
                    }
                }
                MVCModels.HiDoctor_Reports.RegionKYDDetails _objKydDetails = new MVCModels.HiDoctor_Reports.RegionKYDDetails();
                _objKydDetails.lstCustomertotalCount = lstCustotalCount;
                _objKydDetails.lstKYDCustomerDetail = lstKYDDetail;
                _objKydDetails.lstregionName = lstKYDRegionName;


                lstKYDDetails.Add(_objKydDetails);
            }
            catch
            {
                throw;
            }
            return lstKYDDetails;
        }



        public List<DaywisefieldwrkRcpaDetail> GetfieldworkRCPADetail(string companyCode, string userCode, string startDate, string dcrStatus)
        {
            List<MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail> lstDetails = new List<MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail>();
            try
            {

                List<rcpa> lstCount = null;
                List<DaywiseExpenseDetail> lstexpDetail = null;
                List<DcrMasterDetails> lstDcrMaster = null;
                List<ProductValue> lstRcpaown = null;

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@UserCode", userCode);
                    parameter.Add("@StartDate", startDate);
                    parameter.Add("@DcrStatus", dcrStatus);

                    using (var mulitSelect = connection.QueryMultiple(SP_HDGETDAYWISEFIELDRCPDETAIL, parameter, commandType: CommandType.StoredProcedure))
                    {

                        lstCount = mulitSelect.Read<rcpa>().ToList();
                        lstexpDetail = mulitSelect.Read<DaywiseExpenseDetail>().ToList();
                        lstDcrMaster = mulitSelect.Read<DcrMasterDetails>().ToList();
                        lstRcpaown = mulitSelect.Read<ProductValue>().ToList();

                    }
                }
                MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail _objDetails = new MVCModels.HiDoctor_Reports.DaywisefieldwrkRcpaDetail();
                _objDetails.lstRcpa = lstCount;
                _objDetails.lstExpdetail = lstexpDetail;
                _objDetails.lstmasterDetails = lstDcrMaster;
                _objDetails.lstRcpaProduct = lstRcpaown;



                lstDetails.Add(_objDetails);
            }
            catch
            {

                throw;
            }
            return lstDetails;


        }
        public DataSet GetDoctorMasterReportOpt(string regionCode, string company_code)
        {
            try
            {
                DataSet ds = new DataSet();
                using (SqlCommand command = new SqlCommand("usp_DMC_Opt_by_SQL_PIVOT_view"))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = 600;
                    _objSPData = new SPData();
                    _objSPData.AddParamToSqlCommand(command, "@company_code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_code);
                    _objSPData.AddParamToSqlCommand(command, "@RegionCode", ParameterDirection.Input, SqlDbType.VarChar, 30, regionCode);
                    _objData = new Data();
                    _objData.OpenConnection(company_code);
                    ds = _objData.ExecuteDataSet(command);
                }
                return ds;
            }
            catch
            {
                throw;
            }
            finally
            {
                _objData.CloseConnection();
            }

        }
        #region - Stockiest wise SS Report
        /// <summary>
        /// Get SS Report
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="regionCode"></param>
        /// <param name="productCodes"></param>
        /// <param name="startDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public List<SSReportModel> GetStockiestwiseSSReport(string companyCode, string regionCode, string productCodes, string startDate, string endDate)
        {
            List<SSReportModel> lstSSReports = new List<SSReportModel>();
            List<SSUserModel> lstSSUsers = new List<SSUserModel>();
            List<SSDivisionModel> lstSSDivisions = new List<SSDivisionModel>();
            List<SSDetailsModel> lstSSDetails = new List<SSDetailsModel>();
            List<SSPricePercentageModel> lstPricepercentage = new List<SSPricePercentageModel>();
            List<SSUserTypePrivilegeModel> lstUserTypes = new List<SSUserTypePrivilegeModel>();
            List<SSInheritedStockiestModel> lstSSSInherits = new List<SSInheritedStockiestModel>();
            List<SSStockiestModel> lstStockiest = new List<SSStockiestModel>();
            List<SSCustomerModel> lstCustomermodel = new List<SSCustomerModel>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", companyCode);
                    parameter.Add("@RegionCode", regionCode);
                    parameter.Add("@StartDate", startDate);
                    parameter.Add("@EndDate", endDate);
                    parameter.Add("@ProductCodes", productCodes);

                    using (var mutlilist = connection.QueryMultiple(SP_HD_GETSTOCKIESTWISESSREPORT, parameter, commandType: CommandType.StoredProcedure))
                    {
                        lstSSUsers = mutlilist.Read<SSUserModel>().ToList();
                        lstSSDivisions = mutlilist.Read<SSDivisionModel>().ToList();
                        lstSSDetails = mutlilist.Read<SSDetailsModel>().ToList();
                        lstPricepercentage = mutlilist.Read<SSPricePercentageModel>().ToList();
                        lstUserTypes = mutlilist.Read<SSUserTypePrivilegeModel>().ToList();
                        lstSSSInherits = mutlilist.Read<SSInheritedStockiestModel>().ToList();
                        lstStockiest = mutlilist.Read<SSStockiestModel>().ToList();
                        lstCustomermodel = mutlilist.Read<SSCustomerModel>().ToList();
                    }
                    SSReportModel _objReportModel = new SSReportModel();
                    _objReportModel.lstSSUsers = lstSSUsers;
                    _objReportModel.lstSSDivisions = lstSSDivisions;
                    _objReportModel.lstSSDetails = lstSSDetails;
                    _objReportModel.lstPricepercentage = lstPricepercentage;
                    _objReportModel.lstUserTypes = lstUserTypes;
                    _objReportModel.lstSSSInherits = lstSSSInherits;
                    _objReportModel.lstStockiest = lstStockiest;
                    _objReportModel.lstCustomermodel = lstCustomermodel;
                    lstSSReports.Add(_objReportModel);
                }
            }
            catch
            {
                throw;
            }
            return lstSSReports;
        }
        #endregion - Stockiest wise SS Report

        public List<StockiestSSOLdReport> GetstockiestwiseSSOldReport(string companyCode, string regionCode, string productCodes, string stockiestCodes, string startDate, string endDate)
        {
            List<StockiestSSOLdReport> StockiestSSOldReportView;
            try
            {

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", companyCode);
                    parameter.Add("@Region_Code", regionCode);
                    parameter.Add("@Start_Date", startDate);
                    parameter.Add("@End_Date", endDate);
                    parameter.Add("@Product_Codes", productCodes);
                    parameter.Add("@Stockist_Codes", stockiestCodes);

                    StockiestSSOldReportView = connection.Query<StockiestSSOLdReport>(SP_GET_SS_CONSOLIDATED_REPORT, parameter, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return StockiestSSOldReportView;
        }
        #region Comprehensive Analysis Report

        public int InsertRptTransactionQueue(string companyCode, string TransactionID, string ReportName, string ReportParameters, string ProcessState, bool IsRptViewed, string TechError, string UserError, string HTMLContent, string Connection, string CurrUserCode)
        {

            int result = 0;
            try
            {
                IDbConnection connection = new SqlConnection(Connection);
                connection.Open();
                using (connection)
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Transaction_ID", TransactionID);
                    p.Add("@User_Code", CurrUserCode);
                    p.Add("@Report_Name", ReportName);
                    p.Add("@Report_Parameters", ReportParameters);
                    p.Add("@Rpt_Req_DateTime", DateTime.Now);
                    p.Add("@Process_State", ProcessState);
                    p.Add("@Is_Report_Viewed", IsRptViewed);
                    p.Add("@Rpt_Viewed_DateTime", DateTime.Now);
                    p.Add("@Technical_Error_Desc", TechError);
                    p.Add("@User_Error_Desc", UserError);
                    p.Add("@HTML_File_Content", HTMLContent);

                    result = connection.Execute(SP_HD_INSERTREPORTQUEUES, p, commandType: CommandType.StoredProcedure);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public int UpdateRptTransactionQueue(string companyCode, string TransactionID, string ProcessState, string TechError, string UserError, string BlobURL, string Connection, string CurrUserCode)
        {

            int result = 0;
            try
            {
                IDbConnection connection = new SqlConnection(Connection);
                connection.Open();
                using (connection)
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", companyCode);
                    p.Add("@Transaction_ID", TransactionID);
                    p.Add("@Process_State", ProcessState);
                    p.Add("@Technical_Error_Desc", TechError);
                    p.Add("@User_Error_Desc", UserError);
                    p.Add("@HTML_File_Path", BlobURL);

                    result = connection.Execute(SP_HD_UPDATEREPORTQUEUES, p, commandType: CommandType.StoredProcedure);
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion Comprehensive Analysis Report

        #region Users Report Queue
        //Get users report queue
        public IList<UsersReportQueues> GetUsersReportProcessQueue(string CompanyCode, string UserCode, string ReportName)
        {
            IList<UsersReportQueues> lstUsersReportProcessQueues;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", CompanyCode);
                    parameter.Add("@UserCode", UserCode);
                    parameter.Add("@ReportName", ReportName);

                    lstUsersReportProcessQueues = connection.Query<UsersReportQueues>(SP_HD_GETREPORTPROCESSQUEUES, parameter, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstUsersReportProcessQueues;
        }

        public IList<UsersReportQueues> GetReportQueueByID(string CompanyCode, string TransactionID)
        {
            IList<UsersReportQueues> lstUsersReportProcessQueues;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CompanyCode", CompanyCode);
                    parameter.Add("@TransactionID", TransactionID);

                    lstUsersReportProcessQueues = connection.Query<UsersReportQueues>(SP_HD_GETREPORTQUEUEBYID, parameter, commandType: CommandType.StoredProcedure).ToList();
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            return lstUsersReportProcessQueues;
        }




        #endregion

        #region - AsynReport
        public List<MVCModels.AsynReportModel> GetReportsURL(string userCode)
        {
            List<MVCModels.AsynReportModel> lstReportsURL = new List<MVCModels.AsynReportModel>();
            using (IDbConnection connection = IDbOpenConnection())
            {
                var parameter = new DynamicParameters();
                parameter.Add("@UserCode", userCode);
                parameter.Add("@ReportID", 1); // 1 - last submitted report async - refer tbl_Async_Report_Header
                lstReportsURL = connection.Query<MVCModels.AsynReportModel>(SP_GETREPORTREGENERATEURL, parameter, commandType: CommandType.StoredProcedure).ToList();
                return lstReportsURL;
            }
        }

        public void AddParamToSqlCommand(SqlCommand cmd, string paramName, ParameterDirection paramDirection, SqlDbType dbType, int size, object paramValue)
        {

            SqlParameter parameter = new SqlParameter();
            parameter.ParameterName = paramName;
            parameter.Direction = paramDirection;
            parameter.SqlDbType = dbType;
            parameter.Value = paramValue;
            parameter.Size = size;
            cmd.Parameters.Add(parameter);
        }

        public void ExcuteAsynLastSubmitted(string companyCode, string loginUserCode, string userCode, string startDate, string endDate, string userSelection, string subDomain, string missedDoc, string unlistedDoc)
        {

            _objData = new Data();

            SqlCommand command = new SqlCommand(SP_HDGETLASTSUBMITTEDREPORT_ASYNC_FINAL);
            command.CommandType = CommandType.StoredProcedure;
            AddParamToSqlCommand(command, "@CompanyCode", ParameterDirection.Input, SqlDbType.VarChar, 30, companyCode);
            AddParamToSqlCommand(command, "@LoggeduserCode", ParameterDirection.Input, SqlDbType.VarChar, 30, loginUserCode);
            AddParamToSqlCommand(command, "@UserCode", ParameterDirection.Input, SqlDbType.VarChar, userCode.Length, userCode);
            AddParamToSqlCommand(command, "@StartDate", ParameterDirection.Input, SqlDbType.VarChar, 30, startDate);
            AddParamToSqlCommand(command, "@EndDate", ParameterDirection.Input, SqlDbType.VarChar, 30, endDate);
            AddParamToSqlCommand(command, "@UserSelection", ParameterDirection.Input, SqlDbType.VarChar, 10, userSelection);
            AddParamToSqlCommand(command, "@MissedDoctor", ParameterDirection.Input, SqlDbType.VarChar, 10, missedDoc);
            AddParamToSqlCommand(command, "@Unlisted_Doctors", ParameterDirection.Input, SqlDbType.VarChar, 10, unlistedDoc);


            _objData.OpenConnectionAsync(subDomain);
            _objData.ExecuteNonQueryAsync(command);


            // OpenConnectionAsync(subDomain);
            //using (IDbConnection connection = IDbOpenConnection())
            //{
            //    var parameter = new DynamicParameters();
            //    parameter.Add("@CompanyCode", companyCode);
            //    parameter.Add("@UserCode", userCode);
            //    parameter.Add("@StartDate", startDate);
            //    parameter.Add("@EndDate", endDate);
            //    parameter.Add("@UserSelection", userSelection);



            //    result = connection.Query<string>(SP_HDGETLASTSUBMITTEDREPORT_ASYNC_FINAL, parameter, commandType: CommandType.StoredProcedure).SingleOrDefault();
            //    return result;
            //}
        }

        public DataTable GetAsynLastSubURL(int requestId, string companyCode, string missedDoc, string unlistedDoc)
        {
            _objData = new Data();
            SqlCommand command = new SqlCommand(SP_GETASYNLASTSUBMITURL);
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 150;
            AddParamToSqlCommand(command, "@Request_Id", ParameterDirection.Input, SqlDbType.Int, 30, requestId);
            AddParamToSqlCommand(command, "@Missed_Doc", ParameterDirection.Input, SqlDbType.Int, 30, missedDoc);
            AddParamToSqlCommand(command, "@UlistedDoc", ParameterDirection.Input, SqlDbType.Int, 30, unlistedDoc);

            _objData.OpenConnection(companyCode);
            DataTable dt = _objData.ExecuteDataTable(command);
            return dt;

            //List<MVCModels.AsynReportModel> lstUrl = new List<MVCModels.AsynReportModel>();

            //using (IDbConnection connection = IDbOpenConnection())
            //{
            //    var parameter = new DynamicParameters();
            //    parameter.Add("@Request_Id",requestId);
            //    lstUrl = connection.Query<MVCModels.AsynReportModel>(SP_GETASYNLASTSUBMITURL, parameter, commandType: CommandType.StoredProcedure).ToList();
            //}
            //return lstUrl;
        }
        #endregion - AsynReport

    }
}
