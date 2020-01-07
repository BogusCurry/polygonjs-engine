import {BaseNode} from '../_Base';
import {Vector2} from 'three/src/math/Vector2';
import {UIData} from '../UIData';

export function UIDataOwner<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNode = (<unknown>this) as BaseNode;
		_ui_data: UIData;

		_init_ui_data() {
			this._ui_data = new UIData(this.self);
		}
		ui_data() {
			return this._ui_data;
		}
		set_position(x: number, y: number) {
			this.ui_data().set_position(new Vector2(x, y));
		}
	};
}