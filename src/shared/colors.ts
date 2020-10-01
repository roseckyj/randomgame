export function getTerrainColor(number: number): string {
    switch (number) {
        case 1: // Grass
            return '#67943F';
        case 2: // Water
            return '#2EB0E5';
        case 4: // Sand
            return '#FDDC86';
    }
    return '#DDDDDD';
}

export function getEntityColor(type: string): string {
    switch (type) {
        case 'tree':
            return '#2A4323';
        case 'player':
            return '#000dff';
        case 'stone':
            return '#dddddd';
    }
    return '#DDDDDD';
}
