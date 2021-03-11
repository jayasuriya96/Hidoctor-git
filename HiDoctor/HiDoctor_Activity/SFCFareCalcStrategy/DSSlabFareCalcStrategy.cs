using System;
using System.Web;
using System.Data;
using System.Linq;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class DSSlabFareCalcStrategy : ISFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            double totalFare = 0.0;
            if (fareCalcPassed.DCR_Version == "DCR V3")
            {
                #region DCRV3
                // for DFC
                DSlabFareCalcStrategy objDSLAB = new DSlabFareCalcStrategy();
                totalFare = objDSLAB.CalculateSFCFare(fareCalcPassed);

                if (totalFare == 0.0)// for SFC
                {
                    SFareCalcStrategy objS = new SFareCalcStrategy();
                    totalFare = objS.CalculateSFCFare(fareCalcPassed);
                }
                #endregion DCRV3
            }
            else
            {
                #region DCRV4
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

                //seperate SFC and DFC
                if (dsTravelPlace != null && dsTravelPlace.Tables.Count > 0 && dsTravelPlace.Tables[0].Rows.Count > 0)
                {
                    if (fareCalcPassed.Sum_Distance_Needed == "Y")
                    {
                        #region Sum Distance Yes
                        var distanceTvlMode = from row in dsTravelPlace.Tables[0].AsEnumerable()
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
                            fareAmount = objD.CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dist.Distance), dist.Travel_Mode.ToString().Trim(), entity, sumDistance);

                            if (fareAmount == 0.0)
                            {
                                // for SFC
                                DataRow[] drrRows;
                                drrRows = dsTravelPlace.Tables[0].Select("Travel_Mode='" + dist.Travel_Mode.ToString() + "'");
                                foreach (var drr in drrRows)
                                {
                                    fareAmount += objBL.GetSFCFare(companyCode, drr["From_Place"].ToString().Trim(), drr["To_Place"].ToString().Trim(), drr["SFC_Region_Code"].ToString().Trim(), drr["SFC_Category_Name"].ToString().Trim(), drr["Travel_Mode"].ToString().Trim(), fareCalcPassed.DcrDate);
                                }

                            }
                            totalFare += fareAmount;
                        }
                        #endregion Sum Distance Yes
                    }
                    else
                    {
                        #region Sum distance No
                        foreach (DataRow dr in dsTravelPlace.Tables[0].Rows)
                        {
                            double fareAmount = 0.0;
                            // for DFC
                            DSlabFareCalcStrategy objD = new DSlabFareCalcStrategy();
                            fareAmount = objD.CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dr["Distance"].ToString().Trim()), dr["Travel_Mode"].ToString().Trim(), entity, sumDistance);

                            if (fareAmount == 0.0)
                            {
                                // for SFC
                                fareAmount += objBL.GetSFCFare(companyCode, dr["From_Place"].ToString().Trim(), dr["To_Place"].ToString().Trim(), dr["SFC_Region_Code"].ToString().Trim(), dr["SFC_Category_Name"].ToString().Trim(), dr["Travel_Mode"].ToString().Trim(), fareCalcPassed.DcrDate);
                            }

                            totalFare += fareAmount;
                        }
                        #endregion Sum distance No
                    }
                }
                #endregion DCRV4
            }
            return totalFare;
        }
    }
}