using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace HiDoctor.Controllers
{
    public class ActivityVsSales
    {
        DataControl.SPData objSpData = new DataControl.SPData();

        const string PRODUCT_CODE = "Product_Code";
        const string REGION_CODE = "Region_Code";
        const string PRODUCT_NAME = "Product_Name";
        const string REGION_NAME = "Region_Name";
        const string QTY = "Qty";
        const string VALUE = "Value";
        const string YIELD = "Yield";
        const string POTENTIAL = "Potential";
        const string PRICE = "Price";
        const string AND = "AND";

        public DataSet CalculateActivityVsSales(DataSet dsCateCove, string months, int year, string regionCodes, string productCodes, string leafRegions)
        {
            DataSet dsActVsSales = new DataSet();
            DataTable dt = new DataTable();
            DataTable dtYieldAndPoten = new DataTable();
            string productName = string.Empty;
            string productCode = string.Empty;

            float price = 0;
            float qty = 0;
            int regionCount = 0;
            int monthCount = 0;
            int totalDays = 0;
            float yield = 0;
            float totalyield = 0;
            float yieldValue = 0;
            float ayield = 0;

            float potential = 0;
            float totalpotential = 0;
            float potentialValue = 0;
            float apotential = 0;


            dt.Columns.Add(PRODUCT_NAME, typeof(string));
            dt.Columns.Add(VALUE, typeof(string));

            dtYieldAndPoten.Columns.Add(PRODUCT_NAME, typeof(string));
            dtYieldAndPoten.Columns.Add(YIELD, typeof(string));
            dtYieldAndPoten.Columns.Add(POTENTIAL, typeof(string));

            dsActVsSales.Tables.Add(dt);
            dsActVsSales.Tables.Add(dtYieldAndPoten);


            leafRegions = leafRegions.Replace("'", "");

            string[] monthArry = months.Split(',');
            string[] regionArry = leafRegions.Split(',');
            string[] productArry = productCodes.Split(',');

            regionCount = regionArry.Length;
            monthCount = monthArry.Length;

            foreach (string mnth in monthArry)
            {
                totalDays += DateTime.DaysInMonth(year, int.Parse(mnth));
            }
            //Secondary Sales Values
            foreach (DataRow dtRow in dsCateCove.Tables[0].Rows)
            {
                productName = dtRow[PRODUCT_NAME].ToString();
                productCode = dtRow[PRODUCT_CODE].ToString();

                qty = float.Parse(dtRow[QTY].ToString());

                price = GetPriceForProduct(dsCateCove.Tables[2], productCode);

                DataRow drVisit = dt.NewRow();
                drVisit[PRODUCT_NAME] = productName;
                drVisit[VALUE] = Math.Round(float.Parse(qty.ToString()) * float.Parse(price.ToString()), 2);
                dt.Rows.Add(drVisit);
                dsActVsSales.AcceptChanges();

                //Yield And Potential Calculation
                DataRow[] drActivity;
                foreach (string region in regionArry)
                {
                    yield = 0;
                    potential = 0;
                    totalyield = 0;
                    totalpotential = 0;

                    drActivity = dsCateCove.Tables[1].Select("" + REGION_CODE + "='" + region + "' " + AND + " " + PRODUCT_CODE + "='" + productCode + "'");
                    if (drActivity.Length > 0)
                    {
                        yield = float.Parse(drActivity[0][YIELD].ToString());
                        totalyield = yield * totalDays;
                        yieldValue += totalyield * price;

                        potential = float.Parse(drActivity[0][POTENTIAL].ToString());
                        totalpotential = potential * totalDays;
                        potentialValue += totalpotential * price;
                    }
                }
                ayield = yieldValue / regionCount;
                apotential = potentialValue / regionCount;

                DataRow drAct = dtYieldAndPoten.NewRow();
                drAct[PRODUCT_NAME] = productName;
                drAct[YIELD] = ayield;
                drAct[POTENTIAL] = apotential;
                dtYieldAndPoten.Rows.Add(drAct);
                dsActVsSales.AcceptChanges();
            }

            return dsActVsSales;
        }

        /// <summary>
        /// 
        /// To Get the Product Price 
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="productCode"></param>
        /// <returns></returns>
        public float GetPriceForProduct(DataTable dt, string productCode)
        {
            float productPrice = 0;
            DataRow[] dr;
            for (int i = dt.Rows.Count; i >= dt.Rows.Count; i--)
            {
                dr = dt.Select(PRODUCT_CODE + "='" + productCode + "'");
                if (dr.Length > 0)
                {
                    productPrice = float.Parse(dr[0][PRICE].ToString());
                    break;
                }
            }

            return productPrice;
        }
    }
}
