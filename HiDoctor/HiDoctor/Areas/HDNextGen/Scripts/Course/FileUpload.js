
function BeginFileUpload(postedFile, fileId, fileName, controllerName, actionName, successcallback, failurecallback, progressbar) {
    
    var fileControl = document.getElementById(fileId);
    if (fileControl.files.length > 0) {        
        if (fileControl.files.length > 0) {            
            for (var i = 0; i < fileControl.files.length; i++) {                
                UploadFile(postedFile, fileControl.files[i], i, fileName, controllerName, actionName, successcallback, failurecallback, progressbar);
            }
        }
    }
}

var UploadFile = function (postedFile, file, i, fileName, controllerName, actionName, successcallback, failurecallback, progressbar) {
    var formId = postedFile;    
    var options = {
        type: 'post',
        url: "/AdCourse/ChunkFileUpload",
        dataType: 'json',
        contentType: 'multipart/form-data',
        data: formId.fieldSerialize(),
        crossDomain: true,
        processData: false,
        success: function (data, statusText, xhr, $form) {
            if (statusText != null) {
                successcallback(data);
                //alert('success');
            }
            else {
                failurecallback();
            }
        },
        error: function (e) {
            alert('up:e');
        }
    };    
    formId.ajaxSubmit(options);    
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
