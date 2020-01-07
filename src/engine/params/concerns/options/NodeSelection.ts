// for OperatorPath
const NODE_SELECTION = 'node_selection'
const NODE_SELECTION_CONTEXT = 'context'
const DEPENDENT_ON_FOUND_NODE = 'dependent_on_found_node'

interface ParamOptions {
	node_selection?: {
		context?: string
	}
	dependent_on_found_node?: boolean
}

export function NodeSelectionOption<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		_options: ParamOptions

		node_selection_options() {
			return this._options[NODE_SELECTION]
		}
		node_selection_context() {
			const options = this.node_selection_options()
			if (options) {
				return options[NODE_SELECTION_CONTEXT]
			}
		}

		dependent_on_found_node() {
			if (DEPENDENT_ON_FOUND_NODE in this._options) {
				return this._options[DEPENDENT_ON_FOUND_NODE]
			} else {
				return true
			}
		}
	}
}