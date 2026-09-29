# Archive documentaire — V6-Map V1 (27–29 septembre 2026)

**STATUT : HISTORIQUE / NON PRESCRIPTIF pour la conception des fonds V2.** Ces documents ont été déplacés depuis `docs/v6-map/` lors de la réconciliation de la PR #60, à la demande expresse du propriétaire. **Quinze fichiers Markdown préservés intégralement, sans réécriture de leur contenu**, y compris la preuve A0/A1/A2, les réserves iPad et les anciens plans de lots. Le chemin original figure dans l'historique Git.

**Autorité de conception actuelle :** [maître V2](../../v6-map/V6-MAP-MAITRE-V2.md), [cadrage des zones V2](../../v6-map/V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md) et [registre D1–D15 V2](../../v6-map/V6-MAP-V2-REGISTRE-IMPLANTATIONS.md). Les documents de transition `V6-MAP-PIVOT-V2-*.md` restent consultables en V2, mais leurs états d'avancement initiaux sont historiques.

## Inventaire des quinze sources originales

| Famille | Documents archivés | Justification |
|---|---|---|
| Maître historique | [V6-MAP-MAITRE.md](V6-MAP-MAITRE.md) | Architecture originelle 4 vues/zoom et géographie V1 ; préserver décisions géographiques non remplacées, **pas** ses points D7/D8 ni ses anciens budgets de résolution comme directives V2. |
| A0 | [Contrat](V6-MAP-A0-CONTRAT.md) ; [Annexe de traçabilité](V6-MAP-A0-ANNEXE-CONTRATS.md) | Preuves de la Gate documentaire A0, archivées sans en modifier rétrospectivement le résultat. |
| A1 | [Cahier POC Saint-Fût](V6-MAP-A1-POC-SAINT-FUT.md) ; [Notice locale](A1-NOTICE-POC.md) | Historique du démonstrateur POC neutre ; les fichiers d'exécution `poc/v6-map-a1/`, tests et workflows ne sont **pas** déplacés ni supprimés ici. |
| A2 | [Validation iPad](V6-MAP-A2-VALIDATION-IPAD.md) ; [Protocole matériel](V6-MAP-A2-PROTOCOLE-IPAD.md) ; [Rapport comparatif](V6-MAP-A2-RAPPORT-COMPARATIF.md) | Preuve historique de Gate A2 verte sur attestation matérielle utilisateur, avec ses limites explicites : tests simulés ≠ certification du rendu final, encodage WebP Canvas non démontré, AVIF non qualifié, mémoire RSS non mesurée. |
| Lots B1–B4 | [Ressources](V6-MAP-B1-RESSOURCES-ARDERA.md), [Interface](V6-MAP-B2-INTERFACE.md), [Toponymie](V6-MAP-B3-TOPONYMIE.md), [Donjons/Codex](V6-MAP-B4-DONJONS-CODEX.md) | Anciennes prescriptions d'agrandissement 4K→8K→16K et navigation par paliers abandonnées ; futures applications à spécifier depuis V2. |
| Lots C1–C3 | [Dimensions](V6-MAP-C1-DIMENSIONS.md), [Campagnes/secrets](V6-MAP-C2-CAMPAGNES-SECRETS.md), [PWA/validation](V6-MAP-C3-PWA-VALIDATION.md) | Références historiques, garanties de sécurité à reconduire et adapter au modèle V2/état V7 réel ; ne pas interpréter leurs plans non exécutés comme livrés. |

## Décisions V2 qui prévalent

- Navigation V2 : Entrevers, Ardéra, sept fonds de continents indépendants, trois entrées dimensionnelles. **Le cadrage détaillé de la Trame astrale reste hors de la PR #60** à la demande du propriétaire, sans retrait de sa référence cosmologique ou de navigation.
- D7 et D8 : **chacune est une dimension infinie qui EST le donjon homonyme sur tout le fragment peint**, sans point D7/D8 intérieur. Les anciens points V1 « Terrasses des Brasseurs » et « Citadelle de l'Abstinence » ne sont plus des implantations opérationnelles V2.
- Comptage D1–D15 : neuf Valdorie, trois Ferrécime, un Sylvaronde, un D7 dimensionnel, un D8 dimensionnel. Registre V2 seul référent.
- **Aucune suppression des preuves de POC, aucun reset IndexedDB, aucune mutation de V7 ou du média**, aucune fabrication de pixels 8K/16K. Les validations matérielles du POC historique ne certifient pas les futures illustrations.

Ne pas supprimer cette archive pour « nettoyer » davantage. Si une règle historique reste utile (confidentialité, limites matérielles, hydrographie), la réévaluer dans son cahier V2 sans modifier l'archive.
