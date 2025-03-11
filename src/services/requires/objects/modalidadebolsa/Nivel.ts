import BaseModule from './BaseModule';
import type { BaseConfig } from '../BaseConfig';

class Nivel extends BaseModule{
    constructor(config: BaseConfig) {
        super('nivelbolsa', config);
    };
};

export default Nivel;