
var POBRowIndexChemist_g = 0;
var SalesProductTableIndex_CV = 0;
var ChemistPOB = {
    fnAddStockist: function (isDraft, curAccObj) {
        //debugger;
        POBRowIndexChemist_g++;

        //Stockist Header
        var tblPOBLength = $('#tbl_POB_Chemist tr').length;
        var newPOBRow = document.getElementById('tbl_POB_Chemist').insertRow(parseInt(tblPOBLength));
        newPOBRow.id = "POB_RowChemist_" + POBRowIndexChemist_g;
        if (POBRowIndexChemist_g != 1)
            newPOBRow.style = "border-top: 1px solid #000 !important;";
        var td1 = newPOBRow.insertCell(0);
        var htmlvalue = StockistHeader_g + ' Name';
        td1.style.width = "67%";
        $(td1).html(htmlvalue);
        var td2 = newPOBRow.insertCell(1);
        var htmlvalue = "Due Date";
        $(td2).html(htmlvalue);
        var td3 = newPOBRow.insertCell(2);
        var htmlvalue = "";
        $(td3).html(htmlvalue);

        POBRowIndexChemist_g++;
        var tblPOBLength = $('#tbl_POB_Chemist tr').length;
        var newPOBRow = document.getElementById('tbl_POB_Chemist').insertRow(parseInt(tblPOBLength));
        newPOBRow.id = "POB_RowChemist_" + POBRowIndexChemist_g;

        //Stockist Name
        var td1 = newPOBRow.insertCell(0);
        var htmlvalue = "";
        if (isDraft) {
            //htmlvalue = "<input style='width: 100%;  border: none;background: none;font-size: 11px;' type='text' id='txtAccName_" + doctorAccRowIndex_g + "'   onblur='fnSetOnlyForDoc(this);' class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtAccName_\",\"hdnAccName_\");fnSetOnlyForDoc(this);' /><input type='hidden' id='hdnAccName_" + doctorAccRowIndex_g + "'  />";
            htmlvalue = "<input onblur='ChemistPOB.fnValidateStockistName(this)' style='width: 96%; font-size: 11px; ' type='text' id='txt_Stockist_NameChemist_" + POBRowIndexChemist_g + "'class='autoStockist_cv setfocus' style='width:95%' />";
            //onblur='fnValidateAutofill(this," + 'StockistAutoFill_g' + ",\"txt_Stockist_NameChemist_\",\"hdnStockist_Name\");fnSetOnlyForDoc(this);' />

        }
        else {
            //htmlvalue = "<input style='width: 100%;  border: none;background: none;font-size: 11px;' type='text' id='txtAccName_" + doctorAccRowIndex_g + "'  class='autoacc setfocus' style='width:95%' onblur='fnValidateAutofill(this," + 'accAutoFill_g' + ",\"txtAccName_\",\"hdnAccName_\");fnSetOnlyForDoc(this);'";
            htmlvalue = "<input style='width: 96%;' type='text' id='txt_Stockist_NameChemist_" + POBRowIndexChemist_g + "' class='autoStockist_cv setfocus' style='width:95%' onblur='ChemistPOB.fnValidateStockistName(this)' />";
            //Add New button
            // htmlvalue += " ondblclick='ChemistPOB.fnAddStockist(null)'  onkeyup='ChemistPOB.fnAddStockist(null,this)'/>";

        }
        htmlvalue += "<input type='hidden' id='hdnStockist_CodeChemist_" + POBRowIndexChemist_g + "'  />";
        htmlvalue += "<input type='hidden' id='hdnOrder_IdChemist_" + POBRowIndexChemist_g + "'  />";
        htmlvalue += "<input type='hidden' id='hdnOrder_NumberChemist_" + POBRowIndexChemist_g + "'  />";
        htmlvalue += "<input type='hidden' id='hdnOrder_StatusChemist_" + POBRowIndexChemist_g + "'  />";
        td1.style.width = "67%;";
        $(td1).html(htmlvalue);

        //Due Date
        var td2 = newPOBRow.insertCell(1);
        //$(td2).css("padding-left", "21px");
        htmlvalue = "<input type='text' id='txtStockistdueDateChemist_" + POBRowIndexChemist_g + "'  class='form-control datepicker'/>";
        $(td2).html(htmlvalue);

        // Remove Icon.
        var td3 = newPOBRow.insertCell(2);
        $(td3).html('<img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer" onclick="ChemistPOB.fnDeleteStockist(' + POBRowIndexChemist_g + ')" />');
        $(td3).addClass('valign-top');
        $(td3).addClass('deleteRowIcon');
        if (curAccObj != null) {
            curAccObj.onkeyup = null;
            curAccObj.ondblclick = null;
            if (curAccObj.length == undefined)
                curAccObj.style.display = 'none';
        }
        //Child Table create
        SalesProductTableIndex_CV++;
        var newPOBRow = document.getElementById('tbl_POB_Chemist').insertRow(parseInt((tblPOBLength + 1)));
        POBRowIndexChemist_g++;
        newPOBRow.id = "POB_RowChemist_" + POBRowIndexChemist_g;
        var td1 = newPOBRow.insertCell(0);
        td1.colSpan = 3;
        td1.style.width = "100%";
        td1.className = "salesProduct_CV";
        $(td1).html('<div id="tblSalesProductChemist_' + SalesProductTableIndex_CV + '" class="chemistDay" style="width: 100%;"></div>');
        $("#tblSalesProductChemist_" + SalesProductTableIndex_CV).append("<div style='width: 100%;float: left;margin: 5px 0px;'><div style='width: 50%;' class='left'>Product Name</div><div class='left' style='width: 15%;text-align: center;'>Quantity</div><div class='left' style='width: 15%;text-align: center;'>Unit Rate</div><div style='width: 15%;text-align: center;' class='left'>Amount</div></div>");



        //Child Table create
        var newPOBRow = document.getElementById('tbl_POB_Chemist').insertRow(parseInt((tblPOBLength + 2)));
        //newPOBRow.colspan = 3;
        POBRowIndexChemist_g++;
        newPOBRow.id = "POB_RowChemist_" + POBRowIndexChemist_g;
        var td1 = newPOBRow.insertCell(0);
        td1.style.width = "100%";
        td1.colSpan = 3;
        td1.className = "salesRemark_CV";

        var html = "<div style='padding: 5px;border-top: 1px solid #aaa !important;'><div style='float: left; width: 68%;'> No. of Product(s) :<lable style='padding-left: 1%;' id=lblprodutCountChemist_" + SalesProductTableIndex_CV + ">0</lable></div>";
        html += "<div>Total POB Value : <lable style='padding-left: 1%;' id=lblTotalPOBAmountChemist_" + SalesProductTableIndex_CV + ">0</lable></div></div>";
        html += "<div><div padding: 5px;    border-top: 1px solid #aaa !important;>Remarks (Optional)<div><div><textarea id=txtReamrkChemist_" + SalesProductTableIndex_CV + " maxlength='500'></textarea></div></div>";
        if (!isDraft) {
            html += '<div class="addNewBtn" ><input type="button" onclick="ChemistPOB.fnAddStockist(false,this);" value="Add New POB"></div>';
        }
        $(td1).html(html);


        autoComplete(StockistAutoFill_g, "txt_Stockist_NameChemist", "hdnStockist_CodeChemist", "autoStockist_cv");

        ChemistPOB.fnAddSalesProduct(isDraft, '0', SalesProductTableIndex_CV);

        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy',
            numberOfMonths: 1,
            //showButtonPanel: true
            minDate: new Date(dcrActualDate_g)
        });

    },


    fnDeleteStockist: function (index) {
        var tblLength = 0;
        tblLength = $('#tbl_POB_Chemist tr').length;
        var count = 0;
        count = index + 2;
        if (tblLength == count) {
            fnMsgAlert('info', docFollowUps, 'You are not allowed to delete this row!');
        }
        else {
            if (confirm('Do you wish to delete the POB?')) {
                //header
                $('#POB_RowChemist_' + (index - 1)).css('display', 'none');
                $('#POB_RowChemist_' + index).css('display', 'none');
                //product
                $('#POB_RowChemist_' + (index + 1)).css('display', 'none');
                $('#POB_RowChemist_' + (index + 2)).css('display', 'none');
                try {
                    $('#POB_RowChemist_' + (index + 3)).removeAttr('style');
                }
                catch (e) {
                }
            }
        }
    },
    fnAddSalesProduct: function (isDraft, rowId, mainID, curAccObj) {
        //debugger;
        var nextrowId = (parseInt(rowId) + 1);
        $("#tblSalesProductChemist_" + mainID).append("<div class='productHeader' id='proDivChemist_" + mainID.toString() + "_" + rowId.toString() + "'></div>");
        var htmlvalue = "";

        if (isDraft) {
            htmlvalue = "<input class='autoSSalesProducts setfocus' style='width: 94%;'  type='text' id='txt_SSalesProductsChemist_" + mainID + "_" + rowId + "' onblur=ChemistPOB.fnValidateSalesProducts(this); />";
            htmlvalue += htmlvalue = "<input type='hidden' id='hdnSSales_ProductsChemist_" + mainID + "_" + rowId + "'  />";
        }
        else {
            htmlvalue = "<input class='autoSSalesProducts setfocus'   type='text' id='txt_SSalesProductsChemist_" + mainID + "_" + rowId + "' style='width:94%' ";
            htmlvalue += " ondblclick=ChemistPOB.fnAddSalesProduct(null," + nextrowId + "," + mainID + ",this)  onkeyup=ChemistPOB.fnAddSalesProduct(null," + nextrowId + "," + mainID + ",this) onblur=ChemistPOB.fnValidateSalesProducts(this); />";
            htmlvalue += htmlvalue = "<input type='hidden' id='hdnSSales_ProductsChemist_" + mainID + "_" + rowId + "'  />";
        }
        $("#proDivChemist_" + mainID.toString() + "_" + rowId.toString()).append("<div style='width:50%;' class='left'>" + htmlvalue + "</div>");

        htmlvalue = "";
        htmlvalue = "<input style='width: 80%;' class='SalesProductsQty textalignRight' type='text' id='txt_SQtyChemist_" + mainID + "_" + rowId + "' onkeyup=ChemistPOB.fnSalesProductsAmountCal(this,event); onkeypress='return isNumberKey(event,this);' onpaste='event.returnValue=false' ondrop='event.returnValue=false' maxlength='6' />";
        $("#proDivChemist_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'> " + htmlvalue + "</div>");

        htmlvalue = "";
        var Privilege_Value = fnGetPrivilegeValue("ALLOW_POB_PRICE_EDIT", "");
        var DoctorEditPrivilegeArr = Privilege_Value.split(',');
        var Privilege_Value = fnGetPrivilegeValue("ALLOW_POB_PRICE_EDIT", "");
        var DoctorEditPrivilegeArr = Privilege_Value.split(',');
        if (DoctorEditPrivilegeArr.length > 0) {
            var disjson = $.grep(DoctorEditPrivilegeArr, function (ele, index) {
                return ele == "CHEMIST";
            })


            if (disjson.length > 0) {



                htmlvalue = "<input style='width: 80%;' class='textalignRight' type='text' id='txt_SUnitChemist_" + mainID + "_" + rowId + "' onkeyup=ChemistPOB.fnSalesProductsAmount(this,event); onkeypress='return isNumberKey(event,this);'  enabled/>";
                $("#proDivChemist_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'>" + htmlvalue + "</div>");
            }
            else {

                htmlvalue = "<input style='width: 80%;cursor: not-allowed;' class='textalignRight' type='text' id='txt_SUnitChemist_" + mainID + "_" + rowId + "' disabled/>";
                $("#proDivChemist_" + mainID.toString() + "_" + rowId.toString()).append("<div class='left' style='width:15%;'>" + htmlvalue + "</div>");
            }
        }

        htmlvalue = "";
        htmlvalue = "<input style='width: 80%;cursor: not-allowed;' class='textalignRight' type='text' id='txt_SAmountChemist_" + mainID + "_" + rowId + "' disabled/>";
        $("#proDivChemist_" + mainID.toString() + "_" + rowId.toString()).append("<div style='width:15%;' class='left'>" + htmlvalue + "</div>");

        // Remove Icon.
        htmlvalue = "";
        htmlvalue = '<img  onclick=ChemistPOB.fnDeleteSalesProduct("' + +mainID.toString() + "_" + rowId.toString() + '") class="valign-top deleteRowIcon" src="../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif" alt="Remove" style="cursor:pointer"  />';
        $("#proDivChemist_" + mainID.toString() + "_" + rowId.toString()).append("<div style='width: 5%; margin-top: 5px; float: left;'> " + htmlvalue + "</div>");

        autoComplete(SalesProductsAutoFill_g, "txt_SSalesProductsChemist", "hdnSSales_ProductsChemist", "autoSSalesProducts");

        if (curAccObj != null) {
            curAccObj.onkeyup = null;
            curAccObj.ondblclick = null;
        }


    },

    fnPOBIntialize: function () {
        ChemistPOB.fnAddStockist();
    },

    fnValidateStockistName: function (obj) {
        fnValidateAutofill(obj, StockistAutoFill_g, "txt_Stockist_NameChemist_", "hdnStockist_CodeChemist_");
    },
    fnDeleteSalesProduct: function (index) {
        var id = index.split('_');
        var count = 0;
        var tblLength = $('#tblSalesProductChemist_' + id[0]).children().length;
        //tblLength--;
        //for (var i = 0; i < tblLength; i++) {
        //    if ($("#proDivChemist_" + id[0] + "_" + i).css('display') != 'none')
        //        count++;
        //}
        //if (count >= 2) {
        count = parseInt(id[1]) + 2;
        if (count == tblLength) {
            fnMsgAlert('info', dcoSalesProductsTitle, 'You are not allowed to delete this row!');
        }
        else {
            if (confirm('Do you wish to delete the POB?')) {
                //header
                $('#proDivChemist_' + id[0] + "_" + id[1]).css('display', 'none');
                var obj = Array();
                obj.id = '_empty_' + index;
                ChemistPOB.fnSalesProductsTotalAmountCal(obj);
            }

        }
    },
    fnPrefillPOB: function (lstChemistPOBHeader, lstChemistPOBDetails) {
        ChemistPOB.fnclear('prefill');
        if (lstChemistPOBHeader != null && lstChemistPOBHeader.length > 0) {
            var dco_Stockist_Name = lstChemistPOBHeader;
            var dco_Sales_Products = lstChemistPOBDetails;
            //var Mode_Of_Form = table.Tables[2].Rows;
            var totaltableRow = dco_Stockist_Name.length * 4;
            var dco_Stockist_count = 0;
            var SalesProductTableID = 1;
            for (var i = 1; i < totaltableRow; i++) {

                //       var table = eval('(' + response + ')');


                i++;
                ChemistPOB.fnAddStockist(true, null);
                if (dco_Stockist_Name[dco_Stockist_count].Order_Status == "2") {
                    $('#txt_Stockist_NameChemist_' + i).attr("disabled", true);
                    $('#txtStockistdueDateChemist_' + i).attr("disabled", true);
                }
                $('#txt_Stockist_NameChemist_' + i).val(dco_Stockist_Name[dco_Stockist_count].Stockist_Name);
                //$('#txtStockistdueDate_' + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Due_Date);
                var Due_Date = new Date(eval(dco_Stockist_Name[dco_Stockist_count].Order_Due_Date.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
                //fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                var _day = Due_Date.getDate();
                var _month = Due_Date.getMonth();
                var _year = Due_Date.getFullYear();
                _month = _month + 1;
                if (_month.toString().length == 1)
                    _month = "0" + _month;
                if (_day.toString().length == 1)
                    _day = "0" + _day;
                $('#txtStockistdueDateChemist_' + i).val(_day + '/' + (_month) + '/' + _year);
                $("#hdnStockist_CodeChemist_" + i).val(dco_Stockist_Name[dco_Stockist_count].Stockist_Code);
                //Stockist.Stockist_Region_Code = "";
                // Stockist.Customer_Code = $("#hdnDocName").val().trim();
                //Stockist.Customer_Region_Code = accom_Regioncodes[0].Doctor_Region_Code;


                $("#hdnOrder_IdChemist_" + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Id);
                $("#hdnOrder_NumberChemist_" + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Number);
                $("#hdnOrder_StatusChemist_" + i).val(dco_Stockist_Name[dco_Stockist_count].Order_Status);


                var Total_Qty = 0;
                var Total_POB_Value = 0;
                var ProductJSON = new Array();
                ProductJSON = jsonPath(dco_Sales_Products, "$[?(@.Order_Id=='" + dco_Stockist_Name[dco_Stockist_count].Order_Id + "')]");
                var TotalPOBAmount = 0;
                for (var k = 0; k < ProductJSON.length; k++) {
                    var Stockist_index = 1;
                    var txtId = SalesProductTableID + "_" + k;
                    if (dco_Stockist_Name[dco_Stockist_count].Order_Status == "2") {
                        $("#txt_SSalesProductsChemist_" + txtId).attr("disabled", true);
                        $("#hdnSSales_ProductsChemist_" + txtId).attr("disabled", true);
                        $("#txt_SQtyChemist_" + txtId).attr("disabled", true);
                        $("#txt_SUnitChemist_" + txtId).attr("disabled", true);
                        $("#txt_SAmountChemist_" + txtId).attr("disabled", true);
                        $("#txtReamrkChemist_" + SalesProductTableID).attr("disabled", true);
                    }
                    $("#txt_SSalesProductsChemist_" + txtId).val(ProductJSON[k].Product_Name);
                    $("#hdnSSales_ProductsChemist_" + txtId).val(ProductJSON[k].Product_Code);
                    $("#txt_SQtyChemist_" + txtId).val(ProductJSON[k].Product_Qty);
                    $("#txt_SUnitChemist_" + txtId).val(ProductJSON[k].Unit_Rate);
                    $("#txt_SAmountChemist_" + txtId).val(ProductJSON[k].Amount);
                    TotalPOBAmount += parseFloat(ProductJSON[k].Amount);
                    //For Draft
                    if (k < (ProductJSON.length - 1))
                        ChemistPOB.fnAddSalesProduct(true, (k + 1), SalesProductTableID, null)
                    else {
                        if (dco_Stockist_Name[dco_Stockist_count].Order_Status != "2")
                            ChemistPOB.fnAddSalesProduct(false, (k + 1), SalesProductTableID, null)
                    }
                }
                $("#txtReamrkChemist_" + SalesProductTableID).val(dco_Stockist_Name[dco_Stockist_count].Remarks);
                // Stockist.Total_POB_Value = Total_POB_Value;
                //Stockist.Total_Qty = Total_Qty;
                //Stockist.No_Of_Products = No_Of_Products;
                //Stockist.DCR_Actual_Date = dcrActualDate_g;
                //Stockist.Customer_Visit_Code = dcr_visit_code;
                //Client_Order_ID++;
                //InsertStockistJSON.push(Stockist);

                $("#lblprodutCountChemist_" + SalesProductTableID).text((ProductJSON.length));
                $("#lblTotalPOBAmountChemist_" + SalesProductTableID).text(fnRound(TotalPOBAmount, 2));


                i = i + 2;
                SalesProductTableID++;
                dco_Stockist_count++;
            }
        }

        //create Empty Row
        ChemistPOB.fnAddStockist(false, null);
    },

    //$('#hdnStockist_CodeChemist_' + i).val(lstChemistPOB[i - 1].Stockist_Code);
    //$('#txt_Stockist_NameChemist_' + i).val(lstChemistPOB[i - 1].Stockist_Name);
    ////$('#txt_SSalesProductsChemist_' + i).val((lstChemistPOB[i - 1].);
    ////$('#hdnSSales_ProductsChemist_').val();
    //$("#lblTotalPOBAmountChemist_" + i).text(lstChemistPOB[i - 1].Total_Amount);
    //$('#lblprodutCountChemist_' + i).text(lstChemistPOB[i - 1].No_Of_Product);


    fnGetChemistPOB: function () {
        debugger;
        var Chemist_POB = new Array(); var ID = 1;
        var POB = []; var SalesProductTableID_CV = 1;
        var Total_Qty = 0;
        var Total_POB_Value = 0;
        var No_Of_Products = 0;
        var Client_Order_ID = 1;
        var InsertStockistJSON_CV = new Array();
        var InsertSProductJSONCV = new Array();
        //if ($('#tbl_DetailedProducts_Chemist tr').lenght != null && $('#tbl_DetailedProducts_Chemist tr').length > 1) {
        for (var i = 1; i < $('#tbl_POB_Chemist tr').length; i++) {
            i++;
            // var SalesProductTableIndex _CV = parseInt(SalesProductTableIndex_CV) + 1;
            // var Product_Rows = $('#tblSalesProductChemist_' + SalesProductTableIndex_CV).children().length;


            if ($('#POB_RowChemist_' + i).css('display') != 'none') {
                POB = {};
                if (($('#hdnStockist_CodeChemist_' + i).val() != '') && ($('#hdnStockist_CodeChemist_' + i).val() != undefined)) {
                    var accom_Regioncodes = jsonPath(doctorAutoFill_g, "$[?(@.value=='" + $("#hdnDocName").val().trim() + "')]");

                    if ($("#hdnOrder_StatusChemist_" + i).val().trim() != "2") {

                        //var St_Region_Code = $("#hdnStockist_CodeChemist_" + i).val();
                        var St_Region_Code = jsonPath(StockistAuto_master_g, "$[?(@.StockiestCode=='" + $("#hdnStockist_CodeChemist_" + i).val() + "')]")
                        if (St_Region_Code <= 0 || St_Region_Code == false) {
                            fnMsgAlert('info', 'Purchase Order Booking', 'Invalid ' + StockistHeader_g + ' - ' + $('#txt_Stockist_NameChemist_' + i).val().trim());
                            return false;
                        }
                        var Stockist_Name = $('#txt_Stockist_NameChemist_' + i).val().trim();
                        var Stockist = {};
                        if ($('#txtStockistdueDateChemist_' + i).val().trim() != '')
                            POB.Order_Due_Date = $.trim($('#txtStockistdueDateChemist_' + i).val().split('/')[2]) + "-" + $.trim($('#txtStockistdueDateChemist_' + i).val().split('/')[1]) + "-" + $.trim($('#txtStockistdueDateChemist_' + i).val().split('/')[0]);
                        else
                            POB.Order_Due_Date = dcrActualDate_g;
                        //






                        POB.Client_Order_ID = Client_Order_ID;
                        //
                        if (POB.Order_Due_Date < dcrActualDate_g) {
                            fnMsgAlert('info', 'Information', StockistHeader_g + ' - Due Date (' + $('#txtStockistdueDateChemist_' + i).val() + ') Should be greater than DCR date');
                            return false;
                        }
                        if ($("#hdnOrder_IdChemist_" + i).val().trim() != '')
                            POB.Order_Id = $("#hdnOrder_IdChemist_" + i).val();
                        else
                            POB.Order_Id = '-1';
                        if ($("#hdnOrder_NumberChemist_" + i).val().trim() != '')
                            POB.Order_Number = $("#hdnOrder_NumberChemist_" + i).val().trim();
                        else
                            POB.Order_Number = "-1";
                        //-1 New
                        if ($("#hdnOrder_StatusChemist_" + i).val().trim() != '')
                            POB.Order_Status = $("#hdnOrder_StatusChemist_" + i).val();
                        else
                            POB.Order_Status = "3";
                        POB.Order_Mode = "0";
                        POB.Source_Of_Entry = "1";
                        if (!(fnValidateDateFormate(('#txtStockistdueDate_' + i), StockistHeader_g + ' Due Date'))) {
                            return false;
                        }

                        POB.Stockist_Code = $('#hdnStockist_CodeChemist_' + i).val();
                        POB.Stockist_Name = $('#txt_Stockist_NameChemist_' + i).val();
                        POB.Stockist_Region_Code = St_Region_Code[0].StockiestRegionCode;

                        POB.Customer_Code = $('#hdnChemistCode').val();
                        POB.Customer_Name = "";
                        var Cv_Region_Code = jsonPath(chemistAutoFill_g, "$[?(@.value=='" + $('#hdnChemistCode').val() + "')]");
                        if (Cv_Region_Code != undefined && Cv_Region_Code.length > 0) {
                            POB.Customer_Region_Code = Cv_Region_Code[0].Chemists_Region_Code;
                            POB.MDL_Number = Cv_Region_Code[0].MDL_Number;
                        }
                        else {
                            POB.Customer_Region_Code = Region_code_g;
                            POB.MDL_Number = "";
                        }
                        POB.Customer_Speciality = ' ';
                        POB.Customer_Category_Code = '';

                        //Product
                        var Product_Rows = $('#tblSalesProductChemist_' + SalesProductTableID_CV).children().length;
                        //For Remove the Header
                        Product_Rows--;
                        Total_Qty = 0;
                        Total_POB_Value = 0;
                        No_Of_Products = 0;

                        for (var k = 0; k < Product_Rows; k++) {
                            var txtId = SalesProductTableID_CV + "_" + k;
                            if ($('#proDivChemist_' + txtId).css('display') != 'none') {
                                if ($("#txt_SSalesProductsChemist_" + txtId).val() != '') {
                                    //$("#hdnSSales_ProductsChemist_" + txtId).val() != '' &&
                                    //check Product-available or not
                                    var single_Product = jsonPath(SalesProductsAutoFill_g, "$[?(@.value=='" + $("#hdnSSales_ProductsChemist_" + txtId).val() + "')]")
                                    if (single_Product <= 0 || single_Product == false) {
                                        fnMsgAlert('info', 'Purchase Order Booking', 'Invalid Product Name : ' + $("#txt_SSalesProductsChemist_" + txtId).val().trim());
                                        return false;
                                    }
                                    if ($("#txt_SQtyChemist_" + txtId).val() == '') {
                                        $("#txt_SSalesProductsChemist_" + txtId).focus();
                                        fnMsgAlert('info', 'Purchase Order Booking', ' Product quantity should be greater then zero for [ ' + $("#txt_SSalesProductsChemist_" + txtId).val().trim() + ' ]');
                                        return false;
                                    }
                                    else {
                                        if (parseFloat($("#txt_SQtyChemist_" + txtId).val()) <= 0 || $("#txt_SQtyChemist_" + txtId).val().trim() == '.') {
                                            $("#txt_SSalesProductsChemist_" + txtId).focus();
                                            fnMsgAlert('info', 'Purchase Order Booking', ' Product quantity should be greater then zero for [ ' + $("#txt_SSalesProductsChemist_" + txtId).val().trim() + ' ]');
                                            return false;
                                        }
                                    }
                                    var product = {};
                                    product.ID = ID;
                                    ID++;
                                    product.Client_Order_ID = POB.Client_Order_ID;
                                    product.Product_Code = $("#hdnSSales_ProductsChemist_" + txtId).val();
                                    product.Product_Name = $("#txt_SSalesProductsChemist_" + txtId).val();
                                    product.Product_Qty = $("#txt_SQtyChemist_" + txtId).val();
                                    product.Unit_Rate = $("#txt_SUnitChemist_" + txtId).val();
                                    product.Amount = $("#txt_SAmountChemist_" + txtId).val();
                                    InsertSProductJSONCV.push(product);

                                    Total_Qty += parseFloat(product.Product_Qty);
                                    Total_POB_Value += parseFloat(product.Amount);
                                    No_Of_Products++;

                                }
                            }
                        }



                        // remarks special char check.
                        var res = SpecialCharacterGroup("#txtReamrkChemist_" + SalesProductTableID_CV);
                        if (res == false || res == "false") {
                            fnMsgAlert('info', 'Information', 'Please enter allowed characters <b>[ ' + allowCharacterinRemarks + ' ]</b> in ' + StockistHeader_g + ' (' + POB.Stockist_Name + ') remarks ');
                            return false;
                        }
                        POB.Product_Code = $('#txt_SSalesProductsChemist_' + i).val();
                        POB.Product_Quantity = $('#hdnStockist_CodeChemist_' + i).val();
                        POB.No_Of_Product = $('#lblprodutCountChemist_' + i).text();
                        POB.Total_Amount = $("#lblTotalPOBAmountChemist_" + i).text();
                        //   var tbid = SalesProductTableIndex_CV + 1;
                        POB.Remarks = $("#txtReamrkChemist_" + SalesProductTableID_CV).val().trim();
                        POB.Action = '0';
                        POB.Total_POB_Value = Total_POB_Value;
                        POB.Total_Qty = Total_Qty;
                        POB.No_Of_Products = No_Of_Products;
                        POB.DCR_Actual_Date = dcrActualDate_g;
                        //     Stockist.Customer_Visit_Code = dcr_visit_code;
                        Client_Order_ID++;
                        Chemist_POB.push(POB);
                    }
                }

                else {
                    var Product_Rows = $('#tblSalesProductChemist_' + SalesProductTableID_CV).children().length;

                    for (var k = 0; k < Product_Rows; k++) {
                        var txtId = SalesProductTableID_CV + "_" + k;
                        if ($('#proDivChemist_' + txtId).css('display') != 'none') {
                            if ($("#txt_SSalesProductsChemist_" + txtId).val() != undefined && $("#txt_SSalesProductsChemist_" + txtId).val() != '' && $("#txt_SSalesProductsChemist_" + txtId).val() != 'undefined') {
                                fnMsgAlert('info', 'POB', 'Stockist name is mandatory for POB <br/> Please Enter Stockist Name for the product: <b>' + $("#txt_SSalesProductsChemist_" + txtId).val().trim() + '</b>');
                                return false;
                            }
                        }
                    }

                    if ($('#txt_Stockist_NameChemist_' + i).val() != '' && $("#txt_SSalesProductsChemist_" + txtId).val() != 'undefined') {
                        fnMsgAlert('info', 'Purchase Order Booking', 'Invalid ' + StockistHeader_g + ' : ' + $('#txt_Stockist_NameChemist_' + i).val());
                        return false;

                    }
                }

            }
            else {
                if ($("#hdnOrder_IdChemist_" + i).val().trim() != '') {
                    var POB = {};
                    POB.Client_Order_ID = Client_Order_ID;
                    POB.Order_Id = $("#hdnOrder_IdChemist_" + i).val();
                    POB.Total_POB_Value = '0';
                    POB.Total_Qty = '0';
                    POB.No_Of_Products = '0';
                    POB.Action = '1';
                    Client_Order_ID++;
                    Chemist_POB.push(POB);
                }
            }
            i = i + 2;
            SalesProductTableID_CV++;
            // Chemist_POB.push(POB);
        }
        //validation
        for (var st = 0; st < Chemist_POB.length; st++) {
            if (Chemist_POB[st].Action != '1') {
                var stockList = jsonPath(Chemist_POB, "$[?(@.Stockist_Code=='" + Chemist_POB[st].Stockist_Code + "')]")
                if (stockList.length > 1) {
                    fnMsgAlert('info', 'Purchase Order Booking', 'The ' + StockistHeader_g + '-' + stockList[0].Stockist_Name + ' already entered.');
                    return false;
                }
                var product_list = jsonPath(InsertSProductJSONCV, "$[?(@.Client_Order_ID=='" + Chemist_POB[st].Client_Order_ID + "')]")
                for (var pr = 0; pr < product_list.length; pr++) {
                    var single_product = jsonPath(product_list, "$[?(@.Product_Code=='" + product_list[pr].Product_Code + "')]")
                    if (single_product.length > 1) {
                        fnMsgAlert('info', 'Purchase Order Booking', 'The product name ' + single_product[0].Product_Name + ' already entered.');
                        return false;
                    }

                }
                if (product_list.length <= 0 || product_list == false) {
                    fnMsgAlert('info', 'Purchase Order Booking', 'Please select any one product name under ' + Chemist_POB[st].Stockist_Name + ' ' + StockistHeader_g + ' Name ');
                    return false;
                }
            }
        }
        return [Chemist_POB, InsertSProductJSONCV]
    },
    fnSalesProductsTotalAmountCal: function (obj) {
        var id = obj.id.split('_')

        var salesProductRowCount = $("#tblSalesProductChemist_" + id[2]).children().length;

        //For Header
        salesProductRowCount--;
        var totAmount = 0
        var pro_Count = 0;
        for (var i = 0; i < salesProductRowCount; i++) {
            var txtId = id[2] + "_" + i;
            if ($("#proDivChemist_" + txtId).css("display") != "none") {
                if ($("#hdnSSales_ProductsChemist_" + txtId).val() != '' && $("#txt_SSalesProductsChemist_" + txtId).val() != '') {
                    totAmount += parseFloat($("#txt_SAmountChemist_" + txtId).val());
                    pro_Count++;
                }
            }
        }
        $("#lblTotalPOBAmountChemist_" + id[2]).text(fnRound(totAmount, 2));
        $("#lblprodutCountChemist_" + id[2]).text(pro_Count);
    },
    fnSalesProductsAmountCal: function (obj, event) {
        debugger;
        var id = obj.id.split('_')
        var txtId = id[2] + "_" + id[3];
        //if (isNumberKey(event)) {

        var qty = obj.value;
        if (qty != '' && qty != '.') {
            var unit = $("#txt_SUnitChemist_" + txtId).val();
            $("#txt_SAmountChemist_" + txtId).val(fnRound(parseFloat(qty) * parseFloat(unit), 2));
        }
        else
            $("#txt_SAmountChemist_" + txtId).val('0');
        //}
        //else {
        //    $("#txt_SUnit_" + txtId).val('0');
        //    $("#txt_SAmountChemist_" + txtId).val('0');
        //    event.preventDefault();
        //}
        ChemistPOB.fnSalesProductsTotalAmountCal(obj);
    },
    fnSalesProductsAmount: function (obj, event) {
        debugger;
        var id = obj.id.split('_')
        var txtId = id[2] + "_" + id[3];
        //if (isNumberKey(event)) {

        var qty = obj.value;
        if (qty != '' && qty != '.') {
            var unit = $("#txt_SQtyChemist_" + txtId).val();
            $("#txt_SAmountChemist_" + txtId).val(fnRound(parseFloat(qty) * parseFloat(unit), 2));
        }
        else
            $("#txt_SAmountChemist_" + txtId).val('0');
        //}
        //else {
        //    $("#txt_SUnit_" + txtId).val('0');
        //    $("#txt_SAmountChemist_" + txtId).val('0');
        //    event.preventDefault();
        //}
        ChemistPOB.fnSalesProductsTotalAmountCal(obj);
    },
    fnclear: function (type) {
        $('#tbl_POB_Chemist tr').remove();
        POBRowIndexChemist_g = 0;
        SalesProductTableIndex_CV = 0;
        if (type != 'prefill') {
            ChemistPOB.fnAddStockist();
        }
    },
    fnValidateSalesProducts: function (obj) {
        debugger;
        fnValidateAutofill(obj, SalesProductsAutoFill_g, "txt_SSalesProductsChemist", "hdnSSales_ProductsChemist");
        var id = obj.id.split('_')
        var txtId = id[2] + "_" + id[3];
        var product_code = $("#hdnSSales_ProductsChemist_" + txtId).val();
        var SalesProducts = jsonPath(SalesProductsAutoFill_g, "$[?(@.value=='" + product_code + "')]");
        if (SalesProducts.length > 0) {
            $("#txt_SUnitChemist_" + txtId).val(SalesProducts[0].Unit_Rate);
            if ($("#txt_SQtyChemist_" + txtId).val().trim() == '')
                $("#txt_SQtyChemist_" + txtId).val('0');
            if ($("#txt_SAmountChemist_" + txtId).val() == '')
                $("#txt_SAmountChemist_" + txtId).val('0');
        }
        if ($("#hdnSSales_ProductsChemist_" + txtId).val() == '') {
            $("#txt_SQtyChemist_" + txtId).val('');
            $("#txt_SAmountChemist_" + txtId).val('');
            $("#txt_txt_SUnitChemist_" + txtId).val('');
        }
        ChemistPOB.fnSalesProductsTotalAmountCal(obj);

    }
}

