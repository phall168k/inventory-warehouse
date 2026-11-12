import { SecuritySchemeObject } from "@nestjs/swagger";

export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_TITLE = 'Inventory Warehouse';
export const SWAGGER_DESCRIPTION = 'Inventory Warehouse';
export const SWAGGER_VERSION = '1.0.0';
export const SWAGGER_SERVER = 'v1';
export const SWAGGER_SITE_TITLE = 'Inventory Warehouse';
export const SWAGGER_TOKEN_NAME = 'access-token';
export const SWAGGER_AUTH_OPTIONS: SecuritySchemeObject = {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Enter your JWT access token',
}