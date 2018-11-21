class ScalarTypes::ImageType < Types::BaseScalar
  graphql_name 'ImageType'
  description 'ActionDispatch::Http::UploadedFile'

  def coerce_input(file, _context)
    ActionDispatch::Http::UploadedFile.new(
      filename: file.original_filename,
      type: file.content_type,
      head: file.headers,
      tempfile: file.tempfile
    )
  end

  def coerce_result(value, _context)
    I18n.l(value, format: :default)
  end
end
