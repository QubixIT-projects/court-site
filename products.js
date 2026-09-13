(function(){
  "use strict";

  var SPORTS = {
    badminton:  { label:"Badminton",    color:"#d7ff4e" },
    tennis:     { label:"Tennis",       color:"#b8e026" },
    squash:     { label:"Squash",       color:"#4ea1ff" },
    paddle:     { label:"Paddle",       color:"#ff8c3d" },
    tabletennis:{ label:"Table Tennis", color:"#ff6a5c" },
    accessories:{ label:"Accessories",  color:"#c78a4e" }
  };

  var GLYPH = { badminton:"🏸", tennis:"🎾", squash:"🥎", paddle:"🏓", tabletennis:"🏓", accessories:"🧢" };

  var PRODUCTS = [
    { id:"bd-racket",  sport:"badminton", brand:"Yonex", name:"Astrox 100ZZ Racket",       price:62500, stock:7,  desc:"Head-heavy carbon frame built for explosive smashes and fast net recovery." },
    { id:"bd-shuttle", sport:"badminton", brand:"Yonex", name:"Mavis 350 Shuttlecocks",     price:3200,  stock:45, desc:"Tube of 6 nylon shuttles with consistent tournament-grade flight." },
    { id:"bd-shoe",    sport:"badminton", brand:"Yonex", name:"Power Cushion Comfort Z2",   price:24900, stock:11, desc:"Cushioned midsole built to absorb repeated lunges and sudden pivots." },

    { id:"tn-racket",  sport:"tennis", brand:"Wilson", name:"Pro Staff 97 v14 Racket",      price:68000, stock:5,  desc:"Precision-tuned frame favoured by players who like to shape the ball." },
    { id:"tn-ball",    sport:"tennis", brand:"Wilson", name:"US Open Extra Duty Balls",      price:3500,  stock:30, desc:"Can of 3 felt-core balls with durable felt for hard-court play." },
    { id:"tn-shoe",    sport:"tennis", brand:"Head", name:"Sprint Pro 3.5 Court Shoes",      price:27500, stock:9,  desc:"Reinforced toe cap built for hard sliding stops on clay and hard court." },

    { id:"sq-racket",  sport:"squash", brand:"Dunlop", name:"Sonic Core Pro Racket",         price:45000, stock:6,  desc:"Lightweight teardrop frame for quick swings in tight rallies." },
    { id:"sq-ball",    sport:"squash", brand:"Dunlop", name:"Double Yellow Dot Balls",        price:2800,  stock:20, desc:"Competition-grade balls with a low bounce for advanced play." },
    { id:"sq-goggles", sport:"squash", brand:"Eye Guard", name:"Protective Squash Goggles",   price:6500,  stock:14, desc:"Impact-rated lenses with anti-fog coating for full-speed rallies." },

    { id:"pd-paddle",  sport:"paddle", brand:"Babolat", name:"Technical Viper Paddle",        price:58000, stock:4,  desc:"Diamond-shaped power paddle with a textured carbon face." },
    { id:"pd-ball",    sport:"paddle", brand:"Head", name:"Padel Pro S Balls",                 price:3000,  stock:22, desc:"Tube of 3 balls tuned for padel's lower bounce and enclosed courts." },
    { id:"pd-grip",    sport:"paddle", brand:"Babolat", name:"Paddle Grip Overwrap",           price:1200,  stock:50, desc:"Tacky overgrip for a secure hold through long rallies." },

    { id:"tt-blade",   sport:"tabletennis", brand:"Butterfly", name:"Timo Boll ALC Blade",     price:38500, stock:6,  desc:"Carbon-layered blade built for fast, controlled offensive play." },
    { id:"tt-ball",    sport:"tabletennis", brand:"DHS", name:"3-Star Table Tennis Balls",      price:2200,  stock:35, desc:"Pack of 6 poly balls with consistent bounce for match play." },
    { id:"tt-rubber",  sport:"tabletennis", brand:"Butterfly", name:"Tenergy Rubber Sheet",     price:8900,  stock:12, desc:"High-grip rubber sheet for added spin and speed off the blade." },

    { id:"ac-wrist",   sport:"accessories", brand:"Yonex", name:"Sports Wristbands (Pair)",     price:1800,  stock:40, desc:"Terry-cloth wristbands that keep sweat off your grip." },
    { id:"ac-cap",     sport:"accessories", brand:"New Balance", name:"Performance Cap",         price:4500,  stock:18, desc:"Lightweight breathable cap with a curved brim for court days." },
    { id:"ac-socks",   sport:"accessories", brand:"Wilson", name:"Compression Ankle Socks (3-Pack)", price:2600, stock:33, desc:"Cushioned, breathable socks built for long sessions on court." }
  ];

  var cart = {};
  var activeFilter = "all";

  function formatLKR(n){
    return 'Rs ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function stockClass(stock){ if(stock<=0) return 'out'; if(stock<=6) return 'low'; return 'in'; }
  function stockLabel(stock){ if(stock<=0) return 'OUT OF STOCK'; if(stock<=6) return stock+' LEFT'; return stock+' IN STOCK'; }

  /* ---------- Filters ---------- */
  var filtersEl = document.getElementById('filters');
  var allChip = document.createElement('div');
  allChip.className = 'filter-chip active';
  allChip.dataset.sport = 'all';
  allChip.innerHTML = '<span class="dot"></span>All';
  filtersEl.appendChild(allChip);
  Object.keys(SPORTS).forEach(function(key){
    var s = SPORTS[key];
    var chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.dataset.sport = key;
    chip.style.setProperty('--chip-color', s.color);
    chip.innerHTML = '<span class="dot"></span>'+s.label;
    filtersEl.appendChild(chip);
  });
  filtersEl.addEventListener('click', function(e){
    var chip = e.target.closest('.filter-chip');
    if(!chip) return;
    activeFilter = chip.dataset.sport;
    filtersEl.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.toggle('active', c===chip); });
    renderGrid();
  });

  /* ---------- Grid ---------- */
  var gridEl = document.getElementById('grid');
  function renderGrid(){
    gridEl.innerHTML = '';
    var list = PRODUCTS.filter(function(p){ return activeFilter === 'all' || p.sport === activeFilter; });
    list.forEach(function(p){
      var s = SPORTS[p.sport];
      var card = document.createElement('div');
      card.className = 'card';
      card.style.setProperty('--card-color', s.color);
      var inCart = cart[p.id] || 0;
      card.innerHTML =
        /* REPLACE: product photo. Drop a file at images/products/{id}.jpg (matching p.id below)
           to override the placeholder — the onerror fallback only fires if that file is missing. */
        '<div class="card-swatch"><span class="badge mono">'+s.label.toUpperCase()+'</span>' +
          '<img class="card-photo" src="images/products/'+p.id+'.jpg" alt="'+p.brand+' '+p.name+'" ' +
          'onerror="this.onerror=null;this.src=\'https://picsum.photos/seed/'+p.id+'/400/300\';"></div>' +
        '<div class="card-body">' +
          '<div class="card-brand mono">'+p.brand.toUpperCase()+'</div>' +
          '<h3 class="card-name">'+p.name+'</h3>' +
          '<p class="card-desc">'+p.desc+'</p>' +
          '<div class="card-foot"><span class="card-price mono">'+formatLKR(p.price)+'</span><span class="card-stock mono '+stockClass(p.stock)+'">'+stockLabel(p.stock)+'</span></div>' +
          '<button class="card-add" data-id="'+p.id+'" '+(p.stock<=0?'disabled':'')+'>'+(inCart>0?'IN CART ('+inCart+') — ADD ANOTHER':'ADD TO CART')+'</button>' +
        '</div>';
      gridEl.appendChild(card);
    });
    gridEl.querySelectorAll('.card-add').forEach(function(btn){
      btn.addEventListener('click', function(){
        var p = PRODUCTS.find(function(x){ return x.id === btn.dataset.id; });
        var current = cart[p.id] || 0;
        if(current + 1 > p.stock){ showToast('Only '+p.stock+' in stock'); return; }
        cart[p.id] = current + 1;
        updateCartCount(); renderCart(); renderGrid();
        showToast((p.brand+' '+p.name)+' added to cart');
      });
    });
  }

  /* ---------- Cart ---------- */
  var cartDrawer = document.getElementById('cart-drawer');
  var scrim = document.getElementById('scrim');
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2200);
  }
  function openCart(){ renderCart(); cartDrawer.classList.add('open'); scrim.classList.add('show'); }
  function closeCart(){ cartDrawer.classList.remove('open'); scrim.classList.remove('show'); }
  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);

  function updateCartCount(){
    var total = Object.values(cart).reduce(function(a,b){ return a+b; },0);
    document.getElementById('cart-count').textContent = total;
  }

  function renderCart(){
    var container = document.getElementById('cart-items');
    container.innerHTML = '';
    var ids = Object.keys(cart).filter(function(id){ return cart[id] > 0; });
    if(ids.length === 0){
      container.innerHTML = '<div class="cart-empty">Your cart is empty.<br>Add products from the catalog.</div>';
    }
    var subtotal = 0;
    ids.forEach(function(id){
      var p = PRODUCTS.find(function(x){ return x.id === id; });
      var qtyInCart = cart[id];
      var lineTotal = p.price * qtyInCart;
      subtotal += lineTotal;
      var s = SPORTS[p.sport];
      var avail = qtyInCart <= p.stock;
      var row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML =
        '<div class="ci-swatch" style="background:'+s.color+'22; border:1px solid '+s.color+'55;"></div>' +
        '<div class="ci-info">' +
          '<div class="ci-name">'+p.brand+' '+p.name+'</div>' +
          '<div class="ci-sport mono">'+s.label.toUpperCase()+'</div>' +
          '<div class="ci-controls">' +
            '<button class="ci-qbtn" data-act="dec" data-id="'+p.id+'">&minus;</button>' +
            '<span class="mono">'+qtyInCart+'</span>' +
            '<button class="ci-qbtn" data-act="inc" data-id="'+p.id+'">+</button>' +
          '</div>' +
          '<div class="ci-avail '+(avail?'ok':'warn')+'">'+(avail ? '✓ Available — '+p.stock+' in stock' : '⚠ Only '+p.stock+' available')+'</div>' +
        '</div>' +
        '<div class="ci-price">' +
          '<div class="ci-total mono">'+formatLKR(lineTotal)+'</div>' +
          '<button class="ci-remove" data-act="remove" data-id="'+p.id+'">Remove</button>' +
        '</div>';
      container.appendChild(row);
    });
    container.querySelectorAll('button[data-act]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = btn.dataset.id;
        var p = PRODUCTS.find(function(x){ return x.id === id; });
        if(btn.dataset.act === 'inc'){
          if(cart[id]+1 > p.stock){ showToast('Only '+p.stock+' in stock'); return; }
          cart[id]++;
        } else if(btn.dataset.act === 'dec'){
          cart[id]--; if(cart[id] <= 0) delete cart[id];
        } else if(btn.dataset.act === 'remove'){
          delete cart[id];
        }
        updateCartCount(); renderCart(); renderGrid();
      });
    });
    document.getElementById('cart-item-count').textContent = ids.reduce(function(a,id){ return a+cart[id]; },0);
    document.getElementById('cart-total').textContent = formatLKR(subtotal);
    document.getElementById('checkout-btn').disabled = ids.length === 0;
  }

  document.getElementById('checkout-btn').addEventListener('click', function(){
    var ids = Object.keys(cart).filter(function(id){ return cart[id] > 0; });
    var allAvailable = ids.every(function(id){
      var p = PRODUCTS.find(function(x){ return x.id === id; });
      return cart[id] <= p.stock;
    });
    if(allAvailable){
      showToast('All items available — order confirmed!');
      cart = {};
      updateCartCount(); renderCart(); renderGrid();
      setTimeout(closeCart, 900);
    } else {
      showToast('Some items exceed available stock');
    }
  });

  renderGrid();
  updateCartCount();
})();
/* ============================================================
   HAMBURGER / MOBILE NAV (shared pattern across all pages)
============================================================ */
(function(){
  "use strict";
  function initMobileNav(){
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var pageNav = document.getElementById('page-nav');
    var navClose = document.getElementById('nav-close');
    var navScrim = document.getElementById('nav-scrim');
    if(!hamburgerBtn || !pageNav) return;

    function openNav(){
      pageNav.classList.add('mobile-open');
      if(navScrim) navScrim.classList.add('show');
      hamburgerBtn.style.display = 'none';
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    function closeNav(){
      pageNav.classList.remove('mobile-open');
      if(navScrim) navScrim.classList.remove('show');
      hamburgerBtn.style.display = '';
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    hamburgerBtn.addEventListener('click', openNav);
    if(navClose) navClose.addEventListener('click', closeNav);
    if(navScrim) navScrim.addEventListener('click', closeNav);

    pageNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', function(){
      if(window.innerWidth > 760) closeNav();
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
