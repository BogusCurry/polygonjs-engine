import {CorePerformance} from 'src/core/performance/CorePerformance'

export function PerformanceMixin<TBase extends Constructor>(Base: TBase) {
	return class extends Base {
		protected _performance: CorePerformance

		_init_performance() {
			this._performance = new CorePerformance()
			// this._performance.start()
		}
		performance() {
			return this._performance
		}
	}
}