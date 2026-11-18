/* LinguaAI — micro natif pour l'application Android (Capacitor).
   La reconnaissance vocale de Chrome (webkitSpeechRecognition) n'existe pas dans une WebView.
   Ce fichier la remplace par le plugin @capacitor-community/speech-recognition,
   avec la même interface : app.js n'a donc pas besoin d'être modifié pour le micro.
   À charger AVANT app.js. Sur le web (Chrome), il ne fait rien. */
(function () {
  var C = window.Capacitor;
  if (!(C && C.isNativePlatform && C.isNativePlatform())) return;

  function getPlugin() {
    if (C.Plugins && C.Plugins.SpeechRecognition) return C.Plugins.SpeechRecognition;
    try { return C.registerPlugin ? C.registerPlugin("SpeechRecognition") : null; } catch (e) { return null; }
  }

  function NativeSpeechRecognition() {
    this.lang = "en-US";
    this.interimResults = false;
    this.maxAlternatives = 1;
    this.continuous = false;
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    this._stopped = false;
  }

  NativeSpeechRecognition.prototype.start = function () {
    var self = this;
    var P = getPlugin();
    self._stopped = false;
    var ended = false;
    function end() { if (ended) return; ended = true; if (self.onend) self.onend(); }
    function fail(code) { if (!self._stopped && self.onerror) self.onerror({ error: code }); }

    if (!P) { setTimeout(function () { fail("service-not-allowed"); end(); }, 0); return; }

    (async function () {
      try {
        var perm = await P.requestPermissions();
        if (perm.speechRecognition !== "granted") { fail("not-allowed"); end(); return; }
        var r = await P.start({ language: self.lang, maxResults: 1, partialResults: false, popup: false });
        var text = r && r.matches && r.matches[0];
        if (self._stopped) { end(); return; }
        if (text) { if (self.onresult) self.onresult({ results: [[{ transcript: text }]] }); }
        else fail("no-speech");
      } catch (e) {
        fail("audio-capture");
      }
      end();
    })();
  };

  NativeSpeechRecognition.prototype.stop = NativeSpeechRecognition.prototype.abort = function () {
    this._stopped = true;
    var P = getPlugin();
    try { if (P) P.stop(); } catch (e) { /* ignore */ }
  };

  window.SpeechRecognition = NativeSpeechRecognition;
  window.webkitSpeechRecognition = NativeSpeechRecognition;
})();
