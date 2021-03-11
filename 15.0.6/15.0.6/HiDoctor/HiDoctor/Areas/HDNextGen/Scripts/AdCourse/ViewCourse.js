var autoQuestions_g = "";
var autoAnswers_g = "";
var ansRowNum = 1;
var alphabets_g = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var quesRowNum = 1;
var viewPageNo_g = 1;
var resultDelimiter = "~";
var questionsPerPage = [5, 10, 15, 20];

var COURSEVIEW = {
    maxImageSize: 1048576,

    fnInitializeEvents: function () {
        $('#btnQuestionNext').click(function () { QUESTIONS.fnUpdateQuestionOrder(); });
        $('#btnBackQuestion').click(function () {
            //QUESTIONS.fnShowAssetMappingPage();             
            var courseId = courseID_g;
            var sectionId = sectionID_g;
            var cName = cName_g;
            var sname = sectionName_g;
            window.location.href = '/AdCourse/AssetMapping/?cid=' + courseId + "&sid=" + sectionId + "&cname=" + cName + "&sname=" + sname;
        });
    },
    fnRegisQuestionEvents: function () {

    },
    //fnPreviewCourse: function (param) {        
    //    if (param.split(resultDelimiter)[2] == "PREVIEW") {            
    //        window.location.href = '/AdCourse/ViewAdCourse/' + param;
    //        //$('#dvCourseContent').hide();
    //        //$('#dvQuestionContent').hide();
    //        $('#dvCoursePubContent').show();
    //        $('#dvPub').hide();            
    //    }
    //    else {
    //        window.location.href = '/AdCourse/ViewAdCourse/' + param;
    //    }        
    //},
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
                COURSEVIEW.fnCourseDetailView(jsonData, courseId, $('#cboPageNo').val());
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
    fnInitializeQuestionPerPage: function () {
        $('#cboPageNo option').remove();
        var content = "";
        for (var i = 0; i < questionsPerPage.length; i++) {
            $('#cboPageNo').append("<option value=" + questionsPerPage[i] + ">" + questionsPerPage[i] + "</option>");
        }
    },
}