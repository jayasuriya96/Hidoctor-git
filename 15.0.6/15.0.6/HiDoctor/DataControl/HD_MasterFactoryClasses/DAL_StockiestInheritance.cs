using DataControl.EnumType;
using Microsoft.SqlServer.Server;
using System;
using System.Data;
using System.Data.SqlClient;
using DataControl;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Reflection;
using Dapper;
using MVCModels;

namespace DataControl.HD_MasterFactoryClasses
{
    public class DAL_StockiestInheritance : DapperRepository
    {
        Data _objData;
        SPData _objSPData;
        SqlDataReader sqldataReader;
        private CurrentInfo _objCurInfo = new CurrentInfo();
        const string SP_HDGETSTOCKINHERITACESTATUS = "SP_hdGetStockInheritaceStatus";
        const string SP_HDGETSTOCKIESTDETAILS = "SP_HDGetStockiestDetails";

        const string EXEC = "EXEC";

        public DataSet GetCustomerData(string entity, string tableName, string mode, string regionCode, int pageNum, string pageName)
        {
            DataControl.Data _objData = new DataControl.Data();
            try
            {

                DataSet dsRes = new DataSet();
                DataSet ds = new DataSet();
                _objData.OpenConnection();
                _objData.OpenConnection(_objCurInfo.GetCompanyCode());
                {
                    StringBuilder strQry = new StringBuilder();
                    strQry.Append("exec SP_hdGetEntityColumn '" + _objCurInfo.GetCompanyCode() + "','" + entity + "','" + tableName + "'");
                    strQry.Append("exec SP_hdGetStockiestMaster '" + _objCurInfo.GetCompanyCode() + "','" + mode + "','" + regionCode + "','" + entity + "'");
                    strQry.Append(" exec SP_hdGetSaleProductsByRegion '" + _objCurInfo.GetCompanyCode() + "','" + regionCode + "'");
                    dsRes = _objData.ExecuteDataSet(strQry.ToString());
                }
                return dsRes;
            }
            finally
            {
                _objData.CloseConnection();
            }
        }

        public string GetCustomerData1(List<MVCModels.StockiestHeaderDetails> stock, List<MVCModels.StockiestHeaderDetails> stock1, string[] targetRegionCodes, string customerCode)
        {
            List<MVCModels.StockiestHeaderDetails> lstStok = new List<StockiestHeaderDetails>();
            SPData objData = new SPData();
            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            string strReturn = "aa";
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    List<MVCModels.StockiestHeaderDetails> lstStock1 = new List<StockiestHeaderDetails>();
                    List<MVCModels.StockiestHeaderDetails> lstStock = new List<StockiestHeaderDetails>();
                    int a = 1;

                    for (int r = 0; r < targetRegionCodes.Count() - 1; r++)
                    {
                        for (int j = 0; j < stock.Count; j++)
                        {
                            StockiestHeaderDetails _objstock = new StockiestHeaderDetails();
                            long SeqNum = objData.GetSeqNumber("SEQ_tbl_SFA_Customer_Master");
                            _objstock.ID = a;
                            _objstock.Old_Customer_Code = stock[j].Customer_Code;
                            _objstock.Customer_Code = SeqNum.ToString();
                            _objstock.Company_Code = _objCurInfo.GetCompanyCode();
                            _objstock.Region_Code = targetRegionCodes[r];
                            _objstock.Created_By = objCurInfo.GetUserCode();
                            _objstock.Move_Type = "SHIFT";
                            _objstock.Customer_Name = stock[j].Customer_Name;
                            _objstock.Primary_Email = stock[j].Primary_Email;
                            _objstock.Region_Type_Code = stock[j].Region_Type_Code;
                            _objstock.Customer_Status = "1";
                            _objstock.Customer_Entity_Type = "STOCKIEST";
                            _objstock.Row_Status = stock[j].Row_Status;
                            _objstock.Row_Version_No = stock[j].Row_Version_No;
                            _objstock.CCM_Customer_ID = stock[j].CCM_Customer_ID;
                            _objstock.Contact_Relation = stock[j].Contact_Relation;
                            _objstock.Is_Billable = stock[j].Is_Billable;
                            _objstock.Source_Region_Code = stock[j].Source_Region_Code;
                            _objstock.Effective_From = stock[j].Effective_From;
                            _objstock.Special_Discount_Rate = stock[j].Special_Discount_Rate;
                            _objstock.Octroi_Rate = stock[j].Octroi_Rate;
                            _objstock.Address1 = stock[j].Address1;
                            _objstock.Address2 = stock[j].Address2;
                            _objstock.Additional_Surcharge_Status = stock[j].Additional_Surcharge_Status;
                            _objstock.Category = stock[j].Category;
                            _objstock.CForm_Availability = stock[j].CForm_Availability;
                            _objstock.City = stock[j].City;
                            _objstock.CST_Applicable = stock[j].CST_Applicable;
                            _objstock.CST_Number = stock[j].CST_Number;
                            _objstock.Customer_Group = stock[j].Customer_Group;
                            _objstock.Depot_Code = stock[j].Depot_Code;
                            _objstock.Destination_Place = stock[j].Destination_Place;
                            _objstock.Registered_Delear_Status = stock[j].Registered_Delear_Status;
                            _objstock.Tax_Exempted_Status = stock[j].Tax_Exempted_Status;
                            _objstock.Tin_Number = stock[j].Tin_Number;
                            _objstock.Product_Discount_Applicable_Status = stock[j].Product_Discount_Applicable_Status;
                            _objstock.Primary_Contact = stock[j].Primary_Contact;
                            _objstock.Is_Inherited = stock[j].Is_Inherited;
                            _objstock.Local_Area = stock[j].Local_Area;
                            _objstock.Mobile = stock[j].Mobile;
                            _objstock.Octroi_Reimbursment_Status = stock[j].Octroi_Reimbursment_Status;
                            _objstock.Party_Location = stock[j].Party_Location;
                            _objstock.Place_Type = stock[j].Place_Type;
                            _objstock.Remarks = stock[j].Remarks;
                            _objstock.DOB = stock[j].DOB;
                            _objstock.Email = stock[j].Email;
                            _objstock.Fax = stock[j].Fax;
                            _objstock.Drug_License_Number1 = stock[j].Drug_License_Number1;
                            _objstock.Drug_License_Number2 = stock[j].Drug_License_Number2;
                            _objstock.Locked = stock[j].Locked;
                            _objstock.Speciality_Code = stock[j].Speciality_Code;
                            _objstock.SubRegion_Code = stock[j].SubRegion_Code;
                            _objstock.Phone = stock[j].Phone;
                            _objstock.Pin_Code = stock[j].Pin_Code;
                            _objstock.Changed_Column_Name = "Customer_Status";
                            _objstock.Old_Value = "1";
                            _objstock.New_Value = "0";
                            _objstock.Ref_Key1 = stock[j].Ref_Key1;
                            _objstock.Ref_Key2 = stock[j].Ref_Key2;
                            _objstock.Registration_Number = stock[j].Registration_Number;
                            _objstock.SubRegion_Code = stock[j].SubRegion_Code;
                            lstStock.Add(_objstock);
                            a++;
                        }
                    }
                    Data _objData = new Data();
                    try
                    {
                        SPData _objSPData = new SPData();
                        string cmdText = "SP_HDInsertShiftStockist";
                        SqlCommand command = new SqlCommand(cmdText);
                        command.CommandType = CommandType.StoredProcedure;
                        if (lstStock.Count == 0)
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InheritStock", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_InheritStock");
                        }
                        else
                        {
                            _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InheritStock", ParameterDirection.Input, SqlDbType.Structured, new StockiestDetailsEnumurator(lstStock), "TVP_InheritStock");
                        }
                        _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, strReturn);
                        _objData.OpenConnection(lstStock[0].Company_Code);
                        _objData.ExecuteNonQuery(command);
                        return command.Parameters["@Result"].Value.ToString();

                    }
                    catch (Exception ex)
                    {
                        return ex.Message + "^" + ex.StackTrace;
                    }
                    finally
                    {
                        _objData.CloseConnection();
                    }
                }
                return strReturn;
            }

            catch (Exception ex)
            {
                return ex.Message + "^" + ex.StackTrace;
            }
        }

        public List<string> GetStokiestInheritanceStatus(string companyCode, string customerCode, string customerEntityType, string region_Code)
        {
            DataControl.Data _objData = new DataControl.Data();
            List<string> lstStockist = new List<string>();
            try
            {
                _objData = new Data();

                _objData.OpenConnection(companyCode);
                {
                    string test = "" + EXEC + " " + SP_HDGETSTOCKINHERITACESTATUS + " '" + _objCurInfo.GetCompanyCode() + "','" + customerEntityType + "','" + region_Code + "','" + customerCode + "'";
                    using (sqldataReader = _objData.ExecuteReader(test))
                    {
                        while (sqldataReader.Read())
                        {
                            lstStockist.Add(sqldataReader["Is_Inherited"].ToString());
                        }
                    }
                }
            }

            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                _objData.CloseConnection();
            }
            return lstStockist;
        }


        public string InheritStockiest(List<MVCModels.StockiestHeaderDetails> stock, string[] targetRegionCodes, out string matchingResult)
        {
            List<MVCModels.StockiestHeaderDetails> lstRegionStock = new List<StockiestHeaderDetails>();

            DataControl.CurrentInfo objCurInfo = new CurrentInfo();
            Data _objData = new Data();
            matchingResult = "";
            int r = 0;
            string region = string.Join("^", targetRegionCodes);
            List<StockiestDetails> stockdetails = new List<StockiestDetails>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@RegionCodes", region);
                    stockdetails = connection.Query<MVCModels.StockiestDetails>(SP_HDGETSTOCKIESTDETAILS, parameter, commandType: CommandType.StoredProcedure).ToList();
                }

                foreach (var st in stock)
                {
                    List<MVCModels.StockiestDetails> lstStock = stockdetails.Where(x => x.Customer_Code == st.Customer_Code).ToList();
                    if (lstStock.Count > 0)
                    {
                        matchingResult = "Selected Stockiest " + lstStock[0].Customer_Name + " is already in inherited status for the selected target region";
                        break;
                    }
                }
            }
            catch
            {
                throw;
            }

            if (matchingResult != "")
            {
                return "-2";
            }
            else
            {
                try
                {
                    using (IDbConnection connection = IDbOpenConnection())
                    {
                        r = 0;
                        List<MVCModels.StockiestHeaderDetails> lstStock1 = new List<StockiestHeaderDetails>();
                        List<MVCModels.StockiestHeaderDetails> lstStock = new List<StockiestHeaderDetails>();

                        int a = 0;

                        for (r = 0; r < targetRegionCodes.Count() - 1; r++)
                        {
                            for (int j = 0; j < stock.Count; j++)
                            {
                                StockiestHeaderDetails _objstock = new StockiestHeaderDetails();
                                _objstock.ID = a;
                                _objstock.Company_Code = _objCurInfo.GetCompanyCode();
                                _objstock.Region_Code = targetRegionCodes[r];
                                _objstock.Created_By = objCurInfo.GetUserCode();
                                _objstock.Move_Type = "INHERIT";
                                _objstock.Customer_Code = stock[j].Customer_Code;
                                _objstock.Customer_Name = stock[j].Customer_Name;
                                _objstock.Primary_Email = stock[j].Primary_Email;
                                _objstock.Region_Type_Code = stock[j].Region_Type_Code;
                                _objstock.Customer_Status = "1";
                                _objstock.Customer_Entity_Type = "STOCKIEST";
                                _objstock.Row_Status = stock[j].Row_Status;
                                _objstock.Row_Version_No = stock[j].Row_Version_No;
                                _objstock.CCM_Customer_ID = stock[j].CCM_Customer_ID;
                                _objstock.Contact_Relation = stock[j].Contact_Relation;
                                _objstock.Is_Billable = stock[j].Is_Billable;
                                _objstock.Source_Region_Code = stock[j].Source_Region_Code;
                                _objstock.Effective_From = stock[j].Effective_From;
                                _objstock.Special_Discount_Rate = stock[j].Special_Discount_Rate;
                                _objstock.Octroi_Rate = stock[j].Octroi_Rate;
                                _objstock.Address1 = stock[j].Address1;
                                _objstock.Address2 = stock[j].Address2;
                                _objstock.Additional_Surcharge_Status = stock[j].Additional_Surcharge_Status;
                                _objstock.Category = stock[j].Category;
                                _objstock.CForm_Availability = stock[j].CForm_Availability;
                                _objstock.City = stock[j].City;
                                _objstock.CST_Applicable = stock[j].CST_Applicable;
                                _objstock.CST_Number = stock[j].CST_Number;
                                _objstock.Customer_Group = stock[j].Customer_Group;
                                _objstock.Depot_Code = stock[j].Depot_Code;
                                _objstock.Destination_Place = stock[j].Destination_Place;
                                _objstock.Registered_Delear_Status = stock[j].Registered_Delear_Status;
                                _objstock.Tax_Exempted_Status = stock[j].Tax_Exempted_Status;
                                _objstock.Tin_Number = stock[j].Tin_Number;
                                _objstock.Product_Discount_Applicable_Status = stock[j].Product_Discount_Applicable_Status;
                                _objstock.Primary_Contact = stock[j].Primary_Contact;
                                _objstock.Is_Inherited = stock[j].Is_Inherited;
                                _objstock.Local_Area = stock[j].Local_Area;
                                _objstock.Mobile = stock[j].Mobile;
                                _objstock.Octroi_Reimbursment_Status = stock[j].Octroi_Reimbursment_Status;
                                _objstock.Party_Location = stock[j].Party_Location;
                                _objstock.Place_Type = stock[j].Place_Type;
                                _objstock.Remarks = stock[j].Remarks;
                                _objstock.DOB = stock[j].DOB;
                                _objstock.Email = stock[j].Email;
                                _objstock.Fax = stock[j].Fax;
                                _objstock.Drug_License_Number1 = stock[j].Drug_License_Number1;
                                _objstock.Drug_License_Number2 = stock[j].Drug_License_Number2;
                                _objstock.Locked = stock[j].Locked;
                                _objstock.Speciality_Code = stock[j].Speciality_Code;
                                _objstock.SubRegion_Code = stock[j].SubRegion_Code;
                                _objstock.Phone = stock[j].Phone;
                                _objstock.Pin_Code = stock[j].Pin_Code;
                                _objstock.Ref_Key1 = stock[j].Ref_Key1;
                                _objstock.Ref_Key2 = stock[j].Ref_Key2;
                                _objstock.Registration_Number = stock[j].Registration_Number;
                                _objstock.SubRegion_Code = stock[j].SubRegion_Code;
                                lstStock.Add(_objstock);
                                a++;
                            }
                        }

                        string strReturn = "";
                        try
                        {
                            SPData _objSPData = new SPData();
                            string cmdText = "SP_Hd_InsertStockiestInheritence";
                            SqlCommand command = new SqlCommand(cmdText);
                            command.CommandType = CommandType.StoredProcedure;
                            if (lstStock.Count == 0)
                            {
                                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InheritStock", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_InheritStock");
                            }
                            else
                            {
                                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_InheritStock", ParameterDirection.Input, SqlDbType.Structured, new StockiestDetailsEnumurator(lstStock), "TVP_InheritStock");
                            }
                            _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, strReturn);
                            _objData.OpenConnection(lstStock[0].Company_Code);
                            _objData.ExecuteNonQuery(command);

                        }
                        finally
                        {
                            _objData.CloseConnection();
                        }

                        return strReturn;
                    }
                }

                catch
                {
                    throw;
                }
            }
        }

        public class StockiestDetailsEnumurator : IEnumerable<SqlDataRecord>
        {

            public StockiestDetailsEnumurator(IEnumerable<StockiestHeaderDetails> data)
            {
                _data = data;
            }
            private IEnumerable<StockiestHeaderDetails> _data;
            public IEnumerator<SqlDataRecord> GetEnumerator()
            {
                SqlMetaData[] metaData = {
                new SqlMetaData("ID", SqlDbType.Int),
                new SqlMetaData("Company_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Customer_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Region_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Region_Type_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Customer_Status", SqlDbType.VarChar,30),
                new SqlMetaData("Contact_Relation", SqlDbType.VarChar,50),
                new SqlMetaData("Row_Status", SqlDbType.VarChar,1),
                new SqlMetaData("Row_Version_No", SqlDbType.Int),
                new SqlMetaData("CCM_Customer_ID", SqlDbType.Int),
                new SqlMetaData("Customer_Entity_Type", SqlDbType.VarChar,30),
                new SqlMetaData("Is_Inherited", SqlDbType.VarChar,1),
                new SqlMetaData("Source_Region_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Customer_Name", SqlDbType.VarChar,300),
                new SqlMetaData("Depot_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Category", SqlDbType.VarChar,30),
                new SqlMetaData("Speciality_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Customer_Group", SqlDbType.VarChar,30),
                new SqlMetaData("Drug_License_Number1", SqlDbType.VarChar,40),
                new SqlMetaData("Drug_License_Number2", SqlDbType.VarChar,40),
                new SqlMetaData("Tin_Number", SqlDbType.VarChar,30),
                new SqlMetaData("CST_Number", SqlDbType.VarChar,30),
                new SqlMetaData("Registration_Number", SqlDbType.VarChar,30),
                new SqlMetaData("SubRegion_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Address1", SqlDbType.VarChar,255),
                new SqlMetaData("Address2", SqlDbType.VarChar,255),
                new SqlMetaData("Local_Area", SqlDbType.VarChar,500),
                new SqlMetaData("City", SqlDbType.VarChar,50),
                new SqlMetaData("Pin_Code", SqlDbType.VarChar,10),
                new SqlMetaData("Phone", SqlDbType.VarChar,20),
                new SqlMetaData("Mobile", SqlDbType.VarChar,20),
                new SqlMetaData("Fax", SqlDbType.VarChar,20),
                new SqlMetaData("Email", SqlDbType.VarChar,100),
                new SqlMetaData("Destination_Place", SqlDbType.VarChar,30),
                new SqlMetaData("Product_Discount_Applicable_Status", SqlDbType.VarChar,1),
                new SqlMetaData("Special_Discount_Rate", SqlDbType.Decimal,19,2),
                new SqlMetaData("Place_Type", SqlDbType.VarChar,100),
                new SqlMetaData("Registered_Delear_Status", SqlDbType.VarChar,1),
                new SqlMetaData("Party_Location", SqlDbType.VarChar,30),
                new SqlMetaData("Locked", SqlDbType.VarChar,1),
                new SqlMetaData("DOB", SqlDbType.VarChar,30),
                new SqlMetaData("Remarks", SqlDbType.VarChar,500),
                new SqlMetaData("Primary_Contact", SqlDbType.VarChar,300),
                new SqlMetaData("Primary_Email", SqlDbType.VarChar,100),
                new SqlMetaData("Octroi_Rate", SqlDbType.Decimal,19,2),
                new SqlMetaData("Tax_Exempted_Status", SqlDbType.VarChar,1),
                new SqlMetaData("CForm_Availability", SqlDbType.VarChar,1),
                new SqlMetaData("Octroi_Reimbursment_Status", SqlDbType.VarChar,3),
                new SqlMetaData("Additional_Surcharge_Status", SqlDbType.VarChar,1),
                new SqlMetaData("CST_Applicable", SqlDbType.VarChar,1),
                new SqlMetaData("Is_Billable", SqlDbType.VarChar,1),
                new SqlMetaData("Created_By", SqlDbType.VarChar,30),
                new SqlMetaData("Effective_From", SqlDbType.VarChar,30),
                new SqlMetaData("Move_Type", SqlDbType.VarChar,10),
                new SqlMetaData("Changed_Column_Name", SqlDbType.VarChar,100),
                new SqlMetaData("New_Value", SqlDbType.VarChar,500),
                new SqlMetaData("Old_Value", SqlDbType.VarChar,500),
                new SqlMetaData("Old_Customer_Code", SqlDbType.VarChar,30),
                new SqlMetaData("Ref_Key1", SqlDbType.VarChar,30),
                new SqlMetaData("Ref_Key2", SqlDbType.VarChar,30),


          };

                foreach (var item in _data)
                {
                    SqlDataRecord record = new SqlDataRecord(metaData);
                    record.SetValue(0, item.ID);
                    record.SetValue(1, item.Company_Code);
                    record.SetValue(2, item.Customer_Code);
                    record.SetValue(3, item.Region_Code);
                    record.SetValue(4, item.Region_Type_Code);
                    record.SetValue(5, item.Customer_Status);
                    record.SetValue(6, item.Contact_Relation);
                    record.SetValue(7, item.Row_Status);
                    record.SetValue(8, item.Row_Version_No);
                    record.SetValue(9, item.CCM_Customer_ID);
                    record.SetValue(10, item.Customer_Entity_Type);
                    record.SetValue(11, item.Is_Inherited);
                    record.SetValue(12, item.Source_Region_Code);
                    record.SetValue(13, item.Customer_Name);
                    record.SetValue(14, item.Depot_Code);
                    record.SetValue(15, item.Category);
                    record.SetValue(16, item.Speciality_Code);
                    record.SetValue(17, item.Customer_Group);
                    record.SetValue(18, item.Drug_License_Number1);
                    record.SetValue(19, item.Drug_License_Number2);
                    record.SetValue(20, item.Tin_Number);
                    record.SetValue(21, item.CST_Number);
                    record.SetValue(22, item.Registration_Number);
                    record.SetValue(23, item.SubRegion_Code);
                    record.SetValue(24, item.Address1);
                    record.SetValue(25, item.Address2);
                    record.SetValue(26, item.Local_Area);
                    record.SetValue(27, item.City);
                    record.SetValue(28, item.Pin_Code);
                    record.SetValue(29, item.Phone);
                    record.SetValue(30, item.Mobile);
                    record.SetValue(31, item.Fax);
                    record.SetValue(32, item.Email);
                    record.SetValue(33, item.Destination_Place);
                    record.SetValue(34, item.Product_Discount_Applicable_Status);
                    record.SetValue(35, item.Special_Discount_Rate);
                    record.SetValue(36, item.Place_Type);
                    record.SetValue(37, item.Registered_Delear_Status);
                    record.SetValue(38, item.Party_Location);
                    record.SetValue(39, item.Locked);
                    record.SetValue(40, item.DOB);
                    record.SetValue(41, item.Remarks);
                    record.SetValue(42, item.Primary_Contact);
                    record.SetValue(43, item.Primary_Email);
                    record.SetValue(44, item.Octroi_Rate);
                    record.SetValue(45, item.Tax_Exempted_Status);
                    record.SetValue(46, item.CForm_Availability);
                    record.SetValue(47, item.Octroi_Reimbursment_Status);
                    record.SetValue(48, item.Additional_Surcharge_Status);
                    record.SetValue(49, item.CST_Applicable);
                    record.SetValue(50, item.Is_Billable);
                    record.SetValue(51, item.Created_By);
                    record.SetValue(52, item.Effective_From);
                    record.SetValue(53, item.Move_Type);
                    record.SetValue(54, item.Changed_Column_Name);
                    record.SetValue(55, item.Old_Value);
                    record.SetValue(56, item.New_Value);
                    record.SetValue(57, item.Old_Customer_Code);
                    record.SetValue(58, item.Ref_Key1);
                    record.SetValue(59, item.Ref_Key2);

                    yield return record;
                }

            }
            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return this.GetEnumerator();
            }
        }

    }
}
