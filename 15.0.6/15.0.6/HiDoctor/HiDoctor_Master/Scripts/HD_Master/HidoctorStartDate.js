//Created By :Suamthi
//Date : 26/12/2013
var usercode = '';
var i;
var faultusers = [];

function HidoctorStartDate() {

    debugger;
    $.ajax({
        type: "GET",
        url: '../HiDoctor_Master/HidoctorStartDate/HtmlforHidoctorStartDate',
        data: "",
        success: function (result) {
            debugger;
            $('#divHidoctor').html('');
            if (result != '') {
                //result = eval('(' + result + ')');
                if (result.length > 0) {
                    var grid = new ej.grids.Grid({
                        dataSource: result,
                        showColumnChooser: true,
                        allowPaging: true,
                        allowGrouping: true,
                        allowSorting: true,
                        allowFiltering: true,
                        allowResizing: true,
                        allowCellMerging: true,
                        allowScrolling: true,
                        allowExcelExport: true,
                        pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                        filterSettings: { type: 'CheckBox' },
                        toolbar: ['Search', 'ColumnChooser'],
                        aggregates: [],
                        columns: [
                                { field: 'User_Name', headerText: 'User Name', width: 180, textAlign: 'center' },
                                { field: 'HiDOCTOR_Start_Date', headerText: 'HiDoctor Start Date', width: 250, textAlign: 'center' },
                                { field: 'Employee_Number', headerText: 'Employee Number', width: 220, textAlign: 'center' },
                                { field: 'Employee_Name', headerText: 'Employee Name', width: 220, textAlign: 'center' },
                                { field: 'User_Type_Name', headerText: 'User Designation ', width: 250, textAlign: 'center' },
                                { field: 'Region_Name', headerText: 'Region Name', width: 200, textAlign: 'center' },
                                //{ field: 'Employee_Code', headerText: 'Employee Code', width: 200, textAlign: 'center' },
                                { field: 'Reporting_Manager_Name', headerText: 'Reporting User Name', width: 200, textAlign: 'center' },
                                { field: 'Division_Name', headerText: 'Division', width: 200, textAlign: 'center' },

                        ]
                    });
                    grid.toolbarClick = function (args) {
                        //if (args['item'].id === 'divRegionType_excelexport') {
                        //    grid.excelExport();
                        //}
                    }

                    grid.appendTo('#divHidoctor');
                }
            }
        }
    });
}

function fnUserTreePostInit() {
}

//var selKeys = "";
//function fnUserTreeSelect(select, node) {
//    var lastSelectedNode = node.data.key;
//    $('#hdnUserCode').val(lastSelectedNode);
//    selKeys = $.map(node.tree.getSelectedNodes(), function (node) {
//        return node.data.key;
//    });

//}
var selKeys = new Array();
var SelTitleKeys = new Array();

function fnUserTreeSelect(select, node) {

    debugger;
    bindFlag = true;
    var lastSelectedNode = node.data.key;
    selKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.key;
    });
    SelTitleKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.title;
    });

}

//function fnUserTreeNodeClick(node) {     
//}

function fnToggleTree() {
    debugger;

    if ($("#spnTreeToggle").html() == "Hide Tree") {
        $("#dvTree").hide();
        $("#divMain").css('width', '60%');
        $("#spnTreeToggle").html('Show Tree');
    }
    else if ($("#spnTreeToggle").html() == "Show Tree") {
        $("#dvTree").show();
        $("#divMain").css('width', '60%');
        $("#spnTreeToggle").html('Hide Tree');
    }
}

function fnGetHidoctorStartDate() {
    debugger;

    $.blockUI();
    $.ajax({
        url: '../HiDoctor_Master/HidoctorStartDate/HtmlforHidoctorStartDate',
        type: "GET",
        success: function (result) {
            if (result != '') {
                $("#divHidoctor").html(result);
                $.unblockUI();
            }
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error:' + e.message);
            $.unblockUI();
        }
    });
}

function fnsubvalidate() {
    debugger;

    if (selKeys.length == 0) {
        fnMsgAlert('info', 'Info', 'Please Select Any User from UserTree');
        return false;
    }

    if ($.trim($("#txtstartDate").val()) == "") {
        fnMsgAlert('info', 'Info', 'Please Select The Start Date');
        return false;
    }

    if (!(fnValidateDateFormate($("#txtstartDate"), "StartDate"))) {
        return false;
    }
    return true;
}

function fnSubmit() {

    debugger;
    var result = fnsubvalidate();
    if (result) {
        if (fngetactualdate()) {

            $("#btnSave").attr("disabled", false);
            //$("#btnSave").attr("disabled", false);
            var day = $("#txtstartDate").val().split('/')[0];
            var month = $('#txtstartDate').val().split('/')[1];
            var year = $('#txtstartDate').val().split('/')[2];
            var StartDate = year + '-' + month + '-' + day;

            userCodes = selKeys.join('^');
            //for (var i = 0; i < selKeys.length; i++) {
            //    userCodes += selKeys[i] + '^';
            //}

            $.ajax({
                url: '../HiDoctor_Master/HidoctorStartDate/UpdateHidoctorStartDate',
                type: "POST",
                data: {
                    'startDate': StartDate,
                    'userCode': userCodes
                },
                success: function (data) {
                    if (data != '') {
                        if (isNaN(data)) {
                            if (data == 'success') {
                                fnMsgAlert('success', 'Success', 'Saved successfully');
                                $("#txtstartDate").val('');
                                $('#hdnUserCode').val() == "";
                                $("#dvUserTree").dynatree("getRoot").visit(function (node) {
                                    node.select(false);
                                });
                                selKeys = '';
                                // fnGetHidoctorStartDate();
                                HidoctorStartDate();
                                $("#btnSave").attr("disabled", false);
                                //$("#btnSave").attr("disabled", false);
                            }
                            else {
                                fnMsgAlert('info', 'Error', 'Sorry! An error occured,please try again later');
                                $("#btnSave").attr("disabled", false);
                                //$("#btnSave").attr("disabled", false);
                            }
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Caution', 'Insertion Failed');
                        $("#btnSave").attr("disabled", false);
                        //$("#btnSave").attr("disabled", false);
                        selKeys = '';
                    }

                }
            });
        }

    }

}

function fnClearAll() {
    debugger;

    $("#txtstartDate").val('');
    $('#hdnUserCode').val() == "";
    $("#divUserTree").dynatree("getRoot").visit(function (node) {
        node.select(false);
    });
    $("#btnSave").attr("disabled", true);
    //$("#btnSave").attr("disabled", true);
}

var response = '';
var joining_Date = '';

function fngetactualdate() {
    debugger;
    var result = true;
    var error = "";
    var UserArray = new Array();

    for (var i = 0; i < selKeys.length; i++) {
        var userObj = {};
        userObj.User_Code = selKeys[i];
        UserArray.push(userObj);
    }


    $.ajax({

        type: "POST",
        url: '../HiDoctor_Master/HidoctorStartDate/GetHiDoctorActualDate',
        // data: '{"Companycode":"' + $("#Companycode").val() + '","userCode":"' + $("#userCode").val() + '"}',
        data: JSON.stringify({ "lstUsers": UserArray }),
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            debugger;
            response = data;
            //var date = new Date($("#txtstartDate").val());
            //var _day = date.getDate();
            //var _month = date.getMonth();
            //var _year = date.getFullYear();
            //_month = _month + 1;
            //if (_month.toString().length == 1)
            //    _month = "0" + _month;
            //if (_day.toString().length == 1)
            //    _day = "0" + _day;
            //date = (_month + '-' + _day + '-' + _year);
            var date = $("#txtstartDate").val();
            var _day = date.split('/')[0];
            var _month = date.split('/')[1];
            var _year = date.split('/')[2];

            date = (_month + '-' + _day + '-' + _year);
            for (var i = 0; i < data.length; i++) {

                var joining_Date = new Date(eval(data[i].Date_of_Joining.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
                var _day = joining_Date.getDate();
                var _month = joining_Date.getMonth();
                var _year = joining_Date.getFullYear();
                _month = _month + 1;
                if (_month.toString().length == 1)
                    _month = "0" + _month;
                if (_day.toString().length == 1)
                    _day = "0" + _day;
                joining_Date = (_month + '-' + (_day) + '-' + _year);

                if (new Date(date) < new Date(joining_Date)) {
                    debugger;
                    if (error == '') {
                        error = data[i].User_Name + "(" + changedate + ")";
                        result = false;
                    }
                    else {
                        error += "</br>" + data[i].User_Name + "(" + changedate + ")";
                        result = false;
                    }

                }

            }


        }
    });
    if (!result) {
        debugger;
        $("#users").html('');
        $("#myModal").modal('show');
        // fnMsgAlert('error', 'Error', 'Hidoctor start date should be less than DCR first entered date. DCR First Entered Date for  ' + error);

        var Content = '';
        Content += '<table class="table table-bordered" style=" text-align: center;">';
        Content += '<thead>';
        Content += '<tr>';
        Content += '<th>User Name</th>';
        Content += '<th>Date Of Joining</th>';
        Content += '</tr>';
        Content += '</thead>';
        Content += '<tbody>';
        for (var i = 0; i < response.length; i++) {
            debugger;
            var joining_Date = new Date(eval(response[i].Date_of_Joining.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
            var _day = joining_Date.getDate();
            var _month = joining_Date.getMonth();
            var _year = joining_Date.getFullYear();
            _month = _month + 1;
            if (_month.toString().length == 1)
                _month = "0" + _month;
            if (_day.toString().length == 1)
                _day = "0" + _day;

            Content += '<tr>';
            Content += '<td>' + response[i].User_Name + '</td>';
            var changedate = (_day + '-' + _month + '-' + _year);
            Content += '<td>' + changedate + '</td>';
            Content += '</tr>';
        }
        Content += '</tbody>';
        Content += '</table>';        
        Content += '<p><h4>Note :</h4> Hidoctor start date should be greater than Date of Joining. </p>'
        $("#users").append(Content);

    }
    return result;
}

fnGetUserTreeByUserWithCheckBox = function (userCode, treeId, filterId) {
    debugger;
    if (userCode == "") {
        userCode = currentUserCode_g;
    }
    $('span').removeClass('childIcon');
    //if (userCode == curUserCode_g) {
    //    $('#dvPreviousNode').hide();
    //}
    //else {
    //    $('#dvPreviousNode').show();
    //}
    $('#' + treeId).block({
        message: '<h3>Loading...</h3>',
        css: { border: '1px solid #ddd' }
    });
    $.ajax({
        type: "POST",
        url: 'Master/UserTreeGenerationByUserCode',
        data: "userCode=" + userCode + "&includeOneLevelParent=NO",
        success: function (jsData) {
            debugger;
            if (jsData != '') {
                $('#' + filterId).hide();
                $("#" + treeId).show();
                $("#" + treeId).html(' ');
                $('#' + treeId).dynatree('destroy');
                $('#' + treeId).empty();
                $("#" + treeId).html(jsData);

                $("#" + treeId).dynatree({
                    checkbox: true,
                    onActivate: function (node) {
                        fnUserTreeNodeClick(node);
                    },
                    onClick: function (node, event) {
                        // Close menu on click
                        //if ($(event.target).hasClass("parent")) {
                        //    alert("You clicked " + node + ",  url=" + node.url);
                        //}
                        if ($(".contextMenu:visible").length > 0) {
                            $(".contextMenu").hide();
                        }
                    },
                    onCreate: function (node, span) {
                        bindUserContextMenu(span);
                    },
                    onKeydown: function (node, event) {
                        // Eat keyboard events, when a menu is open

                    },
                    onDeactivate: function (node) {
                    },
                    strings: {
                        loading: "Loading…",
                        loadError: "Load error!"
                    },
                    onSelect: function (select, node) {
                        // Get a list of all selected nodes, and convert to a key array:
                        fnUserTreeSelect(select, node);
                        //
                    },
                    onDblClick: function (node, event) {
                        var select = node.bSelected;
                        node.select(!select);
                        node.visit(function (node) {
                            node.select(!select);
                        });

                        //fnUserTreeNodeDblClick(node);
                    },
                    onPostInit: function (node, event) {
                        fnUserTreePostInit(node);
                    }
                });
                $("#dvAjaxLoad").hide();
                $("span.childIcon").removeClass('childIcon');
                //$("span.childIcon").unbind("click");
                //$("span.childIcon").bind("click", function (e) {
                //    //alert("Edit " + $.ui.dynatree.getNode(e.target));
                //    //fnShowChildNodes(e.target);
                //    e.preventDefault();
                //    fnAddNode(e);
                //    return false;
                //});
            }
        },
        error: function () {
            $('#' + treeId).unblock();
        },
        complete: function () {
            $('#' + treeId).unblock();
        }
        //}
    });
}