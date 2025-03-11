import type { BaseConfig } from './BaseConfig';

class BaseRoute {
    protected config: BaseConfig;
    protected entityName: string;
    protected module: string;

    constructor(module: string, entityName: string, config: BaseConfig) {
        this.module = module;
        this.entityName = entityName;
        this.config = config;
    };

    get entity(): string {
        return `${this.module}/${this.entityName}`
    };

    get paginacao(): string {
        return `${this.module}/${this.entityName}?$skip=${this.config.skip}`;
    };

    set paginacao(skip: number) {
        this.config.skip = skip;
    };

    get paginacaoToken(): string {
        return `${this.module}/${this.entityName}?$skiptoken=${this.config.skipToken}`;
    };

    set paginacaoToken(skipToken: string) {
        this.config.skipToken = skipToken;
    };

    get count(): string {
        return `${this.module}/${this.entityName}?$count=true`;
    };

    get expand(): string {
        return this.config.id
            ? `${this.module}/${this.entityName}/${this.config.id}?$expand=${this.config.expand}`
            : `${this.module}/${this.entityName}?$expand=${this.config.expand}`;
    };

    set expand(expand: string) {
        this.config.expand = expand;
    };

    get filtro(): string {
        return `${this.module}/${this.entityName}?$filter=contains(Nome,'${this.config.filter}') or contains(Sigla,'${this.config.filter}')`;
    };

    set filtro(filter: string) {
        this.config.filter = filter;
    };
};

export default BaseRoute;