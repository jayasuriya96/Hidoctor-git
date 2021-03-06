IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_hdGetPasswordHistory]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[sp_hdGetPasswordHistory]
GO

-- ==============================================================================
-- Author:		P.S.SHARAVANAN
-- Create date: 13-FEB-2014
-- Description:	Reads historycount, currentpassword, last_password_updated_date
-- Parameter : CompanyCode, UserCode, HistoryCount
-- Modififed On:18-FEB-2021
-- Description: System error messages sending to front-end using
--				error handler
-- ==============================================================================

Create Procedure [dbo].[sp_hdGetPasswordHistory]
(
	@CompanyCode VARCHAR(30),
	@UserCode VARCHAR(30),
	@HistoryCount VARCHAR(30)
)
As
Begin
	Declare @QRY Varchar(MAX)
	--Beginning of error handler
	Begin Try
		--Gets CurrentPassword, LastUpdateDate, HistoryCount
		Set @QRY = '
			Select
			Top '+@HistoryCount+'
			T0.User_Pass,
			T0.Last_Update last_password_updated_date
			From
			(
				Select 
				User_Pass,
				Max(Updated_Time) Last_Update
				From
				Tbl_Sfa_User_Master_History With(NoLock)
				Where
				User_Code = '''+@UserCode+'''
				AND Company_Code = '''+@CompanyCode+''' 
				Group By
				User_Pass
			) T0
			Order By
			T0.Last_Update Desc '
			EXEC(@QRY)
	End Try

	--Beginning of Exception handler to capture system error messages
	Begin Catch
		Select
		Error_Number(),
		ERROR_MESSAGE(),
		ERROR_PROCEDURE()
	End Catch
End
