
const EXPRESSION_ONLY_OPTION = 'expression_only';
const EXPRESSION = 'expression';
const FOR_ENTITIES = 'for_entities';

interface ParamOptions {
	expression_only?: boolean
	expression?: {
		for_entities?: boolean
	}
}

export function ExpressionOption<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		_options: ParamOptions

		displays_expression_only() {
			return this._options[EXPRESSION_ONLY_OPTION] === true;
		}
		expression_for_entities(){
			const expr_option = this._options[EXPRESSION]
			if(expr_option){
				return expr_option[FOR_ENTITIES] == true
			}
			return false
		}
	};
}