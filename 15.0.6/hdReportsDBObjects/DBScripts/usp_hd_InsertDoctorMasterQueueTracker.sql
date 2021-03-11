/****** Object:  StoredProcedure [dbo].[usp_hd_InsertDoctorMasterQueueTracker]    Script Date: 11/06/2017 9:33:56 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_InsertDoctorMasterQueueTracker]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_InsertDoctorMasterQueueTracker]
GO

/****** Object:  StoredProcedure [dbo].[usp_hd_InsertDoctorMasterQueueTracker]    Script Date: 11/06/2017 9:33:56 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_hd_InsertDoctorMasterQueueTracker]
(
	@CompanyCode VARCHAR(30),
	@UserCode VARCHAR(30),
	@DoctorCode VARCHAR(50),
	@RegionCode VARCHAR(30),
	@EventName VARCHAR(10),
	@ProcessStatus INT,
	@JSONObject VARCHAR(1000),
	@TopicName VARCHAR(10),
	@SubscriptionName VARCHAR(10),
	@Result VARCHAR(500) OUTPUT
)
AS
BEGIN
	DECLARE @Return_Message VARCHAR(500)
	BEGIN TRY
		 INSERT INTO tbl_SFA_Doctor_Master_Queue_Tracker(CompanyCode, UserCode, DoctorCode, RegionCode, EventName, ProcessStatus, JSONObject,GeneratedDateTime, TopicName,SubscriptionName)
		 VALUES (@CompanyCode, @UserCode, @DoctorCode, @RegionCode, @EventName, @ProcessStatus, @JSONObject, GETDATE(),@TopicName,@SubscriptionName);

		 SET @Result = CONVERT(VARCHAR(10),SCOPE_IDENTITY())
	 END TRY
	 BEGIN CATCH
		SET @Return_Message = ERROR_MESSAGE()
		SET @Result = @Return_Message;
	 END CATCH
END

GO


