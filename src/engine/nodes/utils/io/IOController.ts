import {InputsController} from './InputsController';
import {OutputsController} from './OutputsController';
import {ConnectionsController} from './ConnectionsController';
import {SavedConnectionPointsDataController} from './SavedConnectionPointsDataController';
import {NodeContext} from '../../../poly/NodeContext';
import {TypedNode} from '../../_Base';
import {ConnectionPointsController} from './ConnectionPointsController';

export class IOController<NC extends NodeContext> {
	protected _inputs: InputsController<NC> | undefined;
	protected _outputs: OutputsController<NC> | undefined;
	protected _connections: ConnectionsController<NC> = new ConnectionsController(this.node);
	protected _saved_connection_points_data: SavedConnectionPointsDataController<NC> | undefined;
	protected _connection_points: ConnectionPointsController<NC> | undefined;

	constructor(protected node: TypedNode<NC, any>) {}

	get connections() {
		return this._connections;
	}

	//
	//
	// inputs
	//
	//
	get inputs(): InputsController<NC> {
		return (this._inputs = this._inputs || new InputsController(this.node));
	}
	has_inputs() {
		return this._inputs != null;
	}

	//
	//
	// outputs
	//
	//
	get outputs(): OutputsController<NC> {
		return (this._outputs = this._outputs || new OutputsController(this.node));
	}
	has_outputs() {
		return this._outputs != null;
	}

	//
	//
	// connection_points
	//
	//
	get connection_points(): ConnectionPointsController<NC> {
		return (this._connection_points =
			this._connection_points || new ConnectionPointsController(this.node, this.node.node_context() as NC));
	}
	get has_connection_points_controller(): boolean {
		return this._connection_points != null;
	}

	//
	//
	// saved connection points data
	//
	//
	get saved_connection_points_data() {
		return (this._saved_connection_points_data =
			this._saved_connection_points_data || new SavedConnectionPointsDataController(this.node));
	}
	clear_saved_connection_points_data() {
		if (this._saved_connection_points_data) {
			this._saved_connection_points_data.clear();
			this._saved_connection_points_data = undefined;
		}
	}
}
