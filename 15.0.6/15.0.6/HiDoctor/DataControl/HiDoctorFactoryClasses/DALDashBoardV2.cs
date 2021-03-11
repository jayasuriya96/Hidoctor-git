using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MVCModels;

namespace DataControl
{
    public class DALDashBoardV2 : DapperRepository
    {
        public DashboardV2Model _adminDashboard;
        public DALDashBoardV2()
        {
            _adminDashboard = new DashboardV2Model();
        }

        public IEnumerable<PrimarySecondaryTarget> GetPrimarySecondarywithTarget()
        {
            IEnumerable<PrimarySecondaryTarget> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    p.Add("@Flag", _adminDashboard.Flag);
                    lstContent = connection.Query<MVCModels.PrimarySecondaryTarget>("USP_HD_GetPrimarySecondayTargetValue", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<ProductWisePerformance> GetProductWisePerformance()
        {
            IEnumerable<ProductWisePerformance> lstProduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    p.Add("@Product_Code", _adminDashboard.ProductCode);
                    lstProduct = connection.Query<MVCModels.ProductWisePerformance>("USP_HD_GetProductPerformance", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstProduct;

        }

        public JoinerVsAttrition GetJoinerAttrition()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    var multiselect = connection.QueryMultiple("USP_HD_GetJoinersAttritionDetailsV2", p, commandType: CommandType.StoredProcedure);
                    JoinerVsAttrition lst = new JoinerVsAttrition();
                    lst.month1 = multiselect.Read<JoinerVsAttritionMultiple>().ToList();
                    lst.month2 = multiselect.Read<JoinerVsAttritionMultiple>().ToList();
                    lst.month3 = multiselect.Read<JoinerVsAttritionMultiple>().ToList();
                    connection.Close();
                    return lst;
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
        public IEnumerable<DRCoverage> GetDrCoverage()
        {
            IEnumerable<DRCoverage> lstDR;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@CompanyCode", _adminDashboard.CompanyCode);
                    p.Add("@RegionCode", _adminDashboard.RegionCode);
                    p.Add("@DivisionCode", _adminDashboard.DivisionCode);
                    p.Add("@CoverageInput", _adminDashboard.CoverageInput);
                    lstDR = connection.Query<MVCModels.DRCoverage>("USP_hd_GetDrCoverageValueV2", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDR;
        }
        public IEnumerable<DDL_DivisionV2> GetDivisions()
        {
            IEnumerable<DDL_DivisionV2> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    lstContent = connection.Query<MVCModels.DDL_DivisionV2>("USP_HD_GetlstDivisionsV2", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public IEnumerable<ProductDetails> GetProductName()
        {
            IEnumerable<ProductDetails> lstproduct;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    lstproduct = connection.Query<MVCModels.ProductDetails>("USP_HD_GetProductDetailsV2", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstproduct;

        }


        public IEnumerable<DDL_DivisionV2> GetDivisionList()
        {
            IEnumerable<DDL_DivisionV2> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Company_Code", _adminDashboard.CompanyCode);
                    p.Add("@User_Code", _adminDashboard.UserCode);
                    lstContent = connection.Query<MVCModels.DDL_DivisionV2>("USP_HD_GetlstDivisionsV2_List", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }
        public POB GetPOBDetails()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCode", _adminDashboard.UserCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    var multiselect = connection.QueryMultiple("Usp_hd_Get_Pob_Value", p, commandType: CommandType.StoredProcedure);
                    POB lst = new POB();
                    lst.FM = multiselect.Read<POBMultiple>().ToList();
                    lst.PM = multiselect.Read<POBMultiple>().ToList();
                    lst.TM = multiselect.Read<POBMultiple>().ToList();
                    connection.Close();
                    return lst;
                }
            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        public IEnumerable<TimeInvestment> GetTimeInvestment()
        {
            IEnumerable<TimeInvestment> lstTime;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCode", _adminDashboard.UserCode);
                    p.Add("@Flag", _adminDashboard.Flag);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    lstTime = connection.Query<MVCModels.TimeInvestment>("Usp_hd_GetTime_Investment_Value", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstTime;
        }

        public IEnumerable<TPTimeLag> GetTPTimeLag()
        {
            IEnumerable<TPTimeLag> lstTPLag;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCode", _adminDashboard.UserCode);
                    p.Add("@DivisionCode", _adminDashboard.DivisionCode);
                    p.Add("@Flag", _adminDashboard.Flag);
                    p.Add("@Deviation", _adminDashboard.Deviation);
                    lstTPLag = connection.Query<MVCModels.TPTimeLag>("USP_HD_GET_TP_DEVIATION_DETAILS_VALUE", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstTPLag;
        }

        public IEnumerable<DCRTimeLag> GetDCRTimeLag()
        {
            IEnumerable<DCRTimeLag> lstDCRLag;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@UserCode", _adminDashboard.UserCode);
                    p.Add("@DivisionCode", _adminDashboard.DivisionCode);
                    p.Add("@Flag", _adminDashboard.Flag);
                    lstDCRLag = connection.Query<MVCModels.DCRTimeLag>("USP_HD_Get_DCR_Time_Lag_Value", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return lstDCRLag;
        }
        public List<string> GetStates(string DivisionCode, string RegionCode)
        {
            IEnumerable<string> States;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", RegionCode);
                    p.Add("@Division_Code", DivisionCode);

                    States = connection.Query<string>("Usp_hd_Dashboard_GetStateName", p, commandType: CommandType.StoredProcedure);
                }


            }

            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
            return States.ToList();
        }
        public IEnumerable<CRMModel> GetCRMData(MVCModels.DashboardV2Model _objData)
        {
            IEnumerable<CRMModel> LstCRMData;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", _objData.RegionCode);
                    p.Add("@Division_Code", _objData.DivisionCode);
                    p.Add("@State", _objData.State);

                    LstCRMData = connection.Query<MVCModels.CRMModel>("Usp_hd_GetCRM_Data_Value", p, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return LstCRMData;
        }

        public StockistSale GetStockistSale()
        {
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    //      p.Add("@UserCode", _adminDashboard.UserCode);
                    p.Add("@Region_Code", _adminDashboard.RegionCode);
                    p.Add("@Division_Code", _adminDashboard.DivisionCode);
                    var multiselect = connection.QueryMultiple("Usp_hd_Stockists_brackets_sale_value", p, commandType: CommandType.StoredProcedure);
                    StockistSale lst = new StockistSale();
                    lst.FM = multiselect.Read<StockistMultiple>().ToList();
                    lst.PM = multiselect.Read<StockistMultiple>().ToList();
                    connection.Close();
                    return lst;

                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", _adminDashboard.UserCode);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }
    }
}
