/****** Object:  Table [dbo].[tbl_DoctorInfo_Mongo_Error_Log]    Script Date: 11/06/2017 9:12:09 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tbl_DoctorInfo_Mongo_Error_Log]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tbl_DoctorInfo_Mongo_Error_Log](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CompanyCode] [varchar](30) NULL,
	[RegionCode] [varchar](30) NULL,
	[Msg] [varchar](500) NULL,
	[StackTrace] [varchar](2000) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO


