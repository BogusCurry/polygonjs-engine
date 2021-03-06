import {TypedSopNode} from './_Base';
import {CoreGroup} from '../../../core/geometry/Group';

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {AttribClassMenuEntries, AttribClass} from '../../../core/geometry/Constant';
import {InputCloneMode} from '../../poly/InputCloneMode';
class AttribRenameSopParamsConfig extends NodeParamsConfig {
	class = ParamConfig.INTEGER(AttribClass.VERTEX, {
		menu: {
			entries: AttribClassMenuEntries,
		},
	});
	old_name = ParamConfig.STRING();
	new_name = ParamConfig.STRING();
}
const ParamsConfig = new AttribRenameSopParamsConfig();

export class AttribRenameSopNode extends TypedSopNode<AttribRenameSopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'attrib_rename';
	}

	initialize_node() {
		this.io.inputs.set_count(1);
		this.io.inputs.init_inputs_cloned_state(InputCloneMode.FROM_NODE);

		this.scene.dispatch_controller.on_add_listener(() => {
			this.params.on_params_created('params_label', () => {
				this.params.label.init([this.p.old_name, this.p.new_name], () => {
					if (this.pv.old_name != '' && this.pv.new_name != '') {
						return `${this.pv.old_name} -> ${this.pv.new_name}`;
					} else {
						return '';
					}
				});
			});
		});
	}

	cook(input_contents: CoreGroup[]) {
		// const group = input_containers[0].group();
		const core_group = input_contents[0];

		core_group.rename_attrib(this.pv.old_name, this.pv.new_name, this.pv.class);

		this.set_core_group(core_group);
	}
}
