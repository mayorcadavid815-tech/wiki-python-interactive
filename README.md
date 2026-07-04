# 🐍 Viquipèdia Python – Interactiva & Responsive

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🚀 **Evolució del projecte:** Nascut originalment com a pràctica a 1r de Batxillerat (curs 2024-2025, Institut Pedraforca), el projecte ha estat completament **redissenyat i optimitzat** amb lògica programàtica avançada mentre curso **Desenvolupament d'Aplicacions Multiplataforma (DAM)**.

---

## 📖 Descripció

Aquest projecte és una **rèplica interactiva i d'alt rendiment** de l'article de **Python** de la [Viquipèdia en català](https://ca.wikipedia.org/wiki/Python). L'objectiu actual ha anat més enllà de la maquetació, transformant-se en una aplicació web que imita l'experiència d'usuari (UX) de la Wikipedia moderna mitjançant l'ús de **Vanilla JavaScript** i estils CSS modulars.

L'aplicació compta amb una interfície adaptativa (*responsive*) que inclou:
- 🔍 **Motor de cerca intern funcional** amb ressaltat dinàmic múltiple i navegació entre coincidències.
- 🗂️ **Menú lateral de navegació (Sidebar)** amb posicionament fix i control de desplaçament del fons.
- 📑 **Índex de continguts (TOC) interactiu** amb animacions fluides i transicions de visibilitat.
- 📊 **Infobox adaptativa** amb disseny de taula simètrica i gestió de contingut d'ample fix (`table-layout`).

---

## 🖼️ Captura de pantalla

![Captura de pantalla del projecte](https://github.com/mayorcadavid815-tech/wiki-python-interactive/blob/main/Viquipedia_files/img/captura_wiki.PNG)

---

## 🛠️ Tecnologies utilitzades

| Tecnologia | Ús |
|------------|-----|
| **HTML5** | Estructura semàntica i accessibilitat del contingut |
| **CSS3** | Layout modular (Flexbox, fixed/absolute), variables de tema i arquitectura d'animacions |
| **JavaScript (ES6+)** | Lògica del cercador de text plano, gestió del DOM, manipulació dinàmica de nodes i control de rendiment (*Debounce* i *requestAnimationFrame*) |

*Sense dependències ni frameworks externs (Pure Vanilla Stack).*

---

## ✨ Funcionalitats destacades

* ✅ **Cercador Intel·ligent en Temps Real:** Escaneja el text de l'article descartant scripts o infoboxes, ressalta totes les coincidències simultàniament i permet navegar linealment (enrere/endavant) ajustant automàticament el *scroll* respecte a la capçalera fixa.
* ✅ **Sidebar d'Interfície Moderna:** Menú lateral desplegable que bloqueja el *scroll* de la pàgina principal quan està actiu per millorar l'experiència en dispositius mòbils.
* ✅ **Índex de Continguts Fluid:** Menú desplegable d'índex amb línies de guia visual per als subniveles i tancament automàtic en fer *scroll*.
* ✅ **Infobox Robust:** Taula de dades optimitzada amb comportament fluid que evita el desbordament de text i manté cèl·les proporcionals.
* ✅ **Botó "Tornar a dalt":** Botó flotant optimitzat mitjançant `AnimationFrame` per no sobrecarregar el fil d'execució del navegador durant el desplaçament.

---

## 🚀 Com executar-lo localment

1. **Clona el repositori:**
   ```bash
   git clone [https://github.com/mayorcadavid815-tech/wiki-python-interactive.git](https://github.com/mayorcadavid815-tech/wiki-python-interactive.git)
