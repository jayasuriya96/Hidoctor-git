using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ActivityFactoryClasses
{
    public class BLPromotionalInput
    {
        DALPromotionalInput _objDALPromotionalInput = new DALPromotionalInput();
        public IEnumerable<MVCModels.PromotionalInputUserModel> GetUsers(string companyCode,string usercode,string effective_from,string effective_to)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetUsers(companyCode, usercode, effective_from, effective_to);
        }
        public IEnumerable<MVCModels.Productmodel> GetUserProductdata(string companyCode, string UserCode)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetUserProductdata(companyCode, UserCode);
        }
        public bool Insertuserproduct(string companyCode,string usercode,int companyid, List<MVCModels.UserProductModel> lstuserproduct,string UserCode)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            //  List<MVCModels.Reportuserhierarchy> lstuserdisable = new List<MVCModels.Reportuserhierarchy>();

            // string[] userdisable = null;
            DataTable dtdisable = null;

            if (lstuserproduct.Count >= 1)
            {
                dtdisable = new DataTable();
                dtdisable.Columns.Add("ID", typeof(int));
                dtdisable.Columns.Add("Company_Code", typeof(string));
                dtdisable.Columns.Add("SourceUserCode", typeof(string));
                dtdisable.Columns.Add("SourceUserName", typeof(string));
                dtdisable.Columns.Add("DestinationUserCode", typeof(string));
                dtdisable.Columns.Add("DestinationUserName", typeof(string));
                dtdisable.Columns.Add("RequestedBy", typeof(string));
                dtdisable.Columns.Add("Status", typeof(int));
                dtdisable.Columns.Add("Remarks", typeof(string));
                dtdisable.Columns.Add("CompanyId", typeof(int));
                dtdisable.Columns.Add("UserCode", typeof(string));
                dtdisable.Columns.Add("Logical_Quantity", typeof(int));
                dtdisable.Columns.Add("VarianceCount", typeof(int));
                dtdisable.Columns.Add("Physical_Quantity", typeof(int));
                dtdisable.Columns.Add("ProductCode", typeof(string));
                dtdisable.Columns.Add("Batch_Number", typeof(string));
                dtdisable.Columns.Add("Approved_By", typeof(string));
                dtdisable.Columns.Add("Approved_Date", typeof(string));
                dtdisable.Columns.Add("Product_Name", typeof(string));
                dtdisable.Columns.Add("Product_Type_Code", typeof(string));
                dtdisable.Columns.Add("Product_Type_Name", typeof(string));

                int j = 0;
                for (int i = 0; i < lstuserproduct.Count; i++)
                {
                    j++;
                    dtdisable.Rows.Add(j, companyCode,lstuserproduct[i].SourceUserCode,
                        lstuserproduct[i].SourceUserName,
                        lstuserproduct[i].DestinationUserCode, 
                        lstuserproduct[i].DestinationUserName,
                        usercode,
                        lstuserproduct[i].Status,
                        lstuserproduct[i].Remarks,
                        companyid,
                        usercode,
                        lstuserproduct[i].Logical_Quantity,
                        lstuserproduct[i].VarianceCount,
                        lstuserproduct[i].Physical_Quantity, lstuserproduct[i].ProductCode,
                        lstuserproduct[i].Batch_Number, lstuserproduct[i].Approved_By,
                          lstuserproduct[i].Approved_Date,lstuserproduct[i].Product_Name, lstuserproduct[i].Product_Type_Code, 
                         lstuserproduct[i].Product_Type_Name);
                }
            }
            return _objDALPromotionalInput.Insertuserproduct(companyCode, usercode, companyid, lstuserproduct, UserCode, dtdisable);
        }
        public IEnumerable<MVCModels.PromotionalInputUserModel> GetUsersdata(string companyCode, string usercode)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetUsersdata(companyCode, usercode);
        }
        public IEnumerable<MVCModels.Productmodel> GetRejectedUserProductdata(string companyCode,string UserCode, string username, string sourceusercode, string destinationusercode, int transferid)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetRejectedUserProductdata(companyCode, UserCode, username, sourceusercode, destinationusercode, transferid).ToList();
        }
        public IEnumerable<MVCModels.promotionalApprovalModel> GetUsersForApproval(string companyCode, string usercode)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetUsersForApproval(companyCode, usercode);
        }
        public IEnumerable<MVCModels.ViewTransferModel> GetUserDetailsOnView(string companyCode, string usercode, string username, string sourceusercode, string destinationusercode, int transferid)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetUserDetailsOnView(companyCode, usercode, username, sourceusercode,destinationusercode,transferid);
        }
        public bool ApproveUserRequest(string companyCode, string usercode, int companyid, List<MVCModels.UserProductModel> lstuserproduct)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            //  List<MVCModels.Reportuserhierarchy> lstuserdisable = new List<MVCModels.Reportuserhierarchy>();

            // string[] userdisable = null;
            DataTable dtdisable = null;

            if (lstuserproduct.Count >= 1)
            {
                dtdisable = new DataTable();
                dtdisable.Columns.Add("ID", typeof(int));
                dtdisable.Columns.Add("Company_Code", typeof(string));
                dtdisable.Columns.Add("SourceUserCode", typeof(string));
                dtdisable.Columns.Add("SourceUserName", typeof(string));
                dtdisable.Columns.Add("DestinationUserCode", typeof(string));
                dtdisable.Columns.Add("DestinationUserName", typeof(string));
                dtdisable.Columns.Add("RequestedBy", typeof(string));
                dtdisable.Columns.Add("Status", typeof(int));
                dtdisable.Columns.Add("Remarks", typeof(string));
                dtdisable.Columns.Add("CompanyId", typeof(int));
                dtdisable.Columns.Add("UserCode", typeof(string));
                dtdisable.Columns.Add("Logical_Quantity", typeof(int));
                dtdisable.Columns.Add("Variance_Count", typeof(int));
                dtdisable.Columns.Add("Physical_Quantity", typeof(int));
                dtdisable.Columns.Add("ProductCode", typeof(string));
                dtdisable.Columns.Add("Batch_Number", typeof(string));
                dtdisable.Columns.Add("Approved_By", typeof(string));
                dtdisable.Columns.Add("Approved_Date", typeof(string));
                dtdisable.Columns.Add("Product_Name", typeof(string));
                dtdisable.Columns.Add("Product_Type_Code", typeof(string));
                dtdisable.Columns.Add("Product_Type_Name", typeof(string));
                dtdisable.Columns.Add("Delivery_Challan_Number", typeof(string));
                dtdisable.Columns.Add("Trans_Id", typeof(int));
                int j = 0;
                for (int i = 0; i < lstuserproduct.Count; i++)
                {
                    j++;
                    dtdisable.Rows.Add(j, companyCode, lstuserproduct[i].SourceUserCode,
                        lstuserproduct[i].SourceUserName,
                        lstuserproduct[i].DestinationUserCode,
                        lstuserproduct[i].DestinationUserName,
                        usercode,
                        lstuserproduct[i].Status,
                        lstuserproduct[i].Remarks,
                        companyid,
                        usercode,
                        lstuserproduct[i].Logical_Quantity,
                         lstuserproduct[i].Variance_Count,
                        lstuserproduct[i].Physical_Quantity, lstuserproduct[i].Product_Code,
                        lstuserproduct[i].Batch_Number, lstuserproduct[i].Approved_By,
                          lstuserproduct[i].Approved_Date, lstuserproduct[i].Product_Name, lstuserproduct[i].Product_Type_Code,
                         lstuserproduct[i].Product_Type_Name,lstuserproduct[i].Delivery_Challan_Number, lstuserproduct[i].Trans_Id);
                }
            }
            return _objDALPromotionalInput.ApproveUserRequest(companyCode, usercode, companyid, lstuserproduct, dtdisable);
        }
        public bool Resubmitproductdata(List<MVCModels.UserProductModel> lstuserproduct)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            //  List<MVCModels.Reportuserhierarchy> lstuserdisable = new List<MVCModels.Reportuserhierarchy>();

            // string[] userdisable = null;
            DataTable dtdisable = null;

            if (lstuserproduct.Count >= 1)
            {
                dtdisable = new DataTable();
                dtdisable.Columns.Add("ID", typeof(int));
                dtdisable.Columns.Add("SourceUserCode", typeof(string));         
                dtdisable.Columns.Add("DestinationUserCode", typeof(string));
                dtdisable.Columns.Add("Product_Code", typeof(string));
                dtdisable.Columns.Add("Trans_Id", typeof(int));
                dtdisable.Columns.Add("Remarks", typeof(string));
                int j = 0;
                for (int i = 0; i < lstuserproduct.Count; i++)
                {
                    j++;
                    dtdisable.Rows.Add(j,lstuserproduct[i].SourceUserCode,                       
                        lstuserproduct[i].DestinationUserCode,                     
                        lstuserproduct[i].Product_Code,                       
                        lstuserproduct[i].Trans_Id,
                        lstuserproduct[i].Remarks);
                }
            }
            return _objDALPromotionalInput.Resubmitproductdata(lstuserproduct, dtdisable);
        }
        public bool RejectUserRequest(string companyCode, string usercode, List<MVCModels.RejectedRequestModel> lstuserproduct)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            //  List<MVCModels.Reportuserhierarchy> lstuserdisable = new List<MVCModels.Reportuserhierarchy>();

            // string[] userdisable = null;
            DataTable dtdisable = null;

            if (lstuserproduct.Count >= 1)
            {
                dtdisable = new DataTable();
                dtdisable.Columns.Add("ID", typeof(int));
             //   dtdisable.Columns.Add("Company_Code", typeof(string));
                // dtdisable.Columns.Add("Status", typeof(int));
                dtdisable.Columns.Add("Rejected_Remarks", typeof(string));
                dtdisable.Columns.Add("Trans_Id", typeof(int));
                dtdisable.Columns.Add("Product_Code", typeof(string));



                int j = 0;
                for (int i = 0; i < lstuserproduct.Count; i++)
                {
                    j++;
                    dtdisable.Rows.Add(j,// companyCode, //lstuserproduct[i].SourceUserCode,
                                         // lstuserproduct[i].SourceUserName,
                                         // lstuserproduct[i].DestinationUserCode,
                                         // lstuserproduct[i].DestinationUserName,
                                         // usercode,
                                         //lstuserproduct[i].Status,
                        lstuserproduct[i].Rejected_Remarks,
                        lstuserproduct[i].Trans_Id,
                        lstuserproduct[i].Product_Code);



                  
                }
            }
            return _objDALPromotionalInput.RejectUserRequest(companyCode, usercode, lstuserproduct, dtdisable);
        }
        public bool Canceluserrequest(string companyCode, string usercode, int companyid, List<MVCModels.UserProductModel> lstuserproduct)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            //  List<MVCModels.Reportuserhierarchy> lstuserdisable = new List<MVCModels.Reportuserhierarchy>();

            // string[] userdisable = null;
            DataTable dtdisable = null;

            if (lstuserproduct.Count >= 1)
            {
                dtdisable = new DataTable();
                dtdisable.Columns.Add("ID", typeof(int));
                dtdisable.Columns.Add("Company_Code", typeof(string));
                dtdisable.Columns.Add("SourceUserCode", typeof(string));
                dtdisable.Columns.Add("SourceUserName", typeof(string));
                dtdisable.Columns.Add("DestinationUserCode", typeof(string));
                dtdisable.Columns.Add("DestinationUserName", typeof(string));
                dtdisable.Columns.Add("RequestedBy", typeof(string));
                dtdisable.Columns.Add("Status", typeof(int));
                dtdisable.Columns.Add("Remarks", typeof(string));
                dtdisable.Columns.Add("CompanyId", typeof(int));
                dtdisable.Columns.Add("UserCode", typeof(string));
                dtdisable.Columns.Add("Logical_Quantity", typeof(int));
                dtdisable.Columns.Add("Variance_Count", typeof(int));
                dtdisable.Columns.Add("Physical_Quantity", typeof(int));
                dtdisable.Columns.Add("ProductCode", typeof(string));
                dtdisable.Columns.Add("Batch_Number", typeof(string));
                dtdisable.Columns.Add("Approved_By", typeof(string));
                dtdisable.Columns.Add("Approved_Date", typeof(string));
                dtdisable.Columns.Add("Product_Name", typeof(string));
                dtdisable.Columns.Add("Product_Type_Code", typeof(string));
                dtdisable.Columns.Add("Product_Type_Name", typeof(string));
                dtdisable.Columns.Add("Delivery_Challan_Number", typeof(string));
                dtdisable.Columns.Add("Trans_Id", typeof(int));

                int j = 0;
                for (int i = 0; i < lstuserproduct.Count; i++)
                {
                    j++;
                    dtdisable.Rows.Add(j, companyCode, lstuserproduct[i].SourceUserCode,
                        lstuserproduct[i].SourceUserName,
                        lstuserproduct[i].DestinationUserCode,
                        lstuserproduct[i].DestinationUserName,
                        usercode,
                        lstuserproduct[i].Status,
                        lstuserproduct[i].Remarks,
                        companyid,
                        usercode,
                        lstuserproduct[i].Logical_Quantity,
                        lstuserproduct[i].Variance_Count,
                        lstuserproduct[i].Physical_Quantity, lstuserproduct[i].Product_Code,
                        lstuserproduct[i].Batch_Number, lstuserproduct[i].Approved_By,
                          lstuserproduct[i].Approved_Date, lstuserproduct[i].Product_Name, lstuserproduct[i].Product_Type_Code,
                         lstuserproduct[i].Product_Type_Name, lstuserproduct[i].Delivery_Challan_Number, lstuserproduct[i].Trans_Id);
                }
            }
            return _objDALPromotionalInput.Canceluserrequest(companyCode, usercode, companyid, lstuserproduct,dtdisable);
        }
        public string Deliverychallan(string CompanyCode,string Deliverychallanno)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.Deliverychallan(CompanyCode, Deliverychallanno);
        }
        public IEnumerable<MVCModels.promotionalApprovalModel> GetUsersForApprovalHistory(string companyCode, string usercode)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetUsersForApprovalHistory(companyCode, usercode);
        }
        public IEnumerable<MVCModels.promotionalApprovalModel> GetRemarksHistory(string companyCode,int TransId,string Product_Code)
        {
            _objDALPromotionalInput = new DALPromotionalInput();
            return _objDALPromotionalInput.GetRemarksHistory(companyCode, TransId, Product_Code);
        }
    }

}
