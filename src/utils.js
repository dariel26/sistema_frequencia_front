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

export function gerarChaveUnica() {
    const timestamp = Date.now().toString();
    const randomNum = Math.random().toString(36).substring(2, 5);

    return `${timestamp}-${randomNum}`;
}

export function formatarData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}/${mes}/${dia}`;
}