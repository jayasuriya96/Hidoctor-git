using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using MVCModels;

namespace DataControl
{
    public class BLDashBoardV2 : DashboardV2Model
    {
        DataControl.DALDashBoardV2 _objDalDashboard = new DataControl.DALDashBoardV2();

        public IEnumerable<PrimarySecondaryTarget> GetPrimarySecondarywithTarget()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDalDashboard._adminDashboard.Flag = Flag;
            return _objDalDashboard.GetPrimarySecondarywithTarget();
        }
        public IEnumerable<ProductWisePerformance> GetProductWisePerformance()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDalDashboard._adminDashboard.ProductCode = ProductCode;
            return _objDalDashboard.GetProductWisePerformance();
        }


        public JoinerVsAttrition GetJoinerAttrition()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            return _objDalDashboard.GetJoinerAttrition();
        }

        public IEnumerable<DRCoverage> GetDrCoverage()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.RegionCode = RegionCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDalDashboard._adminDashboard.CoverageInput = CoverageInput;
            return _objDalDashboard.GetDrCoverage();
        }



        public IEnumerable<DDL_DivisionV2> GetDivisions()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.RegionCode = RegionCode;
            return _objDalDashboard.GetDivisions();
        }
        public IEnumerable<ProductDetails> GetProductName()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            return _objDalDashboard.GetProductName();
        }


        public IEnumerable<DDL_DivisionV2> GetDivisionList()
        {
            _objDalDashboard._adminDashboard.CompanyCode = CompanyCode;
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            return _objDalDashboard.GetDivisionList();
        }

        public POB GetPOBDetails()
        {
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            return _objDalDashboard.GetPOBDetails();
        }

        public IEnumerable<TimeInvestment> GetTimeInvestment()
        {
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.Flag = Flag;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            return _objDalDashboard.GetTimeInvestment();
        }

        public IEnumerable<TPTimeLag> GetTPTimeLag()
        {
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDalDashboard._adminDashboard.Flag = Flag;
            _objDalDashboard._adminDashboard.Deviation = Deviation;
            return _objDalDashboard.GetTPTimeLag();
        }
        public IEnumerable<DCRTimeLag> GetDCRTimeLag()
        {
            _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            _objDalDashboard._adminDashboard.Flag = Flag;
            return _objDalDashboard.GetDCRTimeLag();
        }
        public IEnumerable<CRMModel> GetCRMData(MVCModels.DashboardV2Model _objData)
        {
            return _objDalDashboard.GetCRMData(_objData);
        }
        public List<string> GetStates(string DivisionCode, string RegionCode)
        {
            return _objDalDashboard.GetStates(DivisionCode, RegionCode);
        }
        public StockistSale GetStockistSale()
        {
            //   _objDalDashboard._adminDashboard.UserCode = UserCode;
            _objDalDashboard._adminDashboard.RegionCode = RegionCode;
            _objDalDashboard._adminDashboard.DivisionCode = DivisionCode;
            //   _objDalDashboard._adminDashboard.Flag = Flag;
            return _objDalDashboard.GetStockistSale();
        }

    }
}

