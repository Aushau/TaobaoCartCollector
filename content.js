(function () {
  const platform = location.host.includes('jd.com') ? 'jd' : 'taobao';

  function extractTaobao() {
    const data = { platform: 'taobao' };
    const titleEl = document.querySelector(
      '.tb-detail-hd h1, .main-title, [data-name="title"], .tb-main-title'
    );
    if (titleEl) data.title = titleEl.textContent.trim();

    const priceEl = document.querySelector(
      '.tm-price, .tb-rmb-num, [class*="price"], #J_StrPr498'
    );
    if (priceEl) data.price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));

    const origPriceEl = document.querySelector(
      '.tm-original-price, .tb-original-price, [class*="orig"]'
    );
    if (origPriceEl) {
      data.origPrice = parseFloat(origPriceEl.textContent.replace(/[^0-9.]/g, ''));
    }

    const imgEl = document.querySelector(
      '#J_ImgBooth img, .tb-pic img, [class*="mainImg"] img, [class*="image-main"] img'
    );
    if (imgEl) {
      data.img = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
    }

    data.url = location.href;
    return data;
  }

  function extractJD() {
    const data = { platform: 'jd' };
    const titleEl = document.querySelector('.sku-name, .itemInfo-wrap .sku-name');
    if (titleEl) data.title = titleEl.textContent.trim();

    const priceEl = document.querySelector('.p-price .price, .JD-price');
    if (priceEl) {
      data.price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
    }

    const origEl = document.querySelector('.p-original .price, .origin-price');
    if (origEl) {
      data.origPrice = parseFloat(origEl.textContent.replace(/[^0-9.]/g, ''));
    }

    data.url = location.href;
    return data;
  }

  const data = platform === 'jd' ? extractJD() : extractTaobao();

  chrome.storage.local.get({ collected: [] }, (result) => {
    const collected = result.collected;
    const exists = collected.some((c) => c.url === data.url);
    if (!exists) {
      collected.push({ ...data, collected_at: new Date().toISOString() });
      chrome.storage.local.set({ collected }, () => {
        console.log('[CartCollector] Collected:', data.title);
      });
    }
  });
})();
