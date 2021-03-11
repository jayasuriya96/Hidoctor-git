/****** Object:  Table [dbo].[tbl_SFA_DCR_Queue_Exception_Logs]    Script Date: 11/06/2017 9:04:25 PM ******/

/****** Object:  Table [dbo].[tbl_SFA_DCR_Queue_Exception_Logs]    Script Date: 11/06/2017 9:04:25 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='tbl_SFA_DCR_Queue_Exception_Logs')
BEGIN
	CREATE TABLE [dbo].[tbl_SFA_DCR_Queue_Exception_Logs](
		[CompanyCode] [varchar](30) NULL,
		[Id] [int] IDENTITY(1,1) NOT NULL,
		[DCRCode] [varchar](50) NULL,
		[Flag] [varchar](1) NULL,
		[UserCode] [varchar](30) NULL,
		[DCRDate] [date] NULL,
		[EventName] [varchar](10) NULL,
		[ExceptionMsg] [varchar](500) NULL,
		[StackTrace] [varchar](1000) NULL,
	PRIMARY KEY CLUSTERED 
	(
		[Id] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO


