import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
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
    auth(...values: string[] | number[]): this;
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
    server(url: string, variables?: {}): void;
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
    getAccountTokenfromUsername(body: types.GetAccountTokenfromUsernameFormDataParam, metadata?: types.GetAccountTokenfromUsernameMetadataParam): Promise<FetchResponse<200, types.GetAccountTokenfromUsernameResponse200>>;
    /**
     * List all *API-Tokens* of a base with additional informations like permission, generation
     * date and last access time.
     *
     *
     * @summary List API-Tokens
     */
    listApiTokens(metadata: types.ListApiTokensMetadataParam): Promise<FetchResponse<200, types.ListApiTokensResponse200>>;
    /**
     * Create an *API-Token* for a base.
     *
     *
     * @summary Create API-Token
     */
    createApiToken(body: types.CreateApiTokenFormDataParam, metadata: types.CreateApiTokenMetadataParam): Promise<FetchResponse<201, types.CreateApiTokenResponse201>>;
    /**
     * Create a *temporary API-Token* for a base that expires after one hour.
     *
     * @summary Create API-Token (temporary)
     */
    createTempApiToken(metadata: types.CreateTempApiTokenMetadataParam): Promise<FetchResponse<200, types.CreateTempApiTokenResponse200>>;
    /**
     * Update the permission of an existing *API-Token*.
     *
     * @summary Update API-Token
     */
    updateApiToken(body: types.UpdateApiTokenBodyParam, metadata: types.UpdateApiTokenMetadataParam): Promise<FetchResponse<200, types.UpdateApiTokenResponse200>>;
    /**
     * Delete one specific API token from a base. The token is identified by his *app_name*.
     *
     * @summary Delete API-Token
     */
    deleteApiToken(metadata: types.DeleteApiTokenMetadataParam): Promise<FetchResponse<200, types.DeleteApiTokenResponse200>>;
    /**
     * Generate a Base-Token with an API-Token. The API-Token grants either read or write
     * permission to this base, depending of the permission of the API-Token.
     *
     * @summary Get Base-Token with API-Token
     * @throws FetchError<403, types.GetBaseTokenWithApiTokenResponse403> Forbidden
     */
    getBaseTokenWithApiToken(): Promise<FetchResponse<200, types.GetBaseTokenWithApiTokenResponse200>>;
    /**
     * Generate a Base-Token using the user's Account-Token. The read/write permission depends
     * on the user's access permissions to the base.
     *
     * @summary Get Base-Token with Account-Token
     * @throws FetchError<401, types.GetBaseTokenWithAccountTokenResponse401> Forbidden
     * @throws FetchError<404, types.GetBaseTokenWithAccountTokenResponse404> Not found
     */
    getBaseTokenWithAccountToken(metadata: types.GetBaseTokenWithAccountTokenMetadataParam): Promise<FetchResponse<200, types.GetBaseTokenWithAccountTokenResponse200>>;
    /**
     * Generate a Base-Token from an external link to this base. Because external links always
     * grant read-only permissions, the Base-Token generated from a external link will only
     * grant read permissions to the base.
     *
     * @summary Get Base-Token with External-Link
     */
    getBaseTokenWithExternLink(metadata: types.GetBaseTokenWithExternLinkMetadataParam): Promise<FetchResponse<200, types.GetBaseTokenWithExternLinkResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
