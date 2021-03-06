IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_Released_Details]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].SP_HD_Released_Details
/****** Object:  StoredProcedure [dbo].[SP_HD_Released_Details]    Script Date: 30-09-2020 10:09:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--SP_HD_Released_Details '','REC00000025,REC00000168,REC00000170,','2020-09-30','2020-09-30'
create PROCEDURE [dbo].[SP_HD_Released_Details]


	 (
	 @Company_Code varchar(30),
	  @Region_Code varchar(max),
	 @Effective_From varchar(20),
	 @Effective_To varchar(20)
	
	 )

AS
Begin


DECLARE @TableRegion TABLE (Region_Code VARCHAR(30))
INSERT INTO @TableRegion
		SELECT strval FROM dbo.fun_Split(@Region_Code,',','1',LEN(@Region_Code) - LEN(REPLACE(@Region_Code,',','')))
	
	Select 
	PLR.Company_Code,
	User_Code,
	Region_Name,
	Month,
	Year,
	Convert(varchar,PLR.Effective_From,103)As Effective_From,
    Convert(varchar,PLR.Effective_TO,103)As Effective_To,
	
	PLR.Id,
	PLR.lock_Status,
	CASE WHEN lock_Status = 1 THEN 'Enable' else 'Disable' END AS Status
	
 from  tbl_SFA_SS_Perodic_Lock_Release PLR WITH(NOLOCK)
  JOIN @TableRegion TRM 
	ON PLR.Region_Code = TRM.Region_Code
    INNER JOIN tbl_SFA_Region_Master RM WITH(NOLOCK)
	ON RM.Region_Code = TRM.Region_Code
	where 
	 ((Convert(date, PLR.Effective_From) BETWEEN   @Effective_From and  @Effective_To
		OR Convert(date, PLR.Effective_To) BETWEEN @Effective_From and @Effective_To))
		End