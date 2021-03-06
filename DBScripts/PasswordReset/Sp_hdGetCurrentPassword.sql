IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Sp_hdGetCurrentPassword]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[Sp_hdGetCurrentPassword]
GO

-- ================================================================
-- Author:		P.S.SHARAVANAN
-- Create date: 13-FEB-2014
-- Description:	Reads currentpassword, last_password_updated_date
-- Parameter : CompanyCode, UserCode
-- Modififed On:18-FEB-2021
-- Description: System error messages sending to front-end using
--				error handler
-- ================================================================

Create PROCEDURE [dbo].[Sp_hdGetCurrentPassword]
(
	@companyCode Varchar(30),
	@userCode Varchar(30)
)
As
Begin
	--Beginning of error handler
	Begin Try
		--Reads currentpassword, lastpasswordupdateddate for the selected usercode and companycode
		Select
		User_Pass,
		Last_Password_Updated_Date
		From
		tbl_SFA_User_Master With(NoLock)
		Where
		Company_Code = @companyCode
		And
		User_Code = @userCode
	End Try

	--Beginning of exception handler to capture system error messages
	Begin Catch
		Select
		Error_Number(),
		Error_Message(),
		ERROR_PROCEDURE()
	End Catch
End
