import {CoreWalker} from 'src/core/Walker';
import {CoreString} from 'src/core/String';
import CoreSelection from 'src/core/NodeSelection';
import lodash_keys from 'lodash/keys';
import lodash_sortBy from 'lodash/sortBy';
import lodash_values from 'lodash/values';
// import lodash_filter from 'lodash/filter'
import lodash_includes from 'lodash/includes';
import {BaseNode} from '../_Base';
import {NodeSimple} from 'src/core/graph/NodeSimple';
import 'src/engine/Poly';

const NODE_SIMPLE_NAME = 'children';

interface HierarchyOptions {
	dependent?: boolean;
}

export function HierarchyChildrenOwner<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNode = (<unknown>this) as BaseNode;
		_selection: CoreSelection;
		_children_allowed: boolean = false;
		_children: Dictionary<BaseNode>;
		_children_by_type: Dictionary<string[]> = {};
		_children_and_grandchildren_by_context: Dictionary<string[]> = {};

		_is_dependent_on_children: boolean = false;
		_children_node: NodeSimple;

		_init_hierarchy_children_owner(options: HierarchyOptions = {}) {
			const context = this.children_context();
			if (context) {
				// this._available_children_classes = options['children'] || {};
				// this._available_children_classes = window.POLY.registered_nodes(context, this.self.type())

				this._children_allowed = true;
				this._children = {};
				this._selection = new CoreSelection((<unknown>this) as BaseNode);

				if (options['dependent']) {
					this._is_dependent_on_children = options['dependent'];
					if (this._is_dependent_on_children) {
						this._children_node = new NodeSimple(NODE_SIMPLE_NAME);
						this._children_node.set_scene(this.self.scene());
						this.self.add_graph_input(this._children_node);
					}
				}
			}
		}

		static node_context(): NodeContext {
			throw 'requires override';
		}
		node_context(): NodeContext {
			return (this.constructor as typeof(BaseNode)).node_context();
		}
		node_context_signature() {
			return `${this.node_context()}/${this.self.type()}`;
		}
		children_context(): NodeContext {
			return null;
		}

		selection() {
			return this._selection;
		}

		// TODO: when copy pasting a node called bla_11, the next one will be renamed bla_110 instead of 12
		set_child_name(node: BaseNode, new_name: string):void {
			//return if node.name() == new_name
			let current_child_with_name;
			new_name = new_name.replace(/[^A-Za-z0-9]/g, '_');
			new_name = new_name.replace(/^[0-9]/, '_'); // replace first char if not a letter

			if ((current_child_with_name = this._children[new_name]) != null) {
				// only return if found node is same as argument node, and if new_name is same as current_name
				if (node.name() === new_name && current_child_with_name.graph_node_id() === node.graph_node_id()) {
					return;
				}

				// increment new_name
				new_name = CoreString.increment(new_name);

				return this.set_child_name(node, new_name);
			} else {
				// let current_child;
				const current_name = node.name();

				// delete old entry if node was in _children with old name
				const current_child = this._children[current_name];
				if (current_child) {
					delete this._children[current_name];
				}

				// add to new name
				this._children[new_name] = node;
				node._set_name(new_name);
				this._add_to_nodes_by_type(node);
				this.self.scene().add_to_instanciated_node(node);
			}
		}

		available_children_classes() {
			return POLY.registered_nodes(this.children_context(), this.self.type());
		}
		children_allowed(): boolean {
			// return (this.self.available_children_classes != null) &&
			// (Object.keys(this.self.available_children_classes()).length > 0);
			const available_classes = this.available_children_classes();
			return available_classes && Object.keys(available_classes).length > 0;
		}

		create_node(node_type: string): BaseNode {
			if (this.available_children_classes() == null) {
				throw `no children available for ${this.self.full_path()}.`;
			} else {
				const node_class = this.available_children_classes()[node_type];

				if (node_class == null) {
					const message = `node type ${node_type} not found for ${this.self.full_path()} (${Object.keys(
						this.available_children_classes()
					).join(', ')}, ${this.children_context()}, ${this.self.type()})`;
					console.error(message);
					throw message;
				} else {
					const node = new node_class();
					node.set_scene(this.self.scene());
					this.add_node(node);
					return node;
				}
			}
		}

		// set_children_dirty_without_propagation(){
		// 	for(let child of this.children()){
		// 		child.set_children_dirty_without_propagation()
		// 		for(let param_name of Object.keys(child.params())){
		// 			const param = child.param(param_name)
		// 			param.set_dirty(this, true)
		// 		}
		// 		child.set_dirty(this, true)
		// 	}
		// }

		// type(): string {
		// 	let prefix;
		// 	let { name } = this.constructor;
		// 	if ((prefix = this.constructor.name_prefix) != null) {
		// 		name = `${prefix}${name}`;
		// 	}
		// 	return Core.String.class_name_to_type(name);
		// }

		private add_node(node: BaseNode) {
			if (!this._children_allowed) {
				throw `node ${this.self.full_path()} cannot have children`;
			}

			node.set_parent(this.self);
			node.init_parameters();
			node.post_set_parent();
			node.post_set_full_path();
			for (let child of node.children()) {
				node.post_set_full_path();
			}
			this.self.emit('node_created', {child_node: node});
			this.self.on_child_add(node);
			if (this.scene().on_create_lifecycle_hook_allowed()) {
				node.on_create();
			}
			this.post_add_node(node);

			if (this._is_dependent_on_children) {
				this._children_node.add_graph_input(node);
			}
			if (node.require_webgl2()) {
				this.scene().set_require_webgl2();
			}

			return node;
		}
		post_add_node(node: BaseNode) {}
		post_remove_node(node: BaseNode) {}

		remove_node(node: BaseNode) {
			if (this._children[node.name()] == null) {
				return console.warn(`node ${node.name()} not under parent ${this.self.full_path()}`);
			} else {
				// set other dependencies dirty
				node.set_dirty(this.self);

				if (this._is_dependent_on_children) {
					this._children_node.remove_graph_input(node);
				}

				if (this.self.selection().contains(node)) {
					this.self.selection().remove(node);
				}

				const first_connection = node.first_input_connection();
				node.input_connections().forEach((input_connection) => {
					if (input_connection) {
						input_connection.disconnect({set_input: true});
					}
				});
				node.output_connections().forEach((output_connection) => {
					if (output_connection) {
						output_connection.disconnect({set_input: true});
						if (first_connection) {
							const old_src = first_connection.node_src();
							const old_output_index = output_connection.output_index();
							const old_dest = output_connection.node_dest();
							const old_input_index = output_connection.input_index();
							old_dest.set_input(old_input_index, old_src, old_output_index);
						}
					}
				});

				// disconnect successors
				node.graph_disconnect_successors();

				// remove from children
				node.set_parent(null);
				delete this._children[node.name()];
				this._remove_from_nodes_by_type(node);
				this.scene().remove_from_instanciated_node(node);

				this.self.on_child_remove(node);
				node.on_delete();
				this.post_remove_node(node);
				node.emit('node_deleted', {parent: this});
				return node;
			}
		}

		node(path: string): BaseNode {
			if (this._children_allowed != true) {
				return null;
			}
			if (path == null) {
				return null;
			}
			if (path === '.' || path === './') {
				return this.self;
			}
			if (path === '..' || path === '../') {
				return this.self.parent();
			}

			const separator = CoreWalker.separator();
			if (path[0] === separator) {
				path = path.substring(1, path.length);
			}

			const elements = path.split(separator);
			if (elements.length === 1) {
				const name = elements[0];
				return this._children[name];
			} else {
				return CoreWalker.find_node(this.self, path);
			}
		}

		_add_to_nodes_by_type(node: BaseNode) {
			const node_id = node.graph_node_id();
			const type = node.type();
			this._children_by_type[type] = this._children_by_type[type] || [];
			if (!lodash_includes(this._children_by_type[type], node_id)) {
				this._children_by_type[type].push(node_id);
			}
			this.add_to_children_and_grandchildren_by_context(node);
		}
		_remove_from_nodes_by_type(node: BaseNode) {
			const node_id = node.graph_node_id();
			const type = node.type();
			if (this._children_by_type[type]) {
				const index = this._children_by_type[type].indexOf(node_id);
				if (index >= 0) {
					this._children_by_type[type].splice(index, 1);
					if (this._children_by_type[type].length == 0) {
						delete this._children_by_type[type];
					}
				}
			}
			this.remove_from_children_and_grandchildren_by_context(node);
		}
		add_to_children_and_grandchildren_by_context(node: BaseNode) {
			const node_id = node.graph_node_id();
			const type = node.node_context();
			this._children_and_grandchildren_by_context[type] = this._children_and_grandchildren_by_context[type] || [];
			if (!lodash_includes(this._children_and_grandchildren_by_context[type], node_id)) {
				this._children_and_grandchildren_by_context[type].push(node_id);
			}
			if (this.self.parent()) {
				this.self.parent().add_to_children_and_grandchildren_by_context(node);
			}
		}
		remove_from_children_and_grandchildren_by_context(node: BaseNode) {
			const node_id = node.graph_node_id();
			const type = node.node_context();
			if (this._children_and_grandchildren_by_context[type]) {
				const index = this._children_and_grandchildren_by_context[type].indexOf(node_id);
				if (index >= 0) {
					this._children_and_grandchildren_by_context[type].splice(index, 1);
					if (this._children_and_grandchildren_by_context[type].length == 0) {
						delete this._children_and_grandchildren_by_context[type];
					}
				}
			}
			if (this.self.parent()) {
				this.self.parent().remove_from_children_and_grandchildren_by_context(node);
			}
		}

		nodes_by_type(type: string): BaseNode[] {
			const node_ids = this._children_by_type[type] || [];
			const graph = this.self.scene().graph();
			return node_ids.map((node_id) => graph.node_from_id(node_id));
		}
		// children_and_grandchildren_by_context(context: NodeContext): BaseNode[]{
		// 	const node_ids = this._children_and_grandchildren_by_context[context] || []
		// 	const graph = this.self.scene().graph()
		// 	return node_ids.map(node_id=>graph.node_from_id(node_id))
		// }
		has_children_and_grandchildren_with_context(context: NodeContext) {
			return this._children_and_grandchildren_by_context[context] != null;
		}
		//lodash_filter this.children(), (child)=>
		//	child.type() == type

		children(): BaseNode[] {
			return lodash_values(this._children);
		}
		children_names() {
			return lodash_sortBy(lodash_keys(this._children));
		}
		// children_map: ->
		// 	@_children

		traverse_children(callback: (arg0:BaseNode)=>void) {
			for (let child of this.children()) {
				callback(child);

				// if (child.traverse_children != null) { // TODO: typescript
					child.traverse_children(callback);
				// }
			}
		}
	};
}