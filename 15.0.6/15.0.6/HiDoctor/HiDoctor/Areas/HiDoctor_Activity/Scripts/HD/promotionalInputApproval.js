//var fromusername = '';
//var tousername = '';
function PromotionalProductApproval() {
    $('#ViewUserDetails').hide();
    $("#datadiv").hide();
    debugger;
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetUsersForApproval',
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
                        //{ field: 'Remarks', headerText: 'Remarks', width: 200, textAlign: 'center' },


                ],
                queryCellInfo: queryCellInfo,
            });
            grid.appendTo('#ProductApproval');
            $("#ViewTransfer").hide();
            $("#ViewTransfers").hide();
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
            var data = JSON.stringify(args.data);
            var obj = new Object()
            obj.data = data
            args.cell.innerHTML = "<a style='textDecoration:underline;' onclick='fnView(" + args + ")'>View</a>"
            //args.cell.innerHTML = "<a style='textDecoration:underline;' >View</a>"
        //    $(args.cell).bind("click", function (event) {
        //        debugger;
        //        value = data;
        //        fnView(data);

        //    });
            }
            $(args.cell).bind("click", function () {
                debugger;
                value = args;
                fnView(args);

            })
        

        //if (args.column.headerText == "Requested Date") {
        //    debugger;
        //    if (args.data.Requested_Date != '') {
        //        var date = value.data.Requested_Date;
        //        var D = "";
        //        if (date != undefined) {
        //            D = date.split(' ');
        //        }
        //        args.cell.innerHTML = '<span>' + D[0] + '</span>';
        //    }
        //}
    }
}




var username = "";
var destusername = '';
var sourceusercode = '';
var destusercode = '';
function fnView(val) {
    debugger;
    $("#ProductApproval").hide();
    $("#datadiv").show();
    $('#ViewUserDetails').html('');
    username = val.data.Source_User_Name;
    destusername = val.data.Destination_User_Name;
    sourceusercode = val.data.Source_User_Code;
    destusercode = val.data.Destination_User_Code;
    transferid = val.data.Transfer_Id;
    RequestedBy = val.data.Requested_By;
    requesteddate = val.data.Requested_Date

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/GetUserDetailsOnView',
        data: "username=" + username + "&sourceusercode=" + sourceusercode + "&destinationusercode=" + destusercode + "&transferid=" + transferid,
        success: function (result) {
            debugger;
            $('#ViewUserDetails').show();
            //  $('#ProductApproval').html('');
            //  if (result != '') {
            //result = eval('(' + result + ')');
            // if (result.length > 0) {
            Jsonresult = eval('(' + result + ')');
            var Content = '';
            if (Jsonresult != null && Jsonresult != '') {
                Content += "<table class='table table-bordered' style='width:57% !important;margin-left:220px;'>";
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
                // Content += '<div class="table-responsive" style="margin-top:50px;">';
                Content += '<table class="table table-responsive" style="overflow-x:scroll !important">'; Content += '<table class="table">';

                Content += '<thead style="display:block;">';
                Content += '<tr>';
                Content += '<th style="min-width:33px;"><input type="checkbox" id="chk_0" onclick="fnSelectAll();"></th>';
                Content += '<th style="min-width: 115px;">Product Name</th>';
                Content += '<th style="min-width: 106px;">Product Type</th>';
                Content += '<th style="min-width: 94px;">Batch Number</th>';
                Content += '<th style="min-width: 110px;">Logical Quantity</th>';
                Content += '<th style="min-width: 110px;">Variance Quantity</th>';
                Content += '<th style="min-width: 110px;">Physical Quantity</th>';
                Content += '<th style="min-width: 110px;">Remarks</th>';
                Content += '<th style="min-width: 152px;">Reject Remarks</th>';
                Content += '<th style="min-width: 110px;">Delivery Chalan Number</th>';
                Content += '</tr>';
                Content += '</thead>';

                //Content += '</div>';
                Content += '<tbody style="height: 300px;display: block;overflow-y:scroll !important;">';
                for (var i = 0; i < Jsonresult.length; i++) {

                    var transId = 'Jsonresult[i].Source_User_Code';

                    Content += '<tr>';

                    Content += '<td style="min-width: 49px;"><input name="chkUserSelect" class="checkboxclass" type="checkbox"  id="chk_' + i + '"><input type="hidden" id="hiddenval' + i + '" value="' + Jsonresult[i].Trans_Id + '"></td>';
                    Content += '<td style="min-width: 115px;" id="Productname' + i + '"><input type="hidden" id="hiddenPc' + i + '" value="' + Jsonresult[i].Product_Code + '">' + Jsonresult[i].Product_Name + '</td>';
                    Content += '<td style="min-width: 115px;" id="ProductTypeName' + i + '"><input type="hidden" id="hiddenPtn' + i + '" value="' + Jsonresult[i].Product_Type + '"> ' + Jsonresult[i].Product_Type_Name + '</td>';
                    Content += '<td style="min-width: 115px;" id="batchnumber' + i + '">' + Jsonresult[i].Batch_Number + '</td>';
                    if (Jsonresult[i].Batch_Number == "undefined") {
                        Content += '<td style="min-width: 115px;"></td>';
                    }
                    Content += '<td style="min-width: 115px;" id="LogicQuantity' + i + '">' + Jsonresult[i].Logical_Quantity + '</td>';
                    Content += '<td style="min-width: 115px;" id="Variance' + i + '">' + Jsonresult[i].Variance_Count + '</td>';
                    Content += '<td style="min-width: 109px;"  id="PhysicalQuantity' + i + '">' + Jsonresult[i].Physical_Quantity + '</td>';
                    Content += '<td style="min-width: 109px;max-width:109px;word-wrap: break-word;white-space: normal;" id="Remarks' + i + '">' + Jsonresult[i].Remarks + '</td>';
                    if (Jsonresult[i].Remarks == "undefined") {
                        Content += '<td style="min-width: 115px;"></td>';
                    }
                    Content += '<td style="min-width: 115px;"><input maxlength="250" onpaste="return false" type="textarea" id="rejectedremarks' + i + '"></td>';
                    Content += '<td style="min-width: 115px;"><input type="text" id="ChalanId' + i + '"></td>';
                    Content += '</tr>';
                }
                Content += '</tbody>';
                Content += '</table>';
                Content += '</div>';
                $("#ViewUserDetails").append(Content);
                for (var i = 0; i < Jsonresult.length; i++) {
                    var productcode = Jsonresult[i].Product_Code;
                    var challan = destusercode + 'via' + transferid;
                    $('#ChalanId' + i + '').val(challan);
                }
                $("#ViewTransfer").show();
                $("#ViewTransfers").show();



            }

            else {
                $("#ViewUserDetails").append('No data found');
                // $('#ChalanId' + val + '').val(transId);
                $("#ViewTransfer").hide();
                $("#ViewTransfers").hide();
            }
        }

    });
}
function fnSelectAll() {
    if ($('#chk_0').attr('checked') == null) {
        $('.checkboxclass').attr('checked', false);
    }
    else if ($('#chk_0').attr('checked') == 'checked') {
        $('.checkboxclass').attr('checked', 'checked');
    }
}
var deliverychallanresult = '';
function fndeliverychallan(deliverychallan) {
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Activity/PromotionalInputs/Deliverychallan',
        async: false,
        data: "Deliverychallanno=" + deliverychallan,
        success: function (result) {
            debugger;
            deliverychallanresult = result;
            return result;
            //if (result == 'FALSE') {
            //    fnMsgAlert('info', 'Info', 'Delivery challan already exists. Please verify Delivery challan number.');
            //    return false;
            //}
        }
    });
}
var idVal = '';
var deliverychallan = '';
function fnApproveTransferRequest() {
    debugger;
    $.blockUI();
    var jsonData = [];

    $('input:checkbox[name=chkUserSelect]').each(function () {
        if (this.checked) {
            var value = $(this).val();
            idVal = this.id.split('_')[1];
            // if (!error) {
            var rowData = {

                SourceUserCode: "" + sourceusercode + "",
                SourceUserName: "" + username + "",
                DestinationUserCode: "" + destusercode + "",
                Status: 2,
                Remarks: "" + $("#Remarks" + idVal).text() + "",
                DestinationUserName: "" + destusername + "",
                Batch_Number: "" + $("#batchnumber" + idVal).text() + "",
                Approved_By: "",
                Approved_Date: "",
                Logical_Quantity: "" + $("#LogicQuantity" + idVal).text() + "",
                Variance_Count: "" + $("#Variance" + idVal).text() + "",
                Physical_Quantity: "" + $("#PhysicalQuantity" + idVal).text() + "",
                Product_Code: "" + $("#hiddenPc" + idVal).val() + "",
                Product_Name: "" + $("#Productname" + idVal).text() + "",
                Product_Type_Code: "" + $("#hiddenPtn" + idVal).val() + "",
                Product_Type_Name: "" + $("#ProductTypeName" + idVal).text() + "",
                Delivery_Challan_Number: "" + $("#ChalanId" + idVal).val() + "",

                Trans_Id: "" + $("#hiddenval" + idVal).val() + ""


            }
            jsonData.push(rowData);

        }
    });
    if (jsonData.length == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please select atleast one transaction.');
        return false;
    }
    deliverychallan = $("#ChalanId" + idVal).val();
    var result = fndeliverychallan(deliverychallan);
    //if (deliverychallanresult == 'FALSE') {
    if (result == "FALSE") {
        debugger;
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Delivery challan already exists. Please verify Delivery challan number.');
        return false;
    }
    if (jsonData.length > 0) {
        debugger;
        jsonData = JSON.stringify({ 'lstuserproduct': jsonData });

        $.ajax({
            type: 'POST',
            url: "../HiDoctor_Activity/PromotionalInputs/ApproveUserRequest",
            data: jsonData,
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (jsonResult) {
                debugger;
                $.unblockUI();
                if (jsonResult == "True") {
                    debugger;
                    fnMsgAlert('success', 'SUCCESS', 'Approved Successfully');
                    fnView(value);
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
var idVal = '';
function fnRejectUserRequest() {
    debugger;
    $.blockUI();
    var jsonData = [];

    $('input:checkbox[name=chkUserSelect]').each(function () {
        if (this.checked) {
            var value = $(this).val();
            idVal = this.id.split('_')[1];
            // if (!error) {
            var rowData = {

                // SourceUserCode: "" + sourceusercode + "",
                // SourceUserName: "" + username + "",
                // DestinationUserCode: "" + destusercode + "",
                // Status: 0,
                Rejected_Remarks: "" + $("#rejectedremarks" + idVal).val() + "",
                Trans_Id: "" + $("#hiddenval" + idVal).val() + "",
                Product_Code: "" + $("#hiddenPc" + idVal).val() + "",
                //DestinationUserName: "" + destusername + "",

                // Batch_Number: "" + $("#batchnumber" + idVal).val() + "",
                //Approved_By: "",
                //Approved_Date: "",
                //Logical_Quantity: "" + $("#LogicQuantity" + idVal).text() + "",
                //Physical_Quantity: "" + $("#PhysicalQuantity" + idVal).text() + "",
                //Product_Code: "" + $("#hiddenPc" + idVal).val() + "",
                //Product_Name: "" + $("#Productname" + idVal).text() + "",
                //Product_Type_Code: "" + $("#hiddenPtn" + idVal).val() + "",
                //Product_Type_Name: "" + $("#ProductTypeName" + idVal).text() + "",


            }
            jsonData.push(rowData);

        }
    });
    if (jsonData.length == 0) {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please select atleast one transaction.');
        return false;
    }

    else if ($("#rejectedremarks" + idVal).val() == '') {
        $.unblockUI();
        fnMsgAlert('info', 'Info', 'Please enter Remarks');
        return false;

    }
    if (jsonData.length > 0) {
        debugger;
        jsonData = JSON.stringify({ 'lstuserproduct': jsonData });
        $.ajax({
            type: 'POST',
            data: jsonData,
            contentType: 'application/json; charset=utf-8',
            //  data: "lstuserproduct=" + JSON.stringify(jsonData)+ "&UserCode=" + user,

            url: "../HiDoctor_Activity/PromotionalInputs/RejectUserRequest",
            success: function (jsonResult) {
                debugger;
                $.unblockUI();
                if (jsonResult == "True") {
                    debugger;
                    fnMsgAlert('success', 'SUCCESS', 'Rejected Successfully');
                    fnView(value);
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
//function fnshowremarks(val)
//{
//    debugger;
//    $.ajax({
//        type: "POST",
//        url: '../HiDoctor_Activity/PromotionalInputs/GetRemarksHistory',
//        data: "TransId=" + val,
//        success: function (response) {
//            debugger;
//            //Jsonresponse = eval('(' + response + ')');
//            var grid = new ej.grids.Grid({
//                dataSource: response,
//                showColumnChooser: true,
//                allowPaging: true,
//                allowGrouping: true,
//                allowSorting: true,
//                allowFiltering: true,
//                allowResizing: true,
//                allowCellMerging: true,
//                allowScrolling: true,
//                allowExcelExport: true,
//                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
//                filterSettings: { type: 'CheckBox' },
//                toolbar: ['Search', 'ColumnChooser'],
//                aggregates: [],
//                columns: [
                       
//                        { field: 'Remarks', headerText: 'Remarks', width: 200, textAlign: 'center' },
//                        { field: 'User_Product_Status', headerText: 'Status', width: 200, textAlign: 'center' },


//                ],
                
//            });
//            grid.appendTo('#Remarks');
//            $("#myModal").modal();
//        }
//    });
//}