import {TypedMultipleParam} from './_Multiple';
import lodash_isArray from 'lodash/isArray';
// import lodash_isNumber from 'lodash/isNumber';
import {Color} from 'three/src/math/Color';
import {ParamType} from '../poly/ParamType';
import {FloatParam} from './Float';
import {ParamValuesTypeMap} from '../nodes/utils/params/ParamsController';
// import {ParamInitValuesTypeMap} from '../nodes/utils/params/ParamsController';

const COMPONENT_NAMES_COLOR = ['r', 'g', 'b'];
export class ColorParam extends TypedMultipleParam<ParamType.COLOR> {
	protected _value = new Color();
	r!: FloatParam;
	g!: FloatParam;
	b!: FloatParam;
	static type() {
		return ParamType.COLOR;
	}
	static get component_names() {
		return COMPONENT_NAMES_COLOR;
	}
	get default_value_serialized() {
		if (lodash_isArray(this.default_value)) {
			return this.default_value;
		} else {
			return this.default_value.toArray() as Number3;
		}
	}
	get value_serialized() {
		return this.value.toArray() as Number3;
	}
	static are_values_equal(val1: ParamValuesTypeMap[ParamType.COLOR], val2: ParamValuesTypeMap[ParamType.COLOR]) {
		return val1.equals(val2);
	}
	init_components() {
		super.init_components();
		this.r = this.components[0];
		this.g = this.components[1];
		this.b = this.components[2];
	}

	set_value_from_components() {
		this._value.r = this.r.value;
		this._value.g = this.g.value;
		this._value.b = this.b.value;
	}
	// convert(input: ParamInitValuesTypeMap[ParamType.COLOR]): Color | null {
	// 	if (lodash_isArray(input)) {
	// 		if(input.length == 3){
	// 			if( input.filter(lodash_isNumber).length > 0 ){
	// 				return new Color().fromArray(input);
	// 			}
	// 			if(first){
	// 				if(lodash_isNumber(first)){
	// 					return new Color().fromArray(input);
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return new Color();
	// }
}
