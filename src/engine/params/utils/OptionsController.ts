import lodash_compact from 'lodash/compact';
import lodash_cloneDeep from 'lodash/cloneDeep';
import lodash_isArray from 'lodash/isArray';
import lodash_isBoolean from 'lodash/isBoolean';
import lodash_isEqual from 'lodash/isEqual';
import lodash_flatten from 'lodash/flatten';
import {BaseParamType} from '../_Base';
import {BaseNodeType} from '../../nodes/_Base';
import {ParamType} from '../../poly/ParamType';
import {ParamEvent} from '../../poly/ParamEvent';
import {NodeContext} from '../../poly/NodeContext';
import {CoreGraphNode} from '../../../core/graph/CoreGraphNode';
import {StringParam} from '../String';
import {ColorConversion} from '../../../core/Color';

const ASSET_REFERENCE_OPTION = 'asset_reference';
const CALLBACK_OPTION = 'callback';
const CALLBACK_STRING_OPTION = 'callback_string';
// const COLOR_OPTION = 'color';
const COMPUTE_ON_DIRTY = 'compute_on_dirty';
const COOK_OPTION = 'cook';
const DESKTOP_BROWSE_OPTION = 'desktop_browse';
const FILE_TYPE_OPTION = 'file_type';
// const EXPRESSION_ONLY_OPTION = 'expression_only';
const EXPRESSION = 'expression';
const FOR_ENTITIES = 'for_entities';
const LABEL = 'label';
const LEVEL = 'level';
const MENU = 'menu';
const ENTRIES = 'entries';
// const TYPE = 'type';
// const RADIO = 'radio';
const MULTILINE_OPTION = 'multiline';
const LANGUAGE_OPTION = 'language';
const NODE_SELECTION = 'node_selection';
const NODE_SELECTION_CONTEXT = 'context';
const NODE_SELECTION_TYPES = 'types';
const PARAM_SELECTION = 'param_selection';
const DEPENDENT_ON_FOUND_NODE = 'dependent_on_found_node';
const RANGE_OPTION = 'range';
const RANGE_LOCKED_OPTION = 'range_locked';
const STEP_OPTION = 'step';
const SPARE_OPTION = 'spare';
const TEXTURE_OPTION = 'texture';
const ENV_OPTION = 'env';
const HIDDEN_OPTION = 'hidden';
const SHOW_LABEL_OPTION = 'show_label';
const FIELD_OPTION = 'field';
const VISIBLE_IF_OPTION = 'visible_if';
const COLOR_CONVERSION = 'conversion';

export interface ParamOptionsMenuEntry {
	name: string;
	value: number;
}
export enum StringParamLanguage {
	// JAVASCRIPT = 'javascript',
	TYPESCRIPT = 'typescript',
	// GLSL = 'glsl',
}

export enum DesktopFileType {
	TEXTURE = 'texture',
	GEOMETRY = 'geometry',
}

export type VisibleIfParamOptions = Dictionary<number | boolean>;
interface BaseParamOptions {
	// cook
	cook?: boolean;
	// spare
	spare?: boolean;
	// visible
	hidden?: boolean;
	show_label?: boolean;
	field?: boolean;
	visible_if?: VisibleIfParamOptions | VisibleIfParamOptions[];
}
export interface MenuParamOptions {
	menu?: {
		entries: ParamOptionsMenuEntry[];
	};
}
interface ExpressionParamOptions {
	expression?: {
		for_entities?: boolean;
	};
}

interface NumberParamOptions extends BaseParamOptions {
	range?: Number2;
	range_locked?: Boolean2;
	step?: number;
}
interface AssetParamOptions {
	asset_reference?: boolean;
}
interface DesktopParamOptions {
	desktop_browse?: {
		file_type: DesktopFileType;
	};
}
interface ComputeOnDirtyParamOptions {
	compute_on_dirty?: boolean;
}
interface CallbackParamOptions {
	callback?: (node: BaseNodeType, param: BaseParamType) => any;
	callback_string?: string;
}
interface LabelParamOptions {
	label?: string;
}
interface ColorConversionOptions {
	conversion?: ColorConversion;
}

// actual param options
export interface BooleanParamOptions
	extends BaseParamOptions,
		ComputeOnDirtyParamOptions,
		MenuParamOptions,
		ExpressionParamOptions,
		CallbackParamOptions {}
export interface ButtonParamOptions extends BaseParamOptions, CallbackParamOptions, LabelParamOptions {}
export interface ColorParamOptions
	extends BaseParamOptions,
		ColorConversionOptions,
		ExpressionParamOptions,
		CallbackParamOptions,
		ComputeOnDirtyParamOptions {}
export interface FloatParamOptions
	extends NumberParamOptions,
		MenuParamOptions,
		ComputeOnDirtyParamOptions,
		ExpressionParamOptions,
		CallbackParamOptions {}
export interface FolderParamOptions extends BaseParamOptions {
	level?: number;
}
export interface IntegerParamOptions extends NumberParamOptions, MenuParamOptions, CallbackParamOptions {}
export interface OperatorPathParamOptions
	extends BaseParamOptions,
		DesktopParamOptions,
		ComputeOnDirtyParamOptions,
		CallbackParamOptions {
	node_selection?: {
		context?: NodeContext;
		types?: string[];
	};
	dependent_on_found_node?: boolean;
	param_selection?: ParamType | boolean;
}
export interface RampParamOptions extends BaseParamOptions {}
export interface SeparatorParamOptions extends BaseParamOptions {}
export interface StringParamOptions
	extends BaseParamOptions,
		AssetParamOptions,
		DesktopParamOptions,
		CallbackParamOptions,
		ExpressionParamOptions {
	multiline?: boolean;
	language?: StringParamLanguage;
}
interface VectorParamOptions
	extends BaseParamOptions,
		ExpressionParamOptions,
		CallbackParamOptions,
		ComputeOnDirtyParamOptions {}
export interface Vector2ParamOptions extends VectorParamOptions {}
export interface Vector3ParamOptions extends VectorParamOptions {}
export interface Vector4ParamOptions extends VectorParamOptions {}

export interface ParamOptions
	extends NumberParamOptions,
		ColorConversionOptions,
		ComputeOnDirtyParamOptions,
		FolderParamOptions,
		ExpressionParamOptions,
		ButtonParamOptions,
		DesktopParamOptions,
		MenuParamOptions,
		StringParamOptions,
		OperatorPathParamOptions {
	texture?: {
		env?: boolean;
	};
}

export class OptionsController {
	private _programatic_visible_state: boolean = true;
	private _options!: ParamOptions;
	private _default_options!: ParamOptions;
	constructor(private _param: BaseParamType) {
		// this._options = lodash_cloneDeep(this._default_options);
	}

	set(options: ParamOptions) {
		this._default_options = options;
		this._options = lodash_cloneDeep(this._default_options);
		this.post_set_options();
	}
	copy(options_controller: OptionsController) {
		this._default_options = lodash_cloneDeep(options_controller.default);
		this._options = lodash_cloneDeep(options_controller.current);
		this.post_set_options();
	}
	set_option<K extends keyof ParamOptions>(name: K, value: ParamOptions[K]) {
		this._options[name] = value;
		if (this._param.components) {
			for (let component of this._param.components) {
				component.options.set_option(name, value);
			}
		}
	}
	private post_set_options() {
		this._handle_compute_on_dirty();
		if (this.asset_reference && this.param.type == ParamType.STRING) {
			this.param.scene.assets_controller.register_param(this.param as StringParam);
		}
	}
	get param() {
		return this._param;
	}
	get node(): BaseNodeType {
		return this._param.node;
	}
	get default() {
		return this._default_options;
	}
	get current() {
		return this._options;
	}

	// utils
	get has_options_overridden(): boolean {
		return !lodash_isEqual(this._options, this._default_options);
	}
	get overridden_options(): ParamOptions {
		const overriden: ParamOptions = {};
		const option_names = Object.keys(this._options) as Array<keyof ParamOptions>;
		for (let option_name of option_names) {
			if (!lodash_isEqual(this._options[option_name], this._default_options[option_name])) {
				const cloned_option = lodash_cloneDeep(this._options[option_name]);
				Object.assign(overriden, {[option_name]: cloned_option});
			}
		}
		return overriden;
	}
	get overridden_option_names(): Array<keyof ParamOptions> {
		return Object.keys(this.overridden_options) as Array<keyof ParamOptions>;
	}

	// referenced assets
	get asset_reference(): boolean {
		return this._options[ASSET_REFERENCE_OPTION] || false;
	}

	// compute on dirty
	get compute_on_dirty(): boolean {
		return this._options[COMPUTE_ON_DIRTY] || false;
	}
	private _compute_on_dirty_callback_added: boolean | undefined;
	private _handle_compute_on_dirty() {
		if (this.compute_on_dirty) {
			if (!this._compute_on_dirty_callback_added) {
				this.param.add_post_dirty_hook('compute_on_dirty', this._compute_param.bind(this));
				this._compute_on_dirty_callback_added = true;
			}
		}
	}
	private async _compute_param() {
		await this.param.compute();
	}

	// callback
	has_callback() {
		return this._options[CALLBACK_OPTION] != null || this._options[CALLBACK_STRING_OPTION] != null;
	}

	execute_callback() {
		if (!this.node) {
			return;
		}
		// we only allow execution when scene is loaded
		// to avoid errors such as an operator_path param
		// executing its callback before the node it points to is created
		if (!this.node.scene.loading_controller.loaded) {
			return;
		}
		const callback = this.get_callback();
		if (callback != null) {
			// not running the callback when a node is cooking prevents some event nodes from behaving as expected.
			// It may also prevent files such as the sop/file to reload correctly if its reload callback was called while it loads a file
			// if (!this.node.cook_controller.is_cooking) {
			if (this.param.parent_param) {
				// if the param is a component of a MultipleParam,
				// we let the parent handle the callback.
				// The main reason is for material builder uniforms.
				// If the component executes the callback, the uniform that is expecting a vector
				// will be receiving a float. The reason is that the callback is created by the ParamConfig, and it is then passed down to the component unchanged.
				// I could maybe find a way so that the param config creates callback for the multiple param
				// and also for the components. But they would have to be assigned correctly by the multiple param
				this.param.parent_param.options.execute_callback();
			} else {
				callback(this.node, this.param);
			}
			// } else {
			// 	console.warn(`node ${this.node.full_path()} cooking, not running callback`, this.param.name);
			// }
		}
	}
	private get_callback() {
		if (this.has_callback()) {
			return (this._options[CALLBACK_OPTION] =
				this._options[CALLBACK_OPTION] || this.create_callback_from_string());
		}
	}
	private create_callback_from_string() {
		const callback_string = this._options[CALLBACK_STRING_OPTION];
		if (callback_string) {
			const callback_function = new Function('node', 'scene', 'window', 'location', callback_string);
			return () => {
				callback_function(this.node, this.node.scene, null, null);
			};
		}
	}

	// color
	color_conversion() {
		return this._options[COLOR_CONVERSION];
	}

	// cook
	makes_node_dirty_when_dirty() {
		let cook_options;

		// false as the dirty state will go through the parent param
		if (this.param.parent_param != null) {
			return false;
		}

		let value = true;
		if ((cook_options = this._options[COOK_OPTION]) != null) {
			value = cook_options;
		}
		return value;
	}

	// desktop
	get desktop_browse_option() {
		return this._options[DESKTOP_BROWSE_OPTION];
	}
	get desktop_browse_allowed(): boolean {
		return this.desktop_browse_option != null;
	}
	desktop_browse_file_type(): DesktopFileType | null {
		if (this.desktop_browse_option) {
			return this.desktop_browse_option[FILE_TYPE_OPTION];
		} else {
			return null;
		}
	}

	// expression
	// get displays_expression_only() {
	// 	return this._options[EXPRESSION_ONLY_OPTION] === true;
	// }
	get is_expression_for_entities(): boolean {
		const expr_option = this._options[EXPRESSION];
		if (expr_option) {
			return expr_option[FOR_ENTITIES] || false;
		}
		return false;
	}

	// folder
	get level() {
		return this._options[LEVEL] || 0;
	}

	// menu
	get has_menu() {
		return this.menu_options != null;
	}

	private get menu_options() {
		return this._options[MENU];
	}
	// private get menu_type() {
	// 	if(this.menu_options){
	// 		return this.menu_options[TYPE];
	// 	}
	// }

	get menu_entries() {
		if (this.menu_options) {
			return this.menu_options[ENTRIES];
		} else {
			return [];
		}
	}

	get has_menu_radio() {
		return this.has_menu; //&& this.menu_options[TYPE] === RADIO;
	}

	// multiline
	get is_multiline(): boolean {
		return this._options[MULTILINE_OPTION] === true;
	}
	get language(): StringParamLanguage | undefined {
		return this._options[LANGUAGE_OPTION];
	}
	get is_code(): boolean {
		return this.language != null;
	}

	// node selection
	get node_selection_options() {
		return this._options[NODE_SELECTION];
	}
	get node_selection_context() {
		if (this.node_selection_options) {
			return this.node_selection_options[NODE_SELECTION_CONTEXT];
		}
	}
	get node_selection_types() {
		if (this.node_selection_options) {
			return this.node_selection_options[NODE_SELECTION_TYPES];
		}
	}

	dependent_on_found_node() {
		if (DEPENDENT_ON_FOUND_NODE in this._options) {
			return this._options[DEPENDENT_ON_FOUND_NODE];
		} else {
			return true;
		}
	}

	// param selection
	is_selecting_param() {
		return this.param_selection_options != null;
	}
	get param_selection_options() {
		return this._options[PARAM_SELECTION];
	}
	get param_selection_type() {
		if (this.param_selection_options) {
			const type_or_boolean = this.param_selection_options;
			if (!lodash_isBoolean(type_or_boolean)) {
				return type_or_boolean;
			}
		}
	}

	// range
	get range(): Number2 {
		// cannot force range easily, as values are not necessarily from 0 to N
		// if(this.self.has_menu() && this.self.menu_entries()){
		// 	return [0, this.self.menu_entries().length-1 ]
		// } else {
		return this._options[RANGE_OPTION] || [0, 1];
		// }
	}
	get step(): number | undefined {
		return this._options[STEP_OPTION];
	}

	private range_locked(): Boolean2 {
		// if(this.self.has_menu() && this.self.menu_entries()){
		// 	return [true, true]
		// } else {
		return this._options[RANGE_LOCKED_OPTION] || [false, false];
		// }
	}

	ensure_in_range(value: number): number {
		const range = this.range;

		if (value >= range[0] && value <= range[1]) {
			return value;
		} else {
			if (value < range[0]) {
				return this.range_locked()[0] === true ? range[0] : value;
			} else {
				return this.range_locked()[1] === true ? range[1] : value;
			}
		}
	}

	// spare
	get is_spare(): boolean {
		return this._options[SPARE_OPTION] || false;
	}

	// texture
	get texture_options() {
		return this._options[TEXTURE_OPTION];
	}
	texture_as_env(): boolean {
		const texture_options = this.texture_options;
		if (texture_options != null) {
			return texture_options[ENV_OPTION] === true;
		}
		return false;
	}

	// visible
	get is_hidden(): boolean {
		return this._options[HIDDEN_OPTION] === true || this._programatic_visible_state === false;
	}
	get is_visible(): boolean {
		return !this.is_hidden;
	}
	set_visible_state(state: boolean) {
		this._options[HIDDEN_OPTION] = !state;
		this.param.emit(ParamEvent.VISIBLE_UPDATED);
	}
	// label
	get label() {
		return this._options[LABEL];
	}
	get is_label_hidden(): boolean {
		const type = this.param.type;
		return (
			this._options[SHOW_LABEL_OPTION] === false ||
			type === ParamType.BUTTON ||
			type === ParamType.SEPARATOR ||
			(type === ParamType.BOOLEAN && this.is_field_hidden())
		);
	}
	is_field_hidden(): boolean {
		return this._options[FIELD_OPTION] === false;
	}

	// programatic visibility
	ui_data_depends_on_other_params(): boolean {
		return VISIBLE_IF_OPTION in this._options;
	}
	visibility_predecessors() {
		const visibility_options = this._options[VISIBLE_IF_OPTION];
		if (!visibility_options) {
			return [];
		}
		let predecessor_names: string[] = [];
		if (lodash_isArray(visibility_options)) {
			predecessor_names = lodash_flatten(visibility_options.map((options) => Object.keys(options)));
		} else {
			predecessor_names = Object.keys(visibility_options);
		}
		const node = this.param.node;
		return lodash_compact(
			predecessor_names.map((name) => {
				const param = node.params.get(name);
				if (param) {
					return param;
				} else {
					console.error(
						`param ${name} not found as visibility condition for ${this.param.name} in node ${this.param.node.type}`
					);
				}
			})
		);
	}

	private _update_visibility_and_remove_dirty_bound = this.update_visibility_and_remove_dirty.bind(this);
	private _visibility_graph_node: CoreGraphNode | undefined;
	private _ui_data_dependency_set: boolean = false;
	set_ui_data_dependency() {
		// currently this is only called on request on a per-param and therefore per-node basis, not on scene load for the whole scene
		if (this._ui_data_dependency_set) {
			return;
		}
		this._ui_data_dependency_set = true;
		const predecessors = this.visibility_predecessors();
		if (predecessors.length > 0) {
			this._visibility_graph_node = new CoreGraphNode(this.param.scene, 'param_visibility');
			for (let predecessor of predecessors) {
				this._visibility_graph_node.add_graph_input(predecessor);
			}
			this._visibility_graph_node.add_post_dirty_hook(
				'_update_visibility_and_remove_dirty',
				this._update_visibility_and_remove_dirty_bound
			);
		}
	}
	private update_visibility_and_remove_dirty() {
		this.update_visibility();
		this.param.remove_dirty_state();
	}

	async update_visibility() {
		const options = this._options[VISIBLE_IF_OPTION];
		if (options) {
			const params = this.visibility_predecessors();
			const promises = params.map((p) => p.compute());
			this._programatic_visible_state = false;
			await Promise.all(promises);

			if (lodash_isArray(options)) {
				for (let options_set of options) {
					const satisfied_values = params.filter((param) => param.value == options_set[param.name]);
					if (satisfied_values.length == params.length) {
						this._programatic_visible_state = true;
					}
				}
			} else {
				const satisfied_values = params.filter((param) => param.value == options[param.name]);
				this._programatic_visible_state = satisfied_values.length == params.length;
			}

			this.param.emit(ParamEvent.VISIBLE_UPDATED);
		}
	}
}
