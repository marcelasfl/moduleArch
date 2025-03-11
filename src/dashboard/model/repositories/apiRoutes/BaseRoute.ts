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
  
    get count(): string {
        return `${this.entity}?$count=true`;
    };

    get paginacao(): string {
        return `${this.entity}?$skip=${this.config.skip}`;
    };

    set paginacao(skip: number) {
        this.config.skip = skip;
    };

    get paginacaoToken(): string {
        return `${this.entity}?$skiptoken=${this.config.skipToken}`;
    };

    set paginacaoToken(skipToken: string) {
        this.config.skipToken = skipToken;
    };

    get expand(): string {
        return this.config.id
            ? `${this.entity}/${this.config.id}?$expand=${this.config.expand}`
            : `${this.entity}?$expand=${this.config.expand}`;
    };

    set expand(expand: string) {
        this.config.expand = expand;
    };

    get filtro(): string {
        return `${this.entity}?$filter=contains('${this.config.filterAttribute}','${this.config.filterValue}')`
    };

    set filtroAtributo(filterAttribute: string) {
        this.config.filterAttribute = filterAttribute;
    };

    set filtroValor(filterValue: string) {
        this.config.filterValue = filterValue;
    };
};

export default BaseRoute;