/**
 * @generated SignedSource<<328e253fde30c0251ad8e5c5ccfd3a78>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SignupMutation$variables = {
  password: string;
  username: string;
};
export type SignupMutation$data = {
  readonly signup: {
    readonly accessToken: string;
    readonly user: {
      readonly username: string;
    };
  };
};
export type SignupMutation = {
  response: SignupMutation$data;
  variables: SignupMutation$variables;
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
        "name": "createUserInput"
      }
    ],
    "concreteType": "LoginResponse",
    "kind": "LinkedField",
    "name": "signup",
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
    "name": "SignupMutation",
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
    "name": "SignupMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "138991d28b235aa597144bef8ef47d2c",
    "id": null,
    "metadata": {},
    "name": "SignupMutation",
    "operationKind": "mutation",
    "text": "mutation SignupMutation(\n  $username: String!\n  $password: String!\n) {\n  signup(createUserInput: {username: $username, password: $password}) {\n    user {\n      username\n    }\n    accessToken\n  }\n}\n"
  }
};
})();

(node as any).hash = "e89f68780f7dbbd6254189e1277967c0";

export default node;
