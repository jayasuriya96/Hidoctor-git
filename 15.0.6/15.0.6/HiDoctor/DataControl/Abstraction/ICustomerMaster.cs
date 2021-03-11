using System.Web;
namespace DataControl.Abstraction
{
    interface ICustomerMaster
    {
        string GetCustomerMasterXLTemplate(string company_Code, string entity_Type);
        string InsertCustomerMaster(string subDomain, string company_Code, HttpPostedFileBase postedFile, string userCode, string entity_Type,string updatedBy);
        string GetCustomerCSVTemplate(string companyCode, string entity);
    }
}
