const DESKTOP_BROWSE_OPTION = 'desktop_browse'
const FILE_TYPE_OPTION = 'file_type'

interface ParamOptions {
	desktop_browse?: StringsByString
}

export function DesktopOption<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		_options: ParamOptions

		desktop_browse_allowed(): boolean {
			return this._options[DESKTOP_BROWSE_OPTION] !== undefined
		}
		desktop_browse_file_type(): string {
			if (this.desktop_browse_allowed()) {
				return this._options[DESKTOP_BROWSE_OPTION][FILE_TYPE_OPTION]
			}
		}
	}
}