import {Scene} from 'three/src/scenes/Scene'

export function ObjectMixin<TBase extends Constructor>(Base: TBase) {
	return class extends Base {
		_display_scene: Scene

		display_scene() {
			return this._display_scene != null ? this._display_scene : (this._display_scene = this._create_scene())
		}
		_create_scene() {
			const scene = new Scene()

			// fog_color = new Color(1, 1, 1)
			// near = 2
			// far = 2.5
			// scene.fog = new Fog( fog_color, near, far )
			//fog_color.multiplyScalar(0.2)

			return scene
		}
	}
}