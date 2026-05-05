const PRIORITY_WEIGHTS={
    HIGH: 3,
    MEDIUM: 2,
    LOW: 0.5
};

const calculateDangerScore = (highPriority , mediumPriority , lowPriority ) => {
    return (highPriority * PRIORITY_WEIGHTS.HIGH) +
           (mediumPriority * PRIORITY_WEIGHTS.MEDIUM) +
           (lowPriority * PRIORITY_WEIGHTS.LOW);
};

const calculateDangerPercentage = (zoneSummaries) => {
    // Calculate score for each zone
    const scores = zoneSummaries.map(zone => ({
        zone: zone.zone,
        score: calculateDangerScore(zone.highPriority, zone.mediumPriority, zone.lowPriority)
    }));

    // Find max score for relative calculation
    const maxScore = Math.max(...scores.map(z => z.score), 1); // minimum 1 to avoid division by zero

    // Calculate percentage relative to max
    return scores.map(zone => ({
        zone: zone.zone,
        score: parseFloat(zone.score.toFixed(2)),
        percentage: parseFloat(((zone.score / maxScore) * 100).toFixed(2))
    }));
};

module.exports = { calculateDangerScore, calculateDangerPercentage, PRIORITY_WEIGHTS };
