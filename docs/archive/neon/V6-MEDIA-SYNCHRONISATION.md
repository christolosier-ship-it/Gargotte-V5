> Archive historique Neon, figée lors du changement de cible du 17 septembre 2026. Les instructions de lancement, promotion et étapes restantes ci-dessous ne sont plus actives. Référence actuelle : [plan Google Drive](../../REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md).

# Phase 2 — synchronisation des originaux

## Périmètre et gate

La Phase 2 révisée ajoute les transferts automatiques, leur reprise et la récupération à la demande. Aucun schéma SQL supplémentaire : les trois migrations de la Phase 1 suffisent. La preview utilise maintenant la branche isolée `br-falling-violet-b4am8hbo` (projet `young-bread-85335056`). Production inchangée.

## Enregistrement et transfert

- IndexedDB version 4 conserve le même nom et tous les stores existants. Ajout de `sync_media_outbox` et `sync_media_state`, exclus des exports JSON et des révisions métier.
- Une écriture média locale et son événement technique sont atomiques. L’événement référence l’id et une génération unique, jamais les octets. L’original reste dans `media_assets.blob`.
- Les anciens médias locaux sont inventoriés automatiquement au premier passage authentifié. Un champ binaire absent d’un import de métadonnées ne remplace pas un original local.
- Les données structurées sont envoyées d’abord ; jusqu’à trois originaux sont traités par cycle, puis le pull structuré reprend même si un média échoue. Les moins souvent tentés passent en priorité pour éviter qu’un fichier bloqué affame les autres.
- SHA-256 calculé localement, morceaux de 256 Kio. Le moteur compare les morceaux déjà présents : une réponse perdue après insertion ne provoque pas de duplication. Un manifeste ou morceau divergent produit une erreur, sans écraser une copie saine.
- Seule la confirmation du hash et de la taille par le serveur retire l’événement correspondant exactement à sa génération. Une modification concurrente ne peut pas être acquittée par l’ancien transfert.
- Retry aux cycles suivants (15 secondes lorsque les données structurées fonctionnent ; backoff structuré jusqu’à cinq minutes en cas de panne générale), réveil au retour réseau. Un démarrage hors ligne retente aussi la récupération de session au retour réseau.
- Arrêt de session contrôlé entre les étapes ; verrou inter-onglets lorsque `navigator.locks` est disponible.

## Restauration

Les métadonnées arrivent sans téléchargement massif des binaires. Les cartes et fiches Médias indiquent les états `local_only`, `uploading`, `local_remote_verified`, `remote_only`, `downloading`, `sync_error`, `missing` en français.

« Récupérer l’original » télécharge un média à la demande. Le moteur vérifie le manifeste, la taille de chaque morceau, le quota estimé et le SHA-256 complet. Il écrit ensuite le Blob dans une transaction locale sans créer d’événement sortant. Une modification/suppression concurrente, un hash invalide, un morceau manquant ou une erreur de quota empêche l’installation de la copie reçue. L’original distant n’est jamais supprimé par cet échec.

Les originaux téléchargés sont disponibles dans IndexedDB hors ligne. La miniature peut manquer sur un nouvel appareil ; l’original est utilisé pour l’affichage, sans réencodage. Pas de récupération en lot à cette étape.

## Suppressions, conflits et limites

La suppression explicite locale retire les opérations média en attente dans la même transaction que le tombstone structuré. Le serveur masque manifestes et morceaux des médias supprimés. Un tombstone reçu ne détruit pas un original local encore en attente de sauvegarde : le conflit reste visible et récupérable.

Un original existant est immuable par identifiant. L’import d’un nouveau fichier produit déjà un nouvel id média ; une tentative de remplacer les octets sous un ancien id est signalée en erreur. Aucun partage physique par hash.

La limite distante reste **64 Mio par original**. Un fichier plus gros est gardé localement, en file d’attente avec une erreur explicite, jamais considéré comme sauvegardé. La vérification rassemble au maximum 64 Mio en mémoire côté client et serveur. Les fichiers précédemment recompressés par V5 restent conservés tels qu’ils existent.

## Preuves

- `npm test` : 15 tests, couvrant notamment interruption après acceptation distante, reprise sans doublons, ancien acquittement face à une modification locale, hash corrompu, chunk manquant, quota estimé insuffisant, exception `QuotaExceededError` pendant la transaction simulée, original >64 Mio, isolation du compte et protection de la dernière copie locale devant un tombstone/import de métadonnées.
- `scripts/verify-media-sync.mjs` exécuté avec le SDK Neon et des JWT réels sur la branche isolée : coupure après un chunk accepté, reprise n’envoyant que le chunk manquant, SHA-256 serveur, téléchargement JPEG bit-identique, persistance sans outbox parasite, suppression et absence de résurrection.
- `npm run build` inclut le nouveau module dans le cache PWA. Les contrôles du commit final et la preview sont consignés dans la PR #9.

La **gate 2 révisée est validée par ces tests de moteur local et de transport réel**. L’installation PWA sur l’iPad, le parcours avec le compte personnel, la migration des données et médias réels et la promotion restent en Phase 3. Aucune de ces validations utilisateur n’est présentée comme déjà réalisée.
