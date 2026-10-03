
(function(){function show(t){var d=document.getElementById('wdiag');if(!d){d=document.createElement('div');d.id='wdiag';d.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#7f1d1d;color:#fff;font:12px/1.4 sans-serif;padding:10px;max-height:45%;overflow:auto';(document.body||document.documentElement).appendChild(d)}d.innerHTML+=t+'<br>'}
window.onerror=function(m,s,l,c){show('Erreur JS : '+m+' (ligne '+l+')<br>'+navigator.userAgent);return false};
window.addEventListener('load',function(){setTimeout(function(){if(document.body.innerText.trim().length<15)show('Affichage vide.<br>'+navigator.userAgent)},3500)})})();
