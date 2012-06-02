uniform sampler2DRect dim3Tex;

void main(void)
{
	float	bright;
	vec4	tex;
	
	tex=texture2DRect(dim3Tex,gl_FragCoord.st);
	
	bright=(tex.r+tex.g+tex.b)/3.0;
	tex+=(bright*bright);
	
	gl_FragColor=tex;
}
