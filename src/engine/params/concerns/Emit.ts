import {BaseParam} from '../_Base'

export function Emit<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		_blocked_emit: boolean = true
		_blocked_parent_emit: boolean = true
		protected self: BaseParam = (<unknown>this) as BaseParam

		emit_allowed(): boolean {
			if (this._blocked_emit === true) {
				return false
			}

			if (this.self.scene().is_loading()) {
				return false
			}
			// TODO: should I also prevent nodes from updating
			// when they are being called in a loop such as from the Copy SOP?
			//node = this.node()
			//node? && !node.is_cooking() && this.scene().emit_allowed() # this prevents a camera from updating its param for instance
			// although maybe I should send a dirty to the store, and then that store queries the param?
			return this.self.scene().emit_allowed()
		}

		block_emit() {
			this._blocked_emit = true
			if (this.self.is_multiple()) {
				this.self.components().forEach((c: BaseParam) => c.block_emit())
			}
			return true
		}
		unblock_emit() {
			this._blocked_emit = false
			if (this.self.is_multiple()) {
				this.self
					.components()
					.forEach((c: BaseParam) => c.unblock_emit())
			}
			return true
		}
		block_parent_emit() {
			this._blocked_parent_emit = true
			return true
		}
		unblock_parent_emit() {
			this._blocked_parent_emit = false
			return true
		}

		emit_param_updated() {
			if (this.emit_allowed()) {
				this.self.emit('param_updated')

				if (
					this.self._parent_param != null &&
					this._blocked_parent_emit !== true
				) {
					this.self._parent_param.emit('param_updated')
				}
			}
			//else
			//	this.emit('param_updated')

			// return null
		}
	}
}