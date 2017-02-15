class AddImageToChallenge < ActiveRecord::Migration
  def change
    add_column :challenges, :image_url, :text
    remove_column :challenges, :status, :string
    remove_column :challenges, :user_id, :integer
  end
end
