import {TypedMatNode} from './_Base';
import {GlAssemblerController} from '../gl/Assembler/Controller';

import {ShaderMaterial} from 'three/src/materials/ShaderMaterial';

// import DisplayFlag from '../Concerns/DisplayFlag';

import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {BaseGlShaderAssembler} from '../gl/Assembler/_Base';
import {GlNodeChildrenMap} from 'src/engine/poly/registers/Gl';
import {BaseGlNodeType} from '../gl/_Base';
// type RenderHook = (object: Object3D) => void;

export abstract class TypedBuilderMatNode<
	A extends BaseGlShaderAssembler,
	K extends NodeParamsConfig
> extends TypedMatNode<ShaderMaterial, K> {
	protected _assembler_controller: GlAssemblerController<A> | undefined;
	create_material() {
		return new ShaderMaterial();
	}
	get assembler_controller() {
		return (this._assembler_controller = this._assembler_controller || this._create_assembler_controller());
	}
	protected abstract _create_assembler_controller(): GlAssemblerController<A>;

	create_node<K extends keyof GlNodeChildrenMap>(type: K): GlNodeChildrenMap[K] {
		return super.create_node(type) as GlNodeChildrenMap[K];
	}
	children() {
		return super.children() as BaseGlNodeType[];
	}
	nodes_by_type<K extends keyof GlNodeChildrenMap>(type: K): GlNodeChildrenMap[K][] {
		return super.nodes_by_type(type) as GlNodeChildrenMap[K][];
	}
}
//delete object.onBeforeRender

export type BaseBuilderMatNodeType = TypedBuilderMatNode<BaseGlShaderAssembler, NodeParamsConfig>;
