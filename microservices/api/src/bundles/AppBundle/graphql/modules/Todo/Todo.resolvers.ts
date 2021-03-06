import * as X from "@bluelibs/x-bundle";
import { IResolverMap } from "@bluelibs/graphql-bundle";
import { TodoInsertInput, TodoUpdateInput } from "../../../services/inputs";
import { TodoCollection } from "../../../collections/Todo/Todo.collection";

const TodoInsertOne = [
  X.ToModel(TodoUpdateInput, { field: "document" }),
  X.ToDocumentInsert(TodoCollection, "document", async (document, ctx) => {
    document.UserId = ctx.userId
    X.Validate({ field: "document" });
  }),
  X.ToNovaByResultID(TodoCollection),
];

const TodoUpdateOne = [
  X.ToModel(TodoUpdateInput, { field: "document" }),
  X.CheckDocumentExists(TodoCollection),
  X.Secure.IsUser(TodoCollection,"UserId", "_id"),
  async (_, args, ctx) => {
    const { container } = ctx;
    const collection = container.get(TodoCollection);
    const data = await collection.findOne({_id:args._id})
    // this way it wont work 
    //X.Secure.IsUser(TodoCollection,"UserId", "_id"),
    // Working
  // if(String(data.UserId) != String(ctx.userId)) throw("Not the owner")
    args.document.UserId = ctx.userId;
    return await collection.updateOne(
      { _id: args._id },
      {
        $set: args.document
      })
  },
];

export default {

  Query: [
    [],
    {
      TodoFindOne: [X.ToNovaOne(TodoCollection)],
      TodoFind: [X.ToNova(TodoCollection, async (_, args, ctx, info) => {
        console.log(ctx.userId)
        return {
          filters: {
            UserId:ctx.userId
          },
          options: {},
        };
      })],
      TodoCount: [X.ToCollectionCount(TodoCollection)],
    },
  ],
  Mutation: [
    [],
    {
      TodoInsertOne,
      TodoUpdateOne,
      TodoDeleteOne: [
        X.CheckDocumentExists(TodoCollection),
        X.ToDocumentDeleteByID(TodoCollection),
      ],
    },
  ],
  Subscription: {
    TodoSubscription: {
      resolve: (payload) => payload,
      subscribe: [X.ToSubscription(TodoCollection)],
    },
    TodoSubscriptionCount: {
      resolve: (payload) => payload,
      subscribe: [X.ToSubscriptionCount(TodoCollection)],
    },
  },
} as IResolverMap;
