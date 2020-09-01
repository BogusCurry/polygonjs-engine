// for dynamic imports, use
// https://wanago.io/2018/08/20/webpack-4-course-part-eight-dynamic-imports-with-prefetch-and-preload/
// with webpackExclude to not bundle files like _Base.ts or what is under utils/
// with webpackChunkName and [request] to ensure meaningful name
// more on https://webpack.js.org/api/module-methods/
import {CATEGORY_SOP} from './Category';

import {AddSopNode} from '../../../nodes/sop/Add';
import {AnimationCopySopNode} from '../../../nodes/sop/AnimationCopy';
import {AnimationMixerSopNode} from '../../../nodes/sop/AnimationMixer';
import {AnimationsSopNode} from '../../../nodes/sop/Animations';
import {AttribAddMultSopNode} from '../../../nodes/sop/AttribAddMult';
import {AttribCopySopNode} from '../../../nodes/sop/AttribCopy';
import {AttribCreateSopNode} from '../../../nodes/sop/AttribCreate';
import {AttribDeleteSopNode} from '../../../nodes/sop/AttribDelete';
import {AttribNormalizeSopNode} from '../../../nodes/sop/AttribNormalize';
import {AttribPromoteSopNode} from '../../../nodes/sop/AttribPromote';
import {AttribRemapSopNode} from '../../../nodes/sop/AttribRemap';
import {AttribRenameSopNode} from '../../../nodes/sop/AttribRename';
import {AttribTransferSopNode} from '../../../nodes/sop/AttribTransfer';
import {BboxScatterSopNode} from '../../../nodes/sop/BboxScatter';
import {BlendSopNode} from '../../../nodes/sop/Blend';
import {BoxSopNode} from '../../../nodes/sop/Box';
import {CacheSopNode} from '../../../nodes/sop/Cache';
import {CenterSopNode} from '../../../nodes/sop/Center';
import {CircleSopNode} from '../../../nodes/sop/Circle';
import {Circle3PointsSopNode} from '../../../nodes/sop/Circle3Points';
// import {CodeSopNode} from '../../../nodes/sop/Code';
import {ColorSopNode} from '../../../nodes/sop/Color';
import {ConeSopNode} from '../../../nodes/sop/Cone';
import {CopSopNode} from '../../../nodes/sop/Cop';
import {CopySopNode} from '../../../nodes/sop/Copy';
import {Css2DObjectSopNode} from '../../../nodes/sop/Css2DObject';
import {Css3DObjectSopNode} from '../../../nodes/sop/Css3DObject';
import {DataSopNode} from '../../../nodes/sop/Data';
import {DataUrlSopNode} from '../../../nodes/sop/DataUrl';
import {DelaySopNode} from '../../../nodes/sop/Delay';
import {DeleteSopNode} from '../../../nodes/sop/Delete';
import {DrawRangeSopNode} from '../../../nodes/sop/DrawRange';
import {EventsSopNode} from '../../../nodes/sop/Events';
import {FaceSopNode} from '../../../nodes/sop/Face';
import {FileSopNode} from '../../../nodes/sop/File';
import {FuseSopNode} from '../../../nodes/sop/Fuse';
import {HexagonsSopNode} from '../../../nodes/sop/Hexagons';
import {HierarchySopNode} from '../../../nodes/sop/Hierarchy';
import {HeightMapSopNode} from '../../../nodes/sop/HeightMap';
import {InstanceSopNode} from '../../../nodes/sop/Instance';
import {InstancesCountSopNode} from '../../../nodes/sop/InstancesCount';
import {JitterSopNode} from '../../../nodes/sop/Jitter';
import {JsPointSopNode} from '../../../nodes/sop/JsPoint';
import {LayerSopNode} from '../../../nodes/sop/Layer';
import {LineSopNode} from '../../../nodes/sop/Line';
import {LODSopNode} from '../../../nodes/sop/LOD';
import {MapboxLayerSopNode} from '../../../nodes/sop/MapboxLayer';
import {MapboxPlaneSopNode} from '../../../nodes/sop/MapboxPlane';
import {MapboxTransformSopNode} from '../../../nodes/sop/MapboxTransform';
import {MaterialSopNode} from '../../../nodes/sop/Material';
import {MaterialsSopNode} from '../../../nodes/sop/Materials';
import {MergeSopNode} from '../../../nodes/sop/Merge';
import {NoiseSopNode} from '../../../nodes/sop/Noise';
import {NormalsSopNode} from '../../../nodes/sop/Normals';
import {NullSopNode} from '../../../nodes/sop/Null';
import {ObjectMergeSopNode} from '../../../nodes/sop/ObjectMerge';
import {ObjectPropertiesSopNode} from '../../../nodes/sop/ObjectProperties';
import {OcclusionSopNode} from '../../../nodes/sop/Occlusion';
import {ParticlesSystemGpuSopNode} from '../../../nodes/sop/ParticlesSystemGpu';
import {PeakSopNode} from '../../../nodes/sop/Peak';
import {PhysicsRBDAttributesSopNode} from '../../../nodes/sop/PhysicsRBDAttributes';
import {PhysicsForceAttributesSopNode} from '../../../nodes/sop/PhysicsForceAttributes';
import {PhysicsSolverSopNode} from '../../../nodes/sop/PhysicsSolver';
import {PlaneSopNode} from '../../../nodes/sop/Plane';
import {PointSopNode} from '../../../nodes/sop/Point';
import {PolySopNode} from '../../../nodes/sop/Poly';
import {PolywireSopNode} from '../../../nodes/sop/Polywire';
import {PostProcessSopNode} from '../../../nodes/sop/PostProcess';
import {RaySopNode} from '../../../nodes/sop/Ray';
import {RenderersSopNode} from '../../../nodes/sop/Renderers';
import {ResampleSopNode} from '../../../nodes/sop/Resample';
import {ScatterSopNode} from '../../../nodes/sop/Scatter';
import {SkinSopNode} from '../../../nodes/sop/Skin';
import {SphereSopNode} from '../../../nodes/sop/Sphere';
import {SplitSopNode} from '../../../nodes/sop/Split';
import {SubdivideSopNode} from '../../../nodes/sop/Subdivide';
import {SubnetSopNode} from '../../../nodes/sop/Subnet';
import {SubnetInputSopNode} from '../../../nodes/sop/SubnetInput';
import {SubnetOutputSopNode} from '../../../nodes/sop/SubnetOutput';
import {SwitchSopNode} from '../../../nodes/sop/Switch';
import {TextSopNode} from '../../../nodes/sop/Text';
import {TorusSopNode} from '../../../nodes/sop/Torus';
import {TorusKnotSopNode} from '../../../nodes/sop/TorusKnot';
import {TransformSopNode} from '../../../nodes/sop/Transform';
import {TransformCopySopNode} from '../../../nodes/sop/TransformCopy';
import {TransformMultiSopNode} from '../../../nodes/sop/TransformMulti';
import {TransformResetSopNode} from '../../../nodes/sop/TransformReset';
import {TubeSopNode} from '../../../nodes/sop/Tube';
import {UvProjectSopNode} from '../../../nodes/sop/UvProject';

export interface GeoNodeChildrenMap {
	add: AddSopNode;
	animation_copy: AnimationCopySopNode;
	animation_mixer: AnimationMixerSopNode;
	animations: AnimationsSopNode;
	attrib_add_mult: AttribAddMultSopNode;
	attrib_copy: AttribCopySopNode;
	attrib_create: AttribCreateSopNode;
	attrib_delete: AttribDeleteSopNode;
	attrib_normalize: AttribNormalizeSopNode;
	attrib_promote: AttribPromoteSopNode;
	attrib_remap: AttribRemapSopNode;
	attrib_rename: AttribRenameSopNode;
	attrib_transfer: AttribTransferSopNode;
	bbox_scatter: BboxScatterSopNode;
	blend: BlendSopNode;
	box: BoxSopNode;
	cache: CacheSopNode;
	center: CenterSopNode;
	circle: CircleSopNode;
	circle3points: Circle3PointsSopNode;
	// code: CodeSopNode;
	color: ColorSopNode;
	cop: CopSopNode;
	copy: CopySopNode;
	css2d_object: Css2DObjectSopNode;
	css3d_object: Css3DObjectSopNode;
	data: DataSopNode;
	data_url: DataUrlSopNode;
	delay: DelaySopNode;
	delete: DeleteSopNode;
	draw_range: DrawRangeSopNode;
	events: EventsSopNode;
	face: FaceSopNode;
	file: FileSopNode;
	fuse: FuseSopNode;
	height_map: HeightMapSopNode;
	hexagons: HexagonsSopNode;
	hierarchy: HierarchySopNode;
	instance: InstanceSopNode;
	instances_count: InstancesCountSopNode;
	jitter: JitterSopNode;
	js_point: JsPointSopNode;
	layer: LayerSopNode;
	line: LineSopNode;
	lod: LODSopNode;
	mapbox_layer: MapboxLayerSopNode;
	mapbox_plane: MapboxPlaneSopNode;
	mapbox_transform: MapboxTransformSopNode;
	material: MaterialSopNode;
	materials: MaterialsSopNode;
	merge: MergeSopNode;
	post_process: PostProcessSopNode;
	noise: NoiseSopNode;
	normals: NormalsSopNode;
	null: NullSopNode;
	object_merge: ObjectMergeSopNode;
	object_properties: ObjectPropertiesSopNode;
	occlusion: OcclusionSopNode;
	particles_system_gpu: ParticlesSystemGpuSopNode;
	peak: PeakSopNode;
	physics_rbd_attributes: PhysicsRBDAttributesSopNode;
	physics_force_attributes: PhysicsForceAttributesSopNode;
	physics_solver: PhysicsSolverSopNode;
	plane: PlaneSopNode;
	point: PointSopNode;
	poly: PolySopNode;
	polywire: PolywireSopNode;
	ray: RaySopNode;
	renderers: RenderersSopNode;
	resample: ResampleSopNode;
	scatter: ScatterSopNode;
	skin: SkinSopNode;
	sphere: SphereSopNode;
	split: SplitSopNode;
	subdivide: SubdivideSopNode;
	subnet: SubnetSopNode;
	subnet_input: SubnetInputSopNode;
	subnet_output: SubnetOutputSopNode;
	switch: SwitchSopNode;
	text: TextSopNode;
	torus: TorusSopNode;
	torus_knot: TorusKnotSopNode;
	transform: TransformSopNode;
	transform_copy: TransformCopySopNode;
	transform_multi: TransformMultiSopNode;
	transform_reset: TransformResetSopNode;
	tube: TubeSopNode;
	uv_project: UvProjectSopNode;
}

import {Poly} from '../../../Poly';
export class SopRegister {
	static run(poly: Poly) {
		poly.register_node(AddSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(AnimationCopySopNode, CATEGORY_SOP.ANIMATION);
		poly.register_node(AnimationMixerSopNode, CATEGORY_SOP.ANIMATION);
		poly.register_node(AnimationsSopNode, CATEGORY_SOP.NETWORK);
		poly.register_node(AttribAddMultSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribCopySopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribCreateSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribDeleteSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribNormalizeSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribPromoteSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribRemapSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribRenameSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(AttribTransferSopNode, CATEGORY_SOP.ATTRIBUTE);
		poly.register_node(BboxScatterSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(BlendSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(BoxSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(CacheSopNode, CATEGORY_SOP.MISC);
		poly.register_node(CenterSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(CircleSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(Circle3PointsSopNode, CATEGORY_SOP.PRIMITIVES);
		// poly.register_node(CodeSopNode, CATEGORY_SOP.ADVANCED);
		poly.register_node(ColorSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(ConeSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(CopSopNode, CATEGORY_SOP.NETWORK);
		poly.register_node(CopySopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(Css2DObjectSopNode, CATEGORY_SOP.PRIMITIVES);
		// poly.register_node(Css3DObjectSopNode, CATEGORY_SOP.PRIMITIVES); // not working yet
		poly.register_node(DataSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(DataUrlSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(DelaySopNode, CATEGORY_SOP.MISC);
		poly.register_node(DeleteSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(DrawRangeSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(EventsSopNode, CATEGORY_SOP.NETWORK);
		poly.register_node(FaceSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(FileSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(FuseSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(HexagonsSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(HeightMapSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(HierarchySopNode, CATEGORY_SOP.MISC);
		poly.register_node(InstanceSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(InstancesCountSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(JitterSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(JsPointSopNode, CATEGORY_SOP.ADVANCED);
		poly.register_node(LayerSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(LineSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(LODSopNode, CATEGORY_SOP.ADVANCED);
		poly.register_node(MapboxLayerSopNode, CATEGORY_SOP.MAP);
		poly.register_node(MapboxPlaneSopNode, CATEGORY_SOP.MAP);
		poly.register_node(MapboxTransformSopNode, CATEGORY_SOP.MAP);
		poly.register_node(MaterialSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(MaterialsSopNode, CATEGORY_SOP.NETWORK);
		poly.register_node(MergeSopNode, CATEGORY_SOP.MISC);
		poly.register_node(NoiseSopNode, CATEGORY_SOP.MISC);
		poly.register_node(NormalsSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(NullSopNode, CATEGORY_SOP.MISC);
		poly.register_node(ObjectMergeSopNode, CATEGORY_SOP.INPUT);
		poly.register_node(ObjectPropertiesSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(OcclusionSopNode, CATEGORY_SOP.RENDER);
		poly.register_node(ParticlesSystemGpuSopNode, CATEGORY_SOP.DYNAMICS);
		poly.register_node(PeakSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(PhysicsRBDAttributesSopNode, CATEGORY_SOP.PHYSICS);
		poly.register_node(PhysicsForceAttributesSopNode, CATEGORY_SOP.PHYSICS);
		poly.register_node(PhysicsSolverSopNode, CATEGORY_SOP.PHYSICS);
		poly.register_node(PlaneSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(PointSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(PolySopNode, CATEGORY_SOP.ADVANCED);
		poly.register_node(PolywireSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(PostProcessSopNode, CATEGORY_SOP.NETWORK);
		poly.register_node(RaySopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(RenderersSopNode, CATEGORY_SOP.NETWORK);
		poly.register_node(ResampleSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(ScatterSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SkinSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SphereSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(SplitSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SubdivideSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(SubnetSopNode, CATEGORY_SOP.MISC);
		poly.register_node(
			SubnetInputSopNode,
			CATEGORY_SOP.MISC /*{
			// TODO: use "except" so that it works inside PolyNodes
			// only: [`${NodeContext.SOP}/${SubnetSopNode.type()}`, `${NodeContext.SOP}/poly`],
		}*/
		);
		poly.register_node(
			SubnetOutputSopNode,
			CATEGORY_SOP.MISC /*{
			// only: [`${NodeContext.SOP}/${SubnetSopNode.type()}`, `${NodeContext.SOP}/poly`],
		}*/
		);
		poly.register_node(SwitchSopNode, CATEGORY_SOP.MISC);
		poly.register_node(TextSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(TorusSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(TorusKnotSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(TransformSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TransformCopySopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TransformMultiSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TransformResetSopNode, CATEGORY_SOP.MODIFIER);
		poly.register_node(TubeSopNode, CATEGORY_SOP.PRIMITIVES);
		poly.register_node(UvProjectSopNode, CATEGORY_SOP.MODIFIER);
	}
}
