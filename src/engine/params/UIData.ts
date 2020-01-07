// import CoreUIData from 'src/core/UIData'
import {NodeScene} from 'src/core/graph/NodeScene'
import {BaseParam} from './_Base'

export class UIData extends NodeScene {
	private _folder_name: string

	constructor(private _param: BaseParam) {
		super()
		this.set_scene(this._param.scene())

		this.add_post_dirty_hook(
			this.update_visibility_and_remove_dirty.bind(this)
		)
	}

	update_visibility_and_remove_dirty() {
		this.update_visibility()
		this.remove_dirty_state()
	}

	update_visibility() {
		this._param.update_visibility()
	}

	set_folder_name(folder_name: string) {
		this._folder_name = folder_name
	}
	folder_name() {
		return this._folder_name
	}
}