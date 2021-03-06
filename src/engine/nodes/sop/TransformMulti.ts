import {TypedSopNode} from './_Base';
import {CoreGroup, Object3DWithGeometry} from '../../../core/geometry/Group';
import {
	CoreTransform,
	ROTATION_ORDERS,
	RotationOrder,
	TransformTargetType,
	TRANSFORM_TARGET_TYPES,
} from '../../../core/Transform';
import {InputCloneMode} from '../../poly/InputCloneMode';
import {Vector3} from 'three/src/math/Vector3';
import {ParamOptions, MenuParamOptions, VisibleIfParamOptions} from '../../params/utils/OptionsController';

const max_transform_count = 6;
const ROT_ORDER_DEFAULT = ROTATION_ORDERS.indexOf(RotationOrder.XYZ);
const ROT_ORDER_MENU_ENTRIES: MenuParamOptions = {
	menu: {
		entries: ROTATION_ORDERS.map((order, v) => {
			return {name: order, value: v};
		}),
	},
};
function visible_for_count(count: number): ParamOptions {
	const list: VisibleIfParamOptions[] = [];
	for (let i = count + 1; i <= max_transform_count; i++) {
		list.push({
			count: i,
		});
	}
	return {visible_if: list};
}

type VectorNumberParamPair = [Vector3Param, IntegerParam];

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {IntegerParam} from '../../params/Integer';
import {Vector3Param} from '../../params/Vector3';
import {TypeAssert} from '../../poly/Assert';
import {Object3D} from 'three/src/core/Object3D';
import {BufferAttribute} from 'three/src/core/BufferAttribute';
import {CoreAttribute, Attribute} from '../../../core/geometry/Attribute';
class TransformMultiSopParamConfig extends NodeParamsConfig {
	apply_on = ParamConfig.INTEGER(TRANSFORM_TARGET_TYPES.indexOf(TransformTargetType.GEOMETRIES), {
		menu: {
			entries: TRANSFORM_TARGET_TYPES.map((target_type, i) => {
				return {name: target_type, value: i};
			}),
		},
	});
	count = ParamConfig.INTEGER(2, {
		range: [0, max_transform_count],
		range_locked: [true, true],
	});
	// 0
	sep0 = ParamConfig.SEPARATOR(null, {...visible_for_count(0)});
	rotation_order0 = ParamConfig.INTEGER(ROT_ORDER_DEFAULT, {
		...ROT_ORDER_MENU_ENTRIES,
		...visible_for_count(0),
	});
	r0 = ParamConfig.VECTOR3([0, 0, 0], {...visible_for_count(0)});
	// 1
	sep1 = ParamConfig.SEPARATOR(null, {...visible_for_count(1)});
	rotation_order1 = ParamConfig.INTEGER(ROT_ORDER_DEFAULT, {
		...ROT_ORDER_MENU_ENTRIES,
		...visible_for_count(1),
	});
	r1 = ParamConfig.VECTOR3([0, 0, 0], {...visible_for_count(1)});
	// 2
	sep2 = ParamConfig.SEPARATOR(null, {...visible_for_count(2)});
	rotation_order2 = ParamConfig.INTEGER(ROT_ORDER_DEFAULT, {
		...ROT_ORDER_MENU_ENTRIES,
		...visible_for_count(2),
	});
	r2 = ParamConfig.VECTOR3([0, 0, 0], {...visible_for_count(2)});
	// 3
	sep3 = ParamConfig.SEPARATOR(null, {...visible_for_count(3)});
	rotation_order3 = ParamConfig.INTEGER(ROT_ORDER_DEFAULT, {
		...ROT_ORDER_MENU_ENTRIES,
		...visible_for_count(3),
	});
	r3 = ParamConfig.VECTOR3([0, 0, 0], {...visible_for_count(3)});
	// 4
	sep4 = ParamConfig.SEPARATOR(null, {...visible_for_count(4)});
	rotation_order4 = ParamConfig.INTEGER(ROT_ORDER_DEFAULT, {
		...ROT_ORDER_MENU_ENTRIES,
		...visible_for_count(4),
	});
	r4 = ParamConfig.VECTOR3([0, 0, 0], {...visible_for_count(4)});
	// 5
	sep5 = ParamConfig.SEPARATOR(null, {...visible_for_count(5)});
	rotation_order5 = ParamConfig.INTEGER(ROT_ORDER_DEFAULT, {
		...ROT_ORDER_MENU_ENTRIES,
		...visible_for_count(5),
	});
	r5 = ParamConfig.VECTOR3([0, 0, 0], {...visible_for_count(5)});
}
const ParamsConfig = new TransformMultiSopParamConfig();

export class TransformMultiSopNode extends TypedSopNode<TransformMultiSopParamConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'transform_multi';
	}

	static displayed_input_names(): string[] {
		return ['objects to transform', 'objects to copy initial transform from'];
	}

	initialize_node() {
		this.io.inputs.set_count(1, 2);
		this.io.inputs.init_inputs_cloned_state([InputCloneMode.FROM_NODE, InputCloneMode.NEVER]);

		this.scene.dispatch_controller.on_add_listener(() => {
			this.params.on_params_created('params_label', () => {
				this.params.label.init([this.p.apply_on], () => {
					return TRANSFORM_TARGET_TYPES[this.pv.apply_on];
				});
			});
		});

		this.params.on_params_created('cache param pairs', () => {
			this._rot_and_index_pairs = [
				[this.p.r0, this.p.rotation_order0],
				[this.p.r1, this.p.rotation_order1],
				[this.p.r2, this.p.rotation_order2],
				[this.p.r3, this.p.rotation_order3],
				[this.p.r4, this.p.rotation_order4],
				[this.p.r5, this.p.rotation_order5],
			];
		});
	}

	private _core_transform = new CoreTransform();
	private _rot_and_index_pairs: VectorNumberParamPair[] | undefined;
	cook(input_contents: CoreGroup[]) {
		const objects = input_contents[0].objects_with_geo();
		const src_object = input_contents[1] ? input_contents[1].objects_with_geo()[0] : undefined;

		this._apply_transforms(objects, src_object);

		this.set_objects(objects);
	}

	private _apply_transforms(objects: Object3DWithGeometry[], src_object: Object3DWithGeometry | undefined) {
		const mode = TRANSFORM_TARGET_TYPES[this.pv.apply_on];
		switch (mode) {
			case TransformTargetType.GEOMETRIES: {
				return this._apply_matrix_to_geometries(objects, src_object);
			}
			case TransformTargetType.OBJECTS: {
				return this._apply_matrix_to_objects(objects, src_object);
			}
		}
		TypeAssert.unreachable(mode);
	}

	private _apply_matrix_to_geometries(objects: Object3DWithGeometry[], src_object: Object3DWithGeometry | undefined) {
		if (!this._rot_and_index_pairs) {
			return;
		}

		if (src_object) {
			const src_geometry = src_object.geometry;
			if (src_geometry) {
				const attributes_to_copy = [Attribute.POSITION, Attribute.NORMAL, Attribute.TANGENT];

				for (let attrib_name of attributes_to_copy) {
					const src = src_geometry.attributes[attrib_name] as BufferAttribute | null;
					for (let object of objects) {
						const geometry = object.geometry;
						const dest = geometry.attributes[attrib_name] as BufferAttribute | null;
						if (src && dest) {
							CoreAttribute.copy(src, dest);
						}
					}
				}
			}
		}

		let pair: VectorNumberParamPair;
		for (let i = 0; i < this.pv.count; i++) {
			pair = this._rot_and_index_pairs[i];
			const matrix = this._matrix(pair[0].value, pair[1].value);
			for (let object of objects) {
				object.geometry.applyMatrix4(matrix);
			}
		}
	}

	private _apply_matrix_to_objects(objects: Object3D[], src_object: Object3D | undefined) {
		if (!this._rot_and_index_pairs) {
			return;
		}
		if (src_object) {
			for (let object of objects) {
				object.matrix.copy(src_object.matrix);
				// TODO: This would not be required if objects generated in SOP has matrixAutoUpdate=false
				object.matrix.decompose(object.position, object.quaternion, object.scale);
			}
		}

		let pair: VectorNumberParamPair;
		for (let i = 0; i < this.pv.count; i++) {
			pair = this._rot_and_index_pairs[i];
			const matrix = this._matrix(pair[0].value, pair[1].value);
			for (let object of objects) {
				object.applyMatrix4(matrix);
			}
		}
	}

	private _t = new Vector3(0, 0, 0);
	private _s = new Vector3(1, 1, 1);
	private _scale = 1;
	private _matrix(r: Vector3, rot_order_index: number) {
		return this._core_transform.matrix(this._t, r, this._s, this._scale, ROTATION_ORDERS[rot_order_index]);
	}
}
