IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_hdGetPrimarySalesStockiestList]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_hdGetPrimarySalesStockiestList]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--EXEC [SP_hdGetPrimarySalesStockiestList] 'RAJ00000141','REC00000001'
Create PROC [dbo].[SP_hdGetPrimarySalesStockiestList]
	@CompanyCode VARCHAR(30),
	@RegionCode VARCHAR(MAX)
AS
BEGIN
	BEGIN TRY 
		DECLARE @Month int=null
        DECLARE @Year int=null
        SET @Year=(SELECT  DATEPART(YEAR,GETDATE()))
        SET @Month=(SELECT  DATEPART(MONTH,GETDATE()))
		Declare @StartDate Varchar(12)
	    Declare @EndDate Varchar(12)
	    Set @StartDate = Convert(Varchar, @Year) + '-' + Convert(Varchar, @Month) + '-' + '01'
	    Set @EndDate = EoMonth(@StartDate)
	Declare @ChildRegion Table(
	Region_Code Varchar(30)
	)
	insert into @ChildRegion
	EXEC SP_hdGetChildRegionsCodeOnly @Companycode,@Regioncode
	
		SELECT 
		    Customer_Name AS 'Customer_Name',
			LTRIM(RTRIM(Customer_Code)) AS 'Customer_Code'
		FROM 
			tbl_SFA_Customer_Master CM WITH(NOLOCK)
			Inner Join @ChildRegion T 
			On T.Region_Code=CM.Region_Code
			Inner Join tbl_sfa_Region_Master RM WITH(NOLOCK)
			On RM.Region_Code=T.Region_Code
			Inner Join tbl_sfa_Region_Type_Master RTM WITH(NOLOCK)
			On RTM.Region_Type_Code=RM.Region_Type_Code
		Where 
			Customer_Entity_Type ='STOCKIEST' 
			AND Customer_Status='1'
			AND Region_Type_Name='Territory'
			AND CM.Region_Code in(Select Region_Code From @ChildRegion T)
			AND @EndDate Between isnull(CM.Effective_From,'2010-01-01') And Convert(Date, IsNull(CM.Effective_To, @EndDate))
			AND CM.Company_Code=@CompanyCode
       Group by CM.Customer_Code,Customer_Name
	   Order By CUstomer_Code 
	   
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage VARCHAR(500)
	    SET @ErrorMessage =  ERROR_MESSAGE()
	END CATCH	
END

