IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_InsertDetailedProductFeedback]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].SP_HD_InsertDetailedProductFeedback

/****** Object:  StoredProcedure [dbo].[SP_HD_InsertDetailedProductFeedback]    Script Date: 25-02-2021 12:11:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

create PROCEDURE [dbo].[SP_HD_InsertDetailedProductFeedback] @Company_Code VARCHAR(30)
	,@User_Code VARCHAR(30)
	,@Region_Code VARCHAR(30)
	,@TVP_Detailedproductfeedback_Headerdetails TVP_Detailedproductfeedback_Headerdetails READONLY
	,@Result VARCHAR(500) OUTPUT
AS
BEGIN
	--- This New logic we are updating remarks and updated  in this tbl_SFA_DCR_Detailing_Report 
	UPDATE A
	SET Manager_Remarks = B.Remarks
		,Updated_on = GetDate()
	FROM tbl_SFA_DCR_Detailing_Report A
	INNER JOIN @TVP_Detailedproductfeedback_Headerdetails B ON A.related_product_code = B.Product_Code
	WHERE Product_Code = related_product_code
		AND A.User_Code = B.User_Code

	SET @Result = 'SUCCESS'
END

	---This old logic where we are inserting remarks in tbl_sfa_DetailedProductfeedbackdetails now upated in new table


	--INSERT INTO tbl_sfa_DetailedProductfeedbackdetails
	--(	
	--	Company_Code,
	--	User_Code,
	--	Customer_Code,
	--	Detailed_Product_Code,
	--	Remarks,
	--	Created_By,
	--	Created_DateTime
	--)
	--SELECT
	--	@Company_Code,
	--	User_Code,
	--	Customer_Code,
	--	Detailed_Product_Code,
	--	Remarks,
	--	@User_Code,
	--	GETDATE()
	--FROM
	--	@TVP_Detailedproductfeedback_Headerdetails
	--SET @Result='SUCCESS'