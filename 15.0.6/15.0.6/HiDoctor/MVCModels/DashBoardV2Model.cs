using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MVCModels
{
    public class DashboardV2Model
    {
        public string CompanyCode { get; set; }
        public string UserCode { get; set; }
        public string DivisionCode { get; set; }
        public string RegionCode { get; set; }
        public string Month { get; set; }
        public string Year { get; set; }
        public string ProductCode { get; set; }
        public string CoverageInput { get; set; }
        public string Flag { get; set; }
        public string Deviation { get; set; }
        public string State { get; set; }
        public string Subdomain { get; set; }
    }
    public class PrimarySecondaryTarget
    {
        public string Month { get; set; }
        public decimal PrimarySale { get; set; }
        public decimal SecondarySale { get; set; }
        public decimal TargetSale { get; set; }
    }

    public class ProductWisePerformance
    {
        public string Month { get; set; }
        public decimal PrimarySale { get; set; }
        public decimal SecondarySale { get; set; }
    }

    public class TimeInvestment
    {
        public int TotalDays { get; set; }
        public decimal FieldWork { get; set; }
        public decimal PceFieldWork { get; set; }
        public decimal Attendance { get; set; }
        public decimal PceAttendance { get; set; }
        public decimal Leave { get; set; }
        public decimal PceLeave { get; set; }
        public decimal LOP { get; set; }
        public decimal PceLOP { get; set; }
        public int NON_Compliance { get; set; }
        public decimal PceNON_Compliance { get; set; }
    }

    public class TPTimeLag
    {
        public string User_Type_Name { get; set; }
        public int Zero { get; set; }
        public int One { get; set; }
        public int Two { get; set; }
        public int Three { get; set; }
        public int Four { get; set; }
        public int GreaterthanFour { get; set; }

    }
    public class DCRTimeLag
    {
        public int DCR_Count { get; set; }
        public int Zero { get; set; }
        public int One { get; set; }
        public int Two { get; set; }
        public int Three { get; set; }
        public int Four { get; set; }
        public int GreaterthanFour { get; set; }

    }
    public class JoinerVsAttrition
    {
        public List<JoinerVsAttritionMultiple> month1 { get; set; }
        public List<JoinerVsAttritionMultiple> month2 { get; set; }
        public List<JoinerVsAttritionMultiple> month3 { get; set; }

    }
    public class JoinerVsAttritionMultiple
    {
        public string DivisionName { get; set; }
        public int Attrition { get; set; }
        public int Joiners { get; set; }
        public string Month { get; set; }

    }
    public class DRCoverage
    {
        public int count { get; set; }
        public int Total { get; set; }
    }

    public class DDL_DivisionV2
    {
        public string Division_Code { get; set; }
        public string Division_Name { get; set; }
    }
    public class ProductDetails
    {
        public string Product_Code { get; set; }
        public string Product_Name { get; set; }
    }

    public class POB
    {
        public List<POBMultiple> FM { get; set; }
        public List<POBMultiple> PM { get; set; }
        public List<POBMultiple> TM { get; set; }
    }

    public class POBMultiple
    {
        public string MONTH { get; set; }
        public int Doctor_Count { get; set; }
        public int Order_Count { get; set; }
        public decimal POB_Value { get; set; }
        public decimal EPOB_Value { get; set; }
    }
    public class CRMModel
    {

        public int Total_Customer { get; set; }
        public int No_Of_DOB { get; set; }
        public int No_Of_MA { get; set; }
        public int No_Of_Mob_Number { get; set; }
        public int No_Of_Landline_Number { get; set; }
        public int No_Of_Email { get; set; }
        public int No_Of_Registration { get; set; }
        public string Entity { get; set; }
    }

    public class StockistSale
    {
        public List<StockistMultiple> FM { get; set; }
        public List<StockistMultiple> PM { get; set; }
    }
    public class StockistMultiple
    {
        public int PS { get; set; }
        public int SS { get; set; }
        public string Name { get; set; }
    }
}

