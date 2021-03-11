var MainString = ''; SubString = ''; UserName = ''; UserCode = ''; RowArray = []; MarketingCampaigns_List = '';
var SamplesList = ""; campCode = "";
var CampCodeFrmMC = ''; SDateFrmMC = ''; EDateFrmMC = '';


MainString += '<tr id="tblrowData_MainNum" class="RowData"><input type="hidden" value="0" id="hdnrowId_MainNum"/>';
MainString += '<td><input type="text" id="txtprod_MainNum" class="form-control autoProd" onblur="PurchaseRequisitionForm.fnValidateProduct(this.id);"placeholder="Please Select Product..." /><input type="hidden" id="hdnprodval_MainNum"></td>';
MainString += '<td><input type="number" id="txtQty_MainNum" min="1" max="99999" placeholder="e.g.1,2.," class="form-control" onpaste="return false;" onkeypress="return PurchaseRequisitionForm.fnValidateNumberQty(this,event);" /></td>';
MainString += '<td><textarea rows="3" maxLength="500" placeholder="Remarks Here..." id="txtremarks_MainNum" class="form-group rmrks"></textarea></td>';
MainString += '<td><input type="text" id="txtPPD_MainNum" placeholder="dd/mm/yyyy"   style="cursor:pointer;" class="form-control datecolPPD" readonly="readonly" /></td>';
MainString += '<td><input type="number" id="txtPPDND_MainNum" min="1" max="100"  placeholder="e.g.1,2.," class="form-control" onpaste="return false;" onkeypress="return PurchaseRequisitionForm.fnValidateNumber(this,event);"/></td>';
MainString += '<td><input type="text" id="txtDD_MainNum" placeholder="dd/mm/yyyy"  style="cursor:pointer;" class="form-control datecolDD" readonly="readonly" /></td>';
MainString += '<td><input type="number" id="txtDDND_MainNum" min="1" max="100" placeholder="e.g.1,2.," class="form-control " onpaste="return false;" onkeypress="return PurchaseRequisitionForm.fnValidateNumber(this,event);" /></td>';
MainString += '<td><input type="text" id="txtAD_MainNum" placeholder="dd/mm/yyyy"   style="cursor:pointer;" class="form-control datecolAD" readonly="readonly" /></td>';
MainString += '<td><input type="number" id="txtADND_MainNum" min="1" max="100" placeholder="e.g.1,2.," class="form-control"  onpaste="return false;" onkeypress="return PurchaseRequisitionForm.fnValidateNumber(this,event);"/></td>';
MainString += '<td class="addimg" id="imgadd_MainNum"><i class="fa fa-plus-circle add" value="MainNum" ondblclick="return false;" onclick="PurchaseRequisitionForm.fnAddRow(MainNum,this);" id="imgadd_MainNum"></td>';
MainString += '<td class="removeimg" id="imgremove_MainNum"><i class="fa fa-times-circle remove" value="MainNum" ondblclick="return false;" onclick="PurchaseRequisitionForm.fnRemoveRow(MainNum);" id="imgremove_MainNum"></td>';
MainString += '</tr>';


var PurchaseRequisitionForm = {
    defaults:{
        Samples_List:'',
    },
    Init: function (username,usercode,campCodeMC,sDateMC,eDateMC) {
        UserName = username;
        UserCode = usercode;
        CampCodeFrmMC = campCodeMC;
        SDateFrmMC = sDateMC;
        EDateFrmMC = eDateMC;
       
        PurchaseRequisitionForm.fnOnLoadActivities();
        PurchaseRequisitionForm.fnGetAllMarketingCampaigns();
        if (CampCodeFrmMC != "" && CampCodeFrmMC != undefined) {
            PurchaseRequisitionForm.fnGetDetails(CampCodeFrmMC);
            $('#PR_Modal').modal('show');
            $('#drpdwnCampaign').attr('disabled', true);
            $.unblockUI();
        } else {
            PurchaseRequisitionForm.fnGetDetails(0);
        }
         
    },

    
    fnOnLoadActivities:function(){
        debugger;
        //$.blockUI();
        today=new Date();
        date=today.getDate();
        month=today.getMonth()+1;
        year=today.getFullYear();
        if(date!='' && month!='' && year!=''){
            current_Date=date+'/'+month+'/'+year;
        }

        if(current_Date!=''){
            $('#txtreqby').val(current_Date);
        }


        //Requisition By
        if (UserName != '') {
            $('#username').html(UserName);
        }
    },
    //Functions to get Marketing Campaigns And to Bind for DropDown
    fnGetAllMarketingCampaigns: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllCampaignsBasedonRegion",
            data: "",
            async:false,
            success: function (resp) {
                MarketingCampaigns_List = resp;
                PurchaseRequisitionForm.fnBindCampaignsHTML(resp);
            }
        });
    },
    fnBindCampaignsHTML: function (resp) {
        debugger;
        var content = '';
        content += '<option value="0">-Please Select Campaign-</option>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                content += '<option value=' + resp[i].Campaign_Code + '>' + resp[i].Campaign_Name + '</option>';
            }
        }
        $('#drpdwnCampaign').html(content);
    },


    //Function to trigger 
    fnGetDetails: function (value) {
        debugger;
        var DrpDwn_Val = '';
        if (value == undefined || value == '') {
            DrpDwn_Val = 0;
        } 
        else {
            DrpDwn_Val = value;
        }
        if (DrpDwn_Val == 0 || DrpDwn_Val != 0) {
            RowArray = [];
            $('#tblprodbody').empty();
            PurchaseRequisitionForm.fnGetSampleProducts(DrpDwn_Val);
          
            //PurchaseRequisitionForm.fnCancel();
            //$('#drpdwnCampaign').val(value);
           
          
        }
    },

    //Function to GetSaleProducts
    fnGetSampleProducts: function (value) {
        debugger;
        if (CampCodeFrmMC != "" && CampCodeFrmMC != undefined) {
            $('#drpdwnCampaign').val(CampCodeFrmMC);
        }
        campCode = $('#drpdwnCampaign').val();
       // $('#drpdwnCampaign').val(value);
        $.blockUI();
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PurchaseRequisition/GetSampleProducts",
            data: "campaignCode=" + campCode,
            async: false,
            success: function (resp) {
                console.log(resp);
                if (resp.length > 0) {

                    var SampleProd = "["
                    for (var i = 0; i < resp.length; i++) {
                        SampleProd += "{label:" + '"' + "" + resp[i].Sample_Name + "" + '",' + "value:" + '"' + "" + resp[i].Sample_Code + "" + '"' + "}";
                        if (i < resp.length - 1) {
                            SampleProd += ',';
                        }
                    }
                    SampleProd += "]";
                    SamplesList = eval(SampleProd);
                   // PurchaseRequisitionForm.defaults.Samples_List = eval(SampleProd);
                   // RowArray = [];
                   
                }
            }
            
          
        });
        $('#tblprodbody').empty();
        RowArray = [];
        PurchaseRequisitionForm.fnCreatedProduct('LOAD');
       // $.unblockUI();
    },

    //Function to Create New Row
    fnCreatedProduct: function (id) {
        debugger;
        var rowdbid = '';
        if (id != "") {
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Master/PurchaseRequisition/GetNextRowId",
                data: "",
                async:false,
                success: function (resp) {
                    rowdbid = resp;
                }
            });
        }
        if (id == 'LOAD') {
            var MainId = 0;
            $('#tblprodbody').empty();
        } else {
            var MainId = id.id.split('_')[1];
        }
        var count = RowArray.length;
        //if (MainId != 0) {
        //    MainId = $('#tblprodbody tr:last').get(0).id;
        //    MainId = MainId.split('_')[1];
        //}
       
        if (count == MainId) {
            MainId = parseInt(MainId) + 1;
            var prodStr = MainString.replace(/MainNum/g, MainId);
            $("#tblprodbody").append(prodStr);
            if (rowdbid != '') {
                $('#hdnrowId_' + MainId).val(rowdbid);
            }
            autoComplete(SamplesList, "txtprod", "hdnprodval", 'autoProd');
            PurchaseRequisitionForm.fnPurchaseRequisitionEventBinder();
            RowArray.push(MainId);
        }
        $.unblockUI();
    },

    //Function for Event Binder for Columns
    fnPurchaseRequisitionEventBinder: function () {
       
        $('.datecolPPD').hover(function () { PurchaseRequisitionForm.fnGetDatePicker(this); });
        $('.datecolPPD').click(function () { PurchaseRequisitionForm.fnGetDatePicker(this); });

        $('.datecolDD').hover(function () { PurchaseRequisitionForm.fnGetDatePicker(this); });
        $('.datecolDD').click(function () { PurchaseRequisitionForm.fnGetDatePicker(this); });

        $('.datecolAD').hover(function () { PurchaseRequisitionForm.fnGetDatePicker(this); });
        $('.datecolAD').click(function () { PurchaseRequisitionForm.fnGetDatePicker(this); });
    },

    //Function to get DatePicker
    fnGetDatePicker: function (Id) {
       
        $(function () {
            $('#'+Id.id).datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd/mm/yy',
                minDate: 0,
                numberOfMonths: 1,                
            });
        });
    },

    //Funciton to Add New Row
    fnAddRow: function (rowid, Id) {
        debugger;     
        if (rowid != '') {
            $('#imgadd_' + rowid).hide();
            $('#imgremove_' + rowid).show();

        }
        if (Id.id != "" && Id.id != undefined) {
            PurchaseRequisitionForm.fnCreatedProduct(Id)
        }
    },

    //Function to Remove Row
    fnRemoveRow: function (value) {
        debugger;
        $('#tblrowData_' + value).remove();
    },

    //Function to validate form
    fnValidatePurchaseRequisition:function()
    {
        var flag = true;
        $.blockUI();

        //Requisition Date
        var Req_Date = $('#txtreqby').val();
        var reqDate = new Date(Req_Date);
        if (Req_Date == "") {
            fnMsgAlert('info', 'Purchase Requisition Form', 'Please Select Requisition Date.');
            $.unblockUI();
            flag = false;
            return;
        }

        //Ojective
        var Objective = $('#txtobjctve').val();
        if (Objective != '') {
            var result = PurchaseRequisitionForm.fnValidateObjective(Objective);
            if (result == false) {
                fnMsgAlert('info', 'Purchase Requisition Form', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Objective.');
                $.unblockUI();
                flag = false;
                return;
            }
        }
        var Div_Prod_lgnth = $('#tblprodbody tr').length;
        var ProdArray = new Array();
        var ZeroProdArray = new Array();
        if (Div_Prod_lgnth >= 1) {
            var CampCode = $('#drpdwnCampaign').val();
            
            $('#tblprodbody tr').each(function (index, obj) {
                debugger;
                var RowId = obj.id.replace("tblrowData_", "");
                var product_Sample = $('#txtprod_' + RowId).val();
                var hdn_Sample_Product = $('#hdnprodval_' + RowId).val();

                if (Div_Prod_lgnth == 1) {
                    if (hdn_Sample_Product == 0 && product_Sample != "" && product_Sample!=undefined) {
                        var products = SamplesList;// PurchaseRequisitionForm.defaults.Samples_List;
                        var saleJson = jsonPath(products, "$.[?(@.value=='" + hdn_Sample_Product + "')]");
                        if (saleJson == false || saleJson === undefined) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter Valid Product.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }

                    }
                    if (product_Sample == 0 || product_Sample == undefined || product_Sample == "") {
                        fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter atleast one Product to save Purchase Requisition Form.');
                        $.unblockUI();
                        flag = false;
                        return;
                    }
    
                    if (hdn_Sample_Product != '' && hdn_Sample_Product != 0 && product_Sample != "") {
                        if ($('#txtQty_' + RowId).val() == '' || $('#txtQty_' + RowId).val() == 0 || $('#txtQty_' + RowId).val() == undefined) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter Quantity for the Entered Product  "' + product_Sample + '".');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (hdn_Sample_Product != 0) {
                        ProdArray.push(hdn_Sample_Product);
                    }
                    

                }
                
               
                if (hdn_Sample_Product != '' && hdn_Sample_Product != 0 && product_Sample != "") {
                    if ($('#txtQty_' + RowId).val() == '' || $('#txtQty_' + RowId).val() == 0 || $('#txtQty_' + RowId).val() == undefined) {
                        fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter Quantity for the Entered Product  "' + product_Sample + '".');
                        $.unblockUI();
                        flag = false;
                        return;
                    }                    
                }
                if (hdn_Sample_Product == 0 && product_Sample != "") {
                    fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter Valid Product');
                    $.unblockUI();
                    flag = false;
                    return;
                }
               
                if (hdn_Sample_Product != 0) {
                     ProdArray.push(hdn_Sample_Product);
                }
                if (hdn_Sample_Product == 0 || hdn_Sample_Product != 0) {
                    var products = SamplesList;
                    if (product_Sample != "") {
                        var saleJson = jsonPath(products, "$.[?(@.value=='" + hdn_Sample_Product + "')]");
                        if (saleJson == false || saleJson === undefined) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter Valid Product.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }                  
                }

               
                var Remarks = $('#txtremarks_' + RowId).val();
                if (Remarks != "") {
                    var result = PurchaseRequisitionForm.fnValidateObjective(Remarks);
                    if (result == false) {
                        fnMsgAlert('info', 'Purchase Requisition Form', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Remarks.');
                        $.unblockUI();
                        flag = false;
                        return;
                    }
                }
                if (CampCode == 0) {
                    var PPD = $("#txtPPD_" + RowId).val();
                    if (PPD != "" && PPD != undefined) {
                        PPD = PPD.split('/')[2] + '/' + PPD.split('/')[1] + '/' + PPD.split('/')[0];
                        var ppd = new Date(PPD);
                    }
                    var DD = $('#txtDD_' + RowId).val();
                    if (DD != "" && DD != undefined) {
                        DD = DD.split('/')[2] + '/' + DD.split('/')[1] + '/' + DD.split('/')[0];
                        var dd = new Date(DD);
                    }
                    var AD = $('#txtAD_' + RowId).val();
                    if (AD != "" && AD != undefined) {
                        AD = AD.split('/')[2] + '/' + AD.split('/')[1] + '/' + AD.split('/')[0];
                        var ad = new Date(AD);
                    }
                    var reqdate = $('#txtreqby').val();
                    if (reqdate != "" && reqdate != undefined) {
                        reqdate = reqdate.split('/')[2] + '/' + reqdate.split('/')[1] + '/' + reqdate.split('/')[0];
                        var reqdte = new Date(reqdate);
                    }

                    //if (dd != undefined && dd != "" && ppd != "" && ppd != undefined && ad != undefined && ad != "") {
                    if (dd != undefined && dd != "" && ppd != "" && ppd != undefined) {
                        if (dd < ppd) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Dispatch Date Should be greater than Purchase Procurement Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (ad != undefined && ad != "" && dd != undefined && dd != "") {
                        if (ad < dd) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should be greater than Dispatch Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (ad != undefined && ad != "" && ppd != "" && ppd != undefined) {
                        if (ad < ppd) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should be greater than Purchase Procurement Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }


                    //if (dd != undefined && dd != "" && ppd != "" && ppd != undefined && ad != undefined && ad != "" && reqdte != "" && reqdte != undefined) {
                    if (ppd != "" && ppd != undefined && reqdte != "" && reqdte != undefined) {
                        if (ppd < reqdte) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Purchase Procurement Date Should be greater than Requisition Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (dd != undefined && dd != "" && reqdte != "" && reqdte != undefined) {
                        if (dd < reqdte) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Dispatch Date Should be greater than Requisition Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (ad != undefined && ad != "" && reqdte != "" && reqdte != undefined) {
                        if (ad < reqdte) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should be greater than Requisition Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                }             
              
              
                if (CampCode != undefined && CampCode != "" && CampCode!=0) {
                    var disjson = jsonPath(MarketingCampaigns_List, "$.[?(@.Campaign_Code=='" + CampCode + "')]");
                    var startDate = disjson[0].Start_Date;
                    var endDate = disjson[0].End_Date;
                    if (startDate != "" && startDate != undefined) {
                        startDate = startDate.split('/')[2] + '/' + startDate.split('/')[1] + '/' + startDate.split('/')[0];
                        var sDate = new Date(startDate);
                    }
                    if (endDate != "" && endDate != undefined) {
                        endDate = endDate.split('/')[2] + '/' + endDate.split('/')[1] + '/' + endDate.split('/')[0];
                        var eDate = new Date(endDate);
                    }
                  
                   
                    var PPD = $("#txtPPD_" + RowId).val();
                    if (PPD != "" && PPD != undefined) {
                        PPD = PPD.split('/')[2] + '/' + PPD.split('/')[1] + '/' + PPD.split('/')[0];
                        var ppd = new Date(PPD);
                    }
                    var DD = $('#txtDD_' + RowId).val();
                    if (DD != "" && DD != undefined) {
                        DD = DD.split('/')[2] + '/' + DD.split('/')[1] + '/' + DD.split('/')[0];
                        var dd = new Date(DD);
                    }
                    var AD = $('#txtAD_' + RowId).val();
                    if (AD != "" && AD != undefined) {
                        AD = AD.split('/')[2] + '/' + AD.split('/')[1] + '/' + AD.split('/')[0];
                        var ad = new Date(AD);
                    }
                    var reqdate = $('#txtreqby').val();
                    if (reqdate != "" && reqdate != undefined) {
                        reqdate = reqdate.split('/')[2] + '/' + reqdate.split('/')[1] + '/' + reqdate.split('/')[0];
                        var reqdte = new Date(reqdate);
                    }
                    
                    //if (dd != undefined && dd != "" && ppd != "" && ppd != undefined && ad != undefined && ad != "" && eDate != "" && eDate != undefined) {
                    if(ppd != "" && ppd != undefined && eDate != "" && eDate != undefined){
                        if (ppd > eDate) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Purchase Procurement Date Should not be greater than Marketing Campaign End Date');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if(dd != undefined && dd != "" &&  eDate != "" && eDate != undefined){
                        if (dd > eDate) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Dispatch Date Should not be greater than Marketing Campaign End Date');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if(ad != undefined && ad != ""&&  eDate != "" && eDate != undefined){
                        if (ad > eDate) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should not be greater than Marketing Campaign End Date');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }     
                    if (dd != undefined && dd != "" && ppd != "" && ppd != undefined) {
                        if (dd < ppd) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Dispatch Date Should be greater than Purchase Procurement Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (ad != undefined && ad != "" && dd != undefined && dd != "") {
                        if (ad < dd) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should be greater than Dispatch Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (ad != undefined && ad != "" && ppd != "" && ppd != undefined) {
                        if (ad < ppd) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should be greater than Purchase Procurement Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }


                    //if (dd != undefined && dd != "" && ppd != "" && ppd != undefined && ad != undefined && ad != "" && reqdte != "" && reqdte != undefined) {
                    if (ppd != "" && ppd != undefined && reqdte != "" && reqdte != undefined) {
                        if (ppd < reqdte) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Purchase Procurement Date Should be greater than Requisition Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (dd != undefined && dd != "" && reqdte != "" && reqdte != undefined) {
                        if (dd < reqdte) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Dispatch Date Should be greater than Requisition Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                    if (ad != undefined && ad != "" && reqdte != "" && reqdte != undefined) {
                        if (ad < reqdte) {
                            fnMsgAlert('info', 'Purchase Requisition Form', 'Acknowledgement Date Should be greater than Requisition Date.');
                            $.unblockUI();
                            flag = false;
                            return;
                        }
                    }
                }
               
            });
            if (flag == false) {
                return flag;
            }
            if(ProdArray.length==0){
                fnMsgAlert('info', 'Purchase Requisition Form', 'Please Enter Atleast one Product to Save Purchase Requisition Form.');
                $.unblockUI();
                flag = false;
                return;
            }
          
            
        }
        return flag;
        $.unblockUI();
    },

    //Function to Save Form
    fnSavePurchaseRequisitionForm: function () {
        debugger;
        
        var result=PurchaseRequisitionForm.fnValidatePurchaseRequisition();
        if (result == true) {
            
            if (CampCodeFrmMC != "" && CampCodeFrmMC != undefined) {
                $('#RequisitionBody').block();
            } else {
                $.blockUI();
            }
            var Req_date = $('#txtreqby').val();
            if (Req_date != "") {
                Req_date = Req_date.split('/')[2] + '/' + Req_date.split('/')[1] + '/' + Req_date.split('/')[0];
            }
            var Req_By = UserCode;
            var Camp_Code = $('#drpdwnCampaign :selected').val();
            var objective = $('#txtobjctve').val();
            var ProdArray = [];
            $('#tblprodbody tr').each(function (index, obj) {
                debugger;
                var rowId = obj.id.replace("tblrowData_", "");
                var sample_Prod = $('#hdnprodval_' + rowId).val();
                if (sample_Prod != undefined && sample_Prod != "") {


                    var Qty = $('#txtQty_' + rowId).val();
                    var remarks = $('#txtremarks_' + rowId).val();
                    var PPD = $('#txtPPD_' + rowId).val();
                    var RowDBId = $('#hdnrowId_' + rowId).val();
                    if (PPD != "") {
                        PPD = PPD.split('/')[2] + '/' + PPD.split('/')[1] + '/' + PPD.split('/')[0];
                    }
                    var PPD_ND = $('#txtPPDND_' + rowId).val();
                    var DD = $('#txtDD_' + rowId).val();
                    if (DD != "") {
                        DD = DD.split('/')[2] + '/' + DD.split('/')[1] + '/' + DD.split('/')[0];
                    }
                    var DD_ND = $('#txtDDND_' + rowId).val();
                    var AD = $('#txtAD_' + rowId).val();
                    if (AD != "") {
                        AD = AD.split('/')[2] + '/' + AD.split('/')[1] + '/' + AD.split('/')[0];
                    }
                    var AD_ND = $('#txtADND_' + rowId).val();
                    var ProdObj = {
                        RowId: RowDBId,
                        Sample_Product: sample_Prod,
                        Quantity: Qty,
                        Remarks: remarks,
                        Purchase_Procurement_Date: PPD,
                        PPD_Notification_Days: PPD_ND,
                        Dispatch_Date: DD,
                        DD_Notification_Days: DD_ND,
                        Acknowledgement_Date: AD,
                        AD_Notification_Days: AD_ND,
                    };
                    ProdArray.push(ProdObj);
                }
            });
            var PurchaseRequisitionObj = {
                Requisition_Date: Req_date,
                Requisition_By: Req_By,
                Objective: objective,
                Campaign_Code: Camp_Code,
                lstProd: ProdArray,
            };
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/PurchaseRequisition/InsertPurchaseRequisition",
                data: JSON.stringify({ "ObjPurchaseRequisitionModel": PurchaseRequisitionObj }),
                contentType: 'application/json; charset=utf-8',
                success: function (resp) {
                    if (resp == "True") {

                        PurchaseRequisitionForm.fnCancel();
                        PurchaseRequisitionForm.fnOnLoadActivities();
                        PurchaseRequisitionForm.fnGetDetails(0);
                        fnMsgAlert('success', 'Purchase Requisition Form', 'Saved Purchase Requisition Form Successfully.');
                        if (CampCodeFrmMC != "" && CampCodeFrmMC != undefined) {
                            $('#RequisitionBody').unblock();
                        } else {
                            $.unblockUI();
                        }
                     
                    } else {
                        PurchaseRequisitionForm.fnCancel();
                        PurchaseRequisitionForm.fnOnLoadActivities();
                        PurchaseRequisitionForm.fnGetDetails(0);
                        fnMsgAlert('error', 'Purchase Requisition Form', 'Failed to Save Purchase Requisition Form.Please try After Sometime.');
                        if (CampCodeFrmMC != "" && CampCodeFrmMC != undefined) {
                            $('#RequisitionBody').unblock();
                        } else {
                            $.unblockUI();
                        }
                    }
                },

            });
        }
    },

    //Function to validate Product
    fnValidateProduct:function(Id,rowId){       
        var samples = PurchaseRequisitionForm.defaults.Samples_List;
        var Product_Name = $('#' + Id + '' + rowId).val();
        if (Product_Name != "") {
            var i = "false";
            var s = "";

            for (var o = 0; o < samples.length; o++) {
                if (samples[o].label == Product_Name) {
                    i = "true";
                    s = samples[o].value
                }
            }
            if (i == "false") {
                $("#hdnprodval_"+rowId).val(0);
            } else {
                $("#hdnprodval_" + rowId).val(s);
            }
        } else {
            $("#hdnprodval_" + rowId).val(0);
        }
    },
    fnValidateNumber: function (Id, evt) {

        if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
            return false;
        }
        else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
            return false;
        }
        else {
            if ($('#' + Id.id).val() != '') {
                if ($('#' + Id.id).val().length >= 3) {
                    return false;
                }
            }
        }
    },
    fnValidateNumberQty: function (Id, evt) {

        if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
            return false;
        }
        else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
            return false;
        }
        else {
            if ($('#' + Id.id).val() != '') {
                if ($('#' + Id.id).val().length >= 5) {
                    return false;
                }
            }
        }
    },
    fnValidateObjective: function (value) {
       
        var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);       
        if (specialCharregex.test(value) == true) {
            return false;
        }
        else {
            return true;
        }
    },
    fnCancel: function () {
        debugger;
        $('#txtobjctve').val('');
        $('#drpdwnCampaign').val(0);
        $('#tblprodbody').empty();
        RowArray = [];
        PurchaseRequisitionForm.fnCreatedProduct('LOAD');
        PurchaseRequisitionForm.fnGetSampleProducts(0);
        //MarketingCampaigns_List = "";
        //PurchaseRequisitionForm.defaults.Samples_List = '';
        $.unblockUI();
    },


   

}