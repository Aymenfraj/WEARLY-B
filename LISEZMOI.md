# WEARLY 2.0 - application hybride (Capacitor)

## Architecture (un module = une fonction)
www/js/core/       config, events (bus), platform (plugins natifs), storage (Preferences + IndexedDB), network (connexion), http (API, reessais, file hors ligne)
www/js/services/   location, audio (micro + sons), notifications, camera
www/js/features/   video (publier facon TikTok), screens (Publier, Mes videos, Telephone & reseau)
www/js/legacy/     l'application d'origine (ecrans, boutique, vestiaire des amis)
www/js/main.js     point d'entree

## Brancher un serveur plus tard
Renseigner API_BASE dans www/js/core/config.js. Tout passe deja par core/http.js :
delai max, 3 reessais, jeton, et file d'attente hors ligne envoyee au retour du reseau.

## APK
Voir les etapes GitHub dans la conversation (Actions > Build APK > artefact WEARLY-apk).
