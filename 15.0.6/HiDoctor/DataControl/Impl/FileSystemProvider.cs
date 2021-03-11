using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DataControl.Abstraction;
using System.Configuration;

namespace DataControl.Impl
{
    public class FileSystemProvider : IFileProvider
    {

        public string GetFilePathToSave(string FileStorageKeyName, string fileName)
        {
            string path = ConfigurationManager.AppSettings[FileStorageKeyName].ToString();
            string FilepathToSave = path+fileName;
            return FilepathToSave;
        }

        public string GetOnlyFilePath(string FileStorageKeyName)
        {
            string path = ConfigurationManager.AppSettings[FileStorageKeyName].ToString();
            return path;
        }


        public void UploadFileDelete(string FileStorageKeyName, string fileName)
        {
            string pathWithFileName = GetOnlyFilePath(FileStorageKeyName)+fileName;

            if (System.IO.File.Exists(pathWithFileName))
            {
                System.IO.File.Delete(pathWithFileName);
            }
        }
        public string GetConfigValue(string key)
        {
            string path = ConfigurationManager.AppSettings[key].ToString();
            return path;
        }

    }
}
