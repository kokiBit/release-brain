class Mutations::CreateUserMutation < Mutations::BaseMutation
  null false

  argument :name, String, required: false
  argument :email, String, required: false

  field :user, Types::UserType, null: false
  field :errors, [String], null: false

  def resolve(name:, email:)
    # user = User.last
    user = User.new
    user.name = name
    user.email = email
    user.save!
    { user: User.last }
  end
end
