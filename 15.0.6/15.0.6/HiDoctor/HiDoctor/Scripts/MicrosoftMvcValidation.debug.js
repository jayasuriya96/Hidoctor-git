Type.registerNamespace("Sys.Mvc"); Sys.Mvc.$create_Validation = function () { return {} }; Sys.Mvc.$create_JsonValidationField = function () { return {} }; Sys.Mvc.$create_JsonValidationOptions = function () { return {} }; Sys.Mvc.$create_JsonValidationRule = function () { return {} }; Sys.Mvc.$create_ValidationContext = function () { return {} }; Sys.Mvc.NumberValidator = function () { }; Sys.Mvc.NumberValidator.create = function (t) { return Function.createDelegate(new Sys.Mvc.NumberValidator, (new Sys.Mvc.NumberValidator).validate) }; Sys.Mvc.NumberValidator.prototype = { validate: function (t, n) { if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(t)) { return true } var r = Number.parseLocale(t); return !isNaN(r) } }; Sys.Mvc.FormContext = function (t, n) { this._errors = []; this.fields = new Array(0); this._formElement = t; this._validationSummaryElement = n; t[Sys.Mvc.FormContext._formValidationTag] = this; if (n) { var r = n.getElementsByTagName("ul"); if (r.length > 0) { this._validationSummaryULElement = r[0] } } this._onClickHandler = Function.createDelegate(this, this._form_OnClick); this._onSubmitHandler = Function.createDelegate(this, this._form_OnSubmit) }; Sys.Mvc.FormContext._Application_Load = function () { var t = window.mvcClientValidationMetadata; if (t) { while (t.length > 0) { var n = t.pop(); Sys.Mvc.FormContext._parseJsonOptions(n) } } }; Sys.Mvc.FormContext._getFormElementsWithName = function (t, n) { var r = []; var i = document.getElementsByName(n); for (var s = 0; s < i.length; s++) { var o = i[s]; if (Sys.Mvc.FormContext._isElementInHierarchy(t, o)) { Array.add(r, o) } } return r }; Sys.Mvc.FormContext.getValidationForForm = function (t) { return t[Sys.Mvc.FormContext._formValidationTag] }; Sys.Mvc.FormContext._isElementInHierarchy = function (t, n) { while (n) { if (t === n) { return true } n = n.parentNode } return false }; Sys.Mvc.FormContext._parseJsonOptions = function (t) { var n = $get(t.FormId); var r = !Sys.Mvc._validationUtil.stringIsNullOrEmpty(t.ValidationSummaryId) ? $get(t.ValidationSummaryId) : null; var i = new Sys.Mvc.FormContext(n, r); i.enableDynamicValidation(); i.replaceValidationSummary = t.ReplaceValidationSummary; for (var s = 0; s < t.Fields.length; s++) { var o = t.Fields[s]; var u = Sys.Mvc.FormContext._getFormElementsWithName(n, o.FieldName); var a = !Sys.Mvc._validationUtil.stringIsNullOrEmpty(o.ValidationMessageId) ? $get(o.ValidationMessageId) : null; var f = new Sys.Mvc.FieldContext(i); Array.addRange(f.elements, u); f.validationMessageElement = a; f.replaceValidationMessageContents = o.ReplaceValidationMessageContents; for (var l = 0; l < o.ValidationRules.length; l++) { var c = o.ValidationRules[l]; var h = Sys.Mvc.ValidatorRegistry.getValidator(c); if (h) { var p = Sys.Mvc.$create_Validation(); p.fieldErrorMessage = c.ErrorMessage; p.validator = h; Array.add(f.validations, p) } } f.enableDynamicValidation(); Array.add(i.fields, f) } var d = n.validationCallbacks; if (!d) { d = []; n.validationCallbacks = d } d.push(Function.createDelegate(null, function () { return Sys.Mvc._validationUtil.arrayIsNullOrEmpty(i.validate("submit")) })); return i }; Sys.Mvc.FormContext.prototype = { _onClickHandler: null, _onSubmitHandler: null, _submitButtonClicked: null, _validationSummaryElement: null, _validationSummaryULElement: null, _formElement: null, replaceValidationSummary: false, addError: function (t) { this.addErrors([t]) }, addErrors: function (t) { if (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(t)) { Array.addRange(this._errors, t); this._onErrorCountChanged() } }, clearErrors: function () { Array.clear(this._errors); this._onErrorCountChanged() }, _displayError: function () { if (this._validationSummaryElement) { if (this._validationSummaryULElement) { Sys.Mvc._validationUtil.removeAllChildren(this._validationSummaryULElement); for (var t = 0; t < this._errors.length; t++) { var n = document.createElement("li"); Sys.Mvc._validationUtil.setInnerText(n, this._errors[t]); this._validationSummaryULElement.appendChild(n) } } Sys.UI.DomElement.removeCssClass(this._validationSummaryElement, Sys.Mvc.FormContext._validationSummaryValidCss); Sys.UI.DomElement.addCssClass(this._validationSummaryElement, Sys.Mvc.FormContext._validationSummaryErrorCss) } }, _displaySuccess: function () { var t = this._validationSummaryElement; if (t) { var n = this._validationSummaryULElement; if (n) { n.innerHTML = "" } Sys.UI.DomElement.removeCssClass(t, Sys.Mvc.FormContext._validationSummaryErrorCss); Sys.UI.DomElement.addCssClass(t, Sys.Mvc.FormContext._validationSummaryValidCss) } }, enableDynamicValidation: function () { Sys.UI.DomEvent.addHandler(this._formElement, "click", this._onClickHandler); Sys.UI.DomEvent.addHandler(this._formElement, "submit", this._onSubmitHandler) }, _findSubmitButton: function (t) { if (t.disabled) { return null } var n = t.tagName.toUpperCase(); var r = t; if (n === "INPUT") { var i = r.type; if (i === "submit" || i === "image") { return r } } else if (n === "BUTTON" && r.type === "submit") { return r } return null }, _form_OnClick: function (t) { this._submitButtonClicked = this._findSubmitButton(t.target) }, _form_OnSubmit: function (t) { var n = t.target; var r = this._submitButtonClicked; if (r && r.disableValidation) { return } var i = this.validate("submit"); if (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(i)) { t.preventDefault() } }, _onErrorCountChanged: function () { if (!this._errors.length) { this._displaySuccess() } else { this._displayError() } }, validate: function (t) { var n = this.fields; var r = []; for (var i = 0; i < n.length; i++) { var s = n[i]; if (!s.elements[0].disabled) { var o = s.validate(t); if (o) { Array.addRange(r, o) } } } if (this.replaceValidationSummary) { this.clearErrors(); this.addErrors(r) } return r } }; Sys.Mvc.FieldContext = function (t) { this._errors = []; this.elements = new Array(0); this.validations = new Array(0); this.formContext = t; this._onBlurHandler = Function.createDelegate(this, this._element_OnBlur); this._onChangeHandler = Function.createDelegate(this, this._element_OnChange); this._onInputHandler = Function.createDelegate(this, this._element_OnInput); this._onPropertyChangeHandler = Function.createDelegate(this, this._element_OnPropertyChange) }; Sys.Mvc.FieldContext.prototype = { _onBlurHandler: null, _onChangeHandler: null, _onInputHandler: null, _onPropertyChangeHandler: null, defaultErrorMessage: null, formContext: null, replaceValidationMessageContents: false, validationMessageElement: null, addError: function (t) { this.addErrors([t]) }, addErrors: function (t) { if (!Sys.Mvc._validationUtil.arrayIsNullOrEmpty(t)) { Array.addRange(this._errors, t); this._onErrorCountChanged() } }, clearErrors: function () { Array.clear(this._errors); this._onErrorCountChanged() }, _displayError: function () { var t = this.validationMessageElement; if (t) { if (this.replaceValidationMessageContents) { Sys.Mvc._validationUtil.setInnerText(t, this._errors[0]) } Sys.UI.DomElement.removeCssClass(t, Sys.Mvc.FieldContext._validationMessageValidCss); Sys.UI.DomElement.addCssClass(t, Sys.Mvc.FieldContext._validationMessageErrorCss) } var n = this.elements; for (var r = 0; r < n.length; r++) { var i = n[r]; Sys.UI.DomElement.removeCssClass(i, Sys.Mvc.FieldContext._inputElementValidCss); Sys.UI.DomElement.addCssClass(i, Sys.Mvc.FieldContext._inputElementErrorCss) } }, _displaySuccess: function () { var t = this.validationMessageElement; if (t) { if (this.replaceValidationMessageContents) { Sys.Mvc._validationUtil.setInnerText(t, "") } Sys.UI.DomElement.removeCssClass(t, Sys.Mvc.FieldContext._validationMessageErrorCss); Sys.UI.DomElement.addCssClass(t, Sys.Mvc.FieldContext._validationMessageValidCss) } var n = this.elements; for (var r = 0; r < n.length; r++) { var i = n[r]; Sys.UI.DomElement.removeCssClass(i, Sys.Mvc.FieldContext._inputElementErrorCss); Sys.UI.DomElement.addCssClass(i, Sys.Mvc.FieldContext._inputElementValidCss) } }, _element_OnBlur: function (t) { if (t.target[Sys.Mvc.FieldContext._hasTextChangedTag] || t.target[Sys.Mvc.FieldContext._hasValidationFiredTag]) { this.validate("blur") } }, _element_OnChange: function (t) { t.target[Sys.Mvc.FieldContext._hasTextChangedTag] = true }, _element_OnInput: function (t) { t.target[Sys.Mvc.FieldContext._hasTextChangedTag] = true; if (t.target[Sys.Mvc.FieldContext._hasValidationFiredTag]) { this.validate("input") } }, _element_OnPropertyChange: function (t) { if (t.rawEvent.propertyName === "value") { t.target[Sys.Mvc.FieldContext._hasTextChangedTag] = true; if (t.target[Sys.Mvc.FieldContext._hasValidationFiredTag]) { this.validate("input") } } }, enableDynamicValidation: function () { var t = this.elements; for (var n = 0; n < t.length; n++) { var r = t[n]; if (Sys.Mvc._validationUtil.elementSupportsEvent(r, "onpropertychange")) { var i = document.documentMode; if (i && i >= 8) { Sys.UI.DomEvent.addHandler(r, "propertychange", this._onPropertyChangeHandler) } } else { Sys.UI.DomEvent.addHandler(r, "input", this._onInputHandler) } Sys.UI.DomEvent.addHandler(r, "change", this._onChangeHandler); Sys.UI.DomEvent.addHandler(r, "blur", this._onBlurHandler) } }, _getErrorString: function (t, n) { var r = n || this.defaultErrorMessage; if (Boolean.isInstanceOfType(t)) { return t ? null : r } if (String.isInstanceOfType(t)) { return t.length ? t : r } return null }, _getStringValue: function () { var t = this.elements; return t.length > 0 ? t[0].value : null }, _markValidationFired: function () { var t = this.elements; for (var n = 0; n < t.length; n++) { var r = t[n]; r[Sys.Mvc.FieldContext._hasValidationFiredTag] = true } }, _onErrorCountChanged: function () { if (!this._errors.length) { this._displaySuccess() } else { this._displayError() } }, validate: function (t) { var n = this.validations; var r = []; var i = this._getStringValue(); for (var s = 0; s < n.length; s++) { var o = n[s]; var u = Sys.Mvc.$create_ValidationContext(); u.eventName = t; u.fieldContext = this; u.validation = o; var a = o.validator(i, u); var f = this._getErrorString(a, o.fieldErrorMessage); if (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(f)) { Array.add(r, f) } } this._markValidationFired(); this.clearErrors(); this.addErrors(r); return r } }; Sys.Mvc.RangeValidator = function (t, n) { this._minimum = t; this._maximum = n }; Sys.Mvc.RangeValidator.create = function (t) { var n = t.ValidationParameters["min"]; var r = t.ValidationParameters["max"]; return Function.createDelegate(new Sys.Mvc.RangeValidator(n, r), (new Sys.Mvc.RangeValidator(n, r)).validate) }; Sys.Mvc.RangeValidator.prototype = { _minimum: null, _maximum: null, validate: function (t, n) { if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(t)) { return true } var r = Number.parseLocale(t); return !isNaN(r) && this._minimum <= r && r <= this._maximum } }; Sys.Mvc.RegularExpressionValidator = function (t) { this._pattern = t }; Sys.Mvc.RegularExpressionValidator.create = function (t) { var n = t.ValidationParameters["pattern"]; return Function.createDelegate(new Sys.Mvc.RegularExpressionValidator(n), (new Sys.Mvc.RegularExpressionValidator(n)).validate) }; Sys.Mvc.RegularExpressionValidator.prototype = { _pattern: null, validate: function (t, n) { if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(t)) { return true } var r = new RegExp(this._pattern); var i = r.exec(t); return !Sys.Mvc._validationUtil.arrayIsNullOrEmpty(i) && i[0].length === t.length } }; Sys.Mvc.RequiredValidator = function () { }; Sys.Mvc.RequiredValidator.create = function (t) { return Function.createDelegate(new Sys.Mvc.RequiredValidator, (new Sys.Mvc.RequiredValidator).validate) }; Sys.Mvc.RequiredValidator._isRadioInputElement = function (t) { if (t.tagName.toUpperCase() === "INPUT") { var n = t.type.toUpperCase(); if (n === "RADIO") { return true } } return false }; Sys.Mvc.RequiredValidator._isSelectInputElement = function (t) { if (t.tagName.toUpperCase() === "SELECT") { return true } return false }; Sys.Mvc.RequiredValidator._isTextualInputElement = function (t) { if (t.tagName.toUpperCase() === "INPUT") { var n = t.type.toUpperCase(); switch (n) { case "TEXT": case "PASSWORD": case "FILE": return true } } if (t.tagName.toUpperCase() === "TEXTAREA") { return true } return false }; Sys.Mvc.RequiredValidator._validateRadioInput = function (t) { for (var n = 0; n < t.length; n++) { var r = t[n]; if (r.checked) { return true } } return false }; Sys.Mvc.RequiredValidator._validateSelectInput = function (t) { for (var n = 0; n < t.length; n++) { var r = t[n]; if (r.selected) { if (!Sys.Mvc._validationUtil.stringIsNullOrEmpty(r.value)) { return true } } } return false }; Sys.Mvc.RequiredValidator._validateTextualInput = function (t) { return !Sys.Mvc._validationUtil.stringIsNullOrEmpty(t.value) }; Sys.Mvc.RequiredValidator.prototype = { validate: function (t, n) { var r = n.fieldContext.elements; if (!r.length) { return true } var i = r[0]; if (Sys.Mvc.RequiredValidator._isTextualInputElement(i)) { return Sys.Mvc.RequiredValidator._validateTextualInput(i) } if (Sys.Mvc.RequiredValidator._isRadioInputElement(i)) { return Sys.Mvc.RequiredValidator._validateRadioInput(r) } if (Sys.Mvc.RequiredValidator._isSelectInputElement(i)) { return Sys.Mvc.RequiredValidator._validateSelectInput(i.options) } return true } }; Sys.Mvc.StringLengthValidator = function (t, n) { this._minLength = t; this._maxLength = n }; Sys.Mvc.StringLengthValidator.create = function (t) { var n = t.ValidationParameters["min"] || 0; var r = t.ValidationParameters["max"] || Number.MAX_VALUE; return Function.createDelegate(new Sys.Mvc.StringLengthValidator(n, r), (new Sys.Mvc.StringLengthValidator(n, r)).validate) }; Sys.Mvc.StringLengthValidator.prototype = { _maxLength: 0, _minLength: 0, validate: function (t, n) { if (Sys.Mvc._validationUtil.stringIsNullOrEmpty(t)) { return true } return this._minLength <= t.length && t.length <= this._maxLength } }; Sys.Mvc._validationUtil = function () { }; Sys.Mvc._validationUtil.arrayIsNullOrEmpty = function (t) { return !t || !t.length }; Sys.Mvc._validationUtil.stringIsNullOrEmpty = function (t) { return !t || !t.length }; Sys.Mvc._validationUtil.elementSupportsEvent = function (t, n) { return n in t }; Sys.Mvc._validationUtil.removeAllChildren = function (t) { while (t.firstChild) { t.removeChild(t.firstChild) } }; Sys.Mvc._validationUtil.setInnerText = function (t, n) { var r = document.createTextNode(n); Sys.Mvc._validationUtil.removeAllChildren(t); t.appendChild(r) }; Sys.Mvc.ValidatorRegistry = function () { }; Sys.Mvc.ValidatorRegistry.getValidator = function (t) { var n = Sys.Mvc.ValidatorRegistry.validators[t.ValidationType]; return n ? n(t) : null }; Sys.Mvc.ValidatorRegistry._getDefaultValidators = function () { return { required: Function.createDelegate(null, Sys.Mvc.RequiredValidator.create), length: Function.createDelegate(null, Sys.Mvc.StringLengthValidator.create), regex: Function.createDelegate(null, Sys.Mvc.RegularExpressionValidator.create), range: Function.createDelegate(null, Sys.Mvc.RangeValidator.create), number: Function.createDelegate(null, Sys.Mvc.NumberValidator.create) } }; Sys.Mvc.NumberValidator.registerClass("Sys.Mvc.NumberValidator"); Sys.Mvc.FormContext.registerClass("Sys.Mvc.FormContext"); Sys.Mvc.FieldContext.registerClass("Sys.Mvc.FieldContext"); Sys.Mvc.RangeValidator.registerClass("Sys.Mvc.RangeValidator"); Sys.Mvc.RegularExpressionValidator.registerClass("Sys.Mvc.RegularExpressionValidator"); Sys.Mvc.RequiredValidator.registerClass("Sys.Mvc.RequiredValidator"); Sys.Mvc.StringLengthValidator.registerClass("Sys.Mvc.StringLengthValidator"); Sys.Mvc._validationUtil.registerClass("Sys.Mvc._validationUtil"); Sys.Mvc.ValidatorRegistry.registerClass("Sys.Mvc.ValidatorRegistry"); Sys.Mvc.FormContext._validationSummaryErrorCss = "validation-summary-errors"; Sys.Mvc.FormContext._validationSummaryValidCss = "validation-summary-valid"; Sys.Mvc.FormContext._formValidationTag = "__MVC_FormValidation"; Sys.Mvc.FieldContext._hasTextChangedTag = "__MVC_HasTextChanged"; Sys.Mvc.FieldContext._hasValidationFiredTag = "__MVC_HasValidationFired"; Sys.Mvc.FieldContext._inputElementErrorCss = "input-validation-error"; Sys.Mvc.FieldContext._inputElementValidCss = "input-validation-valid"; Sys.Mvc.FieldContext._validationMessageErrorCss = "field-validation-error"; Sys.Mvc.FieldContext._validationMessageValidCss = "field-validation-valid"; Sys.Mvc.ValidatorRegistry.validators = Sys.Mvc.ValidatorRegistry._getDefaultValidators(); Sys.Application.add_load(function () { Sys.Application.remove_load(arguments.callee); Sys.Mvc.FormContext._Application_Load() })