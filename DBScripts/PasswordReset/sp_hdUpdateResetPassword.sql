IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_hdUpdateResetPassword]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_hdUpdateResetPassword]
GO


-- =======================================================================
-- Author:		P.S.SHARAVANAN
-- Create date: 13-FEB-2021
-- Description:	Checks EffectiveFromDate is equal to CurrentDate For
--				Respective User to update new password or creates an
--				entry in history table
-- Parameter : CompanyCode, UserCode, Newpassword
-- Modified On: 18-FEB-2021
-- Description: System error messages sending to front-end using error
--				handler
-- Modified On: 22-FEB-2021
-- Description: Last_Password_Updated_date is updating with current date
--				now, it updating with null value
-- ======================================================================

create PROCEDURE[dbo].[sp_hdUpdateResetPassword]
(
	@CompanyCode VARCHAR(30),
	@UserCode VARCHAR(30),
	@NewPassword VARCHAR(30)
)
As
Begin
	Declare @Effective_From DATETIME
	--Beginning of error handler
	Begin Try
		--Assigns Effective_From Date to a local variable for CompanyCode, UserCode
		Set @Effective_From = (Select 
								Effective_From 
								From 
								tbl_SFA_User_Master With(NoLock)
								Where 
								Company_Code = @companyCode 
								And 
								User_Code = @userCode)
		--Checks EffectiveFrom Date is equal
		IF ((CONVERT(DATE,@Effective_From) = CONVERT(DATE,GETDATE(),103)))
			Begin
				UPDATE tbl_SFA_User_Master
				SET 
				User_Pass = @newPassWord,
				Edit_Reason = NULL,
				Last_Password_Updated_Date = NULL,
				Updated_Time = GETDATE()
				WHERE
				Company_Code = @companyCode
				AND User_Code = @userCode
			End
		Else
			Begin
				--Checks EffectiveFrom Date is not equal then creates an entry into a history table
				Insert Into tbl_SFA_User_Master_History 
				(	
					Company_Code,
					User_Code,
					Employee_Code,
					User_Type_Code,
					Under_User_Code,
					Effective_From,
					Effective_To,
					User_Name,
					User_Pass,
					User_Status,
					Region_Code,
					User_Division_Code,
					User_Category_Code,
					Expense_Eligibility_Region,
					Ref_Key1,
					Ref_Key2,
					Sync_Made,
					Sync_Down_Status,
					Sync_Date,
					Updated_by,
					Updated_Time,
					Is_Account_Locked,
					Account_Locked_DateTime,
					Account_Released_By,
					Account_Released_Mode,
					Edit_Reason,
					Password_Failure_Count,
					Last_Password_Updated_date,
					Created_Date,
					Expense_Group_Id,
					Row_Version_No,
					Is_Mobile_Access,
					HiDOCTOR_Start_Date,
					User_Id,
					Under_User_Id,
					Seq_Index,
					Full_Index,
					Display_Order,
					HDUser_Id,
					Company_Id,
					Is_Kangle_Access
				)
				Select
					Company_Code,
					User_Code,
					Employee_Code,
					User_Type_Code,
					Under_User_Code,
					Effective_From,
					GETDATE() - 1,
					User_Name,
					User_Pass,
					User_Status,
					Region_Code,
					User_Division_Code,
					User_Category_Code,
					Expense_Eligibility_Region,
					Ref_Key1,
					Ref_Key2,
					Sync_Made,
					Sync_Down_Status,
					Sync_Date,
					Updated_by,
					Updated_Time,
					Is_Account_Locked,
					Account_Locked_DateTime,
					Account_Released_By,
					Account_Released_Mode,
					Edit_Reason,
					Password_Failure_Count,
					Last_Password_Updated_date,
					Created_Date,
					Expense_Group_Id,
					Row_Version_No,
					Is_Mobile_Access,
					HiDOCTOR_Start_Date,
					User_Id,
					Under_User_Id,
					Seq_Index,
					Full_Index,
					Display_Order,
					HDUser_Id,
					Company_Id,
					Is_Kangle_Access
					From
					tbl_SFA_User_Master With(NoLock)
					Where
					Company_Code = @companyCode
					And
					User_Code = @userCode
				--Updates the newpassword for companycode and usercode
				Update tbl_SFA_User_Master 
				Set 
				User_Pass = @newPassWord,
				Edit_Reason = NULL,
				Last_Password_Updated_Date = NULL,
				Updated_Time = GETDATE(),
				Effective_From = GETDATE(),
				Effective_To = NULL
				Where 
				Company_Code = @companyCode 
				And 
				User_Code = @userCode
			End
	End Try

	--Beginning of exception handler to capture system error messages
	Begin Catch
		Select 
		Error_Number(),
		ERROR_MESSAGE(),
		ERROR_PROCEDURE()
	End Catch
End
