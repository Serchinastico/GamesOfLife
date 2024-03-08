uniform sampler2D uState;
uniform vec2 uScale;
uniform int uBorn;
uniform int uSurvive;

float get(int x, int y) {
    return texture2D(uState, (gl_FragCoord.xy + vec2(x, y)) / uScale).r;
}

int getInt(int x, int y) {
    return int(get(x, y));
}

void main() {
    int sum = getInt(-1, -1) +
        getInt(-1, 0) +
        getInt(-1, 1) +
        getInt(0, -1) +
        getInt(0, 1) +
        getInt(1, -1) +
        getInt(1, 0) +
        getInt(1, 1);

    /**
     * We transform the sum of surviving neighbors into a single bit inside an int.
     * In this case, if sum equals to 3, then sumbit will be 0b1000 (the 1 is in the 
     * 3rd position counting from the right and starting from 0)
     */ 
    int sumbit;
    if(sum == 0) {
        sumbit = 0;
    } else {
        sumbit = 1 << sum;
    }

    if((sumbit & uBorn) > 0) {
        gl_FragColor = vec4(vec3(1.0), 1.0);
    } else if((sumbit & uSurvive) > 0) {
        float current = get(0, 0);
        gl_FragColor = vec4(vec3(current), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}