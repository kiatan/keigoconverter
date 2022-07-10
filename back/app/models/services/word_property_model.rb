class Services::WordPropertyModel
    include ActiveModel::API
  
    attr_accessor :surface, :type, :plain_form, :pronunciation
end

