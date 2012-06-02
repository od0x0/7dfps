//
//black and white + noise shader
//
// by Bink
//

uniform sampler2DRect dim3Tex;
uniform float dim3FrequencySecond;

float rand(vec2 co)
{
	//pseudo random number
	//dim3FrequencySecond is used to change it over time and create the tv-static effect
	return fract(sin(dot(co.xy ,vec2(12.9898*dim3FrequencySecond,78.233))) * 43758.5453);

}

void main(void)
{
	vec4 tex = texture2DRect(dim3Tex,gl_FragCoord.st);
	vec4 col = vec4(0.0);
	//noise
	float n = rand(gl_FragCoord.st); //random number
	col.r = (tex.r+tex.g+tex.b)/3.0+n*0.1; //grayscale + random number *0.1
	col.g = col.r; //grayscale
	col.b = col.r; //grayscale
	gl_FragColor = col;
}
