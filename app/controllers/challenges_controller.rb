class ChallengesController < ApplicationController

  before_action :authenticate_admin!

  def index
    @challenges = Challenge.all
  end

  def new
    @challenge = Challenge.new
  end

  def create
    @challenge = Challenge.new(challenge_params)

    if @challenge.save
      redirect_to challenges_path, notice: "Your challenge was created"
    else
      redirect_to new_challenge_path, notice: "Something went wrong"
    end
  end

  def edit
    @challenge = Challenge.find(params[:id])
  end

  def update
    @challenge = Challenge.find(params[:id])
    @challenge.update_attributes(challenge_params)

    if @challenge.save
      redirect_to challenges_path, notice: "Your challenge was updated"
    else
      redirect_to edit_challenge_path, notice: "Something went wrong"
    end
  end

  def destroy
    @challenge = Challenge.find(params[:id])
    @challenge.destroy

    redirect_to challenges_path, notice: "Your challenge was destroyed"
  end

  private

  def challenge_params
    params.require(:challenge).permit(:name, :status)
  end

end