using System;
using System.Web;
using System.Data;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class DFlatFareCalcStrategy : ISFCFareCalculator
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

                dsDistanceMatrix = objMaster.GetDistanceMatrix(companyCode, userTypeCode, entity);
                if (dsDistanceMatrix.Tables[0].Rows.Count > 0)
                {
                    fromKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["From_Km"].ToString().Trim());
                    toKm = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["TO_Km"].ToString().Trim());

                    //This is to calculate Fare for single travel distance (HQ or Intermediate place='NO' for other category) and for sum distance yes
                    if (entity.Trim().ToUpper() == "HQ" || sumDistance == "Y")
                    {
                        if (travelDistance >= fromKm && travelDistance <= toKm)
                        {
                            fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["Fare_Amount"].ToString().Trim());
                            total = travelDistance * fare;
                            totalFare = total;
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
                                if (travelDistance >= fromKm && travelDistance <= toKm)
                                {
                                    fare = Convert.ToDouble(dsDistanceMatrix.Tables[0].Rows[0]["Fare_Amount"].ToString().Trim());
                                    total = travelDistance * fare;
                                    totalFare += total;
                                }
                            }
                        }
                    }
                }
                return totalFare;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}