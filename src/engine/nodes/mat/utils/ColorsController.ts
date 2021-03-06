import {BaseController} from './_BaseController';
import {TypedMatNode} from '../_Base';
import {Material} from 'three/src/materials/Material';
import {Color} from 'three/src/math/Color';

import {NodeParamsConfig, ParamConfig} from '../../utils/params/ParamsConfig';

export function ColorParamConfig<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		color = ParamConfig.COLOR([1, 1, 1]);
		use_vertex_colors = ParamConfig.BOOLEAN(0);
		transparent = ParamConfig.BOOLEAN(0);
		opacity = ParamConfig.FLOAT(1);
		alpha_test = ParamConfig.FLOAT(0);
		use_fog = ParamConfig.BOOLEAN(0);
	};
}

class ColoredMaterial extends Material {
	public color!: Color;
	vertexColors!: boolean;
	transparent!: boolean;
	depthTest!: boolean;
	alphaTest!: number;
	fog!: boolean;
}
class ColorParamsConfig extends ColorParamConfig(NodeParamsConfig) {}
class ColoredMatNode extends TypedMatNode<ColoredMaterial, ColorParamsConfig> {
	create_material() {
		return new ColoredMaterial();
	}
}

export class ColorsController extends BaseController {
	constructor(protected node: ColoredMatNode) {
		super(node);
	}
	static update(node: ColoredMatNode) {
		const material = node.material;
		const pv = node.pv;

		material.color.copy(pv.color);
		const new_vertex_color = pv.use_vertex_colors; // ? VertexColors : NoColors;
		if (new_vertex_color != material.vertexColors) {
			material.vertexColors = new_vertex_color;
			material.needsUpdate = true;
		}

		material.opacity = pv.opacity;
		material.transparent = pv.transparent || pv.opacity < 1;
		material.depthTest = true;
		material.alphaTest = pv.alpha_test;
		material.fog = pv.use_fog;
	}
}
