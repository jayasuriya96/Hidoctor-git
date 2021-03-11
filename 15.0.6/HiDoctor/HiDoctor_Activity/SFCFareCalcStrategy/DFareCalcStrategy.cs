using System;
using System.Data;
using System.Web;
using System.Linq;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class DFareCalcStrategy : ISFCFareCalculator, IDFCFareCalculator
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
                    #region DCRv3

                    dsDistanceMatrix = objMaster.GetDistanceMatrix(companyCode, userTypeCode, entity);

                    if (dsDistanceMatrix.Tables[0].Rows.Count > 0)
                    {
                        total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0][1].ToString()) * Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0][2].ToString());
                        dsDistanceMatrix.Tables[0].Rows[0]["Fare"] = total.ToString();
                        dsDistanceMatrix.Tables[0].AcceptChanges();
                        total = 0.0;

                        // This For loop is to calculate total
                        for (j = 1; j <= dsDistanceMatrix.Tables[0].Rows.Count - 1; j++)
                        {
                            // ((70-30)*1.75)+60 = 130
                            fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j - 1]["To_Km"].ToString());
                            // from km=30
                            toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j]["To_Km"].ToString());
                            // to km=70
                            fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j]["Fare_Amount"].ToString());
                            // amount for this limit =1.75
                            total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j - 1]["Fare"].ToString());
                            // total of previous limit = 60
                            total = ((toKm - fromKm) * fare) + total;
                            // total of current limit = 130
                            dsDistanceMatrix.Tables[0].Rows[j]["Fare"] = total.ToString();
                            dsDistanceMatrix.Tables[0].AcceptChanges();
                        }

                        fromKm = 0.0;
                        toKm = 0.0;
                        fare = 0.0;
                        total = 0.0;

                        //This is to calculate Fare for single travel distance (HQ or Intermediate place='NO' for other category) and for sum distance yes
                        if (entity.Trim().ToUpper() == "HQ" || sumDistance == "Y")
                        {
                            for (int k = 0; k <= dsDistanceMatrix.Tables[0].Rows.Count - 1; k++)
                            {
                                // If this DataSet has more than 1 row, Intermediate palces entry has gone
                                // ((66-30)*1.75)+60 = 123
                                fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["From_Km"].ToString().Trim());
                                toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["To_Km"].ToString().Trim());

                                if (travelDistance >= fromKm && travelDistance <= toKm)
                                {
                                    if (k != 0)
                                    {
                                        fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["Fare_Amount"].ToString().Trim());
                                        // 1.75
                                        toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k - 1]["To_Km"].ToString().Trim());
                                        // 30
                                        total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k - 1]["Fare"].ToString().Trim());
                                        // 60
                                        total = ((travelDistance - toKm) * fare) + total;
                                        // 123
                                        totalFare = total;
                                        break;
                                    }
                                    else
                                    {
                                        if (dsDistanceMatrix.Tables[0].Rows[0]["Is_Amount_Fixed"].ToString().Trim() == "1")
                                        {
                                            travelDistance = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["To_Km"].ToString().Trim());
                                        }

                                        fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["Fare_Amount"].ToString().Trim());
                                        total = travelDistance * fare;
                                        totalFare = total;
                                        break;
                                    }
                                }
                            }
                        }

                        else 
                        {
                            dsTravelPlace = objMaster.GetTrvelPlace(companyCode, dcrCode, dcrFlag, userCode, dcrDate);
                            if (dsTravelPlace.Tables[0].Rows.Count > 0)
                            {
                                for (j = 0; j <= dsTravelPlace.Tables[0].Rows.Count - 1; j++)
                                {
                                    travelDistance = Convert.ToDouble(dsTravelPlace.Tables[0].Rows[j]["Distance"].ToString().Trim());

                                    for (int k = 0; k <= dsDistanceMatrix.Tables[0].Rows.Count - 1; k++)
                                    {
                                        // ((66-30)*1.75)+60 = 123
                                        fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["From_Km"].ToString().Trim());
                                        toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["To_Km"].ToString().Trim());

                                        if (travelDistance >= fromKm && travelDistance <= toKm)
                                        {
                                            if (k != 0)
                                            {
                                                fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["Fare_Amount"].ToString().Trim());
                                                // 1.75
                                                toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k - 1]["To_Km"].ToString().Trim());
                                                // 30
                                                total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k - 1]["Fare"].ToString().Trim());
                                                // 60
                                                total = ((travelDistance - toKm) * fare) + total;
                                                // 123
                                                totalFare += total;
                                                break;
                                            }
                                            else
                                            {
                                                fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["Fare_Amount"].ToString().Trim());
                                                total = travelDistance * fare;
                                                totalFare += total;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion DCRv3
                }

                    // dcr v4 calcuation - included travel mode in distance matrix
                else
                {
                    #region DCRV4
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
                                totalFare += CalculateSFCFare(fareCalcPassed, Convert.ToDouble(dsTravelPlace.Tables[0].Rows[j]["Distance"].ToString().Trim()), dsTravelPlace.Tables[0].Rows[j]["Travel_Mode"].ToString().Trim(), entity,  sumDistance);
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
                    #endregion DCRV4
                }
                return totalFare;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed, double distance, string travelmode,string entity, string sumDistance)
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
                total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0][1].ToString()) * Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0][2].ToString());
                dsDistanceMatrix.Tables[0].Rows[0]["Fare"] = total.ToString();
                dsDistanceMatrix.Tables[0].AcceptChanges();
                total = 0.0;

                // This For loop is to calculate total
                for (j = 1; j <= dsDistanceMatrix.Tables[0].Rows.Count - 1; j++)
                {
                    // ((70-30)*1.75)+60 = 130
                    fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j - 1]["To_Km"].ToString());
                    // from km=30
                    toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j]["To_Km"].ToString());
                    // to km=70
                    fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j]["Fare_Amount"].ToString());
                    // amount for this limit =1.75
                    total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[j - 1]["Fare"].ToString());
                    // total of previous limit = 60
                    total = ((toKm - fromKm) * fare) + total;
                    // total of current limit = 130
                    dsDistanceMatrix.Tables[0].Rows[j]["Fare"] = total.ToString();
                    dsDistanceMatrix.Tables[0].AcceptChanges();
                }
            }

            // fare calculation           

            for (int k = 0; k <= dsDistanceMatrix.Tables[0].Rows.Count - 1; k++)
            {
                // ((66-30)*1.75)+60 = 123
                fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["From_Km"].ToString().Trim());
                toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["To_Km"].ToString().Trim());

                if (distance >= fromKm && distance <= toKm)
                {
                    if (k != 0)
                    {
                        fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k]["Fare_Amount"].ToString().Trim());
                        // 1.75
                        toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k - 1]["To_Km"].ToString().Trim());
                        // 30
                        total = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[k - 1]["Fare"].ToString().Trim());
                        // 60
                        total = ((distance - toKm) * fare) + total;
                        // 123
                        totalFare += total;
                        break;
                    }
                    else
                    {
                        if (entity.Trim().ToUpper() == "HQ")
                        {
                            if (dsDistanceMatrix.Tables[0].Rows[0]["Is_Amount_Fixed"].ToString().Trim() == "1")
                            {
                                distance = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["To_Km"].ToString().Trim());
                            }
                        }
                        fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["Fare_Amount"].ToString().Trim());
                        total = distance * fare;
                        totalFare += total;
                        break;
                    }
                }
            }

            return totalFare;
        }
    }
}