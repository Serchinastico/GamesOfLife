vec3 getColorAt(int dx, int dy) {
    return texture2D(uState, (gl_FragCoord.xy + vec2(dx, dy)) / uScale).rgb;
}

int isAlive(int dx, int dy) {
    return int(texture2D(uState, (gl_FragCoord.xy + vec2(dx, dy)) / uScale).r);
}

/**
 * @see https://thebookofshaders.com/10/
 */
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}