import BaseModule from './BaseModule';
import type { BaseConfig } from '../BaseConfig';

class Resolucao extends BaseModule{
    constructor(config: BaseConfig) {
        super('resolucao', config);
    };
};

export default Resolucao;