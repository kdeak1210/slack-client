import gql from 'graphql-tag';

export const meQuery = gql`
  {
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
          dm
        }
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

export const teamMembersQuery = gql`
  query ($teamId: Int!) {
    teamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;
