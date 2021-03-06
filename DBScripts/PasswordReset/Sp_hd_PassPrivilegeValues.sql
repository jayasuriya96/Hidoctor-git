IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Sp_hd_PassPrivilegeValues]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[Sp_hd_PassPrivilegeValues]
GO

--========================================================================
-- Author:		P.S.SHARAVANAN
-- Create date: 13-FEB-2021
-- Description:	Reads privilegs for a selected usertype and companycode
-- Parameters : CompanyCode and UserType
-- Modififed On:18-FEB-2021
-- Description: System error messages sending to front-end using
--				error handler
-- =====================================================================
Create PROCEDURE [dbo].[Sp_hd_PassPrivilegeValues] 
(
	@companycode varchar(30),
	@usertype varchar(30)
)
As
Begin
	--Beginning of error handler
	Begin Try
		--Gets Privilege name and value for selected usercode and companycode
		Select 
		Privilege_Name,
		Privilege_Value_Name
		From 
		tbl_SFA_UserType_Privilege_Mapping_NG With(NoLock)
		Where 
		Privilege_Name in ('PASSWORD_POLICY','PASSWORD_HISTORY_COUNT','PASSWORD_STRENGTH')
		And 
		User_Type_Name = @usertype
		And 
		Record_Status=1
	End Try
	--Beginning of Exception Handler to capture error messages
	Begin Catch
		Select
		Error_Number(),
		Error_Message(),
		ERROR_PROCEDURE()
	End Catch
End
