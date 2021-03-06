IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_BPP_InsertBeatPlanDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_BPP_InsertBeatPlanDetails]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_BPP_InsertBeatPlanDetails]    Script Date: 18-02-2021 10:48:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		AJAY VAMSI DNV
-- Create date: 03-06-2019
-- Description:	Procedure to Insert Beat/Patch Plan Details
--[SP_HD_BPP_InsertBeatPlanDetails]
--DROP PROCEDURE [SP_HD_BPP_InsertBeatPlanDetails]
-- =============================================
CREATE PROCEDURE [dbo].[SP_HD_BPP_InsertBeatPlanDetails]
@CompanyCode varchar(30),
@RegionCode varchar(30),
@BeatCode varchar(30),
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
BEGIN TRY
	BEGIN TRAN

--		DECLARE 
--@CompanyCode varchar(30)='COM00000276',
--@RegionCode varchar(30)='REC00000257',
--@BeatCode varchar(30)='120315',
--@BeatName varchar(1000)='Beat 7',
--@WorkArea varchar(MAX)='Test',
--@Work_Category_Code varchar(30)='EEC00000001',
--@Work_Category_Name varchar(1000)='HQ',
--@Created_By varchar(30)='USC00000001',

--@Result varchar(MAX) 

--DECLARE @TVP_BPP_InsertBeatSFCDetails TABLE
--(
--	[Company_Code] [varchar](30) NULL,
--	[Company_Id] [int] NULL,
--	[Region_Code] [varchar](30) NULL,
--	[From_Region_Name] [varchar](300) NULL,
--	[To_Region_Name] [varchar](300) NULL,
--	[Distance_Fare_Code] [varchar](100) NULL,
--	[Route_Way] [varchar](100) NULL,
--	[Travel_Mode] [varchar](300) NULL,
--	[Created_By] [varchar](30) NULL

--)

--DECLARE @TVP_BPP_InsertBeatWADetails TABLE
--(
--	[Company_Code] [varchar](30) NULL,
--	[Company_Id] [int] NULL,
--	[Work_Area] [varchar](500) NULL,
--	[Region_Code] [varchar](30) NULL,
--	[Created_By] [varchar](30) NULL

--)

--INSERT INTO @TVP_BPP_InsertBeatSFCDetails
--VALUES('COM00000276',124,'REC00000257','Test','MUMBAI','0','','ROAD','USC00000001')



--INSERT INTO @TVP_BPP_InsertBeatWADetails
--VALUES('COM00000276',124,'Test','REC00000257','USC00000001')
IF NOT EXISTS(SELECT * from tbl_sfa_Beatplan_weekmapping T1 Where Weekday=@WeekDay and Weeknumber=@WeekNumber)
BEGIN
		IF NOT EXISTS(Select * From tbl_SFA_Camp_Planner_Header where Region_Code=@RegionCode and CP_name=@BeatName)
		BEGIN


			IF(UPPER(@Work_Category_Name)<>'HQ')
			BEGIN

					INSERT INTO tbl_SFA_Camp_Planner_Header
					(
						Company_Code,
						CP_code,
						CP_name,
						Status,
						Region_Code,
						Work_area,
						Category_Code,
						Created_By,
						Created_Date
					)
					VALUES
					(
						@CompanyCode,
						@BeatCode,
						@BeatName,
						2,
						@RegionCode,
						@WorkArea,
						@Work_Category_Code,
						@Created_By,
						GETDATE()
					)

					SET @Result=@@ROWCOUNT
			END
			ELSE 
			BEGIN

					INSERT INTO tbl_SFA_Camp_Planner_Header
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
						Category_Code,
						Distance_Fare_Code,
						Created_By,
						Created_Date,
						SFC_Version_No,
						SFC_Category_Name,
						SFC_Visit_Count
					)
					Select
						T1.Company_Code,
						@BeatCode,
						@BeatName,
						2,
						@RegionCode,
						@WorkArea,
						T1.From_Region_Name,
						T1.To_Region_Name,
						Distance,
						Fare_Amount,
						T1.Travel_Mode,
						@Work_Category_Code,
						CASE WHEN T1.Distance_Fare_Code='0' THEN NULL ELSE T1.Distance_Fare_Code END,
						@Created_By,
						GETDATE(),
						SFC_Version_No,
						Category_Name,
						SFC_Visit_Count
					From
						tbl_SFA_Region_Distance T1
						LEFT JOIN @TVP_BPP_InsertBeatSFCDetails T2
							ON T1.Region_Code=T2.Region_Code
							AND T1.Distance_Fare_Code=T2.Distance_Fare_Code
							AND T1.From_Region_Name=T2.From_Region_Name
							AND T1.To_Region_Name=T2.To_Region_Name
							AND T1.Travel_Mode=T2.Travel_Mode 
					Where
						T1.Region_Code=@RegionCode
						AND T1.Company_Code=@CompanyCode
						AND GETDATE() BETWEEN T1.Date_From and T1.Date_to
						AND T2.Distance_Fare_Code<>'0'
				
					SET @Result=@@ROWCOUNT

					IF((Select count(*) from @TVP_BPP_InsertBeatSFCDetails where Distance_Fare_Code='0')>0)
					BEGIN

						INSERT INTO tbl_SFA_Camp_Planner_Header
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
							Category_Code,
							Distance_Fare_Code,
							Created_By,
							Created_Date,
							SFC_Version_No,
							SFC_Category_Name,
							SFC_Visit_Count
						)
						Select
							T1.Company_Code,
							@BeatCode,
							@BeatName,
							2,
							@RegionCode,
							@WorkArea,
							T1.From_Region_Name,
							T1.To_Region_Name,
							NULL,
							NULL,
							T1.Travel_Mode,
							@Work_Category_Code,
							CASE WHEN T1.Distance_Fare_Code='0' THEN NULL ELSE T1.Distance_Fare_Code END,
							@Created_By,
							GETDATE(),
							NULL,
							NULL,
							NULL
						From
							@TVP_BPP_InsertBeatSFCDetails T1
						Where
							T1.Distance_Fare_Code='0'
				


						SET @Result=@@ROWCOUNT

					END
			END


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


			IF((Select count(*) from @TVP_BPP_InsertBeatSFCDetails where Distance_Fare_Code='0')>0)
			BEGIN

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
			

			END


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

			INSERT INTO tbl_sfa_Beatplan_weekmapping
			(
				Company_Code,
				CP_code,
				Weeknumber,
				Weekday,
				Effective_from,
				Effective_To
			)
			SELECT
				@CompanyCode,
				@BeatCode,
				@WeekNumber,
				@WeekDay,
				GETDATE(),
				Null

		END
		ELSE
		BEGIN

			Set @Result='INFO:Please enter different Beat/Patch Name.The Entered Beat/Patch Name already Exists in the same Region.';
		END

		END
		ELSE
		BEGIN
		Set @Result='INFO:Multiple beatplan cannot have same weekday and weeknumber.';
		END

	COMMIT TRAN
	END TRY

	BEGIN CATCH
	ROLLBACK

	SET @Result='INFO:'+ERROR_MESSAGE();
		
	END CATCH
END
