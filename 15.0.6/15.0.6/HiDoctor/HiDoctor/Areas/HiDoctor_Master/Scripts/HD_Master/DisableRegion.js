var regionlst = "";
var regionjson = "";
var lstreginfo = "";
var Selregion_Code = '';
var lstcurrinfo = '';
var disabledon = '';
var selectedregionname = '';
var selectedregcode = '';
var dcrdate = '';
var KI_DisableRegion = {
    CompanyCode: "",
    DisabledRegions: [],
    UnderRegions: [],
}; // object for Kangle Integration Api Region Disable.

function fngetactiveregions() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/GetActiveRegions',
        data: "",
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            regionlst = resp;
            //$("#regiondisable").show();
            //if (regionlst.length > 0 && regionlst != null && regionlst != '') {
            //    var regionname = "[";
            //    for (var i = 0; i < regionlst.length; i++) {
            //        regionname += "{label:" + '"' + "" + regionlst[i].Region_Name + "" + '",' + "value:" + '"' + "" + regionlst[i].Region_Code + "," + regionlst[i].Child_Count + "" + '"' + "}";
            //        if (i < regionlst.length - 1) {
            //            regionname += ",";
            //        }
            //    }
            //    regionname += "];";
            //    regionjson = eval(regionname);
            //    autoComplete(regionjson, "regiontxt", "hdnregcode", "regioncls");


            var lstUser = [];
            //json_Userdetails_g = eval('(' + JsonResult + ')');
            //var Json_User = eval('(' + JsonResult + ')');
            for (var i = 0; i < regionlst.length; i++) {
                _objData = {};
                _objData.value = regionlst[i].Region_Code;
                _objData.label = regionlst[i].Region_Name;
                lstUser.push(_objData);
            }
           // if (lstUser.length > 0) {
                UserDetails = lstUser;
                var valueArr = [];
                //valueArr.push(lstUser[0].label);

                var atcObj = new ej.dropdowns.DropDownList({
                    filterBarPlaceholder: 'Search',
                    showClearButton: true,
                    allowFiltering: true,
                    //set the data to dataSource property
                    dataSource: lstUser,
                    fields: { text: 'label', value: 'value' },
                    placeholder: 'Select a region',
                    filtering: function (e) {
                        var dropdown_query = new ej.data.Query();
                        dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                        e.updateData(lstUser, dropdown_query);
                    }
                    // value: valueArr

                });
                atcObj.appendTo('#regiontxt');
                //}
           // }



        },
    });
}
function fnUserValidateRegionAutoFill(Id) {
    debugger;
    var RegionName = $('#' + Id.id).val();
    if (RegionName != "" && regionlst.length > 0) {
        var i = false;
        var s = "";

        for (var o = 0; o < regionlst.length; o++) {
            if (regionlst[o].Region_Name == RegionName) {
                i = true;
                s = regionlst[o].Region_Code;
            }
        }
        if (!i) {
            $("#hdnregcode").val(0);
        }
        else {
            $("#hdnregcode").val(s);
            fngetregiondetails();
        }
    } else {
        $("#hdnregcode").val(0);
    }
}

function fngetregiondetails() {
    debugger;

    $("#btngo").show();
    $("#reportregions").hide();
    $("#disableDate").hide();
    $("#next").hide();
    $("#finish").hide();
    lstcurrinfo = '';
    lstreginfo = '';
    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/GetRegionInfo',
        data: "Region_Code=" + Selregion_Code[0],
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            lstreginfo = resp.lstreginfo;
            lstcurrinfo = resp.lstcurrinfo;
            fnbindreginfo(resp);
        }
    });
}
function fnbindreginfo(resp) {
    debugger;
    var content = '';
    for (var i = 0; i < lstcurrinfo.length; i++) {
        if (lstcurrinfo[i].Curr_User_Name != null || lstcurrinfo[i].Curr_User_Name != '') {
            content += '<label>' + lstcurrinfo[i].Curr_User_Name + '</label><br/>'
        }
    }
    $("#username").html(content);
}
var uservacantcnt = 0;
var currusercnt = 0;
function fngo() {
    debugger;
    if (regionlst.length == 0) {
        fnMsgAlert('info', 'Region Creation Wizard', 'There are no regions vacant');
        return false;
    } else if ($('select[name="regiontxt"]').val() == null ||$('select[name="regiontxt"]').val() == '' ||$('select[name="regiontxt"]').val()== undefined) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter region name');
        return false;
    }
    else {
        var regionlist = $.grep(regionlst, function (element, index) {
            return element.Region_Name == $("#regiontxt").val();
        });
        if (regionlist.length > 0) {
            Selregion_Code = $('select[name="regiontxt"]').val().split(",");
            fnbindregions();
        }
        else {
            fnMsgAlert('info', 'Region Creation Wizard', 'Enter valid region name');
            return false;
        }
    }
}
function fnbindregions() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/GetSelUnderRegions',
        data: "Region_Code=" + Selregion_Code[0],
        async: false,
        success: function (resp) {
            lstunderregion = resp;
            if (lstunderregion.length > 0) {

                console.log(lstunderregion);

                Selregion_Code = $('select[name="regiontxt"]').val().split(",");
                if (Selregion_Code[1] > 0) {
                    $("#reportregions").show();
                    $("#showleafregions").show();
                    $("#btnsave").show();
                }
                else {
                    $("#reportregions").show();
                    $("#showleafregions").show();
                    $("#btnsave").show();
                    $("#next").show();
                }

                var selectcolumn = '';


                if (lstunderregion.length > 0) {
                    console.log(lstunderregion);
                    var regname = '';
                    regname += 'Reporting Regions for ' + $('#regiontxt').val();
                    $("#reptoregname").html(regname);
                    for (var g = 0; g < lstunderregion.length; g++) {
                        if (lstunderregion[g].Region_Code != Selregion_Code[0]) {
                            selectcolumn += "<div class='col-xs-12 clearfix' style='margin-bottom: 21px;'><div class='col-xs-6' style='margin-top: 23px;'>";
                            selectcolumn += "<input type='hidden' style='margin-left: 15px;' id='hdncode" + g + "' name='underleafchk' value=" + lstunderregion[g].Region_Code + ">";
                            selectcolumn += "<label id='reportinguname" + g + "' style='margin-left:39px;font-size:13px;'>" + lstunderregion[g].Region_Name + "</label>";
                            selectcolumn += "</div><div class='col-xs-6'>";
                            selectcolumn += "<label>Change to Reporting Region</label>";
                            selectcolumn += "<select name='reportduser' id='bindreporteduser" + g + "' style='margin-left: 12px;margin-top: 18px;'></select></br>";
                            selectcolumn += "</div></div>";
                            fngetreportedmanagers(g);
                        }
                        else {
                            selectcolumn += " ";
                        }
                    }
                    $("#showleafregions").html(selectcolumn);
                }
            }
            $("#btngo").hide();
            $("#finish").show();

            $("#disableDate").show();
        },

    });
}

function fnback() {
    debugger;
    $('#main').load('HiDoctor_Master/RegionCreation/RegionCreation');
}

//function fnnext() {
//    debugger;
//    $.ajax({
//        type: 'GET',
//        url: '../Hidoctor_Master/RegionCreation/GetDCRLastEnteredDate',
//        data: "Region_Code=" + Selregion_Code[0],
//        success: function (resp) {
//            dcrdate = resp[0].DCR_Actual_Date;
//        }
//    });
//    var isvalid = fnvalidatedisable();
//    if (isvalid == true) {
//        $("#regiondisable").hide();
//        $("#disable").show();
//    }
//}

function fnchangeregions() {
    debugger;
    Selregion_Code = $('select[name="regiontxt"]').val().split(",");
    if (Selregion_Code[1] > 0) {
        $("#reportregions").show();
        $("#showleafregions").show();
        $("#btnsave").show();
    }
    else {
        $("#next").show();
    }
    $("#btngo").hide();

    $("#disableDate").show();
    var selectcolumn = '';

    if (lstreginfo != null && lstreginfo != '') {
        if (lstreginfo.length > 0) {

            for (var g = 0; g < lstreginfo.length; g++) {
                selectcolumn += "<input type='hidden' style='margin-left: 15px;margin-top: 18px;' id='hdncode" + g + "' name='underleafchk' value=" + lstreginfo[g].Region_Code + ">";
                selectcolumn += "<span id='reportinguname" + g + "' style='margin-left:39px;font-size:13px;'>" + lstreginfo[g].Region_Name + "</span><label style='margin-left: 8px;'>Reporting Region</label>";
                selectcolumn += "<select  name='reportduser' id='bindreporteduser" + g + "' style='margin-left: 12px;margin-top: 18px;'></select></br>";
                fngetreportedmanagers(g);
            }
        }
        $("#showleafregions").html(selectcolumn);
    }
    else if (lstcurrinfo != '' && lstcurrinfo != null) {
        for (var g = 0; g < lstcurrinfo.length; g++) {
            selectcolumn += "<input type='hidden' style='margin-left: 15px;margin-top: 18px;' id='hdncode" + g + "' name='underleafchk' value=" + lstcurrinfo[g].Region_Code + ">";
            selectcolumn += "<span id='reportinguname" + g + "' style='margin-left:39px;font-size:13px;'>" + lstcurrinfo[g].Region_Name + "</span><label style='margin-left: 8px;'>Reporting Region</label>";
            selectcolumn += "<select  name='reportduser' id='bindreporteduser" + g + "' style='margin-left: 12px;margin-top: 18px;'></select></br>";
            fngetreportedmanagers(g);
        }
        $("#showleafregions").html(selectcolumn);
    }
    else if (Selregion_Code[1] > 0) {
        for (var g = 0; g < lstunderregion.length; g++) {
            if (lstunderregion[g].Region_Code != Selregion_Code[0]) {
                selectcolumn += "<input type='hidden' style='margin-left: 15px;margin-top: 18px;' id='hdncode" + g + "' name='underleafchk' value=" + lstunderregion[g].Region_Code + ">";
                selectcolumn += "<span id='reportinguname" + g + "' style='margin-left:39px;font-size:13px;'>" + lstunderregion[g].Region_Name + "</span><label style='margin-left: 41px;'>Reporting Region</label>";
                selectcolumn += "<select  name='reportduser' id='bindreporteduser" + g + "' style='margin-left: 12px;margin-top: 18px;'></select></br>";
                fngetreportedmanagers(g);
            }
            else {
                selectcolumn += " ";
            }
        }
        $("#showleafregions").html(selectcolumn);
    }

}
function fngetreportedmanagers(g) {
    debugger;
    Selregion_Code = $("#hdnregcode").val().split(",");
    $("#reportregions").show();
    $("#showleafregions").show();
    $("#btngo").hide();
    $("#finish").hide();

    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/GetReportingRegions',
        data: "Region_Code=" + Selregion_Code[0],
        contentType: 'application/json; charset=utf-8',
        success: function (resp) {
            if (resp != null && resp != '') {
                if (resp.length > 0) {
                    var selectcolumn = '';
                    selectcolumn += '<option>Select Region</option>';
                    for (var i = 0; i < resp.length; i++) {
                        if (resp[i].Region_Code != Selregion_Code[0]) {
                            selectcolumn += '<option value=' + resp[i].Region_Code + '>' + resp[i].Region_Name + '</option>';
                        }
                    }
                }
                $("#bindreporteduser" + g).html(selectcolumn);
            }
        }
    });
}
function fnvalidatedisable() {
    debugger;
    dcrdate = dcrdate.split('/');
    dcrdate = dcrdate[2] + '/' + dcrdate[1] + '/' + dcrdate[0];
    var dtDcr = new Date(dcrdate);

    var disabledate = $("#txtdisableDate").val().split('/');
    disabledate = disabledate[2] + '/' + disabledate[1] + '/' + disabledate[0];
    var disabledt = new Date(disabledate);

    if ($("#regiontxt").val() == null || $("#regiontxt").val() == '' || $("#regiontxt").val() == undefined) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter region name');
        return false;
    }
    if (disabledt < dtDcr) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please select disable date as greater than or same last DCR entered date ');
        HideModalPopup('dvLoading');
        return false;
    }
    else if ($("#txtdisableDate").val() == '' || $("#txtdisableDate").val() == undefined || $("#txtdisableDate").val() == null) {
        fnMsgAlert('info', 'Region Creation Wizard', 'Please enter disable date ');
        return false;
    }
    else {
        return true;
    }

}

function fnsavereportingreg() {
    debugger;
    if ($('#showleafregions').is(':visible')) {


        var regdisablearr = [];
        var rowLength = $("#showleafregions input").length;
        for (var i = 0; i < rowLength; i++) {
            var obj = {
                Reporting_Region_Code: $("#hdncode" + i).val(),
                Reporting_Region_Name: $("#reportinguname" + i).text(),
                Reporting_To_RegCode: $('#bindreporteduser' + i + ' :selected').val(),
                Reporting_ToRegName: $('#bindreporteduser' + i + ' :selected').text()

            };
            if (obj.Reporting_To_RegCode == "" || obj.Reporting_To_RegCode == undefined || obj.Reporting_To_RegCode == 0 || obj.Reporting_To_RegCode == 'Select Region') {
                fnMsgAlert('info', 'Region Creation Wizard', 'Please select reporting to region for region ' + obj.Reporting_Region_Name + '.');
                return false;
            }
            else {
                var MoveUnderRegion = {
                    regionCode: $("#hdncode" + i).val(),
                    UnderRegionCode: $('#bindreporteduser' + i + ' :selected').val()
                };
                KI_DisableRegion.UnderRegions.push(MoveUnderRegion);
                regdisablearr.push(obj);
            }
        }
        var isvalid = fnvalidatedisable();
        if (isvalid == true) {
            $.ajax({
                type: "POST",
                url: '../Hidoctor_Master/RegionCreation/SaveReportingreg',
                data: JSON.stringify({ "lstregdisable": regdisablearr }),
                contentType: 'application/json; charset=utf-8',
                success: function (resp) {
                    fnFinishDisable();
                    //  fnMsgAlert('success', 'Region Creation Wizard', 'Regions have been successfully mapped');
                    // $("#finish").show();
                    //$("#reportregions").hide();
                    //$("#showleafregions").hide();
                    //$("#btnsave").hide();
                }
            });

        }
    }
    else {
        fnFinishDisable();
    }
}
//function fnBackDisable() {
//    debugger;
//    $("#disable").hide();
//    $("#regiondisable").show();
//}
function fnFinishDisable() {
    debugger;
    $.ajax({
        type: 'GET',
        url: '../Hidoctor_Master/RegionCreation/GetDCRLastEnteredDate',
        data: "Region_Code=" + $("#regiontxt").val(),
        success: function (resp) {
            if (resp.length > 0) {
                dcrdate = resp[0].DCR_Actual_Date;
            }
        },
        complete: function () {
            debugger;
            var isvalid = fnvalidatedisable();
            if (isvalid == true) {
                if ($("#txtdisableDate").val() != '' && $("#txtdisableDate").val() != undefined && $("#txtdisableDate").val() != null) {
                    var disabledate = $("#txtdisableDate").val().split('/');
                    disabledon = disabledate[2] + '-' + disabledate[1] + '-' + disabledate[0]
                }
                selectedregionname = $("#regiontxt").val();
                selectedregcode = Selregion_Code[0];
                selectedregid = Selregion_Code[1];
                $.ajax({
                    type: "POST",
                    url: '../Hidoctor_Master/RegionCreation/SaveDisableRegion',
                    data: "Disable_Date=" + disabledon + "&Region_Name=" + selectedregionname + "&Region_Code=" + selectedregcode,
                    //contentType: 'application/json; charset=utf-8',
                    success: function (resp) {
                        fnMsgAlert('info', 'Region Creation Wizard', 'Selected Region has been disabled successfully');
                        var RegionDetails = {
                            Region_Code: Selregion_Code[0],
                            Effective_To: disabledon,
                        }
                        KI_DisableRegion.DisabledRegions.push(RegionDetails);
                        KangleIntegration.requestInvoke("UserMigration", "DisableRegionHiDoctor", KI_DisableRegion, "POST");
                        $('#main').load('HiDoctor_Master/RegionCreation/RegionCreation');
                        fnUpdateRegionIndex();
                        fnUpdateUserIndex();
                    }
                });
            }
        }
    });
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