var sectionPage = {
    defaults: { courseId: 1, publishId: 1, userId: 1 },
    init: function () {
        sectionPage.getSectionDetails();
    },
    getSectionDetails: function () {
        ADCourseDetails.getAdSectionReportHeader(sectionPage.defaults.courseId, sectionPage.defaults.userId,
            sectionPage.defaults.publishId, this.onGetSectionDetails, function () { });
    },
    onGetSectionDetails: function (data) {
        if (data && data.length > 0) {
            var panelHead = $('#dvCourseName');
            var panelExamDate = $('#dvExamDate');
            var panelName = $('#dvReportUserName');
            panelHead.html('<div style="padding: 0 5px 5px 0;"><span style="font-weight: bold;">Course Name: </span>' + data[0].Course_Name + '</div><div><span style="font-weight: bold;">Section Name: </span>' + 'N/A' + '</div>');

            $('#dvCourseDetails').show();
            $('#dvCourseDetails').html("");
            /** Section results **/
            var table = $('<table class="table table-bordered"></table>');
            var tHead = $('<tr>');
            tHead.append('<th>SNo</th>');
            tHead.append('<th>Section Name</th>');
            tHead.append('<th>Result</th>');
            tHead.append('<th class="td-align-center">Action</th>');
            table.append(tHead);

            for (var i = 0; i < data.length; i++) {
                var curSec = data[i];

                var tBody = $('<tr>');
                tBody.append('<td>' + (i + 1) + '</td>');
                tBody.append('<td>' + curSec.Section_Name + '</td>');
                tBody.append('<td><label>' + (curSec.Is_Qualified ? 'Pass' : 'Fail') + '</label></td>');
                var sAttempt = curSec.Course_Id + '^' + sectionPage.defaults.publishId + '^' + curSec.Section_Id;
                tBody.append('<td class="td-align-center"><a href="/AdCourse/SectionAttempts/' + sAttempt
                    + '" class="col-action" title="View">View</a></td>');
                if (curSec.Is_Qualified) {
                    tBody.find('label').addClass('answer-correct');
                } else {
                    tBody.find('label').addClass('answer-wrong');
                }
                table.append(tBody);
            }
            $('#dvCourseDetails').append(table);
            $('#dvAjaxLoad').hide();
        }
    }
};

var sectionAttempts = {
    defaults: { courseId: 1, publishId: 1, userId: 1, sectionId: 1 },
    init: function () {
        this.getSectionAttemptDetails();
    },
    getSectionAttemptDetails: function () {
        ADCourseDetails.getAdSectionAttemptDetails(sectionAttempts.defaults.courseId, sectionAttempts.defaults.sectionId,
            sectionAttempts.defaults.userId, sectionAttempts.defaults.publishId, this.onGetSectionDetails, function () { });
    },
    onGetSectionDetails: function (data) {
        if (data && data.length > 0) {
            var panelHead = $('#dvCourseName');
            var panelExamDate = $('#dvExamDate');
            var panelName = $('#dvReportUserName');
            panelHead.html('<div style="padding: 0 5px 5px 0;"><span style="font-weight: bold;">Course Name: </span>' + data[0].Course_Name + '</div><div><span style="font-weight: bold;">Section Name: </span>' + data[0].Section_Name + '</div>');

            $('#dvCourseDetails').show();
            $("#dvCourseDetails").html("");
            /** Section results **/
            var table = $('<table class="table"></table>');
            var tHead = $('<tr>');
            tHead.append('<th>#</th>');
            tHead.append('<th>Attempt Date</th>');
            tHead.append('<th>Result</th>');
            tHead.append('<th class="td-align-center">Action</th>');
            table.append(tHead);

            for (var i = 0; i < data.length; i++) {
                var curSec = data[i];

                var tBody = $('<tr>');
                tBody.append('<td>' + curSec.Attempt_Number + '</td>');
                tBody.append('<td>' + curSec.Formatted_Section_Exam_Start_Time + '</td>');
                tBody.append('<td><label>' + (curSec.Is_Qualified ? 'Pass' : 'Fail') + '</label></td>');
                var secDet = "HdNextGen/AdCourse/ResultPage/" + curSec.Course_Section_User_Exam_Id + '$' + publishId + '$' + courseId + '$' + sectionId;
                tBody.append('<td class="td-align-center"><a href="#" onclick=sectionAttempts.onLoadresultPage("' + secDet + '") class="a-btn" title="View">View</a></td>');
                if (curSec.Is_Qualified) {
                    tBody.find('label').addClass('answer-correct');
                } else {
                    tBody.find('label').addClass('answer-wrong');
                }
                table.append(tBody);
            }
            $('#dvCourseDetails').append(table);
        }
        $('#dvAjaxLoad').hide();
    },
    onLoadresultPage: function (url) {
        $('#dvAjaxLoad').show();
        $("#main").load(url);
    },
    LoadSectionAttemptPage: function () {
        $('#dvAjaxLoad').show();
        var param = sectionAttempts.defaults.courseId + "$" + sectionAttempts.defaults.publishId;
        var securl = "HdNextGen/AdCourse/CourseSections/" + param;
        $("#main").load(securl);
    },
};