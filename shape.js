const input = document.getElementById('input');
const intro = document.querySelector('.intro');
const box = document.querySelector('.box');
const main = document.querySelector('.main');
const canvas = document.querySelector('.canvas');

let hasStartedTyping = false;
let resizeTimeout;
let lastScrollHeight = 50;
let emotionMixer;

if (typeof EmotionMixer !== 'undefined') {
    emotionMixer = new EmotionMixer(emotions);
}

// TYPING FLOW AGITATION
class TypingFlowController {
    constructor() {
        this.baseSpeedMultiplier = 1.0;
        this.targetSpeedMultiplier = 1.0;
        this.currentSpeedMultiplier = 1.0;
        
        this.baseSpawnMultiplier = 1.0;
        this.targetSpawnMultiplier = 1.0;
        this.currentSpawnMultiplier = 1.0;
        
        this.decayRate = 0.995;
        this.smoothing = 0.08;
        
        this.lastKeystrokeTime = 0;
        this.keystrokeDecayTime = 200;
    }
    
    onKeystroke() {
        this.lastKeystrokeTime = Date.now();
        this.targetSpeedMultiplier = 1.5;
        this.targetSpawnMultiplier = 2;
    }
    
    update() {
        const now = Date.now();
        const timeSinceKeystroke = now - this.lastKeystrokeTime;
        
        if (timeSinceKeystroke > this.keystrokeDecayTime) {
            this.targetSpeedMultiplier = this.baseSpeedMultiplier;
            this.targetSpawnMultiplier = this.baseSpawnMultiplier;
        }
        
        this.currentSpeedMultiplier += (this.targetSpeedMultiplier - this.currentSpeedMultiplier) * this.smoothing;
        this.currentSpawnMultiplier += (this.targetSpawnMultiplier - this.currentSpawnMultiplier) * this.smoothing;
        
        if (timeSinceKeystroke > this.keystrokeDecayTime) {
            this.targetSpeedMultiplier *= this.decayRate;
            this.targetSpawnMultiplier *= this.decayRate;
            
            if (this.targetSpeedMultiplier < this.baseSpeedMultiplier + 0.01) {
                this.targetSpeedMultiplier = this.baseSpeedMultiplier;
            }
            if (this.targetSpawnMultiplier < this.baseSpawnMultiplier + 0.01) {
                this.targetSpawnMultiplier = this.baseSpawnMultiplier;
            }
        }
    }
    
    getSpeedMultiplier() {
        return this.currentSpeedMultiplier;
    }
    
    getSpawnMultiplier() {
        return this.currentSpawnMultiplier;
    }
}

const typingFlow = new TypingFlowController();

function analyzeText(text) {
    if (emotionMixer) {
        const detectedEmotions = emotionMixer.detectEmotions(text);
        
        return {
            dominant: detectedEmotions[0].data,
            all: detectedEmotions
        };
    } else {

        const lowerText = text.toLowerCase();
        const emotionScores = {};
        
        for (let [emotion, data] of Object.entries(emotions)) {
            data.keywords.forEach(keyword => {
                if (keyword.includes(' ')) {
                    if (lowerText.includes(keyword)) {
                        emotionScores[emotion] = (emotionScores[emotion] || 0) + (data.intensity * 3);
                    }
                }
            });
        }
        
        const words = lowerText
            .replace(/[.,!?;:"'()]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
        
        words.forEach(word => {
            for (let [emotion, data] of Object.entries(emotions)) {
                data.keywords.forEach(keyword => {
                    if (!keyword.includes(' ') && keyword === word) {
                        emotionScores[emotion] = (emotionScores[emotion] || 0) + data.intensity;
                    }
                });
            }
        });
        
        let dominantEmotion = 'neutral';
        let maxScore = 0;
        
        for (let [emotion, score] of Object.entries(emotionScores)) {
            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        }
        
        return {
            dominant: emotions[dominantEmotion],
            all: [{ emotion: dominantEmotion, score: maxScore, data: emotions[dominantEmotion] }]
        };
    }
}

function smoothResize() {
    const maxHeight = 400;
    const minHeight = 50;
    
    input.style.height = 'auto';
    const scrollHeight = input.scrollHeight;
    
    if (Math.abs(scrollHeight - lastScrollHeight) > 5) {
        const targetHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
        input.style.height = targetHeight + 'px';
        lastScrollHeight = scrollHeight;
    } else {
        const targetHeight = Math.max(minHeight, Math.min(lastScrollHeight, maxHeight));
        input.style.height = targetHeight + 'px';
    }
}

input.addEventListener('focus', function() {
    if (!this.textContent || this.textContent.trim() === '') {
        this.textContent = '';
        this.innerHTML = '';
    }
    
    const range = document.createRange();
    const sel = window.getSelection();
    
    if (this.childNodes.length === 0) {
        this.appendChild(document.createTextNode(''));
    }
    
    range.setStart(this.childNodes[0], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
});

input.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const tabSpaces = document.createTextNode('	');
        range.insertNode(tabSpaces);
        
        range.setStartAfter(tabSpaces);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
        typingFlow.onKeystroke();
    }
});

function interpolateColors(colors, phase) {
    if (colors.length === 0) return { r: 200, g: 200, b: 200 };
    if (colors.length === 1) {
        const hex = colors[0].replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }
    
    const scaledPhase = phase * colors.length;
    const index1 = Math.floor(scaledPhase) % colors.length;
    const index2 = (index1 + 1) % colors.length;
    const localPhase = scaledPhase - Math.floor(scaledPhase);

    const hex1 = colors[index1].replace('#', '');
    const hex2 = colors[index2].replace('#', '');
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    return {
        r: Math.round(r1 + (r2 - r1) * localPhase),
        g: Math.round(g1 + (g2 - g1) * localPhase),
        b: Math.round(b1 + (b2 - b1) * localPhase)
    };
}

class PerlinNoise {
    constructor() {
        this.gradients = new Map();
        this.memory = new Map();
    }

    rand_vect() {
        let theta = Math.random() * 6.283185307179586;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }

    dot_prod_grid(x, y, vx, vy) {
        let d_vect = { x: x - vx, y: y - vy };
        let grid_key = `${vx},${vy}`;
        
        let g_vect = this.gradients.get(grid_key);
        if (!g_vect) {
            g_vect = this.rand_vect();
            this.gradients.set(grid_key, g_vect);
        }
        
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    }

    smootherstep(x) {
        return 6 * x * x * x * x * x - 15 * x * x * x * x + 10 * x * x * x;
    }

    interp(x, a, b) {
        return a + this.smootherstep(x) * (b - a);
    }

    get(x, y) {
        let key = `${x},${y}`;
        let cached = this.memory.get(key);
        if (cached !== undefined) {
            return cached;
        }

        let xf = Math.floor(x);
        let yf = Math.floor(y);
        
        let tl = this.dot_prod_grid(x, y, xf, yf);
        let tr = this.dot_prod_grid(x, y, xf + 1, yf);
        let bl = this.dot_prod_grid(x, y, xf, yf + 1);
        let br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
        
        let xt = this.interp(x - xf, tl, tr);
        let xb = this.interp(x - xf, bl, br);
        let v = this.interp(y - yf, xt, xb);
        
        this.memory.set(key, v);
        return v;
    }
    
    clearOldCache() {
        if (this.memory.size > 10000) {
            const entries = Array.from(this.memory.entries());
            const toKeep = entries.slice(-5000);
            this.memory = new Map(toKeep);
        }
    }
}

class Particle {
    constructor(canvas, emotionData = null) {
        this.canvas = canvas;
        this.reset(emotionData);
    }
    
    reset(emotionData = null) {
        const defaults = {
            color: '#C8C8C8',
            brightness: 0.3,
            speed: 0.3,
            size: 2,
            rainbow: false,
            colorCycle: false,
            cycleColors: [],
            cycleSpeed: 0.015
        };
        
        this.baseColor = emotionData?.color || defaults.color;
        this.baseBrightness = emotionData?.brightness || defaults.brightness;
        this.maxSpeed = emotionData?.speed || defaults.speed;
        this.size = emotionData?.size || defaults.size;
        this.rainbow = emotionData?.rainbow || defaults.rainbow;

        this.colorCycle = emotionData?.colorCycle || defaults.colorCycle;
        this.cycleColors = emotionData?.cycleColors || defaults.cycleColors;
        this.cycleSpeed = emotionData?.cycleSpeed || defaults.cycleSpeed;

        if (!this.rainbow && !this.colorCycle && this.baseColor.startsWith('#')) {
            this.r = parseInt(this.baseColor.slice(1, 3), 16);
            this.g = parseInt(this.baseColor.slice(3, 5), 16);
            this.b = parseInt(this.baseColor.slice(5, 7), 16);
        } else {
            this.r = 200;
            this.g = 200;
            this.b = 200;
        }

        if (this.rainbow) {
            this.hueOffset = Math.random() * 360;
            this.hueSpeed = 0.5;
        }
        
        if (this.colorCycle && this.cycleColors.length > 0) {
            this.cyclePhase = Math.random();
        }
        
        this.pos = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height
        };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.friction = 0.92;
        this.life = Math.random() * 500 + 300;
        this.age = 0;
        this.fadeInDuration = 60;
        this.fadeOutDuration = 100;
        this.active = true;
    }

    follow(flowfield, cols, scl) {
        let x = Math.floor(this.pos.x / scl);
        let y = Math.floor(this.pos.y / scl);
        
        x = Math.max(0, Math.min(x, cols - 1));
        y = Math.max(0, Math.min(y, Math.floor(this.canvas.height / scl) - 1));
        
        let index = x + y * cols;
        let force = flowfield[index];
        
        if (force) {
            let forceMultiplier = 0.05 * (this.maxSpeed / 0.5);
            this.acc.x += force.x * forceMultiplier;
            this.acc.y += force.y * forceMultiplier;
        }
    }

    update(speedMultiplier = 1.0) {
        this.vel.x += this.acc.x * speedMultiplier;
        this.vel.y += this.acc.y * speedMultiplier;
        
        this.vel.x *= this.friction;
        this.vel.y *= this.friction;
        
        let magSq = this.vel.x * this.vel.x + this.vel.y * this.vel.y;
        let maxSpeedSq = (this.maxSpeed * speedMultiplier) * (this.maxSpeed * speedMultiplier);
        
        if (magSq > maxSpeedSq) {
            let mag = Math.sqrt(magSq);
            this.vel.x = (this.vel.x / mag) * (this.maxSpeed * speedMultiplier);
            this.vel.y = (this.vel.y / mag) * (this.maxSpeed * speedMultiplier);
        }
        
        this.pos.x += this.vel.x * speedMultiplier;
        this.pos.y += this.vel.y * speedMultiplier;
        
        this.pos.x += (Math.random() - 0.5) * 0.05;
        this.pos.y += (Math.random() - 0.5) * 0.05;
        
        this.acc.x = 0;
        this.acc.y = 0;
        this.age++;
        
        if (this.rainbow) {
            this.hueOffset = (this.hueOffset + this.hueSpeed) % 360;
        }
        
        if (this.colorCycle && this.cycleColors.length > 0) {
            this.cyclePhase = (this.cyclePhase + this.cycleSpeed) % 1;
            
            const rgb = interpolateColors(this.cycleColors, this.cyclePhase);
            this.r = rgb.r;
            this.g = rgb.g;
            this.b = rgb.b;
        }
    }


    edges() {
        if (this.pos.x > this.canvas.width) {
            this.pos.x = 0;
            this.vel.x *= 0.5;
        } else if (this.pos.x < 0) {
            this.pos.x = this.canvas.width;
            this.vel.x *= 0.5;
        }
        
        if (this.pos.y > this.canvas.height) {
            this.pos.y = 0;
            this.vel.y *= 0.5;
        } else if (this.pos.y < 0) {
            this.pos.y = this.canvas.height;
            this.vel.y *= 0.5;
        }
    }
    
    isDead() {
        return this.age > this.life;
    }
    
    getAlpha() {
        let alpha = 1;
        
        if (this.age < this.fadeInDuration) {
            alpha = this.age / this.fadeInDuration;
        }
        
        let remainingLife = this.life - this.age;
        if (remainingLife < this.fadeOutDuration) {
            alpha = Math.min(alpha, remainingLife / this.fadeOutDuration);
        }
        
        return alpha * this.baseBrightness;
    }

    show(ctx) {
        let alpha = this.getAlpha();
        
        if (this.rainbow) {
            ctx.fillStyle = `hsla(${this.hueOffset}, 100%, 60%, ${alpha})`;
        } else {
            ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
        }
        
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, 6.283185307179586);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.scl = 40;
        this.inc = 0.03;
        this.zOffInc = 0.0005;
        this.baseNumbPart = 1500;
        
        this.cols = Math.floor(this.canvas.width / this.scl);
        this.rows = Math.floor(this.canvas.height / this.scl);
        
        this.noise = new PerlinNoise();
        this.particles = [];
        this.particlePool = [];
        this.flowfield = new Array(this.cols * this.rows);
        
        this.seeds = {
            flow1: Math.random() * 10000,
            flow2: Math.random() * 10000
        };
        
        this.time = 0;
        this.flowfieldUpdateCounter = 0;
        this.flowfieldUpdateFrequency = 1;
        
        this.emotionDistribution = [{
            config: {
                color: '#C8C8C8',
                brightness: 0.3,
                speed: 0.2,
                size: 2,
                spawnRate: 0.1,
                rainbow: false
            },
            count: this.baseNumbPart * 0.1,
            type: 'pure',
            emotion: 'neutral'
        }];

        this.currentEmotion = this.emotionDistribution[0].config;
        
        this.init();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cols = Math.floor(this.canvas.width / this.scl);
        this.rows = Math.floor(this.canvas.height / this.scl);
        
        this.flowfield = new Array(this.cols * this.rows);
        this.particles = [];
        this.particlePool = [];
        this.init();
    }

    init() {
        this.emotionDistribution.forEach(dist => {
            const targetCount = Math.floor(dist.count);
            for (let i = 0; i < targetCount; i++) {
                this.particles.push(new Particle(this.canvas, dist.config));
            }
        });
    }
    
    getParticle(emotionData) {
        if (this.particlePool.length > 0) {
            const particle = this.particlePool.pop();
            particle.reset(emotionData);
            return particle;
        }
        return new Particle(this.canvas, emotionData);
    }
    
    recycleParticle(particle) {
        particle.active = false;
        if (this.particlePool.length < 500) {
            this.particlePool.push(particle);
        }
    }
    
    setEmotions(emotionAnalysis) {
        if (!emotionAnalysis || !emotionAnalysis.all) {
            this.emotionDistribution = [{
                config: {
                    color: '#C8C8C8',
                    brightness: 0.3,
                    speed: 0.2,
                    size: 2,
                    spawnRate: 0.1,
                    rainbow: false
                },
                count: this.baseNumbPart * 0.1,
                type: 'pure',
                emotion: 'neutral'
            }];
            this.currentEmotion = this.emotionDistribution[0].config;
            return;
        }

        if (emotionMixer) {
            this.emotionDistribution = emotionMixer.calculateDistribution(
                emotionAnalysis.all,
                this.baseNumbPart
            );
        } else {
            this.emotionDistribution = [{
                config: emotionAnalysis.dominant,
                count: this.baseNumbPart * emotionAnalysis.dominant.spawnRate,
                type: 'pure',
                emotion: 'dominant'
            }];
        }
        
        this.currentEmotion = emotionAnalysis.dominant;
    }
    
    setEmotion(emotionData) {
        this.currentEmotion = {
            color: emotionData.color,
            brightness: emotionData.brightness,
            speed: emotionData.speed,
            size: emotionData.size || 2,
            spawnRate: emotionData.spawnRate,
            rainbow: emotionData.rainbow || false
        };

        this.emotionDistribution = [{
            config: this.currentEmotion,
            count: this.baseNumbPart * this.currentEmotion.spawnRate,
            type: 'pure',
            emotion: 'manual'
        }];
    }

    getRandomEmotionFromDistribution() {
        const totalCount = this.emotionDistribution.reduce((sum, dist) => sum + dist.count, 0);
        let random = Math.random() * totalCount;
        
        for (let dist of this.emotionDistribution) {
            random -= dist.count;
            if (random <= 0) {
                return dist.config;
            }
        }

        return this.emotionDistribution[0].config;
    }

    updateFlowfield(speedMultiplier = 1.0) {
        this.time += this.zOffInc * speedMultiplier;
        
        let yoff = 0;
        for (let y = 0; y < this.rows; y++) {
            let xoff = 0;
            for (let x = 0; x < this.cols; x++) {
                let index = x + y * this.cols;
                
                let n1 = this.noise.get(
                    xoff + this.seeds.flow1 + this.time,
                    yoff + this.seeds.flow1 + this.time
                );
                
                let n2 = this.noise.get(
                    xoff * 2 + this.seeds.flow2 + this.time * 0.7,
                    yoff * 2 + this.seeds.flow2 + this.time * 0.7
                );
                
                let angle = (n1 * 2 + n2 * 0.5) * 6.283185307179586 - 0.05;
                
                this.flowfield[index] = {
                    x: Math.cos(angle),
                    y: Math.sin(angle)
                };
                
                xoff += this.inc;
            }
            yoff += this.inc;
        }
    }

    update() {
        if (window.updateFPS) {
            window.updateFPS();
        }
      
        if (window.updateParticleCount) {
            window.updateParticleCount(this.particles.length);
        }

        typingFlow.update();
        const speedMultiplier = typingFlow.getSpeedMultiplier();
        const spawnMultiplier = typingFlow.getSpawnMultiplier();
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.flowfieldUpdateCounter++;
        if (this.flowfieldUpdateCounter >= this.flowfieldUpdateFrequency) {
            this.updateFlowfield(speedMultiplier);
            this.flowfieldUpdateCounter = 0;
        }
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            
            particle.follow(this.flowfield, this.cols, this.scl);
            particle.update(speedMultiplier);
            particle.edges();
            particle.show(this.ctx);
            
            if (particle.isDead()) {
                this.recycleParticle(particle);
                this.particles.splice(i, 1);
            }
        }

        let totalTargetCount = 0;
        this.emotionDistribution.forEach(dist => {
            const baseCount = Math.floor(dist.count);
            const targetCount = Math.floor(baseCount * spawnMultiplier);
            totalTargetCount += targetCount;
        });

        if (this.particles.length < totalTargetCount) {
            const spawnCount = Math.min(5, totalTargetCount - this.particles.length);

            for (let i = 0; i < spawnCount; i++) {
                const emotionConfig = this.getRandomEmotionFromDistribution();
                this.particles.push(this.getParticle(emotionConfig));
            }
        }

        if (this.flowfieldUpdateCounter % 300 === 0) {
            this.noise.clearOldCache();
        }

        requestAnimationFrame(() => this.update());
    }

    start() {
        this.update();
    }
}

let particleSystem;

input.addEventListener('input', function() {
    const text = this.textContent;

    if (window.colorKeywordsEnabled && window.colorKeywordsEnabled()) {
        window.highlightEmotionWords();
    }

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        smoothResize();
    }, 50);
    
    if (text.length > 0) {
        const emotionAnalysis = analyzeText(text);
        const dominantEmotion = emotionAnalysis.dominant;
        
        if (window.updateTextboxColor) {
            window.updateTextboxColor(dominantEmotion);
        }
        
        if (dominantEmotion && dominantEmotion.color) {
            const subtleColor = blendEmotionColorWithBackground(dominantEmotion.color, 0.02);
            canvas.style.backgroundColor = subtleColor;
        }
        
        if (particleSystem) {
            particleSystem.setEmotions(emotionAnalysis);
        }
    } else {
        if (window.updateTextboxColor) {
            window.updateTextboxColor(null);
        }
        
        canvas.style.backgroundColor = '#0f0f0f';
        
        if (particleSystem) {
            particleSystem.setEmotions(null);
        }
        lastScrollHeight = 50;
    }
    
    if (!hasStartedTyping && text.length > 0) {
        hasStartedTyping = true;
        
        this.dataset.placeholder = '';
        intro.style.opacity = '0';
        
        setTimeout(() => {
            intro.style.display = 'none';
            box.classList.add('expanded');
        }, 500);
    }
});

function blendEmotionColorWithBackground(emotionColor, intensity = 0.10) {
    const hex = emotionColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    const bgR = 15, bgG = 15, bgB = 15; // #0f0f0f
    
    r = Math.round(bgR + (r - bgR) * intensity);
    g = Math.round(bgG + (g - bgG) * intensity);
    b = Math.round(bgB + (b - bgB) * intensity);
    
    return `rgb(${r}, ${g}, ${b})`;
}

window.addEventListener('load', () => {
    particleSystem = new ParticleSystem('space');
    particleSystem.start();
});