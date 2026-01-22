// emotionMixer.js - Handles emotion detection, mixing, and particle distribution
class EmotionMixer {
    constructor(emotions) {
        this.emotionsData = emotions;
        this.detectionThreshold = 0.8;
        this.mixingEnabled = true;
        this.mixedParticleRatio = 0.7; // 65% mixed, 35% pure (adjustable: 0.6-0.7 recommended)
    }

    detectEmotions(text) {
        const lowerText = text.toLowerCase();
        const emotionScores = {};

        for (let [emotion, data] of Object.entries(this.emotionsData)) {
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
            for (let [emotion, data] of Object.entries(this.emotionsData)) {
                data.keywords.forEach(keyword => {
                    if (!keyword.includes(' ') && keyword === word) {
                        emotionScores[emotion] = (emotionScores[emotion] || 0) + data.intensity;
                    }
                });
            }
        });

        const detectedEmotions = Object.entries(emotionScores)
            .map(([emotion, score]) => ({
                emotion,
                score,
                data: this.emotionsData[emotion]
            }))
            .filter(e => e.score >= this.detectionThreshold)
            .sort((a, b) => b.score - a.score);

        return detectedEmotions.length > 0 
            ? detectedEmotions 
            : [{ emotion: 'neutral', score: 1, data: this.emotionsData.neutral }];
    }

    blendEmotions(emotion1, emotion2, ratio = 0.5) {
        const blended = {
            color: emotion1.color,
            brightness: this.lerp(emotion1.brightness, emotion2.brightness, ratio),
            speed: this.lerp(emotion1.speed, emotion2.speed, ratio),
            size: this.lerp(emotion1.size || 2, emotion2.size || 2, ratio),
            spawnRate: this.lerp(emotion1.spawnRate, emotion2.spawnRate, ratio),
            rainbow: emotion1.rainbow || emotion2.rainbow,
            colorCycle: !emotion1.rainbow && !emotion2.rainbow,
            cycleColors: [emotion1.color, emotion2.color],
            cycleSpeed: 0.004, // Speed of color transition
            mixed: true,
            sources: [emotion1, emotion2]
        };

        return blended;
    }

    blendMultipleEmotions(emotions) {
        if (emotions.length === 1) return emotions[0].data;

        const totalScore = emotions.reduce((sum, e) => sum + e.score, 0);
        
        let totalBrightness = 0, totalSpeed = 0, totalSize = 0, totalSpawnRate = 0;
        let hasRainbow = false;
        let cycleColors = [];

        emotions.forEach(({ score, data }) => {
            const weight = score / totalScore;
            
            if (data.rainbow) {
                hasRainbow = true;
            } else {
                cycleColors.push(data.color);
            }
            
            totalBrightness += data.brightness * weight;
            totalSpeed += data.speed * weight;
            totalSize += (data.size || 2) * weight;
            totalSpawnRate += data.spawnRate * weight;
        });

        return {
            color: cycleColors[0] || '#FFFFFF',
            brightness: totalBrightness,
            speed: totalSpeed,
            size: totalSize,
            spawnRate: totalSpawnRate,
            rainbow: hasRainbow,
            colorCycle: !hasRainbow && cycleColors.length > 1,
            cycleColors: cycleColors,
            cycleSpeed: 0.015, // Speed of color transition
            mixed: emotions.length > 1,
            sources: emotions.map(e => e.data)
        };
    }

    calculateDistribution(detectedEmotions, totalParticles = 1500) {
        if (detectedEmotions.length === 0) {
            const neutralConfig = this.emotionsData.neutral;
            return [{
                config: neutralConfig,
                count: totalParticles * (neutralConfig.spawnRate || 0.1),
                type: 'pure',
                emotion: 'neutral'
            }];
        }

        if (detectedEmotions.length === 1) {
            const emotionData = detectedEmotions[0].data;
            return [{
                config: emotionData,
                count: totalParticles * (emotionData.spawnRate || 0.1),
                type: 'pure',
                emotion: detectedEmotions[0].emotion
            }];
        }

        const distribution = [];
        const totalScore = detectedEmotions.reduce((sum, e) => sum + e.score, 0);

        const weightedSpawnRate = detectedEmotions.reduce((sum, e) => {
            const weight = e.score / totalScore;
            return sum + (e.data.spawnRate || 0.1) * weight;
        }, 0);

        const effectiveTotal = totalParticles * weightedSpawnRate;

        const mixedReserve = this.mixingEnabled ? this.mixedParticleRatio : 0;
        const pureReserve = 1 - mixedReserve;

        detectedEmotions.forEach(({ emotion, score, data }) => {
            const ratio = score / totalScore;
            const count = Math.floor(effectiveTotal * pureReserve * ratio);
            
            if (count > 0) {
                distribution.push({
                    config: data,
                    count,
                    type: 'pure',
                    emotion
                });
            }
        });

        if (this.mixingEnabled && detectedEmotions.length >= 2) {
            const topEmotions = detectedEmotions.slice(0, Math.min(3, detectedEmotions.length));
            const mixedCount = Math.floor(effectiveTotal * mixedReserve);

            if (topEmotions.length === 2) {
                const blended = this.blendEmotions(topEmotions[0].data, topEmotions[1].data, 0.5);
                distribution.push({
                    config: blended,
                    count: mixedCount,
                    type: 'mixed',
                    emotion: `${topEmotions[0].emotion}+${topEmotions[1].emotion}`
                });
            } else {
                const blended = this.blendMultipleEmotions(topEmotions);
                distribution.push({
                    config: blended,
                    count: mixedCount,
                    type: 'mixed',
                    emotion: topEmotions.map(e => e.emotion).join('+')
                });
            }
        }

        return distribution;
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    blendColors(color1, color2, ratio = 0.5) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        const r = Math.round(this.lerp(rgb1.r, rgb2.r, ratio));
        const g = Math.round(this.lerp(rgb1.g, rgb2.g, ratio));
        const b = Math.round(this.lerp(rgb1.b, rgb2.b, ratio));

        return this.rgbToHex(r, g, b);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 200, g: 200, b: 200 };
    }

    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join('');
    }

    setMixingEnabled(enabled) {
        this.mixingEnabled = enabled;
    }
    
    setMixedParticleRatio(ratio) {
        this.mixedParticleRatio = Math.max(0, Math.min(1, ratio));
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmotionMixer;
}