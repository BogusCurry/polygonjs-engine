import {CATEGORY_GL} from './Category';

import {AttributeGlNode} from 'src/engine/nodes/gl/Attribute';
import {ConstantGlNode} from 'src/engine/nodes/gl/Constant';
import {GlobalsGlNode} from 'src/engine/nodes/gl/Globals';
import {OutputGlNode} from 'src/engine/nodes/gl/Output';
import {ParamGlNode} from 'src/engine/nodes/gl/Param';

export interface GlNodeChildrenMap {
	attribute: AttributeGlNode;
	constant: ConstantGlNode;
	globals: GlobalsGlNode;
	output: OutputGlNode;
	param: ParamGlNode;
}

import {Poly} from 'src/engine/Poly';
export class GlRegister {
	static run(poly: Poly) {
		poly.register_node(AttributeGlNode, CATEGORY_GL.GLOBALS);
		poly.register_node(ConstantGlNode, CATEGORY_GL.GLOBALS);
		poly.register_node(GlobalsGlNode, CATEGORY_GL.GLOBALS);
		poly.register_node(OutputGlNode, CATEGORY_GL.GLOBALS);
		poly.register_node(ParamGlNode, CATEGORY_GL.GLOBALS);
	}
}