class Api::WordSentenceModel
    include ActiveModel::API

    attr_accessor :form, :word, :sentences
end