// ===== Tuboclair — script commun (toutes les pages) =====
(function () {
  // Année du footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Menu burger coulissant
  var burger = document.getElementById('burger');
  var menu = document.getElementById('slide-menu');
  var overlay = document.getElementById('menu-overlay');
  var closeBtn = document.getElementById('menu-close');

  function openMenu() {
    if (!menu || !overlay) return;
    overlay.hidden = false;
    requestAnimationFrame(function () {
      menu.classList.add('open');
      overlay.classList.add('show');
    });
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    if (!menu || !overlay) return;
    menu.classList.remove('open');
    overlay.classList.remove('show');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    setTimeout(function () { overlay.hidden = true; }, 280);
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Champ "ajouter une photo" : affiche le nom du fichier choisi
  var fileInput = document.getElementById('photo-input');
  var fileName = document.getElementById('photo-name');
  if (fileInput && fileName) {
    fileInput.addEventListener('change', function () {
      fileName.textContent = (fileInput.files && fileInput.files.length)
        ? fileInput.files[0].name : 'Aucun fichier choisi';
    });
  }
})();
