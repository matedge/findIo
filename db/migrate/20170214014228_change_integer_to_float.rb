class ChangeIntegerToFloat < ActiveRecord::Migration
  def change
    change_column :locations, :latitude, :float
    change_column :locations, :longtitude, :float
  end
end
