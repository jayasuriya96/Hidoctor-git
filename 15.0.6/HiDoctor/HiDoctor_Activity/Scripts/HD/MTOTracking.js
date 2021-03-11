var MTOTracking = {
    defaults: {
        subDomainName: '',
        CompanyId: '',
        UserCode: '',
        SeluserCode: '',
        LID: ''
    },
    fngetuserlatlong: function (usercode) {
        from = $('#datepicker-1').val();
        to = $('#datepicker-2').val();
        MTOTracking.defaults.subDomainName = subDomainName;
        MTOTracking.defaults.CompanyId = CompanyId;
        MTOTracking.defaults.UserCode = LoggedUserCode;
        MTOTracking.defaults.SeluserCode = SelUsrCode;
        MTOTracking.defaults.LID = LID;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                $.ajax({
                    type: 'GET',
                    data: 'subDomainName=' + MTOTracking.defaults.subDomainName + '&UserCode=' + usercode + '&From=' + from,
                    url: '../../HiDoctor_Activity/MTO/GetUserLatLong',
                    success: function (resp) {
                        debugger
                        locdata = [];
                        if (resp.length > 0) {
                            for (var i = 0; i < resp.length; i++) {
                                if (resp[i].Latitude != '' || resp[i].outLatitude != '') {
                                    locdata.push(resp[i]);
                                }
                            }
                            fnShowMap(locdata);
                        }
                        else { 
                            var content='';
                            content += "<label>No records found</label></div>";
                            $('#myMap').html(content);
                        }
                    }
                })
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    }
}