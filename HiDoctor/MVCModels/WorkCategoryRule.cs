using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MVCModels
{
    class WorkCategoryRule
    {
    }

    public class WorkCategoryRuleModel
    {
        public string Expense_Entity_Code { get; set; }
        public string Expense_Entity_Name { get; set; }
        public string Expense_Entity_Classification { get; set; }
    }
    public class RulesDefinitionDataModel
    {
        public string Mode { get; set; }
        public List<RulesDefinitionData> lst { get; set; }

    }
    public class RulesDefinitionData
    {
        public int Rule_Definition_ID { get; set; }
        public string User_Type_Code { get; set; }
        public string Work_Category_Code { get; set; }
        public string Min_No_Calls { get; set; }
        public string Less_Work_Category { get; set; }
        public string More_Work_Category { get; set; }
        public DateTime Effective_From { get; set; }
        public DateTime Effective_To { get; set; }
    }
    public class WorkCategoryRulesData
    {
        public int Rule_Definition_ID { get; set; }
        public string User_Type_Code { get; set; }
        public string User_Type_Name { get; set; }
        public int MinNo_Calls { get; set; }
        public string Category { get; set; }
        public int Record_Status { get; set; }
        public string Categroy_Code { get; set; }
        public string Less_Category { get; set; }
        public string Less_Category_Code { get; set; }
        public string More_Category { get; set; }
        public string More_Category_Code { get; set; }
        public string Effective_From { get; set; }
        public string Effective_To { get; set; }
    }

}
