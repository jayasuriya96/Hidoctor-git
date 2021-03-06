IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_BPP_GetBeatWiseFullDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_BPP_GetBeatWiseFullDetails]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_BPP_GetBeatWiseFullDetails]    Script Date: 18-02-2021 12:23:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SP_HD_BPP_GetBeatWiseFullDetails]
@CompanyCode varchar(30),
@RegionCode varchar(30),
@BeatCode varchar(100),
@EntityType varchar(50)
AS
BEGIN





		Select 
			T1.CP_code 'Beat_Code',
			T1.CP_name 'Beat_Name',
			ISNULL(T1.Work_area,'-')'Work_Area',
			T2.Expense_Entity_Name 'Work_Category_Name',
			T3.From_Region_Name 'From_Place',
			T3.To_Region_Name 'To_Place',
			T3.Travel_Mode,
			T2.Expense_Entity_Code 'Work_Category_Code',
			CASE 
				WHEN T1.Status=1 THEN 'Approved'
				WHEN T1.Status=2 THEN 'Applied'
				WHEN T1.Status=0 THEN 'UnApproved'
			END AS Beat_Status,
			T4.Weeknumber,
			T4.Weekday
			
		From 
			tbl_SFA_Camp_Planner_Header T1 with(nolock)
			LEFT JOIN tbl_SFA_Expense_Entity_Master T2 with(nolock)
				ON T1.Category_Code=T2.Expense_Entity_Code
			LEFT JOIN tbl_SFA_Region_Distance T3 with(nolock)
				ON T1.Distance_Fare_code=T3.Distance_Fare_Code
			LEFT JOIN tbl_sfa_Beatplan_weekmapping T4
				ON T1.CP_code=T4.CP_code
		Where
			T1.Company_Code=@CompanyCode
			AND T1.Region_Code=@RegionCode
			AND T1.CP_code=@BeatCode


		Select
			Case When T1.Route_Way = 'R' Then T1.To_Place Else T1.From_Place End From_Place,
			Case When T1.Route_Way = 'R' Then T1.From_Place Else T1.To_Place End TO_Place,
			T1.Distance_Fare_Code,
			T1.Travel_Mode,
			T1.CP_Code 'Beat_Code',
			ISNULL(T1.SFC_Category_Name,'-') 'Work_Category_Name',
			ISNULL(T1.Distance,0)'Distance',
			ISNULL(T1.Amount,0)'Fare_Amount',
			T1.Route_Way
		From
			tbl_SFA_Camp_Planner_SFC T1 With(nolock)
			LEFT JOIN tbl_SFA_Camp_Planner_Header T3 with(nolock)
				ON T1.CP_Code=T3.CP_code
			--LEFT JOIN tbl_SFA_Region_Distance T2 with(nolock)
			--	ON T1.Distance_Fare_code=T2.Distance_Fare_Code
		
		Where
			T1.Company_Code=@CompanyCode
			AND T3.Region_Code=@RegionCode
			AND T1.CP_code=@BeatCode
			--AND (GETDATE() BETWEEN Date_From and Date_To)

		Select
			T3.Customer_Code,
			ISNULL(NULLIF(T3.Customer_Name,''),'')'First_Name',
			ISNULL(NULLIF(T3.Sur_Name,''),'') 'Last_Name',
			T4.Speciality_Name,
			T5.Category_Name,
			CASE WHEN T3.Customer_Status=1 THEN 'Approved'
			WHEN T3.Customer_Status=2 THEN 'Applied'
			WHEN T3.Customer_Status=0 THEN 'UnApproved'
			END as 'Customer_Status_Text',
			T3.Customer_Status,
			T2.Region_Code,
			T3.Customer_Entity_Type
		From
			tbl_SFA_Camp_Planner_Detail T1 with(nolock)
			LEFT JOIN tbl_SFA_Camp_Planner_Header T2 with(nolock)
				ON T1.CP_Code=T2.CP_code
			INNER JOIN tbl_SFA_Customer_Master T3 with(nolock)
				ON T1.Doctor_Code=T3.Customer_Code
				and T3.Customer_Entity_Type='DOCTOR'
			INNER JOIN tbl_SFA_Speciality_Master T4 with(nolock)
				ON T3.Speciality_Code=T4.Speciality_Code
			INNER JOIN tbl_SFA_Doctor_Category T5 with(nolock)
				ON T3.Category=T5.Category_Code
		Where
			T1.Company_Code=@CompanyCode
			AND T2.Region_Code=@RegionCode
			AND T1.CP_code=@BeatCode
		

		Select
			T3.Customer_Code,
			ISNULL(NULLIF(T3.Customer_Name,''),'')'First_Name',
			ISNULL(NULLIF(T3.Sur_Name,''),'') 'Last_Name',
			CASE WHEN T3.Customer_Status=1 THEN 'Approved'
			WHEN T3.Customer_Status=2 THEN 'Applied'
			WHEN T3.Customer_Status=0 THEN 'UnApproved'
			END as 'Customer_Status_Text',
			T3.Customer_Status,
			T2.Region_Code,
			T3.Customer_Entity_Type,
			ISNULL(NULLIF(T3.Drug_License_Number1,''),'-') 'Drug_License_Number',
			ISNULL(NULLIF(T3.Ref_Key1,''),'-') 'Ref_Key1'
		From
			tbl_SFA_Camp_Planner_Chemist_Details T1 with(nolock)
			LEFT JOIN tbl_SFA_Camp_Planner_Header T2 with(nolock)
				ON T1.CP_Code=T2.CP_code
			INNER JOIN tbl_SFA_Customer_Master T3 with(nolock)
				ON T1.Chemist_Code=T3.Customer_Code
				AND T3.Region_Code=@RegionCode
				and T3.Customer_Entity_Type='CHEMIST'
		Where
			T1.Company_Code=@CompanyCode
			AND T2.Region_Code=@RegionCode
			AND T1.CP_code=@BeatCode
		


		Select
			T3.Customer_Code,
			ISNULL(NULLIF(T3.Customer_Name,''),'')'First_Name',
			ISNULL(NULLIF(T3.Sur_Name,''),'') 'Last_Name',
			CASE WHEN T3.Customer_Status=1 THEN 'Approved'
			WHEN T3.Customer_Status=2 THEN 'Applied'
			WHEN T3.Customer_Status=0 THEN 'UnApproved'
			END as 'Customer_Status_Text',
			T3.Customer_Status,
			T2.Region_Code,
			T3.Customer_Entity_Type,
			ISNULL(NULLIF(T3.Drug_License_Number1,''),'-') 'Drug_License_Number',
			ISNULL(NULLIF(T3.Ref_Key1,''),'-') 'Ref_Key1'
		From
			tbl_SFA_Camp_Planner_Stockist_Details T1 with(nolock)
			INNER JOIN tbl_SFA_Camp_Planner_Header T2 with(nolock)
				ON T1.CP_Code=T2.CP_code
			INNER JOIN tbl_SFA_Customer_Master T3 with(nolock)
				ON T1.Stockist_Code=T3.Customer_Code
				AND T3.Region_Code=@RegionCode
				and T3.Customer_Entity_Type='STOCKIEST'
		Where
			T1.Company_Code=@CompanyCode
			AND T2.Region_Code=@RegionCode
			AND T1.CP_code=@BeatCode
		


END
