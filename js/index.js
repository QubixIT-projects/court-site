(function(){
  "use strict";

  /* =========================================================
     PRODUCT DATA
  ========================================================= */
  var SPORTS = {
    badminton: { label:"Badminton",    color:0xd7ff4e, angle: -150 },
    tennis:    { label:"Tennis",       color:0xb8e026, angle: -90 },
    squash:    { label:"Squash",       color:0x4ea1ff, angle: -30 },
    paddle:    { label:"Paddle",       color:0xff8c3d, angle: 30 },
    tabletennis:{ label:"Table Tennis",color:0xff6a5c, angle: 90 },
    accessories:{ label:"Accessories", color:0xc78a4e, angle: 150 }
  };

  var PRODUCTS = [
    { id:"bd-racket",  sport:"badminton", brand:"Yonex", name:"Astrox 100ZZ Racket",       price:62500, stock:7,  desc:"Head-heavy carbon frame built for explosive smashes and fast net recovery.", type:"racket-bd" },
    { id:"bd-shuttle", sport:"badminton", brand:"Yonex", name:"Mavis 350 Shuttlecocks",     price:3200,  stock:45, desc:"Tube of 6 nylon shuttles with consistent tournament-grade flight.", type:"shuttle" },
    { id:"bd-shoe",    sport:"badminton", brand:"Yonex", name:"Power Cushion Comfort Z2",   price:24900, stock:11, desc:"Cushioned midsole built to absorb repeated lunges and sudden pivots.", type:"shoe" },

    { id:"tn-racket",  sport:"tennis", brand:"Wilson", name:"Pro Staff 97 v14 Racket",      price:68000, stock:5,  desc:"Precision-tuned frame favoured by players who like to shape the ball.", type:"racket-tn" },
    { id:"tn-ball",    sport:"tennis", brand:"Wilson", name:"US Open Extra Duty Balls",      price:3500,  stock:30, desc:"Can of 3 felt-core balls with durable felt for hard-court play.", type:"ball-tn" },
    { id:"tn-shoe",    sport:"tennis", brand:"Head", name:"Sprint Pro 3.5 Court Shoes",      price:27500, stock:9,  desc:"Reinforced toe cap built for hard sliding stops on clay and hard court.", type:"shoe" },

    { id:"sq-racket",  sport:"squash", brand:"Dunlop", name:"Sonic Core Pro Racket",         price:45000, stock:6,  desc:"Lightweight teardrop frame for quick swings in tight rallies.", type:"racket-sq" },
    { id:"sq-ball",    sport:"squash", brand:"Dunlop", name:"Double Yellow Dot Balls",        price:2800,  stock:20, desc:"Competition-grade balls with a low bounce for advanced play.", type:"ball-sq" },
    { id:"sq-goggles", sport:"squash", brand:"Eye Guard", name:"Protective Squash Goggles",   price:6500,  stock:14, desc:"Impact-rated lenses with anti-fog coating for full-speed rallies.", type:"goggles" },

    { id:"pd-paddle",  sport:"paddle", brand:"Babolat", name:"Technical Viper Paddle",        price:58000, stock:4,  desc:"Diamond-shaped power paddle with a textured carbon face.", type:"paddle" },
    { id:"pd-ball",    sport:"paddle", brand:"Head", name:"Padel Pro S Balls",                 price:3000,  stock:22, desc:"Tube of 3 balls tuned for padel's lower bounce and enclosed courts.", type:"ball-pd" },
    { id:"pd-grip",    sport:"paddle", brand:"Babolat", name:"Paddle Grip Overwrap",           price:1200,  stock:50, desc:"Tacky overgrip for a secure hold through long rallies.", type:"grip" },

    { id:"tt-blade",   sport:"tabletennis", brand:"Butterfly", name:"Timo Boll ALC Blade",     price:38500, stock:6,  desc:"Carbon-layered blade built for fast, controlled offensive play.", type:"blade-tt" },
    { id:"tt-ball",    sport:"tabletennis", brand:"DHS", name:"3-Star Table Tennis Balls",      price:2200,  stock:35, desc:"Pack of 6 poly balls with consistent bounce for match play.", type:"ball-tt" },
    { id:"tt-rubber",  sport:"tabletennis", brand:"Butterfly", name:"Tenergy Rubber Sheet",     price:8900,  stock:12, desc:"High-grip rubber sheet for added spin and speed off the blade.", type:"rubber" },

    { id:"ac-wrist",   sport:"accessories", brand:"Yonex", name:"Sports Wristbands (Pair)",     price:1800,  stock:40, desc:"Terry-cloth wristbands that keep sweat off your grip.", type:"wristband" },
    { id:"ac-cap",     sport:"accessories", brand:"New Balance", name:"Performance Cap",         price:4500,  stock:18, desc:"Lightweight breathable cap with a curved brim for court days.", type:"cap" },
    { id:"ac-socks",   sport:"accessories", brand:"Wilson", name:"Compression Ankle Socks (3-Pack)", price:2600, stock:33, desc:"Cushioned, breathable socks built for long sessions on court.", type:"socks" }
  ];

  function formatLKR(n){
    return 'Rs ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var cart = {}; // id -> qty

  /* =========================================================
     THREE.JS SETUP
  ========================================================= */
  var wrap = document.getElementById('canvas-wrap');
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1210);
  scene.fog = new THREE.Fog(0x0c1210, 18, 42);

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 7.5, 15);

  var renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  wrap.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 6;
  controls.maxDistance = 24;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.target.set(0, 1.2, 0);
  controls.update();

  /* ---------- Lighting ---------- */
  var hemi = new THREE.HemisphereLight(0x8fb8ff, 0x1a140c, 0.55);
  scene.add(hemi);

  var key = new THREE.DirectionalLight(0xfff2d6, 1.15);
  key.position.set(8, 14, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -16; key.shadow.camera.right = 16;
  key.shadow.camera.top = 16; key.shadow.camera.bottom = -16;
  key.shadow.bias = -0.0015;
  scene.add(key);

  var rim = new THREE.DirectionalLight(0x4ea1ff, 0.4);
  rim.position.set(-10, 6, -8);
  scene.add(rim);

  Object.keys(SPORTS).forEach(function(key2){
    var s = SPORTS[key2];
    var rad = THREE.MathUtils.degToRad(s.angle);
    var r = 7.2;
    var pl = new THREE.PointLight(s.color, 0.9, 9, 2);
    pl.position.set(Math.sin(rad)*r, 3.2, Math.cos(rad)*r);
    scene.add(pl);
  });

  /* ---------- Floor ---------- */
  function makeFloorTexture(){
    var c = document.createElement('canvas');
    c.width = c.height = 512;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#5a3c22';
    ctx.fillRect(0,0,512,512);
    for(var i=0;i<40;i++){
      ctx.fillStyle = i%2===0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, i*13, 512, 13);
    }
    ctx.strokeStyle = 'rgba(243,239,226,0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20,20,472,472);
    ctx.beginPath();
    ctx.arc(256,256,90,0,Math.PI*2);
    ctx.stroke();
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3,3);
    return tex;
  }
  var floorGeo = new THREE.CircleGeometry(15, 64);
  var floorMat = new THREE.MeshStandardMaterial({ map: makeFloorTexture(), roughness:0.85, metalness:0.05 });
  var floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true;
  scene.add(floor);

  /* ---------- Text sprite helper ---------- */
  function makeTextSprite(text, colorHex){
    var c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    var ctx = c.getContext('2d');
    ctx.clearRect(0,0,512,128);
    ctx.font = "700 56px Anton, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#" + colorHex.toString(16).padStart(6,'0');
    ctx.fillText(text.toUpperCase(), 256, 64);
    var tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    var mat = new THREE.SpriteMaterial({ map: tex, transparent:true, depthWrite:false });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(4, 1, 1);
    return sprite;
  }

  /* =========================================================
     PROCEDURAL LOW-POLY PRODUCT MODELS
  ========================================================= */
  function stdMat(color, rough, metal){
    return new THREE.MeshStandardMaterial({ color:color, roughness: rough!==undefined?rough:0.5, metalness: metal!==undefined?metal:0.15 });
  }

  function buildRacket(headColor, size){
    var g = new THREE.Group();
    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.06,0.85,10), stdMat(0x2a2a2a,0.6,0.2));
    handle.position.y = -0.65;
    g.add(handle);
    var neckL = new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.045,0.55,8), stdMat(0x2a2a2a,0.6,0.2));
    neckL.position.set(-0.14, -0.15, 0); neckL.rotation.z = 0.35;
    var neckR = neckL.clone(); neckR.position.x = 0.14; neckR.rotation.z = -0.35;
    g.add(neckL, neckR);
    var head = new THREE.Mesh(new THREE.TorusGeometry(size||0.42, 0.045, 8, 20), stdMat(headColor,0.4,0.3));
    head.position.y = 0.42;
    g.add(head);
    var stringMat = new THREE.MeshBasicMaterial({ color:0xf3efe2, transparent:true, opacity:0.35, side:THREE.DoubleSide });
    var strings = new THREE.Mesh(new THREE.CircleGeometry((size||0.42)*0.92, 16), stringMat);
    strings.position.y = 0.42;
    g.add(strings);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    return g;
  }

  function buildShuttle(){
    var g = new THREE.Group();
    var cork = new THREE.Mesh(new THREE.SphereGeometry(0.11,10,8), stdMat(0xf3efe2,0.7,0));
    g.add(cork);
    var skirt = new THREE.Mesh(new THREE.ConeGeometry(0.24,0.5,10,1,true), new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.9, side:THREE.DoubleSide}));
    skirt.position.y = 0.33; g.add(skirt);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    g.scale.set(1.3,1.3,1.3);
    return g;
  }

  function buildBall(color, size, pattern){
    var g = new THREE.Group();
    var ball = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 2), stdMat(color, 0.55, 0.05));
    ball.castShadow = true;
    g.add(ball);
    if(pattern === 'basketball'){
      var lineMat = new THREE.MeshBasicMaterial({ color:0x28180c });
      [0, Math.PI/2].forEach(function(rotY){
        var ring = new THREE.Mesh(new THREE.TorusGeometry(size*1.005, size*0.045, 6, 24), lineMat);
        ring.rotation.y = rotY;
        g.add(ring);
      });
      var ring2 = new THREE.Mesh(new THREE.TorusGeometry(size*1.005, size*0.045, 6, 24), lineMat);
      ring2.rotation.x = Math.PI/2;
      g.add(ring2);
    }
    if(pattern === 'cricket'){
      var seam = new THREE.Mesh(new THREE.TorusGeometry(size*1.01, size*0.05, 6, 24), stdMat(0xf3efe2,0.6,0));
      seam.rotation.x = Math.PI/2.3;
      g.add(seam);
    }
    if(pattern === 'tennis'){
      var seamA = new THREE.Mesh(new THREE.TorusGeometry(size*1.005, size*0.04, 6, 24), new THREE.MeshBasicMaterial({color:0xf3efe2}));
      seamA.rotation.set(0.5, 0.3, 0);
      g.add(seamA);
    }
    return g;
  }

  function buildShoe(color){
    var g = new THREE.Group();
    var sole = new THREE.Mesh(new THREE.BoxGeometry(1.05,0.14,0.42), stdMat(0x201a14,0.8,0));
    sole.position.y = 0.07;
    g.add(sole);
    var bodyShape = new THREE.Mesh(new THREE.SphereGeometry(0.34,10,8), stdMat(color,0.55,0.1));
    bodyShape.scale.set(1.35,0.85,0.85);
    bodyShape.position.set(-0.05,0.28,0);
    g.add(bodyShape);
    var toe = new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8), stdMat(color,0.55,0.1));
    toe.scale.set(1.1,0.7,0.8);
    toe.position.set(0.45,0.2,0);
    g.add(toe);
    var tongue = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.22,0.3), stdMat(0xf3efe2,0.6,0));
    tongue.position.set(-0.25,0.42,0);
    tongue.rotation.z = 0.4;
    g.add(tongue);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    g.scale.set(0.8,0.8,0.8);
    return g;
  }

  function buildJersey(color){
    var g = new THREE.Group();
    var torso = new THREE.Mesh(new THREE.BoxGeometry(0.62,0.75,0.14), stdMat(color,0.7,0));
    g.add(torso);
    var sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.28,0.16), stdMat(color,0.7,0));
    sleeveL.position.set(-0.43,0.24,0); sleeveL.rotation.z = 0.25;
    var sleeveR = sleeveL.clone(); sleeveR.position.x = 0.43; sleeveR.rotation.z = -0.25;
    g.add(sleeveL, sleeveR);
    var collar = new THREE.Mesh(new THREE.TorusGeometry(0.1,0.025,6,12), stdMat(0xf3efe2,0.6,0));
    collar.rotation.x = Math.PI/2;
    collar.position.y = 0.38;
    g.add(collar);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    return g;
  }

  function buildBat(){
    var g = new THREE.Group();
    var blade = new THREE.Mesh(new THREE.BoxGeometry(0.34,0.85,0.12), stdMat(0xe3c28a,0.55,0));
    blade.position.y = -0.15;
    g.add(blade);
    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.55,10), stdMat(0x8a5a2c,0.6,0));
    handle.position.y = 0.55;
    g.add(handle);
    var grip = new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.3,10), stdMat(0x1c1c1c,0.8,0));
    grip.position.y = 0.75;
    g.add(grip);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    return g;
  }

  function buildPads(){
    var g = new THREE.Group();
    [-0.22, 0.22].forEach(function(x){
      var pad = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.85,0.16), stdMat(0xf3efe2,0.75,0));
      pad.position.x = x;
      g.add(pad);
      for(var i=0;i<3;i++){
        var band = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.06,0.18), stdMat(0x1c1c1c,0.7,0));
        band.position.set(x, -0.28 + i*0.28, 0);
        g.add(band);
      }
    });
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    g.scale.set(0.85,0.85,0.85);
    return g;
  }

  function buildGoggles(color){
    var g = new THREE.Group();
    var lensMat = new THREE.MeshStandardMaterial({ color:color, roughness:0.25, metalness:0.1, transparent:true, opacity:0.55 });
    [-0.2, 0.2].forEach(function(x){
      var lens = new THREE.Mesh(new THREE.SphereGeometry(0.18,12,10), lensMat);
      lens.scale.set(1,1,0.4);
      lens.position.x = x;
      g.add(lens);
    });
    var bridge = new THREE.Mesh(new THREE.BoxGeometry(0.14,0.05,0.05), stdMat(0x1c1c1c,0.6,0.2));
    g.add(bridge);
    var frameMat = stdMat(0x1c1c1c,0.6,0.2);
    [-0.2,0.2].forEach(function(x){
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.18,0.02,8,20), frameMat);
      ring.position.x = x;
      g.add(ring);
    });
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    g.scale.set(1.3,1.3,1.3);
    return g;
  }

  function buildPaddleBlade(color, size){
    var g = new THREE.Group();
    var handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.065,0.4,10), stdMat(0x2a2a2a,0.6,0.2));
    handle.position.y = -0.32;
    g.add(handle);
    var blade = new THREE.Mesh(new THREE.CylinderGeometry(size, size, 0.06, 24), stdMat(color, 0.4, 0.2));
    blade.rotation.x = Math.PI/2;
    blade.position.y = 0.18;
    blade.scale.set(1, 1.22, 1);
    g.add(blade);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    return g;
  }

  function buildRubberSheet(color){
    var g = new THREE.Group();
    var sheet = new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.05,24), stdMat(color,0.35,0.15));
    sheet.rotation.x = Math.PI/2;
    g.add(sheet);
    var dots = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,0.052,24), new THREE.MeshStandardMaterial({color:0x0c1210, roughness:0.6, wireframe:true}));
    dots.rotation.x = Math.PI/2;
    g.add(dots);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    return g;
  }

  function buildWristband(color){
    var g = new THREE.Group();
    [-0.16, 0.16].forEach(function(y){
      var band = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.09, 10, 20), stdMat(color,0.75,0));
      band.position.y = y;
      band.rotation.x = Math.PI/2;
      g.add(band);
    });
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    g.scale.set(1.1,1.1,1.1);
    return g;
  }

  function buildCap(color){
    var g = new THREE.Group();
    var dome = new THREE.Mesh(new THREE.SphereGeometry(0.32,16,10,0,Math.PI*2,0,Math.PI/1.9), stdMat(color,0.6,0));
    g.add(dome);
    var brim = new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.03,20,1,false,0,Math.PI), stdMat(color,0.6,0));
    brim.position.set(0,-0.02,0.22);
    brim.scale.set(1,1,0.7);
    g.add(brim);
    var button = new THREE.Mesh(new THREE.SphereGeometry(0.035,8,8), stdMat(0xf3efe2,0.5,0));
    button.position.y = 0.32;
    g.add(button);
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    g.scale.set(1.1,1.1,1.1);
    return g;
  }

  function buildSocksPack(color){
    var g = new THREE.Group();
    [-0.13, 0.13].forEach(function(x, i){
      var sock = new THREE.Mesh(new THREE.SphereGeometry(0.13,10,10), stdMat(color,0.7,0));
      sock.scale.set(1,2.1,1);
      sock.position.set(x, 0, 0);
      sock.rotation.z = i===0 ? 0.12 : -0.12;
      g.add(sock);
      var stripe = new THREE.Mesh(new THREE.TorusGeometry(0.115,0.02,6,16), stdMat(0xf3efe2,0.6,0));
      stripe.position.set(x, 0.18, 0);
      stripe.rotation.x = Math.PI/2;
      g.add(stripe);
    });
    g.traverse(function(o){ if(o.isMesh){ o.castShadow = true; } });
    return g;
  }

  function buildModel(product){
    switch(product.type){
      case 'racket-bd': return buildRacket(0x2f3a2a, 0.38);
      case 'racket-tn': return buildRacket(0x1c2b3a, 0.46);
      case 'racket-sq': return buildRacket(0x3a2b1c, 0.32);
      case 'shuttle': return buildShuttle();
      case 'ball-tn': return buildBall(0xd6f24a, 0.28, 'tennis');
      case 'ball-sq': return buildBall(0x2a2a2a, 0.2, null);
      case 'ball-pd': return buildBall(0xd9d94a, 0.27, null);
      case 'ball-tt': return buildBall(0xf3efe2, 0.16, null);
      case 'goggles': return buildGoggles(0x4ea1ff);
      case 'paddle': return buildPaddleBlade(0xff8c3d, 0.3);
      case 'grip': return new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.5,10), stdMat(0x2a2a2a,0.7,0.1));
      case 'blade-tt': return buildPaddleBlade(0xff6a5c, 0.2);
      case 'rubber': return buildRubberSheet(0xff6a5c);
      case 'shoe': return buildShoe(SPORTS[product.sport].color);
      case 'jersey': return buildJersey(SPORTS[product.sport].color);
      case 'wristband': return buildWristband(SPORTS.accessories.color);
      case 'cap': return buildCap(SPORTS.accessories.color);
      case 'socks': return buildSocksPack(0xf3efe2);
      default: return new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,0.4), stdMat(0xffffff));
    }
  }

  /* =========================================================
     PEDESTALS + LAYOUT
  ========================================================= */
  var pedestalMat = stdMat(0x1a2320, 0.7, 0.1);
  var clickable = []; // { mesh, product }

  function makePedestal(){
    var g = new THREE.Group();
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.62,0.9,20), pedestalMat);
    base.position.y = 0.45;
    base.castShadow = true; base.receiveShadow = true;
    g.add(base);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.56,0.025,8,24), stdMat(0xf3efe2,0.4,0.3));
    ring.rotation.x = Math.PI/2;
    ring.position.y = 0.9;
    g.add(ring);
    return g;
  }

  var sectionGroup = new THREE.Group();
  scene.add(sectionGroup);

  Object.keys(SPORTS).forEach(function(sportKey){
    var s = SPORTS[sportKey];
    var rad = THREE.MathUtils.degToRad(s.angle);
    var R = 7.2;
    var cx = Math.sin(rad)*R, cz = Math.cos(rad)*R;

    // section label
    var label = makeTextSprite(s.label, s.color);
    label.position.set(cx*1.18, 3.1, cz*1.18);
    sectionGroup.add(label);

    // accent disc under the section
    var disc = new THREE.Mesh(new THREE.CircleGeometry(2.6, 40), new THREE.MeshStandardMaterial({ color: s.color, transparent:true, opacity:0.14, roughness:1 }));
    disc.rotation.x = -Math.PI/2;
    disc.position.set(cx, 0.02, cz);
    sectionGroup.add(disc);

    var prods = PRODUCTS.filter(function(p){ return p.sport === sportKey; });
    var spread = 1.9;
    prods.forEach(function(p, i){
      var offset = (i - (prods.length-1)/2) * spread;
      // perpendicular direction to place pedestals in an arc facing center
      var perpX = Math.cos(rad), perpZ = -Math.sin(rad);
      var px = cx + perpX*offset;
      var pz = cz + perpZ*offset;

      var pedestal = makePedestal();
      pedestal.position.set(px, 0, pz);
      sectionGroup.add(pedestal);

      var model = buildModel(p);
      model.position.set(px, 1.05, pz);
      model.userData.baseY = 1.05;
      model.userData.spin = 0.25 + Math.random()*0.2;
      model.userData.product = p;
      sectionGroup.add(model);

      clickable.push(model);
    });
  });

  /* =========================================================
     RAYCASTING / INTERACTION
  ========================================================= */
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var hovered = null;
  var selectedModel = null;

  function getIntersect(clientX, clientY){
    mouse.x = (clientX/window.innerWidth)*2 - 1;
    mouse.y = -(clientY/window.innerHeight)*2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var targets = [];
    clickable.forEach(function(m){ targets.push(m); });
    var hits = raycaster.intersectObjects(targets, true);
    if(hits.length === 0) return null;
    var obj = hits[0].object;
    while(obj.parent && !obj.userData.product){ obj = obj.parent; }
    return obj.userData.product ? obj : null;
  }

  renderer.domElement.addEventListener('pointermove', function(e){
    var hit = getIntersect(e.clientX, e.clientY);
    if(hit !== hovered){
      hovered = hit;
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    }
  });

  renderer.domElement.addEventListener('click', function(e){
    var hit = getIntersect(e.clientX, e.clientY);
    if(hit){
      selectedModel = hit;
      openProductPanel(hit.userData.product);
      hideHint();
    }
  });

  /* =========================================================
     UI — PRODUCT PANEL
  ========================================================= */
  var panel = document.getElementById('product-panel');
  var scrim = document.getElementById('scrim');
  var qty = 1;

  function stockClass(stock){
    if(stock <= 0) return 'out';
    if(stock <= 6) return 'low';
    return 'in';
  }
  function stockLabel(stock){
    if(stock <= 0) return 'OUT OF STOCK';
    if(stock <= 6) return stock + ' LEFT — LOW STOCK';
    return stock + ' IN STOCK';
  }

  function openProductPanel(product){
    qty = 1;
    document.getElementById('qty-val').textContent = qty;
    document.getElementById('p-sport').textContent = SPORTS[product.sport].label + ' EQUIPMENT';
    document.getElementById('p-sport').style.setProperty('--chip-color', '#'+SPORTS[product.sport].color.toString(16).padStart(6,'0'));
    document.getElementById('p-name').textContent = (product.brand ? product.brand + ' ' : '') + product.name;
    document.getElementById('p-desc').textContent = product.desc;
    document.getElementById('p-price').textContent = formatLKR(product.price);
    var stockEl = document.getElementById('p-stock');
    stockEl.textContent = stockLabel(product.stock);
    stockEl.className = 'p-stock mono ' + stockClass(product.stock);
    document.getElementById('add-to-cart').disabled = product.stock <= 0;
    panel.dataset.productId = product.id;
    panel.classList.add('open');
    scrim.classList.add('show');
    closeCart();
  }
  function closePanel(){
    panel.classList.remove('open');
    if(!cartDrawer.classList.contains('open')) scrim.classList.remove('show');
  }
  document.getElementById('panel-close').addEventListener('click', closePanel);
  scrim.addEventListener('click', function(){ closePanel(); closeCart(); });

  document.getElementById('qty-minus').addEventListener('click', function(){
    if(qty > 1){ qty--; document.getElementById('qty-val').textContent = qty; }
  });
  document.getElementById('qty-plus').addEventListener('click', function(){
    var p = PRODUCTS.find(function(x){ return x.id === panel.dataset.productId; });
    if(p && qty < p.stock){ qty++; document.getElementById('qty-val').textContent = qty; }
    else showToast("That's all the stock we've got");
  });

  document.getElementById('add-to-cart').addEventListener('click', function(){
    var p = PRODUCTS.find(function(x){ return x.id === panel.dataset.productId; });
    if(!p) return;
    var current = cart[p.id] || 0;
    if(current + qty > p.stock){
      showToast('Only ' + p.stock + ' in stock — adjust quantity');
      return;
    }
    cart[p.id] = current + qty;
    updateCartCount();
    renderCart();
    showToast(p.name + ' added to cart');
    closePanel();
  });

  /* =========================================================
     UI — CART DRAWER
  ========================================================= */
  var cartDrawer = document.getElementById('cart-drawer');
  var cartBtn = document.getElementById('cart-btn');

  function openCart(){
    renderCart();
    cartDrawer.classList.add('open');
    scrim.classList.add('show');
    closePanel();
  }
  function closeCart(){
    cartDrawer.classList.remove('open');
    if(!panel.classList.contains('open')) scrim.classList.remove('show');
  }
  cartBtn.addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);

  function updateCartCount(){
    var total = Object.values(cart).reduce(function(a,b){ return a+b; }, 0);
    document.getElementById('cart-count').textContent = total;
  }

  function renderCart(){
    var container = document.getElementById('cart-items');
    container.innerHTML = '';
    var ids = Object.keys(cart).filter(function(id){ return cart[id] > 0; });

    if(ids.length === 0){
      container.innerHTML = '<div class="cart-empty">Your cart is empty.<br>Click on any product in the shop to add it.</div>';
    }

    var subtotal = 0;
    ids.forEach(function(id){
      var p = PRODUCTS.find(function(x){ return x.id === id; });
      var qtyInCart = cart[id];
      var lineTotal = p.price * qtyInCart;
      subtotal += lineTotal;

      var row = document.createElement('div');
      row.className = 'cart-item';
      var swatchColor = '#' + SPORTS[p.sport].color.toString(16).padStart(6,'0');
      var avail = qtyInCart <= p.stock;

      row.innerHTML =
        '<div class="ci-swatch" style="background:'+swatchColor+'22; border:1px solid '+swatchColor+'55;"></div>' +
        '<div class="ci-info">' +
          '<div class="ci-name">'+(p.brand ? p.brand+' ' : '')+p.name+'</div>' +
          '<div class="ci-sport mono">'+SPORTS[p.sport].label.toUpperCase()+'</div>' +
          '<div class="ci-controls">' +
            '<button class="ci-qbtn" data-act="dec" data-id="'+p.id+'">&minus;</button>' +
            '<span class="mono">'+qtyInCart+'</span>' +
            '<button class="ci-qbtn" data-act="inc" data-id="'+p.id+'">+</button>' +
          '</div>' +
          '<div class="ci-avail '+(avail?'ok':'warn')+'">'+(avail ? '✓ Available — ' + p.stock + ' in stock' : '⚠ Only ' + p.stock + ' available')+'</div>' +
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
          if(cart[id] + 1 > p.stock){ showToast('Only ' + p.stock + ' in stock'); return; }
          cart[id]++;
        } else if(btn.dataset.act === 'dec'){
          cart[id]--; if(cart[id] <= 0) delete cart[id];
        } else if(btn.dataset.act === 'remove'){
          delete cart[id];
        }
        updateCartCount();
        renderCart();
      });
    });

    document.getElementById('cart-item-count').textContent = ids.reduce(function(a,id){ return a+cart[id]; },0);
    document.getElementById('cart-total').textContent = formatLKR(subtotal);
    var checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = ids.length === 0;
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
      updateCartCount();
      renderCart();
      setTimeout(closeCart, 900);
    } else {
      showToast('Some items exceed available stock');
    }
  });

  /* =========================================================
     SECTION NAV CHIPS
  ========================================================= */
  var navEl = document.getElementById('section-nav');
  Object.keys(SPORTS).forEach(function(sportKey){
    var s = SPORTS[sportKey];
    var chip = document.createElement('div');
    chip.className = 'section-chip';
    chip.style.setProperty('--chip-color', '#'+s.color.toString(16).padStart(6,'0'));
    chip.innerHTML = '<span class="dot"></span>' + s.label;
    chip.addEventListener('click', function(){
      var rad = THREE.MathUtils.degToRad(s.angle);
      var R = 10.5;
      var targetPos = new THREE.Vector3(Math.sin(rad)*R, 5.5, Math.cos(rad)*R);
      animateCamera(targetPos, new THREE.Vector3(Math.sin(rad)*7.2, 1.1, Math.cos(rad)*7.2));
      hideHint();
    });
    navEl.appendChild(chip);
  });

  function animateCamera(pos, target){
    var startPos = camera.position.clone();
    var startTarget = controls.target.clone();
    var t0 = performance.now();
    var dur = 900;
    function step(now){
      var t = Math.min(1, (now - t0)/dur);
      var e = 1 - Math.pow(1-t, 3);
      camera.position.lerpVectors(startPos, pos, e);
      controls.target.lerpVectors(startTarget, target, e);
      controls.update();
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =========================================================
     TOAST
  ========================================================= */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2400);
  }

  function hideHint(){
    var h = document.getElementById('hint');
    h.style.opacity = '0';
  }

  /* =========================================================
     RESIZE + RENDER LOOP
  ========================================================= */
  window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    clickable.forEach(function(m){
      m.rotation.y += 0.0035 + m.userData.spin*0.002;
      m.position.y = m.userData.baseY + Math.sin(t*1.2 + m.userData.spin*10)*0.045;
      var targetScale = (m === hovered || m === selectedModel) ? 1.12 : 1.0;
      m.scale.lerp(new THREE.Vector3(targetScale,targetScale,targetScale), 0.15);
    });
    controls.update();
    renderer.render(scene, camera);
  }

  /* =========================================================
     LOADING SEQUENCE
  ========================================================= */
  var bar = document.getElementById('loading-bar');
  var progress = 0;
  var loadTimer = setInterval(function(){
    progress += 8 + Math.random()*14;
    if(progress >= 100){
      progress = 100;
      clearInterval(loadTimer);
      setTimeout(function(){
        document.getElementById('loading').style.opacity = '0';
        setTimeout(function(){ document.getElementById('loading').style.display = 'none'; }, 550);
      }, 200);
    }
    bar.style.width = progress + '%';
  }, 140);

  renderer.domElement.style.cursor = 'grab';
  updateCartCount();
  animate();

  setTimeout(hideHint, 8000);
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
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    function closeNav(){
      pageNav.classList.remove('mobile-open');
      if(navScrim) navScrim.classList.remove('show');
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
