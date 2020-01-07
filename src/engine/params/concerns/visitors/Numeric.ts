interface NumericParamVisitor {
	param_numeric: (param: any) => void
}

export function AsCodeNumeric<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		visit(visitor: NumericParamVisitor) {
			return visitor.param_numeric(this)
		}
	}
}