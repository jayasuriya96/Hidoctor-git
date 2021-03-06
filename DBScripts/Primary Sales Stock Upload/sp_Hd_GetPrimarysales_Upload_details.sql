
/****** Object:  StoredProcedure [dbo].[sp_Hd_GetPrimarysales_Upload_details]    Script Date: 2/8/2021 9:44:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

---EXEC sp_Hd_GetPrimarysales_Upload_details 'REC00000001','','','','01/01/2020','28/02/2021','','HEADER'

ALTER PROCEDURE [dbo].[sp_Hd_GetPrimarysales_Upload_details]
(
	@Region_code VARCHAR(30),
	@Depot_code VARCHAR(150),
	@Stockiest_code VARCHAR(300),
	@Document_Number VARCHAR(150),
	@Dacument_From_Date VARCHAR(50),
	@Document_To_Date VARCHAR(50),
	@Product_Code Varchar(30),
	@Mode VARCHAR(30)
	
)
AS
BEGIN
    Declare @CompanyCode Varchar(30)
	Declare @Product_Name Varchar(150)
	Declare @Date_From Date
	Declare @Date_To Date

	Select @Date_From=Convert(Date,@Dacument_From_Date,103)
	Select @Date_To=Convert(Date,@Document_To_Date,103)
	Select @CompanyCode=Company_Code From tbl_sfa_Company_master With(NoLock)
	IF @Product_Code <>''
			BEGIN
				SET @Product_Name=(select Product_Name from tbl_Sfa_Product_Master  where Product_code=@Product_Code)
			END
    Create table #ChildRegion(
	Region_Code Varchar(30)
	)
	insert into #ChildRegion
	EXEC SP_hdGetChildRegionsCodeOnly @CompanyCode,@Region_Code
	IF @Mode='HEADER'

	BEGIN
	  --IF @Region_code <>''
			--BEGIN
			--	SET @Region_code=(select Region_Name from tbl_Sfa_Region_Master  where Region_code=@Region_code)
			--END
		DECLARE @Query VARCHAR(MAX)=NULL

		SET @Query='
				SELECT 
						PSD.Region_Name,
						PSD.Depot_Name,
						PSD.Stockiest_Ref_Key1,
						PSD.Document_Number,
						PSD.Document_Type,
						CONVERT(varchar,convert(date,PSD.Document_Date)) as Document_date,
						PSD.Net_Amount,
						SM.Customer_Name
						,PSD.Product_Name
						,PSD.Region_Ref_Key1
						,PSD.Product_Ref_Key1
						,PSD.Batch_Number
						,PSD.Sales_Quantity
						,PSD.Free_Quantity
						,PSD.Net_Amount
							
				FROM tbl_sfa_Primarysales_Details PSD With(NoLock)
				Inner Join #ChildRegion T
				On T.Region_Code=PSD.Region_Code
				INNER JOIN tbl_SFA_Customer_Master SM With(NoLock) 
			    ON PSD.Region_Code=SM.Region_Code
				AND SM.Customer_Code=PSD.Stockist_code'
					

		--print 'success'
		IF @Region_code ='' AND @Depot_code = '' AND @Stockiest_code = '' AND @Document_Number <> '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --only for document number and document date
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Document_number='''+ @Document_Number +''' AND				
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('1' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code ='' AND @Depot_code = '' AND @Stockiest_code = '' AND @Document_Number <> '' AND @Dacument_From_Date = '' AND @Document_To_Date = '' AND @Product_Code='' --only for document number
			BEGIN
				SET @Query= @Query +'	WHERE
					PSD.Document_number='''+ @Document_Number +''''
				    Print('2' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code ='' AND @Depot_code = '' AND @Stockiest_code = '' AND @Document_Number = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --only for document date
			BEGIN
				SET @Query= @Query +'	WHERE 
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)'
					Exec(@Query)
					Print('for date alone' + @Query)
			END	
		ELSE IF @Region_code <> '' AND @Depot_code = '' AND @Stockiest_code = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Document_Number = '' AND @Product_Code='' --only for region
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 				
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('4' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code <> '' AND @Depot_code = '' AND @Stockiest_code = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Document_Number <> '' AND @Product_Code='' -- region and document number and the dates
			BEGIN
				SET @Query= @Query +'	WHERE 
                    PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
					PSD.Document_number='''+@Document_Number+''' AND 
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('5' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code = '' AND @Depot_code <> '' AND @Stockiest_code = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Document_Number <> '' AND @Product_Code='' -- depot and document number and the dates
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Depot_Name='''+@Depot_code+''' AND
					PSD.Document_number='''+@Document_Number+''' AND 				
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('6' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code = '' AND @Depot_code = '' AND @Stockiest_code <> '' AND @Document_Number <> '' AND @Product_Code='' -- stockiest and document number and the dates
			BEGIN
				SET @Query= @Query +'	WHERE 
					SM.Customer_Name='''+@Stockiest_code+''' AND
					PSD.Document_number='''+@Document_Number+''' AND 
					AND SM.Customer_Status=1 AND
					SM.Customer_Entity_Type=''STOCKIEST''				
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)'
				    Print('7' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code = '' AND @Depot_code <> '' AND @Stockiest_code = '' AND @Document_Number = '' AND @Product_Code='' --only for depot
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Depot_Name='''+@Depot_code+''' AND				
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)'					
					Print('8' + @Query)
					Exec(@Query)
			END	
		ELSE IF @Region_code = '' AND @Depot_code = '' AND @Stockiest_code <> '' AND @Document_Number = '' AND @Product_Code='' --only for stokiest ref key
			BEGIN
				SET @Query= @Query +'	WHERE 
					SM.Customer_Name='''+@Stockiest_code+''' AND 
					SM.Customer_Status=1 AND
					SM.Customer_Entity_Type=''STOCKIEST'' AND				
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)'
					Print('9' + @Query)
					Exec(@Query)
			END												
		ELSE IF @Region_code <> '' AND @Depot_code <> '' AND @Stockiest_code <> '' AND @Document_Number <> '' AND @Product_Code='' --for all
			BEGIN
				SET @Query= @Query +'	WHERE 
                    PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
					PSD.Depot_Name='''+@Depot_code+''' AND
					SM.Customer_Name='''+@Stockiest_code+''' AND
					PSD.Document_number='''+@Document_Number+''' AND
					SM.Customer_Status=1 AND
					SM.Customer_Entity_Type=''STOCKIEST'' AND
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('10' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code = '' AND @Depot_code <> '' AND @Stockiest_code <> '' AND @Document_Number = '' AND @Product_Code='' --for all
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Depot_Name='''+@Depot_code+''' AND
					SM.Customer_Name='''+@Stockiest_code+''' 
					AND SM.Customer_Status=1 AND
					SM.Customer_Entity_Type=''STOCKIEST'' AND
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)'
					Print('11' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code <> '' AND @Depot_code <> '' AND @Stockiest_code <> '' AND @Document_Number = '' AND @Product_Code='' --for all
			BEGIN
				SET @Query= @Query +'	WHERE 
                    PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
					PSD.Depot_Name='''+@Depot_code+''' AND
					SM.Customer_Name='''+@Stockiest_code+''' AND
				    SM.Customer_Status=1 AND
					SM.Customer_Entity_Type=''STOCKIEST'' AND
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'					
					Print('12' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code = '' AND @Document_Number = '' AND @Product_Code<>'' --AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' --for region and stockiest
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
					SM.Customer_Name='''+@Stockiest_code+''' AND
					PSD.Product_Name='''+@Product_Name+''' 
					AND SM.Customer_Status=1 AND
					SM.Customer_Entity_Type=''STOCKIEST'' AND
					CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('13' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code <> '' AND @Stockiest_code = ''  AND @Depot_code <> '' AND @Document_Number = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --for region and stockiest
			BEGIN
				SET @Query= @Query +'	WHERE 
					PSD.Region_Code in(Select Region_Code From #ChildRegion t)  
					AND Customer_status=1 AND
					PSD.Depot_Name='''+@Depot_code+''' AND
				    CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
					order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
					Print('14' + @Query)
					Exec(@Query)
			END
		ELSE IF @Region_code <> '' AND @Stockiest_code = ''  AND @Depot_code <> '' AND @Document_Number <> '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				PSD.Depot_Name='''+@Depot_code+''' AND
				PSD.Document_number='''+@Document_Number+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('15' + @Query)
					

				Exec(@Query)
         
		END
		  ELSE IF @Region_code <> '' AND @Stockiest_code = ''  AND @Depot_code = '' AND @Document_Number = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				PSD.Product_Name='''+@Product_Name+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('16' + @Query)
		 		Exec(@Query)
		END
		  ELSE IF @Region_code <> '' AND @Stockiest_code = ''  AND @Depot_code <> '' AND @Document_Number <> '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 	
				PSD.Depot_Name='''+@Depot_code+''' AND
				PSD.Document_number='''+@Document_Number+''' AND
				PSD.Product_Name='''+@Product_Name+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('17' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code ='' AND @Document_Number='' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 	
				SM.Customer_Name='''+@Stockiest_code+''' AND
				PSD.Product_Name='''+@Product_Name+''' AND
				SM.Customer_Status=1 AND
				SM.Customer_Entity_Type=''STOCKIEST'' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('18' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code <>'' AND @Document_Number='' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 	
				SM.Customer_Name='''+@Stockiest_code+''' AND
				PSD.Product_Name='''+@Product_Name+''' AND
				PSD.Depot_Name='''+@Depot_code+''' 
				AND SM.Customer_Status=1 AND
			    SM.Customer_Entity_Type=''STOCKIEST'' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('19' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code <>'' AND @Document_Number<>'' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				SM.Customer_Name='''+@Stockiest_code+''' AND
				PSD.Product_Name='''+@Product_Name+''' AND
				PSD.Document_number='''+@Document_Number+''' AND
				PSD.Depot_Name='''+@Depot_code+''' 
				AND SM.Customer_Status=1 AND
				SM.Customer_Entity_Type=''STOCKIEST'' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('20' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code =''  AND @Depot_code ='' AND @Document_Number<>'' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				PSD.Document_number='''+@Document_Number+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('21' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code = ''  AND @Depot_code <> '' AND @Document_Number = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 	
				PSD.Depot_Name='''+@Depot_code+''' AND
				PSD.Product_Name='''+@Product_Name+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('22' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code ='' AND @Document_Number = '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				SM.Customer_Name='''+@Stockiest_code+''' 	
				AND SM.Customer_Status=1 AND
				SM.Customer_Entity_Type=''STOCKIEST'' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('23' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code ='' AND @Document_Number <> '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code<>'' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				SM.Customer_Name='''+@Stockiest_code+''' 	
				AND SM.Customer_Status=1 AND
				SM.Customer_Entity_Type=''STOCKIEST'' AND
				PSD.Document_number='''+@Document_Number+''' AND
				PSD.Product_Name='''+@Product_Name+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('24' + @Query)
		 		Exec(@Query)
		END
		ELSE IF @Region_code <> '' AND @Stockiest_code <> ''  AND @Depot_code ='' AND @Document_Number <> '' AND @Dacument_From_Date <> '' AND @Document_To_Date <> '' AND @Product_Code='' --for region and stockiest
		BEGIN
			SET @Query= @Query +'	WHERE 
                PSD.Region_Code in(Select Region_Code From #ChildRegion t) AND 
				SM.Customer_Name='''+@Stockiest_code+''' 	
				AND SM.Customer_Status=1 AND
				SM.Customer_Entity_Type=''STOCKIEST'' AND
				PSD.Document_number='''+@Document_Number+''' AND
				CONVERT(DATETIME,PSD.Document_date,103) BETWEEN CONVERT(DATETIME,'''+ @Dacument_From_Date +''',103) AND CONVERT(DATETIME,'''+ @Document_To_Date +''',103)
				order by PSD.Depot_Name,PSD.Stockiest_Ref_Key1,Document_Type,Document_Number,Product_Ref_Key1'
				Print('25' + @Query)
		 		Exec(@Query)
		END

		ELSE 
			BEGIN
				SELECT 
							'' as Region_Name,
							'' as Depot_Name,
							'' as Stockiest_ref_key1,
							'' as Document_Number,
							'' as Document_Type,
							'' as Document_date,							
							'' as Net_Amount 
							--Print('6')
			END

	END
	ELSE IF @Mode='DETAILS'
	BEGIN
		SELECT DISTINCT				
						PSD.Product_Name,
						PSD.Batch_Number,
						PSD.Sales_Quantity,
						PSd.Free_Quantity,
						PSD.Net_Amount,
						PSD.Document_Date
				FROM tbl_sfa_Primarysales_Details PSD With(NoLock)														
		WHERE
			PSD.Document_Number=@Document_Number
	END
	
END

			

