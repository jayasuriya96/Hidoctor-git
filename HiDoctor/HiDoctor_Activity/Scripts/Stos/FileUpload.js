
var uploadFileName = new Array();
var maxRetries = 3;
var blockLength = 1048576;
var numberOfBlocks = 1;
var currentChunk = 1;
var retryAfterSeconds = 3;
var retFileName = "";
var fileName = "";
var imagesize = "";
var imagelimit = "";
function fnUploadImage() {
    debugger;
    var fileUpload = $("#ChooseFile").get(0);
    var files = fileUpload.files;
    $('#attachment').block({
        message: '<h3>Processing</h3>',
        css: { border: '2px solid #ddd' }
    });
    $("#btupload").hide();
    var fileUpload = $("#ChooseFile").get(0);
    var files = fileUpload.files;
    if (files.length == 0) {
        fnMsgAlert('info', 'STOS', 'Please Choose the file.');
        $("#btupload").show();
        $("#attachment").unblock();
    }
    else {
        fileName = fileUpload.files[0].name;
        var size = fileUpload.files[0].size;
        var FormateImage = getFileExtension(fileName);
        var Formate = FormateImage.toLowerCase();
        if (Formate != "jpeg" && Formate != "jpg" && Formate != "gif" && Formate != "tif" && Formate != "png" && Formate != "pdf") {
            fnMsgAlert('info', 'STOS', 'Please use only .jpeg, .jpg, .gif, .tif, .png, .pdf file formats.');
            var choose = "";
            choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
            $("#uploadfile").html('');
            $("#uploadfile").html(choose);
            $("#attachment").unblock();
            $("#btupload").show();
        }
        else {
            var btsize = imagesize * (1024 * 1024);
            if (btsize < size) {
                fnMsgAlert('info', 'STOS', 'The File size should be less than ' + imagesize + " MB");
                var choose = "";
                choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
                $("#uploadfile").html('');
                $("#uploadfile").html(choose);
                $("#attachment").unblock();
                $("#btupload").show();
            }
            else {

                if (imagelimit <= uploadFileName.length) {
                    fnMsgAlert('info', 'STOS', 'The File Upload limit is ' + imagelimit);
                    var choose = "";
                    choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
                    $("#uploadfile").html('');
                    $("#uploadfile").html(choose);
                    $("#attachment").unblock();
                    $("#btupload").show();
                }
                else {
                    BeginFileUpload(fileName, fileUpload, 'add');
                }

            }
        }
    }
}
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
function BeginFileUpload(fileName, fileControl, source) {

    if (fileControl.files.length > 0) {
        if (fileControl.files.length > 0) {
            for (var i = 0; i < fileControl.files.length; i++) {
                UploadFile(fileControl.files[i], i, fileName, source);
            }
        }
    }
}



var UploadFile = function (file, index, fileName, source) {
    var size = file.size;
    numberOfBlocks = Math.ceil(file.size / blockLength);
    var name = fileName;
    currentChunk = 1;
    name = name.replace(/&/g, 'and');
    $.ajax({
        type: "POST",
        async: false,
        url: "../HiDoctor_Activity/ExpenseClaim/UploadAttachment",
        data: "blocksCount=" + numberOfBlocks + "&fileName=" + encodeURIComponent(name) + "&fileSize=" + size + "",
    }).done(function (retfileName) {
        if (retfileName != "") {
            retFileName = retfileName;
            if (source == 'add')
                sendFile(file, blockLength, fnSaveNoticeBoard, fnNoticeUploadFailure);
            else sendFile(file, blockLength, fnuplodImageEdit, fnNoticeUploadFailure);
            //  fnSaveNoticeBoard(retfileName);
        }
        else {
            //var message = eval('(' + state + ')');
        }
    }).fail(function () {
        alert('Error: Error while uploading attachment');
    });
}
function fnSaveNoticeBoard() {
    debugger;
    $("#attachment1").empty();
    $("#attachment").html('');
    var attachment = "";
    var choose = "";
    var MyArray = retFileName + "#" + fileName;
    retFileName = "";
    uploadFileName.push(MyArray);
    attachment += "<table class='table table-hover'>";
    //attachment += "<thead>";
    for (var i = 0; i < uploadFileName.length; i++) {
        attachment += "<tr><td style='word-wrap: break-word;word-break: break-all;'>Attachment " + [i + 1] + ":</td><td style='word-wrap: break-word;word-break: break-all;'>" + uploadFileName[i].split("#")[1] + "</td><td style='word-wrap: break-word;word-break: break-all;'><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + ",1)' /></td></tr>";
    }
    //attachment += "</thead>";
    attachment += "</table>"; 

    choose = "<input type='file' value='ChooseFile' id='ChooseFile'  />";
    $("#attachment").html(attachment);
    $("#uploadfile").html('');
    $("#uploadfile").html(choose);
    $("#attachment").unblock();
    $("#btupload").show();
}
function fnNoticeUploadFailure() {
    alert("Upload Failed");
    $("#progressBar").css('display', 'none');
}

var sendFile = function (file, chunkSize, successCallBack, failureCallBack) {
    var start = 0,
        end = Math.min(chunkSize, file.size),
        retryCount = 0,
        sendNextChunk, fileChunk;



    sendNextChunk = function () {
        fileChunk = new FormData();

        if (file.slice) {
            fileChunk.append('Slice', file.slice(start, end));
        }
        else if (file.webkitSlice) {
            fileChunk.append('Slice', file.webkitSlice(start, end));
        }
        else if (file.mozSlice) {
            fileChunk.append('Slice', file.mozSlice(start, end));
        }
        else {
            alert(operationType.UNSUPPORTED_BROWSER);
            return;
        }
        jqxhr = $.ajax({
            async: true,
            url: ('../HiDoctor_Activity/ExpenseClaim/UploadChunk?id=' + currentChunk),
            data: fileChunk,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        }).fail(function (request, error) {
            if (error !== 'abort' && retryCount < maxRetries) {
                ++retryCount;
                setTimeout(sendNextChunk, retryAfterSeconds * 1000);
            }

            if (error === 'abort') {
                alert("Aborted");
            }
            else {
                if (retryCount === maxRetries) {
                    alert("Upload timed out.");
                    resetControls();
                    uploader = null;
                }
                else {
                    alert("Resuming Upload");
                }
            }

            return;
        }).done(function (notice) {
            if (notice.error || notice.isLastBlock) {
                successCallBack();
                return;
            }

            ++currentChunk;
            start = (currentChunk - 1) * blockLength;
            end = Math.min(currentChunk * blockLength, file.size);
            retryCount = 0;
            updateProgress();
            if (currentChunk <= numberOfBlocks) {
                sendNextChunk(successCallBack, failureCallBack);
            }

        });
    }
    sendNextChunk(successCallBack, failureCallBack);
}


function GetConfitValueForSize() {
    $.ajax({
        type: 'POST',
        data: '',
        async: false,
        url: '../HiDoctor_Activity/Stos/GetSTOSConfitValueForSize',
        success: function (jsdata) {
            debugger;
            imagesize = jsdata.split('#')[0];
            imagelimit = jsdata.split('#')[1];
            var choosebutton = "";
            choosebutton += "<input type='file' value='ChooseFile' id='ChooseFile'  />";
            $("#uploadfile").html(choosebutton);
        }
    });

}
function fndeleteupload(i, delupload) {
    debugger; 
    var DeleteConform = confirm(" This attachment will be permanently deleted from this STOS. Please click Yes to continue, No to cancel");
    if (DeleteConform == false) {
        return false;
    } 
    uploadFileName.splice(i, 1);
    var button = "#delete_" + i;
    $(button).closest("tr").remove();
    fnCreateUploadTable(delupload);
} function fnCreateUploadTable(delupload) {
    debugger;

    var attachment = "";
    attachment += "<table class='table table-hover'>";
    if (delupload == "1") {

        for (var i = 0; i < uploadFileName.length; i++) {
            attachment += "<tr><td style='word-wrap: break-word;word-break: break-all;'>Attachment " + [i + 1] + ":</td><td style='word-wrap: break-word;word-break: break-all;'>" + uploadFileName[i].split("#")[1] + "</td><td style='word-wrap: break-word;word-break: break-all;'><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + "," + delupload + ")' /></td></tr>";
        }
        attachment += "</table>";

        $("#attachment").html(attachment);
    }
    else {
        var table = document.getElementById("stable");
        var d = rowlength2;
        for (var i = 0; i < uploadFileName.length; i++) {
            //var Name = uploadFileName[i].split("#")[1];
            attachment += "<tr><td style='word-wrap: break-word;word-break: break-all;'>Attachment " + [d + 1] + ":</td><td style='word-wrap: break-word;word-break: break-all;'>" + uploadFileName[i].split("#")[1] + "</td><td style='word-wrap: break-word;word-break: break-all;'><a href='" + uploadFileName[i].split("#")[0] + "' target='_blank' class='btn btn-info'>Preview</a></td><td><input type='button' class='btn btn-danger' id='delete_" + i + "' value=Delete onclick='fndeleteupload(" + i + "," + delupload + ")' /></td></tr>";
            d++;
        }
        attachment += "</table>";
        $("#attachment1").html(attachment);
    }
}

