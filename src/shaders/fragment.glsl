uniform sampler2D uState;
uniform vec2 uScale;
uniform int uBorn;
uniform int uSurvive;

float get(int x, int y) {
    return texture2D(uState, (gl_FragCoord.xy + vec2(x, y)) / uScale).x;
}

void main() {
    float sum = get(-1, -1) +
        get(-1, 0) +
        get(-1, 1) +
        get(0, -1) +
        get(0, 1) +
        get(1, -1) +
        get(1, 0) +
        get(1, 1);

    float current = get(0, 0);
    if(current > 0.0 && sum < 2.5) {
        gl_FragColor = vec4(vec3(clamp(current * 0.99, 0.0, 1.0)), 1.0);
    } else if(current > 0.0 && sum >= 2.0 && sum <= 3.0) {
        gl_FragColor = vec4(vec3(clamp(current * 1.01, 0.0, 1.0)), 1.0);
    } else if(current > 0.0 && sum > 3.0 && sum < 4.0) {
        gl_FragColor = vec4(vec3(clamp(current * 0.99, 0.0, 1.0)), 1.0);
    } else if(current > 0.0 && sum >= 5.0) {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    } else if(current == 0.0 && sum > 2.0 && sum < 3.0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}