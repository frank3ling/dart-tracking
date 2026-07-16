const { test } = require('node:test');
const assert = require('node:assert/strict');

const { generateUUID, formatDartResult, calculatePoints, calculateStatistics } = require('../shared.js');

function dart(type, target = 20) {
    return {
        type,
        hit: type !== 'miss',
        points: calculatePoints(target, type),
        target
    };
}

function makeThrow(darts, timestamp = '2026-01-01T10:00:00.000Z') {
    return {
        id: generateUUID(),
        target: darts.find(d => d)?.target ?? 20,
        darts,
        totalPoints: darts.reduce((sum, d) => sum + (d ? d.points : 0), 0),
        timestamp
    };
}

test('calculatePoints: Single/Double/Triple/Miss auf Zahlenfeldern', () => {
    assert.equal(calculatePoints(20, 'single'), 20);
    assert.equal(calculatePoints(20, 'double'), 40);
    assert.equal(calculatePoints(20, 'triple'), 60);
    assert.equal(calculatePoints(7, 'triple'), 21);
    assert.equal(calculatePoints(20, 'miss'), 0);
});

test('calculatePoints: Bull hat nur 25 und 50', () => {
    assert.equal(calculatePoints(25, 'single'), 25);
    assert.equal(calculatePoints(25, 'double'), 50);
    assert.equal(calculatePoints(25, 'miss'), 0);
});

test('formatDartResult: nutzt das Ziel, nicht die Punkte', () => {
    assert.equal(formatDartResult(dart('single', 20)), '20');
    assert.equal(formatDartResult(dart('double', 20)), 'D20');
    assert.equal(formatDartResult(dart('triple', 20)), 'T20');
    assert.equal(formatDartResult(dart('single', 25)), 'B');
    assert.equal(formatDartResult(dart('double', 25)), 'DB');
    assert.equal(formatDartResult(dart('miss')), 'Miss');
});

test('generateUUID: liefert UUID-Format', () => {
    assert.match(generateUUID(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    assert.notEqual(generateUUID(), generateUUID());
});

test('calculateStatistics: leere Eingabe liefert Null-Statistik', () => {
    const stats = calculateStatistics([]);
    assert.equal(stats.totalThrows, 0);
    assert.equal(stats.totalDarts, 0);
    assert.equal(stats.accuracy.overall, 0);
    assert.deepEqual(stats.accuracy.byPosition, [0, 0, 0]);
});

test('calculateStatistics: Kategorien sind lückenlose Bänder', () => {
    const throws = [
        makeThrow([dart('miss'), dart('miss'), dart('miss')]),           // 0
        makeThrow([dart('single'), dart('miss'), dart('miss')]),         // 20 → low
        makeThrow([dart('single'), dart('single'), dart('single')]),     // 60 → band60
        makeThrow([dart('double'), dart('double'), dart('miss')]),       // 80 → band80
        makeThrow([dart('triple'), dart('double'), dart('miss')]),       // 100 → band100
        makeThrow([dart('triple'), dart('triple'), dart('single')]),     // 140 → band140
        makeThrow([dart('triple'), dart('triple'), dart('triple')])      // 180
    ];

    const { categories, totalThrows } = calculateStatistics(throws);
    assert.equal(categories.zero, 1);
    assert.equal(categories.low, 1);
    assert.equal(categories.band60, 1);
    assert.equal(categories.band80, 1);
    assert.equal(categories.band100, 1);
    assert.equal(categories.band140, 1);
    assert.equal(categories.oneEighty, 1);

    const sum = Object.values(categories).reduce((a, b) => a + b, 0);
    assert.equal(sum, totalThrows, 'Kategorien-Summe muss totalThrows entsprechen');
});

test('calculateStatistics: 139 zählt als band100, 179 als band140', () => {
    const t139 = makeThrow([dart('triple'), dart('triple'), { type: 'single', hit: true, points: 19, target: 19 }]);
    const t179 = makeThrow([dart('triple'), dart('triple'), { type: 'triple', hit: true, points: 59, target: 20 }]);
    t139.totalPoints = 139;
    t179.totalPoints = 179;

    const { categories } = calculateStatistics([t139, t179]);
    assert.equal(categories.band100, 1);
    assert.equal(categories.band140, 1);
    assert.equal(categories.oneEighty, 0);
});

test('calculateStatistics: Trefferquote gesamt und pro Position', () => {
    const throws = [
        makeThrow([dart('single'), dart('miss'), dart('triple')]),
        makeThrow([dart('single'), dart('miss'), dart('miss')])
    ];

    const { accuracy, totalDarts } = calculateStatistics(throws);
    assert.equal(totalDarts, 6);
    assert.equal(accuracy.overall, 3 / 6);
    assert.deepEqual(accuracy.byPosition, [1, 0, 0.5]);
});

test('calculateStatistics: unvollständige Würfe (null-Darts) crashen nicht', () => {
    const throws = [
        makeThrow([dart('single'), null, null]),
        makeThrow([dart('triple'), dart('triple'), dart('triple')])
    ];

    const stats = calculateStatistics(throws);
    assert.equal(stats.totalDarts, 4);
    assert.equal(stats.accuracy.byPosition[1], 1, 'Position 2: 1 Treffer von 1 geworfenen Dart');
    assert.equal(stats.lastTenThrows.dartTypes.triple, 3);
    assert.equal(stats.lastTenThrows.dartTypes.single, 1);
});

test('calculateStatistics: Letzte-10 berücksichtigt nur die letzten 10 Würfe', () => {
    const oldThrow = makeThrow([dart('triple'), dart('triple'), dart('triple')], '2026-01-01T09:00:00.000Z');
    const recent = Array.from({ length: 10 }, (_, i) =>
        makeThrow([dart('miss'), dart('miss'), dart('miss')], `2026-01-01T10:0${Math.min(i, 9)}:00.000Z`));

    const stats = calculateStatistics([oldThrow, ...recent]);
    assert.equal(stats.lastTenThrows.oneEighty, 0, 'Der alte 180er darf nicht mitzählen');
    assert.equal(stats.lastTenThrows.zero, 10);
    assert.equal(stats.categories.oneEighty, 1, 'In der Gesamtstatistik zählt er aber');
});
