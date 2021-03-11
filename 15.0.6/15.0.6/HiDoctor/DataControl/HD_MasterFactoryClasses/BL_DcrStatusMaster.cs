using MVCModels.HiDoctor_Master;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HD_MasterFactoryClasses
{
    public class BL_DcrStatusMaster
    {
        DAL_DcrStatusMaster _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
        CurrentInfo _objCurrentInfo = new CurrentInfo();

        private string GetCompanyCode()
        {
            string companyCode = _objCurrentInfo.GetCompanyCode();
            return companyCode;
        }
        
        public List<MVCModels.HiDoctor_Master.DivisionModel> GetAllDivisions(string companyCode)
        {
            _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
            return _objDALDcrStatusMaster.GetAllDivisions(companyCode);
        }

        public List<MVCModels.HiDoctor_Master.DCRStatusModel> GetDcrStatusDetails(string DivisionCode, string Usertypecode, string Status, string Catagory)
        {
            _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
            return _objDALDcrStatusMaster.GetDcrStatusDetails(DivisionCode, Usertypecode, Status, Catagory);
        }

        public int UpdateRecordStatus(string DivisionCode, string Usertypecode, string Status, string Catagory, string Statusname, int Recstatus)
        {
            int result = 0;
            result = _objDALDcrStatusMaster.UpdateRecordStatus(DivisionCode, Usertypecode, Status, Catagory, Statusname, Recstatus);
            return result;
        }

        public int AddNewStatus(string companyCode, string username, string Usertype, string Division, string Status, string Catagory, string NewStatus)
        {
            int result = 0;
            result = _objDALDcrStatusMaster.AddNewStatus(companyCode, username, Usertype, Division, Status, Catagory, NewStatus);
            return result;
        }

        public IEnumerable<MVCModels.HiDoctor_Master.UserTypeModel> GetUnderUserTypes(string companyCode, string userCode)
        {
            _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
            return _objDALDcrStatusMaster.GetUnderUserTypes(companyCode, userCode);
        }

        public List<MVCModels.HiDoctor_Master.MappedRegionModel> GetMappedRegion()
        {
            _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
            return _objDALDcrStatusMaster.GetMappedRegion();
        }

        public List<MVCModels.HiDoctor_Master.MappedRegionModel> GetMappedHospRegion()
        {
            _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
            return _objDALDcrStatusMaster.GetMappedHospRegion();
        }

        public List<MVCModels.HiDoctor_Master.MappedRegionModel> GetMappedHospRegionField()
        {
            _objDALDcrStatusMaster = new DAL_DcrStatusMaster();
            return _objDALDcrStatusMaster.GetMappedHospRegionField();
        }
        public bool InsertMappedRegions(List<DCRRegionModel> lstRegions, string UserName)
        {
            bool result = false;
           
            DataTable dtRegCodes = null;
            if (lstRegions.Count >= 1)
            {
                dtRegCodes = new DataTable();
                dtRegCodes.Columns.Add("Id", typeof(int));
                dtRegCodes.Columns.Add("User_Name", typeof(string));
                dtRegCodes.Columns.Add("Regioncodes", typeof(string));
                int id = 0;
                for (int i = 0; i < lstRegions.Count; i++)
                {
                    id++;
                    dtRegCodes.Rows.Add(id,UserName, lstRegions[i].Region_Code);
                }
            }
            result = _objDALDcrStatusMaster.InsertMappedRegions(dtRegCodes, UserName);
            //result = _objDALLeave.AddNewLeaveType(companyCode, UserName, NewLeaveType, userTypeCode, dtUserCodes);
            return result;
        }
        public bool InsertMappedHospitalRegions(List<DCRRegionModel> lstRegions, string UserName)
        {
            bool result = false;

            DataTable dtRegCodes = null;
            if (lstRegions.Count >= 1)
            {
                dtRegCodes = new DataTable();
                dtRegCodes.Columns.Add("Id", typeof(int));
                dtRegCodes.Columns.Add("User_Name", typeof(string));
                dtRegCodes.Columns.Add("Regioncodes", typeof(string));
                int id = 0;
                for (int i = 0; i < lstRegions.Count; i++)
                {
                    id++;
                    dtRegCodes.Rows.Add(id, UserName, lstRegions[i].Region_Code);
                }
            }
            result = _objDALDcrStatusMaster.InsertMappedHospitalRegions(dtRegCodes, UserName);
            //result = _objDALLeave.AddNewLeaveType(companyCode, UserName, NewLeaveType, userTypeCode, dtUserCodes);
            return result;
        }

        public int UnmapRegions(string Regioncode, string UserName)
        {
            int result = 0;
            result = _objDALDcrStatusMaster.UnmapRegions(Regioncode, UserName);
            return result;
        }

        public int UnMapHospitalRegions(string Regioncode, string UserName)
        {
            int result = 0;
            result = _objDALDcrStatusMaster.UnMapHospitalRegions(Regioncode, UserName);
            return result;
        }
        ///DcrStatusMaster for HospitalField/////
        public bool InsertMappedHospitalRegionsField(List<DCRRegionModel> lstRegions, string UserName)
        {
            bool result = false;

            DataTable dtRegCodes = null;
            if (lstRegions.Count >= 1)
            {
                dtRegCodes = new DataTable();
                dtRegCodes.Columns.Add("Id", typeof(int));
                dtRegCodes.Columns.Add("User_Name", typeof(string));
                dtRegCodes.Columns.Add("Regioncodes", typeof(string));
                int id = 0;
                for (int i = 0; i < lstRegions.Count; i++)
                {
                    id++;
                    dtRegCodes.Rows.Add(id, UserName, lstRegions[i].Region_Code);
                }
            }
            result = _objDALDcrStatusMaster.InsertMappedHospitalRegionsField(dtRegCodes, UserName);
            //result = _objDALLeave.AddNewLeaveType(companyCode, UserName, NewLeaveType, userTypeCode, dtUserCodes);
            return result;
        }

        public int UnMapHospitalRegionsField(string Regioncode, string UserName)
        {
            int result = 0;
            result = _objDALDcrStatusMaster.UnMapHospitalRegionsField(Regioncode, UserName);
            return result;
        }
    }
}
