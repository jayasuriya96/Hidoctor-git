//***************************************fnToggleTree ------------------------------------------

function fnToggleTree() {
    if ($("#spnTreeToggle").html() == "Hide Tree") {
        $("#dvTree").hide();
        $("#divMain").css('width', '100%');
        $("#spnTreeToggle").html('Show Tree');
    }
    else if ($("#spnTreeToggle").html() == "Show Tree") {
        $("#dvTree").show();
        $("#divMain").css('width', '80%');
        $("#spnTreeToggle").html('Hide Tree');
    }
}
function fnToggleInput() {
    if ($("#spnInputToggle").html() == "Hide Input") {
        $("#divInput").slideUp();
        $("#spnInputToggle").html("Show Input");
    }
    else if ($("#spnInputToggle").html() == "Show Input") {
        $("#spnInputToggle").html("Hide Input");
        $("#divInput").slideDown();

    }
}


// for dcr status
function fnChangeRadio() {
    if ($(":checkbox[name=dcrStatus]:checked").length > 0) {
        $("input:checkbox[name=dcrStatusAll]").removeAttr('checked');
        return;
    }
}

function fnChangeCheck() {
    if ($(":checkbox[name=dcrStatusAll]:checked").length > 0) {
        $('input:checkbox[name=dcrStatus]').each(function () {
            $(this).removeAttr('checked');
        });
        return;
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function monthDiff(fromDate, toDate) {
    var tempDate = new Date(fromDate);
    var endDate = new Date(toDate);

    var monthCount = 0;
    while ((tempDate.getMonth() + '' + tempDate.getFullYear()) != (endDate.getMonth() + '' + endDate.getFullYear())) {
        monthCount++;
        tempDate.setMonth(tempDate.getMonth() + 1);
    }
    return monthCount + 1;
}

// Get Month val();
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

function addCommas(nStr) {
    nStr += ''; x = nStr.split('.'); x1 = x[0]; x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) { x1 = x1.replace(rgx, '$1' + ',' + '$2'); }
    return x1 + x2;
}