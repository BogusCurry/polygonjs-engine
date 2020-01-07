import lodash_isNumber from 'lodash/isNumber'
// import BaseNode from 'src/engine/nodes/_Base'
import {DecomposedPath} from 'src/core/DecomposedPath'
import {NameGraphNode} from 'src/core/graph/NameGraphNode'
import {BaseParam} from 'src/engine/params/_Base'
import {BaseNode} from 'src/engine/nodes/_Base'
import {NodeSimple} from 'src/core/graph/NodeSimple'
import jsep from 'jsep'

type NodeOrParam = BaseNode | BaseParam

export class MethodDependency extends NodeSimple {
	public jsep_node: jsep.Expression
	public resolved_graph_node: NodeOrParam
	public unresolved_path: string

	constructor(
		public param: BaseParam,
		public path_argument: number | string,
		public decomposed_path: DecomposedPath
	) {
		super()

		this.set_scene(this.param.scene())

		this.add_post_dirty_hook(this._update_from_name_change.bind(this))
	}
	_update_from_name_change(original_trigger_graph_node: NameGraphNode) {
		this.decomposed_path.update_from_name_change(
			(<unknown>original_trigger_graph_node.owner) as NodeOrParam // TODO: typescript
		)
		const new_path = this.decomposed_path.to_path()

		const literal = this.jsep_node as jsep.Literal
		if (literal) {
			literal.value = `${literal.value}`.replace(
				`${this.path_argument}`,
				new_path
			)
			literal.raw = literal.raw.replace(`${this.path_argument}`, new_path)
		}
		this.param.update_expression_from_method_dependency_name_change()
	}
	reset() {
		this.graph_disconnect_predecessors()
	}

	listen_for_name_changes() {
		if (this.jsep_node && this.decomposed_path) {
			this.decomposed_path.named_nodes.forEach((node_in_path) => {
				if (node_in_path) {
					this.add_graph_input(node_in_path.name_graph_node())
				}
			})
		}
	}

	set_jsep_node(jsep_node: jsep.Expression) {
		this.jsep_node = jsep_node
	}
	set_resolved_graph_node(node: NodeOrParam) {
		this.resolved_graph_node = node
	}
	set_unresolved_path(path: string) {
		this.unresolved_path = path
	}

	static create(
		param: BaseParam,
		index_or_path: number | string,
		node: NodeOrParam,
		nodes_in_path: NodeOrParam[]
	) {
		const is_index = lodash_isNumber(index_or_path)

		const decomposed_path = new DecomposedPath()
		for (let node_in_path of nodes_in_path) {
			decomposed_path.add_node(node_in_path.name(), node_in_path)
		}

		const instance = new MethodDependency(
			param,
			index_or_path,
			decomposed_path
		)
		if (node) {
			instance.set_resolved_graph_node(node)
		} else {
			if (!is_index) {
				const path = index_or_path as string
				instance.set_unresolved_path(path)
			}
		}
		return instance
	}
}