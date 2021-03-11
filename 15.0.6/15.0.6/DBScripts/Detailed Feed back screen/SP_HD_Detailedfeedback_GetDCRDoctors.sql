IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_Detailedfeedback_GetDCRDoctors]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].SP_HD_Detailedfeedback_GetDCRDoctors

/****** Object:  StoredProcedure [dbo].[SP_HD_Detailedfeedback_GetDCRDoctors]    Script Date: 23-02-2021 10:47:13 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
---Here  tbl_sfa_DetailedProductfeedbackdetails changed to this tbl_SFA_DCR_Detailing_Report

create PROCEDURE [dbo].[SP_HD_Detailedfeedback_GetDCRDoctors] @Company_Code VARCHAR(30)
	,@User_Code VARCHAR(30)
	,@DCR_Date VARCHAR(30)
	,@DCR_Code VARCHAR(50)
AS
BEGIN
	SELECT Doctor_Code
		,Customer_Name
		,Speciality_Name
		,Category_Name
		,MDL_Number
		,Id
		,related_product_code AS Sales_Product_Code
		,related_product_Name AS Product_Name
		,
		--DCR_Product_Detail_Code,
		Promotional_Status_Name AS Business_Status_Remarks
		,Next_Action_Comments
		,Manager_Remarks AS Remarks
		,Type_Name AS Practice_Mode
		,Detailing_Disease AS Disease_Flag
	FROM tbl_sfa_dcr_doctor_visit T1 WITH(NOLOCK)
	INNER JOIN tbl_sfa_DCR_master T4 WITH(NOLOCK) ON T1.DCR_Code = T4.DCR_Code
	INNER JOIN tbl_sfa_Customer_master T2  WITH(NOLOCK)ON T1.Doctor_Code = T2.Customer_Code
	LEFT JOIN tbl_sfa_Doctor_Category T3 WITH(NOLOCK) ON T2.Category = T3.Category_Code
	INNER JOIN tbl_SFA_DCR_Detailing_Report T5 WITH(NOLOCK) ON T1.DCR_Visit_Code = T5.DCR_Visit_Code
		AND T1.DCR_Code = T5.DCR_Code
	INNER JOIN tbl_sfa_Product_master T6 WITH(NOLOCK) ON T5.related_product_code = T6.Product_Code
	LEFT JOIN Tbl_Sfa_Business_Status T7 WITH(NOLOCK) ON T5.Promotional_Status_Id = T7.Business_Status_ID
	LEFT JOIN tbl_SFA_Practice_Mode T8 WITH(NOLOCK) ON T5.Type_Id = T8.Practice_Mode_ID
	WHERE T1.Company_Code = @Company_Code
		AND T1.User_Code = @User_Code
		AND T4.DCR_Code = @DCR_Code
		AND T4.DCR_Actual_Date = @DCR_Date
		--AND Business_Status_Remarks IS NOT NULL
		--AND BusinessPotential IS NOT NULL
END