IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HDDieticianReporting_GetStockiestdetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HDDieticianReporting_GetStockiestdetails]
GO
--==============================================================================
-- Author : P.S.SHARAVANAN
-- CreatedOn : 24-FEB-2021
-- Decription: To display stockist name for companycode and regioncode
-- ModifedOn : 04-MAR-2021
-- Description: Previously we used customer_status field in select statement
--				as per new requirement we removed that field.  And we included
--				DCR Date to compare with EffectiveFrom and EffectiveTo
--==============================================================================

CREATE PROCEDURE [dbo].[SP_HDDieticianReporting_GetStockiestdetails]
(
	@Company_Code varchar(30),
	@Region_Code varchar(30),
	@DCR_Act_Dt date
)
As
Begin
	Begin Try
		Select
		Customer_Name,
		Customer_Code
		From
		tbl_sfa_customer_master With(NoLock)
		Where
		Company_Code=@Company_Code And
		Region_Code=@Region_Code And
		Customer_Entity_Type = 'STOCKIEST' And
		@DCR_Act_Dt Between Convert(date,Effective_From,103) And Convert(date,ISNULL(Effective_To,getdate()),103)
	End Try
	Begin Catch
		Select
		Error_Number(),
		ERROR_MESSAGE(),
		ERROR_PROCEDURE()
	End Catch
END
