import {NodeContext} from '../../../poly/NodeContext';
import {TypedNode} from '../../_Base';
import {NodeTypeMap} from '../../../containers/utils/ContainerMap';
import {ConnectionPointTypeMap} from './connections/ConnectionMap';
interface DisconnectionOptions {
	set_input?: boolean;
}

export class TypedNodeConnection<NC extends NodeContext> {
	private static _next_id: number = 0;
	private _id: number;

	constructor(
		private _node_src: TypedNode<NC, any>,
		private _node_dest: TypedNode<NC, any>,
		private _output_index: number = 0,
		private _input_index: number = 0
	) {
		this._id = TypedNodeConnection._next_id++;

		if (this._node_src.io.connections && this._node_dest.io.connections) {
			this._node_src.io.connections.add_output_connection(this);
			this._node_dest.io.connections.add_input_connection(this);
		}
	}
	get id() {
		return this._id;
	}

	get node_src(): NodeTypeMap[NC] {
		return (<unknown>this._node_src) as NodeTypeMap[NC];
	}
	get node_dest(): NodeTypeMap[NC] {
		return (<unknown>this._node_dest) as NodeTypeMap[NC];
	}
	get output_index() {
		return this._output_index;
	}
	get input_index() {
		return this._input_index;
	}
	src_connection_point(): ConnectionPointTypeMap[NC] {
		const node_src = this._node_src;
		const output_index = this._output_index;
		return node_src.io.outputs.named_output_connection_points[output_index];
	}
	dest_connection_point(): ConnectionPointTypeMap[NC] {
		const node_dest = this._node_dest;
		const input_index = this._input_index;
		return node_dest.io.inputs.named_input_connection_points[input_index];
	}

	disconnect(options: DisconnectionOptions = {}) {
		if (this._node_src.io.connections && this._node_dest.io.connections) {
			this._node_src.io.connections.remove_output_connection(this);
			this._node_dest.io.connections.remove_input_connection(this);
		}

		if (options.set_input === true) {
			this._node_dest.io.inputs.set_input(this._input_index, null);
		}
	}
}
