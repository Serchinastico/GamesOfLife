uniform sampler2D uState;
uniform vec2 uScale;
uniform int uBornRnd;
uniform int uSurviveRnd;

#include "./includes/utils.glsl";

void main() {
    int sum = isAlive(-1, -1) +
        isAlive(-1, 0) +
        isAlive(-1, 1) +
        isAlive(0, -1) +
        isAlive(0, 1) +
        isAlive(1, -1) +
        isAlive(1, 0) +
        isAlive(1, 1);

    /**
     * We transform the sum of surviving neighbors into a single bit inside an int.
     * In this case, if sum equals to 3, then sumbit will be 0b1000 (the 1 is in the 
     * 3rd position counting from the right and starting from 0).
     * With this information, we can AND with the uBorn and uSurvive masks and see if 
     * any of those rules apply.
     */ 
    int sumbit;
    if(sum == 0) {
        sumbit = 0;
    } else {
        sumbit = 1 << sum;
    }

    if((sumbit & uBornRnd) > 0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
    } else if((sumbit & uSurviveRnd) > 0) {
        int current = isAlive(0, 0);
        gl_FragColor = vec4(vec3(current), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}