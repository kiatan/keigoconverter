Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'keigo_dictionaries/:word' => 'keigo_dictionaries#show'
    end
  end
end