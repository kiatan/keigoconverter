class Api::SentenceModel
    include ActiveModel::API

    attr_accessor :word, :sentence_ja, :sentence_en
end