/****** Object:  StoredProcedure [dbo].[usp_hd_UpdateDoctorQueueTracker]    Script Date: 11/06/2017 9:35:13 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_hd_UpdateDoctorQueueTracker]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_hd_UpdateDoctorQueueTracker]
GO

/****** Object:  StoredProcedure [dbo].[usp_hd_UpdateDoctorQueueTracker]    Script Date: 11/06/2017 9:35:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_hd_UpdateDoctorQueueTracker]
(
	@CompanyCode VARCHAR(30),
	@Id INT,
	@ProcessStatus INT,
	@ExceMsg VARCHAR(500),
	@StackTrace VARCHAR(2000)
)
AS
BEGIN
	UPDATE tbl_SFA_Doctor_Master_Queue_Tracker SET ProcessStatus = @ProcessStatus, Mesg = @ExceMsg, StackTrace = @StackTrace
	WHERE ID = @Id
END

GO


