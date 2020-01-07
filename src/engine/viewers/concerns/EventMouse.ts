//import EventHelper from '../../Helper/Event'
import {BaseViewer} from '../_Base'

export function EventMouse<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseViewer = <unknown>this as BaseViewer

		private _mousedown_pos = {x: null, y: null}
		private _mouse_distance_travelled: number = null

		protected _on_mousedown(event: MouseEvent){
			this._mouse_distance_travelled = 0
			this._mousedown_pos.x = event.pageX
			this._mousedown_pos.y = event.pageY
		}

		protected _on_mousemove(event: MouseEvent){
			// pan_in_progress = @cam_animation_helper?.pan_progress(event, this.camera())
			// orbit_in_progress = @cam_animation_helper?.orbit_progress(event, this.camera())
			// move_in_progress = (pan_in_progress || orbit_in_progress)
			// if !move_in_progress
			if(this._mouse_distance_travelled !== null){
				this._mouse_distance_travelled += Math.abs((event.pageX - this._mousedown_pos.x) + (event.pageY - this._mousedown_pos.y))
			}

			if(!this._controls_active){
				this.self.process_picker_nodes_on_mouse_move(event, this.current_camera, this.ray_helper)
			}

			// if this.capturer
			// 	this.capturer.set_mouse_move_event(event)
		}

		protected _on_mouseup(event: MouseEvent){

			if(this._mouse_distance_travelled < 2){
				this.self.process_picker_nodes_on_click(event, this.current_camera, this.ray_helper)
			}
			this._mouse_distance_travelled = null
		}
		// on_wheel: (event)->
		// 	@cam_animation_helper?.zoom(event)
	}
}