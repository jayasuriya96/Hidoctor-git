var resultDelimiter = "~";
var viewPageNo_g = 1;
var CourseList = {
    /* All Course Details */
    getAllCourseList: function (courseName, source) {

        var a = {};
        a.name = "courseName";
        a.value = courseName;
        var arData = new Array();

        var curPageno = "1";
        if (source === undefined || source == "") {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurClPgno').html().length == 0 ? "1" : parseInt($('#spncurClPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurClPgno').html().length == 0 ? "1" : parseInt($('#spncurClPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurClPgno').html().length == 0 ? "1" : parseInt($('#spncurClPgno').html());
        }
        else {
            curPageno = source;
        }
        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        arData.push(pg);
        arData.push(a);
        arData.push(dateParam);

        DPAjax.requestInvoke('AdCourse', 'GetPublishedCourseDetails', arData, "POST", function (result) {

            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];

            if (result != null) {
                $('#dvCourseDetail').html(contentDiv);
            }
            else {
                $('#dvCourseDetail').html("No Course found");
            }

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurClPgno').html(curPgNo);
            $('#spnTotClpgno').html(totalPageSize);
            CourseList.SetClPaging(totalPageSize, curPgNo);

        }, function (e) {
            CourseList.getCourseListFailure(e)
        });
    },
    getActiveCourseListSuccess: function (data) {
        if (data != null) {
            $('#dvCourseDetail').html(data);
        }
        else {
            $('#dvCourseDetail').html("No Course found");
        }
    },
    getCourseListFailure: function (e) {
        fnMsgAlert('ERROR', '', e.responseText);
    },
    SetClPaging: function (totPages, curPagno) {
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='CourseList.fnClPageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpClPages').html(options);
        $('#drpClPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnClEditNxt').attr('disabled', true);
        }
        else {
            $('#btnClEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnClEditPre').attr('disabled', true);
        }
        else {
            $('#btnClEditPre').attr('disabled', false);
        }
    },
    fnClPageChange: function (no) {
        $('#spncurClPgno').html(no);
        CourseList.getAllCourseList('', no);
    },
    fnGetSearchResult: function () {
        var searchVal = $("#txtCourseSearch").val();
        CourseList.getAllCourseList(searchVal, '');
    },
    /* All Course Details */

    /* Active Publish Details */
    getActivePublish: function (courseName, source) {
        var curPageno = "1";
        if (source === undefined || source == "") {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html());
        }
        else {
            curPageno = source;
        }

        var a = {};
        a.name = "courseName";
        a.value = courseName;

        var dateParam = {};
        dateParam.name = 'offsetValue';
        dateParam.value = commonValues.getUTCOffset();

        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var arData = new Array();

        arData.push(pg);
        arData.push(a);
        arData.push(dateParam);

        DPAjax.requestInvoke('AdCourse', 'GetActivePublishDetails', arData, "POST", function (result) {
            $('#dvActiveList').html('');
            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];

            if (result != null) {
                $('#dvActiveList').html(contentDiv);
            }

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurActPgno').html(curPgNo);
            $('#spnTotActpgno').html(totalPageSize);
            CourseList.SetActClPaging(totalPageSize, curPgNo);
        },
        function (e) {
            CourseList.getCourseListFailure(e)
        });
    },
    SetActClPaging: function (totPages, curPagno) {
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='CourseList.fnActPageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpActPages').html(options);
        $('#drpActPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnActEditNxt').attr('disabled', true);
        }
        else {
            $('#btnActEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnActEditPre').attr('disabled', true);
        }
        else {
            $('#btnActEditPre').attr('disabled', false);
        }
    },
    fnActPageChange: function (no) {
        $('#spncurActPgno').html(no);
        CourseList.getActivePublish('', no);
    },
    fnGetActiveCourseSearch: function () {
        var searchVal = $("#txtActiveCourseSearch").val();
        CourseList.getActivePublish(searchVal, '');
    },
    /* Active Publish Details */
    /* Expired Publish Details */
    fngetExpiredPublish: function (courseName, source) {

        var curPageno = "1";
        if (source === undefined || source == "") {
            curPageno = "1";
        }
        else if (source == "n") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) + 1;
        }
        else if (source == "p") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html()) - 1;
        }
        else if (source == "c") {
            curPageno = $('#spncurActPgno').html().length == 0 ? "1" : parseInt($('#spncurActPgno').html());
        }
        else {
            curPageno = source;
        }

        var a = {};
        a.name = "courseName";
        a.value = courseName;

        var b = {};
        b.name = "utcOffset";
        b.value = commonValues.getUTCOffset();

        var pg = {};
        pg.name = "pageNum";
        pg.value = curPageno;

        var arData = new Array();
        arData.push(pg);
        arData.push(a);
        arData.push(b);

        DPAjax.requestInvoke('AdCourse', 'GetExpiredPublishDetails', arData, "POST", function (result) {
            $('#dvExpiredCourse').html('');
            var contentDiv = result.split('$')[0];
            var pgDetail = result.split('$')[1];

            if (result != null) {
                $('#dvExpiredCourse').html(contentDiv);
            }

            var totalPageSize = pgDetail.split('-')[0];
            var curPgNo = pgDetail.split('-')[1];
            $('#spncurExpPgno').html(curPgNo);
            $('#spnTotExppgno').html(totalPageSize);
            CourseList.SetExpClPaging(totalPageSize, curPgNo);
        },
        function (e) {
            CourseList.getCourseListFailure(e)
        });
    },
    SetExpClPaging: function (totPages, curPagno) {
        var options = "";
        for (var i = 1; i <= totPages; i++) {
            options += "<option value='" + i + "' onclick='CourseList.fnExpPageChange(" + i + ")'>" + i + "</option>";
        }
        $('#drpExpPages').html(options);
        $('#drpActPages').val(curPagno);
        if (curPagno == totPages) {
            $('#btnExpEditNxt').attr('disabled', true);
        }
        else {
            $('#btnExpEditNxt').attr('disabled', false);
        }
        if (curPagno == 1) {
            $('#btnExpEditPre').attr('disabled', true);
        }
        else {
            $('#btnExpEditPre').attr('disabled', false);
        }
    },
    fnExpPageChange: function (no) {
        $('#spncurExpPgno').html(no);
        CourseList.fngetExpiredPublish('', no);
    },
    fnGetExpiredCourseSearch: function () {
        var expSearchVal = $("#txtExpireCourseSearch").val();
        CourseList.fngetExpiredPublish(expSearchVal, '');
    },
    /* Expired Publish Details */
    //Function to Delete the Published Course
    fnDeletePublish: function (courseId) {
        var a = {};
        a.name = "courseId";
        a.value = courseId;
        var arData = new Array();
        arData.push(a);

        if (confirm("Are you sure you want to unpublish the course? The course would be unpublished and all the scores will be lost. You will not be able to republish the course again. Click “OK” to continue")) {
            DPAjax.requestInvoke('AdCourse', 'DeletePublish', arData, "POST", function (result) {

                if (result.split('~')[0] == "SUCCESS") {
                    alert(result.split(resultDelimiter)[1]);
                    CourseList.getActivePublish('', '');
                }
                else if (result.split(resultDelimiter)[0] == "ERROR") {
                    alert(result.split(resultDelimiter)[1]);
                }
            },
            function (e) {
            });
        }
    },
    fnLoadPublish: function (courseId) {
        $("#main").load('/HDNextGen/AdCourse/AdCoursePublish/' + courseId);
    },

    fnPublishUserDetails: function (courseName, publishName, courseId, publishId) {
        $('#dvCoursePublishViews .close').unbind().bind('click', function (e) {
            HideModalPopup('dvCoursePublishViews');
        });
        var arData = new Array();

        var courseParam = {};
        courseParam.name = "courseId";
        courseParam.value = courseId;

        var publishParam = {};
        publishParam.name = "publishId";
        publishParam.value = publishId;

        arData.push(courseParam);
        arData.push(publishParam);
        ShowModalPopup('dvCoursePublishViews');
        var tablePublishViews = $('#tablePublishViews');
        tablePublishViews.find('.row-table').remove();
        tablePublishViews.append('<tr class="row-table"><td colspan="5">Loading...</td></tr>');

        $('#dvAssetsTitle h3').html("Course Name: " + courseName + ", Exam Name: " + publishName);

        DPAjax.requestInvoke('AdCourse', 'GetActivePublishViews', arData, "GET", function (data) {
            if (data != null && data.length > 0) {
                tablePublishViews.find('.row-table').remove();
                for (var i = 0; i <= data.length - 1; i++) {
                    var tableRow = $('<tr class="row-table">');
                    tableRow.append('<td>' + (i + 1) + '</td>');
                    tableRow.append('<td>' + data[i].User_Name + '</td>');
                    tableRow.append('<td>' + data[i].Employee_Name + '</td>');
                    tableRow.append('<td>' + data[i].Region_Name + '</td>');
                    tableRow.append('<td>' + data[i].Result + '</td>');
                    tablePublishViews.append(tableRow);
                }
            } else {
                tablePublishViews.find('.row-table').remove();
                tablePublishViews.append('<tr class="row-table"><td colspan="5">No records found</td></tr>');
            }
        }, function (e) {
            tablePublishViews.find('.row-table').remove();
            tablePublishViews.append('<tr class="row-table"><td colspan="5">No records found</td></tr>');
        });
    },
    fnPreviewCourse: function (param) {

        var courseId = param.split(resultDelimiter)[0];

        var courseIdArray = new Array();
        var s = {};
        s.name = "courseId";
        s.value = courseId;

        var b = {};
        b.name = "pageNumber";
        b.value = viewPageNo_g;

        var c = {};
        c.name = "pageSize";
        c.value = 0;

        var d = {};
        d.name = "isAllRecords";
        d.value = true;

        courseIdArray.push(s);
        courseIdArray.push(b);
        courseIdArray.push(c);
        courseIdArray.push(d);

        DPAjax.requestInvoke("AdCourse", "GetAdCourseviewDetails", courseIdArray, "POST",
            function (jsonData) {
                CourseList.fnCourseDetailView(jsonData, courseId, $('#cboPageNo').val());
            },
            function () {
                $.unblockUI();
            });
    },
    fnCourseDetailView: function (result, courseId, pageSelection) {
        var jsonData = eval(result.split(resultDelimiter)[0]);
        var toalPageNo = result.split(resultDelimiter)[1];
        totalQuesPageNo_g = toalPageNo;
        $('#cboPageNo').val(pageSelection);

        if (jsonData.length > 0) {
            if (jsonData[0].lstCourse.length > 0) {
                //console.log(jsonData);


                //$('#imgComLogo').attr("src", jsonData[0].lstCourse[0].Logo_URL);
                $('#dvCourseName').html("Course Name : " + jsonData[0].lstCourse[0].Course_Name);
                if (jsonData[0].lstCourse[0].Course_Description != "" && jsonData[0].lstCourse[0].Course_Description != undefined) {
                    $('#dvCourseDesc').html("Course Desc : " + jsonData[0].lstCourse[0].Course_Description);
                }

                if (jsonData[0].lstCourse[0].Course_Image_URL != null && jsonData[0].lstCourse[0].Course_Image_URL != ''
                    && jsonData[0].lstCourse[0].Course_Image_URL != undefined) {
                    $('#dvImgSurImg').attr("src", jsonData[0].lstCourse[0].Course_Image_URL);
                }
                else {
                    $("#dvSurImage").hide();
                }

                //$('#dvTotalQues').html('Total Questions: ' + jsonData[0].lstCourse[0].No_Of_Questions);
                var content = "";
                var questionResJson = jsonData[0].lstQuestion;
                var courseJson = jsonData[0].lstCourse;

                var q = 0;
                content += "<table id='tblCourseQuestion' width='100%'>";
                for (var k = 0; k < courseJson.length; k++) {


                    var sectionId = courseJson[k].Section_Id;
                    var questionJson = jsonPath(questionResJson, "$[?(@.Section_Id=='" + sectionId + "')]");
                    content += "<tr><td colspan='2' style='background: #5E87B0 !important;color: #fff;text-align: left;'><span style='padding-left: 6px;'>Section Name : " + courseJson[k].Section_Name + "</span><span style='float:right;padding-right: 6px;'>No of Questions : " + courseJson[k].No_Of_Questions + "</span></td></tr>";
                    for (var i = 0; i < questionJson.length; i++) {

                        q = parseInt(q) + 1;
                        var d = parseInt(i) + ((parseInt(viewPageNo_g) - 1) * 5) + 1;
                        var questionId = questionJson[i].Question_Id;
                        var questionType = questionJson[i].Question_Type;

                        content += "<tr id='trQues_" + q + "'><td  style='vertical-align: top;' class='tdQuesFirst'>";
                        content += "<div class='clsQuestionNo'>";
                        content += d + "<input type='hidden' id='hdnSurQuesId_" + q + "' value ='" + questionId + "'/>";
                        content += " <input type='hidden' id='hdnSurQuesType_" + q + "' value='" + questionType + "'/> </div></td>";
                        content += "<td class='tdQuesSec'><div class='clsMainQuestion' id='dvMainQuestion_" + q + "'>";

                        content += "<div class='col-xs-11 div_inner'>";
                        content += "<div>";
                        content += "<div class='col-sm-12 clsQuestionText'>" + questionJson[i].Question_Text;

                        content += "<span class='spnMand'></span> </div>";

                        content += "<div class='col-sm-12 clsQuestViewDesc'>" + questionJson[i].Question_Description + "</div>";
                        //content += "<div class='col-sm-12'>" + questionJson[i].Section_Id + "</div>";
                        if (questionJson[i].Question_Image_Url != null && questionJson[i].Question_Image_Url != '' && questionJson[i].Question_Image_Url != undefined) {
                            content += "<div class='col-sm-12 clsQuestImgView'><a href='#'><img class=' thumbnail img-responsive' style='' src='"
                                + questionJson[i].Question_Image_Url + "' onclick='COURSE.fnZoomQuestionImage(this);' /></a></div><div style='clear:both'></div>";
                        }
                        content += "<div class='col-sm-12 clsAnswers'>";

                        //jsonPath(sfc_g, "$.[?(@.Region_Code=='" + regionCodeArr[i] + "' & @.Category_Name=='" + $("#ddlCategory :selected").text() + "')]");
                        var answersJson = jsonPath(jsonData[0].lstAnswer, "$[?(@.Question_Id=='" + questionId + "' & @.Section_Id=='" + sectionId + "')]");

                        if (answersJson.length > 0) {
                            for (var j = 0; j < answersJson.length; j++) {
                                if (questionType == 1) {
                                    //Radio button for answers
                                    content += "<div class='col-sm-12 clearfix checkbox clsPaddingNone'><label><input type='checkbox' name='chkAnswers_" + q + "' value='' />"

                                        + answersJson[j].Answer_Text + "</label> </div> ";
                                }
                                else if (questionType == 2) {
                                    //check box for answers
                                    content += "<div class='col-sm-12 clearfix radio clsPaddingNone'><label><input type='radio' name='rdAnswers_" + q + "' value='' />"
                                        + answersJson[j].Answer_Text + "</label></div>";
                                }
                                else {
                                    //textbox for answers
                                    if (questionType == 0) {
                                        content += "<textarea class='clstxtAnswers form-control' id='txtSurQuesAns_"
                                            + q + "'> " + answersJson[j].Answer_Text + "</textarea><input type='hidden' id='hdnAnsTextMapId_" + q + "' value=''/></br>";
                                    }
                                }
                            }
                        }
                        else {
                            if (questionType == 0) {
                                //textbox for answers
                                content += "<textarea class='clstxtAnswers form-control' id='txtSurQuesAns_" + q + "'></textarea></br>";
                            }
                        }

                        content += " </div>";
                        content += "</div>";
                        content += " </div>";
                        content += " </div>";
                        content += "</tr>";

                    }
                }
                content += "</table>";
            }

            $('#dvViewQuestions').html(content);
            ShowModalPopup('dvViewCourse');
        }
        //}
        $.unblockUI();
    },
}