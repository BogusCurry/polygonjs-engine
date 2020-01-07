
const MENU = 'menu';
const ENTRIES = 'entries';
const TYPE = 'type';
const RADIO = 'radio';

interface ParamOptionsMenuEntry {
	name: string
	value: number
}

interface ParamOptions {
	menu?: {
		type: 'radio'
		entries: ParamOptionsMenuEntry[]
	}
}

export function MenuOption<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		_options: ParamOptions

		has_menu() {
			return (this.menu_options() != null);
		}

		menu_options() {
			return this._options[MENU];
		}

		menu_entries() {
			return this.menu_options()[ENTRIES];
		}

		has_menu_radio() {
			return this.has_menu() &&
			(this.menu_options()[TYPE] === RADIO);
		}
	}
}