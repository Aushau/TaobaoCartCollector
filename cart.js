(function () {
  const platform = location.host.includes('jd.com') ? 'jd' : 'taobao';

  function collectTaobao() {
    const shops = document.querySelectorAll('.trade-cart-shop-container');
    const items = [];
    for (const shop of shops) {
      const nameEl = shop.querySelector('[class*="cartShopName"]');
      if (!nameEl) continue;
      const shopName = nameEl.textContent.trim();
      const itemEls = shop.querySelectorAll('.trade-cart-item-info');
      for (const item of itemEls) {
        const links = item.querySelectorAll(
          'a[href*="item.taobao.com"], a[href*="detail.tmall.com"]'
        );
        if (!links.length) continue;
        let title = '', url = '';
        for (const link of links) {
          const t = (link.textContent || '').trim();
          if (t.length > title.length) { title = t; url = link.href; }
        }
        const pEl = item.querySelector('[class*="cartPriceInfo"]');
        const pt = pEl ? pEl.textContent.replace(/\s+/g, ' ').trim() : '';
        const nums = pt.match(/[\d.]+/g) || [];
        const price = nums.length > 0 ? parseFloat(nums[0]) : null;
        const origPrice = nums.length > 2 ? parseFloat(nums[nums.length - 1]) : null;

        let promoType = '';
        if (pt.includes('平台加补')) promoType = '平台加补';
        else if (pt.includes('店铺优惠')) promoType = '店铺优惠';
        else if (pt.includes('官方立减')) promoType = '官方立减';
        else promoType = '原价';

        let dropPrice = null;
        const m = pt.match(/[距加入降][￥¥]([\d.]+)/);
        if (m) dropPrice = parseFloat(m[1]);

        const allText = item.textContent.replace(/\s+/g, ' ').trim();
        const tags = [];
        const tagMap = {
          '消费券': '消费券', '官方立减': '官方立减', '限时红包': '限时红包',
          '大促价保': '大促价保', '退货宝': '退货宝', '极速退款': '极速退款',
          '假一赔': '假一赔', '包邮': '包邮', '赠品': '赠品', '国补': '国补',
          '质保': '质保', '超级爆款': '超级爆款'
        };
        for (const [k, v] of Object.entries(tagMap)) {
          if (allText.includes(k)) tags.push(v);
        }
        if (/3期/.test(allText)) tags.push('3期免息');
        if (/6期/.test(allText)) tags.push('6期免息');
        if (/12期/.test(allText)) tags.push('12期免息');
        if (/24期/.test(allText)) tags.push('24期免息');

        let spec = '';
        const specEl = item.querySelector('[class*="sku-info"], [class*="spec"]');
        if (specEl) spec = specEl.textContent.trim();

        let qty = 1;
        const qtyEl = item.querySelector('[class*="quantity"], [class*="num"]');
        if (qtyEl) { const qn = parseInt(qtyEl.textContent.trim()); if (!isNaN(qn)) qty = qn; }

        let img = '';
        const imgEl = item.querySelector('img[class*="itemImg"], img[src*="alicdn"]');
        if (imgEl) {
          img = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
          if (img.length < 10) img = '';
        }

        items.push({
          platform: 'taobao', shop: shopName, title, url,
          price, origPrice, promoType, dropPrice,
          tags: tags.join(','), spec, qty, img
        });
      }
    }
    return items;
  }

  function collectJD() {
    const items = [];
    const links = document.querySelectorAll('a[href*="item.jd.com"]');
    const seen = new Set();
    for (const link of links) {
      const sku = link.getAttribute('data-sku') || '';
      if (!sku || seen.has(sku)) continue;
      seen.add(sku);
      const title = (link.textContent || '').trim();
      const item = link.closest('[class*="item"], [class*="cart-item"]') || link;
      const pEl = item.querySelector('[class*="price"], .jd-price');
      const price = pEl ? parseFloat(pEl.textContent.replace(/[^0-9.]/g, '')) : null;
      let shop = '';
      const shopEl = item.querySelector('[class*="shop"], [class*="store"]');
      if (shopEl) shop = shopEl.textContent.trim();
      items.push({
        platform: 'jd', shop: shop || '京东', title,
        url: `https://item.jd.com/${sku}.html`,
        price, origPrice: null, promoType: '', dropPrice: null,
        tags: '', spec: '', qty: 1, img: ''
      });
    }
    return items;
  }

  const items = platform === 'jd' ? collectJD() : collectTaobao();
  chrome.storage.local.set({ cart_items: items }, () => {
    console.log(`[CartCollector] Saved ${items.length} items`);
  });
})();
