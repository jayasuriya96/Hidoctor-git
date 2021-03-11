//Created BY:Sumathi M
//Date: 11/6/2015

//Used to Get Document Types
function fnGetDocumentTypes() {
    $.ajax({
        url: 'HiDoctor_Master/MyDocument/GetMyDocumentstoDownload',
        type: 'GET',
        success: function (results) {
            if (results != null && results != '' && results != undefined) {
                $('#dvDocument').html(results);
            }
        }
    });
}

function fnSetDocId(docTypeID) {
    debugger;
    $('#docid').val(docTypeID);
    $('#form1').submit();
}

///***************CHUNK FILE UPLOAD - START**********************//
var CHUNKUPLOAD = {
    //Get Document Types
    fnGetDocTypes: function () {
        $.ajax({
            url: 'HiDoctor_Master/MyDocument/GetDocTypes',
            type: 'POST',
            success: function (result) {
                if (result != null && result != '' && result != undefined) {
                    jsonresult = eval('(' + result + ')');
                    if (jsonresult.length > 0) {
                        var selectCoumn = $('#ddlDocType');
                        $('#ddlDocType option').remove();
                        selectCoumn.append('<option value="0">-Select Document Type-</option>');
                        for (var s = 0 ; s < jsonresult.length; s++) {
                            selectCoumn.append('<option value=' + jsonresult[s].Doc_Type_Id + '>' + jsonresult[s].Doc_Type_Name + '</option>');
                        }
                    }
                }
            }
        });
    },

    fnGetUploadedFileCount: function () {
        var tblcontent = "";
        $.ajax({
            url: 'HiDoctor_Master/MyDocument/GetUploadedFilesCount',
            type: 'POST',
            success: function (result) {
                if (result != null && result != '' && result != undefined) {
                    tblcontent = "<lable style='text-decoration:underline;font-weight:bold;'>Notes:</lable>";
                    tblcontent += "<div>";
                    tblcontent += "<lable>1. Here you can see the uploaded zip files process status.</lable><br>";
                    tblcontent += "<lable>2.&nbsp;<span style='text-weight:bold;'>File extraction Status</span> - Shows the zip files current status.</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span style='font-weight:bold;'>Yet to Process</span> - After uploading the asset, unzip will take few minutes. Until the file getting started to extract (unzip), file status will be in 'Yet to Process'</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span style='font-weight:bold;'>Extract In-Progress</span> - Uploaded file, getting extract (unzip).</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.&nbsp;<span style='font-weight:bold;'>Completed</span> - Unzipped files successfully shared to the individual users.</lable><br>";
                    tblcontent += "<lable>3.&nbsp;<span style='font-weight:bold;'>Uploaded files</span> - Shows number of files have zipped inside the zip file.</lable><br>";
                    tblcontent += "<lable>4.&nbsp;<span style='font-weight:bold;'>Invalid File Count</span> - Shows number of files are invalid as the file name need to complain the below format.</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;<span style='font-weight:bold;'>Valid file name format</span> - documentName_EmployeeNumber.extn</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;<span style='font-weight:bold;'>Valid file extension </span> - pdf, xls, xlsx, doc & docx.</lable><br><br>";
                    tblcontent += "<span style='font-weight:bold;font-size:14px;font-style:italic;'>Files could be invalid due to below reasons:</span><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='clsLegend'>*</span> File name does not complain the valid file format: documentName_EmployeeNumber.extn.</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='clsLegend'>*</span> File extension not valid. (Valid file extensions :  pdf, xls, xlsx, doc & docx).</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='clsLegend'>*</span> Employee number mapped to more than one user (Employee).</lable><br>";
                    tblcontent += "<lable>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='clsLegend'>*</span> Referred employee number does not available in HiDoctor.</lable><br>";

                    tblcontent += "</div><br>";

                    tblcontent += "<div style='float:right;padding-right:7px;'><input type='button' name='Refresh' value='Refresh' class='btn btn-success' onclick='CHUNKUPLOAD.fnShowUploadedFilestatus();'/>&nbsp;&nbsp;";
                    tblcontent += "<input type='button' name='Add New File to Upload' value='Go to File Upload' class='btn btn-info' onclick='CHUNKUPLOAD.fnAddNewfiletoUpload();'/></div><br><br>";

                    if (tblcontent.length > 0) {
                        $('#dvLegend').html(tblcontent);
                    }
                    $('#dvFilecount').html(result);
                }
            }
        });
    },

    fnInitializeEvents: function () {
        $('#btnfileUpload').unbind('click').bind('click', function () {
            { CHUNKUPLOAD.fnFileSubmit(); }
        });
    },

    fnCheckSpecialChar: function (id) {
        if ($.trim($(id).val()) != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9()' '\".+_\[%#;:{}*-\/,=?]+$");
            if (!specialCharregex.test($.trim($(id).val()))) {
                return false;
            }
            else {
                return true;
            }
        }
        return true
    },
    fnFileValidate: function () {
        var flag = true;
        var errMsg = "";
        if ($('#ddlDocType').val() == '0') {
            errMsg = "Plese select Document Type. <br/>"
            flag = false;
        }

        if ($.trim($("#txtDocName").val()).length == 0) {
            errMsg += "Please Enter the Document Name. <br/>";
            flag = false;
        }
        else {
            var result = CHUNKUPLOAD.fnCheckSpecialChar($('#txtDocName'))
            if (!result) {
                errMsg += "Please Enter valid Document Name. <br/>";
                flag = false;
            }
        }

        if ($.trim($("#txtDocName").val()).length > 100) {
            errMsg += "Document Name should not exceed 100 Characters. <br/>";
            flag = false;
        }

        var fileName = $("#fileupload").val();
        if (fileName.length == 0) {
            errMsg += "Please Choose/Select the Zip File to upload. <br/>";
            flag = false;
        }
        else {
            var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (ext == "zip") {
                flag = true;
            }
            else {
                errMsg += "Please select Zip file only <br/>";
                flag = false;
            }
        }

        if ($('#ddlCatType').val() == '0') {
            errMsg += "Plese select File Upload Category. <br/>"
            flag = false;
        }

        if (errMsg.length > 0) {
            fnMsgAlert("info", "File Upload", errMsg);
            return false;
        }
        return flag;
    },

    fnFileSubmit: function () {
        var flag = CHUNKUPLOAD.fnFileValidate();
        if (flag) {
            var fileName = "";
            if ($.browser.msie) {
                if ($('#fileupload').val() != '') {
                    fileName = $('#fileupload').val().replace(/C:\\fakepath\\/i, '').split('\\').pop();
                }
            }
            else {
                if ($('#fileupload').val() != '') {
                    if ($('#fileupload').prop("files").length > 0) {
                        fileName = $('#fileupload').prop("files")[0].name;
                    }
                }
            }

            CHUNKUPLOAD.fnFileSubmitaction(fileName);
        }
        else {
            return false;
        }
    },

    fnFileSubmitaction: function (fileName) {
        if (fileName != null && fileName != undefined && fileName != '') {
            $('#btnfileUpload').hide();
            //  setInterval(function () { fnGetSession() }, 600000);
            CHUNKUPLOAD.fnBeginFileUpload($('#file-form'), "fileupload", fileName, "MyDocument", "ZipFileuploadResult",
                 function (result) {
                     $('#btnfileUpload').show();
                     if (result != null && result.toUpperCase() == "SUCCESS") {
                         $('#uploadedStatus').empty();
                         $('#uploadedStatus').hide();
                         $('#showstatus').html('Uploaded Successfully.<a class="clsshowlink" onclick="CHUNKUPLOAD.fnShowUploadedFilestatus();">Click here</a> to see the Uploaded file status.');
                         CHUNKUPLOAD.fnClearAll();
                     }
                 },
                 function (e) {
                     $('#btnfileUpload').show();
                     CHUNKUPLOAD.fnFormsubmitFailure(e);
                 }, $('#progressbar'));
        }

    },

    fnFormsubmitFailure: function (e) {
        fnMsgAlert("Error", "Course", e.responseText);
    },

    fnBeginFileUpload: function (formId, fileId, fileName, controllerName, actionName, successcallback, failurecallback, progressbar) {
        var fileControl = document.getElementById(fileId);
        if (fileControl.files.length > 0) {
            if (fileControl.files.length > 0) {
                for (var i = 0; i < fileControl.files.length; i++) {
                    CHUNKUPLOAD.fnUploadFile(formId, fileControl.files[i], i, fileName, controllerName, actionName, successcallback, failurecallback, progressbar);
                }
            }
        }
    },

    fnGetSession: function () {
        $.ajax({
            url: 'HiDoctor_Master/MyDocument/GetSession',
            type: 'POST',
            success: function (result) {

            },
            error: function (e) {
                alert(e.responseText);
            },
        });
    },

    fnGetFileUploadStatus: function () {
        $.ajax({
            url: 'HiDoctor_Master/MyDocument/GetFileUploadStatus',
            type: 'POST',
            success: function (result) {
                console.log("Print Ajax while file uploding.....");
            },
            error: function (e) {
                alert(e.responseText);
            },
        });
    },

    fnUploadFile: function (formId, file, i, fileName, controllerName, actionName, successcallback, failurecallback, progressbar) {
        var bar = $('.bar');
        var percent = $('.percent');
        var documentTypeCode = $('#ddlDocType option:selected').val();
        $('#txtdoctype').val(documentTypeCode);
        // var documentTypeName = $('#ddlDocType option:selected').Text();
        var selectedMonth = $('#ddlMonth option:selected').val();
        $('#txtdocMonth').val(selectedMonth);
        var selectedYear = $('#ddlYear option:selected').val();
        $('#txtdocYear').val(selectedYear);
        var documentName = $('#txtDocName').val();
        $('#txtdocName').val(documentName);
        var upload_Type = $('#ddlCatType option:selected').val();
        $('#txtCatType').val(upload_Type);
        var options = {
            type: 'post',
            url: "HiDoctor_Master/MyDocument/ZipFileuploadResult",
            // dataType: 'json',
            contentType: 'multipart/form-data',
            data: formId.fieldSerialize(),
            crossDomain: true,
            processData: false,
            beforeSend: function () {
                progressbar.empty();
                var percentVal = '0%';
                bar.width(percentVal)
                percent.html(percentVal);
            },
            uploadProgress: function (event, position, total, percentComplete) {
                var percentVal = percentComplete + '%';
                bar.width(percentVal)
                percent.html(percentVal);
                if (percent.css('background-color') == "#4CAF50") {
                    percent.css('color', "#fff");
                }
                console.log(percentVal);
                $('#uploadedStatus').show();
                //if (percentVal == '100%') {
                $('#uploadedStatus').html('Please Wait...,File upload in progress.');
                // }
            },
            success: function (data, statusText, xhr, $form) {
                var percentVal = '100%';
                bar.width(percentVal)
                percent.html(percentVal);
                if (statusText != null) {
                    successcallback(statusText);
                }
                else {
                    failurecallback();
                }
                status.html(xhr.responseText);
            }
        };
        formId.ajaxSubmit(options);
    },

    fnhasWhiteSpace: function (s) {
        return /\s/g.test(s);
    },

    fnShowUploadedFilestatus: function () {
        $('#main').load('HiDoctor_Master/MyDocument/UploadedFileStatus');
    },

    fnAddNewfiletoUpload: function () {
        $('#main').load('HiDoctor_Master/MyDocument/ZipFileUpload');
    },

    fnGetInvalidFiles: function (val) {
        var tblContent = "";
        var docUploadId = "";
        var docName = "";
        var uploadDate = "";
        var uploadBy = "";
        if (val != null && val.length > 0) {
            docUploadId = val.split('_')[0];
            docName = val.split('_')[1];
            uploadDate = val.split('_')[2];
            uploadBy = val.split('_')[3];
            if (docUploadId != '' && docUploadId != null) {
                $.ajax({
                    type: 'post',
                    url: '/MyDocument/GetInvalidFiles',
                    data: 'docUploadId=' + docUploadId,
                    success: function (result) {
                        if (result != null && result.length > 0) {
                            tblContent = '<lable>Uploaded By:<span class="cls_spnTitle"> ' + uploadBy + '</span></lable><br>';
                            tblContent += '<lable>Uploaded Date:<span class="cls_spnTitle"> ' + uploadDate + '</span></lable><br>';
                            tblContent += '<lable>Upload File Name:<span class="cls_spnTitle"> ' + docName + '</span></lable>';
                            $('#dvshowTitle').html(tblContent);
                            $('#dvShowinvalidFiles').html(result);
                            ShowModalPopup('dvLoadingInvalidFiles');
                        }
                    }
                });
            }
        }
    },
    fnGetYear: function () {
        var d = new Date();
        var y = d.getFullYear();
        var py = d.getFullYear() - 3;
        var ydrp = document.getElementById('ddlYear');
        var opt = document.createElement('option');
        opt.value = "0";
        opt.innerHTML = "-Select a Year-";
        ydrp.appendChild(opt);
        for (var i = py; i <= y; i++) {
            var opt1 = document.createElement('option');
            opt1.value = i;
            opt1.innerHTML = i;
            ydrp.appendChild(opt1);
        }
    },
    fnClearAll: function(){
        $('#ddlDocType').val('');
        $('#ddlMonth').val('');
        $('#ddlYear').val('');
        $('#ddlCatType').val('');
        $('#txtDocName').val('');
        $('#fileupload').val('');
    }
}

///***************CHUNK FILE UPLOAD - END**********************//