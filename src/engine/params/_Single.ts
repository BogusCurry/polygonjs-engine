import {TypedParam} from './_Base'

export class Single<T> extends TypedParam<T> {
	// protected _expression: string
	// constructor() {
	// 	super()
	// }
	// convert_value(value: any) {
	// 	return value
	// }

	is_raw_input_default() {
		return this._raw_input == this._default_value
	}
	//
	//
	// EVAL
	//
	//

	async eval_raw() {
		// be careful when saving a result here,
		// as it fucks it up when evaluating for points (or any list of entities)
		if (this.is_dirty() || this._value == null) {
			//this.clear_error()
			if (this._expression) {
				const val = await this.eval_raw_expression()
				this.post_eval_raw(val)
				return val
			} else {
				this._value = this._raw_input
				this.remove_dirty_state()
				return this._value
			}
		} else {
			return this._value
		}
	}

	// eval_with_promise: ->
	// 	new Promise (resolve, reject)=>
	// 		this.eval_raw (value)=>
	// 			resolve(value)

	// eval_sync: ->
	// 	test = (a)->
	// 		await a.eval_with_promise()
	// 	test(this)

	post_eval_raw(value: T) {
		const previous_value = this._value // TODO: I should probably clone this, to compare if the result has changed, and then execute the callback
		this._value = value

		if (this._value != null) {
			this.clear_error()
		}

		const was_dirty = this.is_dirty()
		this.remove_dirty_state()
		// TODO: this gets emitted for every point when in a Point SOP
		// trying now to only emit if the param was dirty
		if (was_dirty) {
			this.emit_param_updated()
		}

		// TODO: the callback should only be executed when the result has changed?
		// but how to make that reliable for vectors
		if (this.has_callback() && previous_value !== this._value) {
			return this.execute_callback()
		}
	}

	// result() {
	// 	return this._result
	// }

	async eval() {
		// if !callback?
		// 	throw "#{this.full_path()} use eval without a callback"
		// else
		return await this.eval_raw()
	}

	// TODO
	// the goal if this should be"
	// - faster params eval over points
	// - faster error propagation (only sent once to the node, not N times
	// eval_for_entities(entities, callback){}
	// this should be easier once I integrate promises

	// eval_later: (callback)->
	// 	c = =>
	// 		this.eval(callback)
	// 	setTimeout(c, 50)

	set(new_value: T) {
		// new_value = this.convert_value(new_value)
		if (this._value === new_value && !this.has_expression()) {
			return
		}

		const cooker = this.scene().cooker()
		cooker.block()
		this.clear_error()
		this._value = new_value
		this.set_expression(null)
		this.set_dirty()
		this.execute_callback()
		cooker.unblock()

		this.emit_param_updated()
	}
	// set_expression(string: string){
	// 	if ((string === null) && !this.has_expression()) { return; }
	// 	if ((string === this._expression) && this.has_expression()) { return; }

	// 	const cooker = this.scene().cooker();
	// 	cooker.block();
	// 	this.graph_disconnect_predecessors(); // necessary for time dependency
	// 	this.clear_error();
	// 	this.reset_parsed_expression();
	// 	this._expression = string;
	// 	//this.parse_expression_and_update_dependencies()
	// 	this.set_dirty();
	// 	cooker.unblock();
	// 	this.emit_param_updated();

	// }
}