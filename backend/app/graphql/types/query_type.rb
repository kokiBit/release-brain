class Types::QueryType < Types::BaseObject
  field :user_resolver, resolver: Resolvers::UserResolver
end
