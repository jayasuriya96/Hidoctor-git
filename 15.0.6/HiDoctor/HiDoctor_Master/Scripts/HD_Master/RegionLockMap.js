var json_g1 = "";
function fnOpenTree() {
    $("#regiontree").slideDown();
    $("#imggr").hide();
    $("#imgless").show()
    $('#divleft').addClass('col-lg-3')
    $('#dataDiv').removeClass('col-lg-12')
    $('#dataDiv').addClass('col-lg-9')
}
function fnCloseTree() {
    $("#regiontree").slideUp();
    $("#imggr").show();
    $("#imgless").hide()
    $('#divleft').removeClass('col-lg-3')
    $('#dataDiv').addClass('col-lg-12')
    $('#dataDiv').removeClass('col-lg-9')
}

function fnGetActiveRegionLockMappingTableFormat(showMessage) {
    debugger;
    if (!showMessage) {
        fnShowMessage('', '');
    }
    var content = '';
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Organogram/GetActiveRegionLockMappingHTMLFormat',
        success: function (response) {
            debugger;
            $('#dvRegionLockMappingGrid').html('');
            var grid = new ej.grids.Grid({
                dataSource: response,
                // rowSelected: fnRowSelected,
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                allowExcelExport: true,
                height: 330,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search', 'ColumnChooser'],
                aggregates: [],
                columns: [
                    { field: 'Region_Type_Name', headerText: 'Region Type Name', width: 150, textAlign: 'center' },
                    { field: 'Region_Name', headerText: 'Region Name', width: 150, textAlign: 'center' },
                    { field: 'Created_DateTime', headerText: 'Mapped Date', width: 100, textAlign: 'center' },
                    { field: 'Region_Status', headerText: 'Region Status', width: 100, textAlign: 'center' },
                    { headerText: 'Action', template: "<a href=# ;>Unmap</a>", width: 100, textAlign: 'center' },
                ],
                queryCellInfo: queryCellInfo,
            });
            grid.appendTo('#dvRegionLockMappingGrid');

        },
        error: function (e) {
            fnShowMessage('ERROR', e.responseText);
        }
    });
}


function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "Region Status") {
        debugger;
        if (args.data.Region_Status == 1) {
            debugger;
            args.cell.innerHTML = "Active";
        }
        else {
            args.cell.innerHTML = "Inactive";
        }
    }

    if (args.column.headerText == "Action") {
        if (args.cell.innerText == "[Unmap]") {
            args.cell.style.cursor = "pointer";
            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnUnmapRegionlock(\"" + args.data.Region_Code + "\");''>Unmap</a>"
        }
        $(args.cell).bind("click", function () {
            debugger;

            fnUnmapRegionlock(args.data.Region_Code);

        })
    }
}
function fnGetMappedRegion() {
    debugger;
    $("#dvAjaxLoad").show();
    $.blockUI();
    //var CompanyCode = CompanyCode;
    selKeys = [];
    $.ajax({
        url: '../HiDoctor_Master/Organogram/GetMappedRegion/',
        type: "GET",
        // data: "A",
        success: function (response) {
            debugger;
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            json_g1 = response;
            debugger;
            // selKeys = [];
            //  if (response.length>0 && response != '' && response != null) {
            $("#regiontree").dynatree("getRoot").visit(function (node) {
                debugger;
                var region = $.grep(response, function (element, index) {
                    return element.Region_Code == node.data.key;
                });
                //var region = jsonPath(response, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (region.length > 0) {
                    // node.select(true);

                    debugger;
                    node.data.unselectable = true; //make it unselectable
                    node.data.hideCheckbox = true; //hide the checkbox (mo
                    node.render(true);
                    node.select(true);
                    $(node.span).css("background-color", "lightgreen");
                    $('.span.dynatree-checkbox').prop('checked', false);
                }
                else {
                    // node.select(false);
                    node.data.unselectable = false;
                    node.data.hideCheckbox = false;
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "");
                }
            });
        },
        error: function (e) {
            fnShowMessage('ERROR', e.responseText);
        }
    });
}


function fnGetActiveRegionLockJson(showMessage) {
    debugger;
    if (!showMessage) {
        fnShowMessage('', '');
    }
    selKeys = [];
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Organogram/GetActiveRegionLockJson',
        success: function (response) {
            json_g1 = response;
            debugger;
            // selKeys = [];
            //  if (response.length>0 && response != '' && response != null) {
            $("#regiontree").dynatree("getRoot").visit(function (node) {
                var region = jsonPath(response, "$.[?(@.Region_Code=='" + node.data.key + "')]");
                if (region.length > 0) {
                    // node.select(true);


                    node.data.unselectable = true; //make it unselectable
                    node.data.hideCheckbox = true; //hide the checkbox (mo
                    node.render(true);
                    node.select(true);
                    $(node.span).css("background-color", "lightgreen");
                    $('.span.dynatree-checkbox').prop('checked', false);
                }
                else {
                    // node.select(false);
                    node.data.unselectable = false;
                    node.data.hideCheckbox = false;
                    node.render(true);
                    node.select(false);
                    $(node.span).css("background-color", "");
                }
            });
            // }
            //if (response != null && response.length > 0) {
            //    $("#regiontree").dynatree("getRoot").visit(function (node) {
            //        var region = jsonPath(response, "$[?(@.Region_Code=='" + node.data.key + "')]");
            //        if (region) {
            //            node.select(true);
            //        }
            //    });
            //}
        },
        error: function (e) {
            fnShowMessage('ERROR', e.responseText);
        }
    });
}

function fnShowMessage(messageType, Msg) {
    if (messageType == "SUCCESS") {
        //$('#warningmessage').html('');
        //$('#warningmessage').css('display', 'none')
        //$('#errormsg').html('');
        //$('#errormsg').css('display', 'none');
        //$('#successmsg').html(Msg);
        fnMsgAlert('success', 'Region Lock Mapping', Msg);
        return false;
        //$('#successmsg').css('display', '');
    }
    else if (messageType == "WARNING") {
        //$('#warningmessage').html(Msg);
        fnMsgAlert('info', 'Region Lock Mapping', Msg);
        return false;
        //$('#warningmessage').css('display', '')
        //$('#errormsg').html('');
        //$('#errormsg').css('display', 'none');
        //$('#successmsg').html('');
        //$('#successmsg').css('display', 'none');
    }
    else if (messageType == "ERROR") {
        //$('#warningmessage').html('');
        //$('#warningmessage').css('display', 'none')
        fnMsgAlert('Error', 'Region Lock Mapping', Msg);
        return false;
        //$('#errormsg').html(Msg);
        //$('#errormsg').css('display', '');
        //$('#successmsg').html('');
        //$('#successmsg').css('display', 'none');
    }
    else {
        $('#warningmessage').html('');
        $('#warningmessage').css('display', 'none')
        $('#errormsg').html('');
        $('#errormsg').css('display', 'none');
        $('#successmsg').html('');
        $('#successmsg').css('display', 'none');
    }
}

//function fnValidation() {
//    var errMsg = "";
//    //if (selKeys.length == 0) {
//    //    errMsg = "Please select atlease one region.<br />";
//    //}
//    if ($.trim($('#txtDateFrom').val()).length == 0) {
//        errMsg += "Please choose the Effective from. <br />";
//    }
//    if ($.trim($('#txtDateTo').val()).length == 0) {
//        errMsg += "Please choose the Effective To. <br />";
//    }

//    if ($.trim($('#txtDateFrom').val()).length > 0 && $.trim($('#txtDateTo').val()).length > 0) {
//        var sdate = $('#txtDateFrom').val().split('/');
//        sdate = sdate[1] + '/' + sdate[0] + '/' + sdate[2];
//        var edate = $('#txtDateTo').val().split('/');
//        edate = edate[1] + '/' + edate[0] + '/' + edate[2];

//        if (new Date(sdate) > new Date(edate)) {
//            errMsg += "Effective from greater than Effective To. <br />"
//        }


//    }

//    if (errMsg.length > 0) {
//        fnShowMessage('WARNING', errMsg);
//        return false;
//    }
//    else {
//        fnShowMessage('', '');
//        return true;
//    }
//}

function fnSave() {
    debugger;
    // if (fnValidation()) {
    var RegionLockArr = new Array();
    if (selKeys.length == 0) {
        debugger;
        fnMsgAlert('info', 'Region Lock Mapping', 'Please Select atleast one Region');
        return false;
    }
    for (var i = 0; i < selKeys.length; i++) {
        var regionData = {};

        regionData.Region_Code = selKeys[i];
        // regionData.Region_Code = json_g1;

        RegionLockArr.push(regionData);
    }
    //for (var i = 0; i < json_g1.length; i++) {
    //    var region = {};
    //    region.Region_Code = json_g1[i].Region_Code;
    //    // regionData.Region_Code = json_g1;

    //    RegionLockArr.push(region);
    //}
    $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/Organogram/InsertRegionLock',
        data: "regionLockJson=" + JSON.stringify(RegionLockArr),
        success: function (response) {
            debugger;
            $("#dvAjaxLoad").hide();
            $.unblockUI();
            fnShowMessage('SUCCESS', "Region Lock mapped successfully.");
            fnGetActiveRegionLockMappingTableFormat(true);

            fnGetActiveRegionLockJson(true);
            $('#txtDateFrom').val('');
            $('#txtDateTo').val('');
        },
        error: function (e) {
            fnShowMessage('ERROR', e.responseText);
        }
    });

    //}
}
function fnUnmapRegionlock(Regioncode) {
    debugger;
    $("#dvTab").block();
    bootbox.confirm({
        message: "<h3>Are you sure! Do you want to unmap the region?</h3>",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },

        callback: function (result) {
            if (result == true) {
                debugger;
                $.ajax({
                    url: '../HiDoctor_Master/Organogram/UnmapRegionslock/',
                    type: "GET",
                    data: "Regioncode=" + Regioncode,
                    success: function (result) {
                        debugger
                        fnMsgAlert('success', 'Region Lock Mapping', 'Region Unmapped successfully');
                        selKeys = [];
                        fnGetActiveRegionLockJson();
                        fnGetActiveRegionLockMappingTableFormat();
                        $("#dvTab").unblock();
                    }
                })
            }
            else {
                $("#dvTab").unblock();
            }
        }
    })
}