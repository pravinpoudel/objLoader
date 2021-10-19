const loader_VS = `#version 300 es

// you can make in vec4 a_position; glsl will add more data than pointer point with 1.0

in vec3 a_position;
in vec3 a_color;
in vec3 a_normal;
in vec3 a_tangent;
in vec3 a_bitangent;
in vec2 a_texCord;

out vec3 v_position;
out vec3 v_color;
out vec3 v_normalWorld;
out vec3 surfaceView;
out vec3 lightDirection;
out vec2 v_texCord;

out vec3 tangentWorld;

uniform mat4 u_modelMatrix;
uniform mat4 u_vpMatrix;

uniform mat4 u_worldNormal;

uniform vec3 u_cameraWorld;

uniform float u_scale;

void main(){

    v_position = a_position;
    vec4 worldPosition = u_modelMatrix*vec4(a_position, 1.0);
    mat3 modelMatrix3x3 = mat3(u_worldNormal);
   
    tangentWorld = modelMatrix3x3 * a_tangent ;
    vec3 biTangentWorld = modelMatrix3x3 * a_bitangent; 
    v_normalWorld = (modelMatrix3x3*a_normal);

    // mat3 TBN = mat3( tangentWorld, biTangentWorld, v_normalWorld);
    // mat3 invTBN = transpose(TBN);

    surfaceView = (u_cameraWorld- vec3(worldPosition));
    
    v_color = a_color;
    v_texCord = a_texCord;
    gl_Position = u_vpMatrix*u_modelMatrix*vec4(a_position*u_scale, 1.0);
}
`;

const loader_FS = `#version 300 es

#if GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else 
    precision mediump float;
#endif

in vec3 v_position;
in vec3 v_color;
in vec2 v_texCord;
in vec3 v_normalWorld;
in vec3 surfaceView;
in vec3 lightDirection;

in vec3 tangentWorld;
out vec4 outColor;

uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 specular;

uniform sampler2D diffuseSampler;
uniform sampler2D normalSampler;
uniform sampler2D specularSampler;

uniform vec3 u_lightDirection;

uniform vec3 emmisive;
uniform float shininess;
uniform float opacity;
uniform vec3 u_ambientLight;

uniform bool hasNormal;

void main(){

    vec3 normal = normalize(v_normalWorld);
    vec3 tangent = normalize(tangentWorld);
    vec3 biTangent = normalize(cross(normal, tangent));

    mat3 TBN = mat3(tangent, biTangent, normal);

    vec3 viewDirection = normalize(surfaceView);

    vec3 lightDirectionNormalized = normalize(u_lightDirection);

    vec3 normalDirection = 2.0*(texture(normalSampler, v_texCord).rgb)-1.0;
    normalDirection = normalize(TBN*normalDirection);

    vec3 ambientLight =ambient*u_ambientLight;

    vec3 directionalLight = vec3(0.8, 0.8, 0.8);    

    float lambertianFactor = clamp(dot(normal, lightDirectionNormalized), 0.0, 1.0);
    vec3 diffuseTextureData = texture(diffuseSampler, v_texCord).rgb;
    vec3 effectiveDiffuse = diffuseTextureData*diffuse*lambertianFactor*directionalLight;    
    effectiveDiffuse = diffuseTextureData*diffuse*lambertianFactor;

    vec3 halfVector = normalize(lightDirectionNormalized + viewDirection);
    float specularLight = clamp(dot(halfVector, normal), 0.0, 1.0);
    vec3 specularTextureData = texture(specularSampler, v_texCord).rgb;
    vec3 effectiveSpecular = specularTextureData*specular*pow(specularLight, shininess);

    outColor = vec4( emmisive+ ambientLight + effectiveDiffuse + effectiveSpecular, 1.0);
    // outColor = vec4(1.0,1.0,1.0, 0.5); 
    // diffuseTextureData = texture(diffuseSampler, v_texCord).rgb;
    // outColor = vec4(diffuseTextureData, 1.0);

}
`;
