class Types::MutationType < Types::BaseObject
  field :createUserMutation, mutation: Mutations::CreateUserMutation
  field :uploadFileMutation, mutation: Mutations::UploadFileMutation
end
