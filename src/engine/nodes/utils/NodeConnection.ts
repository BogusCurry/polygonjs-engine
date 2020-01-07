import {BaseNode} from '../_Base'
import {_Math} from 'three/src/math/Math'
const THREE = {Math:_Math}

export enum ConnectionType {
	GEOMETRY = 'geometry',
	MATRIX = 'matrix',
	INT = 'int',
	FLOAT = 'float',
	BOOL = 'bool',
	VEC2 = 'vec2',
	VEC3 = 'vec3',
	VEC4 = 'vec4',
	MAT3 = 'mat3',
	RGB = 'rgb',
	RGBA = 'rgba',
}

export class NodeConnection {

	private _uuid: string

	constructor(
		private _node_src: BaseNode,
		private _node_dest: BaseNode,
		private _output_index: number,
		private _input_index: number,
		) {
			this._uuid = THREE.Math.generateUUID()

			this._node_src.add_output_connection(this)
			this._node_dest.add_input_connection(this)
	}
	uuid(){ return this._uuid }

	node_src(){ return this._node_src }
	node_dest(){ return this._node_dest }
	output_index(){ return this._output_index }
	input_index(){ return this._input_index }

	disconnect(options={}){
		this._node_src.remove_output_connection(this)
		this._node_dest.remove_input_connection(this)

		if(options['set_input'] === true){
			this._node_dest.set_input(this._input_index, null)
		}
	}
}
