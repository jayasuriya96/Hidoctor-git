/****** Object:  Table [dbo].[MongoDCRLogs]    Script Date: 09/19/2017 11:45:35 AM ******/



/****** Object:  Table [dbo].[MongoDCRLogs]    Script Date: 09/19/2017 11:45:35 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='MongoDCRLogs')
BEGIN
CREATE TABLE [dbo].[MongoDCRLogs](
	[DCRCode] [varchar](50) NULL,
	[Flag] [char](1) NULL,
	[Event] [varchar](10) NULL,
	[Message] [varchar](500) NULL,
	[StackTrace] [varchar](1000) NULL
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO


