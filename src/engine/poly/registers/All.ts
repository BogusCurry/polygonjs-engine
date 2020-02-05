import {CopRegister} from './Cop';
import {GlRegister} from './Gl';
import {MatRegister} from './Mat';
import {ObjRegister} from './Obj';
import {SopRegister} from './Sop';

import {POLY} from 'src/engine/Poly';
CopRegister.run(POLY);
GlRegister.run(POLY);
MatRegister.run(POLY);
ObjRegister.run(POLY);
SopRegister.run(POLY);
