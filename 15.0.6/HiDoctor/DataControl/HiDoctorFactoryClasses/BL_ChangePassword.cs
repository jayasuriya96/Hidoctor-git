using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataControl.HiDoctorFactoryClasses
{
    public class BL_ChangePassword
    {
        DAL_ChangePassword _objDALChangePass = new DAL_ChangePassword();

        public IEnumerable<MVCModels.PasswordHistory> GetPasswordHistory(string companyCode, string userCode, string historyCount)
        {
            return _objDALChangePass.GetPasswordHistory(companyCode, userCode, historyCount);
        }

        public bool UpdatePassword(string companyCode, string userCode, string userName, string oldPassword, string newPassword, string confirmPassword, out string outputMsg)
        {
            outputMsg = string.Empty;

            CurrentInfo objCurInfo = new CurrentInfo();
            string strOldPassword = oldPassword;
            string strNewPassword = newPassword;
            string strConfirmPassword = confirmPassword;
            DataSet dsExistpassword = new DataSet();
            ArrayList alPasswords = new ArrayList();
            string successMsg = "";
            bool blStatus;
            bool result = false;

            string passwordpolicy = objCurInfo.GetPrivilegeValue("PASSWORD_POLICY", "NO");
            string changeFirstTimePassword = objCurInfo.GetPrivilegeValue("CHANGE_FIRSTTIME_PASSWORD", "NO");
            string passwordHistoryCount = objCurInfo.GetPrivilegeValue("PASSWORD_HISTORY_COUNT", "0");


            if (_objDALChangePass.CheckOldPassWord(companyCode, userName: userName, userPass: oldPassword))
            {
                if (strNewPassword.ToUpper() == "HIDOCTOR" && changeFirstTimePassword == "YES")// User should not have hidoctor as a password.
                {
                    outputMsg = "You should not use 'hidoctor' as a password. Please try someother password.";
                }
                if (passwordpolicy.ToUpper() == "YES")
                {
                    if (passwordHistoryCount == "0" || passwordHistoryCount == "")
                    {
                        blStatus = _objDALChangePass.InsertUserMasterHistory(companyCode, userCode: userCode);
                        if (blStatus)
                        {
                            blStatus = _objDALChangePass.UpdatePassword(companyCode, userCode: userCode, userPass: newPassword, userName: userName);
                            if (blStatus)
                            {
                                outputMsg = "Password has been updated";
                                result = true;
                            }
                            else
                            {
                                outputMsg = "Error on update";
                            }
                        }
                    }
                    else
                    {
                        IEnumerable<MVCModels.PasswordHistory> iePassHis = GetPasswordHistory(companyCode, userCode, passwordHistoryCount);
                        foreach (MVCModels.PasswordHistory objPassHis in iePassHis)
                        {
                            alPasswords.Add(objPassHis.User_Pass);
                        }
                        if (!alPasswords.Contains(strNewPassword))
                        {
                            blStatus = _objDALChangePass.InsertUserMasterHistory(companyCode: companyCode, userCode: userCode);
                            if (blStatus)
                            {
                                blStatus = _objDALChangePass.UpdatePassword(companyCode: companyCode, userCode: userCode, userPass: newPassword, userName: userName);
                                if (blStatus)
                                {
                                    //AssignExisitingPassword();
                                    outputMsg = "Password has been updated";
                                    result = true;
                                }
                                else
                                {
                                    outputMsg = "Error on update";
                                }
                            }
                        }
                        else
                        {
                            outputMsg = "Your Password Is Matched With Last " + alPasswords.Count.ToString() + " Passwords Please Try New One";
                        }
                    }
                }

                else
                {
                    blStatus = _objDALChangePass.InsertUserMasterHistory(companyCode: companyCode, userCode: userCode);
                    if (blStatus)
                    {
                        blStatus = _objDALChangePass.UpdatePassword(companyCode: companyCode, userCode: userCode, userPass: newPassword, userName: userName);
                        if (blStatus)
                        {
                            outputMsg = "Password has been updated";
                            result = true;
                        }
                        else
                        {
                            outputMsg = "Error on update";
                        }
                    }              
                }
            }
            else
            {
                outputMsg = "Old Password is incorrect";
            }

            return result;
        }

        public int InsertVisitedScreen(string companyCode, string menuId, string userCode, string dateTime)
        {
            return _objDALChangePass.InsertVisitedScreen(companyCode, menuId, userCode, dateTime);
        }
    }
}
