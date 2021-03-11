(function (e) { e.fn.rowGrouping = function (t) { function n() { } function r(e) { var t = ["January", "February", "March", "April", "May", "June", "Jully", "August", "September", "October", "November", "December"]; return t[e - 1] } var i = { iGroupingColumnIndex: 0, sGroupingColumnSortDirection: "", iGroupingOrderByColumnIndex: -1, sGroupingClass: "group", bHideGroupingColumn: true, bHideGroupingOrderByColumn: true, sGroupBy: "name", sGroupLabelPrefix: "", bExpandableGrouping: false, bExpandSingleGroup: false, iExpandGroupOffset: 100, asExpandedGroups: null, sDateFormat: "dd/MM/yyyy", sEmptyGroupLabel: "-", bSetGroupingClassOnTR: false, iGroupingColumnIndex2: -1, sGroupingColumnSortDirection2: "", iGroupingOrderByColumnIndex2: -1, sGroupingClass2: "subgroup", bHideGroupingColumn2: true, bHideGroupingOrderByColumn2: true, sGroupBy2: "name", sGroupLabelPrefix2: "", bExpandableGrouping2: false, fnOnGrouped: n }; return this.each(function (n, s) { function u(t) { return e.inArray(t, g) != -1 } function a(e) { return e.substr(v, m) } function f(e) { return e } function l(e) { return e.substr(0, 1) } function c(e) { return a(e) } function h(e) { return e.substr(v, m) + " " + r(e.substr(iMonthIndex, iMonthLength)) } function p(e) { return e.toLowerCase().replace(/\W+/g, "-") } var o = e(s).dataTable(); var d = function (t) { var n = e(this).attr("rel"); var r = u(n); if (b.bExpandSingleGroup) { if (!r) { var i = g[0]; g = new Array; g.push(n); e(".group-item-" + i, o).hide(); e(".group-item-" + n, o).show(); var s = e(".expanded-group"); s.removeClass("expanded-group"); s.addClass("collapsed-group"); e(this).addClass("expanded-group"); e(this).removeClass("collapsed-group"); if (b.iExpandGroupOffset != -1) { var a = e("#group-id-" + o.attr("id") + "-" + n).offset().top - b.iExpandGroupOffset; window.scroll(0, a) } else { var a = o.offset().top; window.scroll(0, a) } } } else { if (r) { var f = e.inArray(n, g); g.splice(f, 1); e(this).removeClass("expanded-group"); e(this).addClass("collapsed-group"); e(".group-item-" + n, o).hide() } else { g.push(n); e(this).addClass("expanded-group"); e(this).removeClass("collapsed-group"); e(".group-item-" + n, o).show() } } t.preventDefault() }; var v = 6; var m = 4; var g = new Array; var y = true; var b = e.extend(i, t); if (b.sGrupingClass != null || b.sGrupingClass2 != null) alert("Since the version 1.1. sGrupingClass sGrupingClass2 are renamed to sGroupingClass and sGroupingClass2. Please correct your settings"); if (b.iGroupingOrderByColumnIndex == -1) { b.bCustomColumnOrdering = false; b.iGroupingOrderByColumnIndex = b.iGroupingColumnIndex } else { b.bCustomColumnOrdering = true } if (b.sGroupingColumnSortDirection == "") { if (b.sGroupBy == "year") b.sGroupingColumnSortDirection = "desc"; else b.sGroupingColumnSortDirection = "asc" } if (b.iGroupingOrderByColumnIndex2 == -1) { b.bCustomColumnOrdering2 = false; b.iGroupingOrderByColumnIndex2 = b.iGroupingColumnIndex2 } else { b.bCustomColumnOrdering2 = true } if (b.sGroupingColumnSortDirection2 == "") { if (b.sGroupBy2 == "year") b.sGroupingColumnSortDirection2 = "desc"; else b.sGroupingColumnSortDirection2 = "asc" } if (b.asExpandedGroups != null) { if (b.asExpandedGroups == "NONE") { b.asExpandedGroups = []; g = b.asExpandedGroups; y = false } else if (b.asExpandedGroups == "ALL") { } else if (b.asExpandedGroups.constructor == String) { var w = b.asExpandedGroups; b.asExpandedGroups = new Array; b.asExpandedGroups.push(p(w)); g = b.asExpandedGroups; y = false } else if (b.asExpandedGroups.constructor == Array) { for (var E = 0; E < b.asExpandedGroups.length; E++) { g.push(p(b.asExpandedGroups[E])); if (b.bExpandSingleGroup) break } y = false } } v = b.sDateFormat.toLowerCase().indexOf("yy"); m = b.sDateFormat.toLowerCase().lastIndexOf("y") - b.sDateFormat.toLowerCase().indexOf("y") + 1; iMonthIndex = b.sDateFormat.toLowerCase().indexOf("mm"); iMonthLength = b.sDateFormat.toLowerCase().lastIndexOf("m") - b.sDateFormat.toLowerCase().indexOf("m") + 1; var S = f; switch (b.sGroupBy) { case "letter": S = l; break; case "year": S = c; break; case "month": S = h; break; default: S = f; break } var x = function (t) { if (o.fnSettings().oFeatures.bServerSide) y = true; var n = false; if (b.iGroupingColumnIndex2 != -1) n = true; if (t.aiDisplay.length == 0) { return } var r = e("tbody tr", o); var i = r[0].getElementsByTagName("td").length; var s = null; var a = null; for (var f = 0; f < r.length; f++) { var l = t._iDisplayStart + f; if (o.fnSettings().oFeatures.bServerSide) l = f; var c = ""; var h = null; var v = ""; var m = null; c = t.aoData[t.aiDisplay[l]]._aData[b.iGroupingColumnIndex]; if (c == undefined) c = t.aoData[t.aiDisplay[l]]._aData[t.aoColumns[b.iGroupingColumnIndex].mDataProp]; var h = c; if (b.sGroupBy != "year") h = S(c); e(r[f]).attr("data-group", p(h)); if (n) { v = t.aoData[t.aiDisplay[l]]._aData[b.iGroupingColumnIndex2]; if (v == undefined) v = t.aoData[t.aiDisplay[l]]._aData[t.aoColumns[b.iGroupingColumnIndex2].mDataProp]; if (b.sGroupBy2 != "year") m = S(v); e(r[f]).attr("data-group", p(h) + "_" + p(m)) } if (s == null || p(h) != p(s)) { var w = p(h); if (b.bExpandableGrouping && y) { if (b.bExpandSingleGroup) { if (g.length == 0) g.push(w) } else { g.push(w) } } var E = document.createElement("tr"); var x = document.createElement("td"); E.id = "group-id-" + o.attr("id") + "-" + w; if (b.bSetGroupingClassOnTR) { E.className = b.sGroupingClass + " " + w } else { x.className = b.sGroupingClass + " " + w } x.colSpan = i; x.innerHTML = b.sGroupLabelPrefix + (h == "" ? b.sEmptyGroupLabel : h); if (b.bExpandableGrouping) { if (u(w)) { x.className += " expanded-group" } else { x.className += " collapsed-group" } x.className += " group-item-expander"; e(x).attr("rel", w); e(x).click(d) } E.appendChild(x); r[f].parentNode.insertBefore(E, r[f]); s = h; a = null } if (b.bExpandableGrouping) { e(r[f]).addClass("group-item-" + w); if (!u(w)) { e(r[f]).hide() } } if (n) { if (a == null || p(m) != p(a)) { var T = document.createElement("tr"); var N = document.createElement("td"); if (b.bSetGroupingClassOnTR) { T.className = b.sGroupingClass2 + " " + m.toLowerCase().replace(" ", "-") } else { N.className = b.sGroupingClass2 + " " + m.toLowerCase().replace(" ", "-") } N.colSpan = i; N.innerHTML = b.sGroupLabelPrefix2 + (m == "" ? b.sEmptyGroupLabel : m); T.appendChild(N); r[f].parentNode.insertBefore(T, r[f]); a = m } } } b.fnOnGrouped(); y = false }; o.fnSetColumnVis(b.iGroupingColumnIndex, !b.bHideGroupingColumn); if (b.bCustomColumnOrdering) { o.fnSetColumnVis(b.iGroupingOrderByColumnIndex, !b.bHideGroupingOrderByColumn) } if (b.iGroupingColumnIndex2 != -1) { o.fnSetColumnVis(b.iGroupingColumnIndex2, !b.bHideGroupingColumn2) } if (b.bCustomColumnOrdering2) { o.fnSetColumnVis(b.iGroupingOrderByColumnIndex2, !b.bHideGroupingOrderByColumn2) } o.fnSettings().aoDrawCallback.push({ fn: x, sName: "fnRowGrouping" }); var T = new Array; T.push([b.iGroupingOrderByColumnIndex, b.sGroupingColumnSortDirection]); if (b.iGroupingColumnIndex2 != -1) { T.push([b.iGroupingOrderByColumnIndex2, b.sGroupingColumnSortDirection2]) } o.fnSettings().aaSortingFixed = T; switch (b.sGroupBy) { case "name": break; case "letter": o.fnSettings().aoColumns[b.iGroupingOrderByColumnIndex].sSortDataType = "rg-letter"; e.fn.dataTableExt.afnSortData["rg-letter"] = function (t, n) { var r = []; e("td:eq(" + n + ")", t.oApi._fnGetTrNodes(t)).each(function () { r.push(l(this.innerHTML)) }); return r }; break; case "year": o.fnSettings().aoColumns[b.iGroupingOrderByColumnIndex].sSortDataType = "rg-date"; e.fn.dataTableExt.afnSortData["rg-date"] = function (t, n) { var r = []; e("td:eq(" + n + ")", t.oApi._fnGetTrNodes(t)).each(function () { r.push(a(this.innerHTML)) }); return r }; break; default: break } if (b.sGroupBy == "name" || b.sGroupBy == "letter") { } else { } o.fnDraw() }) } })(jQuery)