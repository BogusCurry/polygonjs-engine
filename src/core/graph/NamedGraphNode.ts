// import {CoreString} from 'src/core/String';
import {NodeSimple} from './NodeSimple';
import {NameGraphNode} from './NameGraphNode';
// import {CoreObject} from '../Object'
// import Node from '../_Base'

export function NamedGraphNode<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		self: NodeSimple = (<unknown>this) as NodeSimple;
		protected _name: string;
		protected _name_graph_node: NameGraphNode;

		name() {
			return this._name;
		}
		set_name(new_name: string) {
			this._name = new_name;
		}

		name_graph_node(): NameGraphNode {
			return (this._name_graph_node = this._name_graph_node || this._create_name_graph_node());
		}
		protected _create_name_graph_node(): NameGraphNode {
			const node = new NameGraphNode(this.self);
			node.set_scene(this.self.scene());
			return node;
		}
	};
}
// class DummyClass {}
export class NamedGraphNodeClass extends NamedGraphNode(NodeSimple) {
	// constructor(private _owner: NamedGraphNodeClass) {
	// 	super()
	// }
}
