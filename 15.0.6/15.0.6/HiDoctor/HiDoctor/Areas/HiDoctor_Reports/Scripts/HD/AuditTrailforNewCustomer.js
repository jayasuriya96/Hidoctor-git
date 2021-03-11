//Created By:Sumathi.M
//Date:07/05/2014

function fnGetAuditTrail() {
    if (fnSubValidate()) {    
        var options = "";

        //GET OPTIONS
        if ($('#optViewInScreen').attr('checked') == "checked") {
            options = "S";
        }
        else {
            options = "E";
        }

        var day = $("#txtStartDate").val().split('/')[0];
        var month = $('#txtStartDate').val().split('/')[1];
        var year = $('#txtStartDate').val().split('/')[2];
        var startDate = year + '-' + month + '-' + day;

        var day = $("#txtEndDate").val().split('/')[0];
        var month = $('#txtEndDate').val().split('/')[1];
        var year = $('#txtEndDate').val().split('/')[2];
        var endDate = year + '-' + month + '-' + day;

        var regionCode = $('#hdnRegionCode').val();
        var RegionType = $('#hdnUseractivity').val();
        var customerType = $("#ddlCustomerType option:selected").val();

        $('#dvAuditTrailforNewCustomer').block({
            message: 'Retrieving data...',
            css: { border: '1px solid #ddd' }
        });

        $.ajax({
            type: 'POST',
            data: "regionCode=" + regionCode + "&viewFormat=" + options + "&title=" + $("#divPageHeader").html() + "&selectedUser=" + RegionType + "&customerEntityType=" + customerType + "&startDate=" + startDate + "&endDate=" + endDate,
            url: '../ReportsLevelThree/GetAuditTrailforCustomer',
            success: function (response) {
                if (response != '') {      
                    $('#divAudirrptforDoctorsandChemist').html(response);
                }
                $("#dvAuditTrailforNewCustomer").unblock();
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message.split('^')[1]);
                $("#dvAuditTrailforNewCustomer").unblock();
            }
        });
    }
}

function fnSubValidate() {
    if ($.trim($('#txtStartDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Start Date');
        return false;
    }
    if ($.trim($('#txtEndDate').val()).length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select End Date');
        return false;
    }

    //Date Validation
    if (!(fnValidateDateFormate($("#txtStartDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtEndDate"), "EndDate"))) {
        return false;
    }

    var FromDateArr = $("#txtStartDate").val().split('/');
    var ToDateArr = $("#txtEndDate").val().split('/');
    var fromDate = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var toDate = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (fromDate > toDate) {
        fnMsgAlert('info', 'Info', 'EndDate Should not be less than the StartDate');
        return false;
    }
    var dateDiff = fnGetDateDifference(new Date(fromDate), new Date(toDate));
    if (dateDiff > 92) {
        fnMsgAlert('info', 'Info', 'The difference between from date and to date should not exceed 92 days');
        return false;
    }

    if ($('#ddlCustomerType').val() == '0') {
        fnMsgAlert('info', 'Info', 'Please Select Any Customer Type.');
        return false;
    }

    return true;
}