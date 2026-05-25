(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function renderCard(item, isCart) {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
      if (item.url) chrome.tabs.create({ url: item.url });
    });

    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = item.img || '';
    img.onerror = function () { this.style.display = 'none'; };
    card.appendChild(img);

    const info = document.createElement('div');
    info.className = 'card-info';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = item.title || '(no title)';
    info.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = [item.shop, item.spec].filter(Boolean).join(' | ');
    info.appendChild(meta);

    const priceRow = document.createElement('div');
    const price = document.createElement('span');
    price.className = 'card-price';
    price.textContent = item.price ? `¥${item.price}` : '';
    priceRow.appendChild(price);

    if (item.origPrice && item.origPrice > (item.price || 0)) {
      const orig = document.createElement('span');
      orig.className = 'card-orig';
      orig.textContent = `¥${item.origPrice}`;
      priceRow.appendChild(orig);
    }

    if (item.dropPrice) {
      const drop = document.createElement('span');
      drop.style.cssText = 'font-size:11px;color:#e74c3c;margin-left:6px;';
      drop.textContent = `↓¥${item.dropPrice}`;
      priceRow.appendChild(drop);
    }

    info.appendChild(priceRow);

    if (item.tags || item.promoType) {
      const tags = document.createElement('div');
      tags.className = 'card-tags';
      if (item.promoType && item.promoType !== '原价') {
        const t = document.createElement('span');
        t.className = 'tag promo';
        t.textContent = item.promoType;
        tags.appendChild(t);
      }
      if (item.tags) {
        item.tags.split(',').filter(Boolean).forEach((tag) => {
          const t = document.createElement('span');
          t.className = 'tag';
          t.textContent = tag;
          tags.appendChild(t);
        });
      }
      info.appendChild(tags);
    }

    card.appendChild(info);
    return card;
  }

  function renderSummary(items) {
    const total = items.length;
    const sum = items.reduce((s, i) => s + (i.price || 0), 0);
    const shops = new Set(items.map((i) => i.shop).filter(Boolean)).size;
    const summary = $('#summary');
    if (total > 0) {
      summary.innerHTML =
        `<span>${total}</span> 件商品 · ` +
        `<span>${shops}</span> 家店铺 · ` +
        `总计 <span>¥${sum.toFixed(0)}</span>`;
    } else {
      summary.innerHTML = '购物车为空或未加载';
    }
  }

  function renderTab(id, items) {
    const container = $(`#${id}-content`);
    container.innerHTML = '';
    if (!items || items.length === 0) {
      container.innerHTML =
        '<div class="empty">暂无商品<br>请打开购物车页面后刷新</div>';
      return;
    }
    const deduped = [];
    const seen = new Set();
    for (const item of items) {
      const key = item.url || item.title;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
    }
    deduped.forEach((item) => container.appendChild(renderCard(item, id === 'cart')));
  }

  function switchTab(name) {
    $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
    $$('.content').forEach((c) => c.classList.toggle('hidden', c.id !== `${name}-content`));
  }

  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  chrome.storage.local.get(['cart_items', 'collected'], (result) => {
    const cart = result.cart_items || [];
    const collected = result.collected || [];

    $('#cart-count').textContent = `(${cart.length})`;
    $('#collected-count').textContent = `(${collected.length})`;

    renderSummary(cart);
    renderTab('cart', cart);
    renderTab('collected', collected);
  });

  switchTab('cart');
})();
