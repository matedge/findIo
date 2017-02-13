class Challenge < ActiveRecord::Base
  has_and_belongs_to_many :locations
  STATUSES = ['started', 'in progress', 'finished']

end
