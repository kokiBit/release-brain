class ScalarTypes::ImageType < Types::BaseScalar
  graphql_name 'ImageType'
  description 'ActionDispatch::Http::UploadedFile'

  def coerce_input(action_dispatch_uploaded_file, _context)
    action_dispatch_uploaded_file
  end

  def coerce_result(value, _context)
    I18n.l(value, format: :default)
  end
end
