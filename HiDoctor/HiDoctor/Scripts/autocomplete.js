function autoComplete(e, t, n, r) {
    function i(e, i, s) {
        if ($("#" + this.id).hasClass(r)) {
            $("#" + this.id.replace(t, n)).val(i.value)
        }
    }

    function s(e) {
        return e[0] + " (<strong>id: " + e[1] + "</strong>)"
    }

    function o(e) {
        return e[0].replace(/(<.+?>)/gi, "")
    }
    $("." + r).unautocomplete();
   
    $("." + r).autocomplete(e, {
        minChars: 0,
        width: 310,
        matchContains: "word",
        autoFill: false,
        formatItem: function (e, t, n) {
            return e.label
        },
        formatMatch: function (e, t, n) {
            return e.label
        },
        formatResult: function (e) {
            return e.label
        }
    });
    $(":text, textarea").result(i).next().unbind('click').bind('click', function () {
        $(this).prev().search();
    });
    $("#scrollChange").unbind('click').bind('click', function() { changeScrollHeight(); });
    $("#clear").unbind('click').bind('click', function () {
        $(":input").unautocomplete();
    });
}

function changeOptions() {
    var e = parseInt(window.prompt("Please type number of items to display:", jQuery.Autocompleter.defaults.max));
    if (e > 0) {
        $("#suggest1").setOptions({
            max: e
        })
    }
}

function changeScrollHeight() {
    var e = parseInt(window.prompt("Please type new scroll height (number in pixels):", jQuery.Autocompleter.defaults.scrollHeight));
    if (e > 0) {
        $("#suggest1").setOptions({
            scrollHeight: e
        })
    }
}

function fnValidateAutofill(e, t, n, r) {
    if ($(e).val() != "") {
        var i = "false";
        var s = "";
        for (var o = 0; o <= t.length - 1; o++) {
            if (t[o].label == $(e).val()) {
                i = "true";
                s = t[o].value
            }
        }
        if (i == "false") {
            $("#" + e.id.replace(n, r)).val("")
        } else {
            $("#" + e.id.replace(n, r)).val(s)
        }
    } else {
        $("#" + e.id.replace(n, r)).val("")
    }
}