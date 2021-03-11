var data_g;
function fnBuildCalendar(month, year, data) {
    
    data_g = data;
    if ($('#monthCalendar') != null) {
        $('#monthCalendar').fullCalendar('destroy');
    }
    var start = month + '/01/' + year;
    var end = month + '/' + fnDaysInMonth(month, year) + '/' + year;
    var date = new Date(end);
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    $('#monthCalendar').fullCalendar({
        header: {
            left: 'prev,next,title',
            center: '',
            right: 'views'
        },
        month: m,
        year: y,
        editable: false,
        selectable: true,
        autoheight: true,
        selectHelper: true,
        weekMode: 'variable',
        select: function (start, end, allDay) {

        },
        events:  function (start, end, callback) {
           // var fullMonth = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
            //var fullYear = $('#dvCalendar').fullCalendar('getDate').getFullYear();
            
            callback(data);
        }
    ,
        eventClick: function (event, element) {
        }
    });
    
    $('.fc-button-next').click(function () { fnSetAndBindDayofWeekReport() });
    $('.fc-button-prev').click(function () { fnSetAndBindDayofWeekReport() });
    /// TP

    //$('#dvCalendar').fullCalendar({
    //    header: {
    //        left: 'prev,next today',
    //        center: 'title'
    //    },
    //    editable: false,
    //    weekMode: 'variable',
    //    events: function (start, end, callback) {
    //        var fullMonth = $('#dvCalendar').fullCalendar('getDate').getMonth() + 1;
    //        var fullYear = $('#dvCalendar').fullCalendar('getDate').getFullYear();
          
    //                callback(events);
    //            }
    //        });
    //    },
    //    eventClick: function (event) {
    //        //check if tree node is selected 
    //        if ($("#hdnUserCode").val() == "") {
    //            fnMsgAlert('error', 'Error', 'Please select the user to enter tour plan');
    //            return;
    //        }
    //        $("#spnDay").removeClass('spn-deep-Black');
    //        $("#spnWeek").removeClass('spn-deep-Black');
    //        $("#spnMonth").removeClass('spn-deep-Black');
    //        $("#spndashBoard").removeClass('spn-deep-Black');
    //        $("#spnDay").addClass('spn-deep-Black');

    //        var date = event.start;
    //        var tpDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //        $("#tblTP").css('display', '');
    //        $("#dvCalendar").css('display', 'none');

    //        $('#dvDatePicker').datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), date.getDate()));

    //        var theDate = new Date(Date.parse($('#dvDatePicker').datepicker('getDate')));
    //        var dateFormatted = $.datepicker.formatDate('D, MM d, yy', theDate);
    //        $("#dvTPDate").html(dateFormatted);
    //        $("#txtTpDate").val($.datepicker.formatDate('dd/mm/yy', theDate));//to bind the selected date to the control

    //        //tp date
    //        $("#hdnTPDate").val($.datepicker.formatDate('yy-mm-dd', theDate));
    //        $("#dvBigDate").html($.datepicker.formatDate('d', theDate));
    //        $("#dvday").html($.datepicker.formatDate('D, MM, yy', theDate));
    //        //clear all
    //        fnClearAll();

    //        //prefill the details
    //        fnPrefillTP(tpDate);

    //    },
    //    dayClick: function (date, allDay, jsEvent, view) {
    //        //check if tree node is selected 
    //        if ($("#hdnUserCode").val() == "") {
    //            fnMsgAlert('error', 'Error', 'Please select the user to enter tour plan');
    //            return;
    //        }
    //        $("#spnDay").removeClass('spn-deep-Black');
    //        $("#spnWeek").removeClass('spn-deep-Black');
    //        $("#spnMonth").removeClass('spn-deep-Black');
    //        $("#spndashBoard").removeClass('spn-deep-Black');
    //        $("#spnDay").addClass('spn-deep-Black');

    //        var tpDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //        $("#tblTP").css('display', '');
    //        $("#dvCalendar").css('display', 'none');

    //        $('#dvDatePicker').datepicker('setDate', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    //        $("#txtTpDate").val($.datepicker.formatDate('dd/mm/yy', date));//to bind the selected date to the control

    //        var theDate = new Date(Date.parse($('#dvDatePicker').datepicker('getDate')));
    //        var dateFormatted = $.datepicker.formatDate('D, MM d, yy', theDate);
    //        $("#dvTPDate").html(dateFormatted);

    //        //tp date
    //        $("#hdnTPDate").val($.datepicker.formatDate('yy-mm-dd', theDate));
    //        $("#dvBigDate").html($.datepicker.formatDate('d', theDate));
    //        $("#dvday").html($.datepicker.formatDate('D, MM, yy', theDate));
    //        //clear all
    //        fnClearAll();

    //        //prefill the details
    //        fnPrefillTP(tpDate);
    //    },
       
    //});

}

function fnSetAndBindDayofWeekReport() {
    var date = $('#monthCalendar').fullCalendar('getDate');
    var monArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var monName = monArray[date.getMonth()];
    var year = date.getFullYear();
    $('#txtMonth').val(monName + "-" + year);
    fnBindDayofWeekReport();
}

function fnValidation() {
    if ($.trim($('#txtMonth').val()).length == 0) {
        fnMsgAlert('info', 'Day of Week Report', 'Please choose the month and year.');
        $('#dvGrid').html('');
        $('#monthCalendar').fullCalendar('destroy');
        $("#dvDayofWeekReport").unblock();
        return false;
    }
    var checkedAnyOne = false;
        if ($('#chkApplied').attr('checked') == 'checked' || $('#chkApproved').attr('checked') == 'checked' || $('#chkUnapproved').attr('checked') == 'checked'
            || $('#chkAll').attr('checked') == 'checked') {
            checkedAnyOne = true;
        }
        if (!checkedAnyOne) {
            fnMsgAlert('info', 'Day of Week Report', 'Please choose the atleast one status.');
            $("#dvDayofWeekReport").unblock();
            $('#dvGrid').html('');
            $('#monthCalendar').fullCalendar('destroy');
            return false;
        }
        return true;
}

function fnGetViewType() {
    if ($('#optViewInScreen').attr('checked') == 'checked') {
        return $('#optViewInScreen').val();
    }
    else {
        return $('#optExportToExcel').val();
    }
}

function fnDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function fnBindDayofWeekReport() {
    var status = "";
    $('#dvDayofWeekReport').block({
        message: 'Retriving data...',
        css: { border: '1px solid #ddd' }
    });
    var viewType = fnGetViewType();
    if ($('#chkAll').attr('checked') == 'checked') {
        status = $('#chkAll').val();
    }
    else {
        if ($('#chkApplied').attr('checked') == 'checked') {
            status += $('#chkApplied').val() + "^"
        }
        if ($('#chkApproved').attr('checked') == 'checked') {
            status += $('#chkApproved').val() + "^"
        }
        if ($('#chkUnapproved').attr('checked') == 'checked') {
            status += $('#chkUnapproved').val() + "^"
        }
    }
    if (fnValidation()) {
        
        var monArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        var month = parseInt(monArray.indexOf($('#txtMonth').val().split('-')[0].toUpperCase())) + 1;
        var year = $.trim($('#txtMonth').val().split('-')[1]);
        if (viewType == "1") {
            fnGetCalendarData(month, year, status, viewType);
        }
        else {
            $('#monthCalendar').fullCalendar('destroy');
        }
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Reports/ReportsLevelThree/GetDayOfWeekReport',
            data: 'user_Code=' + $('#hdnUserCode').val() + '&DCR_Status=' + status + '&month=' + month + '&year=' + year + '&viewType=' + viewType,
            success: function (response) {
                $('#dvGrid').html('');
                $('#dvGrid').html(response);
               
                $("#dvDayofWeekReport").unblock();
            },
            error: function (e) {
                $("#dvDayofWeekReport").unblock();
            }
        });
    }
}

function fnGetCalendarData(month, year, status, viewType) {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Reports/ReportsLevelThree/GetDayOfWeekReportCalendarData',
        data: 'user_Code=' + $('#hdnUserCode').val() + '&DCR_Status=' + status + '&month=' + month + '&year=' + year + '&viewType=' + viewType,
        success: function (response) {
            fnBuildCalendar(month, year, response);
            $("#dvDayofWeekReport").unblock();
        },
        error: function (e) {
            $("#dvDayofWeekReport").unblock();
        }
    });
}

function fnToggleTree() {
    if ($('#dvTree').hasClass('col-lg-3')) {
        fnCloseTree();
    }
    else {
        fnOpenTree();
    }
}

function fnOpenTree() {
    $("#dvuserTree").slideDown();
    $('#lnkTree').html('Hide Tree')
    $('#dvTree').addClass('col-lg-3')
    $('#dvdata').removeClass('col-lg-12')
    $('#dvdata').addClass('col-lg-9')
}

function fnCloseTree() {
    $("#dvuserTree").slideUp();
    $('#lnkTree').html('Show Tree')
    $('#dvTree').removeClass('col-lg-3')
    $('#dvdata').addClass('col-lg-12')
    $('#dvdata').removeClass('col-lg-9')
}

function fnToggleInputs() {
    if ($("#rptInputs").hasClass('col-lg-12')) {
        $('#lnkInput').html('Show Inputs')
        $("#rptInputs").hide();
        $("#rptInputs").removeClass('col-lg-12')
    }
    else {
        $('#lnkInput').html('Hide Inputs');
        $("#rptInputs").show();
        $("#rptInputs").addClass('col-lg-12');
    }
}

function prev() {
    
}
