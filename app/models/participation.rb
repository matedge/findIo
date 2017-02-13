class Participation < ActiveRecord::Base
  belongs_to :user
  belongs_to :challenge
  belongs_to :location

end
