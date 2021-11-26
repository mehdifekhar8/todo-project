import {
  newSmart,
  useRouter,
  useUIComponents,
  useTranslate,
} from "@bluelibs/x-ui";
import { useEffect, useState, useMemo } from "react";
import { UsersAntTableSmart } from "./UsersTableSmart";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import * as Ant from "antd";
import { Routes } from "@bundles/UIAppBundle";
import { features } from "../../config/features";
import { UsersListFilters } from "./UsersListFilters";

export function UsersList() {
  const UIComponents = useUIComponents();
  const router = useRouter();
  const t = useTranslate();
  const [api, Provider] = newSmart(UsersAntTableSmart);
  const [filtersOpened, setFiltersOpened] = useState(false);
  const onFiltersUpdate = useMemo(() => {
    return (filters) => {
      api.setFlexibleFilters(filters);
    };
  }, []);

  return (
    <div className="page-users-list">
      <UIComponents.AdminLayout  >
        <Ant.PageHeader
          className="page-users-list"

          title={t("management.users.list.header")}
          extra={[
            features.create ? (
              <Ant.Button
                className="page-users-list"
                key="1"
                onClick={() => router.go(Routes.USERS_CREATE)}
                icon={<PlusOutlined />}
              >
                {t("management.users.list.create_btn")}
              </Ant.Button>
            ) : null,
            <Ant.Button
              key="2"
              onClick={() => setFiltersOpened(!filtersOpened)}
              icon={<FilterOutlined />}
            >
              {t("generics.list_filters")}
            </Ant.Button>,
          ]}
        />

        {api.state.isError && (
          <Ant.Alert type="error" message={t("generics.error_message")} />
        )}

        <Ant.Layout.Content   className="page-users-list">
          <Provider >

            {filtersOpened && <UsersListFilters onUpdate={onFiltersUpdate} />}
            <Ant.Input
              name="Search"
              placeholder={t("generics.list_search")}
              className="page-users-list"
              onKeyUp={(e) => {
                const value = (e.target as HTMLInputElement).value;
                api.setFilters({
                  // Customise your search filters!
                  title: new RegExp(`${value}`, "i"),
                });
              }}
            />
            <Ant.Table {...api.getTableProps()} />

          </Provider>
        </Ant.Layout.Content>
      </UIComponents.AdminLayout>
    </div>
  );
}
