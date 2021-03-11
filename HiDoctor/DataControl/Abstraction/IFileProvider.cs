using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataControl.Abstraction
{
    public interface IFileProvider
    {
        string GetFilePathToSave(string FileStorageKeyName, string fileName);
        string GetOnlyFilePath(string FileStorageKeyName);
        void UploadFileDelete(string FileStorageKeyName, string fileName);
        string GetConfigValue(string key);
    }
}
