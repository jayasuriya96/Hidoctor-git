using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels;


namespace DataControl
{
    public class BLOrder
    {
        private DALOrder objDALOrder;
        public Order objOrder;

        public BLOrder()
        {
            objDALOrder = new DALOrder();
            objOrder = new Order();
        }

        public IEnumerable<OrderList> GetOrderList()
        {
            objDALOrder.objOrder.orderInputs.startDate = objOrder.orderInputs.startDate;
            objDALOrder.objOrder.orderInputs.endDate = objOrder.orderInputs.endDate;
            objDALOrder.objOrder.orderInputs.Region_Code = objOrder.orderInputs.Region_Code;
            return objDALOrder.GetOrderList();
        }

        public string PutOrderStatus()
        {
            objDALOrder.objOrder.orderInputs.Order_Id =objOrder.orderInputs.Order_Id;
            objDALOrder.objOrder.orderInputs.Order_Status = objOrder.orderInputs.Order_Status;
            objDALOrder.objOrder.orderInputs.Order_Mode = objOrder.orderInputs.Order_Mode;
            objDALOrder.objOrder.orderInputs.Order_Date = objOrder.orderInputs.Order_Date;
            objDALOrder.objOrder.orderInputs.User_Code = objOrder.orderInputs.User_Code;
            return objDALOrder.PutOrderStatus();
        }

        public List<OrderProductDetails> GetProduct()
        {
            objDALOrder.objOrder.orderInputs.Company_Code = objOrder.orderInputs.Company_Code;
            objDALOrder.objOrder.orderInputs.Region_Code = objOrder.orderInputs.Region_Code;
            return  objDALOrder.GetProduct().Where(x => x.Price_group_Code != null && x.Price_group_Code != "").ToList();
        }

        public object SetOrder()
        {
            objDALOrder.objOrder.orderInputs.Company_Code = objOrder.orderInputs.Company_Code;
            objDALOrder.objOrder.orderAdd = objOrder.orderAdd;
            return objDALOrder.SetOrder();
        }

        public OrderAdd GetOrder()
        {
            objDALOrder.objOrder.orderInputs.Order_Id = objOrder.orderInputs.Order_Id;
            return objDALOrder.GetOrder();
        }

        public FavouringUser GetUserDetails()
        {
            objDALOrder.objOrder.orderInputs.Region_Code = objOrder.orderInputs.Region_Code;
            return objDALOrder.GetUserDetails();
        }

        public IEnumerable<LineOfBusiness> GetLineOfBusiness()
        {
            objDALOrder.objOrder.orderInputs.Region_Code = objOrder.orderInputs.Region_Code;
            return objDALOrder.GetLineOfBusiness();
        }


        public string GetCheckLineOfBusiness(string Region_Code)
        {
            string str = "OTC";

            objDALOrder.objOrder.orderInputs.Region_Code = Region_Code;
            List<LineOfBusiness> lstLineOfBusiness = objDALOrder.GetLineOfBusiness().ToList();

            foreach (var item in lstLineOfBusiness)
            {
                if (item.Line_Of_Business == 1)
                {
                    str = "Pharma";
                    break;
                }
            }

            if (lstLineOfBusiness.Count > 1)
            {
                str = "OTC";
            }

            return str;
        }

    }
}
