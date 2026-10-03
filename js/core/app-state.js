/* ============================================================
   WEARLY - app-state.js
   Rôle : sauvegarde et restauration de l'état global S
   Ne touche à AUCUNE logique métier
   ============================================================ */
(function(window){
'use strict';

  var STORAGE_KEY = 'wearly_state_v1';
  var SAVE_DEBOUNCE = 800;
  var _saveTimer = null;

  /* --- Détection du moteur de stockage --- */
  var Storage = (function(){
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
      var P = window.Capacitor.Plugins.Preferences;
      return {
        type: 'capacitor',
        get: function(key){ return P.get({ key: key }).then(function(r){ return r.value; }); },
        set: function(key, value){ return P.set({ key: key, value: value }); },
        remove: function(key){ return P.remove({ key: key }); }
      };
    }
    if (window.localStorage) {
      return {
        type: 'localStorage',
        get: function(key){ return Promise.resolve(window.localStorage.getItem(key)); },
        set: function(key, value){ try { window.localStorage.setItem(key, value); } catch(e){} return Promise.resolve(); },
        remove: function(key){ try { window.localStorage.removeItem(key); } catch(e){} return Promise.resolve(); }
      };
    }
    var mem = {};
    return {
      type: 'memory',
      get: function(key){ return Promise.resolve(mem[key] || null); },
      set: function(key, value){ mem[key] = value; return Promise.resolve(); },
      remove: function(key){ delete mem[key]; return Promise.resolve(); }
    };
  })();

  /* --- Sérialisation sécurisée --- */
  function serialisable(S){
    if (!S || typeof S !== 'object') return {};
    try {
      return JSON.parse(JSON.stringify(S, function(k, v){
        if (typeof v === 'function') return undefined;
        if (k === 'waOpen') return undefined;
        if (k === 'vplayerOpen') return undefined;
        return v;
      }));
    } catch(e){
      console.warn('[WEARLY] sérialisation échouée', e);
      return {};
    }
  }

  /* --- Fusion intelligente --- */
  function mergeState(target, saved){
    if (!saved || typeof saved !== 'object') return target;
    Object.keys(saved).forEach(function(k){
      var v = saved[k];
      if (v === null || v === undefined) return;
      if (Array.isArray(v)) {
        target[k] = v;
      } else if (typeof v === 'object') {
        if (!target[k] || typeof target[k] !== 'object') target[k] = {};
        mergeState(target[k], v);
      } else {
        target[k] = v;
      }
    });
    return target;
  }

  /* --- API publique --- */
  var AppState = {

    load: function(S){
      return Storage.get(STORAGE_KEY).then(function(raw){
        if (!raw) {
          console.log('[WEARLY] aucun état sauvegardé, première ouverture');
          return S;
        }
        try {
          var saved = JSON.parse(raw);
          mergeState(S, saved);
          console.log('[WEARLY] état restauré (' + Storage.type + ')');
        } catch(e){
          console.warn('[WEARLY] état corrompu, réinitialisation', e);
          Storage.remove(STORAGE_KEY);
        }
        return S;
      });
    },

    saveNow: function(S){
      var data = serialisable(S);
      var json = JSON.stringify(data);
      return Storage.set(STORAGE_KEY, json).then(function(){
        console.log('[WEARLY] état sauvegardé (' + (json.length/1024).toFixed(1) + ' Ko)');
      });
    },

    save: function(S){
      if (_saveTimer) clearTimeout(_saveTimer);
      _saveTimer = setTimeout(function(){
        _saveTimer = null;
        AppState.saveNow(S);
      }, SAVE_DEBOUNCE);
    },

    clear: function(){
      return Storage.remove(STORAGE_KEY);
    },

    engine: function(){
      return Storage.type;
    },

    flush: function(S){
      if (_saveTimer) { clearTimeout(_saveTimer); _saveTimer = null; }
      return AppState.saveNow(S);
    }
  };

  window.AppState = AppState;

})(window);
