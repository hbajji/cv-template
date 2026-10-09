# CV en ligne — modèle

Un CV bilingue (français / anglais) en **React + Vite**, publiable gratuitement sur Netlify, avec export PDF.
Toutes les données de ce dossier sont **fictives** (« Alex Martin », « Acme Digital ») : remplacez-les par les vôtres.

*English summary: a bilingual online resume (React + Vite) with PDF export, SEO and optional analytics. All data here is fake — replace it with yours. Text lives in `src/i18n/*.json`, everything else in `src/data/structure.ts`.*

## Ce que vous obtenez

- **CV d'une à deux pages A4**, téléchargeable en PDF (bouton « Télécharger le PDF »), avec un texte lisible par les logiciels de recrutement (ATS).
- **Sections web uniquement** (absentes du PDF) : « À propos », « Réalisations » en cartes, et une section thématique libre (ex. « Encadrement & POC »).
- **Plusieurs langues** : un fichier JSON par langue, détection de la langue du navigateur, ajout d'une langue sans code.
- **Référencement** : pré-rendu en HTML statique, titre et description, aperçu de lien (LinkedIn, WhatsApp…), données structurées Google « Page de profil », sitemap.
- **Optionnel** : statistiques Firebase Analytics avec bandeau de consentement (cookies), page de confidentialité.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrez http://localhost:5173. Le texte surligné en jaune (entre `[crochets]` dans les fichiers) est à remplacer.

## Ce qu'il faut changer

### 1. Vos données — obligatoire

| Fichier | Contenu |
|---|---|
| `src/data/structure.ts` | Tout ce qui est **commun aux langues** : nom, email, téléphone, liens (LinkedIn, GitHub), entreprises, **dates** (`2023-06`), technologies, liens des projets, ordre des sections |
| `src/i18n/fr.json`, `src/i18n/en.json` | **Uniquement les textes** : titre, résumé, missions, descriptions de projets, formations, langues, centres d'intérêt… rangés sous les mêmes identifiants que `structure.ts` |

Règles utiles :

- Chaque expérience, poste, projet ou formation a un `id` dans `structure.ts` ; ses textes sont sous ce même `id` dans chaque fichier JSON.
- Les dates s'écrivent une seule fois (`2023-06`, ou `2019` pour une année seule) et s'affichent automatiquement dans chaque langue (« Juin 2023 », « Jun 2023 »). Sans date de fin, le poste est « en cours ».
- Une étiquette qui commence par `@` (ex. `@agileDelivery`) est traduite depuis la section `tags` des fichiers JSON ; les autres (`Swift`, `Jira`…) sont identiques dans toutes les langues.
- La section `about` (« À propos ») et les sections de projets n'apparaissent que sur le site, pas dans le PDF.

`npm run build` vérifie que **toutes les langues ont les mêmes textes** : s'il en manque un, le build échoue et indique la clé exacte.

### 2. Référencement et aperçu de lien — à faire avant de publier

| Fichier | Ce qu'il faut modifier |
|---|---|
| `index.html` | Votre nom, le titre, la description, l'adresse du site (`https://your-site.netlify.app`) et les données structurées (`ProfilePage` / `Person`). Les initiales du loader (`AM`) |
| `public/og-image.png` | L'image affichée quand le lien est partagé (1200 × 630 px) |
| `public/robots.txt`, `public/sitemap.xml` | L'adresse de votre site |
| `src/i18n/*.json` → `meta` | Le titre de l'onglet, la description et le nom du fichier PDF, par langue |

### 3. Statistiques — optionnel

Dans `src/analytics.ts`, collez la configuration web de votre projet Firebase (console Firebase → Paramètres du projet → Vos applications → Application Web). Laissée vide, **aucune mesure n'est faite** et le bandeau cookies n'apparaît pas.

Si vous activez les statistiques, adaptez aussi la **politique de confidentialité** (`labels.privacy` dans les fichiers JSON) : responsable, données collectées, contact. Elle est rédigée pour Firebase Analytics + Netlify, mais vérifiez qu'elle correspond à votre situation.

Événements mesurés : `download_pdf`, `select_section`, `project_link_click`, `notice_click`.

### 4. Apparence et finitions — optionnel

- **Couleurs** : variables en haut de `src/index.css` (`--accent`, `--ink`…) et dans les styles du loader de `index.html`.
- **Bandeau « site en cours de finalisation »** : textes dans `labels.notice` ; pour le retirer, supprimez la ligne `<NoticeBanner … />` dans `src/App.tsx`.
- **Pied de page** : `labels.footer` (« © {année} … · Dernière mise à jour : {date} », mis à jour à chaque build).

## Ajouter une langue

1. Copiez `src/i18n/fr.json` en `src/i18n/<code>.json` (ex. `es.json`, `ar.json`).
2. Dans `meta` : `label` (texte du bouton), `order` (position), `dir` (`ltr`, ou `rtl` pour l'arabe), et `"enabled": false` le temps de traduire (le bouton reste grisé).
3. Traduisez, puis passez `"enabled": true`. Le bouton apparaît automatiquement.

## Publier sur Netlify

1. Poussez le projet sur GitHub.
2. Sur Netlify : **Add new site → Import from Git**, choisissez le dépôt. Les réglages sont lus depuis `netlify.toml` (`npm run build`, dossier `dist`).
3. Mettez à jour l'adresse du site dans `index.html`, `robots.txt` et `sitemap.xml`.
4. Pour Google : ajoutez le site dans [Google Search Console](https://search.google.com/search-console) et soumettez `sitemap.xml`.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Site en local, rechargé à chaque modification |
| `npm run build` | Vérifie les traductions, construit le site et le pré-rend en HTML (dossier `dist`) |
| `npm run preview` | Sert le build de production en local |
| `npm run check:i18n` | Vérifie seulement les traductions |

## Structure

```
src/
├─ data/structure.ts    partie commune : ids, dates, URLs, technologies
├─ i18n/*.json          textes, un fichier par langue
├─ data/buildCV.ts      assemble structure + textes, formate les dates
├─ components/          CV, projets, barre d'outils, bandeaux…
├─ analytics.ts         Firebase Analytics (optionnel) + consentement
├─ entry-server.tsx     rendu HTML au build (pré-rendu)
└─ index.css            styles écran + impression A4
scripts/
├─ check-i18n.mts       vérification des traductions
└─ prerender.mjs        écrit le HTML pré-rendu dans dist/index.html
```
