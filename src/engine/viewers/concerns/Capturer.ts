import {BaseViewer} from '../_Base'

export function Capturer<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseViewer = (<unknown>this) as BaseViewer
		_capturer: any

		capturer() {
			return this._capturer
		}

		set_capturer(capturer: any /* any for now, as I don't want to have the CanvasCapturer in the player */) {
			this._capturer = capturer
		}
		dispose_capturer() {
			this._capturer = null
		}
	}
}