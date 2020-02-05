import {VertexColors} from 'three/src/constants';
import {UniformsUtils} from 'three/src/renderers/shaders/UniformsUtils';
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial';
import {ShaderLib} from 'three/src/renderers/shaders/ShaderLib';
import {FrontSide} from 'three/src/constants';

import {ShaderAssemblerMesh} from './_BaseMesh';
// import {ShaderType, ShaderName, LineType, SHADER_NAMES, LINE_TYPES} from 'src/Engine/Node/Gl/Util/CodeBuilder'

// const BEGIN_NORMAL_VERTEX_LINE = '	#include <beginnormal_vertex>'
// const BEGIN_VERTEX_LINE = '	#include <begin_vertex>'
// const FRAGMENT_SPLIT = "vec4 diffuseColor = "

export class ShaderAssemblerLambert extends ShaderAssemblerMesh {
	// _color_declaration() { return 'vec4 diffuseColor' }
	get _template_shader() {
		const template = ShaderLib.lambert;
		return {
			vertexShader: template.vertexShader, //TemplateVertex,
			fragmentShader: template.fragmentShader, //TemplateFragment,
			uniforms: template.uniforms,
		};
	}
	_create_material() {
		// console.log(ShaderLib.lambert)

		const template_shader = this._template_shader;
		// console.log(template_shader.uniforms)
		return new ShaderMaterial({
			vertexColors: VertexColors,
			side: FrontSide,
			transparent: true,
			fog: true,
			lights: true,

			depthTest: true,
			alphaTest: 0.5,
			// defines: {
			// 	USE_UV: 1,
			// 	USE_COLOR: 1,
			// },

			uniforms: UniformsUtils.clone(template_shader.uniforms),
			vertexShader: template_shader.vertexShader,
			fragmentShader: template_shader.fragmentShader,
		});
	}
}