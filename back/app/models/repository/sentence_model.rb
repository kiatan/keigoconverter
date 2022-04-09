class Repository::SentenceModel
    include ActiveModel::API
  
    attr_accessor :word, :sentence_en, :sentence_jp
end

