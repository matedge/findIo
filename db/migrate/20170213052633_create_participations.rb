class CreateParticipations < ActiveRecord::Migration
  def change
    create_table :participations do |t|
      t.integer :user_id
      t.integer :location_id
      t.integer :challenge_id

      t.timestamps null: false
    end
  end
end
