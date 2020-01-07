import {DisplayFlagGraphNode} from '../utils/DisplayFlagGraphNode';

import {BaseNode} from '../_Base';
import {BaseContainer} from 'src/engine/containers/_Base';

interface DisplayFlagOptions {
	has_display_flag?: boolean;
	multiple_display_flags_allowed?: boolean;
	affects_hierarchy?: boolean;
}

export function DisplayFlag<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNode = (<unknown>this) as BaseNode;
		_display_flag_graph_node: DisplayFlagGraphNode;
		_display_flag: boolean;
		_display_node: BaseNode;
		_display_node_object_uuids: Dictionary<boolean> = {};
		_has_display_flag: boolean;
		_multiple_display_flags_allowed: boolean;
		_affects_hierarchy: boolean;

		_init_display_flag(options: DisplayFlagOptions = {}) {
			if (options['has_display_flag'] == null) {
				options['has_display_flag'] = true;
			}
			if (options['multiple_display_flags_allowed'] == null) {
				options['multiple_display_flags_allowed'] = true;
			}
			//options['graph_connect'] ?= false
			if (options['affects_hierarchy'] == null) {
				options['affects_hierarchy'] = false;
			}

			this._multiple_display_flags_allowed = options['multiple_display_flags_allowed'];
			this._has_display_flag = options['has_display_flag'];
			//@_graph_connect = options['graph_connect']
			this._affects_hierarchy = options['affects_hierarchy'];

			this._display_flag = true;
		}

		display_flag_graph_node(): DisplayFlagGraphNode {
			return this._display_flag_graph_node != null
				? this._display_flag_graph_node
				: (this._display_flag_graph_node = this._create_display_flag_graph_node());
		}

		post_display_flag_node_set_dirty() {}
		//

		_create_display_flag_graph_node(): DisplayFlagGraphNode {
			const node = new DisplayFlagGraphNode(this.self);
			node.set_scene(this.self.scene());
			return node;
		}

		has_display_flag() {
			return this._has_display_flag;
		}

		multiple_display_flags_allowed() {
			return this._multiple_display_flags_allowed;
		}

		set_display_flag(state: boolean = true) {
			const parent = this.self.parent();
			if (parent) {
				if (parent.multiple_display_flags_allowed()) {
					this._display_flag = state;
					this.post_state_display_flag();
				} else {
					parent.set_display_node(this.self);
				}
				return this.self.emit('display_flag_update');
			}
		}

		post_state_display_flag() {}
		//

		toggle_display_flag() {
			this._display_flag = !this._display_flag;
			this.self.emit('display_flag_update');
		}

		display_flag_state(): boolean {
			if (this.self.parent() != null) {
				if (this.self.parent().multiple_display_flags_allowed()) {
					return this._display_flag === true;
				} else {
					return this.self.parent().display_node() === this;
				}
			}
		}

		async set_display_node(node: BaseNode) {
			if (node === this._display_node) {
				return;
			}

			const old_display_node = this.display_node();
			if (old_display_node != null) {
				//if @_graph_connect
				this.display_flag_graph_node().remove_graph_input(old_display_node);
				// if (this._affects_hierarchy) {
				// 	this.group().remove( old_display_node.group() );
				// }
				this.remove_display_node_group();
			}

			if (node != null) {
				if (this.display_flag_graph_node().add_graph_input(node)) {
					this._display_node = node;
				} else {
					console.warn(`cannot set display node ${node.full_path()}`);
				}
			} else {
				this._display_node = null;
			}

			if (this._display_node) {
				await this.add_display_node_group();
				this._display_node.emit('display_flag_update');
			}

			if (old_display_node != null) {
				old_display_node.emit('display_flag_update');
			}

			this.self.request_display_node();
		}
		// pre_update_display_group_from_children_bypass_flag_change(){
		// 	this.remove_display_node_group()
		// }
		// post_update_display_group_from_children_bypass_flag_change(){
		// 	this.add_display_node_group()
		// }

		// this would need more work
		async display_node_objects_changed(container?: BaseContainer): Promise<T> {
			if (!container) {
				container = await this._display_node.request_container();
			}
			const core_group = container.core_content();
			let objects = [];
			if (core_group) {
				objects = container.core_content().objects();
			}
			// const objects_by_uuid = {}
			let all_objects_in_display_node_object_uuids = true;
			for (let object of objects) {
				if (!this._display_node_object_uuids[object.uuid]) {
					all_objects_in_display_node_object_uuids = false;
				}
			}
			const same_length = Object.keys(this._display_node_object_uuids).length == objects.length;
			return !(same_length && all_objects_in_display_node_object_uuids);
		}

		remove_display_node_group() {
			if (this._display_node) {
				if (this._affects_hierarchy) {
					// this.group().remove( this._display_node.group() );
					// const objects = this._display_node.container().content()
					// if(objects){
					const group = this.self.group();
					let child;
					while ((child = group.children[0])) {
						group.remove(child);
						delete this._display_node_object_uuids[child.uuid];
					}
					// }
				}
			}
		}

		// actually have the display node add the objects
		// as it will know better if it should do it or not
		// or this node should check the container timestamp?
		async add_display_node_group(container?: BaseContainer) {
			if (this._display_node) {
				if (this._affects_hierarchy) {
					// this.group().add( this._display_node.group() );
					if (!container) {
						container = await this._display_node.request_container();
					}
					const core_group = container.core_content();
					if (core_group) {
						const objects = core_group.objects();
						if (objects) {
							// TODO: that's very specific to obj/geo node
							const group = this.self.group();
							for (let object of objects) {
								group.add(object);
								this._display_node_object_uuids[object.uuid] = true;
							}
						}
					}
				}
			}
		}
		// async set_needsUpdate(container: BaseContainer){
		// 	const core_group = container.core_content()
		// 	if(core_group){
		// 		const objects = core_group.objects()
		// 		if(objects){
		// 			for(let object of objects){
		// 				object.needsUpdate = true
		// 				object.geometry.needsUpdate = true
		// 			}
		// 		}
		// 	}
		// }

		display_node(): BaseNode {
			return this._display_node || this.children()[0];
		}
	};
}