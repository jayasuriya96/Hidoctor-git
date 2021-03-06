IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_GetAPPDailyReportingdata]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_GetAPPDailyReportingdata]
GO
--===================================================================
-- Author : P.S.SHARAVANAN
-- CreatedOn : 09-MAR-2021
-- Decription: To select the stockist list
--===================================================================

Create PROCEDURE [dbo].[SP_HD_GetAPPDailyReportingdata]
(
	@Company_Code varchar(30),
	@Region_Code varchar(30),
	@Header_Id int
)
As
Begin
	Begin Try
		Declare @DCR_Date Varchar(30)=(Select DCR_Date From tbl_sfa_Dietician_Reporting_header Where Header_Id=@Header_Id)
			Select
			T1.Created_Region_code As Region_Code,
			Division_Code,
			Filled_By,
			T1.For_Region_Code As User_Code,
			T1.Start_date,
			T1.Start_Time,
			T1.End_Time,
			Camp_Type,
			Camp_Sub_Type,
			Location,
			ISNULL(Noofdoctors,0) As Noofdoctors,
			ISNULL(Noofpatients,0)As Noofpatients,
			ISNULL(Noofprescriptions,0) As Noofprescriptions,
			T1.Header_Id,
			T4.Activity_Name,
			Status
			From 
			tbl_SFA_Dietician_Reporting_header T1
			Inner Join tbl_SFA_Timesheet_Entry T3
			On T1.Camp_Type=T3.Activity_Code 
			And Actual_Datetime=@DCR_Date
			Inner Join tbl_sfa_Activity_master T4
			On T3.Activity_Code=T4.Activity_Code
			Where 
			Header_Id = @Header_Id

			Select 
			Accompanist_Code,
			T1.Header_Id
			From
			tbl_sfa_DieticianReporting_Accompanist_Details T1
			Where 
			Header_Id = @Header_Id


			Select 
			Doctor_Code,
			Doctor_Name,
			T1.Speciality_Code,
			Prescription_Value,
			Notes,
			T1.Header_Id
			From
			tbl_sfa_DieticianReporting_Doctor_Details T1
			Inner Join tbl_sfa_customer_master T2
			On T2.Customer_Code = T1.Doctor_Code 
			And T2.Customer_Entity_Type = 'STOCKIEST'			
			Where 
			T1.Header_Id = @Header_Id

			Select
			Parameter_Value,
			Patient_Name,
			Age,
			Gender,
			Total_Prescription_Value,
			Notes,
			T1.Header_Id
			From
			tbl_sfa_DieticianReporting_Patient_Details T1
			Where 
			Header_Id = @Header_Id

			Select 
			Product_Code,
			No_of_Prescriptions,
			No_of_PrescriptionValue,
			Notes,
			T1.Header_Id
			From
			tbl_sfa_DieticianReporting_Prescription_Details T1
			Where 
			Header_Id = @Header_Id
		End Try
		Begin Catch
			Select
			ERROR_NUMBER(),
			ERROR_MESSAGE(),
			ERROR_PROCEDURE()
		End Catch
END
