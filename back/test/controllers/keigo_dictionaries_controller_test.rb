require "test_helper"

class KeigoDictionariesControllerTest < ActionDispatch::IntegrationTest
  test "should get get_keigo_dictionaries" do
    get keigo_dictionaries_get_keigo_dictionaries_url
    assert_response :success
  end
end
