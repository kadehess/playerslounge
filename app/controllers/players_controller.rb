class PlayersController < ApplicationController
  def index
    players = Playerlist.order("created_at DESC")
    render json: players
  end

  def create
    playerlist = Playerlist.create(playerlist_param)
    render json: playerlist
  end

  def update
    playerlist = Playerlist.find(params[:id])
    playerlist.update_attributes(playerlist_param)
    render json: playerlist
  end

  def destroy
    playerlist = Playerlist.find(params[:id])
    playerlist.destroy
    head :no_content, status: :ok
  end
  
  private
    def playerlist_param
      params.require(:playerlist).permit(:title, :done)
    end
end