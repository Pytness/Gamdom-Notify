// ==UserScript==
// @name         GC Loader
// @description  Load GC
// @version      1.0
// @author       Pytness
// @match        *://gamdom.com/*
// @run-at       document-start
// @grant        GM_info
// @grant        unsafeWindow
// ==/UserScript==


(function(w) {
    'use strict';

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            eval(this.responseText)(w);
        }
    };
    ajax.open('GET', 'https://raw.githubusercontent.com/Pytness/Gamdom-Notify/master/tipper.js', true);
    ajax.send(null);

}(unsafeWindow));
