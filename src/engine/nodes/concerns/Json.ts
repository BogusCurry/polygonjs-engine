// import lodash_each from 'lodash/each'
import {BaseNode} from '../_Base';

export function Json<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNode = (<unknown>this) as BaseNode;
		to_json(include_param_components: boolean = false) {
			// const spare_params_json_by_name = {};
			// lodash_each(this.self.spare_param_names(), param_name=> {
			// 	const param = this.self.spare_param(param_name);
			// 	spare_params_json_by_name[param_name] = param.graph_node_id();
			// });
			const children_indices = this.self
				.children()
				.map((node) => (node != null ? node.graph_node_id() : undefined));

			const input_indices = this.self.inputs().map((node) => (node != null ? node.graph_node_id() : undefined));
			const connection_output_indices = this.self
				.input_connections()
				.map((connection) => (connection != null ? connection.output_index() : undefined));
			const named_inputs = this.self.named_inputs().map((i) => i.to_json());
			const named_outputs = this.self.named_outputs().map((o) => o.to_json());

			const data = {
				name: this.self.name(),
				type: this.self.type(),
				graph_node_id: this.self.graph_node_id(),
				is_dirty: this.self.is_dirty(),
				ui_data: this.self.ui_data().to_json(),
				error_message: this.self.error_message(),
				children: children_indices,
				inputs: input_indices,
				input_connection_output_indices: connection_output_indices,
				named_inputs: named_inputs,
				named_outputs: named_outputs,
				params: this.to_json_params(include_param_components),
				spare_params: this.to_json_spare_params(include_param_components),
				override_clonable_state: this.self.override_clonable_state(),
				inputs_clonable_state_with_override: this.self.inputs_clonable_state_with_override(),
				flags: {
					//has_display: this.has_display_flag()
					display: this.self.display_flag_state(),
					bypass: this.self.is_bypassed(),
				},
				selection: null as object,
			};

			if (this.self.children_allowed()) {
				data['selection'] = this.self.selection().to_json();
			}

			return data;
		}

		to_json_params_from_names(param_names: string[], include_components: boolean = false) {
			const params_json_by_name: Dictionary<string> = {};
			for (let param_name of param_names) {
				const param = this.self.param(param_name);
				params_json_by_name[param_name] = param.graph_node_id();

				if (include_components && param.is_multiple()) {
					for (let component of param.components()) {
						params_json_by_name[component.name()] = component.graph_node_id();
					}
				}
			}
			return params_json_by_name;
		}
		to_json_params(include_components: boolean = false) {
			return this.to_json_params_from_names(this.self.non_spare_param_names(), include_components);
		}
		to_json_spare_params(include_components: boolean = false) {
			return this.to_json_params_from_names(this.self.spare_param_names(), include_components);
		}
	};
}