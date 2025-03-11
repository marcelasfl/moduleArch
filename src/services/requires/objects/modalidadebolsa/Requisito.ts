import BaseModule from './BaseModule';
import type { BaseConfig } from '../BaseConfig';

class Requisito extends BaseModule{
    constructor(config: BaseConfig) {
        super('requisitobolsa', config);
    };
};

export default Requisito;