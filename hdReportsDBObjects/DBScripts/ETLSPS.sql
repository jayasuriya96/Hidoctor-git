/****** Object:  StoredProcedure [dbo].[usp_RPTFramework_hdGetParentRegionsCodeOnly]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_RPTFramework_hdGetParentRegionsCodeOnly]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_RPTFramework_hdGetParentRegionsCodeOnly]
GO
/****** Object:  StoredProcedure [dbo].[usp_RPTFramework_GetParentUsers]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_RPTFramework_GetParentUsers]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_RPTFramework_GetParentUsers]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetTimeSheetEntry]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetTimeSheetEntry]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetTimeSheetEntry]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetStockistVisit]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetStockistVisit]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetStockistVisit]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetReportingManagerDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetReportingManagerDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetReportingManagerDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetRCPADetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetRCPADetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetRCPADetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDoctorAccompanist]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDoctorAccompanist]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDoctorAccompanist]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDivisionDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDivisionDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDivisionDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RptFramework_GetDCRTravelledDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RptFramework_GetDCRTravelledDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RptFramework_GetDCRTravelledDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RptFramework_GetDCRStockiestVisitDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RptFramework_GetDCRStockiestVisitDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RptFramework_GetDCRStockiestVisitDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRSamplesDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRSamplesDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRSamplesDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRExpenseDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRExpenseDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRExpenseDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitFollowups]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitFollowups]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitFollowups]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RptFramework_GetDCRDoctorVisitDetails]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RptFramework_GetDCRDoctorVisitDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RptFramework_GetDCRDoctorVisitDetails]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitAttachments]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitAttachments]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitAttachments]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRDetailedProducts]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRDetailedProducts]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRDetailedProducts]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRChemistsVisits]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRChemistsVisits]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRChemistsVisits]
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRAccompanists]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRAccompanists]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRAccompanists]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetRPTFrameworkDCRQueue]    Script Date: Sep/10/2017 10:17:22 AM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_GetRPTFrameworkDCRQueue]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_GetRPTFrameworkDCRQueue]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetRPTFrameworkDCRQueue]    Script Date: Sep/10/2017 10:17:22 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_GetRPTFrameworkDCRQueue]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_GetRPTFrameworkDCRQueue]
(
	@StartDate DATETIME,
	@EndDate DATETIME
)
AS
BEGIN
	SELECT 
	
	DCR_Code AS DCRCode
	, Company_Code AS CompanyCode
	, Flag AS ActivityFlag
	, User_Code AS UserCode
	, DCR_Actual_Date AS DCRDate 
	FROM tbl_SFA_DCR_Master WITH(NOLOCK)
	WHERE 
		DCR_Actual_Date>=@StartDate AND DCR_Actual_Date<=@EndDate AND DCR_Status IN (''1'',''2'',''0'')

		
END' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRAccompanists]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRAccompanists]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRAccompanists]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
		tbl_SFA_DCR_MAster.Company_Code AS CompanyCode
		, DCR_Code AS DCRCode
		, Acc1.User_Code AS Acc1_Code
		, Person_Code AS Acc1_Name
		, Acc1.User_Type_Code AS Acc1_UserTypeCode
		, Acc1UserType.User_Type_Name AS Acc1_UserTypeName
		, Acc1.Region_Code AS Acc1_RegionCode
		, REC1.Region_Name AS Acc1_RegionName
		, Accomp_Start_Time AS Acc1_Start_Time
		, Accomp_End_Time AS Acc1_End_Time

		, Acc2.User_Code AS Acc2_Code 
		, Acc2_User_Code AS Acc2_Name
		, Acc2.User_Type_Code AS Acc2_UserTypeCode
		, Acc2.Region_Code AS Acc2_RegionCode 
		, REC2.Region_Name AS Acc2_RegionName
		, Acc2_Start_Time
		, Acc2_End_Time
		, Acc2UserType.User_Type_Name AS Acc2_UserTypeName

		, Acc3.User_Code AS Acc3_Code
		, Acc3_Person AS Acc3_Name
		, Acc3.Region_Code AS Acc3_RegionCode
		, REC3.Region_Name AS Acc3_RegionName
		, Acc3_Time AS Acc3_Start_Time
		, Acc3_Time AS Acc3_End_Time
		, Acc3UserType.User_Type_Name AS Acc3_UserTypeName

		, Acc4.User_Code AS Acc4_Code
		, Acc4_Person AS Acc4_Name
		, Acc4.User_Type_Code AS Acc4_User_TypeCode
		, Acc4.Region_Code AS Acc4_RegionCode
		, REC4.Region_Name AS Acc4_RegionName
		, Acc4_Time AS Acc4_Start_Time
		, Acc4_Time AS Acc4_End_Time
		, Acc4UserType.User_Type_Name AS Acc4_UserTypeName

		, CASE WHEN ISNULL(Acc1_Only_For_Doctor,'''') = '''' THEN ''0'' 
			ELSE Acc1_Only_For_Doctor 
			END AS Acc1_Is_Only_For_Doctor

		, CASE WHEN ISNULL(Acc2_Only_For_Doctor,'''') = '''' THEN ''0'' 
				ELSE Acc2_Only_For_Doctor 
			END AS Acc2_Is_Only_For_Doctor

		, CASE WHEN ISNULL(Acc3_Only_For_Doctor,'''') = '''' THEN ''0'' 
			ELSE Acc3_Only_For_Doctor 
			END AS Acc3_Is_Only_For_Doctor

		, CASE WHEN ISNULL(Acc4_Only_For_Doctor,'''') = '''' THEN ''0'' 
			ELSE Acc4_Only_For_Doctor 
			END AS Acc4_Is_Only_For_Doctor

	FROM 

		tbl_SFA_DCR_MAster WITH(NOLOCK)
		LEFT JOIN tbl_SFA_User_Master Acc1  WITH(NOLOCK)
			ON Acc1.[User_Name] = Person_Code
		LEFT JOIN tbl_SFA_Region_Master REC1  WITH(NOLOCK)
			ON REC1.[Region_Code] = Acc1.Region_Code
		LEFT JOIN tbl_SFA_User_Master Acc2  WITH(NOLOCK)
			ON Acc2.[User_Name] = Acc2_User_Code
		LEFT JOIN tbl_SFA_Region_Master REC2  WITH(NOLOCK)
			ON REC2.[Region_Code] = Acc2.Region_Code

		LEFT JOIN tbl_SFA_User_Master Acc3  WITH(NOLOCK)
			ON Acc3.[User_Name] = Acc3_Person
		LEFT JOIN tbl_SFA_Region_Master REC3  WITH(NOLOCK)
			ON REC3.[Region_Code] = Acc3.Region_Code
		LEFT JOIN tbl_SFA_User_Master Acc4  WITH(NOLOCK)
			ON Acc4.[User_Name] = Acc4_Person
		LEFT JOIN tbl_SFA_Region_Master REC4  WITH(NOLOCK)
			ON REC4.[Region_Code] = Acc4.Region_Code
		LEFT JOIN tbl_SFA_User_type_Master Acc1UserType WITH(NOLOCK)
			ON Acc1UserType.User_type_code = Acc1.User_type_Code
		LEFT JOIN tbl_SFA_User_type_Master Acc2UserType WITH(NOLOCK)
			ON Acc2UserType.User_type_code = Acc2.User_type_Code
		LEFT JOIN tbl_SFA_User_type_Master Acc3UserType WITH(NOLOCK)
			ON Acc3UserType.User_type_code = Acc3.User_type_Code
		LEFT JOIN tbl_SFA_User_type_Master Acc4UserType WITH(NOLOCK)
			ON Acc4UserType.User_type_code = Acc4.User_type_Code
	WHERE 
		tbl_SFA_DCR_MAster.DCR_Code=@DCRCode 
		AND Flag =''F''
END


' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRChemistsVisits]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRChemistsVisits]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRChemistsVisits]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
			  tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_Customer_Master.Local_Area AS LocalArea
			, tbl_SFA_Customer_Master.Sur_Name AS SurName
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName
			, tbl_SFA_DCR_Chemists_visit.DCR_Chemists_Code AS ChemistVisitCode
			, tbl_SFA_DCR_Chemists_visit.Chemists_Name AS ChemistName
			, tbl_SFA_DCR_Chemists_visit.Chemist_Code AS ChemistCode
			, tbl_SFA_DCR_Chemists_visit.PO_Amount AS ChemistPOBAmount
	FROM tbl_SFA_DCR_Chemists_visit WITH(NOLOCK)
		INNER JOIN tbl_SFA_DCR_Doctor_Visit WITH(NOLOCK)
			ON tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code = tbl_SFA_DCR_Chemists_visit.DCR_Visit_Code
		LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
			ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
			AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
			ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
		INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
			ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
			ON tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name
	WHERE 
	tbl_SFA_DCR_Chemists_visit.DCR_Code = @DCRCode
	AND tbl_SFA_DCR_Doctor_Visit.DCR_Code = @DCRCode
END


' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRDetailedProducts]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRDetailedProducts]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRDetailedProducts]
	@DCRCode VARCHAR(50)
AS
BEGIN
		
		SELECT 
			tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_Customer_Master.Local_Area AS LocalArea
			, tbl_SFA_Customer_Master.Sur_Name AS SurName
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName
			, tbl_SFA_DCR_Detailed_Products.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Detailed_Products.Doctor_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Detailed_Products.Sales_Product_Code AS ProductCode
			, tbl_SFA_Product_Master.Product_Name AS ProductName
			, tbl_SFA_Product_Master.Product_Type_Name As ProductTypeName
			, tbl_SFA_Product_Master.Product_Type AS ProductTypeCode
			, ProductSpeciality.Speciality_Name AS ProductSpecialityName
			, ProductSpeciality.Speciality_Code As ProductSpecialityCode
		FROM 
			tbl_SFA_DCR_Detailed_Products   WITH(NOLOCK)
				INNER JOIN  tbl_SFA_DCR_Doctor_Visit WITH(NOLOCK)
					ON tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code  = tbl_SFA_DCR_Detailed_Products.Doctor_Visit_Code
					AND tbl_SFA_DCR_Doctor_Visit.DCR_Code  = tbl_SFA_DCR_Detailed_Products.DCR_Code
				INNER JOIN tbl_SFA_Product_Master  WITH(NOLOCK)
					ON tbl_SFA_DCR_Detailed_Products.Sales_Product_Code = tbl_SFA_Product_Master.Product_Code 
				LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
					ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
					AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
				LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
					ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
				INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
					ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
				INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
					ON tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name
				INNER JOIN tbl_SFA_Speciality_Master ProductSpeciality WITH(NOLOCK)
					ON ProductSpeciality.Speciality_Code = tbl_SFA_Speciality_Master.Speciality_code
		WHERE 
			tbl_SFA_DCR_Detailed_Products.DCR_Code = @DCRCode
END




' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitAttachments]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitAttachments]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitAttachments]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
			tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_Customer_Master.Local_Area AS LocalArea
			, tbl_SFA_Customer_Master.Sur_Name AS SurName
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName

			, Tbl_SFA_DCR_Attachment.Blob_URL AS BlobURL
			, Tbl_SFA_DCR_Attachment.Uploaded_File_Name AS UpoadedFileName
	FROM Tbl_SFA_DCR_Attachment WITH(NOLOCK)
		INNER JOIN tbl_SFA_DCR_Doctor_Visit WITH(NOLOCK)
			ON tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code = Tbl_SFA_DCR_Attachment.DCR_Visit_Code
		LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
			ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
			AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
			ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
		INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
			ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
			ON tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name
	WHERE 
	tbl_SFA_DCR_Doctor_Visit.DCR_Code = @DCRCode
END




' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RptFramework_GetDCRDoctorVisitDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RptFramework_GetDCRDoctorVisitDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RptFramework_GetDCRDoctorVisitDetails]
	@DCRCode varchar(50)
AS
BEGIN
	
		SELECT 
			tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
			,tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
			, Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Visit_Mode AS VisitMode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Visit_Time as VisitTime
			, Is_CP_Doc  AS IsCPDoctor
			, tbl_SFA_DCR_Doctor_Visit.PO_Amount AS POBAmount
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Remarks_By_User ''Remarks''
			, CASE WHEN tbl_SFA_DCR_Doctor_Visit.Lattitude = ''NOT_FOUND'' THEN ''0'' 
					WHEN ISNULL(tbl_SFA_DCR_Doctor_Visit.Lattitude,'''') ='''' THEN ''0'' ELSE 
					tbl_SFA_DCR_Doctor_Visit.Lattitude
				END AS Lattitude
			, CASE WHEN tbl_SFA_DCR_Doctor_Visit.Longitude = ''NOT_FOUND'' THEN ''0'' 
					WHEN ISNULL(tbl_SFA_DCR_Doctor_Visit.Longitude,'''') ='''' THEN ''0'' ELSE 
					tbl_SFA_DCR_Doctor_Visit.Longitude
				END AS Longitude
			, ISNULL(tbl_SFA_Customer_Master.Local_Area,'''') AS LocalArea
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, ISNULL(tbl_SFA_Customer_Master.Sur_Name,'''') SurName
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName
			, CASE WHEN (SELECT COUNT(DCR_Doctor_Acc_code) FROM tbl_SFA_DCr_Doctor_Accompanist 
			WHERE DCR_code=@DCRCode AND Doctor_Visit_Code=tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AND ISNULL(Is_Only_For_Doctor,''N'') = ''N'') > 0 THEN 1 ELSE 0 END AS JointCall
			--, CASE WHEN ISNULL(DCR_Doctor_Acc_Code,'''') <> '''' THEN 1 ELSE 0 END AS JointCall 
		FROM 
			tbl_SFA_DCR_Doctor_Visit WITH(NOLOCK) 
			 LEFT JOIN tbl_SFA_Customer_Master  WITH(NOLOCK)
				ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
				AND  tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
			LEFT JOIN tbl_SFA_Doctor_Category 
				ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
			INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
				ON tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name
			INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
				ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		
		WHERE tbl_SFA_DCR_Doctor_Visit.DCR_Code = @DCRCode
END

' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitFollowups]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitFollowups]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRDoctorVisitFollowups]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
			tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_Customer_Master.Local_Area AS LocalArea
			, tbl_SFA_Customer_Master.Sur_Name AS SurName
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName

			, TBL_SFA_DCR_Follow_Ups.Tasks AS BlobURL
			, TBL_SFA_DCR_Follow_Ups.Due_Date AS DueDateUTC
	FROM TBL_SFA_DCR_Follow_Ups WITH(NOLOCK)
		INNER JOIN tbl_SFA_DCR_Doctor_Visit WITH(NOLOCK)
			ON tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code = TBL_SFA_DCR_Follow_Ups.DCR_Visit_Code
		LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
			ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
			AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
			ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
		INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
			ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
			ON tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name
	WHERE 
	tbl_SFA_DCR_Doctor_Visit.DCR_Code = @DCRCode
END



' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRExpenseDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRExpenseDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRExpenseDetails]
	@DCRCode VARCHAR(50),
	@Flag VARCHAR(1)
AS
BEGIN
	SELECT 
		tbl_SFA_DCR_Expense_Details.Company_Code AS CompanyCode
		, tbl_SFA_DCR_Expense_Details.DCR_Code AS DCRCode
		, tbl_SFA_DCR_Expense_Details.DCR_Flag  AS Flag
		, tbl_SFA_Expense_Type_Master.Expense_Type_Code AS ExpenseTypeCode
		, Expense_Type_Name  AS ExpenseTypeName
		, Expense_Amount AS ExpenseAmount
		, ISNULL(Expense_Remarks,'''') AS Remarks
		, tbl_SFA_DCR_Expense_Details.Expense_Mode AS ExpenseMode
		, Expense_Claim_Code AS ExpenseClaimCode
		, tbl_SFA_DCR_Expense_Details.Expense_Group_Id AS ExpenseGroupId
		, Expense_Group_Name AS ExpenseGroupName
		, Eligibility_Amount AS EligibilityAmount
	FROM 
		tbl_SFA_DCR_Expense_Details WITH(NOLOCK)
			INNER JOIN tbl_SFA_Expense_Type_Master  WITH(NOLOCK)
				ON tbl_SFA_Expense_Type_Master.Expense_Type_Code = tbl_SFA_DCR_Expense_Details.Expense_Type_Code
			INNER JOIN tbl_SFA_Expense_Group_header WITH(NOLOCK)
				ON tbl_SFA_Expense_Group_header.Expense_Group_Id = tbl_SFA_DCR_Expense_Details.Expense_Group_Id
	WHERE 
	tbl_SFA_DCR_Expense_Details.DCR_Code = @DCRCode
	AND tbl_SFA_DCR_Expense_Details.DCR_Flag = @Flag
END


' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDCRSamplesDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDCRSamplesDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDCRSamplesDetails]
	@DCRCode VARCHAR(50)
	
AS
BEGIN
		SELECT 
			tbl_SFA_DCR_Doctor_Visit.Company_Code As CompanyCode
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			,tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_Customer_Master.Local_Area AS LocalArea
			, tbl_SFA_Customer_Master.Sur_Name AS SurName
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, DoctorSpecialityMaster.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName
			, tbl_SFA_DCR_Product_Details.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Product_Details.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Product_Details.Product_Code AS ProductCode
			, tbl_SFA_Product_Master.Product_Name AS ProductName
			, tbl_SFA_Product_Master.Product_Type_Name As ProductTypeName
			, tbl_SFA_Product_Master.Product_Type As ProductTypeCode
			, tbl_SFA_DCR_Product_Details.Quantity_Provided AS QuantityProvided
			, tbl_SFA_DCR_Product_Details.Speciality_Code AS ProductSpecialityCode
			, ProductSpecialityMaster.Speciality_Name AS ProductSpecialityName
		FROM 
			tbl_SFA_DCR_Doctor_Visit  WITH(NOLOCK)
				INNER JOIN tbl_SFA_DCR_Product_Details  WITH(NOLOCK)
					ON tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code  = tbl_SFA_DCR_Product_Details.DCR_Visit_Code
				INNER JOIN tbl_SFA_Product_Master  WITH(NOLOCK)
					ON tbl_SFA_DCR_Product_Details.Product_Code = tbl_SFA_Product_Master.Product_Code 
				LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
					ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
					AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
				LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
					ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
				INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
					ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
				INNER JOIN tbl_SFA_Speciality_Master DoctorSpecialityMaster WITH(NOLOCK)
					ON DoctorSpecialityMaster.Speciality_Code = tbl_SFA_DCR_Product_Details.Speciality_Code
				JOIN tbl_SFA_Speciality_Master ProductSpecialityMaster WITH(NOLOCK)
					ON ProductSpecialityMaster.Speciality_Code = tbl_SFA_DCR_Product_Details.Speciality_Code
		WHERE 
			tbl_SFA_DCR_Product_Details.DCR_Code = @DCRCode
END



' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RptFramework_GetDCRStockiestVisitDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RptFramework_GetDCRStockiestVisitDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RptFramework_GetDCRStockiestVisitDetails]
	@DCRCode VARCHAR(50)
AS
	BEGIN

		SELECT 
		tbl_SFA_DCR_Stockiest_Visit.Company_Code AS CompanyCode
		, tbl_SFA_DCR_Stockiest_Visit.DCR_Code AS DCRCode	
		, DCR_Stockiest_Code
		, Stockiest_Name AS StokiestName
		, Visit_Mode AS VisitMode
		, Remarks_By_User AS Remarks
		, DCR_Actual_Date as DCRActualDateUTC
		, PO_Amount AS POBAmount
		, Collection_Amount AS CollectionAmount
		, Stockiest_Code AS StockiestCode
		FROM 
			tbl_SFA_DCR_Stockiest_Visit WITH(NOLOCK)
		WHERE 
			tbl_SFA_DCR_Stockiest_Visit.DCR_Code = @DCRCode
END
' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RptFramework_GetDCRTravelledDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RptFramework_GetDCRTravelledDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RptFramework_GetDCRTravelledDetails]
(
	@DCRCode VARCHAR(50),
	@Flag CHAR(1)

)
AS
BEGIN

		SELECT 
			Company_Code AS CompanyCode
			, DCR_Code AS DCRCode
			, From_Place AS FromPlace
			, To_Place AS ToPlace 
			, Travel_Mode AS TravelMode
			, Travelled_Kms AS Distance
			, SFC_Region_Code AS SFCRegionCode
			, SFC_Category_Name AS SFCCategoryName
			, Distance_Fare_Code AS DistanceFareCode
			, SFC_Version_No AS SFCVersionNo 
			, Route_Way AS RouteWay
			, Flag AS ActivityFlag
		FROM 
			tbl_SFA_DCR_MAster WITH(NOLOCK)
		WHERE 
			DCR_Code = @DCRCode
			AND Flag = @Flag
			AND Category=''HQ'' 
		UNION
		SELECT 
			 tbl_SFA_DCR_Master.Company_Code AS CompanyCode
			, tbl_SFA_DCR_Master.DCR_Code  AS DCRCode
			, tbl_SFA_DCR_Travelled_Places.From_Place AS FromPlace
			, tbl_SFA_DCR_Travelled_Places.To_Place AS ToPlace
			, tbl_SFA_DCR_Travelled_Places.Travel_Mode AS TravelMode
			, tbl_SFA_DCR_Travelled_Places.Distance AS Distance 
			, tbl_SFA_DCR_Travelled_Places.SFC_Region_Code AS SFCRegionCode 
			, tbl_SFA_DCR_Travelled_Places.SFC_Category_Name AS SFCCategoryName
			, tbl_SFA_DCR_Travelled_Places.Distance_Fare_Code AS DistanceFareCode
			, tbl_SFA_DCR_Travelled_Places.SFC_Version_No AS SFCVersionNo
			, tbl_SFA_DCR_Travelled_Places.Route_Way AS RouteWay
			, DCR_HOP_Flag AS ActivityFlag
		FROM 
			tbl_SFA_DCR_Travelled_Places WITH(NOLOCK)
			INNER JOIN tbl_SFA_DCR_MAster WITH(NOLOCK)
				ON tbl_SFA_DCR_MAster.DCR_Code = tbl_SFA_DCR_Travelled_Places.DCR_Code
				AND tbl_SFA_DCR_Master.Flag = tbl_SFA_DCR_Travelled_Places.DCR_HOP_Flag
		WHERE
			tbl_SFA_DCR_Travelled_Places.DCR_Code = @DCRCode
			AND DCR_HOP_Flag = @Flag
			AND Category<>''HQ'' 
END

' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDivisionDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDivisionDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDivisionDetails]
(
	@UserCode VARCHAR(30),
	@EntityType VARCHAR(10)
)
AS
BEGIN
	IF @EntityType =''USER''
	BEGIN
		SELECT 
		 tbl_SFA_Division_Entity_Mapping.Company_Code AS CompanyCode
		, tbl_SFA_Division_Entity_Mapping.Division_Code AS DivisionCode
		, Division_Name  AS DivisionName
		, Entity_Code AS EntityCode
		, Entity_Type AS EntityType
		FROM tbl_SFA_Division_Entity_Mapping WITH(NOLOCK)
			INNER JOIN tbl_SFA_Division_Master WITH(NOLOCK)
				ON tbl_SFA_Division_Master.Division_Code = tbl_SFA_Division_Entity_Mapping.Division_Code
		WHERE Entity_Code = @UserCode AND Entity_Type=''USER''
	END

END

' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetDoctorAccompanist]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetDoctorAccompanist]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetDoctorAccompanist]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
		tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
		, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
		, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
		, tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
		, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
		, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
		, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
		, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
		, tbl_SFA_Customer_Master.Local_Area AS LocalArea
		, tbl_SFA_Customer_Master.Sur_Name AS SurName
		, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
		, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
		, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
		, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
		, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
		, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName
		, tbl_SFA_DCR_Doctor_Accompanist.Acc_User_Name AS AccUserName
		, tbl_SFA_DCR_Doctor_Accompanist.Acc_User_Code  AS AccUserCode
		, tbl_SFA_DCR_Doctor_Accompanist.Acc_Region_Code AS AccRegionCode
		, tbl_SFA_Region_Master.Region_Name AS AccRegionName
		, tbl_SFA_DCR_Doctor_Accompanist.Doctor_Visit_Code AS DoctorVisitCode
		, tbl_SFA_DCR_Doctor_Accompanist.DCR_Code AS DCRCode
		, CASE 
			WHEN tbl_SFA_DCR_Doctor_Accompanist.Is_Only_For_Doctor = ''Y'' THEN 
				1 
			ELSE 
				0 
			END AS OnlyForDoctor
		, tbl_SFA_DCR_Doctor_Accompanist.DCR_Code AS DCRCode
		, tbl_SFA_DCR_Doctor_Accompanist.Acc_User_Type_Name AS AccUserTypeName
		, tbl_SFA_Employee_Master.Employee_Name AS EmployeeName
	FROM 
		tbl_SFA_DCR_Doctor_Accompanist WITH(NOLOCK)
		INNER JOIN tbl_SFA_DCR_Doctor_Visit WITH(NOLOCK)
			ON tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code = tbl_SFA_DCR_Doctor_Accompanist.Doctor_Visit_Code
		LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
			ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
			AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
			ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
		INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
			ON  tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name		
		INNER JOIN tbl_SFA_User_Master WITH(NOLOCK)
			ON tbl_SFA_User_Master.User_Code = tbl_SFA_DCR_Doctor_Accompanist.Acc_User_Code
		INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
			ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Accompanist.Acc_Region_Code
		INNER JOIN tbl_SFA_Employee_Master WITH(NOLOCK)
			ON tbl_SFA_Employee_Master.Employee_Code = tbl_SFA_User_MAster.Employee_Code
	WHERE 
		tbl_SFA_DCR_Doctor_Accompanist.DCR_Code = @DCRCode
END




' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetRCPADetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetRCPADetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetRCPADetails]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
			tbl_SFA_DCR_Doctor_Visit.Company_Code AS CompanyCode
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.DCR_Visit_Code AS DoctorVisitCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Code AS DCRCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Name AS DoctorName
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Code AS DoctorCode
			, tbl_SFA_Customer_Master.MDL_Number AS MDLNo
			, tbl_SFA_Customer_Master.Local_Area AS LocalArea
			, tbl_SFA_Customer_Master.Sur_Name AS SurName
			, tbl_SFA_Doctor_Category.Category_Name AS CategoryName
			, tbl_SFA_DCR_Doctor_Visit.User_Code AS UserCode
			, tbl_SFA_DCR_Doctor_Visit.DCR_Actual_Date AS DCRActualDateUTC
			, tbl_SFA_DCR_Doctor_Visit.Category_Code AS CategoryCode
			, tbl_SFA_DCR_Doctor_Visit.Speciality_Name AS SpecialityName
			, tbl_SFA_Speciality_Master.Speciality_Code AS SpecialityCode
			, tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code AS DoctorRegionCode
			, tbl_SFA_Region_Master.Region_Name AS DoctorRegionName
			, tbl_SFA_DCR_Chemists_visit.Chemists_Name AS ChemistName
			, tbl_SFA_DCR_Chemists_visit.Chemist_Code AS ChemistCode
			, tbl_SFA_DCR_RCPA_Details.DCR_Product_Code AS OwnProductCode
			, tbl_SFA_DCR_RCPA_Details.Chemist_Visit_Code AS ChemistVisitCode
			, Product_Code AS ProductCode
			, Competitor_Product_Name AS ProductName
			, Support_Qty AS Qty
	FROM tbl_SFA_DCR_RCPA_Details WITH(NOLOCK)
		INNER JOIN tbl_SFA_DCR_Chemists_visit WITH(NOLOCK)
			ON tbl_SFA_DCR_RCPA_Details.DCR_Code = tbl_SFA_DCR_Chemists_visit.DCR_Code
			AND tbl_SFA_DCR_RCPA_Details.DCR_Visit_Code = tbl_SFA_DCR_Chemists_visit.DCR_Visit_Code
			AND tbl_SFA_DCR_RCPA_Details.Chemist_Visit_Code = tbl_SFA_DCR_Chemists_visit.DCR_Chemists_Code
		INNER JOIN tbl_SFA_DCR_Doctor_Visit WITH(NOLOCk)
			ON tbl_SFA_DCR_Doctor_Visit.DCR_Code = tbl_SFA_DCR_RCPA_Details.DCR_Code
			AND tbl_SFA_DCR_Doctor_Visit.DCR_visit_Code = tbl_SFA_DCR_RCPA_Details.DCR_Visit_Code
		LEFT JOIN tbl_SFA_Customer_Master WITH(NOLOCK)
			ON tbl_SFA_Customer_Master.Customer_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Code
			AND tbl_SFA_Customer_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		LEFT JOIN tbl_SFA_Doctor_Category WITH(NOLOCK)
			ON tbl_SFA_Doctor_Category.Category_Code = tbl_SFA_DCR_Doctor_Visit.Category_Code
		INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
			ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_DCR_Doctor_Visit.Doctor_Region_Code
		INNER JOIN tbl_SFA_Speciality_Master WITH(NOLOCK)
			ON tbl_SFA_Speciality_Master.Speciality_Name = tbl_SFA_DCR_Doctor_Visit.Speciality_Name
	WHERE 
		tbl_SFA_DCR_RCPA_Details.DCR_Code = @DCRCode
		AND tbl_SFA_DCR_Chemists_visit.DCR_Code= @DCRCode
		AND tbl_SFA_DCR_Doctor_Visit.DCR_Code = @DCRCode
END

' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetReportingManagerDetails]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetReportingManagerDetails]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetReportingManagerDetails]
(
	@UserCode VARCHAR(30)
)
AS
BEGIN
	DECLARE @UnderUserCode VARCHAR(30)
	SELECT @UnderUserCode = Under_User_Code FROM tbl_SFA_User_Master WITH(NOLOCK) 
	WHERE User_Code=@UserCode

	SELECT 
	  tbl_SFA_User_Master.Company_Code AS CompanyCode	
	, Employee_Name AS EmployeeName
	, Employee_Number AS EmployeeNumber
	, [User_name] AS UserName
	, User_Code AS UserCode
	, User_Type_Name AS UserTypeName
	, tbl_SFA_User_Master.User_Type_Code As UserTypeCode
	, Region_Name As RegionName
	, tbl_SFA_User_Master.Region_Code AS RegionCode
	 FROM tbl_SFA_User_Master WITH(NOLOCK)
	INNER JOIN tbl_SFA_Employee_Master WITH(NOLOCK)
		ON tbl_SFA_Employee_Master.Employee_Code = tbl_SFA_User_Master.Employee_Code
	INNER JOIN tbl_SFA_User_type_Master WITH(NOLOCK)
		ON tbl_SFA_User_Type_Master.User_Type_Code=tbl_SFA_User_Master.User_Type_Code
	INNER JOIN tbl_SFA_Region_Master WITH(NOLOCK)
		ON tbl_SFA_Region_Master.Region_Code = tbl_SFA_User_Master.Region_Code
	WHERE User_Code = @UnderUserCode
END' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetStockistVisit]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetStockistVisit]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetStockistVisit]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	
	SELECT 
		Company_Code AS CompanyCode
		, DCR_Code AS DCRCode
		, User_Code AS UserCode
		, DCR_Actual_Date AS DCRActualDateUTC
		, Stockiest_Code AS Stockist_Code
		, Stockiest_Name AS StockistName
		, PO_Amount AS POBAmount
		, Collection_Amount As CollectionAmount
	FROM 
	tbl_SFA_DCR_Stockiest_Visit WITH(NOLOCK)
	WHERE DCR_Code = @DCRCode
END

' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_hd_RPTFramework_GetTimeSheetEntry]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_RPTFramework_GetTimeSheetEntry]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'CREATE PROCEDURE [dbo].[usp_hd_RPTFramework_GetTimeSheetEntry]
(
	@DCRCode VARCHAR(50)
)
AS
BEGIN
	SELECT 
		tbl_SFA_Timesheet_Entry.Company_Code AS CompanyCode
		, tbl_SFA_Timesheet_Entry.DCR_Code AS DCRCode
		, tbl_SFA_Timesheet_Entry.Project_Code AS ProjectCode
		, tbl_SFA_Timesheet_Entry.Activity_Code As ActivityCode
		, Start_Time AS StartTime
		, End_Time AS EndTime
		, tbl_SFA_Timesheet_Entry.Remarks AS Remarks
		, Project_Name AS ProjectName
		, Activity_Name AS ActivityName
	FROM
		 tbl_SFA_Timesheet_Entry WITH(NOLOCK)
			INNER JOIN tbl_SFA_Project_Master WITH(NOLOCK)
				ON tbl_SFA_Project_Master.Project_Code = tbl_SFA_Timesheet_Entry.Project_Code
			INNER JOIN tbl_SFA_Activity_Master WITH(NOLOCK)
				ON tbl_SFA_Activity_Master.Activity_Code = tbl_SFA_Timesheet_Entry.Activity_Code
	WHERE 
		tbl_SFA_Timesheet_Entry.DCR_Code=@DCRCode
		
END
' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_RPTFramework_GetParentUsers]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_RPTFramework_GetParentUsers]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'

CREATE PROC [dbo].[usp_RPTFramework_GetParentUsers] 
	@UserCode VARCHAR(30)		
AS
BEGIN
	BEGIN TRY
		DECLARE @FullIndex VARCHAR(150)
		DECLARE @TempStr VARCHAR(MAX)
		SELECT @FullIndex=Full_index from tbl_SFA_User_Master WHERE User_Code=@UserCode 
		--SET @FullIndex=@FullIndex+''.''
		DECLARE @SplitTbl TABLE
			(
			  PK int,
			  Data varchar(500),
			  HeaderId INT
			)
			DECLARE @CNT INT
			SELECT @CNT= LEN(@FullIndex) - LEN(REPLACE(@FullIndex,''.'',''''))
			INSERT INTO @SplitTbl SELECT * FROM dbo.fun_Split(@FullIndex, ''.'',1,@CNT)
			DECLARE @data VARCHAR(max)
			DECLARE @rowCnt INT
			SELECT @rowCnt=MAX(HeaderId) from @SplitTbl
			declare @firstrow int
			DECLARE @IndexVar VARCHAR(MAX)
			SET @IndexVar=''''
			SELECT @firstrow=min(HeaderId) from @SplitTbl
				WHILE (@rowCnt>=@firstrow)
				BEGIN
					SELECT @data = COALESCE(@data +''.'','''') + Data FROM @SplitTbl where HeaderId = @firstrow
					set @IndexVar =  @IndexVar +''^''+@data+''.^,''
					set @firstrow = @firstrow + 1
				END
		
		SET @IndexVar = REPLACE(@IndexVar,''^'','''''''')
		set @IndexVar= left(@IndexVar,len(@IndexVar)-1)
		DECLARE @Qry VARCHAR(MAX)
		SET @Qry = ''SELECT User_Code AS UserCode FROM tbl_SFA_User_Master WITH(NOLOCK) WHERE User_Status=''''1''''  AND Full_index IN (''+@IndexVar+'') 
					AND User_code <>''''''+@UserCode+'''''' ORDER BY Full_index''
		EXEC(@Qry)
	END TRY		
	BEGIN CATCH
		DECLARE @ErrorMessage VARCHAR(500)
	    SET @ErrorMessage =  ERROR_MESSAGE()
	END CATCH
	
END


' 
END
GO
/****** Object:  StoredProcedure [dbo].[usp_RPTFramework_hdGetParentRegionsCodeOnly]    Script Date: Sep/10/2017 10:17:23 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_RPTFramework_hdGetParentRegionsCodeOnly]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'
CREATE PROC [dbo].[usp_RPTFramework_hdGetParentRegionsCodeOnly] 
	@RegionCode VARCHAR(30)		
AS
BEGIN
	BEGIN TRY
		DECLARE @FullIndex VARCHAR(150)
		DECLARE @TempStr VARCHAR(MAX)
		SELECT @FullIndex=Full_index from tbl_SFA_Region_Master WHERE Region_Code=@RegionCode
		--SET @FullIndex=@FullIndex+''.''
			DECLARE @SplitTbl TABLE
			(
			  PK int,
			  Data varchar(500),
			  HeaderId INT
			)
			DECLARE @CNT INT
			SELECT @CNT= LEN(@FullIndex) - LEN(REPLACE(@FullIndex,''.'',''''))
			INSERT INTO @SplitTbl SELECT * FROM dbo.fun_Split(@FullIndex, ''.'',1,@CNT)
			DECLARE @data VARCHAR(max)
			DECLARE @rowCnt INT
			SELECT @rowCnt=MAX(HeaderId) from @SplitTbl
			declare @firstrow int
			DECLARE @IndexVar VARCHAR(MAX)
			SET @IndexVar=''''
			SELECT @firstrow=min(HeaderId) from @SplitTbl
				WHILE (@rowCnt>=@firstrow)
				BEGIN
					SELECT @data = COALESCE(@data +''.'','''') + Data FROM @SplitTbl where HeaderId = @firstrow
					set @IndexVar =  @IndexVar + @data + ''.^''
					set @firstrow = @firstrow + 1
				END
		SELECT 
			Region_Code AS RegionCode
		FROM tbl_SFA_Region_Master WITH(NOLOCK)   
		WHERE 
			Region_Status=''1'' 
			AND Full_index IN (SELECT strval FROM [dbo].[fun_Split](@IndexVar, ''^'',1,
								LEN(@IndexVar) - LEN(REPLACE(@IndexVar,''^'',''''))))  		
			AND Region_Code <> @RegionCode
	END TRY		
	BEGIN CATCH
		DECLARE @ErrorMessage VARCHAR(500)
	    SET @ErrorMessage =  ERROR_MESSAGE()
	END CATCH
	
END




' 
END
GO
