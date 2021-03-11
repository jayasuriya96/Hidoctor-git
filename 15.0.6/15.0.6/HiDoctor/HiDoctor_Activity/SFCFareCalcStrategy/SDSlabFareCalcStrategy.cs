using System;
using System.Web;
using System.Data;
using System.Linq;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class SDSlabFareCalcStrategy : ISFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            double totalFare = 0.0;
            if (fareCalcPassed.DCR_Version == "DCR V3")
            {
                #region DCRV3
                bool flag = false;
                SFCFareCalculationFactory objSFCFact = new SFCFareCalculationFactory();

                flag = objSFCFact.CheckSfcMasterExist();
                if (flag)
                {
                    // for SFC
                    SFareCalcStrategy objS = new SFareCalcStrategy();
                    totalFare = objS.CalculateSFCFare(fareCalcPassed);

                    if (totalFare == 0.0)
                    {
                        // for DFC
                        DSlabFareCalcStrategy objD = new DSlabFareCalcStrategy();
                        totalFare = objD.CalculateSFCFare(fareCalcPassed);
                    }
                }
                else
                {
                    // for DFC
                    DSlabFareCalcStrategy objD = new DSlabFareCalcStrategy();
                    totalFare = objD.CalculateSFCFare(fareCalcPassed);
                }
                #endregion DCRV3
            }
            else
            {
                string hopNeed = fareCalcPassed.IntermediatePlace;
                string entity = fareCalcPassed.Entity;
                string sumDistance = fareCalcPassed.Sum_Distance_Needed;

                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                DataControl.Data objData = new DataControl.Data();
                DataSet dsTravelPlace = new DataSet();

                string companyCode = objCurr.GetCompanyCode();

                // travelled place ds based on (category check, intermediated place privilege check)
                DataControl.BL_DCRStockiestExpense objBL = new DataControl.BL_DCRStockiestExpense();
                dsTravelPlace = objBL.GetDCRTravelledPlacesForFareCalculation(companyCode, fareCalcPassed.DcrCode, fareCalcPassed.DcrFalg, fareCalcPassed.Entity);

                dsTravelPlace.Tables[0].Columns.Add("IS_Calculated", typeof(string));

                //seperate SFC and DFC
                //calculate for SFC and update the column IS_Calculated="Y" then calculate dfc for IS_Calculated!="Y"

                #region SFC Calculaion
                foreach (DataRow dr in dsTravelPlace.Tables[0].Rows)
                {
                    // for SFC
                    double fareAmount = 0.0;
                    fareAmount += objBL.GetSFCFare(companyCode, dr["From_Place"].ToString().Trim(), dr["To_Place"].ToString().Trim(), dr["SFC_Region_Code"].ToString().Trim(), dr["SFC_Category_Name"].ToString().Trim(), dr["Travel_Mode"].ToString().Trim(), fareCalcPassed.DcrDate);

                    if (fareAmount == 0.0)
                    {
                        dr["IS_Calculated"] = "N";
                    }
                    else
                    {
                        dr["IS_Calculated"] = "Y";
                        totalFare += fareAmount;
                    }
                }
                #endregion SFC Calculaion

                // Calculate for DFC
                #region DFC Calculation
                DataRow[] drrRow = dsTravelPlace.Tables[0].Select("IS_Calculated='N'");
                if (drrRow.Length > 0)
                {
                    if (fareCalcPassed.Sum_Distance_Needed == "Y")
                    {
                        #region Sum Distance Yes
                        var distanceTvlMode = from row in drrRow.AsEnumerable()
                                              group row by new
                                              {
                                                  Travel_Mode = row.Field<string>("Travel_Mode"),
                                              } into grp
                                              select new
                                              {
                                                  Travel_Mode = grp.Key.Travel_Mode,
                                                  Distance = grp.Sum(r => r.Field<decimal>("Distance"))
                                              };
                        foreach (var dist in distanceTvlMode)
                        {
                            double fareAmount = 0.0;
                            // for DFC
                            DSlabFareCalcStrategy objD = new DSlabFareCalcStrategy();
                            fareAmount = objD.CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dist.Distance), dist.Travel_Mode.ToString().Trim(),entity,sumDistance);

                            totalFare += fareAmount;
                        }
                        #endregion Sum Distance Yes
                    }
                    else
                    {
                        #region Sum distance No
                        foreach (DataRow dr in drrRow)
                        {
                            double fareAmount = 0.0;
                            // for DFC
                            DSlabFareCalcStrategy objD = new DSlabFareCalcStrategy();
                            fareAmount = objD.CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dr["Distance"].ToString().Trim()), dr["Travel_Mode"].ToString().Trim(),entity,sumDistance);

                            totalFare += fareAmount;
                        }
                        #endregion Sum distance No
                    }
                }
                #endregion DFC Calculation

            }


            return totalFare;
        }
    }
}