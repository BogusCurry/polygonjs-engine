import { TypedSopNode } from './_Base';
import { CoreGroup } from '../../../core/geometry/Group';
import { CoreObject } from '../../../core/geometry/Object';
import Ammo from 'ammojs-typed';
import { NodeParamsConfig } from '../utils/params/ParamsConfig';
declare class AmmoSolverSopParamsConfig extends NodeParamsConfig {
    gravity: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.VECTOR3>;
    max_substeps: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.INTEGER>;
    reset: import("../utils/params/ParamsConfig").ParamTemplate<import("../../poly/ParamType").ParamType.BUTTON>;
}
export declare class PhysicsRBDSolverSopNode extends TypedSopNode<AmmoSolverSopParamsConfig> {
    params_config: AmmoSolverSopParamsConfig;
    static type(): string;
    private config;
    private dispatcher;
    private overlappingPairCache;
    private solver;
    private world;
    private bodies;
    private _gravity;
    private _bodies_by_id;
    private _bodies_active_state_by_id;
    private _body_helper;
    private _force_helper;
    private _input_init;
    private _input_force_points;
    private _input_update;
    static displayed_input_names(): string[];
    initialize_node(): void;
    prepare(): void;
    cook(input_contents: CoreGroup[]): void;
    private init;
    private _create_constraints;
    private simulate;
    private _apply_custom_forces;
    private _apply_rbd_update;
    private _update_active_state;
    protected _update_kinematic_transform(body: Ammo.btRigidBody, core_object: CoreObject): void;
    private _transform_core_objects_from_bodies;
    static PARAM_CALLBACK_reset(node: PhysicsRBDSolverSopNode): void;
    private reset;
}
export {};