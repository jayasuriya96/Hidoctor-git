var CourseCategoryList = {
    getCourse: function (flag) {
        
        var a = {};
        a.name = "categoryName";
        a.value = $("#txtCategorySearch").val();
        var arData = new Array();
        arData.push(a);
        DPAjax.requestInvoke('AdCourse', 'GetCourseCategoryDetails', arData, "POST", function (data) {
            CourseCategoryList.getCourseCategoryListSuccess(data, flag);
        }, function (e) {
            CourseCategoryList.getCategoryListFailure(e);
        });
    },
    getCourseCategoryListSuccess: function (data, flag) {
        $('#dvCategoryDetails').html("");
        if (data != null) {
            var tString = "<table class='table table-stripped'><thead><tr><th>Sno</th><th>Category Name</th><th>Status</th><th>Delete</th></tr></thead><tbody>"
            var rowNo = 0;
            for (var s=0; s < data.length;s++) {
                rowNo++;
                tString += "<tr><td>" + rowNo + "</td><td>" + data[s].Category_Name + "</td><td>" + data[s].Status + "</td><td><a style='cursor: pointer;' onclick='CourseCategoryList.fnDeleteCategory(" + data[s].Category_Id + ");'>Delete</a></td></tr>";
            }
            tString += "<tbody></table>";
            $('#dvCategoryDetails').html(tString);

            if (data.length == 0) {
                tString = "No Course List."
                $('#dvCategoryDetails').html(tString);
            }
        }        
        //else {
        //    $('#dvCategoryDetails').html("No Course List.");
        //}
        if (flag == 'S') {
            
            ShowModalPopup('dvCategoryMaster');
            //$('#main').load('/Course/Category');
        }
    },
    CourseCategoryList: function (e) {
        fnMsgAlert("error", "Course", e.responseText);
    },
    fnDeleteCategory: function (val) {
        if (confirm("Are you sure to delete the Category?")) {
            var categoryAry = new Array();
            var param = {};
            param.name = 'categoryId';
            param.value = val;
            categoryAry.push(param);
            DPAjax.requestInvoke('AdCourse', 'DeleteCourseCategory', categoryAry, 'GET', CourseCategoryList.fnCategoryDeleteSuccess, CourseCategoryList.fnCategoryDeleteFail);
        }
    },
    fnCategoryDeleteSuccess: function (result) {
        
        if (result == 0) {
            
            fnMsgAlert('info', 'AdCourse', 'Unable to delete the category since category already mapped for the course.');
        }
        else {
            CourseCategoryList.getCourse();
            fnMsgAlert('info', 'AdCourse', 'Category deleted successfully');

        }
    },
    fnCategoryDeleteFail: function () {
        fnMsgAlert('info', 'AdCourse', 'failed');
    },
    fnInsertCourseCategory: function () {
        
        if ($.trim($("#txtCategoryName").val()) == "") {
            fnMsgAlert('info', 'Info', 'Please enter category name');
            return false;
        }

        if ($('#txtCategoryName').val().length > 100) {
            fnMsgAlert('info', 'Caution', 'Category Name exceeds the maximum length.');
            return false;
        }
 

        var isSpecialChar = fnValidateSpecialChar($("#txtCategoryName").val());
        if (!isSpecialChar) {
            fnMsgAlert('info', 'Caution', 'Category name should not have special characters');
            return false;
        }

        var mode = $("#hdnMode").val();
        CourseCategoryList.fnCheckIsDACategoryNameExist(function (isCategorynameExist) {
            if (isCategorynameExist == 1) {
                fnMsgAlert('info', 'Caution', 'Category Name Already Exist, please check.');
                return false;
            }

           
            var categoryAry = new Array();
            var param = {};
            param.name = 'categoryName';
            param.value = $.trim($("#txtCategoryName").val());
            categoryAry.push(param);

            var modeparam = {};
            modeparam.name = 'mode';
            modeparam.value = 'I';
            categoryAry.push(modeparam);

            DPAjax.requestInvoke('AdCourse', 'InsertCategory', categoryAry, 'GET', CourseCategoryList.fnCategorySuccess, CourseCategoryList.fnCategoryFail);
        }, this.fnCategoryFail);
    },
    fnCategorySuccess: function (result) {
        if (result != "") {
            var mode = $("#hdnMode").val();
            if (mode == "I") {
                fnMsgAlert('success', 'Category', 'Category saved successfully');
            }
            else {
                fnMsgAlert('success', 'Category', 'Category updated successfully');
            }
            CourseCategoryList.getCourse();
            CourseCategoryList.fnClearAll();
        }
    },
    fnCategoryFail: function (e) {
        fnMsgAlert('info', 'AdCourse', 'failed');
    },
    fnCheckIsDACategoryNameExist: function (onSuccess, onFail) {
        
        var categoryAry = new Array();
        var param = {};
        param.name = 'categoryName';
        param.value = $.trim($("#txtCategoryName").val());
        categoryAry.push(param);
        
        DPAjax.requestInvoke('AdCourse', 'CheckCategoryNameExist', categoryAry, 'GET', function (result) {
            var count = 0;
            count = result;
            if (onSuccess) onSuccess(result);
        }, onFail);
    },
    fnClearAll: function () {
        $("#txtCategoryName").val('');
    },
   
    fnGetSearchResult: function () {
        var searchVal = $("#txtCategorySearch").val();
        CourseList.getAllCategoryList(searchVal, '');
    },
    getAllCourseList: function (courseName, source) {

        var a = {};
        a.name = "courseName";
        a.value = courseName;
        var arData = new Array();
        arData.push(pg);

        DPAjax.requestInvoke('AdCourse', 'GetCategorySearch', arData, "POST", function (result) {

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
    fnClosePopup: function () {

        CourseCategoryList.fnBindCourseCategory();
        HideModalPopup('dvCategoryMaster');
    },
    fnBindCourseCategory: function () {
        $('#ddCourseCategory').html('');
        $.ajax({
            type: "POST",
            data: "D",
            url: '/AdCourse/GetCourseCategory',
            success: function (jsData) {
                if (jsData != null) {
                    jsData = eval(jsData);
                    $('#ddCourseCategory').append("<option value='0'>Select Category</option>");
                    for (var j = 0; j < jsData.length; j++) {
                        $('#ddCourseCategory').append("<option value='" + jsData[j].Category_Id + "'>" + jsData[j].Category_Name + "</option>");
                    }
                }
                HideModalPopup('dvCategoryMaster');
            }
        });
    },
};

var coursePlayer = {
    showPlayer: function () {
        coursePlayer.openSelectedAsset("", "");
    },
    bindPlayerAssets: function (courseData, data) {
        var _this = this;
        if (data != null && data.length > 0) {
            courseSections.openSelectedAsset(data, courseData);
        } else {
            alert("No Assets mapped for this course.");
        }
    },

    openSelectedAsset: function (inputs, course) {
        //Player.CoreREST._defaultServer = CoreREST._defaultServer;
        //Player.Services.defaults.subdomainName = Services.defaults.subdomainName;
        //Player.Services.defaults.companyId = Services.defaults.companyId;
        //Player.getAssetImages(inputs, "DA_Code", function (assets) {
        var assets = new Array();
        var obj = {
            DA_Code: 123,
            DA_Thumbnail_URL: "http://dl.swaas.manageanycloud.com/ln/content/aee78603d75b49849f8e9d1694ad1f9c20150330145307/15/HowtodownloadandinstallKangle(Androidversion)_thumb.jpg",
            File_Path: "360~http://media011.blob.core.windows.net/000/HowtodownloadandinstallKangle(Androidversion).mp4",
            Asset_Name: "Ashok."
        };
        var ply = new Player({
            //defaultServer: CoreREST._defaultServer,
            //subdomainName: Services.defaults.subdomainName,
            //headerLogo: clientLogoURL_g,
            assets: obj,
            videoUrlProperty: "File_Path",
            assetIdProperty: "DA_Code",
            assetThumbnailProperty: "DA_Thumbnail_URL",
            assetURLProperty: "File_Path",
            assetDescriptionProperty: "Asset_Name",
            //encodedDoc: { encodedProperty: "lstAssetImageModel", encodedUrlProperty: "Image_Url", encodedId: "DA_Code" },
            scrolltype: Player.defaultScrolltype,
            beforeShow: function () {
                //$(".container").hide();
            },
            beforeSlideChange: function ($element, $previousElement) {
                if ($previousElement != null && $previousElement.length > 0) {
                    var prevStartTime = $previousElement.data("startTime");
                    var currTime = new Date().getTime();
                    var timeLapsed = currTime - prevStartTime;
                    console.log("Previous Element Time Lapsed: " + timeLapsed);
                }
                if ($element != null)
                    $element.data("startTime", new Date().getTime());
            },
            afterSlideChange: function ($element) {

            },
            onAssetChange: function (asset, previousAsset) {
                var _this = this;
                if (previousAsset != null) {
                    var startTime = previousAsset.startTime;
                    var endTime = new Date().getTime();
                    var timeLapsed = endTime - startTime;
                    console.log("Previous Asset Time Lapsed: " + timeLapsed);

                    //console.log(previousAsset);
                    //courseSections.insertAnalytics(_this, timeLapsed, previousAsset);
                }

                asset.startTime = new Date().getTime();
            },
            onPlayerClose: function (asset, previousAsset) {
                var _this = this;
                //$(".container").show();
                if (asset != null) {
                    var startTime = asset.startTime;
                    var endTime = new Date().getTime();
                    var timeLapsed = endTime - startTime;
                    console.log("Previous Asset Time Lapsed: " + timeLapsed);

                    courseSections.insertAnalytics(_this, timeLapsed, asset, function () {
                        window.location.reload();
                    });
                }
            }
        });
        ply.show();
        //}, function (e) {
        //    alert(networkProblemError);
        //});
    },

}