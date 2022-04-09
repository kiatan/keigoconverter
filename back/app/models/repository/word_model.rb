class Repository::WordModel
    include ActiveModel::API
  
    attr_accessor :sheet_row, :word_type, :word_form, :word_content, :meaning
end

