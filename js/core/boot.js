/* ============================================================
   WEARLY - boot.js
   Rôle : démarrer l'application, restaurer l'état, activer la
   sauvegarde automatique et la sauvegarde à la fermeture.
   ============================================================ */
(function(window){
'use strict';

  function start(){
    if (!window.S || !window.AppState) {
      console.warn('[WEARLY] boot : S ou AppState manquant');
      return;
    }

    /* 1. Charger l'état sauvegardé puis rafraîchir l'interface */
    window.AppState.load(window.S).then(function(){
      if (typeof window.__wearlyRefresh === 'function') {
        window.__wearlyRefresh();
      }
      console.log('[WEARLY] moteur de stockage :', window.AppState.engine());
    });

    /* 2. Sauvegarde à la fermeture / mise en arrière-plan */
    window.addEventListener('beforeunload', function(){
      window.AppState.flush(window.S);
    });
    document.addEventListener('pause', function(){
      window.AppState.flush(window.S);
    }, false);
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) window.AppState.flush(window.S);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})(window);
