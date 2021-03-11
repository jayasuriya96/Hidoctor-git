/*
Created By : Chakkaravarthi C
Created Date : 02-12-2016
For : Inward Acknowledgement
*/

var InwardAck = {
    defaults: {
        inwardAckJsonData: [],
        recieveDt: new Date(),
    },
    initialize: function () {
        debugger;
        $("#page-header").show();
        $("#divPageHeader").html("Inward Acknowledgement");
        InwardAck.defaults.recieveDt = new Date();
        //curdate_g = curdate_g.replace(/\./g, "/")
        //curdate_g = curdate_g.replace(/-/g, "/")
        //var _day  = curdate_g.split('/')[0];
        //var _month = curdate_g.split('/')[1];
        //var _year = curdate_g.split('/')[2];

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        $("#txtRecieveDate").val(day + "-" + month + "-" + year);
        $("#txtRecieveDate").datepicker({
            dateFormat: 'dd-mm-yy',
            maxDate: 0,
            onSelect: function (dateText, inst) {
                var _day = $(this).val().split('-')[0];
                var _month = (parseInt($(this).val().split('-')[1]) - 1);
                var _year = $(this).val().split('-')[2];
                InwardAck.defaults.recieveDt = new Date(_year, _month, _day);
                InwardAck.fillInwardAck();
            }
        });

        InwardAck.fnGetInwardAck();
    },
    blockUI: function (dvId) {
        $('#' + dvId).block({
            message: '<h5>Processing</h5>',
            css: { border: '1px solid rgba(0, 174, 205, 0.87)' }
        })
    },
    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
    },
    fnGetInwardAck: function () {
        $.ajax({
            start: InwardAck.blockUI("dvInwardAck"),
            type: 'POST',
            dataType: 'json',
            url: "Inward/GetInwardAck",
            success: function (jsonData) {
                if (jsonData.length > 0) {
                    InwardAck.defaults.inwardAckJsonData = jsonData;
                    InwardAck.fillInwardAck();
                }
                else {
                    InwardAck.fillNoDataFound();
                }

            },
            error: function (e) {
            },
            complete: function () {
                InwardAck.UnblockUI("dvInwardAck");
            }
        });
    },
    fillInwardAck: function () {
        var jsonData = InwardAck.defaults.inwardAckJsonData;
        $('#btnAck').prop('disabled', false);
        $("#dvInwardAck").html('');
        var str = '';
        $("#dvBtnAck").hide();
        for (var i = 0; i < jsonData.length; i++) {
            var Inward_Upload_Actual_Date = new Date(eval(jsonData[i].Inward_Upload_Actual_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
            //fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
            var _day = Inward_Upload_Actual_Date.getDate();
            var _month = Inward_Upload_Actual_Date.getMonth();
            var _year = Inward_Upload_Actual_Date.getFullYear();
            var dt = new Date(_year, _month, _day);
            if (InwardAck.defaults.recieveDt >= dt) {
                str += '<div class="col-sm-12 borderShadow">';
                str += '<div class="col-sm-12 headerTag" style="float: left;"><span class="headerSpn">Delivery Challan Number</span><span class="headerSpn">' + jsonData[i].Delivery_Challan_Number + '</span><span class="headerSpn">' + Inward_Upload_Actual_Date.getDate() + "/" + (Inward_Upload_Actual_Date.getMonth() + 01) + "/" + Inward_Upload_Actual_Date.getFullYear() + '</span></div>';
                str += '<div class="col-sm-12">';
                str += '<table class="table table-hover tblChellan" id="' + i + '_tblChellan">';
                str += '<thead>';
                str += '<tr>';
                str += '<th>S.No</th><th>Product Type</th><th>Product Name</th><th>Batch Number</th><th>Sent Quantity</th><th>Received Quantity</th><th>Received So For</th><th>Pending Quantity</th><th>Remarks</th><th>Inward History</th>';
                str += '</tr>';
                str += '</thead>';
                str += '<tbody>';
                for (var j = 0, sNo = 1; j < jsonData[i].lstInwardAck.length; j++, sNo++) {
                    var Total_Acknowledged_Qty = jsonData[i].lstInwardAck[j].Total_Acknowledged_Qty == null ? '' : jsonData[i].lstInwardAck[j].Total_Acknowledged_Qty;
                    debugger;
                    var pendingQty = (jsonData[i].lstInwardAck[j].Uploaded_Qty - (parseInt(jsonData[i].lstInwardAck[j].Total_Acknowledged_Qty) + parseInt(jsonData[i].lstInwardAck[j].Total_Adjusted_Qty)));

                    var BatchInfo = $.grep(jsonData[i].lstInwardAckBatch, function (ele) {
                        return (ele.Product_Type == jsonData[i].lstInwardAck[j].Product_Type && ele.Product_Code == jsonData[i].lstInwardAck[j].Product_Code);
                    });


                    str += '<tr id="' + i + '_' + j + '">';
                    str += '<td style="width:5%;">' + sNo + '<input type="hidden" id="' + i + '_' + j + '_hdnDeliveryChallanNumber" value="' + jsonData[i].lstInwardAck[j].Delivery_Challan_Number + '"/>';
                    str += '<input type="hidden" id="' + i + '_' + j + '_hdnInwardUploadActualDate" value="' + jsonData[i].lstInwardAck[j].Inward_Upload_Actual_Date + '"/>';
                    str += '<input type="hidden" id="' + i + '_' + j + '_hdnHeaderId" value="' + jsonData[i].lstInwardAck[j].Header_Id + '"/>';
                    str += '<input type="hidden" id="' + i + '_' + j + '_hdnDetailsId" value="' + jsonData[i].lstInwardAck[j].Details_Id + '"/>';
                    str += '<input type="hidden" id="' + i + '_' + j + '_hdnLedgerId" value="' + jsonData[i].lstInwardAck[j].Ledger_Id + '"/>';
                    str += '<input type="hidden" id="' + i + '_' + j + '_hdnProductCode" value="' + jsonData[i].lstInwardAck[j].Product_Code + '"/>';
                    str += '</td>';
                    str += '</td>';
                    str += '<td id="' + i + '_' + j + '_ProductType" style="width:15%;">' + jsonData[i].lstInwardAck[j].Product_Type + '</td>';
                    str += '<td id="' + i + '_' + j + '_ProductName" style="width:20%;">' + jsonData[i].lstInwardAck[j].Product_Name + '</td>';

                    if (BatchInfo.length > 0) {
                        var htmlBatchName = "";
                        var htmlSentQty = "";
                        var htmlAckQty = "";
                        var htmlAckQtySF = "";
                        var htmlPendingQty = "";

                        for (var k = 0; k < BatchInfo.length; k++) {
                            pendingQty = 0;
                            pendingQty = (BatchInfo[k].Uploaded_Qty - (parseInt(BatchInfo[k].Total_Acknowledged_Qty) + parseInt(BatchInfo[k].Total_Adjusted_Qty)));

                            htmlBatchName += htmlBatchName == "" ? "" : "<br/>";
                            htmlBatchName += "<div row_index='" + k.toString() + "'>" + BatchInfo[k].Batch_Number + "</div>";

                            htmlSentQty += htmlSentQty == "" ? "" : "<br/>";
                            htmlSentQty += "<div row_index='" + k.toString() + "'>" + BatchInfo[k].Uploaded_Qty + "</div>";

                            if (pendingQty != 0) {
                                htmlAckQty += htmlAckQty == "" ? "" : "<br/>";
                                htmlAckQty += "<div row_index='" + k.toString() + "'>";
                                if (InwardAck.defaults.recieveDt >= dt)
                                    htmlAckQty += "<input type='TextBox' name='AckQuantity' class='quantityBalance' value='" + pendingQty + "' />";
                                else
                                    htmlAckQty += pendingQty.toString();
                                htmlAckQty += "</div>";

                                htmlAckQtySF += htmlAckQtySF == "" ? "" : "<br/>";
                                htmlAckQtySF += "<div row_index='" + k.toString() + "'>" + BatchInfo[k].Total_Acknowledged_Qty + "</div>";

                                htmlPendingQty += htmlPendingQty == "" ? "" : "<br/>";
                                htmlPendingQty += "<div row_index='" + k.toString() + "'>" + pendingQty + "</div>";
                            }
                            else {
                                htmlAckQty += htmlAckQty == "" ? "" : "<br/>";
                                htmlAckQty += "<div row_index='" + k.toString() + "'>"
                                if (InwardAck.defaults.recieveDt >= dt)
                                    htmlAckQty += "<input type='TextBox' name='AckQuantity' class='quantityBalance' value='" + BatchInfo[k].Quantity + "' />";
                                else
                                    htmlAckQty += BatchInfo[k].Quantity.toString();
                                htmlAckQty += "</div>";

                                htmlAckQtySF += htmlAckQtySF == "" ? "" : "<br/>";
                                htmlAckQtySF += "<div row_index='" + k.toString() + "'>" + BatchInfo[k].Total_Acknowledged_Qty + "</div>";

                                htmlPendingQty += htmlPendingQty == "" ? "" : "<br/>";
                                htmlPendingQty += "<div row_index='" + k.toString() + "'>" + pendingQty + "</div>";
                            }
                        }

                        str += "<td id='" + i + '_' + j + "_BatchNumber'>";
                        str += htmlBatchName;
                        str += "</td>";
                        str += '<td id="' + i + '_' + j + '_UploadedQty">';
                        str += htmlSentQty;
                        str += '</td>';
                        str += '<td id="' + i + '_' + j + '_TotalAcknowledgedQty">';
                        str += htmlAckQty;
                        str += '</td>';
                        str += '<td id="' + i + '_' + j + '_Quantity">';
                        str += htmlAckQtySF;
                        str += '</td>';
                        str += '<td id="' + i + '_' + j + '_PendingQty">';
                        str += htmlPendingQty;
                        str += '</td>';
                    }
                    else {
                        str += "<td id='" + i + '_' + j + "_BatchNumber'><div style='display:none;' row_index='0'>NIL</div></td>";
                        str += '<td id="' + i + '_' + j + '_UploadedQty"><div row_index="0">' + jsonData[i].lstInwardAck[j].Uploaded_Qty + '</div></td>';
                        if (pendingQty != 0) {
                            str += '<td id="' + i + '_' + j + '_TotalAcknowledgedQty"><div row_index="0">';
                            if (InwardAck.defaults.recieveDt >= dt)
                                str += "<input type='TextBox' name='AckQuantity' class='quantityBalance' value='" + pendingQty + "' />";
                            else
                                str += pendingQty.toString();
                            str += "</div>";
                            str += '<td id="' + i + '_' + j + '_Quantity"><div row_index="0" >' + Total_Acknowledged_Qty + '</div></td>';
                            str += '<td id="' + i + '_' + j + '_PendingQty"><div row_index="0" >' + pendingQty + '</div></td>';
                        }
                        else {
                            str += '<td id="' + i + '_' + j + '_TotalAcknowledgedQty"><div row_index="0">';
                            if (InwardAck.defaults.recieveDt >= dt)
                                str += "<input type='TextBox' name='AckQuantity' class='quantityBalance' value='" + jsonData[i].lstInwardAck[j].Quantity + "' />";
                            else
                                str += jsonData[i].lstInwardAck[j].Quantity.toString();
                            str += "</div>";
                            str += '<td id="' + i + '_' + j + '_Quantity"><div row_index="0" >' + Total_Acknowledged_Qty + '</div></td>';
                            str += '<td id="' + i + '_' + j + '_PendingQty"><div row_index="0" >' + pendingQty + '</div></td>';
                        }
                    }

                    str += '<td><textarea style="resize:none; width:100%;" maxLength="500" id="' + i + '_' + j + '_Remarks" class="forn-control remarkscol"></textarea></td>';
                    str += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="InwardAck.fnViewRemarksHistory(\'' + jsonData[i].lstInwardAck[j].Details_Id + '\');">View Remarks History</td>';
                    str += '</tr>';
                }
                str += '</tbody>';
                str += '</table>';
                str += '</div>';
                str += '</div>';

                $('#dvErrMsg').hide();
                $('#errMsg').html("");
                $("#dvBtnAck").show();
            }
        }

        $("#dvInwardAck").html(str);

        if ($("#dvBtnAck").is(":visible")) {
            $('#dvNoteErrMsg').hide();
            $('#noteErrMsg').html("");
        }
        else {
            $('#dvNoteErrMsg').show();
            $('#noteErrMsg').html("<b>For</b> the entered recieved date there are no delivery challan items available. Please select an appropriate date.");
        }

        //Fire Function of btnAck
        $("#btnAck").off("click").click(function () {
            InwardAck.saveInwardAck();
        });

        //Fire Function of btnClear
        $("#btnClear").click(function () {
            $(".tblChellan tbody tr").each(function () {
                var trId = this.id;
                //$("#" + trId + "_txtTotalAcknowledgedQty").val("");
                $("input[name='AckQuantity']").val("");
                $("input[name='AckQuantity']").removeClass("errTxtBox");
                //$("#" + trId + "_txtTotalAcknowledgedQty").removeClass("errTxtBox");
                $("#" + trId + "_Remarks").val("");
                $('#dvErrMsg').hide();
                $('#errMsg').html("");
            });
        });

        //Fire Function of  Validate
        $(".quantityBalance").off("keyup").keyup(function () {

            if (/\D/g.test(this.value))
                this.value = this.value.replace(/\D/g, '')


            var recievedQantity = $(this).val();
            //var sendQuantity = $(this).closest("tr").find("td:eq(3)").html();
            //var recievedSoForQuantity = $(this).closest("tr").find("td:eq(5)").html();
            //var pendingQuantity = parseInt($(this).closest("tr").find("td:eq(6)").html()) == 0 ? $(this).closest("tr").find("td:eq(3)").html() : $(this).closest("tr").find("td:eq(6)").html();
            var pendingQuantity = $(this).closest("tr").find("td:eq(6)").html();
            if (parseInt(recievedQantity) > parseInt(pendingQuantity)) {
                $(this).addClass("errTxtBox");
                $('#dvErrMsg').show();
                $('#errMsg').html("<b>Please</b> enter the value Lower than Or Equal to Pending Quantity.");
            }
            else {
                $(this).removeClass("errTxtBox");
                $('#dvErrMsg').hide();
                $('#errMsg').html("");
            }


        });


    },
    saveInwardAck: function () {
        var jsonData = [];
        debugger;
        if (InwardAck.fnValidation()) {
            $('#btnAck').prop('disabled', true);
            $("[name='AckQuantity']").each(function () {
                var trId = $(this).closest("tr").attr("id");
                var AckQty = parseInt($(this).val());
                if (AckQty >= 0) {
                    var _month = "";
                    var _day = "";
                    var _year = "";
                    if ($("#txtRecieveDate").val().split("-").length > 0) {
                        _day = $("#txtRecieveDate").val().split('-')[0];
                        _month = $("#txtRecieveDate").val().split('-')[1];
                        _year = $("#txtRecieveDate").val().split('-')[2];
                    }
                    else if ($("#txtRecieveDate").val().split("/").length > 0) {
                        _month = $("#txtRecieveDate").val().split('/')[0];
                        _day = $("#txtRecieveDate").val().split('/')[1];
                        _year = $("#txtRecieveDate").val().split('/')[2];
                    }

                    var recieveDate = _month + "/" + _day + "/" + _year;
                    //var recieveDate = $("#txtRecieveDate").val();
                    var tr = $(this).closest("tr");
                    var row_index = $(this).closest("div").attr("row_index");
                    var BatchNumber = $(tr).find("#" + trId + "_BatchNumber").find("div[row_index='" + row_index + "']").html();
                    var Uploaded_Qty = parseInt($("#" + trId + "_UploadedQty").find("div[row_index='" + row_index + "']").html());
                    var Total_Acknowledged_Qty = $(this).val();
                    var Quantity = parseInt($("#" + trId + "_Quantity").find("div[row_index='" + row_index + "']").html());

                    //var adjQnty = $($("[name='AdjustingQuantity']").eq(i)).val();
                    //var pndQnty = $(tr).find("#Pending_" + index).find("div[row_index='"+row_index+"']").html();
                    //var productCode = $("#hdnProductCode_" + index).val();
                    var rowData = {
                        Delivery_Challan_Number: "" + $("#" + trId + "_hdnDeliveryChallanNumber").val() + "",
                        Inward_Upload_Actual_Date: "" + $("#" + trId + "_hdnInwardUploadActualDate").val() + "",
                        Header_Id: "" + $("#" + trId + "_hdnHeaderId").val() + "",
                        Details_Id: "" + $("#" + trId + "_hdnDetailsId").val() + "",
                        Ledger_Id: $("#" + trId + "_hdnLedgerId").val() == null ? '' : "" + $("#" + trId + "_hdnLedgerId").val() + "",
                        Product_Code: "" + $("#" + trId + "_hdnProductCode").val() + "",
                        Product_Type: "" + $("#" + trId + "_ProductType").text() + "",
                        Product_Name: "" + $("#" + trId + "_ProductName").text() + "",
                        Batch_Number: BatchNumber,
                        Uploaded_Qty: Uploaded_Qty,
                        Total_Acknowledged_Qty: Total_Acknowledged_Qty,
                        Quantity: Quantity,
                        Inward_Actual_Date: "" + recieveDate + "",
                        Remarks: $.trim($('#' + trId + '_Remarks').val())
                    };

                    jsonData.push(rowData);
                }

            });

            if (jsonData.length > 0) {
                jsonData = JSON.stringify({ 'lstInwardAck': jsonData });
                $.ajax({
                    start: InwardAck.blockUI("dvInwardAck"),
                    contentType: 'application/json; charset=utf-8',
                    type: 'POST',
                    dataType: 'json',
                    data: jsonData,
                    url: "Inward/SaveInwardAck",
                    success: function (jsonData) {
                        if (jsonData == "") {
                            fnMsgAlert('success', 'Success', 'Acknowledgement Successfully Updated.');
                            InwardAck.fnGetInwardAck();
                        }
                        else {
                            fnMsgAlert('error', 'Error', 'Acknowledgement Failed, Please Refresh the Page.');
                            InwardAck.fnGetInwardAck();
                        }

                    },
                    error: function (e) {
                    },
                    complete: function () {
                        InwardAck.UnblockUI("dvInwardAck");
                    }
                });
            }
            else {
                $('#btnAck').prop('disabled', false);
                fnMsgAlert('info', 'Information', 'Please enter the Received Quantity.');
            }
        }
    },
    fnValidation: function () {
        var chk = true;
        $("[name='AckQuantity']").each(function () {
            var trId = $(this).closest("tr").attr("id");
            var recievedQantity = parseInt($(this).val());
            var row_index = $(this).closest("div").attr("row_index");
            //var pendingQuantity = parseInt($("#" + trId + "_PendingQty").text()) == 0 ? parseInt($("#" + trId + "_UploadedQty").text()) : parseInt($("#" + trId + "_PendingQty").text());
            var pendingQuantity = parseInt($("#" + trId + "_PendingQty").find("div[row_index='" + row_index + "']").html());
            if (isNaN(recievedQantity) == false && recievedQantity >= 0) {
                if (recievedQantity > pendingQuantity) {
                    fnMsgAlert('info', 'Information', 'Received Quantity should be less than Pending Quantity.');
                    chk = false;
                    return false;
                }
            }
            else {
                fnMsgAlert('error', 'Error', 'Received Quantity should be a numeric value.');
            }

            if (parseInt(recievedQantity) < parseInt(pendingQuantity)) {
                var remarks = $('#' + trId + '_Remarks').val();
                if (remarks == "") {
                    $('#' + trId + '_Remarks').addClass("errTxtBox");
                    $('#dvErrMsg').hide();
                    fnMsgAlert('info', 'Inward Acknowledgement', 'Please enter the Remarks');
                    chk = false;
                    return false;
                }
                else {
                    var result = InwardAck.fnValidateRemarks(remarks);
                    if (result == false) {
                        fnMsgAlert('info', 'Inward Acknowledgement', "Special characters allowed in remarks are ( .;,?!(){}'/\-_ ) ");
                        chk = false;
                        return false;
                    }
                    else {
                        $('#' + trId + '_Remarks').removeClass("errTxtBox");
                        $('#dvErrMsg').hide();
                    }
                }
            }
        });
        return chk;
    },
    fillNoDataFound: function () {
        $("#dvRecievedDate").hide();
        $("#dvBtnAck").hide();
        $("#dvInwardAck").html('');
        var str = '';

        str += '<div class="col-sm-6 col-sm-offset-3">';
        str += '<div class="col-sm-12">';
        str += '<div class="alert alert-danger"><strong>You</strong> do not have any pending inward for acknowledgement</div>';
        str += '</div>';

        $("#dvInwardAck").html(str);
    },
    fnValidateRemarks: function (rmrks) {
        debugger;
        var specialCharregex = new RegExp(/^[ A-Za-z0-9.;,?!(){}'/\-_ ]*$/);

        if (specialCharregex.test(rmrks) == false) {
            return false;
        }
        else {
            return true;
        }

    },
    fnViewRemarksHistory: function (HdrId) {
        debugger;
        if (HdrId != '' || HdrId != undefined) {
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Master/Inward/GetRemarksHistory",
                data: "Header_Id=" + HdrId,
                success: function (resp) {
                    console.log(resp);
                    InwardAck.fnBindRemarksHistory(resp);
                }
            });
        }
    },
    fnBindRemarksHistory: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        var lstBatch = resp.lstBatchLedger;
        if (resp.lstLedger != '' || resp.lstLedger.length != 0) {


            //$('#upldby').html(resp.lstHeader[0].Uploaded_UserName);
            $('#prdtnam').html(resp.lstHeader[0].Product_Name);
            $('#totlqnty').html(resp.lstHeader[0].Uploaded_Qty);
            $('#cretdon').html(resp.lstHeader[0].Created_For_Date);
            $('#upldfr').html(resp.lstHeader[0].User_Name);
            content += '<table class="table table-hover" style="text-align:center;">';
            content += '<thead style="text-align:center;">';
            content += '<tr>';
            content += '<th>S.No</th>';
            content += '<th>Modified Inward Actual Date</th>';
            content += '<th>Modified On</th>';
            content += '<th>Batch Number</th>';
            content += '<th>Quantity</th>';
            content += '<th>Acknowledgement/Adjustment Type</th>'
            content += '<th style="width:40%;">Remarks</th>';
            content += '</thead><tbody>';
            var list = lstBatch.length > 0 ? lstBatch : resp.lstLedger;

            if (list.length >= 1) {
                //var Quantity_Type = resp.lstLedger[0].Quantity_Type;

                for (var i = 0; i < list.length; i++) {
                    
                    sno++;
                    content += '<tr>';
                    content += '<td>' + sno + '</td>';
                    content += '<td>' + list[i].Inward_Actual_Date + '</td>';
                    content += '<td>' + list[i].Inward_Entered_Date + '</td>';
                    if (lstBatch.length > 0) {
                        content += '<td>' + lstBatch[i].Batch_Number + '</td>';
                        content += '<td>' + lstBatch[i].Quantity + '</td>';
                    }
                    else {
                        content += '<td></td>';
                        content += '<td>' + list[i].Quantity + '</td>';
                    }

                    content += '<td>' + list[i].Quantity_Type + '</td>';
                    if (list[i].Remarks == null) {
                        content += '<td></td>';
                    } else {
                        content += '<td style="word-wrap:break-word;white-space:normal;text-align:justify;word-break:break-word;">' + list[i].Remarks + '</td>';
                    }
                    content += '</tr>';
                }
            }
            content += '</tbody></table>';
            $('#DetHstry').html(content);
            $('#InwardRemarksHistory').modal('show');
        }
        else {
            fnMsgAlert('info', 'Inward Adjustment', 'No Remarks History available for this Challan');
            return false;
        }
    },
    //fnCheckedChange : function(productCode, )
    //{

    //}
}