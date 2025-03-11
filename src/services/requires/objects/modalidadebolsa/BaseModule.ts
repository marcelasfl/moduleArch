import BaseRoute from '../BaseRoute';
import type { BaseConfig } from '../BaseConfig';

class BaseModule extends BaseRoute{
    constructor(entityName: string, config: BaseConfig) {
        super('modalidadebolsa', entityName, config);
    };
};

export default BaseModule;