using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Dapper;
using System.Data.SqlClient;
using Microsoft.SqlServer.Server;
using System.Collections;

namespace DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4
{
    public class DL_DCRChemistVisit : DapperRepository
    {
        private SPData _objSPData = null;
        private Data _objData = null;

        public DCRChemistVisitResut InsertDCRChemistVisitData(DCRChemistVisit objChemistVisit)
        {
            DCRChemistVisitResut objChemistVisitResut = new DCRChemistVisitResut();
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                string cmdText = "SP_HD_V4_InsertsChemistVisitData";
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@CV_Visit_Id", ParameterDirection.Input, SqlDbType.BigInt, 30, objChemistVisit.CV_Visit_Id);
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, objChemistVisit.Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Code", ParameterDirection.Input, SqlDbType.VarChar, 50, objChemistVisit.DCR_Code);
                _objSPData.AddParamToSqlCommand(command, "@Region_code", ParameterDirection.Input, SqlDbType.VarChar, 30, objChemistVisit.Region_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_code", ParameterDirection.Input, SqlDbType.VarChar, 30, objChemistVisit.User_code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.DateTime, 30, objChemistVisit.DCR_Actual_Date);
                _objSPData.AddParamToSqlCommand(command, "@Company_Id", ParameterDirection.Input, SqlDbType.Int, 30, objChemistVisit.Company_Id);
                _objSPData.AddParamToSqlCommand(command, "@UTC_Date", ParameterDirection.Input, SqlDbType.VarChar, 100, objChemistVisit._objDateDetails.UTC_Date);
                _objSPData.AddParamToSqlCommand(command, "@Created_DateTime", ParameterDirection.Input, SqlDbType.VarChar, 30, objChemistVisit._objDateDetails.Date);
                _objSPData.AddParamToSqlCommand(command, "@Created_TimeZone", ParameterDirection.Input, SqlDbType.VarChar, 1000, objChemistVisit._objDateDetails.TimeZone);
                _objSPData.AddParamToSqlCommand(command, "@Created_OffSet", ParameterDirection.Input, SqlDbType.VarChar, 100, objChemistVisit._objDateDetails.Off_Set);
                _objSPData.AddParamToSqlCommand(command, "@POBMandatory", ParameterDirection.Input, SqlDbType.BigInt, 10, objChemistVisit.POBMandatory);
                List<DCRChemistVisit> ls = new List<DCRChemistVisit>();
                ls.Add(objChemistVisit);
                //ls[0].Chemist_Name = objChemistVisit.Chemist_Name;
                //ls[0].Visit_Mode = objChemistVisit.Visit_Mode;
                //ls[0].Chemist_Code = objChemistVisit.Chemist_Code;
                //ls[0].Chemists_Region_Code = objChemistVisit.Chemists_Region_Code;
                //ls[0].Chemists_MDL_Number = objChemistVisit.Chemists_MDL_Number;
                //ls[0].Visit_Time = objChemistVisit.Visit_Time;
                //ls[0].CV_Visit_latitude = objChemistVisit.CV_Visit_latitude;
                //ls[0].CV_Visit_Longitude = objChemistVisit.CV_Visit_Longitude;

                _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_ChemistVisit", ParameterDirection.Input, SqlDbType.Structured, new DCRChemistVisitEnumurator(ls), "TVP_DCR_CV_ChemistVisit");
                //----Contact---
                if (objChemistVisit.lstContact == null || objChemistVisit.lstContact.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Contact", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_Contact");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_Contact", ParameterDirection.Input, SqlDbType.Structured, new DCRContactEnumurator(objChemistVisit.lstContact), "TVP_DCR_Contact");
                //---Accompanist---
                if (objChemistVisit.lsAccompanist == null || objChemistVisit.lsAccompanist.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_DOCTOR_ACC", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_DOCTOR_ACC");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_DOCTOR_ACC", ParameterDirection.Input, SqlDbType.Structured, new DCRDoctorAccompanistEnumurator(objChemistVisit.lsAccompanist), "TVP_DCR_CV_DOCTOR_ACC");

                //-----Sample-----------
                if (objChemistVisit.lsSample_Promotion == null || objChemistVisit.lsSample_Promotion.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_SAMPLE_PROMOTION", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_SAMPLE_PROMOTION");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_SAMPLE_PROMOTION", ParameterDirection.Input, SqlDbType.Structured, new DCRSample_PromotionEnumurator(objChemistVisit.lsSample_Promotion), "TVP_DCR_CV_SAMPLE_PROMOTION");

                if (objChemistVisit.lsSample_Promotion_Batch == null || objChemistVisit.lsSample_Promotion_Batch.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_Product_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_Product_Batch_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_Product_Batch_Details", ParameterDirection.Input, SqlDbType.Structured, new DCRProductDetailBatchsModelEnumurator(objChemistVisit.lsSample_Promotion_Batch), "TVP_DCR_CV_Product_Batch_Details");
                }
                //-------RCPA----Own--------
                if (objChemistVisit.lsRCPA_Own_Products == null || objChemistVisit.lsRCPA_Own_Products.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_CV_RCPA_Own_Products", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_CV_RCPA_Own_Products");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_CV_RCPA_Own_Products", ParameterDirection.Input, SqlDbType.Structured, new DCRRCPAOwnProductEnumurator(objChemistVisit.lsRCPA_Own_Products), "TVP_CV_RCPA_Own_Products");
                //-------RCPA----COMP_RCPADetail--------
                if (objChemistVisit.lsRCPA_Competitor_Products == null || objChemistVisit.lsRCPA_Competitor_Products.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_COMP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_COMP_RCPADetails");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_COMP_RCPADetails", ParameterDirection.Input, SqlDbType.Structured, new DCRRCPCOMPProductEnumurator(objChemistVisit.lsRCPA_Competitor_Products), "TVP_DCR_CV_COMP_RCPADetails");

                ////POB Header
                if (objChemistVisit.lsPOBOrderHeader == null || objChemistVisit.lsPOBOrderHeader.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Header", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_POB_Header");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Header", ParameterDirection.Input, SqlDbType.Structured, new DCROrderHeaderEnumurator(objChemistVisit.lsPOBOrderHeader), "TVP_POB_Header");

                ////POB Details
                if (objChemistVisit.lsPOBOrderDetails == null || objChemistVisit.lsPOBOrderDetails.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_POB_Details");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Details", ParameterDirection.Input, SqlDbType.Structured, new DCROrderDetailsEnumurator(objChemistVisit.lsPOBOrderDetails), "TVP_POB_Details");

                //Attachment
                if (objChemistVisit.lsAttachment == null || objChemistVisit.lsAttachment.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_ATTACHMENTS", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_ATTACHMENTS");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_ATTACHMENTS", ParameterDirection.Input, SqlDbType.Structured, new DoctorVisitAttachmentEnumurator(objChemistVisit.lsAttachment), "TVP_DCR_CV_ATTACHMENTS");
                ////Followup
                if (objChemistVisit.lsFollowUp == null || objChemistVisit.lsFollowUp.Count == 0)
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_FOLLOWUP", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_FOLLOWUP");
                else
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_FOLLOWUP", ParameterDirection.Input, SqlDbType.Structured, new DCRFollowUpEnumurator(objChemistVisit.lsFollowUp), "TVP_DCR_CV_FOLLOWUP");
                //Detail Product
                if (objChemistVisit.lsDetailed_Product == null || objChemistVisit.lsDetailed_Product.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_DETAILED_PRODUCT", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_DCR_CV_DETAILED_PRODUCT");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_DCR_CV_DETAILED_PRODUCT", ParameterDirection.Input, SqlDbType.Structured, new DCRDetailedProductsEnumurator(objChemistVisit.lsDetailed_Product), "TVP_DCR_CV_DETAILED_PRODUCT");
                }

                _objData.OpenConnection(objChemistVisit.Company_Code);
                SqlDataReader reader = _objData.ExecuteReader(command);
                if (reader.HasRows)
                    while (reader.Read())
                    {
                        objChemistVisitResut.CV_Visit_Id = Convert.ToInt32(reader["CV_Visit_Id"]);
                        objChemistVisitResut.CusErrorMsg = reader["CusErrorMsg"].ToString();
                        objChemistVisitResut.SysErrorMsg = reader["SysErrorMsg"].ToString();
                    }
            }
            catch (Exception ex)
            {
                objChemistVisitResut.CV_Visit_Id = 0;
                objChemistVisitResut.CusErrorMsg = "";
                objChemistVisitResut.SysErrorMsg = ex.Message;
            }

            return objChemistVisitResut;
        }


        public List<DCRChemistVisit> GetChemistVisitDatils(string type, string DCR_Code, int CV_Visit_Id)
        {
            List<DCRChemistVisit> lsChemistVisit = new List<DCRChemistVisit>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@type", type);
                    parameter.Add("@DCR_Code", DCR_Code);
                    parameter.Add("@CV_Visit_Id", CV_Visit_Id);
                    var lsCV = connection.QueryMultiple("SP_HD_V4_GetChemistVisitDatils", parameter, commandType: CommandType.StoredProcedure);
                    if (type.ToUpper() == "ID")
                    {
                        lsChemistVisit = lsCV.Read<DCRChemistVisit>().ToList();
                        if (lsChemistVisit.Count > 0)
                        {
                            lsChemistVisit[0].lstContact = lsCV.Read<DCRContact>().ToList();
                            lsChemistVisit[0].lsAccompanist = lsCV.Read<DCR_CV_Accompanist>().ToList();
                            lsChemistVisit[0].lsSample_Promotion = lsCV.Read<DCR_CV_Sample_Promotion>().ToList();
                            lsChemistVisit[0].lsDetailed_Product = lsCV.Read<DCR_CV_Detailed_Product>().ToList();
                            lsChemistVisit[0].lsRCPA_Doctor = lsCV.Read<DCR_CV_RCPA_Own_Products>().ToList();
                            lsChemistVisit[0].lsPOBOrderHeader = lsCV.Read<OrderHeader>().ToList();
                            lsChemistVisit[0].lsAttachment = lsCV.Read<DCR_CV_Attachment>().ToList();
                            lsChemistVisit[0].lsFollowUp = lsCV.Read<DCR_CV_FollowUp>().ToList();
                        }
                    }
                    else if (type.ToUpper() == "COUNT")
                    {
                        lsChemistVisit = lsCV.Read<DCRChemistVisit>().ToList();
                    }
                    else
                    {
                        lsChemistVisit = lsCV.Read<DCRChemistVisit>().ToList();
                        if (lsChemistVisit.Count > 0)
                        {
                            lsChemistVisit[0].lstContact = lsCV.Read<DCRContact>().ToList();
                            lsChemistVisit[0].lsAccompanist = lsCV.Read<DCR_CV_Accompanist>().ToList();
                            lsChemistVisit[0].lsSample_Promotion = lsCV.Read<DCR_CV_Sample_Promotion>().ToList();
                            lsChemistVisit[0].lsPOBOrderHeader = lsCV.Read<OrderHeader>().ToList();
                            lsChemistVisit[0].lsPOBOrderDetails = lsCV.Read<OrderDetails>().ToList();
                            lsChemistVisit[0].lsDetailed_Product = lsCV.Read<DCR_CV_Detailed_Product>().ToList();
                            lsChemistVisit[0].lsFollowUp = lsCV.Read<DCR_CV_FollowUp>().ToList();
                            lsChemistVisit[0].lsAttachment = lsCV.Read<DCR_CV_Attachment>().ToList();
                            lsChemistVisit[0].lsRCPA_Own_Products = lsCV.Read<DCR_CV_RCPA_Own_Products>().ToList();
                            lsChemistVisit[0].lsRCPA_Competitor_Products = lsCV.Read<DCR_CV_RCPA_Competitor_Products>().ToList();
                            lsChemistVisit[0].lsRCPA_Doctor = lsCV.Read<DCR_CV_RCPA_Own_Products>().ToList();
                        }
                       
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return lsChemistVisit;
        }
        public string DeleteChemistVisitData(int CV_Visit_Id)
        {
            string rValue = string.Empty;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@CV_Visit_Id", CV_Visit_Id);
                    connection.Execute("SP_HD_V4_DeleteChemistVisitData", parameter, commandType: CommandType.StoredProcedure);
                    rValue = "success";
                }
            }
            catch (Exception ex)
            {
                rValue = ex.Message;
            }
            return rValue;
        }
        public string GetRegionModuleAccess(string region_Code, string userCode,string flag)
        {
            string module_Code = string.Empty;
            try
            {
                List<ModuleAccess> lsModuleAccess = new List<ModuleAccess>();
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Region_Code", region_Code);
                    parameter.Add("@User_Code", userCode);
                    var moduleAccess = connection.QueryMultiple("USP_HD_GET_ModuleAccess", parameter, commandType: CommandType.StoredProcedure);
                    lsModuleAccess = moduleAccess.Read<ModuleAccess>().ToList();
                   
                    foreach (var item in lsModuleAccess)
                    {
                        if (item.Module_Code == "CHEMIST_DAY" && flag == "F")
                        {
                            module_Code = item.Module_Code;
                        }
                        if (item.Module_Code=="HOSPITAL" && flag=="A")
                        {
                            module_Code = item.Module_Code;
                        }
                    }
                    connection.Close();
                }
            }
            catch
            {
                throw;
            }
            finally
            {

            }
            return module_Code;

        }


        public List<string> GetChemistVistControls(string Company_Code, string User_Code)
        {
            List<string> rValue = new List<string>();
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@Company_Code", Company_Code);
                    parameter.Add("@User_Code", User_Code);
                    rValue = connection.Query<string>("SP_GetChemistVisitControls", parameter, commandType: CommandType.StoredProcedure).ToList();

                }
            }
            catch (Exception ex)
            {
                rValue.Add(ex.Message);
            }
            return rValue;
        }

        public string GetChemistAccMandatory(string Company_Code, string User_Code, string DCR_Date)
        {
            string drAccMandatory = "No";
            _objSPData = new SPData();
            _objData = new Data();
            try
            {

                string cmdText = "SP_HD_V4_GetChemistAccompanistMand";

                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, User_Code);
                _objSPData.AddParamToSqlCommand(command, "@DCR_Date", ParameterDirection.Input, SqlDbType.Date, 30, DCR_Date);
                _objData.OpenConnection(Company_Code);
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                    if (dataReader.HasRows)
                        while (dataReader.Read())
                            drAccMandatory = dataReader["result"].ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return drAccMandatory;
        }


        public string GetAccompanistMandatoryInChemistVisit(string user_code, DateTime dcr_date, string company_Code)
        {
            string rValue = "NO";
            DataSet ds = new DataSet();
            // Creates Instance
            _objSPData = new SPData();
            _objData = new Data();
            try
            {
                var DCRFollowUp = new List<DCRFollowUp>();
                string cmdText = "SP_HD_V4_GetAccompanistMandatoryInChemistVisit";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@user_code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                _objSPData.AddParamToSqlCommand(command, "@dcr_date", ParameterDirection.Input, SqlDbType.Date, 30, dcr_date);

                // Opens the connection.
                _objData.OpenConnection(company_Code);

                SqlParameter returnValue = new SqlParameter("@acc_name", SqlDbType.VarChar);
                returnValue.Direction = ParameterDirection.Output;
                returnValue.Size = 100;
                command.Parameters.Add(returnValue);

                _objData.OpenConnection(company_Code);
                _objData.ExecuteNonQuery(command);
                rValue = command.Parameters["@acc_name"].Value.ToString();
            }
            finally
            {
                _objData.CloseConnection();
            }

            return rValue;
        }





        public string GetRCPA_ChemistPrevilageCheck(string user_code, DateTime dcr_date, string company_Code)
        {
            string drAccMandatory = string.Empty;
            try
            {
                // string cmdText = "SP_ChemistRCPADoctorCheck";
                // SqlCommand command = new SqlCommand(cmdText);
                // command.CommandType = CommandType.StoredProcedure;
                //_objSPData= new SPData();
                //_objData = new Data();
                // _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, company_Code);
                // _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, user_code);
                // _objSPData.AddParamToSqlCommand(command, "@DCR_Date", ParameterDirection.Input, SqlDbType.Date, 30, dcr_date);
                // _objData.OpenConnection(company_Code);

                using (IDbConnection connection = IDbOpenConnection())
                {
                    var parameter = new DynamicParameters();
                    parameter.Add("@User_Code", user_code);
                    parameter.Add("@DCR_Date", dcr_date);
                    parameter.Add("@Company_Code", company_Code);
                    drAccMandatory = connection.Query<string>("SP_ChemistRCPADoctorCheck", parameter, commandType: CommandType.StoredProcedure).ToList()[0].ToString();

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }



            return drAccMandatory;
        }
    }
    public class DCRChemistVisitEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRChemistVisitEnumurator(IEnumerable<DCRChemistVisit> data)
        {
            _data = data;
        }
        private IEnumerable<DCRChemistVisit> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
        // new SqlMetaData("DCR_Chemists_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("DCR_Chemists_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("Chemists_Name", SqlDbType.VarChar, 50),
         new SqlMetaData("Visit_Mode",SqlDbType.VarChar,10),
         new SqlMetaData("Chemist_Code", SqlDbType.VarChar, 30),
         //new SqlMetaData("PO_Amount", SqlDbType.Decimal),
         new SqlMetaData("Chemists_Region_Code",SqlDbType.VarChar,50),
         new SqlMetaData("Chemists_MDL_Number",SqlDbType.VarChar,20),
         new SqlMetaData("Visit_Time",SqlDbType.VarChar,20),
         new SqlMetaData("CV_Visit_latitude",SqlDbType.VarChar,20),
         new SqlMetaData("CV_Visit_Longitude",SqlDbType.VarChar,20),
         new SqlMetaData("Remarks_By_User",SqlDbType.VarChar,200),
         new SqlMetaData("Business_Category_Id",SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.DCR_Chemists_Code);
                record.SetValue(1, item.Chemists_Name);
                record.SetValue(2, item.Visit_Mode);
                record.SetValue(3, item.Chemist_Code);
                record.SetValue(4, item.Chemists_Region_Code);
                record.SetValue(5, item.Chemists_MDL_Number);
                record.SetValue(6, item.Visit_Time);
                record.SetValue(7, item.CV_Visit_latitude);
                record.SetValue(8, item.CV_Visit_Longitude);
                record.SetValue(9, item.Remarks_By_User);
                record.SetValue(10, item.Business_Category_Id);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRDoctorAccompanistEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRDoctorAccompanistEnumurator(IEnumerable<DCR_CV_Accompanist> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_Accompanist> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Acc_User_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Acc_User_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Acc_Region_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Is_Only_For_Chemist", SqlDbType.Char, 1),
         new SqlMetaData("Acc_User_Type_Name", SqlDbType.VarChar, 30),
         new SqlMetaData("Is_Accompanied_call", SqlDbType.VarChar, 3),

          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Acc_User_Name);
                record.SetValue(1, item.Acc_User_Code);
                record.SetValue(2, item.Acc_Region_Code);
                record.SetValue(3, item.Is_Only_For_Chemisit);
                record.SetValue(4, item.Acc_User_Type_Name);
                record.SetValue(5, item.Is_Accompanied_call);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRContactEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRContactEnumurator(IEnumerable<DCRContact> data)
        {
            _data = data;
        }
        private IEnumerable<DCRContact> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Contact_Id", SqlDbType.Int),
         new SqlMetaData("Contact_Name", SqlDbType.VarChar, 120),
         new SqlMetaData("Mobile", SqlDbType.VarChar, 10),
         new SqlMetaData("Email_Id", SqlDbType.VarChar, 100),

          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Contact_Id);
                record.SetValue(1, item.Contact_Name);
                record.SetValue(2, item.Mobile);
                record.SetValue(3, item.Email_Id);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRFollowUpEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRFollowUpEnumurator(IEnumerable<DCR_CV_FollowUp> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_FollowUp> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Tasks", SqlDbType.VarChar, 250),
         new SqlMetaData("Due_Date", SqlDbType.Date),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Tasks);
                record.SetValue(1, item.Due_Date);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DoctorVisitAttachmentEnumurator : IEnumerable<SqlDataRecord>
    {

        public DoctorVisitAttachmentEnumurator(IEnumerable<DCR_CV_Attachment> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_Attachment> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Blob_Url", SqlDbType.VarChar, 500),
         new SqlMetaData("Uploaded_File_Name", SqlDbType.VarChar,200),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Blob_Url);
                record.SetValue(1, item.Uploaded_File_Name);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRSample_PromotionEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRSample_PromotionEnumurator(IEnumerable<DCR_CV_Sample_Promotion> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_Sample_Promotion> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Quantity_Provided", SqlDbType.Int),
         new SqlMetaData("CV_Customer_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Remarks", SqlDbType.VarChar, 30),
         new SqlMetaData("Ref_Key1", SqlDbType.Char,1)
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Product_Code);
                record.SetValue(1, item.Quantity_Provided);
                record.SetValue(2, item.CV_Customer_Code);
                record.SetValue(3, item.Remarks);
                record.SetValue(4, item.Ref_Key1);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCROrderHeaderEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCROrderHeaderEnumurator(IEnumerable<OrderHeader> data)
        {
            _data = data;
        }
        private IEnumerable<OrderHeader> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("ID", SqlDbType.Int),
         new SqlMetaData("Client_Order_ID", SqlDbType.Int),
         new SqlMetaData("Order_Id", SqlDbType.Int),
         new SqlMetaData("Customer_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Region_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Stockist_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Stockist_Region_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Order_Number", SqlDbType.Int),
         new SqlMetaData("Total_POB_Value", SqlDbType.Decimal,19,2),
         new SqlMetaData("Total_Qty", SqlDbType.Decimal,19,2),
         new SqlMetaData("No_Of_Products", SqlDbType.SmallInt),
         new SqlMetaData("Remarks", SqlDbType.VarChar,500),
         new SqlMetaData("Order_Status", SqlDbType.TinyInt),
         new SqlMetaData("Order_Mode", SqlDbType.TinyInt),
         new SqlMetaData("Source_Of_Entry", SqlDbType.TinyInt),
         new SqlMetaData("Due_Date", SqlDbType.Date),
         new SqlMetaData("Favouring_User_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Favouring_Region_Code", SqlDbType.VarChar,12),
         new SqlMetaData("Created_By", SqlDbType.VarChar,12),
         new SqlMetaData("Created_Date", SqlDbType.DateTime),
         new SqlMetaData("Action",SqlDbType.Int),
         new SqlMetaData("Customer_Name", SqlDbType.VarChar,50),
         new SqlMetaData("Customer_Speciality", SqlDbType.VarChar,50),
         new SqlMetaData("MDL_Number", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Category_Code", SqlDbType.VarChar,12),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Client_Order_Id);
                record.SetValue(1, item.Client_Order_Id);
                record.SetValue(2, item.Order_Id);
                record.SetValue(3, item.Customer_Code);
                record.SetValue(4, item.Customer_Region_Code);
                record.SetValue(5, item.Stockist_Code);
                record.SetValue(6, item.Stockist_Region_Code);
                record.SetValue(7, item.Order_Number);
                record.SetValue(8, item.Total_POB_Value);
                record.SetValue(9, item.Total_Qty);
                record.SetValue(10, item.No_Of_Products);
                record.SetValue(11, item.Remarks);
                record.SetValue(12, item.Order_Status);
                record.SetValue(13, item.Order_Mode);
                record.SetValue(14, item.Source_Of_Entry);
                record.SetValue(15, item.Order_Due_Date);
                record.SetValue(16, item.Favouring_User_Code);
                record.SetValue(17, item.Favouring_Region_Code);
                record.SetValue(18, item.Created_By);
                record.SetValue(19, DateTime.Now);
                record.SetValue(20, item.Action);
                record.SetValue(21, item.Customer_Name);
                record.SetValue(22, item.Customer_Speciality);
                record.SetValue(23, item.MDL_Number);
                record.SetValue(24, item.Customer_Category_Code);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }

    public class DCROrderDetailsEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCROrderDetailsEnumurator(IEnumerable<OrderDetails> data)
        {
            _data = data;
        }
        private IEnumerable<OrderDetails> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("ID", SqlDbType.Int),
         new SqlMetaData("Order_Id", SqlDbType.Int),
         new SqlMetaData("Client_Order_ID", SqlDbType.Int),
         new SqlMetaData("Product_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Product_Qty", SqlDbType.Decimal,19,2),
         new SqlMetaData("Unit_Rate", SqlDbType.Decimal,19,2),
         new SqlMetaData("Amount", SqlDbType.Decimal,19,2),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.ID);
                record.SetValue(1, item.Order_Id);
                record.SetValue(2, item.Client_Order_Id);
                record.SetValue(3, item.Product_Code);
                record.SetValue(4, item.Product_Qty);
                record.SetValue(5, item.Unit_Rate);
                record.SetValue(6, item.Amount);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRRCPAOwnProductEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRRCPAOwnProductEnumurator(IEnumerable<DCR_CV_RCPA_Own_Products> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_RCPA_Own_Products> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Customer_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Name", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Speciality_Name", SqlDbType.VarChar,50),
         new SqlMetaData("Customer_Category_Name", SqlDbType.VarChar,50),
         new SqlMetaData("Customer_MDLNumber", SqlDbType.VarChar,30),
         new SqlMetaData("Product_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Product_Name", SqlDbType.VarChar,30),
         new SqlMetaData("Qty", SqlDbType.Int),
         new SqlMetaData("Remarks",SqlDbType.VarChar,500),
         new SqlMetaData("rxnumber",SqlDbType.Int),
         new SqlMetaData("clientId", SqlDbType.Int),
         new SqlMetaData("POB", SqlDbType.Int),
         new SqlMetaData("Region_Code",SqlDbType.VarChar,30)
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Customer_Code);
                record.SetValue(1, item.Customer_Name);
                record.SetValue(2, item.Customer_Speciality_Name);
                record.SetValue(3, item.Customer_Category_Name);
                record.SetValue(4, item.Customer_MDLNumber);
                record.SetValue(5, item.Product_Code);
                record.SetValue(6, item.Product_Name);
                record.SetValue(7, item.Qty);
                record.SetValue(8, item.Remarks);
                record.SetValue(9, item.Rxnumber);
                record.SetValue(10, Convert.ToInt32(item.clientId));
                record.SetValue(11, Convert.ToInt32(item.POB));
                record.SetValue(12, item.Region_Code);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRRCPCOMPProductEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRRCPCOMPProductEnumurator(IEnumerable<DCR_CV_RCPA_Competitor_Products> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_RCPA_Competitor_Products> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Competitor_Product_Name", SqlDbType.VarChar,30),
         new SqlMetaData("Competitor_Product_Code", SqlDbType.VarChar,30),
         new SqlMetaData("Qty", SqlDbType.Int),
          new SqlMetaData("clientId", SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Competitor_Product_Name);
                record.SetValue(1, item.Competitor_Product_Code);
                record.SetValue(2, Convert.ToInt32(item.Qty));
                record.SetValue(3, Convert.ToInt32(item.clientId));
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRDetailedProductsEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRDetailedProductsEnumurator(IEnumerable<DCR_CV_Detailed_Product> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_Detailed_Product> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("Sales_Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Sales_Product_Name", SqlDbType.VarChar, 30),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                record.SetValue(0, item.Sales_Product_Code);
                record.SetValue(1, item.Sales_Product_Name);
                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
    public class DCRProductDetailBatchsModelEnumurator : IEnumerable<SqlDataRecord>
    {

        public DCRProductDetailBatchsModelEnumurator(IEnumerable<DCR_CV_Sample_Promotion> data)
        {
            _data = data;
        }
        private IEnumerable<DCR_CV_Sample_Promotion> _data;
        public IEnumerator<SqlDataRecord> GetEnumerator()
        {
            SqlMetaData[] metaData = {
         new SqlMetaData("DCR_Product_Code", SqlDbType.VarChar, 50),
         new SqlMetaData("Product_Code", SqlDbType.VarChar, 30),
         new SqlMetaData("Batch_Number", SqlDbType.VarChar, 30),
         new SqlMetaData("Quantity_Provided", SqlDbType.Int),
          };

            foreach (var item in _data)
            {
                SqlDataRecord record = new SqlDataRecord(metaData);
                //   record.SetValue(0, item.DCR_Product_Code);
                record.SetValue(1, item.Product_Code);
                record.SetValue(2, item.Batch_Number);
                record.SetValue(3, item.Quantity_Provided);

                yield return record;
            }

        }
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}
