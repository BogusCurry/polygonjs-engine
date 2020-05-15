import {TypedGlNode} from './_Base';

import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {ShadersCollectionController} from './code/utils/ShadersCollectionController';
// import {GlConnectionsController} from './utils/GLConnectionsController';
import {IfThenGlNode} from './IfThen';
class SubnetInputGlParamsConfig extends NodeParamsConfig {}
const ParamsConfig = new SubnetInputGlParamsConfig();

export class SubnetInputGlNode extends TypedGlNode<SubnetInputGlParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'subnet_input';
	}

	// public readonly gl_connections_controller: GlConnectionsController = new GlConnectionsController(this);
	initialize_node() {
		this.io.connection_points.set_output_name_function(this._expected_output_names.bind(this));
		this.io.connection_points.set_expected_input_types_function(() => []);
		this.io.connection_points.set_expected_output_types_function(this._expected_output_types.bind(this));

		this.lifecycle.add_on_add_hook(() => {
			this._connect_to_parent_connections_controller();
		});
	}

	get parent() {
		return super.parent as IfThenGlNode | null;
	}

	protected _expected_output_types() {
		const parent = this.parent;
		return parent?.child_subnet_input_expected_output_types() || [];
	}

	private _expected_output_names(index: number) {
		const parent = this.parent;
		return parent?.child_subnet_input_expected_output_name(index) || `out${index}`;
	}

	private _connect_to_parent_connections_controller() {
		// this will make the node update its connections when the parent changes them
		if (this.parent) {
			this.add_graph_input(this.parent);
		}
	}

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		// const definitions = [];
		// const gl_type = GL_CONNECTION_POINT_TYPES[this.pv.type];
		// const var_name = this.uniform_name();
		// definitions.push(new UniformGLDefinition(this, gl_type, var_name));
		// shaders_collection_controller.add_definitions(this, definitions);
	}
}
