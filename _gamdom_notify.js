// ==UserScript==
// @name           Gamdom Notify
// @description    Rain Notifications
// @version        2.3.0.1
// @author         Pytness
// @match          *://gamdom.com/*
// @namespace      https://greasyfork.org/scripts/35717-gamdom-notify/
// @update         https://greasyfork.org/scripts/35717-gamdom-notify/code/Gamdom%20Notify.user.js
// @resource       RainCoinAudioData https://raw.githubusercontent.com/Pytness/Gamdom-Notify/master/CoinSound.mp3
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
	const DEBUG = false;

	let hws = null; // NOTE: this variable will contain the Hijacked WebSocket

	const box = (a, b = 0) => {
		let d, c = '';
		a.forEach(e => b = e.length > b ? e.length : b);
		d = '+'.padEnd(b, '=') + '+';
		return a.forEach(e => {
			c += '|' + e.padEnd(b, ' ') + '|\n';
		}), d + '\n' + c + d;
	};

	const box = (f, g = 0) => {
		let h, i = '';
		return f.forEach(j => g = j.length > g ? j.length : g),
			h = '+'.padEnd(g, '=') + '+',
			(f.forEach(j => {
				i += '|' + j.padEnd(g, ' ') + '|\n'
			}), h + '\n' + i + h)
	};

	const log = console.log;
	const err = console.error;

	///////////////////////////////////////////////////////////////////////////

	const initMessage = box([
		' Gamdom Rain Notify:', '',
		' Ver: ' + GM_info.script.version,
		' By ' + GM_info.script.author, '',
	], 40);

	///////////////////////////////////////////////////////////////////////////

	const RainCoinAudioData = GM_getResourceURL('RainCoinAudioData').replace('application', 'audio/mp3');
	const CoinSound = new Audio(RainCoinAudioData); // Load Audio
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
			b = JSON.parse(a.split(',').slice(1).join(','));
		} finally {
			return b;
		}
	};

	const manageMessages = (a) => {
		var b = extractData(a.data);
		if(b[0] == 'activateRain' && typeof b[1] == 'number') notificate();
	};

	///////////////////////////////////////////////////////////////////////////

	// NOTE: HijackWebsocket is imported from https://github.com/Pytness/Hijack-Websocket

	const HijackWebsocket = () => {
		const WS = w.WebSocket;

		w.WebSocket = function (...argv) {

			log('[i] New WebSocket connection');

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
	};

	// NOTE: triggerNotify will cause WebSocket socket dies

	const triggerNotify = () => {
		HWS.dispatchEvent(new MessageEvent('message', {
			data: 'asd,["activateRain", 9879877]',
			origin: "wss://gamdom.com",
			lastEventId: "",
			source: null,
			ports: []
		}));
	};

	///////////////////////////////////////////////////////////////////////////

	const init = () => {

		log(initMessage);

		HijackWebsocket();
		log('[i] WebSocket hijacked');

		if(DEBUG) w.triggerNotify = triggerNotify;
	};

	init();
	log('[i] Script executed');

}(unsafeWindow));
