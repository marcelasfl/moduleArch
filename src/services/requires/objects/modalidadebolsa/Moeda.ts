import BaseModule from './BaseModule';
import type { BaseConfig } from '../BaseConfig';

class Moeda extends BaseModule{
    constructor(config: BaseConfig) {
        super('moeda', config);
    };
};

export default Moeda;