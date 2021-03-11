var dcrActivitydetails = new Array();

function fnCloseTree() {
    $("#usertree").slideUp();
    $("#divleft").css('width', '3%');
    $("#imggr").show();
    $("#imgless").hide()
}

function fnOpenTree() {
    $("#usertree").slideDown();
    $("#divleft").css('width', '20%');
    $("#imggr").hide();
    $("#imgless").show()
}

//tree node click event
function fnUserTreeNodeClick(node) {
    $("#hdnUserCode").val(node.data.key);
    //$("#spnName").html(node.data.title);
  
    fnshowActivityLockData($("#hdnUserCode").val());
    fnBindActivityLockemployeeData($("#hdnUserCode").val())
   // $('#dvTitle').html(node.data.title);

   
}
var activityLockDetails = '';
var data = '';
function fnshowActivityLockData(userCode) {
    debugger;
    $('#ReleasedGrid').hide();
    var userCode = $("#hdnUserCode").val();
    if (userCode == currentUserCode_g) {
        $("#dataDiv").hide();
        fnMsgAlert('info', 'Info', 'You cannot release the lock for yourself');
        return false;
    }
    else {
        $("#dataDiv").show();
    }
  
    $(".tabs").show();
  //  $('#ReleasedGrid').show();
   // $('#ReleaseGrid').html('No Unapproved Locks');
    $('#btnRelease').css('display', 'none');
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRLock/GetActivityLockDataPerUser',
        data: 'user_Code=' + $("#hdnUserCode").val(),
        success: function (jsData) {
            debugger;
            data = jsData;
            $('#dataDiv').css('display', '');
            $('#dvuserHeaderDetails').html('');

            $('#ReleaseGrid').html('');
            if (jsData.indexOf('$') > -1) {
                var headerDetails = jsData.split('$')[0];
                activityLockDetails = jsData.split('$')[1];
                var type = activityLockDetails.split('$')[1];
               // $('#dvuserHeaderDetails').html(headerDetails);
                var jsonType = eval(type);

                $('#btnRelease').css('display', 'none');
                $(".tabs").show();
                $('#ReleaseGrid').html(activityLockDetails);
                // $("#lnkFilter").hide();
                $('#btnRelease').css('display', '');
                //  if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    var oTable = $('#tblActivityLock').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip',
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
            }
            else {
              //  $('#dvuserHeaderDetails').html(jsData);
                $('#ReleaseGrid').show();
                $('#ReleaseGrid').html(jsData);
              //  $('#dvuserHeaderDetails').addClass('noreocrds');
                $('#btnRelease').css('display', 'none');
            }
        }

    });
}

function fnBindActivityLockData(userCode) {
    debugger;
    var userCode = $("#hdnUserCode").val();
     $('#ReleaseGrid').html('');
    if (userCode == currentUserCode_g) {
        $("#dataDiv").hide();
        fnMsgAlert('info', 'Info', 'You cannot release the lock for yourself');
        return false;
    }
    else {
        $("#dataDiv").show();
    }
    $(".tabs").show();
    $('#ReleasedGrid').hide();
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/DCRLock/GetActivityLockDataPerUser',
        data: 'user_Code=' + $("#hdnUserCode").val(),
        success: function (jsData) {
            debugger;
            data = jsData;
            $('#dataDiv').css('display', '');
            $('#dvuserHeaderDetails').html('');
          
            $('#ReleaseGrid').html('');
            if (jsData.indexOf('$') > -1) {
                var headerDetails = jsData.split('$')[0];
                 activityLockDetails = jsData.split('$')[1];
                var type = activityLockDetails.split('$')[1];
            //    $('#dvuserHeaderDetails').html(headerDetails);
                var jsonType = eval(type);
               
                $('#btnRelease').css('display', 'none');
                $(".tabs").show();
                $('#ReleaseGrid').html(activityLockDetails);
               // $("#lnkFilter").hide();
               $('#btnRelease').css('display', '');
                //  if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
                if ($.fn.dataTable) {
                    $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                    $.datepicker.setDefaults($.datepicker.regional['']);
                    var oTable = $('#tblActivityLock').dataTable({
                        "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip',
                    }).dataTable().columnFilter({
                        sPlaceHolder: "head:after",
                        aoColumns: jsonType
                    });
                };
            }
            else {
                //$('#dvuserHeaderDetails').html(jsData);
              //  $('#dvuserHeaderDetails').addClass('noreocrds');
                $('#btnRelease').css('display', 'none');
            }
        }

    });
}
function fnBindActivityLockemployeeData(userCode) {
    debugger;
    var Content = '';
    $("#dvuserHeaderDetails").html('');
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/EmployeeDetails',
        data: 'user_Code=' + $("#hdnUserCode").val(),
        success: function (response) {
            debugger;
            Content += "<table class='table table-bordered'>";
            Content += "<thead style='#5E87B0 !important'>";
            Content += "<tr>";
            Content += "<th style='width:48%;background: #5E87B0 !important;color: #fff !important;'>User Details</th>";
            Content += "<th style='background: #5E87B0 !important;color: #fff !important;'>Reporting Manager Details</th>";
            Content += "</tr>";
            Content += "</thead>";
            Content += "<tbody>";
            Content += "<tr>";
            Content += "<td><b>Employee Name</b>: " + response[0].Employee_Name + "</td>";
            Content += "<td><b>Employee Name</b>: " + response[0].Manager_Emp_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>User Name</b>: " + response[0].User_Name + "</td>";
            Content += "<td><b>User Name</b>: " + response[0].Manager_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>Region Name</b>: " + response[0].Region_Name + "</td>";
            Content += "<td><b>Region Name</b>: " + response[0].Manager_Region_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>Designation</b>: " + response[0].User_Type_Name + "</td>";
            Content += "<td><b>Designation</b>: " + response[0].Manager_Type_Name + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>Date Of Joining</b>: " + response[0].DOJ + "</td>";
            Content += "<td><b>Date Of Joining</b>: " + response[0].Manager_Date_Of_Joining + "</td>";
            Content += "</tr>";
            Content += "<tr>";
            Content += "<td><b>HiDoctor Start Date</b>: " + response[0].HiDOCTOR_Start_Date + "</td>";
            Content += "<td><b>HiDoctor Start Date</b>: " + response[0].HSD + "</td>";
            Content += "</tr>";
            Content += "</tbody>";
            Content += "</table>";
            $("#dvuserHeaderDetails").append(Content);
        }

    });
}

function fnreleasedata()
{
   
    debugger;
 
    $('#ReleasedGrid').hide();
    $(".tabs").show();
    $("#lnkFilter").hide();
    $('#ReleaseGrid').html('');
    $('#ReleaseGrid').show();
   
    if (data != "No lock details found.") {
        $('#ReleaseGrid').html(activityLockDetails);
        $('#btnRelease').css('display', '');
    }
  
    //if (activityLockDetails != "") {
    //    if (($("#ReleaseGrid").html() == "No Unapprove Locks found." || $("#ReleaseGrid").html() == '') && $('#btnRelease').css('display')!="none") {
    //        $('#ReleaseGrid').html('No Unapprove Locks found');
    //    }
        
        else{
      //  $('#ReleaseGrid').html('');
        $('#ReleaseGrid').html('No lock details found');
        $('#btnRelease').css('display', 'none');
        }
    
    //else
    //{
    //    $('#ReleaseGrid').html('No Unapprove Locks found');
    //    $('#btnRelease').css('display', 'none');
    //}
    if ($.fn.dataTable) {
        $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
        $.datepicker.setDefaults($.datepicker.regional['']);
        var oTable = $('#tblActivityLock').dataTable({
            "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip',
        }).dataTable().columnFilter({
            sPlaceHolder: "head:after",
            aoColumns: jsonType
        });
    }

else {
                $('#dvuserHeaderDetails').html(jsData);
$('#dvuserHeaderDetails').addClass('noreocrds');
$('#btnRelease').css('display', 'none');
}
}
function fnSelectAll() {
    if ($('#chk_0').attr('checked') == null) {
        $('.checkboxclass').attr('checked', false);
    }
    else if ($('#chk_0').attr('checked') == 'checked') {
        $('.checkboxclass').attr('checked', 'checked');
    }
}

function fnReleaseLock() {
    debugger;
    //var dcrActualDates = "";
    //var flags = "";
    //var tblRow = $('#tblActivityLock tbody tr').length;
    // for(var s=0 ; s <

    //for (var s = 1; s <= tblRow; s++) {
    //    var checkboxid = "chk_" + s;
    //    if ($('#chk_' + s).attr('checked') == 'checked') {
    //        
    //        //var chkid = this.id.replace('chk_', 'dcrDate_');
    //        //var dcrDateId = chkid.replace('chk_', 'dcrDate_');
    //        var date = $('#dcrDate_' + s).html();
    //        date = date.split('/')[1] + '/' + date.split('/')[0] + '/' + date.split('/')[2];

    //        // dcrActualDates += date + "^";
    //        //  var flagId = dcrDateId.replace('dcrDate_', 'dcrFlag_');
    //        var flag = $('#dcrFlag_' + s).html();

    //        var dcrDetails = {};
    //        dcrDetails.DCR_Actual_Date = date;
    //        dcrDetails.Activity_Flag = flag;
    //        dcrActivitydetails.push(dcrDetails);

    //    }
    //}

    $("input:checkbox[name=chkUserSelect]").each(function () {
        debugger;
        if (this.checked) {
            var chkid = this.id.replace('chk_', 'dcrDate_');
            var dcrDateId = chkid.replace('chk_', 'dcrDate_');
            var date = $('#' + dcrDateId).html();
            date = date.split('/')[1] + '/' + date.split('/')[0] + '/' + date.split('/')[2];
            var chk = chkid;
            var ckhnum = chk.split('_');
            var i = ckhnum[1];
            var flagId = dcrDateId.replace('dcrDate_', 'dcrFlag_');
            var flag = $('#' + flagId).html().substring(0, 1);
            var releasedbyusercode = $("#ddluser_code_"+i).val();
            var reason = $("#txtReason_" + i).val();
            var dcrDetails = {};
            dcrDetails.DCR_Actual_Date = date;
            dcrDetails.Activity_Flag = flag;
            dcrDetails.Request_Released_By = releasedbyusercode;
            dcrDetails.Released_Reason = reason;

            dcrActivitydetails.push(dcrDetails);
        }
//        else {
//                   fnMsgAlert('info', 'Info', 'Please select atleast one DCR');
//                return false;
          
//}
    });
    if (dcrActivitydetails.length > 0) {
        $.ajax({
            type: "POST",
            url: '../HiDoctor_Activity/DCRLock/ReleasetheActivityLock',
            data: 'user_Code=' + $("#hdnUserCode").val() + "&dcrDetails=" + encodeURIComponent(JSON.stringify(dcrActivitydetails)),
            success: function (jsData) {
                debugger;
                // $('#ReleaseGrid').hide();
                fnMsgAlert('success', 'DCR Lock Release', 'DCR Activity Lock Released Successfully!');
                fnBindActivityLockData($("#hdnUserCode").val())
                //$("#dvuserHeaderDetails").show();
                //$(".tabs").show();
            }

        });
    }
    else {
        fnMsgAlert('info', 'Info', 'Please select atleast one DCR');
        return false;
    }
    
}


function fnBindRelaeseData(val) {
    $("#btnRelease").hide();
    $("#ReleaseGrid").hide();
 
    $('#ReleasedGrid').html("");
    var status = val;
    var showmore = "";
    if (status == 1) {
        showmore = "SHOWMORE";
    }
    else {
        showmore = "";
    }
    $.ajax({
        type: 'POST',
        data: "user_Code=" + $("#hdnUserCode").val() + "&showMore=" + showmore,
        url: '../DCRLock/GetlockReleaseDataforactivity',
        success: function (response) {
            debugger;
            $('#ReleasedGrid').show();
            //  $('#dvlockedReleaseDataGrid').html(response);
            if (response.length > 0) {
                var grid = new ej.grids.Grid({
                    dataSource: response,
                    showColumnChooser: true,
                    allowPaging: true,
                    allowGrouping: true,
                    allowSorting: true,
                    allowFiltering: true,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    pageSettings: { pageSize: 20, pageSizes: [20, 40, 60, 80, 100], pageCount: 5 },
                    filterSettings: { type: 'CheckBox' },
                    toolbar: ['Search', 'ColumnChooser'],
                    // rowSelected: fnRowSelected,                   
                    aggregates: [],
                    columns: [
                            { field: 'Locked_Date', headerText: 'Locked Date', width: 150, textAlign: 'center' },
                            { field: 'Released_Date', headerText: 'Released Date', width: 150, textAlign: 'center' },
                            { field: 'DCR_Actual_Date', headerText: 'DCR Actual Date', width: 200, textAlign: 'center' },
                            { field: 'Lock_Type', headerText: 'Lock Type', width: 200, textAlign: 'center' },
                            { field: 'Released_By', headerText: 'Released By', width: 200, textAlign: 'center' },
                            { field: 'Request_Released_By', headerText: 'Request Released By', width: 200, textAlign: 'center' },
                            { field: 'Released_Reason', headerText: 'Released Reason', width: 200, textAlign: 'center' },



                    ],
                    //queryCellInfo: queryCellInfo,


                });
                grid.appendTo('#ReleasedGrid');
            }
            else {
                //('#ReleasedGrid').html("<span>No Lock Details Found.</span>");
                $('#ReleasedGrid').html("No release Details Found.");
                $('#ReleasedGrid').addClass('className');

            }

        },
        error: function (e) {
            fnMsgAlert('Error', 'DCR Lock Release', e.responseText);
        }


    });

}

function fnToggleFilter() {
    if ($('#lockFilter').css('display') == 'none') {
        $('#lockFilter').css('display', '')
        $('#lnkFilter').html('Hide Filter')
    }
    else {
        $('#lockFilter').css('display', 'none');
        $('#lnkFilter').html('Show Filter');
    }
}