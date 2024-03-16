vec4 getColorAt(int dx, int dy) {
    return texture2D(uState, (gl_FragCoord.xy + vec2(dx, dy)) / uScale).rgba;
}

vec4 getWeightedColorAt(int dx, int dy) {
    vec4 color = getColorAt(dx, dy);
    vec4 weight = texture2D(uWeights, vec2(dx + 2, dy + 2)).rgba;

    return color * weight;
}

int getIntColorAt(int dx, int dy) {
    vec4 color = getColorAt(dx, dy);

    return int(clamp(color.r + color.g + color.b, 0.0, 1.0));
}

bool isAlive(int dx, int dy) {
    return getIntColorAt(dx, dy) > 0;
}

bool isDead(int dx, int dy) {
    return getIntColorAt(dx, dy) == 0;
}

/**
 * @see https://thebookofshaders.com/10/
 */
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}