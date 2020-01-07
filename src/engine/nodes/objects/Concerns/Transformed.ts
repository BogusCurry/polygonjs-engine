import {Quaternion} from 'three/src/math/Quaternion'
import {Euler} from 'three/src/math/Euler'
const THREE = {Euler, Quaternion}
import {CoreMath} from 'src/Core/Math/_Module';
import {CoreTransform} from 'src/Core/Transform';
import {BaseNodeObj} from '../_Base'

export function Transformed<TBase extends Constructor>(Base: TBase) {
	return class Mixin extends Base {
		protected self: BaseNodeObj = <unknown>this as BaseNodeObj

		post_set_input() {
			if (this.self.input(0) != null) {
				this.self.root().add_to_parent_transform( this );
			} else {
				this.self.root().remove_from_parent_transform( this );
			}
		}

		update_transform(matrix){
			const object = this.self.object()
			// const update_full_matrix = false; // if true the camera controls do not work anymore
			//matrix = Core.Transform.matrix_from_node_with_transform_params(this)

			if (object) {
				// if update_full_matrix
				// 	object.matrixAutoUpdate = false
				// 	object.matrix = matrix
				// else

				if (this._param_look_at !== '') {
					return this._use_look_at_param();
				} else {
					return this.update_transform_with_matrix(matrix);
				}
				// if matrix?
				// 	# do not apply to cameras with control
				// 	object.matrixAutoUpdate = false
				// 	object.matrix = matrix
				// else
				// 	this.update_transform_from_params()


			} else {
				console.warn(`no object to update for ${this.self.full_path()}`);
				return false
			}
		}

		update_transform_with_matrix(matrix){
			//console.warn "no object to update for #{this.full_path()}"
			const object = this.object();
			//matrix ?= Core.Transform.matrix_from_node_with_transform_params(this)
			if ((matrix != null) && !matrix.equals(object.matrix)) {
				// do not apply to cameras with control

				object.matrixAutoUpdate = false;
				object.matrix = matrix;

				return object.dispatchEvent( 'change' );
			} else {
				return this.update_transform_from_params();
			}
		}

		update_transform_from_params() {
			let object;
			if ((object = this.object()) != null) {


				const position = this._param_t;
				//quaternion = new THREE.Quaternion()
				const rotation = this._param_r;
				const scale = this._param_s.clone().multiplyScalar(this._param_scale);
				//matrix.decompose( position, quaternion, scale )

				object.matrixAutoUpdate = false
				object.position.copy(position);
				//object.quaternion.copy(quaternion)
				const radians = [
					CoreMath.degrees_to_radians(rotation.x),
					CoreMath.degrees_to_radians(rotation.y),
					CoreMath.degrees_to_radians(rotation.z)
				];
				const euler = new THREE.Euler(
					radians[0],
					radians[1],
					radians[2],
					//'XYZ'
					);
				object.rotation.copy(euler);
				object.scale.copy(scale);
				object.matrixAutoUpdate = true
				object.updateMatrix()

				object.dispatchEvent( 'change' );
			}
		}

		set_params_from_matrix(matrix, options){
			if (options == null) { options = {}; }
			CoreTransform.set_params_from_matrix(matrix, this, options);
		}
	}
}