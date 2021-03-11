
var maxRetries = 3;
var blockLength = 1048576;
var numberOfBlocks = 1;
var currentChunk = 1;
var retryAfterSeconds = 3;

function BeginFileUpload(fileId, fileName, fileCount, msgCode) {
    var fileControl = document.getElementById(fileId);

    if (fileControl.files.length > 0) {
        if (fileControl.files.length > 0) {
            for (var i = 0; i < fileControl.files.length; i++) {
                UploadFile(fileControl.files[i], fileCount, fileName, msgCode);
            }
        }
    }
}


//var retFileName = "";

var UploadFile = function (file, fileCount, fileName, msgCode) {
    var size = file.size;
    numberOfBlocks = Math.ceil(file.size / blockLength);
    var name = fileName;
    currentChunk = 1;

    $.ajax({
        type: "POST",
        async: false,
        url: "../../Messaging/UploadAttachment",
        data: "blocksCount=" + numberOfBlocks + "&fileName=" + name + "&fileSize=" + size + "",
    }).done(function (retFileName) {
        if (retFileName != "") {
            //sendFile(file, blockLength, fileName);
            sendFile(file, blockLength, fnUpdateAttachmentPath, fnMailUploadFailure, retFileName, fileCount, msgCode)
        }
        else {
            var message = eval('(' + false + ')');
        }
    }).fail(function () {
        alert('Error: Error while uploading attachment');
    });

}

function fnMailUploadFailure() {
    alert("Upload Failed");
    $("#progressBar").css('display', 'none');
}

var sendFile = function (file, chunkSize, successCallBack, failureCallBack, fileName, fileCount, msgCode) {
    var start = 0,
        end = Math.min(chunkSize, file.size),
        retryCount = 0,
        sendNextChunk, fileChunk;

    sendNextChunk = function () {
        updateProgress();
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
            async: false,
            url: ('../../Messaging/UploadChunk?id=' + currentChunk),
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
                successCallBack(fileName, "Attachment_Path" + fileCount, msgCode);               
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




var displayStatusMessage = function (message) {
    //$("#statusMessage").html(message);
    //alert(message)
}

var updateProgress = function () {
  
    $('#dvMessagingMain').block({
        message: '<h3>Loading...</h3>',
        css: { border: '2px solid #ddd' }
    });
        //$("#progressBar").css('display', 'block');
        //var progress = currentChunk / numberOfBlocks * 100;
        //if (progress <= 100) {
        //    $("#" + progressbar).simple_progressbar({ value: parseInt(progress), showValue: true });
        //    //$("#" + progressbar).progressbar("option", "value", parseInt(progress));
        //    //displayStatusMessage("Uploaded " + parseInt(progress) + "%");
        //}
    
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}