IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_Get_Web_Access]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_Get_Web_Access]
GO
--===================================================================
-- Author : P.S.SHARAVANAN
-- CreatedOn : 06-MAR-2021
-- Decription: To check the login user has webaccess or not to 
--				restrict unauthorized attempt
--===================================================================


CREATE PROCEDURE [dbo].[SP_HD_Get_Web_Access] 
(
	@CompanyCode Varchar(30),
	@UserName Varchar(30)
) 
As
Begin
	Begin Try
		Declare @UserCode Varchar(30)

		Select @UserCode=User_Code 
		From 
		tbl_sfa_user_master With(NoLock)
		Where user_Name=@UserName 
		And 
		User_Status=1

		Select 
		Case When (IsNull(Is_Web_Access,'0')='0' Or Is_Web_Access='0') then 0 Else Is_Web_Access End Is_Web_Access,
		Case When (IsNull(Is_App_Access,'0')='0' Or Is_App_Access='0') then 0 Else Is_App_Access End Is_App_Access
		From
		tbl_SFA_HD_User_Access With(NoLock)
		Where
		Company_Code=@CompanyCode
		And
		User_Code=@UserCode
	End Try
	Begin Catch
		Select 
		ERROR_NUMBER(),
		ERROR_MESSAGE(),
		ERROR_PROCEDURE()
	End Catch
 END