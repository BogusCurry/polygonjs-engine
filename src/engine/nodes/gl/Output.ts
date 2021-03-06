import {TypedGlNode} from './_Base';
// import {ThreeToGl} from '../../../Core/ThreeToGl';
// import {CodeBuilder} from './Util/CodeBuilder'
// import {Definition} from './Definition/_Module';
// import {ShaderName, LineType, LINE_TYPES} from './Assembler/Util/CodeBuilder';

import {NodeParamsConfig} from '../utils/params/ParamsConfig';
import {ShadersCollectionController} from './code/utils/ShadersCollectionController';
class OutputGlParamsConfig extends NodeParamsConfig {}
const ParamsConfig = new OutputGlParamsConfig();

export class OutputGlNode extends TypedGlNode<OutputGlParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'output';
	}

	initialize_node() {
		super.initialize_node();
		this.add_post_dirty_hook('_set_mat_to_recompile', this._set_mat_to_recompile.bind(this));

		this.lifecycle.add_on_add_hook(() => {
			this.material_node?.assembler_controller?.add_output_inputs(this);
		});
	}

	set_lines(shaders_collection_controller: ShadersCollectionController) {
		// if (shaders_collection_controller.shader_name) {
		this.material_node?.assembler_controller?.assembler.set_node_lines_output(this, shaders_collection_controller);
		// }
	}

	// set_color_declaration(color_declaration: string){
	// 	this._color_declaration = color_declaration
	// }
}
