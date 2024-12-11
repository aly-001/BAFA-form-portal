declare const CreateApiToken: {
    readonly formData: {
        readonly type: "object";
        readonly properties: {
            readonly app_name: {
                readonly type: "string";
                readonly description: "The name of your app. Every API-Token has a name to identify the purpose. The name of the app must be unique for every base.";
                readonly examples: readonly ["My App"];
            };
            readonly permission: {
                readonly type: "string";
                readonly description: "- rw for read-write \n- r for read-only\n\nDefault: ``";
                readonly enum: readonly ["", "rw", "r"];
            };
        };
        readonly required: readonly ["app_name", "permission"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly examples: readonly [127];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The id of the workspace. For an explanation how to get the *workspace_id*, check out this [help-article](https://seatable.io/docs/arbeiten-mit-gruppen/workspace-id-einer-gruppe-ermitteln/?lang=auto). \nAlternatively the API endpoint [get metadata](/reference/getmetadata) can be used.\n";
                };
                readonly base_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My Projects"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your base.";
                };
            };
            readonly required: readonly ["workspace_id", "base_name"];
        }];
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly description: "api-token return object";
            readonly properties: {
                readonly app_name: {
                    readonly type: "string";
                    readonly examples: readonly ["Example"];
                };
                readonly api_token: {
                    readonly type: "string";
                    readonly minLength: 40;
                    readonly maxLength: 40;
                    readonly examples: readonly ["1234567f17157cd6c41fdb202813f8d9a9fi3yr7"];
                };
                readonly generated_by: {
                    readonly type: "string";
                    readonly format: "email";
                    readonly examples: readonly ["1234566569491ba42905bf1647fd3f@auth.local"];
                };
                readonly generated_at: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly examples: readonly ["2021-03-02T09:47:41+00:00"];
                };
                readonly last_access: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly examples: readonly ["2021-03-02T09:47:41+00:00"];
                };
                readonly permission: {
                    readonly type: "string";
                    readonly enum: readonly ["", "rw", "r"];
                    readonly examples: readonly ["rw"];
                    readonly description: "`rw` `r`";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const CreateTempApiToken: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly examples: readonly [127];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The id of the workspace. For an explanation how to get the *workspace_id*, check out this [help-article](https://seatable.io/docs/arbeiten-mit-gruppen/workspace-id-einer-gruppe-ermitteln/?lang=auto). \nAlternatively the API endpoint [get metadata](/reference/getmetadata) can be used.\n";
                };
                readonly base_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My Projects"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your base.";
                };
            };
            readonly required: readonly ["workspace_id", "base_name"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "Temporary Api-Token, valid only for one hour";
            readonly properties: {
                readonly api_token: {
                    readonly type: "string";
                    readonly examples: readonly ["1234567iOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjhjYjJhNmRhNjU2OTQ5MWJhNDI5M1234567NDdmZDNmQGF1dGgubG9jYWwiLCJkdGFibGVfdXVpZCI6IjY1MGQ4YTBkLTdlMjctNDZhOC04YjE4LTZjYzZmM2RiMjA1NyIsImV4cCI6MTYxNDY4MjEyNi43ODY5MDE3fQ.FjRR-yur8lb0peiwD-h7j_gF97WXp17LS_n1HXipzKM"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DeleteApiToken: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly examples: readonly [127];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The id of the workspace. For an explanation how to get the *workspace_id*, check out this [help-article](https://seatable.io/docs/arbeiten-mit-gruppen/workspace-id-einer-gruppe-ermitteln/?lang=auto). \nAlternatively the API endpoint [get metadata](/reference/getmetadata) can be used.\n";
                };
                readonly base_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My Projects"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your base.";
                };
                readonly app_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My App"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your app. Every API-Token has a name to identify the purpose. The name of the app must be unique for every base.";
                };
            };
            readonly required: readonly ["workspace_id", "base_name", "app_name"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly additionalProperties: true;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAccountTokenfromUsername: {
    readonly formData: {
        readonly type: "object";
        readonly properties: {
            readonly username: {
                readonly type: "string";
                readonly description: "Your email address";
            };
            readonly password: {
                readonly type: "string";
                readonly description: "Your password";
            };
        };
        readonly required: readonly ["username", "password"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly "X-SEAFILE-OTP": {
                    readonly type: "string";
                    readonly pattern: "^\\d{6}$";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Two-factor token (usually generated with a mobile app like the google authenticator), optional, only needed if 2FA is activated for your account.\n";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "account-token ...";
            readonly properties: {
                readonly token: {
                    readonly type: "string";
                    readonly minLength: 40;
                    readonly maxLength: 40;
                    readonly examples: readonly ["25285a3da6fff1f7a6f9c9abc8da12dcd2bd4470"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBaseTokenWithAccountToken: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly examples: readonly [127];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The id of the workspace. For an explanation how to get the *workspace_id*, check out this [help-article](https://seatable.io/docs/arbeiten-mit-gruppen/workspace-id-einer-gruppe-ermitteln/?lang=auto). \nAlternatively the API endpoint [get metadata](/reference/getmetadata) can be used.\n";
                };
                readonly base_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My Projects"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your base.";
                };
            };
            readonly required: readonly ["workspace_id", "base_name"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "blub";
            readonly properties: {
                readonly app_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My App"];
                };
                readonly access_token: {
                    readonly type: "string";
                    readonly examples: readonly ["eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTQzNTI1OTQsImR0YWJsZV91dWlkIjoiNjUwZDhhMGQtN2UyNy00NmE4LThiMTgtNmNjNmYzZGIyMDU3IiwidXNlcm5hbWUiOiIiLCJwZXJtaXNzaW9uIjoicnciLCJhcHBfbmFtZSI6InBvc3RtYW4ifQ.4aTmvBfFElyB3xg5jjF7zWCiyRZI17SZD980GdHT6e3"];
                };
                readonly dtable_uuid: {
                    readonly type: "string";
                    readonly format: "uuid";
                    readonly examples: readonly ["650d8a0d-7e27-46a8-8b18-6cc6f384ufy4"];
                };
                readonly dtable_server: {
                    readonly type: "string";
                    readonly format: "url";
                    readonly examples: readonly ["https://cloud.seatable.io/dtable-server/"];
                };
                readonly dtable_socket: {
                    readonly type: "string";
                    readonly format: "url";
                    readonly examples: readonly ["https://cloud.seatable.io/"];
                };
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly examples: readonly [127];
                };
                readonly dtable_name: {
                    readonly type: "string";
                    readonly examples: readonly ["Test Base"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "404": {
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBaseTokenWithApiToken: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly additionalProperties: true;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly additionalProperties: true;
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBaseTokenWithExternLink: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly external_link_token: {
                    readonly type: "string";
                    readonly examples: readonly ["c41cef71f5094827a786"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The random string from the external link. Eg: \n- If the external link is https://cloud.seatable.io/dtable/external-links/c41cef71f5094827a786, the link token is *c41cef71f5094827a786*.\n- If the external link is a custom link like https://cloud.seatable.io/dtable/external-links/custom/my-personal-link, the link token is only *my-personal-link*.\n";
                };
            };
            readonly required: readonly ["external_link_token"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "blub";
            readonly properties: {
                readonly app_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My App"];
                };
                readonly access_token: {
                    readonly type: "string";
                    readonly examples: readonly ["eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTQzNTI1OTQsImR0YWJsZV91dWlkIjoiNjUwZDhhMGQtN2UyNy00NmE4LThiMTgtNmNjNmYzZGIyMDU3IiwidXNlcm5hbWUiOiIiLCJwZXJtaXNzaW9uIjoicnciLCJhcHBfbmFtZSI6InBvc3RtYW4ifQ.4aTmvBfFElyB3xg5jjF7zWCiyRZI17SZD980GdHT6e3"];
                };
                readonly dtable_uuid: {
                    readonly type: "string";
                    readonly format: "uuid";
                    readonly examples: readonly ["650d8a0d-7e27-46a8-8b18-6cc6f384ufy4"];
                };
                readonly dtable_server: {
                    readonly type: "string";
                    readonly format: "url";
                    readonly examples: readonly ["https://cloud.seatable.io/dtable-server/"];
                };
                readonly dtable_socket: {
                    readonly type: "string";
                    readonly format: "url";
                    readonly examples: readonly ["https://cloud.seatable.io/"];
                };
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly examples: readonly [127];
                };
                readonly dtable_name: {
                    readonly type: "string";
                    readonly examples: readonly ["Test Base"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ListApiTokens: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly examples: readonly [127];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The id of the workspace. For an explanation how to get the *workspace_id*, check out this [help-article](https://seatable.io/docs/arbeiten-mit-gruppen/workspace-id-einer-gruppe-ermitteln/?lang=auto). \nAlternatively the API endpoint [get metadata](/reference/getmetadata) can be used.\n";
                };
                readonly base_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My Projects"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your base.";
                };
            };
            readonly required: readonly ["workspace_id", "base_name"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "...";
            readonly properties: {
                readonly api_tokens: {
                    readonly items: {
                        readonly type: "object";
                        readonly description: "api-token return object";
                        readonly properties: {
                            readonly app_name: {
                                readonly type: "string";
                                readonly examples: readonly ["Example"];
                            };
                            readonly api_token: {
                                readonly type: "string";
                                readonly minLength: 40;
                                readonly maxLength: 40;
                                readonly examples: readonly ["1234567f17157cd6c41fdb202813f8d9a9fi3yr7"];
                            };
                            readonly generated_by: {
                                readonly type: "string";
                                readonly format: "email";
                                readonly examples: readonly ["1234566569491ba42905bf1647fd3f@auth.local"];
                            };
                            readonly generated_at: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly examples: readonly ["2021-03-02T09:47:41+00:00"];
                            };
                            readonly last_access: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly examples: readonly ["2021-03-02T09:47:41+00:00"];
                            };
                            readonly permission: {
                                readonly type: "string";
                                readonly enum: readonly ["", "rw", "r"];
                                readonly examples: readonly ["rw"];
                                readonly description: "`rw` `r`";
                            };
                        };
                    };
                    readonly type: "array";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const UpdateApiToken: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly permission: {
                readonly type: "string";
                readonly description: "- rw for read-write \n- r for read-only\n\nDefault: ``";
                readonly enum: readonly ["", "rw", "r"];
            };
        };
        readonly required: readonly ["permission"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly workspace_id: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly examples: readonly [127];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The id of the workspace. For an explanation how to get the *workspace_id*, check out this [help-article](https://seatable.io/docs/arbeiten-mit-gruppen/workspace-id-einer-gruppe-ermitteln/?lang=auto). \nAlternatively the API endpoint [get metadata](/reference/getmetadata) can be used.\n";
                };
                readonly base_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My Projects"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your base.";
                };
                readonly app_name: {
                    readonly type: "string";
                    readonly examples: readonly ["My App"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The name of your app. Every API-Token has a name to identify the purpose. The name of the app must be unique for every base.";
                };
            };
            readonly required: readonly ["workspace_id", "base_name", "app_name"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "api-token return object";
            readonly properties: {
                readonly app_name: {
                    readonly type: "string";
                    readonly examples: readonly ["Example"];
                };
                readonly api_token: {
                    readonly type: "string";
                    readonly minLength: 40;
                    readonly maxLength: 40;
                    readonly examples: readonly ["1234567f17157cd6c41fdb202813f8d9a9fi3yr7"];
                };
                readonly generated_by: {
                    readonly type: "string";
                    readonly format: "email";
                    readonly examples: readonly ["1234566569491ba42905bf1647fd3f@auth.local"];
                };
                readonly generated_at: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly examples: readonly ["2021-03-02T09:47:41+00:00"];
                };
                readonly last_access: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly examples: readonly ["2021-03-02T09:47:41+00:00"];
                };
                readonly permission: {
                    readonly type: "string";
                    readonly enum: readonly ["", "rw", "r"];
                    readonly examples: readonly ["rw"];
                    readonly description: "`rw` `r`";
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { CreateApiToken, CreateTempApiToken, DeleteApiToken, GetAccountTokenfromUsername, GetBaseTokenWithAccountToken, GetBaseTokenWithApiToken, GetBaseTokenWithExternLink, ListApiTokens, UpdateApiToken };
