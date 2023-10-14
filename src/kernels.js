function linear(radius, dist) {
    return Math.max(0, radius - dist);
}

function cubed(radius, dist) {
    return Math.max(0, radius - dist) ** 3;
}

function power5(radius, dist) {
    return Math.max(0, radius - dist) ** 5;
}

function smoothTop(radius, dist) {
    return Math.max(0, radius * radius - dist * dist) ** 3;
}

export { linear, cubed, smoothTop, power5 };
