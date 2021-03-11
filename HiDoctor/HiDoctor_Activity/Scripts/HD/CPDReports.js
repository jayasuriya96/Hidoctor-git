var CPDReports = {
    defaults: {
        subDomainName: '',
        CompanyId: '',
        UserCode: '',
        RegionCode: '',
        SelectedUser: '',
        LID: '',
        usercount:''
    },
    fnBack: function (Screen, Count, name) {
        debugger
        if (Screen == 'Dates') {
            debugger
            if (navigator.onLine == true) {
                var Userstatus = fnuserstatus();
                debugger
                if (Userstatus) {
                    window.location.href = '../CPD/CPDReports?LID=' + LID;
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
        else if (Screen == 'Details') {
            debugger
            if (navigator.onLine == true) {
                var Userstatus = fnuserstatus();
                debugger
                if (Userstatus) {
                    window.location.href = '../CPD/CPDDates?User_Code=' + SelUserCode + '&SelUserName=' + name + '&UsrCount=' + Count + '&LID=' + LID;
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
        CPDReports.defaults.subDomainName = subDomainName;
        CPDReports.defaults.CompanyId = CompanyId;
        CPDReports.defaults.UserCode = LoginUserCode;
        CPDReports.defaults.RegionCode = LoginRegionCode;
        CPDReports.defaults.LID = LID;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax({
                    type: 'POST',
                    data: 'subDomainName=' + CPDReports.defaults.subDomainName + '&CompanyId=' + CPDReports.defaults.CompanyId + '&UserCode=' + CPDReports.defaults.UserCode,
                    url: '../../HiDoctor_Activity/CPD/GetUserDetails',
                    success: function (flddata) {
                        if (flddata.length > 0) {
                            var response = $.grep(flddata, function (v) {
                                return v.Activity == 1;
                            })
                            if (response.length > 0) {
                                debugger
                                var content = '';
                                var str = '';
                                var str1 = '';
                                var res = '';
                                CPDReports.defaults.usercount = response.length;
                                if (response.length == 1 && CPDReports.defaults.UserCode == response[0].User_Code) {
                                    debugger;
                                    CPDReports.GetCPDDates(response[0].User_Code, response[0].User_Name, CPDReports.defaults.usercount);
                                }
                                else {
                                    for (var i = 0; i < response.length; i++) {
                                        str = response[i].Employee_Name;
                                        str1 = str.toLowerCase();
                                        res = str1.substring(0, 1);
                                        content += '<div id="usrsrch"><div class="align col-xs-12" style="border-bottom:1px solid #ddd;padding:10px;" onclick="CPDReports.GetCPDDates(\'' + response[i].User_Code + '\',\'' + response[i].User_Name + '\',\'' + CPDReports.defaults.usercount + '\')">';
                                        content += '<div class="col-xs-2"><span id="Initial">' + res + '</span></div>';
                                        content += '<div class="col-xs-10" style="font-size:12px;margin: 0px;">';
                                        content += '<input id="Usercode_"' + i + ' type="hidden" value="' + response[i].User_Code + '" />';
                                        //if (i == 0) {
                                        if (CPDReports.defaults.UserCode == response[i].User_Code) {
                                            content += '<p style="font-size: 12px;font-weight: 600;">Mine</p>';
                                        } else {
                                            content += '<p style="font-size: 12px;font-weight: 600;">' + response[i].Employee_Name + '</p>';
                                        }
                                        content += '<p>' + response[i].User_Name + ' | ' + response[i].User_Type_Name + '</p>';
                                        content += '<p>' + response[i].Region_Name + '</p>';
                                        content += '</div></div></div>';
                                    }
                                    $('#userdet').html(content);
                                }
                                if (response.length > 8) {
                                    $('#dvusrsrch').show();
                                }
                            }
                            else {
                                $('#userdet').html('No Record Found');
                            }
                        }
                        else {
                            $('#userdet').html('No Record Found');
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
    GetCPDDates: function (SelUser, SelUserName, Usercount) {
        debugger;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                window.location.href = '../CPD/CPDDates?User_Code=' + SelUser + '&SelUserName=' + SelUserName + '&UsrCount=' + Usercount + '&LID=' + CPDReports.defaults.LID;
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
    fnchildcountcheck: function (subDomainName, LoggedUserCode, UserName, usrcount) {
        debugger
        //$.ajax({
        //    type: 'POST',
        //    data: 'subDomainName=' + subDomainName + '&User_Code=' + LoggedUserCode,
        //    url: '../../HiDoctor_Activity/CPD/GetChildcount',
        //    success: function (response) {
        //        debugger
        //        if (response[0].count == 1) {
        //            $('#spnback').hide();
        //            $('#dvname').hide();
        //        }
        //        else {
        //            $('#spnback').show();
        //            $('#dvname').show();
        //        }
        //    }
        //})
        if (usrcount == 1) {
            $('#spnback').hide();
            $('#dvname').hide();
        }
        else {
            $('#spnback').show();
            $('#dvname').show();
        }
        FDate=$('#datepicker-5').val();
        TDate = $('#datepicker-6').val();
        var Fromdt = new Date(new Date(FDate.split('/')[2] + '-' + FDate.split('/')[1] + '-' + FDate.split('/')[0]));
        var Todt = new Date(new Date(TDate.split('/')[2] + '-' + TDate.split('/')[1] + '-' + TDate.split('/')[0]));
        if (FDate=='') {
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
            CPDReports.GetUserCPDDates(subDomainName, SelUserCode, UserName, FDate, TDate);
        }
    },
    GetUserCPDDates: function (subDomainName, SelUserCode, UsrName, FDate, TDate) {
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
                                if (response[i].Activity == 1) {
                                    var date = response[i].CPD_Date;
                                    date = date.replace(/ /g, "-");
                                    content += '<div class="rcorners col-xs-12" style="background-color: mediumslateblue;color: white;" onclick="CPDReports.GetCPDDetails(\'' + response[i].CPD_Id + '\',\'' + SelUserCode + '\',\'' + UsrName + '\',\'' + usrcount + '\')">';
                                    content += '<div class="col-xs-2"><i class="fa fa-calendar-o" aria-hidden="true"></i></div>';
                                    content += '<div class="col-xs-10" style="font-size:12px;margin: 0px;">';
                                    if (response[i].Activity == 1) {
                                        content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Field</p>';
                                    }
                                    //else if (response[i].Activity == 2) {
                                    //    content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Attendance</p>';
                                    //}
                                    //else if (response[i].Activity == 3) {
                                    //    content += '<p style="font-size: 12px;font-weight: 600;">' + date + ' - Leave</p>';
                                    //}
                                    content += '<input id="MTOid_"' + i + ' type="hidden" value="' + response[i].MTO_Id + '" />';
                                    content += '</div></div>';
                                }
                            }
                            $('#userCPDdates').html(content);
                            $('#dvUserName').html(UsrName);
                            if (UserName == 'SingleUser') {
                                $('#dvname').hide();
                            }
                        }
                        else {
                            content = '';
                            content += "<div style='text-align: center;'>";
                            content += "<label>No records found</label></div>";
                            $('#userCPDdates').html(content);
                            $('#dvUserName').html(UsrName);
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
    GetCPDDetails: function(CPD_Id, User_Code, UsName, usrcnt){
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                window.location.href = '../CPD/CPDDetails?User_Code=' + User_Code + '&CPD_Id=' + CPD_Id + '&User_Name=' + UsName + '&usrcnt=' + usrcnt + '&LID=' + LID;
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
    GetUserCPDDetails: function (subDomainName, CPD_Id) {
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax({
                    type: 'POST',
                    data: 'subDomainName=' + subDomainName + '&CompanyId=' + CompanyId + '&CPD_Id=' + CPD_Id,
                    url: '../../HiDoctor_Activity/CPD/GetUserCPDDetails',
                    success: function (response) {
                        debugger

                        var market = response.header;
                        var Products = response.Proddetails;
                        var Outlets = response.Outlet;
                        var MrktDetails = '';
                        var proddetails = '';
                        var Brightdetails = '';
                        var Shinedetails = '';
                        var str = market[0].Employee_Name;
                        var str1 = str.toLowerCase();
                        var res = str1.substring(0, 1);
                        $('#Initial').html(res);
                        if (market.length > 0) {
                            debugger
                            MrktDetails += '<div style="border-radius: 10px;border: 1px solid mediumslateblue;padding: 12px 10px;" class="clearfix">';
                            MrktDetails += '<p style="font-size: 12px;font-weight: 600;">Market Name</p>';
                            MrktDetails += '<p style="font-size: 12px;word-break: break-word;">' + market[0].Market_Name + '</p>';
                            MrktDetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                            MrktDetails += '<p style="font-size: 12px;font-weight: 600;">Total Calls</p>';
                            MrktDetails += '<p style="font-size: 12px;">' + market[0].Total_Calls + '</p></div>';
                            MrktDetails += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Productive Calls</p>';
                            MrktDetails += '<p style="font-size: 12px;">' + market[0].Productive_Calls + '</p></div></div>';
                            MrktDetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;">';
                            MrktDetails += '<p style="font-size: 12px;font-weight: 600;">Bright Calls</p>';
                            MrktDetails += '<p style="font-size: 12px;">' + market[0].Bright_Calls + '</p></div>';
                            MrktDetails += '<div class="col-xs-6" style="padding: 0px;"><p style="font-size: 12px;font-weight: 600;">Shine Calls</p>';
                            MrktDetails += '<p style="font-size: 12px;">' + market[0].Shine_Calls + '</p></div></div>';
                            MrktDetails += '</div></br>';
                            $('#MarketDet').html(MrktDetails);
                            $('#CPDdate').html(response.header[0].CPD_Date);
                            $('#usrname').html(response.header[0].User_Name);
                            $('#repcode').html(response.header[0].Employee_Number);
                            if (response.header[0].GRemaks == '') {
                                $('#spnRemarks').html('-');
                            } else {
                                $('#spnRemarks').html(response.header[0].GRemaks);
                            }

                        }
                        if (Products.length > 0) {
                            proddetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;font-weight: 600;">';
                            proddetails += '<label style="font-size: 12px;">Product Name</label></div>';
                            proddetails += '<div class="col-xs-6" style="padding: 0px;">';
                            proddetails += '<label style="font-size: 12px;">Value</label></div></div>';
                            for (var i = 0; i < Products.length; i++) {
                                debugger
                                // proddetails += '';
                                proddetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;font-weight: 600;">';
                                proddetails += '<p style="font-size: 12px;">' + Products[i].Product_Name + '</p></div>';
                                proddetails += '<div class="col-xs-6" style="padding: 0px;">';
                                proddetails += '<p style="font-size: 12px;">' + Products[i].Product_Value + '</p></div></div>';
                                //proddetails += '</div></br>';
                            }
                            $('#spnProdDetails').html(proddetails);
                        }
                        if (Outlets.length > 0) {
                            var BrightProd = $.grep(Outlets, function (v) {
                                return v.Outlet_Type == 2;
                            })
                            Brightdetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;font-weight: 600;">';
                            Brightdetails += '<label style="font-size: 12px;">Product Name</label></div>';
                            Brightdetails += '<div class="col-xs-3" style="padding: 0px;">';
                            Brightdetails += '<label style="font-size: 12px;">Calls</label></div>';
                            Brightdetails += '<div class="col-xs-3" style="padding: 0px;">';
                            Brightdetails += '<label style="font-size: 12px;">Value</label></div></div>';
                            for (var i = 0; i < BrightProd.length; i++) {
                                debugger
                                Brightdetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;font-weight: 600;">';
                                Brightdetails += '<p style="font-size: 12px;">' + BrightProd[i].Product_Name + '</p></div>';
                                Brightdetails += '<div class="col-xs-3" style="padding: 0px;">';
                                Brightdetails += '<p style="font-size: 12px;">' + BrightProd[i].Outlet_Count + '</p></div>';
                                Brightdetails += '<div class="col-xs-3" style="padding: 0px;">';
                                Brightdetails += '<p style="font-size: 12px;">' + BrightProd[i].Outlet_Value + '</p></div></div>';
                            }
                            $('#spnBrightDetails').html(Brightdetails);

                            var ShineProd = $.grep(Outlets, function (v) {
                                return v.Outlet_Type == 1;
                            })
                            Shinedetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;font-weight: 600;">';
                            Shinedetails += '<label style="font-size: 12px;">Product Name</label></div>';
                            Shinedetails += '<div class="col-xs-3" style="padding: 0px;">';
                            Shinedetails += '<label style="font-size: 12px;">Calls</label></div>';
                            Shinedetails += '<div class="col-xs-3" style="padding: 0px;">';
                            Shinedetails += '<label style="font-size: 12px;">Value</label></div></div>';
                            for (var i = 0; i < ShineProd.length; i++) {
                                debugger
                                Shinedetails += '<div class="col-xs-12" style="padding: 0px;"><div class="col-xs-6" style="padding: 0px;font-weight: 600;">';
                                Shinedetails += '<p style="font-size: 12px;">' + ShineProd[i].Product_Name + '</p></div>';
                                Shinedetails += '<div class="col-xs-3" style="padding: 0px;">';
                                Shinedetails += '<p style="font-size: 12px;">' + ShineProd[i].Outlet_Count + '</p></div>';
                                Shinedetails += '<div class="col-xs-3" style="padding: 0px;">';
                                Shinedetails += '<p style="font-size: 12px;">' + ShineProd[i].Outlet_Value + '</p></div></div>';
                            }
                            $('#spnShineDetails').html(Shinedetails);
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
}