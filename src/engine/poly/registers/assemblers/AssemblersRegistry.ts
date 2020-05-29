import {AssemblersMap} from './All';
import {BaseAssemblersRegister, AssemblerName} from './_BaseRegister';
import {BaseNodeType} from '../../../nodes/_Base';

export class AssemblersRegister extends BaseAssemblersRegister {
	assembler<K extends keyof AssemblersMap>(node: BaseNodeType, name: K): AssemblersMap[K]['controller'] | undefined {
		// return super.assembler(node, name as any);
		const pair = this._controller_assembler_by_name.get(name as AssemblerName);
		if (pair) {
			const controller = pair.controller;
			const assembler = pair.assembler;
			return new controller(node, assembler);
		}
		return pair;
	}
}