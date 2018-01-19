import gql from 'graphql-tag';

export const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
    inviteTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export const createTeamMutation = gql`
  mutation ($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;
