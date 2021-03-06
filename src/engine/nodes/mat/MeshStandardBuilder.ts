import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {ColorParamConfig, ColorsController} from './utils/UniformsColorsController';
import {SideParamConfig, SideController} from './utils/SideController';
import {DepthController, DepthParamConfig} from './utils/DepthController';
import {SkinningParamConfig, SkinningController} from './utils/SkinningController';
import {TextureMapParamConfig, TextureMapController} from './utils/TextureMapController';
import {TextureAlphaMapParamConfig, TextureAlphaMapController} from './utils/TextureAlphaMapController';
import {TextureEnvMapController, TextureEnvMapParamConfig} from './utils/TextureEnvMapController';
import {TypedBuilderMatNode} from './_BaseBuilder';
import {ShaderAssemblerStandard} from '../gl/code/assemblers/materials/Standard';
import {BaseParamType} from '../../params/_Base';
import {BaseNodeType} from '../_Base';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {Poly} from '../../Poly';

import {SHADER_DEFAULTS} from './MeshStandard';

class MeshStandardMatParamsConfig extends TextureEnvMapParamConfig(
	TextureAlphaMapParamConfig(
		TextureMapParamConfig(
			SkinningParamConfig(DepthParamConfig(SideParamConfig(ColorParamConfig(NodeParamsConfig))))
		)
	)
) {
	metalness = ParamConfig.FLOAT(SHADER_DEFAULTS.metalness, {
		cook: false,
		callback: (node: BaseNodeType, param: BaseParamType) =>
			MeshStandardBuilderMatNode._update_metalness(node as MeshStandardBuilderMatNode),
	});
	roughness = ParamConfig.FLOAT(SHADER_DEFAULTS.roughness, {
		cook: false,
		callback: (node: BaseNodeType, param: BaseParamType) =>
			MeshStandardBuilderMatNode._update_roughness(node as MeshStandardBuilderMatNode),
	});
}
const ParamsConfig = new MeshStandardMatParamsConfig();

export class MeshStandardBuilderMatNode extends TypedBuilderMatNode<
	ShaderAssemblerStandard,
	MeshStandardMatParamsConfig
> {
	params_config = ParamsConfig;
	static type() {
		return 'mesh_standard_builder';
	}
	public used_assembler(): Readonly<AssemblerName.GL_MESH_STANDARD> {
		return AssemblerName.GL_MESH_STANDARD;
	}
	protected _create_assembler_controller() {
		return Poly.instance().assemblers_register.assembler(this, this.used_assembler());
	}

	readonly texture_map_controller: TextureMapController = new TextureMapController(this, {uniforms: true});
	readonly texture_alpha_map_controller: TextureAlphaMapController = new TextureAlphaMapController(this, {
		uniforms: true,
	});
	readonly texture_env_map_controller: TextureEnvMapController = new TextureEnvMapController(this, {
		uniforms: true,
		direct_params: true,
		define: false,
	});
	readonly depth_controller: DepthController = new DepthController(this);
	initialize_node() {
		this.params.on_params_created('init controllers', () => {
			this.texture_map_controller.initialize_node();
			this.texture_alpha_map_controller.initialize_node();
			this.texture_env_map_controller.initialize_node();
		});
	}

	async cook() {
		this.compile_if_required();

		ColorsController.update(this);
		SideController.update(this);
		SkinningController.update(this);
		TextureMapController.update(this);
		TextureAlphaMapController.update(this);
		TextureEnvMapController.update(this);
		this.depth_controller.update();

		if (this._material) {
			this._material.uniforms.envMapIntensity.value = this.pv.env_map_intensity;
			MeshStandardBuilderMatNode._update_metalness(this);
			MeshStandardBuilderMatNode._update_roughness(this);
		}

		this.set_material(this.material);
	}
	static _update_metalness(node: MeshStandardBuilderMatNode) {
		node.material.uniforms.metalness.value = node.pv.metalness;
	}
	static _update_roughness(node: MeshStandardBuilderMatNode) {
		node.material.uniforms.roughness.value = node.pv.roughness;
	}
}
