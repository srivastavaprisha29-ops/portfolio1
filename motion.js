const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");

if (!reducedMotion.matches) {
  hero.classList.add("typing");
  hero.addEventListener("animationend", (event) => {
    if (event.animationName === "cursor") hero.classList.remove("typing");
  });
}

function line(ctx, points, color = "#969696", width = 1) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function polygon(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function label(ctx, text, x, y, size = 15) {
  ctx.font = `500 ${size}px monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#dedede";
  ctx.fillText(text, x, y);
}

function node(ctx, x, y, radius, fill = "#c7c7c7") {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

const scenes = {
  adaptive(ctx, t) {
    const labels = ["RESNET-18", "512D / 128D", "FP32 / INT8", "RIDGE HEAD"];
    for (let group = 0; group < labels.length; group++) {
      const x = 112 + group * 181;
      for (let layer = 0; layer < 5 - group; layer++) {
        const offset = layer * (9 + 10 * t);
        polygon(ctx, [[x - 54 + offset, 163 - offset], [x + offset, 132 - offset], [x + 56 + offset, 163 - offset], [x + offset, 194 - offset]], ["#303030", "#424242", "#555", "#686868", "#777"][layer]);
      }
      label(ctx, labels[group], x + 12, 256);
      if (group < labels.length - 1) {
        line(ctx, [[x + 67, 166], [x + 121, 166]]);
        node(ctx, x + 72 + 45 * t, 166, 4);
      }
    }
  },
  apex(ctx, t) {
    const separation = 26 + 41 * t;
    polygon(ctx, [[309, 188], [359, 99], [478, 98], [538, 148], [483, 198], [340, 216]], "#424242");
    polygon(ctx, [[360, 183], [393, 119], [457, 117], [484, 149], [449, 180]], "#727272");
    polygon(ctx, [[487, 136], [619, 138], [657, 151], [617, 164], [501, 166]], "#8b8b8b");
    polygon(ctx, [[272, 147], [329, 151], [341, 181], [267, 180]], "#5c5c5c");
    const wheels = [[345, 145 - separation], [345, 180 + separation], [553, 136 - separation], [553, 170 + separation]];
    wheels.forEach(([x, y], i) => {
      line(ctx, [[x, i % 2 ? 187 : 138], [x, y]], "#a4a4a4", 2);
      polygon(ctx, [[x - 32, y - 16], [x + 26, y - 16], [x + 33, y + 13], [x - 25, y + 13]], "#252525");
      line(ctx, [[x - 22, y - 7], [x + 22, y - 7]], "#717171", 2);
    });
    label(ctx, "EXPLODED ASSEMBLY", 144, 260);
    line(ctx, [[90, 239], [217, 239], [268, 178]], "#868686");
  },
  subnet(ctx, t) {
    const octets = ["11000000", "10101000", "00000001", "00001010"];
    octets.forEach((octet, i) => {
      const x = 65 + i * 174 + (i === 3 ? 24 * t : 0);
      [...octet].forEach((bit, j) => {
        const left = x + j * 18;
        ctx.fillStyle = i < 3 ? "#c8c8c8" : "#4a4a4a";
        ctx.fillRect(left, 126, 16, 56);
        ctx.fillStyle = i < 3 ? "#171717" : "#f1f1f1";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText(bit, left + 8, 159);
      });
    });
    const edge = 574 + 12 * t;
    line(ctx, [[edge, 101], [edge, 201]], "#f0f0f0", 2);
    label(ctx, "24 NETWORK BITS", 309, 222);
    label(ctx, "8 HOST BITS", 656 + 24 * t, 222);
    label(ctx, "192.168.1.10 / 24", 400, 81, 21);
  },
  bridge(ctx, t) {
    const lift = 18 + 37 * t;
    for (let i = 0; i < 4; i++) {
      const x = 143 + i * 57;
      const y = 201 - i * 15;
      polygon(ctx, [[x, y], [x + 394, y], [x + 394, y + 25], [x, y + 25]], i % 2 ? "#5b5b5b" : "#444");
      for (let j = 0; j < 7; j++) {
        const vx = x + 18 + j * 59;
        line(ctx, [[vx, y + 2], [vx + 17, y + 23]], "#777");
      }
      line(ctx, [[x, y], [x, y - lift]], "#777");
    }
    polygon(ctx, [[143, 201 - lift], [537, 201 - lift], [708, 156 - lift], [314, 156 - lift]], "#5f5f5f");
    line(ctx, [[143, 240], [537, 240]], "#a0a0a0");
    line(ctx, [[143, 233], [143, 247]], "#a0a0a0");
    line(ctx, [[537, 233], [537, 247]], "#a0a0a0");
    label(ctx, "PLATE-GIRDER SPAN", 340, 264);
  },
  cyber(ctx, t) {
    const spread = 25 * t;
    const points = [
      [400, 159, "IDENTITY"], [196 - spread, 82, "USERNAME"], [164 - spread, 225, "PUBLIC PROFILE"],
      [617 + spread, 78, "EMAIL"], [640 + spread, 219, "EXPOSURE SIGNAL"]
    ];
    for (const [from, to] of [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [3, 4]]) {
      const a = points[from].slice(0, 2);
      const b = points[to].slice(0, 2);
      line(ctx, [a, b], from === 0 ? "#b0b0b0" : "#686868");
      node(ctx, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 3);
    }
    points.forEach(([x, y, name], i) => {
      node(ctx, x, y, i === 0 ? 17 : 10, i === 0 ? "#ededed" : "#969696");
      label(ctx, name, x, y + 38);
    });
  }
};

const visuals = Array.from(document.querySelectorAll("[data-scene]"), (figure) => {
  const canvas = figure.querySelector("canvas");
  return { canvas, ctx: canvas.getContext("2d"), draw: scenes[figure.dataset.scene] };
}).filter(({ ctx }) => ctx);

let pending = false;

function render() {
  pending = false;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  for (const { canvas, ctx, draw } of visuals) {
    const { top, bottom, width, height } = canvas.getBoundingClientRect();
    if (!width || !height || bottom < 0 || top > innerHeight) continue;
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const progress = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * .78)));
    const t = reducedMotion.matches ? .65 : progress * progress * (3 - 2 * progress);
    const scale = Math.min(width / 815, height / 320);
    ctx.translate((width - 800 * scale) / 2, (height - 320 * scale) / 2 + (reducedMotion.matches ? 0 : 24 * (1 - t)));
    ctx.scale(scale, scale);
    draw(ctx, t);
  }
}

function scheduleRender() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(render);
}

addEventListener("scroll", scheduleRender, { passive: true });
addEventListener("resize", scheduleRender);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) hero.classList.remove("typing");
  scheduleRender();
});
scheduleRender();
