import {BaseParam} from 'src/engine/params/_Base'

export function Eval<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseParam = (<unknown>this) as BaseParam
		// _value: ParamInputValue
		// _default_value: ParamInputValue

		// set_default_value(default_value: any) {
		// 	this._default_value = this.self.convert_default_value(default_value)
		// 	if (this._default_value === undefined) {
		// 		throw 'undefined set value'
		// 	}
		// 	this._value = this._default_value
		// 	// this.post_set_default_value()
		// }
		// // post_set_default_value() {}
		// convert_default_value(value: any) {
		// 	return this.convert_value(value)
		// }
		// convert_value(value: any) {
		// 	throw `Param convert_value abstract method ${this.constructor}`
		// }
		// set(value: ParamInputValue) {
		// 	throw `Param set abstract method ${this.constructor}`
		// }
		// value() {
		// 	return this._value
		// }
		// default_value() {
		// 	return this._default_value
		// }
		// is_raw_input_default(): boolean {
		// 	if (this.self.has_expression()) {
		// 		return false
		// 	} else {
		// 		return this.value() === this.default_value()
		// 	}
		// }

		// _remove_node_param_cache() {
		// 	const node = this.self.node()
		// 	if (node) {
		// 		node.remove_param_cache(this.self)
		// 	}
		// }

		// eval_key(value) {
		// 	return [this.self.name(), this.self.expression(), value].join(':')
		// }

		// async eval_p() {
		// 	this.self.reset_referenced_asset()

		// 	this.parse_expression_and_update_dependencies()

		// 	return await this.eval()
		// 	// return new Promise((resolve, reject)=> {
		// 	// 	this.self.eval(val=> resolve(val) )
		// 	// });
		// }

		// parse_expression_and_update_dependencies() {
		// 	if (this.self._expression) {
		// 		if (!this.self._expression_controller().parse_completed) {
		// 			this.self
		// 				._expression_controller()
		// 				.parse_and_update_dependencies(this.self._expression)
		// 		}
		// 	}
		// }
		// invalidates_result() {
		// 	this._result = null
		// }
	}
}