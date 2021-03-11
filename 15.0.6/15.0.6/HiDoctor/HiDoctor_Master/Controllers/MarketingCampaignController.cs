using DataControl;
using DataControl.HiDoctor_ActivityFactoryClasses;
using DataControl.HiDoctor_Master;
using MVCModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace HiDoctor_Master.Controllers
{
    [AjaxSessionActionFilter]
    public class MarketingCampaignController : Controller
    {
        //

        #region Private Variables
        SPData _objSPData = new SPData();
        private Data _objData = new Data();
        // private CurrentInfo _objCurInfo = new CurrentInfo();
        #endregion Private Variables
        // GET: /MarketingCampaign/
        CurrentInfo _objCurrentInfo = new CurrentInfo();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MarketingCampaignDefiner()
        {
            ViewBag.CurrentDateMC = DateTime.Now.ToString("dd.MM.yyyy");
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            ViewBag.RegionCode = _objCurrentInfo.GetRegionCode();
            ViewBag.UserCode = _objCurrentInfo.GetUserCode();
            ViewBag.UserTypeCode = _objCurrentInfo.GetUserTypeCode();
            ViewBag.CompanyId = _objCurrentInfo.GetCompanyId();
            return View();
        }

        public ActionResult DoctorProductMapping()
        {
            ViewBag.CompanyCode = _objCurrentInfo.GetCompanyCode();
            return View();
        }

        public string GetDoctorProductTable(string campaignCode, string mappingType, string regionCode, string productPriValue, string searchKey, string mappingTo, string typeOfMapping)
        {

            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            StringBuilder strTblDoctor = new StringBuilder();
            StringBuilder strTblProduct = new StringBuilder();
            List<MVCModels.MCProductCustomerModel> lstProduct = null;
            IEnumerable<MVCModels.MCProductCustomerModel> lstDoctor = null;
            IEnumerable<MVCModels.MCProductCustomerModel> lstCount = null;
            IEnumerable<MCCampaign> lstcampaign = null;
            string currentregionCode = objCurInfo.GetRegionCode();

            lstCount = objMC.GetMappedDoctorandProductCount(objCurInfo.GetCompanyCode(), (campaignCode == "0" ? "" : campaignCode), regionCode,
            mappingType, regionCode, mappingTo, typeOfMapping);

            lstcampaign= objMC.GetMCMappedtoDoctorCount(regionCode);

            if ("DOCTOR_PRODUCT" == mappingType)
            {
                #region doctor product mapping
                if ("0" == campaignCode)
                {
                    lstDoctor = objMC.GetDoctorsByRegionAndStatus(objCurInfo.GetCompanyCode(), regionCode, "1^", "");
                    lstProduct = objMC.GetAllSalesProductsByRegion(objCurInfo.GetCompanyCode(), searchKey, regionCode);
                }
                else
                {
                    if (typeOfMapping == "CME_MAP")
                    {
                        lstDoctor = objMC.GetCMEDoctorsByCampaignandRegion(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^", "");
                        lstProduct = objMC.GetCMEProductsByRegionandCampaign(objCurInfo.GetCompanyCode(), campaignCode, searchKey, regionCode);
                    }
                    else
                    {
                        //lstDoctor = objMC.GetMCDoctors(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^2^");
                        lstDoctor = objMC.GetMCDoctorsByCampaignandRegion(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^", "");
                        lstProduct = objMC.GetMCProductsByRegionandCampaign(objCurInfo.GetCompanyCode(), campaignCode, searchKey, regionCode, typeOfMapping);
                    }
                }
                strTblDoctor.Append("<table class='table table-striped'><thead><tr><th>Select</th>");
                strTblDoctor.Append("<th>Mapped Product List</th><th>Action</th><th>Mapped Campaign</th><th><span class='docLabel'></span> Name</th>");
                strTblDoctor.Append("<th>Category Name</th><th>Speciality Name</th><th>MDL No</th>");
                strTblDoctor.Append("</tr></thead><tbody class='dpmd'>");
                if (lstDoctor != null)
                {
                    foreach (var doctor in lstDoctor)
                    {
                        bool productsMapped = false;
                        int noOfproductsMapped = 0;
                        var MC_Count = lstcampaign.AsEnumerable().Where(a => a.Customer_Code == doctor.Customer_Code).ToList();
                        if (lstCount != null)
                        {
                            var filtered = lstCount.AsEnumerable().Where(a => a.Customer_Code == doctor.Customer_Code).ToList();
                           
                            if (filtered.Count > 0)
                            {
                                productsMapped = true;
                                noOfproductsMapped = Convert.ToInt32(filtered[0].Mapped_Count);
                            }
                        }

                        if (productsMapped)
                        {
                            strTblDoctor.Append("<tr class='DPMD'><td><input type='radio' name='rdSelect' value='" + doctor.Customer_Code + "_"
                                               + doctor.Customer_Category_Code + "' onclick='fnGetSelectedDoctorName(\"" + doctor.Customer_Code
                                               + "_" + doctor.Customer_Category_Code + "^" + doctor.Customer_Name + "\",\"EDIT\");'/></td>");
                            strTblDoctor.Append("<td><a onclick='fnViewDoctorProductMapping(\"" + doctor.Customer_Code
                                       + "_" + doctor.Customer_Name + "\");'>View</a></td>");
                            strTblDoctor.Append("<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' onclick='fnDeleteDPMapping(\"" + doctor.Customer_Code + "\",\"" + campaignCode + "\",\"" + doctor.Customer_Name + "\");'></td>");
                            //strTblDoctor.Append("<td><a onclick='fnGetMappedProducts(\"" + doctor.Customer_Code
                            //                   + "_" + doctor.Customer_Category_Code + "^" + doctor.Customer_Name + "\");'>Edit</a></td>");
                        }
                        else
                        {
                            strTblDoctor.Append("<tr  class='DPMD'><td><input type='radio' name='rdSelect' value='" + doctor.Customer_Code + "_"
                                              + doctor.Customer_Category_Code + "' onclick='fnGetSelectedDoctorName(\"" + doctor.Customer_Code
                                              + "_" + doctor.Customer_Category_Code + "^" + doctor.Customer_Name + "\",\"INSERT\");'/></td>");
                            strTblDoctor.Append("<td></td>");
                            strTblDoctor.Append("<td></td>");
                        }
                        if(MC_Count.Count>0)
                        {
                            strTblDoctor.Append("<td><a onclick='fnViewDoctoralreadymapped(\"" + doctor.Customer_Code
                                                                  + "_" + doctor.Customer_Name + "\");'>View</a></td>");
                        }
                        else
                        {
                            strTblDoctor.Append("<td></td>");
                        }
                       
                        strTblDoctor.Append("<td>" + doctor.Customer_Name + "</td>");
                        // strTblDoctor.Append("<td>" + doctor.Customer_Status + "</td>");

                        strTblDoctor.Append("<td>" + doctor.Category_Name + "</td>");
                        strTblDoctor.Append("<td>" + doctor.Speciality_Name + "</td>");
                        strTblDoctor.Append("<td>" + doctor.MDL_Number + "</td>");

                        //if (productsMapped)
                        //{
                        //    strTblDoctor.Append("<td>" + noOfproductsMapped + "</td>");
                        //    strTblDoctor.Append("<td><a onclick='fnViewDoctorProductMapping(\"" + doctor.Customer_Code
                        //                + "_" + doctor.Customer_Name + "\");'>View</a></td>");
                        //}
                        //else
                        //{
                        //    strTblDoctor.Append("<td>0</td>");
                        //    strTblDoctor.Append("<td></td>");
                        //}
                        strTblDoctor.Append("</tr>");
                    }
                    //}else
                    //{
                    //    strTblDoctor.Append("<tr style='font-style:italic;'>No Approved Doctors for the selected region.</tr>");
                    //}
                    if (typeOfMapping == "CME_MAP")
                    {
                        strTblDoctor.Append("</tbody></table>");

                        strTblProduct.Append("<table class='table table-striped' id='tblProduct'><thead>");
                        strTblProduct.Append("<tr><th>Select <input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></th>");

                        strTblProduct.Append("<th>Product Name</th><th>Brand Name</th><th>Business Potential</th><th>Product Priority No</th>");
                        strTblProduct.Append("</tr></thead><tbody  class='dpmp'>");
                        strTblDoctor.Append("</tbody></table>");
                    }
                    else
                    {
                       


                        strTblProduct.Append("<table class='table table-striped' id='tblProduct'><thead>");
                        strTblProduct.Append("<tr><th>Select <input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/></th>");

                        strTblProduct.Append("<th>Product Name</th><th>Brand Name</th><th>Support Value</th>");
                        strTblProduct.Append("<th>Business Value</th><th>Product Priority No</th></tr></thead><tbody  class='dpmp'>");
                        strTblDoctor.Append("</tbody></table>");
                    }
                    if (lstProduct != null)
                    {
                        int i = 0;
                        foreach (var product in lstProduct)
                        {
                            i++;
                            if (typeOfMapping == "CME_MAP")
                            {
                                strTblProduct.Append("<tr  class='DPMP'><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i
                                                    + "' value='" + product.Product_Code + "' /></td>");
                                strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                                strTblProduct.Append("<td>" + product.Brand_Name + "</td>");
                                strTblProduct.Append("<td><input type='text' id='txtYield_" + i
                                            + "' class='form-control clsDecimal' value ='" + product.Support_Quantity + "'/></td>");
                                //strTblProduct.Append("<td><input type='text' id='txtPotential_" + i
                                //            + "' class='form-control clsDecimal' value ='" + product.Potential_Quantity + "'/></td>");
                                strTblProduct.Append("<td><input type='text' id='txtPriority_" + i
                                          + "' class='form-control' onblur='fnValidatePriority(this);' value ='" + product.Product_Priority_No + "'/></td></tr>");
                            }
                            else
                            {
                                strTblProduct.Append("<tr  class='DPMP'><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i
                                                  + "' value='" + product.Product_Code + "' /></td>");
                                strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                                strTblProduct.Append("<td>" + product.Brand_Name + "</td>");
                                strTblProduct.Append("<td><input type='text' id='txtYield_" + i
                                            + "' class='form-control clsDecimal' value ='" + product.Support_Quantity + "'/></td>");
                                strTblProduct.Append("<td><input type='text' id='txtPotential_" + i
                                            + "' class='form-control clsDecimal' value ='" + product.Potential_Quantity + "'/></td>");
                                strTblProduct.Append("<td><input type='text' id='txtPriority_" + i
                                            + "' class='form-control' onblur='fnValidatePriority(this);' value ='" + product.Product_Priority_No + "'/></td></tr>");
                            }
                                
                        }
                    }
                    //else
                    //{
                    //    strTblProduct.Append("<tr style='font-style:italic;'><td>No Products for the selected region.</td></tr>");
                    //}
                    strTblProduct.Append("</tbody></table>");
                    #endregion doctor product mapping
                }
            }
            else
            {
                #region product doctor mapping
                if ("0" == campaignCode)
                {
                    lstProduct = objMC.GetAllSalesProductsByRegion(objCurInfo.GetCompanyCode(), "", regionCode);
                    lstDoctor = objMC.GetDoctorsByRegionAndStatus(objCurInfo.GetCompanyCode(), regionCode, "1^", searchKey);
                }
                else
                {
                    if (typeOfMapping == "CME_MAP")
                    {
                        lstDoctor = objMC.GetCMEDoctorsByCampaignandRegion(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^", "");
                        lstProduct = objMC.GetCMEProductsByRegionandCampaign(objCurInfo.GetCompanyCode(), campaignCode, searchKey, regionCode);
                    }
                    else
                    {
                        //lstDoctor = objMC.GetMCDoctors(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^2^");
                        lstProduct = objMC.GetMCProductsByRegionandCampaign(objCurInfo.GetCompanyCode(), campaignCode,"",  regionCode, typeOfMapping);
                        lstDoctor = objMC.GetMCDoctorsByCampaignandRegion(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^", searchKey);
                       
                    }
                    //lstProduct = objProduct.GetAllSaleProducts(objCurInfo.GetCompanyCode());
                    //lstProduct = objMC.GetMCProductsByRegionandCampaign(objCurInfo.GetCompanyCode(), campaignCode, "", regionCode, typeOfMapping);
                   // lstDoctor = objMC.GetMCDoctorsByCampaignandRegion(objCurInfo.GetCompanyCode(), regionCode, campaignCode, "1^", searchKey);
                }
                strTblProduct.Append("<table class='table table-striped'><thead><tr><th>Select</th>");
                strTblProduct.Append("<th><span class='docLabel'></span> List</th><th>Action</th><th>Product Name</th><th>Brand Name</th>");
                strTblProduct.Append("</tr></thead><tbody class='pdmp'>");
                if (lstProduct != null)
                {
                    int i = 0;
                    foreach (var product in lstProduct)
                    {
                        i++;
                        strTblProduct.Append("<tr class='PDMP'>");


                        if (lstCount != null)
                        {
                            var filtered = lstCount.AsEnumerable().Where(a => a.Product_Code == product.Product_Code).ToList();
                            if (filtered.Count > 0)
                            {
                                strTblProduct.Append("<td><input type='radio' name='rdSelect' id='rdSelect_" + i
                                       + "' value='" + product.Product_Code + "' onclick='fnGetSelectedProductName(\"" + product.Product_Code
                                       + "_" + product.Product_Name + "\",\"EDIT\");'/></td>");
                                //strTblProduct.Append("<td><a onclick='fnGetMappedDoctors(\"" + product.Product_Code
                                //                                           + "_" + product.Product_Name + "\");'>Edit</a></td>");
                                strTblProduct.Append("<td><a onclick='fnViewProductDoctorMapping(\"" + product.Product_Code
                                                                + "_" + product.Product_Name + "\");'>View</a></td>");
                                strTblProduct.Append("<td><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' onclick='fnDeletePDMapping(\"" + product.Product_Code + "\",\"" + campaignCode + "\",\"" + product.Product_Name + "\");'></td>");
                                if (typeOfMapping == "CME_MAP")
                                {
                                    strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                                }
                                else
                                {
                                    strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                                }
                                strTblProduct.Append("<td>" + product.Brand_Name + "</td>");
                                //strTblProduct.Append("<td>" + filtered[0].Mapped_Count + "</td>");

                            }
                            else
                            {
                                strTblProduct.Append("<td><input type='radio' name='rdSelect' id='rdSelect_" + i
                                       + "' value='" + product.Product_Code + "' onclick='fnGetSelectedProductName(\"" + product.Product_Code
                                       + "_" + product.Product_Name + "\",\"INSERT\");'/></td>");
                                strTblProduct.Append("<td></td>");
                                strTblProduct.Append("<td></td>");
                                if (typeOfMapping == "CME_MAP")
                                {
                                    strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                                }
                                else
                                {
                                    strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                                }
                                strTblProduct.Append("<td>" + product.Brand_Name + "</td>");
                                //strTblProduct.Append("<td>0</td>");

                            }
                        }
                        else
                        {
                            strTblProduct.Append("<td><input type='radio' name='rdSelect' id='rdSelect_" + i
                                       + "' value='" + product.Product_Code + "' onclick='fnGetSelectedProductName(\"" + product.Product_Code
                                       + "_" + product.Product_Name + "\",\"INSERT\");'/></td>");
                            strTblProduct.Append("<td></td>");
                            strTblProduct.Append("<td></td>");
                            strTblProduct.Append("<td></td>");
                            strTblProduct.Append("<td>" + product.Product_Name + "</td>");
                            // strTblProduct.Append("<td>0</td>");

                        }

                        strTblProduct.Append("</tr>");
                    }
                }


                strTblProduct.Append("</tbody></table>");

                if (typeOfMapping == "CME_MAP")
                {
                    strTblDoctor.Append("<table class='table table-striped'><thead><tr><th>Select <input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/>");
                    strTblDoctor.Append("<th>Mapped Campaign</th><th><span class='docLabel'></span> Name</th>");
                    strTblDoctor.Append("<th>Category Name</th><th>Speciality Name</th><th>MDL No</th>");
                    strTblDoctor.Append("<th>Business Potential</th></tr></thead><tbody class='pdmd'>");
                }
                else
                {
                    strTblDoctor.Append("<table class='table table-striped'><thead><tr><th>Select <input type='checkbox' name='chkSelectAll' onclick='fnSelectAll();'/>");
                    strTblDoctor.Append("<th>Mapped Campaign</th><th><span class='docLabel'></span> Name</th>");
                    strTblDoctor.Append("<th>Category Name</th><th>Speciality Name</th><th>MDL No</th>");
                    strTblDoctor.Append("<th>Support Value</th><th>Business Value</th></tr></thead><tbody class='pdmd'>");
                }
                if (lstDoctor != null)
                {
                    //lstCount = null;
                    //// TO GET THE MAPPED PRODUCT COUNT
                    //lstCount = objMC.GetMappedDoctorandProductCount(objCurInfo.GetCompanyCode(), (campaignCode == "0" ? "" : campaignCode),
                    //        regionCode, "DOCTOR_PRODUCT");
                    int i = 0;
                    foreach (var doctor in lstDoctor)
                    {
                        i++;
                        var MC_Count = lstcampaign.AsEnumerable().Where(a => a.Customer_Code == doctor.Customer_Code).ToList();
                        if (typeOfMapping == "CME_MAP")
                        {
                            strTblDoctor.Append("<tr class='PDMD'><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i
                            + "' value='" + doctor.Customer_Code + "_" + doctor.Customer_Category_Code + "'/></td>");
                            strTblDoctor.Append("<td><a onclick='fnViewDoctoralreadymapped(\"" + doctor.Customer_Code
                                      + "_" + doctor.Customer_Name + "\");'>View</a></td>");
                            strTblDoctor.Append("<td>" + doctor.Customer_Name + "</td>");
                            // strTblDoctor.Append("<td>" + doctor.Customer_Status + "</td>");

                            strTblDoctor.Append("<td>" + doctor.Category_Name + "</td>");
                            strTblDoctor.Append("<td>" + doctor.Speciality_Name + "</td>");
                            strTblDoctor.Append("<td>" + doctor.MDL_Number + "</td>");

                            strTblDoctor.Append("<td><input type='text' id='txtYield_" + i
                                + "' class='form-control clsDecimal' value ='" + doctor.Support_Quantity + "'/></td>");
                            //strTblDoctor.Append("<td><input type='text' id='txtPotential_" + i
                            //    + "' class='form-control clsDecimal' value ='" + doctor.Potential_Quantity + "'/></td></tr>");
                        }
                        else
                        {
                            strTblDoctor.Append("<tr class='PDMD'><td><input type='checkbox' name='chkSelect' id='chkSelect_" + i
                           + "' value='" + doctor.Customer_Code + "_" + doctor.Customer_Category_Code + "'/></td>");
                            if (MC_Count.Count > 0)
                            {
                                strTblDoctor.Append("<td><a onclick='fnViewDoctoralreadymapped(\"" + doctor.Customer_Code
                                                                      + "_" + doctor.Customer_Name + "\");'>View</a></td>");
                            }
                            else
                            {
                                strTblDoctor.Append("<td></td>");
                            }
                            strTblDoctor.Append("<td>" + doctor.Customer_Name + "</td>");
                            // strTblDoctor.Append("<td>" + doctor.Customer_Status + "</td>");

                            strTblDoctor.Append("<td>" + doctor.Category_Name + "</td>");
                            strTblDoctor.Append("<td>" + doctor.Speciality_Name + "</td>");
                            strTblDoctor.Append("<td>" + doctor.MDL_Number + "</td>");

                            strTblDoctor.Append("<td><input type='text' id='txtYield_" + i
                                + "' class='form-control clsDecimal' value ='" + doctor.Support_Quantity + "'/></td>");
                            strTblDoctor.Append("<td><input type='text' id='txtPotential_" + i
                                + "' class='form-control clsDecimal' value ='" + doctor.Potential_Quantity + "'/></td></tr>");
                        }
                    }
                }

                strTblDoctor.Append("</tbody></table>");
                #endregion product doctor mapping
            }
            return strTblDoctor.ToString() + "$" + strTblProduct.ToString();
        }


        /// <summary>
        /// Method to Delete Doctor Product Mapping
        /// </summary>
        /// <returns></returns>

        public bool DoctorProdMappingDelete(string regionCode, string doctorCode, string campaignCode, string mappingTo, string typeofMapping)
        {
            bool result = false;
            string companyCode = null;
            string currentregionCode = null;
            try
            {
                BLMarketingCampaign objMC = new BLMarketingCampaign();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                currentregionCode = objCurInfo.GetRegionCode();
                result = objMC.DoctorProdMappingDelete(companyCode, regionCode, currentregionCode, doctorCode, campaignCode, mappingTo, typeofMapping);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        /// <summary>
        /// Method to Delete  Product Doctor Mapping
        /// </summary>
        /// <returns></returns>

        public bool ProdDoctorMappingDelete(string regionCode, string productCode, string campaignCode, string mappingTo, string typeofMapping)
        {
            bool result = false;
            string companyCode = null;
            string currentregionCode = null;
            try
            {
                BLMarketingCampaign objMC = new BLMarketingCampaign();
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                companyCode = objCurInfo.GetCompanyCode();
                currentregionCode = objCurInfo.GetRegionCode();
                result = objMC.ProdDoctorMappingDelete(companyCode, regionCode, currentregionCode, productCode, campaignCode, mappingTo, typeofMapping);
            }
            catch (Exception ex)
            {
                throw;
            }
            return result;
        }
        public JsonResult GetMarketingCampaigns(string regionCode)
        {
            // string regionCode = null;           
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            //regionCode = objCurInfo.GetRegionCode();           
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.MCHeaderModel> lstCampaign;
            lstCampaign = objMC.GetMarketingCampaignNames(objCurInfo.GetCompanyCode(), regionCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstCampaign));
        }

        public string InsertMCDoctorProductMapping(string regionCode, string campaignCode, string mappingType,
            string MCProductDetails, string MCDoctorDetails, string doctorCode, string selectedProductCode, string mappingTo, string typeOfMapping)
        {
            string result = string.Empty;
            string GenMapping = "MAPPING";
            string TarMapping = "TARGET_MAPPING";
            string MarkMapping = string.Empty;
            if (typeOfMapping=="CME_MAP")
            {
                 MarkMapping = "CME_MAP";
            }
            else
            {
                 MarkMapping = "MARKETING_CAMPAIGN";

            }

            string currentregionCode = string.Empty;
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            currentregionCode = objCurInfo.GetRegionCode();
            //int rowsAffected = 0;
            if (typeOfMapping == "GEN_MAP")
            {
                if ("DOCTOR_PRODUCT" == mappingType)
                {
                    result = objMC.InsertCustomerProduct(objCurInfo.GetCompanyCode(), doctorCode, MCProductDetails, campaignCode,
                            regionCode, mappingType, objCurInfo.GetUserName(), currentregionCode, mappingTo, GenMapping);
                }
                else
                {
                    result = objMC.InsertCustomerProduct(objCurInfo.GetCompanyCode(), MCDoctorDetails, selectedProductCode, campaignCode,
                            regionCode, mappingType, objCurInfo.GetUserName(), currentregionCode, mappingTo, GenMapping);
                }

            }
            else if (typeOfMapping == "TAR_MAP")
            {
                if ("DOCTOR_PRODUCT" == mappingType)
                {
                    result = objMC.InsertCustomerProduct(objCurInfo.GetCompanyCode(), doctorCode, MCProductDetails, campaignCode,
                            regionCode, mappingType, objCurInfo.GetUserName(), currentregionCode, mappingTo, TarMapping);
                }
                else
                {
                    result = objMC.InsertCustomerProduct(objCurInfo.GetCompanyCode(), MCDoctorDetails, selectedProductCode, campaignCode,
                            regionCode, mappingType, objCurInfo.GetUserName(), currentregionCode, mappingTo, TarMapping);
                }

            }
            else
            {
                if ("DOCTOR_PRODUCT" == mappingType)
                {
                    result = objMC.InsertCustomerProductMarketingMapping(objCurInfo.GetCompanyCode(), doctorCode, MCProductDetails, campaignCode,
                            regionCode, mappingType, objCurInfo.GetUserName(), currentregionCode, mappingTo, MarkMapping);
                }
                else
                {
                    result = objMC.InsertCustomerProductMarketingMapping(objCurInfo.GetCompanyCode(), MCDoctorDetails, selectedProductCode, campaignCode,
                            regionCode, mappingType, objCurInfo.GetUserName(), currentregionCode, mappingTo, MarkMapping);
                }
            }




            //result = objMC.InsertMCDoctorProductMapping(objCurInfo.GetCompanyCode(), doctorCode, campaignCode,
            //              regionCode, MCDoctorDetails, MCProductDetails, mappingType, doctorCategory, objCurInfo.GetUserCode(),
            //              selectedProductCode, DOCTOR_PRODUCT_MAPPING_VALIDATION, CustomerCount, campaignName, mode);

            return result;
        }

        public JsonResult GetMCProductsByDoctor(string regionCode, string doctorCode, string campaignCode, string mappingTo, string typeofMapping)
        {
            string currentregionCode = null;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            currentregionCode = objCurInfo.GetRegionCode();
            IEnumerable<MVCModels.MCProductCustomerModel> lstMCProduct;
            lstMCProduct = objMC.GetMCProductsByDoctor(objCurInfo.GetCompanyCode(), doctorCode, regionCode,
                                    ((campaignCode == "0") ? "" : campaignCode), currentregionCode, mappingTo, typeofMapping);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMCProduct));
        }

        public JsonResult GetMCDoctorsByProduct(string regionCode, string productCode, string campaignCode, string mappingTo, string typeofMapping)
        {
            string currentregionCode = null;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.MCProductCustomerModel> lstMCDoctor;
            currentregionCode = objCurInfo.GetRegionCode();
            lstMCDoctor = objMC.GetMCDoctorsByProduct(objCurInfo.GetCompanyCode(), productCode, regionCode,
                                    ((campaignCode == "0") ? "" : campaignCode), currentregionCode, mappingTo, typeofMapping);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMCDoctor));
        }
        public JsonResult GetSelectedMCHeader(string campaignCode, string regionCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.MCHeaderModel> lstMCHeader;
            lstMCHeader = objMC.GetSelectedMCHeader(objCurInfo.GetCompanyCode(), campaignCode, regionCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMCHeader));
        }
        public JsonResult GetParentHierarchyByRegion(string mappingType, string typeofMapping, string regionCode, string campaignCode)
        {
            string companyCode = null;
            string currentregionCode = null;
            RegionHierarchyModelMC lstRegions = null;
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                companyCode = objCurInfo.GetCompanyCode();
                currentregionCode = objCurInfo.GetRegionCode();
                lstRegions = objMC.GetParentHierarchyByRegion(companyCode, regionCode, mappingType, typeofMapping, currentregionCode, campaignCode);
                return Json(lstRegions, JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {

                throw;
            }
        }

        //************************************** Start - Marketing Campaign Definer *****************************************//

        //returns all the Master data needed for Marketing Camaign
        public JsonResult GetMarketingCampaignFormData(string regionCode)
        {
            try
            {
                // List<object> lstCat = new List<object>();
                List<MVCModels.DesignationModel> lstDesig = new List<MVCModels.DesignationModel>();
                List<MVCModels.DoctorCategoryModel> lstDocCat = new List<MVCModels.DoctorCategoryModel>();
                List<MVCModels.SpecialityModel> lstSpeciality = new List<MVCModels.SpecialityModel>();
                List<MVCModels.HiDoctor_Master.ProductModel> lstSale = new List<MVCModels.HiDoctor_Master.ProductModel>();
                List<MVCModels.HiDoctor_Master.ProductModel> lstSample = new List<MVCModels.HiDoctor_Master.ProductModel>();

                //DataControl.BL_DCRHeader _objHead = new DataControl.BL_DCRHeader();

                DataControl.BL_Customer _objCust = new DataControl.BL_Customer();
                DataControl.BLProduct _objProd = new DataControl.BLProduct();
                DataControl.HiDoctor_Master.BLMarketingCampaign _objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();


                DataControl.CurrentInfo _objCurr = new DataControl.CurrentInfo();
                string companyCode = _objCurr.GetCompanyCode();

                //lstCat = _objHead.GetCategory(companyCode);
                lstDesig = _objMC.GetDesignations(companyCode, regionCode);
                lstDocCat = _objMC.GetDoctorCategory(companyCode, regionCode);
                lstSpeciality = _objMC.GetSpeciality(companyCode);
                lstSale = _objMC.GetSaleProductsBasedOnRegion(companyCode, regionCode);
                lstSample = _objMC.GetPromotionalProductsBasedOnRegion(companyCode, regionCode);

                List<JsonResult> lst = new List<JsonResult> { Json(lstDesig, JsonRequestBehavior.AllowGet)
                                                            , Json(lstDocCat, JsonRequestBehavior.AllowGet)
                                                            , Json(lstSpeciality, JsonRequestBehavior.AllowGet)
                                                            ,Json(lstSale, JsonRequestBehavior.AllowGet)
                                                            ,Json(lstSample, JsonRequestBehavior.AllowGet)};
                return new LargeJsonResult
                {
                    MaxJsonLength = Int32.MaxValue,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new
                    {
                        total = lstDesig.Count + lstDocCat.Count + lstSpeciality.Count + lstSale.Count + lstSample.Count,
                        data = lst
                    }
                };
            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
                return null;
            }
        }

        // returns a table string of all the Campaign for a region
        public JsonResult GetMarketingCampaignsForARegion(string regionCode, string recordStatus, string startDate, string endDate, string mode)
        {
            List<MCHeaderModel> lstMCHeader = null;
            try
            {

                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();

                string companyCode = objCurInfo.GetCompanyCode();
                //string status = "2,1,0";
                //string mode = "ED";

                lstMCHeader = objMC.GetMarketingCampaignsForARegion(companyCode, regionCode, recordStatus, startDate, endDate, mode);
                return Json(lstMCHeader, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                throw;

            }
        }
        public JsonResult GetCampaignHeaderDetails(string campaignCode)
        {
            MarketingCampaignModel ObjMC = null;
            try
            {
                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();

                string companyCode = objCurInfo.GetCompanyCode();
                ObjMC = objMC.GetCampaignHeaderDetails(companyCode, campaignCode);
                return Json(ObjMC, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {

                throw;
            }

        }

        //returns product detail table string for a campaign
        public JsonResult GetMarketingCampaignProductDetails(string campaignCode)
        {
            IEnumerable<MVCModels.MCDetailsModel> lstProd = null;
            try
            {
                StringBuilder sbTbl = new StringBuilder();

                DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                string companyCode = objCurInfo.GetCompanyCode();


                lstProd = objMC.GetMCProductDetails(companyCode, campaignCode);

            }
            catch (Exception ex)
            {
                Dictionary<string, string> dicObj = new Dictionary<string, string>();
                dicObj.Add("campaignCode", campaignCode);
                DataControl.Impl.ExceptionHandler.WriteLog(ex: ex, dic: dicObj);
            }
            return Json(lstProd, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMarketingCampaignProductDetailsList(string campaignCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            string companyCode = objCurInfo.GetCompanyCode();

            IEnumerable<MVCModels.MCDetailsModel> lstProd;
            lstProd = objMC.GetMCProductDetails(companyCode, campaignCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(lstProd, JsonRequestBehavior.AllowGet);
        }

        public int InsertMarketingCampaign(MCHeader ObjMCHeader, string regionCode)
        {
            string companyCode = null;
            string createdBy = null;
            string createdDateTime = null;
            string companyId = null;
            int result = 0;
            try
            {
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                companyCode = objCur.GetCompanyCode();
                createdBy = objCur.GetUserName();
                createdDateTime = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                companyId = objCur.GetCompanyId();

                result = objMC.InsertMarketingCampaign(companyCode, regionCode, ObjMCHeader, companyId, createdBy, createdDateTime);
                return result;
            }
            catch (Exception ex)
            {
                throw;

            }
        }
        public JsonResult GetActivities()
        {
            string companyCode = null;
            List<ActivityModel> lstAct = null;
            try
            {
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                companyCode = objCur.GetCompanyCode();
                lstAct = objMC.GetActivities(companyCode);
                return Json(lstAct, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public JsonResult GetProductsSamplebyCampaign(string campaignCode)
        {
            MCProductModel ObjMCProd = null;
            string companyCode = null;
            try
            {
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                companyCode = objCur.GetCompanyCode();
                ObjMCProd = objMC.GetProductsSamplebyCampaign(companyCode, campaignCode);
                return Json(ObjMCProd, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public JsonResult GetRemarksByMarketingCampaign(string campaignCode)
        {
            List<MCHeaderModel> lstRemarks = null;
            string companyCode = null;
            try
            {
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                companyCode = objCur.GetCompanyCode();
                lstRemarks = objMC.GetRemarksByMarketingCampaign(companyCode, campaignCode);
            }
            catch (Exception ex)
            {
                throw;
            }
            return Json(lstRemarks, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetDocForAllRegionsUndertheSelectedRegion(string regionCode, string excludeParentLevel, string includeOneLevelParent)
        {
            string currentregionCode = null;
            string companyCode = null;
            List<RegionDetailsModel> lstRegion = null;
            try
            {
                DataControl.CurrentInfo objCur = new DataControl.CurrentInfo();
                companyCode = objCur.GetCompanyCode();
                currentregionCode = objCur.GetRegionCode();
                DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
                lstRegion = objMC.GetDocForAllRegionsUndertheSelectedRegion(companyCode, regionCode, excludeParentLevel, includeOneLevelParent, currentregionCode);
                return Json(lstRegion, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public bool UpdateCampaignCurrentStatus(string campaignCode, int UpdateStatus, string reasontoPause)
        {
            bool result = false;
            string companyCode = null;
            string actionBy = null;
            string company_Id = null;
            int companyId = 0;
            try
            {
                CurrentInfo _ObjCur = new CurrentInfo();
                BLMarketingCampaign ObjMC = new BLMarketingCampaign();
                companyCode = _ObjCur.GetCompanyCode();
                actionBy = _ObjCur.GetUserCode();
                company_Id = _ObjCur.GetCompanyId();
                Int32.TryParse(company_Id, out companyId);
                result = ObjMC.UpdateCampaignCurrentStatus(companyCode, campaignCode, UpdateStatus, reasontoPause, companyId, actionBy);
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }
        public JsonResult GetSelectedCMECHeader(string campaignCode, string regionCode)
        {
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.MCHeaderModel> lstMCHeader;
            lstMCHeader = objMC.GetSelectedCMECHeader(objCurInfo.GetCompanyCode(), campaignCode, regionCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMCHeader));
        }
        public JsonResult GetCMECampaigns()
        {
            // string regionCode = null;           
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            //regionCode = objCurInfo.GetRegionCode();           
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.MCHeaderModel> lstCampaign;
            lstCampaign = objMC.GetCMECampaigns(objCurInfo.GetCompanyCode(), objCurInfo.GetRegionCode());
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstCampaign));
        }
        public JsonResult GetMCMappedtoDoctor(string regionCode, string doctorCode)
        {
            string currentregionCode = null;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            currentregionCode = objCurInfo.GetRegionCode();
            IEnumerable<MVCModels.MCCampaign> lstMCProduct;
            lstMCProduct = objMC.GetMCMappedtoDoctor(objCurInfo.GetCompanyCode(), doctorCode, regionCode);
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            return Json(objJson.Serialize(lstMCProduct));
        }
        //************************************** End - Marketing Campaign Definer *******************************************//
        #region MC - Get Doctor Count - Region Wise
        public JsonResult GetDoctorCountforRegion(string campaignCode)
        {
            IEnumerable<MVCModels.MCHeaderModel> lstDoctorcountforCampaign;
            DataControl.CurrentInfo objCurInfo = new DataControl.CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            DataControl.JSONConverter objJson = new DataControl.JSONConverter();
            string companyCode = objCurInfo.GetCompanyCode();
            lstDoctorcountforCampaign = objMC.GetDoctorcountforMC(companyCode, campaignCode);
            return Json(objJson.Serialize(lstDoctorcountforCampaign));
        }
        #endregion MC - Get Doctor Count - Region Wise

        #region Doctor Product Mapping New
        public ActionResult DoctorProductMappingNew()
        {
            DataControl.CurrentInfo _objCurr = new CurrentInfo();
            ViewBag.UserName = _objCurr.GetUserName();
            ViewBag.UserRegion = _objCurr.GetRegionName();
            ViewBag.userRegionCode = _objCurr.GetRegionCode();
            ViewBag.Designation = _objCurr.GetUserTypeName();
            return View();
        }
        public JsonResult GetDoctorDetailsByRegion(string regionCode)
        {
            DataControl.HiDoctor_Master.BLMarketingCampaign _objBLMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.DoctorDetails> lstDocDetails;
            lstDocDetails = _objBLMC.GetDoctorDetailsByRegion(regionCode);
            return Json(lstDocDetails, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDocProduct(string RegionCode, string SelRegionCode)
        {
            DataControl.HiDoctor_Master.BLMarketingCampaign _objblMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            IEnumerable<MVCModels.DocProdDetailsModel> DocProdDetailLst;
            DocProdDetailLst = _objblMC.GetDocProduct(RegionCode, SelRegionCode);
            return Json(DocProdDetailLst, JsonRequestBehavior.AllowGet);
        }
        public string InsertDocProd(List<MVCModels.DocProdInsertModel> InsertDocProdLst, string selType)
        {
            string result = string.Empty;
            DataControl.CurrentInfo _objcurr = new CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign _objblMC = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            result = _objblMC.InsertDocProd(_objcurr.GetCompanyCode(), _objcurr.GetUserName(), InsertDocProdLst, selType);
            return result;
        }
        public int IsParentRegion()
        {
            string userRegionCode = string.Empty;
            DataControl.CurrentInfo _currInfo = new CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objBL = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            return objBL.IsParentRegion(_currInfo.GetRegionCode());
        }
        #endregion
        #region Survey
        public JsonResult GetUserTypePrivileges(string companyCode, string regionCode, string userCode, string userTypeCode)
        {
            List<PrivilegeDetailsModel> lstPrivileges = null;
            DataControl.CurrentInfo _currInfo = new CurrentInfo();
            DataControl.HiDoctor_Master.BLMarketingCampaign objBL = new DataControl.HiDoctor_Master.BLMarketingCampaign();
            lstPrivileges = objBL.GetUserTypePrivileges(_currInfo.GetCompanyCode(), _currInfo.GetRegionCode(), _currInfo.GetUserCode(), _currInfo.GetUserTypeCode());
            return Json(lstPrivileges, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}
