import {
  newSmart,
  useRouter,
  useUIComponents,
  useTranslate,
  useData,
} from "@bluelibs/x-ui";
import {  useState, useMemo } from "react";
import { TodoAntTableSmart } from "./TodoTableSmart";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import * as Ant from "antd";
import { Routes } from "@bundles/UIAppBundle";
import { features } from "../../config/features";
import { TodoListFilters } from "./TodoListFilters";
import {  TodoCollection } from "@bundles/UIAppBundle/collections";
import { DragDropTodoList } from "./DragDropTodoList";

export function TodoList() {
  const UIComponents = useUIComponents();
  const router = useRouter();
  const t = useTranslate();
  const [api, Provider] = newSmart(TodoAntTableSmart);
  const [filtersOpened, setFiltersOpened] = useState(false);
  const onFiltersUpdate = useMemo(() => {
    return (filters) => {
      api.setFlexibleFilters(filters);
    };
  }, []);
  const { data: TodoData, error, isLoading } = useData(TodoCollection, {
  }, {
    _id: 1,
    done: 1,
    titel: 1,
  })
  const state2 = TodoData
  
  return (
    <div className="page-todo-list">
      <UIComponents.AdminLayout>
        <Ant.PageHeader
          title={t("management.todo.list.header")}
          extra={[
            features.create ? (
              <Ant.Button
                key="1"
                onClick={() => router.go(Routes.TODO_CREATE)}
                icon={<PlusOutlined />}
              >
                {t("management.todo.list.create_btn")}
              </Ant.Button>
            ) : null,
          ]}
        />

        {api.state.isError && (
          <Ant.Alert type="error" message={t("generics.error_message")} />
        )}

        <Ant.Layout.Content>
          <Provider>

            <DragDropTodoList state1={state2}></DragDropTodoList>

            <Ant.PageHeader
              title="Default todo list"
              extra={[
                <Ant.Button
                  key="2"
                  onClick={() => setFiltersOpened(!filtersOpened)}
                  icon={<FilterOutlined />}
                >
                  {t("generics.list_filters")}
                </Ant.Button>,
              ]}
            />
                        {filtersOpened && <TodoListFilters onUpdate={onFiltersUpdate} />}

            <Ant.Table {...api.getTableProps()} />

          </Provider>
        </Ant.Layout.Content>
      </UIComponents.AdminLayout>
    </div>
  );
}

