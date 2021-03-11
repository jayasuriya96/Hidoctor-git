USE [AURA_Global_Config_Testing]
GO

/****** Object:  Table [dbo].[tbl_Company_Messages]    Script Date: 9/18/2017 10:34:26 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
drop table tbl_Company_Messages
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tbl_Company_Messages]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[tbl_Company_Messages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Company_Id] [nvarchar](100) NOT NULL,
	[MessageId]  AS (concat([Id],[Company_Id])),
	[Message] [nvarchar](1000) NULL,
	[FromDate] [date] NULL,
	[ToDate] [date] NULL,
	[Active_Status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC,
	[Company_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]



ALTER TABLE [dbo].[tbl_Company_Messages] ADD  DEFAULT ((1)) FOR [Active_Status]

END