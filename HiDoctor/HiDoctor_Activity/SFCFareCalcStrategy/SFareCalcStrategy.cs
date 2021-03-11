using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace HiDoctor_Activity.SFCFareCalcStrategy
{
    public class SFareCalcStrategy : ISFCFareCalculator
    {
        public double CalculateSFCFare(Models.FareCalculationDTO fareCalcPassed)
        {
            try
            {
                double totalFare = 0.0;
                string hopNeed = fareCalcPassed.IntermediatePlace;
                string entity = fareCalcPassed.Entity;
                string dcrCode = fareCalcPassed.DcrCode;
                string dcrDate = fareCalcPassed.DcrDate;
                string dcrFlag = fareCalcPassed.DcrFalg;

                Controllers.MasterController objMaster = new Controllers.MasterController();
                DataControl.CurrentInfo objCurr = new DataControl.CurrentInfo();
                DataControl.Data objData = new DataControl.Data();

                string companyCode = objCurr.GetCompanyCode();
                string userCode = objCurr.GetUserCode();
                string regionCode = objCurr.GetRegionCode();                

                if (entity == "HQ" )
                {
                    DataSet dsHop = new DataSet();

                    objData.OpenConnection(companyCode);
                    {
                        dsHop = objData.ExecuteDataSet("exec SP_hdGetHopPlaces '" + companyCode + "','" + dcrCode + "','" + userCode + "','" + dcrDate + "','" + dcrFlag + "'");
                    }
                    objData.CloseConnection();

                    if (dsHop.Tables[0].Rows.Count > 0)
                    {
                        try
                        {
                            objData.OpenConnection(companyCode);
                            {
                                totalFare = Convert.ToDouble(objData.ExecuteScalar("exec SP_hdGetSFCAmount '" + companyCode + "','" + dsHop.Tables[0].Rows[0]["SFC_Region_Code"].ToString().Trim() + "','" + dsHop.Tables[0].Rows[0]["From_Place"].ToString().Trim() + "','" + dsHop.Tables[0].Rows[0]["To_Place"].ToString().Trim() + "','" + dsHop.Tables[0].Rows[0]["SFC_Category_Name"].ToString().Trim() + "','" + dsHop.Tables[0].Rows[0]["Travel_Mode"].ToString().Trim() + "','" + dcrDate + "','" + userCode + "','" + regionCode + "','" + entity + "'"));
                            }
                            objData.CloseConnection();
                        }
                        catch
                        {
                            totalFare = 0.0;
                        }
                    }
                }
                else
                {
                    DataSet dsTravelPlace = new DataSet();
                    double fareAmount = 0.0;
                    double travelDistance = 0.0;

                    dsTravelPlace = objMaster.GetTrvelPlace(companyCode, dcrCode, dcrFlag, userCode, dcrDate);

                    if (dsTravelPlace.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in dsTravelPlace.Tables[0].Rows)
                        {
                            travelDistance = Convert.ToDouble(dr["Distance"].ToString().Trim());
                            try
                            {
                                objData.OpenConnection(companyCode);
                                {
                                    fareAmount = Convert.ToDouble(objData.ExecuteScalar("exec SP_hdGetSFCAmount '" + companyCode + "','" + dr["SFC_Region_Code"].ToString().Trim() + "','" + dr["From_Place"].ToString().Trim() + "','" + dr["To_Place"].ToString().Trim() + "','" + dr["SFC_Category_Name"].ToString().Trim() + "','" + dr["Travel_Mode"].ToString().Trim() + "','" + dcrDate + "','" + userCode + "','" + regionCode + "','" + entity + "'"));
                                }
                                objData.CloseConnection();
                            }
                            catch
                            {
                                fareAmount = 0.0;
                            }
                            totalFare += fareAmount;
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