///////////////////Created By:S.Manju //////////////////
/////////////////// ON:25-10-2018 ////////////////////
var MTO = {
    defaults: {
        MaxDate: '',
        MinDate: '',
        Holiday: '',
        WeekEnd: '',
        MTOActivity: '',
    },
    initialize: function () {
        if (navigator.onLine == true) {
            MTO.defaults.MaxDate = MaxDate.split(' ')[0];
            MTO.defaults.MinDate = MinDate.split(' ')[0];
            MTO.fngetWeekEndAndHoliday();
        }
        else {
            swal("", "Please connect to the internet.", "");
            return false;
        }
    },
    fnclick: function () {
        debugger;
        var currentState = $(".full").css("display");
        if (currentState == 'inline') {
            $('#catbutton').css("position", "initial");
            $('#catbutton').html('<span class="dot" onclick="MTO.fnclick()"></span><i class="fa fa-times info" aria-hidden="true"></i>');
            $('.full').css({
                'opacity': 0.5,
            });
            var str = '<div id="activity" class="col-lg-12 col-md-12 col-xs-12 clearfix">';
            str += '<span class="names">Field</span>';
            str += '<span class="dot1" onclick="fnfield()"><i class="fa fa-lock info" aria-hidden="true"></i></span>';
            str += '</div>';
            str += '<div id="activity"  class="col-lg-12 col-md-12 col-xs-12 clearfix">';
            str += '<span class="names">Attendance</span>';
            str += '<span class="dot2" onclick="fnattendence()"><i class="fa fa-calendar info" aria-hidden="true"></i></span>';
            str += '</div>';
            str += '<div  id="activity"  class="col-lg-12 col-md-12 col-xs-12 clearfix">';
            str += '<span class="names">Leave</span>';
            str += '<span class="dot3" onclick="fnleave()"><i class="fa fa-calendar info" aria-hidden="true"></i></span>';
            str += '</div>';
            $('#mtoact').html(str);
            $('.full').css("display", "block");
        }
        else {
            //$('#MTODetails').css("position", "initial");
            $('#catbutton').css("position", "fixed");
            $('#catbutton').html('<span class="dot" onclick="MTO.fnclick()"><i class="fa fa-plus info" aria-hidden="true"></i></span>');
            $('.full').css('opacity', 'initial');
            $('.full').css("display", "initial");
            $('#mtoact').html('');
        }
    },
    Touch: function () {
        $('#MTODetails').css("position", "initial");
        $('#catbutton').html('<span class="dot" onclick="MTO.fnclick()"></span><i class="fa fa-plus info" aria-hidden="true"></i>');
        $('.full').css('opacity', 'initial');
        $('.full').css("display", "initial");
        $('#mtoactivity').html('');
    },
    fngetWeekEndAndHoliday: function () {
        var _objData = new Object();
        _objData.subDomainName = subDomainName;
        _objData.Region_Code = LoginRegionCode;
        _objData.User_Code = LoginUserCode;
        _objData.StartDate = MTO.defaults.MinDate;
        _objData.EndDate = MTO.defaults.MaxDate;
        _objData.CompanyId = CompanyId;
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                url: '../../HiDoctor_Activity/MTO/fngetWeekEndAndHoliday',
                success: function (response) {
                    MTO.defaults.Holiday = response.Holiday;
                    MTO.defaults.WeekEnd = response.WeekEnd;
                    MTO.defaults.MTOActivity = response.Activity;
                    var currentYear = new Date().getFullYear();
                    var currentMonth = new Date().getMonth();
                    var calendar = new ej.calendars.Calendar({
                        min: new Date(MinDate.split(' ')[0]),
                        max: new Date(MaxDate.split(' ')[0]),
                        renderDayCell: MTO.customDates,
                        change: MTO.valueChange
                    });
                    calendar.appendTo('#calendar');
                },
                error: function () {

                }
            });
    },


    valueChange: function (args) {
        debugger;
        /*Displays selected date in the label*/
        MTO.Touch();
        var title = '';
        if (args.event) {
            title = event.currentTarget.getAttribute('data-val');
            title = title == null ? '' : ' ( ' + title + ' )';
        }
        var dd = args.value;
        MTO_Date = ("0" + (dd.getMonth() + 1)).slice(-2) + '/' + ("0" + dd.getDate()).slice(-2) + '/' + dd.getFullYear();
        var ACT = $.grep(MTO.defaults.MTOActivity, function (v) {
            return v.MTO_Date == MTO_Date;
        })
        var str = '';
        if (ACT.length == 1) {
            $('#activity').hide();

            if (ACT[0].Activity == 1 && ACT[0].Status == 1) {
                str += '<div class="col-xs-12 boxfiled effect1">';
                str += '<div class="col-sm-4 col-xs-2" style="padding:25px 12px;">';
                str += '<i class="fa fa-suitcase title-i" style="font-size: 18px;"></i>';
                str += '</div>';
                str += '<div class="col-sm-8 col-xs-10">';
                str += '<p style="padding-top: 15px;">Field</br>Applied</p>';
                str += '</div>';
                str += '</div>';
            }
            else if (ACT[0].Activity == 1 && ACT[0].Status == 0) {
                str += '<div class="col-xs-12 boxdraft effect1" onclick=fnDraft("Field","' + MTO_Date + '",' + ACT[0].MTO_Id + ')>';
                str += '<div class="col-sm-4 col-xs-2" style="padding:25px 12px;">';
                str += '<i class="fa fa-suitcase title-i" style="font-size: 18px;"></i>';
                str += '</div>';
                str += '<div class="col-sm-8 col-xs-10">';
                str += '<p style="padding-top: 15px;">Field</br>Draft</p>';
                str += '</div>';
                str += '</div>';
            }
            else if (ACT[0].Activity == 2 && ACT[0].Status == 1) {
                str += '<div class="col-xs-12 boxAtt effect1">';
                str += '<div class="col-sm-4 col-xs-2" style="padding:25px 12px;">';
                str += '<i class="fa fa-suitcase title-i" style="font-size: 18px;"></i>';
                str += '</div>';
                str += '<div class="col-sm-8 col-xs-10">';
                str += '<p style="padding-top: 15px;">Attendance</br>Applied</p>';
                str += '</div>';
                str += '</div>';
            }
            else if (ACT[0].Activity == 2 && ACT[0].Status == 0) {
                str += '<div class="col-xs-12 boxdraft effect1" onclick=fnDraft("Attendance","' + MTO_Date + '",' + ACT[0].MTO_Id + ')>';
                str += '<div class="col-sm-4 col-xs-2" style="padding:25px 12px;">';
                str += '<i class="fa fa-suitcase title-i" style="font-size: 18px;"></i>';
                str += '</div>';
                str += '<div class="col-sm-8 col-xs-10">';
                str += '<p style="padding-top: 15px;">Attendance</br>Draft</p>';
                str += '</div>';
                str += '</div>';
            }
            else if (ACT[0].Activity == 3 && ACT[0].Status == 1) {
                str += '<div class="col-xs-12 boxLeave effect1">';
                str += '<div class="col-sm-4 col-xs-2" style="padding:25px 12px;">';
                str += '<i class="fa fa-suitcase title-i" style="font-size: 18px;"></i>';
                str += '</div>';
                str += '<div class="col-sm-8 col-xs-10">';
                str += '<p style="padding-top: 15px;">Leave</br>Applied</p>';
                str += '</div>';
                str += '</div>';
                $('#activity').hide();
            }
            else if (ACT[0].Activity == 3 && ACT[0].Status == 0) {
                str += '<div class="col-xs-12 boxdraft effect1" onclick=fnDraft("Leave","' + MTO_Date + '",' + ACT[0].MTO_Id + ')>';
                str += '<div class="col-sm-4 col-xs-2" style="padding:25px 12px;">';
                str += '<i class="fa fa-suitcase title-i" style="font-size: 18px;"></i>';
                str += '</div>';
                str += '<div class="col-sm-8 col-xs-10">';
                str += '<p style="padding-top: 15px;">Leave</br>Draft</p>';
                str += '</div>';
                str += '</div>';
            }
        }
        else {
            str += '<div class="col-xs-12 boxdraft effect1">';
            str += '<div class="col-sm-12 col-xs-12">';
            str += '<p style="padding-top: 15px;">No MTO entry is avaliable for this day.</br>Tap + to add an entry</p>';
            str += '</div>';
            str += '</div>';
            $('.effect1').addClass('boxdraft');
            $('#activity').show();
        }
        var dates = MTO_Date.split('/')[1] + '-' + fnGetMonth(MTO_Date.split('/')[0]) + '-' + MTO_Date.split('/')[2]
        $('#MTODetails').html(str);
        document.getElementById('date_label').textContent = 'Selected Date : ' + dates + title;
    },
    customDates: function (args) {
        debugger;
        var dates = ("0" + (args.date.getMonth() + 1)).slice(-2) + '/' + ("0" + args.date.getDate()).slice(-2) + '/' + args.date.getFullYear();
        var WD = $.grep(MTO.defaults.WeekEnd, function (v) {
            return v.Weekend_Day == dates;
        })
        if (WD.length == 1) {
            span = document.createElement('span');
            span.setAttribute('class', 'e-icons highlight1');
            args.element.firstElementChild.setAttribute('title', 'WeekEnd');
            addClass([args.element], ['e-day', 'special', 'WeekEnd']);
            args.element.setAttribute('data-val', ' WeekEnd');
            args.element.setAttribute('title', 'WeekEnd');
            args.element.appendChild(span);
        }

        var HD = $.grep(MTO.defaults.Holiday, function (v) {
            return v.Holiday_Date == dates;
        })
        if (HD.length == 1) {
            span = document.createElement('span');
            span.setAttribute('class', 'e-icons highlight2');
            args.element.firstElementChild.setAttribute("title", HD[0].Holiday_Name.replace(/\s/g, "_"));
            addClass([args.element], ["e-day", "special", HD[0].Holiday_Name.replace(/\s/g, "_")]);
            args.element.setAttribute("data-val", HD[0].Holiday_Name.replace(/\s/g, "_"));
            args.element.setAttribute("title", HD[0].Holiday_Name.replace(/\s/g, "_"));
            args.element.appendChild(span);

        }
        var ACT = $.grep(MTO.defaults.MTOActivity, function (v) {
            return v.MTO_Date == dates;
        })
        if (ACT.length == 1) {
            if (ACT[0].Activity == 1 && ACT[0].Status == 1) {
                addClass([args.element], ['e-cell', 'e-selectedField']);
            }
            else if (ACT[0].Activity == 2 && ACT[0].Status == 1) {
                addClass([args.element], ['e-cell', 'e-selectedAttendance']);
            }
            else if (ACT[0].Activity == 3 && ACT[0].Status == 1) {
                addClass([args.element], ['e-cell', 'e-selectedLeave']);
            }
            else {
                addClass([args.element], ['e-cell', 'e-selectedDraft']);
            }

        }
    },


}
function fnDraft(Activity, MTO_Dates, MTO_Id) {
    var Userstatus = fnuserstatus();
    if (Userstatus) {
        MTO = MTO_Dates.split('/')[2] + '/' + MTO_Dates.split('/')[0] + '/' + MTO_Dates.split('/')[1];
        if (Activity == 'Field') {
            window.location.href = '../MTO/MTOField?MTO_Date=' + MTO + '&MTO_Id=' + MTO_Id + '&LID=' + LID;;
        }
        else if (Activity == 'Attendance') {
            window.location.href = '../MTO/MTOAttendance?MTO_Date=' + MTO + '&MTO_Id=' + MTO_Id + '&LID=' + LID;;
        }
        else {
            window.location.href = '../MTO/MTOLeave?MTO_Date=' + MTO + '&MTO_Id=' + MTO_Id + '&LID=' + LID;;
        }
    }
    else {
        swal("", "Your account has been deactivated.", "");
    }
}
function fnGetMonth(Month) {
    var str;
    switch (Month) {
        case "01":
            str = "January";
            break;
        case "02":
            str = "February";
            break;
        case "03":
            str = "March";
            break;
        case "04":
            str = "April";
            break;
        case "05":
            str = "May";
            break;
        case "06":
            str = "June";
            break;
        case "07":
            str = "July";
            break;
        case "08":
            str = "August";
            break;
        case "09":
            str = "September";
            break;
        case "10":
            str = "October";
            break;
        case "11":
            str = "November";
            break;
        case "12":
            str = "December";
            break;
    }
    return str;
}