Type.registerNamespace("Sys.Mvc"); Sys.Mvc.$create_AjaxOptions = function () { return {} }; Sys.Mvc.InsertionMode = function () { }; Sys.Mvc.InsertionMode.prototype = { replace: 0, insertBefore: 1, insertAfter: 2 }; Sys.Mvc.InsertionMode.registerEnum("Sys.Mvc.InsertionMode", false); Sys.Mvc.AjaxContext = function (t, n, r, i) { this._request = t; this._updateTarget = n; this._loadingElement = r; this._insertionMode = i }; Sys.Mvc.AjaxContext.prototype = { _insertionMode: 0, _loadingElement: null, _response: null, _request: null, _updateTarget: null, get_data: function () { if (this._response) { return this._response.get_responseData() } else { return null } }, get_insertionMode: function () { return this._insertionMode }, get_loadingElement: function () { return this._loadingElement }, get_object: function () { var t = this.get_response(); return t ? t.get_object() : null }, get_response: function () { return this._response }, set_response: function (t) { this._response = t; return t }, get_request: function () { return this._request }, get_updateTarget: function () { return this._updateTarget } }; Sys.Mvc.AsyncHyperlink = function () { }; Sys.Mvc.AsyncHyperlink.handleClick = function (t, n, r) { n.preventDefault(); Sys.Mvc.MvcHelpers._asyncRequest(t.href, "post", "", t, r) }; Sys.Mvc.MvcHelpers = function () { }; Sys.Mvc.MvcHelpers._serializeSubmitButton = function (t, n, r) { if (t.disabled) { return null } var i = t.name; if (i) { var s = t.tagName.toUpperCase(); var o = encodeURIComponent(i); var u = t; if (s === "INPUT") { var a = u.type; if (a === "submit") { return o + "=" + encodeURIComponent(u.value) } else if (a === "image") { return o + ".x=" + n + "&" + o + ".y=" + r } } else if (s === "BUTTON" && i.length && u.type === "submit") { return o + "=" + encodeURIComponent(u.value) } } return null }; Sys.Mvc.MvcHelpers._serializeForm = function (t) { var n = t.elements; var r = new Sys.StringBuilder; var i = n.length; for (var s = 0; s < i; s++) { var o = n[s]; var u = o.name; if (!u || !u.length) { continue } var a = o.tagName.toUpperCase(); if (a === "INPUT") { var f = o; var l = f.type; if (l === "text" || l === "password" || l === "hidden" || (l === "checkbox" || l === "radio") && o.checked) { r.append(encodeURIComponent(u)); r.append("="); r.append(encodeURIComponent(f.value)); r.append("&") } } else if (a === "SELECT") { var c = o; var h = c.options.length; for (var p = 0; p < h; p++) { var d = c.options[p]; if (d.selected) { r.append(encodeURIComponent(u)); r.append("="); r.append(encodeURIComponent(d.value)); r.append("&") } } } else if (a === "TEXTAREA") { r.append(encodeURIComponent(u)); r.append("="); r.append(encodeURIComponent(o.value)); r.append("&") } } var v = t._additionalInput; if (v) { r.append(v); r.append("&") } return r.toString() }; Sys.Mvc.MvcHelpers._asyncRequest = function (t, n, r, i, s) { if (s.confirm) { if (!confirm(s.confirm)) { return } } if (s.url) { t = s.url } if (s.httpMethod) { n = s.httpMethod } if (r.length > 0 && !r.endsWith("&")) { r += "&" } r += "X-Requested-With=XMLHttpRequest"; var o = n.toUpperCase(); var u = o === "GET" || o === "POST"; if (!u) { r += "&"; r += "X-HTTP-Method-Override=" + o } var a = ""; if (o === "GET" || o === "DELETE") { if (t.indexOf("?") > -1) { if (!t.endsWith("&")) { t += "&" } t += r } else { t += "?"; t += r } } else { a = r } var f = new Sys.Net.WebRequest; f.set_url(t); if (u) { f.set_httpVerb(n) } else { f.set_httpVerb("POST"); f.get_headers()["X-HTTP-Method-Override"] = o } f.set_body(a); if (n.toUpperCase() === "PUT") { f.get_headers()["Content-Type"] = "application/x-www-form-urlencoded;" } f.get_headers()["X-Requested-With"] = "XMLHttpRequest"; var l = null; if (s.updateTargetId) { l = $get(s.updateTargetId) } var c = null; if (s.loadingElementId) { c = $get(s.loadingElementId) } var h = new Sys.Mvc.AjaxContext(f, l, c, s.insertionMode); var p = true; if (s.onBegin) { p = s.onBegin(h) !== false } if (c) { Sys.UI.DomElement.setVisible(h.get_loadingElement(), true) } if (p) { f.add_completed(Function.createDelegate(null, function (e) { Sys.Mvc.MvcHelpers._onComplete(f, s, h) })); f.invoke() } }; Sys.Mvc.MvcHelpers._onComplete = function Sys_Mvc_MvcHelpers$_onComplete(request, ajaxOptions, ajaxContext) { ajaxContext.set_response(request.get_executor()); if (ajaxOptions.onComplete && ajaxOptions.onComplete(ajaxContext) === false) { return } var statusCode = ajaxContext.get_response().get_statusCode(); if (statusCode >= 200 && statusCode < 300 || statusCode === 304 || statusCode === 1223) { if (statusCode !== 204 && statusCode !== 304 && statusCode !== 1223) { var contentType = ajaxContext.get_response().getResponseHeader("Content-Type"); if (contentType && contentType.indexOf("application/x-javascript") !== -1) { eval(ajaxContext.get_data()) } else { Sys.Mvc.MvcHelpers.updateDomElement(ajaxContext.get_updateTarget(), ajaxContext.get_insertionMode(), ajaxContext.get_data()) } } if (ajaxOptions.onSuccess) { ajaxOptions.onSuccess(ajaxContext) } } else { if (ajaxOptions.onFailure) { ajaxOptions.onFailure(ajaxContext) } } if (ajaxContext.get_loadingElement()) { Sys.UI.DomElement.setVisible(ajaxContext.get_loadingElement(), false) } }; Sys.Mvc.MvcHelpers.updateDomElement = function (t, n, r) { if (t) { switch (n) { case Sys.Mvc.InsertionMode.replace: t.innerHTML = r; break; case Sys.Mvc.InsertionMode.insertBefore: if (r && r.length > 0) { t.innerHTML = r + t.innerHTML.trimStart() } break; case Sys.Mvc.InsertionMode.insertAfter: if (r && r.length > 0) { t.innerHTML = t.innerHTML.trimEnd() + r } break } } }; Sys.Mvc.AsyncForm = function () { }; Sys.Mvc.AsyncForm.handleClick = function (t, n) { var r = Sys.Mvc.MvcHelpers._serializeSubmitButton(n.target, n.offsetX, n.offsetY); t._additionalInput = r }; Sys.Mvc.AsyncForm.handleSubmit = function (t, n, r) { n.preventDefault(); var i = t.validationCallbacks; if (i) { for (var s = 0; s < i.length; s++) { var o = i[s]; if (!o()) { return } } } var u = Sys.Mvc.MvcHelpers._serializeForm(t); Sys.Mvc.MvcHelpers._asyncRequest(t.action, t.method || "post", u, t, r) }; Sys.Mvc.AjaxContext.registerClass("Sys.Mvc.AjaxContext"); Sys.Mvc.AsyncHyperlink.registerClass("Sys.Mvc.AsyncHyperlink"); Sys.Mvc.MvcHelpers.registerClass("Sys.Mvc.MvcHelpers"); Sys.Mvc.AsyncForm.registerClass("Sys.Mvc.AsyncForm")