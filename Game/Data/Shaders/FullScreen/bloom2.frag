uniform sampler2DRect dim3Tex;

void main()
{
	vec4 map;
	vec4 blurSample = vec4(0.0);

	float blurSize = 2.0;
	float blurStrength = 5.0;

	map = texture2DRect(dim3Tex, gl_FragCoord.st);

	for (int x = 0; x<8; x++) {
		for(int y = 0; y<8; y++) {
			blurSample += texture2DRect(dim3Tex,vec2(gl_FragCoord.s+blurSize*float(y-4),gl_FragCoord.t+blurSize*float(x-4)));
		}
	}
	
	gl_FragColor = map+blurSample/20.0;
}
