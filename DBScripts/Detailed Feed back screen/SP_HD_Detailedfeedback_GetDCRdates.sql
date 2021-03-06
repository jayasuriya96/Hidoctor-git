IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_Detailedfeedback_GetDCRdates]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].SP_HD_Detailedfeedback_GetDCRdates
/****** Object:  StoredProcedure [dbo].[SP_HD_Detailedfeedback_GetDCRdates]    Script Date: 26-02-2021 14:12:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--EXEC SP_HD_Detailedfeedback_GetDCRdates 'RAJ00000141','USC00001286'
create PROCEDURE [dbo].[SP_HD_Detailedfeedback_GetDCRdates]
@Company_Code varchar(30),
@User_Code varchar(30)
AS
BEGIN
	SELECT
		CONVERT(DATE,T1.DCR_Actual_Date) AS DCR_Actual_Date,
		T1.DCR_Code
	FROM
		tbl_sfa_DCR_Master T1 WITH(NOLOCK)
	INNER JOIN tbl_SFA_DCR_Detailing_Report T2 WITH(NOLOCK)
	ON T1.DCR_COde=T2.DCR_Code and T1.DCR_Actual_Date = T2.DCR_Actual_Date
	WHERE
		T1.Company_Code=@Company_Code
		AND T1.User_Code=@User_Code
		
		AND DCR_Status=2
		--AND Business_Status_Remarks IS NOT NULL
		--AND BusinessPotential IS NOT NULL
	GROUP BY
		T1.DCR_Actual_Date,
		T1.DCR_Code
	ORDER BY DCR_Actual_Date DESC
END

