class Location < ActiveRecord::Base
  has_and_belongs_to_many :challenges
  has_many :participations
end
