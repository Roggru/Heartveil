const input = document.getElementById('input');
const intro = document.querySelector('.intro');
const box = document.querySelector('.box');
const main = document.querySelector('.main');
const canvas = document.querySelector('.canvas');

let hasStartedTyping = false;
let resizeTimeout;

function analyzeText(text) {
    const words = text.toLowerCase()
        .replace(/[.,!?;:"'()]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    const emotionScores = {};
    
    words.forEach(word => {
        for (let [emotion, data] of Object.entries(emotions)) {
            if (data.keywords.includes(word)) {
                emotionScores[emotion] = (emotionScores[emotion] || 0) + data.intensity;
            }
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

input.addEventListener('input', function() {
    const textarea = this;
    
    clearTimeout(resizeTimeout);
    
    textarea.style.transition = 'none';
    textarea.style.height = 'auto';
    
    const maxHeight = 400;
    const minHeight = 60;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight));
    
    textarea.style.height = newHeight + 'px';
    
    resizeTimeout = setTimeout(() => {
        textarea.style.transition = 'height 0.2s ease';
    }, 50);
    
    const text = textarea.value;
    if (text.length > 0) {
        const emotion = analyzeText(text);
        canvas.style.backgroundColor = emotion.color;
    } else {
        canvas.style.backgroundColor = '#0f0f0f';
    }
    
    if (!hasStartedTyping && textarea.value.length > 0) {
        hasStartedTyping = true;
        intro.style.display = 'none';
        box.classList.add('expanded');
        main.classList.add('centered');
    }
});