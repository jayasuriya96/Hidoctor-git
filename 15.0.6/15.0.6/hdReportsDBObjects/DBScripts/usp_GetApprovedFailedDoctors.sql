/****** Object:  StoredProcedure [dbo].[usp_GetApprovedFailedDoctors]    Script Date: 11/06/2017 9:31:15 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_GetApprovedFailedDoctors]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_GetApprovedFailedDoctors]
GO

/****** Object:  StoredProcedure [dbo].[usp_GetApprovedFailedDoctors]    Script Date: 11/06/2017 9:31:15 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[usp_GetApprovedFailedDoctors]
(
	@guid uniqueidentifier
)
AS
BEGIN
	SELECT Customer_code, Region_code FROM tbl_SFA_Customer_Master_Batchprocessing_Staging WITH(NOLOCK)
	WHERE BP_ID=@guid 
END

GO


