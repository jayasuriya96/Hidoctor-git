window.Modernizr = function (e, t, n) { function C(e) { l.cssText = e } function k(e, t) { return C(d.join(e + ";") + (t || "")) } function L(e, t) { return typeof e === t } function A(e, t) { return ("" + e).indexOf(t) !== -1 } function O(e, t) { for (var r in e) { if (l[e[r]] !== n && (!t || t(e[r], f))) { return true } } } function M(e, t) { var n = e.charAt(0).toUpperCase() + e.substr(1), r = (e + " " + v.join(n + " ") + n).split(" "); return !!O(r, t) } function _() { i["input"] = function (e) { for (var t = 0, n = e.length; t < n; t++) { b[e[t]] = !!(e[t] in c) } return b }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")); i["inputtypes"] = function (e) { for (var r = 0, i, s, u, a = e.length; r < a; r++) { c.setAttribute("type", s = e[r]); i = c.type !== "text"; if (i) { c.value = h; c.style.cssText = "position:absolute;visibility:hidden;"; if (/^range$/.test(s) && c.style.WebkitAppearance !== n) { o.appendChild(c); u = t.defaultView; i = u.getComputedStyle && u.getComputedStyle(c, null).WebkitAppearance !== "textfield" && c.offsetHeight !== 0; o.removeChild(c) } else if (/^(search|tel)$/.test(s)) { } else if (/^(url|email)$/.test(s)) { i = c.checkValidity && c.checkValidity() === false } else if (/^color$/.test(s)) { o.appendChild(c); o.offsetWidth; i = c.value != h; o.removeChild(c) } else { i = c.value != h } } y[e[r]] = !!i } return y }("search tel url email datetime date month week time datetime-local number range color".split(" ")) } var r = "1.7", i = {}, s = true, o = t.documentElement, u = t.head || t.getElementsByTagName("head")[0], a = "modernizr", f = t.createElement(a), l = f.style, c = t.createElement("input"), h = ":)", p = Object.prototype.toString, d = " -webkit- -moz- -o- -ms- -khtml- ".split(" "), v = "Webkit Moz O ms Khtml".split(" "), m = { svg: "http://www.w3.org/2000/svg" }, g = {}, y = {}, b = {}, w = [], E, S = function (e) { var n = t.createElement("style"), r = t.createElement("div"), i; n.textContent = e + "{#modernizr{height:3px}}"; u.appendChild(n); r.id = "modernizr"; o.appendChild(r); i = r.offsetHeight === 3; n.parentNode.removeChild(n); r.parentNode.removeChild(r); return !!i }, x = function () { function r(r, i) { i = i || t.createElement(e[r] || "div"); r = "on" + r; var s = r in i; if (!s) { if (!i.setAttribute) { i = t.createElement("div") } if (i.setAttribute && i.removeAttribute) { i.setAttribute(r, ""); s = L(i[r], "function"); if (!L(i[r], n)) { i[r] = n } i.removeAttribute(r) } } i = null; return s } var e = { select: "input", change: "input", submit: "form", reset: "form", error: "img", load: "img", abort: "img" }; return r }(); var T = {}.hasOwnProperty, N; if (!L(T, n) && !L(T.call, n)) { N = function (e, t) { return T.call(e, t) } } else { N = function (e, t) { return t in e && L(e.constructor.prototype[t], n) } } g["flexbox"] = function () { function e(e, t, n, r) { t += ":"; e.style.cssText = (t + d.join(n + ";" + t)).slice(0, -t.length) + (r || "") } function n(e, t, n, r) { e.style.cssText = d.join(t + ":" + n + ";") + (r || "") } var r = t.createElement("div"), i = t.createElement("div"); e(r, "display", "box", "width:42px;padding:0;"); n(i, "box-flex", "1", "width:10px;"); r.appendChild(i); o.appendChild(r); var s = i.offsetWidth === 42; r.removeChild(i); o.removeChild(r); return s }; g["canvas"] = function () { var e = t.createElement("canvas"); return !!(e.getContext && e.getContext("2d")) }; g["canvastext"] = function () { return !!(i["canvas"] && L(t.createElement("canvas").getContext("2d").fillText, "function")) }; g["webgl"] = function () { return !!e.WebGLRenderingContext }; g["touch"] = function () { return "ontouchstart" in e || S("@media (" + d.join("touch-enabled),(") + "modernizr)") }; g["geolocation"] = function () { return !!navigator.geolocation }; g["postmessage"] = function () { return !!e.postMessage }; g["websqldatabase"] = function () { var t = !!e.openDatabase; return t }; g["indexedDB"] = function () { for (var t = -1, n = v.length; ++t < n;) { var r = v[t].toLowerCase(); if (e[r + "_indexedDB"] || e[r + "IndexedDB"]) { return true } } return false }; g["hashchange"] = function () { return x("hashchange", e) && (t.documentMode === n || t.documentMode > 7) }; g["history"] = function () { return !!(e.history && history.pushState) }; g["draganddrop"] = function () { return x("dragstart") && x("drop") }; g["websockets"] = function () { return "WebSocket" in e }; g["rgba"] = function () { C("background-color:rgba(150,255,150,.5)"); return A(l.backgroundColor, "rgba") }; g["hsla"] = function () { C("background-color:hsla(120,40%,100%,.5)"); return A(l.backgroundColor, "rgba") || A(l.backgroundColor, "hsla") }; g["multiplebgs"] = function () { C("background:url(//:),url(//:),red url(//:)"); return (new RegExp("(url\\s*\\(.*?){3}")).test(l.background) }; g["backgroundsize"] = function () { return M("backgroundSize") }; g["borderimage"] = function () { return M("borderImage") }; g["borderradius"] = function () { return M("borderRadius", "", function (e) { return A(e, "orderRadius") }) }; g["boxshadow"] = function () { return M("boxShadow") }; g["textshadow"] = function () { return t.createElement("div").style.textShadow === "" }; g["opacity"] = function () { k("opacity:.55"); return /^0.55$/.test(l.opacity) }; g["cssanimations"] = function () { return M("animationName") }; g["csscolumns"] = function () { return M("columnCount") }; g["cssgradients"] = function () { var e = "background-image:", t = "gradient(linear,left top,right bottom,from(#9f9),to(white));", n = "linear-gradient(left top,#9f9, white);"; C((e + d.join(t + e) + d.join(n + e)).slice(0, -e.length)); return A(l.backgroundImage, "gradient") }; g["cssreflections"] = function () { return M("boxReflect") }; g["csstransforms"] = function () { return !!O(["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"]) }; g["csstransforms3d"] = function () { var e = !!O(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]); if (e && "webkitPerspective" in o.style) { e = S("@media (" + d.join("transform-3d),(") + "modernizr)") } return e }; g["csstransitions"] = function () { return M("transitionProperty") }; g["fontface"] = function () { var e, n, r = u || o, i = t.createElement("style"), s = t.implementation || { hasFeature: function () { return false } }; i.type = "text/css"; r.insertBefore(i, r.firstChild); e = i.sheet || i.styleSheet; var a = s.hasFeature("CSS2", "") ? function (t) { if (!(e && t)) return false; var n = false; try { e.insertRule(t, 0); n = /src/i.test(e.cssRules[0].cssText); e.deleteRule(e.cssRules.length - 1) } catch (r) { } return n } : function (t) { if (!(e && t)) return false; e.cssText = t; return e.cssText.length !== 0 && /src/i.test(e.cssText) && e.cssText.replace(/\r+|\n+/g, "").indexOf(t.split(" ")[0]) === 0 }; n = a('@font-face { font-family: "font"; src: url(data:,); }'); r.removeChild(i); return n }; g["video"] = function () { var e = t.createElement("video"), n = !!e.canPlayType; if (n) { n = new Boolean(n); n.ogg = e.canPlayType('video/ogg; codecs="theora"'); var r = 'video/mp4; codecs="avc1.42E01E'; n.h264 = e.canPlayType(r + '"') || e.canPlayType(r + ', mp4a.40.2"'); n.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"') } return n }; g["audio"] = function () { var e = t.createElement("audio"), n = !!e.canPlayType; if (n) { n = new Boolean(n); n.ogg = e.canPlayType('audio/ogg; codecs="vorbis"'); n.mp3 = e.canPlayType("audio/mpeg;"); n.wav = e.canPlayType('audio/wav; codecs="1"'); n.m4a = e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;") } return n }; g["localstorage"] = function () { try { return !!localStorage.getItem } catch (e) { return false } }; g["sessionstorage"] = function () { try { return !!sessionStorage.getItem } catch (e) { return false } }; g["webWorkers"] = function () { return !!e.Worker }; g["applicationcache"] = function () { return !!e.applicationCache }; g["svg"] = function () { return !!t.createElementNS && !!t.createElementNS(m.svg, "svg").createSVGRect }; g["inlinesvg"] = function () { var e = t.createElement("div"); e.innerHTML = "<svg/>"; return (e.firstChild && e.firstChild.namespaceURI) == m.svg }; g["smil"] = function () { return !!t.createElementNS && /SVG/.test(p.call(t.createElementNS(m.svg, "animate"))) }; g["svgclippaths"] = function () { return !!t.createElementNS && /SVG/.test(p.call(t.createElementNS(m.svg, "clipPath"))) }; for (var D in g) { if (N(g, D)) { E = D.toLowerCase(); i[E] = g[D](); w.push((i[E] ? "" : "no-") + E) } } if (!i.input) _(); i.crosswindowmessaging = i.postmessage; i.historymanagement = i.history; i.addTest = function (e, t) { e = e.toLowerCase(); if (i[e]) { return } t = !!t(); o.className += " " + (t ? "" : "no-") + e; i[e] = t; return i }; C(""); f = c = null; if (s && e.attachEvent && function () { var e = t.createElement("div"); e.innerHTML = "<elem></elem>"; return e.childNodes.length !== 1 }()) { (function (e, t) { function d(e) { var t = -1; while (++t < i) e.createElement(r[t]) } function v(e, t) { var n = -1, r = e.length, i, s = []; while (++n < r) { i = e[n]; if ((t = i.media || t) != "screen") s.push(v(i.imports, t), i.cssText) } return s.join("") } var n = "abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", r = n.split("|"), i = r.length, s = new RegExp("(^|\\s)(" + n + ")", "gi"), o = new RegExp("<(/*)(" + n + ")", "gi"), u = new RegExp("(^|[^\\n]*?\\s)(" + n + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"), a = t.createDocumentFragment(), f = t.documentElement, l = f.firstChild, c = t.createElement("body"), h = t.createElement("style"), p; d(t); d(a); l.insertBefore(h, l.firstChild); h.media = "print"; e.attachEvent("onbeforeprint", function () { var e = -1, n = v(t.styleSheets, "all"), l = [], d; p = p || t.body; while ((d = u.exec(n)) != null) l.push((d[1] + d[2] + d[3]).replace(s, "$1.iepp_$2") + d[4]); h.styleSheet.cssText = l.join("\n"); while (++e < i) { var m = t.getElementsByTagName(r[e]), g = m.length, y = -1; while (++y < g) if (m[y].className.indexOf("iepp_") < 0) m[y].className += " iepp_" + r[e] } a.appendChild(p); f.appendChild(c); c.className = p.className; c.innerHTML = p.innerHTML.replace(o, "<$1font") }); e.attachEvent("onafterprint", function () { c.innerHTML = ""; f.removeChild(c); f.appendChild(p); h.styleSheet.cssText = "" }) })(e, t) } i._enableHTML5 = s; i._version = r; o.className = o.className.replace(/\bno-js\b/, "") + " js " + w.join(" "); return i }(this, this.document)