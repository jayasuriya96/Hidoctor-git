var lstunderregion = "";
var citylst = "";
var Statelst = "";
var under_region_name = "";
var region_classification = "";
var region_type = "";
var expense_group = "";
var city = "";
var state = "";
var Region_Name = "";
var Under_Region_Code = "";
var Under_Region_Id = "";
var Region_Type_Code = "";
var Region_Classification_Code = "";
var Expense_Group_Id = "";
var Country = "";
var City = "";
var Cityid = "";
var State = "";
var Stateid = "";
var Local_Area = "";
var Ref_Key1 = "";
var Depot_Name = "";
var Depot_Code = "";
var Ref_Key2 = "";
//var id = 0;
var Regionlist = '';
var divlist = '';
var divisionCode = '';
var departcode = '';
var divisionName = '';
var holidayName = '';
var holidayCode = '';
var weekend = "";
var pricegrp = "";
var reglock = "";
var Chemlock = "";
var Effective_From = "";
var Effective_To = "";
var jsData = "";
var lstregclass = "";
var lstexpgrp = "";
var lstregtype = "";
var cpyregion = '';
var cpyregioncode = '';
var PrimaryDivision = [];
var PDivision = '';
var Rvalidate = true;
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

function fnRegionTypeMaster() {
    $("#divPageHeader").html('Region Type Master')
    $('#main').load('../HiDoctor_Master/RegionType/RegionType');
}

function fnRegionClassificationMaster() {
    $("#divPageHeader").html('Region Classification Master')
    $('#main').load('../HiDoctor_Master/RegionCategoryMaster/Create');
}

function fnCityMaster() {
    $("#divPageHeader").html('Employee Master')
    $('#main').load('../HiDoctor_Master/User/Employee');
}

function fnCreateNewRegion() {
    debugger;
    $.blockUI();
    $('#main').load('HiDoctor_Master/RegionCreation/RegionCreationWizard');
    $.unblockUI();
}
function fnDiableRegion() {
    debugger;
    $.blockUI();
    $('#main').load('HiDoctor_Master/RegionCreation/Disableregion');
    $.unblockUI();
}
function fnhierarchy() {
    $.blockUI();
    $('#main').load('HiDoctor_Master/RegionCreation/RegionHierarchy');
    $.unblockUI();
}
function fngetunderregiondetails() {
    debugger;
    divisionCode = "";
    PrimaryDivision = [];
    $('#Pdivision_hidden').html('');
    $('select#division > option:selected').each(function () {
        divisionCode += $(this).val() + ',';
        var obj = {};
        obj.Division_Code = $(this).val();
        obj.Division_Name = $(this).html();
        PrimaryDivision.push(obj);
    });
    divisionCode = divisionCode.slice(0, -1);
    divisionName = "";
    $('select#division > option:selected').each(function () {
        divisionName += $(this).text() + ',';
    });
    divisionName = divisionName.slice(0, -1);
    if ($("#division").val() == 0 || $("#division").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select atleast one division.');
        return false;
    }
    else {
        $.ajax({
            type: 'GET',
            url: '../Hidoctor_Master/RegionCreation/GetUnderRegions',
            data: "divisionName=" + divisionName + "&divisionCode=" + divisionCode,
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                lstunderregion = resp;
                fnbindunderreg(lstunderregion);

            },
        });
    }
}

function fnbindunderreg(lstunderregion) {
    debugger;

    //var content = '';
    //content += '<option value = "">--Choose one Under Region --</option>'
    //for (var i = 0; i < lstunderregion.length; i++) {
    //    content += '<option value = ' + lstunderregion[i].Region_Code + '/' + lstunderregion[i].Region_id + '>' + lstunderregion[i].Region_Name + '</option>'
    //}
    //$("#underreg").html(content);


    var regionlist = [];
    for (var i = 0; i < lstunderregion.length; i++) {
        _objData = {};
        _objData.id = lstunderregion[i].Region_Code + '/' + lstunderregion[i].Region_id
        _objData.label = lstunderregion[i].Region_Name;
        regionlist.push(_objData);
    }
    //if (regionlist.length > 0) {
    RegionDetails = regionlist;
    var valueArr = [];
    // valueArr.push(regionlist[0].label);
    $('#dvUnderRegion').empty();
    $('#dvUnderRegion').html('<input id="underreg" style="" placeholder="--Select a Under Region --" />');
    var atcObj = new ej.dropdowns.DropDownList({
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        allowFiltering: true,
        //set the data to dataSource property
        dataSource: regionlist,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Choose a Under Region Name',
        //change: fngetregiontype,
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(regionlist, dropdown_query);
        }
        //value: valueArr

    });
    atcObj.appendTo('#underreg');
    // }
}
//function fnValidateUserRegionAutoFill(Id) {
//    debugger;
//    var UserRegionName = $('#' + Id.id).val();
//    if (UserRegionName != "" && RegionDetails.length > 0) {
//        var i = false;
//        var s = "";

//        for (var o = 0; o < RegionDetails.length; o++) {
//            if (RegionDetails[o].label == UserRegionName) {
//                i = true;
//                s = RegionDetails[o].value;
//            }
//        }
//        if (!i) {
//            $("#hdnunderregid").val(0);
//        }
//        else {
//            $("#hdnunderregid").val(s);
//        }
//    } else {
//        $("#hdnunderregid").val(0);
//    }
//}


///dpat mapping

//function fngetunderregiondetails() {
//    debugger;
//    departcode = "";
//    PrimaryDivision = [];
//    $('#Pdivision_hidden').html('');
//    $('select#division > option:selected').each(function () {
//        departcode += $(this).val() + ',';
//        var obj = {};
//        obj.Division_Code = $(this).val();
//        obj.Division_Name = $(this).html();
//        PrimaryDivision.push(obj);
//    });
//    departcode = departcode.slice(0, -1);
//    divisionName = "";
//    $('select#division > option:selected').each(function () {
//        divisionName += $(this).text() + ',';
//    });
//    divisionName = divisionName.slice(0, -1);
//    if ($("#division").val() == 0 || $("#division").val() == null) {
//        fnMsgAlert('info', 'Region Creation Wizard', 'Please select atleast one division.');
//        return false;
//    }
//    else {
//        //$.ajax({
//        //    type: 'GET',
//        //    url: '../Hidoctor_Master/RegionCreation/GetUnderRegions',
//        //    data: "divisionName=" + divisionName + "&departcode=" + divisionCode,
//        //    contentType: 'application/json; charset=utf-8',
//        //    success: function (resp) {
//        //        lstunderregion = resp;
//        //        fnbindunderreg(lstunderregion);

//        //    },
//        //});
//    }
//}
function fngetregiontype() {
    debugger;
    $.ajax({
        type: 'POST',
        url: '../HiDoctor_Master/RegionCreation/GetRegionType',
        success: function (resp) {
            lstregtype = resp
            fnbinddetails(resp);
            fnbindholidays();
            cpyregioncode = '';
            cpyregion = '';

        },
    });
}

function fnbinddetails(lstregtype) {
    debugger;
    //var content = "";
    //// jsData = eval('(' + jsData + ')');
    //content += '<option value = "">--Choose Region type --</option>'
    //if (lstregtype.length > 0) {
    //    for (var b = 0; b < lstregtype.length; b++) {
    //        content += "<option value=" + lstregtype[b].Region_Type_Code + ">" + lstregtype[b].Region_Type_Name + "</option>";
    //    }
    //    $("#regtype").html(content);
    //}
    //else {
    //    $("#regtype").html(content);

    var regiontypelist = [];
    for (var i = 0; i < lstregtype.length; i++) {
        _objData = {};
        _objData.id = lstregtype[i].Region_Type_Code;
        _objData.label = lstregtype[i].Region_Type_Name;
        regiontypelist.push(_objData);
    }
    if (regiontypelist.length > 0) {
        RegionDetails = regiontypelist;
        var valueArr = [];
        // valueArr.push(regionlist[0].label);
        $('#dvRegionType').empty();
        $('#dvRegionType').html('<input id="regtype" placeholder="Choose a region type">');
        var atcObj = new ej.dropdowns.DropDownList({
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            //set the data to dataSource property
            dataSource: regiontypelist,
            fields: { text: 'label', value: 'id' },
            placeholder: 'Choose a Region type',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(regiontypelist, dropdown_query);
            }


        });
        atcObj.appendTo('#regtype');
        var lst = $.grep(lstregtype, function (v) {
            return v.ActiveRegion_Type == "Active";
        });
        if (lst != null && lst.length > 0) {
            var msObject = document.getElementById("regtype").ej2_instances[0];
            msObject.value = lst[0].Region_Type_Code;
        }
    }
    else {
        $('#dvRegionType').empty();
        $('#dvRegionType').html('<input id="regtype" placeholder="Choose a region type">');
        var atcObj = new ej.dropdowns.DropDownList({
            filterBarPlaceholder: 'Search',
            showClearButton: true,
            allowFiltering: true,
            //set the data to dataSource property
            dataSource: [],
            fields: { text: 'label', value: 'id' },
            placeholder: 'Choose a Region type',
            filtering: function (e) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                e.updateData(regiontypelist, dropdown_query);
            }


        });
        atcObj.appendTo('#regtype');
    }
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
    debugger;

    //content = "";
    //debugger;
    //content += '<option value = "">--Choose Region Classification--</option>'
    ////jsData = eval('(' + jsData + ')');
    //if (lstregclass.length > 0) {

    //    for (var a = 0; a < lstregclass.length; a++) {
    //        content += "<option value=" + lstregclass[a].Region_Classification_Code + ">" + lstregclass[a].Region_Classification_Name + "</option>";
    //    }
    //    $("#regclass").html(content);
    var regionlist = [];
    for (var i = 0; i < lstregclass.length; i++) {
        _objData = {};
        _objData.id = lstregclass[i].Region_Classification_Code;
        _objData.label = lstregclass[i].Region_Classification_Name;
        regionlist.push(_objData);
    }
    //  if (regionlist.length > 0) {
    //$('#dvRegionClassifi').empty();
    //$('#dvRegionClassifi').html('<input id="regclass"  style="" placeholder="--Choose a Region Classification />');
    classificationDetails = regionlist;
    var valueArr = [];
    // valueArr.push(regionlist[0].label);

    var atcObj = new ej.dropdowns.DropDownList({
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        allowFiltering: true,
        //set the data to dataSource property
        dataSource: regionlist,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Choose Region Classification',
        //value: valueArr
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(regionlist, dropdown_query);
        }
    });
    atcObj.appendTo('#regclass');
    //}
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
    var content = "";
    //    // jsData = eval('(' + jsData + ')');
    //    content += '<option value = "">--Choose Expense Group Name--</option>'
    //    if (lstexpgrp.length > 0) {

    //        for (var z = 0; z < lstexpgrp.length; z++) {
    //            content += "<option value=" + lstexpgrp[z].Expense_Group_Id + ">" + lstexpgrp[z].Expense_Group_Name + "</option>";
    //        }
    //        $("#expgrp").html(content);
    //    }
    //}
    var expenselist = [];
    for (var i = 0; i < lstexpgrp.length; i++) {
        _objData = {};
        _objData.id = lstexpgrp[i].Expense_Group_Id;
        _objData.label = lstexpgrp[i].Expense_Group_Name;
        expenselist.push(_objData);
    }
    //  if (expenselist.length > 0) {
    expenseDetails = expenselist;
    var valueArr = [];
    // valueArr.push(regionlist[0].label);
    var atcObj = new ej.dropdowns.DropDownList({
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        allowFiltering: true,
        //set the data to dataSource property
        dataSource: expenselist,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Choose Expense Group Name',
        //value: valueArr
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(expenselist, dropdown_query);
        }
    });
    atcObj.appendTo('#expgrp');
    //}
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
    //var content = '';
    //content += '<option value = "">--Choose State--</option>'
    //if (Statelst.length > 0) {

    //    for (var i = 0; i < Statelst.length; i++) {

    //        content += '<option value = ' + Statelst[i].State_ID + '>' + Statelst[i].State_Name + '</option>'
    //    }

    //}
    //$("#state").html(content);
    var statelist = [];
    for (var i = 0; i < Statelst.length; i++) {
        _objData = {};
        _objData.id = Statelst[i].State_ID;
        _objData.label = Statelst[i].State_Name;
        statelist.push(_objData);
    }
    //  if (statelist.length > 0) {
    stateDetails = statelist;
    var valueArr = [];
    $('#dvStates').empty();
    $('#dvStates').html('<input id="state" style="" placeholder="--Select a state--"  />');
    // valueArr.push(regionlist[0].label);
    var atcObj = new ej.dropdowns.DropDownList({
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        allowFiltering: true,
        //set the data to dataSource property
        dataSource: statelist,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Choose State',
        change: fngetcities,
        //value: valueArr
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(statelist, dropdown_query);
        }
    });
    atcObj.appendTo('#state');
    //}
}


function fngetcities() {
    debugger;

    var stateID = $("select[name='state']").val();
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
    //if (resp.length > 0) {
    //    for (var i = 0; i < resp.length; i++) {
    //        ctcontent += '<option value = ' + resp[i].City_Id + '>' + resp[i].City_Name + '</option>'
    //    }
    //}
    //$("#city").html(ctcontent);
    // if (resp.length > 0) {
    $('#dvCities').empty();
    $('#dvCities').html('<input id="city" style="" placeholder="Select a City" />');

    var lstCities = [];
    for (var i = 0; i < resp.length; i++) {
        var _objData = {};
        _objData.id = resp[i].City_ID;
        _objData.label = resp[i].City_Name;
        lstCities.push(_objData);
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
    //}
}
function fngetdivisions() {
    debugger;

    $.blockUI();
    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetDivisions',
        type: "GET",
        success: function (resp) {
            divlist = resp;
            debugger;
            if (resp != undefined && resp.length > 0) {
                var content = '';
                if (resp.length == 1) {
                    content += "<option value=" + resp[0].Division_Code + ">" + resp[0].Division_Name + "</option>";
                    $("#division").html(content);
                    $("#division").multiselect("widget").find(":checkbox[value='" + resp[0].Division_Code + "']").attr("checked", "checked");
                    $("#division option[value='" + resp[0].Division_Code + "']").attr("selected", true);
                    fngetunderregiondetails();
                }
                else {
                    for (var i = 0; i < resp.length; i++) {
                        content += "<option value=" + resp[i].Division_Code + ">" + resp[i].Division_Name + "</option>";
                    }
                    $("#division").html(content);
                }
            }
            $("#division").multiselect("destroy").multiselect().multiselectfilter();
            $("#division").multiselect({
                noneSelectedText: '-Select Division-'
            }).multiselectfilter();

        }
    });
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
        // fnNext1();
    }
}

///Depo mappind
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
    $('#dvdepo').html('<input id="Depomap" style="" placeholder="Select Depo Mapping" />');

    var lst = [];

    for (var i = 0; i < resp.length; i++) {
        var _objData = {};
        _objData.id = resp[i].Depot_Code;
        _objData.label = resp[i].Depot_Name;
        lst.push(_objData);
    }

    //var checkBoxatcObj = new ej.dropdowns.DropDownList({
        var checkList = new ej.dropdowns.MultiSelect({
        //set the data to dataSource property
        dataSource: lst,
        filterBarPlaceholder: 'Search',
        showClearButton: true,
        mode: 'CheckBox',
        allowFiltering: true,
        fields: { text: 'label', value: 'id' },
        placeholder: 'Select depo Mapping',

        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(lst, dropdown_query);
        }
    });
        checkList.appendTo('#Depomap');
    //}
}
function fngetprimarydivision() {
    Rvalidate = fnvalidate(Regionlist);
    if (PrimaryDivision.length > 1) {
        //divlist
        if ($('#Pdivision_hidden').val() == '' || $('#Pdivision_hidden').val() == null) {
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
            $('#PrimaryDivision').modal({
                backdrop: 'static',
                keyboard: false
            })
        }
        else {
            fnNext1();
        }

    }
    else {
        PDivision = PrimaryDivision[0].Division_Code;
        fnNext1();
    }
}
function fnNext1() {
    debugger;

    if (Rvalidate == true) {

        under_region_name = $("select[name='underreg']").text(); //$('#underreg option:selected').text();
        if ($("select[name='regclass']").text() != '--Choose Region Classification--') {
            region_classification = $("select[name='regclass']").text();
        }
        else {
            region_classification = "";
        }
        region_type = ($("select[name='regtype']")).text();  //$('#regtype option:selected').text();
        if ($("select[name='expgrp']").text() != '--Choose Expense Group Name--') {
            expense_group = $("select[name='expgrp']").text();
        } else {
            expense_group = "";
        }
        if ($("select[name='state']").text() != '--Choose State--') {
            State = $("select[name='state']").text();
            Stateid = $("#state").val();
        }
        else {
            State = "";
            Stateid = "";
        }
        if ($("select[name='city']").text() != '--Choose City--' && $("select[name='city']").text() != 'Choose city') {
            City = $("select[name='city']").text();
        }
        else {
            City = "";
        }
        if ($("select[name='Depomap']").val() != '--Choose Depo Mapping--' && $("select[name='Depomap']").val() != 'Choose Depo Mapping') {
            Depot_Code = $("select[name='Depomap']").val();
            //var arr = []
            //for (var i = 0; i < Depo.length; i++) {
            //    //var obj = {

            //    //    Depot_Code: Depo[i].val,
                    
            //    //}

                var Depo_Code ="";
                Depo_Code += Depot_Code + ",";
               
                var Depott_Code = Depo_Code.replace(/,\s*$/, "");
                Depot_Code = Depott_Code;
            //}
        //    Depot_Name

     
        //depo = arr;
    }
    else {
            Depot_Code = "";
    }
    var underregcode = $('select[name="underreg"]').val().split('/');
    Region_Name = $("#regname").val(),
    Under_Region_Code = underregcode[0],
    Under_Region_Id = underregcode[1],
    Region_Type_Code = $('select[name="regtype"]').val()//$("#regtype").val(),
    //region_Classification = $("#regclass").text(),
    Region_Classification_Code = $('select[name="regclass"]').val(),// $("#regclass").val(),
    Expense_Group_Id = $('select[name="expgrp"]').val(), //$("#expgrp").val(),
    Country = $("#country").val(),

    Cityid = $("#city").val(),
     Depot_Code = Depot_Code,
    Local_Area = $("#lclarea").val()
    Ref_Key1 = $("#refkey1").val()
    Ref_Key2 = $("#refkey2").val()
    var selecteddiv = $(":checkbox:checked").length;

    divisionCode = "";
    $('select#division > option:selected').each(function (){
        divisionCode += $(this).val() + ',';
    });
    divisionCode = divisionCode.slice(0, -1);
    divisionName = "";
    $('select#division > option:selected').each(function () {
        divisionName += $(this).text() + ',';
    });
    divisionName = divisionName.slice(0, -1);
    $("#create").hide();
    $("#Mapping").show();

/// The commented code is not used  ///

    //depomapping = "";
    //$('select#division > option:selected').each(function () {
    //    divisionCode += $(this).val() + ',';
    //});
    //divisionCode = divisionCode.slice(0, -1);
    //divisionName = "";
    //$('select#division > option:selected').each(function () {
    //    divisionName += $(this).text() + ',';
    //});
   


        if (weekend != '' && weekend != null && weekend != undefined) {
            var content = ''
            content += '<option value = "">Choose Weekend</option>'
            content += '<option value = ' + weekend + '>' + weekendname + '</option>'

            for (var i = 0; i < weekendlst.length; i++) {
                if (weekend != weekendlst[i].Weekend_Off_Code) {
                    content += '<option value = ' + weekendlst[i].Weekend_Off_Code + '>' + weekendlst[i].Weekend_Off_Name + '</option>'
                }
            }
            $("#weekendmap").html(content);
            $('#weekendmap').val("");
            $('#weekendmap').val(weekend);
        }
        else if (weekendlst != '' && weekendlst != null && weekendlst.length > 0) {
            fnbindweekend(weekendlst);
        }
        else {
            fngetWeekend();
        }
        if (pricegrp != null && pricegrp != '') {
            var content = ''
            content += '<option value = "">Choose Price Group</option>'
            content += '<option value = ' + pricegrp + '>' + pricegroup + '</option>'

            for (var i = 0; i < pricegrouplst.length; i++) {
                if (pricegrouplst[i].Price_Group_Code != pricegrp) {
                    content += '<option value = ' + pricegrouplst[i].Price_Group_Code + '>' + pricegrouplst[i].Price_Group_Name + '</option>'
                }
            }
            $("#pricegrp").html(content);
            $('#pricegrp').val("");
            $('#pricegrp').val(pricegrp);
        }
        else if (pricegrouplst != null && pricegrouplst != '' && pricegrouplst.length > 0) {
            fnbindpricegroup(pricegrouplst);
        }
        else {
            fngetpricegroup();
        }

        //   $('#weekendmap').val(weekend);
        $("#weekendefto").val(Effective_To);
        $("#weekendeff").val(Effective_From)
        //  $("#pricegrp").val(pricegrp);
        if (reglock == 1) {
            $("#lockcheck").attr("checked", true);
        }
        if (Chemlock == 1) {
            $("#chemcheck").attr("checked", true);
        }
    }
    else {
        return false;
    }

}
function fngetRegions() {
    debugger;
    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetRegions',
        type: "GET",
        success: function (resp) {
            Regionlist = resp;
        }
    });
}
function fnvalidate(resp) {
    debugger;
    var lclregionname = $("#regname").val().toUpperCase();

    for (var i = 0; i < resp.length; i++) {
        var lstregionname = resp[i].Region_Name.toUpperCase();
        if (lstregionname == lclregionname) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Region Name already exists');
            return false;
        }
    }
    if ($("#regname").val() == "") {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter the Region Name');
        return false;
    }
    var region_Name = $("#regname").val();
    if (region_Name.length > 30) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter the Region Name with maximum 30 character');
        return false;
    }
    if (regExforAlphaNumeric(lclregionname) == false) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Special Characters are not allowed for region name');
        return false;
    }
    if ($.isNumeric(lclregionname) == true) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Region Name should not be numeric');
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
    if ($('select#division > option:selected').length <= 0) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please Select Atleast One Division.');
        return false;
    }
    if ($("#division").val() == 0 || $("#division").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select atleast one Division.');
        return false;
    }
    if ($("#country").val() != '' && $("#country").val() != null && $("#country").val() != undefined) {
        if (regExforAlphaNumeric($("#country").val()) == false) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Special Characters are not allowed in country');
            return false;
        }
        if ($.isNumeric($("#country").val()) == true) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Country should not be numeric');
            return false;
        }
    }

    if ($("#lclarea").val() != '' && $("#lclarea").val() != null && $("#lclarea").val() != undefined) {
        if (regExforAlphaNumeric($("#lclarea").val()) == false) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Special Characters are not allowed in Local Area');
            return false;
        }
        if ($.isNumeric($("#lclarea").val()) == true) {
            fnMsgAlert('info', 'Region Creation Wizard', 'Local Area should not be numeric');
            return false;
        }
    }
    return true;
    $("#create").hide();
}
var pricegrouplst = '';
function fngetpricegroup() {
    debugger;
    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetPriceGroup',
        type: "POST",
        success: function (resp) {
            pricegrouplst = resp;
            fnbindpricegroup(resp);
        }
    });
}
function fnbindpricegroup(resp) {
    debugger;
    var content = '';
    if (resp.length > 0) {
        content += '<option value=""> --Choose Price group--</option>'
        for (var i = 0; i < resp.length; i++) {
            content += '<option value = ' + resp[i].Price_Group_Code + '>' + resp[i].Price_Group_Name + '</option>'
        }
        $("#pricegrp").html(content);
    }
}
function fnback2() {
    debugger;
    $.blockUI();
    $("#underreg option").remove();
    $("#regtype option").remove();
    $("#regclass option").remove();
    $("#expgrp option").remove();
    $("#state option").remove();
    $("#city option").remove();
    $("#Depomap option").remove();
    weekend = $('#weekendmap').val();
    weekendname = $('#weekendmap option:selected').text();
    pricegrp = $("#pricegrp").val();
    pricegroup = $('#pricegrp option:selected').text();
    if (($("input[name='lockchk']").prop("checked") == true)) {
        reglock = 1;
    }
    if (($("input[name='chemchk']").prop("checked") == true)) {
        Chemlock = 1;
    }
    Effective_From = $("#weekendeff").val();
    Effective_To = $("#weekendefto").val();
    $("#Mapping").hide();
    $("#create").show();
    $("#regname").val(Region_Name);
    if (lstunderregion.lengh > 0) {
        if (lstunderregion[0].Under_Region_Code != null && lstunderregion[0].Under_Region_Code != '' && lstunderregion[0].Under_Region_Code != undefined) {
            var msObject = document.getElementById("underreg").ej2_instances[0];
            msObject.value = lstregtype[0].Region_Code;
        }
    }
    if (lstregtype.length > 0) {
        if (lstregtype[0].Region_Type_Name != null && lstregtype[0].Region_Type_Name != undefined && lstregtype[0].Region_Type_Name != '') {
            var msObject = document.getElementById("regtype").ej2_instances[0];
            msObject.value = Region_Type_Code;
        }
    }
    if (lstregclass.length > 0) {
        if (lstregclass[0].Region_Classification_Code != null && lstregclass[0].Region_Classification_Code != '' && lstregclass[0].Region_Classification_Code != undefined) {
            var msObject = document.getElementById("regclass").ej2_instances[0];
            msObject.value = Region_Classification_Code;
        }
        else {
            fnbindregionclass(lstregclass);
        }
    }
    if (lstexpgrp.length > 0) {
        if (lstexpgrp[0].Expense_Group_Id != null && lstexpgrp[0].Expense_Group_Id != '' && lstexpgrp[0].Expense_Group_Id != undefined) {
            var msObject = document.getElementById("expgrp").ej2_instances[0];
            msObject.value = Expense_Group_Id;
        }
        else {
            fngetexpgrp();
        }
    }
    if (Statelst.length > 0) {
        if (Statelst[0].State_ID != '' && Statelst[0].State_ID != null) {
            var msObject = document.getElementById("state").ej2_instances[0];
            msObject.value = (parseInt(Statelst.State_ID));
        }
        else {
            fnGetStateDetails();
        }
    }
    if (citylst.length > 0) {
        if (citylst[0].City_ID != '' && citylst[0].City_ID != null) {
            var msObject = document.getElementById("city").ej2_instances[0];
            msObject.value = parseInt(citylst.City_ID);
        }
    }
    else {
        fnbindcity(citylst);
    }
    //if (lstDepoDetails.length > 0) {
    //    if (resp.lstDepoDetails[0].Depot_Name != undefined && resp.lstDepoDetails[0].Depot_Name != null && resp.lstDepoDetails[0].Depot_Name != '') {
    //        var msObject = document.getElementById("Depomap").ej2_instances[0];
    //        msObject.text = resp.lstDepoDetails[0].Depot_Name;

    //    }
    //    else {
    //        fngedepo();
    //    }
    //}
    $("#country").val(Country);
    $("#lclarea").val(Local_Area);
    $.unblockUI();
}
var weekendname = '';
var pricegroup = '';
function fnnext2() {
    debugger;

    var validation = fnvalidatedate();
    if (validation == true) {
        weekend = $('#weekendmap').val();
        weekendname = $('#weekendmap option:selected').text();
        pricegrp = $("#pricegrp").val();
        pricegroup = $('#pricegrp option:selected').text();
        if (($("input[name='lockchk']").prop("checked") == true)) {
            reglock = 1;
        }
        if (($("input[name='chemchk']").prop("checked") == true)) {
            Chemlock = 1;
        }
        Effective_From = $("#weekendeff").val();
        Effective_To = $("#weekendefto").val();
        $(".weekendefto").monthpicker();
        $(".weekendeff").monthpicker();
        $.unblockUI();
        $("#Mapping").hide();

        if (cpyregioncode != '' && cpyregioncode != null && cpyregioncode != undefined) {
            var content = ''
            content += '<option value = ""> --Choose Region --</option>'
            content += '<option value = ' + cpyregioncode + '>' + cpyregion + '</option>'

            for (var i = 0; i < regionholilst.length; i++) {
                if (cpyregioncode != regionholilst[i].Region_Code) {

                    content += '<option value = ' + regionholilst[i].Region_Code + '>' + regionholilst[i].Region_Name + '</option>'
                }
            }
            $("#holireg").html(content);
            $("#holireg").val("");
            $("#holireg").val(cpyregioncode);
        }
        else if (regionholilst != '' && regionholilst != null && regionholilst.length > 0) {
            fnbindholidaylst();
        }
        else {
            fnbindholidaylst();
        }
        $("#Holiday").show();
        // fnbindholidaylst();
        if ($(".holidaytxt").length > 0) {
            return true;
        } else {
            fncopyholidays(rowNumber);
        }

    }
    else {
        return false;
    }
}
function fnvalidatedate() {
    debugger;
    var ttDate = "";
    var TtDate = '';
    var tfDate = '';
    var TfDate = '';
    if ($("#weekendeff").val() != '' && $("#weekendeff").val() != null && $("#weekendeff").val() != undefined) {
        var fromDate = $("#weekendeff").val().split('/')[2] + '/' + $("#weekendeff").val().split('/')[1] + '/' + $("#weekendeff").val().split('/')[0];
    }
    if ($("#weekendefto").val() != '' && $("#weekendefto").val() != null && $("#weekendefto").val() != undefined) {
        var toDate = $("#weekendefto").val().split('/')[2] + '/' + $("#weekendefto").val().split('/')[1] + '/' + $("#weekendefto").val().split('/')[0];
    }
    var startDate = new Date(fromDate);
    var endDate = new Date(toDate);
    if (startDate > endDate) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Effective To date cannot be less than Effective From date.');
        return false;
    }
    else if (startDate == endDate) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Effective From date and Effective To date cannot be same .');
        return false;
    } else if ($("#weekendmap").val() == '' && $("#weekendeff").val() != '' && $("#weekendefto").val() != '') {
        fnMsgAlert('info', 'Region Creation Wizard', 'Choose Weekend');
        return false;
    }
    else if ($("#weekendmap").val() != '' && $("#weekendeff").val() == '' && $("#weekendefto").val() != '') {
        fnMsgAlert('info', 'Region Creation Wizard', 'Enter Effective From month for weekend');
        return false;
    }
    else if ($("#weekendmap").val() != '' && $("#weekendeff").val() != '' && $("#weekendefto").val() == '') {
        fnMsgAlert('info', 'Region Creation Wizard', 'Enter Effective To month for weekend');
        return false;
    }
    else if ($("#weekendmap").val() != '' && $("#weekendeff").val() == '' && $("#weekendefto").val() == '') {
        fnMsgAlert('info', 'Region Creation Wizard', 'Enter Effective From and Effective To month for weekend');
        return false;
    }
    else if ($("#weekendmap").val() == '' && $("#weekendeff").val() != '' && $("#weekendefto").val() == '') {
        fnMsgAlert('info', 'Region Creation Wizard', 'Choose Weekend and enter effective to');
        return false;
    }
    else if ($("#weekendmap").val() == '' && $("#weekendeff").val() == '' && $("#weekendefto").val() != '') {
        fnMsgAlert('info', 'Region Creation Wizard', 'Choose Weekend and enter effective from');
        return false;
    }
    else {
        return true;
    }
}
function fngetWeekend() {
    debugger;
    $.ajax({
        url: '../Hidoctor_Master/RegionCreation/GetWeekends',
        type: "POST",
        success: function (resp) {
            fnbindweekend(resp);
        }
    });
}
var weekendlst = '';
function fnbindweekend(resp) {
    debugger;
    weekendlst = resp;
    var content = '';
    if (resp.length > 0) {
        content += '<option value="">--Choose Weekend--</option>'
        for (var i = 0; i < resp.length; i++) {
            content += '<option value = ' + resp[i].Weekend_Off_Code + '>' + resp[i].Weekend_Off_Name + '</option>'
        }
        $("#weekendmap").html(content);
    }
}
function fnaddnewtextboxes() {
    debugger;
    var content = '';
    // $("#plus_" + id).hide();
    rowNumber = rowNumber + 1;

    content += '<div class="col-sm-12 clearfix rowHoliday" style="margin-top: 12px;"  id="rowData_' + rowNumber + '" >';
    content += '<div class="col-sm-5" style="margin-left: 16px;">';
    content += '<label>Holiday Name</label>';
    content += '<input style="margin-left:12px;" type="text" class="holidaytxt" id="holidayname_' + rowNumber + '"/>';
    content += '</div>';
    content += '<div class="col-sm-5" style="position: relative;right: 174px;">';
    content += '<label>Holiday Date</label>';
    content += '<input style="margin-left:12px;" type="text" class="holidaydate" id="holidaydate_' + rowNumber + '" />';
    content += '<input type="hidden" id="hdnholicode_' + rowNumber + '"/>';
    content += '<span style="margin-left: 20px;">';
    //  content += '<i class="fa fa-plus" aria-hidden="true" onclick="fnaddnewtextboxes(' + rowNumber + ')" id="plus_' + rowNumber + '" style="font-size: 16px;"></i>';
    content += '<i id="remicon_' + rowNumber + '" class="fa fa-times Ndisplay" aria-hidden="true" onclick="fnRemoveToggle(' + rowNumber + ');" style="font-size: 18px;margin-left: 10px;"></i>';
    content += '</span>';
    content += '</div>';
    content += '<div class="col-sm-2">';
    content += '</div>';
    content += '</div>';
    $("#holidayboxes").append(content);

    $(".holidaydate").datepicker({
        dateFormat: 'dd/mm/yy',
        // minDate: new Date(curdate.split('.')[1] + '/' + curdate.split('.')[0] + '/' + curdate.split('.')[2]),
        orientation: 'right bottom'


    });
}

function fnback3() {
    debugger;
    $.blockUI();
    $("#Holiday").hide();
    cpyregion = $("#holireg option:selected").text();
    cpyregioncode = $("#holireg").val();
    $("#Mapping").show();
    if (weekend != '' && weekend != null && weekend != undefined) {
        var content = ''
        content += '<option value = "">--Choose Weekend--</option>'
        content += '<option value = ' + weekend + '>' + weekendname + '</option>'

        for (var i = 0; i < weekendlst.length; i++) {
            if (weekend != weekendlst[i].Weekend_Off_Code) {
                content += '<option value = ' + weekendlst[i].Weekend_Off_Code + '>' + weekendlst[i].Weekend_Off_Name + '</option>'
            }
        }
        $("#weekendmap").html(content);
        $('#weekendmap').val("");
        $('#weekendmap').val(weekend);
    }
    else {
        fnbindweekend(weekendlst);
    }
    if (pricegrp != null && pricegrp != '') {
        var content = ''
        content += '<option value = "">--Choose Price Group--<option>'
        content += '<option value = ' + pricegrp + '>' + pricegroup + '</option>'

        for (var i = 0; i < pricegrouplst.length; i++) {
            if (pricegrouplst[i].Price_Group_Code != pricegrp) {
                content += '<option value = ' + pricegrouplst[i].Price_Group_Code + '>' + pricegrouplst[i].Price_Group_Name + '</option>'
            }
        }
        $("#pricegrp").html(content);
        $('#pricegrp').val("");
        $('#pricegrp').val(pricegrp);
    }
    else {
        fnbindpricegroup(pricegrouplst);
    }

    //   $('#weekendmap').val(weekend);
    $("#weekendefto").val(Effective_To);
    $("#weekendeff").val(Effective_From)
    $("#pricegrp").val(pricegrp);
    if (reglock == 1) {
        $("#lockcheck").attr("checked", true);
    }
    if (Chemlock == 1) {
        $("#chemcheck").attr("checked", true);
    }
    $.unblockUI();
}
var holiday_Array = [];
function fnsumbit() {
    debugger;

    $("#btnSubmit").prop("disabled", true);
    var holidaynames = ''
    var holivalidate = fnvalidateholiday();
    if (holivalidate == true) {
        holidayCode = "";
        holidayName = "";
        var rCntDetails = $('#holidayboxes div.rowHoliday');
        for (var i = 0; i < $(".holidaytxt").length; i++) {
            rowno = rCntDetails[i];
            rowno = rowno.id.split('_')[1];
            if ($("#holidayname_" + rowno + "").val() != '' || $("#holidayname_" + rowno + "").val() != null || $("#holidayname_" + rowno + "").val() != undefined) {
                holidayName += $("#holidayname_" + rowno + "").val() + ',';
            }
        }
        holidayName = holidayName.slice(0, -1);

        for (var i = 0; i < $(".holidaytxt").length; i++) {
            rowno = rCntDetails[i];
            rowno = rowno.id.split('_')[1];
            if ($("#holidaydate_" + rowno + "").val() != null && $("#holidaydate_" + rowno + "").val() != '' && $("#holidaydate_" + rowno + "").val() != undefined) {
                var holidaydate = $("#holidaydate_" + rowno + "").val().split('/');
                var holidaymonth = holidaydate[1].split('/');
                var holidayyear = holidaydate[2];
                var holiday = holidayyear + '-' + holidaymonth + '-' + holidaydate[0];
                holidayCode += holiday + ',';
            }
        }
        //   holidayCode = holidayCode.slice(0, -1);

        var startMonth = fngetMonthNumber($('#weekendeff').val().split('-')[0]);
        var endMonth = fngetMonthNumber($('#weekendefto').val().split('-')[0]);
        var startYear = $('#weekendeff').val().split('-')[1];
        var endYear = $('#weekendefto').val().split('-')[1];
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (Effective_From != null && Effective_From != '' && Effective_From != undefined) {
            var eff_fromdate = '01';
            var eff_frommonth = startMonth;
            var eff_fromyear = startYear;
            var eff_from = eff_fromyear + '-' + eff_frommonth + '-' + eff_fromdate
        }
        else {
            eff_from = '';
        }
        if (Effective_To != null && Effective_To != '' && Effective_To != undefined) {
            var eff_todate = '';
            var eff_tomonth = endMonth;
            var eff_toyear = endYear;
            var eff_to = eff_toyear + '-' + eff_tomonth + '-' + eff_todate
        }
        else {
            eff_to = '';
        }
        if (endMonth == null || endMonth == undefined || endMonth == '') {
            endMonth = '';
        }
        if (endYear == null || endYear == undefined || endYear == '') {
            endYear = '';
        }
        debugger;

        var _objRegionCreation = {
            Region_Name: Region_Name,
            Under_Region_Code: Under_Region_Code,
            Under_Region_Id: Under_Region_Id,
            Region_Type_Code: $("select[name='regtype']").val(),
            region_Classification: region_classification,
            Depot_Code: Depot_Code,
            Region_Classification_Code: Region_Classification_Code,
            Expense_Group_Id: Expense_Group_Id,
            Country: Country,
            State: State,
            City: City,
           
            Local_Area: Local_Area,
            Ref_Key1: Ref_Key1,
            Ref_Key2: Ref_Key2,
           
            Weekend_Code: weekend,
            Price_group_code: pricegrp,
            Region_Lock: reglock,
            Chemist_Lock: Chemlock,
            Effective_From: eff_from,
            Effective_To_Month: endMonth,
            Effective_To_Year: endYear,
            Division_Code: divisionCode,
            Holiday_Code: holidayCode,
            Holiday_Name: holidayName,
            Primary_Division: PDivision
        }
        $.ajax({
            url: '../Hidoctor_Master/RegionCreation/InsertRegions',
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            //data: "Region_Name=" + Region_Name + "&Under_Region_Code=" + Under_Region_Code + "&Under_Region_Id=" + Under_Region_Id + "&Region_Type_Code=" + Region_Type_Code +
            //     "&region_Classification=" + region_classification + "&Region_Classification_Code=" + Region_Classification_Code + "&Expense_Group_Id=" + Expense_Group_Id +
            //      "&Country=" + Country + "&State=" + State + "&City=" + City + "&Local_Area=" + Local_Area + "&Weekend_Code=" + weekend + "&Price_group_code=" + pricegrp + "&Region_Lock=" + reglock + "&Chemist_Lock=" + Chemlock +
            //      "&Effective_From=" + eff_from + "&Effective_To_Month=" + endMonth + "&Effective_To_Year=" + endYear + "&divisionCode=" + divisionCode + "&holiday_Code=" + holidayCode + "&holiday_name=" + holidayName,
            data: JSON.stringify({ "_objCreationChanges": _objRegionCreation }),
            success: function (resp) {
                debugger;

                fnKangleRegionIntegrate($("#regname").val(), "INSERT");
                fnUpdateRegionIndex();
                fnUpdateUserIndex();
                fnMsgAlert('info', 'Region Creation Wizard', 'Region Created Successfully');
                $('#main').load('HiDoctor_Master/RegionCreation/RegionCreation');
                $("#btnSubmit").prop("disabled", false);

            }
        });
    }
    else {
        fnMsgAlert("info", "Info", "Region Name already exists. Please enter some other Region Name");
        return false;
    }
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
//function fnsavemapping() {
//    debugger;
//    $.ajax({
//        url: '../Hidoctor_Master/RegionCreation/SaveMapping',
//        type: "POST",
//        data: "Weekend_Code=" + weekend + "&Price_group_code=" + pricegrp + "&Region_Lock=" + reglock + "&Chemist_Lock=" + Chemlock + "&Region_Type_Code=" + Region_Type_Code + "&Effective_From=" + Effective_From + "&Effective_To=" + Effective_To + "&divisionCode" + divisionCode + "&holiday_Code" + holidayCode + "&holiday_name" + holidayName,
//        success: function (resp) {
//            fnMsgAlert('info', 'Region Creation Wizard', 'Region Created Successfully');
//            $('#main').load('HiDoctor_Master/RegionCreation/RegionCreation');
//        }
//    });
//}
function fnvalidateholiday() {
    debugger;
    var flag = true;
    holidayName = "";
    holiday_Array = [];
    var rCntDetails = $('#holidayboxes div.rowHoliday');
    for (var i = 0; i < $(".holidaytxt").length; i++) {
        rowno = rCntDetails[i];
        rowno = rowno.id.split('_')[1];
        if ($("#holidayname_" + rowno + "").val() != '' || $("#holidayname_" + rowno + "").val() != null || $("#holidayname_" + rowno + "").val() != undefined) {
            holidayName += $("#holidayname_" + rowno + "").val() + ',';
        }
    }
    holidayName = holidayName.slice(0, -1);
    for (var i = 0; i < $(".holidaytxt").length; i++) {
        rowno = rCntDetails[i];
        rowno = rowno.id.split('_')[1];
        if ($("#holidayname_" + rowno + "").val() != '' && $("#holidaydate_" + rowno + "").val() == '') {
            fnMsgAlert('info', 'Region Creation Wizard', 'Enter Holiday date');
            flag = false;
            return;
        }
        else if ($("#holidayname_" + rowno + "").val() == '' && $("#holidaydate_" + rowno + "").val() != '') {
            fnMsgAlert('info', 'Region Creation Wizard', 'Enter Holiday Name');
            flag = false;
            return;
        }
            //else if (holiday_Array.length > 0) {
            //    var result = fncheckIfArrayIsUnique(holiday_Array);
            //    if (result == true) {
            //        fnMsgAlert('info', 'Region Creation Wizard', 'Holiday name has been entered already');
            //        flag = false;
            //        return;
            //    }
            //}
        else {
            flag = true;
        }
    }
    return flag;
}
function fncheckIfArrayIsUnique(myArray) {
    for (var i = 0; i < myArray.length; i++) {
        for (var j = i + 1; j < myArray.length; j++) {
            if (myArray[i] == myArray[j]) {
                return true; // means there are duplicate values
            }
        }
    }
    return false; // means there are no duplicate values.
}
function fngetMonthNumber(monthName) {
    if (monthName.toUpperCase() == "JAN") {
        return 1;
    }
    if (monthName.toUpperCase() == "FEB") {
        return 2;
    }
    if (monthName.toUpperCase() == "MAR") {
        return 3;
    }
    if (monthName.toUpperCase() == "APR") {
        return 4;
    }
    if (monthName.toUpperCase() == "MAY") {
        return 5;
    }
    if (monthName.toUpperCase() == "JUN") {
        return 6;
    }
    if (monthName.toUpperCase() == "JUL") {
        return 7;
    }
    if (monthName.toUpperCase() == "AUG") {
        return 8;
    }
    if (monthName.toUpperCase() == "SEP") {
        return 9;
    }
    if (monthName.toUpperCase() == "OCT") {
        return 10;
    }
    if (monthName.toUpperCase() == "NOV") {
        return 11;
    }
    if (monthName.toUpperCase() == "DEC") {
        return 12;
    }
}
var regionholilst = '';
function fnbindholidaylst() {
    debugger;

    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/Getregionsforholiday',
        data: "Underregion=" + Under_Region_Code,
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            regionholilst = resp;
            var content = "";
            if (resp.length > 0) {
                content += '<option value = "">--Choose Region--</option>'
                for (var z = 0; z < resp.length; z++) {
                    content += "<option value=" + resp[z].Region_Code + ">" + resp[z].Region_Name + "</option>";
                }
                $("#holireg").html(content);
            }
        },
    });
}
var holidaylst = '';
var holidayYear = '';
function fnbindholidays() {
    debugger;

    var selectedregioncode = $("#holireg").val();
    if (selectedregioncode != '' || selectedregioncode != null || selectedregioncode != unndefined) {
        $.ajax({
            type: 'GET',
            url: '../Hidoctor_Master/RegionCreation/GetHolidays',
            data: "RegionCode=" + selectedregioncode,
            contentType: 'application/json; charset=utf-8',
            success: function (resp) {
                holidaylst = resp.lstregionholiday;
                holidayYear = resp.lstholidayyear;
                //  fnbindholidaytbl(resp);

            },
        });
    }
}
var holidaytxt = [];
function fnbindholidaytbl(holidaylst, holidayYear) {
    debugger;
    var content = '';

    if ($("#holireg").val() == '' || $("#holireg").val() == null || $("#holireg").val() == undefined || $("#holireg").val() == "--Choose Region--") {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select region to copy holiday');
        return false;
    }
    else {
        if (holidaylst.length > 0) {
            for (var i = 0; i < holidayYear.length; i++) {
                content += '<option value="' + holidayYear[i].Holiday_Date + '">' + holidayYear[i].Holiday_Date + '</option>';
            }
            $("#selyear").html(content);
            $("#selyear").multiselect("destroy").multiselect().multiselectfilter();
            $("#selyear").multiselect({
                noneSelectedText: holidayYear[0].Holiday_Date
            }).multiselectfilter();

            content = '';

            for (var i = 0; i < holidaylst.length; i++) {

                var holidaydate = holidaylst[i].Holiday_Date;
                var holidaydate1 = holidaydate.split(" ");
                var holidaydate2 = holidaydate1[0];

                content += '<tr><td>';
                content += '<input type="checkbox" class="checkBoxClass" name = "chk_Access" value=' + holidaylst[i].Holiday_Code + '/>';
                content += '</td><td>' + holidaylst[i].Holiday_Name + '</td><td>' + holidaydate2 + '</td></tr>';

            }
            $("#tblholiday").html(content);


            $("#myModal").modal('show');
        } else {
            fnMsgAlert('info', 'Region Creation Wizard', 'Selected region does not have holidays');
            return false;
        }
    }
    if ($(".holidaytxt").length > 0) {
        for (var i = 0; i < $(".holidaytxt").length; i++) {
            var disjson = $.grep(holidaylst, function (ele, index) {
                return ele.Holiday_Code == $("#hdnholicode_" + i).val();
            })

            if (disjson.length > 0) {
                var addobj = {}
                var addobj = {
                    HolidayCode: disjson[0].Holiday_Code,
                    Holidaydate: disjson[0].Holiday_Date,
                    Holidayname: disjson[0].Holiday_Name,
                }
                holidaytxt.push(addobj)
                addobj = "";
            }

        }
        if (holidaytxt.length > 0) {
            for (var i = 0; i < lstselyrs.length; i++) {
                $("#selyear").multiselect("widget").find(":checkbox[value='" + lstselyrs[i].Holiday_Date + "']").attr("checked", "checked");
                $("#selyear option[value='" + lstselyrs[i].Holiday_Date + "']").attr("selected", true);
            }
            $('#selyear').multiselect("destroy").multiselect().multiselectfilter();
            $("#selyear").multiselect({
                noneSelectedText: '-Select Year-'
            }).multiselectfilter();
            for (var i = 0; i < holidaylst.length; i++) {
                var holidaydate = holidaylst[i].Holiday_Date;
                var holidaydate1 = holidaydate.split(" ");
                var holidaydate2 = holidaydate1[0];
                var disjson = $.grep(holidaylst, function (ele, index) {
                    return ele.Holiday_Code == holidaytxt[i].HolidayCode;
                })
                if (disjson.length > 0) {
                    $("input[value='" + holidaytxt[i].HolidayCode + "/']").prop('checked', true);
                }

            }

            $("#myModal").modal('show');
        }
    }
}
var selyears = '';
var lstselyrs = '';
function fnbindholidaybasedondate(holidaylst) {
    debugger;

    var content = '';
    selyears = "";
    $('select#selyear > option:selected').each(function () {
        selyears += $(this).val() + ',';

    });
    selyears = selyears.slice(0, -1);

    var selectedregioncode = $("#holireg").val();
    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/GetHolidayDateOnYear',
        data: "SelectedYear=" + selyears + "&RegionCode=" + selectedregioncode,
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            holidaylst = resp;
            if (holidaylst.length > 0) {
                for (var i = 0; i < holidaylst.length; i++) {
                    var holidaydate = holidaylst[i].Holiday_Date;
                    var holidaydate1 = holidaydate.split(" ");
                    var holidaydate2 = holidaydate1[0];
                    content += '<tr><td>';
                    content += '<input type="checkbox" class="checkBoxClass" name = "chk_Access" value=' + holidaylst[i].Holiday_Code + '/>';
                    content += '</td><td>' + holidaylst[i].Holiday_Name + '</td><td>' + holidaydate2 + '</td></tr>';
                }
                $("#tblholiday").html(content);
            }
            if (holidaytxt.length > 0) {
                for (var i = 0; i < holidaylst.length; i++) {
                    var holidaydate = holidaylst[i].Holiday_Date;
                    var holidaydate1 = holidaydate.split(" ");
                    var holidaydate2 = holidaydate1[0];
                    var disjson = $.grep(holidaylst, function (ele, index) {
                        return ele.Holiday_Code == holidaytxt[i].HolidayCode;
                    })
                    if (disjson.length > 0) {
                        $("input[value='" + holidaytxt[i].HolidayCode + "/']").prop('checked', true);
                    }
                }
            }
        },
    });


}
//function fnselectall() {
//    debugger;

//    $("#ckbCheckAll").click(function () {
//        $(".checkBoxClass").prop('checked', $(this).prop('checked'));
//    });
//}
function fnselectall() {
    debugger;
    if ($('#ckbCheckAll').is(":checked")) {
        var group = "input:checkbox[name='chk_Access']"
        $(group).prop("checked", false);
        $("input:checkbox").prop("checked", true);
        //$("input:checkbox[name=chk_Access]").attr('checked', 'checked');
    }
    else {
        // $("input:checkbox[name=chk_Access]").removeAttr('checked');
        $("input:checkbox").prop("checked", false);
    }
}
var rowNumber = 0;
function fncopyholidays(Id) {
    debugger;
    $("#plus_" + (rowNumber - 1)).hide();
    var content = '';

    content += '<div class="col-sm-12 clearfix rowHoliday" style="margin-top: 12px;" id="rowData_' + rowNumber + '">';
    content += '<div class="col-sm-5" style="margin-left: 16px;">';
    content += '<label>Holiday Name</label>';
    content += '<input style="margin-left:12px;" type="text" class="holidaytxt" id="holidayname_' + rowNumber + '"/>';
    content += '</div>';
    content += '<div class="col-sm-5" style="position: relative;right: 174px;">';
    content += '<label>Holiday Date</label>';
    content += '<input style="margin-left:12px;" type="text" class="holidaydate" id="holidaydate_' + rowNumber + '" />';
    content += '<input type="hidden" id="hdnholicode_' + rowNumber + '"/>';
    content += '<span style="margin-left: 20px;">';
    //  content += '<i class="fa fa-plus" aria-hidden="true" onclick="fnaddnewtextboxes(' + rowNumber + ')" id="plus_' + rowNumber + '" style="font-size: 16px;"></i>';
    content += '<i id="remicon_' + rowNumber + '" class="fa fa-times Ndisplay" aria-hidden="true" onclick="fnRemoveToggle(' + rowNumber + ');" style="font-size: 18px;margin-left: 10px;"></i>';
    content += '</span>';
    content += '</div>';
    content += '<div class="col-sm-2">';
    content += '</div>';
    content += '</div>';
    $("#holidayboxes").append(content);
    rowNumber = rowNumber + 1;
    $(".holidaydate").datepicker({
        dateFormat: 'dd/mm/yy',
        // minDate: new Date(curdate.split('.')[1] + '/' + curdate.split('.')[0] + '/' + curdate.split('.')[2]),
        orientation: 'right bottom'
    });
    //  fnEventBinder();
}
function fnRemoveToggle(i) {
    debugger;
    $('#rowData_' + i).remove();
    if ($(".holidaytxt").length == (i)) {
        $("#plus_" + (i - 1)).show();
    }
}
function fnEventBinder() {
    $('.holidaydate').click(function () { fnBindDatePicker(this); });
}
function fnBindDatePicker(Id) {
    $(".holidaydate").datepicker({
        dateFormat: 'dd/mm/yy',
        // minDate: new Date(curdate.split('.')[1] + '/' + curdate.split('.')[0] + '/' + curdate.split('.')[2]),
        orientation: 'right bottom'
    });
}
var rowno = '';
function fnBindHolidaysFromPopUp() {
    debugger;
    var chkArray = [];
    lstselyrs = [];
    $('select#selyear > option:selected').each(function () {
        addobj = {
            Holiday_Date: $(this).val(),
        }
        lstselyrs.push(addobj)
        addobj = "";
    });

    $('.checkBoxClass:checked').each(function (i) {
        var holidaycode = $(this).val().split('/')
        chkArray.push(holidaycode[0]);
    });
    var holidaytxt = [];
    var usrholidaylst = [];
    var rCntDetails = $('#holidayboxes div.rowHoliday');
    for (var i = 0; i < rCntDetails.length; i++) {
        rowno = rCntDetails[i];
        rowno = rowno.id.split('_')[1];
        var disjson = $.grep(holidaylst, function (ele, index) {
            return ele.Holiday_Code == $("#hdnholicode_" + rowno).val();
        })
        if (disjson.length > 0) {
            var addobj = {}
            addobj = {
                HolidayCode: disjson[0].Holiday_Code,
                Holidaydate: disjson[0].Holiday_Date,
                Holidayname: disjson[0].Holiday_Name,
            }
            holidaytxt.push(addobj)
            addobj = "";
        }
        if ($("#hdnholicode_" + rowno).val() == '' || $("#hdnholicode_" + rowno).val() == null || $("#hdnholicode_" + rowno).val() == undefined) {
            var addholiobj = {}
            addholiobj = {
                HolidayName: $('#holidayname_' + rowno).val(),
                HolidayDate: $('#holidaydate_' + rowno).val(),
            }
            usrholidaylst.push(addholiobj)
            addholiobj = "";
        }
    }
    // $("#holidayboxes").remove();
    //for (var i = 0; i < $(".holidaytxt").length; i++) {
    //    $("#rowData_" + i).remove();
    //}

    //if (holidaytxt.length > 0) {
    $("#holidayboxes").html('');
    rowNumber = 0;
    for (var i = 0; i < chkArray.length; i++) {
        if (chkArray[i] != "" && chkArray[i] != null && chkArray[i] != undefined) {
            var id = "holidayname_" + rowno;
            fncopyholidays(id);
            var disjson = $.grep(holidaylst, function (ele, index) {
                return ele.Holiday_Code == chkArray[i];
            });
            var holidaydate = disjson[0].Holiday_Date.split(' ');
            var holidaydte = holidaydate[0]
            var holidaydatefull = holidaydte.split('/');
            var holidayday = holidaydatefull[1] + '/' + holidaydatefull[0] + '/' + holidaydatefull[2];
            $('#holidayname_' + i).val(disjson[0].Holiday_Name);
            $('#holidaydate_' + i).val(holidayday);
            $('#hdnholicode_' + i).val(disjson[0].Holiday_Code);
        }
    }

    var countarr = (chkArray.length);
    if (usrholidaylst.length > 0) {
        for (var g = 0 ; g < usrholidaylst.length; g++) {
            var idnew = "holidayname_" + countarr;
            fncopyholidays(idnew);
            //    var holidaydate = usrholidaylst[g].Holiday_Date.split(' ');
            //   var holidaydte = holidaydate[0]
            $('#holidayname_' + countarr).val(usrholidaylst[g].HolidayName);
            $('#holidaydate_' + countarr).val(usrholidaylst[g].HolidayDate);
            $('#hdnholicode_' + countarr).val('');
            countarr++;
        }
    }

    //var count = chkArray.length + usrholidaylst.length;
    //var id = "holidayname_" + (count + 1);

    //fncopyholidays(id);
    fnEventBinder();
    $("#myModal").modal('hide');
}
function fnclearholidays() {
    debugger;
    fnbindholidays();
    lstselyrs = [];
    var usrholidaylst = [];
    var rCntDetails = $('#holidayboxes div.rowHoliday');
    for (var i = 0; i < $(".holidaytxt").length; i++) {
        rowno = rCntDetails[i];
        rowno = rowno.id.split('_')[1];
        if ($('#hdnholicode_' + rowno).val() == '' || $('#hdnholicode_' + rowno).val() == null || $('#hdnholicode_' + rowno).val() == undefined) {
            var addholiobj = {}
            addholiobj = {
                HolidayName: $('#holidayname_' + rowno).val(),
                HolidayDate: $('#holidaydate_' + rowno).val(),
            }
            usrholidaylst.push(addholiobj)
            addholiobj = "";
        }
    }
    $("#holidayboxes").html('');
    rowNumber = 0;
    var countarr = 0;
    if (usrholidaylst.length > 0) {
        for (var g = 0 ; g < usrholidaylst.length; g++) {
            var idnew = "holidayname_" + countarr;
            fncopyholidays(idnew);
            //    var holidaydate = usrholidaylst[g].Holiday_Date.split(' ');
            //   var holidaydte = holidaydate[0]
            $('#holidayname_' + countarr).val(usrholidaylst[g].HolidayName);
            $('#holidaydate_' + countarr).val(usrholidaylst[g].HolidayDate);
            $('#hdnholicode_' + countarr).val('');
            countarr++;
        }
    }
    var group = "input:checkbox[name='chk_Access']"
    $(group).prop("checked", false);
    fnEventBinder();
    //fncopyholidays(rowNumber);
}

function fnKangleRegionIntegrate(regionName, mode) {
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
            KI_RegionMigration.divisionCode = divisionCode.replace(/,/g, "^");
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



