function squareDistance(pos1, pos2) {
    if (!pos2) {
        pos2 = { x: 0, y: 0 };
    }
    const deltaX = pos1.x - pos2.x;
    const deltaY = pos1.y - pos2.y;
    return deltaX * deltaX + deltaY * deltaY;
}

function distance(pos1, pos2) {
    if (!pos2) {
        pos2 = { x: 0, y: 0 };
    }
    const deltaX = pos1.x - pos2.x;
    const deltaY = pos1.y - pos2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * A function that checks if 2 positions are within a certain distance, with certain optimizations.
 */
function isWithin1(pos1, pos2, dist) {
    const deltaX = Math.abs(pos1.x - pos2.x);
    const deltaY = Math.abs(pos1.y - pos2.y);

    if (deltaX > dist || deltaY > dist) {
        return false;
    }

    const inner_dist = dist * Math.SQRT1_2;
    if (deltaX <= inner_dist && deltaY <= inner_dist) {
        return true;
    }

    return squareDistance(pos1, pos2) <= (dist * dist);
}

function isWithin2(pos1, pos2, dist) {
    return squareDistance(pos1, pos2) <= (dist * dist);
}

function isWithin3(pos1, pos2, dist) {
    return distance(pos1, pos2) <= dist;
}


function randomPos(limit) {
    const x = Math.random() * limit * (Math.random() > 0.5 ? -1 : 1);
    const y = Math.random() * limit * (Math.random() > 0.5 ? -1 : 1);
    return { x, y };
}

function newInstant() {
    return {
        start: new Date().getTime(),
        get elapsed() {
            return new Date().getTime() - this.start;
        },
    }
}

function testIsWithin() {
    const posList = [];
    for (let i = 0; i < 1000; i++) {
        posList.push(randomPos(2));
    }

    const funcs = [isWithin1, isWithin1, isWithin2, isWithin2, isWithin3, isWithin3];

    for (const func of funcs) {
        let count = 0;
        let isWithinResults = [];
        const start = newInstant();
        while (start.elapsed < 5000) {
            const iPos = count % posList.length;
            isWithinResults[iPos] = func({ x: 0, y: 0 }, posList[iPos], 1);
            count++;
        }

        console.log({ name: func.name, count, isWithinCount: isWithinResults.filter(x => x).length });
    }
}

for (let i = 0; i < 10; i++) {
    console.log(`i: ${i}`);
    testIsWithin();
}
