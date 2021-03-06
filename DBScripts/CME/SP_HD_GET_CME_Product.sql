IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SP_HD_GET_CME_Product]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SP_HD_GET_CME_Product]
GO
/****** Object:  StoredProcedure [dbo].[SP_HD_GET_CME_Product]    Script Date: 01-03-2021 10:41:42 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- SP_HD_GET_CME_Product 93,1110218,60
CREATE Procedure [dbo].[SP_HD_GET_CME_Product]
(
@CME_ID int,
@Doctor_Code varchar(30),
@Activity_Id int
)
As
Begin 
  Select CH.Campaign_Code AS CME_Id,CP.No_Of_Month ,MH.Product_Code,Product_Name 
  From tbl_CME_Campaign_Header CH WITH(NOLOCK)
  Join 
  tbl_CME_Product_Customer_Mapping MH WITH(NOLOCK)
  On (CH.Campaign_Code=MH.Campaign_Code)
  Join tbl_SFA_Product_Master  PM WITH(NOLOCK)
  On MH.Product_Code=PM.Product_Code
  Left join tbl_CME_CMEPlanning CP WITH(NOLOCK) 
  on (CP.CME_ID=CH.Campaign_Code and MH.P_id=CP.P_Id)
  INNER JOIN tbl_CME_Campaign_Details CD WITH(NOLOCK)
  ON CD.Campaign_Code=CH.Campaign_Code And MH.Product_Code=CD.Product_Code
  Where CH.Campaign_Code=@CME_ID
  And MH.Customer_Code=@Doctor_Code
  AND CD.Activity_Id=@Activity_Id

End

