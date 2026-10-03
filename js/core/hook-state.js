/* ============================================================
   WEARLY - hook-state.js
   Rôle : intercepter toutes les modifications de S pour
   déclencher automatiquement AppState.save(S).
   Aucune modification de la logique métier.
   ============================================================ */
(function(window){
'use strict';

  function install(){
    if (!window.S || !window.AppState) {
      console.warn('[WEARLY] hook-state : S ou AppState manquant');
      return;
    }
    if (window.S.__hooked) return;
    window.S.__hooked = true;

    var _S = window.S;
    var proxy = new Proxy(_S, {
      set: function(target, prop, value){
        target[prop] = value;
        if (prop !== '__hooked') {
          try { window.AppState.save(target); } catch(e){}
        }
        return true;
      },
      deleteProperty: function(target, prop){
        delete target[prop];
        try { window.AppState.save(target); } catch(e){}
        return true;
      }
    });

    window.S = proxy;
    console.log('[WEARLY] hook-state actif');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }

})(window);
