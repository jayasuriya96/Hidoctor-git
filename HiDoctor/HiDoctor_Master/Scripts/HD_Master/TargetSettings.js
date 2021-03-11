
var RegionCode = '';
var lstregtype = "";
var lsstatus = "";





function fnSave() {
    debugger;
}

function fnSubmit(status) {
    debugger;
    var sta
    var arr = [];
    //var sno = 0;
    $("#dataDiv table tbody tr").map(function (v) {
        if (!($(this).hasClass('clsTotal'))) {
            var obj = {};
            obj.Product_Code = $(this).find('#prodCode').val();
            obj.YTD = $(this).find('#txtYTD').val();
            obj.NexttwoMonth = $(this).find(".nextTwoMonth").val();
            obj.NextFinalcialYear = $(this).find(".nextFinalcialYear").val();
            obj.Created_By = RequestUserCode;
            obj.Region_code = Sel_Region_Code;
            obj.Status = status;
            obj.YTD_values = $(this).find(".nextytdTwoMonth").val();
            obj.Next_Month_Values = $(this).find(".nextTwoMonthValue").val();
            obj.Next_Year_Values = $(this).find(".nextFinalcialYearValue").val();
            arr.push(obj);           
        }
        //sno++;
    });
    var validationFlag = true;
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].NexttwoMonth != "" || arr[i].NextFinalcialYear != "" || arr[i].Next_Month_Values != "" || arr[i].Next_Year_Values != "")
        {
            validationFlag = false;
            break;
        }
    }
    if (validationFlag)
    {
        swal('Please enter atleast one value', "", "info");
        return false;
    }
    var objdetails = {
        lst: arr
    }

    $.ajax({
        async: false,
        type: 'POST',
        data: JSON.stringify(objdetails),
        contentType: 'application/json; charset=utf-8',
        async: false,
        url: '../HiDoctor_Master/Target_Setting/InsertProduts',
        success: function (response) {
            if (response.length >= 1) {
                if (status == 2) {
                    $('#btnsave').hide();
                    $('#btnsubmit').hide();

                }
                if (status == 1) {

                    swal('Success', "success", "success");
                }
                else {
                    swal('Success', "Submitted", "success");
                 
                }
            }
            fnProducts();
           
        }
    });
}


var productLst_g = "";

function fnProducts() {
    debugger;
    $.ajax({
        async: false,
        type: 'GET',
        data: "Region_Code=" + Sel_Region_Code,
        async: false,
        url: '../HiDoctor_Master/Target_Setting/productdetails',
        success: function (response) {
            debugger;
            productLst_g = response;
            var content = '';
            content += "<div  class='table-responsive' style='height:400px;overflow-y: Scroll'>";
            content += "<div  class='table-responsive'><table class='table table-striped' id='tblMC' cellspacing='0' cellpadding='0' style='text-align:center;'>";
            content += "<thead style='text-align:center;'>";
            content += "<tr>";
            //content += "<th>Edit</th>";
            content += "<th style='width:25%;'>Products</th>";
            content += "<th>YTD Plan Qty</th>";
            content += "<th>YTD  Plan Value</th>";
            content += "<th>Feb-March Plan Qty</th>";
            content += "<th>Feb-March Plan Value</th>";
            content += "<th>2020-21 Plan Qty</th>";
            content += "<th>2020-21 Plan Value</th>";
            content += "</tr>";
            content += "</thead>";
            content += "<tbody>";

            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    lsstatus = response[i].Status;
                    content += "<tr>";
                    content += "<td style='white-space:ormal;word-wrap:break-word;word-break:break-word;'><input type='hidden' id='prodCode' value='" + response[i].Product_Code + "' />" + response[i].Product_Name + "</td>";
                    content += "<td><input type='hidden' id='txtYTD' value='" + response[i].YTD + "' />" + response[i].YTD + "</td>";


                    if (response[i].Status == 1) {
                        content += "<td><input type='number' min='0' class='form-control decimalck nextytdTwoMonth' style='cursor:pointer;'  id='YTDValue_" + i + "' value='" + response[i].YTD_values + "' readOnly></td>";

                        if (response[i].NexttwoMonth > 0) {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextTwoMonth' min='0'  onblur='fnCalculateValue(this,\"" + i + "\",\"" + response[i].Price + "\",\"NextTwoMonth\")' value ='" + response[i].NexttwoMonth + "'></td>";
                        }
                        else {
                            content += "<td><input type='number' min='0' style='cursor:pointer;' class='form-control decimalck nextTwoMonth' min='0' onblur='fnCalculateValue(this,\"" + i + "\",\"" + response[i].Price + "\",\"NextTwoMonth\")'></td>";
                        }
                        //var priceMonth = response[i].Price*
                        if (response[i].Next_Month_Values > 0) {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextTwoMonthValue' min='0' id='nexttwoMonthValue_" + i + "' value='" + response[i].Next_Month_Values + "' readonly></td>";
                        }
                        else {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextTwoMonthValue' min='0' id='nexttwoMonthValue_" + i + "' readonly></td>";
                        }
                        if (response[i].NextFinalcialYear > 0) {
                            content += "<td><input type='number'style='cursor:pointer;' class='form-control decimalck nextFinalcialYear' min='0' onblur='fnCalculateValue(this,\"" + i + "\",\"" + response[i].Price + "\",\"nextFinalcialYear\")' value ='" + response[i].NextFinalcialYear + "'></td>";
                        }
                        else {
                            content += "<td><input type='number'style='cursor:pointer;' class='form-control decimalck nextFinalcialYear' min='0' onblur='fnCalculateValue(this,\"" + i + "\",\"" + response[i].Price + "\",\"nextFinalcialYear\");'></td>";
                        }
                        if (response[i].Next_Year_Values > 0) {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextFinalcialYearValue' min='0' id='nextFinalcialYearValue_" + i + "'  value='" + response[i].Next_Year_Values + "' readonly></td>";
                        }
                        else {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextFinalcialYearValue' min='0' id='nextFinalcialYearValue_" + i + "' readonly></td>";
                        }
                    }
                    else {
                        content += "<td><input type='number' min='0'  class='form-control decimalck nextytdTwoMonth' style='cursor:pointer;'  id='YTDValue_" + i + "' value='" + response[i].YTD_values + "' readOnly></td>";

                        if (response[i].NexttwoMonth > 0) {
                            content += "<td><input type='number' min='0' style='cursor:pointer;' class='form-control decimalck nextTwoMonth' readonly  value ='" + response[i].NexttwoMonth + "'></td>";
                        }
                        else {
                            content += "<td><input type='number' min='0' style='cursor:pointer;' class='form-control decimalck nextTwoMonth' readonly></td>";
                        }
                        if (response[i].Next_Month_Values > 0) {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextTwoMonthValue' min='0' id='nexttwoMonthValue_" + i + "' value='" + response[i].Next_Month_Values + "' readonly></td>";
                        }
                        else {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextTwoMonthValue' id='nexttwoMonthValue_" + i + "' readonly></td>";
                        }
                        if (response[i].NextFinalcialYear > 0) {
                            content += "<td><input type='number'style='cursor:pointer;' class='form-control decimalck nextFinalcialYear' min='0' readonly value = '" + response[i].NextFinalcialYear + "'></td>";
                        }
                        else {
                            content += "<td><input type='number'style='cursor:pointer;' class='form-control decimalck nextFinalcialYear' min='0' readonly></td>";
                        }
                        if (response[i].Next_Year_Values > 0) {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextFinalcialYearValue' min='0' id='nextFinalcialYearValue_" + i + "' value='" + response[i].Next_Year_Values + "' readonly></td>";
                        }
                        else {
                            content += "<td><input type='number' style='cursor:pointer;' class='form-control decimalck nextFinalcialYearValue' id='nextFinalcialYearValue_" + i + "' readonly></td>";
                        }

                    }

                    content += "</tr>";
                }
                content += '<tr class="clsTotal"><td>Total:</td><td></td><td><input type="text" readOnly id="YTDTotal" class="form-control"></td><td></td><td><input type="text" readOnly id="NextMonthTotal" class="form-control"></td><td></td><td><input type="text" readOnly id="NextYearTotal" class="form-control"></td></tr>';
            }
            else {
                content = '';
                content += "<div class='col-lg-12 form-group' style='font-style:italic;'>No Product Details Found.</div>";
                //$('.btnActions').hide();
            }
            $("#dataDiv").html(content);
            fnCalculateTotal();
            //$('.btnActions').show();

            if (lsstatus == 2) {
                $('#btnsave').hide();
                $('#btnsubmit').hide();
            }
            else {
                $('#btnsave').show();
                $('#btnsubmit').show();

            }
        },
    });
}

function fnCalculateValue(Id, rowId, price, column) {
    debugger;
    var enteredValue = $(Id).val();
    var calculationValue = (enteredValue * price).toFixed(2);
    var Id = "";
    if (column.toUpperCase() == "NEXTTWOMONTH") {
        Id = "nexttwoMonthValue_";
    }
    else if (column.toUpperCase() == "NEXTFINALCIALYEAR") {
        Id = "nextFinalcialYearValue_";
    }
    if (enteredValue != '') {
        $('#' + Id + rowId).val(calculationValue);
    }
    
    fnCalculateTotal();
}

//function fnChkSplChar(id) {
//    debugger;
//    //Remark
//    if (id.value != "") {
//        var specialCharregex = new RegExp(/[*a-zA-Z.,(){}[]-_&%$^#<>+=~`""|]/g)
//        //var specialCharregex = new RegExp("^[-a-zA-Z _().,\n\r\r\n]+$");
//        if (specialCharregex.test(id.value)) {
//            swal('Please Remove Special characters', "", "info");
//            return false;
//        }
//        else {
//            return true;
//        }
//    }
//    return true
//}
function fnCalculateTotal() {
    debugger;
    var YTDTotal = 0;
    var NextTwoMonthTotal = 0;
    var NextYearTotal = 0;
    var trLength = $('#tblMC tbody tr').length;
    for (var i = 0; i < trLength - 1; i++) {
        YTDTotal = YTDTotal + parseFloat($('#YTDValue_' + i).val() == "" ? 0 : $('#YTDValue_' + i).val());
        NextTwoMonthTotal = NextTwoMonthTotal + parseFloat($('#nexttwoMonthValue_' + i).val() == "" ? 0 : $('#nexttwoMonthValue_' + i).val());
        if ($('#nextFinalcialYearValue_' + i).val() != NaN && $('#nextFinalcialYearValue_' + i).val() != undefined) {
            NextYearTotal = NextYearTotal + parseFloat($('#nextFinalcialYearValue_' + i).val() == "" ? 0 : $('#nextFinalcialYearValue_' + i).val());
        }
    }
    $('#YTDTotal').val(YTDTotal);
    $('#NextMonthTotal').val(NextTwoMonthTotal);
    $('#NextYearTotal').val(NextYearTotal);
}