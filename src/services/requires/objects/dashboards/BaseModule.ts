import type { BaseConfig } from '../BaseConfig';
import BaseRoute from '../BaseRoute';

class BaseModule extends BaseRoute{
    constructor(entityName: string, config: BaseConfig) {
        super('', entityName, config);
    };
};

export default BaseModule;