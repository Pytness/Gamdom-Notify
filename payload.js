(function(w) {
    'use strict';

    var extractData = (a, b=false) => {
		try {
			b = JSON.parse(a.split(',').slice(1).join(','));
		} finally {return b;}
	};


    ///////////////////////////////////////////////////////////////////////////
        var _WS = WebSocket;
        var user;

        var manageData = (a) => {
            var b = extractData(a.data);
            if (b[0] == 'initialize' && typeof b[1]['user'] == 'object') {
                user = b[1]['user'];
                this.removeEventListener('message', manageData);

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

        w.WebSocket = function(...args) {

            var tws = new _WS(...args);
            tws.addEventListener('message', manageData, false);
            return tws;
        };

        w.WebSocket.__defineGetter__('toString', () => function() {
            return 'function eval() {\n\t[native code]\n}';
        });

        w.WebSocket.prototype = _WS.prototype;

});

/*
["initialize", {
    "playersOnline": {
        "loggedIn": 2557,
        "loggedOut": 122
    },
    "user": {
        "id": 1140326,
        "steamid": "76561198419306669",
        "image": "URL",
        "username": "pytrandom",
        "userclass": "user",
        "balanceSatoshis": 0,
        "net_profit": 0,
        "affiliate_profit": 0,
        "xp": 1,
        "refer_link_id": null,
        "verified": false,
        "tradelink": "TRADE",
        "name_promotion": false,
        "last_claimed": null,
        "admin": false,
        "moderator": false,
        "twitter_user_id": null,
        "referrerName": null,
        "referrerid": null,
        "total_deposited": 0,
        "muted_until": null,
        "banned": false,
        "total_referred_depositors": 0,
        "steam_profile_private": true,
        "created": "2017-09-07T19:38:47.722Z"
    }
}]
*/
