import {WebGLRenderTarget} from 'three/src/renderers/WebGLRenderTarget';
import {ShaderMaterial} from 'three/src/materials/ShaderMaterial';
import {Scene} from 'three/src/scenes/Scene';
import {
	FloatType,
	HalfFloatType,
	RGBAFormat,
	NearestFilter,
	LinearFilter,
	ClampToEdgeWrapping,
} from 'three/src/constants';
import {PlaneBufferGeometry} from 'three/src/geometries/PlaneGeometry';
import {Mesh} from 'three/src/objects/Mesh';
import {Camera} from 'three/src/cameras/Camera';
import {TypedCopNode} from './_Base';
// import {CoreGraphNode} from '../../../core/graph/CoreGraphNode';
import {GlobalsGeometryHandler} from '../gl/code/globals/Geometry';
import {GlNodeChildrenMap} from '../../poly/registers/nodes/Gl';
import {BaseGlNodeType} from '../gl/_Base';
import {GlNodeFinder} from '../gl/code/utils/NodeFinder';
import {NodeContext} from '../../poly/NodeContext';
import {IUniform} from 'three/src/renderers/shaders/UniformsLib';
export interface IUniforms {
	[uniform: string]: IUniform;
}

const VERTEX_SHADER = `
void main()	{
	gl_Position = vec4( position, 1.0 );
}
`;
const RESOLUTION_DEFAULT: Number2 = [256, 256];

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
import {DataTextureController, DataTextureControllerBufferType} from './utils/DataTextureController';
import {CopRendererController} from './utils/RendererController';
import {AssemblerName} from '../../poly/registers/assemblers/_BaseRegister';
import {Poly} from '../../Poly';
import {TexturePersistedConfig} from '../gl/code/assemblers/textures/PersistedConfig';
import {IUniformsWithTime} from '../../scene/utils/UniformsController';
import {ParamsInitData} from '../utils/io/IOController';

class BuilderCopParamsConfig extends NodeParamsConfig {
	resolution = ParamConfig.VECTOR2(RESOLUTION_DEFAULT);
	use_camera_renderer = ParamConfig.BOOLEAN(0);
}

const ParamsConfig = new BuilderCopParamsConfig();

export class BuilderCopNode extends TypedCopNode<BuilderCopParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'builder';
	}
	readonly persisted_config: TexturePersistedConfig = new TexturePersistedConfig(this);
	protected _assembler_controller = this._create_assembler_controller();

	public used_assembler(): Readonly<AssemblerName.GL_TEXTURE> {
		return AssemblerName.GL_TEXTURE;
	}
	protected _create_assembler_controller() {
		const assembler_controller = Poly.instance().assemblers_register.assembler(this, this.used_assembler());
		if (assembler_controller) {
			const globals_handler = new GlobalsGeometryHandler();
			assembler_controller.set_assembler_globals_handler(globals_handler);
			return assembler_controller;
		}
	}

	get assembler_controller() {
		return this._assembler_controller;
	}

	private _texture_mesh: Mesh = new Mesh(new PlaneBufferGeometry(2, 2));
	private _fragment_shader: string | undefined;
	private _uniforms: IUniforms | undefined;
	public readonly texture_material: ShaderMaterial = new ShaderMaterial({
		uniforms: {},
		vertexShader: VERTEX_SHADER,
		fragmentShader: '',
	});
	private _texture_scene: Scene = new Scene();
	private _texture_camera: Camera = new Camera();
	private _render_target: WebGLRenderTarget | undefined;
	private _data_texture_controller: DataTextureController | undefined;
	private _renderer_controller: CopRendererController | undefined;

	protected _children_controller_context = NodeContext.GL;
	initialize_node() {
		if (this.assembler_controller) {
			this.lifecycle.add_on_create_hook(this.assembler_controller.on_create.bind(this.assembler_controller));
		}
		// this.children_controller?.init({dependent: false});
		this._texture_mesh.material = this.texture_material;
		this._texture_mesh.scale.multiplyScalar(0.25);
		this._texture_scene.add(this._texture_mesh);
		this._texture_camera.position.z = 1;

		// this ensures the builder recooks when its children are changed
		// and not just when a material that use it requests it
		this.add_post_dirty_hook('_cook_main_without_inputs_when_dirty', () => {
			setTimeout(this._cook_main_without_inputs_when_dirty_bound, 0);
		});

		// this.dirty_controller.add_post_dirty_hook(
		// 	'_reset_if_resolution_changed',
		// 	this._reset_if_resolution_changed.bind(this)
		// );
		// this.params.on_params_created('reset', () => {
		// 	this._reset();
		// });
	}

	create_node<K extends keyof GlNodeChildrenMap>(
		type: K,
		params_init_value_overrides?: ParamsInitData
	): GlNodeChildrenMap[K] {
		return super.create_node(type, params_init_value_overrides) as GlNodeChildrenMap[K];
	}
	children() {
		return super.children() as BaseGlNodeType[];
	}
	nodes_by_type<K extends keyof GlNodeChildrenMap>(type: K): GlNodeChildrenMap[K][] {
		return super.nodes_by_type(type) as GlNodeChildrenMap[K][];
	}
	children_allowed() {
		if (this.assembler_controller) {
			return super.children_allowed();
		}
		this.scene.mark_as_read_only(this);
		return false;
	}

	private _cook_main_without_inputs_when_dirty_bound = this._cook_main_without_inputs_when_dirty.bind(this);
	private async _cook_main_without_inputs_when_dirty() {
		await this.cook_controller.cook_main_without_inputs();
	}

	// private _reset_if_resolution_changed(trigger?: CoreGraphNode) {
	// 	if (trigger && trigger.graph_node_id == this.p.resolution.graph_node_id) {
	// 		this._reset();
	// 	}
	// }

	async cook() {
		this.compile_if_required();
		this.render_on_target();
	}

	shaders_by_name() {
		return {
			fragment: this._fragment_shader,
		};
	}

	compile_if_required() {
		if (this.assembler_controller?.compile_required()) {
			this.compile();
		}
	}
	private compile() {
		if (!this.assembler_controller) {
			return;
		}
		const output_nodes: BaseGlNodeType[] = GlNodeFinder.find_output_nodes(this);
		if (output_nodes.length > 1) {
			this.states.error.set('only one output node allowed');
			return;
		}
		const output_node = output_nodes[0];
		if (output_node) {
			//const param_nodes = GlNodeFinder.find_param_generating_nodes(this);
			const root_nodes = output_nodes; //.concat(param_nodes);
			this.assembler_controller.assembler.set_root_nodes(root_nodes);

			// main compilation
			this.assembler_controller.assembler.update_fragment_shader();

			// receives fragment and uniforms
			const fragment_shader = this.assembler_controller.assembler.fragment_shader();
			const uniforms = this.assembler_controller.assembler.uniforms();
			if (fragment_shader && uniforms) {
				this._fragment_shader = fragment_shader;
				this._uniforms = uniforms;
			}

			BuilderCopNode.handle_dependencies(this, this.assembler_controller.assembler.uniforms_time_dependent());
		}

		if (this._fragment_shader && this._uniforms) {
			this.texture_material.fragmentShader = this._fragment_shader;
			this.texture_material.uniforms = this._uniforms;
			this.texture_material.needsUpdate = true;
			this.texture_material.uniforms.resolution = {
				value: this.pv.resolution,
			};
		}
		this.assembler_controller?.post_compile();
	}

	static handle_dependencies(node: BuilderCopNode, time_dependent: boolean, uniforms?: IUniformsWithTime) {
		// That's actually useless, since this doesn't make the texture recook
		const scene = node.scene;
		const id = node.graph_node_id;
		const id_s = `${id}`;
		if (time_dependent) {
			// TODO: remove this once the scene knows how to re-render
			// the render target if it is .uniforms_time_dependent()
			node.states.time_dependent.force_time_dependent();
			if (uniforms) {
				scene.uniforms_controller.add_time_dependent_uniform_owner(id_s, uniforms);
			}
		} else {
			node.states.time_dependent.unforce_time_dependent();
			scene.uniforms_controller.remove_time_dependent_uniform_owner(id_s);
		}
	}

	async render_on_target() {
		this.create_render_target_if_required();
		if (!this._render_target) {
			return;
		}

		this._renderer_controller = this._renderer_controller || new CopRendererController(this);
		const renderer = await this._renderer_controller.renderer();

		const prev_target = renderer.getRenderTarget();
		renderer.setRenderTarget(this._render_target);
		renderer.clear();
		renderer.render(this._texture_scene, this._texture_camera);
		renderer.setRenderTarget(prev_target);

		if (this._render_target.texture) {
			if (this.pv.use_camera_renderer) {
				this.set_texture(this._render_target.texture);
			} else {
				// const w = this.pv.resolution.x;
				// const h = this.pv.resolution.y;
				// this._data_texture = this._data_texture || this._create_data_texture(w, h);
				// renderer.readRenderTargetPixels(this._render_target, 0, 0, w, h, this._data_texture.image.data);
				// this._data_texture.needsUpdate = true;
				this._data_texture_controller =
					this._data_texture_controller ||
					new DataTextureController(DataTextureControllerBufferType.Float32Array);
				const data_texture = this._data_texture_controller.from_render_target(renderer, this._render_target);

				this.set_texture(data_texture);
			}
		} else {
			this.cook_controller.end_cook();
		}
	}

	render_target() {
		return (this._render_target =
			this._render_target || this._create_render_target(this.pv.resolution.x, this.pv.resolution.y));
	}
	private create_render_target_if_required() {
		if (!this._render_target || !this._render_target_resolution_valid()) {
			this._render_target = this._create_render_target(this.pv.resolution.x, this.pv.resolution.y);
			this._data_texture_controller?.reset();
		}
	}
	private _render_target_resolution_valid() {
		if (this._render_target) {
			const image = this._render_target.texture.image;
			if (image.width != this.pv.resolution.x || image.height != this.pv.resolution.y) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	private _create_render_target(width: number, height: number) {
		if (this._render_target) {
			const image = this._render_target.texture.image;
			if (image.width == width && image.height == height) {
				return this._render_target;
			}
		}

		const wrapS = ClampToEdgeWrapping;
		const wrapT = ClampToEdgeWrapping;

		const minFilter = LinearFilter;
		const magFilter = NearestFilter;

		var renderTarget = new WebGLRenderTarget(width, height, {
			wrapS: wrapS,
			wrapT: wrapT,
			minFilter: minFilter,
			magFilter: magFilter,
			format: RGBAFormat,
			type: /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? HalfFloatType : FloatType,
			stencilBuffer: false,
			depthBuffer: false,
		});
		Poly.warn('created render target', this.full_path(), width, height);
		return renderTarget;
	}
}
