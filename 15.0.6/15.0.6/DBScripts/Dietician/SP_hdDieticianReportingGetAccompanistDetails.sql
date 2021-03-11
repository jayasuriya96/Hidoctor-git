IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_hdDieticianReportingGetAccompanistDetails]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_hdDieticianReportingGetAccompanistDetails]
GO
/****** Object:  StoredProcedure [dbo].[SP_hdDieticianReportingGetAccompanistDetails]    Script Date: 03-03-2021 13:19:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--EXEC SP_hdDieticianReportingGetAccompanistDetails 'RAJ00000141','REC00001216','','USC00002022',''
CREATE Proc [dbo].[SP_hdDieticianReportingGetAccompanistDetails]
(
	@CompanyCode Varchar(30),	
	@RegionCode Varchar(30),
	@DCR_Code Varchar(50)='',
	@User_Code Varchar(30),
	@TP_Date Varchar(12)=''
)
As
BEGIN
		Declare @TblRegion Table
	(
		Sno Int Identity(1,1) Primary Key,
		Region_Code Varchar(30),
		Region_Name Varchar(50),
		Region_Type_Code Varchar(30),
		Region_Type_Name Varchar(50),
		Is_Child Int,
		Is_Immediate int
    )
    Declare @ExcludeUserType Varchar(3) = 'NO'
	Declare @AllowNonHierachy Varchar(3) = 'NO'
    Declare @Lcl_Region_Code Varchar(30) = ''

	Declare @User_Type_Code Varchar(30)
	Select @User_Type_Code = User_Type_code From Tbl_Sfa_User_Master With(NoLock)
	Where User_Code = @User_Code
	
	Select @AllowNonHierachy = IsNull(Privilege_Value_Name,'NO') 
	From Tbl_Sfa_UserType_Privilege_Mapping_NG With(NoLock)
	Where User_Type_Code = @User_Type_Code 
	And Privilege_Name = 'ALLOW_OTHER_HIERARCHY_IN_ACCOMPANIST_IN_APP'
	And Record_Status = 1

	Declare @PrivilegeName Varchar(max)
    Select @PrivilegeName=Privilege_Name From tbl_SFA_UserType_Privilege_Mapping_NG WITH(NOLOCK)
    Where User_Type_Code=@User_Type_Code
    AND Privilege_Name ='EXCLUDE_USER_TYPE_IN_ACCOMPANIST' AND Record_Status = 1
    DECLARE @TEMP TABLE(UserTypeName VARCHAR(30))
	   
    Declare @PrivilegeValueName Varchar(max)
    Select @PrivilegeValueName=Privilege_Value_Name From tbl_SFA_UserType_Privilege_Mapping_NG WITH(NOLOCK)
    Where User_Type_Code=@user_type_code
    AND Privilege_Name ='EXCLUDE_USER_TYPE_IN_ACCOMPANIST' AND Record_Status = 1
    Set @PrivilegeValueName = @PrivilegeValueName+','
    INSERT INTO @TEMP SELECT strval FROM [dbo].[fun_Split](@PrivilegeValueName, ',',1,LEN(@PrivilegeValueName) - LEN(REPLACE(@PrivilegeValueName,',','')))

	If @AllowNonHierachy = 'YES'
	Select @Lcl_Region_Code = Region_Code From Tbl_Sfa_User_Master With(NoLock)
	Where User_Code = Under_User_Code
	And User_Status = 1 
    Else
        Set @Lcl_Region_Code = @RegionCode

    If @AllowNonHierachy <> 'YES'
	Begin
		Insert Into @TblRegion
        (Region_Code,Region_Name,Region_Type_Code,Region_Type_Name)
		Exec SP_hdGetParentRegions @CompanyCode,@Lcl_Region_Code

		Update @TblRegion Set Is_Child = 0
    End

	Insert Into @TblRegion
    (Region_Code,Region_Name,Region_Type_Code,Region_Type_Name)
	Exec SP_hdGetChildRegions @CompanyCode,@Lcl_Region_Code
 
	If @AllowNonHierachy = 'YES'
    Begin
		Declare @TempTableRegionCodes Table
		(Region_Code Varchar(30) Primary Key)

		Insert INTO @TempTableRegionCodes
		Exec SP_hdGetParentRegionsCodeOnly @CompanyCode,@RegionCode

		Update A
		Set
        A.Is_Child = 0	
		From
		@TblRegion A
		Inner Join @TempTableRegionCodes B On (B.Region_Code = A.Region_Code)

		Delete From @TempTableRegionCodes

		Insert Into @TempTableRegionCodes
		Exec SP_hdGetChildRegionsCodeOnly @CompanyCode,@RegionCode

		Update A
		Set
		A.Is_Child = 1
		From
		@TblRegion A
		Inner Join @TempTableRegionCodes B On (B.Region_Code = A.Region_Code)              

		Update @TblRegion Set Is_Child = -1 Where Is_Child Is Null

		Delete From @TempTableRegionCodes
	End
	Else
		Update @TblRegion Set Is_Child = 1 Where Is_Child Is Null

	Update A
	Set
	A.Is_Immediate = 1
	From
	@TblRegion A
	Inner Join Tbl_Sfa_Region_Master B With(NoLock) On (B.Under_Region_Code= A.Region_Code)
	Where
	B.Region_Code = @RegionCode

	Update A
	Set
	A.Is_Immediate = 1
	From
	@TblRegion A
	Inner Join Tbl_Sfa_Region_Master B With(NoLock) On (B.Region_Code = A.Region_Code)
	Where
	B.Under_Region_Code = @RegionCode

	Declare @CustomerMaster Table
	(Region_Code Varchar(30), Entity_Type Varchar(30),Customer_Count Int)

    Insert Into @CustomerMaster
	Select
	A.Region_Code,
	A.Customer_Entity_Type,
	Count(A.Customer_Code) As 'Customer_Count'
	From
	Tbl_Sfa_Customer_Master A With(NoLock)
	Inner Join @TblRegion B On (B.Region_Code = A.Region_Code)
	Where
	A.Customer_Status = 1
	And A.Customer_Entity_Type = 'Doctor'
	Group By
	A.Region_Code,
	A.Customer_Entity_Type

   If(@PrivilegeValueName is not NULL)
   Begin
    Select
	Row_Number() Over (Order By [Full_Index]) As Accompanist_Id,
	D.*
	From
    (
		Select
		A.Region_Code,
		A.Region_Name,
		F.Full_Index,
		B.User_Code,
		B.User_Name,
		D.Employee_Name,
		E.User_Type_Name,
		A.Is_Child,
		A.Is_Immediate,
		dbo.UDF_GetUserChildCount(B.User_Code) Child_User_Count,
		F.Region_Type_Code,
		RTF.Region_Type_Name,
		A1.Division_Name
		From
		@TblRegion A
		Inner Join
		(
			Select
			A.Entity_Code
			From
			Tbl_Sfa_Division_Entity_Mapping A With(NoLock)
			Inner Join Tbl_Sfa_Division_Entity_Mapping B With(NoLock) On (B.Division_Code = A.Division_Code And B.Entity_Type = 'Region' And B.Record_Status = 1 And B.Entity_Code = @RegionCode)
			Where
			A.Entity_Type = 'Region' 
			And A.Record_Status = 1
			Group By
			A.Entity_Code
		) A2 On (A2.Entity_Code = A.Region_Code)
		Inner Join
		(
		SELECT
			A.Region_Code,

			Substring(
						(
						Select
						','+AA.Division_Name
							From
							tbl_SFA_Division_Entity_Mapping AB WITH(NOLOCK)
							INNER JOIN tbl_sfa_division_master AA WITH(NOLOCK)
							ON AB.Division_Code=AA.Division_Code                             
							Where  AB.Entity_Code=A.Region_Code   
							AND AB.Record_Status ='1'
							AND AB.Entity_Type='REGION'				
						Group BY 
						AA.Division_Name
							for XML PATH('')),2,8000) As Division_Name
               From
              @TblRegion A 			   
			  Group By 
			  A.Region_Code			  
		) A1 On (A1.Region_Code = A.Region_Code)
		Inner Join Tbl_Sfa_Region_Master F With(NoLock) On (F.Region_Code = A.Region_Code And F.Region_Code <> @RegionCode)
		Left Outer Join Tbl_Sfa_User_Master B With(NoLock) On (B.Region_Code = A.Region_Code And B.User_Status = 1)
		Left Outer Join Tbl_Sfa_Employee_Master D With(NoLock) On (D.Employee_Code = B.Employee_Code)
		Left Outer Join Tbl_Sfa_User_Type_Master E With(NoLock) On (E.User_Type_Code = B.User_Type_Code) 
		--AND E.User_Type_Name NOT IN(UPPER(@PrivilegeValueName)))
		Inner join Tbl_Sfa_Region_Type_Master RTF With(NoLock) on (F.Region_Type_Code=RTF.Region_Type_Code)
		Left Outer Join
		(
			Select
			A.Region_Code,
			Convert(Date,Max(B.Effective_To)) Vacancy_From
			From
			Tbl_Sfa_Region_Master A With(NoLock)
			Inner Join
			(
				Select
				A.Region_Code,
				Max(A.Effective_To) Effective_To
				From
				(
					Select A.Region_Code, Convert(Date,Max(IsNull(A.Effective_To, GetDate()))) Effective_To From Tbl_Sfa_User_Master A With(NoLock) Group By A.Region_Code
					Union All
					Select A.Region_Code, Convert(Date,Max(A.Effective_To)) Effective_To From Tbl_Sfa_User_Master_History A With(NoLock) Group By A.Region_Code
				) A
				Group By
				A.Region_Code
			) B On (B.Region_Code = A.Region_Code)
			Where
			A.Region_Status = 1
			Group By
			A.Region_Code
		) C On (C.Region_Code = A.Region_Code)
	) D 
	where D.User_Type_Name NOT IN(select * from @TEMP)
	End
	
	Else
	Begin
	Select
	Row_Number() Over (Order By [Full_Index]) As Accompanist_Id,
	D.*
	From
    (
		Select
		A.Region_Code,
		A.Region_Name,
		F.Full_Index,
		B.User_Code,
		B.User_Name,
		D.Employee_Name,
		E.User_Type_Name,
		A.Is_Child,
		A.Is_Immediate,
		dbo.UDF_GetUserChildCount(B.User_Code) Child_User_Count,
		F.Region_Type_Code,
		RTF.Region_Type_Name,
		A1.Division_Name
		From
		@TblRegion A
		Inner Join
		(
			Select
			A.Entity_Code
			From
			Tbl_Sfa_Division_Entity_Mapping A With(NoLock)
			Inner Join Tbl_Sfa_Division_Entity_Mapping B With(NoLock) On (B.Division_Code = A.Division_Code And B.Entity_Type = 'Region' And B.Record_Status = 1 And B.Entity_Code = @RegionCode)
			Where
			A.Entity_Type = 'Region' 
			And A.Record_Status = 1
			Group By
			A.Entity_Code
		) A2 On (A2.Entity_Code = A.Region_Code)
		Inner Join
		(
		SELECT
			A.Region_Code,

			Substring(
						(
						Select
						','+AA.Division_Name
							From
							tbl_SFA_Division_Entity_Mapping AB WITH(NOLOCK)
							INNER JOIN tbl_sfa_division_master AA WITH(NOLOCK)
							ON AB.Division_Code=AA.Division_Code                             
							Where  AB.Entity_Code=A.Region_Code   
							AND AB.Record_Status ='1'
							AND AB.Entity_Type='REGION'					
						Group BY 
						AA.Division_Name
							for XML PATH('')),2,8000) As Division_Name

               From
              @TblRegion A 
			
			   
			  Group By 
			  A.Region_Code
			  
		) A1 On (A1.Region_Code = A.Region_Code)
		Inner Join Tbl_Sfa_Region_Master F With(NoLock) On (F.Region_Code = A.Region_Code And F.Region_Code <> @RegionCode)
		Left Outer Join Tbl_Sfa_User_Master B With(NoLock) On (B.Region_Code = A.Region_Code And B.User_Status = 1)
		Left Outer Join Tbl_Sfa_Employee_Master D With(NoLock) On (D.Employee_Code = B.Employee_Code)
		Left Outer Join Tbl_Sfa_User_Type_Master E With(NoLock) On (E.User_Type_Code = B.User_Type_Code)
		Inner join Tbl_Sfa_Region_Type_Master RTF With(NoLock) on (F.Region_Type_Code=RTF.Region_Type_Code)
		Left Outer Join
		(
			Select
			A.Region_Code,
			Convert(Date,Max(B.Effective_To)) Vacancy_From
			From
			Tbl_Sfa_Region_Master A With(NoLock)
			Inner Join
			(
				Select
				A.Region_Code,
				Max(A.Effective_To) Effective_To
				From
				(
					Select A.Region_Code, Convert(Date,Max(IsNull(A.Effective_To, GetDate()))) Effective_To From Tbl_Sfa_User_Master A With(NoLock) Group By A.Region_Code
					Union All
					Select A.Region_Code, Convert(Date,Max(A.Effective_To)) Effective_To From Tbl_Sfa_User_Master_History A With(NoLock) Group By A.Region_Code
				) A
				Group By
				A.Region_Code
			) B On (B.Region_Code = A.Region_Code)
			Where
			A.Region_Status = 1

			Group By
			A.Region_Code
		) C On (C.Region_Code = A.Region_Code)
	) D 
	
	End

     Select * From @CustomerMaster


End

