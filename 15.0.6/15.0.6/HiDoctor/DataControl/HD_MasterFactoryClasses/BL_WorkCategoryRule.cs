using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MVCModels;


namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_WorkCategoryRule
    {
        public List<WorkCategoryRuleModel> GetWorkCategory(string Company_Code)
        {
            try
            {
                DAL_WorkCategoryRule obj = new DAL_WorkCategoryRule();
                return obj.GetWorkCategory(Company_Code);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        public List<WorkCategoryRulesData> GetWorkCategoryRuleData(string Company_Code)
        {
            try
            {
                DAL_WorkCategoryRule obj = new DAL_WorkCategoryRule();
                return obj.GetWorkCategoryRuleData(Company_Code);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string InsertorUpdateRulesData(string User_Code,RulesDefinitionDataModel objdata)
        {
            try
            {
                DAL_WorkCategoryRule obj = new DAL_WorkCategoryRule();
                return obj.InsertorUpdateRulesData(User_Code, objdata);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
