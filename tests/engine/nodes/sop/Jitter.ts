QUnit.test('jitter simple', async (assert) => {
	const geo1 = window.geo1;

	const plane1 = geo1.create_node('plane');
	const scatter1 = geo1.create_node('scatter');
	const jitter1 = geo1.create_node('jitter');
	jitter1.set_input(0, scatter1);
	scatter1.set_input(0, plane1);

	let container = await jitter1.request_container();

	let size = container.size();
	assert.more_than(size.x, 2.0);
	assert.more_than(size.y, 1.5);
	assert.more_than(size.z, 1.8);
});
