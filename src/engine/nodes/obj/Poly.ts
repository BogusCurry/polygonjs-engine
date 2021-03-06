import {TypedObjNode} from './_Base';
import {Group} from 'three/src/objects/Group';
import {BaseNodeType} from '../_Base';
import {DisplayNodeController} from '../utils/DisplayNodeController';
import {NodeContext} from '../../poly/NodeContext';
import {BaseSopNodeType} from '../sop/_Base';
import {GeoNodeChildrenMap} from '../../poly/registers/nodes/Sop';
import {FlagsControllerD} from '../utils/FlagsController';
import {HierarchyController} from './utils/HierarchyController';
import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {ChildrenDisplayController} from './utils/ChildrenDisplayController';
import {PolyNodeController, PolyNodeDefinition} from '../utils/poly/PolyNodeController';
import {ParamsInitData} from '../utils/io/IOController';

export function create_poly_obj_node(node_type: string, definition: PolyNodeDefinition) {
	class PolyObjParamConfig extends NodeParamsConfig {
		display = ParamConfig.BOOLEAN(1);
		template = ParamConfig.OPERATOR_PATH('../template');
		debug = ParamConfig.BUTTON(null, {
			callback: (node: BaseNodeType) => {
				BasePolyObjNode.PARAM_CALLBACK_debug(node as BasePolyObjNode);
			},
		});
	}
	const ParamsConfig = new PolyObjParamConfig();

	class BasePolyObjNode extends TypedObjNode<Group, PolyObjParamConfig> {
		params_config = ParamsConfig;
		static type() {
			return node_type;
		}
		readonly hierarchy_controller: HierarchyController = new HierarchyController(this);
		public readonly flags: FlagsControllerD = new FlagsControllerD(this);
		create_object() {
			const group = new Group();
			group.matrixAutoUpdate = false;
			return group;
		}

		// display_node and children_display controllers
		public readonly children_display_controller: ChildrenDisplayController = new ChildrenDisplayController(this);
		public readonly display_node_controller: DisplayNodeController = new DisplayNodeController(
			this,
			this.children_display_controller.display_node_controller_callbacks()
		);
		//

		protected _children_controller_context = NodeContext.SOP;

		initialize_node() {
			this.hierarchy_controller.initialize_node();
			this.children_display_controller.initialize_node();
		}

		is_display_node_cooking(): boolean {
			if (this.flags.display.active) {
				const display_node = this.display_node_controller.display_node;
				return display_node ? display_node.is_dirty : false;
			} else {
				return false;
			}
		}

		create_node<K extends keyof GeoNodeChildrenMap>(
			type: K,
			params_init_value_overrides?: ParamsInitData
		): GeoNodeChildrenMap[K] {
			return super.create_node(type, params_init_value_overrides) as GeoNodeChildrenMap[K];
		}
		children() {
			return super.children() as BaseSopNodeType[];
		}
		nodes_by_type<K extends keyof GeoNodeChildrenMap>(type: K): GeoNodeChildrenMap[K][] {
			return super.nodes_by_type(type) as GeoNodeChildrenMap[K][];
		}

		//
		//
		// COOK
		//
		//
		cook() {
			this.object.visible = this.pv.display;
			this.cook_controller.end_cook();
		}

		//
		//
		// POLY
		//
		//
		public readonly poly_node_controller: PolyNodeController = new PolyNodeController(this, definition);

		//
		//
		// POLY TESTS
		//
		//
		static PARAM_CALLBACK_debug(node: BasePolyObjNode) {
			node._debug();
		}

		private _debug() {
			this.poly_node_controller.debug(this.p.template);
		}
	}
	return BasePolyObjNode;
}

const BasePolyObjNode = create_poly_obj_node('poly', {node_context: NodeContext.OBJ});
export class PolyObjNode extends BasePolyObjNode {}
