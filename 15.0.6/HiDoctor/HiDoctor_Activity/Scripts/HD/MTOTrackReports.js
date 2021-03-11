var MTOTrackReports = {
    defaults: {
        subDomainName: '',
        CompanyId: '',
        UserCode: '',
        RegionCode: '',
        Header: '',
        SalesAndSamples: '',
        CustomerHeader: '',
        CustomerProductInfo: '',
        SelectedUser: '',
        LID: ''
    },
    GetTrackUserDetails: function () {
        debugger
        if (navigator.onLine == true) {
            MTOTrackReports.defaults.subDomainName = subDomainName;
            MTOTrackReports.defaults.CompanyId = CompanyId;
            MTOTrackReports.defaults.UserCode = LoginUserCode;
            MTOTrackReports.defaults.RegionCode = LoginRegionCode;
            MTOTrackReports.defaults.LID = LID;
            $.ajax({
                type: 'GET',
                data: 'subDomainName=' + MTOTrackReports.defaults.subDomainName + '&UserCode=' + MTOTrackReports.defaults.UserCode,
                url: '../../HiDoctor_Activity/MTO/GetUserTrackDetails',
                success: function (flddata) {
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
                        if (response.length == 1) {
                            debugger;
                            MTOTrackReports.GetMTOTrackDetails(response[0].User_Code, response[0].User_Name);
                        }
                        else {
                            for (var i = 0; i < response.length; i++) {
                                str = response[i].Employee_Name;
                                str1 = str.toLowerCase();
                                res = str1.substring(0, 1);
                                content += '<div class="align col-xs-12" style="border-bottom:1px solid #ddd;padding:10px;" onclick="MTOTrackReports.GetMTOTrackDetails(\'' + response[i].User_Code + '\',\'' + response[i].User_Name + '\')">';
                                content += '<div class="col-xs-2"><span id="Initial">' + res + '</span></div>';
                                content += '<div class="col-xs-10" style="font-size:12px;margin: 0px;">';
                                content += '<input id="Usercode_"' + i + ' type="hidden" value="' + response[i].User_Code + '" />';
                                if (i == 0) {
                                    content += '<p style="font-size: 12px;font-weight: 600;">Mine</p>';
                                } else {
                                    content += '<p style="font-size: 12px;font-weight: 600;">' + response[i].Employee_Name + '</p>';
                                }
                                content += '<p>' + response[i].User_Name + ' | ' + response[i].User_Type_Name + '</p>';
                                content += '<p>' + response[i].Region_Name + '</p>';
                                content += '</div></div>';
                            }
                            $('#userdet').html(content);
                        }
                    }
                    else {

                    }
                }
            })
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
    GetMTOTrackDetails: function (SelUser, SUserName) {
        debugger;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                window.location.href = '../MTO/MTOTracking?User_Code=' + SelUser + '&UserName=' + SUserName + '&LID=' + MTOTrackReports.defaults.LID;
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
}