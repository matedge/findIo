class Challenge < ActiveRecord::Base
  has_and_belongs_to_many :locations
  has_many :participations
end
