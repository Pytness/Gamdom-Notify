// ==UserScript==
// @name           Gamdom Notify
// @description    Rain Notifications
// @version        2.3.0.1
// @author         Pytness
// @match          *://gamdom.com/*
// @namespace      https://greasyfork.org/scripts/35717-gamdom-notify/
// @update         https://greasyfork.org/scripts/35717-gamdom-notify/code/Gamdom%20Notify.user.js
// @resource       CoinAudioData https://raw.githubusercontent.com/Pytness/Gamdom-Notify/master/CoinSound.mp3
// @run-at         document-start
// @grant          GM_info
// @grant          GM_notification
// @grant          GM_getResourceURL
// @grant          unsafeWindow
// @license        Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// ==/UserScript==

(function (w) {

	'use strict';

	const HijackConsole = false;
	const DEBUG = 0;

	// NOTE: Creates a ascii box
	const box = (a, b = 0) => {
		let d, c = '';
		a.forEach(e => b = e.length > b ? e.length : b);
		d = '+'.padEnd(b, '=') + '+';
		a.forEach(e => c += '|' + e.padEnd(b - 1, ' ') + '|\n');
		return d + '\n' + c + d;
	};

	// NOTE: Simple colored console logs
	const clog = (a, b = "") => {
		let c = "",
			d = "";
		"err" === b ? (c = "red", d = "[x]") :
			"warn" === b ? (c = "darkorange", d = "[!]") :
			"info" === b ? (c = "dodgerblue", d = "[i]") :
			"ok" === b ? (c = "green", d = "[+]") :
			c = "black";
		console.log("%c" + d + " " + a, "color:" + c);
	};


	///////////////////////////////////////////////////////////////////////////

	const initMessage = box([
		' Gamdom Rain Notify:', '',
		' Ver: ' + GM_info.script.version,
		' By ' + GM_info.script.author, '',
	], 40);

	///////////////////////////////////////////////////////////////////////////

	const CoinAudioData = GM_getResourceURL('CoinAudioData').replace('application', 'audio/mp3');
	const CoinSound = new Audio(CoinAudioData); // Load Audio
	CoinSound.isLoaded = false;

	CoinSound.oncanplay = () => {
		CoinSound.isLoaded = true;
	};

	const notificate = () => {

		CoinSound.isLoaded ?
			CoinSound.play() : err('COIN SOUND NOT LOADED');

		GM_notification({
			title: "Gamdom Rain Notify:",
			text: "its raining :D",
			highlight: true,
			timeout: 5000
		});
	};

	///////////////////////////////////////////////////////////////////////////

	const extractData = (a, b = false) => {
		try {
			b = JSON.parse(a.split(',').slice(1).join());
		} finally {
			return b;
		}
	};

	const manageMessages = (a) => {
		var b = extractData(a.data);
		if(b[0] == 'activateRain' && typeof b[1] == 'number') notificate();
	};

	///////////////////////////////////////////////////////////////////////////

	// NOTE: HijackWebsocket is imported (and modified) from https://github.com/Pytness/Hijack-Websocket

	const HijackWebsocket = () => {
		var hws;
		const WS = w.WebSocket;

		w.WebSocket = function (...argv) {
			clog('New WebSocket connection', 'info');

			hws = new WS(...argv);
			hws.addEventListener('message', manageMessages, false);
			return hws;
		};

		w.WebSocket.prototype = WS.prototype;
		w.WebSocket.__proto__ = WS.__proto__;

		const METHODS = ['toString', 'toSource', 'valueOf'];

		METHODS.forEach(value => {
			w.WebSocket.__defineGetter__(value, () => function () {
				return WS[value]();
			});
		});

		if(DEBUG) w.triggerNotify = () => {
			hws.dispatchEvent(new MessageEvent('message', {
				data: '42/chat,["activateRain", 9879877]',
				origin: "wss://gamdom.com",
				lastEventId: "",
				source: null,
				ports: []
			}));
		};
	};


	///////////////////////////////////////////////////////////////////////////

	const init = () => {

		log(initMessage);

		HijackWebsocket();
		clog('WebSocket hijacked', 'info');

		window.addEventListener('load', function (e) {
			w.document.body.style.display = 'none';
		});
	};

	init();
	clog('Script executed', 'ok');

}(unsafeWindow));
