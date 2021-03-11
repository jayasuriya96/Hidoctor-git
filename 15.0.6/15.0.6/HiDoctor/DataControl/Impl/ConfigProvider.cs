using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace DataControl.Impl
{
    public class ConfigProvider : Abstraction.IConfigProvider
    {
        public string GetConfigValue(string key)
        {
            return ConfigurationManager.AppSettings[key].ToString();
        }
    }
}
