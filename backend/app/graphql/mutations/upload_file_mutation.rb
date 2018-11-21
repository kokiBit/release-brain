class Mutations::UploadFileMutation < Mutations::BaseMutation
  null false

  argument :avatar, ScalarTypes::ImageType, required: false
  field :user, Types::UserType, null: false
  field :errors, [String], null: false

  def resolve(avatar:)
    # user = User.last
    user = User.new
    user.name = "hoge"
    user.email = "fuga@fff.xom"
    user.avatar.attach(avatar)
    user.save!
    { user: user }
  end
end
