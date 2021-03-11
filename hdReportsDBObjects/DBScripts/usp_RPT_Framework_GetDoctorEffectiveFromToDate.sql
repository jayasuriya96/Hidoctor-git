/****** Object:  StoredProcedure [dbo].[usp_RPT_Framework_GetDoctorEffectiveFromToDate]    Script Date: 11/06/2017 9:29:06 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_RPT_Framework_GetDoctorEffectiveFromToDate]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_RPT_Framework_GetDoctorEffectiveFromToDate]
GO

/****** Object:  StoredProcedure [dbo].[usp_RPT_Framework_GetDoctorEffectiveFromToDate]    Script Date: 11/06/2017 9:29:06 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[usp_RPT_Framework_GetDoctorEffectiveFromToDate]
(
	@CompanyCode VARCHAR(30),
	@RegionCode VARCHAR(30),
	@CustomerCode VARCHAR(30),
	@SpecialityCode VARCHAR(30),
	@CategoryCode VARCHAR(30)
)
AS
BEGIN
	IF EXISTS(SELECT TOP 1'*' FROM tbl_SFA_Customer_MAster WITH(NOLOCK)	WHERE Region_Code = @RegionCode AND Customer_Code=@CustomerCode
					AND Speciality_Code = @SpecialityCode AND ISNULL(Category,'') = ISNULL(@CategoryCode,''))
	BEGIN
		SELECT  CONVERT(DATE,tbl_SFA_Customer_Master.Approved_Date) AS 'EffectiveFrom',
		CASE  WHEN tbl_SFA_Customer_Master.Effective_To IS NULL THEN '2099-12-31' ELSE CONVERT(DATE,tbl_SFA_Customer_Master.Effective_To) END AS 'EffectiveTo'  FROM tbl_SFA_Customer_MAster WITH(NOLOCK)	
		WHERE Region_Code = @RegionCode AND Customer_Code=@CustomerCode
					AND Speciality_Code = @SpecialityCode AND ISNULL(Category,'') = ISNULL(@CategoryCode,'')
	END
	ELSE IF EXISTS (SELECT TOP 1'*' FROM tbl_SFA_Customer_MAster_History WITH(NOLOCK)	WHERE Region_Code = @RegionCode AND Customer_Code=@CustomerCode
					AND Speciality_Code = @SpecialityCode AND ISNULL(Category,'') = ISNULL(@CategoryCode,''))
	BEGIN
		SELECT CONVERT(DATE,tbl_SFA_Customer_MAster_History.Approved_Date)  AS 'EffectiveFrom',
		CASE  WHEN tbl_SFA_Customer_MAster_History.Effective_To IS NULL THEN '2099-12-31' ELSE CONVERT(DATE,tbl_SFA_Customer_MAster_History.Effective_To) END AS 'EffectiveTo' 
		FROM tbl_SFA_Customer_MAster_History WITH(NOLOCK)	WHERE Region_Code = @RegionCode AND Customer_Code=@CustomerCode
					AND Speciality_Code = @SpecialityCode AND ISNULL(Category,'') = ISNULL(@CategoryCode,'')
	END
	
END

GO


