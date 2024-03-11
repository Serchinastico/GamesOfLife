uniform sampler2D uState;
uniform vec2 uScale;
uniform int uBorn;
uniform int uSurvive;
uniform float uSeed;
uniform vec4 uSteps;

vec3 get(int x, int y) {
    return texture2D(uState, (gl_FragCoord.xy + vec2(x, y)) / uScale).rgb;
}

vec3 getMultiplier(vec3 sum) {
    float positiveMultiplier = 1.001;
    float negativeMultiplier = 0.999;

    if(sum.r > sum.g + sum.b) {
        return vec3(positiveMultiplier, negativeMultiplier, negativeMultiplier);
    } else if(sum.g > sum.r + sum.b) {
        return vec3(negativeMultiplier, positiveMultiplier, negativeMultiplier);
    } else if(sum.b > sum.r + sum.g) {
        return vec3(negativeMultiplier, negativeMultiplier, positiveMultiplier);
    }
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

void main() {
    vec3 adjacentSum = get(-1, -1) +
        get(-1, 0) +
        get(-1, 1) +
        get(0, -1) +
        get(0, 1) +
        get(1, -1) +
        get(1, 0) +
        get(1, 1);

    vec3 farSum = get(-2, -2) +
        get(-2, -1) +
        get(-2, 0) +
        get(-2, 1) +
        get(-2, 2) +
        get(-1, 2) +
        get(0, 2) +
        get(1, 2) +
        get(2, 2) +
        get(2, 1) +
        get(2, 0) +
        get(2, -1) +
        get(2, -2) +
        get(1, -2) +
        get(0, -2) +
        get(-1, -2);

    vec3 sum = adjacentSum + farSum * 0.0;

    vec3 multiplier = getMultiplier(sum);

    vec3 current = get(0, 0);
    float totalSum = sum.r;

    vec4 steps = uSteps * 8.0;
    if(totalSum < steps.x) {
        gl_FragColor = vec4(vec3(current * 0.999), 1.0);
    } else if(totalSum < steps.y) {
        gl_FragColor = vec4(vec3(current * 1.005), 1.0);
    } else if(totalSum < steps.z) {
        gl_FragColor = vec4(vec3(current * 0.999), 1.0);
    } else if(totalSum < steps.z) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
    // if(totalSum > 6.0) {
    //     gl_FragColor = vec4(vec3(current * 0.05), 1.0);
    // } else if(totalSum <= 4.0) {
    //     float rnd = random(gl_FragCoord.xy);
    //     if(rnd <= 0.33) {
    //         gl_FragColor = vec4(1.0, 0.5, 0.25, 1.0);
    //     } else if(rnd <= 0.66) {
    //         gl_FragColor = vec4(0.25, 1.0, 0.5, 1.0);
    //     } else {
    //         gl_FragColor = vec4(0.5, 0.25, 1.0, 1.0);
    //     }
    // } else {
    //     gl_FragColor = vec4(current * multiplier, 1.0);
    // }

    // if((current.r > 0.0) && ((sum.g + sum.b) < 5.0)) {
    //     gl_FragColor = vec4(current.r * 1.1, current.g * 0.9, current.b * 0.9, 1.0);
    // } else if((current.g > 0.0) && ((sum.r + sum.b) < 5.0)) {
    //     gl_FragColor = vec4(current.r * 0.9, current.g * 1.1, current.b * 0.9, 1.0);
    // } else if((current.b > 0.0) && ((sum.r + sum.g) < 5.0)) {
    //     gl_FragColor = vec4(current.r * 0.9, current.g * 0.9, current.b * 1.1, 1.0);
    // } else if(current > 0.0 && sum >= 2.25 && sum <= 4.5) {
    //     gl_FragColor = vec4(vec3(clamp(current * 1.15, 0.0, 1.0)), 1.0);
    // } else if(current > 0.0 && sum > 4.5 && sum < 7.0) {
    //     gl_FragColor = vec4(vec3(clamp(current * 0.9, 0.0, 1.0)), 1.0);
    // } else if(current > 0.0 && sum >= 7.0) {
    //     gl_FragColor = vec4(vec3(0.0), 1.0);
    // } else if(current == 0.0 && sum > 2.0 && sum < 5.0) {
    //     gl_FragColor = vec4(vec3(1.0), 1.0);
    // } else {
    //     gl_FragColor = vec4(current * 0.9, 1.0);
    // }
}