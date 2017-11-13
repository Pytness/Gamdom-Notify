(function(w) {
    'use strict';

    var extractData = (a, b=false) => {
        try {
            b = JSON.parse(a.split(',').slice(1).join(','));
        } finally {return b;}
    };

    var user;

    var manageData_EL = (a) => { // Event Listener
        var b = extractData(a.data);
        if (b[0] == 'initialize' && typeof b[1]['user'] == 'object') {
            user = b[1]['user'];
            this.removeEventListener('message', manageData_EL);

            this.__send = this.send;
            this.send = function(m) {
                console.log(m);
                this.__send(m);
            };

            this.__om = this.onmessage;
            this.onmessage = function(e) {
                console.log(e.data);
                this.__om(e);
            }
        };
    };

    var _WS = WebSocket;

    w.WebSocket = function(...args) {

        var tws = new _WS(...args);
        tws.addEventListener('message', manageData_EL, false);
        return tws;
    };

    w.WebSocket.__defineGetter__('toString', () => function() {
        return 'function WebSocket() {\n    [native code]\n}';
    });

    w.WebSocket.prototype = _WS.prototype;

});
