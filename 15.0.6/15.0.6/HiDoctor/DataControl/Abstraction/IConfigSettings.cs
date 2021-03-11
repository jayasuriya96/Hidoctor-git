
using DataControl.EnumType;
namespace DataControl.Abstraction
{
    public interface IConfigSettings
    {
        string GetConfigDefaultValue(string company_Code, CONFIG_TYPE config_Type, CONFIG_KEY config_Key);
        string GetConfigValueasperDB(string company_Code, CONFIG_TYPE config_Type, CONFIG_KEY config_Key); 
    }
   
}
