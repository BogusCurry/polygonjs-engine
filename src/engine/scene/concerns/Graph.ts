import {CoreGraph} from 'src/core/graph/CoreGraph'
import {PolyScene} from 'src/engine/scene/PolyScene'

export function GraphMixin<TBase extends Constructor>(Base: TBase) {
	return class extends Base {
		protected self: PolyScene = (<unknown>this) as PolyScene
		_graph: CoreGraph

		_init_graph() {
			this._graph = new CoreGraph()
			this._graph.set_scene(this.self)
		}
		graph() {
			return this._graph
		}
	}
}