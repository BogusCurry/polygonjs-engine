import {TypedPostProcessNode, TypedPostNodeContext, PostParamOptions} from './_Base';
import {VignetteShader} from '../../../../modules/three/examples/jsm/shaders/VignetteShader';
import {ShaderPass} from '../../../../modules/three/examples/jsm/postprocessing/ShaderPass';
import {IUniformN} from '../utils/code/gl/Uniforms';

interface VignettePassWithUniforms extends ShaderPass {
	uniforms: {
		offset: IUniformN;
		darkness: IUniformN;
	};
}
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class VignettePostParamsConfig extends NodeParamsConfig {
	offset = ParamConfig.FLOAT(1, {
		range: [0, 1],
		range_locked: [false, false],
		...PostParamOptions,
	});
	darkness = ParamConfig.FLOAT(1, {
		range: [0, 2],
		range_locked: [true, false],
		...PostParamOptions,
	});
}
const ParamsConfig = new VignettePostParamsConfig();

export class VignettePostNode extends TypedPostProcessNode<ShaderPass, VignettePostParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'vignette';
	}

	protected _create_pass(context: TypedPostNodeContext) {
		const pass = new ShaderPass(VignetteShader) as VignettePassWithUniforms;
		this.update_pass(pass);

		return pass;
	}
	update_pass(pass: VignettePassWithUniforms) {
		pass.uniforms.offset.value = this.pv.offset;
		pass.uniforms.darkness.value = this.pv.darkness;
	}
}
