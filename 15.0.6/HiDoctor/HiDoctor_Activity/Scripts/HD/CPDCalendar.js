var CPD = {
    defaults: {
        MaxDate: '',
        MinDate: '',
        Holiday: '',
        WeekEnd: '',
        CPDActivity: '',
        Employee: '',
        Hidoctordate: ''
    },
    initialize: function () {
        debugger
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                CPD.defaults.MaxDate = MaxDate.split(' ')[0];
                CPD.defaults.MinDate = MinDate.split(' ')[0];
                CPD.fngetWeekEndAndHoliday();
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    fnclick: function () {
        debugger;
        if (navigator.onLine == true) {
            var Userstatus = fnuserstatus();
            debugger
            if (Userstatus) {
                var currentState = $(".full").css("display");
                if (currentState == 'inline') {
                    $('#catbutton').css("position", "initial");
                    $('#catbutton').html('<span class="dot" onclick="CPD.fnclick()"></span><i class="fa fa-times info" aria-hidden="true"></i>');
                    $('.full').css({
                        'opacity': 0.5,
                    });
                    //var str = '<div id="activity" class="col-lg-12 col-md-12 col-xs-12 clearfix">';
                    //str += '<span class="names">Field</span>';
                    //str += '<span class="dot1" onclick="fnfield(' + EmployeeNumber + ')"><i class="fa fa-lock info" aria-hidden="true"></i></span>';
                    //str += '</div>';
                    //str += '<div id="activity"  class="col-lg-12 col-md-12 col-xs-12 clearfix">';
                    //str += '<span class="names">Attendance</span>';
                    //str += '<span class="dot2" onclick="fnattendence()"><i class="fa fa-calendar info" aria-hidden="true"></i></span>';
                    //str += '</div>';
                    //str += '<div  id="activity"  class="col-lg-12 col-md-12 col-xs-12 clearfix">';
                    //str += '<span class="names">Leave</span>';
                    //str += '<span class="dot3" onclick="fnleave()"><i class="fa fa-calendar-times-o info" aria-hidden="true"></i></span>';
                    //str += '</div>';
                    var str = '<div id="activity" class="col-lg-12 col-md-12 col-xs-12 clearfix">';
                    str += '<div>';
                    str += '<span class="names">Field</span><span class="dot1" onclick="fnfield(\'' + EmployeeNumber + '\')"><i class="fa fa-lock info" aria-hidden="true"></i></span>';
                    str += '</div><div>';
                    str += '<span class="dot" onclick="CPD.fnclick()"></span><i class="fa fa-times info" aria-hidden="true"></i>';
                    str += ' </div></div>';
                    $('#cpdact').html(str);
                    $('#catbutton').hide();
                    $('.full').css("display", "block");
                }
                else {
                    $('#catbutton').show();
                    $('#catbutton').css("position", "fixed");
                    $('#catbutton').html('<span class="dot" onclick="CPD.fnclick()"><i class="fa fa-plus info" aria-hidden="true"></i></span>');
                    $('.full').css('opacity', 'initial');
                    $('.full').css("display", "initial");
                    $('#cpdact').html('');
                }
            }
            else {
                swal("Info!", "Your account has been deactivated.", "info");
            }
        }
        else {
            swal("Please connect to the internet", "", "");
            return false;
        }
    },
    Touch: function () {
        $('#CPDDetails').css("position", "initial");
        $('#catbutton').html('<span class="dot" onclick="CPD.fnclick()"></span><i class="fa fa-plus info" aria-hidden="true"></i>');
        $('.full').css('opacity', 'initial');
        $('.full').css("display", "initial");
        $('#cpdactivity').html('');
    },
    fngetWeekEndAndHoliday: function () {
        var _objData = new Object();
        _objData.subDomainName = subDomainName;
        _objData.Region_Code = LoginRegionCode;
        _objData.User_Code = LoginUserCode;
        _objData.StartDate = CPD.defaults.MinDate;
        _objData.EndDate = CPD.defaults.MaxDate;
        _objData.CompanyId = CompanyId;
        $.ajax(
            {
                type: 'POST',
                data: _objData,
                url: '../../HiDoctor_Activity/CPD/fngetWeekEndAndHoliday',
                success: function (response) {
                    debugger
                    CPD.defaults.Holiday = response.Holiday;
                    CPD.defaults.WeekEnd = response.WeekEnd;
                    CPD.defaults.CPDActivity = response.Activity;
                    CPD.defaults.Employee = response.Employee;
                    CPD.defaults.Hidoctordate = CPD.defaults.Employee[0].HiDOCTOR_Start_Date;
                    EmployeeNumber = CPD.defaults.Employee[0].Employee_Number;
                    var currentYear = new Date().getFullYear();
                    var currentMonth = new Date().getMonth();
                    var calendar = new ej.calendars.Calendar({
                        min: new Date(MinDate.split(' ')[0]),
                        max: new Date(MaxDate.split(' ')[0]),
                        renderDayCell: CPD.customDates,
                        change: CPD.valueChange,
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
        CPD.Touch();
        var title = '';
        if (args.event) {
            title = event.currentTarget.getAttribute('data-val');
            title = title == null ? '' : ' ( ' + title + ' )';
        }
        var dd = args.value;
        CPD_Date = ("0" + (dd.getMonth() + 1)).slice(-2) + '/' + ("0" + dd.getDate()).slice(-2) + '/' + dd.getFullYear();
        var ACT = $.grep(CPD.defaults.CPDActivity, function (v) {
            return v.CPD_Date == CPD_Date;
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
                str += '<div class="col-xs-12 boxdraft effect1" onclick=fnDraft("Field","' + CPD_Date + '",' + ACT[0].CPD_Id + ')>';
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
                str += '<div class="col-xs-12 boxdraft effect1" onclick=fnDraft("Attendance","' + CPD_Date + '",' + ACT[0].CPD_Id + ')>';
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
                str += '<p style="padding-top: 15px;">Non Working Day</p>';
                str += '</div>';
                str += '</div>';
                $('#activity').hide();
            }
            else if (ACT[0].Activity == 3 && ACT[0].Status == 0) {

                str += '<div class="col-xs-12 boxdraft effect1" onclick=fnDraft("Leave","' + CPD_Date + '",' + ACT[0].CPD_Id + ')>';
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

            var difdays = 0;
            var Min = '';
            var Max = '';
            var MaxLeaveDateConversion = "";
            if (CPD.defaults.CPDActivity.length == 0) {
                debugger
                var startDate = CPD.defaults.Hidoctordate; //YYYY-MM-DD
                //var startDateFormatNew = startDate.split('/');
                //startDateFormatNew = startDateFormatNew[1] + '/' + startDateFormatNew[0] + '/' + startDateFormatNew[2];
                var endDate = CPD_Date; //YYYY-MM-DD
                var calDate = CPD.defaults.MinDate;
                var st = new Date(startDate);
                var Ed = new Date(CPD_Date);
                var cal = new Date(calDate);
                var Mind = '';
                console.log(st);
                console.log(Ed);
                console.log(cal);
                if (st > Ed) {
                    $('#catbutton').hide();
                    var startdate = startDate.split('/');
                    startdate = startdate[1] + '/' + startdate[0] + '/' + startdate[2];
                    swal("Selected Date should be greater than Hidoctor Start Date(" + startdate + ").", "");
                    return false;
                }
                else if (st != Ed) {
                    debugger;
                    if (st <= cal) {
                        debugger
                        Mind = cal;
                        Min = calDate;
                        Min = Min.split('/');
                        Min = Min[2] + '/' + ("0" + Min[1]).slice(-2) + '/' + ("0" + Min[0]).slice(-2);
                        // Max = CPD_Date;
                        var d = new Date(CPD_Date);
                        d.setDate(d.getDate() - 1);
                        Max = d.getFullYear() + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + ("0" + d.getDate()).slice(-2);
                        MaxLeaveDateConversion = Max;
                        //   MaxLeaveDateConversion = MaxLeaveDateConversion[2] + '/' + ("0" + MaxLeaveDateConversion[0]).slice(-2) + '/' + ("0" + MaxLeaveDateConversion[1]).slice(-2);
                        difdays = showDays(endDate, Mind);
                    } else {
                        debugger;
                        var hd = CPD.defaults.Hidoctordate.split('/');
                        var hd1 = hd[1] + '/' + hd[0] + '/' + hd[2];
                        Mind = st;
                        Min = hd1;
                        Min = Min.split('/');
                        Min = Min[2] + '/' + ("0" + Min[1]).slice(-2) + '/' + ("0" + Min[0]).slice(-2);
                        // Max = CPD_Date;
                        var d = new Date(CPD_Date);
                        d.setDate(d.getDate() - 1);
                        Max = d.getFullYear() + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + ("0" + d.getDate()).slice(-2);
                        MaxLeaveDateConversion = Max;
                        //  MaxLeaveDateConversion = MaxLeaveDateConversion[2] + '/' + ("0" + MaxLeaveDateConversion[0]).slice(-2) + '/' + ("0" + MaxLeaveDateConversion[1]).slice(-2);
                        difdays = showDays(endDate, Mind);
                    }

                }
            }
            else {
                debugger;
                var startDate = CPD.defaults.Hidoctordate; //YYYY-MM-DD
                //var startDateFormatNew = startDate.split('/');
                //startDateFormatNew = startDateFormatNew[1] + '/' + startDateFormatNew[0] + '/' + startDateFormatNew[2];
                //startDate = startDate.split('/')[1] + '/' + startDate.split('/')[0] + '/' + startDate.split('/')[2]
                var endDate = CPD_Date; //YYYY-MM-DD
                var st = new Date(startDate);
                var Ed = new Date(CPD_Date);
                if (st > Ed) {
                    $('#catbutton').hide();
                    var startdate = startDate.split('/');
                    startdate = startdate[1] + '/' + startdate[0] + '/' + startdate[2];
                    swal("Selected Date should be greater than Hidoctor Start Date(" + startdate + ").", "");
                    return false;
                }
                else if (st != Ed) {
                    debugger;
                    var lastdcr = CPD.defaults.CPDActivity[0].CPD_Date;
                    difdays = showDays(CPD_Date, lastdcr);
                    difdays = difdays - 1;
                    //Min = lastdcr + 1;
                    var d = new Date(lastdcr);
                    d.setDate(d.getDate() + 1);
                    Min = d.getFullYear() + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + ("0" + d.getDate()).slice(-2);
                    var m = new Date(CPD_Date);
                    m.setDate(m.getDate() - 1);
                    Max = m.getFullYear() + '/' + ("0" + (m.getMonth() + 1)).slice(-2) + '/' + ("0" + m.getDate()).slice(-2);
                    MaxLeaveDateConversion = Max;
                    //   MaxLeaveDateConversion = MaxLeaveDateConversion[2] + '/' + ("0" + MaxLeaveDateConversion[0]).slice(-2) + '/' + ("0" + MaxLeaveDateConversion[1]).slice(-2);

                }
                //else {
                //    var lastdcr = CPD.defaults.CPDActivity[0].CPD_Date;
                //    difdays = showDays(CPD_Date, lastdcr);
                //    difdays = difdays - 1;
                //    //Min = lastdcr + 1;
                //    var d = new Date(lastdcr);
                //    d.setDate(d.getDate() + 1);
                //    Min = d.toLocaleString().split(",")[0];
                //    var m = new Date(CPD_Date);
                //    m.setDate(m.getDate() - 1);
                //    Max = m.toLocaleString().split(",")[0];
                //}
            }
            if (difdays >= 1) {
                debugger;
                //swal('MIN=' + Min + 'max=' + MaxLeaveDateConversion + 'CPD' + CPD_Date + 'hidoctor=' + startDate,'');

                $('#catbutton').hide();
                // var dcrdays = difdays;
                swal({
                    title: "Are you sure?",
                    text: "Do you wish to consider previous " + difdays + " day(s) as non working day?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-primary",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },
                 function (isConfirm) {
                     debugger;
                     if (navigator.onLine == true) {
                         if (isConfirm) {
                             $.ajax({
                                 type: 'POST',
                                 data: 'subDomainName=' + subDomainName + '&CompanyId=' + CompanyId + '&MinDate=' + Min + '&MaxDate=' + MaxLeaveDateConversion + '&Regioncode=' + LoginRegionCode + '&UserCode=' + LoginUserCode,
                                 url: '../../HiDoctor_Activity/CPD/InsertDefaultLeave',
                                 success: function (response) {
                                     debugger
                                     if (response == 1) {
                                         swal({
                                             title: "Activity Saved Successfully",
                                             showCancelButton: false,
                                             closeOnConfirm: false,
                                         }, function (inputValue) {
                                             if (inputValue === false) return false;
                                             window.location.href = '../CPD/CPDMobile?LID=' + LID;
                                         });
                                     }
                                     else if (response == 0) {
                                         swal("Some system setting is missing.Please contact admin", "");
                                         return false;
                                     }
                                 }
                             })
                         }
                     }
                     else {
                         swal("Please connect to the internet", "", "");
                         return false;
                     }
                 });

            } else {
                str += '<div class="col-xs-12 boxdraft effect1">';
                str += '<div class="col-sm-12 col-xs-12">';
                str += '<p style="padding-top: 15px;">No entry is avaliable for this day.</br>Tap + to add an entry</p>';
                str += '</div>';
                str += '</div>';
                $('.effect1').addClass('boxdraft');
                $('#activity').show();
                $('#catbutton').show();
            }
        }
        var dates = CPD_Date.split('/')[1] + '-' + fnGetMonth(CPD_Date.split('/')[0]) + '-' + CPD_Date.split('/')[2]
        $('#CPDDetails').html(str);
        document.getElementById('date_label').textContent = 'Selected Date : ' + dates + title;
    },
    customDates: function (args) {
        debugger;
        var dates = ("0" + (args.date.getMonth() + 1)).slice(-2) + '/' + ("0" + args.date.getDate()).slice(-2) + '/' + args.date.getFullYear();
        var WD = $.grep(CPD.defaults.WeekEnd, function (v) {
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

        var HD = $.grep(CPD.defaults.Holiday, function (v) {
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
        var ACT = $.grep(CPD.defaults.CPDActivity, function (v) {
            return v.CPD_Date == dates;
        })
        if (ACT.length == 1) {
            debugger
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
                debugger
                addClass([args.element], ['e-cell', 'e-selectedDraft']);
            }

        }
    },

}
function fnDraft(Activity, CPD_Dates, CPD_Id) {
    if (navigator.onLine == true) {
        var Userstatus = fnuserstatus();
        debugger
        if (Userstatus) {
            CPD = CPD_Dates.split('/')[2] + '/' + CPD_Dates.split('/')[0] + '/' + CPD_Dates.split('/')[1];
            if (Activity == 'Field') {
                window.location.href = '../CPD/CPDField?CPD_Date=' + CPD + '&CPD_Id=' + CPD_Id + '&LID=' + LID;
            }
            else if (Activity == 'Attendance') {
                window.location.href = '../CPD/CPDAttendance?CPD_Date=' + CPD + '&CPD_Id=' + CPD_Id + '&LID=' + LID;
                //window.location.href = '../CPD/CPDAttendance?CPD_Date=' + CPD + '&CPD_Id=' + CPD_Id;
            }
            else {
                window.location.href = '../CPD/CPDLeave?CPD_Date=' + CPD + '&CPD_Id=' + CPD_Id + '&LID=' + LID;
            }
        }
        else {
            swal("Info!", "Your account has been deactivated.", "info");
        }
    }
    else {
        swal("Please connect to the internet", "", "");
        return false;
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
function showDays(firstDate, secondDate) {
    debugger;
    var startDay = new Date(firstDate);
    var endDay = new Date(secondDate);
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var diff = new Date(startDay - endDay);
    //  var millisBetween = startDay.getTime() - endDay.getTime();
    var days = diff / millisecondsPerDay;
    var nam = diff / 1000 / 60 / 60 / 24;
    // Round down.
    return nam;

}
//var getDateArray = function (start, end) {
//    debugger
//    var arr = new Array();
//    var dt = new Date(start);
//    while (dt <= end) {
//        arr.push(new Date(dt));
//        dt.setDate(dt.getDate() + 1);
//    }
//    console.log(arr.length)
//    return arr.length;
//}