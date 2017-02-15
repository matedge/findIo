class UsersController < ApplicationController

  before_action :authenticate_user!
  def index
   @challenges = Challenge.all.group_by(&:locations)
  end
end
