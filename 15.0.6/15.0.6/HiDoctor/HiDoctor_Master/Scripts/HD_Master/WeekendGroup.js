var s0 = 0, m1 = 0, t2 = 0, w3 = 0, t4 = 0, f5 = 0, s6 = 0;
var weekDayJson = "";
var selectedID = [];


var yearInputString = '<div id="dvYearBox_INDEXNUMB" class="dvYearBoxCount">';
yearInputString += '<div class="listheaderbar" style="margin-bottom:2px; width: 99%" onclick="fnWeekEndTableShowHide(\'dvYear_INDEXNUMB\',\'spn_INDEXNUMB\')">';
yearInputString += '<span class="collapse" id="spn_INDEXNUMB" style="padding: 15px;">Year INDEXNUMB<span style="font-size: 11px; font-style: italic">(Click to Expaned/Collapse!)</span></span></div>';
yearInputString += '<div id="dvYear_INDEXNUMB" style="float: left; width: 100%;"><div style="width: 80%; margin: 2% 0%; float: left;">';
yearInputString += '<div class="WInputRow"><div class="WInptuLeft WInputLeftHeader">Weekend Definer for the Year</div>';
yearInputString += '<div class="WInptuRight"><select id="ddlYear_INDEXNUMB" onchange="fnBindMonthDetailForAYear(this);"></select></div></div></div>';
yearInputString += '<div id="YearDetails_INDEXNUMB" style="display: none;"></div><div style="clear: both;"></div></div></div>';

function fnBindYearlyInputSelection() {
    var index = $("#dvWeekendDetail div.dvYearBoxCount").length + 1;
    var currentYear = todayDate.split('/')[0];
    var Cont = yearInputString.replace(/INDEXNUMB/g, index);
    $("#dvWeekendDetail").append(Cont);

    currentYear = parseInt(currentYear);
    $("#ddlYear_" + index).append("<option value=''>- Select Year -</option>");
    for (var k = 1; k <= 10; k++) {
        $("#ddlYear_" + index).append("<option value=" + currentYear + ">" + currentYear + "</option>");
        currentYear++;
    }

    for (var i = 1; i < index; i++) {
        $('#dvYear_' + i).fadeOut('slow');
        $('#spn_' + i).removeClass('collapse');
        $('#spn_' + i).addClass('expand');
    }
    if (index == 1) {// when 1srt time load, current year has to be selected.
        $("#ddlYear_" + index).val(todayDate.split('/')[0]);
    }
}

function fnBindMonthDetailForAYear(id) {
    
    var yearBoxIndex = "";
    if (id == "") {
        yearBoxIndex = "1";
    }
    else {
        yearBoxIndex = (id.id).split('_')[1];
    }

    var currentYear = $("#ddlYear_" + yearBoxIndex).val();

    var MonthArr = ["JANUARY_31", "MARCH_31", "APRIL_30", "MAY_31", "JUNE_30", "JULY_31", "AUGUST_31", "SEPTEMBER_30", "OCTOBER_31", "NOVEMBER_30", "DECEMBER_31"];
    if ((parseInt(currentYear) % 4) == 0) {
        MonthArr.splice(1, 0, " FEBRUARY_29");
    }

    else {
        MonthArr.splice(1, 0, " FEBRUARY_28");
    }

    var WeekDayArr = ["WN", "S", "M", "T", "W", "T", "F", "S"];
    var WeekDayDetailArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var WeekDayValueArr = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    var weekDatString = "[";
    for (var i = 0; i < WeekDayDetailArr.length; i++) {
        weekDatString += "{label:" + '"' + "" + WeekDayDetailArr[i] + "" + '",' + "value:" + '"' + "" + WeekDayValueArr[i] + "" + '"' + "}";
        if (i < WeekDayDetailArr.length - 1) {
            weekDatString += ",";
        }
    }
    weekDatString += "];";

    weekDayJson = eval(weekDatString);

    var cont = "";

    // Input selection part start
    cont += '<div class="WInputBox">';
    cont += '<div class="WInputRow" style="font-weight: bold;">';
    cont += '<div class="WInptuLeft">WeekDay</div><div class="WInptuRight">Holiday Method</div>'
    cont += '</div>';

    for (var i = 1; i <= 4; i++) {
        cont += '<div class="WInputRow">';
        cont += '<div class="WInptuLeft"><input type="text" id="txtWeekDay_' + yearBoxIndex + '_' + i + '" class="weekdayAuto" /><input type="hidden" id="hdnWeekDay_' + yearBoxIndex + '_' + i + '" /></div>';
        cont += '<div class="WInptuRight"><select id="ddlHolidayMethod_' + yearBoxIndex + '_' + i + '" onchange="fnFillColor(this,\'' + yearBoxIndex + '\');">';
        cont += '<option value="">-Select Holiday Method-</option>'
        for (var h = 0; h < holidayMethodArr.length; h++) {
            cont += '<option value="' + holidayMethodArr[h].Holiday_Method_Class_Name + '">' + holidayMethodArr[h].Holiday_Method_Name + '</option>'
        }
        cont += '</select></div>';

        cont += '</div>';
    }
    cont += '</div>';
    cont += '</div>';
    // Input selection part End

    cont += '<div class="WYearHeader">' + currentYear + '</div>';

    // Month Boxes for the Year Start
    var weekCount = 1;

    cont += '<div class="MonthContainer">';
    for (var mnth = 1; mnth <= MonthArr.length; mnth++) {

        var daysInMonth = parseInt(MonthArr[mnth - 1].split('_')[1]);

        var IEmnth = (mnth < 10) ? '0' + mnth.toString() : mnth.toString();
        var monthFrstDay = new Date(currentYear + "-" + IEmnth + "-01").getDay();
        monthFrstDay = monthFrstDay + 1;
        var monthcellCount = 0;
        var dayCount = 1;
        var isMinus = 0;

        if (monthFrstDay == 1 && weekCount != 1) {
            weekCount++;
            isMinus = 1;
        }

        s0 = 0, m1 = 0, t2 = 0, w3 = 0, t4 = 0, f5 = 0, s6 = 0;

        cont += '<div id="dv_' + mnth + '" class="WMonthDetail">'; // Moth Box

        cont += '<div class="WMonthRow">';
        cont += '<div class="WMonthColumn WMonthHeader WMonthHeaderTop" >' + MonthArr[mnth - 1].split('_')[0] + '</div>';
        cont += '</div>';

        for (var mthR = 0; mthR <= 6; mthR++) { // Month Row

            cont += '<div class="WMonthRow">';

            if (mthR == 0) { //Month Column Header
                for (var mthC = 0; mthC < WeekDayArr.length; mthC++) {
                    cont += '<div class="WMonthColumn WMonthHeader">' + WeekDayArr[mthC] + '</div>';
                }
            }
            else {  // Month Column
                for (var mthC = 0; mthC < WeekDayArr.length; mthC++) {
                    if (mthC == 0) {
                        cont += '<div class="WMonthColumn WWeekColor">' + ((dayCount <= daysInMonth) ? weekCount : "&nbsp;") + '</div>';
                    }
                    else {
                        if (monthFrstDay <= monthcellCount && dayCount <= daysInMonth) {

                            // get class for the cell
                            var columnClass = "";
                            var IEmnth = (mnth < 10) ? '0' + mnth.toString() : mnth.toString();
                            var IEdayCount = (dayCount < 10) ? '0' + dayCount.toString() : dayCount.toString();
                            var dayOfDate = new Date(currentYear + "-" + IEmnth + "-" + IEdayCount).getDay();
                            
                            columnClass = fnGetClass(dayOfDate);

                            cont += '<div class="WMonthColumn ' + columnClass + '">' + dayCount + '</div>';
                            dayCount++;
                        }
                        else {
                            cont += '<div class="WMonthColumn">&nbsp;</div>';
                        }
                    }
                    monthcellCount++;
                }
                if (dayCount <= daysInMonth) {
                    weekCount++;
                }
            }
            cont += '</div>'; // Month Row
        }

        cont += '</div>';
    }
    cont += '</div>';
    // Month Boxes for the Year End

    $("#YearDetails_" + yearBoxIndex).html(cont);
    $("#YearDetails_" + yearBoxIndex).css('display', '');

    autoComplete(weekDayJson, "txtWeekDay", "hdnWeekDay", 'weekdayAuto');
    $(".weekdayAuto").keypress(function () { $("#" + this.id.replace("txtWeekDay", "ddlHolidayMethod")).val(""); fnAddNewRow(this); });
    $(".weekdayAuto").dblclick(function () { $("#" + this.id.replace("txtWeekDay", "ddlHolidayMethod")).val(""); fnAddNewRow(this); });
    $(".weekdayAuto").blur(function () { if ($(this).val() != "") { fnRemoveErrorIndicatior("#" + this.id); } });
}

function fnWeekEndTableShowHide(divid, spnid) {
    if ($('#' + divid).css("display") == "none") {
        $('#' + divid).fadeIn('slow');
        $('#' + spnid).removeClass('expand');
        $('#' + spnid).addClass('collapse');
    }
    else {
        $('#' + divid).fadeOut('slow');
        $('#' + spnid).removeClass('collapse');
        $('#' + spnid).addClass('expand');
    }
}

function fnGetClass(dayOfDate) {
    // dayOfDate 0=sunday, 1=monday, 2=tuesday, 3=wednesday, 4=thursday, 5=friday, 6=Saturday
    //WeekNumber: 1,2,3,4,5
    // s0 = 0, m1 = 0, t2 = 0, w3 = 0, t4 = 0, f5 = 0, s6 = 0;
    var classes = "";
    switch (dayOfDate) {
        case 0:
            classes = "sunAll";
            s0++;
            classes += " sun" + s0;
            if (s0 % 2 == 0) {
                classes += " sunEven";
            }
            else {
                classes += " sunOdd";
            }
            return classes;
            break;
        case 1:
            classes = "monAll";
            m1++;
            classes += " mon" + m1;
            if (m1 % 2 == 0) {
                classes += " monEven";
            }
            else {
                classes += " monOdd";
            }
            return classes;
            break;
        case 2:
            classes = "tueAll";
            t2++;
            classes += " tue" + t2;
            if (t2 % 2 == 0) {
                classes += " tueEven";
            }
            else {
                classes += " tueOdd";
            }
            return classes;
            break;
        case 3:
            classes = "wedAll";
            w3++;
            classes += " wed" + w3;
            if (w3 % 2 == 0) {
                classes += " wedEven";
            }
            else {
                classes += " wedOdd";
            }
            return classes;
            break;
        case 4:
            classes = "thuAll";
            t4++;
            classes += " thu" + t4;
            if (t4 % 2 == 0) {
                classes += " thuEven";
            }
            else {
                classes += " thuOdd";
            }
            return classes;
            break;
        case 5:
            classes = "friAll";
            f5++;
            classes += " fri" + f5;
            if (f5 % 2 == 0) {
                classes += " friEven";
            }
            else {
                classes += " friOdd";
            }
            return classes;
            break;
        case 6:
            classes = "satAll";
            s6++;
            classes += " sat" + s6;
            if (s6 % 2 == 0) {
                classes += " satEven";
            }
            else {
                classes += " satOdd";
            }
            return classes;
            break;
    }
}

function fnFillColor(id, yearBoxIndex) {
    var dayOfDate = "";
    var holidayMethod = "";

    dayOfDate = $("#YearDetails_" + yearBoxIndex + " #" + id.id.replace("ddlHolidayMethod", "hdnWeekDay")).val();
    if (dayOfDate != "") {
        holidayMethod = $(id).val();

        var coloJson = jsonPath(selectedID, "$.[?(@.yearIndex=='" + yearBoxIndex + "' && @.methodvalue=='" + holidayMethod + "' && @.dayValue=='" + dayOfDate + "')]");
        if (coloJson != false && coloJson !== undefined && coloJson.length > 0) {
            fnMsgAlert("info", "DCR Header", "You have already selected this combination.");
            $(id).val("");
            return false;
        }
        else {

            //validate the combination           
            if (fnValidateHolidayMethodCombination(holidayMethod, dayOfDate, yearBoxIndex, id.id.replace("ddlHolidayMethod", "txtWeekDay"))) {
                var idCheck = jsonPath(selectedID, "$.[?(@.id=='" + id.id.replace("ddlHolidayMethod", "txtWeekDay") + "')]");

                if (idCheck != false && idCheck !== undefined && idCheck.length > 0) {
                    var olddayOfDate = idCheck[0].dayValue;
                    var oldholidayMethod = idCheck[0].methodvalue;

                    selectedID[idCheck[0].index].dayValue = dayOfDate;
                    selectedID[idCheck[0].index].methodvalue = holidayMethod;

                    $("#YearDetails_" + yearBoxIndex + " ." + olddayOfDate + oldholidayMethod).removeClass("selectedDay");

                    var allSameDay = jsonPath(selectedID, "$.[?(@.yearIndex=='" + yearBoxIndex + "' &&  @.dayValue=='" + olddayOfDate + "')]");
                    for (var t = 0; t < allSameDay.length; t++) {
                        $("#YearDetails_" + yearBoxIndex + " ." + allSameDay[t].dayValue + allSameDay[t].methodvalue).addClass("selectedDay");
                    }
                    $("#YearDetails_" + yearBoxIndex + " ." + dayOfDate + holidayMethod).addClass("selectedDay");
                }
                else {
                    selectedID.push({ id: id.id.replace("ddlHolidayMethod", "txtWeekDay"), methodvalue: holidayMethod, dayValue: dayOfDate, index: selectedID.length, yearIndex: yearBoxIndex });
                    $("#YearDetails_" + yearBoxIndex + " ." + dayOfDate + holidayMethod).addClass("selectedDay");
                }
            }
            else {
                var idCheck = jsonPath(selectedID, "$.[?(@.id=='" + id.id.replace("ddlHolidayMethod", "txtWeekDay") + "')]");

                if (idCheck != false && idCheck !== undefined && idCheck.length > 0) {
                    $(id).val(idCheck[0].methodvalue);
                    return false;
                }
                else {
                    $(id).val("");
                    return false;
                }
            }
        }
    }
    else {
        fnMsgAlert("info", "DCR Header", "Please enter WeekDay.");
        fnErrorIndicator("#YearDetails_" + yearBoxIndex + " #" + id.id.replace("ddlHolidayMethod", "txtWeekDay"));
        $(id).val("");
        return false;
    }
}

function fnValidateHolidayMethodCombination(holidayMethod, dayOfDate, yearBoxIndex,id) {

    var coloJson = jsonPath(selectedID, "$.[?(@.yearIndex=='" + yearBoxIndex + "'  && @.dayValue=='" + dayOfDate + "')]");
    if (coloJson != false && coloJson !== undefined && coloJson.length > 0) {
        if (coloJson.length == 1 && coloJson[0].id == id) {
            return true;
        }
        else {
            var allJson = jsonPath(selectedID, "$.[?(@.yearIndex=='" + yearBoxIndex + "'  && @.dayValue=='" + dayOfDate + "' && @.methodvalue=='All')]");
            if (allJson != false && allJson !== undefined && allJson.length > 0) {
                fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                return false;
            }
            else {
                switch (holidayMethod) {
                    case "All":
                        fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                        return false;
                        break;

                    case "1":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='Odd')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;

                    case "2":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='Even')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;

                    case "3":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='Odd')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;

                    case "4":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='Even')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;

                    case "5":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='Odd')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;
                    case "Even":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='2' || @.methodvalue=='4')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;

                    case "Odd":
                        var combinJson = jsonPath(coloJson, "$.[?(@.methodvalue=='1' || @.methodvalue=='3' || @.methodvalue=='5')]");
                        if (combinJson != false && combinJson !== undefined && combinJson.length > 0) {
                            fnMsgAlert("info", "DCR Header", "Some days are overlapping.");
                            return false;
                        }
                        break;
                }
                return true;
            }
        }
    }
    else {
        return true;
    }

}


function fnAddNewRow(id) {
    //weekdayAuto

    if (id.id.split('_')[2] == $("#YearDetails_" + id.id.split('_')[1] + " .WInputBox .weekdayAuto").length) {
        var row = parseInt(id.id.split('_')[2]) + 1;
        var cont = "";
        cont += '<div class="WInputRow">';
        cont += '<div class="WInptuLeft"><input type="text" id="txtWeekDay_' + id.id.split('_')[1] + '_' + row + '" class="weekdayAuto" /><input type="hidden" id="hdnWeekDay_' + id.id.split('_')[1] + '_' + row + '" /></div>';
        cont += '<div class="WInptuRight"><select id="ddlHolidayMethod_' + id.id.split('_')[1] + '_' + row + '" onchange="fnFillColor(this,\'' + id.id.split('_')[1] + '\');">';
        cont += '<option value="">-Select Holiday Method-</option>'
        for (var h = 0; h < holidayMethodArr.length; h++) {
            cont += '<option value="' + holidayMethodArr[h].Holiday_Method_Class_Name + '">' + holidayMethodArr[h].Holiday_Method_Name + '</option>'
        }
        cont += '</select></div>';
        cont += '</div>';

        $("#YearDetails_" + id.id.split('_')[1] + " .WInputBox").append(cont);

        autoComplete(weekDayJson, "txtWeekDay", "hdnWeekDay", 'weekdayAuto');
        $(".weekdayAuto").keypress(function () { $("#" + this.id.replace("txtWeekDay", "ddlHolidayMethod")).val(""); fnAddNewRow(this); });
        $(".weekdayAuto").dblclick(function () { $("#" + this.id.replace("txtWeekDay", "ddlHolidayMethod")).val(""); fnAddNewRow(this); });
        $(".weekdayAuto").blur(function () { if ($(this).val() != "") { fnRemoveErrorIndicatior("#" + this.id); } });
    }
    else {
        return;
    }
}

function fnResetWeekEndGroup() {
    $("#dvWeekendDetail").empty();
    s0 = 0, m1 = 0, t2 = 0, w3 = 0, t4 = 0, f5 = 0, s6 = 0;
    weekDayJson = "";
    selectedID = [];
    $("#txtWeekEndGroupName").val("");
    fnBindYearlyInputSelection();
    fnBindMonthDetailForAYear("");
}

function fnSubmitWeekEndGroup() {
    if ($("#txtWeekEndGroupName").val() == "") {
        fnMsgAlert('error', 'Error', 'Please enter Weekend Group Name.');
        $("#txtWeekEndGroupName").focus();
        return false;
    }

    var distYearArr = new Array();
    for (var yr = 1; yr <= $("#dvWeekendDetail div.dvYearBoxCount").length; yr++) {
        if ($("#ddlYear_" + yr).val() != "") {
            if (jQuery.inArray($("#ddlYear_" + yr).val(), distYearArr) === -1) {
                distYearArr.push($("#ddlYear_" + yr).val());
            }
            else {
                fnMsgAlert('info', 'Sale Order Entry', 'You have selected the year ' + $("#ddlYear_" + yr).val() + ' more than one time.Please select it for only one time');
                return false;
            }
        }
    }

    //fnValidateHolidayMethod();
    fnReadWeekendGroup();
}

function fnReadWeekendGroup() {
    var selectedDays = "";
    var holidayMethodDetails = "";

    for (var yr = 1; yr <= $("#dvWeekendDetail div.dvYearBoxCount").length; yr++) {
        var currentYear = $("#ddlYear_" + yr).val();

        if (currentYear != "") {
            // Date string Reading
            for (var mnth = 1; mnth <= 12; mnth++) {
                for (var day = 0; day < $("#dvYear_" + yr + " .MonthContainer #dv_" + mnth + " .selectedDay").length; day++) {
                    var selectedDay = $("#dvYear_" + yr + " .MonthContainer #dv_" + mnth + " .selectedDay")[day].innerHTML;
                    selectedDays += currentYear + '-' + mnth + '-' + selectedDay + '|';
                }
            }


            // Holiday Method Details
            for (u = 1; u < $("#dvYear_" + yr + " .WInputBox .WInputRow").length; u++) {
                if ($("#txtWeekDay_" + yr + "_" + u).val() != "" && $("#ddlHolidayMethod_" + yr + "_" + u).val() != "") {
                    holidayMethodDetails += currentYear + '|' + $("#txtWeekDay_" + yr + "_" + u).val() + '|' + (jsonPath(holidayMethodArr, "$.[?(@.Holiday_Method_Class_Name =='" + $("#ddlHolidayMethod_" + yr + "_" + u).val() + "')]")[0].Holiday_Method_Code) + '~';
                }
            }
        }
    }

    selectedDays = selectedDays.slice(0, -1);
    holidayMethodDetails = holidayMethodDetails.slice(0, -1);
    fnInsertWeekendGroup(selectedDays, holidayMethodDetails);
}

function fnInsertWeekendGroup(selectedDays, holidayMethodDetails) {
    try {
        $.ajax({
            type: "POST",
            url: '/HiDoctor_Master/WeekendGroup/InsertWeekendGroup',
            data: "weekendGroupName=" + $("#txtWeekEndGroupName").val() + "&selectedDays=" + selectedDays + "&holidayMethodDetails=" + holidayMethodDetails,
            success: function (response) {
                if (response.split('^')[0] == "SUCCESS") {
                    fnMsgAlert('success', 'Success', 'Weekend Group Saved Successfully.');
                    fnResetWeekEndGroup();
                    return;
                }
                else if (response == "DUPLICATE") {
                    fnMsgAlert('error', 'Error', 'Duplicate weekend group.');
                    return;
                }
                else {
                    fnMsgAlert('error', 'Error', 'Insertion Failed.' + response);
                    return;
                }
            },
            error: function (e) {
                fnMsgAlert('error', 'Error', 'InsertWeekendGroup Failed.');
            }
        });
    }
    catch (e) {
        fnMsgAlert('error', 'Error', e.message);
        return false;
    }
}

