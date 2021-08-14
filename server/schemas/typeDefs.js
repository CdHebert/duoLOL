//import gql
const { gql } = require('apollo-server-express');

//create typeDefs
const typeDefs = gql`
    type User {
        _id: ID 
        email: String
        password: String
        rank: String
        tier: String
        wins: String
        losses: String
        sumName: String
        primRole: String
        sideRole: String
        riotId: String
        puuid: String
        friendCount: Int
        builds:[Build]
        friends: [User]
    }

    type Build {
        _id: ID
        title: String
        champion: String
        boots: String
        mythic: String
        item3: String
        item4: String
        item5: String
        item6: String
    }
    type ChampionSummary {
        name: String
        icon: Image
        blurb: String
    }
    type Image {
        name: String
        url: String
    }
    type Spell {
        name: String
        description: String
        icon: Image
    }
    type Passive {
        name: String
        description: String
        icon: Image
    }
    type Champion {
        name: String!
        title: String
        images:[Image]
        lore: String
        tags: [String]
        abilities: [Spell]
        passive: Passive
        allytips: [String]
        enemytips: [String]
    }
    type Query {
        me: User
        user(email: String!): User
        build(_id: ID!): Build
        champions(patch: String): [ChampionSummary]
        champion(name: String!): Champion
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(content: userInfo!): Auth
        addBuild(content: buildInfo!): Build
        addFriend(friendId: ID!): User
    }

    input buildInfo {
        title: String
        champion: String
        boots: String
        mythic: String
        item3: String
        item4: String
        item5: String
        item6: String
    }

    input userInfo {
        email: String
        password: String
        rank: String
        tier: String
        sumName: String
        primRole: String
        sideRole: String
        riotId: String
        puuid: String
    }

    type Auth {
        token: ID!
        user: User
    }

`;

module.exports = typeDefs;

