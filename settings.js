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



// COLOR TEXTBOX
const textboxToggle = document.getElementById('textboxToggle');
let colorTextboxEnabled = true;

textboxToggle.addEventListener('change', (e) => {
    colorTextboxEnabled = e.target.checked;
    
    if (!colorTextboxEnabled) {
        const inputDiv = document.getElementById('input');
        inputDiv.style.outline = 'none';
        inputDiv.style.boxShadow = 'none';
    }
});

function updateTextboxColor(emotion) {
    if (!colorTextboxEnabled) return;
    
    const inputDiv = document.getElementById('input');
    
    if (emotion && emotion.color) {
        const lightenEmotionColor = (hex, lightenAmount = 0.92) => {
            hex = hex.replace('#', '');
            
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);
            
            const bgR = 25, bgG = 25, bgB = 25;
            
            r = Math.round(bgR + (r - bgR) * (1 - lightenAmount));
            g = Math.round(bgG + (g - bgG) * (1 - lightenAmount));
            b = Math.round(bgB + (b - bgB) * (1 - lightenAmount));
            
            return `rgb(${r}, ${g}, ${b})`;
        };
        
        inputDiv.style.transition = 'outline 0.6s ease, box-shadow 0.6s ease';
        inputDiv.style.outline = `2px solid ${lightenEmotionColor(emotion.color, 0.7)}`;
        inputDiv.style.boxShadow = `0 0 10px ${lightenEmotionColor(emotion.color, 0.85)}`;
    } else {
        inputDiv.style.outline = 'none';
        inputDiv.style.boxShadow = 'none';
    }
}

window.colorTextboxEnabled = () => colorTextboxEnabled;
window.updateTextboxColor = updateTextboxColor;



// COLOR KEYWORDS
const colorToggle = document.getElementById('colorToggle');
let colorKeywordsEnabled = false;
let lastCompletedText = '';

colorToggle.addEventListener('change', (e) => {
    colorKeywordsEnabled = e.target.checked;
    
    if (colorKeywordsEnabled) {
        lastCompletedText = '';
        highlightEmotionWords();
    } else {
        lastCompletedText = '';
        removeHighlights();
    }
});

function highlightEmotionWords() {
    if (!colorKeywordsEnabled) return;
    
    const inputDiv = document.getElementById('input');
    const text = inputDiv.textContent;
    
    if (!text) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const cursorOffset = getAbsoluteCursorPosition(inputDiv, range);
    
    const wordColorMap = {};
    for (let [emotionName, data] of Object.entries(emotions)) {
        data.keywords.forEach(keyword => {
            wordColorMap[keyword.toLowerCase()] = data.color;
        });
    }

    const beforeCursor = text.substring(0, cursorOffset);
    const afterCursor = text.substring(cursorOffset);
    
    const lastSpaceIndex = beforeCursor.lastIndexOf(' ');
    const lastNewlineIndex = beforeCursor.lastIndexOf('\n');
    const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
    
    const completedText = beforeCursor.substring(0, lastBreakIndex + 1);
    const currentWord = beforeCursor.substring(lastBreakIndex + 1);
    
    if (completedText === lastCompletedText) {
        return;
    }
    
    const existingHighlights = new Set();
    inputDiv.querySelectorAll('.emotion-word').forEach(span => {
        existingHighlights.add(span.textContent);
    });
    
    lastCompletedText = completedText;
    
    let html = '';
    
    if (completedText) {
        const words = completedText.split(/(\s+)/);
        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[.,!?;:"'()]/g, '');
            
            if (cleanWord && wordColorMap[cleanWord]) {
                const color = wordColorMap[cleanWord];
                const desaturatedColor = desaturateColor(color, 0.15);

                const wasHighlighted = existingHighlights.has(word);
                html += `<span class="emotion-word${wasHighlighted ? ' no-transition' : ''}" data-emotion-color="${desaturatedColor}">${word}</span>`;
            } else {
                html += word;
            }
        });
    }
    
    html += currentWord + afterCursor;
    
    inputDiv.innerHTML = html;
    
    requestAnimationFrame(() => {
        const emotionWords = inputDiv.querySelectorAll('.emotion-word');
        emotionWords.forEach(span => {
            const color = span.getAttribute('data-emotion-color');
            if (span.style.color !== color) {
                span.style.color = color;
            }
            
            if (span.classList.contains('no-transition')) {
                span.offsetHeight;
                span.classList.remove('no-transition');
            }
        });
    });
    
    restoreCursorPosition(inputDiv, cursorOffset);
}

function getAbsoluteCursorPosition(element, range) {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
}

function restoreCursorPosition(element, offset) {
    const selection = window.getSelection();
    const range = document.createRange();
    
    let currentOffset = 0;
    let found = false;
    
    function findPosition(node) {
        if (found) return;
        
        if (node.nodeType === Node.TEXT_NODE) {
            const length = node.textContent.length;
            if (currentOffset + length >= offset) {
                const nodeOffset = Math.max(0, Math.min(offset - currentOffset, length));
                range.setStart(node, nodeOffset);
                range.collapse(true);
                found = true;
                return;
            }
            currentOffset += length;
        } else {
            for (let child of node.childNodes) {
                findPosition(child);
                if (found) return;
            }
        }
    }
    
    findPosition(element);
    
    if (found) {
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        placeCaretAtEnd(element);
    }
}

function desaturateColor(hex, amount) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    const gray = (r + g + b) / 3;
    
    r = Math.round(r + (gray - r) * amount);
    g = Math.round(g + (gray - g) * amount);
    b = Math.round(b + (gray - b) * amount);
    
    r = Math.round(r * 0.8);
    g = Math.round(g * 0.8);
    b = Math.round(b * 0.8);
    
    return `rgb(${r}, ${g}, ${b})`;
}

function removeHighlights() {
    const inputDiv = document.getElementById('input');
    const text = inputDiv.textContent;
    
    const selection = window.getSelection();
    let cursorOffset = 0;
    
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        cursorOffset = getAbsoluteCursorPosition(inputDiv, range);
    }
    
    inputDiv.innerHTML = text;
    lastCompletedText = '';

    restoreCursorPosition(inputDiv, cursorOffset);
}

function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

window.colorKeywordsEnabled = () => colorKeywordsEnabled;
window.highlightEmotionWords = highlightEmotionWords;