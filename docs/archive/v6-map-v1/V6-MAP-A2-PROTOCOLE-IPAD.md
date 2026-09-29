# V6-Map A2 — Protocole matériel iPad reproductible

**La Gate A2 ne peut devenir VERTE qu'après cette validation sur l'iPad réel.** Ne pas assimiler l'émulation Playwright WebKit Linux à Safari iPadOS. Aucune réinitialisation de données du site, aucune suppression de caches Gargottex, IndexedDB ni médias.

## Accès à la branche de test

Page technique : `poc/v6-map-a1/a2-validation.html` ; POC original : `poc/v6-map-a1/index.html`. **Une PR non fusionnée n'est généralement pas publiée sur le site GitHub Pages lié à V5.3.** Pour essai physique de la branche, employer un aperçu HTTPS dédié autorisé et préalablement vérifié, ou une distribution HTTPS locale avec certificat approuvé par l'iPad ; le serveur HTTP sur IP LAN permet un essai visuel, mais **pas** l'installation de Service Worker iPad (origine non sécurisée). Une fusion manuelle ultérieure sur V5.3 peut publier la page via GitHub Pages si cette branche est la source de publication, mais ne vaut pas validation de la Gate et n'est jamais exécutée par ce lot. Ne pas présenter l'URL Pages de production comme contenant cette PR avant publication.

Après publication explicite de cette branche sur une origine HTTPS, URL à ouvrir :
`https://christolosier-ship-it.github.io/Gargotte-V5/poc/v6-map-a1/a2-validation.html` **uniquement si** A2 y est effectivement présent. Sinon demander un lien d'aperçu HTTPS temporaire. **Ne jamais effacer les données Safari de ce domaine pour tester**, car elles peuvent abriter l'IndexedDB de production.

## Fiche de contexte à renseigner (à copier avec le JSON)

| Champ | Relevé matériel |
|---|---|
| Modèle exact d'iPad | À renseigner |
| iPadOS build | À renseigner |
| Safari / PWA écran d'accueil | À renseigner |
| Stockage libre et état « mode économie d'énergie » | À renseigner |
| Réseau et débit approximatif (si connu) | À renseigner |
| URL et révision d'assets affichée | À renseigner |
| Date, heure, orientation portrait/paysage | À renseigner |
| Contrôle Worker enfant A2 après rechargement en ligne | À renseigner |

## Parcours matériel, dans cet ordre

1. **Chargement froid sans toucher au stockage du site** : ouvrir l'URL HTTPS A2 une première fois avec réseau, noter affichage des quatre fonds géométriques neutres, erreurs éventuelles et délais ressentis, puis ouvrir A1. Vérifier que le Codex habituel et les médias ne sont pas modifiés. Ne pas effacer les données de Safari.
2. **Formats** : dans A2, appuyer sur « Mesurer les formats ». Conserver le JSON brut et photographier/tableau si plus simple. Noter le rendu visuel neutre, support effectif de PNG/WebP/JPEG/AVIF, poids et médianes de décodage pour 256/512/1024. Sur l'iPad ce sont des mesures du navigateur et du fond neutre, **pas** des futures images peintes.
3. **Gesture & label** : ouvrir A1 en portrait, effectuer dix pincements zoom/dézoom alternés, dix glissements rapides aux quatre coins et retour Chope, masquer les noms puis essayer de toucher leur ancienne zone ; le nom masqué ne doit pas ouvrir de panneau. Chope et Vieux pont doivent rester accessibles ; noter les éventuels tremblements, artefacts aux joints de tuiles, zones blanches, nom tronqué, contraste et taille des touches.
4. **Paysage et reprise** : basculer en paysage ; répéter le parcours. Basculer en arrière vers le navigateur, mettre l'iPad en veille environ une minute, réouvrir puis essayer retour Chope, zoom, orientation. Rechercher rechargements sauvages, blocages, rupture de continuité. Revenir depuis la page A2 et retourner au POC. Ne pas attribuer une reprise WebKit en CI à cette séquence matérielle.
5. **Cache public** : sur A2 en ligne, appuyer « Installer le cache A2 » puis « Vérifier les quatre fonds » ; attendre **4/4**. Recharger **en ligne** et confirmer que la page indique « pilote cette page : true » pour le Worker enfant A2. Si ce n'est pas vrai, ne pas déclarer le test offline valide.
6. **Réseau réellement coupé** : désactiver Wi-Fi ET données cellulaires éventuelles (le mode avion seul peut conserver le Wi-Fi), fermer/réouvrir l'onglet puis recharger la page A2. Les quatre fonds neutres et la page doivent rester disponibles ; ouvrir ensuite A1 et vérifier le niveau de secours. Zoomer vers un détail jamais visité : il peut manquer mais ne doit pas effacer le fond inférieur. Rebrancher le réseau. Les images de détail déjà vues peuvent exister dans le cache opportuniste, **sans garantie d'exhaustivité**.
7. **Mise à jour contrôlée** : quand une *nouvelle révision effective* du Worker/manifest et de ses URLs sera disponible, installer en ligne, vérifier la présence de quatre fonds avant retrait de l'ancien cache puis répéter offline. **Ne pas simuler une mise à jour en changeant simplement la querystring**, puisque le SW global historique ignore parfois la query avant contrôle enfant. Si aucune nouvelle révision n'a été publiée, noter « non testé », ce n'est pas un succès inventé.
8. **Mémoire et ressources** : relever via Safari Web Inspector sur Mac si disponible l'évolution après au moins dix cycles. Sinon noter ralentissements/onglet rechargé et le diagnostic A1 (`active`, `peak`, `evicted`, `failed`) via console si disponible. Les octets RGBA estimés ne sont pas la consommation RSS iPad. Pas d'accumulation croissante après retour zoom initial, pas de fuite d'Object URLs de la page A2 (elles sont révoquées à chaque essai).

## Grille de décision à renvoyer

| Critère | OK / KO / non testé | Observation / capture |
|---|---|---|
| Portrait et paysage, pinch et déplacements sans sauts | À compléter | |
| Pas de couture/rupture de la géographie à changement de niveau | À compléter | |
| Libellés lisibles et masquage non interactif | À compléter | |
| Preview Chope / Vieux pont, retour et reprise de veille | À compléter | |
| Quatre fonds neutres offline avec Worker enfant contrôleur | À compléter | |
| Détail manquant : fallback correct | À compléter | |
| Repeated zoom : aucune accumulation/blocage notable | À compléter | |
| Comparaison 256/512/1024 et formats enregistrée (JSON) | À compléter | |
| Mise à jour de révision réellement déployée, si disponible | À compléter | |

**Conditions Gate :** EN ATTENTE avant essai physique. ROUGE si fuite, perte de fond général, discontinuité géographique, régression média/IndexedDB, navigation bloquée ou impossibilité de reprise sûre ; classer les échecs CI par cause code ou test avant correction. VERTE seulement après retour matériel détaillé et correction/validation de tout problème bloquant. Même une Gate verte ne fabrique aucune image finale et ne déploie pas B1 par elle-même.

## Fiche complétée par retour utilisateur du 27/09/2026

Le propriétaire confirme avoir testé le laboratoire sur **son iPad** et avoir validé **tous les tests**. La capture montre Safari vers 15 h 42, benchmark terminé, SW A2 actif et contrôleur, quatre fonds de base présents sur quatre, réseau indiqué **en ligne au moment de la capture**. Les contrôles offline/veille/gestes sont enregistrés comme **OK sur déclaration** ; la photo ne les prouve pas individuellement. Le stockage libre, modèle exact, build iPadOS et JSON intégral ne sont pas fournis ; UA visible Version/26.4 Safari/604.1, écran CSS 810×1080, DPR 2.

| Contrôle | Résultat et preuve |
|---|---|
| Navigation tactile, portrait/paysage, continuité géographique, labels et previews | OK déclaré par le propriétaire |
| Veille/reprise, détail manquant/fallback, cycles répétés sans blocage notable | OK déclaré par le propriétaire ; aucune mesure RSS native |
| Worker enfant, cache de quatre fonds | OK visible sur capture : true / true / 4/4, **en ligne** |
| Réouverture complètement hors réseau | OK déclaré par le propriétaire, aucune capture offline jointe ; WebKit CI Linux reste non concluant |
| Comparaison de formats 256/512/1024 px | OK : capture de données réelles, PNG/JPEG mesurés ; WebP encodeur Canvas indisponible et AVIF suspect, à ne pas assimiler à une validation de ces formats |
| Nouvelle révision réellement publiée du Worker/cache | Non documentée, à valider au lot C3 |

**Gate A2 VERTE sur attestation matérielle explicite du propriétaire, avec limites du banc de formats détaillées dans le rapport.** Ne pas confondre la validation du POC neutre avec celle des futurs visuels ou des quatre vraies cartes offline.
