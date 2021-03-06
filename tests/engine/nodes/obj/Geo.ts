import {Matrix4} from 'three/src/math/Matrix4';
import {CoreSleep} from '../../../../src/core/Sleep';

QUnit.test('geo obj simple', async (assert) => {
	const scene = window.scene;
	const main_group = scene.default_scene.children[0];
	assert.equal(main_group.name, '_WORLD_');
	assert.equal(main_group.children.length, 2);
	assert.deepEqual(main_group.children.map((c) => c.name).sort(), ['/geo1', '/perspective_camera1'].sort());

	const geo1 = window.geo1;
	const obj = main_group.children.filter((c) => c.name == '/geo1')[0];
	assert.equal(geo1.object.uuid, obj.uuid);

	window.scene.performance.start();
	assert.equal(geo1.cook_controller.cooks_count, 0, 'should not have counted cooks yet');

	geo1.p.t.x.set(12);
	await scene.wait_for_cooks_completed();
	assert.equal(geo1.cook_controller.cooks_count, 1, 'should have cooked only once');
	assert.deepEqual(
		obj.matrix.toArray(),
		new Matrix4().makeTranslation(12, 0, 0).toArray(),
		'matrix is not what we expect'
	);

	window.scene.performance.stop();
});

QUnit.test('geo obj creates a first sop on create', async (assert) => {
	const scene = window.scene;
	const geo2 = scene.root.create_node('geo');
	assert.equal(geo2.children().length, 1);
	const child = geo2.children()[0];
	assert.equal(child.type, 'box');
	assert.ok(child.flags.display.active);
	assert.deepEqual(
		geo2.nodes_by_type('box').map((n) => n.graph_node_id),
		[child.graph_node_id]
	);
});

QUnit.test('geo obj is removed from scene when node is deleted', async (assert) => {
	const scene = window.scene;
	const main_group = scene.default_scene.children[0];
	assert.equal(main_group.name, '_WORLD_');
	assert.equal(main_group.children.length, 2);
	assert.equal(
		main_group.children
			.map((c) => c.name)
			.sort()
			.join(':'),
		'/geo1:/perspective_camera1'
	);

	const geo1 = window.geo1;

	scene.root.remove_node(geo1);
	assert.equal(main_group.children.length, 1);
	assert.equal(
		main_group.children
			.map((c) => c.name)
			.sort()
			.join(':'),
		'/perspective_camera1'
	);
});

QUnit.test('geo obj cooks only once when multiple params are updated', async (assert) => {
	const scene = window.scene;
	const main_group = scene.default_scene.children[0];
	assert.equal(main_group.name, '_WORLD_');
	assert.equal(main_group.children.length, 2);
	assert.deepEqual(main_group.children.map((c) => c.name).sort(), ['/geo1', '/perspective_camera1'].sort());

	const geo1 = window.geo1;

	window.scene.performance.start();

	assert.equal(geo1.cook_controller.cooks_count, 0);
	const obj = main_group.children.filter((c) => c.name == '/geo1')[0];
	scene.batch_update(() => {
		geo1.p.t.x.set(2);
		geo1.p.s.y.set(4);
	});
	await scene.wait_for_cooks_completed();
	assert.equal(geo1.object.uuid, obj.uuid);
	assert.deepEqual(
		obj.matrix.toArray(),
		new Matrix4().makeTranslation(2, 0, 0).multiply(new Matrix4().makeScale(1, 4, 1)).toArray(),
		'matrix is not what we expect'
	);
	assert.equal(geo1.cook_controller.cooks_count, 1, 'cooks count should be 1');

	window.scene.performance.stop();
});

QUnit.test('geo obj: only the top group from a file sop with hierarchy is added to the geo object', async (assert) => {
	const scene = window.scene;
	const main_group = scene.default_scene.children[0];
	assert.equal(main_group.name, '_WORLD_');
	assert.equal(main_group.children.length, 2);
	assert.deepEqual(main_group.children.map((c) => c.name).sort(), ['/geo1', '/perspective_camera1'].sort());

	const geo1 = window.geo1;
	const obj = main_group.children.filter((c) => c.name == '/geo1')[0];
	assert.equal(obj.uuid, geo1.object.uuid);
	const file1 = geo1.create_node('file');
	file1.p.url.set('/examples/models/wolf.obj');

	file1.flags.display.set(true);
	await scene.wait_for_cooks_completed();
	await file1.request_container();
	await CoreSleep.sleep(10);
	assert.equal(obj.children.length, 2);
	assert.equal(obj.children[1].children[0].children.length, 4);
});

QUnit.test('geo obj: $F in params will update the matrix', async (assert) => {
	const scene = window.scene;
	scene.performance.start();
	await scene.wait_for_cooks_completed();
	const geo1 = window.geo1;
	assert.ok(geo1.is_dirty, 'geo1 is dirty');
	await geo1.request_container();
	assert.notOk(geo1.is_dirty, 'geo1 is not dirty');
	scene.set_frame(1);
	scene.set_frame(3);
	assert.equal(geo1.cook_controller.cooks_count, 1);
	assert.notOk(geo1.is_dirty, 'geo1 is not dirty');
	geo1.p.r.y.set('$F+10');

	assert.ok(geo1.is_dirty);
	await scene.wait_for_cooks_completed();
	assert.equal(geo1.cook_controller.cooks_count, 2);
	assert.notOk(geo1.is_dirty);
	assert.deepEqual(geo1.pv.r.toArray(), [0, 13, 0]);

	scene.set_frame(37);
	await scene.wait_for_cooks_completed();
	assert.equal(geo1.cook_controller.cooks_count, 3);
	assert.notOk(geo1.is_dirty);
	assert.deepEqual(geo1.pv.r.toArray(), [0, 47, 0]);

	window.scene.performance.stop();
});
