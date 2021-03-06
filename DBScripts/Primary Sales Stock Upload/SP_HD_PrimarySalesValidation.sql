
/****** Object:  StoredProcedure [dbo].[SP_HD_PrimarySalesValidation]    Script Date: 2/7/2021 8:11:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_HD_PrimarySalesValidation] (
	@UserCode VARCHAR(30)
	,@CompanyCode VARCHAR(30)
	,@BP_Id VARCHAR(50)
	,@File_Name VARCHAR(70)
	,@Month int
	,@Year int
	,@UploadType int
	)
AS
BEGIN
   BEGIN TRY
	BEGIN TRANSACTION
		Declare @StartDate Varchar(12)
		Declare @EndDate Varchar(12)
		Set @StartDate = Convert(Varchar, @Year) + '-' + Convert(Varchar, @Month) + '-' + '01'
		Set @EndDate = EoMonth(@StartDate)
        DECLARE @excelcount INT

	SET @excelcount = (
			SELECT ExcelRowno
			FROM Tbl_Sfa_PrimarySales_Temp WITH (NOLOCK)
			WHERE BP_ID = @BP_id
			GROUP BY ExcelRowNo
			HAVING count(ExcelRowno) > 1
			)

	UPDATE Tbl_Sfa_BatchProcessing_Header
	SET STATUS = 'Under Process'
	WHERE BP_ID = Convert(UNIQUEIDENTIFIER, @BP_Id)
		AND BP_Type = 'PSU_UPLOAD'

	IF (@excelcount > 0)
	BEGIN
		INSERT INTO Tbl_Sfa_BatchProcessing_Errlog
		SELECT @BP_id
			,A.ExcelRowNo
			,'HD_ERR_0459'
			,'Excel Row No Mismatch'
		FROM Tbl_Sfa_PrimarySales_Temp A WITH (NOLOCK)
		WHERE A.BP_Id = @BP_Id
		GROUP BY ExcelRowNo
		HAVING count(ExcelRowno) > 1
	END
	ELSE
	BEGIN
        Update A
		Set A.Depot_Code = B.Depot_Code
		From
		Tbl_Sfa_PrimarySales_Temp A
		Inner Join
		(
			Select
			Depot_Code,
			Depot_Name
			From
			Tbl_Dep_Depot_Master With(NoLock)
			Where
			Record_Status = 1
		) B On (B.Depot_Name = A.Depot_Name)

		Update A
		Set A.Region_Code = B.Region_Code
		From
		Tbl_Sfa_PrimarySales_Temp A
		Inner Join
		(
			Select
			A.Ref_Key1, A.Region_Code,A.Region_Name
			From
			(
				Select A.Ref_Key1, A.Region_Code,A.Region_Name, Row_Number()
				Over(Partition By A.Ref_Key1 Order By A.Ref_KEy1) RowNumber
				From
				Tbl_Sfa_Region_Master A WIth(NoLock) 
				Inner Join Tbl_Sfa_Region_Type_Master B WIth(NoLock) On (B.Region_Type_Code = A.Region_Type_Code And B.Region_Type_Name = 'Territory')
				Where
				IsNull(A.Ref_Key1, '') <> ''
			) A
			--Where
			----A.RowNumber = 1
		) B On (B.Ref_Key1 = A.Region_Ref_Key1 AND B.Region_Name=A.Region_Name)

		Update A
		Set A.Stockist_Code = B.Stockist_Code
		From
		Tbl_Sfa_PrimarySales_Temp A
		Inner Join
		(
			Select
			A.Region_Code, A.Ref_Key1,B.Region_Name, A.Customer_Code Stockist_Code
			From
			Tbl_Sfa_Customer_Master A With(NoLock)
			Inner Join Tbl_Sfa_Region_Master B WIth(NoLock) On (B.Region_Code = A.Region_Code)
			Inner Join Tbl_Sfa_Region_Type_Master C WIth(NoLock) On (C.Region_Type_Code = B.Region_Type_Code And C.Region_Type_Name = 'Territory')
			Where
			IsNull(A.Ref_Key1, '') <> ''
			And A.Customer_Entity_Type = 'Stockiest'
			And @EndDate Between Convert(Date, A.Effective_From) And Convert(Date, IsNull(A.Effective_To, @EndDate))
		) B On (B.Region_Code = A.Region_Code AND B.Region_Name=A.Region_Name  And B.Ref_Key1 = A.Stokiest_Ref_Key1)

		Update A
		Set A.Product_Code = B.Product_Code
		From
		Tbl_Sfa_PrimarySales_Temp A
		Inner Join
		(
			Select
			A.Ref_Key1,
			A.Product_Code
			From
			Tbl_Sfa_Product_Master A With(NoLock)
			Inner Join Tbl_Sfa_Product_Type_Master B WIth(NoLock) On (B.Product_Type_Code = A.Product_Type And B.Product_Type_Name = 'Sales')
		) B On (B.Ref_Key1 = A.Product_Ref_Key1)

		
		Declare @BatchProcessingId Int
		Select @BatchProcessingId = BatchProcessingId From Tbl_Sfa_BatchProcessing_Header With(NoLock) 
		Where BP_ID = @BP_Id

		-- Depot Name Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0396',
		'Depot Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		A.Depot_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		Update A
		Set A.Remarks = 'Depot Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A
		Where 
		A.Depot_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Region Ref Key Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0395',
		'Region Ref Key Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		A.Region_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		Update A
		Set A.Remarks = 'Region Ref Key Mismatch'
		From
		Tbl_Sfa_PrimarySales_Temp A 
		Where 
		A.Region_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Region Depot Mapping Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0456',
		'Region Depot Mapping Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Left Outer Join Tbl_Dep_Depot_Region_Mapping B With(NoLock) On (B.Depot_Code = A.Depot_Code And B.Region_Code = A.Region_Code And B.Is_Active = 1)
		Where 
		A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
		And B.Depot_Code Is Null

		Update A
		Set A.Remarks = 'Region Depot Mapping Mismatch'
		From
		Tbl_Sfa_PrimarySales_Temp A 
		Left Outer Join Tbl_Dep_Depot_Region_Mapping B With(NoLock) On (B.Depot_Code = A.Depot_Code And B.Region_Code = A.Region_Code And B.Is_Active = 1)
		Where 
		A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
		And B.Depot_Code Is Null

		--Stockist Code Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0397',
		'Stockist Region Mapping Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		A.Stockist_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		Update A
		Set A.Remarks = 'Stockist Region Mapping Mismatch'
		From
		Tbl_Sfa_PrimarySales_Temp A 
		Where 
		A.Stockist_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Document Type Mismatch
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0398',
		'Document Type Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Inner Join Tbl_Sfa_Document_Type_Master B With(NoLock) ON (B.Document_Type_Name = A.Document_Type_Name And B.Record_Status = 1)
		Where 
		B.Document_Type_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		Update A
		Set A.Remarks = 'Document Type Mismatch'
		From
		Tbl_Sfa_PrimarySales_Temp A 
		Inner Join Tbl_Sfa_Document_Type_Master B With(NoLock) ON (B.Document_Type_Name = A.Document_Type_Name And B.Record_Status = 1)
		Where 
		B.Document_Type_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- HD_ERR_0457 (For Duplicate Document Number)
	
		-- Prodict Ref Key Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0400',
		'Product Ref Key Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		A.Product_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		Update A
		Set A.Remarks = 'Product Ref Key Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A
		Where 
		A.Product_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Prodict Region Division Mismatch
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0400',
		'Product Region Division Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Left Outer Join
		(
			Select
			A.Region_Code,
			A.Region_Name,
			E.Product_Code
			From
			Tbl_Sfa_Region_Master A With(NoLock)
			Inner Join Tbl_Sfa_Region_Type_Master B With(NoLock) On (B.Region_Type_Code = A.Region_Type_Code And B.Region_Type_Name = 'Territory')
			Inner Join Tbl_Sfa_Division_Entity_Mapping C WIth(NoLock) On (C.Entity_Code = A.Region_Code And C.Entity_Type = 'Region' And C.Record_Status = 1)
			Inner Join Tbl_Sfa_Division_Entity_Mapping D WIth(NoLock) On (D.Division_Code = C.Division_Code And D.Entity_Type = 'Product' And D.Record_Status = 1)
			Inner Join Tbl_Sfa_Product_Master E With(NoLock) On (E.Product_Code = D.Entity_Code)
			Inner Join Tbl_Sfa_Product_Type_Master F WIth(NoLock) On (F.Product_Type_Code = E.Product_Type And F.Product_Type_Name = 'Sales')		
		) B On (B.Region_Code = A.Region_Code And B.Product_Code = A.Product_Code AND B.Region_Name=A.Region_Name)
		Where 
		B.Region_Code Is Null And B.Product_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		Update A
		Set A.Remarks = 'Product Region Division Mismatch'
		From 
		Tbl_Sfa_PrimarySales_Temp A
		Left Outer Join
		(
			Select
			A.Region_Code,
			A.Region_Name,
			E.Product_Code
			From
			Tbl_Sfa_Region_Master A With(NoLock)
			Inner Join Tbl_Sfa_Region_Type_Master B With(NoLock) On (B.Region_Type_Code = A.Region_Type_Code And B.Region_Type_Name = 'Territory')
			Inner Join Tbl_Sfa_Division_Entity_Mapping C WIth(NoLock) On (C.Entity_Code = A.Region_Code And C.Entity_Type = 'Region' And C.Record_Status = 1)
			Inner Join Tbl_Sfa_Division_Entity_Mapping D WIth(NoLock) On (D.Division_Code = C.Division_Code And D.Entity_Type = 'Product' And D.Record_Status = 1)
			Inner Join Tbl_Sfa_Product_Master E With(NoLock) On (E.Product_Code = D.Entity_Code)
			Inner Join Tbl_Sfa_Product_Type_Master F WIth(NoLock) On (F.Product_Type_Code = E.Product_Type And F.Product_Type_Name = 'Sales')		
		) B On (B.Region_Code = A.Region_Code And B.Product_Code = A.Product_Code AND B.Region_Name=A.Region_Name)
		Where 
		B.Region_Code Is Null And B.Product_Code Is Null
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Free Qty Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0489',
		'Free Quantity Empty'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		IsNull(A.Free_Quantity, -1) = -1
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		Update A
		Set A.Remarks = 'Free Quantity Empty'
		From 
		Tbl_Sfa_PrimarySales_Temp A
		Where 
		ISNull(A.Free_Quantity, -1) = -1
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Net Qty Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0490',
		'Net Quantity Empty'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		ISNull(A.Net_Quantity, '') = ''
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		Update A
		Set A.Remarks = 'Net Quantity Empty'
		From 
		Tbl_Sfa_PrimarySales_Temp A
		Where 
		ISNull(A.Net_Quantity, '') = ''
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		-- Net Value Validate
		Insert Into Tbl_Sfa_BatchProcessing_Errlog
		Select 
		@BP_Id,
		A.ExcelRowNo,
		'HD_ERR_0491',
		'Net Value Empty'
		From 
		Tbl_Sfa_PrimarySales_Temp A With(NoLock)
		Where 
		ISNull(A.Net_Value, -1) = -1
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id

		Update A
		Set A.Remarks = 'Net Value Empty'
		From 
		Tbl_Sfa_PrimarySales_Temp A
		Where 
		ISNull(A.Net_Value, -1) = -1
		And A.PSDetails_Status = 1
		And A.BP_Id = @BP_Id
	
		If Exists (Select Count(1) From Tbl_Sfa_PrimarySales_Temp With(NoLock) Where IsNull(Remarks, '') = '' And BP_Id = @BP_Id AND @UploadType=2)
		Begin
	            Delete From Tbl_Sfa_PrimarySales_Details
				Where Document_Date Between @StartDate And @EndDate

				Insert Into Tbl_Sfa_PrimarySales_Details
				Select 
					@CompanyCode, 
					Region_Name, 
					Depot_Name, 
					Stokiest_Ref_Key1, 
					Document_Type_Name, 
					Document_Number, 
					Convert(Date, Document_Date),
					Null,
					Null,
					Product_Name,
					Product_Ref_Key1,
					Batch_Number,
					Convert(Numeric(10, 2), Convert(Float(24), Net_Quantity)),
					Convert(Numeric(10, 2), Convert(Float(24), Free_Quantity)),
					0.0,
					1,
					@UserCode,
					Convert(Varchar, GetDate(), 0),
					Region_Code,
					Product_Code,
					Convert(Numeric(10, 2), Convert(Float(24), Net_Value)),
					Depot_Code,
					Region_Ref_Key1,
					Null,
					Stockist_Code
				From 
					Tbl_Sfa_PrimarySales_Temp With(NoLock)
				Where 
				IsNull(Remarks, '') = ''
				And PSDetails_Status = 1
				And BP_ID = @BP_Id
			End

		If not Exists (Select Count(1) From Tbl_Sfa_PrimarySales_Temp With(NoLock) Where IsNull(Remarks, '') <> '' And BP_Id = @BP_Id AND @UploadType=1)
		Begin
		        Insert Into Tbl_Sfa_PrimarySales_Details
				Select 
					@CompanyCode, 
					Region_Name, 
					Depot_Name, 
					Stokiest_Ref_Key1, 
					Document_Type_Name, 
					Document_Number, 
					Convert(Date, Document_Date),
					Null,
					Null,
					Product_Name,
					Product_Ref_Key1,
					Batch_Number,
					Convert(Numeric(10, 2), Convert(Float(24), Net_Quantity)),
					Convert(Numeric(10, 2), Convert(Float(24), Free_Quantity)),
					0.0,
					1,
					@UserCode,
					Convert(Varchar, GetDate(), 0),
					Region_Code,
					Product_Code,
					Convert(Numeric(10, 2), Convert(Float(24), Net_Value)),
					Depot_Code,
					Region_Ref_Key1,
					Null,
					Stockist_Code
				From 
					Tbl_Sfa_PrimarySales_Temp With(NoLock)
				Where 
				IsNull(Remarks, '') = ''
				And PSDetails_Status = 1
				And BP_ID = @BP_Id
		  End

		If Exists (Select * From Tbl_Sfa_BatchProcessing_ErrLog WIth(NoLock) Where BP_Id = @BP_Id)
		Begin
			Update Tbl_Sfa_BatchProcessing_Header
			Set Status = 'ERROR'
			Where 
			BP_ID = @BP_Id And BP_Type = 'PSU_UPLOAD'
		End
		Else
		   Begin
			Update Tbl_Sfa_BatchProcessing_Header
			Set Status = 'SUCCESS'
			Where 
			BP_ID = @BP_Id And BP_Type = 'PSU_UPLOAD'
	      End
		INSERT INTO Tbl_Sfa_PrimarySales_logtbl (
			No_of_Records
			,File_Status
			,PS_File_Name
			,BP_Id
			)
		SELECT B.Records
			,A.STATUS
			,A.Upload_File_Name
			,@BP_Id
		FROM Tbl_Sfa_BatchProcessing_Header A WITH (NOLOCK)
		INNER JOIN (
			SELECT A.BP_Id
				,Count(1) Records
			FROM Tbl_Sfa_PrimarySales_Temp A WITH (NOLOCK)
			WHERE BP_Id = @BP_Id
			GROUP BY A.BP_Id
			) B ON (B.BP_ID = A.BP_Id)

		Delete From Tbl_Sfa_PrimarySales_Temp Where BP_ID = @BP_Id
	End
	COMMIT
END TRY
BEGIN CATCH
		ROLLBACK
		Update Tbl_Sfa_BatchProcessing_Header
		Set Status = 'Error',DB_Error=ERROR_MESSAGE()
		Where BP_ID =  Convert(UniqueIdentifier ,@BP_Id) And BP_Type = 'PSU_UPLOAD'
END CATCH
END
