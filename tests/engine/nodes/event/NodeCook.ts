import {SceneJsonExporter} from '../../../../src/engine/io/json/export/Scene';
import {SceneJsonImporter} from '../../../../src/engine/io/json/import/Scene';
import {SwitchSopNode} from '../../../../src/engine/nodes/sop/Switch';
import {CoreSleep} from '../../../../src/core/Sleep';
import {NodeCookEventNode} from '../../../../src/engine/nodes/event/NodeCook';
import {ScatterSopNode} from '../../../../src/engine/nodes/sop/Scatter';
import {MergeSopNode} from '../../../../src/engine/nodes/sop/Merge';

QUnit.test('event node_cook simple', async (assert) => {
	const geo1 = window.geo1;
	const scene = window.scene;
	const events = scene.root.create_node('events');

	const box1 = geo1.create_node('box');
	const scatter1 = geo1.create_node('scatter');
	const scatter2 = geo1.create_node('scatter');
	const scatter3 = geo1.create_node('scatter');
	const merge1 = geo1.create_node('merge');
	const switch1 = geo1.create_node('switch');
	const switch2 = geo1.create_node('switch');

	await scene.wait_for_cooks_completed();

	const node_cook1 = events.create_node('node_cook');
	const set_param1 = events.create_node('set_param');
	const set_param2 = events.create_node('set_param');

	scatter1.set_input(0, box1);
	scatter2.set_input(0, box1);
	scatter3.set_input(0, box1);
	merge1.set_input(0, scatter1);
	merge1.set_input(1, scatter2);
	merge1.set_input(2, scatter3);

	assert.ok(scene.loading_controller.loaded);
	node_cook1.p.mask.set('*scatter*');
	set_param1.p.param.set(switch1.p.input.full_path());
	set_param1.p.number.set(1);
	set_param2.p.param.set(switch2.p.input.full_path());
	set_param2.p.number.set(1);
	set_param1.set_input(0, node_cook1, NodeCookEventNode.OUTPUT_FIRST_NODE);
	set_param2.set_input(0, node_cook1, NodeCookEventNode.OUTPUT_ALL_NODES);

	assert.equal(switch1.p.input.value, 0);
	await scatter1.request_container();
	await CoreSleep.sleep(100);
	assert.equal(switch1.p.input.value, 1);

	assert.equal(switch2.p.input.value, 0);
	await merge1.request_container();
	await CoreSleep.sleep(100);
	assert.equal(switch2.p.input.value, 1);

	switch1.p.input.set(0);
	switch2.p.input.set(0);
	const data = new SceneJsonExporter(scene).data();

	console.log('************ LOAD **************');
	const scene2 = await SceneJsonImporter.load_data(data);
	await scene2.wait_for_cooks_completed();
	const scatter1_2 = scene2.node(scatter1.full_path()) as ScatterSopNode;
	const merge1_2 = scene2.node(merge1.full_path()) as MergeSopNode;
	const switch1_2 = scene2.node(switch1.full_path()) as SwitchSopNode;
	const switch2_2 = scene2.node(switch2.full_path()) as SwitchSopNode;

	assert.equal(switch1_2.p.input.value, 0);
	await scatter1_2.request_container();
	await CoreSleep.sleep(100);
	assert.equal(switch1_2.p.input.value, 1);

	assert.equal(switch2_2.p.input.value, 0);
	await merge1_2.request_container();
	await CoreSleep.sleep(100);
	assert.equal(switch2_2.p.input.value, 1);
});
