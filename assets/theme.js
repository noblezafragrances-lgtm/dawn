/* ==========================================================================
   NOBLEZA FRAGRANCES — THEME JS
   ========================================================================== */

/* ---------- Logo spray interaction ---------- */
(function () {
  var logo = document.getElementById('siteLogo');
  var flash = document.getElementById('homeFlash');
  if (!logo || !flash) return;
  var animating = false;

  logo.addEventListener('click', function (e) {
    if (animating) return;
    e.preventDefault();
    var targetUrl = logo.getAttribute('href');
    animating = true;
    logo.classList.add('spraying');

    setTimeout(function () {
      flash.classList.add('active');
    }, 420);

    setTimeout(function () {
      window.location.href = targetUrl;
    }, 700);
  });
})();

/* ---------- Mobile drawer close on outside click ---------- */
document.addEventListener('click', function (e) {
  var drawer = document.getElementById('mobileDrawer');
  if (!drawer || !drawer.classList.contains('open')) return;
  if (!drawer.contains(e.target) && !e.target.closest('.mobile-nav-toggle')) {
    drawer.classList.remove('open');
  }
});

/* ---------- Product card image cycling (arrows) ---------- */
function nbCyclePreview(el, direction) {
  var card = el.closest('.product-card-media');
  var imgs = card.querySelectorAll('img');
  if (imgs.length < 2) return;
  var activeIndex = 0;
  imgs.forEach(function (img, i) { if (img.classList.contains('active')) activeIndex = i; });
  imgs[activeIndex].classList.remove('active');
  var nextIndex = (activeIndex + direction + imgs.length) % imgs.length;
  imgs[nextIndex].classList.add('active');
}

/* ---------- Product card size chip -> price update ---------- */
function nbUpdateCardPrice(el) {
  var card = el.closest('.product-card');
  var chips = card.querySelectorAll('.size-chip');
  chips.forEach(function (c) { c.classList.remove('selected'); });
  el.classList.add('selected');

  var priceEl = card.querySelector('.card-price');
  var price = el.dataset.price;
  var compare = el.dataset.compare;
  if (priceEl) priceEl.textContent = '$' + price;

  var saveLine = card.querySelector('.save-line');
  if (compare && parseFloat(compare) > parseFloat(price) && saveLine) {
    saveLine.textContent = 'You Save $' + (parseFloat(compare) - parseFloat(price)).toFixed(2);
  }
}

/* ---------- Wishlist toggle (requires account — stubbed for theme install) ---------- */
function nbToggleWishlist(btn) {
  // In production: check customer login state via Liquid, redirect to /account/login if guest.
  btn.classList.toggle('active');
}

/* ---------- Quick Add (stub — wire up to Shopify AJAX Cart API) ---------- */
function nbQuickAdd(btn) {
  var variantId = btn.dataset.variantId;
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: 1 })
  })
    .then(function (res) { return res.json(); })
    .then(function () {
      window.location.href = '/cart';
    })
    .catch(function (err) { console.error('Quick add failed', err); });
}

/* ---------- Product page: gallery thumbnails + arrows ---------- */
function nbSetMainImage(thumbEl, index) {
  var thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(function (t) { t.classList.remove('active'); });
  thumbEl.classList.add('active');

  var mainImgs = document.querySelectorAll('.main-gallery-img');
  mainImgs.forEach(function (img) {
    img.classList.toggle('active', parseInt(img.dataset.index, 10) === index);
  });
}

function nbCycleMainImage(direction) {
  var mainImgs = document.querySelectorAll('.main-gallery-img');
  if (mainImgs.length < 2) return;
  var activeIndex = 0;
  mainImgs.forEach(function (img, i) { if (img.classList.contains('active')) activeIndex = i; });
  var nextIndex = (activeIndex + direction + mainImgs.length) % mainImgs.length;
  mainImgs.forEach(function (img, i) { img.classList.toggle('active', i === nextIndex); });

  var thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(function (t, i) { t.classList.toggle('active', i === nextIndex); });
}

/* ---------- Product page: size select -> price + variant id update ---------- */
function nbSelectSize(el) {
  var options = document.querySelectorAll('.size-opt');
  options.forEach(function (o) { o.classList.remove('selected'); });
  el.classList.add('selected');

  var priceEl = document.getElementById('productPrice');
  var compareEl = document.getElementById('productComparePrice');
  var saveEl = document.getElementById('productSaveLine');
  var stickyPriceEl = document.getElementById('stickyPrice');
  var variantInput = document.getElementById('selectedVariantId');

  if (priceEl) priceEl.textContent = el.dataset.price;
  if (stickyPriceEl) stickyPriceEl.textContent = el.dataset.price;
  if (variantInput) variantInput.value = el.dataset.variantId;

  var compare = el.dataset.compare;
  var price = el.dataset.price;
  if (compare && compare !== price && compareEl) {
    compareEl.style.display = '';
    compareEl.textContent = compare;
    if (saveEl) { saveEl.style.display = ''; saveEl.textContent = 'You Save ' + el.dataset.save; }
  } else {
    if (compareEl) compareEl.style.display = 'none';
    if (saveEl) saveEl.style.display = 'none';
  }
}

/* ---------- Product page: quantity stepper ---------- */
function nbChangeQty(delta) {
  var qtyEl = document.getElementById('qtyValue');
  var qtyInput = document.getElementById('qtyInput');
  var current = parseInt(qtyEl.textContent, 10) || 1;
  var next = Math.max(1, current + delta);
  qtyEl.textContent = next;
  qtyInput.value = next;
}

/* ---------- Cart page: qty change / remove (wire to Shopify Ajax Cart API) ---------- */
function nbCartQty(lineKey, delta) {
  fetch('/cart.js')
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      var line = cart.items.find(function (i) { return i.key === lineKey; });
      if (!line) return;
      var newQty = Math.max(0, line.quantity + delta);
      return fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lineKey, quantity: newQty })
      });
    })
    .then(function () { window.location.reload(); })
    .catch(function (err) { console.error('Cart update failed', err); });
}

function nbCartRemove(lineKey) {
  nbCartQty(lineKey, -9999);
}
