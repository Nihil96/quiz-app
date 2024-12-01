import { gql } from "@apollo/client"

export const GET_COUNTRIES = gql`
  query GetCountries {
    countris {
      name
      capital
      continent {
        name
      }
      languages {
        name
      }
    }
  }
`
