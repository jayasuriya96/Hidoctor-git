/*
Created By : Chakkaravarthi C
Created Date : 22-03-2017
For : DCR Freeze Release Approval
*/
var UserCode = '';

var DcrFreeze = {
    defaults: {
        "curdate": "",
        "selectedMonthYear": "",
        "ddlDivisionCode": "",
        "ddlDivisionName": "",
        "selectedUser_Code": "",
        "selectedUser_Name": "",
    },
    initialize: function () {
        $("#dvTree").show();
        $("#dv-buttons").hide();
        $('#txtMonth').monthpicker();
        var monthName = DcrFreeze.fnMonthToName();
        $("#txtMonth").val(monthName + '-' + DcrFreeze.defaults.curdate.split('.')[2]);
        DcrFreeze.fnGetDivisions();

        //Fire Function from Go
        $("#btnGo").click(function () {
            DcrFreeze.GetDcrFreezeReleaseUsers();
        });

    },
    blockUI: function (dvId) {
        $('#' + dvId).block({
            message: '<img src="../../Content/images/loader1.gif" width="40px" height="40px"  />',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                //border: '3px solid #aaa',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
                //opacity: 0.6,
                cursor: 'wait'
            },

            // minimal style set used when themes are used 
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },

            // styles for the overlay 
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },

            // style to replace wait cursor before unblocking to correct issue 
            // of lingering wait cursor 
            cursorReset: 'default',
        })
    },
    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
    },
    fnMonthToName: function () {
        var month = new Array(12);
        month[1] = "Jan";
        month[2] = "Feb";
        month[3] = "Mar";
        month[4] = "Apr";
        month[5] = "May";
        month[6] = "Jun";
        month[7] = "Jul";
        month[8] = "Aug";
        month[9] = "Sep";
        month[10] = "Oct";
        month[11] = "Nov";
        month[12] = "Dec";
        return month[parseInt(curdate.split('.')[1])];
    },
    GetMonthToNumber: function (strMonth) {
        var str;
        switch (strMonth) {
            case 'Jan':
                str = "1";
                break;
            case 'Feb':
                str = "2";
                break;
            case 'Mar':
                str = "3";
                break;
            case 'Apr':
                str = "4";
                break;
            case 'May':
                str = "5";
                break;
            case 'Jun':
                str = "6";
                break;
            case 'Jul':
                str = "7";
                break;
            case 'Aug':
                str = "8";
                break;
            case 'Sep':
                str = "9";
                break;
            case 'Oct':
                str = "10";
                break;
            case 'Nov':
                str = "11";
                break;
            case 'Dec':
                str = "12";
                break;
        }

        return str;
    },
    fnOpenTree: function () {
        $("#usertree").slideDown();
        $("#imggr").hide();
        $("#imgless").show()
        $('#divleft').addClass('col-lg-3')
        $('#dataDiv').removeClass('col-lg-12')
        $('#dataDiv').addClass('col-lg-9')
        $('#dataDiv').addClass('col-lg-8')

        if ($('#dvMonth') != null) {
            $('#dvMonth').css('display', '');
        }
    },
    fnCloseTree: function () {
        $("#usertree").slideUp();
        $("#imggr").show();
        $("#imgless").hide()
        $('#divleft').removeClass('col-lg-3')
        $('#dataDiv').addClass('col-lg-12')
        $('#dataDiv').removeClass('col-lg-9')
        $('#dataDiv').removeClass('col-lg-8')
        
        if ($('#dvMonth') != null) {
            $('#dvMonth').css('display', 'none');
        }
    },
    fnGetDivisions: function () {
        $.ajax({
            start: DcrFreeze.blockUI("dvDcrFreeze"),
            type: 'post',
            url: '../HiDoctor_Master/Approval/GetDivisions',
            data: 'A',
            success: function (jsonResult) {
                if (jsonResult != null && jsonResult != '' && jsonResult != undefined) {
                    var jsonData = eval('(' + jsonResult + ')');
                    var listItems;
                    if (1 < jsonData.length) {
                        listItems += "<option selected='selected' data-division_Code = 'All'>-- All --</option>";
                        for (var i = 0; i < jsonData.length; i++) {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }
                    else {

                        for (var i = 0; i < jsonData.length; i++) {
                            if (i == 0) {
                                listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                            } else {
                                listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                            }
                        }

                    }
                    $("#ddlDivision").html(listItems);

                }

            },
            error: function () {
                fnMsgAlert("Get Divisions failed.");
            },
            complete: function () {
                DcrFreeze.UnblockUI("dvDcrFreeze");
            }
        });

    },
    GetDcrFreezeReleaseUsers: function () {
        DcrFreeze.defaults.ddlDivisionCode = $("#ddlDivision").find(':selected').data('division_code');
        DcrFreeze.defaults.ddlDivisionName = $("#ddlDivision option:selected").text();
        DcrFreeze.defaults.selectedMonthYear = $("#txtMonth").val();
        var _objData = new Object();
        _objData.DivisionCode = DcrFreeze.defaults.ddlDivisionCode;
        _objData.Month = DcrFreeze.GetMonthToNumber(DcrFreeze.defaults.selectedMonthYear.split("-")[0]);
        _objData.Year = DcrFreeze.defaults.selectedMonthYear.split("-")[1];
        $.ajax({
            start: DcrFreeze.blockUI("tblDCRApproval"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "Approval/GetDcrFreezeReleaseUsers",
            success: function (jsonResult) {
                var strDesign = "<ul>";
                if (jsonResult.length > 0) {
                    $("#dvDCRFreezeRelease").html('');
                    for (var i = 0; i < jsonResult.length; i++) {
                        strDesign += "<li><a class='btnUsers' data-User_Code ='" + jsonResult[i].User_Code + "'>" + jsonResult[i].User_Name + "," + jsonResult[i].User_Type_Name + "(" + jsonResult[i].Region_Name + ")" + "</a><li>";
                    }
                } else {
                    strDesign += "<li>No Data Found</li>";
                    $("#dvDCRFreezeRelease").html('<div class="alert alert-danger"><strong>No</strong> Data Found.</div>');
                }

                strDesign += "</ul>";

                $("#divUserInfo").html(strDesign);
                $("#divUserHeader").show();
                $("#divUserInfo").show();
                $("#divloading").hide();
                $("#divIndication").show();

                DcrFreeze.UnblockUI("tblDCRApproval");
            },
            error: function (e) {
                DcrFreeze.UnblockUI("tblDCRApproval");
            },
            complete: function () {
                $(".btnUsers").off("click").click(function () {
                    DcrFreeze.defaults.selectedUser_Code = $(this).data("user_code");
                    DcrFreeze.defaults.selectedUser_Name = $(this).text();
                    DcrFreeze.GetDcrFreezeReleaseApproval();
                });
                DcrFreeze.UnblockUI("tblDCRApproval");
            }
        });
    },
    GetDcrFreezeReleaseApproval: function () {
        debugger;
     
        var _objData = new Object();
        _objData.DivisionCode = DcrFreeze.defaults.ddlDivisionCode;
        _objData.Month = DcrFreeze.GetMonthToNumber(DcrFreeze.defaults.selectedMonthYear.split("-")[0]);
        _objData.Year = DcrFreeze.defaults.selectedMonthYear.split("-")[1];
        _objData.User_Code = DcrFreeze.defaults.selectedUser_Code;
        fnBindActivityLockData(_objData.User_Code)
        $.ajax({

            //start: DcrFreeze.blockUI("tree"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "Approval/GetDcrFreezeReleaseApproval",
            success: function (jsonData) {
                $("#tblDcrFreezeReleaseApproval").show();
                debugger;
                $('#btnGrantRelease').prop('disabled', false);
                $("#dvDCRFreezeRelease").html('');
                if (jsonData.length > 0) {
                    var str = '';
                    
                    str += '<div class="col-sm-12">';
                   // str += '<div class="panel-heading" ><h3>' + DcrFreeze.defaults.selectedUser_Name + ' : for ' + DcrFreeze.defaults.selectedMonthYear + ' | Division : ' + DcrFreeze.defaults.ddlDivisionName + '<h3></div>';
                    str += '<div class="tabs">';
                    str += '<ul class="nav nav-tabs">';
                    str += '<li><a href="#" onclick="DcrFreeze.GetDcrFreezeReleaseApproval();" style="font-size:14px;font-weight:bold;">Approved TP(Field)</a></li>';
                    str += '<li><a href="#"  onclick="fnshowreleaseddata();" style="font-size:14px;font-weight:bold;">Released TP(Field)</a></li>';
                    str += '</ul> ';  
                    str += '</div>';
                    str += '<div id="showreleaseddata">';
                    str += '</div>';
                    str += '<div class="panel-body">';

                    str += '<table class="dataTable table table-striped" id="tblDcrFreezeReleaseApproval" style="margin-left:-18px;">';
                    // str += '<table class="dataTable table table-hover" id="tblDcrFreezeReleaseddata" style="display:none;">';
                    str += '<thead style="display:block;width:100%;">';
                    str += '<tr>';
                    str += '<th style="text-align:center;min-width:40px;"><input id="chkSelect_All" name="chkSelectAll" type="checkbox" /></br>Select</th><th style="min-width:77px;">TP Date</th><th style="min-width:78px;">TP Type</th><th style="min-width:98px;">Work Category</th><th style="min-width:85px;">Work Place</th><th style="min-width:112px;">Beat/Patch Name</th>';
                    str += "<th style='min-width:149px;'>Request Released By</th>";
                    str += "<th style='min-width:151px;'>Released Reason</th>";
                    str += '</tr>';
                    str += '</thead>';
                    str += '<tbody style="overflow-x: scroll;display: block;height: 400px;width: 100%;">';
                    var userlist = eval(DcrFreeze.fngetreportedmanagers());
                    var value = "";
                    for (var k = 0; k < userlist.length; k++) {
                        if (userlist[k].User_Code == UserCode) {
                            value += "<option  selected='selected' value='" + userlist[k].User_Code + "'>" + userlist[k].User_Name + "</option>";
                        }
                        else{
                            value += "<option value='" + userlist[k].User_Code + "'>" + userlist[k].User_Name + "</option>";
                        }
                    }
                    for (var i = 0 ; i < jsonData.length; i++) {
                        str += '<tr id="' + i + '">';
                        str += '<td style="text-align: center;min-width:46px;"><input type="checkbox" class="chkShow"  id="chkSelect_' + i + '" name="chkSelect"  /><input type="hidden" id="' + i + '_hdnUser_Code" value="' + jsonData[i].User_Code + '"/><input type="hidden" id="' + i + '_hdnTP_Date" value="' + jsonData[i].TP_Date + '"/></td>';
                        str += '<td id="' + i + '_TP_DateShow" style="text-align: center;min-width:78px;">' + jsonData[i].TP_DateShow + '</td><td id="' + i + '_Activity_Code" style="min-width:20px;">' + jsonData[i].Activity_Code + '</td><td id="' + i + '_Category" style="min-width: 97px;">' + jsonData[i].Category + '</td><td id="' + i + '_Work_Area" style="min-width: 86px;">' + jsonData[i].Work_Area + '</td><td id="' + i + '_CP_Name" style="min-width:112px;">' + jsonData[i].CP_Name + '</td>';
                        var ddl = "<select id='ddlUserName_" + i + "'><option value='0'>-select-</option>";
                        ddl += value;
                        ddl += "</select>";
                        str += "<td style='min-width:148px;'>" + ddl + "</td>";
                        str += "<td  style='min-width:40px;'><textarea maxlength='250' id='txtRemark_" +i + "'>-Nil-</textarea></td>";
                        str += '</tr>';
                    }
                    str += '</tbody>';
                    str += '</table>';
                    // str += '</table>';
                    str += '<br /><br /><input type="button" style="text-align: center;margin-top:-2em !important;"  value="Grant Release" class="btn btn-success" id="btnGrantRelease" />'
                    str += '</div>';
                    str += '</div>';
                    $("#dvDCRFreezeRelease").html(str);
                } else {
                 
                    $("#dvDCRFreezeRelease").html('<div class="alert alert-danger"><strong>No</strong> Data Found.</div>');
                    DcrFreeze.GetDcrFreezeReleaseUsers();
                }
            },
            error: function (e) {
              //  DcrFreeze.UnblockUI("tree");
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get CategoryInfo');
            },
            complete: function () {



                $('#chkSelect_All').off("click").click(function (e) {
                    $('.chkShow:input:checkbox').prop('checked', this.checked);
                });

                $('.chkShow').off("click").click(function (e) {
                    var chkBoxCounts = $(".chkShow:input:checkbox").length;
                    var CheckedChkBoxCounts = $(".chkShow:input:checkbox:checked").length;
                    if (chkBoxCounts == CheckedChkBoxCounts) {
                        $('#chkSelect_All').prop('checked', true);
                    }
                    else {
                        $('#chkSelect_All').prop('checked', false);
                    }
                });


                $('#tblDcrFreezeReleaseApproval').dataTable({ "bPaginate": false });

                //Fire Function from Go
                $("#btnGrantRelease").off("click").click(function () {
                    DcrFreeze.SetDCRFreezeReleaseApproval();
                });

               // DcrFreeze.UnblockUI("tree");
            }
        });
    },
    SetDCRFreezeReleaseApproval: function () {
        debugger;
        var jsonData = [];
        $('#btnGrantRelease').prop('disabled', true);
        var _objData = new Object();
        var error = false;
        $(".chkShow:input:checkbox:checked").each(function () {
            debugger;
            var trId = this.closest('tr').id;
            if ($("#ddlUserName_" + trId).val().trim() == '0' || $("#txtRemark_" + trId).val().trim() == '') {
                if ($("#ddlUserName_" + trId).val() == '0') {
                    fnMsgAlert('info', 'info', 'Select the Released By name for DCR Date ' + $("#" + trId + "_TP_DateShow").val());
                }
                if ($("#txtRemark_" + trId).val().trim() == '')
                    fnMsgAlert('info', 'info', 'Enter the Released Reason for DCR Date ' + $("#" + trId + "_TP_DateShow").val());
                error = true;
            }
            if (!error) {
                debugger;
                var rowData = {
                    User_Code: "" + $("#" + trId + "_hdnUser_Code").val() + "",
                    TP_Date: "" + $("#" + trId + "_hdnTP_Date").val() + "",
                    Activity_Code: "" + $("#" + trId + "_Activity_Code").text() + "",
                    Request_UserCode: "" + $("#ddlUserName_" + trId).val() + "",
                    Remark: "" + $("#txtRemark_" + trId).val() + "",
                };
                jsonData.push(rowData);
            }
            else
                $('#btnGrantRelease').prop('disabled', false);
        });

        if (jsonData.length > 0 && !error) {
            jsonData = JSON.stringify({ 'lstDCRFreezeModel': jsonData });
            $.ajax({
                start: DcrFreeze.blockUI("dataDiv"),
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                dataType: 'json',
                data: jsonData,
                url: "Approval/SetDCRFreezeReleaseApproval",
                success: function (jsonResult) {
                    if (jsonResult == "SUCCESS") {
                        fnMsgAlert('success', 'Success', 'DCR Freeze Successfully Released.');
                        DcrFreeze.GetDcrFreezeReleaseApproval();
                    }
                },
                error: function (e) {
                    DcrFreeze.UnblockUI("dataDiv");
                },
                complete: function () {
                    DcrFreeze.UnblockUI("dataDiv");
                }
            });
        } else {
            if (!error) {
                $('#btnGrantRelease').prop('disabled', false);
                fnMsgAlert('info', 'Information', 'Please Select the TP date.');
            }
        }


    },
    fngetreportedmanagers: function () {
        debugger;
        var result;
        var reporteduser = DcrFreeze.defaults.selectedUser_Code;
        $.ajax({
            url: '../HiDoctor_Master/UsercreationWizard/GetReportedMangers',
            type: "POST",
            data: "UserCode=" + reporteduser,
            async: false,
            success: function (JsonResult) {
                result = JsonResult;

            }
        });
        return result;
    }

}
function fnshowreleaseddata() {
    debugger;
    $("#tblDcrFreezeReleaseApproval").hide();
    $("#btnGrantRelease").hide();
    $("#tblDcrFreezeReleaseApproval_info").hide();
    $(".dataTables_filter").hide();
    var _objData = new Object();
    _objData.DivisionCode = DcrFreeze.defaults.ddlDivisionCode;
    _objData.Month = DcrFreeze.GetMonthToNumber(DcrFreeze.defaults.selectedMonthYear.split("-")[0]);
    _objData.Year = DcrFreeze.defaults.selectedMonthYear.split("-")[1];
    _objData.User_Code = DcrFreeze.defaults.selectedUser_Code;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        data: _objData,
        url: "Approval/GetDcrFreezeReleasedApprovalData",
        success: function (jsonData) {
            debugger;

            var grid = new ej.grids.Grid({
                dataSource: jsonData,
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                pageSettings: { pageSize: 100, pageSizes: [20, 40, 60, 80, 100], pageCount: 5 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search', 'ColumnChooser'],
                // rowSelected: fnRowSelected,                   
                aggregates: [],
                columns: [
                        { field: 'TP_DateShow', headerText: 'TP Date', width: 150, textAlign: 'center' },
                        { field: 'Activity_Code', headerText: 'TP Type', width: 150, textAlign: 'center' },
                        { field: 'Category', headerText: 'Work Category', width: 200, textAlign: 'center' },
                        { field: 'Work_Area', headerText: 'Work Place', width: 200, textAlign: 'center' },
                        { field: 'CP_Name', headerText: 'Beat/Patch Name', width: 200, textAlign: 'center' },
                        { field: 'Released_By', headerText: 'Released By', width: 200, textAlign: 'center' },
                        { field: 'Request_Released_By', headerText: 'Request Released By', width: 200, textAlign: 'center' },
                        { field: 'Released_Reason', headerText: 'Released Reason', width: 200, textAlign: 'center' },



                ],
              //  queryCellInfo: queryCellInfo,


            });
            grid.appendTo('#showreleaseddata');
        }

    });

}
//function queryCellInfo(args) {
//    debugger;
//    if (args.column.field == "Released_Reason") {
//        if (args.data.Released_Reason == "-nil-") {
//            args.cell.innerHTML = " "
//        }
//    }
//}
function fnBindActivityLockData(userCode) {
    debugger;
    var Content = '';
    $("#headerdata").html('');
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Approval/EmployeeDetails',
        data: 'user_Code=' + userCode,
        success: function (response) {
            debugger;
            Content += "<table class='table table-bordered'>";
            Content += "<thead style='#5E87B0 !important'>";
            Content += "<tr>";
            Content += "<th style='width:48%;'>User Details</th>";
            Content += "<th>Reporting Manager Details</th>";
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
            $("#headerdata").append(Content);
        }

    });
}
