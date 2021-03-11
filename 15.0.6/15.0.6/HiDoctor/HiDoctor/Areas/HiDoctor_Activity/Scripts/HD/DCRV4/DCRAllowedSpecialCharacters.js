// DCR Doctor Name.
var DCRAllowedSpecialCharacters = {
    CheckDCRSpecialCharacterGroupFlexi: function (inputObject) {
        var DCRGROUPFLEXICHARS = new RegExp("^[-a-zA-Z0-9 .|]+$");
        if ($.trim($(inputObject).val()).length > 0) {
            if (!DCRGROUPFLEXICHARS.test($(inputObject).val())) {
                return false;
            }
            return true;
        }
        return true;
    },
    CheckDCRSpecialCharacterGroup0: function (inputObject) {
        var DCRGROUP0CHARS = new RegExp("^[-a-zA-Z0-9 _.|*]+$");
        if ($.trim($(inputObject).val()).length > 0) {
            if (!DCRGROUP0CHARS.test($(inputObject).val())) {
                return false;
            }
            return true;
        }
        return true;
    },

    // DCR Flexi TextBoxes Eg: CP, SFC, Chemist, Competitor Product.
    CheckDCRSpecialCharacterGroup1: function (inputObject) {
        var DCRGROUP1CHARS = new RegExp("^[-a-zA-Z0-9 _().]+$");
        if ($.trim($(inputObject).val()).length > 0) {
            if (!DCRGROUP1CHARS.test($(inputObject).val())) {
                return false;
            }
            return true;
        }
        else {
            return true;
        }
    },

    // DCR 3 screens Remarks.
    CheckDCRSpecialCharacterGroup2: function (inputObject) {
        debugger;
        if ($.trim($(inputObject).val()).length > 0) {
            var DCRGROUP2CHARS = new RegExp("^[-a-zA-Z0-9. _()@,\n\r\r\n]+$");
            if (!DCRGROUP2CHARS.test($(inputObject).val())) {
                return false;
            }
            return true;
        }
        else {
            return true;
        }
    },
    // Work Place.
    CheckDCRSpecialCharacterworkplace: function (inputObject) {
        debugger;
        if ($.trim($(inputObject).val()).length > 0) {
            var DCRGROUP2CHARS = new RegExp("^[-a-zA-Z0-9. _()@\n\r\r\n]+$");
            if (!DCRGROUP2CHARS.test($(inputObject).val())) {
                return false;
            }
            return true;
        }
        else {
            return true;
        }
    },

    // DCR Time Pickers : and Space only allowed.
    CheckDCRSpecialCharacterGroup3: function (inputObject) {
        if ($.trim($(inputObject).val()).length > 0) {
            var DCRGROUP3CHARS = new RegExp("^[0-9 :]+$");
            if (!DCRGROUP2CHARS.test($(inputObject).val())) {
                return false;
            }
            return true;
        }
        else {
            return true;
        }
    },
}