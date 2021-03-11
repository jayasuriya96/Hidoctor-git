/****** Object:  Table [dbo].[tbl_DoctorMaster_VisitedDates_Log]    Script Date: 11/06/2017 9:13:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tbl_DoctorMaster_VisitedDates_Log]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tbl_DoctorMaster_VisitedDates_Log](
	[CompanyCode] [varchar](30) NULL,
	[RegionCode] [varchar](30) NULL,
	[DoctorCode] [varchar](30) NULL,
	[SpecialityName] [varchar](50) NULL,
	[CategoryName] [varchar](50) NULL,
	[ErrMsg] [varchar](500) NULL,
	[StackTrace] [text] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO


