using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DCRLeaveApprovalModel
    {
        public string User_Code { get; set; }
        public string User_Name { get; set; }
        public string From_Date { get; set; }
        public string To_Date { get; set; }
        public string Entered_Date { get; set; }
        public string Flag { get; set; }
        public string Number_Of_Days { get; set; }
        public string DCR_Status { get; set; }
        public string Leave_Type_Name { get; set; }
        public int Attachment_Id { get; set; }
        public int Attachment_Count { get; set; }
        public string Leave_Reason { get; set; }
        public string Approval_Unapproval_Reason { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string Created_By { get; set; }
        public string Updated_By { get; set; }
        public string Updated_Date { get; set; }
    }

    public class DCRLeaveAttachmentModel
    {
        public int Attachment_Id { get; set; }
        public string Attachment_Name { get; set; }
        public string Attachment_Url { get; set; }
    }

    public class DCRApprovalModel
    {
        public string User_Code { get; set; }
        public string DCR_Code { get; set; }
        public string User_Name { get; set; }
        public string DCR_Date { get; set; }
        public string Entered_Date { get; set; }
        public string Place_Worked { get; set; }
        public string Category { get; set; }
        public string Flag { get; set; }
        public string DCR_Status { get; set; }
        public string Leave_Type_Name { get; set; }
        public string Unapproval_Reason { get; set; }
        public string Region_Code { get; set; }
        public string Leave_Reason { get; set; }
        public string Source_Of_Entry { get; set; }
        public string DCR_General_Remarks { get; set; }
        public string Activity_Name { get; set; }
        public string Approved_By { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int Doctor_Count { get; set; }
        public int Chemist_Count { get; set; }
        public int Stockist_Count { get; set; }

    }
    public class DCRApprovalAccModel
    {
        public string Accompanist { get; set; }
        public string Emp_Name { get; set; }
        public string Region_Name { get; set; }
        public string Is_Only_For_Doctor { get; set; }
        public string Division_Name { get; set; }
        public string User_Type_Name { get; set; }
    }

    public class DCRTPApprovalModel
    {
        public string TP_ID { get; set; }
        public string TP_DATE { get; set; }
    }

    public class DCRLeaveApprovalDataModel
    {
        public List<DCRLeaveApprovalModel> lstDCRLeaveApprovalData { get; set; }
        public List<DCRLeaveAttachmentModel> lstLeaveAttachmentData { get; set; }
    }

    public class DCRApprovalDataModel
    {
        public List<DCRApprovalModel> lstDCRApprovalData { get; set; }
        public List<DCRTPApprovalModel> lstTPApprovaldata { get; set; }
    }

    public class DCRTPHeaderApprovalModel
    {
        public string TP_Date { get; set; }
        public string CP_name { get; set; }
        public string Work_Area { get; set; }
        public string Category { get; set; }
        public string Activity_Name { get; set; }
        public string Project_Code { get; set; }
        public string Activity_Code { get; set; }
        public string ACC1 { get; set; }
        public string ACC2 { get; set; }
        public string ACC3 { get; set; }
        public string ACC4 { get; set; }
        public string Tp_Approved_By { get; set; }
        public string Meeting_Point { get; set; }
        public string Meeting_Time { get; set; }
        public string Entered_Date { get; set; }
        public string Entered_by { get; set; }
        public string Remarks { get; set; }
    }

    public class DCRTPSFCDataModel
    {
        public string From_Place { get; set; }
        public string To_Place { get; set; }
        public string Travel_Mode { get; set; }
        public string SFC_Category_Name { get; set; }
    }
    public class DCRTPDoctorDataModel
    {
        public string Customer_Name { get; set; }
        public string MDL_Number { get; set; }
        public string Region_Name { get; set; }
        public string Speciality_Name { get; set; }
        public string Category_Name { get; set; }
    }

    public class DCRTPActivityModel
    {
        public string Activity_Code { get; set; }
        public string Activity_Name { get; set; }
        public int Tp_Id { get; set; }
    }
    public class DCRTPDetailsModel
    {
        public List<DCRTPHeaderApprovalModel> lstTPHeader { get; set; }
        public List<DCRTPSFCDataModel> lstTPSFC { get; set; }
        public List<DCRTPDoctorDataModel> lstTpDoctors { get; set; }
        public List<DCRTPActivityModel> lstTpActivities { get; set; }
    }

    // Doctor Approval Counts Model
    public class DoctorApprovalCountsModel
    {
        public string CategoryName { get; set; }
        public string CategoryCode { get; set; }
        public int MaximumDoctorAllowed { get; set; }
        public int AvaliableApprovedDoctors { get; set; }
        public int SelectedForApproval { get; set; }
        public int ExcessDoctor { get; set; }
    }

    public class SpecialityDoctorApprovalCountsModel
    {
        public string Speciality { get; set; }
        public string SpecialityCode { get; set; }
        public int Limit { get; set; }
        public int Current { get; set; }
        public int SelectedForApproval { get; set; }
        public int MaxCanApprove { get; set; }
        public string Status { get; set; }
    }

    public class CPApprovalModel
    {
        public string CP_Code { get; set; }
        public string CP_Name { get; set; }
        public string user_Code { get; set; }
        public string validFrom { get; set; }
    }
    public class CPApprovalDoctorDetails
    {
        public string CP_Code { get; set; }
        public string CP_Name { get; set; }
        public string user_Code { get; set; }
        public string validFrom { get; set; }
    }
    public class CPApprovalSFCDetails
    {
        public string CP_Code { get; set; }
        public string CP_Name { get; set; }
        public string user_Code { get; set; }
        public string validFrom { get; set; }
    }
    public class DCRRatingParameter
    {
        public string Company_Code { get; set; }
        public string DCR_Code { get; set; }
        public string Parameter_Code { get; set; }
        public string Rating_Value { get; set; }
        public string DCR_Flag { get; set; }
        public string Remarks { get; set; }

    }

    public class DCRRatingConfig
    {
        public string Company_Code { get; set; }
        public string User_Type_Code { get; set; }
        public bool Is_Mandatory { get; set; }
    }

    public class SecondarySalesProductModel
    {
        public string Product_Name { get; set; }
        public string Price_Per_Unit { get; set; }
        public string Opening_Stock { get; set; }
        public string Opening_Stock_Value { get; set; }
        public string Purchase { get; set; }
        public string Purchase_Value { get; set; }
        public string Purchase_Return { get; set; }
        public string Purchase_return_Value { get; set; }
        public string Sales { get; set; }
        public string Sales_Value { get; set; }
        public string Sales_Return { get; set; }
        public string Sales_Return_Value { get; set; }
        public string Closing_Stock { get; set; }
        public string Closing_Stock_Value { get; set; }
        public string Transit { get; set; }
        public string Transit_value { get; set; }
        public string Free_Goods { get; set; }
        public string Free_Goods_Value { get; set; }
        public string Remarks { get; set; }
    }

    public class SecondarySalesApprovalModel
    {
        public List<EmployeeDetailModel> lstEmployeeDetail { get; set; }
        public List<SecondarySalesProductModel> lstSecondarySalesProduct { get; set; }

    }
    public class EmployeeDetailModel
    {
        public string Employee_Number { get; set; }
        public string User_Type_Name { get; set; }
        public string User_Name { get; set; }
        public string Employee_Name { get; set; }
        public string Reports_User_Name { get; set; }
        public string Mobile { get; set; }
        public string Manager_Region_Name { get; set; }
        public string Region_Name { get; set; }
        public string Region_Code { get; set; }
        public string Phone { get; set; }
        public string Date_Of_Birth { get; set; }
        public string Manager_Name { get; set; }
        public string User_Code { get; set; }
        public string Division_Name { get; set; }
        public string Date_of_joining { get; set; }
        public string SS_Status { get; set; }
        public string SS_Code { get; set; }
        public string SS_Statement_Date { get; set; }
        public string Stockiest_Name { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Code { get; set; }
        public string Remarks { get; set; }
        // Wide angle Approval
        public string Request_Category { get; set; }
        public string Period { get; set; }
        public string Requested_Date { get; set; }
        public string Request_Id { get; set; }
        public string Request_Status { get; set; }
        public string Date_From { get; set; }
        public string Date_To { get; set; }

    }
    public class DoctorACCNameDetails
    {
        public string Acc_user_name { get; set; }
        public string DCR_actual_date { get; set; }
    }
    public class DoctorUnapproveMC
    {
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Campaign_Name { get; set; }
        public string Campaign_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }

    }
    public class DoctorUnapproveCRM
    {
        public string Claim_Code { get; set; }
        public string Doctor_Code { get; set; }
        public string Doctor_Name { get; set; }
        public string Request_Entity { get; set; }
        public string MDL_Number { get; set; }
        public string Category_Name { get; set; }
        public string Speciality_Name { get; set; }
    }
    public class CustomerQueueModel
    {
        public int Id { get; set; }
        public string Company_Code { get; set; }
        public string Customer_Code { get; set; }
        public string Region_Code { get; set; }
        public string MDL_Number { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Category { get; set; }
        public string Customer_Status { get; set; }

        public string Event { get; set; }

    }

    public class ApprovedFailedDoctors
    {
        public string RegionCode { get; set; }
        public string CustomerCode { get; set; }
    }

    public class UserProducts
    {
        public string User_Code { get; set; }
        public string Product_Code { get; set; }
        public int Min_Count { get; set; }
        public int Max_Count { get; set; }
        public char User_Product_status { get; set; }
    }
    public class TotalSSDetails
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }

        public string Total_Applied_Count { get; set; }
        public string Total_Approved_Count { get; set; }
        public string Total_Draft_Count { get; set; }
        public string Total_Unapproved_Count { get; set; }
        public string Total_Count { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int Status { get; set; }

    }
    public class SecondarySalesDetailsView
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public string Stockist_Name { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string SS_Statement_Date { get; set; }
        public string Entered_By { get; set; }
        public int Status { get; set; }
        public string Approved_By { get; set; }
        public string Status_Name { get; set; }
        public string Approved_Date { get; set; }




    }
    public class SecondarySalesApprovalHeaderModel
    {
        public string SS_Code { get; set; }
        public string Region_Code { get; set; }
        public string Region_Name { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string Customer_Name { get; set; }
        public string Base_Code { get; set; }
        public string SS_Statement_Date { get; set; }
        public string SS_Status { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Remarks { get; set; }
        public string IsEditable { get; set; }
        public int IsOnlyApprovable { get; set; }
        public string Attachments { get; set; }
        public int Lock_Status { get; set; }
        public int Privilege_Value { get; set; }
    }
    public class SSRemarksModel
    {
        public string Approved_By { get; set; }
        public string Approved_Date { get; set; }
        public string Customer_Name { get; set; }
        public string Remarks { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string SS_Status { get; set; }
        public string Entered_By { get; set; }
        public string Entered_Date { get; set; }
    }
    public class SSsingleAorU
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string User_Code { get; set; }
        public string SS_Code { get; set; }
        public string Region_Code { get; set; }
        public string Base_Code { get; set; }
        public string Base_Name { get; set; }
        public string Base_Type { get; set; }
        public string SS_Statement_Date { get; set; }
        public string SS_Status { get; set; }
        public string SS_Approval_Status { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
        public string Ref_Key1 { get; set; }
        public string Remarks { get; set; }
    }

    public class GetSSRegion
    {
        public string Company_Code { get; set; }
        public string Region_Code { get; set; }
        public int month { get; set; }
        public int year { get; set; }
        public int status { get; set; }
        public string Region_SelectionType { get; set; }
        public string Customer_Entity_Type { get; set; }
        public string Region_Name { get; set; }
        public string User_Name { get; set; }
        public string User_Code { get; set; }
        public string Region_Type_Name { get; set; }
        public string User_Type_Name { get; set; }
        public string Under_User_Code { get; set; }
        public string Under_Region_Code { get; set; }
        public string User_Type_Code { get; set; }
    }

    public class DCRCMEDetails
    {
        public string Product_Name { get; set; }
        public int Current_Sales { get; set; }
        public int Expected_Sales { get; set; }
        public int No_Of_Months { get; set; }
    }


}
