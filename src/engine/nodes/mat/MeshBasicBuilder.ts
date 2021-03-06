import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {ColorParamConfig, ColorsController} from './utils/UniformsColorsController';
import {SideParamConfig, SideController} from './utils/SideController';
import {DepthController, DepthParamConfig} from './utils/DepthController';
import {SkinningParamConfig, SkinningController} from './utils/SkinningController';
import {TextureMapParamConfig, TextureMapController} from './utils/TextureMapController';
import {TextureAlphaMapParamConfig, TextureAlphaMapController} from './utils/TextureAlphaMapController';
import {ShaderAssemblerBasic} from '../gl/code/assemblers/materials/Basic';
import {TypedBuilderMatNode} from './_BaseBuilder';
import {Poly} from '../../Poly';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
class MeshBasicMatParamsConfig extends TextureAlphaMapParamConfig(
	TextureMapParamConfig(SkinningParamConfig(DepthParamConfig(SideParamConfig(ColorParamConfig(NodeParamsConfig)))))
) {}
const ParamsConfig = new MeshBasicMatParamsConfig();

export class MeshBasicBuilderMatNode extends TypedBuilderMatNode<ShaderAssemblerBasic, MeshBasicMatParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'mesh_basic_builder';
	}
	public used_assembler(): Readonly<AssemblerName.GL_MESH_BASIC> {
		return AssemblerName.GL_MESH_BASIC;
	}
	protected _create_assembler_controller() {
		return Poly.instance().assemblers_register.assembler(this, this.used_assembler());
	}

	readonly texture_map_controller: TextureMapController = new TextureMapController(this, {uniforms: true});
	readonly texture_alpha_map_controller: TextureAlphaMapController = new TextureAlphaMapController(this, {
		uniforms: true,
	});
	readonly depth_controller: DepthController = new DepthController(this);
	initialize_node() {
		this.params.on_params_created('init controllers', () => {
			this.texture_map_controller.initialize_node();
			this.texture_alpha_map_controller.initialize_node();
		});
	}

	async cook() {
		this.compile_if_required();

		ColorsController.update(this);
		SideController.update(this);
		SkinningController.update(this);
		TextureMapController.update(this);
		TextureAlphaMapController.update(this);
		this.depth_controller.update();

		this.set_material(this.material);
	}
}
