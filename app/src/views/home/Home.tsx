import { Spinner, Text, Button, Container } from "@wonderflow/react-components";
import FixedFooter from "components/fixed-footer/FixedFooter";
import SearchForm from "components/search-form/SearchForm";
import { useConsumedFood } from "context/ConsumedFood";
import { useState } from "react";
import { InfiniteData, useInfiniteQuery } from "react-query";
import { Link } from "react-router-dom";
import { Food, Image, Vitamin } from "types/global";
import styles from "./Home.module.css";

function cx(...classNames: string[]) {
  return classNames.join(" ");
}

async function fetchFoodsPaginated({ page = 1, foodName = "" }) {
  try {
    const filterByFoodNameQuery = foodName
      ? `&filters[name][$contains]=${foodName}`
      : "";

    const response = await fetch(
      process.env.REACT_APP_API_BASE_PATH +
        "/foods?populate[0]=images,vitamins&pagination[page]=" +
        page +
        filterByFoodNameQuery,
      { method: "GET" }
    );
    const parsedResponse = await response.json();

    return parsedResponse;
  } catch (error) {
    const safeError = error as Error;

    throw safeError;
  }
}

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

type FoodCardProps = {
  id: string;
  name: string;
  images: Image[];
  vitamins: Vitamin[];
  onConsume: () => void;
  quantity: number;
};

function extractAllImagesFormats(image?: Image) {
  if (!image) {
    return null;
  }

  const {
    attributes: { url, width, height, formats },
  } = image;
  const images = [{ url, width, height }];

  for (const formatKey in formats) {
    const {
      width: imageFormatWidth,
      height: imageFormatHeight,
      url: imageFormatUrl,
    } = formats[formatKey];

    images.push({
      url: imageFormatUrl,
      width: imageFormatWidth,
      height: imageFormatHeight,
    });
  }

  images.sort(
    (firstImage, secondImage) => firstImage.width - secondImage.width
  );

  return images;
}

const IMAGES_SIZES = ["320w", "640w", "1280w", "2560w"];

function FoodCard({
  id,
  name,
  images,
  vitamins,
  quantity,
  onConsume,
}: FoodCardProps) {
  const [firstImage] = images;
  const allFormatsFromFirstImage = extractAllImagesFormats(firstImage);

  return (
    <article className={styles.foodCard}>
      {quantity ? (
        <Text size={14} className={styles.foodCardConsumedFoodQuantity}>
          {quantity}
        </Text>
      ) : null}
      {firstImage && (
        <img
          className={styles.foodCardImage}
          srcSet={
            allFormatsFromFirstImage
              ?.map(
                ({ url }, index) =>
                  `${process.env.REACT_APP_MEDIA_BASE_PATH}${url} ${IMAGES_SIZES[index]}`
              )
              .join(", ") ?? ""
          }
          src={
            process.env.REACT_APP_MEDIA_BASE_PATH + firstImage.attributes.url
          }
          alt={firstImage.attributes.alternativeText}
          loading="lazy"
        />
      )}
      <Text as="h2">
        {id} - {name}
      </Text>
      {vitamins.length > 0 ? (
        <ul className={styles.vitaminsList}>
          {vitamins.map(
            ({ id: vitaminId, attributes: { name: vitaminName } }) => (
              <li key={vitaminId}>{vitaminName}</li>
            )
          )}
        </ul>
      ) : null}
      <Button
        fullWidth
        className={styles.foodCardConsumedButton}
        onClick={onConsume}
      >
        consumed today
      </Button>
    </article>
  );
}

type FoodsListProps = {
  foods: Food[];
};

function FoodsList({ foods }: FoodsListProps) {
  const { addConsumedFood, foods: consumedFoods } = useConsumedFood();

  return (
    <ul className={styles.foodList}>
      {foods.map((food) => {
        const {
          id,
          attributes: { name, images, vitamins },
        } = food;
        const consumedFood = consumedFoods.get(id);

        const handleOnConsumeFood = () => {
          addConsumedFood(food);
        };

        return (
          <li key={id}>
            <FoodCard
              id={id}
              name={name}
              images={images.data}
              vitamins={vitamins.data}
              onConsume={handleOnConsumeFood}
              quantity={consumedFood?.quantity ?? 0}
            />
          </li>
        );
      })}
    </ul>
  );
}

const foodsKeyFactory = {
  infiniteFoods: (searchTerm: string) => ["infiniteFoods", searchTerm] as const,
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
          styles.homeContentManagementErrorOrEmptyWrapper,
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

  const isEmpty = (data?.pages[0]?.data.length ?? 0) === 0;

  if (isEmpty) {
    return (
      <div
        className={cx(
          styles.homeContentManagementErrorOrEmptyWrapper,
          styles.homeContentManagementWrapper
        )}
      >
        <Text role="alert" as="p" sentiment="danger">
          No results were found
        </Text>
        <Text role="alert" as="p" sentiment="danger">
          Please try another term.
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
  const [foodNameSearchTerm, setFoodNameSearchTerm] = useState("");
  const { isLoading, data, error } = useInfiniteQuery<
    FoodsPaginatedResponse,
    Error
  >(
    foodsKeyFactory.infiniteFoods(foodNameSearchTerm),
    ({ pageParam = 1 }) =>
      fetchFoodsPaginated({ page: pageParam, foodName: foodNameSearchTerm }),
    { retry: false }
  );

  const handleOnSearch = (foodName: string) => {
    setFoodNameSearchTerm(foodName);
  };

  return (
    <Container padding={false} className={styles.homeWrapper}>
      <SearchForm onSearch={handleOnSearch} />
      <HomeContentManagement isLoading={isLoading} error={error} data={data} />
      <FixedFooter>
        <Button as={Link} to="/reports" kind="primary">
          Today's report
        </Button>
      </FixedFooter>
    </Container>
  );
}

export default Home;
