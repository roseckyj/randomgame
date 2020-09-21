export function shadeText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 2;

    ctx.strokeText(text, x, y);
    ctx.strokeText(text, x + 1, y + 1);
    ctx.fillText(text, x, y);
}
