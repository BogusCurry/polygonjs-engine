import {BaseNodeType} from '../_Base';
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial';
import {Texture} from 'three/src/textures/Texture';
import {Matrix3} from 'three/src/math/Matrix3';
import {IUniform} from 'three/src/renderers/shaders/UniformsLib';
import {ShaderMaterialWithCustomMaterials} from '../../../core/geometry/Material';
import {MaterialLoader} from 'three/src/loaders/MaterialLoader';
interface MaterialData {
	color?: boolean;
	lights?: boolean;
}
export class BasePersistedConfig {
	constructor(protected node: BaseNodeType) {}
	to_json(): object | void {}
	load(data: object) {}

	//
	//
	// SAVE MAT
	//
	//
	protected _material_to_json(material: ShaderMaterial): object {
		this._unassign_textures(material.uniforms);
		const material_data = material.toJSON({});
		if (material.lights != null) {
			material_data.lights = material.lights;
		}

		this._reassign_textures(material.uniforms);
		return material_data;
	}

	private _found_texture_by_id: Map<string, Texture> = new Map();
	private _found_textures_id_by_uniform_name: Map<string, string> = new Map();
	private _unassign_textures(uniforms: Dictionary<IUniform>) {
		this._found_texture_by_id.clear();
		this._found_textures_id_by_uniform_name.clear();
		const names = Object.keys(uniforms);
		for (let name of names) {
			const value = uniforms[name].value;
			if (value && value.uuid) {
				const texture = value as Texture;
				this._found_texture_by_id.set(texture.uuid, value);
				this._found_textures_id_by_uniform_name.set(name, texture.uuid);
				uniforms[name].value = null;
			}
		}
	}
	private _reassign_textures(uniforms: Dictionary<IUniform>) {
		const names_needing_reassignment: string[] = [];
		this._found_textures_id_by_uniform_name.forEach((texture_id, name) => {
			names_needing_reassignment.push(name);
		});
		for (let name of names_needing_reassignment) {
			const texture_id = this._found_textures_id_by_uniform_name.get(name);
			if (texture_id) {
				const texture = this._found_texture_by_id.get(texture_id);
				if (texture) {
					uniforms[name].value = texture;
				}
			}
		}
	}

	//
	//
	// LOAD MAT
	//
	//
	protected _load_material(data: MaterialData): ShaderMaterialWithCustomMaterials | undefined {
		// if (2 > 1) {
		// 	return;
		// }

		// hack fix for properties that are assumed to be on normal materials
		// but are not on ShaderMaterial
		data.color = undefined;

		const loader = new MaterialLoader();
		const material = loader.parse(data) as ShaderMaterialWithCustomMaterials;

		// compensates for lights not being saved (and therefore cannot be loaded correctly)
		if (data.lights != null) {
			material.lights = data.lights;
		}

		// fix matrix that may be loaded as a mat4 instead of a mat3
		const uv2Transform = material.uniforms.uv2Transform;
		if (uv2Transform) {
			this.mat4_to_mat3(uv2Transform);
		}
		const uvTransform = material.uniforms.uvTransform;
		if (uvTransform) {
			this.mat4_to_mat3(uvTransform);
		}

		return material as ShaderMaterialWithCustomMaterials;
	}
	private mat4_to_mat3(uniform: IUniform) {
		const mat4 = uniform.value;
		const last_element = mat4.elements[mat4.elements.length - 1];
		if (last_element == null) {
			const mat3 = new Matrix3();
			for (let i = 0; i < mat3.elements.length; i++) {
				mat3.elements[i] = mat4.elements[i];
			}
			uniform.value = mat3;
		}
	}
}
