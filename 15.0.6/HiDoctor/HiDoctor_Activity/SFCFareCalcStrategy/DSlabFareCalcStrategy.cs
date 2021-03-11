using System;
using System.Web;
using System.Data;
using System.Linq;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class DSlabFareCalcStrategy : ISFCFareCalculator, IDFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            try
            {
                string hopNeed = fareCalcPassed.IntermediatePlace;
                string entity = fareCalcPassed.Entity;
                string dcrCode = fareCalcPassed.DcrCode;
                string dcrDate = fareCalcPassed.DcrDate;
                string dcrFlag = fareCalcPassed.DcrFalg;
                double travelDistance = fareCalcPassed.TravelKm;
                string sumDistance = fareCalcPassed.Sum_Distance_Needed;

                Controllers.MasterController objMaster = new Controllers.MasterController();
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                DataControl.Data objData = new DataControl.Data();

                double totalFare = 0.0;
                double fromKm = 0.0;
                double toKm = 0.0;
                double fare = 0.0;
                double total = 0.0;

                string companyCode = objCurr.GetCompanyCode();
                string userTypeCode = objCurr.GetUserTypeCode();
                string userCode = objCurr.GetUserCode();

                int j = 0;

                DataSet dsDistanceMatrix = new DataSet();
                DataSet dsTravelPlace = new DataSet();
                if (fareCalcPassed.DCR_Version == "DCR V3")
                {
                    #region DCRV3
                    dsDistanceMatrix = objMaster.GetDistanceMatrix(companyCode, userTypeCode, entity);

                    if (dsDistanceMatrix.Tables[0].Rows.Count > 0)
                    {
                        //This is to calculate Fare for single travel distance (HQ or Intermediate place='NO' for other category) and for sum distance yes
                        if (entity.Trim().ToUpper() == "HQ" || hopNeed.Trim().ToUpper() == "NO" || sumDistance == "Y")
                        {
                            for (int index = 0; index < dsDistanceMatrix.Tables[0].Rows.Count; index++)
                            {
                                fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["From_Km"].ToString().Trim());
                                toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["To_Km"].ToString().Trim());

                                if (travelDistance >= fromKm && travelDistance <= toKm)
                                {
                                    fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["Fare_Amount"].ToString().Trim());
                                    total = travelDistance * fare;
                                    totalFare = total;
                                }
                            }
                        }

                        else if (hopNeed.Trim().ToUpper() == "YES")
                        {
                            dsTravelPlace = objMaster.GetTrvelPlace(companyCode, dcrCode, dcrFlag, userCode, dcrDate);
                            if (dsTravelPlace.Tables[0].Rows.Count > 0)
                            {
                                for (int index = 0; index < dsDistanceMatrix.Tables[0].Rows.Count; index++)
                                {
                                    fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["From_Km"].ToString().Trim());
                                    toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["To_Km"].ToString().Trim());
                                    for (j = 0; j <= dsTravelPlace.Tables[0].Rows.Count - 1; j++)
                                    {
                                        travelDistance = Convert.ToDouble(dsTravelPlace.Tables[0].Rows[j]["Distance"].ToString().Trim());
                                        if (travelDistance >= fromKm && travelDistance <= toKm)
                                        {
                                            fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["Fare_Amount"].ToString().Trim());
                                            total = travelDistance * fare;
                                            totalFare += total;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion DCRV3
                }

                   // dcr v4 calcuation - included travel mode in distance matrix
                else
                {
                    #region dcrv4
                    // travelled place ds based on (category check, intermediated place privilege check)
                    DataControl.BL_DCRStockiestExpense objBL = new DataControl.BL_DCRStockiestExpense();
                    dsTravelPlace = objBL.GetDCRTravelledPlacesForFareCalculation(companyCode, dcrCode, dcrFlag, entity);
                    // Call new class
                    if (dsTravelPlace.Tables[0].Rows.Count > 0)
                    {
                        if (sumDistance != "Y")
                        {
                            for (j = 0; j <= dsTravelPlace.Tables[0].Rows.Count - 1; j++)
                            {
                                totalFare += CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dsTravelPlace.Tables[0].Rows[j]["Distance"].ToString().Trim()), dsTravelPlace.Tables[0].Rows[j]["Travel_Mode"].ToString().Trim(), entity, sumDistance);
                            }
                        }
                        else
                        {
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
                                totalFare += CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dist.Distance), dist.Travel_Mode.ToString(), entity, sumDistance);
                            }
                        }
                    }
                    #endregion dcrv4
                }
                return totalFare;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed, double distance, string travelmode, string entity, string sumDistance)
        {
            double totalFare = 0.0;
            DataControl.BL_DCRStockiestExpense objExp = new DataControl.BL_DCRStockiestExpense();
            DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
            DataSet dsDistanceMatrix = new DataSet();

            string companyCode = objCurr.GetCompanyCode();
            string userTypeCode = objCurr.GetUserTypeCode();
            double fromKm = 0.0;
            double toKm = 0.0;
            double fare = 0.0;
            double total = 0.0;
            int j = 0;

            dsDistanceMatrix = objExp.GetDistanceMatrixForFareCalculation(companyCode, userTypeCode, fareCalcPassed.Entity, travelmode, fareCalcPassed.DcrDate);
            if (dsDistanceMatrix.Tables[0].Rows.Count > 0)
            {
                for (int index = 0; index < dsDistanceMatrix.Tables[0].Rows.Count; index++)
                {
                    fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["From_Km"].ToString().Trim());
                    toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["To_Km"].ToString().Trim());

                    if (distance >= fromKm && distance <= toKm)
                    {
                        fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[index]["Fare_Amount"].ToString().Trim());
                        total = distance * fare;
                        totalFare += total;
                    }
                }
            }

            return totalFare;
        }
    }


}