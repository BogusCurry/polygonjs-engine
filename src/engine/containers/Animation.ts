import {TypedContainer} from './_Base';
import {ContainableMap} from './utils/ContainableMap';
import {AnimationClip} from 'three/src/animation/AnimationClip';

export class AnimationContainer extends TypedContainer<ContainableMap['ANIMATION']> {
	set_content(content: ContainableMap['ANIMATION']) {
		super.set_content(content);
	}
	set_animation_clip(clip: AnimationClip) {
		return this.set_content(clip);
	}
	animation_clip() {
		return this.content();
	}

	// infos() {
	// 	const node = this.node()
	// 	return [
	// 		`full path: ${node.full_path()}`,
	// 		`${node.cooks_count()} cooks`,
	// 		`cook time: ${node.cook_time()}`,
	// 		this.content(),
	// 	]
	// }
}