"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'seatable/5.1 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Generate an *Account-Token* with your username and password. This Account-Token is
     * necessary for all the following account operations.
     * Use the optional paramater if two-factor-authentication (2FA) is activated for your
     * account.
     *
     *
     * @summary Get Account-Token with Username and Password
     * @throws FetchError<400, types.GetAccountTokenfromUsernameResponse400> Forbidden
     */
    SDK.prototype.getAccountTokenfromUsername = function (body, metadata) {
        return this.core.fetch('/api2/auth-token/', 'post', body, metadata);
    };
    /**
     * List all *API-Tokens* of a base with additional informations like permission, generation
     * date and last access time.
     *
     *
     * @summary List API-Tokens
     */
    SDK.prototype.listApiTokens = function (metadata) {
        return this.core.fetch('/api/v2.1/workspace/{workspace_id}/dtable/{base_name}/api-tokens/', 'get', metadata);
    };
    /**
     * Create an *API-Token* for a base.
     *
     *
     * @summary Create API-Token
     */
    SDK.prototype.createApiToken = function (body, metadata) {
        return this.core.fetch('/api/v2.1/workspace/{workspace_id}/dtable/{base_name}/api-tokens/', 'post', body, metadata);
    };
    /**
     * Create a *temporary API-Token* for a base that expires after one hour.
     *
     * @summary Create API-Token (temporary)
     */
    SDK.prototype.createTempApiToken = function (metadata) {
        return this.core.fetch('/api/v2.1/workspace/{workspace_id}/dtable/{base_name}/temp-api-token/', 'get', metadata);
    };
    /**
     * Update the permission of an existing *API-Token*.
     *
     * @summary Update API-Token
     */
    SDK.prototype.updateApiToken = function (body, metadata) {
        return this.core.fetch('/api/v2.1/workspace/{workspace_id}/dtable/{base_name}/api-tokens/{app_name}/', 'put', body, metadata);
    };
    /**
     * Delete one specific API token from a base. The token is identified by his *app_name*.
     *
     * @summary Delete API-Token
     */
    SDK.prototype.deleteApiToken = function (metadata) {
        return this.core.fetch('/api/v2.1/workspace/{workspace_id}/dtable/{base_name}/api-tokens/{app_name}/', 'delete', metadata);
    };
    /**
     * Generate a Base-Token with an API-Token. The API-Token grants either read or write
     * permission to this base, depending of the permission of the API-Token.
     *
     * @summary Get Base-Token with API-Token
     * @throws FetchError<403, types.GetBaseTokenWithApiTokenResponse403> Forbidden
     */
    SDK.prototype.getBaseTokenWithApiToken = function () {
        return this.core.fetch('/api/v2.1/dtable/app-access-token/', 'get');
    };
    /**
     * Generate a Base-Token using the user's Account-Token. The read/write permission depends
     * on the user's access permissions to the base.
     *
     * @summary Get Base-Token with Account-Token
     * @throws FetchError<401, types.GetBaseTokenWithAccountTokenResponse401> Forbidden
     * @throws FetchError<404, types.GetBaseTokenWithAccountTokenResponse404> Not found
     */
    SDK.prototype.getBaseTokenWithAccountToken = function (metadata) {
        return this.core.fetch('/api/v2.1/workspace/{workspace_id}/dtable/{base_name}/access-token/', 'get', metadata);
    };
    /**
     * Generate a Base-Token from an external link to this base. Because external links always
     * grant read-only permissions, the Base-Token generated from a external link will only
     * grant read permissions to the base.
     *
     * @summary Get Base-Token with External-Link
     */
    SDK.prototype.getBaseTokenWithExternLink = function (metadata) {
        return this.core.fetch('/api/v2.1/external-link-tokens/{external_link_token}/access-token/', 'get', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
