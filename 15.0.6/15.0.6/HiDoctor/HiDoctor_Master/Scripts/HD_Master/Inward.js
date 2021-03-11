//Date : 26-11-2012
//Created For : Inward master
//Created by : SriSudan

//Global variables
var result = "";
var userTypeProductMaxCount_g = 30;
var userProductMaxCount_g = 10;
//function starts here
$('#txtSearchNode').bind("keypress", function (e) {
    if (e.keyCode == 13) {
        fnSearchUsers();
        return false;
    }
});

$(".ActiveProduct").click(function () {
    GetAllInward();
});

$(".Inactiveproduct").click(function () {
    GetAllInward();
});

//function to call Inward Ack config value
function getUserDashboardInwardAcknowlegementConfigValue() {
    debugger;
    var chkStatus = "";
    $.ajax({
        type: 'POST',
        dataType: 'json',
        async: false,
        //data: _data,
        url: "DashBoard/GetUserDashboardInwardAcknowlegementConfigValue",
        success: function (jsonResult) {

            chkStatus = jsonResult;

        },
        error: function (e) {
            //fnMsgAlert('error', 'Error', 'Bind Open Position PopUp failed');
        },
        complete: function () {
        }
    });
    return chkStatus;
}



//function to call tree click event
function fnUserTreeNodeClick(node) {
    debugger;
    $('#frmloading').css('display', '');
    //if ($('form').validate().form()) {
    //if ($("#txtDatePicker").val() == "") {
    //    alert("Please Select the Date");
    //}
    //return false;
    $("#UserCode").val(node.data.key);
    $('#Lbl_Region_name').html(node.data.title);
    if (typeof ($("#UserCode").val()) != "undefined") {
        GetAllInward(); //........
        //GetAllstock();
        $("#btnSave").show();
        $("#btnSave1").show();
        $('#href').html(node.data.title);
        $("#btnSave").val("SAVE");
        $("#btnSave1").val("SAVE");

        //}
        $('#frmloading').css('display', 'none');
    }
}
//function to user data table//
function GetAllInward() {
    debugger;
    var Date = $("#txtDatePicker").val();
    var InwardDate = Date.split("-")[2] + "-" + Date.split("-")[1] + "-" + Date.split("-")[0];
    $.ajax({
        url: '../HiDoctor_Master/Inward/GetAllInward',
        type: "POST",
        data: "UserCode=" + $("#UserCode").val() + "&InwardDate=" + InwardDate,
        success: function (JsonResult) {
            debugger;
            result = JsonResult;
            var batchList = JsonResult.Batch;
            JsonResult = JsonResult.Product;

            //$("#tbl_inward").dataTable().clear();
            //$("#tbl_inwards").dataTable().clear();

            $("#productlist").show();
            if ($('li.activeproducts').hasClass('active') == true) {
                $('#dvTable').empty();
                var content = "";
                content += "<table class='data display datatable' id='tbl_inward' table-layout:fixed>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>Product Type</th>";
                content += "<th style='width:166px'>Product Name</th>";
                content += "<th>Batch No</th>";
                content += "<th>Inward Stock</th>";
                content += "<th>Current Stock</th>";
                content += "<th>Remarks</th>";
                content += "<th>History</th>";
                content += "</tr>";
                content += "</thead>";
                content += "<tbody>";



                var Validproductdetails = $.grep(JsonResult, function (ele) {
                    return ele.Effective_Status == 1;
                });



                for (var i = 0; i < Validproductdetails.length; i++) {

                    var nobatch = $.grep(batchList, function (ele) {
                        return ele.Product_Code == Validproductdetails[i].ProductCode;
                    });
                    if (nobatch.length > 0) {
                        var nobatch1 = $.grep(batchList, function (ele) {
                            return ele.Product_Code == Validproductdetails[i].ProductCode && ele.Effective_Status == 1;
                        });

                        if (nobatch1.length > 0) {
                            var productBatch = $.grep(batchList, function (ele) {
                                return ele.Product_Code == Validproductdetails[i].ProductCode;
                            });

                            content += "<tr >";
                            content += "<td >";
                            content += Validproductdetails[i].ProductTypeName;
                            content += "</td>";
                            content += "<td style='" + (parseInt(Validproductdetails[i].Effective_Status) == 0 ? "color:red;" : "") + "' >";
                            content += Validproductdetails[i].ProductName;
                            content += "<input type='hidden' id='hdnProductCode_" + i + "' value='" + Validproductdetails[i].ProductCode + "' />";
                            content += "<input type='hidden' id='hdnProdEffective" + i.toString() + "' value='" + Validproductdetails[i].Effective_Status.toString() + "' />";
                            content += "</td>";

                            var productValidBatch = $.grep(batchList, function (ele) {
                                return ele.Effective_Status == 1 && ele.Product_Code == Validproductdetails[i].ProductCode;
                            });

                            if (productValidBatch.length > 0) {
                                var htmlBatchName = "";
                                var htmlInwardText = "";
                                var htmlCurrentStock = "";
                                var htmlRemarksText = "";

                                for (var j = 0; j < productBatch.length; j++) {
                                    if (parseInt(productBatch[j].Effective_Status) == 1) {
                                        htmlBatchName += htmlBatchName == "" ? "" : "<br/>";
                                        htmlBatchName += "<div row_index='" + j.toString() + "' style='" + (parseInt(productBatch[j].Effective_Status) == 0 ? "color:red;" : "") + "'>" + productBatch[j].Batch_Number + "</div>";

                                        htmlInwardText += htmlInwardText == "" ? "" : "<br/>";
                                        htmlInwardText += "<div row_index='" + j.toString() + "'><input type='TextBox' name='txtAllocation' /> <input type='hidden' name='hdnEffectiveStatus' value='" + productBatch[j].Effective_Status + "' /> </div>";

                                        htmlCurrentStock += htmlCurrentStock == "" ? "" : "<br/>";
                                        htmlCurrentStock += "<div row_index='" + j.toString() + "'>" + productBatch[j].Current_Stock + "</div>";

                                        htmlRemarksText += htmlRemarksText == "" ? "" : "<br/>";
                                        htmlRemarksText += "<div row_index='" + j.toString() + "'><input type='TextBox' name='txtRemarks' id='txtRemarksEnter_" + i + "' />  </div>";

                                    }
                                }

                                content += "<td name='tdBatch' class='clsbatch' td_index='" + i.toString() + "'>";
                                content += htmlBatchName;
                                content += "</td>";
                                content += "<td class='clsinward' td_index='" + i.toString() + "'>";
                                content += htmlInwardText;
                                content += "</td>";
                                content += "<td class='clscurrentstock' name='tdCurrentStock'>";
                                content += htmlCurrentStock;
                                content += "</td>";
                                content += "<td class='clsremarks' name='tdremarks'>";
                                content += htmlRemarksText;
                                content += "</td>";

                            }

                            else {
                                content += "<td name='tdBatch' class='clsbatch' td_index='" + i.toString() + "'><div style='display:none;' row_index='0'>NIL</div></td>";
                                content += "<td class='clsinward' td_index='" + i.toString() + "'>";
                                content += "<div row_index='0'><input type='TextBox' name='txtAllocation' /><input type='hidden' name='hdnEffectiveStatus' value='1' /></div>";
                                content += "</td>";
                                content += "<td class='clscurrentstock' name='tdCurrentStock'><div row_index='0'>";
                                content += Validproductdetails[i].CurrentStock;
                                content += "</div></td>"
                                content += "<td class='clsremarks' name='tdremarks'>";
                                content += "<div row_index='0'><input type='TextBox' name='txtRemarks' id='txtRemarksEnter_" + i + "' /></div>";
                                content += "</td>";

                            }


                            content += "<td>";
                            content += "<a href='#' id='a_" + i + "' onclick ='fnEdit(this);'>Click here</a>";
                            content += "</td>";
                            content += "</tr>";
                        }

                    }
                    else {
                        //var Validproduct = $.grep(batchList, function (ele) {
                        //    return ele.Product_Code != Validproductdetails[i].Product_Code;
                        //});

                        //  if (Validproduct.length > 0) {
                        content += "<tr >";
                        content += "<td >";
                        content += Validproductdetails[i].ProductTypeName;
                        content += "</td>";
                        content += "<td style='" + (parseInt(Validproductdetails[i].Effective_Status) == 0 ? "color:red;" : "") + "' >";
                        content += Validproductdetails[i].ProductName;
                        content += "<input type='hidden' id='hdnProductCode_" + i + "' value='" + Validproductdetails[i].ProductCode + "' />";
                        content += "<input type='hidden' id='hdnProdEffective" + i.toString() + "' value='" + Validproductdetails[i].Effective_Status.toString() + "' />";
                        content += "</td>";

                        content += "<td name='tdBatch' class='clsbatch' td_index='" + i.toString() + "'><div style='display:none;' row_index='0'>NIL</div></td>";
                        content += "<td class='clsinward' td_index='" + i.toString() + "'>";
                        content += "<div row_index='0'><input type='TextBox' name='txtAllocation' /><input type='hidden' name='hdnEffectiveStatus' value='1' /></div>";
                        content += "</td>";
                        content += "<td class='clscurrentstock' name='tdCurrentStock'><div row_index='0'>";
                        content += Validproductdetails[i].CurrentStock;
                        content += "</div></td>"
                        content += "<td class='clsremarks' name='tdremarks'>";
                        content += "<div row_index='0'><input type='TextBox' name='txtRemarks' id='txtRemarksEnter_" + i + "' /></div>";
                        content += "</td>";

                        content += "<td>";
                        content += "<a href='#' id='a_" + i + "' onclick ='fnEdit(this);'>Click here</a>";
                        content += "</td>";
                        content += "</tr>";
                    }
                    // }
                }

                content += "</tbody>";
                content += "</table>";

                $("#dvTable").html(content);
                if ($.fn.dataTable) { $('#tbl_inward').dataTable({ bPaginate: false, "bFilter": true, "bAutoWidth": false, "scrollY": 200, "scrollX": true }); };
                //if( $.fn.dataTable) tables({ visible: true, api: true }).columns.adjust();
                //            $('#tbl_inward').dataTable({
                //                "bLengthChange": false,
                //                "bPaginate": true,
                //                "sScrollY": "500px",
                //                "sDom": "frtidS",
                //                "bDeferRender": true
                //            }).rowGrouping({ bExpandableGrouping: true, iGroupingColumnIndex: 0 });

                //"sScrollY": "500px",
                $("#dvTable").show();
            }

            else if ($('li.inactive').hasClass('active') == true) {
                $('#tblTaskTeamStatus').empty();
                var content = "";
                content += "<table class='data display datatable' id='tbl_inwards' table-layout:fixed>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>Product Type</th>";
                content += "<th style='width:166px !important'>Product Name</th>";
                content += "<th>Batch No</th>";
                content += "<th>Inward Stock</th>";
                content += "<th>Current Stock</th>";
                content += "<th>Remarks</th>";
                content += "<th>History</th>";
                content += "</tr>";
                content += "</thead>";
                content += "<tbody>";
                //  for (var i = 0; i < JsonResult.length; i++) {



                var arr = [];


                var InactiveProudct = $.grep(JsonResult, function (v) {
                    return v.Effective_Status == 0;
                });


                for (var j = 0 ; j < InactiveProudct.length; j++) {


                    var productCode = InactiveProudct[j].ProductCode;

                    batchList.map(function (i, e) {
                        if (i.Product_Code == productCode && i.Effective_Status == 0) {
                            var obj = {};
                            obj.ProductName = InactiveProudct[j].ProductName;
                            obj.ProductTypeName = InactiveProudct[j].ProductTypeName;
                            obj.CurrentStock = InactiveProudct[j].CurrentStock;
                            obj.ProductName = InactiveProudct[j].ProductName;
                            obj.ProductCode = InactiveProudct[j].ProductCode;
                            obj.Effective_Status = InactiveProudct[j].Effective_Status;
                            obj.BatchNumber = i.Batch_Number
                            obj.Batch_Status = i.Batch_Status;
                            obj.Inward_Stock = i.Inward_Stock;
                            obj.Batch_Effective_Status = i.Effective_Status;
                            obj.Batch_Current_Stock = i.Current_Stock;

                            arr.push(obj);

                        }
                    });
                }


                var activeProudct = $.grep(JsonResult, function (v) {
                    return v.Effective_Status == 1;
                });


                for (var j = 0 ; j < activeProudct.length; j++) {
                    var productCode = activeProudct[j].ProductCode;

                    batchList.map(function (i, e) {
                        if (i.Product_Code == productCode && i.Effective_Status == 0) {
                            var obj = {};
                            obj.ProductName = activeProudct[j].ProductName;
                            obj.ProductTypeName = activeProudct[j].ProductTypeName;
                            obj.CurrentStock = activeProudct[j].CurrentStock;
                            obj.ProductName = activeProudct[j].ProductName;
                            obj.ProductCode = activeProudct[j].ProductCode;
                            obj.Effective_Status = activeProudct[j].Effective_Status;
                            obj.BatchNumber = i.Batch_Number
                            obj.Batch_Status = i.Batch_Status;
                            obj.Inward_Stock = i.Inward_Stock;
                            obj.Batch_Effective_Status = i.Effective_Status;
                            obj.Batch_Current_Stock = i.Current_Stock;
                            arr.push(obj);
                        }
                    });
                }

                var Validproductdetails = $.grep(JsonResult, function (ele) {
                    return ele.Effective_Status == 0;
                });
                Validproductdetails.map(function (i, e) {
                    var obj = {};
                    obj.ProductName = i.ProductName;
                    obj.ProductTypeName = i.ProductTypeName;
                    obj.CurrentStock = i.CurrentStock;
                    obj.ProductName = i.ProductName;
                    obj.ProductCode = i.ProductCode;
                    obj.Effective_Status = i.Effective_Status;
                    obj.BatchNumber = ""
                    obj.Batch_Status = ""
                    obj.Inward_Stock = ""
                    obj.Batch_Effective_Status = 0
                    arr.push(obj);
                });

                var uniqueSet = arr.reduce(function (arr, e1) {
                    var matches = arr.filter(function (e2)
                    { return e1.ProductCode == e2.ProductCode && e1.BatchNumber == e2.BatchNumber });
                    if (matches.length == 0) {
                        arr.push(e1);
                    }
                    return arr;
                }, []);
                arr = uniqueSet;
                for (var i = 0; i < arr.length; i++) {

                    //        if (Validproductdetails.length > 0) {
                    content += "<tr >";
                    content += "<td >";
                    content += arr[i].ProductTypeName;
                    content += "</td>";
                    content += "<td style='" + (parseInt(arr[i].Effective_Status) == 0 ? "color:red;" : "") + "' >";
                    content += arr[i].ProductName;
                    content += "<input type='hidden' id='hdnProductCodeinvalid_" + i + "' value='" + arr[i].ProductCode + "' />";
                    content += "<input type='hidden' id='hdnProdEffectiveinvalid" + i.toString() + "' value='" + arr[i].Effective_Status.toString() + "' />";
                    content += "</td>";

                    //var productValidBatch = $.grep(batchList, function (ele) {
                    //    return ele.Effective_Status == 0;
                    //});
                    if (arr[i].BatchNumber != "") {
                        //   if (productBatch.length > 0) {
                        var htmlBatchName = "";
                        var htmlInwardText = "";
                        var htmlCurrentStock = "";
                        var htmlRemarksText = "";

                        //for (var j = 0; j < arr.length; j++) {
                        //    if (parseInt(arr[j].Effective_Status) == 0) {

                        htmlBatchName += htmlBatchName == "" ? "" : "<br/>";
                        htmlBatchName += "<div row_index='" + i.toString() + "' style='" + (parseInt(arr[i].Batch_Effective_Status) == 0 ? "color:red;" : "") + "'>" + arr[i].BatchNumber + "</div>";

                        htmlInwardText += htmlInwardText == "" ? "" : "<br/>";
                        htmlInwardText += "<div row_index='" + i.toString() + "'><input type='TextBox' name='txtAllocationinvalid' /> <input type='hidden' name='hdnEffectiveStatusinvalid' value='" + arr[i].Batch_Effective_Status + "' /> </div>";

                        htmlCurrentStock += htmlCurrentStock == "" ? "" : "<br/>";
                        htmlCurrentStock += "<div row_index='" + i.toString() + "'>" + arr[i].Batch_Current_Stock + "</div>";

                        htmlRemarksText += htmlRemarksText == "" ? "" : "<br/>";
                        htmlRemarksText += "<div row_index='" + i.toString() + "'><input type='TextBox' name='txtRemarksinvalid' id='txtRemarksEnter_" + i + "' />  </div>";

                        //    }
                        //   }

                        content += "<td name='tdBatchinvalid' class='clsbatch' td_index='" + i.toString() + "'>";
                        content += htmlBatchName;
                        content += "</td>";
                        content += "<td class='clsinward' td_index='" + i.toString() + "'>";
                        content += htmlInwardText;
                        content += "</td>";
                        content += "<td class='clscurrentstock' name='tdCurrentStockinvalid'>";
                        content += htmlCurrentStock;
                        content += "</td>";
                        content += "<td class='clsremarks' name='tdremarksinvalid'>";
                        content += htmlRemarksText;
                        content += "</td>";
                    }
                        //}

                    else {
                        content += "<td name='tdBatchinvalid' class='clsbatch' td_index='" + i.toString() + "'><div style='display:none;' row_index='0'>NIL</div></td>";
                        content += "<td class='clsinward' td_index='" + i.toString() + "'>";
                        content += "<div row_index='0'><input type='TextBox' name='txtAllocationinvalid' /><input type='hidden' name='hdnEffectiveStatusinvalid' value='1' /></div>";
                        content += "</td>";
                        content += "<td class='clscurrentstock' name='tdCurrentStockinvalid'><div row_index='0'>";
                        content += arr[i].CurrentStock;
                        content += "</div></td>";
                        content += "<td class='clsremarks' name='tdremarksinvalid'>";
                        content += "<div row_index='0'><input type='TextBox' name='txtRemarksinvalid' id='txtRemarksEnter_" + i + "' /></div>";
                        content += "</td>";
                    }

                    content += "<td>";
                    content += "<a href='#' id='a_" + i + "' onclick ='fnEdit(this);'>Click here</a>";
                    content += "</td>";
                    content += "</tr>";

                }
                content += "</tbody>";
                content += "</table>";

                $("#tblTaskTeamStatus").html(content);
                if ($.fn.dataTable) {
                    $('#tbl_inwards').dataTable({
                        bPaginate: false, "bFilter": true, "bAutoWidth": false, "scrollY": 200, "scrollX": true
                    });
                };
                //            $('#tbl_inward').dataTable({
                //                "bLengthChange": false,
                //                "bPaginate": true,
                //                "sScrollY": "500px",
                //                "sDom": "frtidS",
                //                "bDeferRender": true
                //            }).rowGrouping({ bExpandableGrouping: true, iGroupingColumnIndex: 0 });

                //"sScrollY": "500px",
                $("#tblTaskTeamStatus").show();
            }

        },
        error: function () {
            alert("error");
        }

    });
}


//Function inward taken by history//
//function GetAllstock() {
//    $.ajax({
//        url: '../HiDoctor_Master/Inward/GetAllstock',
//        type: "POST",
//        data: "UserCode=" + $("#UserCode").val() + "&InwardDate=" + $("#txtDatePicker").val(),
//        success: function (JsonResult) {
//            //            result = JsonResult;
//            var content = "";
//            content += "<table class='data display datatable' id='tbl_stock'>";
//            content += "<thead>";
//            content += "<tr>";
//            content += "<th>Inward Date</th>";
//            content += "<th>Product</th>";
//            content += "<th>Count</th>";
//            content += "</tr>";
//            content += "</thead>";
//            content += "<tbody>";
//            for (var i = 0; i < JsonResult.length; i++) {
//                content += "<tr>";
//                content += "<td>";
//                content += JsonResult[i].InwardDate;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].product;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].count;
//                content += "</td>";
//                content += "</tr>";
//            }
//            content += "</tbody>";
//            content += "</table>";
//            $("#dvTable2").html(content);
//            if ($.fn.dataTable) { $('#tbl_stock').dataTable({ "sPaginationType": "full_numbers", "bFilter": false }); };
//            $("#dvTable2").show();
//            $("#lbl_txt").show();
//        },
//        error: function () {
//            alert("error");
//        }
//    });
//}

//function table taken by product//
function fnEdit(obj) {
    debugger;
    fnBlockDiv("tbl_inward_wrapper", "Please wait...");
    $(obj).addClass("disabled")
    if (obj.id) {
        var productId = obj.id.replace('a', 'hdnProductCode');
        var ProductCode = $("#" + productId).val();
    }

    $.ajax({
        url: '../HiDoctor_Master/Inward/GetAllInwardHistory',
        type: "POST",
        data: "UserCode=" + $("#UserCode").val() + "&ProductCode=" + ProductCode,
        success: function (JsonResult) {
            //            result = JsonResult;
            var lstProduct = JsonResult.Product;
            var lstBatch = JsonResult.Batch;
            JsonResult = lstProduct;
            if (JsonResult != "" && JsonResult != null) {
                var content = "";
                content += "<table class='data display datatable' id='tblSummary'>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>User Name</th>";
                content += "<th>" + JsonResult[0].Username + "</th></tr>";
                content += "<tr>";
                content += "<th>Product Name</th>";
                content += "<th>" + JsonResult[0].ProductName + "</th></tr>";
                content += "</thead>";
                content += "</table>";

                if (lstBatch.length > 0)
                    JsonResult = lstBatch;

                content += "<table class='data display datatable' id='tblSummary'>";
                content += "<thead>";
                content += "<tr>";
                content += "<th>Inward Date</th>";
                if (lstBatch.length > 0)
                    content += "<th>Batch No</th>"
                content += "<th>Inward Quantity</th>";
                content += "<th>Current Stock during allocation</th>";
                content += "</tr>";
                content += "</thead>";
                content += "<tbody>";
                for (var i = 0; i < JsonResult.length; i++) {
                    content += "<tr>";
                    content += "<td>";
                    content += lstBatch.length > 0 ? JsonResult[i].Inward_Date : JsonResult[i].InwardDate;
                    content += "</td>";
                    if (lstBatch.length > 0) {
                        content += "<td>" + JsonResult[i].Batch_Number + "</td>"
                    } content += "<td>";
                    content += lstBatch.length > 0 ? JsonResult[i].Inward_Stock : JsonResult[i].InwardQuantity;
                    content += "</td>";
                    content += "<td>";
                    content += lstBatch.length > 0 ? JsonResult[i].Current_Stock : JsonResult[i].ThenStock;
                    content += "</td>";
                    content += "</tr>";
                }
                content += "</tbody>";
                content += "</table>";

                $("#divModel").html(content);
                // if ($.fn.dataTable) { $('#tblSummary').dataTable({ "sPaginationType": "full_numbers" }); };
                $("#divModel").show();
                ShowModalPopup('modal');
            }
            else {
                $("#divModel").html("");
                fnMsgAlert("info", "info", "No Inward History found for this product.");
                return;
            }
        },
        error: function () {
            fnUnBlockDiv("tbl_inward_wrapper");
        },
        complete: function () {
            fnUnBlockDiv("tbl_inward_wrapper");
            $(obj).removeClass("disabled")
        }

    });
}

//for datatable read//

function fnreadtable() {
    debugger;
    var isError = false;
    var tblrowlength = $("[name='txtAllocation']").length;
    var content = ""
    for (var i = 0; i < tblrowlength; i++) {
        if ($($("[name='txtAllocation']")[i]).val() != "") {
            var td = $($("[name='txtAllocation']")[i]).closest("td");

            var effectiveStatus = parseInt($($("[name='hdnEffectiveStatus']")[i]).val());
            var tr = $($("[name='txtAllocation']")[i]).closest("tr");
            var index = $(td).attr("td_index");
            var row_index = $($("[name='txtAllocation']")[i]).closest("div").attr("row_index");
            var prodEffective = parseInt($("#hdnProdEffective" + index.toString()).val());
            var ProductCode = $("#hdnProductCode_" + index).val();
            var BatchNumber = $(tr).find("td[name='tdBatch']").find("div[row_index='" + row_index + "']").html();
            var InwardStock = $($("[name='txtAllocation']")[i]).val();
            var CurrentStock = $(tr).find("td[name='tdCurrentStock']").find("div[row_index='" + row_index + "']").html();
            var remarks = $($("[name='txtRemarks']")[i]).val(); // $("#txtRemarksEnter_" + i + "").val();

            //            for validation

            if (isNaN(InwardStock)) {
                fnMsgAlert("info", "Information", "Inward Stock should be a Numeric value")
                $("#btnSave").show();
                isError = true;
                break;

            }
            debugger;
            var allowNegative = fnGetPrivilegeValue("INWARD_ALLOCATION_ALLOW_NEGATIVES", "NO");
            if (allowNegative == "NO") {
                if (parseInt(InwardStock) < 0) {
                    fnMsgAlert("error", "Error", "Please enter value greater than zero in Inward Stock");
                    isError = true;
                    break;
                }
            }


            if (prodEffective == 0) {
                if (parseInt(InwardStock) > 0) {
                    fnMsgAlert("error", "Error", "Cannot do Positive allocation for InActive/Expired Product.");
                    isError = true;
                    break;
                }
            }

            if (effectiveStatus == 0) {
                if (parseInt(InwardStock) > 0) {
                    fnMsgAlert("error", "Error", "Cannot do Positive allocation for InActive/Expired Batch.");
                    isError = true;
                    break;
                }
            }

            var qtySum = parseInt(InwardStock) + parseInt(CurrentStock);
            if (qtySum < 0) {
                fnMsgAlert("error", "Error", "Current Stock cannot be less than zero");
                $("#btnSave").show();
                isError = true;
                break;
            }

            if (allowNegative == "YES" && parseInt(InwardStock) < 0 && remarks == "") {
                fnMsgAlert("error", "Error", "Please Enter Remarks for Negative Inward Stock value");
                isError = true;
                break;
            }

            content += ProductCode + "_" + BatchNumber + "_" + InwardStock + "_" + CurrentStock + "_" + remarks + "^";
        }
    }
    if (isError) {
        return "FALSE";
    }
    else {
        return content
    }
}
function fnreadtableinvalid() {
    debugger;
    var isError = false;
    var tblrowlength = $("[name='txtAllocationinvalid']").length;
    var content = ""
    for (var i = 0; i < tblrowlength; i++) {
        if ($($("[name='txtAllocationinvalid']")[i]).val() != "") {
            var td = $($("[name='txtAllocationinvalid']")[i]).closest("td");

            var effectiveStatus = parseInt($($("[name='hdnEffectiveStatusinvalid']")[i]).val());
            var tr = $($("[name='txtAllocationinvalid']")[i]).closest("tr");
            var index = $(td).attr("td_index");
            var row_index = $($("[name='txtAllocationinvalid']")[i]).closest("div").attr("row_index");
            var prodEffective = parseInt($("#hdnProdEffectiveinvalid" + index.toString()).val());
            var ProductCode = $("#hdnProductCodeinvalid_" + index).val();
            var BatchNumber = $(tr).find("td[name='tdBatchinvalid']").find("div[row_index='" + row_index + "']").html();
            var InwardStock = $($("[name='txtAllocationinvalid']")[i]).val();
            var CurrentStock = $(tr).find("td[name='tdCurrentStockinvalid']").find("div[row_index='" + row_index + "']").html();
            var remarks = $($("[name='txtRemarksinvalid']")[i]).val(); // $("#txtRemarksEnter_" + i + "").val();
            //            for validation

            if (isNaN(InwardStock)) {
                fnMsgAlert("info", "Information", "Inward Stock should be a Numeric value")
                $("#btnSave").show();
                isError = true;
                break;

            }
            debugger;
            var allowNegative = fnGetPrivilegeValue("INWARD_ALLOCATION_ALLOW_NEGATIVES", "NO");
            if (allowNegative == "NO") {
                if (parseInt(InwardStock) < 0) {
                    fnMsgAlert("error", "Error", "Please enter value greater than zero in Inward Stock");
                    isError = true;
                    break;
                }
            }


            if (prodEffective == 0) {
                if (parseInt(InwardStock) > 0) {
                    fnMsgAlert("error", "Error", "Cannot do Positive allocation for InActive/Expired Product.");
                    isError = true;
                    break;
                }
            }

            if (effectiveStatus == 0) {
                if (parseInt(InwardStock) > 0) {
                    fnMsgAlert("error", "Error", "Cannot do Positive allocation for InActive/Expired Batch.");
                    isError = true;
                    break;
                }
            }

            var qtySum = parseInt(InwardStock) + parseInt(CurrentStock);
            if (qtySum < 0) {
                fnMsgAlert("error", "Error", "Current Stock cannot be less than zero");
                $("#btnSave").show();
                isError = true;
                break;
            }

            if (allowNegative == "YES" && parseInt(InwardStock) < 0 && remarks == "") {
                fnMsgAlert("error", "Error", "Please Enter Remarks for Negative Inward Stock value");
                isError = true;
                break;
            }

            content += ProductCode + "_" + BatchNumber + "_" + InwardStock + "_" + CurrentStock + "_" + remarks + "^";
        }
    }
    if (isError) {
        return "FALSE";
    }
    else {
        return content
    }
}
//Save Functionality//
function fnSave() {
    debugger;
    $("#btnSave").hide();
    // if ($('form').validate().form()) {
    if ($("#txtDatePicker").val() == "") {
        alert("Please Select the Date");
    }
    else {
        var dates = $("#txtDatePicker").val().split('-');
        date = dates[2] + '-' + dates[1] + '-' + dates[0];
        var content;
        if ($('li.inactive').hasClass('active') == true) {
            content = fnreadtableinvalid();
        }
        else {
            content = fnreadtable();
        }
        if (content != "FALSE" && content != "") {
            $.ajax({
                url: '../HiDoctor_Master/Inward/save/',
                type: "POST",
                data: "Content=" + content + "&UserCode=" + $("#UserCode").val() + "&SelectDate=" + date,
                success: function (Data) {
                    $("#btnSave").val("SAVE");
                    fnMsgAlert("success", "Success", "Saved Successfully")
                    GetAllInward();
                    //GetAllstock();
                    $("#btnSave").show();
                    Cancel();
                },
                error: function () {
                    fnMsgAlert("error", "Error", "Error saving Inward Stock.");
                },
                complete: function () {
                }
            });
        }
        else {
            $("#btnSave").show();
        }
    }
}

//}
//function fnHistory() {
//    $.ajax({
//        url: 'Inward/GetAllUserProduct',
//        type: "POST",
//        data: "UserCode=" + $("#UserCode").val(),
//        success: function (JsonResult) {
//            //            result = JsonResult;
//            var content = "";
//            content += "<table class='data display datatable' id='tblSummary2'>";
//            content += "<thead>";
//            content += "<tr>";
//            content += "<th>User Name</th>";
//            content += "<th>Product Name</th>";
//            content += "<th>Inward Date</th>";
//            content += "<th>Inward Quantity</th>";
//            content += "<th>Then Stock</th>";
//            content += "</tr>";
//            content += "</thead>";
//            content += "<tbody>";
//            for (var i = 0; i < JsonResult.length; i++) {
//                content += "<tr>";
//                content += "<td>";
//                content += JsonResult[i].Username;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].ProductName;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].InwardDate;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].InwardQuantity;
//                content += "</td>";
//                content += "<td>";
//                content += JsonResult[i].ThenStock;
//                content += "</td>";
//                content += "</tr>";
//            }
//            content += "</tbody>";
//            content += "</table>";
//            $("#divModel").html(content);
//            if ($.fn.dataTable) { $('#tblSummary2').dataTable({ "sPaginationType": "full_numbers" }); };
//            $("#divModel").show();
//            ShowModalPopup('modal');
//        },
//        error: function () {
//            alert("error");
//        }
//    });
//}

function Cancel() {
    //    $("#txtDatePicker").val("");
    var tblrowlength = $("[name='txtAllocation']").length;
    var content = ""
    for (var i = 0; i < tblrowlength; i++) {
        $("[name='txtAllocation']")[i].val("");
    }
}

/************************** START: Bulk upload *********************************/
var division_g
var typeMaster_g
var userType_g
var products_g
function fnGetDivision() {
    $.ajax({
        url: '../HiDoctor_Master/Inward/GetDivisions',
        type: "POST",
        success: function (JsonResult) {
            division_g = JsonResult;
            if (division_g != null) {
                if (division_g.length > 0) {
                    fnAddOptionToSelect("ddlDivision", "-Select Division", "0");

                    for (var di = 0; di < division_g.length; di++) {
                        fnAddOptionToSelect("ddlDivision", division_g[di].Division_Name, division_g[di].Division_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlDivision", "-No Division-", "-1");
                    $('#chkUnmappedProducts').css('display', 'none');
                }
            }
            else {
                fnAddOptionToSelect("ddlDivision", "-No Division-", "-1");
                $('#chkUnmappedProducts').css('display', 'none');
            }
        },
        error: function () {
            fnMsgAlert("error", "Error", "Getting Divisions failed.")
        }
    });
}


//function fnGetProductTypeMaster() {
//    $.ajax({
//        url: '../HiDoctor_Master/Inward/GetProductTypeMaster',
//        type: "POST",
//        success: function (JsonResult) {
//            typeMaster_g = JsonResult;
//            if (typeMaster_g != null) {
//                if (typeMaster_g.length > 0) {
//                    fnAddOptionToSelect("ddlProductType", "-Select Product Type-", "0");
//                    if (productTypeOption == 'YES') {
//                        fnAddOptionToSelect("ddlProductType", "ALL", "ALL");
//                    }
//                    for (pi = 0; pi < typeMaster_g.length; pi++) {
//                        if (typeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('SALE') == -1) {
//                            if (typeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('COMPETITOR') == -1) {
//                                fnAddOptionToSelect("ddlProductType", typeMaster_g[pi].Product_Type_Name, typeMaster_g[pi].Product_Type_Code);
//                            }
//                        }
//                    }
//                }
//                else {
//                    fnAddOptionToSelect("ddlProductType", "-No Product Type-", "-1");
//                }
//            }
//            else {
//                fnAddOptionToSelect("ddlProductType", "-No Product Type-", "-1");
//            }
//        },
//        error: function () {
//            alert("error");
//        }
//    });
//}





function fnGetUserTypeMaster() {
    $.ajax({
        url: '../HiDoctor_Master/Inward/GetUserTypeMaster',
        type: "POST",
        success: function (JsonResult) {
            userType_g = JsonResult;
            if (userType_g != null) {

                if (userType_g.length > 0) {
                    fnAddOptionToSelect("ddlUserType", "-Select User Type-", "0");
                    for (ui = 0; ui < userType_g.length; ui++) {
                        fnAddOptionToSelect("ddlUserType", userType_g[ui].User_Type_Name, userType_g[ui].User_Type_Code);
                    }
                }
                else {
                    fnAddOptionToSelect("ddlUserType", "-No User Type-", "-1");
                }

            }
            else {
                fnAddOptionToSelect("ddlUserType", "-No User Type-", "-1");
            }
        },
        error: function () {
            fnMsgAlert("error", "Error", "Getting Usertype failed.");
        }
    });
}



function fnGetProductTypeMaster() {
    var userTypeCode = $('#ddlUserType').val();
    var modeUserType = "USERTYPE"
    $.ajax({
        url: '../HiDoctor_Master/Inward/GetProductTypeMaster',
        type: "POST",
        data: "userTypeCode=" + userTypeCode + "&mode=" + modeUserType,
        success: function (JsonResult) {
            typeMaster_g = JsonResult;
            $('#ddlProductType option').remove();
            if (typeMaster_g != null) {
                if (typeMaster_g.length > 0) {
                    fnAddOptionToSelect("ddlProductType", "-Select Product Type-", "0");
                    if (productTypeOption == 'YES') {
                        fnAddOptionToSelect("ddlProductType", "ALL", "ALL");
                    }
                    for (pi = 0; pi < typeMaster_g.length; pi++) {
                        if (typeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('SALE') == -1) {
                            if (typeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('COMPETITOR') == -1) {
                                fnAddOptionToSelect("ddlProductType", typeMaster_g[pi].Product_Type_Name, typeMaster_g[pi].Product_Type_Code);
                            }
                        }
                    }
                }
                else {
                    fnAddOptionToSelect("ddlProductType", "-No Product Type-", "-1");
                }
            }
            else {
                fnAddOptionToSelect("ddlProductType", "-No Product Type-", "-1");
            }
        },
        error: function () {
            fnMsgAlert("error", "Error", "Getting Product Type failed.");
        }
    });
}




function fnGetProducts(screenMode) {
    var division_code = "";
    var product_type_code = "";
    if (screenMode == "USER") {

        division_code = $('#ddlDivisionUserMode').val();
        $('#ddlProductsUserMode').empty();
        //$("#ddlProducts").multiselect('destroy').multiselectfilter();
        $("#ddlProductsUserMode").multiselect().multiselectfilter();
        $("#ddlProductsUserMode").multiselect('refresh')
        $('#spnslelectdprd').html('');
        $('#spnslelectdprdUserMode').html('');
        $('#spnremainingprodUserMode').html('');
        product_type_code = $('#ddlProductTypesUserMode').val();
        var userTypeCode = $('#ddlUserTypeUserMode').val();

    }
    else {
        division_code = $('#ddlDivision').val();
        $('#ddlProducts').empty();
        //$("#ddlProducts").multiselect('destroy').multiselectfilter();
        $("#ddlProducts").multiselect().multiselectfilter();
        $("#ddlProducts").multiselect('refresh')
        $('#spnslelectdprd').html('');
        $('#spnremainingprod').html('');
        product_type_code = $('#ddlProductType').val();
        var userTypeCode = $('#ddlUserType').val();
    }
    fnGetProductsFromServer(division_code, product_type_code, screenMode, userTypeCode);
}

function fnGetProductsFromServer(division_code, product_type_code, screenMode, userTypeCode) {

    if (division_code != 0 && product_type_code != 0) {
        division_code = division_code == "-1" ? "" : division_code;
        $.ajax({
            url: '../HiDoctor_Master/Inward/GetProductsByDivisionandProductTypes',
            type: "POST",
            data: "Division_Code=" + division_code + "&product_type_code=" + product_type_code + "&user_type_code=" + userTypeCode + "&screenMode=" + screenMode,
            success: function (JsonResult) {
                products_g = JsonResult;
                fnAssignToProducts(screenMode);
            },
            error: function () {
                fnMsgAlert('error', 'Inward', e.responseText);
            }
        });
    }
}


function fnDownloadExcelData() {
    var productsCount = 0;
    var division_code = "";
    var product_type_code = "";
    var user_type_code = "";
    var product_codes = "";
    var product_type_name = "";
    var division_name = "";
    var user_type_name = "";
    var inwardDate = "";
    var errMsg = "";
    if ($('#ddlDivision').val() != "0") {
        division_code = $('#ddlDivision').val();
        division_name = $('#ddlDivision :selected').text();
    }
    else {
        if ($('#ddlDivision').val() != -1) {
            errMsg = "Please select the division.<br />"
        }
        else {
            division_name = $('#ddlDivision :selected').text();
        }
    }

    if ($('#ddlProductType').val() != "0") {
        product_type_code = $('#ddlProductType').val();
        product_type_name = $('#ddlProductType :selected').text();
    }
    else {
        errMsg += "Please select the Product Type.<br />"
    }
    if ($('#ddlUserType').val() != "0") {
        user_type_code = $('#ddlUserType').val();
        user_type_name = $("#ddlUserType :selected").text()
    }
    else {
        errMsg += "Please select the User Type.<br />";
    }
    $('select#ddlProducts > option:selected').each(function () {
        productsCount = productsCount + 1;
    });


    if (productsCount > userTypeProductMaxCount_g) {
        errMsg += "Please choose only " + userTypeProductMaxCount_g + " products.<br />";
    }

    if (productsCount > 0) {
        $('select#ddlProducts > option:selected').each(function () {
            product_codes += $(this).val() + "^";
        });
    }

    if (productsCount == 0) {
        errMsg += "Please choose atleast one product.<br />";
    }


    if (errMsg.length > 0) {
        $('#dvErrMsg').html(errMsg);
        $('#dvErrMsg').css('display', '');
        return false;
    }
    else {
        $('#dvErrMsg').html('');
        $('#dvErrMsg').css('display', 'none');
        $('#spndownload').css('display', '');
    }

    $.ajax({
        url: '../HiDoctor_Master/Inward/GetInwardExcelData',
        type: "POST",
        data: "division_code=" + division_code + "&product_type_code=" + product_type_code + "&user_type_code=" + user_type_code +
            "&product_codes=" + product_codes + "&product_type_name=" + product_type_name + "&division_name=" + division_name,
        success: function (result) {

            if (result != "No Data Found.") {
                $('#spndownload').html(result);
            }
            if (result.length > 0) {
                if (result == "No Data Found.") {
                    $('#dvErrMsg').html(result);
                    $('#spndownload').html("")
                    $('#dvErrMsg').css('display', '');
                }
                else {
                    $('#fileLink').attr("href", "../Content/XLTemplates/" + result.split('^')[0]);
                    $('#fileLink').html(result.split('^')[0]);
                    $('#EmpfileLink').attr("href", "../Content/XLTemplates/" + result.split('^')[1])
                    $('#ProdfileLink').attr("href", "../Content/XLTemplates/" + result.split('^')[2])
                    $('#dvErrMsg').html("");
                    $('#dvErrMsg').css('display', 'none');
                    $('#lnkExcelFile').css("display", "");
                    $('#spndownload').html("Completed");
                }
            }
            else {
                $('#spndownload').html("Failed");
            }
        },
        error: function () {
            alert("error");
        }
    });
}


function DownloadExcelFile() {
    $.ajax({
        url: '../HiDoctor_Master/Inward/DownloadExcelFile',
        type: "POST",
        success: function (result) {
            if (result) {
                $('#lnkExcelFile').css("display", "");
                //$('#spndownload').html("Completed");
            }
            else {
                $('#spndownload').html("Failed");
            }
        },
        error: function () {
            alert("error");
        }
    });
}

function fnvalidateFile() {
    $(".uploadBtn").prop("disabled", true);
    var fileName = $('#fileUpload').val();
    var errMsg = "";
    if ($.trim($('#txtInwrdDate').val()).length == 0) {
        errMsg = "Please select inward date.<br />";
        $('#dvErrMsgFileUpload').html(errMsg);
        $('#dvErrMsgFileUpload').css('display', '');
        $(".uploadBtn").prop("disabled", false);
        return false;
    }
    else {
        inwardDate = $('#txtInwrdDate').val().split('/')[1] + '/' + $('#txtInwrdDate').val().split('/')[0] + '/' + $('#txtInwrdDate').val().split('/')[2];
        $('#txtInward').val(inwardDate);
    }

    if (fileName.length == 0) {

        $('#dvErrMsgFileUpload').html("Please choose the file.")
        $('#dvErrMsgFileUpload').css('display', '');
        $(".uploadBtn").prop("disabled", false);
        return false;
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext == "xls") {
            $('#dvErrMsgFileUpload').html("");
            $('#dvErrMsgFileUpload').css('display', 'none');
            return true;
        }
        else {
            $('#dvErrMsgFileUpload').html("Please upload xls file only.")
            $('#dvErrMsgFileUpload').css('display', '');
            $(".uploadBtn").prop("disabled", false);
            return false;
        }
    }
}


function fnvalidateFileUserBased() {
    $(".uploadBtn").prop("disabled", true);
    var fileName = $('#fileUploadUser').val();
    var errMsg = "";

    if ($.trim($('#txtUserWiseInwardDate').val()).length == 0) {
        errMsg = "Please select inward date.<br />";
        $('#dvErrMsgFileUploadUserBased').html(errMsg);
        $('#dvErrMsgFileUploadUserBased').css('display', '');
        $(".uploadBtn").prop("disabled", false);
        return false;
    }
    else {
        inwardDate = $('#txtUserWiseInwardDate').val().split('/')[1] + '/' + $('#txtUserWiseInwardDate').val().split('/')[0] + '/' + $('#txtUserWiseInwardDate').val().split('/')[2];
        $('#txtUserInwardDate').val(inwardDate);
    }

    if (fileName.length == 0) {
        $('#dvErrMsgFileUploadUserBased').html("Please choose the file.")
        $('#dvErrMsgFileUploadUserBased').css('display', '');
        $(".uploadBtn").prop("disabled", false);
        return false;
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext == "xls") {
            $('#dvErrMsgFileUploadUserBased').html("");
            $('#dvErrMsgFileUploadUserBased').css('display', 'none');
            return true;
        }
        else {
            $('#dvErrMsgFileUploadUserBased').html("Please upload xls file only.")
            $('#dvErrMsgFileUploadUserBased').css('display', '');
            $(".uploadBtn").prop("disabled", false);
            return false;
        }
    }
}


function fnAddOptionToSelect(id, text, value) {
    if ($.msie) {
        var option = document.createElement('option');
        jQuery(option).appendTo('#' + id);
        option.text = text;
        option.value = value;
    }
    else {
        $('#' + id).append("<option value='" + value + "'>" + text + "</option>");
    }
}
function fnRedirectToBatchProcessing() {
    $('#main').load('../BatchProcessing/Index?bpType=INWARD_BULK_UPLOAD');
}
$("#ddlProducts").on("multiselectclick", function (event, ui) {
    var productsCount = 0;
    var product_type_name = $('#ddlProductType :selected').text();
    var array_of_checked_values = $("#ddlProducts").multiselect("getChecked").map(function () {
        return this.value;
    }).get();
    $('#spnslelectdprd').html('<span style="font-weight:bold;font-size:15px">' + array_of_checked_values.length.toString() + '</span> ' + product_type_name + '(s) are selected.');
    if (array_of_checked_values.length <= userTypeProductMaxCount_g) {
        $('#spnremainingprod').html('You can select <span style="font-weight:bold;font-size:15px">' + (userTypeProductMaxCount_g - (array_of_checked_values.length)).toString() + '</span> more ' + product_type_name + '(s).');
    }
    else {
        $('#spnremainingprod').html('<span style="font-weight:bold;font-size:15px">You have selected more than  ' + userTypeProductMaxCount_g + ' ' + product_type_name + 's. (Exceeded the Max. limit)</span>');
    }
});

$("#ddlProductsUserMode").on("multiselectclick", function (event, ui) {
    var productsCount = 0;
    var product_type_name = $('#ddlProductTypesUserMode :selected').text();
    var array_of_checked_values = $('#ddlProductsUserMode').multiselect("getChecked").map(function () {
        return this.value;
    }).get();
    $('#spnslelectdprdUserMode').html('<span style="font-weight:bold;font-size:15px">' + array_of_checked_values.length.toString() + '</span> ' + product_type_name + '(s) are selected.');
    if (array_of_checked_values.length <= userProductMaxCount_g) {
        $('#spnremainingprodUserMode').html('You can select <span style="font-weight:bold;font-size:15px">' + (userProductMaxCount_g - (array_of_checked_values.length)).toString() + '</span> more ' + product_type_name + '(s).');
    }
    else {
        $('#spnremainingprodUserMode').html('<span style="font-weight:bold;font-size:15px">You have selected more than  ' + userProductMaxCount_g + ' ' + product_type_name + 's. (Exceeded the Max. limit)</span>');
    }
});

function fnUserModelDivisionLoad() {
    if (division_g != null) {
        if (division_g.length > 0) {
            fnAddOptionToSelect("ddlDivisionUserMode", "-Select Division-", "0");
            for (var di = 0; di < division_g.length; di++) {
                fnAddOptionToSelect("ddlDivisionUserMode", division_g[di].Division_Name, division_g[di].Division_Code);
            }
        }
        else {
            fnAddOptionToSelect("ddlDivisionUserMode", "-No Division-", "-1");
        }
    }
    else {
        fnAddOptionToSelect("ddlDivisionUserMode", "-No Division-", "-1");
    }
}

function fnUserModeUserTypeLoad() {
    if (userType_g != null) {

        if (userType_g.length > 0) {
            fnAddOptionToSelect("ddlUserTypeUserMode", "-Select User Type-", "0");
            for (ui = 0; ui < userType_g.length; ui++) {
                fnAddOptionToSelect("ddlUserTypeUserMode", userType_g[ui].User_Type_Name, userType_g[ui].User_Type_Code);
            }
        }
        else {
            fnAddOptionToSelect("ddlUserTypeUserMode", "-No User Type-", "-1");
        }

    }
    else {
        fnAddOptionToSelect("ddlUserTypeUserMode", "-No User Type-", "-1");
    }
}

////function fnUserModeProductTypeLoad() {
//    if (typeMaster_g != null) {
//        if (typeMaster_g.length > 0) {
//            fnAddOptionToSelect("ddlProductTypesUserMode", "-Select Product Type-", "0");
//            if (productTypeOption == 'YES') {
//                fnAddOptionToSelect("ddlProductTypesUserMode", "ALL", "ALL");
//            }
//            for (pi = 0; pi < typeMaster_g.length; pi++) {
//                if (typeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('SALE') == -1) {
//                    if (typeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('COMPETITOR') == -1) {
//                        fnAddOptionToSelect("ddlProductTypesUserMode", typeMaster_g[pi].Product_Type_Name, typeMaster_g[pi].Product_Type_Code);
//                    }
//                }
//            }
//        }
//        else {
//            fnAddOptionToSelect("ddlProductTypesUserMode", "-No Product Type-", "-1");
//        }
//    }
//    else {
//        fnAddOptionToSelect("ddlProductTypesUserMode", "-No Product Type-", "-1");
//    }
//}

function fnUserModeProductTypeLoad() {
    var userTypeCode = $('#ddlUserTypeUserMode').val();
    var mode = "USER"
    $.ajax({
        url: '../HiDoctor_Master/Inward/GetProductTypeMaster',
        type: "POST",
        data: "userTypeCode=" + userTypeCode + "&mode=" + mode,
        success: function (JsonResult) {
            var protypeMaster_g = JsonResult;
            $('#ddlProductTypesUserMode option').remove();
            if (protypeMaster_g != null) {
                if (protypeMaster_g.length > 0) {
                    fnAddOptionToSelect("ddlProductTypesUserMode", "-Select Product Type-", "0");
                    if (productTypeOption == 'YES') {
                        fnAddOptionToSelect("ddlProductTypesUserMode", "ALL", "ALL");
                    }
                    for (pi = 0; pi < protypeMaster_g.length; pi++) {
                        if (protypeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('SALE') == -1) {
                            if (protypeMaster_g[pi].Product_Type_Name.toUpperCase().indexOf('COMPETITOR') == -1) {
                                fnAddOptionToSelect("ddlProductTypesUserMode", protypeMaster_g[pi].Product_Type_Name, protypeMaster_g[pi].Product_Type_Code);
                            }
                        }
                    }
                }
                else {
                    fnAddOptionToSelect("ddlProductTypesUserMode", "-No Product Type-", "-1");
                }
            }
            else {
                fnAddOptionToSelect("ddlProductTypesUserMode", "-No Product Type-", "-1");
            }
        },
        error: function () {
            alert("error");
        }
    });
}






function fnAssignToProducts(screenMode) {
    if (screenMode.toUpperCase() == "USER") {
        if (products_g != null) {
            if (products_g.length > 0) {
                for (pi = 0; pi < products_g.length; pi++) {
                    fnAddOptionToSelect("ddlProductsUserMode", products_g[pi].Product_Name, products_g[pi].Product_Code);
                }
                //  $("#ddlProducts").multiselect('destroy').multiselectfilter();
                $("#ddlProductsUserMode").multiselect().multiselectfilter();
                $("#ddlProductsUserMode").multiselect('refresh')
            }
            else {
                fnAddOptionToSelect("ddlProductsUserMode", "-No Products-", "-1");
            }
        }
        else {
            fnAddOptionToSelect("ddlProductsUserMode", "-No Products-", "-1");
        }
    }
    else {
        if (products_g != null) {
            if (products_g.length > 0) {
                for (pi = 0; pi < products_g.length; pi++) {
                    fnAddOptionToSelect("ddlProducts", products_g[pi].Product_Name, products_g[pi].Product_Code);
                }
                //  $("#ddlProducts").multiselect('destroy').multiselectfilter();
                $("#ddlProducts").multiselect().multiselectfilter();
                $("#ddlProducts").multiselect('refresh')
            }
            else {
                fnAddOptionToSelect("ddlProducts", "-No Products-", "-1");
            }
        }
        else {
            fnAddOptionToSelect("ddlProducts", "-No Products-", "-1");
        }
    }
}

function fnGetProductsMaxCountConfig() {
    $.ajax({
        url: '../HiDoctor_Master/Inward/GetProductsMaxCountConfig',
        type: "POST",
        success: function (result) {
            if (result != null) {
                userTypeProductMaxCount_g = result.UserTypeMaxProductCount;
                userProductMaxCount_g = result.UserMaxProductCount;
                $('#productCount').html(userProductMaxCount_g);
                $('#maxProdCount').html(userTypeProductMaxCount_g);
            }

        },
        error: function (e) {
            alert(e.responseText);
        }
    });
}
function fnSelectUserBasedOnFilter() {
    //var userTypeCode = $('#ddlUserTypeUserMode').val();
    var divisionCode = $('#ddlDivisionUserMode').val();
    var userTypeCodes = "";
    $('select#ddlUserTypeUserMode > option:selected').each(function () {
        userTypeCodes += $(this).val() + "^";
    });

    if (divisionCode != -1) {
        if (divisionCode == 0) {
            fnMsgAlert("info", "Inward", "Please select the division.");
            return false;
        }
    }

    if (userTypeCodes.length == 0) {
        fnMsgAlert("info", "Inward", "Please select atleast on user type.");
        return false;
    }
    fnBlockDiv("form2", "Please wait users selecting...");
    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Inward/GetFilteredUsers',
        data: "user_Type_Code=" + userTypeCodes + "&division_Code=" + divisionCode,
        success: function (result) {
            //var data = eval('(' + result + ')');
            $("#dvusertree").dynatree("getRoot").visit(function (node) {
                var user = jsonPath(result, "$.[?(@.User_Code=='" + node.data.key + "')]");
                if (user.length > 0) {
                    node.select(true);
                }
                else {
                    node.select(false);
                }
                fnUnBlockDiv("form2");
            });
            fnUserModeProductTypeLoad();
        },
        error: function (e) {
            fnUnBlockDiv("form2");
            fnMsgAlert('error', 'Inward', e.responseText);
        }
    });
}

function fnGetInwardExcelData() {
    $('#lnkExcelFileUser').css('display', 'none');
    var divisionName = $('#ddlDivisionUserMode :selected').text();
    var divisionCode = $('#ddlDivisionUserMode').val();
    var productTypeName = $('#ddlProductTypesUserMode :selected').text();
    var productTypeCode = $('#ddlProductTypesUserMode').val();
    var users = new Array();
    for (var i = 0; i < selKeys.length; i++) {
        var userModel = {};
        userModel.User_Code = selKeys[i];
        users.push(userModel);
    }
    var Products = new Array();
    $('select#ddlProductsUserMode > option:selected').each(function () {
        var prodModel = {};
        prodModel.Product_Code = $(this).val();
        Products.push(prodModel);
    });

    if (divisionCode != -1) {
        if (divisionCode == 0) {
            fnMsgAlert('info', "Inward", "Please select the division.");
            return false;
        }
    }

    if (users.length == 0) {
        fnMsgAlert('info', "Inward", "Please select atleast one user.");
        return false;
    }
    if (productTypeCode == 0) {
        fnMsgAlert('info', "Inward", "Please select atleast one product type.");
        return false;
    }

    if (Products.length == 0) {
        fnMsgAlert('info', "Inward", "Please select the products.");
        return false;
    }
    else if (Products.length > userProductMaxCount_g) {
        fnMsgAlert('info', "Inward", "You have selected more than " + userProductMaxCount_g + " Samples. (Exceeded the Max. limit)");
        return false;
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/Inward/GetInwardExcelDataUserBased',
        data: "users_Json=" + JSON.stringify(users) + "&product_Json=" + JSON.stringify(Products)
            + "&division_name=" + divisionName + "&product_type_name=" + productTypeName,
        success: function (result) {
            $('#spndownloadUser').html(result);
            if (result.length > 0) {
                if (result == "No Data Found.") {
                    $('#dvErrMsgUser').html(result);
                    $('#dvErrMsgUser').css('display', '');
                }
                else {
                    $('#fileLinkUser').attr("href", "../Content/XLTemplates/" + result.split('^')[0]);
                    $('#fileLinkUser').html(result.split('^')[0]);
                    $('#EmpfileLinkUser').attr("href", "../Content/XLTemplates/" + result.split('^')[1])
                    $('#ProdfileLinkUser').attr("href", "../Content/XLTemplates/" + result.split('^')[2])
                    $('#dvErrMsgUser').html("");
                    $('#dvErrMsgUser').css('display', 'none');
                    $('#lnkExcelFileUser').css("display", "");
                    $('#spndownloadUser').html("Completed");
                }
            }
            else {
                $('#spndownloadUser').html("Failed");
            }
        }

    });
}

function fnBlockDiv(divid, message) {
    $('#' + divid).block({
        message: message,
        css: { border: '3px solid #89C33F', padding: '7px' }
    });
}

function fnUnBlockDiv(divid) {
    $('#' + divid).unblock();
}

function GetUnMappedDivisionProducts() {
    if ($('#chkUnmappedProducts').attr('checked') == "checked") {
        var division_code = "";
        var product_type_code = "";

        division_code = $('#ddlDivisionUserMode').val();
        $('#ddlProductsUserMode').empty();
        //$("#ddlProducts").multiselect('destroy').multiselectfilter();
        $("#ddlProductsUserMode").multiselect().multiselectfilter();
        $("#ddlProductsUserMode").multiselect('refresh')
        $('#spnslelectdprd').html('');
        $('#spnslelectdprdUserMode').html('');
        $('#spnremainingprodUserMode').html('');
        product_type_code = $('#ddlProductTypesUserMode').val();
        if (division_code != 0 && product_type_code != 0) {
            division_code = division_code == "-1" ? "" : division_code;
            $.ajax({
                url: '../HiDoctor_Master/Inward/GetUnmappedDivisionProducts',
                type: "POST",
                data: "division_code=" + division_code + "&product_type_code=" + product_type_code,
                success: function (JsonResult) {
                    var chk = true;
                    var sortunmapped = [];
                    var unmappedProducts = JsonResult;
                    if (products_g.length > 0 && unmappedProducts.length > 0) {
                        for (var i = 0; i < unmappedProducts.length; i++) {
                            for (var k = 0; k < products_g.length; k++) {
                                if (products_g[k].Product_Code == unmappedProducts[i].Product_Code) {
                                    chk = false;
                                    continue;
                                }
                                if (k == products_g.length - 1 && chk) {
                                    sortunmapped = sortunmapped.concat(unmappedProducts[i])
                                }
                            }
                        }
                    }
                    products_g = products_g.concat(sortunmapped);
                    fnAssignToProducts("USER");
                },
                error: function (e) {
                    fnMsgAlert('error', 'Inward', e.responseText);
                }
            });
        }
    }
    else {
        fnGetProducts('USER');

    }
}


/************************** END: Bulk upload *********************************/