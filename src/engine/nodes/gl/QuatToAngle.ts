import {BaseNodeGlMathFunctionArg1GlNode} from './_BaseMathFunctionArg1';
import Quaternion from './gl/quaternion.glsl';
import {ConnectionPointType} from '../utils/connections/ConnectionPointType';
import {FunctionGLDefinition} from './utils/GLDefinition';

export class QuatToAngleGlNode extends BaseNodeGlMathFunctionArg1GlNode {
	static type() {
		return 'quat_to_angle';
	}

	initialize_node() {
		super.initialize_node();

		this.gl_connections_controller.set_input_name_function((index: number) => ['quat'][index]);
		this.gl_connections_controller.set_expected_input_types_function(() => [ConnectionPointType.VEC4]);
		this.gl_connections_controller.set_expected_output_types_function(() => [ConnectionPointType.FLOAT]);
	}

	// protected _gl_input_name(index: number) {
	// 	return ['quat'][index];
	// }
	gl_method_name(): string {
		return 'quat_to_angle';
	}

	// protected _expected_input_types() {
	// 	return [ConnectionPointType.VEC4];
	// }
	// protected _expected_output_types() {
	// 	return [ConnectionPointType.FLOAT];
	// }
	gl_function_definitions() {
		return [new FunctionGLDefinition(this, ConnectionPointType.FLOAT, Quaternion)];
	}
}