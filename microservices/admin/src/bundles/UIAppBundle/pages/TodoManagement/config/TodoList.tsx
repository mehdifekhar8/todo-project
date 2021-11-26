import { Service } from "@bluelibs/core";
import { IComponents, XRouter, use, QueryBodyType } from "@bluelibs/x-ui";
import { XFormElementType, XList, XForm } from "@bluelibs/x-ui-admin";
import { Routes } from "@bundles/UIAppBundle";

import { Todo } from "@bundles/UIAppBundle/collections";
import { TodoList as BaseTodoList } from "./TodoList.base";

@Service({ transient: true })
export class TodoList extends BaseTodoList {
  build() {

    super.build();
    this.remove("User");

    const { t } = this.i18n;
    const { UIComponents, router } = this;
   
    // Perform additional modifications such as updating how a list item renders or add additional ones
  }

  static getRequestBody(): QueryBodyType<Todo> {
    // You have the ability to modify the request by adding certain fields or relations

      return {
      _id: 1,
      titel: 1,
      done: 1,
      User: {
        _id: 1,
        fullName: 1,
        email : 1 ,
      },
      UserId: 1,
    }
  }
}
