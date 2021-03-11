IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_CheckCME]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_CheckCME]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_GET_CME_Product]    Script Date: 01-03-2021 10:41:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- SP_HD_GET_CME_Product 93,1110218,60
CREATE Procedure [dbo].[SP_HD_CheckCME]
(
@CME_ID int,
@Doctor_Code varchar(30),
@Activity_Id int,
@Result int OUTPUT
)
As
Begin 
			DECLARE @DoctorRegionCode varchar(50)=(SELECT Region_Code from tbl_sfa_Customer_Master WITH(NOLOCK) where Customer_Code=@Doctor_Code)

			DECLARE @Count int

			SET @Count=(
						  SELECT 
								COUNT(*) 
						  FROM
							   tbl_SFA_Attendance_DCR_MC_Activity T1 WITH(NOLOCK)
						  INNER JOIN tbl_CME_Product_Tracking T2 WITH(NOLOCK)
							ON T1.DCR_Code=T2.DCR_Code 
						  INNER JOIN tbl_sfa_Customer_Master T3 WITH(NOLOCK)
							ON T2.Customer_Code = T3.Customer_Code
						  WHERE
								T1.Campaign_Code=@CME_ID
							AND T2.Customer_Code=@Doctor_Code
							AND T1.MC_Activity_Id=@Activity_Id
							AND T3.Region_Code=@DoctorRegionCode
					   )
			    IF(@Count>0)
				BEGIN
				  SET @Result= 1
				END	
			    ELSE
				BEGIN
				  SET @Result= 0
				END


End

