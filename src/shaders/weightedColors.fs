uniform sampler2D uState;
uniform vec2 uScale;
uniform int uBornRnd;
uniform int uSurviveRnd;
uniform sampler2D uWeights;

#include "./includes/utils.glsl";

void main() {
    vec4 innerSum = getWeightedColorAt(-1, -1) +
        getWeightedColorAt(-1, 0) +
        getWeightedColorAt(-1, 1) +
        getWeightedColorAt(0, -1) +
        getWeightedColorAt(0, 1) +
        getWeightedColorAt(1, -1) +
        getWeightedColorAt(1, 0) +
        getWeightedColorAt(1, 1);

    vec4 outerSum = getWeightedColorAt(-2, -2) +
        getWeightedColorAt(-2, -1) +
        getWeightedColorAt(-2, 0) +
        getWeightedColorAt(-2, 1) +
        getWeightedColorAt(-2, 2) +
        getWeightedColorAt(-1, 2) +
        getWeightedColorAt(0, 2) +
        getWeightedColorAt(1, 2) +
        getWeightedColorAt(2, 2) +
        getWeightedColorAt(2, 1) +
        getWeightedColorAt(2, 0) +
        getWeightedColorAt(2, -1) +
        getWeightedColorAt(2, -2) +
        getWeightedColorAt(1, -2) +
        getWeightedColorAt(0, -2) +
        getWeightedColorAt(-1, -2);

    vec4 weightsSum = innerSum + outerSum;

    int sum = getIntColorAt(-1, -1) +
        getIntColorAt(-1, 0) +
        getIntColorAt(-1, 1) +
        getIntColorAt(0, -1) +
        getIntColorAt(0, 1) +
        getIntColorAt(1, -1) +
        getIntColorAt(1, 0) +
        getIntColorAt(1, 1);

    // gl_FragColor = vec4(sum.rgb, 1.0);

    int sumbit;
    if(sum == 0) {
        sumbit = 0;
    } else {
        sumbit = 1 << sum;
    }

    if((sumbit & uBornRnd) > 0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
    } else if((sumbit & uSurviveRnd) > 0) {
        int current = getIntColorAt(0, 0);
        gl_FragColor = vec4(weightsSum.rgb * vec3(current), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}