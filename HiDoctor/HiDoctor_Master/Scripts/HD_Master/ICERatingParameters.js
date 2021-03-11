var ICEParameters = {
    defaults: {
        UserTypeCode: '',
        Questions_AutoComplete: '',
        Count: 0,
        count: 0,
        Dropdown: [],
        Params: [],
        DCount: 0,
        Tcount: 0,
        Qstns_Length: '',
    },
    Init: function () {
        ICEParameters.fnGetAllUserTypes();
    },


    //funtion to get user types
    fnGetAllUserTypes: function () {
        debugger;
        $.ajax({
            url: '../HiDoctor_Master/FeedBack/GetActiveUserTypes',
            type: "GET",
            success: function (resp) {
                ICEParameters.fnBindUserTypesHTML(resp);
            },

        });
    },

    //Binding User types from response
    fnBindUserTypesHTML: function (resp) {
        debugger;
        var content = "";
        content += "<option maxlength='25' value='0'>Please Select User Type</option>";
        if (resp != '' && resp.length > 0) {
            resp = eval(resp);
            for (var i = 0; i < resp.length; i++) {
                content += "<option value='" + resp[i].User_Type_Code + "'>" + resp[i].User_Type_Name + "</option>";
            }
        }
        $('#usertype').html(content);
    },
    fnShowInputs: function (value) {
        debugger;

        if (value == 0) {
            $('#CompParaMain').hide();
            $('#NOQstns').hide();
          
            ICEParameters.defaults.Count = 0;
            ICEParameters.defaults.count = 0;
            ICEParameters.defaults.DCount = 0;
            ICEParameters.defaults.Tcount = 0;
            ICEParameters.defaults.Params = [];
            ICEParameters.defaults.UserTypeCode = value;
            ICEParameters.defaults.Questions_AutoComplete = '';
            ICEParameters.defaults.Dropdown = [];
            fnMsgAlert('info', 'ICE Rating Parmaters', 'Please Select User Type');
            return false;
        }
        else {
            if (value != '' || value != undefined) {
                $('#mapMain').empty();
                ICEParameters.defaults.Count = 0;
                ICEParameters.defaults.count = 0;
                ICEParameters.defaults.DCount = 0;
                ICEParameters.defaults.Tcount = 0;
                ICEParameters.defaults.Params = [];
                ICEParameters.defaults.UserTypeCode = value;
                ICEParameters.defaults.Questions_AutoComplete = '';
                ICEParameters.defaults.Dropdown = [];
                ICEParameters.fnGetQuestions();
                ICEParameters.fnQuestionInputSelect(0);
            }
        }
    },
    fnGetQuestions: function () {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/FeedBack/GetICEQuestions",
            data: "usertypeCode=" + ICEParameters.defaults.UserTypeCode,
            async: false,
            success: function (resp) {

                ICEParameters.defaults.Questions_AutoComplete = resp;
                ICEParameters.defaults.Qstns_Length = resp.length;
            }
        });
    },
    fnQuestionInputSelect: function (val) {
        debugger;
        var content = '';
        var Content='';
        var SelArray = '';
        ICEParameters.defaults.Count = 0;
        ICEParameters.defaults.count = 0;
        ICEParameters.defaults.Dropdown = [];
        if (ICEParameters.defaults.Questions_AutoComplete.length >= 1) {


            if (val != undefined) {
                SelArray = ICEParameters.defaults.Dropdown.indexOf(val);
            }

            if (SelArray == "-1") {


                ICEParameters.defaults.Params.push(val);
                content += '<div id="divid' + val + '" class="Qstnsset">';
                content += '<select class="QstnsDrpdwn"  id="drpdwn' + val + '" onchange="ICEParameters.fnShowParamInputs(this.value,' + val + ');">';
                content += "<option maxlength='25' value='0'>Please Select Competence</option>";
                for (var i = 0; i < ICEParameters.defaults.Questions_AutoComplete.length; i++) {
                    content += "<option title=\"" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "\"   value='" + ICEParameters.defaults.Questions_AutoComplete[i].Question_Id + "'>" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "</option>";
                }
                content += '</select>';
                content += '<i title="Remove Row" class="fa fa-times-circle remove" id="Remove' + val + '" onclick="ICEParameters.fnRemove(' + val + ');"></i>';
                content += '<table id="paramtbl' + val + '" class="tbl_Params"><tbody id="pbody' + val + '"></body></table>';
                content += '</div>';
            } else if (SelArray != '') {
                content += '<div id="divid' + val + '">';
                content += '<select class="QstnsDrpdwn"  id="drpdwn' + val + '" onchange="ICEParameters.fnShowParamInputs(' + val + ');">';
                content += "<option maxlength='25' value='0'>Please Select Competence</option>";
                for (var i = 0; i < ICEParameters.defaults.Questions_AutoComplete.length; i++) {
                    content += "<option title=\"" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "\"  value='" + ICEParameters.defaults.Questions_AutoComplete[i].Question_Id + "'>" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "</option>";
                }
                content += '</select>';
                content += '<i title="Remove Row" class="fa fa-times-circle remove" onclick="ICEParameters.fnRemoveSet(' + val + ');"></i>';
                content += '<table id="paramtbl' + val + '"  class="tbl_Params"><tbody id="pbody' + val + '"></body></table>';
                content += '</div>';
            }
            ICEParameters.defaults.count++;
            Content+='<input type="button" value="Add" class="btn" onclick="ICEParameters.fnAppendQuestionInputs('+ICEParameters.defaults.count+');" id="BtnAdd"/>';
            $('#Addbtn').html(Content);
            $('#Addbtn').hide();
            $('#mapMain').html(content);
            $('#CompParaMain').show();
            $('#NOQstns').hide();
            ICEParameters.fnOptionAdjustment();
        } else {
            $('#CompParaMain').hide();
            $('#NOQstns').show();
        }
    },
    fnShowParamInputs: function (QstnId, dvid) {
        debugger;
        var qstnId = QstnId;
        var dvId = dvid;
        if (QstnId == 0) {
            $('#Addbtn').show(); 
            $('#pbody' + dvId).empty();
            //$('#paramtbl' + dvId).hide();
            $('#Addbtn').hide();
            fnMsgAlert('info', 'ICE Rating Parameters', 'Please select competence to add parameters');
            return false;
        } else {
            $.ajax({
                type: "Get",
                url: "../HiDoctor_Master/FeedBack/GetRatingParamters",
                data: "Question_Id=" + qstnId + "&usertypeCode=" + ICEParameters.defaults.UserTypeCode,
                success: function (resp) {
                    if (resp.length >= 1) {
                        //ICEParameters.defaults.Qstns_Length = resp.length;
                        ICEParameters.fnBindParamInptsWithData(resp, dvId);
                    }
                    else {
                        ICEParameters.fnBindParamInptsWithoutData(dvId);
                    }
                }
            });

        }
    },

    fnBindParamInptsWithData: function (resp, dvid) {
        debugger;
        var content = '';
        ICEParameters.defaults.Count = 0;
        for (var i = 0; i < resp.length; i++) {
            content += '<tr id="tblRow' + dvid + '' + ICEParameters.defaults.Count + '" class="RowData">';
            content += '<td class="param"><textarea maxLength="500" rows="3" class="form-control" placeholder="Rating Description Here..." id="ParamDescr' + dvid + '' + ICEParameters.defaults.Count + '">' + resp[i].Rating_Description + '</textarea><input type="hidden" id="hdnParamId' + dvid + '' + ICEParameters.defaults.Count + '" value="' + resp[i].Parameter_Id + '"></td>';
            content += '<td class="seprtr"><span style="font-size:20px;"><b>-</b></span></td>';
            content += '<td class="pval"><input type="number" class="RtngVal form-control" max="99" min="1" placeholder="Rating Value Here..." id="ParamVal' + dvid + '' + ICEParameters.defaults.Count + '" onkeypress="return ICEParameters.fnValidateRtngValCount(event,' + dvid +','+ ICEParameters.defaults.Count+');" onpaste="return false" value=' + resp[i].Rating_Value + '></td>';
            content += '<td class="minusbtn" id="remove' + dvid + '' + ICEParameters.defaults.Count + '"><i title="Remove Row" id="remove' + dvid + '' + ICEParameters.defaults.Count + '" class="fa fa-times-circle minus" onclick="ICEParameters.fnRemoveRow(' + dvid + ',' + ICEParameters.defaults.Count + ');"></i></td>';
            content += '<td class="plusbtn"><i title="Add Row" class="fa fa-plus-circle add" onclick="ICEParameters.fnAddRow(' + dvid + ',' + ICEParameters.defaults.Count + ');" id="add' + dvid + '' + ICEParameters.defaults.Count + '"></i></td>';
            content += '</tr>';
            ICEParameters.defaults.Count++;
        }
        content += '<tr id="tblRow' + dvid + '' + ICEParameters.defaults.Count + '" class="RowData">';
        content += '<td class="param"><textarea maxLength="500" rows="3" class="form-control" placeholder="Rating Description Here..." id="ParamDescr' + dvid + '' + ICEParameters.defaults.Count + '"></textarea><input type="hidden" id="hdnParamId' + dvid + '' + ICEParameters.defaults.Count + '" value="0"></td>';
        content += '<td class="seprtr"><span style="font-size:20px;"><b>-</b></span></td>';
        content += '<td class="pval"><input type="number" class="RtngVal form-control" max="99" min="1" placeholder="Rating Value Here..." onpaste="return false" onkeypress="return ICEParameters.fnValidateRtngValCount(event,' + dvid +','+ ICEParameters.defaults.Count+');" id="ParamVal' + dvid + '' + ICEParameters.defaults.Count + '"></td>';
        content += '<td class="minusbtn" id="remove' + dvid + '' + ICEParameters.defaults.Count + '"><i title="Remove Row" id="remove' + dvid + '' + ICEParameters.defaults.Count + '" class="fa fa-times-circle minus" onclick="ICEParameters.fnRemoveRow(' + dvid + ',' + ICEParameters.defaults.Count + ');"></i></td>';
        content += '<td class="plusbtn"><i title="Add Row" class="fa fa-plus-circle add" onclick="ICEParameters.fnAddRow(' + dvid + ',' + ICEParameters.defaults.Count + ');" id="add' + dvid + '' + ICEParameters.defaults.Count + '"></i></td>';
        content += '</tr>';
        $('#pbody' + dvid).html(content);
        ICEParameters.fnRatingRestriction();
        var Arry_lngth = ICEParameters.defaults.Params.length;
        if (Arry_lngth != ICEParameters.defaults.Qstns_Length) {
            var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
            var tbl_Tr_Length = $('#divid' + MaxCountArray + ' .tbl_Params tr.RowData').length;
            if (tbl_Tr_Length >= 1) {
                $('#Addbtn').show();
            }
        }
        else if (Arry_lngth == ICEParameters.defaults.Qstns_Length) {
            var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
            $('#Remove' + MaxCountArray).show();
        }
        for (var j = 0; j < resp.length; j++) {
            $('#add' + dvid + j).hide();
            $('#remove' + dvid + j).show();
        }
    },
    fnBindParamInptsWithoutData: function (dvid) {
        debugger;
        var content = '';
        content += '<tr id="tblRow' + dvid + '' + ICEParameters.defaults.Count + '" class="RowData">';
        content += '<td class="param"><textarea maxLength="500" rows="3" class="form-control" placeholder="Rating Description Here..." id="ParamDescr' + dvid + '' + ICEParameters.defaults.Count + '"></textarea><input type="hidden" id="hdnParamId' + dvid + '' + ICEParameters.defaults.Count + '" value="0"></td>';
        content += '<td class="seprtr"><span style="font-size:20px;"><b>-</b></span></td>';
        content += '<td class="pval"><input type="number" onpaste="return false" onkeypress="return ICEParameters.fnValidateRtngValCount(event,' + dvid +','+ ICEParameters.defaults.Count + ');" class="RtngVal form-control" max="99" min="1" placeholder="Rating Value Here..." id="ParamVal' + dvid + '' + ICEParameters.defaults.Count + '"></td>';
        content += '<td class="minusbtn" id="remove' + dvid + '' + ICEParameters.defaults.Count + '"><i title="Remove Row" id="remove' + dvid + '' + ICEParameters.defaults.Count + '" class="fa fa-times-circle minus" onclick="ICEParameters.fnRemoveRow(' + dvid + ',' + ICEParameters.defaults.Count + ');"></i></td>';
        content += '<td class="plusbtn"><i title="Add Row" class="fa fa-plus-circle add" onclick="ICEParameters.fnAddRow(' + dvid + ',' + ICEParameters.defaults.Count + ');" id="add' + dvid + '' + ICEParameters.defaults.Count + '"></i></td>';
        content += '</tr>';
        $('#pbody' + dvid).html(content);
        ICEParameters.fnRatingRestriction();
        var Arry_lngth = ICEParameters.defaults.Params.length;

        if (Arry_lngth != ICEParameters.defaults.Qstns_Length) {
            var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
            var tbl_Tr_Length = $('#divid' + MaxCountArray + ' .tbl_Params tr.RowData').length;
            if (tbl_Tr_Length >= 1) {
                $('#Addbtn').show();
            }
        }
        else if (Arry_lngth == ICEParameters.defaults.Qstns_Length) {
            var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
            // $('#drpdwn' + MaxCountArray).attr('disabled', true);
            $('#Remove' + MaxCountArray).show();
        }
        ICEParameters.defaults.Count++;
    },
    fnAddRow: function (dvid, Nrow) {
        debugger;
        var content = '';
        var nrow = Nrow;
        nrow++;
        $('#add' + dvid + Nrow).hide();
        $('#remove' + dvid + Nrow).show();
        content += '<tr id="tblRow' + dvid + '' + nrow + '" class="RowData">';
        content += '<td class="param"><textarea type="text" rows="3" maxLength="500" class="form-control" placeholder="Rating Description Here..." id="ParamDescr' + dvid + '' + nrow + '"></textarea><input type="hidden" id="hdnParamId' + dvid + '' + nrow + '" value="0"></td>';
        content += '<td class="seprtr"><span><b>-</b></span></td>';
        content += '<td class="pval"><input type="number" onpaste="return false" onkeypress="return ICEParameters.fnValidateRtngValCount(event,' + dvid +','+ nrow + ');" class="RtngVal form-control" max="99" min="1" placeholder="Rating Value Here..." id="ParamVal' + dvid + '' + nrow + '"></td>';
        content += '<td  class="minusbtn" id="remove' + dvid + '' + nrow + '"><i title="Remove Row" id="remove' + dvid + '' + nrow + '" class="fa fa-times-circle minus" onclick="ICEParameters.fnRemoveRow(' + dvid + ',' + nrow + ');"></i></td>';
        content += '<td  class="plusbtn"><i title="Add Row" class="fa fa-plus-circle add" onclick="ICEParameters.fnAddRow(' + dvid + ',' + nrow + ');" id="add' + dvid + '' + nrow + '"></i></td>';
        content += '</tr>';
        //$('#remove' + value + '' + ICEParameters.defaults.Count).show();
        $('#pbody' + dvid).append(content);
        ICEParameters.fnRatingRestriction();
        var Arry_lngth = ICEParameters.defaults.Params.length;        
        if (Arry_lngth != ICEParameters.defaults.Qstns_Length) {
            var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);           
            var tbl_Tr_Length = $('#divid' + MaxCountArray + ' .tbl_Params tr.RowData').length;
            if (tbl_Tr_Length >= 1) {
                $('#Addbtn').show();
            }
        }
        else if (Arry_lngth == ICEParameters.defaults.Qstns_Length) {
            var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
            // $('#drpdwn' + MaxCountArray).attr('disabled', true);
            $('#Remove' + MaxCountArray).show();
        }
    },
    fnAppendQuestionInputs: function (val) {
        debugger;
        var content = '';
        var Content = '';
        var SelArray = '';
        var PVal = val;
        PVal--;
        var QstnId = $('#drpdwn' + PVal + ' :selected').val();
        if (QstnId != '' || QstnId != undefined) {
            $('#drpdwn' + PVal).attr('disabled', true);
            $('#Remove' + PVal).show();
        }
        else if (QstnId == undefined) {
            fnMsgAlert('info', 'ICE Rating Parameters', 'Please select atleast one competence and add one parameter to add next competence');
            return false;
        }
        var Arry_Lngth = ICEParameters.defaults.Params.length;
        if (ICEParameters.defaults.Questions_AutoComplete.length >= 1) {
            if (Arry_Lngth == ICEParameters.defaults.Qstns_Length) {
                $('#Addbtn').hide();
                return false;
            } else {
                if (val != undefined) {
                    SelArray = ICEParameters.defaults.Dropdown.indexOf(val);
                }
                if (SelArray == "-1") {
                    ICEParameters.defaults.Params.push(val);
                    content += '<div id="divid' + val + '" class="Qstnsset">';
                    content += '<select class="QstnsDrpdwn"  id="drpdwn' + val + '" onchange="ICEParameters.fnShowParamInputs(this.value,' + val + ');">';
                    content += "<option maxlength='25' value='0'>Please Select Competence</option>";
                    for (var i = 0; i < ICEParameters.defaults.Questions_AutoComplete.length; i++) {
                        content += "<option title=\"" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "\"  value='" + ICEParameters.defaults.Questions_AutoComplete[i].Question_Id + "'>" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "</option>";
                    }
                    content += '</select>';
                    content += '<i title="Remove Row" class="fa fa-times-circle remove" id="Remove' + val + '" onclick="ICEParameters.fnRemove(' + val + ');"></i>';
                    content += '<table id="paramtbl' + val + '" class="tbl_Params"><tbody id="pbody' + val + '"></body></table>';
                    content += '</div>';
                } else if (SelArray != '') {
                    content += '<div id="divid' + val + '">';
                    content += '<select class="QstnsDrpdwn"  id="drpdwn' + val + '" onchange="ICEParameters.fnShowParamInputs(' + val + ');">';
                    content += "<option maxlength='25' value='0'>Please Select Competence</option>";
                    for (var i = 0; i < ICEParameters.defaults.Questions_AutoComplete.length; i++) {
                        content += "<option title=\"" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "\"   value='" + ICEParameters.defaults.Questions_AutoComplete[i].Question_Id + "'>" + ICEParameters.defaults.Questions_AutoComplete[i].Questions + "</option>";
                    }
                    content += '</select>';
                    content += '<i title="Remove Row" class="fa fa-times-circle remove"  id="Remove' + val + '" onclick="ICEParameters.fnRemoveSet(' + val + ');"></i>';
                    content += '<table id="paramtbl' + val + '"  class="tbl_Params"><tbody id="pbody' + val + '"></body></table>';
                    content += '</div>';
                }
                ICEParameters.defaults.count++;
                val++;
                Content += '<input type="button" value="Add" class="btn" onclick="ICEParameters.fnAppendQuestionInputs(' + val + ');" id="BtnAdd"/>';
                $('#Addbtn').html(Content);
                $('#mapMain').append(content);
                $('#Addbtn').hide();
                $('#CompParaMain').show();
                $('#NOQstns').hide();
                ICEParameters.fnOptionAdjustment();
            }
        }
    },
    fnRemove: function (DvID) {
        debugger;
        var Content = '';
        var MaxCountArray = '';
        var condtn = "-Infinity";
        if (DvID != undefined || DvID != null) {
            $('#divid' + DvID).remove();
            var index = ICEParameters.defaults.Params.indexOf(DvID);
            if (index != "-1") {
                ICEParameters.defaults.Params.splice(index, 1);
            }
            var Arry_Lngth = ICEParameters.defaults.Params.length;
            if (Arry_Lngth != ICEParameters.defaults.Qstns_Length) {
                if (Arry_Lngth == 0) {
                    MaxCountArray = 0;
                } else {
                    var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
                    MaxCountArray++;
                }
            }
            var Dv_Lngth = $('.ICEMainrp div').length;
            if (Dv_Lngth == 1) {
                $('.ICEMainrp div').each(function (index, obj) {
                    var $this = $(this);
                    var Dcount = obj.id.replace("divid", "");
                    $('#drpdwn' + Dcount).attr('disabled', false);
                    $('#Remove' + Dcount).hide();
                });
            }  
            Content += '<input type="button" value="Add" class="btn" onclick="ICEParameters.fnAppendQuestionInputs(' + MaxCountArray + ');" id="BtnAdd"/>';
            $('#Addbtn').html(Content);
            if (Dv_Lngth > 1) {
                var MaxCountArray = Math.max.apply(Math, ICEParameters.defaults.Params);
                var tbl_Length = $('#divid' + MaxCountArray + ' table tr.RowData').length;
                if (tbl_Length == 0) {
                    $('#Addbtn').hide();
                } else {
                    $('#Addbtn').show();
                }
            }           
        }
    },
    fnRemoveRow: function (dvid,rowid) {
        debugger;
        $('#tblRow' + dvid + rowid).remove();        
    },
    fnValidateParameters: function () {
        debugger;
        var flag = true;
        var condt = false;
        var Param_Array = [];
        var dvs_Lngth = $('.ICEMainrp div').length;
        var table_Length = $('.ICEMainrp table tr').length;
        var drpdwn_lngth = $('.ICEMainrp  select').length;
        var div_lngth = $('div .Qstnsset').length;
        if (drpdwn_lngth == 1) {
            var selcted = $('.ICEMainrp  select :selected').val();
            if (selcted == 0 || selcted == undefined) {
                fnMsgAlert('info', 'ICE Rating Parameters', "Please select one competence and one rating value to submit");
                flag = false;
                return;
            }
            else if (dvs_Lngth == 1 && table_Length >= 1) {
                var tablr_tr_Length = $('.ICEMainrp  table.tbl_Params tr.RowData').length;
                if (tablr_tr_Length == 1) {
                    $('.ICEMainrp  table.tbl_Params tr.RowData').each(function (index, obj) {
                        debugger;
                        var PRcount = obj.id.replace("tblRow", "");
                        var rtng_Val = $('#ParamVal' + PRcount).val();
                        var rtng_Descr = $('#ParamDescr' + PRcount).val();
                        var Quid = $('#drpdwn' + PRcount + ' :selected').val();

                        if (rtng_Descr == '' && rtng_Val == '') {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter Rating Description and Rating Value to submit");
                            flag = false;
                            return;
                        }
                        if (rtng_Descr == "" && rtng_Val != "") {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter the Rating Description for the given Rating Value");
                            flag = false;
                            return;
                        }
                        if (rtng_Descr.length != 0 && (rtng_Val == '' || rtng_Val == undefined)) {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter the Rating value for the given Rating Description");
                            flag = false;
                            return;
                        }
                        if (rtng_Descr != "" || rtng_Descr != undefined || rtng_Descr != null) {
                            var result = ICEParameters.fnValidateInputParamters(rtng_Descr);
                            if (result == false) {
                                fnMsgAlert('info', 'ICE Rating Parameters', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the Rating Description");
                                flag = false;
                                return;
                            }
                        }
                        if (rtng_Val != '') {
                            Param_Array.push(rtng_Val);
                        }
                    });
                    if (flag == false) {
                        return flag;
                    } else {


                        Param_Array.sort(function (a, b) { return a - b });
                        var Mtchng_Num = 0;
                        for (var k = 0; k < Param_Array.length; k++) {
                            Mtchng_Num++;
                            if (Mtchng_Num != Param_Array[k]) {
                                condt = true;
                            }
                        }
                        if (condt == true) {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter consecutive Rating Values");
                            flag = false;
                            return;
                        } else if (Param_Array.length >= 1) {
                            var result = ICEParameters.fncheckIfArrayIsUnique(Param_Array);
                            if (result == true) {
                                fnMsgAlert('info', 'ICE Rating Parameters', "Please enter consecutive Rating Values.Dupilcate(s) of Rating values is not allowed");
                                flag = false;
                                return;
                            }
                        }
                    }
                } else {
                    $('.ICEMainrp  table.tbl_Params tr.RowData').each(function (index, obj) {
                        debugger;
                        var PRcount = obj.id.replace("tblRow", "");
                        var rtng_Val = $('#ParamVal' + PRcount).val();
                        var rtng_Descr = $('#ParamDescr' + PRcount).val();
                       
                        //var Quid = $('#drpdwn' + PRcount + ' :selected').val();

                        if (rtng_Descr == "" && rtng_Val != "") {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter the Rating Description for the given Rating Value");
                            flag = false;
                            return;
                        }
                        if (rtng_Descr.length != 0 && (rtng_Val == '' || rtng_Val == undefined)) {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter the Rating value for the given Rating Description");
                            flag = false;
                            return;
                        }
                        if (rtng_Descr != "" || rtng_Descr != undefined || rtng_Descr != null) {
                            var result = ICEParameters.fnValidateInputParamters(rtng_Descr);
                            if (result == false) {
                                fnMsgAlert('info', 'ICE Rating Parameters', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the Rating Description");
                                flag = false;
                                return;
                            }
                        }
                        if (rtng_Val != '') {
                            Param_Array.push(rtng_Val);
                        }
                    });
                    if (flag == false) {
                        return flag;
                    } else {
                        Param_Array.sort(function (a, b) { return a - b });
                        var Mtchng_Num = 0;
                        for (var k = 0; k < Param_Array.length; k++) {
                            Mtchng_Num++;
                            if (Mtchng_Num != Param_Array[k]) {
                                condt = true;
                            }
                        }
                        if (condt == true) {
                            fnMsgAlert('info', 'ICE Rating Parameters', "Please enter consecutive Rating Values");
                            flag = false;
                            return;
                        } else if (Param_Array.length >= 1) {
                            var result = ICEParameters.fncheckIfArrayIsUnique(Param_Array);
                            if (result == true) {
                                fnMsgAlert('info', 'ICE Rating Parameters', "Please enter consecutive Rating Values.Dupilcate(s) of Rating values is not allowed");
                                flag = false;
                                return;
                            }
                        }
                    }
                }
            }
        }
        else if (div_lngth >= 2) {
            var Qstn_Array = [];
            for (var i = 0; i < div_lngth; i++) {
                var Qstn_Id = $('#drpdwn' + i + ' :selected').val();
                Qstn_Array.push(Qstn_Id);
            }
            Qstn_Array.sort(function (a, b) { return a - b });
            if (Qstn_Array.length >= 1) {
                var result = ICEParameters.fncheckIfArrayIsUnique(Qstn_Array);
                if (result == true) {
                    fnMsgAlert('info', 'ICE Rating Parameters', 'Please select different competence to add parameters');
                    flag = false;
                    return;
                }
                else {
                    $('.ICEMainrp div').each(function (index, obj) {
                        debugger;
                        var $this = $(this);
                        var Dcount = obj.id.replace("divid", "");
                        Param_Array = [];
                        var selcted = $('#drpdwn' + Dcount + ' :selected').val();
                        var tbl_tr_Lngth = $('#paramtbl' + Dcount + ' tr').length;
                        if (selcted != 0 || selcted != undefined) {
                            $('#divid' + Dcount + ' .tbl_Params tr.RowData').each(function (index, obj) {
                                debugger;
                                var PRcount = obj.id.replace("tblRow", "");
                                var param = $('#ParamDescr' + PRcount).val();
                                var Rtng_Val = $('#ParamVal' + PRcount).val();
                                if (tbl_tr_Lngth == 1) {
                                    if (param == "" && Rtng_Val == "") {
                                        fnMsgAlert('info', 'ICE Rating Parameters', "Please enter atleast one Rating Description and one Rating Value");
                                        flag = false;
                                        return;
                                    }
                                }
                                if (param == "" && Rtng_Val != "") {
                                    fnMsgAlert('info', 'ICE Rating Parameters', "Please enter the Rating Description for the given Rating Value");
                                    flag = false;
                                    return;
                                }
                                if (param.length != 0 && (Rtng_Val == '' || Rtng_Val == undefined)) {
                                    fnMsgAlert('info', 'ICE Rating Parameters', "Please enter the Rating Value for the given Rating Description");
                                    flag = false;
                                    return;
                                }
                                if (param == "" || param == undefined) {
                                    return false;
                                }
                                else {
                                    var result = ICEParameters.fnValidateInputParamters(param);
                                    if (result == false) {
                                        fnMsgAlert('info', 'ICE Rating Parameters', "Special characters (A-Za-z0-9@.,'(){}[]/\<>?!_-) are allowed in the Rating Description");
                                        flag = false;
                                        return;
                                    }
                                }
                                if (param == "" || param == undefined) {
                                    return false;
                                }
                                else {
                                    var Rtng_Val = $('#ParamVal' + PRcount).val();
                                    if (Rtng_Val != '') {
                                        Param_Array.push(Rtng_Val);
                                    }
                                    else {
                                        fnMsgAlert('info', 'ICE Rating Parameters', "Please enter valid Rating Value(s)(e.g: 1,2,3..).Zero is not allowed in rating value");
                                        flag = false;
                                        return;
                                    }
                                    if (Rtng_Val != undefined) {
                                        var result = ICEParameters.fnValidateNumbers(Rtng_Val);
                                        if (result == false) {
                                            fnMsgAlert('info', 'ICE Rating Parameters', "Numbers only allowed in Rating Value(s)");
                                            flag = false;
                                            return;
                                        }
                                    }
                                }
                            });
                        }
                        debugger;
                        if (flag == false) {
                            return flag;
                        } else {


                            Param_Array.sort(function (a, b) { return a - b });
                            var Mtchng_Num = 0;
                            for (var k = 0; k < Param_Array.length; k++) {
                                Mtchng_Num++;
                                if (Mtchng_Num != Param_Array[k]) {
                                    condt = true;
                                }

                            }
                            if (condt == true) {
                                fnMsgAlert('info', 'ICE Rating Parameters', "Please enter consecutive Rating Values");
                                flag = false;
                                return;
                            } else if (Param_Array.length >= 1) {
                                var result = ICEParameters.fncheckIfArrayIsUnique(Param_Array);
                                if (result == true) {
                                    fnMsgAlert('info', 'ICE Rating Parameters', "Please enter consecutive Rating Values.Dupilcate(s) of Rating values is not allowed");
                                    flag = false;
                                    return;
                                }
                            }
                        }
                    });
                    if (flag == false) {
                        return flag;
                    }
                }
            }
        }
        return flag;
    },
    fnSubmit: function () {
        debugger;
        var result = ICEParameters.fnValidateParameters();
        if (result == true) {
            $.blockUI();
            var RatingParam = new Array();
            $('.ICEMainrp div').each(function (index, obj) {
                var $this = $(this);
                var Dcount = obj.id.replace("divid", "");
                var sltd_QstnId = $('#drpdwn' + Dcount + ' :selected').val();
                if (sltd_QstnId != 0 && sltd_QstnId != undefined) {
                    $('#divid' + Dcount + ' .tbl_Params tr.RowData').each(function (index, obj) {
                        var PRcount = obj.id.replace("tblRow", "");
                        var Rtng_Descr = $.trim($('#ParamDescr' + PRcount).val());
                        var Rtng_Val = $.trim($('#ParamVal' + PRcount).val());
                        var Param_Id = $('#hdnParamId' + PRcount).val();
                        if (Rtng_Descr.length == 0 && Rtng_Val.length == 0) {
                            return false;
                        } else {
                            var ParamObj = {
                                Question_Id: sltd_QstnId,
                                Rating_Description: Rtng_Descr,
                                Rating_Value: Rtng_Val,
                                Parameter_Id: Param_Id,
                            };
                        }
                        RatingParam.push(ParamObj);
                    });
                }
            });
        }
        if (RatingParam.length >= 1) {
            $.ajax({
                type: 'POST',
                url: "../HiDoctor_Master/FeedBack/InsertRatingParameters",
                data: JSON.stringify({ "lstRtngParams": RatingParam, "usertypeCode": ICEParameters.defaults.UserTypeCode}),               
                contentType: 'application/json; charset=utf-8',
                success: function (resp) {
                    if (resp = "True") {
                        $.unblockUI();
                        $('#main').load("./HiDoctor_Master/FeedBack/ICERatingParameters");
                        fnMsgAlert('success', 'ICE Rating Parameters', 'Successfully added parameters');
                        return false;
                    } else {
                        $.unblockUI();
                        $('#main').load("./HiDoctor_Master/FeedBack/ICERatingParameters");
                        fnMsgAlert('error', 'ICE Rating Parameters', 'Failed to add parameters.Please try after sometime');
                        return false;
                    }
                }
            });
        }
    },
    fncheckIfArrayIsUnique: function (myArray) {
        for (var i = 0; i < myArray.length; i++) {
            for (var j = i + 1; j < myArray.length; j++) {
                if (myArray[i] == myArray[j]) {
                    return true; // means there are duplicate values
                }
            }
        }
        return false; // means there are no duplicate values.
    },
    fnValidateInputParamters: function (value) {
        var specialCharregex = new RegExp(/[*&%$^#+=~`""|]/g);
        //var specialCharregex = new RegExp("^[''!@#$%^*?+=|]+$");
        if (specialCharregex.test(value) == true) {
            return false;
        }
        else {
            return true;
        }
    },
    fnValidateNumbers: function (obj) {
        debugger;
        var phoneNumberPattern = /^\d+$/
        if (phoneNumberPattern.test(obj) == false) {
            return false;
        }
        else {
            return true;
        }
    },
    fnOptionAdjustment: function () {
        debugger;
        $('.Qstnsset option').each(function () {
            debugger;
            var text = $(this).text();
         
            if (text.length > 180) {
                $(this).text(text.substr(0, 200) + '…')
            }
        });       
    },
    fnRatingRestriction: function () {
        debugger;
        $(".RtngVal").attr('maxLength', '2');
    },
    fnValidateRtngValCount: function (evt,dvid,count) {
        debugger;
        if (evt.keyCode == 101) {
            return false;
        }
        else if ($("#ParamVal" + dvid + count).val().length >= 2) {
            return false;
        }
    }
}
