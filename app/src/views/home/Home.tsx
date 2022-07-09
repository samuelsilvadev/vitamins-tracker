import { List, Spinner, Text } from "@wonderflow/react-components";
import SearchForm from "components/search-form/SearchForm";
import { InfiniteData, useInfiniteQuery } from "react-query";
import styles from "./Home.module.css";

function cx(...classNames: string[]) {
  return classNames.join(" ");
}

async function fetchFoodsPaginated({ page = 1 }) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_BASE_PATH + "/foods?pagination[page]=" + page,
      { method: "GET" }
    );
    const parsedResponse = await response.json();

    return parsedResponse;
  } catch (error) {
    const safeError = error as Error;

    throw safeError;
  }
}

type Food = { id: string; attributes: { name: string } };

type FoodsPaginatedResponse = {
  data: Food[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
};

type FoodCardProps = { id: string; name: string };

function FoodCard({ id, name }: FoodCardProps) {
  return (
    <article>
      {id} - {name}
    </article>
  );
}

type FoodsListProps = {
  foods: Food[];
};

function FoodsList({ foods }: FoodsListProps) {
  return (
    <List>
      {foods.map(({ id, attributes: { name } }) => (
        <List.Li key={id}>
          <FoodCard id={id} name={name} />
        </List.Li>
      ))}
    </List>
  );
}

const foodsKeyFactory = {
  infiniteFoods: ["infiniteFoods"] as const,
};

type HomeContentManagementProps = {
  isLoading: boolean;
  error: Error | null;
  data: InfiniteData<FoodsPaginatedResponse> | undefined;
};

function HomeContentManagement({
  isLoading,
  error,
  data,
}: HomeContentManagementProps) {
  if (isLoading) {
    return (
      <div
        className={cx(
          styles.homeContentManagementLoadingWrapper,
          styles.homeContentManagementWrapper
        )}
      >
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cx(
          styles.homeContentManagementErrorWrapper,
          styles.homeContentManagementWrapper
        )}
      >
        <Text role="alert" as="p" sentiment="danger">
          {error.message}.
        </Text>
        <Text role="alert" as="p" sentiment="danger">
          Please try again later.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.homeContentManagementWrapper}>
      {data?.pages.map((page) => {
        const hasData = (page.data?.length ?? 0) > 0;

        if (!hasData) {
          return null;
        }

        const {
          data: foods,
          meta: {
            pagination: { page: pageNumber },
          },
        } = page;

        return <FoodsList key={pageNumber} foods={foods} />;
      }) ?? null}
    </div>
  );
}

function Home() {
  const { isLoading, data, error } = useInfiniteQuery<
    FoodsPaginatedResponse,
    Error
  >(
    foodsKeyFactory.infiniteFoods,
    ({ pageParam = 1 }) => fetchFoodsPaginated({ page: pageParam }),
    { retry: false }
  );

  return (
    <>
      <SearchForm />
      <HomeContentManagement isLoading={isLoading} error={error} data={data} />
    </>
  );
}

export default Home;
