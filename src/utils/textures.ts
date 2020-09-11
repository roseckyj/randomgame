export const IMAGES = {
    grass: new Image(),
    player: new Image(),
};

export function loadTextures() {
    IMAGES.player.src = 'resources/textures/face.png';
    IMAGES.grass.src = 'resources/textures/green_concrete_powder.png';
}
