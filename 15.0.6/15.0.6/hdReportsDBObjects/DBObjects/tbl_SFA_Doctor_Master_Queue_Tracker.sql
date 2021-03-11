/****** Object:  Table [dbo].[tbl_SFA_Doctor_Master_Queue_Tracker]    Script Date: 11/06/2017 9:11:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tbl_SFA_Doctor_Master_Queue_Tracker]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tbl_SFA_Doctor_Master_Queue_Tracker](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CompanyCode] [varchar](30) NULL,
	[UserCode] [varchar](30) NULL,
	[DoctorCode] [varchar](50) NULL,
	[RegionCode] [varchar](30) NULL,
	[EventName] [varchar](10) NULL,
	[ProcessStatus] [int] NULL,
	[JSONObject] [varchar](1000) NULL,
	[Mesg] [varchar](500) NULL,
	[StackTrace] [varchar](2000) NULL,
	[GeneratedDateTime] [datetime] NULL,
	[TopicName] [varchar](10) NULL,
	[SubscriptionName] [varchar](10) NULL
) ON [PRIMARY]
END
GO

SET ANSI_PADDING OFF
GO


