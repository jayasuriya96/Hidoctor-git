using MVCModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctor_ActivityFactoryClasses.DCR_V4
{
    public class BL_DCRChemistVisit
    {
        DL_DCRChemistVisit objdlDCRChemistVisit = null;
        CurrentInfo _objCurrentInfo;
        public DCRChemistVisitResut InsertDCRChemistVisitData(DCRChemistVisit objChemistVisit)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            _objCurrentInfo = new CurrentInfo();
            objChemistVisit.Company_Code = _objCurrentInfo.GetCompanyCode();
            objChemistVisit.Company_Id = 10;
            objChemistVisit.DCR_Code = _objCurrentInfo.GetDCRCode(objChemistVisit.DCR_Actual_Date);
            objChemistVisit.Region_Code = _objCurrentInfo.GetRegionCode();
            objChemistVisit.User_code = _objCurrentInfo.GetUserCode();

            objChemistVisit.CV_Visit_latitude = _objCurrentInfo.GetLattitude();
            objChemistVisit.CV_Visit_Longitude = _objCurrentInfo.GetLongitude();

            if (objChemistVisit.lsAttachment != null)
                objChemistVisit.lsAttachment = objChemistVisit.lsAttachment.Where(x => x.Status == "1").ToList();
            if (objChemistVisit.lsPOBOrderHeader != null && objChemistVisit.lsPOBOrderHeader.Count > 0)
                objChemistVisit.lsPOBOrderHeader.ForEach(x => x.Created_By = objChemistVisit.User_code);

            if (objChemistVisit.lsRCPA_Own_Products != null)
            {
                // objChemistVisit.lsRCPA_Own_Products.ForEach(x => x.Qty = 10);
                //objChemistVisit.lsRCPA_Own_Products.ForEach(x => x.Customer_Name = x.Customer_Name.Substring(0, 30));
                objChemistVisit.lsRCPA_Own_Products = objChemistVisit.lsRCPA_Own_Products.Where(x => x.Customer_Name != null && x.Qty != null && x.Product_Code != null && x.Product_Name != null).ToList();
            }
            //if (objChemistVisit.lsRCPA_Competitor_Products != null)
            //   objChemistVisit.lsRCPA_Competitor_Products.ForEach(x => x.Qty = 10);
            if (objChemistVisit.lsPOBOrderHeader != null && objChemistVisit.lsPOBOrderHeader.Count > 0)
            {
                objChemistVisit.lsPOBOrderHeader.ForEach(x => x.Favouring_User_Code = _objCurrentInfo.GetUserCode());
                objChemistVisit.lsPOBOrderHeader.ForEach(x => x.Favouring_Region_Code = _objCurrentInfo.GetRegionCode());
            }

            //Sample
            List<DCR_CV_Sample_Promotion> IDCRProductBatchModel = objChemistVisit.lsSample_Promotion;
            if (objChemistVisit.lsSample_Promotion != null && objChemistVisit.lsSample_Promotion.ToList().Count != 0)
                objChemistVisit.lsSample_Promotion = objChemistVisit.lsSample_Promotion.ToList().GroupBy(x => x.Product_Code).Select(y => y.First()).ToList();
            List<DCR_CV_Sample_Promotion> lsbatch = new List<DCR_CV_Sample_Promotion>();
            if (IDCRProductBatchModel != null && IDCRProductBatchModel.ToList().Count > 0)
            {
                foreach (var item in objChemistVisit.lsSample_Promotion.ToList())
                {
                    DCR_CV_Sample_Promotion obj = new DCR_CV_Sample_Promotion();
                    var single_pro = IDCRProductBatchModel.Where(x => x.Product_Code == item.Product_Code);
                    if (single_pro.ToList().Count > 0)
                    {
                        //obj.DCR_Product_Code = single_pro.ToList()[0].ch;
                        obj.Batch_Number = single_pro.ToList()[0].Batch_Number;
                        obj.Product_Code = single_pro.ToList()[0].Product_Code;
                        obj.CV_Customer_Name = objChemistVisit.Chemists_Name;
                        var quentity = 0;

                        for (int i = 0; i < single_pro.ToList().Count; i++)
                        {
                            if (single_pro.ToList()[i].Quantity_Provided.ToString() != "")
                                quentity += Convert.ToInt32(single_pro.ToList()[i].Quantity_Provided);
                        }
                        obj.Quantity_Provided = quentity;

                    }
                    else
                    {
                        //obj.DCR_Product_Code = item.DCR_Product_Code;
                        obj.Batch_Number = item.Batch_Number;
                        obj.Product_Code = item.Product_Code;
                        obj.Quantity_Provided = item.Quantity_Provided;
                    }
                    lsbatch.Add(obj);
                }
                objChemistVisit.lsSample_Promotion = null;
                objChemistVisit.lsSample_Promotion = lsbatch;
            }

            List<DCR_CV_Sample_Promotion> lsbatchProduct = new List<DCR_CV_Sample_Promotion>();
            if (IDCRProductBatchModel != null && IDCRProductBatchModel.ToList().Count > 0)
                IDCRProductBatchModel = IDCRProductBatchModel.Where(x => x.Batch_Number != "" && x.Batch_Number != null).ToList();
            if (objChemistVisit.lsSample_Promotion != null && IDCRProductBatchModel != null && objChemistVisit.lsSample_Promotion.ToList().Count > 0 && IDCRProductBatchModel.ToList().Count > 0)
            {
                foreach (var item in objChemistVisit.lsSample_Promotion.ToList())
                {
                    var sigle_pro = IDCRProductBatchModel.ToList().Where(x => x.Product_Code == item.Product_Code);
                    for (int i = 0; i < sigle_pro.ToList().Count; i++)
                    {
                        DCR_CV_Sample_Promotion obj = new DCR_CV_Sample_Promotion();
                        // obj.DCR_Product_Code = item.DCR_Product_Code;
                        obj.Product_Code = sigle_pro.ToList()[i].Product_Code;
                        obj.Quantity_Provided = sigle_pro.ToList()[i].Quantity_Provided;
                        obj.Batch_Number = sigle_pro.ToList()[i].Batch_Number;
                        lsbatchProduct.Add(obj);
                    }
                }
                IDCRProductBatchModel = null;
                IDCRProductBatchModel = lsbatchProduct;
                objChemistVisit.lsSample_Promotion_Batch = lsbatchProduct;
            }
            return objdlDCRChemistVisit.InsertDCRChemistVisitData(objChemistVisit);
        }
        public List<DCRChemistVisit> GetChemistVisitDatils(string type, string DCR_Date, int CV_Visit_Id)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            _objCurrentInfo = new CurrentInfo();
            if (type.ToUpper() == "ID" || type.ToUpper() == "COUNT")
                return objdlDCRChemistVisit.GetChemistVisitDatils(type, _objCurrentInfo.GetDCRCode(DCR_Date), CV_Visit_Id);
            else
                return objdlDCRChemistVisit.GetChemistVisitDatils(type, "", CV_Visit_Id);
        }
        public string DeleteChemistVisitData(int CV_Visit_Id)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            return objdlDCRChemistVisit.DeleteChemistVisitData(CV_Visit_Id);
        }
        public string GetRegionModuleAccess(string region_Code, string userCode,string flag)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            return objdlDCRChemistVisit.GetRegionModuleAccess(region_Code, userCode, flag);
        }
        public string GetChemistAccMandatory(string Company_Code, string User_Code, string DCR_Date)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            return objdlDCRChemistVisit.GetChemistAccMandatory(Company_Code, User_Code, DCR_Date);
        }
        public string GetAccompanistMandatoryInChemistVisit(string user_code, DateTime dcr_date, string company_Code)
        {

            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            return objdlDCRChemistVisit.GetAccompanistMandatoryInChemistVisit(user_code, dcr_date, company_Code);
        }
        public string GetRCPA_ChemistPrevilageCheck(string user_code, DateTime dcr_date, string company_Code)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            return objdlDCRChemistVisit.GetRCPA_ChemistPrevilageCheck(user_code, dcr_date, company_Code);
        }
        public List<string> GetChemistVistControls(string Company_Code, string User_Code)
        {
            objdlDCRChemistVisit = new DL_DCRChemistVisit();
            return objdlDCRChemistVisit.GetChemistVistControls(Company_Code, User_Code);
        }
    }
}
