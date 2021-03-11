var regionjson = "";
var lstunderregion = "";
var lstregclass = "";
var lstexpgrp = '';
var Statelst = "";
var citylst = "";
var lstregtype = "";
var Depot_Name = "";
var Depot_Code = "";
var regionlst = '';
var RegionDetails = '';
var prefillglobalDataOnGo_g = "";
var lstregtype_all = '';
var PrimaryDivision = [];
var PDivision = '';
var KI_RegionMigration = {
    CompanyCode: '',
    regionCode: '',
    RegionName: '',
    RegionTypeCode: '',
    UnderRegionCode: '',
    Effective_From: '',
    Effective_To: '',
    RegionStatus: '',
    RegionClassification: '',
    divisionCode: '',
    Row_Version_No: '',
    Region_Classification_Code: '',
    Under_Region_Id: '',
    Seq_index: '',
    Full_index: '',
    Region_Id: '',
    Display_Order: '',
    Region_Local_Area: '',
    Region_City: '',
    Region_State: '',
    Region_Country: '',
    Region_Latitude: '',
    Region_Longitude: '',
    UserCode: '',
    Mode: '',
}
var DivisionCode_g = ""

function fngetregions() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Master/RegionCreation/GetAllRegions',
        data: "",
        success: function (resp) {
            regionlst = resp;
            //if (regionlst.length > 0 && regionlst != null && regionlst != '') {
            //    var regionname = "[";
            //    for (var i = 0; i < regionlst.length; i++) {
            //        regionname += "{label:" + '"' + "" + regionlst[i].Region_Name + "" + '",' + "value:" + '"' + "" + regionlst[i].Region_Code + "" + '"' + "}"
            //        if (i < regionlst.length - 1) {
            //            regionname += ",";
            //        }
            //    }
            //    regionname += "]";
            //    regionjson = eval('(' + regionname + ')');
            //    autoComplete(regionjson, "regiontxt", "hdnregcode", "regioncls");

            var regionlist = [];
            for (var i = 0; i < regionlst.length; i++) {
                _objData = {};
                _objData.id = regionlst[i].Region_Code;
                _objData.label = regionlst[i].Region_Name
                regionlist.push(_objData);
            }
            RegionDetails = regionlist;
            var valueArr = [];
            // valueArr.push(regionlist[0].label);
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: regionlist,
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                fields: { text: 'label', value: 'id' },
                placeholder: 'Select a Region',
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    e.updateData(regionlist, dropdown_query);
                }
            });
            atcObj.appendTo('#regiontxt');
        },
    });
}
function fnValidateRegionAutoFill(Id) {
    debugger;
    var RegionName = $('#' + Id.id).val();
    if (RegionName != "" && RegionDetails.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < RegionDetails.length; o++) {
            if (RegionDetails[o].label == RegionName) {
                i = true;
                s = RegionDetails[o].value;
            }
        }
        if (!i) {
            $("#hdnregcode").val(0);
        }
        else {
            $("#hdnregcode").val(s);
        }
    } else {
        $("#hdnregcode").val(0);
    }
}




function fngetregiontypes() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Master/RegionCreation/GetAllRegiontype',
        data: "",
        success: function (resp) {
            lstregtype = resp;
            //var content = '';
            //content += '<option value = "">--Choose Region Type--</option>'
            if (lstregtype.length > 0) {
                var lstRegionTypes = [];
                for (var i = 0; i < lstregtype.length; i++) {
                    var _obj = {
                        label: lstregtype[i].Region_Type_Name,
                        id: lstregtype[i].Region_Type_Code
                    }
                    lstRegionTypes.push(_obj);
                }
                $('#dvRegionType').empty();
                $('#dvRegionType').html('<input id="regtype" style="" placeholder="--Select a Region Type --" />');
                var atcObj = new ej.dropdowns.DropDownList({
                    //set the data to dataSource property
                    dataSource: lstRegionTypes,
                    filterBarPlaceholder: 'Search',
                    showClearButton: true,
                    allowFiltering: true,
                    fields: { text: 'label', value: 'id' },
                    placeholder: 'Select a Region Type',
                    filtering: function (e) {
                        var dropdown_query = new ej.data.Query();
                        dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                        e.updateData(lstRegionTypes, dropdown_query);
                    }
                });
                atcObj.appendTo('#regtype');
                //for (var b = 0; b < lstregtype.length; b++) {
                //    content += "<option value=" + lstregtype[b].Region_Type_Code + ">" + lstregtype[b].Region_Type_Name + "</option>";
                //}
                //$("#regtype").html(content);
            }
        },
    });
}
function fngetunderregions() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Master/RegionCreation/GetAllUnderRegions',
        data: "",
        success: function (resp) {
            lstunderregion = resp;
            //var content = '';
            //content += '<option value = "">--Choose one Under Region --</option>'
            if (lstunderregion.length > 0) {
                var lstUnderRegions = [];
                for (var i = 0; i < lstunderregion.length; i++) {
                    var _obj = {
                        label: lstunderregion[i].Region_Name,
                        id: lstunderregion[i].Region_Code + '/' + lstunderregion[i].Region_id
                    }
                    lstUnderRegions.push(_obj);
                }
                $('#dvUnderRegion').empty();
                $('#dvUnderRegion').html('<input id="underreg" style="" placeholder="--Select a Under Region --" />');
                var atcObj = new ej.dropdowns.DropDownList({
                    //set the data to dataSource property
                    dataSource: lstUnderRegions,
                    filterBarPlaceholder: 'Search',
                    showClearButton: true,
                    allowFiltering: true,
                    fields: { text: 'label', value: 'id' },
                    placeholder: 'Select a Under Region',
                    change: fnGetRegionTypeByUnderRegionChange,//function () {  }
                    filtering: function (e) {
                        var dropdown_query = new ej.data.Query();
                        dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                        e.updateData(lstUnderRegions, dropdown_query);
                    }
                });
                atcObj.appendTo('#underreg');
            }
        },
    });
}
function fnGetRegionTypeByUnderRegionChange(args) {
    if (args.isInteracted && args.itemData != null) {
        fngetregiontype();
    } else {
        return true;
    }
}
function fnprefillregdata() {
    debugger;

    var regioncode = $('select[name="regiontxt"]').val();
    if ($("#regiontxt").val() == '' || $("#regiontxt").val() == null || $("#regiontxt").val() == undefined) {

        $("#regname").val('');
        $('#DDlDivision').val('');
        $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
        $("#DDlDivision").multiselect({
            noneSelectedText: '-Select Division-'
        }).multiselectfilter();
        $("#DDlDivision").multiselect().multiselectfilter();
        //$("#underreg option").remove();
        //$("#regtype option").remove();
        //$("#regclass option").remove();
        //$("#expgrp option").remove();
        //$("#state option").remove();
        //$("#city option").remove();
        $("#country").val('');
        $("#lclarea").val('');
        $("#refkey1").val('');
        $("#refkey2").val('');
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select a region');
        return false;
    }
    else {
        var regionlist = $.grep(regionlst, function (element, index) {
            return element.Region_Name == $("#regiontxt").val();
        });
        if (regionlist.length > 0) {
            $.blockUI();
            $.ajax({
                type: 'GET',
                url: '../HiDoctor_Master/RegionCreation/GetRegionDetails',
                data: "regioncode=" + regioncode,
                success: function (resp) {
                    fnbindprefilldata(resp);
                },
            });
        }
        else {
            fnMsgAlert('info', 'Region Creation Wizard', 'Enter valid region name');
            return false;
        }
    }

}
function fngetdivisions() {
    debugger;

    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetDivisions',
        type: "GET",
        success: function (resp) {
            divlist = resp;
            if (resp != undefined && resp.length > 0) {
                var content = '';
                if (resp.length == 1) {
                    content += "<option value=" + resp[0].Division_Code + ">" + resp[0].Division_Name + "</option>";
                    $("#DDlDivision").html(content);
                    $("#DDlDivision").multiselect("widget").find(":checkbox[value='" + resp[0].Division_Code + "']").attr("checked", "checked");
                    $("#DDlDivision option[value='" + resp[0].Division_Code + "']").attr("selected", true);
                }
                else {
                    for (var i = 0; i < resp.length; i++) {
                        content += "<option value=" + resp[i].Division_Code + ">" + resp[i].Division_Name + "</option>";
                    }
                    $("#DDlDivision").html(content);
                }

            }
            $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
            $("#DDlDivision").multiselect({
                noneSelectedText: '-Select Division-'
            }).multiselectfilter();
        },
    });
    $.unblockUI();
}
function fngetdepo() {
    debugger;
    var Company_code = CompanyCode;
    $.blockUI();
    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetDepo',
        type: "GET",
        data: "CompanyCode=" + CompanyCode,
        success: function (resp) {
            fndepdetails(resp);
            //debugger;
            //if (resp != undefined && resp.length > 0) {
            //    var content = '';
            //    if (resp.length == 1) {
            //        content += "<option value=" + resp[0].Depot_Code + ">" + resp[0].Depot_Name + "</option>";
            //        $("#Depomap").html(content);
            //        $("#Depomap").multiselect("widget").find(":checkbox[value='" + resp[0].Depot_Code + "']").attr("checked", "checked");
            //        $("#Depomap option[value='" + resp[0].Depot_Code + "']").attr("selected", true);
            //        //fngetunderregiondetails();
            //    }
            //    else {
            //        for (var i = 0; i < resp.length; i++) {
            //            content += "<option value=" + resp[i].Depot_Code + ">" + resp[i].Depot_Name + "</option>";
            //        }
            //        $("#Depomap").html(content);
            //    }
            //}
            //$("#Depomap").multiselect("destroy").multiselect().multiselectfilter();
            ////$("#Depomap").multiselect({
            ////    noneSelectedText: '-Select deport-'
            //})//.multiselectfilter();

        }
    });
    $.unblockUI();
}
function fndepdetails(resp) {
    debugger;
    var ctcontent = '';
    $('#dvdepo').empty();
    $('#dvdepo').html('<input id="Depomapping" style="" placeholder="Select a City" />');

    var lst = [];
    for (var i = 0; i < resp.length; i++) {
        var _objData = {};
        _objData.id = resp[i].Depot_Code;
        _objData.label = resp[i].Depot_Name;
        lst.push(_objData);
    }
    var checkList = new ej.dropdowns.MultiSelect({
        //set the data to dataSource property
        dataSource: lst,
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        mode: 'CheckBox',
        showClearButton: true,
        allowFiltering: true,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Select depo Mapping',


        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(lst, dropdown_query);
}
        
    });
    checkList.appendTo('#Depomapping');
    //}
}
function fnValidateDivisionSelection() {
    var divisionCode = "";
    var isValid = true;
    $('select#DDlDivision > option:selected').each(function () {
        divisionCode += $(this).val() + ',';
    });
    divisionCode = divisionCode.slice(0, -1);
    divisionName = "";
    $('select#DDlDivision > option:selected').each(function () {
        divisionName += $(this).text() + ',';
    });
    divisionName = divisionName.slice(0, -1);
    if ($("#DDlDivision").val() == 0 || $("#DDlDivision").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select atleast one division.');
        isValid = false;
        return isValid;
    }
    return isValid;
}
function fngetunderregiondetails() {
    debugger;
    var result = fnValidateDivisionSelection();
    $('#Pdivision_hidden').html('');
    if (result) {
        divisionCode = "";
        $('select#DDlDivision > option:selected').each(function () {
            divisionCode += $(this).val() + ',';
          
        });
        divisionCode = divisionCode.slice(0, -1);
        divisionName = "";
        $('select#DDlDivision > option:selected').each(function () {
            divisionName += $(this).text() + ',';
        });
        divisionName = divisionName.slice(0, -1);
        $.ajax({
            type: 'GET',
            async: false,
            url: '../Hidoctor_Master/RegionCreation/GetUnderRegions',
            data: "divisionName=" + divisionName + "&divisionCode=" + divisionCode,
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                lstunderregion = resp;
                fnbindunderreg(lstunderregion);
            },
        });
    } else {
        fngetunderregions();
    }
}

function fnbindunderreg(lstunderregion) {
    debugger;
    var content = '';
    //content += '<option value = "">--Choose one Under Region --</option>'
    //for (var i = 0; i < lstunderregion.length; i++) {
    //    content += '<option value = ' + lstunderregion[i].Region_Code + '/' + lstunderregion[i].Region_id + '>' + lstunderregion[i].Region_Name + '</option>'
    //}
    //$("#underreg").html(content);
    var lstUnderRegions = [];
    for (var i = 0; i < lstunderregion.length; i++) {
        var _obj = {
            label: lstunderregion[i].Region_Name,
            id: lstunderregion[i].Region_Code + '/' + lstunderregion[i].Region_id
        }
        lstUnderRegions.push(_obj);
    }
    $('#dvUnderRegion').empty();
    $('#dvUnderRegion').html('<input id="underreg" style="" placeholder="--Select a Under Region --" />');
    var atcObj = new ej.dropdowns.DropDownList({
        //set the data to dataSource property
        dataSource: lstUnderRegions,
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        allowFiltering: true,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Select a Under Region',
        //change: fnGetRegionTypeByUnderRegionChange,
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(lstUnderRegions, dropdown_query);
        }
    });
    atcObj.appendTo('#underreg');
}
function fngetregiontype() {
    if ($('select[name="underreg"]').val() != '' && $('select[name="underreg"]').val() != undefined && $('select[name="underreg"]').val() != null) {
        var underregion = $('select[name="underreg"]').val().split('/');
        underregion = underregion[0];
    }
    if (underregion != null && underregion != undefined && underregion != '') {
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Master/RegionCreation/GetRegionType',
            data: "Underregioncode=" + underregion,
            success: function (resp) {
                lstregtype_all = resp
                fnbinddetails(resp);
            },
        });
    } else {
        fngetregiontypes();
    }

}
function fnbinddetails(lstregtype_all) {
    debugger;
    var content = "";
    // jsData = eval('(' + jsData + ')');
    //content += '<option value = "">--Choose Region type --</option>'
    if (lstregtype_all.length > 0) {
        var lstRegionTypes = [];
        for (var i = 0; i < lstregtype_all.length; i++) {
            var _obj = {

                id: lstregtype_all[i].Region_Type_Code,
                label: lstregtype_all[i].Region_Type_Name,
            }
            lstRegionTypes.push(_obj);
        }
        if (prefillglobalDataOnGo_g != "" && prefillglobalDataOnGo_g.lstregdetails.length > 0) {
            var disjson=$.grep(lstRegionTypes,function(ele,index){
                return ele.id == prefillglobalDataOnGo_g.lstregdetails[0].Region_Type_Code;
            });
            if (disjson != null && disjson.length == 0) {
                var _obj = {

                    id: prefillglobalDataOnGo_g.lstregdetails[0].Region_Type_Code,
                    label: prefillglobalDataOnGo_g.lstregdetails[0].Region_Type_Name,
                }
                lstRegionTypes.push(_obj);
            }
           
        }
        $('#dvRegionType').empty();
        $('#dvRegionType').html('<input id="regtype" style="" placeholder="--Select a Region Type --" />');
        var atcObj = new ej.dropdowns.DropDownList({
            //set the data to dataSource property
            dataSource: lstRegionTypes,
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Select a Region Type',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(lstRegionTypes, dropdown_query);
            }
        });
        atcObj.appendTo("#regtype");
        var lst = $.grep(lstregtype_all, function (v) {
            return v.ActiveRegion_Type == "Active";
        });
        if (lst != null && lst.length > 0) {
            var msObject = document.getElementById("regtype").ej2_instances[0];
            msObject.value = lst[0].Region_Type_Code;
        }
    }
    else {
        var lstRegionTypes = [];
        if (prefillglobalDataOnGo_g != "" && prefillglobalDataOnGo_g.lstregdetails.length > 0) {
            var _obj = {

                id: prefillglobalDataOnGo_g.lstregdetails[0].Region_Type_Code,
                label: prefillglobalDataOnGo_g.lstregdetails[0].Region_Type_Name,
            }
            lstRegionTypes.push(_obj);
        } else {
            lstRegionTypes = [];
        }
        $('#dvRegionType').empty();
        $('#dvRegionType').html('<input id="regtype" style="" placeholder="--Select a Region Type --" />');
        var atcObj = new ej.dropdowns.DropDownList({
            //set the data to dataSource property
            dataSource: lstRegionTypes,
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Select a Region Type',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(lstRegionTypes, dropdown_query);
            }
        });
        atcObj.appendTo("#regtype");

    }
    //else {
    //    $("#regtype").html(content);
    //}
}
function fngetregclass() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/RegionCreation/GetRegionClass',
        data: "",
        success: function (resp) {
            lstregclass = resp
            fnbindregionclass(resp);
        },
    });
}
function fnbindregionclass(lstregclass) {
    content = "";
    debugger;
    //jsData = eval('(' + jsData + ')');
    content += '<option value = "">--Choose Region Classification--</option>'
    var lstRegionClassification = [];
   
        $('#dvRegionClassifi').empty();
        $('#dvRegionClassifi').html('<input id="regclass"  style="" placeholder="--Choose a Region Classification--" autocomplete="off" />');
        if (lstregclass.length > 0) {
        for (var i = 0; i < lstregclass.length; i++) {
            var _obj = {
                id: lstregclass[i].Region_Classification_Code,
                label: lstregclass[i].Region_Classification_Name
            };
            lstRegionClassification.push(_obj);
        }
    }
        var atcObj = new ej.dropdowns.DropDownList({
            //set the data to dataSource property
            dataSource: lstRegionClassification,
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Select a Region Classification',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(lstRegionClassification, dropdown_query);
            }
        });
        atcObj.appendTo('#regclass');
        //for (var a = 0; a < lstregclass.length; a++) {
        //    content += "<option value=" + lstregclass[a].Region_Classification_Code + ">" + lstregclass[a].Region_Classification_Name + "</option>";
        //}
        //$("#regclass").html(content);
    
}
function fngetexpgrp() {
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/RegionCreation/GetExpenseGroup',
        data: "",
        success: function (resp) {
            lstexpgrp = resp
            fnbindexpgrp(resp);
        },
    });
}
function fnbindexpgrp(lstexpgrp) {
    content = "";
    // jsData = eval('(' + jsData + ')');
    //content += '<option value = "">--Choose Expense Group Name--</option>'
 
        $('#dvExpenseGrp').empty();
        $('#dvExpenseGrp').html('<input id="expgrp" style="" placeholder="--Select a Expense Group--" />');
        var lstExpenseGroups = [];
        if (lstexpgrp.length > 0) {
            for (var i = 0; i < lstexpgrp.length; i++) {
                var _obj = {
                    id: lstexpgrp[i].Expense_Group_Id,
                    label: lstexpgrp[i].Expense_Group_Name
                };
                lstExpenseGroups.push(_obj);
            }
        }
        var atcObj = new ej.dropdowns.DropDownList({
            //set the data to dataSource property
            dataSource: lstExpenseGroups,
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Select a Expense Group',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(lstExpenseGroups, dropdown_query);
            }
        });
        atcObj.appendTo('#expgrp');
        //for (var z = 0; z < lstexpgrp.length; z++) {
        //    content += "<option value=" + lstexpgrp[z].Expense_Group_Id + ">" + lstexpgrp[z].Expense_Group_Name + "</option>";
        //}
        //$("#expgrp").html(content);
}

function fnGetStateDetails() {
    debugger;

    $.ajax({
        type: "Get",
        url: '../Hidoctor_Master/User/GetStateDetails',
        data: '',
        async: false,
        success: function (resp) {
            debugger;
            Statelst = resp;
            fnbindstate(resp);
        },
    });
}
function fnbindstate(Statelst) {
    debugger;
    var content = '';
    content += '<option value = "">--Choose State--</option>'
    if (Statelst.length > 0) {
        $('#dvStates').empty();
        $('#dvStates').html('<input id="state" style="" placeholder="--Select a state--" autocomplete="off" />');
        var lstStates = [];
        for (var i = 0; i < Statelst.length; i++) {
            var _obj = {};
            _obj.id = Statelst[i].State_ID;
            _obj.label = Statelst[i].State_Name;
            lstStates.push(_obj);
        }
        var atcObj = new ej.dropdowns.DropDownList({
            //set the data to dataSource property
            dataSource: lstStates,
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Select State',
            change: fnOnChangeState,
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(lstStates, dropdown_query);
            }
        });
        atcObj.appendTo('#state');
        //for (var i = 0; i < Statelst.length; i++) {

        //    content += '<option value = ' + Statelst[i].State_ID + '>' + Statelst[i].State_Name + '</option>'
        //}

    }
    //$("#state").html(content);
}
function fnOnChangeState(args) {
    if (args.isInteracted && args.itemData != null) {
        fngetcities();
    } else {
        return true;
    }
}
function fngetcities() {
    debugger;

    var stateID = $('select[name="state"]').val();
    if (stateID == "") {
        var ctcontent = '';
        ctcontent += '<option value = "">--Choose City--</option>';
        $("#city").html(ctcontent);
    } else {
        $.ajax({
            type: 'Get',
            url: '../Hidoctor_Master/User/GetCitiesDetails',
            data: "State_Id=" + stateID + "",
            success: function (resp) {
                citylst = resp;
                fnbindcity(resp);
            }
        });
    }

}
function fnbindcity(resp) {
    debugger;
    var ctcontent = '';

    //ctcontent += '<option value = "">--Choose City--</option>';
    if (resp.length > 0) {
        $('#dvCities').empty();
        $('#dvCities').html('<input id="city" style="" placeholder="--Select a City--" autocomplete="off" />');
        var lstCities = [];
        for (var i = 0; i < resp.length; i++) {
            var _obj = {};
            _obj.id = resp[i].City_ID;
            _obj.label = resp[i].City_Name;
            lstCities.push(_obj);
        }
        var atcObj = new ej.dropdowns.DropDownList({
            //set the data to dataSource property
            dataSource: lstCities,
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Select City',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(lstCities, dropdown_query);
            }
        });
        atcObj.appendTo('#city');
        //    for (var i = 0; i < resp.length; i++) {
        //        ctcontent += '<option value = ' + resp[i].City_Id + '>' + resp[i].City_Name + '</option>'
        //    }
    }
    //$("#city").html(ctcontent);
}
function fnbindprefilldata(resp) {
    debugger;
    prefillglobalDataOnGo_g = resp;
    var underregioncode = resp.lstregdetails[0].Under_Region_Code;
    var underregionname = resp.lstregdetails[0].Under_Region_Name;
    var underregionid = resp.lstregdetails[0].Under_Region_Id;
    if (resp.lstregdivddetails.length > 0) {
        var selectcolumn = '';
        var jsonresult = resp.lstregdivddetails;

        for (var i = 0; i < divlist.length; i++) {
            selectcolumn += "<option  value=" + divlist[i].Division_Code + ">" + divlist[i].Division_Name + "</option>";
        }
        $("#DDlDivision").html(selectcolumn);
        for (var g = 0; g < resp.lstregdivddetails.length; g++) {
            $("#DDlDivision").multiselect("widget").find(":checkbox[value='" + resp.lstregdivddetails[g].Division_Code + "']").attr("checked", "checked");
            $("#DDlDivision option[value='" + resp.lstregdivddetails[g].Division_Code + "']").attr("selected", true);
        }
        $('#DDlDivision').multiselect("destroy").multiselect().multiselectfilter();

        $("#DDlDivision").multiselect("destroy").multiselect().multiselectfilter();
        $("#DDlDivision").multiselect({
            noneSelectedText: '-Select Division-'
        }).multiselectfilter();
    }
    if (resp.lstActiveCount[0].Active_Count == "0") {
        $('#divNotionalTerritory').show();
    }
    else {
        $('#divNotionalTerritory').hide();
    }
    if (resp.lstregdetails.length > 0) {
        $("#regname").val(resp.lstregdetails[0].Region_Name);
        fngetunderregiondetails();
        if (resp.lstregdetails[0].Under_Region_Code != null && resp.lstregdetails[0].Under_Region_Code != '' && resp.lstregdetails[0].Under_Region_Code != undefined) {
            //var content = '';

            //content += '<option value = ' + underregioncode + '/' + underregionid + '>' + underregionname + '</option>'

            //for (var i = 0; i < lstunderregion.length; i++) {
            //    if (lstunderregion[i].Region_Code != Under_Region_Code) {
            //        content += '<option value = ' + lstunderregion[i].Region_Code + '/' + lstunderregion[i].Region_id + '>' + lstunderregion[i].Region_Name + '</option>'
            //    }
            //}
            //$("#underreg").html(content);

            var msObject = document.getElementById("underreg").ej2_instances[0];
            msObject.value = underregioncode + '/' + underregionid;
            var valueUnderRegionCode = underregioncode + '/' + underregionid
            fngetregiontypeEdit(valueUnderRegionCode);
        } else {
            fngetunderregiondetails();
        }
        if (resp.lstregdetails[0].Region_Type_Name != null && resp.lstregdetails[0].Region_Type_Name != undefined && resp.lstregdetails[0].Region_Type_Name != '') {
            //var content = '';

            //content += '<option value = ' + resp.lstregdetails[0].Region_Type_Code + '>' + resp.lstregdetails[0].Region_Type_Name + '</option>'
            //for (var b = 0; b < lstregtype.length; b++) {
            //    if (lstregtype[b].Region_Type_Code != resp.lstregdetails[0].Region_Type_Code) {
            //        content += '<option value=' + lstregtype[b].Region_Type_Code + ">" + lstregtype[b].Region_Type_Name + '</option>';
            //    }
            //}
            //$("#regtype").html(content);

            var msObject = document.getElementById("regtype").ej2_instances[0];
            msObject.value = resp.lstregdetails[0].Region_Type_Code;

        }

        if (resp.lstregdetails[0].Region_Classification_Code != null && resp.lstregdetails[0].Region_Classification_Code != '' && resp.lstregdetails[0].Region_Classification_Code != undefined) {
            //var content = '';
            //content += '<option value = ' + resp.lstregdetails[0].Region_Classification_Code + '>' + resp.lstregdetails[0].Region_Classification_Name + '</option>'
            //for (var a = 0; a < lstregclass.length; a++) {
            //    if (resp.lstregdetails[0].Region_Classification_Code != lstregclass[a].Region_Classification_Code) {
            //        content += "<option value=" + lstregclass[a].Region_Classification_Code + ">" + lstregclass[a].Region_Classification_Name + "</option>";
            //    }
            //}
            //$("#regclass").html(content);
            var msObject = document.getElementById("regclass").ej2_instances[0];
            msObject.value = resp.lstregdetails[0].Region_Classification_Code;
        } else {
            fngetregclass();
        }

        if (resp.lstregdetails[0].Expense_Group_Id != null && resp.lstregdetails[0].Expense_Group_Id != '' && resp.lstregdetails[0].Expense_Group_Id != undefined) {
            //var content = '';
            //content += '<option value = ' + resp.lstregdetails[0].Expense_Group_Id + '>' + resp.lstregdetails[0].Expense_Group_Name + '</option>'
            //for (var z = 0; z < lstexpgrp.length; z++) {
            //    if (lstexpgrp[z].Expense_Group_Id != Expense_Group_Id) {
            //        content += "<option value=" + lstexpgrp[z].Expense_Group_Id + ">" + lstexpgrp[z].Expense_Group_Name + "</option>";
            //    }
            //}
            //$("#expgrp").html(content);
            var msObject = document.getElementById("expgrp").ej2_instances[0];
            msObject.value = resp.lstregdetails[0].Expense_Group_Id;
        } else {
            fngetexpgrp();
        }

        if (resp.lstregdetails[0].Region_State != '' && resp.lstregdetails[0].Region_State != null && resp.lstregdetails[0].Region_State != undefined) {
            //var content = '';
            //content += '<option value = ' + resp.lstregdetails[0].State_Id + '>' + resp.lstregdetails[0].Region_State + '</option>'
            //for (var i = 0; i < Statelst.length; i++) {
            //    if (Statelst[i].State_ID != Stateid) {
            //        content += '<option value = ' + Statelst[i].State_ID + '>' + Statelst[i].State_Name + '</option>'
            //    }
            //}
            //$("#state").html(content);
            var msObject = document.getElementById("state").ej2_instances[0];
            msObject.value = parseInt(resp.lstregdetails[0].State_Id);
            fngetcitiesEdit(parseInt(resp.lstregdetails[0].State_Id));
        }
        else {
            //fnbindstate(Statelst);
            fnGetStateDetails();
        }
        if (resp.lstregdetails[0].Region_City != '' && resp.lstregdetails[0].Region_City != null) {
            //var content = '';
            //content += '<option value = ' + resp.lstregdetails[0].City_Id + '>' + resp.lstregdetails[0].Region_City + '</option>'
            //for (var i = 0; i < citylst.length; i++) {
            //    if (citylst[i].City_Id != Cityid) {
            //        content += '<option value = ' + citylst[i].City_Id + '>' + citylst[i].City_Name + '</option>'
            //    }
            //}
            //$("#city").html(content);
            var msObject = document.getElementById("city").ej2_instances[0];
            msObject.value = parseInt(resp.lstregdetails[0].City_Id);
        }
        else {
            fnbindcity(citylst);
        }
        if (resp.lstDepoDetails.length > 0) {
            var lstarr = [];
            var disjson =resp.lstDepoDetails
              
            if (disjson.length > 0) {
                for (var j = 0; j < disjson.length; j++) {
                    lstarr.push(disjson[j].Depot_Code);
                }
                var msObject = document.getElementById("Depomapping").ej2_instances[0];
                msObject.value = lstarr;
            }

        }
      
        //if (resp.lstDepoDetails.length > 0) {
        //   // fngetdepo();
        //    for (var i = 0; i < resp.lstDepoDetails.length; i++) {

        //        if (resp.lstDepoDetails[i].Depot_Name != undefined && resp.lstDepoDetails[i].Depot_Name != null && resp.lstDepoDetails[i].Depot_Name != '') {
                   

        //            var msObject = document.getElementById("Depomapping").ej2_instances[0];
        //            msObject.text = resp.lstDepoDetails[i].Depot_Name;
        //        }
        //    }
        //}
        else {
            fngetdepo();
        }
        PDivision = resp.lstregdetails[0].Division_Code;
        $("#country").val(resp.lstregdetails[0].Region_Country);
        $("#lclarea").val(resp.lstregdetails[0].Region_Local_Area);
        $("#refkey1").val(resp.lstregdetails[0].Ref_Key1);
        $("#refkey2").val(resp.lstregdetails[0].Ref_Key2);
        //$("#Depomapping").val(resp.lstDepoDtails[0].Depot_Name);
        if (resp.lstregdetails[0].Sync_Made == "1") {
            $("#notionalTerritory").attr('checked', true);
        }
    }
    $.unblockUI();
}
function fnBack() {
    debugger;
    $.blockUI();
    $('#main').load('HiDoctor_Master/RegionCreation/RegionCreation');
    $.unblockUI();
}

function fncloseprimary() {
    if ($('#Pdivision_hidden').val() == '' || $('#Pdivision_hidden').val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Select Primary Division');
        return false;
    }
    else {
        PDivision = $('#Pdivision_hidden').val();
        $('#PrimaryDivision').modal('hide')
      //  fnsubmit();
    }
}
function fngetprimarydivisionEdit() {
    if ($("select[name='regiontxt']").val() == '' || $("select[name='regiontxt']").val() == null || $("select[name='regiontxt']").val() == undefined) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter Region Name');
        return false;
    }

    if ($("select[name='underreg']").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter the Under Region Name');
        return false;
    }
    if ($("select[name='regtype']").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter the Region Type');
        return false;
    }
    if ($("#DDlDivision").val() == 0 || $("#DDlDivision").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select atleast one Division.');
        return false;
    }
    if ($("#country").val() != '' && $("#country").val() != null && $("#country").val() != undefined) {
        if (regExforAlphaNumeric($("#country").val()) == false || $.isNumeric($("#country").val()) == true) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Special Characters are not allowed in country');
            return false;
        }
    }
    if ($("#lclarea").val() != '' && $("#lclarea").val() != null && $("#lclarea").val() != undefined) {
        if (regExforAlphaNumeric($("#lclarea").val()) == false || $.isNumeric($("#lclarea").val()) == true) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Special Characters are not allowed in Local Area');
            return false;
        }
    }
    PrimaryDivision = [];
    $('select#DDlDivision > option:selected').each(function () {
        var obj = {};
        obj.Division_Code = $(this).val();
        obj.Division_Name = $(this).html();
        PrimaryDivision.push(obj);
    });
    if (PrimaryDivision.length > 1) {
        if ($('#Pdivision_hidden').val() == '' || $('#Pdivision_hidden').val() == null) {
            //divlist
            $('#Pd').html('');
            $('#Pd').html('<div id="Pdivision"></div>');
            var atcObj = new ej.dropdowns.DropDownList({
                //set the data to dataSource property
                dataSource: PrimaryDivision,
                filterBarPlaceholder: 'Search',
                showClearButton: true,
                allowFiltering: true,
                fields: { text: 'Division_Name', value: 'Division_Code' },
                placeholder: 'Select Primary Division'
            });

            atcObj.appendTo('#Pdivision');
            atcObj.value = PDivision;
            $('#PrimaryDivision').modal({
                backdrop: 'static',
                keyboard: false
            })

        }
        else {
            fnsubmit();
        }
    }
    else {
        PDivision = PrimaryDivision[0].Division_Code;
        fnsubmit();
    }

}
function fnsubmit() {
    debugger;
  
    var Region_Name = $("#regname").val();
    var Region_Code = $("select[name='regiontxt']").val();
    var duplicate_Status = "";
    //checking for duplicate region
    duplicate_Status = fnCheckDuplicateRegion(Region_Name, Region_Code);
    if ($("select[name='underreg']").val() != '' || $("select[name='underreg']").val() != null) {
        var Under_Region_Code = $("select[name='underreg']").val();
        var URC = Under_Region_Code.split("/")
        Under_Region_Code = URC[0];
        var Under_Region_Id = URC[1];
    }
    var Region_Classification_Code = $("select[name='regclass']").val();
    var Expense_Group_Id = $("select[name='expgrp']").val();
    var Country = $("#country").val();
    var Ref_Key1 = $("#refkey1").val();
    var Ref_Key2 = $("#refkey2").val();
    if ($('select[name="state"]').val() != null) {
        var State = $('select[name="state"]').text();
        var Stateid = $('select[name="state"]').val();
    }
    else {
        State = "";
        Stateid = "";
    }
    if ($('select[name="city"]').val() != null) {
        var City = $('select[name="city"]').text();
    }
    else {
        City = "";
    }
    Local_Area = $("#lclarea").val();
    var divisionCode = "";

    $('select#DDlDivision > option:selected').each(function () {
        divisionCode += $(this).val() + ',';
    });
    divisionCode = divisionCode.slice(0, -1);
    DivisionCode_g = divisionCode;
    var divisionName = "";
    //var Depot_Name = $("select[name='Depomapping']").text();
   // var Depot_Code = $("select[name='Depomapping']").val();
     Depot_Code = $("select[name='Depomapping']").val();
    //var arr = []
    //for (var i = 0; i < Depo.length; i++) {
    //    //var obj = {

    //    //    Depot_Code: Depo[i].val,

    //    //}

    var Depo_Code = "";
    Depo_Code += Depot_Code + ",";

    var Depott_Code = Depo_Code.replace(/,\s*$/, "");
    Depot_Code = Depott_Code;
    var Notional_Territory = "";
    $('select#DDlDivision > option:selected').each(function () {
        divisionName += $(this).text() + ',';
    });
    divisionName = divisionName.slice(0, -1);
    if ($('#notionalTerritory').attr('checked')) {
        Notional_Territory = "1";
    }
    else {
        Notional_Territory = "0";
    }
    debugger;
    if (duplicate_Status != "False") {
        $.blockUI();
        var _objRegionHierarchy = {
            Region_Code: Region_Code,
            Under_Region_Code: Under_Region_Code,
            Region_Type_Code: $("select[name='regtype']").val(),
            Under_Region_Id: Under_Region_Id,
            Region_Classification_Code: Region_Classification_Code,
            Expense_Group_Id: Expense_Group_Id,
            Country: Country,
            State: State,
            City: City,
            Local_Area: Local_Area,
            Ref_Key1: Ref_Key1,
            Ref_Key2: Ref_Key2,
            Depot_Name: Depot_Name,
            Depot_Code: Depot_Code,
            DivisionCode: divisionCode,
            Region_Name: Region_Name,
            Notional_Territory: Notional_Territory,
            Primary_Division:PDivision
        }
        $.ajax({
            url: '../Hidoctor_Master/RegionCreation/EditRegions',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            //data: "Region_Code=" + + "&Under_Region_Code=" + Under_Region_Code + "&Region_Type_Code=" + + "&Under_Region_Id=" + Under_Region_Id +
            //      "&Region_Classification_Code=" + Region_Classification_Code + "&Expense_Group_Id=" + Expense_Group_Id +
            //      "&Country=" + Country + "&State=" + State + "&City=" + City + "&Local_Area=" + Local_Area + "&divisionCode=" + divisionCode + "&Region_Name=" + Region_Name + "&Notional_Territory=" + Notional_Territory,
            data: JSON.stringify({ "_ObjHirearchyChanges": _objRegionHierarchy }),
            success: function (resp) {
                fnKangleRegionIntegrate($("#regname").val(), "EDIT");
                fnUpdateRegionIndex();
                fnUpdateUserIndex();
                $.unblockUI();
                fnMsgAlert('info', 'Region Creation Wizard', 'Region Hierarchy Changed Successfully');
                $('#main').load('HiDoctor_Master/RegionCreation/RegionCreation');
            }
        });
    }
    else {
        fnMsgAlert("info", "Info", "Region Name already exists. Please enter some other Region Name");
        return false;
    }
}

function fnCheckDuplicateRegion(Region_Name, Region_Code) {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../HiDoctor_Master/RegionCreation/CheckDuplicateRegion',
        data: "Region_Name=" + Region_Name + "&Region_Code=" + Region_Code,
        async: false,
        success: function (result) {
            debugger;
            duplicate_Status = result;
        }
    });
    return duplicate_Status;
}

function fnUpdateUserIndex() {
    // $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',//UpdateUserNewIndex
        url: '../HiDoctor_Master/User/UpdateUserNewIndex',
        data: "A",
        success: function (result) {
            if (result != '') {
                if (result.split(':')[0] == "SUCCESS") {
                    //fnMsgAlert('success', 'Success', 'User master updated successfully');
                }
                else {
                    // fnMsgAlert('error', 'error', 'User master updation failed because of ' + result.split(':')[1]);
                }
            }
            else {
                // fnMsgAlert('error', 'error', 'User master updation failed');
            }
        },
        error: function () {
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}
function fnUpdateRegionIndex() {
    // $("#dvAjaxLoad").show();
    $.blockUI();
    $.ajax({
        type: 'POST',//UpdateUserNewIndex
        url: '../HiDoctor_Master/Region/UpdateRegionNewIndex',
        data: "A",
        success: function (result) {
            if (result != '') {
                if (result.split(':')[0] == "SUCCESS") {
                    //  fnMsgAlert('success', 'Success', result.split(':')[1]);
                }
                else {
                    // fnMsgAlert('error', 'error', result.split(':')[1]);
                }
            }
            else {
                //fnMsgAlert('error', 'error', result.split(':')[1]);
            }
        },
        error: function () {
        },
        complete: function () {
            $("#dvAjaxLoad").hide();
            $.unblockUI();
        }
    });
}

function fnKangleRegionIntegrate(Region_Name, mode) {
    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetRegionMigrationDetails',
        data: "Region_Name=" + Region_Name,
        success: function (Region) {
            //KI_RegionMigration
            //var Region = JSON.parse(resp);
            KI_RegionMigration.CompanyCode = Region.CompanyCode
            KI_RegionMigration.regionCode = Region.regionCode
            KI_RegionMigration.RegionName = Region.RegionName
            KI_RegionMigration.RegionTypeCode = Region.RegionTypeCode
            KI_RegionMigration.UnderRegionCode = Region.UnderRegionCode
            KI_RegionMigration.Effective_From = Region.Effective_From
            KI_RegionMigration.Effective_To = Region.Effective_To
            KI_RegionMigration.RegionStatus = Region.RegionStatus
            KI_RegionMigration.RegionClassification = Region.RegionClassification
            KI_RegionMigration.divisionCode = DivisionCode_g.replace(/,/g, "^");
            KI_RegionMigration.Row_Version_No = Region.Row_Version_No
            KI_RegionMigration.Region_Classification_Code = Region.Region_Classification_Code
            KI_RegionMigration.Under_Region_Id = Region.Under_Region_Id
            KI_RegionMigration.Seq_index = Region.Seq_index
            KI_RegionMigration.Full_index = Region.Full_index
            KI_RegionMigration.Region_Id = Region.Region_Id
            KI_RegionMigration.Display_Order = Region.Display_Order
            KI_RegionMigration.Region_Local_Area = Region.Region_Local_Area
            KI_RegionMigration.Region_City = Region.Region_City
            KI_RegionMigration.Region_State = Region.Region_State
            KI_RegionMigration.Region_Country = Region.Region_Country
            KI_RegionMigration.Region_Latitude = Region.Region_Latitude
            KI_RegionMigration.Region_Longitude = Region.Region_Longitude
            KI_RegionMigration.UserCode = Region.Created_By
            KI_RegionMigration.Mode = mode
            KangleIntegration.requestInvoke("UserMigration", "ManageRegionHiDoctor", KI_RegionMigration, "POST");
        },
        error(resp) {
            KangleIntegration.requestInvoke("UserMigration", "ManageRegionHiDoctor", KI_RegionMigration, "POST");
        }
    });
}
function fngetregiontypeEdit(value) {
    if (value != '' && value != undefined && value != null) {
        var underregion = value.split('/');
        underregion = underregion[0];
    }
    if (underregion != null && underregion != undefined && underregion != '') {
        $.ajax({
            type: 'POST',
            async: false,
            url: '../HiDoctor_Master/RegionCreation/GetRegionType',
            data: "Underregioncode=" + underregion,
            success: function (resp) {
                lstregtype_all = resp
                fnbinddetails(resp);
            },
        });
    } else {
        fngetregiontypes();
    }

}

function fngetcitiesEdit(value) {
    debugger;

    if (value == "") {

    } else {
        $.ajax({
            type: 'Get',
            async: false,
            url: '../Hidoctor_Master/User/GetCitiesDetails',
            data: "State_Id=" + value + "",
            success: function (resp) {
                citylst = resp;
                fnbindcity(resp);
            }
        });
    }

}