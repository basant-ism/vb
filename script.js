const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const cta = document.getElementById("cta");
const result = document.getElementById("result");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const defaultNoPos = { x: 75, y: 50 };
let lastNoPos = { ...defaultNoPos };

const getButtonBounds = () => {
  const ctaRect = cta.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  return {
    maxX: ctaRect.width - noRect.width / 2,
    minX: noRect.width / 2,
    maxY: ctaRect.height - noRect.height / 2,
    minY: noRect.height / 2,
  };
};

const moveNoButton = () => {
  const yesRect = yesBtn.getBoundingClientRect();
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;
  const bounds = getButtonBounds();
  const minDistance = Math.max(yesRect.width, yesRect.height) * 1.2;

  let nextX = defaultNoPos.x;
  let nextY = defaultNoPos.y;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const randX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    const randY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

    const candidateX = (randX / cta.clientWidth) * 100;
    const candidateY = (randY / cta.clientHeight) * 100;

    const noCenterX = cta.getBoundingClientRect().left + randX;
    const noCenterY = cta.getBoundingClientRect().top + randY;
    const distance = Math.hypot(noCenterX - yesCenterX, noCenterY - yesCenterY);

    if (distance >= minDistance) {
      nextX = candidateX;
      nextY = candidateY;
      break;
    }
  }

  nextX = clamp(nextX, (bounds.minX / cta.clientWidth) * 100, (bounds.maxX / cta.clientWidth) * 100);
  nextY = clamp(nextY, (bounds.minY / cta.clientHeight) * 100, (bounds.maxY / cta.clientHeight) * 100);

  noBtn.style.left = `${nextX}%`;
  noBtn.style.top = `${nextY}%`;
  yesBtn.style.left = `${lastNoPos.x}%`;
  yesBtn.style.top = `${lastNoPos.y}%`;
  lastNoPos = { x: nextX, y: nextY };
};

const handleDodge = (event) => {
  event.preventDefault();
  moveNoButton();
};

noBtn.addEventListener("mouseenter", handleDodge);
noBtn.addEventListener("click", handleDodge);
noBtn.addEventListener("touchstart", handleDodge, { passive: false });

const handlePointerMove = (event) => {
  const noRect = noBtn.getBoundingClientRect();
  const pointerX = event.touches ? event.touches[0].clientX : event.clientX;
  const pointerY = event.touches ? event.touches[0].clientY : event.clientY;

  const distance = Math.hypot(
    pointerX - (noRect.left + noRect.width / 2),
    pointerY - (noRect.top + noRect.height / 2)
  );

  if (distance < Math.max(noRect.width, noRect.height)) {
    moveNoButton();
  }
};

cta.addEventListener("touchmove", handlePointerMove, { passive: true });
cta.addEventListener("mousemove", handlePointerMove);

yesBtn.addEventListener("click", () => {
  result.textContent = "You made me the happiest. Thank you, Vandana.";
  yesBtn.disabled = true;
  noBtn.disabled = true;
  yesBtn.style.cursor = "default";
  noBtn.style.cursor = "default";
  noBtn.style.opacity = "0.4";
});

window.addEventListener("load", () => {
  noBtn.style.left = `${defaultNoPos.x}%`;
  noBtn.style.top = `${defaultNoPos.y}%`;
  yesBtn.style.left = "50%";
  yesBtn.style.top = "50%";
  lastNoPos = { ...defaultNoPos };
});
