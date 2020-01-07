import {BaseParam} from 'src/engine/params/_Base'

const RANGE_OPTION = 'range'
const RANGE_LOCKED_OPTION = 'range_locked'
const STEP_OPTION = 'step'

interface ParamOptions {
	range?: [number, number]
	range_locked?: [boolean, boolean]
	step?: number
}

export function RangeOption<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseParam = (<unknown>this) as BaseParam
		_options: ParamOptions = {}

		range(): [number, number] {
			// cannot force range easily, as values are not necessarily from 0 to N
			// if(this.self.has_menu() && this.self.menu_entries()){
			// 	return [0, this.self.menu_entries().length-1 ]
			// } else {
			return this._options[RANGE_OPTION] || [0, 1]
			// }
		}
		step(): number {
			return this._options[STEP_OPTION] || 0.01
		}

		private range_locked(): [boolean, boolean] {
			// if(this.self.has_menu() && this.self.menu_entries()){
			// 	return [true, true]
			// } else {
			return this._options[RANGE_LOCKED_OPTION] || [false, false]
			// }
		}

		protected _ensure_in_range(value: number): number {
			const range = this.range()

			if (value >= range[0] && value <= range[1]) {
				return value
			} else {
				if (value < range[0]) {
					return this.range_locked()[0] === true ? range[0] : value
				} else {
					return this.range_locked()[1] === true ? range[1] : value
				}
			}
		}
	}
}