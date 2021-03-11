using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MVCModels.OutputJson;

namespace DataControl.Repository
{
    public abstract class OutputJsonRepositry
    {
        protected const string SUCCESS = "SUCCESS";
        protected const string ERROR = "ERROR";
        protected const int SUCCESS_STATUS = 1;
        protected const int ERROR_STATUS = 0;

        public OutPutJson GenerateOutputJson(string message, object result, int Count, int status)
        {
            OutPutJson outJson = new OutPutJson();

            outJson.Status = status;
            outJson.list = result;
            outJson.Message = message;
            outJson.Count = Count;
            return outJson;
        }
    }
}
