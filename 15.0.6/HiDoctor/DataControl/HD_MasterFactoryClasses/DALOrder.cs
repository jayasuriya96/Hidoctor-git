using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using Dapper;
using MVCModels;
using Microsoft.SqlServer.Server;

namespace DataControl
{
    public class DALOrder : DapperRepository
    {
        public Order objOrder;

        public DALOrder()
        {
            objOrder = new Order();
        }

        public IEnumerable<OrderList> GetOrderList()
        {
            IEnumerable<OrderList> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@StartDate", objOrder.orderInputs.startDate);
                    p.Add("@EndDate", objOrder.orderInputs.endDate);
                    p.Add("@Region_Code", objOrder.orderInputs.Region_Code);
                    p.Add("@Order_Status", "ALL");
                    lstContent = connection.Query<MVCModels.OrderList>("SP_HDGet_OrderList", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", objOrder.orderInputs.User_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }

        public string PutOrderStatus()
        {
            string strResult;
            int rCount = 0;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Order_Id", objOrder.orderInputs.Order_Id);
                    p.Add("@Order_Status", objOrder.orderInputs.Order_Status);
                    p.Add("@Order_Mode", objOrder.orderInputs.Order_Mode);
                    p.Add("@Created_By", objOrder.orderInputs.User_Code);
                    p.Add("@DCR_Actual_Date", objOrder.orderInputs.Order_Date);
                    p.Add("@Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                    connection.Query<int>("SP_HDUpdateOrderStatus", p, commandType: CommandType.StoredProcedure);
                    rCount = p.Get<int>("@Result");
                    connection.Close();

                    if (rCount > 0)
                    {
                        strResult = "Success";
                    }
                    else
                    {
                        strResult = "Failed";
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", objOrder.orderInputs.User_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return strResult;
        }


        public List<OrderProductDetails> GetProduct()
        {
            Data _objData = new Data();
            try
            {
                // Creates Instance
                SPData _objSPData = new SPData();

                List<OrderProductDetails> lstdcrProductModel = new List<OrderProductDetails>();
                string cmdText = "SP_HD_V4_GetSaleProducts";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                _objSPData.AddParamToSqlCommand(command, "@Company_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, objOrder.orderInputs.Company_Code);
                _objSPData.AddParamToSqlCommand(command, "@User_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                _objSPData.AddParamToSqlCommand(command, "@Region_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, objOrder.orderInputs.Region_Code);

                // Opens the connection.
                _objData.OpenConnection(objOrder.orderInputs.Company_Code);

                // Execuete the data reader.
                using (SqlDataReader dataReader = _objData.ExecuteReader(command))
                {
                    // Converts the DataReader to User Products list.
                    lstdcrProductModel = GetProductList(dataReader);
                }

                // returns the list.
                return lstdcrProductModel;

            }
            finally
            {
                _objData.CloseConnection();
            }
        }


        private List<OrderProductDetails> GetProductList(SqlDataReader dataReader)
        {
            List<OrderProductDetails> lstDCRProductsDetails = new List<OrderProductDetails>();
            while (dataReader.Read())
            {
                OrderProductDetails dcrProductsDetailsModel = new OrderProductDetails();
                if (dataReader["Product_Name"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.label = dataReader["Product_Name"].ToString();
                }
                if (dataReader["Product_Code"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.value = dataReader["Product_Code"].ToString();
                }
                if (dataReader["Unit_Rate"] != DBNull.Value)
                {
                    dcrProductsDetailsModel.Unit_Rate = Convert.ToDecimal(dataReader["Unit_Rate"].ToString());
                }
                if (dataReader["Price_group_Code"] != DBNull.Value)
                {
                     dcrProductsDetailsModel.Price_group_Code = dataReader["Price_group_Code"].ToString();
                }
                lstDCRProductsDetails.Add(dcrProductsDetailsModel);
            }
            return lstDCRProductsDetails;
        }


        public object SetOrder()
        {
            string strReturn = "";
            Data _objData = new Data();
            try
            {
                // Creates Instance
                SPData _objSPData = new SPData();

                string cmdText = "SP_HDInsertPOBOrder";

                // Set Command object.
                SqlCommand command = new SqlCommand(cmdText);
                command.CommandType = CommandType.StoredProcedure;

                // Add the parameters to command object.
                if (objOrder.orderAdd.lstHeader.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Header", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_POB_Header");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Header", ParameterDirection.Input, SqlDbType.Structured, new DCROrderHeaderEnumurator(objOrder.orderAdd.lstHeader), "TVP_POB_Header");
                }

                 if (objOrder.orderAdd.lstDetails.Count == 0)
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Details", ParameterDirection.Input, SqlDbType.Structured, null, "TVP_POB_Details");
                }
                else
                {
                    _objSPData.AddParamToSqlCommandWithTypeName(command, "@TVP_POB_Details", ParameterDirection.Input, SqlDbType.Structured, new DCROrderDetailsEnumurator(objOrder.orderAdd.lstDetails), "TVP_POB_Details");
                }

                _objSPData.AddParamToSqlCommand(command, "@DCR_Status", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                if (objOrder.orderAdd.lstHeader[0].Order_Id == -1)
                {
                      _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, DateTime.Now.Date.ToShortDateString());
                }
                else
                {
                    _objSPData.AddParamToSqlCommand(command, "@DCR_Actual_Date", ParameterDirection.Input, SqlDbType.VarChar, 30, objOrder.orderAdd.lstHeader[0].Order_Date);
                }
              
                //_objSPData.AddParamToSqlCommand(command, "@DCR_Visit_Code", ParameterDirection.Input, SqlDbType.VarChar, 30, "");
                _objSPData.AddParamToSqlCommand(command, "@Result", ParameterDirection.Output, SqlDbType.VarChar, 500, strReturn);
                // Opens the connection.
                _objData.OpenConnection(objOrder.orderInputs.Company_Code);
                _objData.ExecuteNonQuery(command);

            }
            finally
            {
                _objData.CloseConnection();
            }

            return strReturn;

        }




        public OrderAdd GetOrder()
        {
            OrderAdd objOrderEdit = new OrderAdd();
            try 
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    using (var multi = connection.QueryMultiple("SP_HDGetDCRPOBDetails",
                                  new { Order_Id = objOrder.orderInputs.Order_Id },
                                  commandType: CommandType.StoredProcedure))
                    {
                        objOrderEdit.lstHeader = multi.Read<OrderHeader>().ToList();
                        objOrderEdit.lstDetails = multi.Read<OrderDetails>().ToList();
                    }
                    connection.Close();
                }

            }
            catch (Exception ex) 
            { 
                throw;
            }
            return objOrderEdit;
        }


        public FavouringUser GetUserDetails()
        {
            FavouringUser content;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", objOrder.orderInputs.Region_Code);
                    content = connection.Query<FavouringUser>("SP_HDGetFavouringUserName", p, commandType: CommandType.StoredProcedure).SingleOrDefault();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("userCode", objOrder.orderInputs.Region_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return content;
        }


        public IEnumerable<LineOfBusiness> GetLineOfBusiness()
        {
            IEnumerable<LineOfBusiness> lstContent;
            try
            {
                using (IDbConnection connection = IDbOpenConnection())
                {
                    var p = new DynamicParameters();
                    p.Add("@Region_Code", objOrder.orderInputs.Region_Code);
                    lstContent = connection.Query<MVCModels.LineOfBusiness>("SP_HDGetLineOfBusiness", p, commandType: CommandType.StoredProcedure);
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("RegionCode", objOrder.orderInputs.Region_Code);
                Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }

            return lstContent;
        }




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
         new SqlMetaData("Action", SqlDbType.Int),
         new SqlMetaData("Customer_Name", SqlDbType.VarChar,50),
         new SqlMetaData("Customer_Speciality", SqlDbType.VarChar,50),
         new SqlMetaData("MDL_Number", SqlDbType.VarChar,30),
         new SqlMetaData("Customer_Category_Code", SqlDbType.VarChar,12),
          };

        foreach (var item in _data)
        {
            SqlDataRecord record = new SqlDataRecord(metaData);
            record.SetValue(0, item.ID);
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