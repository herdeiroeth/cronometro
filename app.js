(function () {
  "use strict";

  const timeEl = document.getElementById("time");
  const startPauseBtn = document.getElementById("startPause");
  const lapBtn = document.getElementById("lap");
  const resetBtn = document.getElementById("reset");
  const lapsEl = document.getElementById("laps");

  let startTime = 0;   // referência de performance.now() no último start
  let elapsed = 0;     // ms acumulados enquanto pausado
  let rafId = null;
  let running = false;
  let lapCount = 0;
  let lastLapTime = 0;

  function format(ms) {
    const totalCs = Math.floor(ms / 10); // centésimos de segundo
    const cs = totalCs % 100;
    const totalSeconds = Math.floor(totalCs / 100);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    const pad = (n) => String(n).padStart(2, "0");
    const base = `${pad(minutes)}:${pad(seconds)}.${pad(cs)}`;
    return hours > 0 ? `${pad(hours)}:${base}` : base;
  }

  function currentElapsed() {
    return running ? elapsed + (performance.now() - startTime) : elapsed;
  }

  function tick() {
    timeEl.textContent = format(currentElapsed());
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    running = true;
    startTime = performance.now();
    rafId = requestAnimationFrame(tick);
    startPauseBtn.textContent = "Pausar";
    startPauseBtn.classList.add("running");
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function pause() {
    running = false;
    elapsed += performance.now() - startTime;
    cancelAnimationFrame(rafId);
    timeEl.textContent = format(elapsed);
    startPauseBtn.textContent = "Continuar";
    startPauseBtn.classList.remove("running");
  }

  function reset() {
    running = false;
    cancelAnimationFrame(rafId);
    elapsed = 0;
    lapCount = 0;
    lastLapTime = 0;
    timeEl.textContent = format(0);
    startPauseBtn.textContent = "Iniciar";
    startPauseBtn.classList.remove("running");
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    lapsEl.innerHTML = "";
  }

  function addLap() {
    const total = currentElapsed();
    const split = total - lastLapTime;
    lastLapTime = total;
    lapCount++;

    const li = document.createElement("li");
    li.dataset.split = String(split);
    const label = document.createElement("span");
    label.textContent = `Volta ${lapCount}`;
    const value = document.createElement("span");
    value.textContent = `${format(split)}  (${format(total)})`;
    li.append(label, value);
    lapsEl.prepend(li);

    highlightBestWorst();
  }

  function highlightBestWorst() {
    const items = Array.from(lapsEl.children);
    items.forEach((li) => li.classList.remove("best", "worst"));
    if (items.length < 2) return;

    const splits = items.map((li) => parseFloat(li.dataset.split));
    let minIdx = 0, maxIdx = 0;
    splits.forEach((v, i) => {
      if (v < splits[minIdx]) minIdx = i;
      if (v > splits[maxIdx]) maxIdx = i;
    });
    items[minIdx].classList.add("best");
    items[maxIdx].classList.add("worst");
  }

  startPauseBtn.addEventListener("click", () => (running ? pause() : start()));
  lapBtn.addEventListener("click", addLap);
  resetBtn.addEventListener("click", reset);

  // Atalhos de teclado: Espaço = iniciar/pausar, L = volta, R = zerar
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      running ? pause() : start();
    } else if (e.key.toLowerCase() === "l" && !lapBtn.disabled) {
      addLap();
    } else if (e.key.toLowerCase() === "r" && !resetBtn.disabled) {
      reset();
    }
  });

  timeEl.textContent = format(0);
})();
