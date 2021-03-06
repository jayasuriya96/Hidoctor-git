IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_BPP_UpdateBeatPlanDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_BPP_UpdateBeatPlanDetails]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_BPP_UpdateBeatPlanDetails]    Script Date: 18-02-2021 12:07:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		AJAY VAMSI DNV
-- Create date: 03-06-2019
-- Description:	Procedure to Update Beat/Patch Plan Details
--[SP_HD_BPP_UpdateBeatPlanDetails]
-- =============================================
CREATE PROCEDURE [dbo].[SP_HD_BPP_UpdateBeatPlanDetails]
@CompanyCode varchar(30),
@RegionCode varchar(30),
@BeatCode varchar(30),
@HistoryBeatCode varchar(30),
@BeatName varchar(1000),
@WorkArea varchar(MAX),
@Work_Category_Code varchar(30),
@Work_Category_Name varchar(1000),
@Created_By varchar(30),
@WeekNumber int,
@WeekDay varchar(30),
@TVP_BPP_InsertBeatSFCDetails TVP_BPP_InsertBeatSFCDetails READONLY,
@TVP_BPP_InsertBeatWADetails TVP_BPP_InsertBeatWADetails READONLY,
@Result varchar(MAX) OUTPUT
AS
BEGIN


--	Select * Into tbl_Temp_Beat_Details from @TVP_BPP_InsertBeatSFCDetails

	--Delete From tbl_Temp_Beat_Details

	--Insert Into tbl_Temp_Beat_Details
	--Select * from @TVP_BPP_InsertBeatSFCDetails

	BEGIN TRY
	BEGIN TRAN

		DECLARE @BeatStatus char(10)
		DECLARE @BeatStatus_g char(10)
		DECLARE @ChangeIntoAppliedOrNot int

		Select 
			@BeatStatus=Status
		From
			tbl_SFA_Camp_Planner_Header
		Where
			CP_Code=@BeatCode
			AND Region_Code=@RegionCode

		IF(@BeatStatus=0)
		BEGIN
			
				SET @BeatStatus_g=2;
		END
		ELSE IF(@BeatStatus=1)
		BEGIN


		
			Select 
				@ChangeIntoAppliedOrNot=COUNT(*)
			From
				@TVP_BPP_InsertBeatSFCDetails T1
				LEFT JOIN tbl_SFA_Camp_Planner_SFC T2
					ON (T1.From_Region_Name<>T2.From_Place
					OR T1.To_Region_Name<>T2.To_Place)
					
			Where
				T1.Region_Code=@RegionCode
				AND CP_Code=@BeatCode
				--AND (T1.From_Region_Name<>T2.From_Place
				--	OR T1.To_Region_Name<>T2.To_Place)

			IF(@ChangeIntoAppliedOrNot>0)
			BEGIN
				SET @BeatStatus_g=2;
			END
			ELSE
			BEGIN
				SET @BeatStatus_g=1;
			END

		END


		

		INSERT INTO tbl_SFA_Camp_Planner_Header_History
		(
			Company_Code,
			CP_code,
			CP_name,
			Status,
			Region_Code,
			Work_area,
			Place_From,
			Place_To,
			Distance,
			Fare_Amount,
			Travel_Mode,
			Unapprove_Reason,
			Category_Code,
			Distance_Fare_Code,
			Created_By,
			Updated_By,
			Created_Date,
			Updated_Date,
			Header_Tran_code,
			Cp_Approved_By,
			Cp_Approved_Date,
			SFC_Version_No,
			SFC_Category_Name,
			SFC_Visit_Count,
			Effective_From,
			Effective_To,
			UnApproved_By,
			UnApproved_DateTime
		)
		Select
			Company_Code,
			CP_code,
			CP_name,
			Status,
			Region_Code,
			Work_area,
			Place_From,
			Place_To,
			Distance,
			Fare_Amount,
			Travel_Mode,
			Unapprove_Reason,
			Category_Code,
			Distance_Fare_Code,
			Created_By,
			Updated_By,
			Created_Date,
			Updated_Date,
			@HistoryBeatCode,
			Cp_Approved_By,
			Cp_Approved_Date,
			SFC_Version_No,
			SFC_Category_Name,
			SFC_Visit_Count,
			Created_Date,
			GETDATE()-1,
			UnApproved_By,
			UnApproved_DateTime
		From
			tbl_SFA_Camp_Planner_Header
		Where
			CP_Code=@BeatCode
			AND Region_Code=@RegionCode
			AND CONVERT(varchar,Created_Date,103)<>CONVERT(varchar,GETDATE(),103)

		IF(UPPER(@Work_Category_Name)<>'HQ')
		BEGIN
				UPDATE
					T1
				Set
					CP_Name=@BeatName,
					Work_Area=@WorkArea,
					Category_Code=@Work_Category_Code,
					Updated_by=@Created_By,
					Created_By=CASE WHEN @BeatStatus_g=2 THEN @Created_By ELSE T1.Created_by END,
					Created_Date=CASE WHEN @BeatStatus_g=2 THEN GETDATE() ELSE T1.Created_Date END,
					Updated_Date=GETDATE(),
					Status=@BeatStatus_g,
					Cp_Approved_By=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.Cp_Approved_By END,
					Cp_Approved_Date=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.Cp_Approved_Date END,
					UnApproved_By=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.UnApproved_By END,
					UnApproved_DateTime=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.UnApproved_DateTime END
				From
					tbl_SFA_Camp_Planner_Header T1
				Where
					CP_Code=@BeatCode

				UPDATE
					T1
				Set
					CP_code=@BeatCode,
					Weeknumber=@WeekNumber,
					Weekday=@WeekDay,
					Effective_from=GETDATE(),
					Effective_To=(GETDATE()-1)
				FROM
					tbl_sfa_Beatplan_weekmapping T1

				SET @Result=@@ROWCOUNT
		END
		ELSE 
		BEGIN

				
				UPDATE
					T1
				Set
					CP_Name=@BeatName,
					Work_Area=@WorkArea,
					Category_Code=@Work_Category_Code,
					Updated_by=@Created_By,
					Updated_Date=GETDATE(),
					Place_From=T3.From_Region_Name,
					Place_To=T3.To_Region_Name,
					Distance=T3.Distance,
					Fare_Amount=T3.Fare_Amount,
					Travel_Mode=T3.Travel_Mode,
					Distance_Fare_Code=CASE WHEN T2.Distance_Fare_Code='0' THEN NULL ELSE T2.Distance_Fare_Code END,
					Created_By=@Created_By,
					Created_Date=GETDATE(),
					SFC_Version_No=T3.SFC_Version_No,
					SFC_Category_Name=T3.Category_Name,
					SFC_Visit_Count=T3.SFC_Visit_Count,
					Status=@BeatStatus_g,
					Cp_Approved_By=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.Cp_Approved_By END,
					Cp_Approved_Date=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.Cp_Approved_Date END,
					UnApproved_By=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.UnApproved_By END,
					UnApproved_DateTime=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.UnApproved_DateTime END
				From
					tbl_SFA_Camp_Planner_Header T1
					LEFT JOIN @TVP_BPP_InsertBeatSFCDetails T2
						ON T1.Region_Code=T2.Region_Code
					LEFT JOIN tbl_SFA_Region_Distance T3
						ON T1.Region_Code=T3.Region_Code
						AND T2.Distance_Fare_Code=T3.Distance_Fare_Code
						AND T2.From_Region_Name=T3.From_Region_Name
						AND T2.To_Region_Name=T3.To_Region_Name
				Where
					T1.Region_Code=@RegionCode
					AND T1.Company_Code=@CompanyCode
					AND T1.CP_Code=@BeatCode
					AND GETDATE() BETWEEN T3.Date_From and T3.Date_to
					AND T2.Distance_Fare_Code<>'0'

				UPDATE
					T1
				Set
					CP_code=@BeatCode,
					Weeknumber=@WeekNumber,
					Weekday=@WeekDay,
					Effective_from=GETDATE(),
					Effective_To=(GETDATE()-1)
				FROM
					tbl_sfa_Beatplan_weekmapping T1

				SET @Result=@@Rowcount

				IF((Select count(*) from @TVP_BPP_InsertBeatSFCDetails where Distance_Fare_Code='0')>0)
				BEGIN

						Update
							T1
						Set
							CP_Name=@BeatName,
							Work_Area=@WorkArea,
							Category_Code=@Work_Category_Code,
							Updated_by=@Created_By,
							Updated_Date=GETDATE(),
							Place_From=T2.From_Region_Name,
							Place_To=T2.To_Region_Name,
							Distance=NULL,
							Fare_Amount=NULL,
							Travel_Mode=T2.Travel_Mode,
							Distance_Fare_Code=CASE WHEN T2.Distance_Fare_Code='0' THEN NULL ELSE T2.Distance_Fare_Code END,
							Created_By=@Created_By,
							Created_Date=GETDATE(),
							SFC_Version_No=NULL,
							SFC_Category_Name=NULL,
							SFC_Visit_Count=NULL,
							Status=@BeatStatus_g,
							Cp_Approved_By=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.Cp_Approved_By END,
							Cp_Approved_Date=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.Cp_Approved_Date END,
							UnApproved_By=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.UnApproved_By END,
							UnApproved_DateTime=CASE WHEN @BeatStatus_g=2 THEN NULL ELSE T1.UnApproved_DateTime END
						From
							tbl_SFA_Camp_Planner_Header T1
							LEFT JOIN @TVP_BPP_InsertBeatSFCDetails T2
								ON T1.Region_Code=T2.Region_Code
						Where
							T1.Region_Code=@RegionCode
							AND T1.Company_Code=@CompanyCode
							AND T1.CP_Code=@BeatCode
							AND T2.Distance_Fare_Code<>'0'

				UPDATE
					T1
				Set
					CP_code=@BeatCode,
					Weeknumber=@WeekNumber,
					Weekday=@WeekDay,
					Effective_from=GETDATE(),
					Effective_To=(GETDATE()-1)
				FROM
					tbl_sfa_Beatplan_weekmapping T1
						SET @Result=@@Rowcount

				END
		END


			INSERT INTO tbl_SFA_Camp_Planner_SFC_History
			(
				Company_Code,
				CP_HOP_Code,
				CP_Code,
				Distance_Fare_Code,
				Work_Place,
				From_Place,
				To_Place,
				Distance,
				Amount,
				Travel_Mode,
				Route_Way,
				Header_Tran_code,
				SFC_Version_No,
				SFC_Category_Name,
				SFC_Visit_Count,
				Effective_From,
				Effective_To,
				Created_By,
				Created_DateTime,
				Updated_By,
				Updated_DateTime
			)
			Select
				Company_Code,
				CP_HOP_Code,
				CP_Code,
				Distance_Fare_Code,
				Work_Place,
				From_Place,
				To_Place,
				Distance,
				Amount,
				Travel_Mode,
				Route_Way,
				@HistoryBeatCode,
				SFC_Version_No,
				SFC_Category_Name,
				SFC_Visit_Count,
				Created_DateTime,
				GETDATE()-1
				Created_By,
				Created_DateTime,
				Updated_By,
				Updated_DateTime,
				CP_SFC_Code
			From
				tbl_SFA_Camp_Planner_SFC T1
			Where
				 T1.Company_Code=@CompanyCode
				 AND T1.CP_Code=@BeatCode
				 AND CONVERT(varchar,Created_DateTime,103)<>CONVERT(varchar,GETDATE(),103)


			DELETE
				T1
			From
				tbl_SFA_Camp_Planner_SFC T1
			Where
				 T1.Company_Code=@CompanyCode
				 AND T1.CP_Code=@BeatCode


			INSERT INTO tbl_SFA_Camp_Planner_SFC
			(
				Company_Code,
				CP_HOP_Code,
				CP_Code,
				Distance_Fare_Code,
				From_Place,
				To_Place,
				Distance,
				Amount,
				Travel_Mode,
				Route_Way,
				SFC_Category_Name,
				Created_By,
				Created_DateTime,
				SFC_Version_No,
				SFC_Visit_Count
			)
			Select
				T1.Company_Code,
				NEXT VALUE FOR SEQ_tbl_SFA_Camp_Planner_SFC,
				@BeatCode,
				CASE WHEN T1.Distance_Fare_Code='0' THEN NULL ELSE T1.Distance_Fare_Code END,
				T1.From_Region_Name,
				T1.To_Region_Name,
				T2.Distance,
				T2.Fare_Amount,
				T1.Travel_Mode,
				CASE WHEN ISNULL(NULLIF(T1.Route_Way,''),'')='' THEN NULL ELSE T1.Route_Way END,
				T2.Category_Name,
				T1.Created_By,
				GETDATE(),
				T2.SFC_Version_No,
				T2.SFC_Visit_Count
			From
				@TVP_BPP_InsertBeatSFCDetails T1
				LEFT JOIN tbl_SFA_Region_Distance T2
					ON T1.Distance_Fare_Code =T2.Distance_Fare_Code
			Where
				T1.Region_Code=@RegionCode
				AND T1.Company_Code=@CompanyCode
				AND GETDATE() BETWEEN T2.Date_From and T2.Date_to
				AND T2.Distance_Fare_Code<>'0'


				INSERT INTO tbl_SFA_Camp_Planner_SFC
				(
					Company_Code,
					CP_HOP_Code,
					CP_Code,
					Distance_Fare_Code,
					From_Place,
					To_Place,
					Distance,
					Amount,
					Travel_Mode,
					Route_Way,
					SFC_Category_Name,
					Created_By,
					Created_DateTime,
					SFC_Version_No,
					SFC_Visit_Count
				)
				Select
					T1.Company_Code,
					NEXT VALUE FOR SEQ_tbl_SFA_Camp_Planner_SFC,
					@BeatCode,
					CASE WHEN T1.Distance_Fare_Code='0' THEN NULL ELSE T1.Distance_Fare_Code END,
					T1.From_Region_Name,
					T1.To_Region_Name,
					NULL,
					NULL,
					T1.Travel_Mode,
					CASE WHEN ISNULL(NULLIF(T1.Route_Way,''),'')='' THEN NULL ELSE T1.Route_Way END,
					NULL,
					T1.Created_By,
					GETDATE(),
					NULL,
					NULL
				From
					@TVP_BPP_InsertBeatSFCDetails T1
				Where
					T1.Distance_Fare_Code='0'

			INSERT INTO tbl_SFA_Camp_Planner_WorkArea_Details_History
			(
				Company_Code,
				Company_Id,
				CP_WA_MapCode,
				CP_Code,
				Work_Area_Name,
				Record_Status,
				Effective_From,
				Effective_To,
				Created_By,
				Created_DateTime,
				Updated_By,
				Updated_DateTime

			)
			Select
				Company_Code,
				Company_Id,
				CP_WA_MapCode,
				CP_Code,
				Work_Area_Name,
				Record_Status,
				Created_DateTime,
				GETDATE()-1,
				Created_By,
				Created_DateTime,
				Updated_By,
				Updated_DateTime
			From
				tbl_SFA_Camp_Planner_WorkArea_Details T1
			Where
				 T1.Company_Code=@CompanyCode
				AND T1.CP_Code=@BeatCode
				AND CONVERT(varchar,Created_DateTime,103)<>CONVERT(varchar,GETDATE(),103)


			DELETE
				T1
			From
				tbl_SFA_Camp_Planner_WorkArea_Details T1
			Where
				 T1.Company_Code=@CompanyCode
				AND T1.CP_Code=@BeatCode



			INSERT INTO tbl_SFA_Camp_Planner_WorkArea_Details
			(
				Company_Code,
				Company_Id,
				CP_Code,
				Work_Area_Name,
				Record_Status,
				Created_By,
				Created_DateTime
			)
			Select
				Company_Code,
				Company_Id,
				@BeatCode,
				Work_Area,
				1,
				Created_By,
				GETDATE()
			From
				@TVP_BPP_InsertBeatWADetails

		

	COMMIT TRAN
	END TRY

	BEGIN CATCH
	ROLLBACK

	SET @Result='INFO:'+ERROR_MESSAGE();
		
	END CATCH
END
