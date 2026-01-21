// // ==========================================
// // MOVEMENT BEHAVIORS
// // ==========================================
// const MovementBehaviors = {
//     /**
//      * FLOWING - Smooth, gentle flow (DEFAULT)
//      * Good for: joy, calm, contentment
//      */
//     flowing: (particle, force) => {
//         const forceMultiplier = 0.05 * (particle.maxSpeed / 0.5);
//         return {
//             x: force.x * forceMultiplier,
//             y: force.y * forceMultiplier
//         };
//     },
    
//     /**
//      * ERRATIC - Sharp, sudden changes with jitter
//      * Good for: anger, rage, frustration
//      */
//     erratic: (particle, force) => {
//         const forceMultiplier = 0.08 * (particle.maxSpeed / 0.5);
//         const jitter = (Math.random() - 0.5) * 0.3;
//         return {
//             x: force.x * forceMultiplier + jitter,
//             y: force.y * forceMultiplier + jitter
//         };
//     },
    
//     /**
//      * FLOATING - Slow, drifting with gentle vertical wave
//      * Good for: calm, sadness, melancholy
//      */
//     floating: (particle, force) => {
//         const forceMultiplier = 0.02 * (particle.maxSpeed / 0.5);
//         const waveOffset = Math.sin(particle.age * 0.02) * 0.01;
//         return {
//             x: force.x * forceMultiplier,
//             y: force.y * forceMultiplier + waveOffset
//         };
//     },
    
//     /**
//      * SWIRLING - Circular, spiraling motion
//      * Good for: anxiety, confusion, overwhelm
//      */
//     swirling: (particle, force) => {
//         const forceMultiplier = 0.06 * (particle.maxSpeed / 0.5);
//         const angle = particle.age * 0.05;
//         const spiralStrength = 0.02;
//         return {
//             x: force.x * forceMultiplier + Math.cos(angle) * spiralStrength,
//             y: force.y * forceMultiplier + Math.sin(angle) * spiralStrength
//         };
//     },
    
//     /**
//      * BOUNCING - Energetic with sudden direction changes
//      * Good for: playfulness, surprise, shock
//      */
//     bouncing: (particle, force) => {
//         const forceMultiplier = 0.07 * (particle.maxSpeed / 0.5);
//         const bounce = particle.age % 30 === 0 ? (Math.random() - 0.5) * 0.2 : 0;
//         return {
//             x: force.x * forceMultiplier + bounce,
//             y: force.y * forceMultiplier + bounce
//         };
//     }
// };

const TrailPresets = {
    none: {
        enabled: false,
        length: 0,
        fadeRate: 1,
        width: 1
    },
    
    subtle: {
        enabled: true,
        length: 10,
        fadeRate: 0.15,
        width: 0.8
    },
    
    moderate: {
        enabled: true,
        length: 20,
        fadeRate: 0.08,
        width: 1
    },
    
    strong: {
        enabled: true,
        length: 30,
        fadeRate: 0.04,
        width: 1.5
    },
    
    persistent: {
        enabled: true,
        length: 40,
        fadeRate: 0.02,
        width: 1.2
    },
    
    sparkle: {
        enabled: true,
        length: 15,
        fadeRate: 0.12,
        width: 0.6
    },
    
    comet: {
        enabled: true,
        length: 35,
        fadeRate: 0.05,
        width: 2
    }
};