const settingsBtn = document.getElementById('settingsBtn');
const dropdown = document.getElementById('dropdown');

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !settingsBtn.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// FPS COUNTER
const fpsToggle = document.getElementById('fpsToggle');
const fpsCounter = document.getElementById('fpsCounter');

let lastTime = performance.now();
let frames = 0;
let fps = 0;
let fpsEnabled = false;

fpsToggle.addEventListener('change', (e) => {
    fpsEnabled = e.target.checked;
    fpsCounter.style.display = fpsEnabled ? 'block' : 'none';
    
    if (fpsEnabled) {
        lastTime = performance.now();
        frames = 0;
    }
});

function updateFPS() {
    if (fpsEnabled) {
        frames++;
        const currentTime = performance.now();
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frames * 1000) / (currentTime - lastTime));
            fpsCounter.textContent = `${fps} FPS`;
            frames = 0;
            lastTime = currentTime;
        }
    }
}

window.fpsEnabled = () => fpsEnabled;
window.updateFPS = updateFPS;