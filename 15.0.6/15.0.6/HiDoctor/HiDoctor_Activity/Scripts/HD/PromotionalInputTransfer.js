function fnshowusers() {
    debugger;
    $('#source').html('');
    $("#tabs").hide();
    $("#productdata").hide();
    $("#rejectdata").hide();
    $("#submit").hide();
    $('#source').append('<label>Transfer from</label><input type="text" id="sourceuser"/>');
    $('#destination').html('');
    $('#destination').append('<label>Transfer to</label><input type="text" id="destinationuser"/>');
    var monArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var month = parseInt(monArray.indexOf($('#txtFrom').val().split('-')[0].toUpperCase())) + 1;
    var date = 01;
    var y = $('#txtFrom').val();
    var year = y.split('-');
    var yearval = year[1];
    var startdate = yearval + '-' + month + '-' + "01"
    var monArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var month = parseInt(monArray.indexOf($('#txtTo').val().split('-')[0].toUpperCase())) + 1;

    // var date = 31;
    var y = $('#txtTo').val();
    var year = y.split('-');
    var yearval = year[1];
    var days = daysInMonth(month, yearval);
    var enddate = yearval + '-' + month + '-' + days;
    $("#users").show();
    $("#btn").show();
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetUsers',
        data: 'effective_from=' + startdate + '&effective_to=' + enddate,
        success: function (response) {
            var selectcolumn = '';
            var content = '';
            debugger;
            Json_user = eval('(' + response + ')');
            //$('.source').html('');
            //$("#sourceuser").append('<input type="text">');
            //selectcolumn+=("<option value='0'>-Select Source User-</option>");
            var doc = "[";
            for (var i = 0; i < Json_user.length; i++) {
                //  if (Json_user[i].User_Status == 0) {

                //for (var i = 0; i < Json_user.length; i++) {

                doc += "{label:" + '"' + "" + Json_user[i].User_Name + "" + '",' + "value:" + '"' + "" + Json_user[i].User_Code + '"' + "}";
                if (i < Json_user.length - 1) {
                    doc += ",";
                }
                // }


                //  }

            }
            doc += "];";
            var atcObj = new ej.dropdowns.AutoComplete({
                //set the data to dataSource property
                dataSource: eval(doc),

                fields: { text: 'label' },

                select: Userchange,
            });
            atcObj.appendTo('#sourceuser');


            $('#destinationuser').html('');
            var doc = "[";
            for (var i = 0; i < Json_user.length; i++) {
                //  if (Json_user[i].User_Status == 1) {

                //for (var i = 0; i < Json_user.length; i++) {

                doc += "{label:" + '"' + "" + Json_user[i].User_Name + "" + '",' + "value:" + '"' + "" + Json_user[i].User_Code + '"' + "}";
                if (i < Json_user.length - 1) {
                    doc += ",";
                }
                //  }


                //  }

            }
            doc += "];";
            var atcObj = new ej.dropdowns.AutoComplete({
                //set the data to dataSource property
                dataSource: eval(doc),

                fields: { text: 'label' },

                select: destinationuser,
            });
            atcObj.appendTo('#destinationuser');
            //$("#destinationuser").append(content)
        }
    });
}
var user = '';
function Userchange(args) {
    debugger;
    user = args.itemData.value;


}
var destinationusercode = '';
function destinationuser(args) {
    debugger;
    destinationusercode = args.itemData.value;

}
function daysInMonth(month, year) {
    debugger;
    return new Date(year, month, 0).getDate();
}
function fnshowproducts() {
    debugger;
    $("#ProductApproval").hide();
    $("#ViewUserDetails").hide();
    $("#resubmit").hide();
    if ($("#sourceuser").val() == 0) {
        fnMsgAlert('info', 'Info', 'Please Select the Source User.');
        return false;
    }
    if ($("#destinationuser").val() == 0) {
        fnMsgAlert('info', 'Info', 'Please Select the Destination User.');
        return false;
    }
    if ($("#sourceuser").val() == $("#destinationuser").val()) {
        fnMsgAlert('info', 'Info', 'Transfer from and Transfer to user cannot be same.');
        return false;
    }
    $("#tabs").show();
    $("#productdata").html('');
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetUserProductdata',
        data: 'UserCode=' + user,
        success: function (response) {
            debugger;
            $("#productdata").show();
            Jsonresult = eval('(' + response + ')');
            var Content = '';

            if (Jsonresult != null) {

                //Content += '<div class="table-responsive">';
                //Content += '<div class="table-responsive">';
                Content += '<table class="table table-responsive" style="overflow-x:scroll !important">';
                //Content += '<table class="table">';

                Content += '<thead style="display:block;">';
                Content += '<tr>';
                // Content += '<th style="min-width: 150px;><input type="checkbox" id="chk_0" onclick="fnSelectAll()" /></th>';
                Content += '<th style="min-width: 115px;"><input type="checkbox" id="chk_0" onclick="fnSelectAll()" /></th>';
                Content += '<th style="min-width: 279px;">Product Name</th>';
                Content += '<th style="min-width: 121px;">Product Type</th>';
                Content += '<th style="min-width: 115px;">Batch Number</th>';
                Content += '<th style="min-width: 127px;">Logical quantity</th>';
                Content += '<th style="min-width: 135px;">Variance quantity</th>';
                Content += '<th style="min-width: 164px;">Physical quantity</th>';
                Content += '<th style="min-width: 115px;">Remarks</th>';
                Content += '</tr>';
                Content += '</thead>';
                // Content += '</table>';
                // Content += '</div>';
                // Content += '<div class="table-responsive">';
                // Content += '<table class="table">';
                Content += '<tbody style="height: 300px;display: block;overflow-y:scroll !important;">';
                for (var i = 0; i < Jsonresult.length; i++) {

                    Content += '<tr>';

                    Content += '<td style="min-width: 120px;"><input name="chkUserSelect" class="checkboxclass" type="checkbox"  id="chk_' + i + '"/></td>';
                    Content += '<td id="Productname' + i + '" style="min-width: 282px;"><input type="hidden" id="hiddenpc' + i + '" value="' + Jsonresult[i].Product_Code + '">' + Jsonresult[i].Product_Name + '</td>';
                    // Content += '<input type="hiddenpc">' + Jsonresult[i].Product_Code + '';
                    Content += '<td id="Producttypename' + i + '" style="min-width: 139px;"><input type="hidden" id="hiddenptc' + i + '"  value="' + Jsonresult[i].Product_Type + '"/>' + Jsonresult[i].Product_Type_Name + '</td>';
                    // Content += '<input type="hiddenptc">' + Jsonresult[i].Product_Type + '';
                    Content += '<td id="batchnumber' + i + '" style="min-width: 120px;">' + Jsonresult[i].Batch_Number + '</td>';
                    if (Jsonresult[i].Batch_Number == "undefined") {
                        Content += '<td style="min-width: 120px;"></td>';
                    }
                    Content += '<td id="currentstock' + i + '" style="min-width: 120px;">' + Jsonresult[i].Current_Stock + '</td>';
                    Content += '<td style="min-width: 120px;"><input type="number" class="variancecalculation" onchange="fnvariance(this);" style="width:83px;" min="0" id="variancecount_' + i + '" onkeypress="return event.charCode >= 48"></td>';
                    Content += '<td style="min-width: 120px;"><input type="number" style="width:83px;" min="1" id="phyquantity' + i + '" onkeypress="javascript:return fnvalidate(this,event);"></td>';
                   
                    Content += '<td style="min-width: 120px;" ><input style="width:125px;" maxlength="250" onpaste="return false" type="textarea" id="remarks' + i + '"></td>';

                    Content += '</tr>';

                }
                Content += '</tbody>';
                Content += '</table>';
                //Content += '</div>';
                //Content += '</div>';
                $("#productdata").append(Content);
                $("#submit").show();

            }
            else {
                $("#productdata").append('No data found');
                $("#resubmit").hide();
            }
        }

    });
}
function fnvalidate(ele, e) {
    debugger;
    //alert(e.keyCode);
    if (e.charCode == 45) {
        // $('#name_err').hide();
        return false;
    }
    else {
        //  $('#name_err').show();
        return true;
    }
}
var phyQuantity = '';
function fnvariance(sel) {
    debugger;


    var variancecount = '';
    if (sel.value != "") {
        debugger;
        variancecount = sel.value;
    }
    else {
        variancecount = 0;
    }
    var lQ = sel.id.split('_')
    var Logic = lQ[1];
    var Logicalquantity = $("#currentstock" + Logic + "").text();
    phyQuantity = Logicalquantity - variancecount;
    $("#phyquantity" + Logic + "").val(phyQuantity);

}

function fnSelectAll() {
    debugger;
    if ($('#chk_0').attr('checked') == null) {
        $('.checkboxclass').attr('checked', false);
    }
    else if ($('#chk_0').attr('checked') == 'checked') {
        $('.checkboxclass').attr('checked', 'checked');
    }
}
function fnSelect() {
    debugger;
    if ($('#check_0').attr('checked') == null) {
        $('.checkboxclass').attr('checked', false);
    }
    else if ($('#check_0').attr('checked') == 'checked') {
        $('.checkboxclass').attr('checked', 'checked');
    }
}
var idVal = '';
function fninsertuserproduct() {
    debugger;
    $.blockUI();
    var jsonData = [];

    $('input:checkbox[name=chkUserSelect]').each(function () {
        if (this.checked) {
            var value = $(this).val();

            idVal = this.id.split('_')[1];
            // if (!error) {
            var rowData = {

                SourceUserCode: "" + user + "",
                SourceUserName: "" + $("#sourceuser").val() + "",
                DestinationUserCode: "" + destinationusercode + "",
                Status: 1,
                Remarks: "" + $("#remarks" + idVal).val() + "",
                DestinationUserName: "" + $("#destinationuser").val() + "",

                Batch_Number: "" + $("#batchnumber" + idVal).text() + "",
                Approved_By: "",
                Approved_Date: "",
                Logical_Quantity: "" + $("#currentstock" + idVal).text() + "",
                variancecount: "" + $("#variancecount_" + idVal).val() + "",
                Physical_Quantity: "" + $("#phyquantity" + idVal).val() + "",
                ProductCode: "" + $("#hiddenpc" + idVal).val() + "",
                Product_Name: "" + $("#Producttypename" + idVal).text() + "",
                Product_Type_Code: "" + $("#hiddenptc" + idVal).val() + "",
                Product_Type_Name: "" + $("#Producttypename" + idVal).text() + "",


            }
            jsonData.push(rowData);


        }
    });
    if (jsonData.length == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please select atleast one.');
        return false;
    }
    // for (var i = 0; i < jsonData.length; i++) {
    if (parseInt($("#phyquantity" + idVal).val()) > phyQuantity) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Physical quantity is greater than Logical quantity.');
        return false;
    }
    else if ($("#phyquantity" + idVal).val()==0) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Physical quantity cannot be zero.');
        return false;
    }
    else if ($("#phyquantity" + idVal).val() == '') {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please enter Physical quantity');
        return false;
    }
    else if ($("#remarks" + idVal).val() == '') {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please enter Remarks');
        return false;
    }
    // }
    if (jsonData.length > 0) {
        debugger;
        //jsonData = JSON.stringify({ 'lstuserproduct': jsonData });
        $.ajax({
            type: 'POST',
            data: JSON.stringify({ "lstuserproduct": jsonData, "UserCode": user }),
            contentType: 'application/json; charset=utf-8',
            //  data: "lstuserproduct=" + JSON.stringify(jsonData)+ "&UserCode=" + user,

            url: "../HiDoctor_Activity/PromotionalInputs/Insertuserproduct",
            success: function (jsonResult) {
                debugger;
                $.unblockUI();
                if (jsonResult == "True") {
                    debugger;
                    fnMsgAlert('success', 'SUCCESS', 'Your transfer is successfull.');
                    fnshowproducts();
                }
            },
            error: function (e) {
                //alert(0);
                // DcrFreeze.UnblockUI("dataDiv");
            },
            complete: function () {
                //alert(1);
                // DcrFreeze.UnblockUI("dataDiv");
            }
        });
    }
}


function fnresubmituserproduct() {
    debugger;
    $.blockUI();
    var jsonData = [];

    $('input:checkbox[name=chkUserSelectdata]').each(function () {
        if (this.checked) {
            var value = $(this).val();
            var idVal = this.id.split('_')[1];
            // if (!error) {
            var rowData = {

                SourceUserCode: "" + user + "",
                DestinationUserCode: "" + destinationusercode + "",

                Product_Code: "" + $("#Rhiddenpc" + idVal).val() + "",
                Trans_Id: "" + $("#hiddenval" + idVal).val() + "",
                Remarks: "" + $("#Rremarks" + idVal).val() + ""

            }
            jsonData.push(rowData);
        }
    });
    if (jsonData.length == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please select atleast one.');
        return false;
    }
    if (jsonData.length > 0) {
        debugger;
        jsonData = JSON.stringify({ 'lstuserproduct': jsonData });
        $.ajax({
            type: 'POST',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            url: '../HiDoctor_Activity/PromotionalInputs/Resubmitproductdata',

            success: function (jsonResult) {
                debugger;
                $.unblockUI();
                if (jsonResult == "True") {
                    debugger;
                    fnMsgAlert('success', 'SUCCESS', 'Your transfer is Resubmitted successfully.');
                    fnshowrejectedData(value);
                }
            }

        });
    }
}

function fncanceluserrequest() {
    debugger;
    $.blockUI();
    var jsonData = [];

    $('input:checkbox[name=chkUserSelectdata]').each(function () {
        if (this.checked) {
            var value = $(this).val();
            var idVal = this.id.split('_')[1];
            // if (!error) {
            var rowData = {

                SourceUserCode: "" + user + "",
                DestinationUserCode: "" + destinationusercode + "",
                Logical_Quantity: "" + $("#Rcurrentstock" + idVal).text() + "",
                Variance_Count: "" + $("#Rvariancecount" + idVal).text() + "",
                Product_Code: "" + $("#Rhiddenpc" + idVal).val() + "",
                Trans_Id: "" + $("#hiddenval" + idVal).val() + "",
                // Remarks: "" + $("#Rremarks" + idVal).val() + ""
                Batch_Number: "" + $("#Rbatchnumber" + idVal).text() + "",
            }
            jsonData.push(rowData);
        }
    });

    if (jsonData.length == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please select atleast one.');
        return false;
    }

    if (jsonData.length > 0) {
        debugger;
        jsonData = JSON.stringify({ 'lstuserproduct': jsonData });
        $.ajax({
            type: 'POST',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            url: '../HiDoctor_Activity/PromotionalInputs/Canceluserrequest',

            success: function (jsonResult) {
                debugger;
                $.unblockUI();
                if (jsonResult == "True") {
                    debugger;
                    fnMsgAlert('success', 'SUCCESS', 'Your transfer is Cancelled successfully.');
                    fnshowrejectedData(value);
                }
            }

        });
    }
}
function PromotionalProductApproval() {
    $('#ViewUserDetails').hide();
    $("#productdata").hide();
    $("#submit").hide();
    $("#resubmit").hide();
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetUsersForApprovalHistory',
        //  data: "",
        success: function (result) {
            debugger;
            $('#ProductApproval').show();
            $('#ProductApproval').html('');
            //  if (result != '') {
            //result = eval('(' + result + ')');
            // if (result.length > 0) {
            //Jsonresult = eval('(' + result + ')');


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
                       { headerText: 'View', template: "<a href=#;>View</a>", width: 150, textAlign: 'center' },
                        { field: 'Source_User_Name', headerText: 'Transfer From', width: 200, textAlign: 'center' },
                        { field: 'Destination_User_Name', headerText: 'Transfer To', width: 200, textAlign: 'center' },
                        { field: 'Requested_By', headerText: 'Requested By', width: 200, textAlign: 'center' },
                        { field: 'Requested_Date', headerText: 'Requested Date', width: 200, textAlign: 'center' },
                        { field: 'status', headerText: 'Status', width: 200, textAlign: 'center' },


                ],
                queryCellInfo: queryCellInfo,
            });
            grid.appendTo('#ProductApproval');
            $("#submit").hide();
            // $("#ViewTransfers").hide();
        }
    });
}
var value = '';
function queryCellInfo(args) {

    debugger;


    if (args.column.headerText == "View") {
        debugger;
        if (args.cell.innerHTML = "View") {
            args.cell.style.color = "blue";
            args.cell.style.cursor = "pointer";

            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='fnView(" + args + ")'>View</a>"
        }
        $(args.cell).bind("click", function () {
            debugger;
            value = args;
            fnshowrejectedData(args);

        })
    }
}


function fnshowrejectedData(val) {
    debugger;
    $("#ProductApproval").hide();
    $("#submit").hide();
    $("#ViewUserDetails").html('');
    username = val.data.Source_User_Name;
    destusername = val.data.Destination_User_Name;
    sourceusercode = val.data.Source_User_Code;
    destusercode = val.data.Destination_User_Code;
    transferid = val.data.Transfer_Id;
    RequestedBy = val.data.Requested_By;
    requesteddate = val.data.Requested_Date;

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetRejectedUserProductdata',
        data: "username=" + username + "&sourceusercode=" + sourceusercode + "&destinationusercode=" + destusercode + "&transferid=" + transferid,
        success: function (response) {
            debugger;
            Jsonresult = eval('(' + response + ')');
            $("#ViewUserDetails").show();
            var Content = '';
            if (Jsonresult.length != 0) {


                //Content += '<div class="table-responsive">';
                Content += "<table class='table table-bordered' style='margin-top:10px;'>";
                Content += "<thead style='#5E87B0 !important'>";
                Content += "<tr>";
                Content += "<th style='width:48%;background: #5E87B0 !important;color: #fff !important;'>From User</th>";
                Content += "<th style='background: #5E87B0 !important;color: #fff !important;'>To User</th>";
                Content += "<th style='background: #5E87B0 !important;color: #fff !important;'>Requested By</th>";
                Content += "<th style='background: #5E87B0 !important;color: #fff !important;'>Requested Date</th>";
                Content += "</tr>";
                Content += "</thead>";
                Content += "<tbody>";
                Content += "<tr>";
                Content += "<td>" + username + "</td>";
                Content += "<td>" + destusername + "</td>";
                Content += "<td>" + RequestedBy + "</td>";
                Content += "<td>" + requesteddate + "</td>";
                Content += "</tr>";

                Content += "</tbody>";
                Content += "</table>";
                Content += '<table class="table table-responsive" style="overflow-x:scroll !important">';
                Content += '<thead style="width: 1183px;display: block;">';
                Content += '<tr>';
                Content += '<th style="min-width: 111px;display:none;" id="selectbox"><input type="checkbox" id="check_0" onclick="fnSelect()"/></th>';
                Content += '<th style="min-width: 111px;display:none;" id="selectingbox"></th>';
                Content += '<th style="min-width: 185px;">Product Name</th>';
                Content += '<th style="min-width: 111px;">Product Type</th>';
                Content += '<th style="min-width: 111px;">Batch Number</th>';
                Content += '<th style="min-width: 111px;">Logical quantity</th>';
                Content += '<th style="min-width: 111px;">Variance quantity</th>';
                Content += '<th style="min-width: 111px;">Physical quantity</th>';
                Content += '<th style="min-width: 111px;">Remarks</th>';
                Content += '<th style="min-width: 111px;">Rejected Remarks</th>';
                Content += '<th style="min-width: 111px;">Status</th>';
                Content += '</tr>';
                Content += '</thead>';
                Content += '<tbody style="height: 300px !important;overflow:auto;display: block;">';
                for (var i = 0; i < Jsonresult.length; i++) {
                    Content += '<tr>';
                    if (Jsonresult[i].User_Product_status == 0) {
                        Content += '<td style="min-width:111px;"><input name="chkUserSelectdata" class="checkboxclass" type="checkbox"  id="chk_' + i + '"><input type="hidden" id="hiddenval' + i + '" value="' + Jsonresult[i].Trans_Id + '"></td>';
                    }
                    else {
                        Content += '<td style="min-width:111px;"> </td>';
                    }

                    Content += '<td id="RProductname' + i + '" style="min-width:206px;"><input type="hidden" id="Rhiddenpc' + i + '" value="' + Jsonresult[i].Product_Code + '">' + Jsonresult[i].Product_Name + '</td>';
                    // Content += '<input type="hiddenpc">' + Jsonresult[i].Product_Code + '';
                    Content += '<td id="RProducttypename' + i + '" style="min-width: 99px;"><input type="hidden" id="Rhiddenptc' + i + '"  value="' + Jsonresult[i].Product_Type + '"/>' + Jsonresult[i].Product_Type_Name + '</td>';
                    // Content += '<input type="hiddenptc">' + Jsonresult[i].Product_Type + '';
                    Content += '<td id="Rbatchnumber' + i + '" style="min-width: 124px;">' + Jsonresult[i].Batch_Number + '</td>';
                    if (Jsonresult[i].Batch_Number == "undefined") {
                        Content += '<td style="min-width: 124px;"></td>';
                    }
                    Content += '<td id="Rcurrentstock' + i + '" style="min-width: 109px;">' + Jsonresult[i].Logical_Quantity + '</td>';
                    Content += '<td id="Rvariancecount' + i + '" style="min-width: 109px;">' + Jsonresult[i].Variance_Count + '</td>';
                    Content += '<td id="Rphysicalquantity' + i + '" style="min-width: 88px;">' + Jsonresult[i].Physical_Quantity + '</td>';
                   
                    if (Jsonresult[i].User_Product_status == 1) {
                        Content += '<td id="Remarks' + i + '" style="min-width: 109px;max-width:109px;word-wrap: break-word;white-space: normal;">' + Jsonresult[i].Remarks + '</td>';
                    }
                    else {
                        Content += '<td><a href="#" style="min-width: 109px;" onclick="fnshowremarks(\'' + Jsonresult[i].Product_Code + '\',\'' + Jsonresult[i].Trans_Id + '\')">View</a>';
                    }
                    if (Jsonresult[i].User_Product_status == 0) {
                        Content += '<td style="min-width: 120px;"><input type="textarea" id="Rremarks' + i + '" value="' + Jsonresult[i].Rejected_Remarks + '"></td>';
                    }
                    else {
                        Content += '<td style="min-width: 120px;"> </td>';

                    }
                    if (Jsonresult[i].User_Product_status == 0) {
                        Content += '<td style="min-width: 109px;"><span style="color:Red;">Rejected</span></td>';
                    }
                    else if (Jsonresult[i].User_Product_status == 1) {
                        Content += '<td style="min-width: 109px;"><span style="color:blue;">Applied</span></td>';
                    }
                    else if (Jsonresult[i].User_Product_status == 2) {
                        Content += '<td style="min-width: 109px;"><span style="color:green;">Approved</span></td>';
                    }

                    //Content += '<td id="status' + i + '">' + Jsonresult[i].User_Product_status + '</td>';

                    //  Content += '<td style="min-width: 169px;"><input type="text"  id="Rremarks' + i + '" value="' + Jsonresult[i].Rejected_Remarks + '"></td>';
                    //  Content += '<td><a href="#" style="color:blue;pointer:cursor;" onclick="fnedit(\'' + i + '\',\'' + Jsonresult[i].Trans_Id + '\');">Edit</a></td>'


                    Content += '</tr>';

                }
                Content += '</tbody>';
                Content += '</table>';
                // Content += '</div>';
                $("#ViewUserDetails").append(Content);
                if ($('input[name=chkUserSelectdata]').length != 0) {
                    $("#selectbox").show();

                }
                else {
                    $("#selectingbox").show();
                }
                $("#resubmit").show();

            }
            else {
                $("#ViewUserDetails").html('No data found');
                $("#resubmit").hide();
            }
        }

    });
}

function fnshowremarks(tran,val) {
    debugger;

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetRemarksHistory',
        data: "TransId=" + val + "&Product_Code=" + tran,
        success: function (response) {
            debugger;
            $("#Remarks").html('');
            //Jsonresponse = eval('(' + response + ')');
        
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
                allowExcelExport: true,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search', 'ColumnChooser'],
                aggregates: [],
                columns: [
                        { field: 'Remarks', headerText: 'Remarks', width: 200, textAlign: 'center' },
                        { field: 'User_Product_Status', headerText: 'Status', width: 200, textAlign: 'center' },
                ],

            });
            grid.appendTo('#Remarks');
            $("#myModal").modal();
        }
    });
}