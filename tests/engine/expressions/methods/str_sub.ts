QUnit.test('expression str_sub simple', async (assert) => {
	const geo1 = window.geo1;

	const text1 = geo1.create_node('text');
	const text_param = text1.p.text;

	text_param.set('`str_sub()`');
	await text_param.compute();
	assert.equal(text_param.value, '');

	text_param.set('`str_sub( "test test" )`');
	await text_param.compute();
	assert.equal(text_param.value, 't');

	text_param.set('`str_sub( "test test", 1 )`');
	await text_param.compute();
	assert.equal(text_param.value, 'e');

	text_param.set('`str_sub( "test test", 1, 3 )`');
	await text_param.compute();
	assert.equal(text_param.value, 'est');

	text_param.set('`str_sub( "test test", 3, 3 )`');
	await text_param.compute();
	assert.equal(text_param.value, 't t');

	// create a text and apply expression to it's text attribute
	const text2 = geo1.create_node('text');
	text2.set_name('text2');
	const text_param2 = text2.p.text;
	assert.equal(text2.name, 'text2');
	text_param.set('`str_sub( ch("../text2/text") )`');

	text_param2.set('demo');
	await text_param.compute();
	assert.equal(text_param.value, 'd');

	text_param2.set('a much longer text');
	await text_param.compute();
	assert.equal(text_param.value, 'a');
});
