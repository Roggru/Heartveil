const input = document.getElementById('input');
const intro = document.querySelector('.intro');
const box = document.querySelector('.box');
const main = document.querySelector('.main');
const canvas = document.querySelector('.canvas');

let hasStartedTyping = false;
let resizeTimeout;
let lastScrollHeight = 50;

function analyzeText(text) {
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
    
    return emotions[dominantEmotion];
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
});



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
            rainbow: false
        };
        
        this.baseColor = emotionData?.color || defaults.color;
        this.baseBrightness = emotionData?.brightness || defaults.brightness;
        this.maxSpeed = emotionData?.speed || defaults.speed;
        this.size = emotionData?.size || defaults.size;
        this.rainbow = emotionData?.rainbow || defaults.rainbow;

        if (!this.rainbow && this.baseColor.startsWith('#')) {
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

    update() {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        
        this.vel.x *= this.friction;
        this.vel.y *= this.friction;
        
        let magSq = this.vel.x * this.vel.x + this.vel.y * this.vel.y;
        let maxSpeedSq = this.maxSpeed * this.maxSpeed;
        
        if (magSq > maxSpeedSq) {
            let mag = Math.sqrt(magSq);
            this.vel.x = (this.vel.x / mag) * this.maxSpeed;
            this.vel.y = (this.vel.y / mag) * this.maxSpeed;
        }
        
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        this.pos.x += (Math.random() - 0.5) * 0.05;
        this.pos.y += (Math.random() - 0.5) * 0.05;
        
        this.acc.x = 0;
        this.acc.y = 0;
        this.age++;
        
        if (this.rainbow) {
            this.hueOffset = (this.hueOffset + this.hueSpeed) % 360;
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
        
        this.currentEmotion = {
            color: '#C8C8C8',
            brightness: 0.3,
            speed: 0.2,
            size: 2,
            spawnRate: 0.1,
            rainbow: false
        };
        
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
        const targetCount = Math.floor(this.baseNumbPart * this.currentEmotion.spawnRate);
        for (let i = 0; i < targetCount; i++) {
            this.particles.push(new Particle(this.canvas, this.currentEmotion));
        }
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
    
    setEmotion(emotionData) {
        this.currentEmotion = {
            color: emotionData.color,
            brightness: emotionData.brightness,
            speed: emotionData.speed,
            size: emotionData.size || 2,
            spawnRate: emotionData.spawnRate,
            rainbow: emotionData.rainbow || false
        };
    }

    updateFlowfield() {
        this.time += this.zOffInc;
        
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
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.flowfieldUpdateCounter++;
        if (this.flowfieldUpdateCounter >= this.flowfieldUpdateFrequency) {
            this.updateFlowfield();
            this.flowfieldUpdateCounter = 0;
        }
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            
            particle.follow(this.flowfield, this.cols, this.scl);
            particle.update();
            particle.edges();
            particle.show(this.ctx);
            
            if (particle.isDead()) {
                this.recycleParticle(particle);
                this.particles.splice(i, 1);
            }
        }
        
        const targetCount = Math.floor(this.baseNumbPart * this.currentEmotion.spawnRate);
        if (this.particles.length < targetCount) {
            const spawnCount = Math.min(5, targetCount - this.particles.length);
            for (let i = 0; i < spawnCount; i++) {
                this.particles.push(this.getParticle(this.currentEmotion));
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
        const emotion = analyzeText(text);
        
        if (window.updateTextboxColor) {
            window.updateTextboxColor(emotion);
        }
        
        if (emotion && emotion.color) {
            const subtleColor = blendEmotionColorWithBackground(emotion.color, 0.02);
            canvas.style.backgroundColor = subtleColor;
        }
        
        if (particleSystem) {
            particleSystem.setEmotion(emotion);
        }
    } else {
        if (window.updateTextboxColor) {
            window.updateTextboxColor(null);
        }
        
        canvas.style.backgroundColor = '#0f0f0f';
        
        if (particleSystem) {
            particleSystem.setEmotion({
                color: '#C8C8C8',
                brightness: 0.3,
                speed: 0.2,
                size: 2,
                spawnRate: 0.1,
                rainbow: false
            });
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
    // Parse emotion color
    const hex = emotionColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Background color RGB
    const bgR = 15, bgG = 15, bgB = 15; // #0f0f0f
    
    // Blend emotion color with background (intensity controls how strong the tint is)
    r = Math.round(bgR + (r - bgR) * intensity);
    g = Math.round(bgG + (g - bgG) * intensity);
    b = Math.round(bgB + (b - bgB) * intensity);
    
    return `rgb(${r}, ${g}, ${b})`;
}

window.addEventListener('load', () => {
    particleSystem = new ParticleSystem('space');
    particleSystem.start();
});