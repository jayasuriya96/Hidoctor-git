IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_DieticianReporting_GetUsersbasedondivision]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_DieticianReporting_GetUsersbasedondivision]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_DieticianReporting_GetUsersbasedondivision]    Script Date: 04-03-2021 17:17:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--EXEC SP_HD_DieticianReporting_GetUsersbasedondivision 'RAJ00000141','USC00002022','REC00001216'
CREATE PROCEDURE [dbo].[SP_HD_DieticianReporting_GetUsersbasedondivision]
@Company_Code varchar(30),
@Division_Code varchar(30),
@Region_Code varchar(30)

AS
BEGIN
	DECLARE @Divisioncode varchar(30)=(select Division_Code from tbl_sfa_region_master WITH(NOLOCK) where Region_Code=@Region_Code)
	DECLARE @UserType_Code varchar(30)=(select User_Type_Code from tbl_sfa_user_master WITH(NOLOCK) where User_Code=@Division_Code)
	DECLARE @FullIndex varchar(500)=(select Full_index from tbl_sfa_region_master WITH(NOLOCK) where Region_Code=@Region_Code)
	DECLARE @FullIndexWithPercentage varchar(501)
	SELECT @FullIndexWithPercentage= @FullIndex +'%'
	DECLARE @Pvalue varchar(30)=(SELECT Privilege_Value_Name from tbl_sfa_Privilege_Master T1 WITH(NOLOCK) INNER JOIN tbl_SFA_UserType_Privilege_Mapping_NG T2 WITH(NOLOCK) ON T1.Privilege_Code=T2.Privilege_Code and T1.Privilege_Name='ALLOW_OTHER_HIERARCHY_IN_ACCOMPANIST_IN_APP' AND User_Type_Code=@UserType_Code)
	if(@Pvalue='YES')
	BEGIN
		SELECT
			T1.Region_Code,
			Region_Name,
			User_Name,
			User_Type_Name,
			Employee_Name
		FROM
			tbl_sfa_Region_Master T1 WITH(NOLOCK)
		INNER JOIN tbl_sfa_User_Master T3 WITH(NOLOCK)
		ON T1.Region_Code=T3.Region_Code
		INNER JOIN tbl_sfa_user_Type_master T4 WITH(NOLOCK)
		ON T3.User_Type_Code=T4.User_Type_Code
		INNER JOIN tbl_sfa_Employee_master T5 WITH(NOLOCK)
		ON T3.Employee_Code=T5.Employee_Code
		WHERE Region_Status=1 AND User_Status=1
		AND T1.Division_Code=@Divisioncode
		GROUP BY
			T1.Region_Code,
			Region_Name,
			User_Name,
			User_Type_Name,
			Employee_Name
	END
	ELSE
	BEGIN
	
		SELECT 
			C.Region_Code,
			Region_Name,
			User_Name,
			User_Type_Name,
			Employee_Name
	FROM 
		tbl_SFA_User_Master A1 WITH(NOLOCK) 
		Inner Join tbl_SFA_User_Type_Master A WITH(NOLOCK) 
			On A1.User_Type_Code=A.User_Type_Code 
			And A1.User_Status='1'
	    Inner Join tbl_SFA_Employee_Master B WITH(NOLOCK)  
			On B.Employee_Code=A1.Employee_Code
	    Inner Join tbl_SFA_Region_Master C WITH(NOLOCK) 
			On A1.Region_Code=C.Region_Code
	WHERE 
		C.Full_index = @FullIndex 
		Or 
		C.Full_index LIKE @FullIndexWithPercentage 
	ORDER BY
		C.Full_index
	END

End

