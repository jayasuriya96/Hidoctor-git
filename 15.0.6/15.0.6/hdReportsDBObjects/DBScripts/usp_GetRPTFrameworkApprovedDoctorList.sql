/****** Object:  StoredProcedure [dbo].[usp_GetRPTFrameworkApprovedDoctorList]    Script Date: 11/06/2017 9:27:44 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_GetRPTFrameworkApprovedDoctorList]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_GetRPTFrameworkApprovedDoctorList]
GO

/****** Object:  StoredProcedure [dbo].[usp_GetRPTFrameworkApprovedDoctorList]    Script Date: 11/06/2017 9:27:44 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[usp_GetRPTFrameworkApprovedDoctorList]
(
@CompanyCode VARCHAR(12),
@RegionCode VARCHAR(12),
@DoctorCode VARCHAR(12)
)
AS
BEGIN
	SELECT tbl_SFA_Customer_Master.Company_Code,tbl_SFA_Customer_Master.Region_Code,Customer_Code,Customer_Name
		,MDL_Number,Gender,Hospital_Name,
		tbl_SFA_Customer_Master.Speciality_Code,Speciality_Name,Category_Code,Category_Name 
		,Address1,Address2,City,Pin_Code,Phone,Mobile,Fax,Email,DOB,Anniversary_Date,Qualification,
		CASE  WHEN tbl_SFA_Customer_Master.Effective_From IS NULL THEN CONVERT(DATE,tbl_SFA_Customer_Master.Approved_Date) ELSE CONVERT(DATE,tbl_SFA_Customer_Master.Effective_From) END AS 'Effective_From',
		CASE  WHEN tbl_SFA_Customer_Master.Effective_To IS NULL THEN '2099-12-31' ELSE CONVERT(DATE,tbl_SFA_Customer_Master.Effective_To) END AS 'Effective_To',
		Hospital_Classification,Hospital_Name,Registration_No,Sur_Name,
		Region_Local_Area,Region_City,Region_State,Region_Country,Region_Latitude,Region_Longitude,Latitude,Longitude
	FROM 
		 tbl_SFA_Customer_Master WITH(NOLOCK) INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
		 ON tbl_SFA_Speciality_Master.Speciality_Code=tbl_SFA_Customer_Master.Speciality_Code
		 
		 LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK) ON tbl_SFA_Doctor_Category.Category_Code=tbl_SFA_Customer_Master.Category
		
		 INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK) ON tbl_SFA_Region_Master.Region_Code=tbl_SFA_Customer_Master.Region_Code
		
		
	WHERE 
	 tbl_SFA_Customer_Master.Region_Code=@RegionCode
	AND Customer_Code=@DoctorCode AND Customer_Entity_type='DOCTOR'
END


GO


