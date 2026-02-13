/* Avatar Store - static prototype (AR/EN) + cart + checkout (demo)
   Later: replace DATA.products with API fetch, and order submit with backend.
*/
const AvatarApp = (() => {
  const LS_LANG = "avatar_lang";
  const LS_CART = "avatar_cart";

  const DATA = {
    govs: [
      { ar: "القاهرة", en: "Cairo", price: 55, eta: "1-2" },
      { ar: "الجيزة", en: "Giza", price: 55, eta: "1-2" },
      { ar: "الإسكندرية", en: "Alexandria", price: 70, eta: "2-4" },
      { ar: "الدقهلية", en: "Dakahlia", price: 75, eta: "2-4" },
      { ar: "الشرقية", en: "Sharqia", price: 75, eta: "2-4" },
      { ar: "الغربية", en: "Gharbia", price: 75, eta: "2-4" },
    ],
    products: [
      {
        id: "p1",
        slug: "men-hoodie-black",
        gender: "MEN",
        type: "CLOTHING",
        titleAr: "هودي رجالي أسود",
        titleEn: "Men Black Hoodie",
        price: 650,
        chipsAr: ["رجالي", "ملابس"],
        chipsEn: ["Men", "Clothing"],
        colors: ["Black", "Gray"],
        sizes: ["S", "M", "L", "XL"],
        descAr: "هودي خامة ممتازة ومناسب للشتاء.",
        descEn: "Premium fabric hoodie, perfect for winter."
      },
      {
        id: "p2",
        slug: "women-bag-beige",
        gender: "WOMEN",
        type: "ACCESSORY",
        titleAr: "شنطة حريمي بيج",
        titleEn: "Women Beige Bag",
        price: 520,
        chipsAr: ["حريمي", "إكسسوارات"],
        chipsEn: ["Women", "Accessories"],
        colors: ["Beige", "Black"],
        sizes: ["One Size"],
        descAr: "شنطة عملية وخفيفة للاستخدام اليومي.",
        descEn: "Lightweight everyday bag."
      },
      {
        id: "p3",
        slug: "men-sneakers-white",
        gender: "MEN",
        type: "SHOES",
        titleAr: "كوتشي رجالي أبيض",
        titleEn: "Men White Sneakers",
        price: 980,
        chipsAr: ["رجالي", "أحذية"],
        chipsEn: ["Men", "Shoes"],
        colors: ["White", "Black"],
        sizes: ["40", "41", "42", "43", "44"],
        descAr: "كوتشي مريح للمشي والاستخدام اليومي.",
        descEn: "Comfortable sneakers for everyday use."
      },
      {
        id: "p4",
        slug: "women-sneakers-pink",
        gender: "WOMEN",
        type: "SHOES",
        titleAr: "كوتشي حريمي بينك",
        titleEn: "Women Pink Sneakers",
        price: 940,
        chipsAr: ["حريمي", "أحذية"],
        chipsEn: ["Women", "Shoes"],
        colors: ["Pink", "White"],
        sizes: ["36", "37", "38", "39", "40"],
        descAr: "ستايل لطيف ومريح طول اليوم.",
        descEn: "Cute style and all-day comfort."
      }
    ],
    i18n: {
      ar: {
        brand:"Avatar",
        tagline:"Men • Women • Shoes • Accessories",
        cart:"السلة",
        heroTitle:"Avatar — ستايلك في مكان واحد",
        heroDesc:"ملابس • إكسسوارات • كوتشيات/أحذية — رجالي وحريمي. شحن حسب المحافظة وطرق دفع أونلاين.",
        shopMen:"تسوق رجالي",
        shopWomen:"تسوق حريمي",
        shopShoes:"الأحذية",
        featured:"مختارات اليوم",
        browseAll:"تصفح الكل",
        shippingTitle:"الشحن حسب المحافظة",
        gov:"المحافظة",
        shipPrice:"سعر الشحن",
        shipEta:"مدة التوصيل",
        shipNote:"* الأسعار دي تجريبية. هتقدر تعدلها من لوحة الأدمن بعد الربط.",
        checkout:"الدفع",
        products:"المنتجات",
        product:"منتج",
        gender:"الفئة",
        men:"رجالي",
        women:"حريمي",
        type:"النوع",
        clothing:"ملابس",
        accessories:"إكسسوارات",
        shoes:"أحذية/كوتشيات",
        all:"الكل",
        search:"بحث",
        backToShop:"رجوع للمنتجات",
        color:"اللون",
        size:"المقاس",
        qty:"الكمية",
        addToCart:"أضف للسلة",
        continueShopping:"كمل تسوق",
        emptyCart:"السلة فاضية. روح اختار منتجات.",
        name:"الاسم",
        phone:"الموبايل",
        address:"العنوان",
        shipping:"الشحن",
        paymentMethod:"طريقة الدفع",
        instapayNote:"هتضيف بيانات InstaPay من تطبيق الأدمن لاحقًا. دلوقتي ارفع الإيصال/سكرين.",
        uploadReceipt:"رفع الإيصال",
        reference:"ملاحظة/رقم مرجعي",
        subtotal:"الإجمالي قبل الشحن",
        total:"الإجمالي النهائي",
        placeOrder:"تأكيد الطلب",
      },
      en: {
        brand:"Avatar",
        tagline:"Men • Women • Shoes • Accessories",
        cart:"Cart",
        heroTitle:"Avatar — Your style, one place",
        heroDesc:"Clothing • Accessories • Shoes — Men & Women. Governorate-based shipping and online payments.",
        shopMen:"Shop Men",
        shopWomen:"Shop Women",
        shopShoes:"Shop Shoes",
        featured:"Featured today",
        browseAll:"Browse all",
        shippingTitle:"Shipping by governorate",
        gov:"Governorate",
        shipPrice:"Shipping fee",
        shipEta:"Delivery time",
        shipNote:"* Demo prices. You’ll edit these later from the admin app.",
        checkout:"Checkout",
        products:"Products",
        product:"Product",
        gender:"Gender",
        men:"Men",
        women:"Women",
        type:"Type",
        clothing:"Clothing",
        accessories:"Accessories",
        shoes:"Shoes",
        all:"All",
        search:"Search",
        backToShop:"Back to products",
        color:"Color",
        size:"Size",
        qty:"Qty",
        addToCart:"Add to cart",
        continueShopping:"Continue shopping",
        emptyCart:"Your cart is empty. Go pick products.",
        name:"Name",
        phone:"Phone",
        address:"Address",
        shipping:"Shipping",
        paymentMethod:"Payment method",
        instapayNote:"You’ll add InstaPay details later from the admin app. For now upload receipt screenshot.",
        uploadReceipt:"Upload receipt",
        reference:"Reference / note",
        subtotal:"Subtotal",
        total:"Total",
        placeOrder:"Place order",
      }
    }
  };

  function getLang(){ return localStorage.getItem(LS_LANG) || "ar"; }
  function setLang(l){ localStorage.setItem(LS_LANG, l); }

  function applyLang(){
    const lang = getLang();
    const html = document.documentElement;
    html.lang = lang;
    html.dir = (lang === "ar") ? "rtl" : "ltr";

    const dict = DATA.i18n[lang];
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (dict[k]) el.textContent = dict[k];
    });

    const langBtn = document.getElementById("langBtn");
    if (langBtn) langBtn.textContent = (lang === "ar") ? "EN" : "AR";
  }

  function bindLangToggle(){
    const btn = document.getElementById("langBtn");
    if(!btn) return;
    btn.addEventListener("click", () => {
      const next = getLang() === "ar" ? "en" : "ar";
      setLang(next);
      applyLang();
      // rerender page-specific text where needed
      updateCartCount();
      if (document.body.dataset.page === "home") renderFeatured();
      if (document.body.dataset.page === "category") renderCategory();
      if (document.body.dataset.page === "product") renderProduct();
      if (document.body.dataset.page === "cart") renderCart();
    });
  }

  function moneyEGP(n){
    const lang = getLang();
    const label = lang === "ar" ? "ج.م" : "EGP";
    return `${n} ${label}`;
  }

  function getCart(){
    try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); }
    catch { return []; }
  }
  function setCart(items){ localStorage.setItem(LS_CART, JSON.stringify(items)); updateCartCount(); }
  function updateCartCount(){
    const cart = getCart();
    const count = cart.reduce((a,i)=>a + (i.qty||0), 0);
    const el = document.getElementById("cartCount");
    if (el) el.textContent = String(count);
  }

  function findProductBySlug(slug){ return DATA.products.find(p => p.slug === slug); }
  function findProductById(id){ return DATA.products.find(p => p.id === id); }

  function cardHTML(p){
    const lang = getLang();
    const title = lang==="ar"?p.titleAr:p.titleEn;
    const chips = lang==="ar"?p.chipsAr:p.chipsEn;
    return `
      <article class="cardItem">
        <div class="img"></div>
        <div class="body">
          <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
            <strong>${escapeHtml(title)}</strong>
            <span class="price">${moneyEGP(p.price)}</span>
          </div>
          <div class="chipRow">
            ${chips.map(c=>`<span class="chip">${escapeHtml(c)}</span>`).join("")}
          </div>
          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap">
            <a class="btnGhost" href="./product.html?slug=${encodeURIComponent(p.slug)}">View</a>
            <button class="btnPrimary" data-add="${p.id}">${getLang()==="ar"?"أضف للسلة":"Add"}</button>
          </div>
        </div>
      </article>
    `;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function renderFeatured(){
    const grid = document.getElementById("featuredGrid");
    if(!grid) return;
    const featured = DATA.products.slice(0,3);
    grid.innerHTML = featured.map(cardHTML).join("");
    grid.querySelectorAll("[data-add]").forEach(btn=>{
      btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")));
    });
  }

  function renderGovSelect(selectId, priceId, etaId){
    const sel = document.getElementById(selectId);
    if(!sel) return;
    const lang = getLang();
    sel.innerHTML = DATA.govs.map((g,idx)=>{
      const name = lang==="ar"?g.ar:g.en;
      return `<option value="${idx}">${escapeHtml(name)}</option>`;
    }).join("");

    function update(){
      const idx = Number(sel.value);
      const g = DATA.govs[idx];
      const priceEl = document.getElementById(priceId);
      const etaEl = document.getElementById(etaId);
      if(priceEl) priceEl.textContent = moneyEGP(g.price);
      if(etaEl) etaEl.textContent = `${g.eta} ${lang==="ar"?"أيام":"days"}`;
    }
    sel.addEventListener("change", update);
    update();
  }

  function renderCategory(){
    const grid = document.getElementById("productsGrid");
    if(!grid) return;

    const params = new URLSearchParams(location.search);
    const presetGender = params.get("gender") || "";
    const presetType = params.get("type") || "";

    const gf = document.getElementById("genderFilter");
    const tf = document.getElementById("typeFilter");
    const q = document.getElementById("q");

    if (gf && presetGender) gf.value = presetGender;
    if (tf && presetType) tf.value = presetType;

    const filter = () => {
      const gender = gf ? gf.value : "";
      const type = tf ? tf.value : "";
      const query = (q ? q.value : "").trim().toLowerCase();

      const list = DATA.products.filter(p=>{
        if (gender && p.gender !== gender) return false;
        if (type && p.type !== type) return false;
        if (query){
          const hay = `${p.titleAr} ${p.titleEn}`.toLowerCase();
          if (!hay.includes(query)) return false;
        }
        return true;
      });

      grid.innerHTML = list.map(cardHTML).join("") || `<div class="muted">No products</div>`;
      grid.querySelectorAll("[data-add]").forEach(btn=>{
        btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add")));
      });
    };

    [gf, tf, q].forEach(el => el && el.addEventListener("input", filter));
    filter();
  }

  function renderProduct(){
    const params = new URLSearchParams(location.search);
    const slug = params.get("slug");
    const p = slug ? findProductBySlug(slug) : null;
    if(!p) return;

    const lang = getLang();
    document.title = `Avatar | ${lang==="ar"?p.titleAr:p.titleEn}`;

    const title = document.getElementById("pTitle");
    const meta  = document.getElementById("pMeta");
    const price = document.getElementById("pPrice");
    const desc  = document.getElementById("pDesc");
    const img   = document.getElementById("productImg");

    if(title) title.textContent = lang==="ar"?p.titleAr:p.titleEn;
    if(meta) meta.textContent = `${lang==="ar"?(p.gender==="MEN"?"رجالي":"حريمي"):(p.gender==="MEN"?"Men":"Women")} • ${p.type}`;
    if(price) price.textContent = moneyEGP(p.price);
    if(desc) desc.textContent = lang==="ar"?p.descAr:p.descEn;
    if(img) img.style.backgroundImage = "linear-gradient(135deg, rgba(225,29,72,.20), rgba(34,197,94,.14))";

    const colorSel = document.getElementById("colorSelect");
    const sizeSel  = document.getElementById("sizeSelect");

    if(colorSel){
      colorSel.innerHTML = (p.colors||["Default"]).map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
    }
    if(sizeSel){
      sizeSel.innerHTML = (p.sizes||["One Size"]).map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
    }

    const addBtn = document.getElementById("addToCart");
    if(addBtn){
      addBtn.addEventListener("click", () => {
        const qty = Math.max(1, Number(document.getElementById("qty")?.value || 1));
        addToCart(p.id, {
          color: colorSel?.value || null,
          size: sizeSel?.value || null,
          qty
        });
      });
    }
  }

  function addToCart(productId, opts={}){
    const p = findProductById(productId);
    if(!p) return;

    const cart = getCart();
    const color = opts.color ?? null;
    const size  = opts.size ?? null;
    const qty   = Math.max(1, Number(opts.qty || 1));

    const key = `${productId}__${color||""}__${size||""}`;
    const existing = cart.find(i => i.key === key);
    if(existing){
      existing.qty += qty;
    } else {
      cart.push({
        key,
        productId,
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        price: p.price,
        color,
        size,
        qty
      });
    }
    setCart(cart);
    // tiny feedback
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function removeFromCart(key){
    const cart = getCart().filter(i => i.key !== key);
    setCart(cart);
  }

  function cartSubtotal(cart){
    return cart.reduce((a,i)=>a + i.price * i.qty, 0);
  }

  function renderCart(){
    const cart = getCart();
    const itemsEl = document.getElementById("cartItems");
    const emptyEl = document.getElementById("emptyCartMsg");

    if(emptyEl) emptyEl.style.display = cart.length ? "none" : "block";

    if(itemsEl){
      itemsEl.innerHTML = cart.map(i=>{
        const title = getLang()==="ar"?i.titleAr:i.titleEn;
        const meta = [i.color, i.size].filter(Boolean).join(" • ");
        return `
          <div class="cartRow">
            <div class="left">
              <strong>${escapeHtml(title)}</strong>
              <small class="muted">${escapeHtml(meta || "")}</small>
              <small class="muted">${moneyEGP(i.price)} × ${i.qty}</small>
            </div>
            <div class="right">
              <span class="price">${moneyEGP(i.price * i.qty)}</span>
              <button class="btnGhost" data-rm="${escapeHtml(i.key)}">${getLang()==="ar"?"حذف":"Remove"}</button>
            </div>
          </div>
        `;
      }).join("");

      itemsEl.querySelectorAll("[data-rm]").forEach(btn=>{
        btn.addEventListener("click", ()=>{ removeFromCart(btn.getAttribute("data-rm")); renderCart(); });
      });
    }

    // shipping select
    const govSel = document.getElementById("govSelect");
    if (govSel){
      const lang = getLang();
      govSel.innerHTML = DATA.govs.map((g,idx)=>{
        const name = lang==="ar"?g.ar:g.en;
        return `<option value="${idx}">${escapeHtml(name)}</option>`;
      }).join("");
    }

    function updateTotals(){
      const subtotal = cartSubtotal(getCart());
      const govIdx = Number(document.getElementById("govSelect")?.value || 0);
      const ship = DATA.govs[govIdx]?.price || 0;

      const subtotalEl = document.getElementById("subtotal");
      const shipEl = document.getElementById("shipPrice");
      const totalEl = document.getElementById("total");
      if(subtotalEl) subtotalEl.textContent = moneyEGP(subtotal);
      if(shipEl) shipEl.textContent = moneyEGP(ship);
      if(totalEl) totalEl.textContent = moneyEGP(subtotal + ship);
    }
    document.getElementById("govSelect")?.addEventListener("change", updateTotals);
    updateTotals();

    // payment method
    const payMethod = document.getElementById("payMethod");
    const instapayBox = document.getElementById("instapayBox");
    function updatePayUI(){
      const v = payMethod?.value;
      if(instapayBox) instapayBox.style.display = (v === "INSTAPAY") ? "block" : "none";
    }
    payMethod?.addEventListener("change", updatePayUI);
    updatePayUI();

    // place order (demo)
    const placeBtn = document.getElementById("placeOrder");
    const msg = document.getElementById("orderMsg");
    if(placeBtn){
      placeBtn.onclick = () => {
        const c = getCart();
        if(!c.length){
          if(msg) msg.textContent = getLang()==="ar" ? "السلة فاضية." : "Cart is empty.";
          return;
        }
        const name = (document.getElementById("name")?.value || "").trim();
        const phone = (document.getElementById("phone")?.value || "").trim();
        const address = (document.getElementById("address")?.value || "").trim();
        if(!name || !phone || !address){
          if(msg) msg.textContent = getLang()==="ar" ? "املأ الاسم والموبايل والعنوان." : "Fill name, phone, address.";
          return;
        }

        // InstaPay demo: require receipt file
        const pm = document.getElementById("payMethod")?.value;
        if(pm === "INSTAPAY"){
          const file = document.getElementById("receipt")?.files?.[0];
          if(!file){
            if(msg) msg.textContent = getLang()==="ar" ? "ارفع إيصال InstaPay." : "Upload InstaPay receipt.";
            return;
          }
        }

        // demo success
        setCart([]);
        renderCart();
        if(msg) msg.textContent = getLang()==="ar"
          ? "تم تسجيل الطلب (نسخة تجريبية). بعد الربط هنخليه يبعت للباك إند."
          : "Order recorded (demo). After backend integration it will be submitted.";
      };
    }
  }

  function initPage(page){
    document.body.dataset.page = page;
    document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

    applyLang();
    bindLangToggle();
    updateCartCount();

    if(page === "home"){
      renderFeatured();
      renderGovSelect("govSelect", "shipPrice", "shipEta");
    }
    if(page === "category") renderCategory();
    if(page === "product") renderProduct();
    if(page === "cart") renderCart();
  }

  return { initPage };
})();
window.AvatarApp = AvatarApp;
