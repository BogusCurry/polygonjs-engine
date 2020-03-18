import {TypedSopNode} from './_Base';

import {Vector3} from 'three/src/math/Vector3';
import {ConeBufferGeometry} from 'three/src/geometries/ConeGeometry';
import {CoreTransform} from '../../../core/Transform';

const DEFAULT_UP = new Vector3(0, 1, 0);

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class ConeSopParamsConfig extends NodeParamsConfig {
	radius = ParamConfig.FLOAT(1, {range: [0, 1]});
	height = ParamConfig.FLOAT(1, {range: [0, 1]});
	segments_radial = ParamConfig.INTEGER(12, {range: [3, 20], range_locked: [true, false]});
	segments_height = ParamConfig.INTEGER(1, {range: [1, 20], range_locked: [true, false]});
	cap = ParamConfig.BOOLEAN(1);
	theta_start = ParamConfig.FLOAT(1, {range: [0, 1]});
	theta_length = ParamConfig.FLOAT('2*$PI', {range: [0, 1]});
	center = ParamConfig.VECTOR3([0, 0, 0]);
	direction = ParamConfig.VECTOR3([0, 0, 1]);
}
const ParamsConfig = new ConeSopParamsConfig();

export class ConeSopNode extends TypedSopNode<ConeSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'cone';
	}

	private _core_transform = new CoreTransform();

	cook() {
		const geometry = new ConeBufferGeometry(
			this.pv.radius,
			this.pv.height,
			this.pv.segments_radial,
			this.pv.segments_height,
			!this.pv.cap,
			this.pv.theta_start,
			this.pv.theta_length
		);

		this._core_transform.rotate_geometry(geometry, DEFAULT_UP, this.pv.direction);
		geometry.translate(this.pv.center.x, this.pv.center.y, this.pv.center.z);

		this.set_geometry(geometry);
	}
}
