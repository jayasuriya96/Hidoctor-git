IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_InsertAPPDieticianReporting]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_InsertAPPDieticianReporting]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_InsertAPPDieticianReporting]    Script Date: 03-03-2021 09:46:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_HD_InsertAPPDieticianReporting]

	@Company_Code varchar(30),
	@Region_Code varchar(30),
	@User_Code varchar(30),
	@status int,
	@headerid int,
	@DCR_Date varchar(30),
	@latitude varchar(30),
	@longitude varchar(30),
	@TVP_DieticianReporting_Headerdetails TVP_DieticianReporting_Headerdetails READONLY,
	@TVP_DieticianReporting_Accompanistdetails TVP_DieticianReporting_Accompanistdetails READONLY,
	@TVP_DieticianReporting_Doctordetails TVP_DieticianReporting_Doctordetails READONLY,
	@TVP_DieticianReporting_Patientdetails TVP_DieticianReporting_Patientdetails READONLY,
	@TVP_DieticianReporting_Prescriptiondetails TVP_DieticianReporting_Prescriptiondetails READONLY,
	@Result varchar(1500) OUTPUT

AS

BEGIN

	SET NOCOUNT ON;

		BEGIN TRY
		BEGIN TRANSACTION
		DECLARE @Header_Id int
		DECLARE @DivisionCode varchar(30)=(SELECT Division_Code from tbl_sfa_Region_master WITH(NOLOCK) where Region_Code=@Region_Code)

		if(@status =2 AND @headerid=0)
		BEGIN
		INSERT INTO	tbl_SFA_Dietician_Reporting_header
		(	
			Company_Code,
			Created_Region_Code,
			Division_Code,
			Filled_By,
			For_Region_Code,
			Start_date,
			Start_Time,
			End_Time,
			Camp_Type,
			Camp_Sub_Type,
			Location,
			Noofdoctors,
			Noofpatients,
			Noofprescriptions,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date,
			status,
			DCR_Date,
			Source,
			latitude,
			longitude
		)	
		SELECT
			@Company_Code,
			@Region_Code,
			@DivisionCode,
			filledby,
			foruser,
			startdate,
			starttime,
			endtime,
			camptype,
			campsubtype,
			(SELECT Place_Worked FROM tbl_sfa_dcr_master WITH(NOLOCK) WHERE User_Code=@User_Code AND DCR_Actual_date=@DCR_Date AND Flag='A'),
			CASE WHEN doctorcount=0 THEN null ELSE doctorcount END AS doctorcount,
			CASE WHEN patientcount=0 THEN null ELSE patientcount END AS patientcount,
			CASE WHEN prescriptioncount=0 THEN null ELSE prescriptioncount END AS prescriptioncount,
			@User_Code,
			GETDATE(),
			NULL,
			NULL,
			@status,
			@DCR_Date,
			'APP',
			@latitude,
			@longitude
		FROM
			@TVP_DieticianReporting_Headerdetails
		SET @Header_Id= @@IDENTITY
		 
		INSERT INTO tbl_sfa_DieticianReporting_Accompanist_Details
		(
			Company_Code,
			Header_Id,
			Accompanist_Code,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT
			@Company_Code,
			@Header_Id,
			Accompanist_Code,
			@User_Code,
			GETDATE(),
			null,
			null
		FROM
			@TVP_DieticianReporting_Accompanistdetails T1
			

	   INSERT INTO tbl_sfa_DieticianReporting_Doctor_Details
	   (	
			Company_Code,
			Header_Id,
			Doctor_Code,
			Doctor_Name,
			Speciality_Code,
			Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
	   )
	   SELECT
		  @Company_Code,
		  @Header_Id,
		  Doctor_Code,
		  Doctor_Name,
		  Speciality_code,
		  CASE WHEN Prescription_Value=0 THEN null ELSE Prescription_Value END AS Prescription_Value,
		  Notes,
		  @User_Code,
		  GETDATE(),
		  null,
		  null
		FROM
			@TVP_DieticianReporting_Doctordetails T1
		
		INSERT INTO tbl_sfa_DieticianReporting_Patient_Details
		(
			Company_Code,
			Header_Id,
			Parameter_Value,
			Patient_Name,
			Age,
			Gender,
			Total_Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
	    SELECT
			@Company_Code,
			@Header_Id,
			Parameter_Value,
			Patient_Name,
			CASE WHEN Age=0 THEN null ELSE Age END AS Age,
			CASE WHEN Gender='-1' THEN null ELSE Gender END AS Gender,
			CASE WHEN Total_Prescription_Value=0 THEN null ELSE Total_Prescription_Value END AS Total_Presecription_Value,
			Notes,
			@User_Code,
			GETDATE(),
			null,
			null
		FROM
			@TVP_DieticianReporting_Patientdetails T1

		INSERT INTO tbl_sfa_DieticianReporting_Prescription_Details
		(
			Company_Code,
			Header_Id,
			Product_Code,
			No_of_Prescriptions,
			No_of_PrescriptionValue,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT
		  @Company_Code,
		  @Header_Id,
		  Product_Code,
		  CASE WHEN No_of_Prescriptions=0 THEN null ELSE No_of_Prescriptions END AS No_of_Prescriptions,
		  CASE WHEN No_of_PrescriptionValue=0 THEN null ELSE No_of_PrescriptionValue END AS No_of_PrescriptionValue,
		  Notes,
		  @User_Code,
		  GETDATE(),
		  null,
		  null
		FROM
			@TVP_DieticianReporting_Prescriptiondetails T1
		
		END
		
		ELSE
		BEGIN
		
		INSERT INTO	tbl_SFA_Dietician_Reporting_header_History
		(	
			Company_Code,
			Header_Id,
			Created_Region_Code,
			Division_Code,
			Filled_By,
			For_Region_Code,
			Start_date,
			Start_Time,
			End_Time,
			Camp_Type,
			Camp_Sub_Type,
			Location,
			Noofdoctors,
			Noofpatients,
			Noofprescriptions,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date,
			status,
			DCR_Date,
			Source,
			latitude,
			longitude
		)
		SELECT 
			Company_Code,
			@headerid,
			Created_Region_Code,
			Division_Code,
			Filled_By,
			For_Region_Code,
			Start_date,
			Start_Time,
			End_Time,
			Camp_Type,
			Camp_Sub_Type,
			Location,
			Noofdoctors,
			Noofpatients,
			Noofprescriptions,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date,
			status,
			DCR_Date,
			'APP',
			@latitude,
			@longitude
		FROM
			tbl_SFA_Dietician_Reporting_header T1 WITH(NOLOCK)
		WHERE
			Header_Id=@headerid
			



		INSERT INTO tbl_sfa_DieticianReporting_Accompanist_Details_History
		(
			Company_Code,
			Accompanist_Id,
			Header_Id,
			Accompanist_Code,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT 
			Company_Code,
			Accompanist_Id,
			@headerid,
			Accompanist_Code,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		FROM
			tbl_sfa_DieticianReporting_Accompanist_Details T1 WITH(NOLOCK)
		WHERE
			Header_Id=@headerid


	  INSERT INTO tbl_sfa_DieticianReporting_Doctor_Details_History
	   (	
			Company_Code,
			Doctor_Id,
			Header_Id,
			Doctor_Code,
			Doctor_Name,
			Speciality_Code,
			Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
	   )
		SELECT 
			Company_Code,
			Doctor_Id,
			@headerid,
			Doctor_Code,
			Doctor_Name,
			Speciality_Code,
			Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		FROM
			tbl_sfa_DieticianReporting_Doctor_Details T1 WITH(NOLOCK)
		WHERE
			Header_Id=@headerid



		INSERT INTO tbl_sfa_DieticianReporting_Patient_Details_History
		(
			Company_Code,
			Patient_Id,
			Header_Id,
			Parameter_Value,
			Patient_Name,
			Age,
			Gender,
			Total_Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT 
			Company_Code,
			Patient_Id,
			@headerid,
			Parameter_Value,
			Patient_Name,
			Age,
			Gender,
			Total_Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		FROM
			tbl_sfa_DieticianReporting_Patient_Details T1 WITH(NOLOCK)
		WHERE
			Header_Id=@headerid



		
		INSERT INTO tbl_sfa_DieticianReporting_Prescription_Details_History
		(
			Company_Code,
			Prescription_Id,
			Header_Id,
			Product_Code,
			No_of_Prescriptions,
			No_of_PrescriptionValue,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT 
			Company_Code,
			Prescription_Id,
			@headerid,
			Product_Code,
			No_of_Prescriptions,
			No_of_PrescriptionValue,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		FROM
			tbl_sfa_DieticianReporting_Prescription_Details T1 WITH(NOLOCK)
		WHERE
			Header_Id=@headerid

		DELETE T1
			FROM tbl_sfa_DieticianReporting_Accompanist_Details T1 
		WHERE
			Header_Id=@headerid

		 DELETE T1
			FROM tbl_sfa_DieticianReporting_Doctor_Details T1
		 WHERE
			Header_Id=@headerid


		DELETE T1
			FROM tbl_sfa_DieticianReporting_Patient_Details T1
		 WHERE
			Header_Id=@headerid


		DELETE T1
			FROM tbl_SFA_Dietician_Reporting_header T1
		WHERE
			Header_Id=@headerid


		DELETE T1
			FROM tbl_sfa_DieticianReporting_Prescription_Details T1
		WHERE
			Header_Id=@headerid
			
		


			INSERT INTO	tbl_SFA_Dietician_Reporting_header
		(	
			Company_Code,
			Created_Region_Code,
			Division_Code,
			Filled_By,
			For_Region_Code,
			Start_date,
			Start_Time,
			End_Time,
			Camp_Type,
			Camp_Sub_Type,
			Location,
			Noofdoctors,
			Noofpatients,
			Noofprescriptions,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date,
			status,
			DCR_Date,
			Source,
			latitude,
			longitude
		)	
	
			SELECT
			@Company_Code,
			@Region_Code,
			@DivisionCode,
			filledby,
			foruser,
			startdate,
			starttime,
			endtime,
			camptype,
			campsubtype,
			(SELECT Place_Worked FROM tbl_sfa_dcr_master WITH(NOLOCK) WHERE User_Code=@User_Code AND DCR_Actual_date=@DCR_Date AND Flag='A'),
			CASE WHEN doctorcount=0 THEN null ELSE doctorcount END AS doctorcount,
			CASE WHEN patientcount=0 THEN null ELSE patientcount END AS patientcount,
			CASE WHEN prescriptioncount=0 THEN null ELSE prescriptioncount END AS prescriptioncount,
			@User_Code,
			GETDATE(),
			NULL,
			NULL,
			@status,
			@DCR_Date,
			'APP',
			@latitude,
			@longitude
		FROM
			@TVP_DieticianReporting_Headerdetails
		SET @Header_Id= @@IDENTITY
		 
		INSERT INTO tbl_sfa_DieticianReporting_Accompanist_Details
		(
			Company_Code,
			Header_Id,
			Accompanist_Code,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT
			@Company_Code,
			@Header_Id,
			Accompanist_Code,
			@User_Code,
			GETDATE(),
			null,
			null
		FROM
			@TVP_DieticianReporting_Accompanistdetails T1
	

	   INSERT INTO tbl_sfa_DieticianReporting_Doctor_Details
	   (	
			Company_Code,
			Header_Id,
			Doctor_Code,
			Doctor_Name,
			Speciality_Code,
			Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
	   )
	   SELECT
		  @Company_Code,
		  @Header_Id,
		  Doctor_Code,
		  Doctor_Name,
		  CASE WHEN Speciality_code='-1' THEN null ELSE Speciality_code END AS Speciality_code,
		  CASE WHEN Prescription_Value=0 THEN null ELSE Prescription_Value END AS Prescription_Value,
		  Notes,
		  @User_Code,
		  GETDATE(),
		  null,
		  null
		FROM
			@TVP_DieticianReporting_Doctordetails T1
	

		INSERT INTO tbl_sfa_DieticianReporting_Patient_Details
		(
			Company_Code,
			Header_Id,
			Parameter_Value,
			Patient_Name,
			Age,
			Gender,
			Total_Prescription_Value,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
	    SELECT
			@Company_Code,
			@Header_Id,
			Parameter_Value,
			Patient_Name,
			CASE WHEN Age=0 THEN null ELSE Age END AS Age,
			CASE WHEN Gender='-1' THEN null ELSE Gender END AS Gender,
			CASE WHEN Total_Prescription_Value=0 THEN null ELSE Total_Prescription_Value END AS Total_Presecription_Value,
			Notes,
			@User_Code,
			GETDATE(),
			null,
			null
		FROM
			@TVP_DieticianReporting_Patientdetails T1
		

		INSERT INTO tbl_sfa_DieticianReporting_Prescription_Details
		(
			Company_Code,
			Header_Id,
			Product_Code,
			No_of_Prescriptions,
			No_of_PrescriptionValue,
			Notes,
			Created_By,
			Created_date,
			Updated_By,
			Updated_Date
		)
		SELECT
		  @Company_Code,
		  @Header_Id,
		  Product_Code,
		  CASE WHEN No_of_Prescriptions=0 THEN null ELSE No_of_Prescriptions END AS No_of_Prescriptions,
		  CASE WHEN No_of_PrescriptionValue=0 THEN null ELSE No_of_PrescriptionValue END AS No_of_PrescriptionValue,
		  Notes,
		  @User_Code,
		  GETDATE(),
		  null,
		  null
		FROM
			@TVP_DieticianReporting_Prescriptiondetails T1
	

		END
		
				
		SET @Result='Success'
			
		COMMIT TRANSACTION

		END TRY

		BEGIN CATCH
			ROLLBACK TRANSACTION

			SET @Result='INFO:'+ERROR_MESSAGE();
			
		END CATCH
	SET NOCOUNT OFF;

END


