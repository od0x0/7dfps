uniform sampler2D dim3Tex;

void main(void)
{
	vec4 tex=texture2D(dim3Tex,gl_TexCoord[0].st);
	float col=(tex.r+tex.g+tex.b)*0.33;
	gl_FragColor=vec4(col,col,col,tex.a);
}
