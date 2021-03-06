import gql from 'graphql-tag';
import { Query } from '../Query/Query';

export const GET_CATEGORY_PRODUCTS = gql`
  query CategoryProducts($categoryId: Int!, $page: Int = 1) {
    category(id: $categoryId) {
      name
    }
    products(
      categoryId: $categoryId
      includeSubcategories: true
      query: { page: $page }
      sortOrders: [{ field: "name" }]
    ) {
      items {
        id
        name
        price
        thumbnail
        urlPath
      }
      pagination {
        currentPage
        totalItems
        nextPage
      }
    }
    sortOrders @client
  }
`;

export const fetchMore = (data: any, apolloFetchMore: any) =>
  apolloFetchMore({
    variables: {
      page: data.products.pagination.nextPage
    },
    updateQuery: (prev: any, { fetchMoreResult }: any) => {
      if (!fetchMoreResult) {
        return prev;
      }

      return {
        ...prev,
        ...{
          products: {
            ...prev.products,
            items: [...prev.products.items, ...fetchMoreResult.products.items],
            pagination: { ...fetchMoreResult.products.pagination }
          }
        }
      };
    }
  });

export class CategoryProductsQuery extends Query<any> {
  static defaultProps = {
    query: GET_CATEGORY_PRODUCTS,
    fetchMore,
    notifyOnNetworkStatusChange: true
  };
}
