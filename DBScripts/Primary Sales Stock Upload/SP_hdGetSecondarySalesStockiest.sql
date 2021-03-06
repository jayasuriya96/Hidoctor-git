
/****** Object:  StoredProcedure [dbo].[SP_hdGetSecondarySalesStockiest]    Script Date: 2/9/2021 7:09:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--EXEC [SP_hdGetSecondarySalesStockiest] 'TEO00000010','REC00000278','6','2017'
ALTER PROC [dbo].[SP_hdGetSecondarySalesStockiest]--'COM00000009','REC00000344'
	@CompanyCode VARCHAR(30),
	@RegionCode VARCHAR(MAX)
	--@Month VARCHAR(30),
	--@Year VARCHAR(30)
AS
BEGIN
	BEGIN TRY 
		--DECLARE @datechk varchar(30)
		--declare @lastdate varchar(30)
		--set @datechk = @Year +'-'+ @Month +'-01'
		--set @lastdate = (SELECT convert(date,DATEADD (dd, -1, DATEADD(mm, DATEDIFF(mm, 0, @datechk) + 1, 0))))
		--set @lastdate=convert(datetime,@lastdate,103)
	--	select @datechk
	--	select @lastdate
		SELECT DISTINCT 
			LTRIM(RTRIM(Customer_Name)) AS 'Customer_Name',
			LTRIM(RTRIM(Customer_Code)) AS 'Customer_Code',
			isnull(Effective_From,'2010-01-01') AS 'Effective_From',
			isnull(Effective_To,GETDATE())AS 'Effective_To',
			Ref_Key1
		FROM 
			tbl_SFA_Customer_Master WITH(NOLOCK) 
		Where 
			Region_Code=@RegionCode
			AND Customer_Entity_Type ='STOCKIEST' 
			AND Customer_Status='1'
			--AND @datechk between isnull(Effective_From,'2010-01-01') and isnull(Effective_To,@lastdate) 
			AND Company_Code=@CompanyCode
    
	   
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage VARCHAR(500)
	    SET @ErrorMessage =  ERROR_MESSAGE()
	END CATCH	
END
