IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_hdGetUnderusercode]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_hdGetUnderusercode]
GO

-- ============================================================
-- Author:		P.S.SHARAVANAN
-- Create date: 13-FEB-2021
-- Description:	Gets the under user code of the logged in user
-- Parameter : CompanyCode, UserCode
-- Modififed On:18-FEB-2021
-- Description: System error messages sending to front-end using
--				error handler
-- ============================================================
Create PROCEDURE [dbo].[sp_hdGetUnderusercode]
(
	@CompanyCode Varchar(30),
	@UserCode Varchar(30)
)
As
Begin
	--Beginning of error handler
	Begin Try
		--Gets UnderUserCode for selected companycode, usercode
		Select
		Under_User_Code
		From
		tbl_SFA_User_Master With(NoLock)
		Where
		Company_Code = @CompanyCode
		And
		User_Code = @UserCode
	End Try
	--Beginning of exception to capture system error messages
	Begin Catch
		Select
		Error_Number(),
		ERROR_MESSAGE(),
		ERROR_PROCEDURE()
	End Catch
END
