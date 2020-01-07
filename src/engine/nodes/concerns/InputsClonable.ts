// import lodash_times from 'lodash/times'
import {BaseNode} from '../_Base';

export enum InputCloneMode {
	ALWAYS = 'always',
	NEVER = 'never',
	FROM_NODE = 'from_node',
}

export function InputsClonable<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNode = (<unknown>this) as BaseNode;

		private _user_inputs_clonable_states: InputCloneMode[];
		private _inputs_clonable_states: InputCloneMode[];

		// when true, this means we override
		// therefore InputCloneMode.FROM_NODE becomes false
		private _override_clonable_state: boolean = false;

		override_clonable_state_allowed() {
			let value = false;
			for (let state of this.inputs_clonable_state()) {
				if (state == InputCloneMode.FROM_NODE) {
					value = true;
				}
			}
			return value;
		}

		inputs_clonable_state(): InputCloneMode[] {
			return (this._inputs_clonable_states = this._inputs_clonable_states || this.init_inputs_clonable_state());
		}
		input_cloned(index: number): boolean {
			return this.input_clonable_state_with_override(index);
		}
		inputs_clonable_state_with_override(): boolean[] {
			const list = [];
			const states = this.inputs_clonable_state();
			for (let i = 0; i < states.length; i++) {
				list.push(this.input_clonable_state_with_override(i));
			}
			return list;
		}
		input_clonable_state_with_override(index: number): boolean {
			const states = this.inputs_clonable_state();
			for (let i = 0; i < states.length; i++) {
				switch (states[i]) {
					case InputCloneMode.ALWAYS:
						return true;
						break;
					case InputCloneMode.NEVER:
						return false;
						break;
					case InputCloneMode.FROM_NODE:
						return !this._override_clonable_state;
						break;
				}
			}
		}

		protected init_inputs_clonable_state(values: InputCloneMode[] = null) {
			if (values) {
				this._user_inputs_clonable_states = values;
			}
			this._inputs_clonable_states =
				this._user_inputs_clonable_states || this._default_inputs_clonale_state_values();

			return this._inputs_clonable_states;
		}
		_default_inputs_clonale_state_values() {
			const list = [];
			for (let i = 0; i < this.self._max_inputs_count; i++) {
				// lodash_times(this.self._max_inputs_count, (i)=>{
				list.push(InputCloneMode.ALWAYS);
			}
			return list;
		}

		set_override_clonable_state(state: boolean) {
			this._override_clonable_state = state;
			this.self.emit('override_clonable_state_update');
		}
		override_clonable_state() {
			return this._override_clonable_state;
		}
	};
}