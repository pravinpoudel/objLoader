const vs = `#version 300 es

#define M_PI 3.1415926535897932384626433832795

in vec3 a_position;
in float a_textureCordinate;

uniform mat4 u_ModelMatrix;
uniform mat4 u_wvProjectionMatrix;

out vec3 vertexCordinate;
out vec2 uvCordinate;

void main(){

    vec3 vertDirection = normalize(vec3(a_position) - vec3(0.0, 0.0, 0.0));
    float u = atan(vertDirection.x, vertDirection.z)/(2.0*M_PI) + 0.5;
    float v = 0.5-vertDirection.y ;
    uvCordinate = vec2(u,v);

    gl_Position =  u_wvProjectionMatrix* vec4((2.0*a_position)- vec3(1.0, 1.0, 1.0), 1.0);  
    gl_Position =   vec4(a_position, 1.0);
    vertexCordinate = 0.5 - a_position;   
}
`;

const fs = `#version 300 es


precision highp float;

in vec3 vertexCordinate;
uniform sampler2D u_sphereText;

out vec4 outColor;
in vec2 uvCordinate;



void main(){
 
    // vec3 vertDirection = normalize(vertexCordinate - vec3(0.0, 0.0, 0.0));
    // float u = atan(vertDirection.x, vertDirection.z)/(2.0*M_PI) + 0.5;
    // float v = 0.5-vertDirection.y ;

    outColor = texture(u_sphereText, uvCordinate);
    // outColor = vec4(0.0, 0.8,  0.0, 1.0);
}

`;

const vsTriangle = `#version 300 es
    in vec3 a_position;
    in vec2 a_textureCordinate;

    out vec3 varying_color;

    uniform mat4 u_vpMatrix;


    void main(){
        gl_Position = u_vpMatrix*vec4(a_position, 1.0);
        varying_color = a_position;
    }
`;

const fsTriangle = `#version 300 es

    precision mediump float;
    in vec3 varying_color;
    
    uniform mat4 u_model;
    uniform mat4 u_VPmatrix;


    out vec4 outColor;

    void main(){
        outColor = vec4(1.0, 0.0, 0.0, 0.7);
    }
`;

const vsSkybox = `#version 300 es
in vec3 a_position;
in vec3 a_normal;


uniform mat4 u_VPmatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_invTransposeNormal;

out vec3 v_normal;
out vec3 f_position;
out vec3 texPosition;

void main(){
    texPosition = a_position;
    v_normal = vec3(u_invTransposeNormal*vec4(a_normal, 0.0)).xyz;
    f_position = vec3(u_modelMatrix*vec4(a_position, 1.0)).rgb;
    gl_Position = u_VPmatrix*u_modelMatrix*(vec4(a_position, 1.0));
}
`;

const fsSkybox = `#version 300 es

precision highp float;

in vec3 texPosition;
in vec3 v_normal;
in vec3 f_position;

out vec4 outColor;

// uniform samplerCube u_SkyTexture;

uniform vec3 materialAmbient;

uniform vec3 emission;

uniform vec3 materialDiffuse;
uniform vec3 materialSpecular;
uniform float shininess;

uniform vec3 lightDirection;
uniform vec3 cameraPosition;

uniform vec3 ambientLight;
uniform vec3 diffuseLight;
uniform vec3 specularLight;

void main(){

    vec3 f_normal = normalize(v_normal);

    vec3 effectiveAmbient = ambientLight*materialAmbient;

    vec3 f_lightDirection = normalize(lightDirection);

    float lambertCofficient = max(dot(f_lightDirection, f_normal), 0.0);
    vec3 effectiveDiffuse = lambertCofficient*materialDiffuse*diffuseLight;

    vec3 surfacetoView = normalize(cameraPosition - f_position);
    vec3 halfVector = lightDirection + surfacetoView;
    float specular = max(dot(halfVector, f_normal), 0.0);
    vec3 effectiveSpecular = specularLight*materialSpecular*pow(specular, shininess); 

    outColor = vec4(emission + effectiveAmbient + effectiveDiffuse + effectiveSpecular, 1.0);

    outColor = vec4(effectiveAmbient+ effectiveDiffuse , 1.0);

    // outColor = texture(u_SkyTexture, texPosition);
    //  outColor = vec4(0.0, 1.0, 0.0, 1.0);    
}
`;
