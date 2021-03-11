var userCourseDetails = {

    courses: null,

    init: function () {
        $('#tabCategories').bind('click', function (e) {
            $(this).addClass('active');
            $('#tabTags').removeClass('active');
            $('#tags').hide();
            $('#categories').show();
        });
        $('#tabTags').bind('click', function (e) {
            $(this).addClass('active');
            $('#tabCategories').removeClass('active');
            $('#categories').hide();
            $('#tags').show();
        });
        this.initNavBar();
        this.getUserCourseDetails();
    },

    initNavBar: function () {
        $menuLeft = $('.pushmenu-left');
        $nav_list = $('#nav_list');
        $nav_list.addClass('fa');
        $nav_list.addClass('fa-ellipsis-v');
        //$nav_list.html('<img style="height: 38px; margin-left: 5px" src="/Images/Kanglelogo.png">');
        if ($(document).width() < 1024) {
            $nav_list.click(function () {
                $(this).toggleClass('active');
                $('.pushmenu-push').toggleClass('pushmenu-push-toright');
                $menuLeft.toggleClass('pushmenu-open');
                $('.content').toggleClass('push-fixed');
                if ($menuLeft.hasClass('pushmenu-open')) {
                    var fixedHeight = $(document).outerHeight() - (50) - 100 - 36;
                    $('#categories').height(fixedHeight);
                    $('#tags').height(fixedHeight);
                }
            });
            $(document).mouseup(function (e) {
                if (e.target.id != $nav_list.attr('id') && $nav_list.has(e.target).length === 0 && $menuLeft.has(e.target).length === 0) {
                    if ($nav_list.hasClass('active'))
                        $nav_list.trigger('click');
                }
            });
        } else {
            $menuLeft.toggleClass('pushmenu-open');
            var fixedHeight = $(document).outerHeight() - (50) - 100 - 36;
            $('#categories').height(fixedHeight);
            $('#tags').height(fixedHeight);
        }
    },

    getUserCourseDetails: function () {
        //DPAjax.requestInvoke('Course', 'GetUserCourseDetails', null, "GET", this.onGotUserCourseDetails, this.onFailUserCourseDetails);
        ADCourseDetails.getAvailableAdCourses(ADCourseDetails.defaults.companyId, ADCourseDetails.defaults.userId, this.onGotUserCourseDetails, this.onFailUserCourseDetails);
    },

    onGotUserCourseDetails: function (data) {
        userCourseDetails.courses = data;
        userCourseDetails.bindAvailableCourses();
        var courseTags = userCourseDetails.getCourseByTags(data);
        var courseCategories = userCourseDetails.getCourseByCategories(data);
        userCourseDetails.bindCourseTags(courseTags);
        userCourseDetails.bindCourseCategories(courseCategories);
        if (userCourseDetails.courses != null && userCourseDetails.courses.length > 0) {
            // setting arrow popup for filter
            $('#sub-wrapper-options').remove();
            $('.sub-wrapper').append('<span id="sub-wrapper-options" class="sub-wrapper-options"><a id="course-filter" href="#" class="fa fa-filter">&nbsp;Exam Filter</a></span>');
            var courseFilter = new ArrowPopup($('#course-filter'), {
                container: "sub-wrapper-options",
                type: 'ap-checkbox',
                bodyDiv: "settings",
                contents: [
                    {
                        displaytitle: "Completed",
                        isVisible: true
                    }, {
                        displaytitle: "Yet to start",
                        isVisible: true
                    }, {
                        displaytitle: "In Progress",
                        isVisible: true
                    }
                ],
                onSuccess: function (containerElem) {
                    var _this = this;
                    _this.containerelem.find('ul li').each(function (ind, obj) {
                        $(obj).unbind().bind('click', function (e) {
                            if (e.target.type != 'checkbox') {
                                if ($(obj).find('input').is(':checked')) {
                                    $(obj).find('input').removeAttr('checked');
                                } else {
                                    $(obj).find('input').attr('checked', 'checked');
                                }
                                //$(obj).find('input').trigger('change');
                                var filterContent = new Array();
                                _this.containerelem.find('ul li input:checked').each(function (i, o) {
                                    var txt = $(this).parent().find('a').text();
                                    filterContent.push(txt);
                                });
                                userCourseDetails.filterCourses(filterContent);
                            } else {
                                var filterContent = new Array();
                                _this.containerelem.find('ul li input:checked').each(function (i, o) {
                                    var txt = $(this).parent().find('a').text();
                                    filterContent.push(txt);
                                });
                                userCourseDetails.filterCourses(filterContent);
                            }
                        });
                    });
                    /*_this.containerelem.find('ul li input').bind('change', function (e) {
                        if ($(this).is(':checked')) {
                            $(this).removeAttr('checked');
                        } else {
                            $(this).attr('checked', 'checked');
                        }
                    });*/
                }
            });
        }
    },

    onFailUserCourseDetails: function (e) {

    },

    filterCourses: function (filterOptions) {
        var courses = new Array();
        if (filterOptions.length > 0) {
            if (userCourseDetails.courses != null && userCourseDetails.courses.length > 0) {
                for (var i = 0; i <= userCourseDetails.courses.length - 1; i++) {
                    var materialData = userCourseDetails.courses[i];
                    if (materialData.Course_Status_String.toLowerCase().trim() == 'completed') {
                        if (filterOptions.indexOf('Completed') != -1)
                            courses.push(materialData);
                    } else if (materialData.Course_Status_String.toLowerCase().trim() == 'in progress') {
                        if (filterOptions.indexOf('In Progress') != -1)
                            courses.push(materialData);
                    } else if (materialData.Course_Status_String.toLowerCase().trim() == 'yet to start') {
                        if (filterOptions.indexOf('Yet to start') != -1)
                            courses.push(materialData);
                    }
                }
            }
            var title = '';
            for (var i = 0; i <= filterOptions.length - 1; i++) {
                if (i != 0)
                    title += ', ';
                title += filterOptions[i];
            }
            userCourseDetails.bindAllCourses(courses, 'Filter: ' + title);
        } else {
            courses = userCourseDetails.courses;
            userCourseDetails.bindAllCourses(courses, null);
        }
    },

    bindAvailableCourses: function () {
        userCourseDetails.bindAllCourses(userCourseDetails.courses, null);
    },
    bindAllCourses: function (data, title) {
        var courseDetailsList = $('#courseDetailsList');
        courseDetailsList.empty();
        if (data != null && data.length > 0) {
            $('.content h3').html(title);
            for (var i = 0; i <= data.length - 1; i++) {
                var materialData = data[i];
                var $materialUnit = $('<div class="material">');

                var thumbnailURL = '../../Images/courses.jpg';
                if (materialData.Course_Image_URL != null && materialData.Course_Image_URL != '')
                    thumbnailURL = materialData.Course_Image_URL;
                var $thumbUnit = $('<div class="thumb"><img src="' + thumbnailURL + '"/></div>');
                $materialUnit.append($thumbUnit);

                var $details = $('<div class="details">');
                $details.append('<div class="title">' + materialData.Course_Name + '</div>');
                $details.append('<p>' + materialData.Course_Description + '</p>');

                var $infoOne = $('<div class="info">');
                $infoOne.append('<div class="left-info">Completed Sections: ' + materialData.No_Of_Sections_Completed + '/' + materialData.Total_Sections + '</div>');
                $infoOne.append('<div class="right-info">Period: ' + materialData.Valid_From_String + ' - ' + materialData.Valid_To_String + '</div>');
                $details.append($infoOne);

                //var $infoTwo = $('<div class="info">');
                //if (materialData.Is_Qualified)
                //    $infoTwo.append('<div class="left-info">Passed Attempt: ' + materialData.No_Of_Attempts_Taken + '</div>');
                //else
                //    $infoTwo.append('<div class="left-info">Attempts Remaining: ' + materialData.Attempts_Remaining + '/' + materialData.No_of_Attempts + '</div>');
                //$infoTwo.append('<div class="right-info">Valid till ' + materialData.Valid_Till + '</div>');
                //$details.append($infoTwo);

                var $actionsDv = $('<div class="actions">');
                $actionsDv.append('<div class="action-status" style="font-weight: bold;">Status: ' + materialData.Course_Status_String + '</div>');

                var $actionsBtns = $('<div class="action-buttons">');
                var $printCertificate = $('<a onclick=userCourseDetails.loadPrintCertificate(' + materialData.Company_Id + ',' + materialData.Course_User_Assignment_Id + ') href="" class="a-btn">Print Certificate</a>');
                var $view = $('<a onclick=userCourseDetails.loadCourseSection(' + materialData.Course_Id + ',' + materialData.Publish_Id + '); href="#" class="a-btn" title="Click here to view">View</a>');
                if (materialData.Show_Print_Certificate)
                    $actionsBtns.append($printCertificate);
                $actionsBtns.append($view);
                $actionsDv.append($actionsBtns);
                $details.append($actionsDv);
                $materialUnit.append($details);
                courseDetailsList.append($materialUnit);
            }
        } else {
            if (title == null) {
                $('.content h3').html('Currently there is no course available for you.');
            } else {
                $('.content h3').html('Currently there is no course available ' + (title != null ? ' for ' + title : ''));
            }
        }
    },
    loadPrintCertificate: function (companyId, courseUserAssId) {
        var param = companyId + "^" + courseUserAssId;
        // $('#main').load('/HDNextGen/AdCourse/CourseCertificate/?cid=' + companyId + '&cuaid=' + courseUserAssId + '');
        $('#main').load('/HDNextGen/AdCourse/CourseCertificate/' + param);
    },
    loadCourseSection: function (courseId, publishId) {
        $('#dvAjaxLoad').show();
        var id = courseId + "$" + publishId;
        //$('#main').load('/AdCourse/CourseSections?courseId=' + courseId + '&publishId=' + publishId + '');
        $('#main').load('/HDNextGen/AdCourse/CourseSections/' + id, function (e) {
            // alert(courseId);
            //alert(publishId);
            debugger;

            //  rxBookInit.enableCurUserInfo(function (data) {
            // fnSetFooter($('body'));
        });
    },
    getCourseByCategories: function (data) {
        var result = {};
        if (data != null && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                //var tags = new Array();
                //if (typeof data[i].Course_Tags == 'string') {
                //    tags.push(data[i].Course_Tags);
                //} else tags = data[i].Course_Tags;
                //data[i].Course_Tags = tags;
                //var tags = data[i].Course_Tags;
                if (result[data[i].Category_Name] == null) {
                    result[data[i].Category_Name] = new Array();
                }
                //data[i].Tags = tags;
                result[data[i].Category_Name].push(data[i]);
            }
        }
        return result;
    },

    getCourseByTags: function (data) {
        var result = {};
        if (data != null && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {

                if (data[i].Course_Tags != null) {
                    var tags = data[i].Course_Tags;
                    tags = tags.split('^');

                    for (var j = 0; j <= tags.length - 1; j++) {
                        var tag = tags[j];
                        if (tag != null && tag != '') {
                            if (result[tag] == null)
                                result[tag] = new Array();
                            result[tag].push(data[i]);
                        }
                    }
                }

                //if (result[data[i].Course_Tags] == null)
                //    result[data[i].Course_Tags] = new Array();
                //result[data[i].Course_Tags].push(data[i]);
            }
        }
        return result;
    },

    getTaggedCourses: function (course) {
        var taggedArrays = {};
        for (var i = 0; i <= course.Tags.length - 1; i++) {
            if (taggedArrays[course.Tags[i]] == null) {
                taggedArrays[course.Tags[i]] = new Array();
            }
            taggedArrays[course.Tags[i]].push(course);
        }
        return taggedArrays;
    },

    bindCourseCategories: function (data) {
        var $categoryList = $('#categories ul');
        $categoryList.empty();
        if (data != null) {
            var first = true;
            var isEmpty = true;
            for (var categoryName in data) {
                isEmpty = false;
                var i = categoryName;
                var $catItem = $('<li class="cat-root">');
                $catItem.append('<div>' + categoryName + '</div>');

                $catItem.data('courses', data[i]);
                $catItem.data('title', categoryName);

                $catItem.append('<span>' + data[i].length + '</span>');
                $catTree = $('<span class="cat-tree"></span>');
                $catTree.data('courses', data[i]);
                $catTree.unbind().bind('click', function (e) {
                    var courses = $(this).data('courses');
                    $(this).toggleClass('open');
                    var id = $(this).attr('id');
                    $('.ul-branch').hide();
                    if ($(this).hasClass('open')) {
                        $(this).parents('li.cat-root').find('.ul-branch').show();
                    }
                });
                $catItem.append($catTree);
                var $branch = $('<ul class="ul-branch">');
                var tags = userCourseDetails.getCourseByTags(data[categoryName]);
                for (var tag in tags) {
                    var $tagItem = $('<li class="cat-branch">');
                    $tagItem.append('<div>' + tag + '</div>');

                    $tagItem.data('courses', tags[tag]);
                    $tagItem.data('title', categoryName + ' > ' + tag);

                    $tagItem.append('<span>' + tags[tag].length + '</span>');
                    $branch.append($tagItem);
                }
                $catItem.append($branch);
                $categoryList.append($catItem);

                $catItem.find('div').unbind('click').bind('click', function (e) {
                    userCourseDetails.onSelectionChange($(this).parent());
                });
                first = false;
            }
            if (isEmpty)
                $categoryList.html('<li class="empty">No Categories Found</li>');
            $('.ul-branch').hide();
        } else {
            $categoryList.html('<li class="empty">No Categories Found</li>');
        }
    },
    bindCourseTags: function (data) {
        var tagList = $('#tags ul');
        tagList.empty();
        if (data != null) {
            var first = true;
            var isEmpty = true;
            for (var tag in data) {
                isEmpty = false;
                var $catItem = $('<li class="cat-root">');
                $catItem.append('<div>' + tag + '</div>');
                $catItem.append('<span>' + data[tag].length + '</span>');
                $catItem.data('courses', data[tag]);
                $catItem.data('title', tag);
                $catItem.bind('click', function (e) {
                    userCourseDetails.onSelectionChange($(this));
                });
                tagList.append($catItem);
                first = false;
            }
            if (isEmpty)
                tagList.html('<li class="empty">No Tags Found</li>');
        } else {
            tagList.html('<li class="empty">No Tags Found</li>');
        }
    },
    onSelectionChange: function (object) {
        var courses = object.data('courses');
        var title = object.data('title');
        $('#tags, #categories').find('li').removeClass('active');
        object.addClass('active');
        userCourseDetails.bindAllCourses(courses, title + '&nbsp;<a class="fa fa-close" style="cursor: pointer;"></a>');
        //$('.content h3').html(title + '&nbsp;<a class="fa fa-close" style="cursor: pointer;"></a>');
        $('.content h3 a').unbind().bind('click', function (e) {
            $('#tags, #categories').find('li').removeClass('active');
            userCourseDetails.bindAvailableCourses();
        });
    }
};