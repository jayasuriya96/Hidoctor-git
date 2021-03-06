IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_Get_Users_EmailID]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_Get_Users_EmailID]
GO

-- ============================================================
-- Author:		P.S.SHARAVANAN
-- Create date: 15-FEB-2021
-- Description:	Gets the EmailID of the selected in user
-- Parameter : CompanyCode, UserCode
-- Modififed On:18-FEB-2021
-- Description: System error messages sending to front-end using
--				error handler
-- ============================================================
Create PROCEDURE [dbo].[SP_HD_Get_Users_EmailID]
(
	@CompanyCode Varchar(30),
	@UserCode Varchar(30)
)
As
Begin
	--Beginning of error handler
	Begin Try
		--Gets EmailID for selected companycode, usercode
		Select
		EM.Email_Id
		From
		tbl_SFA_User_Master UM With(NoLock)
		Inner Join tbl_Sfa_Employee_Master EM 
		On (UM.Employee_Code = EM.Employee_Code)
		And (UM.Company_Code = EM.Company_Code)
		Where
		UM.Company_Code = @CompanyCode
		And
		UM.User_Code = @UserCode
	End Try
	--Beginning of exception handler to capture system error messages
	Begin Catch
		Select
		Error_Number(),
		Error_Message(),
		ERROR_PROCEDURE()
	End Catch
END
