
/****** Object:  StoredProcedure [dbo].[SP_Hd_GetPrimarySalesMasterData]    Script Date: 2/7/2021 6:57:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:           <KARTHIKEYAN G,,Name>
--EXEC SP_Hd_GetPrimarySalesMasterData 'TEO00000010',@Region_code='REC00000001',@Mode='MASTER',@Month=02,@Year=2021
-- =============================================
ALTER PROCEDURE [dbo].[SP_Hd_GetPrimarySalesMasterData] @Company_code VARCHAR(30) = NULL
	,@Region_code VARCHAR(30) = NULL
	,@Mode VARCHAR(20) = NULL
	,@Month int
	,@Year int
AS
BEGIN
	SET NOCOUNT ON;
	Declare @StartDate Varchar(12)
	Declare @EndDate Varchar(12)
	Set @StartDate = Convert(Varchar, @Year) + '-' + Convert(Varchar, @Month) + '-' + '01'
	Set @EndDate = EoMonth(@StartDate)
	
	Declare @ChildRegion Table(
	Region_Code Varchar(30)
	)
	insert into @ChildRegion
	EXEC SP_hdGetChildRegionsCodeOnly @Company_code,@Region_code
	
	IF @Mode = 'MASTER'
	BEGIN
		--Getting Active Region 
		SELECT Region_Name
			,A.Ref_Key1
			,Region_Status
		FROM tbl_SFA_Region_Master A WITH (NOLOCK)
		Inner Join Tbl_Sfa_Region_Type_Master B WIth(NoLock) On B.Region_Type_Code = A.Region_Type_Code And B.Region_Type_Name = 'Territory'

		--Getting Active customer based on given region
		SELECT RM.Region_Name,
		      RM.Ref_Key1
			,CM.Customer_Name AS 'Stockiest Name'
			,CM.Ref_Key1 AS 'Stockiest_Ref_Key1'
			,CM.Customer_Status 
			,CONVERT(varchar,convert(date,CM.Effective_From)) Effective_From
			,CONVERT(varchar,convert(date,CM.Effective_To)) Effective_To
		FROM tbl_SFA_Customer_Master CM WITH (NOLOCK)
		INNER JOIN tbl_SFA_Region_Master RM WITH (NOLOCK) ON RM.Region_Code = CM.Region_Code
	    Inner Join Tbl_Sfa_Region_Type_Master C WIth(NoLock) On (C.Region_Type_Code = RM.Region_Type_Code And C.Region_Type_Name = 'Territory')
		WHERE RM.Region_Status <> '0'
			AND CM.Customer_Status <> '0'
			AND CM.customer_name <> ''
			AND CM.Customer_Entity_Type = 'STOCKIEST'
			AND CM.Ref_Key1 <> ''
			And @EndDate Between Convert(Date, CM.Effective_From) And Convert(Date, IsNull(CM.Effective_To, @EndDate))

		--Getting Active products 
		SELECT PM.Product_Name
			,isnull(PM.Ref_Key1, '') AS 'Product_Ref_Key1'
			,
			-- PTM.Product_Type_Name,
			BM.Brand_Name
			,
			--SM.Speciality_Name,
			UM.UOM_Name
			,UOM_Type_Name
			,Product_Status
			,Substring((
					SELECT ',' + Isnull(B.Division_Name, '')
					FROM Tbl_Sfa_Division_Entity_Mapping A WITH (NOLOCK)
					INNER JOIN Tbl_Sfa_Division_Master B WITH (NOLOCK) ON (B.Division_Code = A.Division_Code)
					WHERE A.Entity_Type = 'Product'
						AND A.Record_Status = 1
						AND A.Entity_Code = PM.Product_Code
					FOR XML PATH('')
					), 2, 8000) AS Division_Name
		--	From
		--	Tbl_Sfa_Product_Master T0
		--) H On (H.Product_Code = A.Product_Code)
		FROM tbl_SFA_Product_Master PM WITH (NOLOCK)
		INNER JOIN tbl_SFA_Product_Category_Master PCM WITH (NOLOCK) ON PCM.Category_Code = PM.Category_Code
		INNER JOIN Tbl_Sfa_Product_Type_Master PTM WITH (NOLOCK) ON (
				PTM.Product_Type_Code = PM.Product_Type
				AND PTM.Product_Type_Name = 'Sales'
				)
		INNER JOIN tbl_SFA_Brand_Master BM WITH (NOLOCK) ON BM.Brand_code = PM.Brand_Code
		INNER JOIN tbl_SFA_Speciality_Master SM WITH (NOLOCK) ON SM.Speciality_Code = PM.Speciality_Code
		INNER JOIN tbl_SFA_UOM_Master UM WITH (NOLOCK) ON UM.UOM_Code = PM.UOM_Code
		INNER JOIN tbl_SFA_UOM_Type_Master UTM WITH (NOLOCK) ON UTM.UOM_Type_Code = PM.UOM_Type_Code

		--INNER JOIN tbl_Dep_Product_Group_Master PGM ON PGM.Product_Group_code=PM.Product_Group_Code
		--             WHERE
		--                     --PM.Product_Status = '0' 
		----AND 
		--                     PM.Ref_Key1 <> ''
		--Getting Active depot given by region
		--SELECT RM.Region_Name,
		--              DM.Depot_Name                                        
		--FROM tbl_dep_depot_master DM INNER JOIN tbl_SFA_Region_Master RM ON RM.Region_Code=DM.Location 
		--WHERE
		--       DM.Record_status <> '0'
		SELECT DM.Depot_Name
		     -- DM.Depot_Code
			,RM.Region_Name
			,isnull(RM.Ref_Key1, '') Ref_Key1
			,Region_Status
		FROM tbl_dep_depot_master DM WITH (NOLOCK)
		LEFT OUTER JOIN Tbl_dep_Depot_Region_Mapping DRM WITH (NOLOCK) ON DM.Depot_code = DRM.Depot_code
			AND DRM.Is_Active = '1'
		Left JOIN tbl_sfa_region_master RM WITH (NOLOCK) ON RM.Region_code = DRM.Region_code
		Left JOIN Tbl_Sfa_Region_Type_Master B WITH (NOLOCK) ON (
				B.Region_Type_Code = RM.Region_Type_Code
				AND B.Region_Type_Name = 'Territory'
				)
		WHERE DM.Record_status <> '0'
		--AND DRM.Is_Active='1' 
		ORDER BY DM.Depot_Name
			,RM.Region_Name

		SELECT Document_type_Name AS 'Document_Type'
			,Calc_Mode
		FROM tbl_sfa_Document_type_Master WITH (NOLOCK)
		WHERE Calc_Mode IS NOT NULL
	END
	ELSE IF @Mode = 'MASTER_VALIDATE'
	BEGIN
		--Getting Active Region 
		SELECT Region_Name
			,Ref_Key1 'Region_Ref_Key1'
		FROM tbl_SFA_Region_Master WITH (NOLOCK)
		WHERE Region_Status <> 0

		--Getting Active customer based on given region
		SELECT RM.Region_Name
			,CM.Customer_Name AS 'Stockiest Name'
			,CM.Ref_Key1 AS 'Stockiest_Ref_Key1'
		FROM tbl_SFA_Customer_Master CM WITH (NOLOCK)
		INNER JOIN tbl_SFA_Region_Master RM WITH (NOLOCK) ON RM.Region_Code = CM.Region_Code
		WHERE RM.Region_Status <> '0'
			AND CM.Customer_Status <> '0'
			AND CM.customer_name <> ''
			AND CM.Customer_Entity_Type = 'STOCKIEST'
			AND CM.Ref_Key1 <> ''

		--Getting Active products 
		SELECT PM.Product_Name
			,PM.Ref_Key1 AS 'Product_Ref_Key1'
			,PTM.Product_Type_Name
			,BM.Brand_Name
			,SM.Speciality_Name
			,UM.UOM_Name
		FROM tbl_SFA_Product_Master PM WITH (NOLOCK)
		INNER JOIN tbl_SFA_Product_Category_Master PCM WITH (NOLOCK) ON PCM.Category_Code = PM.Category_Code
		INNER JOIN tbl_SFA_Product_Type_Master PTM WITH (NOLOCK) ON PTM.Product_Type_Code = PM.Product_Type
		INNER JOIN tbl_SFA_Brand_Master BM WITH (NOLOCK) ON BM.Brand_code = PM.Brand_Code
		INNER JOIN tbl_SFA_Speciality_Master SM WITH (NOLOCK) ON SM.Speciality_Code = PM.Speciality_Code
		INNER JOIN tbl_SFA_UOM_Master UM WITH (NOLOCK) ON UM.UOM_Code = PM.UOM_Code
		--INNER JOIN tbl_Dep_Product_Group_Master PGM WITH(NOLOCK) ON PGM.Product_Group_code=PM.Product_Group_Code
		WHERE PM.Product_Status = '0'
			AND PM.Ref_Key1 <> ''

		--Getting Active depot given by region
		--SELECT RM.Region_Name,
		--              DM.Depot_Name                                        
		--FROM tbl_dep_depot_master DM WITH(NOLOCK) INNER JOIN tbl_SFA_Region_Master RM WITH(NOLOCK) ON RM.Region_Code=DM.Location 
		--WHERE
		--       DM.Record_status <> '0'
		SELECT RM.Region_Name
			,DM.Depot_Name
			,DM.Ref_Key1 'Depot_Ref_Key1'
		FROM Tbl_dep_Depot_Region_Mapping DRM WITH (NOLOCK)
		INNER JOIN tbl_dep_depot_master DM WITH (NOLOCK) ON DM.Depot_code = DRM.Depot_code
		INNER JOIN tbl_sfa_region_master RM WITH (NOLOCK) ON RM.Region_code = DRM.Region_code
		WHERE DM.Record_status <> '0'
			AND DRM.Is_Active = '1'

		SELECT Document_type_Name AS 'Document_Type'
		FROM tbl_sfa_Document_type_Master WITH (NOLOCK)
	END
	ELSE IF @Mode = 'TEMP'
	BEGIN
		--Header
		SELECT '' AS 'Depot_Name'
			,'' AS 'Region_Name'
			,'' AS 'Region_Ref_Key'
			,'' AS 'Stockiest_Name'
			,'' AS 'Stockiest_Ref_Key'
			,'' AS 'Document_Type_Name'
			,'' AS 'Document_Number'
			,'' AS 'Document_Date'
			,'' AS 'Product_Name'
			,'' AS 'Product_Ref_Key'
			,'' AS 'Batch_Number'
			,'' AS 'Net_Quantity'
			,'' AS 'Free_Quantity'
			,'' AS 'Net_Value'
			,'' AS 'Excel_Row_No'
			--Details
			--SELECT '' as 'Region_Name',
			--                '' as 'Depot_Name',
			--                '' as 'Stockiest_Ref_Key1', 
			--                '' as 'Document_Type',
			--                '' as 'Document_Number',
			--                '' as 'Document_Date',
			--                '' as 'Transaction_Mode', 
			--                '' as 'Product_Name',
			--                '' as 'Product_Ref_Key1',
			--                '' as 'Batch_Number',
			--                '' as 'Sales_Quantity',
			--                '' as 'Free_Quantity',
			--                '' as 'Sales_Rate'
	END
	ELSE IF @Mode = 'VALIDATION'
	BEGIN
		--GET DOCUMENT NUMBER
		SELECT PS.Region_Name
			,PS.Depot_Name
			,PS.Document_number
			,PS.Uploaded_file_name
			,PS.Stockiest_Ref_Key1
		FROM tbl_SFA_PrimarySales_header PS WITH (NOLOCK)
		WHERE Document_Type = 'INVOICE' -- INVOICE Number only

		--GET PRODUCTS
		SELECT PM.Product_Name
			,PM.Ref_Key1 AS 'Product_Ref_Key1'
		FROM tbl_SFA_Product_Master PM WITH (NOLOCK)
		INNER JOIN tbl_SFA_Product_Category_Master PCM WITH (NOLOCK) ON PCM.Category_Code = PM.Category_Code
		INNER JOIN tbl_SFA_Product_Type_Master PTM WITH (NOLOCK) ON PTM.Product_Type_Code = PM.Product_Type
		INNER JOIN tbl_SFA_Brand_Master BM WITH (NOLOCK) ON BM.Brand_code = PM.Brand_Code
		INNER JOIN tbl_SFA_Speciality_Master SM WITH (NOLOCK) ON SM.Speciality_Code = PM.Speciality_Code
		INNER JOIN tbl_SFA_UOM_Master UM WITH (NOLOCK) ON UM.UOM_Code = PM.UOM_Code
		--       INNER JOIN tbl_Dep_Product_Group_Master PGM ON PGM.Product_Group_code=PM.Product_Group_Code
		WHERE PM.Product_Status = '0'
			AND PM.Ref_Key1 <> ''

		--GET Total quantity for the given region, depot, stockiest, document number
		--DECLARE @INVTable AS TABLE(
		--Row_no INT IDENTITY(1,1),Region_Name VARCHAR(50),Depot_Name VARCHAR(30),Stockiest_Ref_Key1 VARCHAR(30),Document_number VARCHAR(30),Product_Ref_key1 VARCHAR(30),Batch_Number VARCHAR(30),Available_Quantity DECIMAL(12,2))
		DECLARE @SRTable AS TABLE (
			Region_Name VARCHAR(50)
			,Depot_Name VARCHAR(30)
			,Stockiest_Ref_Key1 VARCHAR(30)
			,Document_number VARCHAR(30)
			,Product_Ref_key1 VARCHAR(30)
			,Batch_Number VARCHAR(30)
			,Available_Quantity DECIMAL(12, 2)
			)
		--INSERT INTO @INVTable SELECT      
		--PSH.Region_name,
		--PSH.Depot_Name,
		--PSD.Stockiest_Ref_Key1,
		--PSD.Document_Number,                                                                                          
		--PSD.Product_Ref_key1,
		--PSD.Batch_Number,
		--(CONVERT(DECIMAL,PSD.Sales_Quantity) + CONVERT(DECIMAL,PSD.Free_Quantity)) as Available_Quantity
		--FROM tbl_SFA_PrimarySales_Details PSD WITH(NOLOCK) 
		--INNER JOIN tbl_SFA_PrimarySales_Header PSH WITH(NOLOCK) 
		--																					ON PSH.Region_name=PSD.Region_name
		--																					AND PSH.Depot_Name = PSD.Depot_Name
		--																					AND PSH.Stockiest_Ref_Key1 = PSD.Stockiest_Ref_Key1
		--																					AND PSH.Document_number=PSD.Document_Number                                                                                       
		--																					AND PSH.Document_Type = 'INVOICE'
		DECLARE @Region_name VARCHAR(100)
		DECLARE @Depot_Name VARCHAR(100)
		DECLARE @Stockiest_ref_key1 VARCHAR(30)
		DECLARE @Document_Number VARCHAR(30)
		DECLARE @Product_ref_key1 VARCHAR(30)
		DECLARE @Batch_number VARCHAR(30)
		DECLARE @Count INT
		DECLARE @Start_count INT = 0
		DECLARE @InvoiceNumber VARCHAR(30)
		DECLARE @Available_Quantity DECIMAL(12, 2)

		--SELECT @Count=COUNT(*) FROM @INVTable
		--				WHILE(@Start_count <= @Count)
		--				BEGIN
		--					SET @Start_count=@Start_count+1
		--						SELECT @Region_name=Region_Name,
		--									@Depot_Name=Depot_Name,
		--									@Stockiest_ref_key1=Stockiest_ref_key1,
		--									@Document_Number=Document_Number,
		--									@Product_ref_key1=Product_ref_key1,
		--									@Batch_number= Batch_number,
		--									@Available_Quantity=Available_Quantity 
		--						FROM @INVTable WHERE Row_no=@Start_count
		--					--SELECT @Available_Quantity=(@Available_Quantity-Sales_Quantity)
		--					--FROM tbl_SFA_PrimarySales_Details WITH(NOLOCK) 
		--					--WHERE 
		--					--	Region_Name=@Region_name AND
		--					--	Depot_Name=@Depot_Name AND
		--					--	Stockiest_Ref_Key1=@Stockiest_ref_key1 AND
		--					--	Document_Number=@Document_Number AND
		--					--	Product_Ref_Key1=@Product_ref_key1 AND
		--					--	Batch_Number=@Batch_number AND
		--					--	Document_Type <> 'INVOICE'
		--					INSERT INTO @SRTable 
		--					(Region_Name,Depot_Name,Stockiest_Ref_Key1,Document_number,Product_Ref_key1,Batch_Number,Available_Quantity)
		--					VALUES
		--					(@Region_name,@Depot_Name,@Stockiest_ref_Key1,@Document_Number,@Product_ref_key1,@Batch_number,@Available_Quantity)
		--				END
		SELECT *
		FROM @SRTable
	END
	ELSE IF @Mode = 'GETREGION'
	BEGIN
		SELECT Region_Name
			,Region_Code
		FROM tbl_SFA_Region_Master WITH (NOLOCK)
		WHERE
		   Region_Status <> 0 --AND 
			--Ref_Key1 <> ''
		 Order by Full_Index
	END

	SET NOCOUNT OFF;
END