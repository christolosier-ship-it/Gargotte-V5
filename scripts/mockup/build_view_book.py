#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
OUT = DOCS / "CAHIER-DES-VUES-GARGOTTEX-V6.pdf"
WORK = ROOT / ".tmp-view-book"
SHOTS = WORK / "screenshots"
MOCKUP_URL = "http://127.0.0.1:8765/docs/GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html"
COMMIT = os.environ.get("GITHUB_SHA", "V5.3")[:12]

DEVICES = [
    {"key":"desktop","label":"Desktop","size":"1440 x 900","width":1440,"height":900},
    {"key":"tablet","label":"Tablette","size":"1024 x 768","width":1024,"height":768},
    {"key":"phone","label":"Téléphone","size":"390 x 844","width":390,"height":844},
]

def js(code: str) -> str:
    return code.strip()

VIEWS = [
    {
      "id":"V01","group":"Navigation","title":"Accueil",
      "purpose":"Point d’entrée de Gargottex. La session active domine sans transformer l’écran en tableau de bord.",
      "setup":js("show('home');"),
      "callouts":[
        ("1","Navigation principale",0.06,0.12),("2","Contexte de session",0.42,0.30),
        ("3","Accès rapides",0.45,0.58),("4","État de partie",0.72,0.28)
      ],
      "notes":["Desktop : sidebar permanente et densité utile.","Tablette : rail compact et contenu recentré.","Téléphone : navigation basse, priorité à la session et aux actions immédiates."]
    },
    {
      "id":"V02","group":"Codex","title":"Bestiaire - collection",
      "purpose":"Explorer rapidement les créatures par image, catégorie, menace et donjon avant d’ouvrir une fiche.",
      "setup":js("show('codex'); renderCodexType('creatures'); bestiaryMode='gallery'; mobileDetailOpen=false; renderBestiary(); applyBestiaryResponsive();"),
      "callouts":[
        ("1","Familles du Codex",0.19,0.12),("2","Recherche et filtres",0.43,0.18),
        ("3","Bascule galerie / liste",0.74,0.18),("4","Collection de figurines",0.49,0.55)
      ],
      "notes":["La galerie est l’entrée éditoriale principale.","La couleur de catégorie reste un accent, jamais une grande surface.","Sur téléphone, la collection et la fiche deviennent séquentielles."]
    },
    {
      "id":"V03","group":"Codex","title":"Fiche créature",
      "purpose":"Comprendre une créature d’un regard : identité, figurine, statistiques, capacité, comportement, butin et lore.",
      "setup":js("""
        show('codex'); renderCodexType('creatures');
        const c=creatures.find(x=>/gobeline/i.test(x.name))||creatures.find(x=>x.id.startsWith('test-'))||creatures[0];
        selectedCreature=c.id; mobileDetailOpen=true; renderBestiary(); renderCreature(); applyBestiaryResponsive();
      """),
      "callouts":[
        ("1","Figurine détourée / diorama",0.36,0.42),("2","Identité et catégorie",0.72,0.22),
        ("3","Statistiques stables",0.73,0.43),("4","Compétence signature",0.73,0.64),
        ("5","Comportement / Butin / Lore",0.72,0.82)
      ],
      "notes":["La figurine reste le premier contenu.","Les stats suivent PV / ATK / DEF / Portée-Zone / Actions.","La fiche se compresse en sections plutôt que de cacher l’information essentielle."]
    },
    {
      "id":"V04","group":"Codex","title":"Donjons - collection",
      "purpose":"Parcourir les lieux comme des couvertures de chapitres narratifs, avec une ambiance propre à chaque donjon.",
      "setup":js("show('codex'); renderCodexType('dungeons'); familyDetailOpen.dungeons=false; renderFamilyBrowser('dungeons'); applyFamilyResponsive('dungeons');"),
      "callouts":[
        ("1","Onglet Donjons",0.19,0.12),("2","Recherche / mode d’affichage",0.53,0.18),
        ("3","Cartes de lieux",0.50,0.52),("4","Accent local de donjon",0.78,0.52)
      ],
      "notes":["La structure reste commune à tout le Codex.","L’accent du donjon colore l’ambiance sans remplacer les couleurs gameplay.","Les cartes restent lisibles même sans couverture dédiée."]
    },
    {
      "id":"V05","group":"Codex","title":"Fiche donjon",
      "purpose":"Présenter un donjon comme un hub narratif : couverture, progression, boss et liens vers les entités associées.",
      "setup":js("show('codex'); renderCodexType('dungeons'); familySelected.dungeons='dungeon-4'; familyDetailOpen.dungeons=true; renderFamilyBrowser('dungeons'); applyFamilyResponsive('dungeons');"),
      "callouts":[
        ("1","Couverture et ambiance",0.49,0.31),("2","Identité du lieu",0.50,0.55),
        ("3","Étages / budgets",0.40,0.74),("4","Boss final",0.72,0.74)
      ],
      "notes":["Le donjon est traité comme une couverture éditoriale.","Les étages restent extensibles : 5, 10 ou 100 niveaux sans changer le modèle.","Le Boss peut déclencher une révélation théâtralisée."]
    },
    {
      "id":"V06","group":"Codex","title":"Héros - collection",
      "purpose":"Parcourir les héros par identité continue, chaque personnage conservant ses quatre niveaux.",
      "setup":js("show('codex'); renderCodexType('heroes'); familyDetailOpen.heroes=false; renderFamilyBrowser('heroes'); applyFamilyResponsive('heroes');"),
      "callouts":[
        ("1","Famille Héros",0.18,0.12),("2","Collection",0.50,0.50),
        ("3","Nombre de niveaux",0.52,0.74),("4","Illustrations détourées",0.76,0.50)
      ],
      "notes":["Les visuels utilisent les dérivés transparents du workflow de détourage.","Une carte représente un héros, pas un niveau isolé.","La fiche porte ensuite la progression niveau par niveau."]
    },
    {
      "id":"V07","group":"Codex","title":"Fiche héros",
      "purpose":"Montrer la progression d’un héros, avec image propre au niveau, statistiques et compétences cumulées.",
      "setup":js("""
        show('codex'); renderCodexType('heroes');
        const h=codexHeroes.find(x=>/Brünhilda/i.test(x.name))||codexHeroes[0];
        familySelected.heroes=h.id; familyDetailOpen.heroes=true; heroLevelState[h.id]=3;
        renderFamilyBrowser('heroes'); applyFamilyResponsive('heroes');
      """),
      "callouts":[
        ("1","Portrait détouré du niveau",0.32,0.42),("2","Sélecteur N1-N4",0.32,0.83),
        ("3","Statistiques",0.72,0.36),("4","Compétences cumulées",0.72,0.63),
        ("5","Tampon Brouhaha",0.84,0.63)
      ],
      "notes":["Chaque niveau possède sa propre image.","Les compétences acquises aux niveaux précédents restent visibles.","Le Brouhaha lié à une compétence est traité comme un tampon, pas comme un simple badge."]
    },
    {
      "id":"V08","group":"Codex","title":"PNJ - collection",
      "purpose":"Parcourir les personnages non joueurs par visage, race et rôle, sans leur inventer de statistiques de combat.",
      "setup":js("show('codex'); renderCodexType('npcs'); familyDetailOpen.npcs=false; renderFamilyBrowser('npcs'); applyFamilyResponsive('npcs');"),
      "callouts":[
        ("1","Famille PNJ",0.18,0.12),("2","Collection de portraits",0.50,0.52),
        ("3","Race / rôle",0.50,0.75),("4","Mode galerie / liste",0.77,0.18)
      ],
      "notes":["La fiche PNJ est narrative, pas tactique.","Les images sont affichées en entier autant que possible.","Les relations servent de porte d’entrée vers les quêtes associées."]
    },
    {
      "id":"V09","group":"Codex","title":"Fiche PNJ",
      "purpose":"Donner une identité forte à un PNJ : portrait, rôle, ton, lore et relations.",
      "setup":js("show('codex'); renderCodexType('npcs'); familySelected.npcs=codexNpcs[0].id; familyDetailOpen.npcs=true; renderFamilyBrowser('npcs'); applyFamilyResponsive('npcs');"),
      "callouts":[
        ("1","Portrait",0.34,0.36),("2","Nom et rôle",0.70,0.22),
        ("3","Traits de personnalité",0.28,0.72),("4","Lore",0.60,0.72),("5","Relations",0.84,0.72)
      ],
      "notes":["Le portrait conserve ses proportions.","Le ton et le lore remplacent les faux blocs de stats.","Les relations prolongent naturellement la navigation du Codex."]
    },
    {
      "id":"V10","group":"Codex","title":"Quêtes - collection",
      "purpose":"Consulter les contrats du Codex, distincts du tirage rapide de quête en session.",
      "setup":js("show('codex'); renderCodexType('quests'); familyDetailOpen.quests=false; renderFamilyBrowser('quests'); applyFamilyResponsive('quests');"),
      "callouts":[
        ("1","Famille Quêtes",0.18,0.12),("2","Recherche",0.48,0.18),
        ("3","Liste de contrats",0.49,0.52),("4","Difficulté",0.78,0.52)
      ],
      "notes":["Le Codex présente la bibliothèque complète.","La difficulté est visible sans surcharger la carte.","La session de jeu utilise une vue volontairement plus courte."]
    },
    {
      "id":"V11","group":"Codex","title":"Fiche quête",
      "purpose":"Présenter clairement le commanditaire, l’objectif, la difficulté et la récompense.",
      "setup":js("show('codex'); renderCodexType('quests'); familySelected.quests=codexQuests[0].id; familyDetailOpen.quests=true; renderFamilyBrowser('quests'); applyFamilyResponsive('quests');"),
      "callouts":[
        ("1","Titre / commanditaire",0.50,0.26),("2","Difficulté",0.77,0.26),
        ("3","Objectif",0.48,0.55),("4","Récompense / rattachement",0.54,0.76)
      ],
      "notes":["L’objectif est la pièce immédiatement repérable.","La fiche conserve une matière narrative légère.","La difficulté reste un repère secondaire."]
    },
    {
      "id":"V12","group":"Codex","title":"Loot - collection",
      "purpose":"Parcourir les objets de butin comme un cabinet de curiosités.",
      "setup":js("show('codex'); renderCodexType('loot'); familyDetailOpen.loot=false; renderFamilyBrowser('loot'); applyFamilyResponsive('loot');"),
      "callouts":[
        ("1","Famille Loot",0.18,0.12),("2","Galerie d’objets",0.50,0.52),
        ("3","Rareté",0.52,0.73),("4","Origine / type",0.76,0.73)
      ],
      "notes":["La rareté ne doit pas inventer une hiérarchie absente des données.","La galerie privilégie l’objet, la liste privilégie l’arbitrage.","Les métadonnées restent visibles mais secondaires."]
    },
    {
      "id":"V13","group":"Codex","title":"Fiche loot",
      "purpose":"Décrire un objet de butin avec sa présentation, sa valeur et sa provenance.",
      "setup":js("show('codex'); renderCodexType('loot'); familySelected.loot=codexLoot[0].id; familyDetailOpen.loot=true; renderFamilyBrowser('loot'); applyFamilyResponsive('loot');"),
      "callouts":[
        ("1","Objet / vitrine",0.34,0.43),("2","Nom / rareté",0.70,0.24),
        ("3","Valeur",0.70,0.48),("4","Source / notes",0.70,0.71)
      ],
      "notes":["Le visuel d’objet reste central.","La valeur et la provenance servent la partie sans dominer la fiche.","Les états sans image utilisent un fallback cohérent."]
    },
    {
      "id":"V14","group":"Codex","title":"Objets du décor - collection",
      "purpose":"Repérer les éléments interactifs d’une salle et leurs fonctions.",
      "setup":js("show('codex'); renderCodexType('interactables'); familyDetailOpen.interactables=false; renderFamilyBrowser('interactables'); applyFamilyResponsive('interactables');"),
      "callouts":[
        ("1","Famille Objets",0.18,0.12),("2","Liste fonctionnelle",0.50,0.52),
        ("3","Donjon associé",0.52,0.73),("4","Type d’objet",0.76,0.73)
      ],
      "notes":["La liste est le mode naturel pour arbitrer rapidement.","L’objet reste relié à son donjon d’origine.","La fiche détaille ensuite les actions et conséquences."]
    },
    {
      "id":"V15","group":"Codex","title":"Fiche objet du décor",
      "purpose":"Décrire un élément de salle, ses actions possibles et son effet.",
      "setup":js("show('codex'); renderCodexType('interactables'); familySelected.interactables=codexInteractables[0].id; familyDetailOpen.interactables=true; renderFamilyBrowser('interactables'); applyFamilyResponsive('interactables');"),
      "callouts":[
        ("1","Visuel / plan",0.34,0.42),("2","Identité",0.70,0.23),
        ("3","Actions",0.70,0.48),("4","Effet",0.70,0.70)
      ],
      "notes":["La fiche vise l’usage à la table.","Les actions sont plus importantes que la décoration.","La présentation reste cohérente avec le Codex sans imiter une fiche créature."]
    },
    {
      "id":"V16","group":"Codex","title":"Brouhaha - collection",
      "purpose":"Référentiel des effets de Brouhaha, distinct du compteur de session.",
      "setup":js("show('codex'); renderCodexType('brouhaha'); familyDetailOpen.brouhaha=false; renderFamilyBrowser('brouhaha'); applyFamilyResponsive('brouhaha');"),
      "callouts":[
        ("1","Famille Brouhaha",0.18,0.12),("2","Échelle des incidents",0.50,0.52),
        ("3","Niveau",0.52,0.73),("4","Donjon / portée",0.76,0.73)
      ],
      "notes":["Le Codex explique les incidents.","La vue session, elle, met en scène la pression actuelle.","Les deux rôles ne sont pas mélangés."]
    },
    {
      "id":"V17","group":"Codex","title":"Fiche Brouhaha",
      "purpose":"Décrire un incident de Brouhaha comme une règle de référence lisible.",
      "setup":js("show('codex'); renderCodexType('brouhaha'); familySelected.brouhaha=codexBrouhaha[Math.min(1,codexBrouhaha.length-1)].id; familyDetailOpen.brouhaha=true; renderFamilyBrowser('brouhaha'); applyFamilyResponsive('brouhaha');"),
      "callouts":[
        ("1","Niveau",0.33,0.33),("2","Titre de l’incident",0.69,0.26),
        ("3","Effet",0.69,0.53),("4","Contexte",0.69,0.75)
      ],
      "notes":["La fiche reste une référence, pas un compteur.","Le niveau et l’effet sont lus immédiatement.","La direction visuelle annonce déjà le chaos sans nuire à la règle."]
    },
    {
      "id":"V18","group":"Partie","title":"Hub Jeu",
      "purpose":"Regrouper les outils de session et le contexte partagé, surtout sur téléphone.",
      "setup":js("show('game');"),
      "callouts":[
        ("1","Résumé de session",0.49,0.25),("2","Générateur",0.37,0.56),
        ("3","Brouhaha",0.67,0.56),("4","Navigation Jeu",0.51,0.88)
      ],
      "notes":["Le hub évite de surcharger la navigation mobile.","Le contexte donjon / étage est partagé entre les outils.","Sur desktop, les outils restent directement accessibles."]
    },
    {
      "id":"V19","group":"Partie","title":"Générateur de rencontre",
      "purpose":"Configurer, générer puis consommer une rencontre sans introduire de tracker de combat complet.",
      "setup":js("show('generator'); document.querySelector('#generate')?.click();"),
      "callouts":[
        ("1","Contexte donjon / étage",0.47,0.16),("2","Mode de rencontre",0.50,0.31),
        ("3","Résultat généré",0.49,0.60),("4","Stats et compétence",0.56,0.70),
        ("5","Actions Fiche / Éliminer",0.83,0.70)
      ],
      "notes":["Le résultat devient la priorité visuelle.","ACTION et MENACE complètent PV / ATK / DEF.","Éliminer agit occurrence par occurrence et déclenche le butin une seule fois."]
    },
    {
      "id":"V20","group":"Partie","title":"Brouhaha - session",
      "purpose":"Faire ressentir la pression croissante du Brouhaha tout en conservant une interaction compréhensible.",
      "setup":js("""
        show('brouhaha');
        const meter=document.querySelector('#bh-meter');
        if(meter){meter.value=10; meter.dispatchEvent(new Event('input',{bubbles:true}));}
        document.querySelector('#bh-draw')?.click();
      """),
      "callouts":[
        ("1","Pression / niveau",0.39,0.42),("2","Commandes +/-",0.39,0.66),
        ("3","Tirer un effet",0.40,0.79),("4","Effet courant",0.77,0.49)
      ],
      "notes":["Le chaos est volontairement asymétrique.","La pression visuelle augmente avec le niveau.","Le tirage d’effet reste séparé de la modification du niveau."]
    },
    {
      "id":"V21","group":"Partie","title":"Quêtes - session",
      "purpose":"Tirer et jouer immédiatement une quête sans ouvrir toute la bibliothèque du Codex.",
      "setup":js("show('quests'); renderQuest();"),
      "callouts":[
        ("1","Contrat courant",0.50,0.34),("2","Commanditaire",0.50,0.52),
        ("3","Objectif",0.50,0.68),("4","Relance / actions",0.51,0.83)
      ],
      "notes":["Cette vue est volontairement courte.","Le reroll est immédiat.","La bibliothèque complète reste dans le Codex."]
    },
    {
      "id":"V22","group":"Administration","title":"Atelier",
      "purpose":"Créer, modifier et supprimer toutes les familles d’items via une structure type -> liste -> fiche.",
      "setup":js("show('atelier'); renderAtelier('creatures');"),
      "callouts":[
        ("1","Onglets de types",0.51,0.16),("2","Liste des items",0.23,0.49),
        ("3","Fiche d’édition",0.65,0.49),("4","Enregistrer / supprimer",0.71,0.82)
      ],
      "notes":["L’Atelier reste plus fonctionnel que le Codex.","Les formulaires évitent les textures fortes.","La suppression reste confinée à une zone Danger explicite."]
    },
    {
      "id":"V23","group":"Administration","title":"Médias",
      "purpose":"Gérer les originaux, leur présence locale, la sauvegarde distante et les états remote_only.",
      "setup":js("show('media');"),
      "callouts":[
        ("1","Recherche / filtres",0.49,0.18),("2","Galerie média",0.49,0.51),
        ("3","État local / distant",0.72,0.67),("4","Actions média",0.84,0.82)
      ],
      "notes":["Original et dérivé restent distincts.","Les états locaux et distants sont lisibles sans ambiguïté.","La perte de connectivité ne doit jamais bloquer le travail local."]
    },
    {
      "id":"V24","group":"Administration","title":"Import / Export",
      "purpose":"Importer ou exporter JSON, XLSX et médias sans mélanger les mécanismes ni écrire avant validation.",
      "setup":js("show('importexport');"),
      "callouts":[
        ("1","Zone Import",0.33,0.43),("2","Zone Export",0.69,0.43),
        ("3","Actions explicites",0.33,0.67),("4","Preview avant écriture",0.69,0.67)
      ],
      "notes":["La preview reste obligatoire avant import massif.","JSON, XLSX et originaux médias sont des flux distincts.","Les erreurs excluent les lignes invalides, les warnings restent importables."]
    },
    {
      "id":"V25","group":"Navigation","title":"Plus - arrière-comptoir",
      "purpose":"Regrouper les fonctions secondaires et d’administration dans la navigation mobile.",
      "setup":js("show('more');"),
      "callouts":[
        ("1","État système",0.49,0.22),("2","Atelier",0.28,0.49),
        ("3","Médias / Import",0.57,0.49),("4","Installation PWA",0.49,0.78)
      ],
      "notes":["Cette vue est surtout importante sur téléphone.","Elle évite de surcharger la navigation primaire.","L’installation PWA reste une action secondaire."]
    },
    {
      "id":"V26","group":"Système","title":"Recherche globale",
      "purpose":"Retrouver rapidement une entité sans quitter le contexte de navigation.",
      "setup":js("""
        show('home');
        document.querySelector('#search-modal')?.classList.add('open');
        const q=document.querySelector('#global-search-input');
        if(q){q.value='Bastognac'; q.dispatchEvent(new Event('input',{bubbles:true}));}
      """),
      "callouts":[
        ("1","Champ de recherche",0.50,0.34),("2","Résultats transversaux",0.50,0.55),
        ("3","Fermeture explicite",0.71,0.25)
      ],
      "notes":["La recherche est un overlay global.","Le contexte précédent reste intact.","Sur desktop, Cmd/Ctrl+K sert de raccourci."]
    },
    {
      "id":"V27","group":"Système","title":"Synchronisation",
      "purpose":"Rendre visibles l’état local, Neon et les médias sans interrompre le travail.",
      "setup":js("show('home'); document.querySelector('#sync-drawer')?.classList.add('open');"),
      "callouts":[
        ("1","Drawer non bloquant",0.78,0.50),("2","État local",0.78,0.35),
        ("3","État Neon",0.78,0.54),("4","Médias / diagnostic",0.78,0.72)
      ],
      "notes":["Le local reste la source opérationnelle immédiate.","Une erreur distante ne doit pas effacer une donnée locale saine.","Le drawer synthétise avant de détailler."]
    },
    {
      "id":"V28","group":"Référence","title":"Design system / Mockup",
      "purpose":"Rassembler les palettes, typographies, matières, emblèmes, composants, états et règles responsive de la V6.",
      "setup":js("show('mockup'); window.scrollTo(0,0);"),
      "callouts":[
        ("1","Sommaire du système",0.50,0.18),("2","Palette structurelle",0.35,0.46),
        ("3","Couleurs gameplay",0.65,0.46),("4","Sections de référence",0.50,0.80)
      ],
      "notes":["Cette page n’est pas une vue de production finale.","Elle sert de banc d’essai visuel et de référence de tokens.","Les docs UI-1 à UI-6 restent la source de vérité fonctionnelle."]
    },
]

GROUP_ORDER = ["Navigation","Codex","Partie","Administration","Système","Référence"]

def start_server():
    log = open(WORK / "server.log", "w", encoding="utf-8")
    proc = subprocess.Popen([sys.executable, "-m", "http.server", "8765", "--bind", "127.0.0.1", "--directory", str(ROOT)], stdout=log, stderr=log)
    for _ in range(50):
        try:
            import urllib.request
            with urllib.request.urlopen(MOCKUP_URL, timeout=1) as r:
                if r.status == 200:
                    return proc
        except Exception:
            time.sleep(0.2)
    proc.terminate()
    raise RuntimeError("Local mockup server did not start")

def wait_assets(page):
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_function("document.readyState === 'complete'")
    page.evaluate("""async()=>{ if(document.fonts&&document.fonts.ready) await document.fonts.ready; await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true})}))); }""")
    page.wait_for_timeout(120)

def capture_all():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = start_server()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--disable-dev-shm-usage"])
            for device in DEVICES:
                context = browser.new_context(viewport={"width":device["width"],"height":device["height"]}, device_scale_factor=1, reduced_motion="reduce")
                page = context.new_page()
                for index, view in enumerate(VIEWS, 1):
                    page.goto(MOCKUP_URL, wait_until="domcontentloaded")
                    wait_assets(page)
                    page.add_style_tag(content="""*{animation-duration:.001ms!important;animation-delay:0ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important} html,body{caret-color:transparent!important}""")
                    page.evaluate("localStorage.setItem('mockup:bestiaryMode','gallery')")
                    page.evaluate(view["setup"])
                    page.evaluate("window.scrollTo(0,0)")
                    page.wait_for_timeout(170)
                    out = SHOTS / f"{view['id']}-{device['key']}.jpg"
                    page.screenshot(path=str(out), type="jpeg", quality=86, full_page=False)
                context.close()
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

def font_paths():
    candidates = [
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf","/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"),
        ("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf","/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf","/usr/share/fonts/truetype/liberation2/LiberationSerif-Bold.ttf"),
    ]
    for regular,bold,serif in candidates:
        if all(Path(x).exists() for x in (regular,bold,serif)):
            return regular,bold,serif
    raise RuntimeError("No suitable system fonts found")

def register_fonts():
    regular,bold,serif=font_paths()
    pdfmetrics.registerFont(TTFont("GargSans",regular))
    pdfmetrics.registerFont(TTFont("GargSansBold",bold))
    pdfmetrics.registerFont(TTFont("GargSerifBold",serif))

PAGE_W, PAGE_H = landscape(A3)
BG = colors.HexColor("#0B0806")
SURFACE = colors.HexColor("#17110D")
SURFACE2 = colors.HexColor("#21170F")
BORDER = colors.HexColor("#4B3828")
TEXT = colors.HexColor("#F4E8D8")
MUTED = colors.HexColor("#B7A187")
TER = colors.HexColor("#867563")
GOLD = colors.HexColor("#D4A45F")
GOLDSOFT = colors.HexColor("#F0CF93")
RED = colors.HexColor("#EF4B4B")

def rounded_box(c,x,y,w,h,fill=SURFACE,stroke=BORDER,r=10):
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(0.8)
    c.roundRect(x,y,w,h,r,fill=1,stroke=1)

def draw_text(c,text,x,y,w,size=10,color=TEXT,font="GargSans",leading=None,max_lines=None):
    leading=leading or size*1.35
    words=str(text).split()
    lines=[]; current=""
    for word in words:
        trial=(current+" "+word).strip()
        if pdfmetrics.stringWidth(trial,font,size)<=w or not current:
            current=trial
        else:
            lines.append(current); current=word
    if current: lines.append(current)
    if max_lines and len(lines)>max_lines:
        lines=lines[:max_lines]
        last=lines[-1]
        while last and pdfmetrics.stringWidth(last+"…",font,size)>w: last=last[:-1]
        lines[-1]=last+"…"
    c.setFillColor(color); c.setFont(font,size)
    yy=y
    for line in lines:
        c.drawString(x,yy,line); yy-=leading
    return yy

def fit_image(path,max_w,max_h):
    with Image.open(path) as im:
        w,h=im.size
    s=min(max_w/w,max_h/h)
    return w*s,h*s

def draw_device_shot(c,device,path,x,y,max_w,max_h):
    rounded_box(c,x,y,max_w,max_h,fill=colors.HexColor("#100B08"),stroke=BORDER,r=9)
    inner=8
    iw,ih=fit_image(path,max_w-inner*2,max_h-inner*2-20)
    ix=x+(max_w-iw)/2
    iy=y+8+(max_h-28-ih)/2
    c.drawImage(ImageReader(str(path)),ix,iy,iw,ih,mask="auto")
    c.setFillColor(MUTED); c.setFont("GargSansBold",8)
    c.drawString(x+9,y+max_h-14,f"{device['label']} · {device['size']}")
    return ix,iy,iw,ih

def draw_marker(c,shot_rect,marker):
    num,label,nx,ny=marker
    x,y,w,h=shot_rect
    px=x+w*nx; py=y+h*(1-ny)
    c.setFillColor(GOLD); c.circle(px,py,9,fill=1,stroke=0)
    c.setFillColor(colors.HexColor("#211407")); c.setFont("GargSansBold",7)
    tw=pdfmetrics.stringWidth(num,"GargSansBold",7)
    c.drawString(px-tw/2,py-2.5,num)

def page_header(c,view,page_no,total):
    c.setFillColor(BG); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    c.setFillColor(GOLD); c.setFont("GargSansBold",8); c.drawString(28,PAGE_H-27,f"{view['id']} · {view['group'].upper()}")
    c.setFillColor(TEXT); c.setFont("GargSerifBold",24); c.drawString(28,PAGE_H-55,view["title"])
    c.setFillColor(TER); c.setFont("GargSans",7); c.drawRightString(PAGE_W-28,PAGE_H-27,f"Gargottex V6 · V5.3 · {COMMIT} · {page_no}/{total}")

def draw_view_page(c,view,page_no,total):
    page_header(c,view,page_no,total)
    desktop=SHOTS/f"{view['id']}-desktop.jpg"
    tablet=SHOTS/f"{view['id']}-tablet.jpg"
    phone=SHOTS/f"{view['id']}-phone.jpg"

    # Visual row.
    d_rect=draw_device_shot(c,DEVICES[0],desktop,28,350,520,340)
    t_rect=draw_device_shot(c,DEVICES[1],tablet,566,410,360,280)
    p_rect=draw_device_shot(c,DEVICES[2],phone,944,350,170,340)
    for marker in view["callouts"]:
        draw_marker(c,d_rect,marker)

    # Documentation band.
    rounded_box(c,28,34,PAGE_W-56,292,fill=colors.HexColor("#120D09"),stroke=BORDER,r=12)
    c.setFillColor(GOLDSOFT); c.setFont("GargSansBold",8); c.drawString(46,304,"RÔLE DE LA VUE")
    draw_text(c,view["purpose"],46,285,520,11,TEXT,"GargSans",15,max_lines=3)

    c.setFillColor(GOLDSOFT); c.setFont("GargSansBold",8); c.drawString(46,232,"LÉGENDE")
    yy=213
    for num,label,*_ in view["callouts"]:
        c.setFillColor(GOLD); c.circle(53,yy+2,7,fill=1,stroke=0)
        c.setFillColor(colors.HexColor("#211407")); c.setFont("GargSansBold",6)
        c.drawCentredString(53,yy,num)
        draw_text(c,label,66,yy,480,9,TEXT,"GargSans",12,max_lines=1)
        yy-=24

    c.setFillColor(GOLDSOFT); c.setFont("GargSansBold",8); c.drawString(590,304,"COMPORTEMENT RESPONSIVE")
    yy=284
    for note in view["notes"]:
        c.setFillColor(GOLD); c.circle(598,yy+3,2.2,fill=1,stroke=0)
        yy=draw_text(c,note,608,yy,485,9,MUTED,"GargSans",12,max_lines=2)-6

    c.setFillColor(TER); c.setFont("GargSans",7)
    c.drawString(590,70,"Captures issues de la maquette HTML exécutée localement dans les trois breakpoints de référence.")
    c.drawString(590,55,"Les légendes documentent l’intention UI ; les documents UI-1 à UI-6 restent la source de vérité.")

def draw_cover(c,total):
    c.setFillColor(BG); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    # Darkened home screenshots.
    home=SHOTS/"V01-desktop.jpg"
    c.saveState()
    c.setFillAlpha(0.34)
    c.drawImage(ImageReader(str(home)),0,0,PAGE_W,PAGE_H,mask="auto")
    c.restoreState()
    c.setFillColor(colors.Color(0.043,0.031,0.024,alpha=0.72)); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    c.setFillColor(GOLD); c.setFont("GargSansBold",10); c.drawString(64,PAGE_H-90,"GARGOTTEX V6 · CAHIER DES VUES")
    c.setFillColor(TEXT); c.setFont("GargSerifBold",46); c.drawString(64,PAGE_H-155,"Maquette V3")
    c.setFillColor(GOLDSOFT); c.setFont("GargSerifBold",27); c.drawString(64,PAGE_H-195,"Desktop · Tablette · Téléphone")
    draw_text(c,"Inventaire visuel légendé des vues, fiches et outils avant préparation de la production finale.",64,PAGE_H-245,650,15,MUTED,"GargSans",21,max_lines=3)
    rounded_box(c,64,100,430,112,fill=colors.HexColor("#120D09"),stroke=BORDER,r=12)
    c.setFillColor(GOLDSOFT); c.setFont("GargSansBold",8); c.drawString(82,184,"PÉRIMÈTRE")
    draw_text(c,f"{len(VIEWS)} vues documentées · 3 breakpoints · {len(VIEWS)*3} captures de référence",82,161,390,11,TEXT,"GargSans",16)
    draw_text(c,f"Branche V5.3 · commit {COMMIT}",82,130,390,9,MUTED,"GargSans",13)
    c.setFillColor(TER); c.setFont("GargSans",7); c.drawRightString(PAGE_W-64,45,"Document de préparation à la production · généré depuis la maquette")

def draw_index(c,total):
    c.setFillColor(BG); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    c.setFillColor(GOLD); c.setFont("GargSansBold",8); c.drawString(40,PAGE_H-35,"SOMMAIRE")
    c.setFillColor(TEXT); c.setFont("GargSerifBold",30); c.drawString(40,PAGE_H-70,"Inventaire des vues")
    columns=3; col_w=(PAGE_W-80)/columns
    grouped={g:[v for v in VIEWS if v["group"]==g] for g in GROUP_ORDER}
    x=40; y=PAGE_H-112; col=0
    for group in GROUP_ORDER:
        items=grouped[group]
        need=28+len(items)*22
        if y-need<70:
            col+=1; x=40+col*col_w; y=PAGE_H-112
        c.setFillColor(GOLDSOFT); c.setFont("GargSansBold",9); c.drawString(x,y,group.upper()); y-=20
        for v in items:
            c.setFillColor(GOLD); c.setFont("GargSansBold",7); c.drawString(x,y,v["id"])
            c.setFillColor(TEXT); c.setFont("GargSans",8); c.drawString(x+34,y,v["title"][:42])
            y-=22
        y-=12
    rounded_box(c,40,48,PAGE_W-80,72,fill=colors.HexColor("#120D09"),stroke=BORDER,r=10)
    draw_text(c,"Convention responsive : Desktop 1440×900, Tablette 1024×768 paysage, Téléphone 390×844 portrait. Les captures montrent le premier écran utile de chaque état, comme l’utilisateur le rencontre réellement.",58,91,PAGE_W-116,9,MUTED,"GargSans",13,max_lines=3)

def draw_method(c):
    c.setFillColor(BG); c.rect(0,0,PAGE_W,PAGE_H,fill=1,stroke=0)
    c.setFillColor(GOLD); c.setFont("GargSansBold",8); c.drawString(40,PAGE_H-35,"MODE D’EMPLOI")
    c.setFillColor(TEXT); c.setFont("GargSerifBold",30); c.drawString(40,PAGE_H-70,"Comment lire le cahier")
    cards=[
      ("1 · Capture réelle","Chaque page est générée depuis la maquette HTML de V5.3 dans Chromium, avec les ressources du repo."),
      ("2 · Trois breakpoints","Desktop montre la densité et le master-detail ; tablette teste la recomposition ; téléphone valide la séquence tactile."),
      ("3 · Légendes","Les pastilles numérotées repèrent les zones structurantes. Elles ne représentent pas des composants additionnels."),
      ("4 · Documentation","Le texte décrit le rôle de la vue, sa hiérarchie et les adaptations responsive à conserver en production."),
      ("5 · Source de vérité","Ce cahier documente la maquette. Les fichiers UI-1 à UI-6 tranchent en cas d’écart fonctionnel ou d’accessibilité."),
      ("6 · Production","Une différence visuelle pourra être acceptée si elle respecte l’intention documentée et améliore robustesse, accessibilité ou performance.")
    ]
    x0=40; y0=PAGE_H-130; w=(PAGE_W-100)/2; h=170
    for i,(title,copy) in enumerate(cards):
        col=i%2; row=i//2
        x=x0+col*(w+20); y=y0-row*(h+18)-h
        rounded_box(c,x,y,w,h,fill=SURFACE,stroke=BORDER,r=12)
        c.setFillColor(GOLDSOFT); c.setFont("GargSerifBold",16); c.drawString(x+18,y+h-30,title)
        draw_text(c,copy,x+18,y+h-55,w-36,10,MUTED,"GargSans",14,max_lines=6)

def build_pdf():
    register_fonts()
    c=canvas.Canvas(str(OUT),pagesize=landscape(A3))
    c.setTitle("Gargottex V6 - Cahier des vues de la maquette")
    c.setAuthor("OpenAI - préparation à partir de la maquette Gargottex V6")
    total=3+len(VIEWS)
    draw_cover(c,total); c.showPage()
    draw_index(c,total); c.showPage()
    draw_method(c); c.showPage()
    for idx,view in enumerate(VIEWS,start=4):
        draw_view_page(c,view,idx,total)
        c.showPage()
    c.save()

def main():
    WORK.mkdir(parents=True,exist_ok=True)
    capture_all()
    build_pdf()
    print(json.dumps({
        "output":str(OUT.relative_to(ROOT)),
        "views":len(VIEWS),
        "captures":len(VIEWS)*len(DEVICES),
        "bytes":OUT.stat().st_size,
    },ensure_ascii=False))

if __name__ == "__main__":
    main()
