import {SceneContext} from 'src/core/context/Scene'
import {PolyScene} from 'src/engine/scene/PolyScene'
// import {BaseNode} from 'src/engine/nodes/_Base'

type FrameRange = [number, number]

export function Frame<TBase extends Constructor>(Base: TBase) {
	return class extends Base {
		protected self: PolyScene = (<unknown>this) as PolyScene
		_frame_range: FrameRange
		_frame_range_locked: [boolean, boolean] = [true, true]
		_context: SceneContext
		_playing: boolean = false
		private _fps: number = 30
		private _frame_interval: number = 1000 / 30

		_init_frame() {
			this._context = new SceneContext()
			this._context.set_scene(this.self)

			this.set_frame_range(1, 240) //100 - 288*100-100
			this.set_fps(60)
		}
		context() {
			return this._context
		}
		frame_range(): FrameRange {
			return this._frame_range
		}
		frame_range_locked(): [boolean, boolean] {
			return this._frame_range_locked
		}
		set_frame_range(start_frame: number, end_frame: number) {
			this._frame_range = [Math.floor(start_frame), Math.floor(end_frame)]
			this.self.store_commit('scene_frame_range_updated')
		}
		set_frame_range_locked(start_locked: boolean, end_locked: boolean) {
			this._frame_range_locked = [start_locked, end_locked]
			this.self.store_commit('scene_frame_range_updated')
		}
		set_fps(fps: number) {
			this._fps = Math.floor(fps)
			this._frame_interval = 1000 / this._fps
			this.self.store_commit('scene_frame_range_updated')
		}
		fps(): number {
			return this._fps
		}
		frame(): number {
			return this._context.frame()
		}
		time(): number {
			return this._context.frame() / this._fps
		}
		set_frame(frame: number) {
			frame = this._ensure_frame_within_bounds(frame)
			this._context.set_frame(frame)

			this.self.update_frame_dependent_uniform_owners()
		}
		increment_frame() {
			let frame = this._context.frame() + 1
			frame = this._ensure_frame_within_bounds(frame)
			this.set_frame(frame)
		}
		decrement_frame() {
			let frame = this._context.frame() - 1
			frame = this._ensure_frame_within_bounds(frame)
			this.set_frame(frame)
		}
		set_first_frame() {
			this.set_frame(this.frame_range()[0])
		}
		_ensure_frame_within_bounds(frame: number): number {
			if (this._frame_range_locked[0] && frame < this._frame_range[0]) {
				frame = this._frame_range[1]
			}
			if (this._frame_range_locked[1] && frame > this._frame_range[1]) {
				frame = this._frame_range[0]
			}
			return frame
		}
		playing() {
			return this._playing === true
		}
		pause() {
			this._playing = false
			this._context.emit('scene_play_state_updated')
		}
		play() {
			if (this._playing !== true) {
				setTimeout(this.play_next_frame.bind(this), this._frame_interval)
			}
			this._playing = true
			this._context.emit('scene_play_state_updated')
		}
		toggle_play_pause() {
			if (this.playing()) {
				this.pause()
			} else {
				this.play()
			}
		}

		play_next_frame() {
			//current_time = performance.now()
			//if !@_last_time_frame_incremented? || ( (current_time - @_last_time_frame_incremented) > 40 )
			if (this.playing()) {
				//@_last_time_frame_incremented = current_time
				if (!this.self.root().are_children_cooking()) {
					this.increment_frame()
				}

				setTimeout(this.play_next_frame.bind(this), this._frame_interval)
			}
		}
	}
}