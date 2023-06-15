export function corClaraRandomica() {
    var r = Math.floor(Math.random() * 56) + 200;
    var g = Math.floor(Math.random() * 56) + 200;
    var b = Math.floor(Math.random() * 56) + 200;

    var ajuste = Math.floor(Math.random() * 56);
    r -= ajuste;
    g -= ajuste;
    b -= ajuste;

    r = Math.max(0, r);
    g = Math.max(0, g);
    b = Math.max(0, b);

    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}