import {Mesh} from 'three/src/objects/Mesh';
import {Material} from 'three/src/materials/Material';

QUnit.test('materials simple', async (assert) => {
	const geo1 = window.geo1;
	const MAT = window.MAT;

	const plane1 = geo1.create_node('plane');
	const material1 = geo1.create_node('material');
	const lambert1 = MAT.create_node('mesh_lambert');

	material1.set_input(0, plane1);
	material1.p.material.set(lambert1.full_path());

	let container;

	container = await material1.request_container();
	const first_object = container.core_content()!.objects()[0] as Mesh;
	const material = first_object.material as Material;
	assert.equal(material.uuid, lambert1.material.uuid);
});

QUnit.test('materials clone', async (assert) => {
	const geo1 = window.geo1;
	const MAT = window.MAT;

	const lambert1 = MAT.create_node('mesh_lambert');
	const plane1 = geo1.create_node('plane');
	const attrib_create1 = geo1.create_node('attrib_create');
	const material1 = geo1.create_node('material');
	const copy1 = geo1.create_node('copy');

	attrib_create1.set_input(0, plane1);
	material1.set_input(0, attrib_create1);
	copy1.set_input(0, material1);
	material1.p.material.set(lambert1.full_path());

	attrib_create1.p.name.set('id');
	attrib_create1.p.value1.set(`copy('${copy1.full_path()}', 0)`);
	material1.p.clone_mat.set(1);
	copy1.p.count.set(2);
	copy1.p.use_copy_expr.set(1);

	let container;

	container = await copy1.request_container();
	const objects = container.core_content()!.objects() as Mesh[];
	assert.equal(objects.length, 2);
	const src_material = lambert1.material;
	assert.notEqual(src_material.uuid, (objects[0].material as Material).uuid);
	assert.notEqual(src_material.uuid, (objects[1].material as Material).uuid);
});
