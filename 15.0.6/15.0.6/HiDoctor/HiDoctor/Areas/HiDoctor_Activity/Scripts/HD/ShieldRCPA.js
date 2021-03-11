function fnGetdate() {
    // debugger;
    var today = new Date();
    var cdd = today.getDate();
    var cmm = today.getMonth() + 1;
    var cyy = today.getFullYear();
    var currentDate = cdd + '/' + cmm + '/' + cyy;
    today.setDate(today.getDate() - 30);
    var pdd = today.getDate();
    var pmm = today.getMonth() + 1;
    var pyy = today.getFullYear();
    var prevDate = pdd + '/' + pmm + '/' + pyy;


    $('#BatchfromDate').val(prevDate);
    $('#BatchtoDate').val(currentDate);
    //fnGetMarketingCampaignDetails();
}
function fnGetBPHeader() {
    debugger;
    fnGetMenuContentBP();
    var bpType = $("#batchtype").val();

    if ($("#batchtype").val() == "--Select Batch Processing Type--") {
        fnMsgAlert('info', 'Excel Upload', 'Please select Batch Processing type.');
        return false;
    }
    var effectivefrm = $("#BatchfromDate").val();
    var arrEffectivefrom = effectivefrm.split('/');
    var effectivefromdate = arrEffectivefrom[2] + '-' + arrEffectivefrom[1] + '-' + arrEffectivefrom[0]
    var effectiveto = $("#BatchtoDate").val();
    var arrEffectiveto = effectiveto.split('/');
    var effectivetodate = arrEffectiveto[2] + '-' + arrEffectiveto[1] + '-' + arrEffectiveto[0]
    if (bpType != null && bpType.length > 0) {
        $('#dvErrMsg').css('display', 'none');
        $('#dvErrMsg').html('');
        $.ajax({
            url: '../BatchProcessing/GetBPHeader',
            // dataType:"Application/json",
            type: "GET",
            data: "bp_Type=" + bpType + "&Effective_from=" + effectivefromdate + "&Effective_to=" + effectivetodate,
            success: function (JsonResult) {
                debugger;
                Json_Batch = JsonResult;
                var jsonresult = eval('(' + Json_Batch + ')');

                //var a = jsonresult.Tables["0"].Rows.Upload_Date;
                //var b = a.split('T');
                //var c = b[0].split('-');
                //var d = c[2] + '/' + c[1] + '/' + c[0];
                //var e = d + ' ' + b[1];

                $("#batchProcessingGRD").html('');
                if (jsonresult != '') {
                    // $('#batchProcessingGRD').html(jsonresult);

                    var grid = new ej.grids.Grid({
                        dataSource: jsonresult.Tables[0].Rows,
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
                                { field: 'Upload_File_Name', headerText: 'File Name', width: 150, textAlign: 'center' },
                                { field: 'Upload_Date', headerText: 'Date of Upload', width: 150, textAlign: 'center' },
                                { field: 'User_Name', headerText: 'Uploaded By', width: 200, textAlign: 'center' },
                                { field: 'Status', headerText: 'Upload Status', width: 200, textAlign: 'center' },
                                { field: 'Reupload', headerText: 'Action', width: 200, textAlign: 'center' },


                        ],
                        queryCellInfo: queryCellInfo,
                    });
                    grid.appendTo('#batchProcessingGRD');

                }
                else {
                    $('#batchProcessingGRD').html("No uploaded found.");
                }
            },
            error: function (res) {
                debugger;
                fnMsgAlert('info', 'Error', 'ERROR.');
                // alert("ERROR");
            }
        });

    }

    else {
        $('#dvErrMsg').html('Please select Batch Processing type.')
        $('#dvErrMsg').css('display', '');
    }
}
function queryCellInfo(args) {
    debugger;
    if (args.column.field == "Status") {
        if (args.data.Status == "FAILED") {

            args.cell.style.cursor = "pointer";
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "Error"
        }
    }
    if (args.column.field == "Status") {
        if (args.data.Status == "ERROR") {
            args.cell.style.cursor = "pointer";
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "Error"
        }
        $(args.cell).bind("click", function () {
            if (args.data.Status == "ERROR" || args.data.Status == "FAILED") {
                BPPopup(args.data.BP_ID);
            }

        })
    }
    if (args.column.field == "Reupload") {
        if (args.data.Reupload == "Retry") {
            args.cell.style.cursor = "pointer";
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.innerHTML = "Retry"
        }
        $(args.cell).bind("click", function () {
            debugger;
            if (args.data.Reupload == "Retry") {
                fnRedirectToUploadScreen();
            }
        })
    }
    if (args.column.field == "Status") {
        if (args.data.Status == "SUCCESS") {
            args.cell.innerHTML = "Success"
        }
    }
}
function fnGetMenuContentBP() {

    $.ajax({
        url: '/Home/GetMenuContent/',
        type: "POST",
        data: "A",
        success: function (jsMenu) {
            jsMenu = eval('(' + jsMenu + ')');
            menuContent_g = jsMenu;


        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}
function BPPopup(bpid) {
    debugger;
    $("#dvOverLay").overlay().load();
    $.ajax({
        url: '../BatchProcessing/GetBPErrorLog',
        type: "POST",
        data: "bpId=" + bpid,
        success: function (result) {
            debugger;
            if (result) {
                $('#batchProcessingErrorLogGRD').html(result);
            }
            else {
                $('#batchProcessingErrorLogGRD').html("No errors found.");
            }
        },
        error: function () {
            fnMsgAlert('error', 'Error', 'ERROR.');
        }
    });
}
function fnRedirectToUploadScreen() {
    $('#dvTab').tabs('option', 'selected', 0);
    $('#dvRedirect').hide();
    $('#FromDate').val('');
    $('#ToDate').val('');
    $('#file').val('');
    $('#dvMsgSuccess').hide();
    $('#dvMsgError').hide();
}

function fnDownloadErrorReport(bpId) {
    debugger;
    var bpId = $("#excelDownload").attr('value');
    if (bpId != '')
        $.ajax({
            url: "BatchProcessing/GetErrorReportID",
            type: "POST",
            data: "bpId=" + bpId,
            success: function () {
                window.open('../BatchProcessing/DownloadErrorReport')
            },
        });
}

function fnclear()
{
    $('#FromDate').val('');
    $('#ToDate').val('');
    $('#file').val('');
    $('#dvRedirect').hide();
    $('#dvMsgSuccess').html('');
    $('#dvMsgError').html('')
}