IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_BPP_GetBeatPlanDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_BPP_GetBeatPlanDetails]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_BPP_GetBeatPlanDetails]    Script Date: 19-02-2021 10:27:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		AJAY VAMSI DNV
-- Create date: 03-06-2019
-- Description:Procedure to Get Beat/PatchDetails
--[SP_HD_BPP_GetBeatPlanDetails] 'COM00000276','2,','REC00000259'
-- =============================================
CREATE PROCEDURE [dbo].[SP_HD_BPP_GetBeatPlanDetails]
@CompanyCode varchar(30),
@BeatStatus varchar(100),
@RegionCode varchar(30)
--@FromDate varchar(30),
--@ToDate varchar(30)
AS
BEGIN

	IF(@BeatStatus='-1,')
	BEGIN
		Set @BeatStatus='1,2,0,';
	END

	DECLARE @tblStatus TABLE
	(
		Id int Identity(1,1),
		Status char(5)
	)

	INSERT INTO @tblStatus
	Select
		Strval
	From
		[dbo].[fun_Split](@BeatStatus,',',1,LEN(@BeatStatus)-LEN(REPLACE(@BeatStatus,',','')))

	Select
		T1.CP_name 'Beat_Name',
		T1.CP_Code 'Beat_Code',
		T1.Region_Code,
		T2.Region_Name,
		T1.Category_Code 'Work_Category_Code',
		T3.Expense_Entity_Name 'Work_Category_Name',
		CASE WHEN T1.Status=1 THEN 'Approved'
		WHEN T1.Status=2 THEN 'Applied'
		WHEN T1.Status=0 THEN 'UnApproved' END 'Beat_Status',
		T1.Work_Area,
		CONVERT(int,T1.Status) 'Status',
		ISNULL(T4.SFC_Details_Count,0) 'SFC_Details_Count',
		ISNULL(T5.Doctor_Details_Count,0) 'Doctor_Details_Count',
		ISNULL(T6.Chemist_Details_Count,0) 'Chemist_Details_Count',
		ISNULL(T7.Stockist_Details_Count,0) 'Stockist_Details_Count',
		ISNULL(T9.WorkArea_Details_Count,0) 'WorkArea_Details_Count',
		ISNULL(T8.User_Name,'-') 'Created_By',
		CONVERT(varchar,T1.Created_Date,103) 'Created_DateTime',
		ISNULL(Unapprove_Reason,'-')'Remarks',
		Weeknumber,
		Weekday
	From
		tbl_SFA_Camp_Planner_Header T1
		INNER JOIN tbl_SFA_Region_Master T2
			ON T1.Region_Code=T2.Region_Code
		INNER JOIN tbl_SFA_Expense_Entity_Master T3
			ON T1.Category_Code=T3.Expense_Entity_Code
		LEFT JOIN tbl_sfa_Beatplan_weekmapping BWM
			ON T1.CP_code=BWM.CP_code
		LEFT JOIN
		(
			Select
				CP_Code,
				COUNT(1) 'SFC_Details_Count'
			From
				tbl_SFA_Camp_Planner_SFC
			Group By
				CP_Code
		)T4 
			ON T1.CP_Code=T4.CP_Code
		LEFT JOIN 
		(
			Select
				CP_Code,
				COUNT(1) 'Doctor_Details_Count'
			From
				tbl_SFA_Camp_Planner_Detail
			Group By
				CP_Code
		)T5 
			ON T1.CP_Code=T5.CP_Code
		LEFT JOIN 
		(
			Select
				CP_Code,
				Count(1) 'Chemist_Details_Count'
			From	
				tbl_SFA_Camp_Planner_Chemist_Details
			Group By
				CP_Code
		) T6
			ON T1.CP_Code=T6.CP_Code
		LEFT JOIN 
		(
			Select
				CP_Code,
				Count(1) 'Stockist_Details_Count'
			From	
				tbl_SFA_Camp_Planner_Stockist_Details
			Group By
				CP_Code
		) T7
			ON T1.CP_Code=T7.CP_Code
		INNER JOIN tbl_SFA_User_Master T8
			ON (T1.Created_By=T8.User_Code or T1.Created_By=T8.User_Name)
		LEFT JOIN 
		(
			Select
				CP_Code,
				Count(1) 'WorkArea_Details_Count'
			From	
				tbl_SFA_Camp_Planner_WorkArea_Details
			Group By
				CP_Code
		) T9
			ON T1.CP_Code=T9.CP_Code
		INNER JOIN @tblStatus T10
			ON T1.Status=T10.Status
	Where
		T1.Company_Code=@CompanyCode
		AND T1.Region_Code=@RegionCode
	--Order By T1.Status


END
