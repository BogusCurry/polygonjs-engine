import {UIData} from '../UIData'
import {BaseParam} from 'src/engine/params/_Base'

export function UIDataOwner<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseParam = (<unknown>this) as BaseParam
		_ui_data: UIData // = new UIData()

		ui_data() {
			return this._ui_data
		}

		_init_ui_data() {
			this._ui_data = new UIData(this.self)
		}
	}
}