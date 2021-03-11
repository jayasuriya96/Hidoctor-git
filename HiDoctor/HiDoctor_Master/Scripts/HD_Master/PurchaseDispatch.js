var Receipt_Id = ''; MainString = ''; RowArray = []; User_Code = '';
var Receipts_List = ''; User_List = ''; campCode = ''; Region_List = ''; Challans_List = '';
MainString += '<tr id="tblrowData_MainNum" class="RowData"><input type="hidden" value="0" id="hdnrowId_MainNum"/>';
MainString += '<td><input type="text" id="txtUser_MainNum" class="form-control autoUser"  onblur="Dispatch.fnCheckForUsers(this.id,MainNum);"placeholder="Please Select User..." /><input type="hidden" id="hdnuser_MainNum"><input type="hidden" id="hdnusermain_MainNum" value="0"></td>';
MainString += '<td><span id="UserName_MainNum"></span></td>';
MainString += '<td><input type="number" id="txtQty_MainNum" min="1" max="99999" placeholder="e.g.1,2.," class="form-control" onpaste="return false;" onkeypress="return Dispatch.fnValidateNumberQty(this,event);" /></td>';
MainString += '<td><textarea rows="3" maxLength="500" placeholder="Remarks Here..." style="width:100%;" id="txtremarks_MainNum" class="form-group rmrks"></textarea></td>';
MainString += '<td><input type="text" id="txtChallan_MainNum"maxLength="50" placeholder="e.g.1,2.," class="form-control" /></td>';
MainString += '<td><input type="text" id="txtDD_MainNum" placeholder="dd/mm/yyyy" class="form-control datecolDD" readonly="readonly" style="cursor:pointer;"/></td>';
MainString += '<td class="addimg" id="imgadd_MainNum"><i class="fa fa-plus-circle add" value="MainNum" ondblclick="return false;" onclick="Dispatch.fnAddRow(MainNum,this);" id="imgadd_MainNum"></td>';
MainString += '<td class="removeimg" id="imgremove_MainNum"><i class="fa fa-times-circle remove" value="MainNum" ondblclick="return false;" onclick="Dispatch.fnRemoveRow(MainNum);" id="imgremove_MainNum"></td>';
MainString += '</tr>';
var Dispatch = {
    defaults: {
        User_List: '',
        Region_List:'',

    },
    Init: function (userCode) {
        User_Code = userCode
        Dispatch.fnGetAllChallanNumbers();
        Dispatch.fnGetAllReceiptstoDispatch();
        Dispatch.fnGetUserTree(userCode);
    },

    fnGetAllReceiptstoDispatch: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PurchaseRequisition/GetAllReceiptstoDispatch",
            data: "",
            success: function (resp) {
                Receipts_List = resp;
                Dispatch.fnBindReceiptsHTML(resp);
            }
        });
    },
    fnBindReceiptsHTML: function (resp) {
        debugger;
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover" style="text-align:center;">';
        content += '<thead style="text-align:center;">';
        content += '<tr>';
        content += '<th>S.No</th>';
        content += '<th>Product Name</th>';
        content += '<th>Total Quantity</th>';
        content += '<th>Dispatched Quantity</th>';
        content += '<th>Balance Quantity</th>';
        content += '<th width="25%;">Remarks</th>';
        content += '<th>Requested By</th>';
        content += '<th>Reference Type</th>';
        content += '<th>Receipt By</th>';
        content += '<th>Receipt Date</th>';
        content += '<th>Acknowledge</th>';
        content += '<th>Dispatch</th>';
        content += '</tr>';
        content += '</thead><tbody>';
        if (resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                if (resp[i].Quantity > resp[i].Dispatched_Quantity) {
                    sno++;
                    var pending_quantity = resp[i].Quantity - resp[i].Dispatched_Quantity;
                    content += '<tr>';
                    content += '<td>' + sno + '</td>';
                    content += '<td>' + resp[i].Product_Name + '</td>';
                    content += '<td>' + resp[i].Quantity + '</td>';
                    content += '<td>' + resp[i].Dispatched_Quantity + '</td>';
                    content += '<td>' + pending_quantity + '</td>';
                    if (resp[i].Remarks != null) {
                        content += '<td>' + resp[i].Remarks + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    content += '<td>' + resp[i].Requisition_By + '</td>';
                    if (resp[i].Campaign_Name != null) {
                        content += '<td style="text-align:center;word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">' + resp[i].Campaign_Name + '</td>';
                    } else {
                        content += '<td style="text-align:center;word-wrap: break-word;white-space: normal;word-break: break-word;width: 25%;">General</td>';
                    }
                   
                    content += '<td>' + resp[i].Receipt_By + '</td>';
                    content += '<td>' + resp[i].Receipt_On + '</td>';
                    if (resp[i].Acknowledge_Status == 0) {
                        content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="Dispatch.fnAcknowledgeItem(\'' + resp[i].Receipt_Id + '\');">Acknowledge</td>';
                    } else {
                        content += '<td><img src="../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png" title="Acknowledged"></td>';
                    }
                    if (resp[i].Acknowledge_Status == 0) {
                        content += '<td></td>';
                    } else {
                        content += '<td style="cursor: pointer;text-decoration: underline;color: blue; text-align:center" Onclick="Dispatch.fnDispatchItem(\'' + resp[i].Receipt_Id + '\',\'' + resp[i].Campaign_Code + '\');">Dispatch</td>';
                    }
                    content += '</tr>';
                }
            }
        }
        else {
            content += "<tr style='font-style:italic;text-align:center;'><td colspan='12'>No Receipt(s) Available to Dispatch.</td></tr>";
           // content += "<div class='col-lg-12 form-group' style='font-style:italic;'>No Receipt(s) Available to Dispatch.</div>";
        }
        content += '</tbody></table>';
        $('#RList').html(content);
    },
    fnAcknowledgeItem: function (Rec_Id) {
        debugger;
        var mode = "RA";
        Receipt_Id = Rec_Id;
        $.ajax({
            type: "PUT",
            url: "../HiDoctor_Master/PurchaseRequisition/UpdateAcknowledgement",
            data: "mode=" + mode + "&UpdateId=" + Receipt_Id,
            success: function (resp) {
                if (resp = "True") {
                    Dispatch.fnGetAllReceiptstoDispatch();
                    Receipt_Id = '';
                    fnMsgAlert('success', 'Purchase Dispatch', 'Acknowledged Successfully.');
                    return false;
                }
                else {
                    fnMsgAlert('error', 'Purchase Dispatch', 'Failed to Acknowledge.Please try After Sometime.')
                    return false;
                }
            }
        });
    },
    fnDispatchItem: function (Rece_Id,CampaignCode) {
        debugger;
        Receipt_Id = Rece_Id;
        campCode = CampaignCode;
        if (Receipt_Id != "" && Receipt_Id != undefined) {
            var disjson = jsonPath(Receipts_List, "$.[?(@.Receipt_Id=='" + Receipt_Id + "')]");
            $('#RecpBy').html(disjson[0].Receipt_By);
            $('#RecpOn').html(disjson[0].Receipt_On);
            $('#Qtity').html(disjson[0].Quantity);
            $('#DisQtity').html(disjson[0].Dispatched_Quantity);
            var pending_quantity = disjson[0].Quantity - disjson[0].Dispatched_Quantity;
            $('#BalQtity').html(pending_quantity);
            $('#hdnQtity').val(disjson[0].Quantity);
            $('#dispatchform').show();
            Dispatch.fnGetRegionHierarchy(campCode);
            
        }

    },

    fnGetRegionHierarchy:function(campCode){
        debugger;
        var RegionArray = [];
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PurchaseRequisition/GetRegionHierarchy",
            data: "campaignCode=" + campCode,
            //async: false,
            success: function (resp) {
                //console.log(resp);
                Region_List = resp;
                var RegionList = "["
                for (var i = 0; i < resp.length; i++) {
                    
                    var region_Name = resp[i].Region_Name + '(' + resp[i].Region_Type_Name + ')';
                    //console.log(region_Name);
                    RegionList += "{label:" + '"' + "" + region_Name + "" + '",' + "value:" + '"' + "" + resp[i].Region_Code + "" + '"' + "}";
                    if (i < resp.length - 1) {
                        RegionList += ',';
                    }
                    //RegionArray.push(RegionList);
                }
                RegionList += "]";
               // console.log(RegionList);
                Dispatch.defaults.Region_List = eval(RegionList);
                Dispatch.fnCreatedDisptachRow('LOAD');
            }
        });
    },
    fnCreatedDisptachRow: function (Id) {
        debugger;
        if (Id == 'LOAD') {
            var MainId = 0;
            $('#tbldisbody').empty();
            RowArray = [];
        } else {
            var MainId = Id.id.split('_')[1];
        }
        var count = RowArray.length;

        if (count == MainId) {
            MainId = parseInt(MainId) + 1;
            var RowStr = MainString.replace(/MainNum/g, MainId);
            $("#tbldisbody").append(RowStr);
            var regions = Dispatch.defaults.Region_List;
            autoComplete(regions, "txtUser_", "hdnuser_", "autoUser");
            Dispatch.fnDispatchEventBinder();
            RowArray.push(MainId);
        }
    },
    fnDispatchEventBinder: function () {
        $('.datecolDD').hover(function () { Dispatch.fnGetDatePicker(this); });
        $('.datecolDD').click(function () { Dispatch.fnGetDatePicker(this); });
        //$('.autoUser').click(function () { Dispatch.fnValidateUser(this.id); });
        //$('.autoUser').dblclick(function () { Dispatch.fnValidateUser(this.id); });
        //$('.autoUser').mouseleave(function () { Dispatch.fnValidateUser(this.id); });

    },
    fnGetDatePicker: function (Id) {
        debugger;
        var disjson = '';
        var Rece_date = "";
        if (Receipt_Id != "" && Receipt_Id != undefined) {
            disjson = jsonPath(Receipts_List, "$.[?(@.Receipt_Id=='" + Receipt_Id + "')]");
        }
        if (disjson.length >= 1) {
            Rece_date = disjson[0].Receipt_On.split('/')[2] + '/' + disjson[0].Receipt_On.split('/')[1] + '/' + disjson[0].Receipt_On.split('/')[0];
        }

        $(function () {
            $('#' + Id.id).datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd/mm/yy',
                maxDate: 0,
                minDate:new Date(Rece_date),
                numberOfMonths: 1,
            });
        });
    },

    //Function to validate Product
    fnValidateUser: function (Id, rowId) {
        var regions = Dispatch.defaults.Region_List;
        var Region_Name = $('#' + Id).val();
        if (Region_Name != "") {
            var i = "false";
            var s = "";

            for (var o = 0; o < regions.length; o++) {
                if (regions[o].label == Region_Name) {
                    i = "true";
                    s = regions[o].value
                }
            }
            if (i == "false") {
                $("#hdnuser_" + rowId).val(0);
                $("#hdnusermain_" + rowId).val(0);
            } else {
                $("#hdnuser_" + rowId).val(s);
            }
        } else {
            $("#hdnuser_" + rowId).val(0);
            $("#hdnusermain_" + rowId).val(0);
        }
    },

    fnValidateNumber: function (Id, evt) {

        if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
            return false;
        } else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43||evt.shiftKey==true || evt.keyCode==187 || evt.keyCode==189) {
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
        } else if (evt.keyCode == 46 || evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
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
    fnCancel: function () {
        $('#dispatchform').hide();
        $("#tbldisbody").empty();
        RowArray = [];
    },


    fnGetUserTree: function (userCode) {
        debugger;
        if (userCode != '') {
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Master/PurchaseRequisition/GetActiveUsers",
                data: "userCode=" + userCode + "&includeOneLevelParent=NO",
               // async: false,
                success: function (resp) {
                    console.log(resp);
                    User_List=resp;
                    var UserList = "["
                    for (var i = 0; i < resp.length; i++) {
                        UserList += "{label:" + '"' + "" + resp[i].User_Name + "" + '",' + "value:" + '"' + "" + resp[i].User_Code + "" + '"' + "" + '",' + "Region_Code:" + '"' + "" + resp[i].Region_Code + "" + '"' + "}";
                        if (i < resp.length - 1) {
                            UserList += ',';
                        }
                    }
                    UserList += "]";
                    Dispatch.defaults.User_List = eval(UserList);
                }
            });
        }
    },
    //Funciton to Add New Row
    fnAddRow: function (rowid, Id) {
        debugger;
        if (rowid != '') {
            $('#imgadd_' + rowid).hide();
            $('#imgremove_' + rowid).show();

        }
        if (Id.id != "" && Id.id != undefined) {
            Dispatch.fnCreatedDisptachRow(Id);
        }
    },
    //Function to Remove Row
    fnRemoveRow: function (value) {
        debugger;
        $('#tblrowData_' + value).remove();
    },

    fnSaveDispatchDetailsForm: function () {
        debugger;
        var result = Dispatch.fnValidateDisptach();
        var DisArray = [];
        if (result == true) {
           
            $('#tbldisbody tr').each(function (index, obj) {
                debugger;
                var rowid = obj.id.replace('tblrowData_', '');

                var UserCode = $('#hdnusermain_' + rowid).val();
                if ($('#txtUser_' + rowid).val() != "") {
                    if (UserCode != "" && UserCode != undefined) {

                        var remarks = $('#txtremarks_' + rowid).val();
                        var Dis_Date = $('#txtDD_' + rowid).val();
                        var Challan_Num = $('#txtChallan_' + rowid).val();
                        if (Dis_Date != "" && Dis_Date != undefined) {
                            Dis_Date = Dis_Date.split('/')[2] + '/' + Dis_Date.split('/')[1] + '/' + Dis_Date.split('/')[0];
                        }
                        var quantity = $('#txtQty_' + rowid).val();
                        var ObjDispatch = {
                            Receipt_Id: Receipt_Id,
                            Challan_Number: Challan_Num,
                            User_Code: UserCode,
                            Remarks: remarks,
                            Dispatch_Date: Dis_Date,
                            Quantity: quantity,
                        };
                        DisArray.push(ObjDispatch);
                    }
                }
            });            
            if (DisArray.length >= 1) {
                $.ajax({
                    type: "POST",
                    url: "../HiDoctor_Master/PurchaseRequisition/InsertDispatchDetails",
                    data: JSON.stringify({ "lstDispatch": DisArray }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (resp) {
                        if (resp == "True") {
                            Dispatch.fnCancel();
                            Dispatch.fnGetAllReceiptstoDispatch();
                            Dispatch.fnGetAllChallanNumbers();
                            fnMsgAlert('success', 'Purchase Dispatch', 'Successfully Dispatched.');
                            return false;
                        }
                        else {
                            Dispatch.fnCancel();
                            Dispatch.fnGetAllReceiptstoDispatch();
                            Dispatch.fnGetAllChallanNumbers();
                            fnMsgAlert('success', 'Purchase Dispatch', 'Failed to Disptah.Please try after sometime.');
                            return false;

                        }
                    }
                });
            }
        }
    },

    fnValidateDisptach: function () {
        debugger;
        var flag = true;
        var condt = false;
        var Quantity = '';
        var disjson = jsonPath(Receipts_List, "$.[?(@.Receipt_Id=='" + Receipt_Id + "')]");
        var Challan_Array = new Array();
        var DisArray = new Array();
        var UserArrary = new Array();
        $('#tbldisbody tr').each(function (index, obj) {
            debugger;
            var rowId = obj.id.replace('tblrowData_', '');
            var row_Length = $('.RowData').length;
            if (row_Length == 1) {
                if ($('#txtUser_' + rowId).val() == "") {
                    fnMsgAlert('info', 'Purchase Dispatch', 'Please Select atleast one user for Disptach.');
                    flag = false;
                    return;
                }
            }
            if (row_Length >= 1) {
                if ($('#txtUser_' + rowId).val() != "") {
                    if ($('#hdnuser_' + rowId).val() == 0) {
                        fnMsgAlert('info', 'Purchase Dispatch', 'Please Select Valid Region to Dispatch.');
                        flag = false;
                        return;
                    }
                    if ($('#hdnuser_' + rowId).val() != 0) {
                        UserArrary.push($('#hdnuser_' + rowId).val())
                    }
                    if ($('#txtQty_' + rowId).val() == "") {
                        fnMsgAlert('info', 'Purchase Dispatch', 'Please Enter Quantity.');
                        flag = false;
                        return;
                    }
                    if ($('#txtQty_' + rowId).val() == 0) {
                        fnMsgAlert('info', 'Purchase Dispatch', 'Please Enter Valid Quantity other than Zero(0).');
                        flag = false;
                        return;
                    }
                    if ($('#txtQty_' + rowId).val() != "" && $('#txtQty_' + rowId).val() != 0 && $('#txtQty_' + rowId).val() != undefined) {
                        Quantity = Number(Quantity) + Number($('#txtQty_' + rowId).val());
                    }

                    if ($('#txtChallan_' + rowId).val() == 0) {
                        fnMsgAlert('info', 'Purchase Dispatch', 'Please Enter Valid Challan Number other than Zero(0).');
                        flag = false;
                        return;
                    }
                    if ($('#txtChallan_' + rowId).val() != "" && $('#txtChallan_' + rowId).val() != undefined && $('#txtChallan_' + rowId).val()!=0) {
                        Challan_Array.push($('#txtChallan_' + rowId).val());
                    }
                    if ($('#txtChallan_' + rowId).val() != "" && $('#txtChallan_' + rowId).val() != undefined && $('#txtChallan_' + rowId).val() != 0) {
                        var result = Dispatch.fnValidateObjective($('#txtChallan_' + rowId).val());
                        if (result == false) {
                            fnMsgAlert('info', 'Place Order', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Challan Number.');
                            flag = false;
                            return;
                        }
                    }

                    if ($('#txtChallan_' + rowId).val() != "" && $('#txtChallan_' + rowId).val() != undefined && $('#txtChallan_' + rowId).val() != 0) {
                        for (var i = 0; i < Challans_List.length; i++) {
                            if (Challans_List[i].Challan_Number.toUpperCase() == $('#txtChallan_' + rowId).val().toUpperCase()) {
                                condt = true;
                            }
                        }
                        if (condt == true) {
                            fnMsgAlert('info', 'Purchase Dispatch', 'Please Enter different Challan Number.System already contains the challan number entered.');
                            flag = false;
                            return;
                        }
                    }
                   
                    if ($('#txtremarks_' + rowId).val() != "") {
                        var result = Dispatch.fnValidateObjective($('#txtremarks_' + rowId).val());
                        if (result == false) {
                            fnMsgAlert('info', 'Purchase Dispatch', 'Only (a-z A-Z 0-9 (){}[]@\/.,-_:;!?) special characters are allowed in Remarks.');
                            flag = false;
                            return;
                        }
                    }
                    if ($('#txtDD_' + rowId).val() == "") {
                        fnMsgAlert('info', 'Purchase Dispatch', 'Please Select Dispatch Date.');
                        flag = false;
                        return;
                    }
                  

                }
            }
            if ($('#txtChallan_' + rowId).val() != "" && $('#txtChallan_' + rowId).val() != undefined && $('#txtChallan_' + rowId).val() != 0 && $('#hdnusermain_' + rowId).val() != "" && $('#hdnusermain_' + rowId).val() != undefined) {
                var Dispatch_Challan = $('#hdnusermain_' + rowId).val() + '_' + $('#txtChallan_' + rowId).val();
                DisArray.push(Dispatch_Challan);
            }
            if (flag == false) {
                return flag;
            }
        });

       
        if (disjson.length >= 1) {
            var pending_quantity = disjson[0].Quantity - disjson[0].Dispatched_Quantity;
            if (Quantity > pending_quantity) {
                fnMsgAlert('info', 'Purchase Dispatch', 'Sum of Dispatch Quantity Should not exceed the Balance Quantity.');
                flag = false;
                return;
            }
        }
        if (Challan_Array.length > 1) {
            Challan_Array.sort(function (a, b) { return a - b });
            var result = Dispatch.fnValidateChallanNumber(Challan_Array);
            if (result == true) {
                fnMsgAlert('info', 'Purchase Dispatch', 'Please Enter Unique Challan Number.');
                flag = false;
                return;
            }
        }
        if (DisArray.length > 1) {
            DisArray.sort(function (a, b) { return a - b });
            var result = Dispatch.fnValidateChallanNumber(DisArray);
            if (result == true) {
                fnMsgAlert('info', 'Purchase Dispatch', 'User and Challan Number can not be repeated.Please enter only once.');
                flag = false;
                return;
            }
        }
        if (UserArrary.length == 0) {
            fnMsgAlert('info', 'Purchase Dispatch', 'Please Enter Atleast One Region to Dispatch.');
            flag = false;
            return;
        }
        return flag;
    },
    fnGetAllChallanNumbers:function(){
        debugger;
        $.ajax({
            type:"GET",
            url:"../HiDoctor_Master/PurchaseRequisition/GetAllChallans",
            async:false,
            success:function(resp){
                Challans_List=resp;
            }
        });
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
    fnCheckForUsers: function (Id,rowId) {
        debugger;
        Dispatch.fnValidateUser(Id, rowId);
        var regionCode = '';
        var content = '';
        var sel_user = $("#hdnusermain_" + rowId).val();
        if (sel_user == 0) {


            var users = User_List;
            if (Id != "" && Id != undefined) {
                regionCode = $("#hdnuser_" + rowId).val();
            }
            if (regionCode != "" && regionCode != undefined && regionCode!=0) {
                var userlist = jsonPath(users, "$.[?(@.Region_Code=='" + regionCode + "')]");
                if (userlist.length == 1) {
                    $("#hdnusermain_" + rowId).val(userlist[0].User_Code);
                    $("#UserName_" + rowId).html(userlist[0].User_Name);
                }
                else if (userlist == false || userlist==undefined) {
                    $('#txtUser_' + rowId).val('');
                    $("#hdnusermain_" + rowId).val(0);
                    $("#hdnuser_" + rowId).val(0);
                    fnMsgAlert('info', 'Purchase Dispatch', 'The Selected Region is Vacant.Please Select different Region or Map Active user to this Region.');
                    return false;
                }
                else {
                    for (var i = 0; i < userlist.length; i++) {
                        content += '<input type="radio" name="user" onclick="Dispatch.fnBindUsermultiple(\'' + userlist[i].User_Code + '\',\'' + rowId + '\',\'' + userlist[i].User_Name + '\');" value="' + userlist[i].User_Code + '">  <span id="rdbtnId_' + i + '">' + userlist[i].User_Name + '</span></br>';
                    }
                    $('#UserListBody').html(content);
                    $('#UserList').modal('show');
                }
            }
        }
    },
    fnBindUsermultiple: function (usercode, rowid,username) {
        debugger;
        if (usercode != "" && usercode != undefined) {
            $("#hdnusermain_" + rowid).val(usercode);
            $("#UserName_" + rowid).html(username);
        }
        $('#UserList').modal('hide');
        fnMsgAlert('info', 'Purchase Dispatch', 'The User has been Selected for Dispatch for this Region.');
        return false;
        
    },
    fnValidateChallanNumber: function (myArray) {
        debugger;
        for (var i = 0; i < myArray.length; i++) {
            for (var j = i + 1; j < myArray.length; j++) {
                if (myArray[i] == myArray[j]) {
                    return true; // means there are duplicate values
                }
            }
        }
        return false; // means there are no duplicate values.
    }
}