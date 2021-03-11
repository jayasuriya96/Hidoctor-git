using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl
{
    public class BLWeekendGroup
    {
        DALWeekendGroup _dalWeekendGroup = new DALWeekendGroup();
        private StringBuilder _fileNameString = new StringBuilder();



        public List<MVCModels.HiDoctor_Master.WeekendGroup> GetWeekendGroupHeader()
        {
            return _dalWeekendGroup.GetWeekendGroupHeader();
        }
        public string RegionWeekendGroupMapping(string weekendoffCode, string regionCodes, string effectiveFrom, string effectiveTo, string status)
        {
            string result = "";
            string[] regioncode = regionCodes.Split(',');
            string overlappedRegions = string.Empty;
            string finalResult = "";
            if (regioncode.Length > 0)
            {
                foreach (string regions in regioncode)
                {
                    result = _dalWeekendGroup.RegionWeekendGroupMapping(weekendoffCode, regions, effectiveFrom, effectiveTo, status);
                    if (result == "Overlap")
                    {
                        overlappedRegions += regions + '^';
                    }
                    if (result == "SUCCESS" && finalResult == "")
                    {
                        finalResult = result;
                    }
                }

                if (finalResult == "")
                {
                    finalResult = "Overlap";
                }
            }
            return finalResult + '_' + overlappedRegions;
        }


        public List<MVCModels.HiDoctor_Master.WeekendGroup> GetMappingGroupHeader(string RegionCodes)
        {
            return _dalWeekendGroup.GetMappingGroupHeader(RegionCodes);
        }


        public string RegionWeekendGroupMappingUpdate(string weekendOffCode, string regionCode, string effectiveFrom, string effectiveto, string status, string oldeffectiveFrom, string oldeffectiveto)
        {
            string result = "";
            result = _dalWeekendGroup.RegionWeekendGroupMappingUpdate(weekendOffCode, regionCode, effectiveFrom, effectiveto, status, oldeffectiveFrom, oldeffectiveto);
            return result;

        }

    }
}
