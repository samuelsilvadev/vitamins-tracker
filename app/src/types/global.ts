export type ImageFormat = {
  ext: string;
  hash: string;
  height: number;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  url: string;
  width: number;
};

export type Image = {
  attributes: Omit<ImageFormat, "path"> & {
    alternativeText: string;
    caption: string;
    createdAt: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: string | null;
    size: number;
    updatedAt: string;
    formats: Record<string, ImageFormat>;
  };
};

export type Food = {
  id: string;
  attributes: {
    name: string;
    images: {
      data: Image[];
    };
    vitamins: {
      data: Vitamin[];
    };
  };
};

export type Vitamin = {
  attributes: {
    createdAt: string;
    description: string | null;
    locale: string;
    name: string;
    publishedAt: string;
    updatedAt: string;
  };
  id: number;
};
