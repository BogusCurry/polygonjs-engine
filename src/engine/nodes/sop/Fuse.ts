import {TypedSopNode} from './_Base';
import {CoreGroup} from 'src/core/geometry/Group';
import {CoreObject} from 'src/core/geometry/Object';
import {CoreGeometry} from 'src/core/geometry/Geometry';
import {Vector3} from 'three/src/math/Vector3';
import {Mesh} from 'three/src/objects/Mesh';

import {NodeParamsConfig, ParamConfig} from 'src/engine/nodes/utils/params/ParamsConfig';
import {InputCloneMode} from 'src/engine/poly/InputCloneMode';
import {CorePoint} from 'src/core/geometry/Point';
import {ObjectType} from 'src/core/geometry/Constant';
class FuseSopParamsConfig extends NodeParamsConfig {
	dist = ParamConfig.FLOAT(0.1, {
		range: [0, 1],
		range_locked: [true, false],
	});
}
const ParamsConfig = new FuseSopParamsConfig();

export class FuseSopNode extends TypedSopNode<FuseSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'fuse';
	}

	static displayed_input_names(): string[] {
		return ['points to fuse together'];
	}

	initialize_node() {
		this.io.inputs.set_count(1);
		this.io.inputs.init_inputs_clonable_state([InputCloneMode.FROM_NODE]);
	}

	cook(input_contents: CoreGroup[]) {
		const core_group = input_contents[0];

		const new_objects = [];
		let new_object;
		for (let core_object of core_group.core_objects()) {
			new_object = this._fuse_core_object(core_object);
			if (new_object) {
				new_objects.push(new_object);
			}
		}

		this.set_objects(new_objects);
	}

	private _fuse_core_object(core_object: CoreObject) {
		const object = core_object.object();
		if (!object) {
			return;
		}
		const points = core_object.points();

		const precision = this.pv.dist;
		const points_by_position: Dictionary<CorePoint[]> = {};
		for (let point of points) {
			const position = point.position();
			const rounded_position = new Vector3(
				Math.round(position.x / precision),
				Math.round(position.y / precision),
				Math.round(position.z / precision)
			);
			const key = rounded_position.toArray().join('-');
			points_by_position[key] = points_by_position[key] || [];
			points_by_position[key].push(point);
		}

		const kept_points: CorePoint[] = [];
		Object.keys(points_by_position).forEach((key) => {
			kept_points.push(points_by_position[key][0]);
		});

		(object as Mesh).geometry.dispose();
		if (kept_points.length > 0) {
			(object as Mesh).geometry = CoreGeometry.geometry_from_points(
				kept_points,
				(<unknown>object.constructor) as ObjectType
			);
			return object;
		} else {
			// if(object.material){ object.material.dispose() }
			// if(object.parent){ object.parent.remove(object) }
		}
	}
}