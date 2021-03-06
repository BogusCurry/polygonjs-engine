import {TypedBuilderMatNode} from './_BaseBuilder';
import {ShaderAssemblerVolume} from '../gl/code/assemblers/materials/Volume';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {VolumeController} from './utils/VolumeController';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {Poly} from '../../Poly';
class VolumeMatParamsConfig extends NodeParamsConfig {
	color = ParamConfig.COLOR([1, 1, 1]);
	step_size = ParamConfig.FLOAT(0.01);
	density = ParamConfig.FLOAT(1);
	shadow_density = ParamConfig.FLOAT(1);
	light_dir = ParamConfig.VECTOR3([-1, -1, -1]);
}
const ParamsConfig = new VolumeMatParamsConfig();

export class VolumeBuilderMatNode extends TypedBuilderMatNode<ShaderAssemblerVolume, VolumeMatParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'volume_builder';
	}
	public used_assembler(): Readonly<AssemblerName.GL_VOLUME> {
		return AssemblerName.GL_VOLUME;
	}
	protected _create_assembler_controller() {
		return Poly.instance().assemblers_register.assembler(this, this.used_assembler());
	}

	private _volume_controller = new VolumeController(this);

	initialize_node() {}
	async cook() {
		this.compile_if_required();

		this._volume_controller.update_uniforms_from_params();

		this.set_material(this.material);
	}
}
