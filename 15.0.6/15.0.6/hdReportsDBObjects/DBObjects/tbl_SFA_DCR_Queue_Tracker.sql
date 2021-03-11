/****** Object:  Table [dbo].[tbl_SFA_DCR_Queue_Tracker]    Script Date: 11/06/2017 9:07:44 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tbl_SFA_DCR_Queue_Tracker]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tbl_SFA_DCR_Queue_Tracker](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyCode] [varchar](30) NULL,
	[UserCode] [varchar](30) NULL,
	[DCRCode] [varchar](50) NULL,
	[Flag] [varchar](1) NULL,
	[EventName] [varchar](10) NULL,
	[ProcessStatus] [int] NULL,
	[JSONObject] [varchar](1000) NULL,
	[Mesg] [varchar](500) NULL,
	[StackTrace] [varchar](2000) NULL,
	[GeneratedDateTime] [datetime] NULL,
	[TopicName] [varchar](10) NULL,
	[SubscriptionName] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO


