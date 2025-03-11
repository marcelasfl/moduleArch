import BaseRoute from './BaseRoute';
import type { BaseConfig } from './BaseConfig';

class Login extends BaseRoute{
    constructor(config: BaseConfig) {
        super('', 'auth', config);
    };
};

export default Login;