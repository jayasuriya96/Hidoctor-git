//Created By: SRISUDHAN//
//Created Date: 11-07-2013//
//Screen Name:RegionWeekendMapping//

//Sellect And Deselect CheckBox function
function fnSelectAllRegion() {
    $("#tree").dynatree("getRoot").visit(function (node) {
        node.select(true);
    });
}

function fnUnSelectAllRegion() {
    $("#tree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
}
//Auto fill WeekendGroup Name
function fnGetWeekendGroupHeader() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '/RegionWeekendMapping/GetWeekendGroupHeader/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                var weekendGroup = "[";
                for (var i = 0; i < jsData.length; i++) {
                    weekendGroup += "{label:" + '"' + "" + jsData[i].Weekend_Off_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Weekend_Off_Code + "" + '"' + "}";
                    if (i < jsData.length - 1) {
                        weekendGroup += ",";
                    }
                }
                weekendGroup += "];";
                weekendGroupJson_g = eval(weekendGroup);
                autoComplete(weekendGroupJson_g, "txtWeekendGroup", "hdnWeekendGroupCode", "Groupname");
            }
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

//insert the Mapping data..


function fnSubmit() {
    var startMonth = fngetMonthNumber($('#txtFrom').val().split('-')[0]);
    var endMonth = fngetMonthNumber($('#txtTo').val().split('-')[0]);
    var startYear = $('#txtFrom').val().split('-')[1];
    var endYear = $('#txtTo').val().split('-')[1];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var disJson = jsonPath(weekendGroupJson_g, "$.[?(@.label=='" + $("#txtWeekendGroup").val() + "')]");

    if ($("#txtWeekendGroup").val() == '') {
        fnMsgAlert('info', 'Info', 'Please select any one group');
        return;
    }
    if (disJson != false) {
        $("#hdnWeekendGroupCode").val(disJson[0].value)
    }
    else {
        $("#hdnWeekendGroupCode").val('');
    }
    if ($("#hdnWeekendGroupCode").val() == '') {
        fnMsgAlert('info', 'Info', 'Please select any one valid group');
        return false;
    }
    if ($("#hdnWeekendGroupCode").val() == undefined) {
        fnMsgAlert('info', 'Info', 'Please select any one valid group');
        return false;
    }
    if ($("#txtFrom").val() == "") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtTo").val() == "") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }
    if (selKeys == "") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Check Region.');
        return false;
    }
    if (selKeys == ",") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Check Region.');
        return false;
    }

    //if (startMonth <= todaymonth_g) {
    //    fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Select Fucture Month');
    //    HideModalPopup("dvloading");
    //    return false;
    //}
    //if (startYear < todayyear_g) {
    //    fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Select Fucture Year');
    //    HideModalPopup("dvloading");
    //    return false;
    //}

    var Currentdate = new Date(todayyear_g + "/" + todaymonth_g + "/01");
    var effectiveDate = new Date(startYear + "/" + ((parseInt(startMonth) < 10) ? "0" + startMonth : startMonth) + "/01");

    //if (Currentdate >= effectiveDate) {
    //    fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Select Fucture Month');
    //    HideModalPopup("dvloading");
    //    return false;
    //}


    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }

    if (parseInt(endMonth) >= 10) {
        endDate = endYear + "-" + endMonth + "-" + days;
    }
    else {
        endDate = endYear + "-0" + endMonth + "-" + days;
    }
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#Region_Code").val() == "") {
        fnMsgAlert('error', 'Sales Drive', 'Please select region from region tree')
        return false;
    }
    $.ajax({
        url: '../HiDoctor_Master/RegionWeekendMapping/InsertWeekendGroup/',
        type: "POST",
        data: "weekendOffGroup=" + $("#hdnWeekendGroupCode").val() + "&effectiveFrom=" + startDate + "&effectiveTo=" + endDate + "&regionCodes=" + selKeys + "&status=1",
        success: function (data) {

            if (data.split('_')[0] == 'Overlap') {
                var notInserted = (data.split('_')[1]).slice(0, -1);
                var notInsertedCount = (notInserted.split('^')).length;
                var allRegionCont = selKeys.length;
                var resultString = "";

                $("#tree").dynatree("getRoot").visit(function (node) {
                    if ((notInserted.split(node.data.key)).length > 1) {
                        resultString += node.data.title + ',';
                    }
                });



                if (notInsertedCount == allRegionCont) {
                    //alert("All the region have mapped with a weekend group in this period.");
                    fnMsgAlert('info', 'Region Weekend Group Mapping', 'All the region have mapped with a weekend group in this period');
                }
                else {
                    // alert(resultString.slice(0, -1) + " are not saved. All other regions are saved successfully");
                    fnMsgAlert('info', 'Region Weekend Group Mapping', resultString.slice(0, -1) + '"are not saved. All other regions are saved successfully"');
                }
            }
            else if (data.split('_')[0] == 'SUCCESS') {
                if (data.split('_')[1].length > 0) {
                    var notInserted = (data.split('_')[1]).slice(0, -1);
                    var resultString = "";

                    $("#tree").dynatree("getRoot").visit(function (node) {
                        if ((notInserted.split(node.data.key)).length > 1) {
                            resultString += node.data.title + ',';
                        }
                    });

                    //  alert(resultString.slice(0, -1) + "are not saved. All other regions are saved successfully");
                    fnMsgAlert('info', 'Region Weekend Group Mapping', resultString.slice(0, -1) + '"are not saved. All other regions are saved successfully"');
                }
                else {
                    fnMsgAlert('info', 'Region Weekend Group Mapping', 'Saved Sucessfully');
                }
            }
            fnClearAll();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}
//get month no
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}
//get days count
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
//clear all function
function fnClearAll() {
    $("#txtWeekendGroup").val('');
    $("#txtFrom").val('');
    $("#txtTo").val('');
    $("#tree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
}


//*********************RegionWeekEndMapping Report****************************//

function fnWeeKEndGroupBindRegionTree(id) {

    $("#" + id).html('');
    $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionTree',
        data: "A",
        success: function (jsData) {
            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(jsData);
            $("#" + id).dynatree({
                checkbox: false,
                ajaxDefaults: {
                    type: 'POST',
                    cache: false
                },
                onActivate: function (node) {
                    fnWeekendGroupRegionTreeActivate(node);
                },
                onClick: function (node, event) {
                    // Close menu on click
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                onCreate: function (node, span) {
                    bindRegionContextMenu(span);
                },
                onKeydown: function (node, event) {
                    // Eat keyboard events, when a menu is open
                },
                onDeactivate: function (node) {
                },
                dnd: {
                    onDragStart: function (node) {
                        fnRegionTreeDragStart(node);
                        logMsg("tree.onDragStart(%o)", node);
                        return true;
                    },
                    onDragStop: function (node) {
                        // This function is optional.
                        logMsg("tree.onDragStop(%o)", node);
                    },
                    autoExpandMS: 1000,
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    onDragEnter: function (node, sourceNode) {
                        logMsg("tree.onDragEnter(%o, %o)", node, sourceNode);
                        return true;
                    },
                    onDragOver: function (node, sourceNode, hitMode) {
                        logMsg("tree.onDragOver(%o, %o, %o)", node, sourceNode, hitMode);
                        // Prevent dropping a parent below it's own child
                        if (node.isDescendantOf(sourceNode)) {
                            return false;
                        }
                        // Prohibit creating childs in non-folders (only sorting allowed)
                        if (!node.data.isFolder && hitMode === "over") {
                            return "after";
                        }
                    },
                    onDrop: function (node, sourceNode, hitMode, ui, draggable) {
                        sourceNode.move(node, hitMode);
                        fnRegionTreeDrop(node, sourceNode, hitMode, ui, draggable);
                        // expand the drop target
                        //        sourceNode.expand(true);
                    },
                    onDragLeave: function (node, sourceNode) {
                        logMsg("tree.onDragLeave(%o, %o)", node, sourceNode);
                    }
                },
                strings: {
                    loading: "Loading…",
                    loadError: "Load error!"
                },
                onDblClick: function (node, event) {
                    fnRegionTreeNodeClick(node);
                },
                onPostInit: function (node, event) {
                    fnWeekendGroupRegionTreePostInit(node);
                }

            });
            $("#dvAjaxLoad").hide();
        }

    });
}



function fnRegionWeekendReport() {
    var regionCode = $('#hdnRegionCode').val();
    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Master/RegionWeekendMapping/GetWeekendGroup/',
        type: "POST",
        data: "RegionCode=" + $("#hdnRegionCode").val() + "&Mode=Report",
        success: function (response) {
            jsData = eval('(' + response + ')');
            var content = "";
            content += "<table class='data display datatable' id='tbl_WeekendGroup'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>Region Name</th>";
            content += "<th>Region type</th>";
            content += "<th>Reporting Region</th>";
            content += "<th>Reporting Region type</th>";
            content += "<th>Weedend off group Name</th>";
            content += "<th>Effective From</th>";
            content += "<th>Effective To</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";
            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "<tr>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Region_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Region_Type_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Manager_Region_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Manager_Region_Type_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Weekend_Off_Name;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Effective_From;
                content += "</td>";
                content += "<td>";
                content += jsData.Tables[0].Rows[i].Effective_To;
                content += "</td>";
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
            $("#divReport").html(content);
            $("#divPrint").html(content);
            //            if ($.fn.dataTable) { $('#tbl_Target').dataTable({ "sPaginationType": "full_numbers" }); };
            if ($.fn.dataTable) {
                $.datepicker.regional[""].dateFormat = 'dd/mm/yy';
                $.datepicker.setDefaults($.datepicker.regional['']);
                $('#tbl_WeekendGroup').dataTable({
                    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
                });
            };
            fninializePrint("divPrint", "ifrmPrint", "divReport");
            $("#divReport").show();
            HideModalPopup("dvloading");
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });

}


function fnPrint(divId, iFrameId) {
    try {
        var oIframe = document.getElementById(iFrameId);
        var oContent = document.getElementById(divId).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write("<html><head> <style media='all'>th, td{border-left:1px solid #000;border-top:1px solid #000;} table{border:1px solid #111;font-family:Arial;font-size:10px} </style> </head><body  onload='this.print();' this.print();'><center>");
        oDoc.write(oContent + "</center></body></html>");
        // oDoc.write("<html><head></head><body  onload='this.print();'><center>");
        // oDoc.write(oContent + "</center></body></html>");
        oDoc.close();
    }
    catch (e) {
        self.print();
    }
}

function fninializePrint(divId, iFrameId, mainDiv) {
    $('#' + mainDiv + ' #dvPrint').remove();
    $("#" + mainDiv + " .TableTools").append("<div id='dvPrint' onclick='fnPrint(\"" + divId + "\",\"" + iFrameId + "\");' title='Print Table' class='TableTools_button' style='background: url(../Content/DataTable/media/images/print.png) no-repeat center center;border: 1px solid #f0f0f0;height: 30px; width: 30px;cursor:pointer;'></div>");
}



//*******************************************************************REGION WEEKEND MAPPING EDIT*************************************************************************************//


//bind tree//
function fnWeeKEndGroupEditRegionTree(id) {

    $("#" + id).html('');
    $("#dvAjaxLoad").show();
    $.ajax({
        type: "POST",
        url: 'Master/GenerateRegionTree',
        data: "A",
        success: function (jsData) {

            $("#" + id).html(' ');
            $('#' + id).dynatree('destroy');
            $('#' + id).empty();
            $("#" + id).html(jsData);
            $("#" + id).dynatree({
                checkbox: false,
                ajaxDefaults: {
                    type: 'POST',
                    cache: false
                },
                onActivate: function (node) {
                    fnWeekendGroupEditRegionTreeActivate(node);
                },
                onClick: function (node, event) {
                    // Close menu on click
                    if ($(".contextMenu:visible").length > 0) {
                        $(".contextMenu").hide();
                    }
                },
                onCreate: function (node, span) {
                    bindRegionContextMenu(span);
                },
                onKeydown: function (node, event) {
                    // Eat keyboard events, when a menu is open
                },
                onDeactivate: function (node) {
                },
                dnd: {
                    onDragStart: function (node) {
                        fnRegionTreeDragStart(node);
                        logMsg("tree.onDragStart(%o)", node);
                        return true;
                    },
                    onDragStop: function (node) {
                        // This function is optional.
                        logMsg("tree.onDragStop(%o)", node);
                    },
                    autoExpandMS: 1000,
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    onDragEnter: function (node, sourceNode) {
                        logMsg("tree.onDragEnter(%o, %o)", node, sourceNode);
                        return true;
                    },
                    onDragOver: function (node, sourceNode, hitMode) {
                        logMsg("tree.onDragOver(%o, %o, %o)", node, sourceNode, hitMode);
                        // Prevent dropping a parent below it's own child
                        if (node.isDescendantOf(sourceNode)) {
                            return false;
                        }
                        // Prohibit creating childs in non-folders (only sorting allowed)
                        if (!node.data.isFolder && hitMode === "over") {
                            return "after";
                        }
                    },
                    onDrop: function (node, sourceNode, hitMode, ui, draggable) {
                        sourceNode.move(node, hitMode);
                        fnRegionTreeDrop(node, sourceNode, hitMode, ui, draggable);
                        // expand the drop target
                        //        sourceNode.expand(true);
                    },
                    onDragLeave: function (node, sourceNode) {
                        logMsg("tree.onDragLeave(%o, %o)", node, sourceNode);
                    }
                },
                strings: {
                    loading: "Loading…",
                    loadError: "Load error!"
                },
                onDblClick: function (node, event) {
                    fnRegionTreeNodeClick(node);
                },
                onPostInit: function (node, event) {
                    fnWeekendGroupEditRegionTreePostInit(node);
                }

            });
            $("#dvAjaxLoad").hide();
        }

    });



}

// Edit tag report Bind//
function fnRegionWeekendEdit() {
    var regionCode = $('#hdnEditRegionCode').val();
    ShowModalPopup("dvloading");
    $.ajax({
        url: '../HiDoctor_Master/RegionWeekendMapping/GetWeekendGroup/',
        type: "POST",
        data: "RegionCode=" + $("#hdnEditRegionCode").val() + "&Mode=EDIT",
        success: function (response) {
            jsData = eval('(' + response + ')');
            var content = "";
            var no = 0;
            content += "<table class='data display datatable' id='tbl_WeekendGroupEdit'>";
            content += "<thead>";
            content += "<tr>";
            content += "<th>SLNO</th>";
            content += "<th>Weedend off group Name</th>";
            content += "<th>Effective From</th>";
            content += "<th>Effective To</th>";
            content += "<th>Action</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";

            var currentDate = new Date(todayyear_g + "-" + todaymonth_g + "-01");

            if (jsData.Tables[0].Rows.length > 0) {
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    no++
                    content += "<tr>";
                    content += "<td>" + no + "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Weekend_Off_Name;
                    content += "<input type='hidden' id='hdnUpdateRegionCode' />";
                    content += "<input type='hidden' id='hdnUpdategroupCode' />";
                    content += "<input type='hidden' id='hdnoldefffrom' />";
                    content += "<input type='hidden' id='hdnoldeffto' />";
                    //content += "<input type='hidden' id='hdnWeekendOffName_" + i + "' value='" + jsData.Tables[0].Rows[i].Weekend_Off_Name + "' />";
                    //content += "<input type='hidden' id='hdnEfffrom_" + i + "' value='" + jsData.Tables[0].Rows[i].Effective_From + "' />";
                    //content += "<input type='hidden' id='hdnTo_" + i + "' value='" + jsData.Tables[0].Rows[i].Effective_To + "' />";
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Effective_From;
                    content += "</td>";
                    content += "<td>";
                    content += jsData.Tables[0].Rows[i].Effective_To;
                    content += "</td>";

                    var effDate = new Date("01 " + jsData.Tables[0].Rows[i].Effective_To);
                    if (currentDate > effDate) {
                        content += "<td></td>";
                    }
                    else {
                        content += "<td>";
                        content += "<a href='#' onclick ='fnEdit(\"" + jsData.Tables[0].Rows[i].Weekend_Off_Code + "_" + jsData.Tables[0].Rows[i].Region_Code + "_" + jsData.Tables[0].Rows[i].Weekend_Off_Name + "_" + jsData.Tables[0].Rows[i].Effective_From + "_" + jsData.Tables[0].Rows[i].Effective_To + "\")'>Edit</a>";
                        content += "</td>";
                    }
                    content += "</tr>";
                }
                content += "</tbody>";
                content += "</table>";
                $("#divEdit").html(content);
                if ($.fn.dataTable) { ({ "sPaginationType": "full_numbers" }); };

                $("#divEdit").show();
                HideModalPopup("dvloading");
            }
            else {
                $("#divEdit").html("");
                $('#Lbl_Region_name').html("");
                fnMsgAlert('info', 'Weekend Group Region Mapping', 'No Data found.');
                HideModalPopup("dvloading");
            }
        },
        error: function () {
            fnMsgAlert('info', 'Report', 'Error.');
            HideModalPopup("dvloading");
        }

    });

}
//edie
function fnEdit(val) {
    $("#modal2").show()
    var weekendOffCode = val.split('_')[0]
    var regionCode = val.split('_')[1]
    var weekendOffName = val.split('_')[2]
    var effectiveFrom = val.split('_')[3]
    var effectiveto = val.split('_')[4]

    $("#txtgroupname").val(weekendOffName);
    $("#hdngroupnameCode").val(weekendOffCode);
    $("#txtFrom_month").val(effectiveFrom);
    $("#txtTo_month").val(effectiveto);
    $("#hdnUpdateRegionCode").val(regionCode);
    $("#hdnUpdategroupCode").val(weekendOffCode);
    $("#hdnoldefffrom").val(effectiveFrom);
    $("#hdnoldeffto").val(effectiveto);
}

function fnUpdate() {
    var weekendOffCode = $("#hdngroupnameCode").val();
    var regionCode = $('#hdnUpdateRegionCode').val();
    var weekendOffName = $("#txtgroupname").val();
    var effectiveFrom = $("#txtFrom_month").val();
    var effectiveto = $("#txtTo_month").val();

    var oldeffectiveFrom = $("#hdnoldefffrom").val();
    var oldeffectiveto = $("#hdnoldeffto").val();

    var oldstartMonth = fngetMonthNumber($("#hdnoldefffrom").val().split('-')[0]);
    var oldendMonth = fngetMonthNumber($("#hdnoldeffto").val().split('-')[0]);
    var oldstartYear = $("#hdnoldefffrom").val().split('-')[1];
    var oldendYear = $("#hdnoldeffto").val().split('-')[1];
    var oldmonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var days = daysInMonth(oldendMonth, oldendYear);
    var oldstartDate = "", oldendDate = "";
    if (parseInt(oldstartMonth) >= 10) {
        oldstartDate = oldstartYear + "-" + oldstartMonth + "-01";
    }
    else {
        oldstartDate = oldstartYear + "-0" + oldstartMonth + "-01";
    }

    if (parseInt(oldendMonth) >= 10) {
        oldendDate = oldendYear + "-" + oldendMonth + "-" + days;
    }
    else {
        oldendDate = oldendYear + "-0" + oldendMonth + "-" + days;
    }

    var odt1 = new Date(oldstartYear + "/" + oldstartMonth + "/01");
    var odt2 = new Date(oldendYear + "/" + oldendMonth + "/" + days);

    var disJson = jsonPath(weekendGroupJson_g, "$.[?(@.label=='" + $("#txtgroupname").val() + "')]");

    if ($("#hdngroupnameCode").val() == '') {
        fnMsgAlert('info', 'Info', 'Please select any one valid group');
        return false;
    }
    if ($("#hdngroupnameCode").val() == undefined) {
        fnMsgAlert('info', 'Info', 'Please select any one valid group');
        return false;
    }

    if ($("#txtgroupname").val() == "") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please enter group month.');
        HideModalPopup("dvloading");
        return false;
    }

    if ($("#txtFrom_month").val() == "") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please enter Start month.');
        HideModalPopup("dvloading");
        return false;
    }
    if ($("#txtTo_month").val() == "") {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please enter End month.');
        HideModalPopup("dvloading");
        return false;
    }

    if (odt1 > odt2) {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }


    var startMonth = fngetMonthNumber($("#txtFrom_month").val().split('-')[0]);
    var endMonth = fngetMonthNumber($("#txtTo_month").val().split('-')[0]);
    var startYear = $("#txtFrom_month").val().split('-')[1];
    var endYear = $("#txtTo_month").val().split('-')[1];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var days = daysInMonth(endMonth, endYear);
    var startDate = "", endDate = "";
    if (parseInt(startMonth) >= 10) {
        startDate = startYear + "-" + startMonth + "-01";
    }
    else {
        startDate = startYear + "-0" + startMonth + "-01";
    }

    if (parseInt(endMonth) >= 10) {
        endDate = endYear + "-" + endMonth + "-" + days;
    }
    else {
        endDate = endYear + "-0" + endMonth + "-" + days;
    }
    var dt1 = new Date(startYear + "/" + startMonth + "/01");
    var dt2 = new Date(endYear + "/" + endMonth + "/" + days);
    if (dt1 > dt2) {
        fnMsgAlert('info', 'Region Weekend Group Mapping', 'Start Month&Year should be less than End Month&Year.');
        HideModalPopup("dvloading");
        return false;
    }
    var Currentdate = new Date(todayyear_g + "/" + todaymonth_g + "/01");
    var effectiveDate = new Date(startYear + "/" + ((parseInt(startMonth) < 10) ? "0" + startMonth : startMonth) + "/01");

    //if (Currentdate >= effectiveDate) {
    //    fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Select Fucture Month');
    //    HideModalPopup("dvloading");
    //    return false;
    //}


    $.ajax({

        url: '../HiDoctor_Master/RegionWeekendMapping/UpdateWeekendGroup/',
        type: "POST",
        data: "weekendOffCode=" + weekendOffCode + "&regionCode=" + regionCode + "&effectiveFrom=" + startDate + "&effectiveTo=" + endDate + "&status=1" + "&oldeffectivefrom=" + oldstartDate + "&oldeffectiveto=" + oldendDate,
        success: function (data) {



            if (data.split('_')[0] == 'Overlap') {
                fnMsgAlert('info', 'Region Weekend Group Mapping', 'Other Weekend Group is mapped for this period.');
            }
            else if (data == 'SUCCESS') {
                // alert("Updated Successfull");
                fnMsgAlert('info', 'Region Weekend Group Mapping', 'Updated Successfully.');                
            }
            else {
                //alert("Please Check");
                fnMsgAlert('info', 'Region Weekend Group Mapping', 'Please Check.');
            }
            $("#modal2").hide();
            fnRegionWeekendEdit();
        },

        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });




}

function fnGetWeekendGroupUpdate() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '../RegionWeekendMapping/GetWeekendGroupHeader/',
        type: "POST",
        data: "a",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.length > 0) {
                var weekendGroup = "[";
                for (var i = 0; i < jsData.length; i++) {
                    weekendGroup += "{label:" + '"' + "" + jsData[i].Weekend_Off_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Weekend_Off_Code + "" + '"' + "}";
                    if (i < jsData.length - 1) {
                        weekendGroup += ",";
                    }
                }
                weekendGroup += "];";
                weekendGroupJson_g = eval(weekendGroup);
                autoComplete(weekendGroupJson_g, "txtgroupname", "hdngroupnameCode", "txtGroupname");
            }
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}


