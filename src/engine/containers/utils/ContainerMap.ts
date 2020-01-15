import {GeometryContainer} from '../Geometry';
import {MaterialContainer} from '../Material';
import {TextureContainer} from '../Texture';
import {ObjectContainer} from '../Object';
import {EventContainer} from '../Event';
import {ManagerContainer} from '../Manager';
import {PostProcessContainer} from '../PostProcess';

export interface ContainerMap {
	GEOMETRY: GeometryContainer;
	MATERIAL: MaterialContainer;
	TEXTURE: TextureContainer;
	OBJECT: ObjectContainer;
	EVENT: EventContainer;
	MANAGER: ManagerContainer;
	POST: PostProcessContainer;
}
// type K = keyof ContainerMap;
// type Container = ContainerMap[K];