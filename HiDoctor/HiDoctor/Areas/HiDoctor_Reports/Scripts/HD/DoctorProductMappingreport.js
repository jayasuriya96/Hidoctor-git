//Created by:Sumathi.M
//Date:24/03/2014


function fnDoctorProductMappingReport() {
    $('#dvDoctorProduct').block({
        message: 'Retrieving data...',
        css: { border: '1px solid #ddd' }
    });

    var options = "";
    //GET OPTIONS
    if ($('#optViewInScreen').attr('checked') == "checked") {       
        options = "S";
    }
    else {
        options = "E";
    }   
    var regionCode = $('#hdnRegionCode').val();
    var RegionType = $('#hdnUseractivity').val();

    $.ajax({
        type: 'POST',
        data: "regionCode=" + regionCode + "&viewFormat=" + options + "&title=" + $("#divPageHeader").html() + "&selectedUser=" + RegionType,
        url: '../ReportsLevelThree/GetDoctorProductMapping',
        success: function (response) {
            if (response != '') {
                $('#divDoctorProductMapping').html(response);
            }
            $("#dvDoctorProduct").unblock();
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
            $("#dvDoctorProduct").unblock();
        }
    });
}