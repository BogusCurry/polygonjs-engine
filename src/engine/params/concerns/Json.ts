import {BaseParam} from 'src/engine/params/_Base'

export function Json<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseParam = (<unknown>this) as BaseParam

		to_json() {
			const data = {
				name: this.self.name(),
				type: this.self.type(),
				value: this.self.value(),
				// expression: this.self.expression(), // TODO: typescript
				// result: this.self.result(),// TODO: typescript
				graph_node_id: this.self.graph_node_id(),
				is_dirty: this.self.is_dirty(),
				error_message: this.self.error_message(),
				is_visible: this.self.is_visible(),
				folder_name: this.self.ui_data().folder_name(),
				components: null as string[],
			}

			if (this.self.is_multiple()) {
				data['components'] = this.self
					.components()
					.map((component) => component.graph_node_id())
			}

			return data
		}
	}
}