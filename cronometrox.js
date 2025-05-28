// Variables del cronometro
let startTime = 0;     // Cuando arranco o reanudo
let elapsed = 0;       // Tiempo total corrido
let lastLapTime = 0;   // Marca cuando fue la ultima vuelta
let timerInterval;     // Guarda el setInterval

// agarramos los elementos del DOM
const display = document.getElementById('display');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const startStopBtn = document.getElementById('startStopBtn');
const lapsList = document.getElementById('laps');
let laps = [];         // Array de duraciones de vueltas

// Funcion para formatear mm:ss.hh y mostrarlo
function updateDisplay(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const hundredths = Math.floor((time % 1000) / 10);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const hs = String(hundredths).padStart(2, '0');
  display.textContent = `${mm}:${ss}.${hs}`;
}

// Cada 10ms actualizamos el display
function tick() {
  elapsed = Date.now() - startTime;
  updateDisplay(elapsed);
}

// Registramos una vuelta: tiempo actual menos tiempo de la ultima vuelta
function recordLap() {
  const lapDuration = elapsed - lastLapTime;
  laps.push(lapDuration);
  lastLapTime = elapsed;
  renderLaps();
}

// Boton iniciar/detener
startStopBtn.addEventListener('click', () => {
  if (!timerInterval) {
    // Arranca o reanuda: ajusta startTime para que siga desde donde ibas
    startTime = Date.now() - elapsed;
    timerInterval = setInterval(tick, 10);
    startStopBtn.textContent = 'Detener';
    startStopBtn.classList.add('stop');
    lapBtn.disabled = false;
    resetBtn.disabled = true;
  } else {
    // Para el cronometro
    clearInterval(timerInterval);
    timerInterval = null;
    startStopBtn.textContent = 'Iniciar';
    startStopBtn.classList.remove('stop');
    lapBtn.disabled = true;
    if (elapsed > 0) resetBtn.disabled = false;
  }
});

// Evento para marcar vuelta
lapBtn.addEventListener('click', recordLap);

// Evento para reiniciar todo
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsed = 0;
  lastLapTime = 0;
  updateDisplay(elapsed);
  laps = [];
  renderLaps();
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  startStopBtn.textContent = 'Iniciar';
  startStopBtn.classList.remove('stop');
});

// Mostramos las vueltas en la lista, la mas rapida en verde y la mas lenta en rojo
function renderLaps() {
  lapsList.innerHTML = '';
  if (!laps.length) return;
  const fastest = Math.min(...laps);
  const slowest = Math.max(...laps);
  laps.slice().reverse().forEach((lapTime, idx) => {
    const num = laps.length - idx;
    const li = document.createElement('li');
    if (lapTime === fastest) li.classList.add('fastest');
    if (lapTime === slowest) li.classList.add('slowest');
    const spanNum = document.createElement('span');
    spanNum.textContent = `Vuelta ${num}`;
    const spanTime = document.createElement('span');
    const mm = String(Math.floor(lapTime / 60000)).padStart(2,'0');
    const ss = String(Math.floor((lapTime % 60000)/1000)).padStart(2,'0');
    const hs = String(Math.floor((lapTime % 1000)/10)).padStart(2,'0');
    spanTime.textContent = `${mm}:${ss}.${hs}`;
    li.append(spanNum, spanTime);
    lapsList.appendChild(li);
  });
}
