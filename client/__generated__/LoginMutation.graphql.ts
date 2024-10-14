/**
 * @generated SignedSource<<40b64215811be017d72f3685e9d3ec8a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoginMutation$variables = {
  password: string;
  username: string;
};
export type LoginMutation$data = {
  readonly login: {
    readonly accessToken: string;
    readonly user: {
      readonly username: string;
    };
  };
};
export type LoginMutation = {
  response: LoginMutation$data;
  variables: LoginMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "password"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "username"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "password",
            "variableName": "password"
          },
          {
            "kind": "Variable",
            "name": "username",
            "variableName": "username"
          }
        ],
        "kind": "ObjectValue",
        "name": "loginUserInput"
      }
    ],
    "concreteType": "LoginResponse",
    "kind": "LinkedField",
    "name": "login",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "username",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accessToken",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "LoginMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "LoginMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "0f9de797cb9b743410cd5810f3760aad",
    "id": null,
    "metadata": {},
    "name": "LoginMutation",
    "operationKind": "mutation",
    "text": "mutation LoginMutation(\n  $username: String!\n  $password: String!\n) {\n  login(loginUserInput: {username: $username, password: $password}) {\n    user {\n      username\n    }\n    accessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "43f0ddc30b3daea99dd3fde79f84bbb0";

export default node;
