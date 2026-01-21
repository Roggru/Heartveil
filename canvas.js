// Emotion dictionary with intensity levels
const emotions = {
    // JOY SPECTRUM (Yellow-Orange)
    joy_low: {
        keywords: ['happy', 'glad', 'pleasant', 'nice', 'good', 'fine', 'okay', 'alright'],
        color: '#FFD54F',
        intensity: 3
    },
    joy_medium: {
        keywords: ['joyful', 'cheerful', 'delighted', 'pleased', 'satisfied', 'content'],
        color: '#FFA726',
        intensity: 5
    },
    joy_high: {
        keywords: ['ecstatic', 'thrilled', 'elated', 'overjoyed', 'euphoric', 'exhilarated'],
        color: '#FF6F00',
        intensity: 8
    },

    // ANGER SPECTRUM (Red)
    anger_low: {
        keywords: ['annoyed', 'irritated', 'bothered', 'frustrated', 'upset'],
        color: '#EF5350',
        intensity: 4
    },
    anger_medium: {
        keywords: ['angry', 'mad', 'furious', 'enraged', 'livid'],
        color: '#D32F2F',
        intensity: 6
    },
    anger_high: {
        keywords: ['rage', 'hatred', 'wrath', 'seething', 'incensed', 'outraged'],
        color: '#B71C1C',
        intensity: 9
    },

    // SADNESS SPECTRUM (Blue)
    sadness_low: {
        keywords: ['down', 'blue', 'unhappy', 'disappointed', 'gloomy'],
        color: '#7986CB',
        intensity: 3
    },
    sadness_medium: {
        keywords: ['sad', 'sorrowful', 'dejected', 'heartbroken', 'melancholy'],
        color: '#5C6BC0',
        intensity: 5
    },
    sadness_high: {
        keywords: ['depressed', 'despairing', 'devastated', 'anguished', 'miserable', 'hopeless'],
        color: '#3949AB',
        intensity: 8
    },

    // ANXIETY SPECTRUM (Purple)
    anxiety_low: {
        keywords: ['uneasy', 'concerned', 'uncertain', 'hesitant', 'apprehensive'],
        color: '#BA68C8',
        intensity: 4
    },
    anxiety_medium: {
        keywords: ['anxious', 'worried', 'nervous', 'stressed', 'tense'],
        color: '#AB47BC',
        intensity: 6
    },
    anxiety_high: {
        keywords: ['panicked', 'terrified', 'petrified', 'overwhelmed', 'frantic'],
        color: '#8E24AA',
        intensity: 9
    },

    // CALM SPECTRUM (Green)
    calm_low: {
        keywords: ['okay', 'fine', 'stable', 'settled'],
        color: '#81C784',
        intensity: 2
    },
    calm_medium: {
        keywords: ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene'],
        color: '#66BB6A',
        intensity: 4
    },
    calm_high: {
        keywords: ['blissful', 'zenlike', 'harmonious', 'meditative'],
        color: '#43A047',
        intensity: 6
    },

    // LOVE SPECTRUM (Pink-Red)
    love_low: {
        keywords: ['like', 'fond', 'appreciate', 'care', 'admire'],
        color: '#F06292',
        intensity: 3
    },
    love_medium: {
        keywords: ['love', 'adore', 'cherish', 'affection', 'devotion'],
        color: '#EC407A',
        intensity: 6
    },
    love_high: {
        keywords: ['passionate', 'infatuated', 'enamored', 'obsessed', 'smitten'],
        color: '#C2185B',
        intensity: 9
    },

    // FEAR SPECTRUM (Dark purple-black)
    fear_low: {
        keywords: ['scared', 'afraid', 'fearful', 'startled'],
        color: '#7E57C2',
        intensity: 5
    },
    fear_high: {
        keywords: ['terrified', 'horrified', 'dread', 'terror', 'nightmare'],
        color: '#512DA8',
        intensity: 9
    },

    neutral: {
        keywords: [],
        color: '#0f0f0f',
        intensity: 1
    }
};