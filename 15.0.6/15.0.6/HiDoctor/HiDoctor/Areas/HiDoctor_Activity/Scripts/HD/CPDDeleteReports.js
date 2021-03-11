var DeleteRpts = {
    defaults: {
        subDomainName: '',
        CompanyId: '',
        UserCode: '',
        RegionCode: '',
        SelectedUser: '',
        LID: '',
        usercount: ''
    },
    fnBack: function (Screen) {
        debugger
        if (Screen == 'DelDates') {
            debugger
            if (navigator.onLine == true) {
                var Userstatus = fnuserstatus();
                debugger
                if (Userstatus) {
                    window.location.href = '../CPD/CPDDeleteReports?LID=' + LID;
                }
                else {
                    swal("Info!", "Your account has been deactivated.", "info");
                }
            }
            else {
                swal("Please connect to the internet", "", "");
                return false;
            }
        }
    },
    GetUserDetails: function () {
        debugger
        DeleteRpts.defaults.subDomainName = subDomainName;
        DeleteRpts.defaults.CompanyId = CompanyId;
        DeleteRpts.defaults.UserCode = LoginUserCode;
        DeleteRpts.defaults.RegionCode = LoginRegionCode;
        DeleteRpts.defaults.LID = LID;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax({
                    type: 'POST',
                    data: 'subDomainName=' + DeleteRpts.defaults.subDomainName + '&CompanyId=' + DeleteRpts.defaults.CompanyId + '&UserCode=' + DeleteRpts.defaults.UserCode,
                    url: '../../HiDoctor_Activity/CPD/GetUserDetails',
                    success: function (flddata) {
                        //Unique Value.
                        //Unique Value.
                        var response = flddata.reduce(function (item, e1) {
                            var matches = item.filter(function (e2)
                            { return e1.User_Name == e2.User_Name });
                            if (matches.length == 0) {
                                item.push(e1);
                            }
                            return item;
                        }, []);

                        if (response.length > 0) {
                            var content = '';
                            var str = '';
                            var str1 = '';
                            var res = '';
                            DeleteRpts.defaults.usercount = response.length;
                            if (response.length == 1 && DeleteRpts.defaults.UserCode == response[0].User_Code) {
                                debugger;
                                DeleteRpts.GetCPDDates(response[0].User_Code, response[0].User_Name, DeleteRpts.defaults.usercount);
                            }
                            else {
                                for (var i = 0; i < response.length; i++) {
                                    str = response[i].Employee_Name;
                                    str1 = str.toLowerCase();
                                    res = str1.substring(0, 1);
                                    content += '<div id="usersrch"><div class="align col-xs-12" style="border-bottom:1px solid #ddd;padding:10px;" onclick="DeleteRpts.GetCPDDates(\'' + response[i].User_Code + '\',\'' + response[i].User_Name + '\',\'' + DeleteRpts.defaults.usercount + '\')">';
                                    content += '<div class="col-xs-2"><span id="Initial">' + res + '</span></div>';
                                    content += '<div class="col-xs-10" style="font-size:12px;margin: 0px;">';
                                    content += '<input id="Usercode_"' + i + ' type="hidden" value="' + response[i].User_Code + '" />';
                                    if (DeleteRpts.defaults.UserCode == response[i].User_Code) {
                                        content += '<p style="font-size: 12px;font-weight: 600;">Mine</p>';
                                    } else {
                                        content += '<p style="font-size: 12px;font-weight: 600;">' + response[i].Employee_Name + '</p>';
                                    }
                                    content += '<p>' + response[i].User_Name + ' | ' + response[i].User_Type_Name + '</p>';
                                    content += '<p>' + response[i].Region_Name + '</p>';
                                    content += '</div></div></div>';
                                }
                                $('#Deluserdet').html(content);
                            }
                            if (response.length > 8) {
                                $('#dvsrch').show();
                            }
                        }
                        else {
                            $('#Deluserdet').html('No Record Found');
                        }
                    }
                })
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    GetCPDDates: function (SelUser, User_Name, usercount) {
        debugger;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                window.location.href = '../CPD/CPDDelDates?User_Code=' + SelUser + '&User_Name=' + User_Name + '&usercount=' + usercount + '&LID=' + DeleteRpts.defaults.LID;
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    fnchildcountcheck: function (subDomainName, LoggedUserCode, UserName, count) {
        debugger
        //$.ajax({
        //    type: 'POST',
        //    data: 'subDomainName=' + subDomainName + '&User_Code=' + LoggedUserCode,
        //    url: '../../HiDoctor_Activity/CPD/GetChildcount',
        //    success: function (response) {
        //        if (count == 1) {
        //            $('#spnback').hide();
        //            $('#dvname').hide();
        //        }
        //        else {
        //            $('#spnback').show();
        //            $('#dvname').show();
        //        }
        //    }
        //})
        if (count == 1) {
            $('#spnback').hide();
            $('#dvname').hide();
        }
        else {
            $('#spnback').show();
            $('#dvname').show();
        }
        FDate = $('#datepicker-1').val();
        TDate = $('#datepicker-2').val();
        var Fromdt = new Date(new Date(FDate.split('/')[2] + '-' + FDate.split('/')[1] + '-' + FDate.split('/')[0]));
        var Todt = new Date(new Date(TDate.split('/')[2] + '-' + TDate.split('/')[1] + '-' + TDate.split('/')[0]));
        if (FDate == '') {
            swal("Please select From Date", "");
            return false;
        }
        if (TDate == '') {
            swal("Please select To Date", "");
            return false;
        }
        if (Fromdt > Todt) {
            swal("To Date should be greater than From Date.", "");
            return false;
        }
        if (true) {
            debugger
            DeleteRpts.GetDelCPDDates(subDomainName, SelUserCode, UserName, FDate, TDate);
        }
    },
    GetDelCPDDates: function (subDomainName, SelUserCode, UserName, FDate, TDate) {
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax({
                    type: 'POST',
                    data: 'subDomainName=' + subDomainName + '&CompanyId=' + CompanyId + '&UserCode=' + SelUserCode + '&FDate=' + FDate + '&TDate=' + TDate,
                    url: '../../HiDoctor_Activity/CPD/GetUserCpdDates',
                    success: function (response) {
                        debugger
                        //var UserName = '';
                        if (response.length > 0) {
                            var content = '';
                            for (var i = 0; i < response.length; i++) {
                                //UserName = response[0].User_Name;
                                var date = response[i].CPD_Date;
                                date = date.replace(/ /g, "-");
                                content += '<div class="rcorners col-xs-12" style="background-color: mediumslateblue;color:white;">';
                                content += '<div class="col-xs-1"><i class="fa fa-calendar-o" aria-hidden="true"></i></div>';
                                content += '<div class="col-xs-7" style="font-size:12px;margin: 0px;">';
                                if (response[i].Activity == 1) {
                                    content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Field</p>';
                                }
                                else if (response[i].Activity == 2) {
                                    content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Attendance</p>';
                                }
                                else if (response[i].Activity == 3) {
                                    content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Non Working Day</p>';
                                }
                                content += '<input id="CPDid_' + i + '" type="hidden" value="' + response[i].CPD_Id + '" />';
                                content += '</div>';
                                content += '<div class="col-xs-3 row" style="font-size: 12px;margin: 0px;padding: 0px;">';
                                content += '<span style="color: white;"><u><a onclick="DeleteRpts.DelCPDDetails(\'' + response[i].CPD_Id + '\',\'Delete\')" style="color: white;">Delete</a></u>';
                                if (response[i].Activity != 3) {
                                    content += ' | <u><a onclick="DeleteRpts.DelCPDDetails(\'' + response[i].CPD_Id + '\',\'Draft\')" style="color: white;">Draft</a></u>';
                                }
                                content += '</span>';
                                content += '</div>';
                                content += '</div>';
                            }
                            $('#userCPDDeldates').html(content);
                            $('#dvUserName').html(UserName);
                            if (response.length == 1 && DeleteRpts.defaults.UserCode == response[0].User_Code) {
                                $('#dvname').hide();
                            }
                        }
                        else {
                            content = '';
                            content += "<div style='text-align: center;'>";
                            content += "<label>No records found</label></div>";
                            $('#userCPDDeldates').html(content);
                            $('#dvUserName').html(UserName);
                            if (UserName == 'SingleUser') {
                                $('#dvname').hide();
                            }
                        }
                    }
                })
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    DelCPDDetails: function (CPD_Id, Action) {
        debugger
        if (Action == 'Draft') {
            swal({
                title: "Are you sure?",
                text: "Do you wish to draft this record?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
              function (isConfirm) {
                  if (navigator.onLine == true) {
                      var Userstatus = fnuserstatus();
                      debugger
                      if (Userstatus) {
                          if (isConfirm) {
                              $.ajax({
                                  type: 'POST',
                                  data: 'subDomainName=' + subDomainName + '&CompanyId=' + CompanyId + '&Type=' + Action + '&CPD_Id=' + CPD_Id,
                                  url: '../../HiDoctor_Activity/CPD/DeleteCPDRecord',
                                  success: function (response) {
                                      debugger
                                      if (response == 0) {
                                          swal("Drafted!", "DCR has been drafted.", "success");
                                          DeleteRpts.GetDelCPDDates(subDomainName, SelUserCode, UserName);
                                      }
                                  }
                              })
                          } else {
                              swal("Cancelled", "DCR is safe :)", "info");
                          }
                      }
                      else {
                          swal("Info!", "Your account has been deactivated.", "info");
                      }
                  }
                  else {
                      swal("Please connect to the internet", "", "");
                      return false;
                  }
              });
        }
        else {
            debugger
            swal({
                title: "Are you sure?",
                text: "Do you wish to delete this record?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-primary",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
           function (isConfirm) {
               if (navigator.onLine == true) {
                   var Userstatus = fnuserstatus();
                   debugger
                   if (Userstatus) {
                       if (isConfirm) {
                           $.ajax({
                               type: 'POST',
                               data: 'subDomainName=' + subDomainName + '&CompanyId=' + CompanyId + '&Type=' + Action + '&CPD_Id=' + CPD_Id,
                               url: '../../HiDoctor_Activity/CPD/DeleteCPDRecord',
                               success: function (response) {
                                   debugger
                                   if (response == 1) {
                                       swal("Deleted!", "DCR has been deleted.", "success");
                                       DeleteRpts.GetDelCPDDates(subDomainName, SelUserCode, UserName);
                                   }
                               }
                           })
                       } else {
                           swal("Cancelled", "DCR is safe :)", "info");
                       }
                   }
                   else {
                       swal("Info!", "Your account has been deactivated.", "info");
                   }
               }
               else {
                   swal("Please connect to the internet", "", "");
                   return false;
               }
           });
        }

    },


}
   
