//using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.RetryPolicies;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.StorageClient;
using Microsoft.WindowsAzure;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Data;
using Excel;

namespace DataControl.Repository
{
    public class AzureBlobUpload
    {      

        /// <summary>
        /// Files Upload The Azure Blobs
        /// </summary>
        /// <param name="rdfile">inputfile</param>
        /// <param name="filename">inputfilename</param>
        /// <param name="accountKey">azureAccout key</param>
        /// <param name="companyCode">session company code</param>
        /// <returns></returns>
        public string PutAzureBlobStorage(System.IO.Stream stream, string filename, string accountKey, string containerName)
        {
            try
            {
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(accountKey);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                //Important to set lower case else azure will complain
                CloudBlobContainer blobContainer = blobClient.GetContainerReference(containerName.ToLower());
                blobContainer.CreateIfNotExist();

                blobContainer.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                CloudBlob blob = blobContainer.GetBlobReference(filename);

                blob.UploadFromStream(stream);
                return blob.Uri.AbsoluteUri.ToString();
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        /// <summary>
        /// Download the file from Azure Blobs 
        /// </summary>
        /// <param name="filename">inputfilename</param>
        /// <param name="accountKey">azureAccout Key</param>
        /// <param name="companyCode">session company code</param>
        /// <returns></returns>
        ///   
        public Stream AzureblockDownload(string filename, string accountKey, string containerName)
        {
            MemoryStream ms = new MemoryStream();
            try
            {
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(accountKey);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer blobContainer = blobClient.GetContainerReference(containerName.ToLower());
                CloudBlob blob = blobContainer.GetBlobReference(filename);
                blob.DownloadToStream(ms);
                return ms;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                //ms.Dispose();
            }

        }
        public string AzureBlobUploadText(string content, string accKey, string filename, string containerName)
        {
            try
            {
                CloudStorageAccount storageAccount =
                  CloudStorageAccount.Parse(accKey);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                //Important to set lower case else azure will complain
                CloudBlobContainer blobContainer = blobClient.GetContainerReference(containerName.ToLower());

                blobContainer.CreateIfNotExist();

                blobContainer.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                CloudBlob blob = blobContainer.GetBlobReference(filename);
                blob.UploadText(content);
                return blob.Uri.AbsoluteUri.ToString();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public DataTable ConvertStreamToDataTable(System.IO.Stream stream, string filterColumnName)
        {
            DataTable dt = new DataTable();
            try
            {
               // IExcelDataReader excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
                IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                excelReader.IsFirstRowAsColumnNames = true;
                excelReader.GetType();

                if (excelReader.IsValid)
                {
                    DataSet ds = new DataSet();
                    try
                    {
                        ds = excelReader.AsDataSet(true);
                    }
                    catch
                    {
                        throw;
                    }
                    DataSet dsNew = new DataSet();
                    dsNew = ds.Clone();
                    ds.Tables[0].AsEnumerable().Where(c => c[filterColumnName].ToString() != String.Empty).CopyToDataTable(dsNew.Tables[0], LoadOption.OverwriteChanges);
                    dsNew.Tables[0].AcceptChanges();
                    stream.Dispose();
                    dt = dsNew.Tables[0];

                }
            }
            catch(Exception Ex)
            {
                stream.Dispose();
                throw;
            }
            return dt;
        }

        public DataTable ConvertStreamToDataTablePayslip(System.IO.Stream stream, string filterColumnName, string fileexten)
        {
            DataTable dt = new DataTable();
            try
            {


                if (fileexten == "xls")
                {
                    IExcelDataReader excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
                    excelReader.IsFirstRowAsColumnNames = true;
                    excelReader.GetType();
                    if (excelReader.IsValid)
                    {
                        DataSet ds = new DataSet();
                        try
                        {
                            ds = excelReader.AsDataSet(true);
                        }
                        catch
                        {
                            throw;
                        }
                        DataSet dsNew = new DataSet();
                        dsNew = ds.Clone();
                        ds.Tables[0].AsEnumerable().Where(c => c[filterColumnName].ToString() != String.Empty).CopyToDataTable(dsNew.Tables[0], LoadOption.OverwriteChanges);
                        dsNew.Tables[0].AcceptChanges();
                        stream.Dispose();
                        dt = dsNew.Tables[0];

                    }
                }
                else
                {
                    IExcelDataReader excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                    excelReader.IsFirstRowAsColumnNames = true;
                    excelReader.GetType();
                    if (excelReader.IsValid)
                    {
                        DataSet ds = new DataSet();
                        try
                        {
                            ds = excelReader.AsDataSet(true);
                        }
                        catch
                        {
                            throw;
                        }
                        DataSet dsNew = new DataSet();
                        dsNew = ds.Clone();
                        ds.Tables[0].AsEnumerable().Where(c => c[filterColumnName].ToString() != String.Empty).CopyToDataTable(dsNew.Tables[0], LoadOption.OverwriteChanges);
                        dsNew.Tables[0].AcceptChanges();
                        stream.Dispose();
                        dt = dsNew.Tables[0];

                    }
                }

            }
            catch
            {
                stream.Dispose();
                throw;
            }
            return dt;
        }

        public Microsoft.WindowsAzure.Storage.Blob.CloudBlobContainer GetBlobContainerObject(string containerName, string accKey)
        {

            Microsoft.WindowsAzure.Storage.Blob.CloudBlobContainer container = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(accKey).CreateCloudBlobClient()
                        .GetContainerReference(containerName.ToLower());
            container.CreateIfNotExists();
            container.SetPermissions(
            new Microsoft.WindowsAzure.Storage.Blob.BlobContainerPermissions
            {
                PublicAccess =
                    Microsoft.WindowsAzure.Storage.Blob.BlobContainerPublicAccessType.Container
            });
            return container;
        }


        public string AzureBlopforChunkUpload(System.IO.Stream inputStream, string fileName, string containerName, string accountKey)
        {
            if (fileName != null)
            { 
                Repository.AzureBlobUpload objAzureUpload = new Repository.AzureBlobUpload();

                // string accKey = lstBlob[0].Blob_Access_Key;//iConfigPro.GetConfigValue(lstBlob[0].Blob_Access_Key);
                Microsoft.WindowsAzure.Storage.Blob.CloudBlobContainer container = objAzureUpload.GetBlobContainerObject(containerName, accountKey);
                container.CreateIfNotExists();

                //to replace the file name with new GUID
                //string newfileName = Guid.NewGuid().ToString() + Path.GetExtension(fileName);

                // string newfileName = objBlInfra.GenerateFileName(fileName);

                container.SetPermissions(new Microsoft.WindowsAzure.Storage.Blob.BlobContainerPermissions { PublicAccess = Microsoft.WindowsAzure.Storage.Blob.BlobContainerPublicAccessType.Blob });
                Microsoft.WindowsAzure.Storage.Blob.CloudBlockBlob blob = container.GetBlockBlobReference(fileName);

                int blockSize = 1024 * 1024; //256 kb

                using (Stream fileStream = inputStream)
                {
                    long fileSize = fileStream.Length;

                    //block count is the number of blocks + 1 for the last one
                    int blockCount = (int)((float)fileSize / (float)blockSize) + 1;

                    //List of block ids; the blocks will be committed in the order of this list 
                    List<string> blockIDs = new List<string>();

                    //starting block number - 1
                    int blockNumber = 0;

                    try
                    {
                        int bytesRead = 0; //number of bytes read so far
                        long bytesLeft = fileSize; //number of bytes left to read and upload

                        //do until all of the bytes are uploaded
                        while (bytesLeft > 0)
                        {
                            blockNumber++;
                            int bytesToRead;
                            if (bytesLeft >= blockSize)
                            {
                                //more than one block left, so put up another whole block
                                bytesToRead = blockSize;
                            }
                            else
                            {
                                //less than one block left, read the rest of it
                                bytesToRead = (int)bytesLeft;
                            }

                            //create a blockID from the block number, add it to the block ID list
                            //the block ID is a base64 string
                            string blockId =
                              Convert.ToBase64String(ASCIIEncoding.ASCII.GetBytes(string.Format("BlockId{0}",
                                blockNumber.ToString("0000000"))));
                            blockIDs.Add(blockId);
                            //set up new buffer with the right size, and read that many bytes into it 
                            byte[] bytes = new byte[bytesToRead];
                            fileStream.Read(bytes, 0, bytesToRead);

                            //calculate the MD5 hash of the byte array
                            //string blockHash = GetMD5HashFromStream(bytes);

                            var chunkStream = new MemoryStream(bytes);

                            //upload the block, provide the hash so Azure can verify it
                             blob.PutBlock(blockId, chunkStream, null, null,
                                new Microsoft.WindowsAzure.Storage.Blob.BlobRequestOptions()
                                {
                                    RetryPolicy = new Microsoft.WindowsAzure.Storage.RetryPolicies.LinearRetry(TimeSpan.FromSeconds(10), 3)
                                },
                                null);

                            //increment/decrement counters
                            bytesRead += bytesToRead;
                            bytesLeft -= bytesToRead;
                        }

                        //commit the blocks
                        blob.PutBlockList(blockIDs);

                        return blob.Uri.ToString();
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.Print("Exception thrown = {0}", ex);

                        return null;
                    }
                }

            }
            return null;
        }
    }
}
