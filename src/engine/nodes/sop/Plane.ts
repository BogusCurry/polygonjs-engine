import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';

import {PlaneSopOperation} from '../../../core/operation/sop/Plane';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
const DEFAULT = PlaneSopOperation.DEFAULT_PARAMS;
class PlaneSopParamsConfig extends NodeParamsConfig {
	size = ParamConfig.VECTOR2(DEFAULT.size);
	use_segments_count = ParamConfig.BOOLEAN(DEFAULT.use_segments_count);
	step_size = ParamConfig.FLOAT(DEFAULT.step_size, {
		range: [0.001, 1],
		range_locked: [false, false],
		visible_if: {use_segments_count: 0},
	});
	segments = ParamConfig.VECTOR2(DEFAULT.segments, {visible_if: {use_segments_count: 1}});
	direction = ParamConfig.VECTOR3(DEFAULT.direction);
	center = ParamConfig.VECTOR3(DEFAULT.center);
}
const ParamsConfig = new PlaneSopParamsConfig();

export class PlaneSopNode extends TypedSopNode<PlaneSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'plane';
	}

	static displayed_input_names(): string[] {
		return ['geometry to create plane from (optional)'];
	}

	initialize_node() {
		this.io.inputs.set_count(0, 1);
		this.io.inputs.init_inputs_cloned_state(PlaneSopOperation.INPUT_CLONED_STATE);
	}

	private _operation: PlaneSopOperation | undefined;
	cook(input_contents: CoreGroup[]) {
		this._operation = this._operation || new PlaneSopOperation(this.scene, this.states);
		const core_group = this._operation.cook(input_contents, this.pv);
		this.set_core_group(core_group);
	}
}
