/****** Object:  StoredProcedure [dbo].[usp_GetRPTFrameworkDoctorMaster]    Script Date: 11/06/2017 9:30:30 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_GetRPTFrameworkDoctorMaster]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_GetRPTFrameworkDoctorMaster]
GO

/****** Object:  StoredProcedure [dbo].[usp_GetRPTFrameworkDoctorMaster]    Script Date: 11/06/2017 9:30:30 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[usp_GetRPTFrameworkDoctorMaster]
(
@CompanyCode VARCHAR(12),
@RegionCode VARCHAR(12),
@Month INT,
@Year INT
)
AS
BEGIN
	SELECT  tbl_SFA_Calc_Doctor_Analysis.Company_Code,tbl_SFA_Calc_Doctor_Analysis.Region_Code,Doctor_Code AS 'Customer_Code',Doctor_Name AS 'Customer_Name'
		,tbl_SFA_Calc_Doctor_Analysis.MDL_Number,tbl_SFA_Calc_Doctor_Analysis.Gender,tbl_SFA_Calc_Doctor_Analysis.Hospital_Name,
		tbl_SFA_Calc_Doctor_Analysis.Speciality_Code,Speciality_Name,Category_Code,Category_Name 
		,Address1,Address2,City,Pin_Code,Phone,Mobile,Fax,Email,DOB,Anniversary_Date,Qualification,
		CASE  WHEN tbl_SFA_Customer_Master.Effective_From IS NULL THEN CONVERT(DATE,tbl_SFA_Customer_Master.Approved_Date) ELSE CONVERT(DATE,tbl_SFA_Customer_Master.Effective_From) END AS 'Effective_From',
		CASE  WHEN tbl_SFA_Customer_Master.Effective_To IS NULL THEN '2099-12-31' ELSE CONVERT(DATE,tbl_SFA_Customer_Master.Effective_To) END AS 'Effective_To',
		Hospital_Classification,tbl_SFA_Calc_Doctor_Analysis.Hospital_Name,Registration_No,Sur_Name,
		Region_Local_Area,Region_City,Region_State,Region_Country,Region_Latitude,Region_Longitude,Latitude,Longitude
	FROM 
		tbl_SFA_Calc_Doctor_Analysis  WITH(NOLOCK)
		INNER JOIN tbl_SFA_Customer_Master WITh(NOLOCK)
		ON tbl_SFA_Calc_Doctor_Analysis.Doctor_Code=tbl_SFA_Customer_Master.Customer_Code
		AND tbl_SFA_Calc_Doctor_Analysis.Region_Code=tbl_SFA_Customer_Master.Region_Code
		
		AND tbl_SFA_Calc_Doctor_Analysis.Company_Code=tbl_SFA_Customer_Master.Company_Code
		INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK) ON tbl_SFA_Region_Master.Region_Code=tbl_SFA_Customer_Master.Region_Code
		AND  tbl_SFA_Region_Master.Company_Code=tbl_SFA_Customer_Master.Company_Code
	WHERE  tbl_SFA_Calc_Doctor_Analysis.Region_Code=@RegionCode
	AND tbl_SFA_Calc_Doctor_Analysis.[Month]=@Month AND tbl_SFA_Calc_Doctor_Analysis.[Year] =@Year 
	AND tbl_SFA_Calc_Doctor_Analysis.Company_Code=@CompanyCode
	--AND Doctor_Code='650758'
	--GROUP BY  tbl_SFA_Calc_Doctor_Analysis.Company_Code,tbl_SFA_Calc_Doctor_Analysis.Region_Code,Doctor_Code ,Doctor_Name 
	--	,tbl_SFA_Calc_Doctor_Analysis.MDL_Number,tbl_SFA_Calc_Doctor_Analysis.Gender,tbl_SFA_Calc_Doctor_Analysis.Hospital_Name,
	--	tbl_SFA_Calc_Doctor_Analysis.Speciality_Code,Speciality_Name,Category_Code,Category_Name 
	--	,Address1,Address2,City,Pin_Code,Phone,Mobile,Fax,Email,DOB,Anniversary_Date,Qualification,
	--	tbl_SFA_Customer_Master.Effective_From,tbl_SFA_Customer_Master.Effective_To,tbl_SFA_Customer_Master.Approved_Date,
	--	Hospital_Classification,Hospital_Code,Registration_No,Sur_Name,
	--	Region_Local_Area,Region_City,Region_State,Region_Country,Region_Latitude,Region_Longitude,
	--	Latitude,Longitude
END




GO


