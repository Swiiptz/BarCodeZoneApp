# 📦 Barcode Zone App

Application mobile Android (installable en **APK**) permettant de **générer, afficher, organiser et sauvegarder** des codes-barres, en **100% hors-ligne**.

Auteur : **Swiiptz**

---

## ✨ Fonctionnalités principales

### ✅ 1) Codes-barres de Zone (stock / entrepôt / magasin)
Génération de codes-barres représentant un **emplacement physique** dans un entrepôt.

#### Format du code
Un code-barres “Zone” est composé de :

- **902** → Préfixe fixe obligatoire  
- **Z** → Zone (Ambiant, Surgelés, Frais, Fruits & Légumes, Kardex)  
- **A** → Allée (A…Z, configurable)  
- **01** → Étagère (01…99, configurable par zone)  
- **XXX** → Numéro d’emplacement (saisi par l’utilisateur)

**Exemple :**  
`902 1 C 03 157` → Zone **Ambiant** / Allée **C** / Étagère **03** / Emplacement **157**

#### Ce que l’app permet
- ✔ Choisir la **zone** (nom lisible)
  - Ambiant
  - Surgelés
  - Frais
  - Fruits & Légumes
  - Kardex
- ✔ Choisir l’**allée**
  - Lettres **100% configurables** (ex : A–E + R–T seulement)
- ✔ Choisir l’**étagère**
  - Limites propres à chaque zone (ex : 01–09, 01–11, etc.)
- ✔ Saisir le **numéro d’emplacement**
- ✔ **Générer** et **afficher** le code-barres (avec **zoom**)
- ✔ Ajouter aux **favoris zones**
  - Affichage : `Zone / Allée / Étagère / Emplacement`
  - Exemple : `Ambiant C.03.157`

---

### 🛒 2) Codes-barres Produits (EAN-13)
Génération et gestion de codes **EAN-13** standards.

#### Ce que l’app permet
- ✔ Saisir un **code EAN-13**
  - Exemple : `3701024507891`
- ✔ Afficher le code-barres (avec **zoom**)
- ✔ Ajouter un **nom produit** + Favori
  - Exemple : `Yaourt Vanille — 7891` (affiche les 4 derniers chiffres)
- ✔ Liste produits avec :
  - le **nom**
  - les **4 derniers chiffres** du code EAN
  - accès à l’**édition**
- ✔ Édition dédiée :
  - modifier le **nom**
  - modifier le **code EAN**
  - afficher le **code-barres**

---

### ⚙️ 3) Paramètres avancés
Personnalisation complète par zone :

- ✔ Définir les **lettres d’allée** disponibles par zone  
  Exemple :
  - Ambiant = A, B, C, D, E
  - Kardex = R, S, T
- ✔ Définir le **nombre d’étagères** par zone  
  Valeurs par défaut :
  - Ambiant → 01 à 09
  - Surgelés → 01 à 11
  - Frais → 01 à 07
  - Fruits & Légumes → 01 à 05
  - Kardex → 01 à 36
- ✔ **Enregistrement automatique**
  - Toutes les préférences sont **sauvegardées localement** et rechargées au démarrage.

---

### ⭐ 4) Favoris séparés
Deux onglets distincts pour éviter toute confusion :

- ✔ **Favoris Zones** : emplacements enregistrés
- ✔ **Favoris Produits** : produits enregistrés

---

## 📌 En résumé
Barcode Zone App permet de :

- ✔ Générer des codes-barres d’emplacements (stocks)
- ✔ Générer des codes-barres produits (EAN-13)
- ✔ Sauvegarder des favoris (2 sections indépendantes)
- ✔ Personnaliser zones / allées / étagères
- ✔ Travailler **100% hors-ligne**
- ✔ Installer facilement via **APK** (sans Play Store)

---

## 📲 Installation (APK)
1. Récupérer l’APK (section Releases ou fichier fourni en interne).
2. Sur Android, autoriser **l’installation depuis des sources inconnues** si nécessaire.
3. Installer l’APK.

---

## 🔒 Données & confidentialité
- Toutes les données (favoris et paramètres) sont **stockées localement** sur l’appareil.
- Aucune connexion requise, aucune synchronisation cloud.

---

## 🧰 Stack / techno
- Application mobile Android (APK)
- Hors-ligne (stockage local)

---

## 📄 Licence
Developper par Swiiptz, a demander pour tout usage.
