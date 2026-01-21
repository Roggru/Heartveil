// const emotions = {
//     // JOY SPECTRUM (Yellow-Orange)
//     joy_low: {
//         keywords: ['happy', 'glad', 'pleasant', 'nice', 'good', 'fine', 'okay', 'alright'],
//         color: '#FFD54F',
//         intensity: 3
//     },
//     joy_medium: {
//         keywords: ['joyful', 'cheerful', 'delighted', 'pleased', 'satisfied', 'content'],
//         color: '#FFA726',
//         intensity: 5
//     },
//     joy_high: {
//         keywords: ['ecstatic', 'thrilled', 'elated', 'overjoyed', 'euphoric', 'exhilarated'],
//         color: '#FF6F00',
//         intensity: 8
//     },

//     // ANGER SPECTRUM (Red)
//     anger_low: {
//         keywords: ['annoyed', 'irritated', 'bothered', 'frustrated', 'upset'],
//         color: '#EF5350',
//         intensity: 4
//     },
//     anger_medium: {
//         keywords: ['angry', 'mad', 'furious', 'enraged', 'livid'],
//         color: '#D32F2F',
//         intensity: 6
//     },
//     anger_high: {
//         keywords: ['rage', 'hatred', 'wrath', 'seething', 'incensed', 'outraged'],
//         color: '#B71C1C',
//         intensity: 9
//     },

//     // SADNESS SPECTRUM (Blue)
//     sadness_low: {
//         keywords: ['down', 'blue', 'unhappy', 'disappointed', 'gloomy'],
//         color: '#7986CB',
//         intensity: 3
//     },
//     sadness_medium: {
//         keywords: ['sad', 'sorrowful', 'dejected', 'heartbroken', 'melancholy'],
//         color: '#5C6BC0',
//         intensity: 5
//     },
//     sadness_high: {
//         keywords: ['depressed', 'despairing', 'devastated', 'anguished', 'miserable', 'hopeless'],
//         color: '#3949AB',
//         intensity: 8
//     },

//     // ANXIETY SPECTRUM (Purple)
//     anxiety_low: {
//         keywords: ['uneasy', 'concerned', 'uncertain', 'hesitant', 'apprehensive'],
//         color: '#BA68C8',
//         intensity: 4
//     },
//     anxiety_medium: {
//         keywords: ['anxious', 'worried', 'nervous', 'stressed', 'tense'],
//         color: '#AB47BC',
//         intensity: 6
//     },
//     anxiety_high: {
//         keywords: ['panicked', 'terrified', 'petrified', 'overwhelmed', 'frantic'],
//         color: '#8E24AA',
//         intensity: 9
//     },

//     // CALM SPECTRUM (Green)
//     calm_low: {
//         keywords: ['okay', 'fine', 'stable', 'settled'],
//         color: '#81C784',
//         intensity: 2
//     },
//     calm_medium: {
//         keywords: ['calm', 'peaceful', 'relaxed', 'tranquil', 'serene'],
//         color: '#66BB6A',
//         intensity: 4
//     },
//     calm_high: {
//         keywords: ['blissful', 'zenlike', 'harmonious', 'meditative'],
//         color: '#43A047',
//         intensity: 6
//     },

//     // LOVE SPECTRUM (Pink-Red)
//     love_low: {
//         keywords: ['like', 'fond', 'appreciate', 'care', 'admire'],
//         color: '#F06292',
//         intensity: 3
//     },
//     love_medium: {
//         keywords: ['love', 'adore', 'cherish', 'affection', 'devotion'],
//         color: '#EC407A',
//         intensity: 6
//     },
//     love_high: {
//         keywords: ['passionate', 'infatuated', 'enamored', 'obsessed', 'smitten'],
//         color: '#C2185B',
//         intensity: 9
//     },

//     // FEAR SPECTRUM (Dark purple-black)
//     fear_low: {
//         keywords: ['scared', 'afraid', 'fearful', 'startled'],
//         color: '#7E57C2',
//         intensity: 5
//     },
//     fear_high: {
//         keywords: ['terrified', 'horrified', 'dread', 'terror', 'nightmare'],
//         color: '#512DA8',
//         intensity: 9
//     },

//     neutral: {
//         keywords: [],
//         color: '#0f0f0f',
//         intensity: 1
//     }
// };

const emotions = {
    // ======================
    // JOY / POSITIVE AFFECT
    // ======================
    joy_low: {
        roots: ['joy', 'contentment'],
        keywords: [
            'okay', 'fine', 'pleasant', 'comfortable',
            'content', 'contented', 'contentment',
            'satisfied', 'satisfaction',
            'relieved', 'relief',
            'lighthearted', 'at ease', 'serene'
        ],
        color: '#E6EE9C',
        
        intensity: 2,
        brightness: 0.4,
        speed: 0.15,
        spawnRate: 0.15,

        trail: TrailPresets.none
    },

    joy_medium: {
        roots: ['happiness'],
        keywords: [
            'happy', 'happier', 'happiest',
            'happiness', 'joyous',
            'joyful', 'joyfulness',
            'cheerful', 'cheerfulness',
            'glad', 'delighted', 'delight',
            'pleased', 'pleasure',
            'warm', 'warmth', 'joy',
            'optimistic'
        ],
        color: '#FFD54F',
        
        intensity: 5,
        brightness: 0.6,
        speed: 0.3,
        spawnRate: 0.3,
        
        trail: TrailPresets.none
    },

    joy_high: {
        roots: ['ecstasy'],
        keywords: [
            'elated', 'elation',
            'euphoric', 'euphoria', 'ecstasy',
            'exuberant', 'exuberance',
            'thrilled', 'thrill',
            'blissful', 'bliss',
            'excited', 'excitement',
            'overjoyed'
        ],
        color: '#FF8F00',
        
        intensity: 8,
        brightness: 0.8,
        speed: 1,
        spawnRate: 0.5,
        
        trail: TrailPresets.none
    },

    joy_fast:{
        keywords: [
            'ecstatic', 'horny',
            'rapturous', 'rapture',
        ],
        color: '#ffb700',

        intensity: 9,
        brightness: 0.9,
        speed: 2,
        spawnRate: 0.7,
        
        trail: TrailPresets.none
    },

    // ======================
    // LOVE / ATTACHMENT
    // ======================
    love_low: {
        roots: ['affection'],
        keywords: [
            'fond', 'fondness',
            'caring', 'care',
            'appreciative', 'appreciation',
            'connected', 'connection', 'cherish'
        ],
        color: '#F8BBD0',
        
        intensity: 3,
        brightness: 0.4,
        speed: 0.1,
        spawnRate: 0.2,
        
        trail: TrailPresets.none
    },

    love_medium: {
        roots: ['love'],
        keywords: [
            'love', 'loved', 'loving',
            'affectionate', 'affection',
            'tender', 'tenderness',
            'devoted', 'devotion',
            'intimate', 'intimacy',
            'attached', 'attachment',
            'desire', 'romantic',
            'adore', 'adoration'
        ],
        color: '#F06292',
        
        intensity: 6,
        brightness: 0.7,
        speed: 0.1,
        spawnRate: 0.3,
        
        trail: TrailPresets.none
    },

    love_high: {
        roots: ['desire'],
        keywords: [
            'passionate', 'passion',
            'infatuated', 'infatuation',
            'enamored',
            'obsessed', 'obsession',
            'consumed',
            'longing', 'yearning',
        ],
        color: '#C2185B',
  
        intensity: 9,
        brightness: 1,
        speed: 0.1,
        spawnRate: 0.35,
        
        trail: TrailPresets.none
    },

    // ======================
    // SADNESS / LOSS
    // ======================
    sadness_low: {
        roots: ['disappointment'],
        keywords: [
            'down', 'blue',
            'disappointed', 'disappointment',
            'let down',
            'heavy', 'weary', 'tired',
            'wistful'
        ],
        color: '#9FA8DA',
       
        intensity: 3,
        brightness: 0.3,
        speed: 0.1,
        spawnRate: 0.1,
        
        trail: TrailPresets.none
    },

    sadness_medium: {
        roots: ['sadness'],
        keywords: [
            'sad', 'sadness',
            'sorrowful', 'sorrow',
            'melancholy',
            'grieving', 'grief',
            'heartbroken', 'heartbreak',
            'lonely', 'loneliness',
            'hurt', 'pessimistic'
        ],
        color: '#5C6BC0',
        
        intensity: 6,
        brightness: 0.4,
        speed: 0.3,
        spawnRate: 0.2,
        
        trail: TrailPresets.none
    },

    sadness_high: {
        roots: ['despair'],
        keywords: [
            'despairing', 'despair',
            'hopeless', 'hopelessness',
            'devastated', 'devastation',
            'anguished', 'anguish',
            'miserable', 'misery'
        ],
        color: '#283593',
        
        intensity: 9,
        brightness: 0.8,
        speed: 0.3,
        spawnRate: 0.25,
        
        trail: TrailPresets.none
    },

    // ======================
    // ANGER / AGGRESSION
    // ======================
    anger_low: {
        roots: ['annoyance'],
        keywords: [
            'annoyed', 'annoyance',
            'irritated', 'irritation',
            'bothered', 'grouchy',
            'impatient', 'impatience',
            'agitated', 'agitation'
        ],
        color: '#ff5343',
        
        intensity: 4,
        brightness: 0.4,
        speed: 0.1,
        spawnRate: 0.1,
        
        trail: TrailPresets.none
    },

    anger_medium: {
        roots: ['anger'],
        keywords: [
            'angry', 'anger',
            'mad', 'hate',
            'resentful', 'resentment',
            'frustrated', 'frustration',
            'indignant', 'indignation'
        ],
        color: '#E53935',
        
        intensity: 6,
        brightness: 0.7,
        speed: 0.4,
        spawnRate: 0.3,
        
        trail: TrailPresets.none
    },

    anger_high: {
        roots: ['rage'],
        keywords: [
            'enraged', 'rage',
            'fury', 'livid',
            'wrathful', 'wrath',
            'seething',
            'vengeful', 'vengeance',
            'betrayed', 'malice',
            'malicious'
        ],
        color: '#9e0000',
        
        intensity: 9,
        brightness: 1,
        speed: 1,
        spawnRate: 1,
        
        trail: TrailPresets.none
    },

    anger_fast:{
        keywords: [
            'explosive', 'explode',
            'furious', 'violent'
        ],
        color: '#ff2f00',

        intensity: 10,
        brightness: 1,
        speed: 5,
        spawnRate: 0.4,
        movement: 'erratic',
        trail: TrailPresets.none
    },


    // ======================
    // FEAR / THREAT
    // ======================
    fear_low: {
        roots: ['unease'],
        keywords: [
            'uneasy', 'uneasiness',
            'cautious', 'caution',
            'on edge', 'reluctant',
            'nervous', 'nervousness'
        ],
        color: '#B39DDB',
        
        intensity: 4,
        brightness: 0.4,
        speed: 1,
        spawnRate: 0.02,
        movement: 'floating',
        trail: TrailPresets.none
    },

    fear_medium: {
        roots: ['fear'],
        keywords: [
            'afraid', 'fearful', 'fear',
            'scared', 'scary',
            'alarmed', 'alarm',
            'dread', 'dreading',
            'worried', 'worry',
            'startled'
        ],
        color: '#7E57C2',
        
        intensity: 7,
        brightness: 0.6,
        speed: 1.2,
        spawnRate: 0.05,
        
        trail: TrailPresets.none
    },

    fear_high: {
        roots: ['terror'],
        keywords: [
            'terrified', 'terror',
            'horrified', 'horror',
            'panicked', 'panic',
            'paralyzed',
            'nightmarish',
            'petrified'
        ],
        color: '#311B92',
        
        intensity: 10,
        brightness: 1,
        speed: 3,
        spawnRate: 0.05,
        
        trail: TrailPresets.none
    },

    // ======================
    // ANXIETY / OVERLOAD
    // ======================
    anxiety_low: {
        roots: ['concern'],
        keywords: [
            'concerned', 'concern',
            'uncertain', 'uncertainty',
            'hesitant', 'hesitation',
            'restless', 'restlessness'
        ],
        color: '#CE93D8',
    
        intensity: 4,
        brightness: 0.4,
        speed: 0.3,
        spawnRate: 0.03,
        
        trail: TrailPresets.none
    },

    anxiety_medium: {
        roots: ['anxiety'],
        keywords: [
            'anxious', 'anxiety',
            'stressed', 'stress',
            'tense', 'tension',
            'overthinking',
            'pressured', 'angst'
        ],
        color: '#AB47BC',
      
        intensity: 6,
        brightness: 0.6,
        speed: 0.4,
        spawnRate: 0.08,
        
        trail: TrailPresets.none
    },

    anxiety_high: {
        roots: ['overwhelm'],
        keywords: [
            'overwhelmed', 'overwhelm',
            'spiraling',
            'frantic', 'frenzied',
            'hypervigilant',
            'burned out', 'burnout',
            'hysteric', 'hysterical'
        ],
        color: '#6A1B9A',
       
        intensity: 9,
        brightness: 1,
        speed: 2.5,
        spawnRate: 0.5,
        movement: 'erratic',
        trail: TrailPresets.none
    },

    // ======================
    // SURPRISE / NOVELTY
    // ======================
    surprise_low: {
        roots: ['curiosity'],
        keywords: [
            'curious', 'curiosity',
            'caught off guard',
            'alert', 'amused'
        ],
        color: '#81D4FA',
       
        intensity: 3,
        brightness: 0.5,
        speed: 0.8,
        spawnRate: 0.06,
        
        trail: TrailPresets.none
    },

    surprise_medium: {
        roots: ['surprise'],
        keywords: [
            'surprised', 'surprise',
            'amazed', 'amazement',
            'astonished', 'astonishment',
            'confused', 'confusion',
            'astounded'
        ],
        color: '#29B6F6',
        
        intensity: 6,
        brightness: 0.7,
        speed: 0.5,
        spawnRate: 0.08,
        
        trail: TrailPresets.none
    },

    surprise_high: {
        roots: ['shock'],
        keywords: [
            'shocked', 'shock',
            'stunned',
            'speechless',
            'awe-struck', 'awe',
            'mind-blown', 'thunderstruck'
        ],
        color: '#0288D1',
      
        intensity: 8,
        brightness: 0.9,
        speed: 0.2,
        spawnRate: 0.5,
        
        trail: TrailPresets.none
    },

    // ======================
    // SHAME / SELF-EVALUATION
    // ======================
    shame_low: {
        roots: ['embarrassment'],
        keywords: [
            'awkward',
            'self-conscious',
            'embarrassed', 'embarrassment'
        ],
        color: '#B0BEC5',
      
        intensity: 4,
        brightness: 0.4,
        speed: 0.01,
        spawnRate: 0.5,
        
        trail: TrailPresets.none
    },

    shame_medium: {
        roots: ['guilt'],
        keywords: [
            'ashamed', 'shame',
            'guilty', 'guilt',
            'regretful', 'regret',
            'exposed', 'insecure'
        ],
        color: '#607D8B',
 
        intensity: 6,
        brightness: 0.4,
        speed: 0.03,
        spawnRate: 0.5,
        
        trail: TrailPresets.none
    },

    shame_high: {
        roots: ['humiliation'],
        keywords: [
            'humiliated', 'humiliation',
            'worthless',
            'self-loathing',
            'degraded'
        ],
        color: '#263238',
     
        intensity: 9,
        brightness: 0.5,
        speed: 0.04,
        spawnRate: 0.5,
        
        trail: TrailPresets.none
    },

    // ======================
    // NEUTRAL / NUMB
    // ======================
    neutral: {
        roots: ['neutrality'],
        keywords: [
            'neutral',
            'numb', 'numbness',
            'blank',
            'detached', 'detachment',
            'empty', 'emptiness',
            'void'
        ],
        color: '#111111',

        intensity: 1,
        brightness: 0.4,
        speed: 1,
        spawnRate: 0.5,
        
        trail: TrailPresets.none
    }
};
