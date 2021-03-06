import {TypedEventNode} from './_Base';
import {EventContext} from '../../scene/utils/events/_BaseEventsController';
import {EventConnectionPoint, EventConnectionPointType} from '../utils/io/connections/Event';
import {BaseNodeType} from '../_Base';

enum LimitEventInput {
	TRIGGER = 'trigger',
	RESET = 'reset',
}
enum LimitEventOutput {
	OUT = 'out',
	LAST = 'last',
}

import {NodeParamsConfig, ParamConfig} from '../utils/params/ParamsConfig';
class LimitEventParamsConfig extends NodeParamsConfig {
	max_count = ParamConfig.INTEGER(5, {
		range: [0, 10],
		range_locked: [true, false],
	});
	reset = ParamConfig.BUTTON(null, {
		callback: (node: BaseNodeType) => {
			LimitEventNode.PARAM_CALLBACK_reset(node as LimitEventNode);
		},
	});
}
const ParamsConfig = new LimitEventParamsConfig();

export class LimitEventNode extends TypedEventNode<LimitEventParamsConfig> {
	params_config = ParamsConfig;
	static type() {
		return 'limit';
	}

	private _process_count: number = 0;
	private _last_dispatched: boolean = false;
	initialize_node() {
		this.io.inputs.set_named_input_connection_points([
			new EventConnectionPoint(
				LimitEventInput.TRIGGER,
				EventConnectionPointType.BASE,
				this.process_event_trigger.bind(this)
			),
			new EventConnectionPoint(
				LimitEventInput.RESET,
				EventConnectionPointType.BASE,
				this.process_event_reset.bind(this)
			),
		]);

		this.io.outputs.set_named_output_connection_points([
			new EventConnectionPoint(LimitEventOutput.OUT, EventConnectionPointType.BASE),
			new EventConnectionPoint(LimitEventOutput.LAST, EventConnectionPointType.BASE),
		]);
	}

	process_event(event_context: EventContext<Event>) {}

	private process_event_trigger(event_context: EventContext<Event>) {
		if (this._process_count < this.pv.max_count) {
			this._process_count += 1;
			this.dispatch_event_to_output(LimitEventOutput.OUT, event_context);
		} else {
			if (!this._last_dispatched) {
				this._last_dispatched = true;
				this.dispatch_event_to_output(LimitEventOutput.LAST, event_context);
			}
		}
	}
	private process_event_reset(event_context: EventContext<Event>) {
		this._process_count = 0;
		this._last_dispatched = false;
	}

	static PARAM_CALLBACK_reset(node: LimitEventNode) {
		node.process_event_reset({});
	}
}
