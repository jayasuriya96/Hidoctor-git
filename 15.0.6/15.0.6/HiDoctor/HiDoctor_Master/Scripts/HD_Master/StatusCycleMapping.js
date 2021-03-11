//Global Variable
var oCycleCode = "";
var oStatusCode = "";


function fnStatusCycleMasterDetails() {
    $.ajax({
        url: '../HiDoctor_Master/StatusMaster/GetStatusCycleMasterDetails',
        type: "POST",
        success: function (result) {
            result = eval(result);
            var userTypeMaster = result[0].Data;
            var statusMaster = result[1].Data;
            var cycleMaster = result[2].Data;

            //Bining the status Name
            var moveordercontent = "";
            var status = $("#drpStatus");
            $('option', status).remove();

            status.append("<option value='0'>-Select Status Name-</option>");

            //moveordercontent += "<table id='tblMoveOrder'>";
            //for (var i = 0; i < statusMaster.length; i++) {
            //    status.append("<option value=" + statusMaster[i].Status_Code + ">" + statusMaster[i].Status_Name + "</option>");
            //    moveordercontent += "<tr>";
            //    moveordercontent += "<td>";
            //    //  moveordercontent += "<input type='checkbox' id='chkMoveOrder_" + i + "' value='" + (i + 1) + "' /> <label id='lblMoveOrder_" + i + "' for='chkMoveOrder_" + i + "' > " + (i + 1) + "</label></br>";
            //    moveordercontent += "<input type='radio' name='rbn_MoveOrder' value='" + (i + 1) + "'/><label id='lblMoveOrder_" + i + "' for='chkMoveOrder_" + i + "' > " + (i + 1) + "</label></br>";
            //    moveordercontent += "</td>";
            //    moveordercontent += "</tr>";
            //}
            //moveordercontent += "</table>";


            moveordercontent += "<select id='drpMoveOrder'><option value='0'>-Select Cycle Name-</option>";
            for (var i = 0; i < statusMaster.length; i++) {
                    status.append("<option value=" + statusMaster[i].Status_Code + ">" + statusMaster[i].Status_Name + "</option>");
                moveordercontent += "<option value=" + (i + 1) + "><label id='lblMoveOrder_" + i + "' for='chkMoveOrder_" + i + "' > " + (i + 1) + "</label></option>";
            }
            moveordercontent +="</select>";

            //Bining the cycle Name
            var cycle = $("#drpCycle");
            $('option', cycle).remove();

            cycle.append("<option value='0'>-Select Cycle Name-</option>");

            for (var i = 0; i < cycleMaster.length; i++) {
                cycle.append("<option value=" + cycleMaster[i].Cycle_Code + ">" + cycleMaster[i].Cycle_Name + "-" + cycleMaster[i].Region_Name + "</option>");
            }

            //Binding User Type
            var content = "";
            content += "<table id='tblUserType'>";
            for (var i = 0; i < userTypeMaster.length; i++) {
                content += "<tr>";
                content += "<td>";
                content += "<input type='checkbox' id='chkUserType_" + i + "' value='" + userTypeMaster[i].User_Type_Code + "' /> <label for='chkUserType_" + i + "' id='lblUserType_" + i + "' > " + userTypeMaster[i].User_Type_Name + "</label></br>";
                content += "</td>";
                content += "</tr>";
            }
            content += "</table>";

            $("#dvUserType").html(content);
            $("#dvMoveOrder").html(moveordercontent);
        }
    });
}


function fnStatusCycleMappingDetails() {
    $.ajax({
        url: '../HiDoctor_Master/StatusMaster/GetStatusCycleMappingDetails',
        type: "POST",
        success: function (result) {
            $("#divstatusCycleMapping").html(result);
        }
    });
}
function isInteger(n) {
    return /^[0-9]+$/.test(n);
}

function fnInsertStatusCycleMapping() {
    
    var cycleCode = $("#drpCycle").val();
    var statusCode = $("#drpStatus").val();
    var cycleName = $("#drpCycle option:selected").text();
    var statusName = $("#drpStatus option:selected").text();
    var description = $("#txtAreaDescription").val();
    var orderNo = $("#txtOrderNo").val();

    var userTypeName = "";
    var moveOrder = "";

    for (var i = 0; i < $("#tblUserType tr").length; i++) {
        if ($("#chkUserType_" + i).attr('checked')) {
            userTypeName += $.trim($("#lblUserType_" + i).html()) + ",";
        }
    }

    //for (var i = 0; i < $("#tblMoveOrder tr").length; i++) {
    //    if ($("input:radio[name=existingpartner]").is(":checked")) {
    //        moveOrder += $.trim($("#lblMoveOrder_" + i).html()) + ",";
    //    }
    //}
    moveOrder = $("#drpMoveOrder").val();//$('input:radio[name=rbn_MoveOrder]:checked').val()
    userTypeName = userTypeName.slice(0, -1);
    //moveOrder = moveOrder.slice(0, -1);

    var mode = $("#hdnMode").val();

    if (cycleCode == 0) {
        fnMsgAlert('info', 'Status cycle mapping', 'Please select the cycle name');
        return false;
    }
    if (statusCode == 0) {
        fnMsgAlert('info', 'Status cycle mapping', 'Please select the status name');
        return false;
    }
    //if (description == '') {
    //    fnMsgAlert('info', 'Status cycle mapping', 'Please enter the description');
    //    return false;
    //}
    if (orderNo == '') {
        fnMsgAlert('info', 'Status cycle mapping', 'Please enter the order no');
        return false;
    }
    if (orderNo.length > 4) {
        fnMsgAlert('info', 'Status cycle mapping', 'Order No length can not be greater than 4 digits');
        return false;
    }
    if (isNaN(orderNo)) {
        fnMsgAlert('info', 'Status cycle mapping', 'Order number must be a number.');
        return false;
    }
    if (!isInteger(orderNo)) {
        fnMsgAlert('info', 'Status cycle mapping', 'Order number must be a number.');
        return false;
    }

    if (userTypeName == '') {
        fnMsgAlert('info', 'Status cycle mapping', 'Please select the Status Owner Type');
        return false;
    }
    if (moveOrder == '') {
        fnMsgAlert('info', 'Status cycle mapping', 'Please select the Move Order');
        return false;
    }

    if (!(fnCheckRemarksSpecialChar("#txtAreaDescription"))) {
        return false;
    }
    if (!(fnCheckRemarksSpecialChar("#txtOrderNo"))) {
        return false;
    }

    $.ajax({
        url: '../HiDoctor_Master/StatusMaster/InsertStatusCycleMapping',
        type: "POST",
        data: "cycleCode=" + cycleCode + "&cycleName=" + $.trim(cycleName) + "&statusCode=" + statusCode + "&statusName=" + $.trim(statusName) + "&description=" + $.trim(description) + "&statusOwnerType=" + $.trim(userTypeName) + "&orderNo=" + $.trim(orderNo) + "&moveOrder=" + $.trim(moveOrder) + "&mode=" + mode + "&oCycleCode=" + oCycleCode + "&oStatusCode=" + oStatusCode + "&recordStatus=1",
        success: function (result) {
            if (result >= 1) {
                if ($("#hdnMode").val() == "I") {
                    fnMsgAlert('success', 'Status Cycle Mapping', 'Status cycle mapping details saved successfully');
                }
                else {
                    fnMsgAlert('success', 'Status Cycle Mapping', 'Status cycle mapping details edited successfully');
                }
                fnClearAll()
                fnStatusCycleMappingDetails();
            }
            else if (result == -1) {
                fnMsgAlert('info', 'Status Cycle Mapping', 'Status cycle mapping details already exists');
                fnClearAll();
            }
            else {
                fnMsgAlert('info', 'Status Cycle Mapping', 'Something went wrong, please try again after some time');
                fnClearAll();
            }
        }
    });
}

function fnStatusCycleEdit(rowIndex) {
    
    fnClearAll();
    $("#drpCycle").focus();
    var cycleCode = $("#hdnCycleCode_" + rowIndex).val();
    var statusCode = $("#hdnStatusCode_" + rowIndex).val();
    var description = $("#tdDescription_" + rowIndex).html();
    var description = $("#tdDescription_" + rowIndex).html();
    var orderNo = $("#tdOrdero_" + rowIndex).html();

    var statusOwnerTypeArr = $("#tdstatusOwnerType_" + rowIndex).html().split(',');
    var moveNumberArr = $("#tdMoveOrder_" + rowIndex).html().split(',');

    $("#drpCycle").val(cycleCode);
    $("#drpStatus").val(statusCode);
    $("#txtAreaDescription").val(description);
    $("#txtOrderNo").val(orderNo);
    oCycleCode = cycleCode;
    oStatusCode = statusCode;
    $("#hdnMode").val('E');

    for (var i = 0; i < $("#tblUserType tr").length; i++) {
        if ($.inArray($.trim($("#lblUserType_" + i).html()), statusOwnerTypeArr) > -1) {
            $("#chkUserType_" + i).attr('checked', true);
        }
    }

   // $('input[type=radio][name=rbn_MoveOrder][value=' + moveNumberArr[0] + ']').attr('checked', true)
    $("#drpMoveOrder").val(moveNumberArr[0]);

    //for (var i = 0; i < $("#tblMoveOrder tr").length; i++) {
    //    if ($.inArray($.trim($("#lblMoveOrder_" + i).html()), moveNumberArr) > -1) {
    //        $("#rbn_MoveOrder" + i).attr('checked', true);
    //    }
    //}
}

function fnClearAll() {
    $("#drpCycle").val(0);
    $("#drpStatus").val(0);
    $("#txtAreaDescription").val('');
    $("#txtOrderNo").val('');
    $("#hdnMode").val('I');
    for (var i = 0; i < $("#tblUserType tr").length; i++) {
        $("#chkUserType_" + i).attr('checked', false);
    }
    //for (var i = 0; i < $("#tblMoveOrder tr").length; i++) {
    //    $("#chkMoveOrder_" + i).attr('checked', false);
    //}
    //$('input[name=rbn_MoveOrder]').attr('checked', false);
    $("#drpMoveOrder").val(0);
}


function fnStatusCycleChangeStatus(rowIndex) {
    var cycleCode = $("#hdnCycleCode_" + rowIndex).val();
    var statusCode = $("#hdnStatusCode_" + rowIndex).val();
    var mode = "C";
    var status = $("#tdStatus_" + rowIndex).html();
    var strStatus;
    if ($.trim(status.toUpperCase()) == "ENABLED") {
        strStatus = "0";
    }
    else {
        strStatus = "1";
    }

    $.ajax({
        url: '../HiDoctor_Master/StatusMaster/InsertStatusCycleMapping',
        type: "POST",
        data: "cycleCode=" + cycleCode + "&cycleName=&statusCode=" + statusCode + "&statusName=&description=&statusOwnerType=&orderNo=0&moveOrder=&mode=" + mode + "&oCycleCode=&oStatusCode=&recordStatus=" + strStatus + "",
        success: function (result) {
            if (result >= 1) {
                fnMsgAlert('success', 'Status Cycle Mapping', 'Status changes successfully');
                fnClearAll()
                fnStatusCycleMappingDetails();
            }
            else {
                fnMsgAlert('info', 'Status Cycle Mapping', 'Something went wrong, please try again after some time');
                fnClearAll();
            }
        }
    });
}