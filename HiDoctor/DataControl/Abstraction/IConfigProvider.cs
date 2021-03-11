using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl.Abstraction
{
    public interface IConfigProvider
    {
        string GetConfigValue(string key);
    }
}
