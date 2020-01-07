import {BaseObjectNode} from '../_Base';

export function Named<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseObjectNode = (<unknown>this) as BaseObjectNode;

		post_set_full_path() {
			this.set_group_name();
		}
		set_group_name() {
			// ensures the material has a full path set
			// allowing the render hook to be set
			//this.set_material(@_material)
			const group = this.self.group();
			if (group) {
				group.name = this.self.full_path();
			}
		}
	};
}