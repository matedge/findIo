class CreateChallengesLocations < ActiveRecord::Migration
  def change
    create_table :challenges_locations do |t|
      t.integer :location_id
      t.integer :challenge_id
    end
  end
end
