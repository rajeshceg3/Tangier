import {createSoundscape} from './soundscape.js';
import {SOUND_PLACES} from './sound-places.js';
import * as T from "three";
export const chapters = [
  {
    name: "Rooftops",
    title: "The city leans to sea.",
    line: "Limewashed terraces. Green-tiled roofs. Salt light on the walls.",
    eye: [3, 25, 38],
    target: [-11, 18, -6],
  },
  {
    name: "Medina",
    title: "Through the blue door.",
    line: "A narrow passage opens toward a small patch of sky.",
    eye: [85, 6, 21],
    target: [85, 5.8, -3],
  },
  {
    name: "Kasbah",
    title: "Above the white city.",
    line: "Warm stone, tiled shade and a view beyond the walls.",
    eye: [-65, 19, 20],
    target: [-65, 17, -10],
  },
  {
    name: "The Strait",
    title: "The space between.",
    line: "A ferry crosses the blue. The far shore stays a whisper.",
    eye: [3, 6, -62],
    target: [-4, 4, -150],
  },
];
export function createWorld(canvas) {
  const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: false });
  r.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  r.shadowMap.enabled = true;
  r.shadowMap.type = T.PCFSoftShadowMap;
  r.outputColorSpace = T.SRGBColorSpace;
  r.toneMapping = T.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.12;
  const scene = new T.Scene();
  scene.background = new T.Color("#a3d0dd");
  scene.fog = new T.FogExp2("#b0c8cb", 0.0029);
  const camera = new T.PerspectiveCamera(
    53,
    innerWidth / innerHeight,
    0.1,
    1400,
  );
  scene.add(new T.HemisphereLight("#d4eeff", "#ae7650", 2));
  const sun = new T.DirectionalLight("#ffdfac", 3.4);
  sun.position.set(-65, 100, 65);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {
    left: -115,
    right: 115,
    top: 105,
    bottom: -95,
    far: 300,
  });
  sun.shadow.normalBias = 0.08;
  sun.shadow.bias = -0.00015;
  scene.add(sun);
  const mat = (c, roughness = 0.9) =>
    new T.MeshStandardMaterial({ color: c, roughness });
  const white = mat("#eee0c8"),
    cream = mat("#d5bc95"),
    blue = mat("#165779"),
    dark = mat("#163a4d"),
    green = mat("#267475"),
    stone = mat("#ba9068"),
    terra = mat("#bf7150"),
    gold = mat("#d3a65e"),
    leaf = mat("#4d6b45");
  function mesh(geo, m, pos, parent = scene) {
    let o = new T.Mesh(geo, m);
    o.position.set(...pos);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  function box(w, h, d, m, x, y, z, parent = scene) {
    return mesh(new T.BoxGeometry(w, h, d), m, [x, y, z], parent);
  }
  function cylinder(a, b, h, m, x, y, z, parent = scene) {
    return mesh(new T.CylinderGeometry(a, b, h, 12), m, [x, y, z], parent);
  }
  const sky = new T.Mesh(
    new T.SphereGeometry(800, 32, 20),
    new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      vertexShader:
        "varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "varying vec3 v;void main(){float h=normalize(v).y;vec3 col=mix(vec3(.93,.78,.6),vec3(.31,.61,.75),smoothstep(-.05,.6,h));float sun=pow(max(0.,dot(normalize(v),normalize(vec3(-.6,.25,-.8)))),130.);col+=vec3(1.,.6,.22)*sun*.7;gl_FragColor=vec4(col,1.);}",
    }),
  );
  scene.add(sky);
  const plasterCanvas = document.createElement("canvas");
  plasterCanvas.width = plasterCanvas.height = 256;
  const pc = plasterCanvas.getContext("2d");
  pc.fillStyle = "#e9e6de";
  pc.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 16000; i++) {
    let v = 180 + Math.random() * 65;
    pc.fillStyle = `rgba(${v},${v},${v},.14)`;
    pc.fillRect(
      Math.random() * 256,
      Math.random() * 256,
      Math.random() * 2 + 0.4,
      Math.random() * 2 + 0.4,
    );
  }
  const plaster = new T.CanvasTexture(plasterCanvas);
  plaster.wrapS = plaster.wrapT = T.RepeatWrapping;
  plaster.repeat.set(3, 3);
  plaster.colorSpace = T.SRGBColorSpace;
  white.map = plaster;
  cream.map = plaster;
  stone.map = plaster;

  let seed = 72291;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  // Continuous sea, with world-space wave bands and sunlight rather than a flat backdrop.
  const seaM = new T.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader:
      "varying vec3 v;void main(){vec4 p=modelMatrix*vec4(position,1.);v=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}",
    fragmentShader:
      "varying vec3 v;uniform float time;void main(){float w=sin(v.x*.8+v.z*1.7+time*.6)*sin(v.x*.23-v.z*.6-time*.4);float small=pow(max(0.,sin(v.z*4.+v.x*.3+sin(v.x*.7+v.z*.2)*1.8+time)),18.);float glint=pow(max(0.,1.-abs(v.x+v.z*.25+35.)/45.),5.)*small;vec3 col=mix(vec3(.055,.28,.37),vec3(.19,.49,.57),.5+w*.16);col+=vec3(.7,.52,.27)*glint*.6;float fog=smoothstep(90.,700.,length(v.xz-cameraPosition.xz));col=mix(col,vec3(.76,.77,.7),fog*.9);gl_FragColor=vec4(col,1.);}",
  });
  let sea = mesh(new T.PlaneGeometry(1800, 1800), seaM, [0, 0, -320]);
  sea.rotation.x = -Math.PI / 2;
  sea.castShadow = false;
  const cityStart = scene.children.length;
  // Sloping town foundation. Its irregular edge meets the water, not an infinite city plane.
  const hillGeo = new T.PlaneGeometry(260, 280, 40, 44);
  hillGeo.rotateX(-Math.PI / 2);
  const a = hillGeo.attributes.position;
  for (let i = 0; i < a.count; i++) {
    const x = a.getX(i),
      z = a.getZ(i);
    a.setY(
      i,
      z + 50 < -55
        ? -4
        : 2 +
            (z + 117.5) * 0.105 +
            Math.sin(x * 0.09) * 0.8 +
            Math.cos((z + 50) * 0.11) * 0.5,
    );
  }
  hillGeo.computeVertexNormals();
  mesh(hillGeo, mat("#b89c7e"), [0, 0, 50]);
  box(400, 1.5, 300, mat("#b89c7e"), 0, -0.3, 95);
  const positions = [];
  for (let z = -46; z < 150; z += 7.2)
    for (let x = -78; x <= 78; x += 7.6) {
      if (Math.abs(x + 14) < 6 && Math.abs(z + 4) < 8) continue;
      if (x < -55 && z > -12 && z < 34) continue;
      if (x > 75 && z > -25 && z < 39) continue;
      positions.push([x + (rand() - 0.5) * 2, z + (rand() - 0.5) * 2]);
    }
  const wallMats = ["#e7ddc8", "#f1e9d8", "#e3d5bb", "#e6d3b6", "#d4c7ab"].map(
    (c) => {
      let m = mat(c);
      m.map = plaster;
      return m;
    },
  );
  const cubes = wallMats.map((m) => {
    const o = new T.InstancedMesh(
      new T.BoxGeometry(1, 1, 1),
      m,
      positions.length,
    );
    o.castShadow = o.receiveShadow = true;
    scene.add(o);
    return o;
  });
  const counts = [0, 0, 0, 0, 0];
  const details = [];
  let dmy = new T.Object3D();
  positions.forEach(([x, z]) => {
    const base =
        2 +
        (z + 67.5) * 0.105 +
        Math.sin(x * 0.09) * 0.8 +
        Math.cos(z * 0.11) * 0.5,
      h = 3 + rand() * 6,
      w = 5 + rand(),
      d = 4.8 + rand(),
      m = Math.floor(rand() * 5);
    dmy.position.set(x, base + h / 2, z);
    dmy.scale.set(w, h, d);
    dmy.rotation.y = 0;
    dmy.updateMatrix();
    cubes[m].setMatrixAt(counts[m]++, dmy.matrix);
    const roof = base + h;
    // Raised roof parapets, dark inset windows and cobalt shutters.
    [
      [w, 0.4, 0.18, 0, 0, -d / 2],
      [w, 0.4, 0.18, 0, 0, d / 2],
      [0.18, 0.4, d, -w / 2, 0, 0],
      [0.18, 0.4, d, w / 2, 0, 0],
    ].forEach((v) =>
      details.push({
        p: [x + v[3], roof + 0.2, z + v[5]],
        s: v.slice(0, 3),
        m: 0,
      }),
    );
    for (let floor = 1.3; floor < h - 1; floor += 2)
      for (let sx of [-1.2, 1.2]) {
        let mm = rand() > 0.6 ? 2 : 1;
        for (let side of [-1, 1])
          details.push({
            p: [x + sx, base + floor, z + side * (d / 2 + 0.025)],
            s: [0.7, 1.05, 0.07],
            m: mm,
          });
      }
    if (rand() > 0.75) {
      box(w * 0.5, 1.7, d * 0.45, white, x - 0.7, roof + 0.85, z - 0.7);
      box(w * 0.55, 0.15, d * 0.5, terra, x - 0.7, roof + 1.77, z - 0.7);
    } else if (rand() > 0.65) {
      for (let dx of [-1.6, 1.6])
        box(0.1, 1.8, 0.1, stone, x + dx, roof + 0.9, z);
      for (let dz = -1.4; dz <= 1.5; dz += 0.35)
        box(3.5, 0.1, 0.12, stone, x, roof + 1.8, z + dz);
    }
  });
  cubes.forEach((c, i) => {
    c.count = counts[i];
    c.instanceMatrix.needsUpdate = true;
  });
  [white, dark, blue].forEach((m, n) => {
    let list = details.filter((d) => d.m === n),
      o = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), m, list.length);
    list.forEach((e, i) => {
      dmy.position.set(...e.p);
      dmy.scale.set(...e.s);
      dmy.updateMatrix();
      o.setMatrixAt(i, dmy.matrix);
    });
    o.castShadow = o.receiveShadow = true;
    scene.add(o);
  });
  function arch(w, h, depth, m, x, y, z) {
    const s = new T.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(w / 2, h);
    s.lineTo(-w / 2, h);
    s.closePath();
    const hole = new T.Path();
    let rr = w * 0.34,
      base = h * 0.52;
    hole.moveTo(-rr, 0);
    hole.lineTo(-rr, base);
    hole.absarc(0, base, rr, Math.PI, 0, true);
    hole.lineTo(rr, 0);
    hole.closePath();
    s.holes.push(hole);
    return mesh(
      new T.ExtrudeGeometry(s, {
        depth,
        bevelEnabled: false,
        curveSegments: 20,
      }),
      m,
      [x, y, z],
    );
  }
  function door(x, y, z, w = 1.2, h = 2.5) {
    box(w + 0.28, h + 0.2, 0.14, cream, x, y + h / 2, z - 0.03);
    box(w, h, 0.16, blue, x, y + h / 2, z + 0.05);
    for (let i = -2; i <= 2; i++)
      box(0.025, h, 0.04, dark, x + (i * w) / 5, y + h / 2, z + 0.15);
    for (let yy of [0.65, 1.8])
      for (let xx of [-0.3, 0.3])
        cylinder(0.025, 0.025, 0.04, gold, x + xx, y + yy, z + 0.2).rotation.x =
          Math.PI / 2;
  }
  function pot(x, y, z, scale = 1) {
    cylinder(
      0.35 * scale,
      0.24 * scale,
      0.7 * scale,
      terra,
      x,
      y + 0.35 * scale,
      z,
    );
    cylinder(
      0.38 * scale,
      0.38 * scale,
      0.08 * scale,
      terra,
      x,
      y + 0.7 * scale,
      z,
    );
    cylinder(0.035, 0.045, 0.7 * scale, stone, x, y + 0.9 * scale, z);
    for (let i = 0; i < 9; i++) {
      let l = mesh(new T.SphereGeometry(0.29, 9, 7), leaf, [
        x + Math.sin(i * 2.4) * 0.34 * scale,
        y + (1.1 + Math.sin(i) * 0.25) * scale,
        z + Math.cos(i * 2.4) * 0.34 * scale,
      ]);
      l.scale.set(scale, 0.7 * scale, scale);
    }
  }
  const tileCanvas = document.createElement("canvas");
  tileCanvas.width = tileCanvas.height = 256;
  let tc = tileCanvas.getContext("2d");
  tc.fillStyle = "#e9d9b7";
  tc.fillRect(0, 0, 256, 256);
  function star(cx, cy, rad, color) {
    tc.beginPath();
    for (let k = 0; k < 16; k++) {
      let a = (k * Math.PI) / 8,
        rr = k % 2 ? rad * 0.62 : rad;
      let x = cx + Math.cos(a) * rr,
        y = cy + Math.sin(a) * rr;
      k ? tc.lineTo(x, y) : tc.moveTo(x, y);
    }
    tc.closePath();
    tc.fillStyle = color;
    tc.fill();
    tc.strokeStyle = "#b7a482";
    tc.lineWidth = 1.5;
    tc.stroke();
  }
  for (let y = 0; y <= 256; y += 128)
    for (let x = 0; x <= 256; x += 128) {
      star(x, y, 57, "#19556c");
      star(x + 64, y + 64, 35, "#fff1cd");
    }
  const tileMap = new T.CanvasTexture(tileCanvas);
  tileMap.colorSpace = T.SRGBColorSpace;
  tileMap.wrapS = tileMap.wrapT = T.RepeatWrapping;
  tileMap.anisotropy = r.capabilities.getMaxAnisotropy();
  function tilePatio(x, y, z, w, d) {
    box(w, 0.4, d, cream, x, y - 0.2, z);
    let map = tileMap.clone();
    map.repeat.set(w / 3, d / 3);
    map.needsUpdate = true;
    let m = new T.MeshStandardMaterial({
      map,
      roughness: 0.64,
      color: "#ffffff",
    });
    let o = mesh(new T.PlaneGeometry(w, d), m, [x, y + 0.015, z]);
    o.rotation.x = -Math.PI / 2;
  }
  // The foreground terrace: patterned ceramics, low walls, an open doorway and a linen canopy.
  tilePatio(4, 17, 28, 15, 16);
  box(15, 1, 0.4, white, 4, 17.5, 20);
  box(0.4, 1, 16, white, -3.5, 17.5, 28);
  box(0.4, 1, 16, white, 11.5, 17.5, 28);
  box(7, 6, 4, white, 10, 20, 36);
  door(9, 17, 38.08, 1.6, 3);
  pot(-2, 17, 23, 1.3);
  pot(10, 17, 22);
  box(4, 0.15, 2, terra, 2, 17.7, 30);
  for (let xx of [0.3, 3.7])
    for (let zz of [29.3, 30.7]) box(0.12, 0.8, 0.12, dark, xx, 17.3, zz);
  cylinder(0.27, 0.3, 0.35, gold, 2, 18, 30);
  cylinder(0.12, 0.12, 0.2, green, 1.4, 17.9, 30);
  for (let xx of [-2, 7]) {
    box(0.12, 4, 0.12, stone, xx, 19, 32);
    box(0.12, 4, 0.12, stone, xx, 19, 39);
  }
  box(9.3, 0.06, 7.2, cream, 2.5, 21.05, 35.5);
  // A square minaret-inspired tower. Deliberately not labelled as a particular mosque.
  box(3.6, 17, 3.6, white, -14, 16, -4);
  box(4, 0.5, 4, green, -14, 24.5, -4);
  box(2, 3, 2, white, -14, 26, -4);
  box(2.3, 0.35, 2.3, green, -14, 27.6, -4);
  mesh(new T.ConeGeometry(1.65, 1, 4), green, [-14, 28.2, -4]).rotation.y =
    Math.PI / 4;
  cylinder(0.055, 0.055, 1.6, gold, -14, 29.3, -4);
  for (let yy of [15, 19, 22])
    for (let xx of [-0.8, 0.8]) box(0.45, 1.4, 0.08, dark, -14 + xx, yy, -2.16);
  box(3.7, 0.7, 3.7, blue, -14, 22.8, -4);
  const medinaStart = scene.children.length;
  const cityObjects = scene.children.slice(cityStart, medinaStart);
  // An intimate passage is built away from the overview to give every viewpoint its own best angle.
  box(34, 3, 90, stone, 85, 1.5, 5);
  box(12, 0.5, 72, stone, 85, 2.75, 4);
  arch(7, 8, 1.1, white, 85, 3, 34);
  box(7, 9, 1, white, 85, 7.5, 44);
  door(85, 3, 43.4, 1.8, 3.1);
  for (let side of [-1, 1]) {
    for (let j = -2; j < 5; j++) {
      let z = 14 - j * 8,
        y = 3;
      box(4, 9 + (j % 2), 7.8, white, 85 + side * 5.2, y + 4.5, z);
      box(0.1, 1.4, 7.8, blue, 85 + side * 3.15, y + 0.7, z);
      box(0.2, 0.2, 7.8, cream, 85 + side * 3.1, 10.9, z);
      for (let zz = z - 3; zz < z + 3; zz += 1.1)
        box(0.18, 0.08, 0.65, stone, 85 + side * 3.05, 11, zz);
    }
  }
  for (let j = 0; j < 15; j++)
    box(6, 0.12, 0.12, cream, 85, 3.02, 23 - j * 3.3);
  arch(7, 8, 1.1, white, 85, 3, -3);
  arch(7.4, 8.3, 0.2, cream, 85, 3, -2.85);
  box(6.4, 8, 1, white, 85, 7, -13);
  door(85, 3, -12.45, 1.8, 3.1);
  door(88.12, 3, 14, 1.3, 2.8);
  pot(82.4, 3, 9, 0.9);
  pot(87.5, 3, -0.4, 0.8);
  box(4.4, 0.035, 5, terra, 85, 3.04, 4);
  for (let z = 2; z <= 6; z += 0.6) box(3.9, 0.01, 0.08, gold, 85, 3.07, z);
  for (let x of [82, 88]) {
    box(0.12, 4, 0.12, dark, x, 8, 1);
    let lantern = box(0.4, 0.7, 0.4, gold, x, 7.4, 1);
    lantern.material = new T.MeshStandardMaterial({
      color: "#e9aa4e",
      emissive: "#a45213",
      emissiveIntensity: 0.4,
    });
  }
  box(6.4, 0.08, 3, cream, 85, 10.6, 6);
  const medinaObjects = scene.children.slice(medinaStart);
  const outerStart = scene.children.length;
  // Kasbah-inspired belvedere. Framing arches are true holes in extruded stone.
  tilePatio(-65, 14, 10, 18, 44);
  box(7, 8.5, 1, stone, -71.5, 18.25, 30);
  box(7, 8.5, 1, stone, -58.5, 18.25, 30);
  arch(6, 8.5, 1, stone, -65, 14, 30);
  for (let xx of [-71, -58]) {
    box(4, 0.4, 1, cream, xx, 14.8, 27);
    pot(xx, 14, 23, 1.4);
  }
  for (let x of [-72, -65, -58]) arch(7, 8, 1.2, stone, x, 14, -3);
  box(21, 1.2, 1.4, cream, -65, 22.5, -2.5);
  for (let x = -75; x <= -55; x += 1.1)
    box(0.65, 0.8, 1.3, cream, x, 23.4, -2.5);
  box(0.5, 1, 24, stone, -74, 14.5, 8);
  box(0.5, 1, 24, stone, -56, 14.5, 8);
  pot(-72, 14, 3, 1.5);
  pot(-58, 14, 4, 1.1);
  box(4, 0.6, 1.3, stone, -70, 14.3, 13);
  // Sea terrace and distant coast. The coast is a suggestion, never a plotted outline.
  tilePatio(0, 3, -61, 23, 12);
  box(23, 0.7, 0.5, white, 0, 3.35, -67);
  for (let x of [-11.5, 11.5]) box(0.5, 0.7, 12, white, x, 3.35, -61);
  pot(-9, 3, -65, 1.1);
  box(23, 1.9, 4, stone, 0, 1, -61);
  const outerObjects = scene.children.slice(outerStart);
  const landGeo = new T.PlaneGeometry(2000, 32, 160, 2);
  const la = landGeo.attributes.position;
  for (let i = 0; i < la.count; i++) {
    let x = la.getX(i);
    la.setY(
      i,
      la.getY(i) > 0
        ? 8 + 10 * Math.sin(x * 0.012) ** 2 + 4 * Math.sin(x * 0.06)
        : 0,
    );
  }
  landGeo.computeVertexNormals();
  mesh(landGeo, mat("#849da4"), [0, 0, -450]);
  function boat(x, z, s) {
    let g = new T.Group();
    scene.add(g);
    g.position.set(x, 0.5, z);
    g.scale.setScalar(s);
    let footprint = new T.Shape();
    footprint.moveTo(-4, -0.85);
    footprint.lineTo(2.5, -0.85);
    footprint.lineTo(4, 0);
    footprint.lineTo(2.5, 0.85);
    footprint.lineTo(-4, 0.85);
    footprint.closePath();
    let hull = mesh(
      new T.ExtrudeGeometry(footprint, {
        depth: 0.8,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.08,
        bevelThickness: 0.08,
      }),
      white,
      [0, 0.55, 0],
      g,
    );
    hull.rotation.x = Math.PI / 2;
    box(6, 0.14, 1.8, dark, -0.4, 0.66, 0, g);
    box(4.4, 0.65, 1.25, white, -0.3, 1.05, 0, g);
    for (let xx = -2; xx <= 1.5; xx += 0.45) {
      box(0.27, 0.3, 0.03, blue, xx, 1.15, 0.645, g);
      box(0.27, 0.3, 0.03, blue, xx, 1.15, -0.645, g);
    }
    box(2, 0.65, 1.05, white, 1, 1.6, 0, g);
    box(1.9, 0.26, 1.08, dark, 1, 1.68, 0, g);
    box(2.2, 0.13, 1.3, white, 1, 1.97, 0, g);
    box(0.4, 1, 0.4, terra, -1, 1.8, 0, g);
    for (let xx = -3.5; xx <= 3; xx += 0.5) {
      box(0.025, 0.4, 0.025, white, xx, 0.95, -0.8, g);
      box(0.025, 0.4, 0.025, white, xx, 0.95, 0.8, g);
    }
    box(6.5, 0.04, 0.04, white, -0.3, 1.15, 0.8, g);
    box(6.5, 0.04, 0.04, white, -0.3, 1.15, -0.8, g);
    return g;
  }
  let ferry = boat(0, -114, 1.8);
  boat(34, -82, 0.55);
  boat(-42, -73, 0.35);
  const gulls = [];
  for (let i = 0; i < 9; i++) {
    const g = new T.Group(),
      lineMat = new T.LineBasicMaterial({ color: "#f6ebcf" });
    let points = [
      [-0.8, -0.15, 0],
      [-0.4, 0.12, 0],
      [0, 0, 0],
      [0.4, 0.12, 0],
      [0.8, -0.15, 0],
    ].map((p) => new T.Vector3(...p));
    g.add(new T.Line(new T.BufferGeometry().setFromPoints(points), lineMat));
    scene.add(g);
    gulls.push(g);
  }
  let ch = 0,
    yaw = 0,
    pitch = 0,
    entryYaw = 0,
    entryPitch = 0,
    paused = matchMedia("(prefers-reduced-motion:reduce)").matches,
    drag = null,
    raf,
    time = 0,
    last = 0,
    dirty = true,
    disposed = false,
    ctx;
  const scape=createSoundscape(SOUND_PLACES);
  function chapter(i) {
    ch = i;
    scape.setPlace(i);
    cityObjects.forEach((o) => (o.visible = i !== 1));
    outerObjects.forEach((o) => (o.visible = i !== 1));
    medinaObjects.forEach((o) => (o.visible = i === 1));
    camera.position.fromArray(chapters[ch].eye);
    let v = new T.Vector3(...chapters[ch].target).sub(camera.position);
    entryYaw = Math.atan2(v.x, -v.z);
    entryPitch = Math.atan2(v.y, Math.hypot(v.x, v.z));
    reset();
    document.body.dataset.chapter = i;
  }
  function reset() {
    drag = null;
    yaw = entryYaw;
    pitch = entryPitch;
    dirty = true;
  }
  function resize() {
    r.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.fov = innerWidth < 600 ? 63 : 53;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  function frame(ms) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    let dt = Math.min((ms - last) / 1000, 0.05) || 0;
    last = ms;
    if (!paused) {
      time += dt;
      dirty = true;
    }
    if (!dirty) return;
    dirty = false;
    seaM.uniforms.time.value = time;
    ferry.position.x = Math.sin(time * 0.03) * 16;
    gulls.forEach((g, i) => {
      g.position.set(
        Math.sin(time * 0.06 + i) * 35,
        26 + Math.sin(i * 2) * 5,
        Math.cos(time * 0.06 + i) * 32 - 16,
      );
      g.rotation.y = time * 0.06 + i;
      g.rotation.z = Math.sin(time * 1.8 + i) * 0.08;
    });
    camera.lookAt(
      camera.position
        .clone()
        .add(
          new T.Vector3(
            Math.sin(yaw) * Math.cos(pitch),
            Math.sin(pitch),
            -Math.cos(yaw) * Math.cos(pitch),
          ),
        ),
    );
    canvas.dataset.yaw = yaw;
    canvas.dataset.pitch = pitch;
    canvas.dataset.entryYaw = entryYaw;
    canvas.dataset.entryPitch = entryPitch;
    r.render(scene, camera);
    canvas.dataset.frames = +(canvas.dataset.frames || 0) + 1;
  }
  const down = (e) => {
      drag = [e.clientX, e.clientY, yaw, pitch];
      canvas.setPointerCapture(e.pointerId);
    },
    move = (e) => {
      if (!drag) return;
      yaw = drag[2] - (e.clientX - drag[0]) * 0.005;
      pitch = T.MathUtils.clamp(
        drag[3] + (e.clientY - drag[1]) * 0.004,
        -1.2,
        1.2,
      );
      dirty = true;
    },
    up = () => {
      drag = null;
    },
    key = (e) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
          e.key,
        )
      )
        return;
      e.preventDefault();
      if (e.key === "Home") return reset();
      yaw += e.key === "ArrowLeft" ? 0.12 : e.key === "ArrowRight" ? -0.12 : 0;
      pitch = T.MathUtils.clamp(
        pitch +
          (e.key === "ArrowUp" ? 0.08 : e.key === "ArrowDown" ? -0.08 : 0),
        -1.2,
        1.2,
      );
      dirty = true;
    };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("keydown", key);
  addEventListener("resize", resize);
  const visibility = () => {
    if (document.hidden) ctx?.suspend();
    else if (scape.state.on) ctx?.resume();
  };
  document.addEventListener("visibilitychange", visibility);
  async function sound(on) {
    if(on===scape.state.on)return;
    scape.toggle(ch);
    ctx=scape.state.ctx;
    if(ctx){
      const capture=ctx.createMediaStreamDestination();
      scape.state.gain.connect(capture);
      window.__tangierAudio={ctx,stream:capture.stream};
      await ctx.resume();
    }
  }
  chapter(0);
  resize();
  raf = requestAnimationFrame(frame);
  return {
    chapter,
    reset,
    pause(v) {
      paused = v;
      dirty = true;
    },
    sound,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("keydown", key);
      if(scape.state.on)scape.toggle(ch);
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(
            (m) => {
              m.map?.dispose();
              m.dispose();
            },
          );
        }
      });
      r.dispose();
    },
  };
}
