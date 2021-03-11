//Created By: SRISUDHAN//
//Created Date: 09-12-2013//
//Screen Name:UserTypeActivityMapping//

//genarate usertypetree//

var userTypeCode_g = "";
var activityTypeCode_g = "";
var mappedCode_g = "";
var editUsertypeCode_g = "";
var strTreeUserType = "";

function fnUserTypeSubMenu(jsonData, parentId) {
    var dJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + parentId + "')]");
    if (dJson != false) {
        for (var j = 0; j < dJson.length; j++) {
            strTreeUserType += "<li id='" + dJson[j].User_Type_Code + "' class='expanded' >" + dJson[j].User_Type_Name;

            var dsJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + dJson[j].User_Type_Code + "')]");
            if (dsJson != false && dsJson.length > 0) {
                strTreeUserType += "<ul >";
                fnUserTypemenu(jsonData, dJson[j].User_Type_Code);
                strTreeUserType += "</ul>";
            }
            strTreeUserType += "</li>";
        }
    }
}

function fnUserTypemenu(jsonData, parentId) {
    var dJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + parentId + "')]");
    if (dJson != false) {
        for (var j = 0; j < dJson.length; j++) {
            strTreeUserType += "<li id='" + dJson[j].User_Type_Code + "' class='expanded' >" + dJson[j].User_Type_Name;

            var dsJson = jsonPath(jsonData, "$.Tables[1].Rows[?(@.Under_User_Type=='" + dJson[j].User_Type_Code + "')]");
            if (dsJson != false && dsJson.length > 0) {
                strTreeUserType += "<ul >";
                fnUserTypemenu(jsonData, dJson[j].User_Type_Code);
                strTreeUserType += "</ul>";
            }
            strTreeUserType += "</li>";
        }
    }
}


function fnActivityTree(id) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserTypeActivityMapping/GetActivityDetails',
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            data = jsData;
            if (jsData.Tables[0].Rows.length > 0) {
                var content = "";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    content += '<tr>';
                    content += '<td style="text-align:center"><input type="checkbox" class="activity" value="' + jsData.Tables[0].Rows[i].Activity_Code + '"></td>';
                    content += '<td>' + jsData.Tables[0].Rows[i].Activity_Name + '</td>';
                    content += '<td><input type="checkbox" class="mandatory"></td>';
                    content += '</tr>';
                }
            }
            $("#lstActivity").html(content);           
        }
    });
}
function fnfillMappingGrid() {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserTypeActivityMapping/GetUserTypeActivityMap',
        data: "A",
        success: function (result) {
            debugger;
            $('#dvTable').html('');
            if (result.length > 0 ) {
                var grid = new ej.grids.Grid({
                    dataSource: result,
                    allowPaging: true,
                    allowGrouping: false,
                    allowSorting: true,
                    allowFiltering: false,
                    allowResizing: true,
                    allowCellMerging: true,
                    allowScrolling: true,
                    allowExcelExport: false,
                    height: 400,
                    gridLines: 'Both',
                    pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },                    
                    toolbar: ['Search'],
                    aggregates: [],
                    columns: [
                        { headerText: 'Edit', template: "<a href=#;>Edit</a>", width: 100, textAlign: 'center' },
                        { headerText: 'Delete', template: "<a href=#;>Delete</a>", width: 100, textAlign: 'center' },                       
                        { field: 'User_type_Name', headerText: 'UserType', width: 150 },
                        { field: 'Activity_Name', headerText: 'Activity', width: 150 },
                        { field: 'Sfc_Not_Mandatory', headerText: 'Sfc Not Manditory', width: 150 },
                        { field: 'StartDate', headerText: 'Start Date', width: 150 },
                        { field: 'EndDate', headerText: 'End Date', width: 150 }
                    ],
                    queryCellInfo: queryCellInfo,
                });
                grid.appendTo('#dvTable');
            }
            else {
                $('#dvTable').htm("No Records Found");
            }
        }
    });
}
function queryCellInfo(args) {
    debugger;
    if (args.column.headerText == "Delete") {      
        args.cell.innerHTML = "<a href='#' onclick='fnDelete(\"" + args.data.UserType_Activity_Code + "\");'>Delete</a>";        
    }
    if (args.column.headerText == "Edit") {       
        args.cell.innerHTML = "<a href='#' onclick='fnEdit(\"" + args.data.UserType_Activity_Code + "_" + args.data.User_Type_Code + "_" + args.data.Activity_Code + "_" + args.data.StartDate + "_" + args.data.EndDate + "_" + args.data.Sfc_Mandatory + "\")'>Edit</a>";
        //args.cell.getElementsByTagName('a')[0].click = function () {
        //    debugger;
        //    fnEdit(args.data);
        //};
    }
}

//key valu
function fnUserTypeTreeNodeClick(node) {
    editUsertypeCode_g = "";
    $("#UserTypetree").dynatree("getRoot").visit(function (node) {
        //  $(node.span).removeClass('tree-node-active');
        $(node.span).removeClass('tree-node-active');

    });
    userTypeCode_g = node.data.key;
}
var selKeys = "", selText = "";
function fnActivityTreeSelect(select, node) {
    var lastSelectedNode = node.data.key;
    selKeys = $.map(node.tree.getSelectedNodes(), function (node) {
        return node.data.key;
    });
}


//Save the activity mapping//

function fnSave() {
    if (userTypeCode_g == "") {
        fnMsgAlert('info', 'User Type Activity ', 'Please select UserType');
        return false;
    }
    var ActivityCount = 0;
    $("#lstActivity tr td:nth-child(1) input[type=checkbox]:checked").map(function (i, e) {
        ActivityCount++;
    });
    if (ActivityCount == 0) {
        fnMsgAlert('info', 'User Type Activity', 'Please Check Activity.');
        return false;
    }
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'User Type Activity', 'Please Enter Start Date.');
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'User Type Activity', 'Please Enter End Date.');
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        return false;
    }



    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];


    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }
    var arr = [];
    $("#lstActivity tr td:nth-child(1) input[type=checkbox]:checked").map(function (i, e) {
        var obj = {};
        obj.UserTypeCode = userTypeCode_g;
        obj.ActivityCode = $(this).val();
        obj.StartDate = startDate;
        obj.EndDate = endDate;
        obj.Sfc_Mandatory = $(this).parent().parent().find(".mandatory").prop("checked") == true ? 0 : 1;
        arr.push(obj);
    });

    var objDetails = {
        lst: arr
    }
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserTypeActivityMapping/InsertActivity',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(objDetails),
        success: function (result) {
            if (result == "1") {
                fnMsgAlert('success', 'UserType Activity Mapping', 'Saved Sucessfully');
            }
            else {
                fnMsgAlert('info', 'UserType Activity Mapping', 'Already Mapped');
            }
            HideModalPopup("dvloading");
            $('.selectAll').prop('checked', false);
            $("#lstActivity input[type=checkbox]").prop("checked", false);
            $("#txtFromDate").val('');
            $("#txtToDate").val('');

            fnfillMappingGrid()
        }
    });
}

function fnDelete(val) {
    var activitymapCode = val;
    $("#dvTable").html("");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserTypeActivityMapping/DeleteActivity',
        data: "activitymapCode=" + activitymapCode,
        success: function (result) {
            if (result == "1") {
                fnMsgAlert('success', 'UserType Activity Mapping', 'Deleted Sucessfully');
            }
            else {
                alert("error")
            }
            HideModalPopup("dvloading");
            fnfillMappingGrid()
        }
    });
}


function fnEdit(val) {
    debugger;
    $('#btnSave').hide();
    $("#UserTypetree").dynatree("getRoot").visit(function (node) {
        $(node.span).removeClass('tree-node-active');
    }); 
    mappedCode_g = val.split('_')[0]
    var userTypeCode = val.split('_')[1]
    var activityCode = val.split('_')[2]
    var startDate = val.split('_')[3]
    var endDate = val.split('_')[4]
    var setting_Value = val.split('_')[5];

    $("#UserTypetree").dynatree("getRoot").visit(function (node) {
        if (node.data.key == userTypeCode) {
            $(node.span).addClass('tree-node-active');
            node.select(true);
        }
        else {
            //  $(node.span).removeClass('tree-node-active');
            $(node.span).removeClass('tree-node-active');
        }
    });
    $('.selectAll').attr('disabled', true);
    $("#lstActivity tr input[type=checkbox]").prop("checked", false).attr("disabled", true);
    $("#lstActivity").find("input[value=" + activityCode + "]").prop("checked", true).attr("disabled", false);
    if (setting_Value == 0) {
        $("#lstActivity").find("input[value=" + activityCode + "]").parent().parent().find(".mandatory").prop("checked", true).attr("disabled", false);
    }
    else {
        $("#lstActivity").find("input[value=" + activityCode + "]").parent().parent().find(".mandatory").attr("disabled", false);
    }
     
    $("#txtFromDate").val(startDate);
    $("#txtToDate").val(endDate);
    $("#EditUserTypeCode").val(userTypeCode);
    $('#btnUpdate').show();
    $('#btnCancel').show();
    editUsertypeCode_g = val.split('_')[1];
}

function fnCancel() {
    $('#btnUpdate').hide();
    $('#btnCancel').hide();
    $('#btnSave').show();
    $("#txtFromDate").val('');
    $("#txtToDate").val('');
    $('.selectAll').attr('disabled', false);
    $("#lstActivity input[type=checkbox]").attr("disabled", false).prop("checked", false);
}
function fnUpdate() {
    var ActivityCount = 0;
    $("#lstActivity tr td:nth-child(1) input[type=checkbox]:checked").map(function (i, e) {
        ActivityCount++;
    });
    if (ActivityCount == 0) {
        fnMsgAlert('info', 'User Type Activity', 'Please Check Activity.');
        return false;
    }
    if ($("#txtFromDate").val() == "") {
        fnMsgAlert('info', 'User Type Activity', 'Please Enter Start Date.');
        return false;
    }

    if ($("#txtToDate").val() == "") {
        fnMsgAlert('info', 'User Type Activity', 'Please Enter End Date.');
        return false;
    }

    if (!(fnValidateDateFormate($("#txtFromDate"), "StartDate"))) {
        return false;
    }

    if (!(fnValidateDateFormate($("#txtToDate"), "EndDate"))) {
        return false;
    }
    var startDate = $("#txtFromDate").val();
    var endDate = $("#txtToDate").val();
    startDate = $("#txtFromDate").val().split('/')[2] + "-" + $("#txtFromDate").val().split('/')[1] + "-" + $("#txtFromDate").val().split('/')[0];
    endDate = $("#txtToDate").val().split('/')[2] + "-" + $("#txtToDate").val().split('/')[1] + "-" + $("#txtToDate").val().split('/')[0];


    var FromDateArr = $("#txtFromDate").val().split('/');
    var ToDateArr = $("#txtToDate").val().split('/');
    var dt1 = new Date(FromDateArr[2] + "-" + FromDateArr[1] + "-" + FromDateArr[0]);
    var dt2 = new Date(ToDateArr[2] + "-" + ToDateArr[1] + "-" + ToDateArr[0]);

    if (dt1 > dt2) {
        fnMsgAlert('info', 'Info', 'Start Date Can not be Greater than the End Date');
        return false;
    }

    var userTypeCodeEdit = ""
    if (editUsertypeCode_g != "") {
        userTypeCodeEdit = editUsertypeCode_g
    }
    else {
        userTypeCodeEdit = userTypeCode_g
    }
    var arr = [];
    $("#lstActivity tr td:nth-child(1) input[type=checkbox]:checked").map(function (i, e) {
        var obj = {};
        obj.UserTypeCode = userTypeCodeEdit;
        obj.ActivityCode = $(this).val();
        obj.StartDate = startDate;
        obj.EndDate = endDate;
        obj.Sfc_Mandatory = $(this).parent().parent().find(".mandatory").prop("checked") == true ? 0 : 1;
        obj.Mapped_code = mappedCode_g,
        arr.push(obj);
    });

    var objDetails = {
        lst: arr
    }


    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/UserTypeActivityMapping/EditActivity',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(objDetails),
        success: function (result) {
            if (result == "1") {                
                $('.selectAll').attr('disabled', false).prop('checked', false);
                fnMsgAlert('success', 'UserType Activity Mapping', 'Updated Sucessfully');
                $("#lstActivity input[type=checkbox]").prop("checked", false).attr("disabled", false);
                $("#txtFromDate").val('');
                $("#txtToDate").val('');
                $('#btnSave').show();
                $('#btnUpdate').hide();
                $('#btnCancel').hide();
            }
            else {

                fnMsgAlert('info', 'UserType Activity Mapping', 'Already Mapped');
            }
            HideModalPopup("dvloading");

            fnfillMappingGrid()
        }
    });

}
