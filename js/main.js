/* ============================================================
   StockMvt — Site vitrine
   ⚠️ SEULE LIGNE À MODIFIER LE JOUR DE LA PUBLICATION :
      LIEN_PLAY_STORE (ligne juste en dessous)
   ============================================================ */

var LIEN_PLAY_STORE = ""; // ex : "https://play.google.com/store/apps/details?id=com.jllbstudio.stockmvt"

/* Clé publique Web3Forms (voir PARTIE 5 du guide) */
var CLE_WEB3FORMS = "REMPLACE_PAR_TA_CLE_WEB3FORMS";

(function () {
    "use strict";

    /* ---------- 1. Thème clair / sombre ---------- */
    var CLE_THEME = "smv_site_theme";

    function appliquerTheme(theme) {
        if (theme === "sombre") {
            document.documentElement.setAttribute("data-theme", "sombre");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", theme === "sombre" ? "#0B1120" : "#FFFFFF");
    }

    function themeInitial() {
        var enregistre = null;
        try { enregistre = localStorage.getItem(CLE_THEME); } catch (e) {}
        if (enregistre) return enregistre;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "sombre";
        return "clair";
    }

    appliquerTheme(themeInitial());

    document.addEventListener("click", function (e) {
        var btn = e.target.closest("#btn-theme");
        if (!btn) return;
        var nouveau = document.documentElement.hasAttribute("data-theme") ? "clair" : "sombre";
        appliquerTheme(nouveau);
        try { localStorage.setItem(CLE_THEME, nouveau); } catch (err) {}
    });

    /* ---------- 2. Menu mobile ---------- */
    document.addEventListener("click", function (e) {
        var burger = e.target.closest("#btn-burger");
        var nav = document.getElementById("nav-principale");
        if (!nav) return;
        if (burger) { nav.classList.toggle("ouvert"); return; }
        if (nav.classList.contains("ouvert") && !e.target.closest("#nav-principale")) {
            nav.classList.remove("ouvert");
        }
    });

    /* ---------- 3. Liens Google Play ---------- */
    function initLiensPlay() {
        var liens = document.querySelectorAll(".js-lien-play");
        for (var i = 0; i < liens.length; i++) {
            var el = liens[i];
            var libelle = el.querySelector(".js-play-libelle");
            var titre = el.querySelector(".js-play-titre");
            if (LIEN_PLAY_STORE && LIEN_PLAY_STORE.indexOf("http") === 0) {
                el.setAttribute("href", LIEN_PLAY_STORE);
                el.setAttribute("target", "_blank");
                el.setAttribute("rel", "noopener");
                el.classList.remove("inactif");
                if (libelle) libelle.textContent = "Disponible sur";
                if (titre) titre.textContent = "Google Play";
            } else {
                el.removeAttribute("href");
                el.classList.add("inactif");
                if (libelle) libelle.textContent = "Bientôt sur";
                if (titre) titre.textContent = "Google Play";
            }
        }
    }

    /* ---------- 4. FAQ (accordéon) ---------- */
    document.addEventListener("click", function (e) {
        var q = e.target.closest(".faq-q");
        if (!q) return;
        var item = q.parentElement;
        var etaitOuvert = item.classList.contains("ouvert");
        var freres = item.parentElement.querySelectorAll(".faq-item");
        for (var i = 0; i < freres.length; i++) freres[i].classList.remove("ouvert");
        if (!etaitOuvert) item.classList.add("ouvert");
    });

    /* ---------- 5. Formulaires (Web3Forms, sans rechargement) ---------- */
    function initFormulaires() {
        var formulaires = document.querySelectorAll(".js-form");
        for (var i = 0; i < formulaires.length; i++) {
            (function (form) {
                var champCle = form.querySelector('input[name="access_key"]');
                if (champCle) champCle.value = CLE_WEB3FORMS;

                form.addEventListener("submit", function (ev) {
                    ev.preventDefault();

                    var bouton = form.querySelector('button[type="submit"]');
                    var zoneMsg = form.querySelector(".msg-form");
                    var texteBouton = bouton ? bouton.textContent : "";

                    if (bouton) { bouton.disabled = true; bouton.textContent = "Envoi en cours…"; }
                    if (zoneMsg) zoneMsg.className = "msg-form";

                    var donnees = new FormData(form);
                    donnees.append("from_name", "Site StockMvt");
                    donnees.append("page", window.location.pathname);

                    fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        body: donnees
                    })
                    .then(function (r) { return r.json(); })
                    .then(function (res) {
                        if (res.success) {
                            if (zoneMsg) {
                                zoneMsg.className = "msg-form ok";
                                zoneMsg.textContent = form.getAttribute("data-succes") ||
                                    "Message envoyé. Nous vous répondons sous 48 heures ouvrées.";
                            }
                            form.reset();
                        } else {
                            throw new Error(res.message || "Erreur");
                        }
                    })
                    .catch(function () {
                        if (zoneMsg) {
                            zoneMsg.className = "msg-form ko";
                            zoneMsg.innerHTML = "L'envoi a échoué. Écrivez-nous directement à " +
                                '<a href="mailto:support@jllbstudio.com">support@jllbstudio.com</a>.';
                        }
                    })
                    .then(function () {
                        if (bouton) { bouton.disabled = false; bouton.textContent = texteBouton; }
                    });
                });
            })(formulaires[i]);
        }
    }

    /* ---------- 6. Apparition au défilement ---------- */
    function initReveal() {
        var cibles = document.querySelectorAll(".reveal");
        if (!cibles.length) return;
        if (!("IntersectionObserver" in window)) {
            for (var i = 0; i < cibles.length; i++) cibles[i].classList.add("vu");
            return;
        }
        var obs = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add("vu"); obs.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        for (var j = 0; j < cibles.length; j++) obs.observe(cibles[j]);
    }

    /* ---------- 7. Année + lien actif ---------- */
    function initDivers() {
        var annees = document.querySelectorAll(".js-annee");
        for (var i = 0; i < annees.length; i++) annees[i].textContent = new Date().getFullYear();

        var page = window.location.pathname.split("/").pop() || "index.html";
        var liens = document.querySelectorAll("#nav-principale a");
        for (var j = 0; j < liens.length; j++) {
            var href = liens[j].getAttribute("href") || "";
            if (href === page) liens[j].classList.add("actif");
        }
    }

    /* ---------- Démarrage ---------- */
    document.addEventListener("DOMContentLoaded", function () {
        initLiensPlay();
        initFormulaires();
        initReveal();
        initDivers();
    });
})();
