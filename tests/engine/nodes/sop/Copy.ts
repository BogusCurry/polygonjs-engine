import {AttribClass, ATTRIBUTE_CLASSES} from '../../../../src/core/geometry/Constant';

QUnit.test('copy sop simple', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const plane1 = geo1.create_node('plane');
	const copy1 = geo1.create_node('copy');
	copy1.set_input(0, box1);
	copy1.set_input(1, plane1);
	plane1.p.direction.set([0, 0, 1]);

	let container = await copy1.request_container();
	// let core_group = container.core_content()!;
	// let {geometry} = core_group.objects()[0];

	assert.equal(container.points_count(), 96);
	assert.equal(container.bounding_box().min.y, -1.0);

	plane1.p.use_segments_count.set(1);
	plane1.p.size.y.set(2);

	container = await copy1.request_container();
	// core_group = container.core_content()!;
	// ({geometry} = core_group.objects()[0]);

	assert.equal(container.points_count(), 96);
	assert.equal(container.bounding_box().min.y, -1.5);
});

QUnit.test('copy sop with template and stamp', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const attrib_create1 = geo1.create_node('attrib_create');
	const plane1 = geo1.create_node('plane');
	const line1 = geo1.create_node('line');
	const switch1 = geo1.create_node('switch');
	switch1.set_input(0, plane1);
	switch1.set_input(1, box1);
	attrib_create1.set_input(0, switch1);

	const copy1 = geo1.create_node('copy');
	copy1.set_input(0, attrib_create1);
	copy1.set_input(1, line1);

	attrib_create1.p.name.set('test');
	attrib_create1.p.value1.set(`1+2*copy('../${copy1.name}', 0)`);
	switch1.p.input.set(`copy('../${copy1.name}', 0)`);
	assert.ok(switch1.graph_all_predecessors().includes(copy1.stamp_node));

	let container = await copy1.request_container();
	// let core_group = container.core_content();
	// let { geometry } = group.children[0];

	assert.equal(container.points_count(), 8);

	copy1.p.use_copy_expr.set(1);
	container = await copy1.request_container();
	// core_group = container.core_content();
	// ({geometry} = core_group.objects()[0]);

	assert.equal(container.points_count(), 28);
	const objects = container.core_content()!.objects_with_geo();
	assert.equal(objects.length, 2);
	assert.equal(objects[0].geometry.attributes.test.array[0], 1);
	assert.equal(objects[1].geometry.attributes.test.array[0], 3);
});

QUnit.test('copy sop without template and stamp', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const plane1 = geo1.create_node('plane');
	const switch1 = geo1.create_node('switch');
	switch1.set_input(0, plane1);
	switch1.set_input(1, box1);

	const copy1 = geo1.create_node('copy');
	copy1.set_input(0, switch1);
	copy1.p.count.set(3);

	switch1.p.input.set(`copy('../${copy1.name}', 0) % 2`);

	let container = await copy1.request_container();
	// let core_group = container.core_content();
	// let {geometry} = core_group.objects()[0];

	assert.equal(container.points_count(), 12);

	copy1.p.use_copy_expr.set(1);
	container = await copy1.request_container();
	// core_group = container.core_content();
	// ({geometry} = core_group.objects()[0]);

	assert.equal(container.points_count(), 32);
});

QUnit.test('copy sop objects with template and stamp', async (assert) => {
	const geo1 = window.geo1;

	const box1 = geo1.create_node('box');
	const attrib_create1 = geo1.create_node('attrib_create');
	const plane1 = geo1.create_node('plane');

	const copy1 = geo1.create_node('copy');
	attrib_create1.p.class.set(ATTRIBUTE_CLASSES[AttribClass.OBJECT]);
	attrib_create1.set_input(0, box1);
	copy1.set_input(0, attrib_create1);
	copy1.set_input(1, plane1);
	copy1.p.count.set(3);
	copy1.p.use_copy_expr.set(1);

	attrib_create1.p.name.set('test');
	attrib_create1.p.value1.set(`copy('../${copy1.name}', 0)`);

	let container = await copy1.request_container();
	// let core_group = container.core_content();
	// let {geometry} = core_group.objects()[0];

	const objects = container.core_content()!.objects();
	assert.equal(objects.length, 4);
	assert.equal(objects[0].userData.attributes.test, 0);
	assert.equal(objects[1].userData.attributes.test, 1);
	assert.equal(objects[2].userData.attributes.test, 2);
	assert.equal(objects[3].userData.attributes.test, 3);
});

QUnit.skip('copy sop with group sets an error', (assert) => {});
QUnit.skip(
	'copy with transform_only can update the input 0 with different scale multiple times and give reliable scale',
	(assert) => {
		// create an attrib_create, pipe in input 1
		// set a pscale attrib of 0.5
		// set transform_only to 1
		// check the output size
		// set pscale attrib of 0.25
		// check the output size
		// set pscale attrib of 0.75
		// check the output size
	}
);
QUnit.skip('copy does not modify input 0 with transform_only', (assert) => {});
